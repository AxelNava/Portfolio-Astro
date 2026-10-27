async page => {
  page.setDefaultTimeout(6000);
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.route('**/*.js', async route => { await new Promise(resolve => setTimeout(resolve, 800)); await route.continue(); });
  await page.goto('http://127.0.0.1:4323/', { waitUntil: 'commit' });
  const startup = page.locator('[data-startup-loader]');
  await startup.waitFor({ state: 'visible' });
  check(await page.locator('#portfolio-content').evaluate(element => element.inert), 'portfolio must not receive focus under startup loader');
  await page.locator('[data-startup-count]').getByText('1 / 3').waitFor();
  check(await startup.locator('.is-filled').count() === 1, 'one completed prerequisite must fill exactly one square');
  await page.locator('[data-startup-status]').getByText('$ portfolio --ready').waitFor();
  check(await startup.locator('.is-filled').count() === 3, 'startup completion must fill squares');
  await startup.waitFor({ state: 'hidden' });
  check(!(await page.locator('#portfolio-content').evaluate(element => element.inert)), 'automatic transition must enable portfolio');
  await page.unroute('**/*.js');
  await page.goto('http://127.0.0.1:4323/#project-web');
  await page.route('**/loader-test.svg', async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"></svg>' });
  });
  const trigger = page.locator('#project-web .project-preview a');
  await trigger.evaluate(anchor => { anchor.href = '/loader-test.svg'; });
  await trigger.click();
  const loading = page.locator('[data-viewer-loading]');
  check(await loading.isVisible(), 'image loader must show while loading');
  check(await loading.locator('.is-filled').count() === 0 && await loading.locator('[data-image-count]').textContent() === '0 / 1', 'incomplete image must count as zero completed');
  await page.locator('[data-image-loaded]').waitFor({ state: 'visible' });
  check(await loading.locator('.is-filled').count() === 3 && await loading.locator('[data-image-count]').textContent() === '1 / 1', 'image success must count as one completed');
  await loading.waitFor({ state: 'hidden' });
  check(await page.locator('[data-viewer-image]').isVisible(), 'loaded image must become visible');
  await page.unroute('**/loader-test.svg');
  return 'passed';
}
