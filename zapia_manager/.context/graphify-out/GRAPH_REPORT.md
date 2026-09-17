# Graph Report - zapia_manager  (2026-09-17)

## Corpus Check
- 2 files · ~11,625 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 69 nodes · 142 edges · 7 communities detected
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
1. `mountControls()` - 12 edges
2. `normalizeSpace()` - 9 edges
3. `applyPrefix()` - 9 edges
4. `waitFor()` - 7 edges
5. `deleteChat()` - 6 edges
6. `renderManagerPanel()` - 6 edges
7. `openNativeActions()` - 5 edges
8. `configurePreferences()` - 5 edges
9. `queueFromSelection()` - 5 edges
10. `deleteSelectedChats()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `applyPrefix()` --calls--> `withPrefix()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 6 → community 2_
- `renderManagerPanel()` --calls--> `shortcutLabel()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 1_
- `mountControls()` --calls--> `discoverChatRows()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 4 → community 3_
- `applyPrefix()` --calls--> `visibleSaveAction()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 0 → community 2_
- `configurePreferences()` --calls--> `mountControls()`  [EXTRACTED]
  zapia-manager.user.js → zapia-manager.user.js  _Bridges community 5 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (9): isVisible(), nativeRenameInput(), semanticButton(), semanticButtons(), semanticMenuButton(), visibleMenuAction(), visibleMenus(), visibleSaveAction() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.23
Nodes (12): button(), canActivateDeleteCandidate(), chatIdentity(), cleanChatTitle(), describeRow(), isFlutterChatRow(), isHoverActionLabel(), isMenuButtonLabel() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.31
Nodes (11): applyPrefix(), deleteChat(), openCurrentNativeActions(), openNativeActions(), rediscoverAndApply(), rediscoverAndDelete(), rowMenuButton(), runCurrentChatShortcut() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (10): boot(), enableFlutterSemantics(), getChatViewport(), hasChatHoverAction(), installKeyboardShortcuts(), installStyles(), mountControls(), removeManagerPanel() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (9): applyPrefixToSelectedChats(), deleteSelectedChats(), discoverChatRows(), nativeDeleteConfirmAction(), nativeDeleteDialog(), nativeDeleteDialogOpen(), queueFromSelection(), queueVisibleSelectedChatIds() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): configurePreferences(), isShortcut(), loadPreferences(), parseShortcut(), savePreferences(), shortcutLabel()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (3): configuredPrefixes(), stripManagedPrefix(), withPrefix()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mountControls()` connect `Community 3` to `Community 0`, `Community 1`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `normalizeSpace()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `applyPrefix()` connect `Community 2` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._