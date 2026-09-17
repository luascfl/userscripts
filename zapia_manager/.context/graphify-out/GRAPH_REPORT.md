# Graph Report - zapia_manager  (2026-09-16)

## Corpus Check
- 2 files · ~10,746 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 50 nodes · 98 edges · 6 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 10 edges
2. `normalizeSpace()` - 7 edges
3. `applyPrefix()` - 7 edges
4. `discoverChatRows()` - 5 edges
5. `openNativeActions()` - 5 edges
6. `openNativeDelete()` - 5 edges
7. `queueFromSelection()` - 5 edges
8. `prepareNextNativeDelete()` - 5 edges
9. `renderManagerPanel()` - 5 edges
10. `chatIdentity()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 3_
- `semanticButton()` --calls--> `semanticButtons()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 6_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 1_
- `rediscoverAndApply()` --calls--> `applyPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 2_
- `mountControls()` --calls--> `renderManagerPanel()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (10): button(), canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isNavigationActionLabel(), normalizeSpace() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.28
Nodes (9): applyPrefix(), openNativeActions(), openNativeDelete(), rowMenuButton(), setInputValue(), stripManagedPrefix(), toast(), waitFor() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (8): applyPrefixToSelectedChats(), discoverChatRows(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds(), rediscoverAndApply(), selectRootChatRows()

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (8): boot(), enableFlutterSemantics(), getChatViewport(), installStyles(), mountControls(), removeManagerPanel(), shouldShowChatManager(), syncLoop()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): semanticButtons(), visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): semanticButton(), visibleSaveAction()

## Knowledge Gaps
- **Thin community `Community 6`** (2 nodes): `semanticButton()`, `visibleSaveAction()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 3` to `Community 0`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 2`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._