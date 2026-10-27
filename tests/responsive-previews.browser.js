async page => {
  page.setDefaultTimeout(5000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4323/');
  await page.goto('http://127.0.0.1:4323/#project-web');
  const result = await page.locator('#project-web .project-preview a').evaluate(anchor => {
    const image = anchor.querySelector('img');
    return { href: anchor.href, currentSrc: image.currentSrc, srcset: image.getAttribute('srcset'), sizes: image.getAttribute('sizes') };
  });
  if (!result.srcset || !result.sizes) throw new Error('preview must provide responsive srcset and sizes');
  if (result.currentSrc === result.href) throw new Error('preview must not request the full detail original');
  await page.locator('#project-web .project-preview a').click();
  await page.waitForFunction(() => document.querySelector('[data-viewer-image]').complete && document.querySelector('[data-viewer-image]').naturalWidth > 0);
  const detail = await page.locator('[data-viewer-image]').evaluate(image => image.currentSrc);
  if (detail !== result.href) throw new Error('viewer must use the original detail image');
  return result;
}
