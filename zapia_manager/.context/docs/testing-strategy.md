---
type: doc
name: testing-strategy
description: Validation approach for the Zapia Manager userscript
category: testing
generated: 2026-09-06
status: curated
---

# Testing strategy

## Automated contracts

Run:

```sh
node --check zapia-manager.user.js
node --test test/zapia-manager.test.mjs
```

The tests cover prefix replacement and idempotence, invalid label rejection, Flutter navigation-label exclusion, leaf chat-row selection, visible selection queueing, text normalization, the critical rule that a delete action is valid only inside a native menu, never a dialog, the observer guard that rejects mutations produced by Zapia Manager itself, suppression of the manager until Zapia renders a chat row, and a one-time cache-recovery request that preserves unrelated local-storage data.

## Manual browser validation

Use a logged-in Zapia account in a browser with a userscript manager:

1. Install `zapia-manager.user.js` and open `https://app.zapia.com/chat`.
2. Confirm the manager enables Flutter accessibility semantics and each visible chat row gets one checkbox plus `✔` and `🟡` controls.
3. Apply either label to a non-critical chat and verify the native rename dialog saves a single managed prefix.
4. Select only test chats, open the native deletion flow, and verify the script stops at the Zapia confirmation dialog.
5. Confirm or cancel that dialog manually. For a destructive acceptance test, use a chat created solely for testing.
6. Reload the page and verify the controls appear without manually enabling accessibility and never repeatedly re-render.

On 2026-09-06, a connected authenticated Chrome session verified prefixing `teste` to `✔ teste`, checkbox selection, the native dialog, and final deletion of that user-created test chat. The script never clicks the final deletion control itself.
