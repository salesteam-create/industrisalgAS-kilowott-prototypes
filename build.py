#!/usr/bin/env python3
"""Assemble the single-file prototype: src/ -> index.html (drag-and-drop deployable)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Archivo:wdth,wght@62..125,400..900"
         "&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700"
         "&family=IBM+Plex+Mono:wght@400;500;600&display=swap")

SCRIPTS = [
    "00-data.js", "01-core.js", "02-home-catalog.js", "03-product-forms.js",
    "04-quick-account.js", "05-i18n.js", "06-catnav.js", "07-minicart.js",
    "075-concept-home.js",   # new homepage (replaces viewHome before first render)
    "08-router.js",
    "99-concept-post.js",    # render wrapper, effects, design notes
]


def main():
    css = (SRC / "css/base.css").read_text() + "\n" + (SRC / "css/theme.css").read_text()
    body = (SRC / "shell.html").read_text().replace("[[MAIN]]", "")
    body = body.replace("</body>", "")
    body = body.replace("<body>", "")
    scripts = "\n".join(f"<script>\n{(SRC / 'js' / n).read_text()}\n</script>" for n in SCRIPTS)
    html = f"""<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Industrisalg AS Sandnes | Festemateriell på lager siden 1953</title>
<meta name="description" content="Konsept: Industrisalg 2.0, ny design- og kjøpsopplevelse.">
<meta name="theme-color" content="#070e1f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
{body}
{scripts}
</body>
</html>
"""
    out = ROOT / "index.html"
    out.write_text(html)
    print(f"wrote {out} ({len(html)/1024:.0f} KB)")


if __name__ == "__main__":
    main()
