---
name: "Pipeline"
description: "Build pipeline feature: S0-S7 stages, judge gates, registry-driven orchestration"
layer: feature
last_updated: 2026-03-15
---

# Pipeline

## Responsibility
Manages the progression of a product from idea to deployment through 8 stages (S0-S7), with judge gates between each stage.

## Stage Map
| Stage | Agent | Purpose |
|-------|-------|---------|
| S0 | infipragma-init | Read SPEC.md, bootstrap .ai/ and CLAUDE.md |
| S1 | infipragma-research | Competitive analysis, write MARKET.md |
| S2 | infipragma-delivery-mode | Choose output format + stack |
| S3 | infipragma-design | Generate feature_list.json (20+ features) |
| S4 | infipragma-scaffold | Create project, init.sh, first commit |
| S5 | infipragma-build | Build loop: one feature per session |
| S6 | infipragma-qa | Full regression + Lighthouse + security |
| S7 | infipragma-deploy | Deploy + write DELIVERY.md |

## Judge Gates
After each stage, infipragma-judge runs to validate outputs. Score < 7 = fail. Critical issues = fail. On fail: fix and re-run. On pass: advance to next stage.

## Source Files
- `.claude/agents/infipragma-*.md` — all agent files
- `.infipragma/meta/registry.yaml` — pipeline state
- `.infipragma/feature_list.json` — feature tracking

## Dependencies
- **Depends on**: AGENTS.md (orchestration), registry.yaml (state)
- **Used by**: all agent files
