async page => {
  page.setDefaultTimeout(6000);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await page.route('**/*.css', async route => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    await route.continue();
  });
  await page.goto('http://127.0.0.1:4323/', { waitUntil: 'commit' });
  const loader = page.locator('[data-startup-loader]');
  await loader.waitFor({ state: 'visible', timeout: 2000 });
  const state = await page.evaluate(() => ({ ready: document.readyState, boot: document.documentElement.hasAttribute('data-boot'), inert: document.getElementById('portfolio-content')?.inert }));
  if (!state.boot || state.ready === 'complete' || !state.inert) throw new Error('loader must be visible and content inert while CSS is pending');
  await loader.waitFor({ state: 'hidden', timeout: 7000 });
  if (await page.locator('#portfolio-content').evaluate(element => element.inert)) throw new Error('successful startup must release content');
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  return 'passed';
}
