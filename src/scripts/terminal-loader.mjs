export function loaderState(kind, phase) {
  if (kind === 'image' && phase === 'loading') return { filled: 0, total: 3, complete: false };
  if (kind === 'image' && phase === 'loaded') return { filled: 3, total: 3, complete: true };
  return { filled: 0, total: 3, complete: false };
}

export function setLoaderProgress(element, kind, phase) {
  const { filled } = loaderState(kind, phase);
  element?.querySelectorAll('[data-loader-square]').forEach((square, index) => {
    square.classList.toggle('is-filled', index < filled);
  });
}
