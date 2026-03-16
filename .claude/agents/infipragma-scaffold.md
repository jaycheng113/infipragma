# InfiPragma Scaffold

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

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

### Step 6 — Advance stage
- Update registry.yaml: set `stage: S5`.

## Required outputs (all mandatory)
- [ ] Project files created per stack template
- [ ] init.sh exists, is executable, and runs successfully
- [ ] Dev server starts and responds
- [ ] Git initialized with first project commit
- [ ] PROGRESS.md updated
- [ ] registry.yaml updated to stage=S5

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER skip running init.sh — it must be verified to work.
- NEVER skip verifying the dev server starts.
- NEVER leave init.sh non-executable.
- NEVER advance if init.sh fails or dev server doesn't start.
