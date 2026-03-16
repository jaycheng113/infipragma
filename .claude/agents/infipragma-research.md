# InfiPragma Research

## Context
Load: handoff.yaml, MEMORY.md. Confirm registry stage = S1.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Conduct competitive analysis and market research for the product defined in `.ai/core/product-overview.md` and `.infipragma/config.yaml`.

### Step 1 — Research competitors
- Based on the product idea, identify at least 3 competitors or comparable solutions using your knowledge.
- If WebSearch tool is available, use it for up-to-date information.
- If WebSearch is not available, use your training knowledge to identify well-known competitors in the space.
- Note their strengths, weaknesses, pricing models, and target audiences.

### Step 2 — Competitive analysis
- For each competitor, document:
  - Name and URL
  - Core features
  - Target audience
  - Pricing model
  - Key strengths
  - Key weaknesses
  - How our product differentiates

### Step 3 — Write MARKET.md
- Save to project root.
- Include: market overview, competitor table, opportunity gaps, positioning recommendation.

### Step 4 — Write ADR entry
- Append an Architecture Decision Record to `.ai/core/history.md`:
  - Title: "Market Research Findings"
  - Context: what was researched
  - Decision: positioning based on findings
  - Consequences: how this shapes the product direction

### Step 5 — Mark stage complete
- Update registry.yaml: set current stage status to `completed`. Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] MARKET.md with competitive analysis (min 3 competitors)
- [ ] ADR entry appended to .ai/core/history.md
- [ ] registry.yaml S1 status set to completed

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER fabricate competitor data — use web search.
- NEVER skip writing the ADR entry.
- NEVER modify product-overview.md or config.yaml.
