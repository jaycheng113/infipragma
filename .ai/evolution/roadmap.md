---
name: Roadmap
description: Planned features and milestones for InfiPragma
layer: evolution
last_updated: 2026-03-15
---

# Roadmap

## Current Priority
Complete the core pipeline and validate with a real product build.

## Phase 1: Core Pipeline (Current)
- [x] Define three-phase architecture
- [x] Create all agent files (13 agents)
- [x] Create stack templates (6 stacks)
- [x] Create slash command skills (4 skills)
- [x] Bootstrap .ai/ knowledge layer
- [ ] End-to-end test: build a real product from idea to deployment

## Phase 2: Robustness
- [ ] Error recovery: agents should handle partial failures gracefully
- [ ] Multi-attempt judge: retry with targeted fixes before failing the stage
- [ ] Notification system: Telegram/email alerts at key milestones
- [ ] Session timeout handling: detect stalled agents

## Phase 3: Extensions
- [ ] Multi-product support: manage multiple products from one InfiPragma instance
- [ ] Custom stack templates: user-provided stack definitions
- [ ] Plugin system: hook into pipeline stages
- [ ] Analytics dashboard: build metrics and health over time
