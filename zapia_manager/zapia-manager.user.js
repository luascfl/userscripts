// ==UserScript==
// @name         Zapia Manager
// @namespace    https://github.com/luascfl/userscripts
// @version      0.1.0
// @description  Prefix Zapia chat titles and safely prepare native deletion dialogs.
// @match        https://app.zapia.com/chat*
// @match        https://app.zapia.com/chat/*
// @run-at       document-idle
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
  ];
  const MENU_BUTTON_PATTERN = /(?:menu|more|options|opções|mais|ações|actions)/i;
  const EDIT_PATTERN = /(?:renomear|editar(?:\s+(?:nome|chat|conversa))?|rename|edit(?:\s+(?:name|chat|conversation))?)/i;
  const DELETE_PATTERN = /(?:excluir|apagar|deletar|delete|remove)/i;
  const selectedChatIds = new Set();
  let deletionQueue = [];
  let observerScheduled = false;

  function normalizeSpace(value) {
    return String(value ?? '').replace(/\s+/gu, ' ').trim();
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

  function selectLeafChatRows(candidates) {
    return candidates.filter((row) => !candidates.some((other) => other !== row && row.contains(other)));
  }

  function queueVisibleSelectedChatIds(selectedIds, visibleIds) {
    return [...selectedIds].filter((id) => visibleIds.has(id));
  }

  const testApi = {
    normalizeSpace,
    stripManagedPrefix,
    withPrefix,
    canActivateDeleteCandidate,
    selectLeafChatRows,
    queueVisibleSelectedChatIds,
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = testApi;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
  }

  function chatIdentity(row) {
    const link = row.matches('a[href]') ? row : row.querySelector('a[href*="/chat/"]');
    const explicitId = row.getAttribute('data-chat-id') || row.getAttribute('data-conversation-id');
    return explicitId || link?.href || `text:${normalizeSpace(row.textContent)}`;
  }

  function discoverChatRows() {
    const candidates = [...document.querySelectorAll(CHAT_ROW_SELECTORS.join(','))]
      .filter((row) => isVisible(row) && !row.closest('[data-zapia-manager-toolbar]'))
      .filter((row) => normalizeSpace(row.textContent).length > 0);

    return selectLeafChatRows(candidates);
  }

  function describeRow(row) {
    const named = row.querySelector('[data-testid*="title" i], [data-testid*="name" i], [class*="title" i], [class*="name" i]');
    return normalizeSpace(named?.textContent || row.textContent).slice(0, 80) || 'chat sem título';
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

  function visibleMenuAction(pattern) {
    for (const menu of visibleMenus()) {
      const action = [...menu.querySelectorAll('[role="menuitem"], button, [role="button"]')]
        .find((element) => pattern.test(normalizeSpace(element.textContent || element.getAttribute('aria-label'))));
      if (action) return action;
    }
    return null;
  }

  function dialogWithTextInput() {
    return [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-dialog-content]')]
      .filter(isVisible)
      .find((dialog) => dialog.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea')) ?? null;
  }

  function nativeDeleteDialogOpen() {
    return [...document.querySelectorAll('dialog, [role="dialog"], [data-radix-alert-dialog-content]')]
      .filter(isVisible)
      .some((dialog) => DELETE_PATTERN.test(normalizeSpace(dialog.textContent)));
  }

  function setInputValue(input, value) {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function visibleSaveAction(dialog) {
    return [...dialog.querySelectorAll('button, [role="button"]')].find((button) => {
      const label = normalizeSpace(button.textContent || button.getAttribute('aria-label'));
      return /^(?:salvar|save|confirmar|confirm)$/i.test(label) && !DELETE_PATTERN.test(label);
    }) ?? null;
  }

  function toast(message, kind = 'info') {
    const notice = document.createElement('output');
    notice.className = `zapia-manager-toast zapia-manager-toast-${kind}`;
    notice.textContent = message;
    document.body.append(notice);
    window.setTimeout(() => notice.remove(), 4500);
  }

  async function applyPrefix(row, prefix) {
    const menuButton = rowMenuButton(row);
    if (!menuButton) throw new Error(`No native options button was found for “${describeRow(row)}”.`);

    menuButton.click();
    const editAction = await waitFor(() => visibleMenuAction(EDIT_PATTERN), 'the native rename action');
    editAction.click();

    const dialog = await waitFor(dialogWithTextInput, 'the native rename dialog');
    const input = dialog.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea');
    const saveAction = visibleSaveAction(dialog);
    if (!input || !saveAction) throw new Error('The native rename dialog does not expose a safe text input and save button.');

    setInputValue(input, withPrefix(input.value, prefix));
    saveAction.click();
  }

  async function openNativeDelete(row) {
    const menuButton = rowMenuButton(row);
    if (!menuButton) throw new Error(`No native options button was found for “${describeRow(row)}”.`);

    menuButton.click();
    const deleteAction = await waitFor(
      () => visibleMenus()
        .flatMap((menu) => [...menu.querySelectorAll('[role="menuitem"], button, [role="button"]')]
          .map((element) => ({ element, menu })))
        .find(({ element }) => canActivateDeleteCandidate({ containerRole: 'menu', label: element.textContent || element.getAttribute('aria-label') }))?.element,
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

  function mountRowControls(row) {
    if (row.querySelector(':scope > [data-zapia-manager-controls]')) return;

    const id = chatIdentity(row);
    const controls = document.createElement('span');
    controls.className = 'zapia-manager-row-controls';
    controls.dataset.zapiaManagerControls = 'true';
    controls.dataset.zapiaManagerControl = 'true';

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

    controls.append(
      select,
      button('✔', `Adicionar prefixo ✔ a ${describeRow(row)}`, () => applyPrefix(row, '✔ ')),
      button('🟡', `Adicionar prefixo 🟡 a ${describeRow(row)}`, () => applyPrefix(row, '🟡 ')),
    );
    row.append(controls);
  }

  function queueFromSelection() {
    const rowsById = new Map(discoverChatRows().map((row) => [chatIdentity(row), row]));
    deletionQueue = queueVisibleSelectedChatIds(selectedChatIds, rowsById);
    return rowsById;
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
    let toolbar = document.querySelector('[data-zapia-manager-toolbar]');
    if (!toolbar) {
      toolbar = document.createElement('aside');
      toolbar.className = 'zapia-manager-toolbar';
      toolbar.dataset.zapiaManagerToolbar = 'true';
      toolbar.setAttribute('aria-live', 'polite');
      document.body.append(toolbar);
    }

    toolbar.replaceChildren();
    const count = selectedChatIds.size;
    const status = document.createElement('strong');
    status.textContent = `${count} chat${count === 1 ? '' : 's'} selecionado${count === 1 ? '' : 's'}`;
    toolbar.append(status);

    const prepare = button(
      deletionQueue.length ? `Abrir próximo (${deletionQueue.length})` : 'Abrir exclusão nativa',
      'Abre somente o primeiro diálogo nativo de exclusão, sem confirmá-lo',
      prepareNextNativeDelete,
    );
    prepare.disabled = count === 0;
    toolbar.append(prepare);

    const clear = button('Limpar seleção', 'Limpar seleção de chats', () => {
      selectedChatIds.clear();
      deletionQueue = [];
      mountControls();
      renderToolbar();
    });
    clear.disabled = count === 0;
    toolbar.append(clear);
  }

  function mountControls() {
    discoverChatRows().forEach(mountRowControls);
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
      .zapia-manager-row-controls { display: inline-flex; align-items: center; gap: 4px; margin-inline-start: 6px; vertical-align: middle; }
      .zapia-manager-button { border: 1px solid currentColor; border-radius: 4px; background: Canvas; color: CanvasText; cursor: pointer; font: inherit; line-height: 1; min-block-size: 24px; padding: 2px 5px; }
      .zapia-manager-button:disabled { cursor: not-allowed; opacity: .55; }
      .zapia-manager-select { inline-size: 15px; block-size: 15px; accent-color: #f5b700; }
      .zapia-manager-toolbar { position: fixed; z-index: 2147483647; right: 16px; bottom: 16px; display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid #a0a0a0; border-radius: 8px; background: Canvas; color: CanvasText; box-shadow: 0 3px 16px #0004; font: 14px system-ui, sans-serif; }
      .zapia-manager-toast { position: fixed; z-index: 2147483647; right: 16px; bottom: 76px; max-inline-size: min(420px, calc(100vw - 32px)); padding: 10px; border-radius: 6px; background: #222; color: #fff; font: 14px system-ui, sans-serif; }
      .zapia-manager-toast-error { background: #9f1d1d; }
      .zapia-manager-toast-warning { background: #7b5600; }
    `;
    document.head.append(style);
  }

  function boot() {
    if (!location.pathname.startsWith('/chat')) return;
    installStyles();
    mountControls();
    const observer = new MutationObserver(scheduleMount);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();
