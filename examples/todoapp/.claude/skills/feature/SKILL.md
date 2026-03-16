# /feature — Add Feature Request

## Description
Appends a new feature request to BACKLOG.md.

## Arguments
- `description` (required): The feature description, passed as a quoted string

## Instructions

1. Read `BACKLOG.md`
2. Under the `## Pending` section, append:
   ```
   - [ ] {description} (added: {YYYY-MM-DD})
   ```
3. Write the updated `BACKLOG.md`
4. Confirm to the user:
   ```
   Added to backlog: "{description}"

   The Feature Agent will pick this up during the next maintenance cycle.
   To see all pending items: /status
   ```

## Notes
- If the pipeline is in maintenance phase, the Feature Agent will automatically pick up pending items
- Multiple features can be added — the Feature Agent processes one per session
- Do not modify feature_list.json — that is managed by the Design Agent during build phase
