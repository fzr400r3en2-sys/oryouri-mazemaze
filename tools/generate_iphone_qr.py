from __future__ import annotations

import argparse
import html
from pathlib import Path

from resolve_public_url import resolve_public_url


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SVG = ROOT / "iphone-qr.svg"
DEFAULT_HTML = ROOT / "iphone-qr.html"

VERSION = 5
SIZE = VERSION * 4 + 17
DATA_CODEWORDS = 108
EC_CODEWORDS = 26
FORMAT_ECL_LOW = 1


def gf_multiply(x: int, y: int) -> int:
    result = 0
    while y:
        if y & 1:
            result ^= x
        y >>= 1
        x <<= 1
        if x & 0x100:
            x ^= 0x11D
    return result


def reed_solomon_divisor(degree: int) -> list[int]:
    result = [0] * (degree - 1) + [1]
    root = 1
    for _ in range(degree):
        for index in range(degree):
            result[index] = gf_multiply(result[index], root)
            if index + 1 < degree:
                result[index] ^= result[index + 1]
        root = gf_multiply(root, 2)
    return result


def reed_solomon_remainder(data: list[int], divisor: list[int]) -> list[int]:
    result = [0] * len(divisor)
    for value in data:
        factor = value ^ result.pop(0)
        result.append(0)
        for index, coefficient in enumerate(divisor):
            result[index] ^= gf_multiply(coefficient, factor)
    return result


def append_bits(bits: list[int], value: int, length: int) -> None:
    for index in range(length - 1, -1, -1):
        bits.append((value >> index) & 1)


def make_codewords(text: str) -> list[int]:
    payload = text.encode("utf-8")
    if len(payload) > 106:
        raise ValueError("QRコードに入れるURLが長すぎます。106バイト以下のURLにしてください。")

    bits: list[int] = []
    append_bits(bits, 0b0100, 4)
    append_bits(bits, len(payload), 8)
    for byte in payload:
        append_bits(bits, byte, 8)

    capacity_bits = DATA_CODEWORDS * 8
    append_bits(bits, 0, min(4, capacity_bits - len(bits)))
    while len(bits) % 8:
        bits.append(0)

    data = [sum(bits[index + bit] << (7 - bit) for bit in range(8)) for index in range(0, len(bits), 8)]
    pad = 0xEC
    while len(data) < DATA_CODEWORDS:
        data.append(pad)
        pad = 0x11 if pad == 0xEC else 0xEC

    return data + reed_solomon_remainder(data, reed_solomon_divisor(EC_CODEWORDS))


def empty_matrix() -> tuple[list[list[bool | None]], list[list[bool]]]:
    modules: list[list[bool | None]] = [[None for _ in range(SIZE)] for _ in range(SIZE)]
    function: list[list[bool]] = [[False for _ in range(SIZE)] for _ in range(SIZE)]
    return modules, function


def set_function(modules: list[list[bool | None]], function: list[list[bool]], x: int, y: int, dark: bool) -> None:
    if 0 <= x < SIZE and 0 <= y < SIZE:
        modules[y][x] = dark
        function[y][x] = True


def draw_finder(modules: list[list[bool | None]], function: list[list[bool]], x: int, y: int) -> None:
    for dy in range(-1, 8):
        for dx in range(-1, 8):
            xx = x + dx
            yy = y + dy
            dark = 0 <= dx <= 6 and 0 <= dy <= 6 and (
                dx in (0, 6) or dy in (0, 6) or (2 <= dx <= 4 and 2 <= dy <= 4)
            )
            set_function(modules, function, xx, yy, dark)


def draw_alignment(modules: list[list[bool | None]], function: list[list[bool]], cx: int, cy: int) -> None:
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            set_function(modules, function, cx + dx, cy + dy, max(abs(dx), abs(dy)) != 1)


def format_bits(mask: int) -> int:
    data = (FORMAT_ECL_LOW << 3) | mask
    remainder = data
    for _ in range(10):
        remainder = (remainder << 1) ^ (0x537 if (remainder >> 9) & 1 else 0)
    return ((data << 10) | remainder) ^ 0x5412


def bit(value: int, index: int) -> bool:
    return ((value >> index) & 1) != 0


def draw_format(modules: list[list[bool | None]], function: list[list[bool]], mask: int) -> None:
    bits = format_bits(mask)
    for index in range(6):
        set_function(modules, function, 8, index, bit(bits, index))
    set_function(modules, function, 8, 7, bit(bits, 6))
    set_function(modules, function, 8, 8, bit(bits, 7))
    set_function(modules, function, 7, 8, bit(bits, 8))
    for index in range(9, 15):
        set_function(modules, function, 14 - index, 8, bit(bits, index))

    for index in range(8):
        set_function(modules, function, SIZE - 1 - index, 8, bit(bits, index))
    for index in range(8, 15):
        set_function(modules, function, 8, SIZE - 15 + index, bit(bits, index))
    set_function(modules, function, 8, SIZE - 8, True)


def mask_value(x: int, y: int) -> bool:
    return (x + y) % 2 == 0


def make_qr_matrix(text: str) -> list[list[bool]]:
    modules, function = empty_matrix()

    draw_finder(modules, function, 0, 0)
    draw_finder(modules, function, SIZE - 7, 0)
    draw_finder(modules, function, 0, SIZE - 7)
    draw_alignment(modules, function, 30, 30)

    for index in range(8, SIZE - 8):
        dark = index % 2 == 0
        set_function(modules, function, index, 6, dark)
        set_function(modules, function, 6, index, dark)

    draw_format(modules, function, 0)

    codewords = make_codewords(text)
    data_bits = [(codeword >> index) & 1 for codeword in codewords for index in range(7, -1, -1)]
    bit_index = 0
    upward = True
    right = SIZE - 1

    while right >= 1:
        if right == 6:
            right -= 1
        rows = range(SIZE - 1, -1, -1) if upward else range(SIZE)
        for y in rows:
            for x in (right, right - 1):
                if function[y][x]:
                    continue
                dark = bool(data_bits[bit_index]) if bit_index < len(data_bits) else False
                modules[y][x] = dark ^ mask_value(x, y)
                bit_index += 1
        upward = not upward
        right -= 2

    draw_format(modules, function, 0)
    return [[bool(cell) for cell in row] for row in modules]


def make_svg(url: str) -> str:
    matrix = make_qr_matrix(url)
    quiet = 4
    total = SIZE + quiet * 2
    commands: list[str] = []
    for y, row in enumerate(matrix):
        for x, dark in enumerate(row):
            if dark:
                commands.append(f"M{x + quiet},{y + quiet}h1v1h-1z")

    path_data = "".join(commands)
    escaped_url = html.escape(url)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {total}" role="img" aria-label="おりょうりまぜまぜを開くQRコード">
  <title>おりょうりまぜまぜ QRコード</title>
  <desc>{escaped_url}</desc>
  <rect width="{total}" height="{total}" fill="#fffdf7"/>
  <path d="{path_data}" fill="#2f2923"/>
</svg>
"""


def make_html(url: str, svg_name: str) -> str:
    escaped_url = html.escape(url)
    escaped_svg = html.escape(svg_name)
    return f"""<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>おりょうりまぜまぜ iPhone QR</title>
    <style>
      body {{
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #fff7d6;
        color: #332d29;
        font-family: system-ui, sans-serif;
      }}
      main {{
        max-width: 720px;
        text-align: center;
      }}
      img {{
        width: min(76vw, 420px);
        height: auto;
        border: 14px solid #fffdf7;
        border-radius: 8px;
        box-shadow: 0 16px 40px rgba(90, 70, 42, .2);
      }}
      p {{
        font-size: 18px;
        line-height: 1.7;
      }}
      code {{
        overflow-wrap: anywhere;
        font-size: 16px;
      }}
    </style>
  </head>
  <body>
    <main>
      <h1>iPhoneでひらくQR</h1>
      <img src="{escaped_svg}" alt="おりょうりまぜまぜを開くQRコード" />
      <p>iPhoneのカメラで読み込み、Safariで開いてください。</p>
      <p><code>{escaped_url}</code></p>
    </main>
  </body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="iPhoneで読み込むための公開URL QRコードを生成します。")
    parser.add_argument("--url", help="QRコードに入れるURLを明示します。省略時は公開URL解決ロジックを使います。")
    parser.add_argument("--svg", type=Path, default=DEFAULT_SVG, help="出力するSVGファイル")
    parser.add_argument("--html", type=Path, default=DEFAULT_HTML, help="QR表示用HTMLファイル")
    args = parser.parse_args()

    result = resolve_public_url()
    url = args.url or result.url
    svg_path = args.svg if args.svg.is_absolute() else ROOT / args.svg
    html_path = args.html if args.html.is_absolute() else ROOT / args.html

    svg_path.write_text(make_svg(url), encoding="utf-8", newline="\n")
    html_path.write_text(make_html(url, svg_path.name), encoding="utf-8", newline="\n")
    print(f"generated {svg_path.relative_to(ROOT)}")
    print(f"generated {html_path.relative_to(ROOT)}")
    print(f"url ({'argument' if args.url else result.source}): {url}")


if __name__ == "__main__":
    main()
