---
name: Roadmap
description: Planned features, milestones, and priorities
layer: evolution
last_updated: 2026-03-15
---

# Roadmap

## Current Priority

MVP release: complete the core .ai/ framework, templates, and example projects.

## Phase 1: MVP (Current)

- [x] Define .ai/ directory structure and conventions
- [x] Create CLAUDE.md template with loading/maintenance instructions
- [x] Create loading decision tree (_loading-rules.md)
- [x] Create maintenance protocol (_maintenance-rules.md)
- [x] Create all document templates (core, feature, evolution, ADR)
- [x] Create example projects (minimal + web-app)
- [x] Write comprehensive README with getting started guide
- [ ] Initial release on GitHub

## Phase 2: Polish

- [ ] Add CONTRIBUTING.md with guidelines for knowledge doc quality
- [ ] Create a "bootstrap guide" — how to add .ai/ to an existing project
- [ ] Collect community feedback on the convention
- [ ] Refine loading rules based on real-world usage

## Phase 3: Optional Tooling

- [ ] CLI tool: `agentinfra init` — interactive bootstrap
- [ ] CLI tool: `agentinfra validate` — check index sync, detect stale docs
- [ ] CLI tool: `agentinfra stats` — token count per document

## Phase 4: Multi-Platform

- [ ] Cursor rules adapter (.cursorrules generation from .ai/)
- [ ] Codex agents adapter
- [ ] Gemini GEMINI.md adapter
- [ ] MCP server for richer agent integration

## Completed

### Phase 1 MVP (2026-03-15)
- Core .ai/ framework with three-layer loading
- Loading decision tree and maintenance protocol
- Full template library (feature, ADR, CLAUDE.md, init-core)
- Two example projects (minimal CLI + web app)
- README with quick start guide
