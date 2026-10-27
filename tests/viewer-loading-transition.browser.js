async page => {
  page.setDefaultTimeout(5000);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await page.goto('http://127.0.0.1:4323/');
  await page.goto('http://127.0.0.1:4323/#project-web');
  await page.route('**/viewer-transition.svg', async route => {
    await new Promise(resolve => setTimeout(resolve, 300));
    await route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"></svg>' });
  });
  const trigger = page.locator('#project-web .project-preview a');
  await trigger.evaluate(anchor => { anchor.href = '/viewer-transition.svg'; });
  await page.evaluate(() => {
    window.viewerOverlapObserved = false;
    const stage = document.querySelector('[data-viewer-stage]');
    new MutationObserver(() => {
      const loader = document.querySelector('[data-viewer-loading]');
      const image = document.querySelector('[data-viewer-image]');
      if (!loader.hidden && !image.hidden) window.viewerOverlapObserved = true;
    }).observe(stage, { subtree: true, attributes: true, attributeFilter: ['hidden'], childList: true });
  });
  await trigger.click();
  const loader = page.locator('[data-viewer-loading]');
  const image = page.locator('[data-viewer-image]');
  await page.waitForFunction(() => document.querySelector('[data-viewer-image]').naturalWidth > 0);
  await loader.waitFor({ state: 'hidden' });
  if (await page.evaluate(() => window.viewerOverlapObserved)) throw new Error('image and completion loader must not be visible simultaneously');
  if (!await image.isVisible()) throw new Error('image must appear after loader disappears');
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  return 'passed';
}
