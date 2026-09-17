# Graph Report - zapia_manager  (2026-09-17)

## Corpus Check
- 2 files · ~10,779 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 52 nodes · 102 edges · 6 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 10 edges
2. `normalizeSpace()` - 8 edges
3. `applyPrefix()` - 7 edges
4. `waitFor()` - 5 edges
5. `openNativeActions()` - 5 edges
6. `openNativeDelete()` - 5 edges
7. `queueFromSelection()` - 5 edges
8. `prepareNextNativeDelete()` - 5 edges
9. `renderManagerPanel()` - 5 edges
10. `chatIdentity()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `mountControls()` --calls--> `enableFlutterSemantics()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 1_
- `visibleSemanticMenuAction()` --calls--> `semanticButtons()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 6_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 2_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 1_
- `mountControls()` --calls--> `renderManagerPanel()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (11): button(), canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isMenuButtonLabel(), isNavigationActionLabel() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (11): applyPrefixToSelectedChats(), discoverChatRows(), getChatViewport(), mountControls(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.27
Nodes (10): applyPrefix(), openNativeActions(), openNativeDelete(), rediscoverAndApply(), rowMenuButton(), setInputValue(), stripManagedPrefix(), toast() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (4): semanticButton(), semanticButtons(), semanticMenuButton(), visibleSaveAction()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): boot(), enableFlutterSemantics(), installStyles(), syncLoop()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 1` to `Community 0`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 2` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._