from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "images" / "dishes"


def svg(body: str) -> str:
    return dedent(
        f"""\
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img">
          <defs>
            <style>
              .line {{ stroke: #6b5748; stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }}
              .thin {{ stroke-width: 6; }}
              .soft {{ stroke: #ffffff; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }}
            </style>
          </defs>
        {body}
        </svg>
        """
    )


def plate(cx: int = 256, cy: int = 340, rx: int = 178, ry: int = 72) -> str:
    return f"""
          <ellipse cx="{cx}" cy="{cy + 22}" rx="{rx + 12}" ry="{ry}" fill="#d9e3e6" opacity=".42"/>
          <ellipse class="line" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fffdf7"/>
          <ellipse cx="{cx}" cy="{cy - 6}" rx="{int(rx * .68)}" ry="{int(ry * .47)}" fill="#eef6f7"/>
          <ellipse cx="{cx}" cy="{cy - 14}" rx="{int(rx * .62)}" ry="{int(ry * .37)}" fill="#ffffff"/>
    """


def pancake() -> str:
    return svg(
        plate(256, 352, 176, 70)
        + """
          <ellipse class="line" cx="252" cy="318" rx="143" ry="44" fill="#efbc67"/>
          <path d="M113 318c23 36 241 38 279-1v38c-28 42-242 42-279 1z" fill="#e4a85d"/>
          <path class="line" d="M113 318c23 36 241 38 279-1v38c-28 42-242 42-279 1z" fill="none"/>

          <ellipse class="line" cx="260" cy="278" rx="144" ry="44" fill="#f3c879"/>
          <path d="M122 277c29 33 236 36 278-2v34c-35 38-238 38-278 1z" fill="#e9b466"/>
          <path class="line" d="M122 277c29 33 236 36 278-2v34c-35 38-238 38-278 1z" fill="none"/>

          <ellipse class="line" cx="248" cy="239" rx="139" ry="43" fill="#f7d38b"/>
          <path d="M119 238c33 32 218 35 259-1v31c-32 37-218 37-259 1z" fill="#eebd72"/>
          <path class="line" d="M119 238c33 32 218 35 259-1v31c-32 37-218 37-259 1z" fill="none"/>

          <path class="line" d="M229 211c52-26 107 2 98 47-4 20-17 28-15 54 2 34-54 34-54 0 0-24-9-31-32-32-37-2-41-49 3-69z" fill="#9b572c"/>
          <path d="M245 220c19-10 47-4 58 9" fill="none" class="soft thin" opacity=".35"/>
          <path d="M246 270c-4 21-1 38 2 53" fill="none" class="soft thin" opacity=".25"/>

          <rect class="line" x="223" y="178" width="74" height="48" rx="12" fill="#ffe176" transform="rotate(-7 260 202)"/>
          <path d="M236 193h43" fill="none" class="soft thin" opacity=".45"/>

          <path class="line thin" d="M176 260c22 8 40 4 58-11" fill="none" opacity=".3"/>
          <path class="line thin" d="M307 334c24 6 51 2 70-12" fill="none" opacity=".25"/>
          <path class="line thin" d="M154 345c19 8 44 6 65-4" fill="none" opacity=".22"/>

          <path class="line" d="M327 211c20-7 40 8 39 31-1 21-17 37-37 37-22 0-37-18-31-39 3-12 12-23 29-29z" fill="#ee6f82"/>
          <circle cx="330" cy="235" r="4" fill="#ffe0d1"/>
          <circle cx="347" cy="248" r="4" fill="#ffe0d1"/>
          <path class="line thin" d="M323 208l-3-18" fill="none" stroke="#5b8d61"/>
          <circle class="line thin" cx="181" cy="241" r="19" fill="#6c7ed0"/>
          <circle class="line thin" cx="206" cy="231" r="14" fill="#7b8ee4"/>
          <path d="M156 289c13 7 43 7 59-2" fill="none" class="soft thin" opacity=".4"/>
        """
    )


def curry() -> str:
    return svg(
        plate(256, 350, 188, 76)
        + """
          <path class="line" d="M93 329c22-74 109-118 187-86 54 22 88 10 126 46 31 30 20 82-25 105-74 38-250 34-288-65z" fill="#c77437"/>
          <path d="M247 252c45 22 86 16 124 45" fill="none" class="soft" opacity=".28"/>
          <path class="line" d="M91 323c23-55 80-97 145-94 50 3 73 31 75 69 2 47-40 83-101 90-65 7-112-17-119-65z" fill="#fff6e5"/>
          <path d="M125 319c43 22 117 18 154-16" fill="none" class="soft" opacity=".8"/>

          <ellipse cx="160" cy="289" rx="18" ry="12" fill="#ffffff" opacity=".9"/>
          <ellipse cx="209" cy="314" rx="17" ry="12" fill="#ffffff" opacity=".9"/>
          <ellipse cx="243" cy="272" rx="14" ry="10" fill="#ffffff" opacity=".9"/>

          <path class="line thin" d="M280 243c12 28-4 77-42 103" fill="none" opacity=".36"/>
          <path class="line thin" d="M312 324c32 8 66 2 87-18" fill="none" opacity=".2"/>

          <rect class="line thin" x="311" y="292" width="45" height="35" rx="10" fill="#f28b4b" transform="rotate(-18 333 310)"/>
          <rect class="line thin" x="356" y="334" width="45" height="36" rx="12" fill="#e5c77d" transform="rotate(13 378 352)"/>
          <circle class="line thin" cx="332" cy="365" r="17" fill="#ffd65d"/>
          <circle class="line thin" cx="393" cy="282" r="14" fill="#79bf85"/>
          <circle class="line thin" cx="372" cy="302" r="12" fill="#79bf85"/>
          <rect class="line thin" x="277" y="339" width="38" height="29" rx="10" fill="#f28b4b" transform="rotate(20 296 354)"/>
          <path d="M338 260c21 3 42 15 54 31" fill="none" class="soft thin" opacity=".25"/>
        """
    )


def juice() -> str:
    return svg(
        """
          <ellipse cx="259" cy="411" rx="111" ry="32" fill="#6b5748" opacity=".14"/>
          <path class="line" d="M166 139h180l-24 251c-3 27-28 44-63 44s-60-17-63-44z" fill="#eaf8ff" opacity=".78"/>
          <path d="M185 214h142l-15 159c-2 20-21 34-53 34s-51-14-53-34z" fill="#f28b71" opacity=".88"/>
          <ellipse class="line" cx="256" cy="139" rx="93" ry="25" fill="#ffffff" opacity=".72"/>
          <ellipse cx="256" cy="214" rx="72" ry="19" fill="#ffb28c" opacity=".75"/>
          <path d="M202 218c31 14 88 15 116 1" fill="none" class="soft" opacity=".62"/>

          <path class="line" d="M304 93l-68 300" fill="none" stroke="#8ecae6"/>
          <path class="line" d="M304 93l52 20" fill="none" stroke="#8ecae6"/>
          <path d="M304 93l-68 300" fill="none" class="soft thin" opacity=".35"/>

          <rect class="line thin" x="212" y="264" width="42" height="34" rx="8" fill="#f9fdff" opacity=".72" transform="rotate(-14 233 281)"/>
          <rect class="line thin" x="270" y="300" width="38" height="31" rx="8" fill="#f9fdff" opacity=".64" transform="rotate(16 289 315)"/>
          <circle cx="287" cy="246" r="10" fill="#ffffff" opacity=".72"/>
          <circle cx="235" cy="337" r="8" fill="#ffffff" opacity=".68"/>
          <circle cx="287" cy="363" r="7" fill="#ffffff" opacity=".62"/>
          <path class="line thin" d="M198 182c5 67 9 126 17 200" fill="none" stroke="#ffffff" opacity=".38"/>
          <path class="line thin" d="M318 181c-3 71-8 135-16 200" fill="none" stroke="#ffffff" opacity=".32"/>

          <path class="line" d="M345 145l67 45-80 29z" fill="#f4a24e"/>
          <path d="M345 145l67 45" fill="none" class="soft thin" opacity=".45"/>
          <path class="line thin" d="M370 163l-17 44" fill="none" opacity=".2"/>
        """
    )


def pudding() -> str:
    return svg(
        plate(256, 372, 182, 68)
        + """
          <ellipse cx="256" cy="380" rx="102" ry="24" fill="#c99b54" opacity=".18"/>
          <path class="line" d="M144 164c14 135 32 220 112 220s98-85 112-220z" fill="#f5ca70"/>
          <ellipse class="line" cx="256" cy="164" rx="112" ry="38" fill="#f9dc8a"/>
          <path class="line" d="M154 155c28-48 176-52 204 0 15 29-17 53-102 53s-117-24-102-53z" fill="#8f5226"/>
          <ellipse cx="256" cy="158" rx="70" ry="18" fill="#b87535" opacity=".58"/>
          <path d="M196 161c29 15 94 18 129-1" fill="none" class="soft" opacity=".34"/>
          <path class="line" d="M187 188c2 51 21 62 36 25 8-18 22-21 35-2 15 21 37 7 35-24" fill="#8f5226"/>
          <path class="line" d="M313 186c-4 62 43 54 42-17" fill="#8f5226"/>
          <path class="line" d="M239 188c-5 40 37 43 32 0" fill="#8f5226"/>
          <path d="M181 220c13 54 35 91 72 116" fill="none" class="soft" opacity=".42"/>
          <path d="M199 245c11 34 27 55 48 70" fill="none" class="soft" opacity=".62"/>
          <path class="line thin" d="M328 239c-8 65-31 103-72 122" fill="none" opacity=".12"/>
          <path class="line thin" d="M195 146c31-15 96-16 127 0" fill="none" stroke="#b8793a" opacity=".45"/>
        """
    )


def jelly() -> str:
    return svg(
        plate(256, 372, 174, 64)
        + """
          <path class="line" d="M142 160c7 136 30 211 114 211s107-75 114-211z" fill="#df75a0" opacity=".74"/>
          <ellipse class="line" cx="256" cy="160" rx="114" ry="38" fill="#f39abd" opacity=".88"/>
          <ellipse cx="256" cy="165" rx="78" ry="21" fill="#ffb7d1" opacity=".72"/>
          <path d="M177 188c12 96 36 148 79 163" fill="none" class="soft" opacity=".38"/>
          <path d="M335 188c-12 96-36 148-79 163" fill="none" class="soft" opacity=".28"/>
          <path class="line thin" d="M194 204c5 70 11 120 26 151" fill="none" opacity=".1"/>
          <path class="line thin" d="M256 205v154" fill="none" opacity=".1"/>
          <path class="line thin" d="M318 204c-5 70-11 120-26 151" fill="none" opacity=".1"/>
          <path d="M176 250c40 19 118 23 160 1" fill="none" class="soft" opacity=".22"/>

          <path class="line thin" d="M323 225l61 36-72 28z" fill="#f4a24e"/>
          <circle class="line thin" cx="232" cy="263" r="26" fill="#8d6ccf"/>
          <path class="line thin" d="M188 288c17-10 42-1 45 22 3 27-32 49-58 30-23-16-12-40 13-52z" fill="#ee6f82"/>
          <circle class="line thin" cx="298" cy="316" r="17" fill="#ffd65d"/>
          <path class="line thin" d="M204 224c36-15 107-16 143 1" fill="none" stroke="#ffffff" opacity=".5"/>
          <path class="line thin" d="M192 325c28 22 100 25 132 0" fill="none" stroke="#ffffff" opacity=".22"/>
          <path d="M199 161c32 16 83 17 115 1" fill="none" class="soft" opacity=".45"/>
        """
    )


def icecream() -> str:
    return svg(
        """
          <ellipse cx="256" cy="424" rx="116" ry="30" fill="#6b5748" opacity=".14"/>
          <path class="line" d="M174 276h164l-31 148H205z" fill="#efbd72"/>
          <path class="line thin" d="M190 315c34 19 94 20 132 0" fill="none" opacity=".2"/>
          <path class="line thin" d="M199 359c31 17 83 18 113 0" fill="none" opacity=".18"/>
          <path class="line thin" d="M198 281l98 136" fill="none" stroke="#b77b3e" opacity=".36"/>
          <path class="line thin" d="M318 283L215 417" fill="none" stroke="#b77b3e" opacity=".36"/>

          <circle class="line" cx="194" cy="244" r="70" fill="#f4c5d0"/>
          <circle class="line" cx="271" cy="210" r="78" fill="#fff3d5"/>
          <circle class="line" cx="334" cy="252" r="67" fill="#9b623a"/>
          <path class="line" d="M147 269c34 42 180 59 246 4 6 33-22 67-72 74-88 14-178-13-174-78z" fill="#fff1d0"/>
          <path d="M211 215c24-23 78-32 110-9" fill="none" class="soft" opacity=".38"/>
          <path d="M166 232c19-18 49-24 75-13" fill="none" class="soft" opacity=".3"/>
          <path d="M300 257c15-17 46-22 67-10" fill="none" class="soft" opacity=".22"/>

          <path class="line thin" d="M300 169c16-15 45-15 58 5" fill="none" stroke="#5b8d61"/>
          <circle class="line thin" cx="286" cy="169" r="22" fill="#e95f68"/>
          <circle cx="278" cy="161" r="6" fill="#ffd5d5"/>

          <rect x="157" y="214" width="40" height="10" rx="5" fill="#8ecae6" transform="rotate(21 177 219)"/>
          <rect x="235" y="168" width="42" height="10" rx="5" fill="#e98a9c" transform="rotate(-18 256 173)"/>
          <rect x="321" y="219" width="38" height="10" rx="5" fill="#f7d86b" transform="rotate(33 340 224)"/>
          <circle cx="223" cy="251" r="7" fill="#8ed4b2"/>
          <circle cx="301" cy="275" r="7" fill="#8ecae6"/>
          <circle cx="253" cy="298" r="7" fill="#e98a9c"/>
        """
    )


DISHES = {
    "pancake.svg": ("ぱんけーき", pancake),
    "curry.svg": ("かれー", curry),
    "juice.svg": ("じゅーす", juice),
    "pudding.svg": ("ぷりん", pudding),
    "jelly.svg": ("ぜりー", jelly),
    "icecream.svg": ("あいす", icecream),
}


def preview_html() -> str:
    cards = "\n".join(
        f"""\
        <article class="card">
          <img src="{filename}" alt="{label}" />
          <h2>{label}</h2>
          <p>{filename}</p>
        </article>"""
        for filename, (label, _) in DISHES.items()
    )
    return dedent(
        f"""\
        <!doctype html>
        <html lang="ja">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>完成料理SVG preview</title>
            <style>
              * {{ box-sizing: border-box; }}
              body {{
                margin: 0;
                min-height: 100vh;
                font-family: "Hiragino Maru Gothic ProN", "Yu Gothic", "Meiryo", system-ui, sans-serif;
                color: #3f372f;
                background: linear-gradient(135deg, #fff8e9 0%, #f0f7ef 48%, #eaf6fb 100%);
              }}
              main {{
                width: min(1080px, calc(100% - 32px));
                margin: 0 auto;
                padding: 18px 0 24px;
              }}
              h1 {{
                margin: 0 0 14px;
                font-size: clamp(30px, 4vw, 46px);
                letter-spacing: 0;
                text-align: center;
              }}
              .grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 18px;
              }}
              .card {{
                display: grid;
                place-items: center;
                gap: 8px;
                min-height: 286px;
                padding: 16px;
                border: 4px solid rgba(183, 222, 205, .75);
                border-radius: 8px;
                background: rgba(255, 255, 255, .7);
                box-shadow: 0 14px 35px rgba(77, 59, 36, .12);
              }}
              img {{
                width: min(100%, 200px);
                aspect-ratio: 1;
                object-fit: contain;
              }}
              h2 {{
                margin: 0;
                font-size: 28px;
              }}
              p {{
                margin: 0;
                color: #756b61;
                font-weight: 700;
              }}
            </style>
          </head>
          <body>
            <main>
              <h1>完成料理SVG preview</h1>
              <div class="grid">
        {cards}
              </div>
            </main>
          </body>
        </html>
        """
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, (_, factory) in DISHES.items():
        (OUT_DIR / filename).write_text(factory(), encoding="utf-8", newline="\n")
    (OUT_DIR / "preview.html").write_text(preview_html(), encoding="utf-8", newline="\n")
    print(f"generated {len(DISHES)} SVG files in {OUT_DIR.relative_to(ROOT)}")
    print(f"generated {OUT_DIR.relative_to(ROOT) / 'preview.html'}")


if __name__ == "__main__":
    main()
