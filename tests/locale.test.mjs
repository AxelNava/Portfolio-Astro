import test from 'node:test';
import assert from 'node:assert/strict';
import { setLanguage } from '../src/scripts/locale.mjs';

function documentFixture() {
  const copy = [1, 2].map(() => ({ dataset: { es: 'Experiencia', en: 'Experience' }, textContent: 'Experiencia' }));
  const image = { dataset: { altEs: 'Compilador', altEn: 'Compiler' }, alt: 'Compilador' };
  const buttons = ['es', 'en'].map(language => ({ dataset: { language }, attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } }));
  const root = {
    documentElement: { lang: 'es', dataset: {} },
    querySelectorAll(selector) {
      return ({ '[data-es][data-en]': copy, '[data-alt-es][data-alt-en]': [image], 'button[data-language]': buttons })[selector] ?? [];
    },
  };
  return { root, copy, image, buttons };
}

test('visible language controls translate every occurrence and image description, then restore Spanish', () => {
  const { root, copy, image, buttons } = documentFixture();
  assert.equal(setLanguage('en', root), true);
  assert.equal(root.documentElement.lang, 'en');
  assert.equal(root.documentElement.dataset.language, 'en');
  assert.deepEqual(copy.map(node => node.textContent), ['Experience', 'Experience']);
  assert.equal(image.alt, 'Compiler');
  assert.deepEqual(buttons.map(button => button.attrs['aria-pressed']), ['false', 'true']);
  assert.equal(setLanguage('es', root), true);
  assert.equal(root.documentElement.lang, 'es');
  assert.deepEqual(copy.map(node => node.textContent), ['Experiencia', 'Experiencia']);
  assert.equal(image.alt, 'Compilador');
  assert.deepEqual(buttons.map(button => button.attrs['aria-pressed']), ['true', 'false']);
});

test('unsupported languages leave document, copy, images and controls unchanged', () => {
  const fixture = documentFixture();
  const before = JSON.stringify(fixture);
  assert.equal(setLanguage('fr', fixture.root), false);
  assert.equal(JSON.stringify(fixture), before);
});
