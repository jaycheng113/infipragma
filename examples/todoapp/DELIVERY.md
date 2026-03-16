# Delivery — TodoApp

## Product

**TodoApp** — A lightweight, zero-dependency, privacy-first todo list web application.

## Access

| Field | Value |
|---|---|
| Live URL | `http://localhost:8765` (local) or `file:///Users/zcheng256/InfiPragma/test-project/dist/index.html` |
| Deployment Platform | Local / Ready for static hosting |
| Deployment Date | 2026-03-16 |
| Stack | Vanilla HTML5, CSS3, JavaScript (ES6+) — no framework, no build tools |

## How to Access

### Option 1 — Direct File

Open `dist/index.html` in any modern browser.

### Option 2 — Local HTTP Server

```bash
python3 -m http.server 8765 --directory dist
# Then open http://localhost:8765
```

### Option 3 — Deploy to Static Host

Copy the contents of `dist/` to any static file host:

- **GitHub Pages**: push `dist/` contents to `gh-pages` branch
- **Netlify**: drag and drop `dist/` folder in Netlify dashboard
- **Vercel**: `cd dist && vercel`
- **Any web server**: copy `dist/*` to your web root

## Production Files

```
dist/
├── index.html      — Main application page
├── style.css       — Stylesheet (light/dark theme, responsive, print)
├── app.js          — Application logic (IIFE-encapsulated)
└── favicon.svg     — App icon
```

## How to Redeploy

1. Make changes to source files in the project root
2. Copy updated files to `dist/`: `cp index.html style.css app.js favicon.svg dist/`
3. Serve or upload `dist/` to your hosting platform

## Features (25 total)

- Full CRUD: add, complete, delete tasks
- localStorage persistence (offline-first, privacy-first)
- Filter by status (all/active/completed)
- Inline editing, drag-and-drop reorder
- Export/import (JSON), bulk actions
- Dark mode, animations, keyboard shortcuts
- Accessible (ARIA), responsive, print-friendly
