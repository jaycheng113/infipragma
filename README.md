# InfiPragma

**Markdown files are all you need.**

Every AI coding agent out there is built with Python frameworks, TypeScript SDKs, and complex abstractions. InfiPragma takes a radically different approach: the entire system is just `.md` files.

13 Markdown files define 13 specialized agents. A shell script chains them together. That's the whole thing. No framework. No dependencies. No vendor lock-in. Just text files that tell Claude Code what to do — and it does it, autonomously, from your idea to a deployed product.

```
idea: "A real-time collaborative whiteboard for remote teams"
```

One sentence in. One deployed product out.

---

## The Insight

Claude Code's [Superpowers skills](https://github.com/anthropics/claude-code-superpowers) proved something powerful: a well-written `.md` file can make an AI follow complex workflows as reliably as hand-coded logic. Skills like `test-driven-development.md` and `brainstorming.md` turn Claude Code into a disciplined engineer — no code required, just precise natural language instructions.

InfiPragma pushes this to its logical conclusion: **if one `.md` file can guide one task, can a system of `.md` files deliver an entire product?**

The answer is yes.

```
Traditional Agent Framework          InfiPragma
─────────────────────────           ──────────
Python classes                      Markdown files
Event handlers                      Step-by-step instructions
Plugin APIs                         Plain text
pip install + config                git clone
"Read the docs"                     Read the .md — it IS the agent
```

### Why This Matters

Every other autonomous agent requires you to be a developer to understand, modify, or debug it:

| System | Agent Defined By | To Modify It |
|--------|-----------------|--------------|
| OpenHands | Python classes + event handlers | Write Python |
| SWE-agent | Python + ACI config | Write Python |
| AI Scientist | Python pipeline | Write Python |
| Devin | Closed source | You can't |
| **InfiPragma** | **`.md` files** | **Edit text** |

Want to change how the Build agent handles test failures? Open `infipragma-build.md`, find "Step 5b", edit the text. Done. No recompile, no redeploy, no understanding a framework.

---

## How It Works

A 400-line bash script reads the pipeline state, picks the right `.md` file, feeds it to Claude Code in headless mode, and loops. The intelligence lives entirely in the Markdown.

```
Your Idea
   │
   ▼
┌──────────────────────────────────────────────────────┐
│                   infipragma.sh                      │
│          (400 lines of bash — the only code)          │
│                                                      │
│  Read state → Pick .md agent → claude -p → Loop      │
│                                                      │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐  │
│  │Research│→ │  Design  │→ │ Build  │→ │ Deploy  │  │
│  │  .md   │  │   .md    │  │  .md   │  │   .md   │  │
│  └────┬───┘  └────┬─────┘  └───┬────┘  └────┬────┘  │
│       ▼           ▼            ▼             ▼       │
│    ┌─────┐     ┌─────┐     ┌─────┐      ┌─────┐    │
│    │Judge│     │Judge│     │Judge│      │Judge│    │
│    │ .md │     │ .md │     │ .md │      │ .md │    │
│    └─────┘     └─────┘     └─────┘      └─────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Memory (.md files for cross-session state)  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
   │
   ▼
Live Product + Maintenance Mode
```

### The Pipeline

| Stage | Agent (.md file) | What Happens |
|-------|-----------------|-------------|
| S0 | `infipragma-init.md` | Project setup, architecture docs |
| S1 | `infipragma-research.md` | Market research, feasibility, API discovery |
| S2 | `infipragma-delivery-mode.md` | Choose deployment strategy |
| S3 | `infipragma-design.md` | System architecture, component design |
| S4 | `infipragma-scaffold.md` | Project skeleton, dependencies, dev environment |
| S5 | `infipragma-build.md` | Implement features one by one with E2E tests |
| S6 | `infipragma-qa.md` | Full test suite, linting, final validation |
| S7 | `infipragma-deploy.md` | Build, deploy, verify live URL |

Every stage is validated by `infipragma-judge.md` — a quality gate that scores the work (0-10) and blocks progression if quality is below 7. No cutting corners.

---

## Quick Start

### Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- `ANTHROPIC_API_KEY` set in your environment
- `yq` installed (`brew install yq`)

### 3 Steps

```bash
# 1. Clone
git clone https://github.com/JayCheng113/InfiPragma.git
cd InfiPragma

# 2. Describe your idea
vim .infipragma/config.yaml
# → Fill in the "idea" field

# 3. Launch
chmod +x infipragma.sh
./infipragma.sh
```

The first phase (prototype) requires your input — InfiPragma asks clarifying questions and shows a prototype for approval:

```bash
claude  # Interactive mode for prototype phase
```

Once approved, everything else is autonomous:

```bash
./infipragma.sh  # Hands-off from here
```

---

## .md-Driven Architecture

The entire system is transparent. Every decision the AI makes is guided by text you can read.

```
InfiPragma/
├── infipragma.sh              ← The only code (bash orchestrator)
├── CLAUDE.md                  ← Entry point — tells Claude Code how to start
├── AGENTS.md                  ← Pipeline protocol — how agents chain together
│
├── .claude/agents/            ← The 13 agents (pure .md)
│   ├── infipragma-init.md         "Set up the project like this..."
│   ├── infipragma-research.md     "Research the market like this..."
│   ├── infipragma-design.md       "Design the architecture like this..."
│   ├── infipragma-build.md        "Build one feature at a time like this..."
│   ├── infipragma-judge.md        "Score the work against these criteria..."
│   └── ...8 more
│
├── .infipragma/
│   ├── config.yaml            ← Your idea + preferences
│   ├── meta/
│   │   ├── registry.yaml      ← Pipeline state (what stage we're on)
│   │   └── handoff.yaml       ← What the last session did, what's next
│   └── memory/
│       ├── MEMORY.md          ← What the project has learned so far
│       ├── errors/            ← Mistakes made and how they were fixed
│       └── sessions/          ← Log of every session
│
└── .ai/                       ← Knowledge base (generated during pipeline)
    ├── architecture.md
    ├── tech-stack.md
    └── ...
```

### What's Inside an Agent?

Each agent `.md` file is structured natural language. Here's the essence of `infipragma-build.md`:

```markdown
## Context
Load: handoff.yaml, MEMORY.md, errors/ (scan for relevant errors).
Confirm registry stage = S5.

## Task
Implement one feature per session using a build-test loop.

### Step 1 — Environment setup
- Run init.sh to ensure dependencies are current.
- Start the dev server in the background.

### Step 2 — Select next feature
- Read feature_list.json.
- Find the highest-priority feature where passes is false.

### Step 3 — Implement the feature
...

### Step 5b — Error feedback loop
- Write the error to .infipragma/memory/errors/{error-id}.md
- Check errors/ for similar past errors
- If found: apply the documented fix approach
- If new: diagnose, fix, document for future reference

## Hard rules
- NEVER implement more than ONE feature per session.
- NEVER set passes=true without E2E test confirmation.
```

No abstractions. No indirection. The `.md` file IS the agent.

---

## How It Compares

### vs. Framework-Based Agents (OpenHands, SWE-agent)

They solve single tasks (fix a bug, resolve an issue). InfiPragma delivers complete products through an 8-stage pipeline. They require Python to customize. InfiPragma requires a text editor.

### vs. Session Loopers (continuous-claude, claude-loop)

They're `while true → claude → commit` — no structure, no quality gates, no memory. InfiPragma has staged progression, judge validation, error learning, and crash recovery.

### vs. Devin

Closest in ambition, but closed-source and $20/month. InfiPragma is open, transparent, and customizable. You can read every instruction the AI follows.

### vs. AI Scientist / AutoResearch

Narrow scope (papers / ML experiments). InfiPragma is general-purpose product delivery.

### The Real Difference

Every other system encodes agent behavior in code. Code is opaque to non-developers, brittle to change, and tightly coupled to its runtime.

InfiPragma encodes agent behavior in Markdown. Markdown is readable by everyone, editable with any text editor, and completely decoupled from execution. The `.md` file doesn't care if it's run by Claude, GPT, or a future model that doesn't exist yet.

**The framework is the bottleneck. The `.md` file is the product.**

---

## Built-In Safety

| Mechanism | How It Works |
|-----------|-------------|
| **Judge gates** | Every stage must score 7+/10 before advancing |
| **Budget limits** | Per-session and total caps, 80% warning |
| **Git safety net** | Every attempt tagged, instant rollback |
| **Max retries** | 3 failures = blocked, notifies you |
| **Docker sandbox** | Optional isolated execution (`--sandbox`) |
| **Crash recovery** | Detects incomplete sessions, resumes safely |
| **Error memory** | Learns from mistakes, never repeats them |

---

## CLI

```bash
./infipragma.sh              # Run the full pipeline
./infipragma.sh --status     # View pipeline progress
./infipragma.sh --once       # Run one session only
./infipragma.sh --dry-run    # Show next action without executing
./infipragma.sh --sandbox    # Run agents in Docker container
```

```
========================================
  InfiPragma Pipeline Status
========================================
Phase: build | Stage: S5
Total cost: $34.20 / $100
Total sessions: 12
----------------------------------------
  S0  Init           [PASSED]
  S1  Research        [PASSED]
  S2  DeliveryMode    [PASSED]
  S3  Design          [PASSED]
  S4  Scaffold        [PASSED]
  S5  Build           [IN PROGRESS] 8/22 features
  S6  QA              [PENDING]
  S7  Deploy          [PENDING]
----------------------------------------
```

---

## Configuration

```yaml
# .infipragma/config.yaml

idea: "A real-time collaborative whiteboard for remote teams"
hints: "prefer Next.js, must support mobile"

budget:
  max_total_usd: 100
  max_per_session_usd: 15

notify:
  webhook: "https://hooks.slack.com/..."  # Slack/Discord

sandbox:
  enabled: false  # Docker isolation
```

Typical cost: **$50–200** from idea to deployed product.

---

## FAQ

**Q: What can it build?**
Web apps, APIs, dashboards, tools — anything Claude Code can build.

**Q: What if it gets stuck?**
After 3 retries, the pipeline stops and notifies you. You can inspect the judge report, fix the issue, and resume.

**Q: Can I use a different LLM?**
The `.md` files are model-agnostic. The orchestrator currently calls `claude`, but swapping to another CLI is a one-line change.

**Q: Can I modify the pipeline?**
Yes. Add stages, remove stages, change agent behavior — it's all `.md` files. Fork and make it yours.

**Q: Is my code safe?**
All code is local. `--sandbox` runs in Docker. Budget limits prevent runaway costs.

---

## Inspired By

The idea that `.md` files can reliably control AI behavior comes from [Claude Code Superpowers](https://github.com/anthropics/claude-code-superpowers) — a skill system where single Markdown files turn Claude Code into a disciplined engineer following TDD, code review, and architectural planning workflows.

InfiPragma asks: what if the entire product delivery process was a skill?

---

## License

MIT

---

<p align="center">
<b>Markdown files are all you need.</b><br>
<i>No framework. No SDK. No abstractions. Just .md files that deliver products.</i>
</p>
