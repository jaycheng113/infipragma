# /catchup — Fast Context Recovery

## Description
Quickly recovers full context of where the project stands, what was done, and what's next.

## Instructions

1. Read `CLAUDE.md` (should already be loaded)
2. Read `.infipragma/meta/registry.yaml` — get current phase and stage
3. Read `PROGRESS.md` — focus on the last 3 session entries
4. Read `.ai/_loading-rules.md` — follow decision tree to load relevant docs (max 4)
5. If phase is "build", also read `.infipragma/feature_list.json` for feature progress
6. If phase is "maintenance", also read `AUDIT.md` and `BACKLOG.md`

7. Present a concise summary:

```
## Context Recovery

**Phase**: {phase} | **Stage**: {current_stage}

### What's Been Done
{Summary from last 3 PROGRESS.md entries}

### Current State
{Key metrics: features passing, stage status, any blockers}

### What's Next
{Exact next action based on registry state}

### Blockers
{Any issues from PROGRESS.md or AUDIT.md, or "None"}
```

## Notes
- This is a read-only operation — it does not modify any files
- Use this at the start of a new session to get up to speed quickly
