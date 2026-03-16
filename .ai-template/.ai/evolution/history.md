---
name: Development History
description: Key decisions, milestones, and architecture decision records
layer: evolution
last_updated: 2026-03-15
---

# Development History

## Architecture Decision Records

### ADR-001: Use .ai/ directory for knowledge base (2026-03-15)

**Context**: Needed a location for agent knowledge files that doesn't conflict with existing conventions.

**Decision**: Use `.ai/` as the root directory for all knowledge files.

**Alternatives considered**:
- `docs/` — conflicts with existing human documentation
- `.agent-infra/` — too verbose
- `.knowledge/` — too generic

**Consequences**:
- Clear separation between agent knowledge and human docs
- Follows dot-prefix convention for tool-specific directories (.git, .vscode)
- Short and memorable

### ADR-002: CLAUDE.md as router, not database (2026-03-15)

**Context**: CLAUDE.md is auto-loaded every session (~0 cost). Could either embed all knowledge or just point to it.

**Decision**: CLAUDE.md contains only project identity, an index table, and loading/maintenance instructions. All actual knowledge lives in .ai/ files.

**Consequences**:
- CLAUDE.md stays small (~400 tokens) and stable (rarely needs updating)
- Adding new knowledge doesn't bloat the always-loaded context
- Requires one extra Read call per session to load _loading-rules.md

### ADR-003: Three-layer loading mechanism (2026-03-15)

**Context**: Loading all .ai/ files every session wastes tokens. Need a way to load selectively.

**Decision**: Three layers — L1 (always: CLAUDE.md), L2 (task-driven: relevant .ai/ docs), L3 (on-demand: source code).

**Inspiration**: Borrowed from the superpowers skill system's meta → summary → full content loading.

**Consequences**:
- Typical session overhead is ~4000-5000 tokens (~2.5% of 200K context)
- Agent must execute a decision tree to determine what to load
- Slightly more complex than "load everything" but scales much better

### ADR-004: Agent auto-maintenance with separate commits (2026-03-15)

**Context**: Knowledge docs must stay in sync with code. Manual maintenance is unreliable.

**Decision**: Agent automatically updates affected .ai/ docs after significant work. Updates committed separately from code changes.

**Consequences**:
- Knowledge stays fresh without human effort
- Separate commits allow humans to review knowledge updates independently
- Requires clear trigger rules to avoid noise

## Milestone Log

### 2026-03-15: Project Inception
- Defined core architecture and design principles
- Created initial .ai/ framework with templates
- AgentInfra uses its own system (self-documenting)
