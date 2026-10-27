async page => {
  page.setDefaultTimeout(6000);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await page.clock.install();
  await page.route('**/*.css', route => route.abort());
  await page.goto('http://127.0.0.1:4323/', { waitUntil: 'domcontentloaded' });
  const status = await page.locator('[data-startup-status]').textContent();
  const count = await page.locator('[data-startup-count]').textContent();
  if (status.includes('--ready') || count === '3 / 3') throw new Error('failed stylesheet must never count as loaded');
  await page.clock.fastForward(15001);
  const state = await page.evaluate(() => ({ boot: document.documentElement.hasAttribute('data-boot'), inert: document.querySelector('#portfolio-content').inert, status: document.querySelector('[data-startup-status]').textContent }));
  await page.unroute('**/*.css');
  if (state.boot || state.inert || state.status.includes('--ready') || await page.locator('[data-startup-loader]').isVisible()) throw new Error('fallback must release content and hide loader without falsely claiming success');
  return 'passed';
}
