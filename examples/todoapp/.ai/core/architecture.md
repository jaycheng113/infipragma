---
module: architecture
version: 1.0.0
last_updated: 2026-03-16
---

# Architecture

## Delivery Format

**Static Site** — a single-page, client-only web application served as static files. No backend, no server-side logic, no API.

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic structure, accessibility |
| Styling | CSS3 | Hand-written, no preprocessor |
| Logic | JavaScript (ES6+) | Vanilla, no framework |
| Persistence | localStorage API | Browser-native, no server needed |
| Build tools | None | No transpilation, no bundling |
| Dependencies | None | Zero npm packages |

## Project Structure

```
index.html      — Single page: markup + inline or linked CSS/JS
style.css       — Stylesheet (optional, can be inline)
app.js          — Application logic (optional, can be inline)
```

All files are served as-is. No build step, no compilation, no transformation.

## Data Model

Tasks are stored in `localStorage` as a JSON array:

```json
[
  { "id": "unique-id", "text": "Buy groceries", "completed": false, "createdAt": "2026-03-16T12:00:00.000Z" },
  { "id": "unique-id", "text": "Walk the dog", "completed": true, "createdAt": "2026-03-16T10:30:00.000Z" }
]
```

- `id`: Unique identifier (timestamp or UUID)
- `text`: Task description (string)
- `completed`: Completion state (boolean)
- `createdAt`: ISO 8601 timestamp of task creation (optional for backward compatibility)

## Key Architectural Decisions

1. **No framework** — the product differentiator is zero dependencies and instant load. Frameworks add overhead that contradicts this positioning.
2. **localStorage over server** — privacy-first, offline-first. All data stays in the browser. No accounts, no tracking.
3. **Single HTML file entry point** — keeps deployment trivial (copy one file) and mental model simple.
4. **No build step** — edit and refresh. The development workflow is as simple as the product itself.

## Deployment

The app can be deployed to any static file host:
- GitHub Pages
- Netlify (drag and drop)
- Any web server (nginx, Apache)
- Local file system (`file://` protocol)

No CI/CD pipeline is required, though one can be added for convenience.

## Decisions Log

See `.ai/core/history.md` for full Architecture Decision Records (ADR-001, ADR-002).
