# Graph Report - zapia_manager  (2026-09-16)

## Corpus Check
- 2 files · ~10,732 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 57 nodes · 111 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 12 edges
2. `normalizeSpace()` - 7 edges
3. `applyPrefix()` - 7 edges
4. `discoverChatRows()` - 5 edges
5. `openNativeActions()` - 5 edges
6. `openNativeDelete()` - 5 edges
7. `mountRowControls()` - 5 edges
8. `queueFromSelection()` - 5 edges
9. `prepareNextNativeDelete()` - 5 edges
10. `chatIdentity()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `mountControls()` --calls--> `enableFlutterSemantics()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 7 → community 5_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 3 → community 5_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 1_
- `rediscoverAndApply()` --calls--> `applyPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 3_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 6_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (11): canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isNavigationActionLabel(), mountRowControls(), normalizeSpace() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.28
Nodes (9): applyPrefix(), openNativeActions(), openNativeDelete(), rowMenuButton(), setInputValue(), stripManagedPrefix(), toast(), waitFor() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (6): applyPrefixToSelectedChats(), discoverChatRows(), queueFromSelection(), queueVisibleSelectedChatIds(), rediscoverAndApply(), selectRootChatRows()

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (6): semanticButton(), semanticButtons(), visibleMenuAction(), visibleMenus(), visibleSaveAction(), visibleSemanticMenuAction()

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): controlLayer(), getChatViewport(), mountControls(), removeRowControls(), removeToolbar(), shouldShowChatManager()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): button(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), renderToolbar()

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (4): boot(), enableFlutterSemantics(), installStyles(), syncLoop()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): isRowStillInDom(), removeStaleRowControls()

## Knowledge Gaps
- **Thin community `Community 8`** (2 nodes): `isRowStillInDom()`, `removeStaleRowControls()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 5` to `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._