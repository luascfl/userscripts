# Zapia Manager

## Product

A LibreWolf and Violentmonkey userscript that adds deliberate chat-labeling and bulk-management controls to Zapia Chat.

## Scope

- Target `https://app.zapia.com/chat` only.
- Add `✔ ` and `🟡 ` prefixes to chat titles through Zapia’s visible edit interface.
- Add per-chat selection checkboxes and a selected-count toolbar.
- Start deletion only through each chat’s native delete controls. The script must never confirm Zapia’s final destructive dialog.
- Remain responsive to Zapia SPA updates through a `MutationObserver`.

## Safety boundaries

- No direct API calls, hidden endpoints, or data scraping.
- No coordinate automation, fixed-delay logic, or synthetic final confirmation.
- The selection UI does not itself delete data. Each selected chat must reach Zapia’s native deletion dialog.

## Runtime

- LibreWolf with the Violentmonkey extension.
- Plain JavaScript user script, no build step or external dependencies.
