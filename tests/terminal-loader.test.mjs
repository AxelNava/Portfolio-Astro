import test from 'node:test';
import assert from 'node:assert/strict';
import { loaderState } from '../src/scripts/terminal-loader.mjs';

test('image loading never claims completion before a successful load', () => {
  assert.deepEqual(loaderState('image', 'loading'), { filled: 0, total: 3, complete: false });
  assert.deepEqual(loaderState('image', 'loaded'), { filled: 3, total: 3, complete: true });
  assert.deepEqual(loaderState('image', 'error'), { filled: 0, total: 3, complete: false });
});
