# Graph Report - zapia_manager  (2026-09-17)

## Corpus Check
- 2 files · ~10,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 54 nodes · 109 edges · 6 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 11 edges
2. `normalizeSpace()` - 9 edges
3. `applyPrefix()` - 7 edges
4. `openNativeActions()` - 6 edges
5. `waitFor()` - 5 edges
6. `openNativeDelete()` - 5 edges
7. `queueFromSelection()` - 5 edges
8. `prepareNextNativeDelete()` - 5 edges
9. `renderManagerPanel()` - 5 edges
10. `chatIdentity()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `chatIdentity()` --calls--> `normalizeSpace()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 3 → community 5_
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 1_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 2_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 4_
- `mountControls()` --calls--> `renderManagerPanel()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 2_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.23
Nodes (7): isVisible(), nativeRenameInput(), stripManagedPrefix(), visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction(), withPrefix()

### Community 1 - "Community 1"
Cohesion: 0.23
Nodes (12): applyPrefix(), openNativeActions(), openNativeDelete(), rediscoverAndApply(), rowMenuButton(), semanticButton(), semanticButtons(), semanticMenuButton() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (9): boot(), enableFlutterSemantics(), getChatViewport(), hasChatHoverAction(), installStyles(), mountControls(), removeManagerPanel(), shouldShowChatManager() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.38
Nodes (7): canActivateDeleteCandidate(), isFlutterChatRow(), isHoverActionLabel(), isMenuButtonLabel(), isNavigationActionLabel(), normalizeSpace(), semanticLabel()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): applyPrefixToSelectedChats(), discoverChatRows(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds(), selectRootChatRows()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (5): button(), chatIdentity(), cleanChatTitle(), describeRow(), renderManagerPanel()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 2` to `Community 0`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 3` to `Community 0`, `Community 5`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._