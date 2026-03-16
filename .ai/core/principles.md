---
name: Design Principles
description: "Core principles: idea is product, prototype before build, git-style versioning, autonomous maintenance"
layer: core
last_updated: 2026-03-15
---

# Design Principles

## 1. Idea Is Product
One sentence starts everything. No technical decisions required from the user.
- User fills config.yaml with their idea
- All technical decisions are made by agents

## 2. Prototype Before Building
30-minute alignment session before 24-hour unattended build.
- Clarification Agent asks exactly 3 questions
- Clickable prototype generated for user approval
- SPEC.md locked before any code is written

## 3. Git-Style Product Versioning
Every change produces a product-level commit, not just a code diff.
- Commit format: `product: v{x.y.z} — {description}`
- Includes regression count: `Regression: {n}/{total} core features passing`

## 4. Autonomous Maintenance
After delivery, the product audits, fixes, and extends itself.
- Audit Agent: diagnosis only
- Fix Agent: patches issues
- Feature Agent: implements backlog items
- All maintenance ends with: git commit + .ai/ update + CHANGELOG entry

## 5. Agent Isolation
One agent, one task, one session.
- Never run two agents simultaneously
- Each agent reads context, does its job, commits, and hands off
- PROGRESS.md ensures continuity between sessions
