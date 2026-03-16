# InfiPragma

**Markdown files are all you need.**

InfiPragma is an autonomous product delivery engine built entirely from `.md` files. One sentence in, one deployed product out — no framework, no SDK, no abstractions.

```yaml
idea: "A simple todo list web app with add, complete, and delete tasks"
hints: "use vanilla HTML/CSS/JS, no framework, single page"
```

47 autonomous sessions later:

```
S0  Init           [PASSED]     S4  Scaffold       [PASSED]
S1  Research       [PASSED]     S5  Build          [PASSED]  25/25 features
S2  DeliveryMode   [PASSED]     S6  QA             [PASSED]  Lighthouse 100/96/100/90
S3  Design         [PASSED]     S7  Deploy         [PASSED]
```

A working todo app with dark mode, drag-and-drop, animations, accessibility, 25 Puppeteer E2E tests — all generated autonomously. **See the full output in [`examples/todoapp/`](examples/todoapp/).**

---

## The Idea

[Claude Code Superpowers](https://github.com/obra/superpowers) proved that a single `.md` file can make an AI follow complex workflows — TDD, code review, architectural planning — as reliably as hand-coded logic.

InfiPragma pushes this to its conclusion: **if one `.md` file can guide one task, can a system of `.md` files deliver an entire product?**

13 Markdown files define 13 specialized agents. A 400-line bash script chains them together. That's the whole system.

```
Traditional Agent Framework          InfiPragma
─────────────────────────           ──────────
Python classes                      Markdown files
Event handlers                      Step-by-step instructions
Plugin APIs                         Plain text
pip install + config                git clone
"Read the docs"                     Read the .md — it IS the agent
```

| System | Agent Defined By | To Modify It |
|--------|-----------------|--------------|
| OpenHands | Python classes + event handlers | Write Python |
| SWE-agent | Python + ACI config | Write Python |
| AI Scientist | Python pipeline | Write Python |
| Devin | Closed source | You can't |
| **InfiPragma** | **`.md` files** | **Edit text** |

---

## How It Works

```
Your Idea
   |
   v
+------------------------------------------------------+
|                   infipragma.sh                       |
|         (400 lines of bash — the only code)           |
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
|                                                       |
|  +-----------------------------------------------+   |
|  |  Memory (.md files for cross-session state)    |   |
|  +-----------------------------------------------+   |
+------------------------------------------------------+
   |
   v
Deployed Product + Maintenance Mode
```

### The Pipeline

| Stage | Agent | What Happens |
|-------|-------|-------------|
| S0 | `infipragma-init.md` | Project knowledge base, architecture docs |
| S1 | `infipragma-research.md` | Market research, competitive analysis |
| S2 | `infipragma-delivery-mode.md` | Choose stack and deployment strategy |
| S3 | `infipragma-design.md` | Feature list with priorities and categories |
| S4 | `infipragma-scaffold.md` | Project skeleton, dev environment |
| S5 | `infipragma-build.md` | Implement features one by one with E2E tests |
| S6 | `infipragma-qa.md` | Regression, Lighthouse, security audit |
| S7 | `infipragma-deploy.md` | Build, deploy, verify |

Every stage is validated by `infipragma-judge.md` — a quality gate that scores the work 0-10 and blocks progression if quality is below 7.

---

## Demo: TodoApp

The [`examples/todoapp/`](examples/todoapp/) directory contains the complete output of an InfiPragma run. Everything in it was generated autonomously from the two-line config above.

### What Was Built

- **3 files**: `index.html` (59 lines), `style.css` (685 lines), `app.js` (511 lines)
- **Zero dependencies** — no npm, no framework, no build step
- **25 features** across 3 tiers:
  - **Core (10)**: CRUD, localStorage, validation, unique IDs, empty state, Enter submit
  - **Enhanced (9)**: filters, task counter, clear completed, inline edit, responsive, drag-and-drop, export/import JSON, timestamps, select-all toggle
  - **Polish (6)**: dark mode, animations, accessibility (ARIA + screen reader), favicon + dynamic title, hover states, print styles
- **25 Puppeteer E2E tests** — one per feature
- **Lighthouse**: Performance 100, Accessibility 96, Best Practices 100, SEO 90

### What Was Generated Along the Way

| File | What It Is |
|------|-----------|
| `MARKET.md` | Competitive analysis (5 competitors: Todoist, Microsoft To Do, TickTick, Google Tasks, TodoMVC) |
| `feature_list.json` | 25 features with priorities, categories, modules, steps, pass/fail status |
| `QA-REPORT.md` | Full QA sweep results |
| `JUDGE-REPORT.yaml` | Final judge verdict (9/10 PASS) |
| `DELIVERY.md` | Deployment instructions |
| `PROGRESS.md` | 323-line log of every session |
| `.ai/core/` | Architecture docs, glossary, product overview, decision history |
| `.infipragma/memory/` | Session logs, error patterns, handoff state |

### Pipeline Stats

| Metric | Value |
|--------|-------|
| Total sessions | 47 |
| S5 Build sessions | 25 (one per feature) |
| Judge reviews | 8 (one per stage) |
| Judge pass rate | 8/8 (100%) |
| Average judge score | 9.0/10 |
| Retries needed | 0 |

---

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- `ANTHROPIC_API_KEY` set in your environment
- `yq` installed (`brew install yq`)

### 3 Steps

```bash
# 1. Clone
git clone https://github.com/JayCheng113/InfiPragma.git
cd InfiPragma

# 2. Describe your idea
vim .infipragma/config.yaml
# -> Fill in "idea" and optional "hints"

# 3. Launch
chmod +x infipragma.sh
./infipragma.sh
```

The prototype phase requires your input — InfiPragma asks clarifying questions and shows a prototype for approval. Once approved, everything else is autonomous.

---

## Project Structure

```
InfiPragma/
├── infipragma.sh              <- The only code (400-line bash orchestrator)
├── CLAUDE.md                  <- Entry point for Claude Code
├── AGENTS.md                  <- Pipeline protocol
|
├── .claude/agents/            <- 13 agents (pure .md)
|   ├── infipragma-init.md
|   ├── infipragma-research.md
|   ├── infipragma-design.md
|   ├── infipragma-build.md
|   ├── infipragma-judge.md
|   └── ...8 more
|
├── .infipragma/
|   ├── config.yaml            <- Your idea + preferences
|   ├── meta/
|   |   ├── registry.yaml      <- Pipeline state machine
|   |   └── handoff.yaml       <- Session-to-session continuity
|   └── memory/
|       ├── MEMORY.md          <- Long-term project memory
|       ├── errors/            <- Learned error patterns
|       └── sessions/          <- Per-session logs
|
├── .ai/                       <- Knowledge base (generated)
|
└── examples/
    └── todoapp/               <- Complete demo output
```

### What's Inside an Agent?

Each `.md` file is structured natural language — no code, no config, no schema. Here's the core of `infipragma-build.md`:

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

The `.md` file IS the agent.

---

## Safety

| Mechanism | How |
|-----------|-----|
| **Judge gates** | Every stage scores 7+/10 to advance |
| **Budget limits** | Per-session and total caps |
| **Git safety net** | Every attempt tagged for rollback |
| **Max retries** | 3 failures = blocked + notification |
| **Docker sandbox** | Optional `--sandbox` mode |
| **Crash recovery** | Detects incomplete sessions, resumes |
| **Error memory** | Learns from mistakes across sessions |

---

## CLI

```bash
./infipragma.sh              # Run the full pipeline
./infipragma.sh --status     # View pipeline progress
./infipragma.sh --once       # Run one session only
./infipragma.sh --dry-run    # Show next action without executing
./infipragma.sh --sandbox    # Run in Docker container
```

---

## Configuration

```yaml
# .infipragma/config.yaml
idea: "Your product idea in one sentence"
hints: "optional tech preferences"

budget:
  max_total_usd: 100
  max_per_session_usd: 15

notify:
  webhook: "https://hooks.slack.com/..."  # optional

sandbox:
  enabled: false
```

---

## Inspired By

[Claude Code Superpowers](https://github.com/obra/superpowers) — where `.md` files turn Claude Code into a disciplined engineer following TDD, code review, and planning workflows. InfiPragma asks: what if the entire product delivery process was a skill?

## License

MIT

---

<p align="center">
<b>Markdown files are all you need.</b><br>
<i>No framework. No SDK. No abstractions. Just .md files that deliver products.</i>
</p>
