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
