# Graph Report - zapia_manager  (2026-09-06)

## Corpus Check
- 2 files · ~10,305 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 50 nodes · 93 edges · 7 communities detected
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

## God Nodes (most connected - your core abstractions)
1. `mountControls()` - 9 edges
2. `normalizeSpace()` - 6 edges
3. `applyPrefix()` - 6 edges
4. `mountRowControls()` - 6 edges
5. `openNativeActions()` - 5 edges
6. `openNativeDelete()` - 5 edges
7. `prepareNextNativeDelete()` - 5 edges
8. `discoverChatRows()` - 4 edges
9. `waitFor()` - 4 edges
10. `queueFromSelection()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `isNavigationActionLabel()` --calls--> `normalizeSpace()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 7_
- `describeRow()` --calls--> `normalizeSpace()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 5_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 2_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 0_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.28
Nodes (9): applyPrefix(), openNativeActions(), openNativeDelete(), rowMenuButton(), setInputValue(), stripManagedPrefix(), toast(), waitFor() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (8): button(), discoverChatRows(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds(), renderToolbar(), selectLeafChatRows()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (8): boot(), enableFlutterSemantics(), installStyles(), mountControls(), removeRowControls(), removeStaleRowControls(), removeToolbar(), shouldShowChatManager()

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (6): semanticButton(), semanticButtons(), visibleMenuAction(), visibleMenus(), visibleSaveAction(), visibleSemanticMenuAction()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): describeRow(), mountRowControls(), positionRowControls(), rowControlsFor()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): canActivateDeleteCandidate(), chatIdentity(), normalizeSpace(), semanticLabel()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): isFlutterChatRow(), isNavigationActionLabel()

## Knowledge Gaps
- **Thin community `Community 7`** (2 nodes): `isFlutterChatRow()`, `isNavigationActionLabel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 2` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 6` to `Community 3`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `mountRowControls()` connect `Community 5` to `Community 1`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._