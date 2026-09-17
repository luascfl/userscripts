# Graph Report - zapia_manager  (2026-09-17)

## Corpus Check
- 2 files · ~11,190 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 62 nodes · 126 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 11 edges
2. `normalizeSpace()` - 9 edges
3. `applyPrefix()` - 9 edges
4. `waitFor()` - 7 edges
5. `deleteChat()` - 6 edges
6. `openNativeActions()` - 5 edges
7. `queueFromSelection()` - 5 edges
8. `deleteSelectedChats()` - 5 edges
9. `renderManagerPanel()` - 5 edges
10. `boot()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 3 → community 1_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 2_
- `visibleSemanticMenuAction()` --calls--> `semanticButtons()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 6_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 1_
- `applyPrefixToSelectedChats()` --calls--> `rediscoverAndApply()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.23
Nodes (12): button(), canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isHoverActionLabel(), isMenuButtonLabel() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.31
Nodes (11): applyPrefix(), deleteChat(), openCurrentNativeActions(), openNativeActions(), rediscoverAndApply(), rediscoverAndDelete(), rowMenuButton(), runCurrentChatShortcut() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (10): boot(), enableFlutterSemantics(), getChatViewport(), hasChatHoverAction(), installKeyboardShortcuts(), installStyles(), mountControls(), removeManagerPanel() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (2): stripManagedPrefix(), withPrefix()

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (9): applyPrefixToSelectedChats(), deleteSelectedChats(), discoverChatRows(), nativeDeleteConfirmAction(), nativeDeleteDialog(), nativeDeleteDialogOpen(), queueFromSelection(), queueVisibleSelectedChatIds() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): semanticButton(), semanticButtons(), semanticMenuButton(), visibleSaveAction()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): isVisible(), nativeRenameInput()

## Knowledge Gaps
- **Thin community `Community 3`** (9 nodes): `currentChatShortcut()`, `isEditableTarget()`, `isManagedNode()`, `zapia-manager.user.js`, `needsRemount()`, `requestZapiaCacheRecovery()`, `scheduleMount()`, `stripManagedPrefix()`, `withPrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `isVisible()`, `nativeRenameInput()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 2` to `Community 0`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 3`, `Community 5`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._