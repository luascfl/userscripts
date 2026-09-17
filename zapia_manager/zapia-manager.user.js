// ==UserScript==
// @name         Zapia Manager
// @namespace    https://github.com/luascfl/userscripts
// @version      0.1.21
// @description  Prefix Zapia chat titles and safely prepare native deletion dialogs.
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
  const MENU_BUTTON_PATTERN = /(?:menu|more|options|opções|mais|ações|actions)/i;
  const EDIT_PATTERN = /(?:renomear|editar(?:\s+(?:nome|chat|conversa))?|rename|edit(?:\s+(?:name|chat|conversation))?)/i;
  const DELETE_PATTERN = /(?:excluir|apagar|deletar|delete|remove)/i;
  const selectedChatIds = new Set();
  const staleControlTimestamps = new Map();
  const STALE_GRACE_MS = 400;
  const HEADER_CLIP_TOP = 50;
  let observerScheduled = false;

  function normalizeSpace(value) {
    return String(value ?? '').replace(/\s+/gu, ' ').trim();
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
    return Boolean(element?.closest?.('[data-zapia-manager-control], [data-zapia-manager-toolbar]'));
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
    if (isNavigationActionLabel(label)) return false;

    const rowRect = row.getBoundingClientRect();
    if (Math.abs(rowRect.left - viewport.navRect.left) > 5) return false;
    if (rowRect.height < 20 || rowRect.height > 100) return false;
    return rowRect.top >= viewport.top && rowRect.bottom <= viewport.bottom;
  }

  function discoverChatRows(viewport = getChatViewport()) {
    const candidates = [...document.querySelectorAll(CHAT_ROW_SELECTORS.join(','))]
      .filter((row) => isVisible(row) && !row.closest('[data-zapia-manager-toolbar]'))
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

  function semanticButton(pattern) {
    return semanticButtons().find((element) => pattern.test(semanticLabel(element))) ?? null;
  }

  function rowMenuButton(row) {
    const candidates = [...row.querySelectorAll('button:not([data-zapia-manager-control])')];
    return candidates.find((button) => {
      const label = [button.getAttribute('aria-label'), button.title, button.textContent].filter(Boolean).join(' ');
      return MENU_BUTTON_PATTERN.test(label) || normalizeSpace(button.textContent) === '...';
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
      const isMenu = group?.getAttribute('role') === 'group'
        && group.querySelectorAll(':scope > flt-semantics[role="button"]').length > 1;
      return isMenu && pattern.test(semanticLabel(element));
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
    const htmlDialog = [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-dialog-content]')]
      .filter(isVisible)
      .find((dialog) => dialog.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea'));
    if (htmlDialog) return htmlDialog.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea');

    return [...document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea')]
      .find((input) => isVisible(input) && !input.disabled && input.getBoundingClientRect().width > 0) ?? null;
  }

  function nativeDeleteDialogOpen() {
    const htmlDialogOpen = [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-alert-dialog-content]')]
      .filter(isVisible)
      .some((dialog) => DELETE_PATTERN.test(normalizeSpace(dialog.textContent)));
    if (htmlDialogOpen) return true;

    return [...document.querySelectorAll('flt-semantics[role="group"]')]
      .filter(isVisible)
      .some((group) => {
        const labels = [...group.querySelectorAll(':scope flt-semantics[role="button"]')].map(semanticLabel);
        return DELETE_PATTERN.test(normalizeSpace(group.textContent))
          && labels.some((label) => DELETE_PATTERN.test(label))
          && labels.some((label) => /^(?:cancelar|cancel)$/i.test(label));
      });
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

    row.click();
    const menuButton = await waitFor(() => semanticButton(MENU_BUTTON_PATTERN), 'the native options button');
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
  }

  async function openNativeDelete(row) {
    await openNativeActions(row);
    const deleteAction = await waitFor(
      () => visibleMenuAction(DELETE_PATTERN),
      'the native delete menu action',
    );
    deleteAction.click();
    toast('A confirmação final é do Zapia. Confirme ou cancele no diálogo nativo.', 'warning');
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

  function rowControlsFor(id) {
    return [...document.querySelectorAll('[data-zapia-manager-controls]')]
      .find((controls) => controls.dataset.zapiaManagerChatId === id) ?? null;
  }

  function controlLayer(viewport) {
    let layer = document.querySelector('[data-zapia-manager-layer]');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'zapia-manager-layer';
      layer.dataset.zapiaManagerLayer = 'true';
      layer.dataset.zapiaManagerControl = 'true';
      document.body.append(layer);
    }

    layer.style.left = `${viewport.navRect.left}px`;
    layer.style.top = `${viewport.top}px`;
    layer.style.width = `${viewport.navRect.width}px`;
    layer.style.height = `${Math.max(0, viewport.bottom - viewport.top)}px`;
    return layer;
  }

  function positionRowControls(controls, row, viewport) {
    const rect = row.getBoundingClientRect();
    const targetLeft = Math.max(4, viewport.navRect.width - controls.offsetWidth - 6);
    const targetTop = rect.top + rect.height / 2 - viewport.top;
    const currentLeft = parseFloat(controls.style.left);
    const currentTop = parseFloat(controls.style.top);

    if (Number.isNaN(currentLeft) || Math.abs(currentLeft - targetLeft) > 0.5) controls.style.left = `${targetLeft}px`;
    if (Number.isNaN(currentTop) || Math.abs(currentTop - targetTop) > 0.5) controls.style.top = `${targetTop}px`;
  }

  function mountRowControls(row, viewport, layer) {
    const id = chatIdentity(row);
    let controls = rowControlsFor(id);
    if (controls) {
      controls.querySelector('.zapia-manager-select').checked = selectedChatIds.has(id);
      positionRowControls(controls, row, viewport);
      return;
    }

    controls = document.createElement('span');
    controls.className = 'zapia-manager-row-controls';
    controls.dataset.zapiaManagerControls = 'true';
    controls.dataset.zapiaManagerControl = 'true';
    controls.dataset.zapiaManagerChatId = id;

    const select = document.createElement('input');
    select.type = 'checkbox';
    select.className = 'zapia-manager-select';
    select.dataset.zapiaManagerControl = 'true';
    select.checked = selectedChatIds.has(id);
    select.setAttribute('aria-label', `Selecionar ${describeRow(row)}`);
    select.addEventListener('click', (event) => event.stopPropagation());
    select.addEventListener('change', () => {
      if (select.checked) selectedChatIds.add(id);
      else selectedChatIds.delete(id);
      renderToolbar();
    });

    controls.append(select);
    layer.append(controls);
    positionRowControls(controls, row, viewport);
  }

  function queueFromSelection() {
    const rowsById = new Map(discoverChatRows().map((row) => [chatIdentity(row), row]));
    deletionQueue = queueVisibleSelectedChatIds(selectedChatIds, rowsById);
    return rowsById;
  }

  async function applyPrefixToSelectedChats(prefix) {
    const rowsById = queueFromSelection();
    if (!deletionQueue.length) throw new Error('Selecione pelo menos um chat visível.');

    for (const id of deletionQueue) {
      if (!rowsById.has(id)) continue;
      await rediscoverAndApply(id, prefix);
      selectedChatIds.delete(id);
    }
    deletionQueue = [];
    mountControls();
  }

  async function prepareNextNativeDelete() {
    if (nativeDeleteDialogOpen()) {
      throw new Error('Conclua ou cancele o diálogo nativo do Zapia antes de preparar o próximo chat.');
    }

    const rowsById = queueFromSelection();
    const nextId = deletionQueue[0];
    if (!nextId) throw new Error('Selecione pelo menos um chat visível.');
    const row = rowsById.get(nextId);
    await openNativeDelete(row);
    selectedChatIds.delete(nextId);
    deletionQueue.shift();
    renderToolbar();
  }

  function renderToolbar() {
    const count = selectedChatIds.size;
    let toolbar = document.querySelector('[data-zapia-manager-toolbar]');
    if (count === 0) {
      toolbar?.remove();
      return;
    }

    const state = `${count}:${deletionQueue.length}`;
    if (toolbar?.dataset.zapiaManagerState === state) return;
    if (!toolbar) {
      toolbar = document.createElement('aside');
      toolbar.className = 'zapia-manager-toolbar';
      toolbar.dataset.zapiaManagerToolbar = 'true';
      toolbar.setAttribute('aria-live', 'polite');
      document.body.append(toolbar);
    }

    toolbar.dataset.zapiaManagerState = state;
    toolbar.replaceChildren();
    const status = document.createElement('strong');
    status.textContent = `${count} chat${count === 1 ? '' : 's'} selecionado${count === 1 ? '' : 's'}`;
    toolbar.append(status);

    const prefixOk = button('✔ Prefixar', 'Aplica o prefixo ✔ aos chats visíveis selecionados', () => applyPrefixToSelectedChats('✔ '));
    toolbar.append(prefixOk);

    const prefixYellow = button('🟡 Prefixar', 'Aplica o prefixo 🟡 aos chats visíveis selecionados', () => applyPrefixToSelectedChats('🟡 '));
    toolbar.append(prefixYellow);

    const prepare = button(
      deletionQueue.length ? `Abrir próximo (${deletionQueue.length})` : 'Abrir exclusão nativa',
      'Abre somente o primeiro diálogo nativo de exclusão, sem confirmá-lo',
      prepareNextNativeDelete,
    );
    toolbar.append(prepare);

    toolbar.append(button('Limpar seleção', 'Limpar seleção de chats', () => {
      selectedChatIds.clear();
      deletionQueue = [];
      mountControls();
    }));
  }

  function removeToolbar() {
    document.querySelector('[data-zapia-manager-toolbar]')?.remove();
  }

  async function rediscoverAndApply(id, prefix) {
    let row = discoverChatRows().find((r) => chatIdentity(r) === id);
    if (!row) {
      await new Promise((r) => setTimeout(r, 300));
      row = discoverChatRows().find((r) => chatIdentity(r) === id);
    }
    if (!row) throw new Error('Chat não encontrado. Tente novamente.');
    await applyPrefix(row, prefix);
  }

  function isRowStillInDom(chatId) {
    const title = chatId.replace(/^text:/, '');
    const nav = document.querySelector('flt-semantics[aria-label="Menu de navegação"]');
    if (!nav) return false;
    return [...nav.querySelectorAll('flt-semantics[role="button"]')].some(
      (b) => cleanChatTitle(normalizeSpace(b.textContent || '')) === title,
    );
  }

  function removeStaleRowControls(rows) {
    const ids = new Set(rows.map(chatIdentity));
    const now = Date.now();
    for (const controls of document.querySelectorAll('[data-zapia-manager-controls]')) {
      const cid = controls.dataset.zapiaManagerChatId;
      if (ids.has(cid)) {
        staleControlTimestamps.delete(cid);
      } else if (isRowStillInDom(cid)) {
        controls.remove();
        staleControlTimestamps.delete(cid);
      } else if (!staleControlTimestamps.has(cid)) {
        staleControlTimestamps.set(cid, now);
      } else if (now - staleControlTimestamps.get(cid) > STALE_GRACE_MS) {
        controls.remove();
        staleControlTimestamps.delete(cid);
      }
    }
  }

  function removeRowControls() {
    document.querySelector('[data-zapia-manager-layer]')?.remove();
    staleControlTimestamps.clear();
  }

  function mountControls() {
    enableFlutterSemantics();
    const viewport = getChatViewport();
    const rows = discoverChatRows(viewport);
    if (!shouldShowChatManager(rows)) {
      removeRowControls();
      removeToolbar();
      return;
    }

    const layer = controlLayer(viewport);
    removeStaleRowControls(rows);
    rows.forEach((row) => mountRowControls(row, viewport, layer));
    renderToolbar();
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
      .zapia-manager-layer { position: fixed; z-index: 2147483647 !important; overflow: hidden; pointer-events: none; }
      .zapia-manager-row-controls { position: absolute; inline-size: 18px; block-size: 18px; transform: translateY(-50%); pointer-events: auto !important; }
      .zapia-manager-button { border: 1px solid currentColor; border-radius: 4px; background: Canvas; color: CanvasText; cursor: pointer; font: inherit; line-height: 1; min-block-size: 24px; padding: 2px 5px; pointer-events: auto !important; }
      .zapia-manager-button:disabled { cursor: not-allowed; opacity: .55; }
      .zapia-manager-select { box-sizing: border-box; inline-size: 18px; block-size: 18px; margin: 0; accent-color: #f5b700; cursor: pointer; }
      .zapia-manager-toolbar { position: fixed; z-index: 2147483647 !important; right: 16px; bottom: 16px; display: flex; max-inline-size: calc(100vw - 32px); flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px; border: 1px solid #a0a0a0; border-radius: 8px; background: Canvas; color: CanvasText; box-shadow: 0 3px 16px #0004; font: 14px system-ui, sans-serif; pointer-events: auto !important; }
      .zapia-manager-toast { position: fixed; z-index: 2147483647 !important; right: 16px; bottom: 76px; max-inline-size: min(420px, calc(100vw - 32px)); padding: 10px; border-radius: 6px; background: #222; color: #fff; font: 14px system-ui, sans-serif; pointer-events: auto !important; }
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
