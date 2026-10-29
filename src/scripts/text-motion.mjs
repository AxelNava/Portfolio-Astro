const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function typedText(text, progress) {
  const characters = Array.from(text);
  return characters.slice(0, Math.floor(characters.length * Math.min(1, Math.max(0, progress)))).join('');
}

export function scrambledText(text, progress, random = Math.random) {
  const characters = Array.from(text);
  const resolved = Math.floor(characters.length * Math.min(1, Math.max(0, progress)));
  return characters.map((character, index) => index < resolved || /\s/u.test(character) ? character : alphabet[Math.floor(random() * alphabet.length)]).join('');
}

/** Enhance existing semantic text; the changing visual layer is never announced. */
export function initTextMotion(root = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  const active = new Set();
  const pending = new Set();
  const visibilityObserver = new MutationObserver(startVisible);

  function stopAll(discardPending = false) {
    for (const stop of [...active]) stop();
    if (discardPending) {
      pending.clear();
      visibilityObserver.disconnect();
    }
  }

  function startVisible() {
    if (reduced.matches || root.hidden) return;
    for (const node of [...pending]) {
      if (node.closest('[hidden]')) continue;
      pending.delete(node);
      animate(node);
    }
    if (!pending.size) visibilityObserver.disconnect();
  }
  function start() {
    if (started || root.documentElement.hasAttribute('data-boot')) return;
    started = true;
    bootObserver.disconnect();
    if (reduced.matches) return;
    for (const node of root.querySelectorAll('[data-text-motion]')) pending.add(node);
    visibilityObserver.observe(root.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
    startVisible();
  }

  function animate(node) {
      const cursor = node.querySelector('.cursor');
      const original = cursor ? node.textContent.slice(0, -cursor.textContent.length) : node.textContent;
      const visual = root.createElement('span');
      visual.className = 'motion-visual';
      visual.setAttribute('aria-hidden', 'true');
      const content = root.createElement('span');
      content.className = 'motion-content';
      while (node.firstChild) content.append(node.firstChild);
      node.append(content, visual);
      node.classList.add('motion-active');
      const typing = node.dataset.textMotion === 'type';
      const duration = typing ? (node.closest('h1') ? 1000 : 2200) : 900;
      let timer;
      const began = performance.now();
      const observer = new MutationObserver(() => stop());
      observer.observe(content, { childList: true, characterData: true, subtree: true });
      function stop() {
        clearTimeout(timer);
        observer.disconnect();
        node.classList.remove('motion-active');
        visual.remove();
        active.delete(stop);
      }
      function frame() {
        const progress = Math.min(1, (performance.now() - began) / duration);
        visual.textContent = typing ? typedText(original, progress) : scrambledText(original, progress);
        if (progress >= 1) {
          stop();
          cursor?.classList.add('is-blinking');
        } else timer = setTimeout(frame, 50);
      }
      active.add(stop);
      frame();
  }
  const bootObserver = new MutationObserver(start);
  bootObserver.observe(root.documentElement, { attributes: true, attributeFilter: ['data-boot'] });
  reduced.addEventListener('change', event => { if (event.matches) stopAll(true); });
  root.addEventListener('visibilitychange', () => {
    if (root.hidden) stopAll();
    else startVisible();
  });
  start();
}
