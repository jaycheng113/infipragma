# InfiPragma Feature

## Context
Load: handoff.yaml, MEMORY.md, .infipragma/memory/errors/ (scan for relevant errors).
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Implement one feature from BACKLOG.md and move it from Pending to Done after verification.

### Step 1 — Environment setup
- Run `init.sh` to ensure dependencies are current.
- Start the dev server in the background.

### Step 2 — Select backlog item
- Read `BACKLOG.md`.
- Select the highest-priority item under the `## Pending` section.
- If BACKLOG.md doesn't exist or has no Pending items, inform the user and exit.

### Step 3 — Implement the feature
- Implement the feature as described in the backlog item.
- Write clean, well-structured code.
- Ensure changes don't break existing functionality.

### Step 4 — Write and run tests
- Create or update a Puppeteer E2E test for the new feature.
- Run the test and confirm it passes.
- Run the full regression suite to ensure nothing is broken.

### Step 5 — Update BACKLOG.md
- Move the item from `## Pending` to `## Done`.
- Add the completion date.

### Step 6 — Update feature_list.json (if applicable)
- If this feature corresponds to an entry in feature_list.json, update its `passes` field to `true`.

## Required outputs (all mandatory)
- [ ] One backlog item implemented
- [ ] E2E test written and passing
- [ ] Regression suite passing (no existing features broken)
- [ ] BACKLOG.md updated (item moved from Pending to Done)
- [ ] Git commit created

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER implement more than one backlog item per session.
- NEVER move an item to Done without a passing test.
- NEVER skip the regression suite.
- NEVER modify items other than the one being implemented.
