# Graph Report - zapia_manager  (2026-09-06)

## Corpus Check
- 2 files · ~9,837 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 35 nodes · 63 edges · 6 communities detected
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
1. `applyPrefix()` - 7 edges
2. `openNativeDelete()` - 6 edges
3. `describeRow()` - 5 edges
4. `prepareNextNativeDelete()` - 5 edges
5. `normalizeSpace()` - 4 edges
6. `discoverChatRows()` - 4 edges
7. `mountRowControls()` - 4 edges
8. `queueFromSelection()` - 4 edges
9. `renderToolbar()` - 4 edges
10. `mountControls()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 1_
- `applyPrefix()` --calls--> `describeRow()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 1_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 0_
- `renderToolbar()` --calls--> `button()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 0_
- `boot()` --calls--> `mountControls()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 6_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (8): discoverChatRows(), mountControls(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection(), queueVisibleSelectedChatIds(), renderToolbar(), selectLeafChatRows()

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (7): applyPrefix(), openNativeDelete(), rowMenuButton(), setInputValue(), toast(), visibleSaveAction(), waitFor()

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (6): button(), canActivateDeleteCandidate(), chatIdentity(), describeRow(), mountRowControls(), normalizeSpace()

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (2): stripManagedPrefix(), withPrefix()

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (2): visibleMenuAction(), visibleMenus()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): boot(), installStyles()

## Knowledge Gaps
- **Thin community `Community 4`** (2 nodes): `stripManagedPrefix()`, `withPrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (2 nodes): `visibleMenuAction()`, `visibleMenus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `boot()`, `installStyles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `applyPrefix()` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `openNativeDelete()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `prepareNextNativeDelete()` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._