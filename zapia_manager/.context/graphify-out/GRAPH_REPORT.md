# Graph Report - zapia_manager  (2026-09-06)

## Corpus Check
- 2 files · ~9,981 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 38 nodes · 68 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `applyPrefix()` - 7 edges
2. `openNativeDelete()` - 6 edges
3. `mountControls()` - 6 edges
4. `describeRow()` - 5 edges
5. `prepareNextNativeDelete()` - 5 edges
6. `normalizeSpace()` - 4 edges
7. `discoverChatRows()` - 4 edges
8. `mountRowControls()` - 4 edges
9. `queueFromSelection()` - 4 edges
10. `renderToolbar()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 7 → community 1_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 2_
- `applyPrefix()` --calls--> `describeRow()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 3 → community 1_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 4_
- `mountRowControls()` --calls--> `button()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 3_

## Communities

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (7): applyPrefix(), openNativeDelete(), rowMenuButton(), setInputValue(), toast(), visibleSaveAction(), waitFor()

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (5): boot(), installStyles(), mountControls(), removeToolbar(), shouldShowChatManager()

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (5): canActivateDeleteCandidate(), chatIdentity(), describeRow(), mountRowControls(), normalizeSpace()

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (4): button(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), renderToolbar()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): discoverChatRows(), queueFromSelection(), queueVisibleSelectedChatIds(), selectLeafChatRows()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): visibleMenuAction(), visibleMenus()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): stripManagedPrefix(), withPrefix()

## Knowledge Gaps
- **Thin community `Community 6`** (2 nodes): `visibleMenuAction()`, `visibleMenus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `stripManagedPrefix()`, `withPrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `applyPrefix()` connect `Community 1` to `Community 0`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `mountControls()` connect `Community 2` to `Community 0`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `openNativeDelete()` connect `Community 1` to `Community 0`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._