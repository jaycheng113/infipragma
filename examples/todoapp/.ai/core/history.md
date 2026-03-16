---
module: history
version: 1.0.0
last_updated: 2026-03-16
---

# Architecture Decision Records

## ADR-001: Market Research Findings

**Date**: 2026-03-16
**Status**: Accepted
**Stage**: S1 (Research)

### Context

Conducted competitive analysis for TodoApp — a zero-dependency, vanilla HTML/CSS/JS todo list web application. Analyzed 5 competitors across the task management spectrum: Todoist (feature-rich SaaS), Microsoft To Do (ecosystem-integrated), TickTick (all-in-one productivity), Google Tasks (minimal ecosystem tool), and TodoMVC (open-source reference).

WebSearch was unavailable during this session; analysis was performed using training knowledge of well-established competitors in the task management space. All competitors listed are real, widely-known products with publicly verifiable information.

### Decision

Position TodoApp in the **independent + minimal** quadrant of the market:

- **No account required** — zero friction, open and use immediately
- **Zero dependencies** — vanilla HTML/CSS/JS, no frameworks, instant load
- **Privacy-first** — all data in localStorage, no server, no tracking
- **Offline-first by default** — no server dependency
- **Free and self-hostable** — no subscription model

This positioning targets an underserved gap: users who want a genuinely simple, private, instant-loading task list without the overhead of account creation, ecosystem lock-in, or subscription costs.

### Consequences

- **Product scope stays minimal** — resist feature creep; simplicity is the differentiator
- **No backend required** — localStorage for persistence, no server infrastructure
- **No user authentication** — this is a feature, not a limitation
- **Performance is a priority** — the "instant load" claim must be backed by sub-second page loads
- **Accessibility matters** — with no framework abstractions, we must manually ensure semantic HTML and keyboard navigation
- **Future considerations**: if users want cross-device sync, this would require a fundamental architecture change (optional cloud sync layer); defer to post-MVP

## ADR-002: Delivery Format and Stack Selection

**Date**: 2026-03-16
**Status**: Accepted
**Stage**: S2 (Delivery Mode)

### Context

TodoApp is a single-page todo list with these hard constraints from the product spec and market positioning (ADR-001):

- Vanilla HTML/CSS/JS only — no frameworks, no build tools
- Zero external dependencies
- Client-side only — no backend server
- localStorage for persistence
- Must achieve sub-second page loads ("instant load" differentiator)
- Self-hostable as static files

The available stack definitions in `.claude/stacks/` were evaluated:

| Stack | Format | Why considered | Why rejected/adapted |
|---|---|---|---|
| **webapp** | webapp | Web-based product | Overkill — Next.js, Supabase, TypeScript violate zero-dependency constraint |
| **staticsite** | staticsite | Closest match — static output, no backend | Astro/TypeScript/Tailwind still introduce build tools and dependencies |
| **cli** | cli | — | Not a CLI tool |
| **api** | api | — | No backend needed |
| **desktop** | desktop | — | Browser-based product |
| **bot** | bot | — | Not a chat bot |

### Decision

**Delivery format**: `staticsite` — the product is a static, client-only web page with no server-side logic.

**Stack**: Adapted from the `staticsite` stack definition with all framework/build tooling removed to honor the zero-dependency constraint:

- **Framework**: None (vanilla HTML/CSS/JS)
- **Language**: JavaScript (ES6+), HTML5, CSS3
- **Styling**: Hand-written CSS (no preprocessor, no utility framework)
- **Build tools**: None — no transpilation, no bundling
- **Deployment**: Any static file host (GitHub Pages, Netlify, S3, or simply open `index.html`)
- **Testing**: Manual browser testing (no test framework for MVP; Playwright can be added later)
- **Persistence**: localStorage API
- **Structure**: Minimal flat file set — `index.html`, optional `style.css`, optional `app.js`

### Alternatives Considered

1. **Use the webapp stack as-is (Next.js + Supabase)**: Rejected. Introduces a framework, TypeScript compilation, a database, and authentication — directly contradicting every core constraint. The product's differentiator is simplicity; this stack undermines it entirely.

2. **Use the staticsite stack as-is (Astro + Tailwind)**: Rejected. While Astro produces static output, it requires Node.js, a build step, and npm dependencies. This violates the "no build tools, no dependencies" constraint and adds unnecessary complexity for a single-page app.

3. **Use the staticsite stack with partial adaptation (keep Tailwind, drop Astro)**: Rejected. Tailwind still requires a build step or CDN dependency. Hand-written CSS is simpler and keeps the dependency count at zero.

### Consequences

- **No build step** — development is as simple as editing files and refreshing the browser
- **No `package.json`** — the project has zero npm dependencies
- **Deployment is trivial** — copy files to any static host, or open `index.html` locally
- **Testing is manual initially** — without a test framework, acceptance criteria must be verified by hand; Playwright can be introduced later if needed
- **Performance ceiling is very high** — with no framework overhead, the page will load in milliseconds
- **Developer experience is bare-metal** — no hot reload, no linting, no type checking out of the box; this is acceptable for a small, focused project
