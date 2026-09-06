# Requirements

## Functional

- **LBL-01:** A user can apply either `✔ ` or `🟡 ` to one discovered chat title.
- **LBL-02:** Prefixing is idempotent and replaces the other managed prefix rather than stacking labels.
- **SEL-01:** A checkbox is rendered for each discovered, visible chat row.
- **SEL-02:** A fixed, accessible toolbar displays the number of selected chats and clears the selection.
- **DEL-01:** The user can request deletion for selected chats, one at a time, by opening Zapia’s own menu and delete dialog for each one.
- **DEL-02:** The script never activates the native final destructive confirmation. The user must confirm every native dialog.
- **SPA-01:** Controls remain correct when chat rows are added, removed, or re-rendered by the Zapia SPA.

## Quality

- **QLT-01:** No external dependencies, network calls, coordinates, or arbitrary waits.
- **QLT-02:** Controls expose labels and keyboard-accessible buttons.
- **QLT-03:** DOM helpers are unit-tested in an isolated fixture before browser installation.

## Exclusions

- Renaming through undocumented APIs.
- Bulk-confirming deletion dialogs.
- Exporting or reading message contents.
