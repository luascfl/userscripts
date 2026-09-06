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
