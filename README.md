# InfiPragma

**One idea in. One deployed product out.**

InfiPragma is an autonomous product delivery engine powered by Claude Code. You describe what you want to build in one sentence, walk away, and come back to a fully deployed, production-ready product — complete with tests, documentation, and live URL.

No coding required. No babysitting. No "prompt engineering."

```
idea: "A real-time collaborative whiteboard for remote teams"
```

That's it. InfiPragma handles everything else.

---

## How It Works

InfiPragma chains multiple Claude Code sessions together through a shell orchestrator, turning a single AI model into a full engineering team with persistent memory, quality gates, and automatic error recovery.

```
Your Idea
   │
   ▼
┌──────────────────────────────────────────────────────┐
│                   infipragma.sh                      │
│                  (Orchestrator)                       │
│                                                      │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐  │
│  │Research│→ │  Design  │→ │ Build  │→ │ Deploy  │  │
│  └────┬───┘  └────┬─────┘  └───┬────┘  └────┬────┘  │
│       │           │            │             │       │
│       ▼           ▼            ▼             ▼       │
│    ┌─────┐     ┌─────┐     ┌─────┐      ┌─────┐    │
│    │Judge│     │Judge│     │Judge│      │Judge│    │
│    └─────┘     └─────┘     └─────┘      └─────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Memory System (cross-session persistence)  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
   │
   ▼
Live Product + Maintenance Mode
```

### The Pipeline

| Stage | Agent | What Happens |
|-------|-------|-------------|
| S0 | Init | Project setup, architecture docs |
| S1 | Research | Market research, feasibility, API discovery |
| S2 | Delivery Mode | Choose deployment strategy (Vercel, Docker, etc.) |
| S3 | Design | System architecture, component design |
| S4 | Scaffold | Project skeleton, dependencies, dev environment |
| S5 | Build | Implement features one by one with E2E tests |
| S6 | QA | Full test suite, linting, final validation |
| S7 | Deploy | Build, deploy, verify live URL |

Every stage is validated by a **Judge agent** that scores the work (0-10) and blocks progression if quality is below threshold. No cutting corners.

---

## Quick Start

### Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- `ANTHROPIC_API_KEY` set in your environment
- `yq` installed (`brew install yq`)
- `bc` installed (pre-installed on most systems)

### 3 Steps

```bash
# 1. Clone
git clone https://github.com/your-org/InfiPragma.git
cd InfiPragma

# 2. Describe your idea
vim .infipragma/config.yaml
# → Fill in the "idea" field

# 3. Launch
chmod +x infipragma.sh
./infipragma.sh
```

That's it. Go grab a coffee. Or a nap.

### Interactive Mode (Prototype Phase)

The first phase requires your input — InfiPragma will ask clarifying questions and show you a prototype for approval. Just run Claude Code normally:

```bash
claude
```

Once you approve the prototype, switch to autonomous mode:

```bash
./infipragma.sh
```

---

## What Makes This Different

### Persistent Memory

AI agents forget everything between sessions. InfiPragma doesn't.

- **MEMORY.md** — Long-term project knowledge that accumulates across sessions
- **handoff.yaml** — Structured session-to-session continuity data
- **errors/** — Learned error patterns that prevent repeating mistakes
- **sessions/** — Full session logs for audit trail

### Quality Gates, Not YOLO Shipping

Every stage must pass a Judge agent before progressing. The Judge:
- Checks specific criteria for each stage transition
- Scores from 0-10 (must score 7+ to pass)
- Blocks on any critical issue
- Cannot be bribed, bypassed, or sweet-talked

### Self-Healing Error Loop

When something breaks, InfiPragma doesn't just retry blindly:

1. Documents the error (symptom, root cause, fix)
2. Checks if a similar error was solved before
3. Applies the learned fix or diagnoses from scratch
4. Gets smarter with every failure

### Cost Control

Set your budget. InfiPragma respects it.

```yaml
budget:
  max_total_usd: 100      # Total budget cap
  max_per_session_usd: 15  # Per-session limit
  warn_at_percent: 80      # Warning threshold
```

Typical cost: **$50–200** from idea to deployed product.

### Crash Recovery

Power went out? Machine rebooted? No problem.

InfiPragma detects incomplete sessions, safely stashes uncommitted work, and resumes from the last stable state. Every attempt is git-tagged for easy rollback.

---

## Configuration

```yaml
# .infipragma/config.yaml

idea: "A real-time collaborative whiteboard for remote teams"
hints: "prefer Next.js, must support mobile"

notify:
  webhook: "https://hooks.slack.com/..."  # Slack/Discord notifications
  on_stage_pass: true
  on_failure: true
  on_deploy: true

budget:
  max_total_usd: 100
  max_per_session_usd: 15
  warn_at_percent: 80

sandbox:
  enabled: false  # Run in Docker for isolation
```

---

## CLI

```bash
./infipragma.sh              # Run the full pipeline
./infipragma.sh --status     # View pipeline progress
./infipragma.sh --once       # Run one session only
./infipragma.sh --dry-run    # Show next action without executing
./infipragma.sh --sandbox    # Run agents in Docker container
```

### Status Output

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
Last agent: infipragma-build
Last run: 2026-03-15T14:30:00Z
========================================
```

---

## Architecture

```
InfiPragma/
├── infipragma.sh              ← Orchestrator (the engine)
├── CLAUDE.md                  ← Entry point for Claude Code
├── AGENTS.md                  ← Pipeline protocol
│
├── .claude/agents/            ← 13 specialized agent definitions
│   ├── infipragma-build.md
│   ├── infipragma-judge.md
│   ├── infipragma-deploy.md
│   └── ...
│
├── .infipragma/
│   ├── config.yaml            ← Your configuration
│   ├── notify.sh              ← Notification helper
│   ├── Dockerfile             ← Sandbox image
│   ├── meta/
│   │   ├── registry.yaml      ← Pipeline state machine
│   │   └── handoff.yaml       ← Session continuity
│   ├── memory/
│   │   ├── MEMORY.md          ← Long-term knowledge
│   │   ├── errors/            ← Learned error patterns
│   │   └── sessions/          ← Session logs
│   └── logs/                  ← Orchestrator logs
│
└── .ai/                       ← Knowledge base (generated)
    ├── architecture.md
    ├── tech-stack.md
    └── ...
```

### 13 Agents, One Pipeline

Each agent is a `.md` file — pure Markdown instructions that guide Claude Code through a specific task. No plugins, no frameworks, no vendor lock-in. Just text files that tell an AI what to do.

| Agent | Role |
|-------|------|
| `clarification` | Ask questions, understand the idea |
| `init` | Set up project structure |
| `research` | Market analysis, API discovery |
| `delivery-mode` | Choose deployment strategy |
| `design` | Architecture and system design |
| `scaffold` | Generate project skeleton |
| `build` | Implement features with E2E tests |
| `qa` | Test, lint, validate |
| `deploy` | Ship to production |
| `judge` | Quality gate — validates every stage |
| `audit` | Self-audit in maintenance mode |
| `feature` | Add features post-launch |
| `fix` | Fix issues post-launch |

---

## Safety

- **Budget hard limits** — Pipeline stops when budget is exceeded
- **Judge gates** — No stage progresses without quality validation
- **Git safety net** — Every attempt is tagged, rollback is always possible
- **Max retries** — 3 failures = blocked, requires human intervention
- **Docker sandbox** — Optional isolated execution via `--sandbox`
- **Crash recovery** — Automatic detection and safe resume

---

## Notifications

Get notified on Slack, Discord, or any webhook-compatible service:

- Stage passed
- Stage failed (with retry count)
- Budget warning (approaching limit)
- Pipeline blocked (needs human help)
- Deployment complete (with live URL)

---

## FAQ

**Q: What can it build?**
Web apps, APIs, dashboards, tools — anything Claude Code can build. It's particularly good at Next.js + Supabase stacks, but adapts to whatever makes sense for your idea.

**Q: How long does it take?**
Depends on complexity. A simple tool might take 10-15 sessions. A full web app with auth, dashboard, and API could take 30-50 sessions.

**Q: What if it gets stuck?**
After 3 failed retries on any stage, the pipeline marks itself as `blocked` and notifies you. You can inspect the judge report, fix the issue manually, and resume.

**Q: Can I modify the agents?**
Yes. Every agent is a `.md` file. Edit them to change behavior, add constraints, or customize the pipeline for your needs.

**Q: Is my code safe?**
All code is local (or in your git repo). The `--sandbox` flag runs agents in a Docker container for additional isolation. Budget limits prevent runaway costs.

---

## License

MIT

---

<p align="center">
<i>Built with the belief that the best developer experience is no developer experience.</i>
</p>
