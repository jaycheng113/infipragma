# InfiPragma Design

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

## Task
Generate a comprehensive feature list that defines every feature the product will have.

### Step 1 — Analyze inputs
- Read SPEC.md for product requirements and acceptance criteria.
- Read MARKET.md for competitive positioning and opportunity gaps.
- Read .ai/core/architecture.md for stack constraints.

### Step 2 — Generate feature_list.json
- Create `feature_list.json` in the project root.
- Include 20+ features minimum.
- Each feature is an object with these fields:
  - `id` — unique string identifier (e.g., "auth-login", "dashboard-chart")
  - `category` — one of: `core`, `enhanced`, `polish`
  - `priority` — integer, lower = higher priority (1 is highest)
  - `module` — which code module/area this belongs to
  - `description` — clear one-line description of the feature
  - `steps` — array of implementation steps (strings)
  - `passes` — boolean, always set to `false`

### Step 3 — Categorize features
- **core** — essential for MVP, product unusable without these.
- **enhanced** — significantly improves UX or capability, but product works without them.
- **polish** — visual refinement, micro-interactions, nice-to-haves.

### Step 4 — Prioritize
- All `core` features should have the lowest priority numbers.
- Within each category, order by dependency (foundations first).

### Step 5 — Advance stage
- Update registry.yaml: set `stage: S4`.

## Required outputs (all mandatory)
- [ ] feature_list.json with 20+ features
- [ ] Every feature has all required fields (id, category, priority, module, description, steps, passes)
- [ ] All passes fields set to false
- [ ] Features categorized as core/enhanced/polish
- [ ] Features prioritized (lower number = higher priority)
- [ ] registry.yaml updated to stage=S4

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER set any passes field to true — all must be false.
- NEVER generate fewer than 20 features.
- NEVER omit any required field from a feature object.
- NEVER skip reading SPEC.md and MARKET.md before generating features.
