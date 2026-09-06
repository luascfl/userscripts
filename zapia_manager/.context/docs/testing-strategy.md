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

The tests cover prefix replacement and idempotence, invalid label rejection, leaf chat-row selection, visible selection queueing, text normalization, the critical rule that a delete action is valid only inside a native menu, never a dialog, the observer guard that rejects mutations produced by Zapia Manager itself, suppression of the manager until Zapia renders a chat row, and a one-time cache-recovery request that preserves unrelated local-storage data.

## Manual browser validation

Use LibreWolf with Violentmonkey in an authenticated Zapia account:

1. Import `zapia-manager.user.js` and open `https://app.zapia.com/chat`.
2. Confirm each visible chat row gets one checkbox plus `✔` and `🟡` buttons.
3. Apply both labels to a non-critical chat and verify only the most recent managed prefix remains.
4. Select two non-critical chats, open the native deletion flow, and verify the Zapia confirmation remains visible and untouched.
5. Confirm or cancel it manually, then use the toolbar to prepare the next native dialog.

6. After reloading, leave the chat page open briefly and confirm the controls do not repeatedly re-render. The self-mutation regression test must have passed before this step.

The Chromium-only CDP browser adapter cannot verify the logged-in LibreWolf page. That manual step is the remaining browser-specific acceptance check.
