async page => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://localhost:4321/?motion-test=initial#projects');
  await page.reload();
  await page.waitForSelector('html:not([data-boot])');
  await page.waitForTimeout(1200);
  check(await page.locator('#experience').isHidden(), 'experience starts hidden');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('#tab-experience').click();
  await page.waitForFunction(() => document.querySelectorAll('#experience .motion-active').length > 0, null, { timeout: 500 });
  check(await page.locator('#experience .motion-visual[aria-hidden="true"]').count() > 0, 'animated text is hidden from assistive technology');
  await page.locator('button[data-language="en"]').click();
  await page.waitForTimeout(100);
  check(await page.locator('#experience-title').innerText() === 'Experience', 'language switch restores translated text');
  await page.waitForTimeout(1100);
  check(await page.locator('#experience-title').innerText() === 'Experience', 'animation does not restore obsolete language');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:4321/?motion-test=reduced');
  await page.waitForSelector('html:not([data-boot])');
  check(await page.locator('.motion-active').count() === 0, 'reduced motion skips animation');
  check((await page.locator('h1 [data-text-motion="type"]').innerText()).includes('Axel Nava'), 'reduced motion keeps title visible');
  return 'passed';
}
