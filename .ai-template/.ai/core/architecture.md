---
name: Architecture
description: "AgentInfra system design: .ai/ directory structure, three-layer loading, maintenance protocol"
layer: core
last_updated: 2026-03-15
---

# Architecture

## Overview

AgentInfra is a convention-based system that uses structured .md files to give AI agents persistent project knowledge. There is no runtime, no database, no build step — just markdown files and a CLAUDE.md entry point.

## System Diagram

```
┌─────────────────────────────────────────────┐
│                  CLAUDE.md                   │
│          (L1: Always loaded, ~400 tk)        │
│  ┌─────────────┬────────────┬─────────────┐ │
│  │ Project ID  │ Index Table│ Load/Maint  │ │
│  │             │            │ Instructions│ │
│  └─────────────┴────────────┴─────────────┘ │
└──────────────────────┬──────────────────────┘
                       │ triggers loading
                       ▼
┌─────────────────────────────────────────────┐
│                   .ai/                       │
│           (L2: Task-driven loading)          │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │  core/   │  │features/ │  │evolution/ │ │
│  │ (stable) │  │(growing) │  │(timeline) │ │
│  └──────────┘  └──────────┘  └───────────┘ │
└──────────────────────┬──────────────────────┘
                       │ references
                       ▼
┌─────────────────────────────────────────────┐
│              Source Code                     │
│        (L3: On-demand via Read)              │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
.ai/
├── _loading-rules.md          # How to decide what to load
├── _maintenance-rules.md      # When and how to update docs
├── core/                      # Stable foundation knowledge
│   ├── architecture.md        # This file — system structure
│   ├── principles.md          # Design decision framework
│   └── tech-stack.md          # Languages, frameworks, dependencies
├── features/                  # Per-module knowledge (grows with project)
│   ├── _template.md           # Template for new feature docs
│   └── {feature}.md           # One per module/feature
├── evolution/                 # Project timeline and direction
│   ├── history.md             # Decision records and milestones
│   ├── roadmap.md             # What's planned
│   └── tech-debt.md           # Known issues and shortcuts
└── templates/                 # Document templates
    ├── adr.md                 # Architecture Decision Record template
    ├── claude-md.md           # CLAUDE.md template for adopting AgentInfra
    └── init-core.md           # Guide for bootstrapping the core layer
```

## Three-Layer Loading

| Layer | What | When | Budget |
|-------|------|------|--------|
| L1 | CLAUDE.md (index + instructions) | Every session, automatic | ~400 tokens |
| L2 | Relevant .ai/ documents | Task start, per decision tree | ~2000-4000 tokens |
| L3 | Source code files | When implementation details needed | On-demand |

Total typical session overhead: ~4000-5000 tokens (~2.5% of 200K context).

## Key Design Decisions

1. **CLAUDE.md is a router, not a database** — It points to knowledge, doesn't contain it
2. **Three subdirectories map to knowledge stability** — core (rarely changes) → features (grows) → evolution (appends)
3. **YAML frontmatter on every .ai/ file** — Enables future tooling without breaking current convention-only approach
4. **No central index file needed** — CLAUDE.md's inline table serves as the index
5. **Agent maintains, human reviews** — Updates happen automatically, committed separately for review

## Changelog

### 2026-03-15
- Initial architecture design
