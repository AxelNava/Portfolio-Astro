/** Apply supported copy without injecting markup or intercepting keyboard input. */
export function setLanguage(language, root = document) {
  if (language !== 'es' && language !== 'en') return false;

  root.documentElement.lang = language;
  root.documentElement.dataset.language = language;
  for (const node of root.querySelectorAll('[data-es][data-en]')) {
    node.textContent = node.dataset[language];
  }
  for (const image of root.querySelectorAll('[data-alt-es][data-alt-en]')) {
    image.alt = image.dataset[language === 'es' ? 'altEs' : 'altEn'];
  }
  for (const button of root.querySelectorAll('button[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
  return true;
}
