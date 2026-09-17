# Graph Report - zapia_manager  (2026-09-16)

## Corpus Check
- 2 files · ~10,681 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 56 nodes · 108 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 11 edges
2. `normalizeSpace()` - 7 edges
3. `applyPrefix()` - 7 edges
4. `mountRowControls()` - 6 edges
5. `discoverChatRows()` - 5 edges
6. `openNativeActions()` - 5 edges
7. `openNativeDelete()` - 5 edges
8. `prepareNextNativeDelete()` - 5 edges
9. `chatIdentity()` - 4 edges
10. `describeRow()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `chatIdentity()` --calls--> `normalizeSpace()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 2_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 0_
- `visibleSemanticMenuAction()` --calls--> `semanticButtons()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 7_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 1_
- `rediscoverAndApply()` --calls--> `applyPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 4_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (10): boot(), controlLayer(), enableFlutterSemantics(), getChatViewport(), installStyles(), mountControls(), removeRowControls(), removeToolbar() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.28
Nodes (9): applyPrefix(), openNativeActions(), openNativeDelete(), rowMenuButton(), setInputValue(), stripManagedPrefix(), toast(), waitFor() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (8): button(), chatIdentity(), cleanChatTitle(), describeRow(), mountRowControls(), positionRowControls(), renderToolbar(), rowControlsFor()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): discoverChatRows(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds(), rediscoverAndApply(), selectRootChatRows()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (5): canActivateDeleteCandidate(), isFlutterChatRow(), isNavigationActionLabel(), normalizeSpace(), semanticLabel()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): semanticButton(), semanticButtons(), visibleSaveAction()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (3): visibleMenuAction(), visibleMenus(), visibleSemanticMenuAction()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): isRowStillInDom(), removeStaleRowControls()

## Knowledge Gaps
- **Thin community `Community 8`** (2 nodes): `isRowStillInDom()`, `removeStaleRowControls()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 0` to `Community 8`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 3`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 5` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._