# InfiPragma Build

## Context
Load: handoff.yaml, MEMORY.md, .infipragma/memory/errors/ (scan for relevant errors). Confirm registry stage = S5.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Implement one feature per session using a build-test loop with Puppeteer E2E verification.

### Step 1 — Environment setup
- Run `init.sh` to ensure dependencies are current and the dev environment is ready.
- Start the dev server in the background.

### Step 2 — Select next feature
- Read `feature_list.json`.
- Find the highest-priority feature where `passes` is `false`.
- This is the feature to implement in this session.

### Step 3 — Implement the feature
- Follow the feature's `steps` array for implementation guidance.
- Write clean, well-structured code in the appropriate `module`.
- Ensure changes don't break existing passing features.

### Step 4 — Write Puppeteer E2E test
- Create or update a Puppeteer test that verifies the feature works end-to-end.
- The test must interact with the running application (not mock data).
- Test should validate the feature's core behavior as described in its `description`.

### Step 5 — Run E2E test
- Execute the Puppeteer test against the running dev server.
- **If PASS**: proceed to Step 6.
- **If FAIL**: revert the implementation changes, analyze the failure, and retry from Step 3 (max 3 retries).
- **If all 3 retries fail**: skip this feature, do NOT set passes=true. Document the failure in PROGRESS.md and proceed to Session end. The next session will attempt the same feature with fresh context.

### Step 5b — Error feedback loop
- If the test failed, before retrying:
  1. Write the error to `.infipragma/memory/errors/{error-id}.md` with format:
     ```
     # Error: {short-id}
     ## Symptom
     {error message or test output}
     ## Root cause
     {what caused it}
     ## Fix
     {what fixed it}
     ## Related features
     {feature id}
     ```
  2. Check `.infipragma/memory/errors/` for similar past errors
  3. If a similar error was previously resolved: apply the documented fix approach
  4. If this is a new error: diagnose from scratch, then document for future reference
  5. Retry from Step 3 with the learned context

### Step 6 — Mark feature as passing
- Update `feature_list.json`: set `passes: true` for this feature only.
- Do NOT change any other field in feature_list.json.

### Step 7 — Commit and update
- Git commit with message: `feat: implement {feature.id} — {feature.description}`
- Update PROGRESS.md with what was built and tested.
- Perform .ai/ drift check: if the module this feature belongs to has changed significantly, update the relevant .ai/ doc.

## Required outputs (all mandatory)
- [ ] One feature implemented
- [ ] Puppeteer E2E test written and passing
- [ ] feature_list.json updated (only passes field changed to true)
- [ ] Git commit created
- [ ] PROGRESS.md updated
- [ ] .ai/ drift check performed

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml:
   - Count core features with `passes: true` in feature_list.json
   - If ALL core features pass: set stage status to `completed`
   - If NOT all core features pass: set stage status to `in_progress`
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER implement more than ONE feature per session.
- NEVER change any field in feature_list.json other than the `passes` field.
- NEVER set passes=true without Puppeteer E2E confirmation.
- NEVER leave the session without a commit, PROGRESS.md update, and .ai/ drift check.
- NEVER skip running init.sh at session start.
- NEVER skip reverting on test failure — always revert before retry.
