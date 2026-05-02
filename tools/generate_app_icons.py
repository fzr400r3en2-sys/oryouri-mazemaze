from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "assets" / "icons"


def icon_svg(size: int | None = None) -> str:
    attrs = 'viewBox="0 0 512 512"'
    if size:
        attrs = f'width="{size}" height="{size}" {attrs}'

    return f"""<svg xmlns="http://www.w3.org/2000/svg" {attrs}>
  <rect width="512" height="512" rx="112" fill="#fff7d6"/>
  <circle cx="256" cy="256" r="202" fill="#ffe28a"/>
  <ellipse cx="256" cy="334" rx="170" ry="42" fill="#d9eadf" opacity=".72"/>
  <path d="M132 218c0-54 248-54 248 0v82c0 62-248 62-248 0z" fill="#bfe5f2"/>
  <path d="M132 218c0 48 248 48 248 0" fill="none" stroke="#fffef7" stroke-width="28" stroke-linecap="round"/>
  <path d="M132 248c48 62 200 62 248 0v52c0 62-248 62-248 0z" fill="#91cee4"/>
  <path d="M132 300c0 62 248 62 248 0" fill="none" stroke="#5f534a" stroke-width="18" stroke-linecap="round"/>
  <circle cx="210" cy="208" r="34" fill="#ffd45f"/>
  <circle cx="260" cy="204" r="31" fill="#ef7288"/>
  <circle cx="310" cy="211" r="33" fill="#72c995"/>
  <path d="M170 218c32 28 140 34 186 2" fill="none" stroke="#fffdf7" stroke-width="12" stroke-linecap="round" opacity=".72"/>
  <path d="M342 186c16-30 42-38 58-28 18 11 10 38-16 48" fill="none" stroke="#65b987" stroke-width="18" stroke-linecap="round"/>
  <path d="M365 214h76" stroke="#b98552" stroke-width="26" stroke-linecap="round"/>
</svg>
"""


def blend(dst: tuple[int, int, int, int], src: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    sr, sg, sb, sa = src
    dr, dg, db, da = dst
    alpha = sa / 255
    inv = 1 - alpha
    out_a = int(sa + da * inv)
    if out_a == 0:
        return (0, 0, 0, 0)
    return (
        int(sr * alpha + dr * inv),
        int(sg * alpha + dg * inv),
        int(sb * alpha + db * inv),
        out_a,
    )


def draw_ellipse(
    pixels: list[list[tuple[int, int, int, int]]],
    bounds: tuple[float, float, float, float],
    color: tuple[int, int, int, int],
) -> None:
    left, top, right, bottom = bounds
    width = len(pixels[0])
    height = len(pixels)
    cx = (left + right) / 2
    cy = (top + bottom) / 2
    rx = max((right - left) / 2, 1)
    ry = max((bottom - top) / 2, 1)

    for y in range(max(0, int(top)), min(height, math.ceil(bottom))):
        for x in range(max(0, int(left)), min(width, math.ceil(right))):
            px = (x + 0.5 - cx) / rx
            py = (y + 0.5 - cy) / ry
            if px * px + py * py <= 1:
                pixels[y][x] = blend(pixels[y][x], color)


def draw_rounded_rect(
    pixels: list[list[tuple[int, int, int, int]]],
    bounds: tuple[float, float, float, float],
    radius: float,
    color: tuple[int, int, int, int],
) -> None:
    left, top, right, bottom = bounds
    width = len(pixels[0])
    height = len(pixels)
    for y in range(max(0, int(top)), min(height, math.ceil(bottom))):
        for x in range(max(0, int(left)), min(width, math.ceil(right))):
            dx = max(left + radius - (x + 0.5), 0, (x + 0.5) - (right - radius))
            dy = max(top + radius - (y + 0.5), 0, (y + 0.5) - (bottom - radius))
            if dx * dx + dy * dy <= radius * radius:
                pixels[y][x] = blend(pixels[y][x], color)


def write_png(path: Path, size: int) -> None:
    pixels = [[(255, 247, 214, 255) for _ in range(size)] for _ in range(size)]
    scale = size / 512

    def box(left: float, top: float, right: float, bottom: float) -> tuple[float, float, float, float]:
        return (left * scale, top * scale, right * scale, bottom * scale)

    draw_ellipse(pixels, box(54, 54, 458, 458), (255, 226, 138, 255))
    draw_ellipse(pixels, box(86, 292, 426, 376), (217, 234, 223, 180))
    draw_ellipse(pixels, box(126, 170, 386, 260), (255, 253, 247, 255))
    draw_ellipse(pixels, box(140, 186, 372, 248), (191, 229, 242, 255))
    draw_rounded_rect(pixels, box(132, 218, 380, 330), 38 * scale, (145, 206, 228, 255))
    draw_ellipse(pixels, box(132, 182, 380, 252), (191, 229, 242, 255))
    draw_ellipse(pixels, box(132, 188, 380, 248), (255, 253, 247, 130))
    draw_ellipse(pixels, box(176, 174, 244, 242), (255, 212, 95, 255))
    draw_ellipse(pixels, box(229, 173, 291, 235), (239, 114, 136, 255))
    draw_ellipse(pixels, box(277, 180, 343, 246), (114, 201, 149, 255))
    draw_ellipse(pixels, box(132, 278, 380, 342), (95, 83, 74, 255))
    draw_ellipse(pixels, box(148, 278, 364, 324), (145, 206, 228, 255))
    draw_rounded_rect(pixels, box(348, 202, 444, 230), 14 * scale, (185, 133, 82, 255))

    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b, a in row:
            raw.extend((r, g, b, a))

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), level=9))
    png += chunk(b"IEND", b"")
    path.write_bytes(png)


def write_ico(path: Path, png_path: Path) -> None:
    png = png_path.read_bytes()
    header = struct.pack("<HHH", 0, 1, 1)
    directory = struct.pack("<BBBBHHII", 32, 32, 0, 0, 1, 32, len(png), 22)
    path.write_bytes(header + directory + png)


def main() -> None:
    ICON_DIR.mkdir(parents=True, exist_ok=True)

    (ICON_DIR / "icon.svg").write_text(icon_svg(), encoding="utf-8", newline="\n")
    write_png(ICON_DIR / "favicon-32.png", 32)
    for size in (180, 192, 512):
        (ICON_DIR / f"icon-{size}.svg").write_text(icon_svg(size), encoding="utf-8", newline="\n")
        write_png(ICON_DIR / f"icon-{size}.png", size)

    (ICON_DIR / "apple-touch-icon.png").write_bytes((ICON_DIR / "icon-180.png").read_bytes())
    write_ico(ROOT / "favicon.ico", ICON_DIR / "favicon-32.png")
    print(f"generated app icons in {ICON_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
