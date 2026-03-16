---
name: Development History
description: Key decisions and architecture decision records for InfiPragma
layer: evolution
last_updated: 2026-03-15
---

# Development History

## Architecture Decision Records

### ADR-001: Registry-driven agent orchestration (2026-03-15)
**Context**: Need a way to coordinate multiple agents across a multi-stage pipeline without a server.
**Decision**: Use a single registry.yaml file as the state machine. AGENTS.md reads it and routes to the correct agent.
**Consequences**: Simple, stateless, git-friendly. But requires strict discipline — agents must update registry.yaml correctly.

### ADR-002: One agent per session (2026-03-15)
**Context**: Multiple agents running simultaneously could cause conflicts in shared files.
**Decision**: Enforce one agent per session. Each agent reads context, does its job, commits, and hands off via PROGRESS.md.
**Consequences**: Clean git history, no merge conflicts, clear accountability. But slower than parallel execution.

### ADR-003: Judge gates between stages (2026-03-15)
**Context**: Need quality control to prevent bad outputs from cascading through the pipeline.
**Decision**: Run infipragma-judge after each stage. Score-based pass/fail with specific criteria per transition.
**Consequences**: Higher quality output, automated retry on failure. Adds one extra session per stage.

### ADR-004: Puppeteer E2E for feature verification (2026-03-15)
**Context**: Need to verify features actually work, not just that code compiles.
**Decision**: Each feature in feature_list.json has a steps array. Build agent writes Puppeteer tests using these steps. Only mark passes=true after Puppeteer confirms.
**Consequences**: Real verification, catches UI/integration bugs. Requires headless browser setup in scaffold stage.

## Milestone Log

### 2026-03-15: Project Inception
- Defined three-phase pipeline architecture
- Created all agent files, stack templates, and skills
- Bootstrapped .ai/ knowledge layer
