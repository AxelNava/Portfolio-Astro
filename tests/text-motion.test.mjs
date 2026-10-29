import test from 'node:test';
import assert from 'node:assert/strict';
import { typedText, scrambledText } from '../src/scripts/text-motion.mjs';

test('typing reveals complete Unicode characters and ends with the original text', () => {
  assert.equal(typedText('Nava', 0.5), 'Na');
  assert.equal(typedText('A😀', 1), 'A😀');
});

test('scrambling preserves whitespace and resolves to the original text', () => {
  assert.equal(scrambledText('Hola mundo', 0, () => 0), 'AAAA AAAAA');
  assert.equal(scrambledText('Hola mundo', 1, () => 0), 'Hola mundo');
});
