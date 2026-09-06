# Roadmap

## Milestone 1: Safe Zapia chat manager

### Phase 1: Runtime discovery and chat labelling

Dependency: none.

Deliver a Violentmonkey user script that discovers Zapia chat rows and applies one managed title prefix through its visible UI.

### Phase 2: Bulk selection and guarded deletion

Dependency: Phase 1.

Add selectable chat rows and an accessible bulk toolbar that only opens Zapia’s native deletion dialogs, leaving their final confirmation to the user.

### Phase 3: Browser validation and release

Dependency: Phase 2 and an authenticated LibreWolf Zapia session.

Install the script in Violentmonkey, exercise labels and selection in Zapia, then capture observed selectors and regressions.
