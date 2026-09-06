---
type: doc
name: architecture
description: Zapia Manager userscript structure and safety boundaries
category: architecture
generated: 2026-09-06
status: curated
---

# Architecture

`zapia-manager.user.js` is one self-contained browser module.

## Components

| Component | Responsibility |
| --- | --- |
| Chat discovery | Finds visible candidate rows through Zapia URL, test-id, and ARIA evidence, then removes nested duplicates. |
| Row controls | Adds a checkbox plus `✔` and `🟡` action buttons without changing message content. |
| Rename flow | Opens the row menu, chooses a visible native rename action, updates its native input, then uses its non-destructive save action. |
| Deletion queue | Keeps selected visible chat identities and opens one native delete menu action at a time. |
| Safety guard | Restricts delete activation to an action inside a menu. Buttons in a deletion dialog are never candidates. |
| SPA lifecycle | A `MutationObserver` re-runs idempotent mounting after Zapia renders new rows. |

## Invariants

1. Prefixing strips an existing managed prefix before adding the requested one.
2. A native final deletion confirmation is always left for the user.
3. No direct Zapia API, fixed-delay sequencing, screen coordinates, or external dependency is used.
4. Failure to identify a safe native element stops the requested action and displays an error.
