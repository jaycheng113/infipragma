# /status — Pipeline Progress Report

## Description
Displays the current state of the InfiPragma pipeline.

## Instructions

1. Read `.infipragma/meta/registry.yaml`
2. Read `.infipragma/feature_list.json`
3. Display a summary:

```
## Pipeline Status

**Phase**: {phase}
**Current Stage**: {current_stage}

### Stage Progress
| Stage | Status |
|-------|--------|
| S0 Init | {status} |
| S1 Research | {status} |
| S2 DeliveryMode | {status} |
| S3 Design | {status} |
| S4 Scaffold | {status} |
| S5 BuildLoop | {status} — {features_passing}/{features_total} features passing |
| S6 QA | {status} |
| S7 Deploy | {status} — {live_url or "not deployed"} |

### Maintenance
- **Mode**: {mode}
- **Last Audit**: {last_audit or "never"}
- **Open Items**: {open_items}

### Feature Progress
- **Total**: {count}
- **Core passing**: {count} / {total core}
- **Enhanced passing**: {count} / {total enhanced}
- **Polish passing**: {count} / {total polish}
```

4. If feature_list.json is empty, note "No features designed yet."
