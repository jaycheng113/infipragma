# InfiPragma Deploy

## Context
Load: handoff.yaml, MEMORY.md, .ai/core/architecture.md. Confirm registry stage = S7.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Deploy the product and verify it is accessible.

### Step 1 — Read deployment config
- Read `.ai/core/architecture.md` for deployment strategy.
- Read registry.yaml for delivery_mode and stack.
- Check if deployment credentials/CLI tools are available (e.g., `netlify`, `vercel`, `gh-pages`).
- If no deployment platform is configured or available, use **local deployment mode** (see Step 3b).

### Step 2 — Build for production
- If the stack has a build command: run it and verify no errors.
- If no build step (e.g., vanilla HTML/CSS/JS): verify all source files exist and are valid.
- Run the dev server and confirm the app loads correctly via HTTP.

### Step 3a — Deploy (if platform available)
- Execute the deployment according to the stack's deployment instructions.
- Capture the live URL or access endpoint.

### Step 3b — Local deployment (if no platform available)
- Create a `dist/` directory with all production-ready files.
- Verify the app works when served from `dist/` via a local HTTP server.
- Set `live_url` to `file://{project_root}/dist/index.html` or `http://localhost:{port}`.
- Note in DELIVERY.md that this is a local deployment ready for any static host.

### Step 4 — Verify deployment
- If remote: access the live URL and confirm the application responds.
- If local: serve from `dist/` and confirm HTTP 200 + basic content check.
- Run a basic smoke test against the served version.

### Step 5 — Write DELIVERY.md
- Create `DELIVERY.md` in the project root with:
  - Product name
  - Live URL / access endpoint
  - Deployment platform (or "Local / Ready for static hosting")
  - Deployment date
  - Stack used
  - How to access / use the product
  - How to redeploy

### Step 6 — Mark stage complete
- If deployment succeeds and smoke test passes: set current stage status to `completed`.
- If deployment or smoke test fails: attempt to diagnose and fix (up to 3 attempts), then set status to `completed` regardless. Document failures in DELIVERY.md — the judge will decide whether to pass or retry.
- Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] Production build verified (or source files validated for no-build stacks)
- [ ] Deployment executed (remote or local dist/)
- [ ] App verified accessible via HTTP
- [ ] DELIVERY.md written
- [ ] registry.yaml S7 status set to completed

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER skip writing DELIVERY.md.
- NEVER deploy without verifying the production build or source files.
- ALWAYS set status to "completed" when session ends — even if deployment had issues. The judge decides pass/retry.
