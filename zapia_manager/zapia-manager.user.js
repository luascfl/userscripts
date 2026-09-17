// ==UserScript==
// @name         Zapia Manager
// @namespace    https://github.com/luascfl/userscripts
// @version      0.2.11
// @description  Manage visible Zapia chats from a separate panel, including one-at-a-time native deletion.
// @match        https://app.zapia.com/chat*
// @match        https://app.zapia.com/chat/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const MANAGED_PREFIXES = ['✔ ', '🟡 '];
  const PREFIX_PATTERN = /^(?:✔|🟡)\s*/u;
  const CHAT_ROW_SELECTORS = [
    'a[href*="/chat/"]',
    '[data-testid*="chat-item" i]',
    '[data-testid*="conversation-item" i]',
    '[role="listitem"][data-chat-id]',
    'flt-semantics[role="button"]',
  ];
  const NAVIGATION_ACTION_LABELS = new Set([
    'Novo Chat',
    'Buscar',
    'Agendados',
    'Radar',
    'Conectores',
    'Compartilhe e ganhe',
    'Indique e ganhe',
    'Fixados',
    'Conversas',
  ]);
  const PRIMARY_NAVIGATION_LABELS = new Set([
    'Novo Chat',
    'Buscar',
    'Agendados',
    'Conectores',
    'Compartilhe e ganhe',
    'Indique e ganhe',
  ]);
  const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/u;
  const MENU_BUTTON_PATTERN = /^(?:menu|more|options|opções|mais ações|actions)$/i;
  const EDIT_PATTERN = /(?:renomear|editar(?:\s+(?:nome|chat|conversa))?|rename|edit(?:\s+(?:name|chat|conversation))?)/i;
  const DELETE_PATTERN = /(?:excluir|apagar|deletar|delete|remove)/i;
  const HOVER_ACTION_PATTERN = /^(?:mais ações|more actions)$/i;
  const selectedChatIds = new Set();
  let deletionQueue = [];
  const HEADER_CLIP_TOP = 50;
  let observerScheduled = false;
  let panelCollapsed = false;

  function normalizeSpace(value) {
    return String(value ?? '').replace(/\s+/gu, ' ').trim();
  }

  function isMenuButtonLabel(label) {
    return MENU_BUTTON_PATTERN.test(normalizeSpace(label));
  }

  function isHoverActionLabel(label) {
    return HOVER_ACTION_PATTERN.test(normalizeSpace(label));
  }

  function isNavigationActionLabel(label) {
    const normalized = normalizeSpace(label);
    if (NAVIGATION_ACTION_LABELS.has(normalized) || /^Radar(?:\s+\d+)?$/u.test(normalized)) return true;
    return normalized.includes('Logo Zapia') || EMAIL_PATTERN.test(normalized);
  }

  function cleanChatTitle(text) {
    return text.replace(/\s*(?:Renomear|Excluir|Fixar|Desafixar|Reportar|Mais ações|Compartilhar|Ouvir|Boa Resposta|Resposta ruim|Editar|Opções|Menu|Share|Delete|Rename|Pin|Unpin|Options|\.\.\.)+$/gi, '').trim();
  }

  function stripManagedPrefix(title) {
    return String(title ?? '').replace(PREFIX_PATTERN, '');
  }

  function withPrefix(title, prefix) {
    if (!MANAGED_PREFIXES.includes(prefix)) {
      throw new Error(`Unsupported Zapia label: ${prefix}`);
    }
    return `${prefix}${stripManagedPrefix(title).trimStart()}`;
  }

  function canActivateDeleteCandidate({ containerRole, label }) {
    return containerRole === 'menu' && DELETE_PATTERN.test(normalizeSpace(label));
  }

  function selectRootChatRows(candidates) {
    return candidates.filter((row) => !candidates.some((other) => other !== row && other.contains(row)));
  }

  function queueVisibleSelectedChatIds(selectedIds, visibleIds) {
    return [...selectedIds].filter((id) => visibleIds.has(id));
  }

  function isManagedNode(node) {
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    return Boolean(element?.closest?.('[data-zapia-manager-control]'));
  }

  function needsRemount(records) {
    return records.some((record) => {
      if (isManagedNode(record.target)) return false;
      const changedNodes = [...record.addedNodes, ...record.removedNodes];
      return changedNodes.some((node) => !isManagedNode(node));
    });
  }

  function shouldShowChatManager(chatRows) {
    return chatRows.length > 0;
  }

  function requestZapiaCacheRecovery(storage) {
    const recoveryMarker = 'zapia_manager_cache_recovery_v1';
    const zapiaMarker = 'zapia_cache_flushed_v7';
    try {
      if (storage.getItem(recoveryMarker)) return false;
      storage.setItem(recoveryMarker, '1');
      storage.removeItem(zapiaMarker);
      return true;
    } catch {
      return false;
    }
  }

  const testApi = {
    normalizeSpace,
    stripManagedPrefix,
    withPrefix,
    canActivateDeleteCandidate,
    isHoverActionLabel,
    isMenuButtonLabel,
    selectRootChatRows,
    queueVisibleSelectedChatIds,
    isManagedNode,
    needsRemount,
    shouldShowChatManager,
    requestZapiaCacheRecovery,
    isNavigationActionLabel,
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = testApi;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  requestZapiaCacheRecovery(window.localStorage);

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
  }

  function enableFlutterSemantics() {
    const placeholder = document.querySelector('flt-semantics-placeholder[aria-label="Enable accessibility"]');
    if (!placeholder || placeholder.dataset.zapiaManagerEnabled === 'true') return false;

    placeholder.dataset.zapiaManagerEnabled = 'true';
    placeholder.click();
    return true;
  }

  function chatIdentity(row) {
    const link = row.matches('a[href]') ? row : row.querySelector('a[href*="/chat/"]');
    const explicitId = row.getAttribute('data-chat-id') || row.getAttribute('data-conversation-id');
    const rawText = normalizeSpace(row.textContent || row.getAttribute('aria-label') || '');
    return explicitId || link?.href || `text:${cleanChatTitle(rawText)}`;
  }

  function getChatViewport() {
    const nav = document.querySelector('flt-semantics[aria-label="Menu de navegação"]');
    if (!nav) return null;

    const navRect = nav.getBoundingClientRect();
    const buttons = [...nav.querySelectorAll('flt-semantics[role="button"]')];
    const primaryBottom = buttons.reduce((bottom, button) => {
      const label = normalizeSpace(button.textContent || button.getAttribute('aria-label') || '');
      if (PRIMARY_NAVIGATION_LABELS.has(label) || /^Radar(?:\s+\d+)?$/u.test(label)) {
        return Math.max(bottom, button.getBoundingClientRect().bottom);
      }
      return bottom;
    }, HEADER_CLIP_TOP);
    const profileTop = buttons.reduce((top, button) => {
      const rect = button.getBoundingClientRect();
      const label = normalizeSpace(button.textContent || button.getAttribute('aria-label') || '');
      if (rect.left > navRect.left + 5 && EMAIL_PATTERN.test(label)) return Math.min(top, rect.top);
      return top;
    }, window.innerHeight);

    return {
      nav,
      navRect,
      top: Math.max(HEADER_CLIP_TOP, primaryBottom),
      bottom: Math.min(window.innerHeight, profileTop),
    };
  }

  function isFlutterChatRow(row, viewport) {
    if (!viewport || !row.matches('flt-semantics[role="button"]')) return false;
    if (!viewport.nav.contains(row)) return false;

    const label = normalizeSpace(row.textContent || row.getAttribute('aria-label') || '');
    if (isNavigationActionLabel(label) || isHoverActionLabel(label)) return false;

    const rowRect = row.getBoundingClientRect();
    if (rowRect.height < 20 || rowRect.height > 100) return false;
    return rowRect.top >= viewport.top && rowRect.bottom <= viewport.bottom;
  }

  function hasChatHoverAction(viewport) {
    if (!viewport) return false;
    return [...viewport.nav.querySelectorAll('flt-semantics[role="button"]')].some((element) => {
      if (!isVisible(element) || !isHoverActionLabel(semanticLabel(element))) return false;
      const rect = element.getBoundingClientRect();
      return rect.top >= viewport.top && rect.bottom <= viewport.bottom;
    });
  }

  function discoverChatRows(viewport = getChatViewport()) {
    const candidates = [...document.querySelectorAll(CHAT_ROW_SELECTORS.join(','))]
      .filter((row) => isVisible(row) && !row.closest('[data-zapia-manager-control]'))
      .filter((row) => normalizeSpace(row.textContent).length > 0)
      .filter((row) => isFlutterChatRow(row, viewport));

    return selectRootChatRows(candidates);
  }

  function describeRow(row) {
    const named = row.querySelector('[data-testid*="title" i], [data-testid*="name" i], [class*="title" i], [class*="name" i]');
    const rawText = normalizeSpace(named?.textContent || row.textContent || row.getAttribute('aria-label') || '');
    return cleanChatTitle(rawText).slice(0, 80) || 'chat sem título';
  }

  function semanticLabel(element) {
    const label = normalizeSpace(element.textContent || element.getAttribute('aria-label'));
    return label.replace(/^(.+?)\s+\1$/u, '$1');
  }

  function semanticButtons() {
    return [...document.querySelectorAll('flt-semantics[role="button"]')]
      .filter((element) => isVisible(element) && !element.closest('[data-zapia-manager-control]'));
  }

  function semanticMenuButton() {
    return semanticButtons().find((element) => isMenuButtonLabel(semanticLabel(element))) ?? null;
  }

  function semanticButton(pattern) {
    return semanticButtons().find((element) => pattern.test(semanticLabel(element))) ?? null;
  }

  function rowMenuButton(row) {
    const candidates = [...row.querySelectorAll('button:not([data-zapia-manager-control])')];
    return candidates.find((button) => {
      const label = [button.getAttribute('aria-label'), button.title, button.textContent].filter(Boolean).join(' ');
      return isMenuButtonLabel(label) || normalizeSpace(button.textContent) === '...';
    }) ?? null;
  }

  function waitFor(find, description, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      const complete = (result) => {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(result);
      };
      const check = () => {
        const result = find();
        if (result) complete(result);
      };
      const observer = new MutationObserver(check);
      timeoutId = window.setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Zapia did not render ${description}.`));
      }, timeoutMs);
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-expanded', 'data-state', 'style', 'class'] });
      check();
    });
  }

  function visibleMenus() {
    return [...document.querySelectorAll('[role="menu"], [data-radix-menu-content], [data-radix-popper-content-wrapper]')]
      .filter(isVisible);
  }

  function visibleSemanticMenuAction(pattern) {
    return semanticButtons().find((element) => {
      const group = element.parentElement;
      return group?.getAttribute('role') === 'group'
        && pattern.test(semanticLabel(element));
    }) ?? null;
  }

  function visibleMenuAction(pattern) {
    for (const menu of visibleMenus()) {
      const action = [...menu.querySelectorAll('[role="menuitem"], button, [role="button"]')]
        .find((element) => pattern.test(normalizeSpace(element.textContent || element.getAttribute('aria-label'))));
      if (action) return action;
    }
    return visibleSemanticMenuAction(pattern);
  }

  function nativeRenameInput() {
    const dialog = [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-dialog-content]')]
      .filter(isVisible)
      .find((candidate) => candidate.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea'));
    if (dialog) return dialog.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea');

    const focused = document.activeElement;
    if (
      (focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement)
      && isVisible(focused)
      && !focused.closest('[data-zapia-manager-control]')
    ) return focused;
    return null;
  }

  function nativeDeleteDialog() {
    const htmlDialog = [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-alert-dialog-content]')]
      .filter(isVisible)
      .find((dialog) => DELETE_PATTERN.test(normalizeSpace(dialog.textContent)));
    if (htmlDialog) return htmlDialog;

    return [...document.querySelectorAll('flt-semantics')]
      .filter(isVisible)
      .find((group) => {
        const labels = [...group.querySelectorAll(':scope flt-semantics[role="button"]')].map(semanticLabel);
        return /excluir conversa\?|delete conversation\?/i.test(normalizeSpace(group.textContent))
          && labels.some((label) => /^(?:excluir|delete)$/i.test(label))
          && labels.some((label) => /^(?:cancelar|cancel)$/i.test(label));
      }) ?? null;
  }

  function nativeDeleteDialogOpen() {
    return nativeDeleteDialog() !== null;
  }

  function nativeDeleteConfirmAction() {
    const dialog = nativeDeleteDialog();
    if (!dialog) return null;
    return [...dialog.querySelectorAll('button, [role="button"], flt-semantics[role="button"]')]
      .find((button) => /^(?:excluir|delete)$/i.test(semanticLabel(button))) ?? null;
  }

  function setInputValue(input, value) {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function visibleSaveAction() {
    const htmlAction = [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-dialog-content]')]
      .filter(isVisible)
      .flatMap((dialog) => [...dialog.querySelectorAll('button, [role="button"]')])
      .find((button) => {
        const label = normalizeSpace(button.textContent || button.getAttribute('aria-label'));
        return /^(?:salvar|save|confirmar|confirm)$/i.test(label) && !DELETE_PATTERN.test(label);
      });
    return htmlAction ?? semanticButton(/^(?:salvar|save|confirmar|confirm|ok)$/i);
  }

  function toast(message, kind = 'info') {
    const notice = document.createElement('output');
    notice.className = `zapia-manager-toast zapia-manager-toast-${kind}`;
    notice.textContent = message;
    document.body.append(notice);
    window.setTimeout(() => notice.remove(), 4500);
  }

  async function openNativeActions(row) {
    const embeddedMenuButton = rowMenuButton(row);
    if (embeddedMenuButton) {
      embeddedMenuButton.click();
      return;
    }

    const previousMenuButton = semanticMenuButton();
    row.click();
    const menuButton = await waitFor(() => {
      const currentMenuButton = semanticMenuButton();
      return currentMenuButton && currentMenuButton !== previousMenuButton ? currentMenuButton : null;
    }, 'the selected chat native more-actions button');
    menuButton.click();
  }

  async function applyPrefix(row, prefix) {
    await openNativeActions(row);
    const editAction = await waitFor(() => visibleMenuAction(EDIT_PATTERN), 'the native rename action');
    editAction.click();

    const input = await waitFor(nativeRenameInput, 'the native rename dialog');
    const saveAction = visibleSaveAction();
    if (!input || !saveAction) throw new Error('The native rename dialog does not expose a safe text input and save button.');

    setInputValue(input, withPrefix(input.value, prefix));
    saveAction.click();
    await waitFor(
      () => !input.isConnected || !isVisible(input),
      'the native rename dialog to close',
    );
  }

  async function deleteChat(row) {
    await openNativeActions(row);
    const deleteAction = await waitFor(
      () => visibleMenuAction(DELETE_PATTERN),
      'the native delete menu action',
    );
    deleteAction.click();
    const confirmAction = await waitFor(nativeDeleteConfirmAction, 'the native delete confirmation');
    confirmAction.click();
    await waitFor(
      () => !nativeDeleteDialogOpen(),
      'the native delete confirmation to close',
    );
  }

  function button(label, title, handler) {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'zapia-manager-button';
    element.dataset.zapiaManagerControl = 'true';
    element.textContent = label;
    element.title = title;
    element.setAttribute('aria-label', title);
    element.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await handler();
      } catch (error) {
        toast(error.message, 'error');
      }
    });
    return element;
  }

  function queueFromSelection() {
    const rowsById = new Map(discoverChatRows().map((row) => [chatIdentity(row), row]));
    deletionQueue = queueVisibleSelectedChatIds(selectedChatIds, rowsById);
    return rowsById;
  }

  async function applyPrefixToSelectedChats(prefix) {
    const rowsById = queueFromSelection();
    if (!deletionQueue.length) throw new Error('Selecione pelo menos um chat visível.');

    for (const id of [...deletionQueue]) {
      await rediscoverAndApply(id, prefix);
      selectedChatIds.delete(id);
    }
    deletionQueue = [];
    mountControls();
  }

  async function deleteSelectedChats() {
    if (nativeDeleteDialogOpen()) {
      throw new Error('Conclua ou cancele o diálogo nativo do Zapia antes de excluir outro chat.');
    }

    queueFromSelection();
    if (!deletionQueue.length) throw new Error('Selecione pelo menos um chat visível.');

    for (const id of [...deletionQueue]) {
      await rediscoverAndDelete(id);
      selectedChatIds.delete(id);
    }
    deletionQueue = [];
    mountControls();
  }

  function renderManagerPanel(rows) {
    const state = panelCollapsed
      ? 'collapsed'
      : rows.map((row) => `${chatIdentity(row)}:${selectedChatIds.has(chatIdentity(row))}`).join('\n');
    let panel = document.querySelector('[data-zapia-manager-panel]');
    if (panel?.dataset.zapiaManagerState === state) return;
    if (!panel) {
      panel = document.createElement('aside');
      panel.className = 'zapia-manager-panel';
      panel.dataset.zapiaManagerPanel = 'true';
      panel.dataset.zapiaManagerControl = 'true';
      panel.setAttribute('aria-live', 'polite');
      document.body.append(panel);
    }

    panel.dataset.zapiaManagerState = state;
    panel.classList.toggle('is-collapsed', panelCollapsed);
    panel.replaceChildren();
    if (panelCollapsed) {
      const expand = button('Gerenciar chats', 'Abrir Zapia Manager', () => {
        panelCollapsed = false;
        renderManagerPanel(rows);
      });
      expand.classList.add('zapia-manager-launcher');
      expand.setAttribute('aria-expanded', 'false');
      panel.append(expand);
      return;
    }

    const heading = document.createElement('div');
    heading.className = 'zapia-manager-panel-heading';
    const headingCopy = document.createElement('div');
    headingCopy.className = 'zapia-manager-panel-heading-copy';
    const title = document.createElement('strong');
    title.textContent = 'Zapia Manager';
    const summary = document.createElement('span');
    summary.textContent = `${rows.length} visíveis · ${selectedChatIds.size} selecionado${selectedChatIds.size === 1 ? '' : 's'}`;
    headingCopy.append(title, summary);
    const minimize = button('Minimizar', 'Minimizar Zapia Manager', () => {
      panelCollapsed = true;
      renderManagerPanel(rows);
    });
    minimize.classList.add('zapia-manager-minimize');
    minimize.setAttribute('aria-expanded', 'true');
    heading.append(headingCopy, minimize);
    panel.append(heading);

    const list = document.createElement('div');
    list.className = 'zapia-manager-chat-list';
    for (const row of rows) {
      const id = chatIdentity(row);
      const option = document.createElement('label');
      option.className = 'zapia-manager-chat-option';
      const select = document.createElement('input');
      select.type = 'checkbox';
      select.checked = selectedChatIds.has(id);
      select.setAttribute('aria-label', `Selecionar ${describeRow(row)}`);
      select.addEventListener('change', () => {
        if (select.checked) selectedChatIds.add(id);
        else selectedChatIds.delete(id);
        renderManagerPanel(rows);
      });
      const label = document.createElement('span');
      label.textContent = describeRow(row);
      option.append(select, label);
      list.append(option);
    }
    panel.append(list);

    const actions = document.createElement('div');
    actions.className = 'zapia-manager-panel-actions';
    const hasSelection = selectedChatIds.size > 0;
    const prefixOk = button('✔ Prefixar', 'Aplica o prefixo ✔ aos chats visíveis selecionados', () => applyPrefixToSelectedChats('✔ '));
    prefixOk.disabled = !hasSelection;
    const prefixYellow = button('🟡 Prefixar', 'Aplica o prefixo 🟡 aos chats visíveis selecionados', () => applyPrefixToSelectedChats('🟡 '));
    prefixYellow.disabled = !hasSelection;
    const prepare = button(
      'Excluir selecionados',
      'Exclui cada chat selecionado, um por vez, pela confirmação nativa do Zapia',
      deleteSelectedChats,
    );
    prepare.disabled = !hasSelection;
    const clear = button('Limpar seleção', 'Limpar seleção de chats', () => {
      selectedChatIds.clear();
      deletionQueue = [];
      mountControls();
    });
    clear.disabled = !hasSelection;
    actions.append(prefixOk, prefixYellow, prepare, clear);
    panel.append(actions);
  }

  function removeManagerPanel() {
    document.querySelector('[data-zapia-manager-panel]')?.remove();
  }

  async function rediscoverAndApply(id, prefix) {
    const row = await waitFor(
      () => discoverChatRows().find((candidate) => chatIdentity(candidate) === id) ?? null,
      `chat ${id}`,
    );
    await applyPrefix(row, prefix);
  }

  async function rediscoverAndDelete(id) {
    const row = await waitFor(
      () => discoverChatRows().find((candidate) => chatIdentity(candidate) === id) ?? null,
      `chat ${id}`,
    );
    await deleteChat(row);
  }

  function mountControls() {
    enableFlutterSemantics();
    const viewport = getChatViewport();
    const rows = discoverChatRows(viewport);
    const hoverActionOpen = hasChatHoverAction(viewport);
    if (!shouldShowChatManager(rows)) {
      if (!hoverActionOpen) removeManagerPanel();
      return;
    }
    if (hoverActionOpen) return;

    renderManagerPanel(rows);
  }

  function scheduleMount() {
    if (observerScheduled) return;
    observerScheduled = true;
    queueMicrotask(() => {
      observerScheduled = false;
      mountControls();
    });
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .zapia-manager-panel { position: fixed; z-index: 2147483647 !important; inset: 72px 16px 16px auto; box-sizing: border-box; display: flex; inline-size: min(320px, calc(100vw - 32px)); max-block-size: calc(100vh - 88px); flex-direction: column; overflow: hidden; border: 1px solid #48515b; border-radius: 10px; background: #15191e; color: #f3f6f8; box-shadow: 0 16px 40px #0008; font: 14px/1.35 system-ui, sans-serif; pointer-events: auto !important; }
      .zapia-manager-panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 14px 14px 10px; border-bottom: 1px solid #353d46; }
      .zapia-manager-panel-heading-copy { display: grid; min-inline-size: 0; gap: 2px; }
      .zapia-manager-panel-heading strong { font-size: 15px; }
      .zapia-manager-panel-heading span { color: #aeb8c2; font-size: 12px; }
      .zapia-manager-minimize { flex: 0 0 auto; min-block-size: 24px; padding: 2px 6px; }
      .zapia-manager-panel.is-collapsed { inset: auto 16px 16px auto; display: block; inline-size: max-content; min-inline-size: 0; max-inline-size: calc(100vw - 32px); max-block-size: none; overflow: visible; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
      .zapia-manager-launcher { min-block-size: 34px; padding-inline: 10px; box-shadow: 0 8px 24px #0008; }
      .zapia-manager-chat-list { display: grid; min-block-size: 0; flex: 1 1 auto; align-content: start; gap: 2px; overflow: auto; padding: 8px; }
      .zapia-manager-chat-option { display: flex; align-items: center; gap: 9px; min-inline-size: 0; padding: 7px 6px; border-radius: 6px; cursor: pointer; }
      .zapia-manager-chat-option:hover { background: #252c34; }
      .zapia-manager-chat-option input { flex: 0 0 auto; inline-size: 16px; block-size: 16px; margin: 0; accent-color: #e8b64b; cursor: pointer; }
      .zapia-manager-chat-option span { overflow: hidden; color: #e5e9ed; text-overflow: ellipsis; white-space: nowrap; }
      .zapia-manager-panel-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 10px; border-top: 1px solid #353d46; }
      .zapia-manager-button { border: 1px solid #52606d; border-radius: 6px; background: #232a32; color: #f3f6f8; cursor: pointer; font: inherit; line-height: 1.2; min-block-size: 30px; padding: 5px 7px; pointer-events: auto !important; }
      .zapia-manager-button:hover:not(:disabled) { background: #303a45; border-color: #6d7d8e; }
      .zapia-manager-button:focus-visible { outline: 2px solid #e8b64b; outline-offset: 2px; }
      .zapia-manager-button:disabled { cursor: not-allowed; opacity: .45; }
      .zapia-manager-toast { position: fixed; z-index: 2147483647 !important; right: 16px; bottom: 16px; max-inline-size: min(420px, calc(100vw - 32px)); padding: 10px; border-radius: 6px; background: #222; color: #fff; font: 14px system-ui, sans-serif; pointer-events: auto !important; }
      .zapia-manager-toast-error { background: #9f1d1d; }
      .zapia-manager-toast-warning { background: #7b5600; }
    `;
    document.head.append(style);
  }

  function boot() {
    if (!location.pathname.startsWith('/chat')) return;
    enableFlutterSemantics();
    installStyles();
    syncLoop();
  }

  function syncLoop() {
    mountControls();
    requestAnimationFrame(syncLoop);
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();
