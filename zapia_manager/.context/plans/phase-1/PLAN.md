# Phase 1 plan: user script implementation

## Story

`US-001` from `.context/workflow/prd.json`.

## Steps

1. Create a dependency-free Violentmonkey script that identifies visible chat rows using accessible and structural evidence, then mounts controls without modifying chat content.
2. Route label actions through the visible Zapia row menu and edit-title dialog. Prefix normalization replaces only `✔ ` and `🟡 `.
3. Add durable selection state keyed by chat-row identity and an accessible toolbar.
4. Route a bulk request through each selected row’s native overflow menu and native delete opener. Explicitly exclude final confirmation buttons from all selectors.
5. Exercise exported pure helpers and DOM controls in an isolated fixture.

## Verification

- Run `node test/zapia-manager.test.mjs`.
- Parse the script as JavaScript with `node --check`.
- Manual Phase 3: install in Violentmonkey in LibreWolf, open Zapia Chat, label a non-critical chat, select chats, and verify the final delete confirmation remains untouched.
