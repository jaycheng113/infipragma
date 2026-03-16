# InfiPragma

**Have an idea. Chat with Claude Code. Get a product.**

InfiPragma is a set of `.md` files that guide Claude Code through a complete product delivery pipeline — from market research to deployment. You don't write code. You don't manage tasks. You just describe what you want to build, discuss it with Claude Code, and walk away.

---

## Proof: TodoApp

We gave InfiPragma two lines:

```yaml
idea: "A simple todo list web app with add, complete, and delete tasks"
hints: "use vanilla HTML/CSS/JS, no framework, single page"
```

It came back with this:

### The Product

A fully functional todo app — 3 source files, zero dependencies, works offline.

<p align="center">
  <img src="docs/screenshots/light.png" width="380" alt="Light mode">
  <img src="docs/screenshots/dark.png" width="380" alt="Dark mode">
</p>

| Feature Tier | Count | Includes |
|-------------|-------|----------|
| **Core** | 10 | Add, display, complete, delete, localStorage, input validation, unique IDs, empty state, keyboard submit, single-page layout |
| **Enhanced** | 9 | Filters (all/active/completed), task counter, clear completed, inline editing, responsive design, drag-and-drop reorder, JSON export/import, timestamps, select-all toggle |
| **Polish** | 6 | Dark mode, CSS animations, full accessibility (ARIA + screen reader), favicon + dynamic title, hover/focus states, print stylesheet |

**Lighthouse scores**: Performance 100 / Accessibility 96 / Best Practices 100 / SEO 90

Every feature has a Puppeteer E2E test. 25 features, 25 tests, 24 passing (1 known flaky due to Puppeteer double-click timing, not a product bug).

### The Competitive Analysis

Before writing a single line of code, InfiPragma researched the market and produced [`MARKET.md`](examples/todoapp/MARKET.md):

| Competitor | Strengths | Our Differentiation |
|-----------|-----------|-------------------|
| Todoist | Feature-rich, cross-platform | Zero dependencies, no account needed |
| Microsoft To Do | Microsoft ecosystem | Privacy-first, no tracking, offline-only |
| TickTick | Calendar integration, habits | Instant load, works as local file |
| Google Tasks | Gmail integration | No Google account, no data collection |
| TodoMVC | Reference implementation | Fully functional product, not just a demo |

Positioning: **independent + minimal** — the only todo app that works by opening a single HTML file.

### The Build Process

| Metric | Value |
|--------|-------|
| Total sessions | 47 |
| Build sessions (S5) | 25 — one feature per session, each with E2E test |
| Judge reviews | 8 — one per stage, all passed |
| Average judge score | 9.0 / 10 |
| Retries needed | 0 |
| Human intervention | 0 |

The entire pipeline — init, research, architecture, design, scaffold, 25 features, QA, deploy — ran unattended.

**Full output: [`examples/todoapp/`](examples/todoapp/)** — every file InfiPragma generated, including session logs, judge reports, feature list, architecture docs, and the product itself.

---

## How to Use

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- `ANTHROPIC_API_KEY` in your environment
- `yq` (`brew install yq`)

### The Workflow

```bash
git clone https://github.com/JayCheng113/InfiPragma.git
cd InfiPragma
```

Then open Claude Code and start talking:

```
You:   I want to build a personal finance tracker that categorizes expenses
       and shows monthly trends. Web app, mobile-friendly.

Claude: Let me understand your idea better...
        [asks clarifying questions, discusses trade-offs, refines the spec]

You:   Looks good, let's build it.

Claude: I'll run the InfiPragma pipeline now.
        [executes infipragma.sh, autonomously delivers the product]
```

That's it. **You bring the idea, Claude Code does everything else.**

The key advantage of working through Claude Code: when the pipeline encounters issues — a test fails, a dependency breaks, an agent produces incomplete output — **Claude Code diagnoses and fixes it automatically**. It reads the error, understands the context, patches the `.md` instructions or the generated code, and continues. You don't debug. You don't intervene. You plan.

---

## How It Works

13 Markdown files define 13 agents. A bash script reads the pipeline state, picks the right `.md` file, and feeds it to Claude Code in headless mode.

```
Your Idea
   |
   v
+------------------------------------------------------+
|                   infipragma.sh                       |
|                                                       |
|  Read registry.yaml -> Pick .md agent -> claude -p    |
|                                                       |
|  +--------+  +--------+  +--------+  +---------+     |
|  |Research|->| Design |->| Build  |->| Deploy  |     |
|  |  .md   |  |  .md   |  |  .md   |  |   .md   |     |
|  +---+----+  +---+----+  +---+----+  +----+----+     |
|      v           v           v            v           |
|   +-----+     +-----+    +-----+      +-----+        |
|   |Judge|     |Judge|    |Judge|      |Judge|        |
|   | .md |     | .md |    | .md |      | .md |        |
|   +-----+     +-----+    +-----+      +-----+        |
+------------------------------------------------------+
   |
   v
Deployed Product
```

| Stage | What Happens |
|-------|-------------|
| S0 Init | Set up project knowledge base and architecture docs |
| S1 Research | Market research, competitive analysis |
| S2 Delivery Mode | Choose tech stack and deployment strategy |
| S3 Design | Generate prioritized feature list |
| S4 Scaffold | Create project skeleton and dev environment |
| S5 Build | Implement features one at a time, each with E2E test |
| S6 QA | Regression testing, Lighthouse audit, security scan |
| S7 Deploy | Build, deploy, verify |

Every stage must pass a judge review (score 7+/10) before advancing. The judge is also a `.md` file.

### What's Inside an Agent?

Structured natural language. Here's the essence of `infipragma-build.md`:

```markdown
## Task
Implement one feature per session using a build-test loop.

### Step 2 — Select next feature
- Read feature_list.json.
- Find the highest-priority feature where passes is false.

### Step 5b — Error feedback loop
- Write the error to .infipragma/memory/errors/{error-id}.md
- Check errors/ for similar past errors
- If found: apply the documented fix approach
- If new: diagnose, fix, document for future reference

## Hard rules
- NEVER implement more than ONE feature per session.
- NEVER set passes=true without E2E test confirmation.
```

Want to change how builds work? Edit the text. No recompile, no framework to learn.

---

## Current Status

InfiPragma's core pipeline — the 13 agent `.md` files and the orchestrator — is functional and proven end-to-end (see TodoApp demo above).

The following features exist in `infipragma.sh` but are **not yet fully tested**:

| Feature | Status |
|---------|--------|
| Webhook notifications | Code exists, not validated |
| Budget tracking / cost limits | Code exists, not validated |
| Docker sandbox (`--sandbox`) | Dockerfile exists, not validated |
| Git rollback on judge failure | Tags created, rollback not tested |
| Crash recovery | Lock file logic exists, not tested |

These are secondary to the core value: **the `.md` content that guides Claude Code is the product**. The bash script is just glue.

---

## Inspired By

[Claude Code Superpowers](https://github.com/obra/superpowers) proved that `.md` files can reliably control AI behavior — TDD, code review, architectural planning. InfiPragma asks: what if the entire product delivery process was a set of skills?

## License

MIT
