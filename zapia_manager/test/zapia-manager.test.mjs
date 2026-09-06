import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const manager = require('../zapia-manager.user.js');

test('managed prefixes are idempotent and mutually exclusive', () => {
  assert.equal(manager.withPrefix('Alice', '✔ '), '✔ Alice');
  assert.equal(manager.withPrefix('✔ Alice', '✔ '), '✔ Alice');
  assert.equal(manager.withPrefix('✔ Alice', '🟡 '), '🟡 Alice');
  assert.equal(manager.withPrefix('🟡   Alice', '✔ '), '✔ Alice');
  assert.equal(manager.stripManagedPrefix('🟡 Alice'), 'Alice');
});

test('only configured labels are accepted', () => {
  assert.throws(() => manager.withPrefix('Alice', '🔴 '), /Unsupported Zapia label/);
});

test('a delete candidate is safe only in a native menu', () => {
  assert.equal(manager.canActivateDeleteCandidate({ containerRole: 'menu', label: 'Excluir chat' }), true);
  assert.equal(manager.canActivateDeleteCandidate({ containerRole: 'menu', label: 'Delete conversation' }), true);
  assert.equal(manager.canActivateDeleteCandidate({ containerRole: 'dialog', label: 'Excluir chat' }), false);
  assert.equal(manager.canActivateDeleteCandidate({ containerRole: 'menu', label: 'Salvar' }), false);
});

test('normalization supports text from browser controls', () => {
  assert.equal(manager.normalizeSpace('  Excluir\n chat  '), 'Excluir chat');
});

test('known Flutter navigation labels are not treated as chat titles', () => {
  assert.equal(manager.isNavigationActionLabel('Novo Chat'), true);
  assert.equal(manager.isNavigationActionLabel('Radar 6'), true);
  assert.equal(manager.isNavigationActionLabel('Conversas'), true);
  assert.equal(manager.isNavigationActionLabel('Outlook conectado e resumo de e-mails'), false);
});

test('nested chat candidates collapse to their leaf chat rows', () => {
  const outer = { contains: () => true };
  const inner = { contains: () => false };
  const sibling = { contains: () => false };

  assert.deepEqual(manager.selectLeafChatRows([outer, inner, sibling]), [inner, sibling]);
});

test('the deletion queue retains only currently visible selected chats', () => {
  const selected = new Set(['chat-a', 'chat-b', 'chat-c']);
  const visible = new Set(['chat-a', 'chat-c']);

  assert.deepEqual(manager.queueVisibleSelectedChatIds(selected, visible), ['chat-a', 'chat-c']);
});

function node(managed) {
  return {
    nodeType: 1,
    closest: () => (managed ? {} : null),
  };
}

test('the observer ignores mutations produced by its own controls', () => {
  const managedToolbar = node(true);
  const pageRow = node(false);
  const managedControl = node(true);
  const pageContent = node(false);

  assert.equal(manager.needsRemount([{ target: managedToolbar, addedNodes: [pageContent], removedNodes: [] }]), false);
  assert.equal(manager.needsRemount([{ target: pageRow, addedNodes: [managedControl], removedNodes: [] }]), false);
  assert.equal(manager.needsRemount([{ target: pageRow, addedNodes: [pageContent], removedNodes: [] }]), true);
});

test('the chat manager stays hidden until Zapia renders a chat row', () => {
  assert.equal(manager.shouldShowChatManager([]), false);
  assert.equal(manager.shouldShowChatManager([{}]), true);
});

test('the Zapia cache recovery request clears only Zapia’s stale-cache marker once', () => {
  const data = new Map([['zapia_cache_flushed_v7', '1'], ['session', 'preserved']]);
  const storage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };

  assert.equal(manager.requestZapiaCacheRecovery(storage), true);
  assert.equal(data.has('zapia_cache_flushed_v7'), false);
  assert.equal(data.get('session'), 'preserved');
  assert.equal(manager.requestZapiaCacheRecovery(storage), false);
});
