# Industrisalg 2.0 concept prototype

Single-file prototype: open or deploy `index.html` (drag the file or folder into Netlify).

## Structure
- `src/js/00-08*.js` original prototype modules (catalogue data, search, basket, quick order, i18n, router)
- `src/js/075-concept-home.js` new homepage, design notes, English copy
- `src/js/99-concept-post.js` render wrapper, scroll effects, hero search, design-notes panel
- `src/css/base.css` original styles, `src/css/theme.css` concept design layer
- `src/shell.html` header, footer, prototype bar

## Build
```
python3 build.py
```
Writes `index.html`.

## Status
Round 1: homepage plus global header, footer and mini cart. Inner pages keep their current design until round 2.
