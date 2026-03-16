# InfiPragma Scaffold

## Context
Load: handoff.yaml, MEMORY.md, .ai/core/tech-stack.md. Confirm registry stage = S4.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Create the project scaffold from the selected stack template and ensure the dev environment works.

### Step 1 — Read stack template
- Read the stack configuration from `.claude/stacks/` as recorded in registry.yaml.
- Identify the project template, dependencies, and configuration files needed.

### Step 2 — Create project structure
- Generate all directories and files according to the stack template.
- Include: source directories, config files, package manifests, .gitignore, etc.
- Place source files in the correct locations per the stack's conventions.

### Step 3 — Write init.sh
- Create `init.sh` in the project root.
- The script must:
  - Install all dependencies (e.g., `npm install`, `pip install -r requirements.txt`).
  - Perform any required setup steps (e.g., database init, env file creation).
  - Be executable (`chmod +x init.sh`).
  - Exit with code 0 on success, non-zero on failure.
  - Work on a fresh clone (no assumptions about pre-existing state).

### Step 4 — Run init.sh and verify
- Execute init.sh and confirm it completes successfully.
- Start the dev server and confirm it responds (e.g., curl localhost or check process).
- Stop the dev server after verification.

### Step 5 — Git init and first commit
- Run `git init` if not already initialized.
- Create the first project commit with all scaffold files.

### Step 6 — Mark stage complete
- If init.sh succeeds and dev server starts: set current stage status to `completed`.
- If init.sh or dev server fails: attempt to diagnose and fix (up to 3 attempts), then set status to `completed` regardless. Document failures in PROGRESS.md — the judge will decide whether to pass or retry.
- Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] Project files created per stack template
- [ ] init.sh exists, is executable, and runs successfully
- [ ] Dev server starts and responds
- [ ] Git initialized with first project commit
- [ ] PROGRESS.md updated
- [ ] registry.yaml S4 status set to completed

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER skip running init.sh — it must be verified to work.
- NEVER skip verifying the dev server starts.
- NEVER leave init.sh non-executable.
- ALWAYS set status to "completed" when session ends — even if there were issues. The judge decides pass/retry.
