---
name: Architecture
description: "Single-module CLI: argparse entry point → file reader → counter → output formatter"
layer: core
last_updated: 2026-03-15
---

# Architecture

## Overview

word-counter is a single-module CLI tool. No complex architecture — just a linear pipeline.

## Pipeline

```
CLI args (argparse) → File Reader → Counter Engine → Output Formatter → stdout
```

## Module Map

| Module | Path | Responsibility |
|--------|------|---------------|
| cli | word_counter/__main__.py | Argument parsing, entry point |
| counter | word_counter/counter.py | Core counting logic (words, lines, chars) |
| formatter | word_counter/formatter.py | Output formatting (table, json, plain) |

## Key Decisions

- No external dependencies — this is a teaching example
- Single package, three files — each file has one job
