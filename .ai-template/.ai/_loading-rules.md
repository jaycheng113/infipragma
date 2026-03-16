---
name: Loading Rules
description: Decision tree for determining which .ai/ documents to load based on task type
---

# Loading Decision Rules

## Overview

These rules guide the AI agent in deciding which .ai/ documents to load at the start of each task. The goal is to load enough context to work effectively while minimizing token usage.

## Step 1: Always Load Core Context

Every session starts with:
1. `CLAUDE.md` (auto-loaded)
2. `core/architecture.md` — understand the system structure

## Step 2: Classify the Task

Analyze the user's request and follow the matching path:

### Path A: Implement or Modify a Feature
- Load the target module's feature doc from `features/{module}.md`
- If modifying interfaces between modules, also load dependent modules' feature docs
- Budget: ≤ 3 feature docs

### Path B: Fix a Bug
- Load the feature doc for the module where the bug manifests
- Load `evolution/tech-debt.md` — check for known issues in that area
- Budget: ≤ 2 feature docs + tech-debt

### Path C: Refactor or Architecture Change
- Load `evolution/tech-debt.md` — understand existing debt
- Load `evolution/roadmap.md` — ensure alignment with planned direction
- Load relevant ADRs from `evolution/history.md`
- Load affected feature docs
- Budget: ≤ 5 documents total

### Path D: Add a New Feature from Scratch
- Load feature docs for adjacent/dependent modules
- Load `evolution/roadmap.md` — check alignment
- Load `core/principles.md` — ensure new feature follows design principles
- Budget: ≤ 3 documents

### Path E: Documentation, CI/CD, or Tooling
- Usually no additional loading needed
- Exception: if changes affect build/test, load relevant feature docs

## Step 3: Budget Check

- Estimate total lines of documents you are about to load
- If estimated total exceeds 1000 lines, prioritize:
  1. The single most relevant feature doc
  2. Directly referenced ADRs
  3. Tech debt entries for affected modules only
- Note what you chose not to load so the user can request it if needed

## Step 4: Report

After loading, briefly state:
"Loaded: [list]. Ready to proceed."
