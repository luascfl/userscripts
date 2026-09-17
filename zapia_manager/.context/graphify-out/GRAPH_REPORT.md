# Graph Report - zapia_manager  (2026-09-17)

## Corpus Check
- 2 files · ~10,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 57 nodes · 115 edges · 7 communities detected
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

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 11 edges
2. `normalizeSpace()` - 9 edges
3. `applyPrefix()` - 7 edges
4. `waitFor()` - 6 edges
5. `openNativeActions()` - 6 edges
6. `queueFromSelection()` - 5 edges
7. `deleteSelectedChats()` - 5 edges
8. `renderManagerPanel()` - 5 edges
9. `chatIdentity()` - 4 edges
10. `isFlutterChatRow()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 3_
- `visibleSemanticMenuAction()` --calls--> `semanticButtons()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 6_
- `openNativeActions()` --calls--> `semanticMenuButton()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 1_
- `applyPrefixToSelectedChats()` --calls--> `rediscoverAndApply()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 1_
- `mountControls()` --calls--> `renderManagerPanel()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.23
Nodes (12): button(), canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isHoverActionLabel(), isMenuButtonLabel() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (10): applyPrefix(), deleteChat(), openNativeActions(), rediscoverAndApply(), rediscoverAndDelete(), rowMenuButton(), setInputValue(), stripManagedPrefix() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (9): applyPrefixToSelectedChats(), deleteSelectedChats(), discoverChatRows(), nativeDeleteConfirmAction(), nativeDeleteDialog(), nativeDeleteDialogOpen(), queueFromSelection(), queueVisibleSelectedChatIds() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (9): boot(), enableFlutterSemantics(), getChatViewport(), hasChatHoverAction(), installStyles(), mountControls(), removeManagerPanel(), shouldShowChatManager() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (2): isVisible(), nativeRenameInput()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): semanticButton(), semanticButtons(), semanticMenuButton(), visibleSaveAction()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction()

## Knowledge Gaps
- **Thin community `Community 4`** (8 nodes): `isManagedNode()`, `isVisible()`, `zapia-manager.user.js`, `nativeRenameInput()`, `needsRemount()`, `requestZapiaCacheRecovery()`, `scheduleMount()`, `toast()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 3` to `Community 0`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 4`, `Community 5`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._