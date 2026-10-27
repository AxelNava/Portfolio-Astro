import test from 'node:test';
import assert from 'node:assert/strict';
import { enhanceTabs } from '../src/scripts/tabs.mjs';

class Control extends EventTarget {
  constructor(id, href) { super(); this.id = id; this.attrs = { href }; this.hidden = false; this.tabIndex = 0; }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name]; }
  focus() { this.focused = true; }
  click() { this.dispatchEvent(new Event('click', { cancelable: true })); }
}
function fixture() {
  const tabs = ['experience', 'projects', 'contact'].map(id => new Control('tab-' + id, '#' + id));
  const panels = tabs.map(tab => new Control(tab.attrs.href.slice(1)));
  const list = new Control('list');
  list.querySelectorAll = () => tabs;
  return { tabs, panels, list };
}
test('one active section, linked ARIA state and switching via visible controls', () => {
  const f = fixture();
  const selections = [];
  enhanceTabs(f.list, f.panels, id => selections.push(id));
  assert.equal(f.list.attrs.role, 'tablist');
  assert.deepEqual(f.panels.map(p => p.hidden), [false, true, true]);
  f.tabs[1].click();
  assert.deepEqual(f.panels.map(p => p.hidden), [true, false, true]);
  assert.deepEqual(f.tabs.map(t => t.attrs['aria-selected']), ['false', 'true', 'false']);
  assert.deepEqual(f.tabs.map(t => t.tabIndex), [-1, 0, -1]);
  assert.equal(f.tabs[1].attrs['aria-controls'], 'projects');
  assert.equal(f.panels[1].attrs['aria-labelledby'], 'tab-projects');
  assert.deepEqual(selections, ['experience', 'projects']);
});
test('keyboard arrows wrap and Home/End select without trapping Tab', () => {
  const f = fixture();
  enhanceTabs(f.list, f.panels);
  function key(tab, key) {
    const event = new Event('keydown', { cancelable: true });
    Object.defineProperty(event, 'key', { value: key });
    tab.dispatchEvent(event);
    return event.defaultPrevented;
  }
  assert.equal(key(f.tabs[0], 'ArrowLeft'), true);
  assert.equal(f.tabs[2].focused, true);
  assert.equal(f.panels[2].hidden, false);
  key(f.tabs[2], 'Home');
  assert.equal(f.panels[0].hidden, false);
  key(f.tabs[0], 'End');
  assert.equal(f.panels[2].hidden, false);
  key(f.tabs[2], 'ArrowRight');
  assert.equal(f.panels[0].hidden, false);
  assert.equal(key(f.tabs[0], 'Tab'), false);
  f.list.setAttribute('aria-orientation', 'vertical');
  key(f.tabs[0], 'ArrowDown');
  assert.equal(f.panels[1].hidden, false);
  key(f.tabs[1], 'ArrowUp');
  assert.equal(f.panels[0].hidden, false);
});
test('project selections synchronize summary and detail; unknown target leaves state unchanged', () => {
  const f = fixture();
  const summaries = f.panels.map(p => ({ id: p.id, hidden: false }));
  const select = enhanceTabs(f.list, f.panels, id => summaries.forEach(s => { s.hidden = s.id !== id; }));
  select('projects');
  assert.deepEqual(summaries.map(s => s.hidden), [true, false, true]);
  const before = JSON.stringify([f.panels, f.tabs, summaries]);
  assert.equal(select('missing'), false);
  assert.equal(JSON.stringify([f.panels, f.tabs, summaries]), before);
});
