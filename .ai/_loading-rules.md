---
name: Loading Rules
description: Decision tree for which .ai/ documents to load based on task type
---

# Loading Decision Rules

## Step 1: Always Load
1. CLAUDE.md (auto-loaded)
2. AGENTS.md (orchestration protocol)

## Step 2: Classify Task

### Path A: Pipeline Orchestration (most common)
- Read registry.yaml to determine current phase/stage
- Load the relevant agent file from .claude/agents/
- Load PROGRESS.md for session continuity
- Budget: agent file + 2 context docs max

### Path B: Agent Development / Modification
- Load core/architecture.md — understand the pipeline
- Load the specific agent file being modified
- Load features/pipeline.md — understand stage transitions
- Budget: ≤ 3 docs

### Path C: Stack / Scaffold Work
- Load core/tech-stack.md — understand available stacks
- Load the relevant .claude/stacks/ template
- Budget: ≤ 2 docs

### Path D: Maintenance Work
- Load features/maintenance.md
- Load AUDIT.md or BACKLOG.md as relevant
- Budget: ≤ 3 docs

### Path E: Knowledge Base / Documentation
- Load core/principles.md
- Load _maintenance-rules.md
- Budget: ≤ 2 docs

## Step 3: Budget Check
- Max 4 .ai/ documents per session (CLAUDE.md counts as 1)
- If exceeding budget, prioritize: agent file > architecture > task-specific docs

## Step 4: Report
After loading, state: "Loaded: [list]. Ready to proceed."
