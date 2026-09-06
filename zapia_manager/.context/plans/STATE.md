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
