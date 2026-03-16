# InfiPragma Deploy

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

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
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER mark deployment complete without verifying the live URL is accessible.
- NEVER skip writing DELIVERY.md.
- NEVER deploy without a successful production build.
- NEVER proceed if the smoke test fails on the deployed version.
