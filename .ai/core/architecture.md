---
name: Architecture
description: "InfiPragma system design: agent pipeline, registry-driven orchestration, three phases"
layer: core
last_updated: 2026-03-15
---

# Architecture

## Overview

InfiPragma is a Claude Code harness that autonomously delivers a product from a user's idea. It uses a registry-driven agent pipeline with three phases: Prototype Validation, Build Pipeline, and Maintenance.

## System Diagram

```
User fills config.yaml
        ↓
Claude Code reads AGENTS.md
        ↓
AGENTS.md reads registry.yaml
        ↓
Route to correct agent (.claude/agents/)
        ↓
Agent executes → updates registry.yaml
        ↓
Loop until product is deployed + maintained
```

## Three Phases

### Phase 0: Prototype Validation (~30 min, user present)
- Clarification Agent: asks 3 questions
- Prototype Agent: generates clickable HTML prototype
- User approves → SPEC.md locked → phase changes to "build"

### Phase 1: Build Pipeline (~24hr, unattended)
- S0 Init → S1 Research → S2 DeliveryMode → S3 Design → S4 Scaffold → S5 BuildLoop → S6 QA → S7 Deploy
- Each stage has a Judge gate (pass/fail)
- S5 is a loop: one feature per session until all core features pass

### Phase 2: Maintenance (indefinite, unattended)
- Audit Agent: diagnosis only, writes AUDIT.md
- Feature Agent: implements BACKLOG.md items
- Fix Agent: resolves AUDIT.md issues

## Key Files

| File | Purpose |
|------|---------|
| AGENTS.md | Orchestration protocol — routes to agents |
| .infipragma/meta/registry.yaml | Pipeline state machine |
| .infipragma/config.yaml | User's idea + preferences |
| .infipragma/feature_list.json | All features with pass/fail status |
| PROGRESS.md | Session handoff log |
| .claude/agents/*.md | Agent instruction files |
| .claude/stacks/*.yaml | Technology stack templates |

## Design Decisions
1. Registry-driven: single YAML file controls all state transitions
2. One agent per session: prevents conflicts and enables clean git history
3. Judge gates: automated quality control between stages
4. Product-level commits: every change is a product version, not just code
