# InfiPragma Deploy

## Context
Load: handoff.yaml, MEMORY.md, .ai/core/architecture.md. Confirm registry stage = S7.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Deploy the product and verify it is accessible.

### Step 1 — Read deployment config
- Read the stack configuration from `.claude/stacks/` for deployment instructions.
- Read registry.yaml for delivery_mode and stack.
- Determine the deployment target (e.g., Vercel, Netlify, Railway, npm publish, Docker).

### Step 2 — Build for production
- Run the production build command per the stack config.
- Verify the build completes without errors.

### Step 3 — Deploy
- Execute the deployment according to the stack's deployment instructions.
- Capture the live URL or access endpoint.

### Step 4 — Verify deployment
- Access the live URL/endpoint and confirm the application responds.
- Run a basic smoke test against the deployed version.

### Step 5 — Write DELIVERY.md
- Create `DELIVERY.md` in the project root with:
  - Product name
  - Live URL / access endpoint
  - Deployment platform
  - Deployment date
  - Stack used
  - How to access / use the product
  - How to redeploy

### Step 6 — Notify and finalize
- Update registry.yaml: set `phase: maintenance`, add `live_url` field.
- Inform the user that deployment is complete with the live URL.

## Required outputs (all mandatory)
- [ ] Production build completed successfully
- [ ] Deployment executed
- [ ] Live URL / endpoint verified accessible
- [ ] DELIVERY.md written
- [ ] registry.yaml updated with phase=maintenance and live_url

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER mark deployment complete without verifying the live URL is accessible.
- NEVER skip writing DELIVERY.md.
- NEVER deploy without a successful production build.
- NEVER proceed if the smoke test fails on the deployed version.
