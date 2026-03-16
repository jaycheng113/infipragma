# word-counter

A CLI tool that counts words, lines, and characters in text files.

## Knowledge Base (.ai/)

| Document | Description |
|----------|-------------|
| .ai/core/architecture.md | Single-module CLI: argparse → file reader → counter → formatter |
| .ai/core/tech-stack.md | Python 3.11, no external dependencies |

## Loading Protocol

1. This file is auto-loaded
2. Read `.ai/_loading-rules.md` for the decision tree
3. This is a small project — usually loading `core/architecture.md` is sufficient

## Maintenance Protocol

After changes, follow `.ai/_maintenance-rules.md`.

## Rules

1. Zero external dependencies — stdlib only
2. All functions must have type hints
3. Test with pytest

## Quick Reference

- Run: `python -m word_counter <file>`
- Test: `pytest tests/`
