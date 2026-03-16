# AgentInfra

**Give your AI agent a memory that lives with the code.**

AgentInfra is a zero-dependency, convention-based knowledge layer for AI-assisted development. Drop a `.ai/` directory into any project, and your agent instantly understands the architecture, design decisions, tech stack, and history — without re-reading every file from scratch.

No servers. No databases. No embeddings. Just markdown.

---

## Why This Exists

### What Skills Got Right

The [superpowers](https://github.com/superpowers-ai/superpowers) skill system proved something important: **structured markdown is all an LLM needs to dramatically change its behavior.** A well-written `.md` file can turn a generic agent into a domain expert — better at debugging, better at TDD, better at code review. No servers, no embeddings, just a file the agent reads.

This was a breakthrough. But it also revealed a gap.

### What Skills Can't Do

Skills teach an agent **how** to work — workflows, processes, techniques. They're generic by design: the same TDD skill works on a Python CLI and a React SPA. The same debugging skill applies to every codebase.

But they can't teach an agent **what your project is**:

- What's the architecture? What modules exist and how do they interact?
- Why was PostgreSQL chosen over MongoDB? Why REST instead of GraphQL?
- What conventions does your team follow? What patterns are forbidden?
- What's the tech debt? Where are the landmines?

This knowledge is **project-specific**. It doesn't belong in a global skill. It changes as the project evolves. And without it, every session looks like this:

```
Session 1: "Let me grep for the auth module... read 15 files... ah, it uses JWT..."
Session 2: "Let me grep for the auth module... read 15 files... ah, it uses JWT..."
Session 3: "Let me grep for the auth module... read 15 files... ah, it uses JWT..."
```

**The agent re-reads source files, re-infers architecture, re-discovers conventions, re-deduces decisions** — burning thousands of tokens and minutes on knowledge it already had yesterday. Skills made the agent a better engineer, but a better engineer without project context is still lost on day one.

### The Gap

When a new engineer joins your team, you don't just teach them "how to debug." You give them:
- An architecture overview
- Design principles the team follows
- Why certain technology choices were made
- A history of key decisions
- Where the bodies are buried (tech debt)

Skills are the training program. But agents also need the **onboarding** — and they need it **every single session**.

### The Insight

If a 200-line skill file can teach an agent *how* to debug, a 200-line architecture doc can teach it *what* your system does — and it'll remember across every session.

AgentInfra applies the same "structured markdown" approach that skills validated, but to a different problem: **persistent, project-specific knowledge**. Skills teach process. AgentInfra teaches context. Together, they give the agent both capability and understanding.

---

## How It Compares

The AI tooling ecosystem has produced many approaches to the "agent context" problem. Here's how they differ:

### vs. RAG / Vector Knowledge Bases

| | RAG / Vector DB | AgentInfra |
|---|---|---|
| **Infrastructure** | Embedding pipeline + vector DB + retrieval server | Zero. Just `.md` files in your repo |
| **Retrieval quality** | Semantic similarity (often noisy, misses context) | LLM reasoning via decision tree (precise, explainable) |
| **Transparency** | Black box — you can't read what the agent "knows" | Every piece of knowledge is a readable, diffable `.md` file |
| **Maintenance** | Re-index on every code change, manage drift | Agent updates docs as it works, human reviews via git diff |
| **Cost** | Embedding API calls + DB hosting + retrieval latency | Zero runtime cost. Zero API calls. Zero latency |
| **Setup time** | Hours to days (configure, embed, tune) | Minutes (create `.ai/`, write CLAUDE.md) |

RAG solves the problem of searching large corpora. But project knowledge isn't a search problem — it's a **structure** problem. You don't need to "find" your architecture; you need it presented clearly every time.

### vs. MCP (Model Context Protocol)

| | MCP | AgentInfra |
|---|---|---|
| **Purpose** | Connect agents to external tools and data sources | Give agents persistent project understanding |
| **Architecture** | Client-server protocol, requires running servers | Zero architecture. Files in a directory |
| **Scope** | Tool connectivity (APIs, databases, services) | Project knowledge (architecture, decisions, conventions) |
| **Setup** | Configure servers, manage connections, handle auth | Copy templates, write markdown |
| **Portability** | Platform-specific server implementations | Works anywhere markdown is readable |

MCP and AgentInfra solve **different problems**. MCP gives agents hands (tools); AgentInfra gives agents a brain (knowledge). They're complementary — an agent with both MCP tools and `.ai/` knowledge is more capable than either alone.

### vs. Skills / System Prompts

| | Skills (superpowers, etc.) | AgentInfra |
|---|---|---|
| **What they teach** | *How* to work (workflows, processes, techniques) | *What* the project is (architecture, decisions, context) |
| **Scope** | Generic — same skill across all projects | Project-specific — different `.ai/` for every repo |
| **Evolution** | Static — updated by skill author | Living — agent updates docs as the project evolves |
| **Location** | Installed globally or per-user | Lives in the repo, versioned with the code |

Skills teach an agent to be a better engineer. AgentInfra teaches it to understand *your* project. A skilled agent without project knowledge is like a senior dev on their first day — capable but lost.

### vs. CLAUDE.md / .cursorrules / .github/copilot-instructions.md

| | Single instruction file | AgentInfra |
|---|---|---|
| **Scalability** | One file grows unbounded (500+ lines = token waste) | Structured multi-file, load only what's relevant |
| **Loading** | Everything, every time | Three-layer: always → task-driven → on-demand |
| **Maintenance** | Manual, often stale | Agent auto-maintains, drift detection built in |
| **Structure** | Freeform, inconsistent | Templates, frontmatter, conventions |
| **Separation of concerns** | Rules, context, commands all mixed together | Architecture, features, history each in their own file |

CLAUDE.md is a great starting point. AgentInfra is what you graduate to when your project outgrows a single file. And they work together — `CLAUDE.md` becomes the router that points to `.ai/`.

### vs. Built-in Memory (Claude Code memory, Copilot memory)

| | Built-in Memory | AgentInfra |
|---|---|---|
| **Storage** | Platform-specific, hidden in `~/.claude/` or cloud | In your repo, visible, git-tracked |
| **Loading** | Passive — agent must explicitly read | Active — CLAUDE.md drives loading protocol |
| **Shareability** | Per-user, not shared with team | In the repo — every collaborator (human or agent) sees it |
| **Structure** | Flat key-value notes | Layered knowledge: core → features → evolution |
| **Review** | Hard to audit what the agent "remembers" | `git diff` on every knowledge update |
| **Portability** | Locked to one platform | Works with any agent that reads files |

Built-in memory is personal notes. AgentInfra is team documentation — except the agent writes and reads it.

### The Position

```
                    High Structure
                         │
          AgentInfra ────┤
                         │
    Skills ──────────────┼──────────── RAG
                         │
         CLAUDE.md ──────┤
                         │
                    Low Structure
                         │
   ──────────────────────┼──────────────────────
   Zero Infrastructure          Heavy Infrastructure
```

AgentInfra sits in the **high structure, zero infrastructure** quadrant — the sweet spot for project knowledge.

---

## Core Principles

### 1. Zero Infrastructure

```
No servers. No databases. No build steps.
No embeddings. No vector stores. No API calls.
No configuration files. No package installation.

Just .md files in a directory.
```

Any project can adopt AgentInfra in under 5 minutes. If you can create a directory and write markdown, you can use it.

### 2. Token-Efficient by Design

Most context solutions dump everything into the prompt. AgentInfra uses **three-layer loading** to minimize token waste:

| Layer | What | When | Cost |
|-------|------|------|------|
| **L1** | `CLAUDE.md` — index table + instructions | Every session (auto) | ~400 tokens |
| **L2** | Relevant `.ai/` docs — matched by task type | Session start (decision tree) | ~2000-4000 tokens |
| **L3** | Source code — referenced in `.ai/` docs | When needed (on-demand) | Varies |

**Typical session**: ~4000-5000 tokens total (~2.5% of a 200K context window).

Compare this to RAG systems that retrieve 10-20 chunks at ~500 tokens each, often with low relevance. Or to a bloated CLAUDE.md that loads 3000+ tokens of instructions for every task, whether relevant or not.

### 3. Agent-Native Maintenance

Knowledge that isn't maintained becomes a lie. AgentInfra solves this by making the agent responsible:

- **Trigger-based updates** — agent knows when to update which docs (new feature → update feature doc, new dependency → update tech-stack)
- **Drift detection** — at session end, agent checks if code changes are reflected in `.ai/` docs
- **Separate commits** — `docs(.ai): ...` commits let humans review knowledge updates independently
- **Quality checklist** — agent self-checks for hallucinated paths, stale versions, and index drift

The agent maintains. The human reviews. Git tracks everything.

### 4. Extensible Without Forking

The `core/ → features/ → evolution/` structure is a convention, not enforcement:

- Add custom directories: `.ai/api/`, `.ai/integrations/`, `.ai/runbooks/`
- Modify templates to match your team's documentation style
- Adjust loading rules for your workflow
- Use any subset — a 3-file `.ai/` is just as valid as a 30-file one

---

## Quick Start

### 1. Copy the framework into your project

```bash
git clone https://github.com/JayCheng113/AgentInfra.git /tmp/agentinfra
cp -r /tmp/agentinfra/.ai/ your-project/.ai/
```

This gives you the loading rules, maintenance protocol, and templates. No `CLAUDE.md` yet — the agent will generate it.

### 2. Bootstrap with your agent

Open a session in your project and tell the agent:

> "Read `.ai/templates/init-core.md` and `.ai/templates/claude-md.md`, then analyze this codebase and generate the full `.ai/` knowledge base including `CLAUDE.md`."

The agent will:
- Scan your code structure and infer architecture
- Detect tech stack from config files (package.json, pyproject.toml, etc.)
- Generate `CLAUDE.md` with your project's identity, index table, and rules
- Populate `core/`, `features/`, and `evolution/` docs
- Commit everything for your review

### 3. Review and correct

Check the generated `.ai/` files. The agent's first pass won't be perfect — correct inaccuracies, adjust principles, fill in context only you know. Commit.

### 4. Work normally

From now on, every session automatically benefits from `.ai/` knowledge. The agent reads what it needs, works on your task, and updates the docs when it's done.

---

## Directory Structure

```
your-project/
├── CLAUDE.md                         # L1 entry point (always loaded)
│                                     # Contains: project identity, index table,
│                                     # loading/maintenance instructions
├── .ai/
│   ├── _loading-rules.md             # Decision tree: which docs for which task
│   ├── _maintenance-rules.md         # When and how to update knowledge
│   │
│   ├── core/                         # Stable foundation (changes rarely)
│   │   ├── architecture.md           #   System design, module boundaries
│   │   ├── principles.md             #   Design principles, conventions
│   │   └── tech-stack.md             #   Languages, frameworks, rationale
│   │
│   ├── features/                     # Per-module knowledge (grows with project)
│   │   ├── _template.md              #   Template for new feature docs
│   │   ├── auth.md                   #   Example: auth module design
│   │   └── payments.md               #   Example: payment module design
│   │
│   ├── evolution/                    # Project timeline (append-only)
│   │   ├── history.md                #   ADRs and milestone log
│   │   ├── roadmap.md                #   Planned work
│   │   └── tech-debt.md              #   Known issues, prioritized
│   │
│   └── templates/                    # Document templates
│       ├── adr.md                    #   Architecture Decision Record
│       ├── claude-md.md              #   CLAUDE.md template
│       └── init-core.md              #   Bootstrap guide
│
└── src/                              # Your actual code
```

---

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│ Session Start                                            │
│                                                          │
│  1. Agent reads CLAUDE.md (auto-loaded)                  │
│     → Gets project identity + knowledge index            │
│                                                          │
│  2. Agent reads _loading-rules.md                        │
│     → Classifies task → follows decision tree            │
│     → Loads only relevant .ai/ docs                      │
│                                                          │
│  3. Agent works on the task                              │
│     → Full project context without re-reading everything │
│                                                          │
│  4. Agent runs maintenance protocol                      │
│     → Updates affected .ai/ docs                         │
│     → Runs drift detection                               │
│     → Commits separately: docs(.ai): <summary>          │
│                                                          │
│  Result: Next session starts with updated knowledge      │
└──────────────────────────────────────────────────────────┘
```

### Loading Decision Tree

The agent classifies each task and loads accordingly:

| Task Type | What Gets Loaded | Budget |
|-----------|-----------------|--------|
| **Modify a feature** | Target module's feature doc + architecture | ≤ 3 docs |
| **Fix a bug** | Affected feature doc + tech-debt | ≤ 3 docs |
| **Refactor** | Tech-debt + roadmap + affected feature docs | ≤ 5 docs |
| **New feature** | Adjacent module docs + principles + roadmap | ≤ 3 docs |
| **Tooling/CI** | Usually none | ≤ 1 doc |

This is **LLM-native retrieval** — the agent uses its own reasoning to decide what's relevant, not keyword matching or semantic similarity.

---

## Examples

This repo includes two example projects:

### [`examples/minimal/`](examples/minimal/) — Python CLI Tool

A word-counter CLI with just 3 `.ai/` files. Shows that small projects need only a lightweight subset.

### [`examples/web-app/`](examples/web-app/) — FastAPI Web Application

A task management API with auth, status workflows, and background workers. Shows the full three-layer system with feature docs, ADRs, and tech debt tracking.

---

## FAQ

**Does this only work with Claude Code?**

No. AgentInfra uses `CLAUDE.md` as the entry point because Claude Code auto-loads it, but the `.ai/` convention works with any agent that can read files. Cursor, Codex, Windsurf, Copilot — if it reads markdown, it reads `.ai/`.

**What if my project already has a CLAUDE.md?**

Add the knowledge base section to your existing file. AgentInfra's `CLAUDE.md` template is designed to coexist with your existing rules and instructions.

**How is this different from just writing good docs?**

Three ways: (1) It's structured for agents, not humans — frontmatter, decision trees, templates. (2) Agents maintain it — you don't have to remember to update docs. (3) It has a loading protocol — agents don't read everything, just what's relevant.

**Won't the `.ai/` files get stale?**

The maintenance protocol includes drift detection — at session end, the agent checks if code changes are reflected in `.ai/` docs. This isn't perfect, but it's dramatically better than documentation that's only updated when humans remember to.

**What about monorepos?**

Each package/service can have its own `.ai/` directory. The root `CLAUDE.md` can point to multiple `.ai/` locations.

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes — follow `.ai/core/principles.md`
4. Commit knowledge updates separately: `docs(.ai): <summary>`
5. Open a pull request

## License

[MIT](LICENSE) — Copyright (c) 2026 AgentInfra Contributors
