# InfiPragma Build

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

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
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER implement more than ONE feature per session.
- NEVER change any field in feature_list.json other than the `passes` field.
- NEVER set passes=true without Puppeteer E2E confirmation.
- NEVER leave the session without a commit, PROGRESS.md update, and .ai/ drift check.
- NEVER skip running init.sh at session start.
- NEVER skip reverting on test failure — always revert before retry.
