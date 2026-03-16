# InfiPragma Research

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

## Task
Conduct competitive analysis and market research for the product defined in SPEC.md.

### Step 1 — Web search
- Search for existing products, tools, and solutions in the same problem space.
- Identify at least 3 competitors or comparable solutions.
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

### Step 5 — Advance stage
- Update registry.yaml: set `stage: S2`.

## Required outputs (all mandatory)
- [ ] MARKET.md with competitive analysis (min 3 competitors)
- [ ] ADR entry appended to .ai/core/history.md
- [ ] registry.yaml updated to stage=S2

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER fabricate competitor data — use web search.
- NEVER skip writing the ADR entry.
- NEVER modify SPEC.md.
