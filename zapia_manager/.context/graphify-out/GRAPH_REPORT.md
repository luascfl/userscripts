# Graph Report - zapia_manager  (2026-09-06)

## Corpus Check
- 2 files · ~9,633 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 30 nodes · 56 edges · 4 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `applyPrefix()` - 7 edges
2. `openNativeDelete()` - 6 edges
3. `describeRow()` - 5 edges
4. `prepareNextNativeDelete()` - 5 edges
5. `normalizeSpace()` - 4 edges
6. `mountRowControls()` - 4 edges
7. `renderToolbar()` - 4 edges
8. `mountControls()` - 4 edges
9. `withPrefix()` - 3 edges
10. `chatIdentity()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 1 → community 2_
- `applyPrefix()` --calls--> `describeRow()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 3 → community 2_
- `prepareNextNativeDelete()` --calls--> `openNativeDelete()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 2 → community 0_
- `mountRowControls()` --calls--> `button()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (9): boot(), button(), discoverChatRows(), installStyles(), mountControls(), nativeDeleteDialogOpen(), prepareNextNativeDelete(), queueFromSelection() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.32
Nodes (4): stripManagedPrefix(), visibleMenuAction(), visibleMenus(), withPrefix()

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (7): applyPrefix(), openNativeDelete(), rowMenuButton(), setInputValue(), toast(), visibleSaveAction(), waitFor()

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (5): canActivateDeleteCandidate(), chatIdentity(), describeRow(), mountRowControls(), normalizeSpace()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `applyPrefix()` connect `Community 2` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `openNativeDelete()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `prepareNextNativeDelete()` connect `Community 0` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._