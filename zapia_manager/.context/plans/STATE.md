# State

## Active milestone

Milestone 1, Safe Zapia chat manager.

## Active story

US-001, implemented and awaiting authenticated LibreWolf browser acceptance.

## Decision log

- Target LibreWolf, not Chromium, because Violentmonkey is the requested runtime.
- Use DOM labels and event dispatch only. Zapia’s native controls own title persistence and final deletion.
- Browser automation cannot drive LibreWolf through the Chromium-only CDP adapter. DOM fixture tests are the available automated proof until a logged-in LibreWolf session is supplied.

## Evidence

- `node --check zapia-manager.user.js` passed on 2026-09-06.
- `node --test test/zapia-manager.test.mjs` passed, 6 tests, 0 failures, on 2026-09-06.
- `graphify update .` rebuilt `.context/graphify-out` with 30 nodes and 56 edges.
- LibreWolf 142.0.1 and an enabled Violentmonkey extension are present in the default profile.

## Validation pending

- Import `zapia-manager.user.js` in Violentmonkey and execute the manual browser sequence in `.context/docs/testing-strategy.md`.

## Remote sync

Local commit `b3472de` contains this story. `git push` on 2026-09-06 was rejected with `Permission denied (publickey)` for `git@github.com:luascfl/userscripts.git`; GitHub authentication is required before the local branch can be synchronized.

## Incident and repair

- At 15:39 and 15:41 on 2026-09-06, the host EarlyOOM service terminated two LibreWolf `Isolated Web Co` processes at 1,483 MiB and 1,376 MiB RSS respectively. This directly explains the crashed Zapia tab.
- [INFERENCE] The first installed userscript amplified memory usage: its body-wide `MutationObserver` responded to DOM changes made by its own toolbar rendering, creating a re-mount feedback loop.
- The repair ignores mutations whose target or changed nodes belong to Zapia Manager controls. `node --check` and seven Node contracts, including the self-mutation guard, passed after the change.
- The corrected script was opened in LibreWolf for Violentmonkey replacement. Reload the Zapia tab only after confirming that replacement.

- Screenshot evidence at 15:47 showed Zapia’s splash screen still loading while Zapia Manager rendered its zero-selection toolbar. The script now mounts no controls until a visible chat row exists, so it does not interact with Zapia during initialization.
- The observer subscription was restored after the self-mutation repair and is now both active and guarded. Eight Node contracts passed after this adjustment; Graphify rebuilt 37 nodes and 67 edges.

- Zapia’s live bootstrap documents a Flutter/CanvasKit stale-cache failure mode and serves its main bundle with a one-year immutable cache header. Version 0.1.1 runs at `document-start` once per profile, removes only Zapia’s `zapia_cache_flushed_v7` recovery marker, and lets Zapia’s own documented cache-recovery routine invalidate stale worker/cache assets and refetch its entry bundle. It does not clear authentication or arbitrary local-storage values.
- `node --check` and nine Node contracts passed for version 0.1.1. Graphify rebuilt 38 nodes and 68 edges.

## Chrome acceptance, 2026-09-06

- Version 0.1.6 discovers Flutter semantic chat rows by validating their hierarchy `row.parentElement.getAttribute('role') === 'group'` and their left coordinate `Math.abs(left - navLeft) < 5`. This structural constraint replaces the previous fractional width check, fixing both off-bounds control mounting (over the non-group Zapia Logo and User Profile nodes) and the hover disappearance bug caused by the row width shrinking to accommodate native Zapia action buttons.
- The user-created `teste` chat was renamed to `✔ teste`, selected through its checkbox, passed to the native Zapia exclusion dialog, and then deleted only after an explicit browser action on that dialog. No pre-existing chat was deleted.
- The live regression test found that `Limpar seleção` reset the internal set but left already mounted checkboxes checked. Version 0.1.4 synchronizes an existing row control with `selectedChatIds` on every mount. After a real reload, selecting and clearing `Compra mínima de USDT e taxa do Gemini` produced `afterSelect: true`, `afterClear: false`, and the toolbar returned to zero.
- `node --check zapia-manager.user.js` and `node --test test/zapia-manager.test.mjs` passed, 10 tests and 0 failures. `graphify update .` rebuilt 50 nodes and 93 edges.
- The Tampermonkey BETA dashboard at `options.html#…&nav=dashboard` confirms Zapia Manager version 0.1.4 is enabled and persistent in the connected Chrome profile. The earlier `#scripts` view was the wrong dashboard route.

## Separate manager panel, 2026-09-17

- The user rejected every per-row overlay. Version 0.2.0 removes the clipped sidebar layer and all row controls.
- A dedicated dark side panel now lists only visible semantic chat rows, with native checkboxes and bulk `✔ Prefixar`, `🟡 Prefixar`, guarded native deletion, and selection clearing. It is fixed at the page edge, outside the Canvas sidebar.
- Tampermonkey’s native save control persisted Zapia Manager 0.2.0 in the connected Chrome profile.
- Chrome DOM-fixture evidence found the three expected chat labels, no residual inline controls, a panel left edge after the sidebar’s right edge, compact row spacing, and enabled bulk actions after selecting a chat.
- The authenticated Zapia page still stayed at its bootstrap loading screen, so the live-page visual acceptance cannot yet be observed. `node --test test/zapia-manager.test.mjs` passed, 10 tests and 0 failures.
- `node --check zapia-manager.user.js` passed. `graphify update .` reported a 50-node, 98-edge, 8-community code graph and warned that its incremental graph was smaller than the existing 57-node graph, so it refused that overwrite.

## Collapsible manager panel, 2026-09-17

- Version 0.2.1 adds `Minimizar` to the manager header. It replaces the panel with a 113 px `Gerenciar chats` launcher at the lower page edge and restores the visible chat list and actions on activation.
- Tampermonkey’s native save control persisted 0.2.1. An isolated Chrome fixture verified collapse, no residual chat options in the launcher, fixed positioning, compact width, and full expansion back to two detected chat rows.

## Selected action repair, 2026-09-17

- Live user evidence showed `deletionQueue is not defined` when invoking `✔ Prefixar` or `Abrir exclusão nativa`. Version 0.2.2 initializes that queue before the selected-chat action paths execute.
- Tampermonkey saved 0.2.2. A Chrome end-to-end DOM fixture selected one chat, saved the native rename as `✔ Alice`, then opened a native deletion dialog while preserving `finalDeletionClicks: 0`.
- `node --check zapia-manager.user.js` and `node --test test/zapia-manager.test.mjs` passed, 10 tests and 0 failures. The currently attached persistent profile had no live Zapia page to refresh.

## Native Flutter menu repair, 2026-09-17

- User evidence after the 0.2.2 refresh showed `Zapia did not render the native rename action`, while the opened Zapia menu visibly contained Renomear and Excluir.
- Direct CDP inspection found each menu action as a visible `flt-semantics[role="button"]` whose immediate parent is `flt-semantics[role="group"]`. The former sibling-count constraint rejected this valid menu.
- Version 0.2.3 removes only that invalid sibling-count constraint. Tampermonkey saved 0.2.3. An end-to-end semantic-menu fixture saved `✔ Alice`, opened the native delete dialog, and made zero final-delete clicks.

## Native menu button repair, 2026-09-17

- User evidence showed prefixing opened `Informações do chat` instead of the more-actions menu. The previous menu-button pattern matched the substring `ações` within `Informações`.
- Version 0.2.4 now accepts exact menu labels only, including `Mais ações`, `Options`, and `Menu`. It cannot select `Informações do chat`.
- Tampermonkey saved 0.2.4. A Chrome fixture with both native buttons saved `✔ Alice` through Renomear while recording `infoClicks: 0`. `node --check` and 11 Node tests passed.

## Multi-chat prefix repair, 2026-09-17

- User reported that a single selected chat worked while multiple selections did not. The loop clicked native save and immediately targeted the next Flutter row, which can still be transient after the preceding dialog closes.
- Version 0.2.5 waits for each native rename dialog to close, then re-discovers the next queued semantic chat row instead of using a fixed 300 ms retry. It also labels the guarded deletion button as the next of the remaining selected chats, because it deliberately presents one native destructive dialog at a time.
- Tampermonkey saved 0.2.5. A Chrome fixture selected `Alpha` and `Bravo`, saved `✔ Alpha` then `✔ Bravo`, never had more than one rename dialog at once, and returned the panel selection to zero.

## Hover and batch-dialog repair, 2026-09-17

- User reported that hovering a chat removed it from the visible panel list. Flutter replaces that row with a `Mais ações` semantic action, so version 0.2.6 holds the current panel snapshot during this transient replacement instead of re-rendering it as an incomplete list.
- User also showed only one of two selected chats prefixing, followed by `Zapia did not render the native rename dialog to close.` The old wait re-ran global input discovery and mistook the persistent message composer for the rename dialog.
- Version 0.2.7 waits only for the exact rename input it opened to detach or become hidden, then re-discovers the next chat. The delete control no longer displays the rename selection count. Tampermonkey saved 0.2.7; the two-chat Chrome fixture preserved a visible composer and saved `✔ Alpha`, then `✔ Bravo`, with one dialog at a time.

## Scoped hover repair, 2026-09-17

- User reported that the whole manager disappeared after the 0.2.7 reload. Live CDP inspection found 11 valid sidebar chat rows, but Zapia also exposes a global header `Mais ações` control.
- The unscoped hover guard mistook that header control for Flutter’s row-replacement state and skipped every panel render. Version 0.2.8 accepts hover state only within the sidebar chat viewport.
- Tampermonkey saved 0.2.8. A live authenticated Chrome reload rendered the side panel with three visible chats, confirmed by DOM inspection and screenshot. `node --check` and 12 Node tests passed.

## Fresh header-menu batch repair, 2026-09-17

- User reported that the multiple-selection path still renamed only one chat. The prior flow clicked whichever header `Mais ações` control already existed after changing rows, so the next prefix could reopen the preceding chat’s menu.
- Version 0.2.9 records the current header action before selecting each queued row and waits for Zapia to replace it. The resulting menu action is therefore tied to the selected row, not the prior chat.
- Tampermonkey saved 0.2.9. A two-chat Chrome fixture with a persistent header-level action saved `✔ Alpha` and `✔ Bravo` in order.
- Live authenticated Chrome verification after the workstation restart selected `🟡 Zotero` and `🟡 Ifood` simultaneously. One `✔ Prefixar` action changed both visible titles to `✔ Zotero` and `✔ Ifood`, cleared the panel selection to zero, produced no error toast, and left no native dialog open.

## Confirmed native deletion, 2026-09-17

- User required the panel action to delete selected chats rather than merely expose Zapia's confirmation dialog.
- Version 0.2.11 labels the action `Excluir selecionados`. It opens Zapia's own `Excluir conversa?` dialog, finds `Excluir` only inside that dialog beside `Cancelar`, confirms it, waits for its closure, then moves to the next selected chat.
- The native dialog structure was inspected in the authenticated application. The installed panel now exposes the updated label and one-at-a-time deletion contract. No user chat was actually deleted during automated verification.

## Reused header-action deletion repair, 2026-09-17

- User reported that `Excluir selecionados` still did nothing. Live inspection showed the selected chat’s Zapia header reuses the same `Mais ações` semantic button rather than replacing it.
- Version 0.2.12 no longer waits for a different button instance. It selects the row, waits for two browser rendering frames so Flutter commits the selected chat, then uses the available header action. This fixes the stalled wait before the native deletion flow could begin.
- Tampermonkey saved 0.2.12. `node --check` and all 12 Node tests passed. The final destructive confirmation was intentionally not exercised on an unrelated visible chat.

## Route-aware deletion activation, 2026-09-17

- User reported that deletion succeeds only when its first selected chat is already open. When it must open another selected chat first, the native menu is reached before Zapia commits that route transition.
- Version 0.2.13 captures the route before selecting a row and opens `Mais ações` only after Zapia changes the route and renders its header action. For an already-open chat, the bounded fallback uses the available header action.
- An isolated authenticated Zapia tab proved the relevant transition: selecting `🟡 Zotero` changed `/chat?automatedDeletionProbe=1` to `/chat?pulsusNumber=ape@210b545a-5571-41a3-a435-82b2022ff1e1` and rendered `Mais ações`. Tampermonkey saved 0.2.13; Node syntax and 12 tests passed.

## Current-chat keyboard actions, 2026-09-17

- Version 0.2.14 adds `Alt+Shift+C` to prefix the current chat with `✔`, `Alt+Shift+Y` to prefix it with `🟡`, and `Alt+Shift+X` to delete it through the existing native confirmation path.
- The capture-phase handler accepts only those exact chords, suppresses browser/page handling only after matching, and ignores editable fields plus held-key repeats.
- Tampermonkey saved 0.2.14. Node syntax and 13 tests passed, including the accepted and rejected keyboard chords. An isolated authenticated Zapia tab opened `🟡 Zotero`; synthetic `Alt+Shift+C` was prevented and reached exactly one native-action click, intercepted before it could change data.

## Visible current-chat shortcut hint, 2026-09-17

- Version 0.2.15 adds the compact header hint `Atual: ✔ (Alt+Shift+C) · 🟡 (Alt+Shift+Y) · excluir (Alt+Shift+X)`.
- Tampermonkey saved 0.2.15. An authenticated Zapia panel screenshot confirms the hint is visible above the selectable-chat list; Node syntax and 13 tests passed.
