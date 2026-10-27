/** Enhance real anchor links; without JavaScript all content stays readable. */
export function enhanceTabs(list, panels, onSelect = () => {}) {
  const tabs = [...list.querySelectorAll('a[href^="#"]')];
  list.setAttribute('role', 'tablist');
  function select(id, userInitiated = false) {
    if (!panels.some(panel => panel.id === id)) return false;
    for (const tab of tabs) {
      const active = tab.getAttribute('href') === `#${id}`;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.id !== id;
    onSelect(id, userInitiated);
    return true;
  }
  tabs.forEach((tab, index) => {
    const id = tab.getAttribute('href').slice(1);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', id);
    const panel = panels.find(panel => panel.id === id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', event => {
      event.preventDefault();
      select(id, true);
    });
    tab.addEventListener('keydown', event => {
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      const next = {
        [vertical ? 'ArrowDown' : 'ArrowRight']: (index + 1) % tabs.length,
        [vertical ? 'ArrowUp' : 'ArrowLeft']: (index + tabs.length - 1) % tabs.length,
        Home: 0, End: tabs.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      select(tabs[next].getAttribute('href').slice(1), true);
    });
  });
  select(panels[0].id);
  return select;
}

export function initWorkspace(root = document) {
  const workspace = root.querySelector('.workspace');
  if (!workspace) return;
  const sections = [...root.querySelectorAll('#main-content > section')];
  const summaries = [...root.querySelectorAll('[data-project-summary]')];
  function updateHash(id, userInitiated) {
    if (userInitiated) history.replaceState(null, '', `#${id}`);
  }
  const projectList = root.querySelector('.project-list');
  const selectProject = enhanceTabs(projectList, [...root.querySelectorAll('.project-panel')], (id, userInitiated) => {
    for (const summary of summaries) summary.hidden = summary.dataset.projectSummary !== id;
    updateHash(id, userInitiated);
  });
  const compact = window.matchMedia('(max-width: 900px)');
  function orientProjectList() {
    projectList.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  }
  compact.addEventListener('change', orientProjectList);
  orientProjectList();
  const selectSection = enhanceTabs(root.querySelector('.section-nav'), sections, (id, userInitiated) => {
    root.querySelector('[data-status-file]').textContent = `${id}.md`;
    updateHash(id, userInitiated);
  });
  workspace.classList.add('workspace-ready');
  function followHash() {
    const id = window.location.hash.slice(1);
    if (sections.some(section => section.id === id)) selectSection(id);
    else if (selectProject(id)) selectSection('projects');
  }
  root.querySelectorAll('a[href="#projects"]:not(.section-nav a), .skip-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const id = link.getAttribute('href').slice(1);
      selectSection(id);
      history.replaceState(null, '', `#${id}`);
      root.getElementById(id).focus();
    });
  });
  root.querySelectorAll('[data-related-project]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const id = link.getAttribute('href').slice(1);
      if (!selectProject(id)) return;
      selectSection('projects');
      updateHash(id, true);
      root.getElementById(id).focus();
    });
  });
  window.addEventListener('hashchange', followHash);
  followHash();
}
