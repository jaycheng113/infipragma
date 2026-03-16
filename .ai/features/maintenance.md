---
name: "Maintenance"
description: "Phase 2 maintenance: audit, feature, and fix agents running indefinitely"
layer: feature
last_updated: 2026-03-15
---

# Maintenance

## Responsibility
Keeps the deployed product healthy and evolving through three independent agents: Audit, Feature, and Fix.

## Agents
| Agent | Trigger | Action |
|-------|---------|--------|
| Audit | Schedule (daily/weekly) | Diagnose issues → AUDIT.md |
| Feature | BACKLOG.md has Pending items | Implement one item → test → Done |
| Fix | AUDIT.md has unresolved items | Patch one issue → verify → resolved |

## Rules
- Audit Agent never fixes — diagnosis only
- One item per session for Feature and Fix agents
- Every session ends with: git commit + .ai/ update + CHANGELOG entry + notification

## Source Files
- `.claude/agents/infipragma-audit.md`
- `.claude/agents/infipragma-feature.md`
- `.claude/agents/infipragma-fix.md`
- `AUDIT.md` — audit findings
- `BACKLOG.md` — feature requests
- `CHANGELOG.md` — product history

## Dependencies
- **Depends on**: registry.yaml (mode), AUDIT.md, BACKLOG.md
- **Used by**: AGENTS.md (routing)
