import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/Projects.astro', import.meta.url), 'utf8');

test('Ania project has linked navigation, bilingual summary and details, and a planned chatbot', () => {
  assert.match(source, /data-project-summary="project-ania"/);
  assert.match(source, /id="tab-project-ania" href="#project-ania"/);
  const summary = source.match(/<div data-project-summary="project-ania">([\s\S]*?)<\/div>/)?.[1];
  const detail = source.match(/<article id="project-ania" class="project-panel">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(summary);
  assert.ok(detail);
  assert.match(summary, /es="Ania Hecho A Mano" en="Ania Hecho A Mano"/);
  assert.match(summary, /es="[^"]*pedidos[^"]*" en="[^"]*orders[^"]*"/);
  assert.match(detail, /es="[^"]*chatbot[^"]*no está implementado[^"]*" en="[^"]*chatbot[^"]*not yet implemented[^"]*"/);
  for (const feature of ['catálogo', 'seguimiento', 'productos', 'agenda', 'importación']) assert.ok(detail.toLowerCase().includes(feature), feature);
  assert.doesNotMatch(detail, /<ResponsivePreview|<img\b/);
});

test('existing project navigation and panels remain linked', () => {
  for (const id of ['web', 'desktop', 'compiler', 'piano']) {
    assert.ok(source.includes(`data-project-summary="project-${id}"`));
    assert.ok(source.includes(`id="tab-project-${id}" href="#project-${id}"`));
    assert.ok(source.includes(`id="project-${id}" class="project-panel"`));
  }
});
