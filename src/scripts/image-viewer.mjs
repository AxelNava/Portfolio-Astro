import { setLoaderProgress } from './terminal-loader.mjs';

/** One workspace viewer, with galleries derived from each project's image links. */
export function initImageViewer(root = document) {
  const dialog = root.querySelector('#image-viewer');
  if (!dialog) return;
  const find = selector => dialog.querySelector(selector);
  let image = find('[data-viewer-image]');
  const imageTemplate = image.cloneNode();
  const imageCache = new Map();
  const viewerTab = root.querySelector('[data-viewer-tab]');
  const portfolioTab = root.querySelector('[data-portfolio-tab]');
  const main = root.querySelector('#main-content');
  const identity = root.querySelector('.identity');
  const navigation = root.querySelector('.section-nav');
  const squares = find('[data-viewer-squares]');
  function selectView(viewer, restoreFocus = true) {
    dialog.hidden = !viewer;
    main.hidden = viewer;
    identity.hidden = viewer;
    navigation.hidden = viewer;
    viewerTab.setAttribute('aria-pressed', String(viewer));
    portfolioTab.setAttribute('aria-current', viewer ? 'false' : 'page');
    if (viewer) { layout(); find('[data-viewer-close]').focus(); }
    else if (restoreFocus) {
      const target = opener?.getClientRects().length ? opener : portfolioTab;
      target.focus({ preventScroll: true });
    }
  }
  root.querySelector('.skip-link').addEventListener('click', () => {
    if (!dialog.hidden) selectView(false, false);
  }, true);
  window.addEventListener('hashchange', () => {
    if (!dialog.hidden) selectView(false, false);
  });
  viewerTab.addEventListener('click', () => selectView(true));
  portfolioTab.addEventListener('click', event => {
    if (viewerTab.hidden) return;
    event.preventDefault();
    selectView(false);
  });
  const stage = find('[data-viewer-stage]');
  const canvas = find('[data-viewer-canvas]');
  const previous = find('[data-viewer-prev]');
  const next = find('[data-viewer-next]');
  const zoomIn = find('[data-viewer-zoom-in]');
  const zoomOut = find('[data-viewer-zoom-out]');
  const fit = find('[data-viewer-fit]');
  const loading = find('[data-viewer-loading]');
  const error = find('[data-viewer-error]');
  let gallery = [];
  let index = 0;
  let zoom = 1;
  let ready = false;
  let opener;
  let drag;
  let displayRevision = 0;

  function layout() {
    if (!ready) return;
    const ratio = Math.min((stage.clientWidth - 32) / image.naturalWidth, (stage.clientHeight - 32) / image.naturalHeight, 1);
    const width = Math.max(1, image.naturalWidth * ratio * zoom);
    const height = Math.max(1, image.naturalHeight * ratio * zoom);
    image.style.width = width + 'px';
    image.style.height = height + 'px';
    canvas.style.width = Math.max(stage.clientWidth, width + 32) + 'px';
    canvas.style.height = Math.max(stage.clientHeight, height + 32) + 'px';
  }

  function zoomTo(value) {
    const oldZoom = zoom;
    const centerX = stage.scrollLeft + stage.clientWidth / 2;
    const centerY = stage.scrollTop + stage.clientHeight / 2;
    zoom = Math.max(1, Math.min(4, value));
    stage.classList.toggle('is-zoomed', ready && zoom > 1);
    find('[data-viewer-zoom]').textContent = Math.round(zoom * 100) + '%';
    zoomIn.disabled = !ready || zoom === 4;
    zoomOut.disabled = !ready || zoom === 1;
    fit.disabled = !ready;
    layout();
    stage.scrollLeft = zoom === 1 ? 0 : centerX * zoom / oldZoom - stage.clientWidth / 2;
    stage.scrollTop = zoom === 1 ? 0 : centerY * zoom / oldZoom - stage.clientHeight / 2;
  }

  function showImage() {
    displayRevision += 1;
    const source = gallery[index].querySelector('img');
    ready = false;
    image.hidden = true;
    loading.hidden = false;
    loading.querySelector('[data-image-loading]').hidden = false;
    loading.querySelector('[data-image-loaded]').hidden = true;
    loading.querySelector('[data-image-count]').textContent = '0 / 1';
    setLoaderProgress(loading, 'image', 'loading');
    error.hidden = true;
    canvas.setAttribute('aria-busy', 'true');
    canvas.style.width = '';
    canvas.style.height = '';
    zoomTo(1);
    previous.disabled = index === 0;
    next.disabled = index === gallery.length - 1;
    find('[data-viewer-counter]').textContent = `${index + 1} / ${gallery.length}`;
    squares.replaceChildren(...gallery.map((_, position) => {
      const square = root.createElement('span');
      square.dataset.viewerSquare = '';
      if (position === index) square.setAttribute('aria-current', 'true');
      return square;
    }));
    const url = gallery[index].href;
    const cached = imageCache.get(url);
    if (cached && cached !== image) { image.replaceWith(cached); image = cached; }
    else if (!cached) {
      const nextImage = imageTemplate.cloneNode();
      nextImage.addEventListener('load', () => imageLoaded(nextImage));
      nextImage.addEventListener('error', () => imageFailed(nextImage));
      image.replaceWith(nextImage);
      image = nextImage;
      imageCache.set(url, image);
      image.dataset.cacheUrl = url;
    }
    image.alt = source.alt;
    const caption = find('[data-viewer-caption]');
    caption.textContent = source.alt;
    caption.dataset.es = source.dataset.altEs ?? source.alt;
    caption.dataset.en = source.dataset.altEn ?? source.alt;
    image.dataset.altEs = caption.dataset.es;
    image.dataset.altEn = caption.dataset.en;
    if (!cached) image.src = url;
    else if (image.complete) {
      if (image.naturalWidth) imageLoaded(image);
      else imageFailed(image);
    }
  }

  function imageLoaded(loaded) {
    if (loaded !== image) return;
    ready = true;
    loading.querySelector('[data-image-loading]').hidden = true;
    loading.querySelector('[data-image-loaded]').hidden = false;
    loading.querySelector('[data-image-count]').textContent = '1 / 1';
    setLoaderProgress(loading, 'image', 'loaded');
    const revision = displayRevision;
    setTimeout(() => {
      if (revision !== displayRevision || image !== loaded || !ready) return;
      loading.hidden = true;
      image.hidden = false;
      canvas.setAttribute('aria-busy', 'false');
      layout();
    }, 500);
    error.hidden = true;
    zoomTo(1);
  }
  function imageFailed(failed) {
    if (imageCache.get(failed.dataset.cacheUrl) === failed) imageCache.delete(failed.dataset.cacheUrl);
    if (failed !== image) return;
    ready = false;
    loading.hidden = true;
    setLoaderProgress(loading, 'image', 'error');
    error.hidden = false;
    image.hidden = true;
    canvas.setAttribute('aria-busy', 'false');
    zoomTo(1);
  }
  function move(delta) {
    const target = index + delta;
    if (target < 0 || target >= gallery.length) return;
    index = target;
    showImage();
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  zoomIn.addEventListener('click', () => zoomTo(zoom + 0.5));
  zoomOut.addEventListener('click', () => zoomTo(zoom - 0.5));
  fit.addEventListener('click', () => zoomTo(1));
  find('[data-viewer-retry]').addEventListener('click', showImage);
  find('[data-viewer-close]').addEventListener('click', () => {
    selectView(false);
    viewerTab.hidden = true;
    drag = undefined;
    stage.classList.remove('is-dragging');
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { find('[data-viewer-close]').click(); return; }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    // Keep the focused scrollable stage navigable with its native arrow keys.
    if (event.target === stage && zoom > 1 && event.key.startsWith('Arrow')) return;
    const actions = {
      ArrowLeft: () => move(-1), ArrowRight: () => move(1),
      '+': () => zoomTo(zoom + 0.5), '=': () => zoomTo(zoom + 0.5),
      '-': () => zoomTo(zoom - 0.5), '0': () => zoomTo(1),
    };
    if (!actions[event.key]) return;
    event.preventDefault();
    actions[event.key]();
  });

  stage.addEventListener('pointerdown', event => {
    if (!ready || zoom === 1 || event.button !== 0 || !event.isPrimary || event.target.closest('button')) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
    event.preventDefault();
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    stage.scrollLeft = drag.left + drag.x - event.clientX;
    stage.scrollTop = drag.top + drag.y - event.clientY;
  });
  function endDrag() { drag = undefined; stage.classList.remove('is-dragging'); }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('lostpointercapture', endDrag);
  new ResizeObserver(() => { if (!dialog.hidden) layout(); }).observe(stage);

  for (const panel of root.querySelectorAll('.project-panel')) {
    const links = [...panel.querySelectorAll('.project-preview a, .evidence-grid a')];
    for (const link of links) {
      link.setAttribute('aria-haspopup', 'false');
      link.setAttribute('aria-controls', dialog.id);
      link.addEventListener('click', event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        gallery = links;
        index = links.indexOf(link);
        opener = link;
        const heading = root.querySelector(`[data-project-summary="${panel.id}"] h3 span`);
        const title = find('[data-viewer-project]');
        title.textContent = heading?.textContent ?? '';
        title.dataset.es = heading?.dataset.es ?? '';
        title.dataset.en = heading?.dataset.en ?? '';
        viewerTab.hidden = false;
        selectView(true);
        showImage();
      });
    }
  }
}
