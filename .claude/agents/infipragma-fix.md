# InfiPragma Fix

## Context
Load: handoff.yaml, MEMORY.md, .infipragma/memory/errors/ (scan for relevant errors).
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Fix one issue from AUDIT.md and verify the fix resolves the problem.

### Step 1 — Environment setup
- Run `init.sh` to ensure dependencies are current.
- Start the dev server in the background.

### Step 2 — Select issue
- Read `AUDIT.md`.
- Select the highest-severity unresolved issue.
- If no unresolved issues exist, inform the user and exit.

### Step 3 — Diagnose
- Understand the root cause of the issue.
- Identify the files and code that need to change.
- Plan the fix before writing code.

### Step 4 — Implement the fix
- Apply the minimal change needed to resolve the issue.
- Avoid scope creep — fix only the selected issue.

### Step 5 — Verify the fix
- Run the specific test or check that validates the issue is resolved:
  - Regression issue: run the failing E2E test and confirm it passes.
  - Lighthouse issue: run Lighthouse and confirm the score improved.
  - Security issue: run npm audit and confirm the vulnerability is resolved.
  - Linter issue: run linter and confirm the error is gone.
  - .ai/ drift: update the .ai/ doc and confirm it matches the code.

### Step 6 — Run regression suite
- Run all E2E tests to ensure the fix didn't break anything else.

### Step 7 — Update AUDIT.md
- Mark the issue as resolved with the fix date and description of the fix.

## Required outputs (all mandatory)
- [ ] One issue fixed
- [ ] Fix verified (specific check passes)
- [ ] Regression suite passes (no new breakage)
- [ ] AUDIT.md updated (issue marked resolved)
- [ ] Git commit created

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER fix more than one issue per session.
- NEVER mark an issue resolved without verification.
- NEVER skip the regression suite after fixing.
- NEVER introduce new issues while fixing an existing one.
