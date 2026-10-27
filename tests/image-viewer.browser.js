async (page) => {
  const failures = [];
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const scenario = async (name, run) => {
    try { await run(); } catch (error) { failures.push(name + ': ' + error.message); }
    finally { if (await page.locator('#image-viewer').isVisible()) await page.locator('[data-viewer-close]').click(); }
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4323/');
  await page.waitForSelector('.workspace-ready');
  await scenario('related professional project and terminal indicator', async () => {
    await page.locator('#tab-projects').click();
    await page.locator('#tab-project-compiler').click();
    await page.locator('#tab-experience').click();
    await page.locator('.text-link').click();
    check(await page.locator('#project-web').isVisible(), 'related link must select Comercializate, not the last project');
    check(page.url().endsWith('#project-web'), 'related project needs a direct URL');
    check(await page.locator('#tab-project-web').innerText().then(t => t.includes('[work: freelance]')), 'missing professional terminal indicator');
    check(await page.locator('[data-project-summary="project-web"]').innerText().then(t => t.includes('RC Performance')), 'missing relationship');
    await page.locator('#tab-project-compiler').click();
    check(!(await page.locator('#tab-project-compiler').innerText()).includes('[work:'), 'unrelated compiler must not gain work attribution');
  });
  await scenario('in-page image viewer, zoom, pan, close and focus', async () => {
    await page.goto('http://127.0.0.1:4323/#project-web');
    const trigger = page.locator('#project-web .project-preview a');
    const url = page.url();
    await trigger.click();
    const viewer = page.locator('#image-viewer');
    await viewer.waitFor({ state: 'visible', timeout: 2000 });
    check(page.url() === url, 'image click must not leave the portfolio');
    await page.waitForFunction(() => { const image = document.querySelector('[data-viewer-image]'); return image.complete && image.naturalWidth > 0; });
    check(await page.locator('[data-viewer-tab]').isVisible(), 'viewer must appear as a workspace tab');
    check(await page.locator('[data-viewer-counter]').textContent() === '1 / 6', 'web gallery must include preview and five evidence images');
    const initial = await page.locator('[data-viewer-image]').boundingBox();
    await page.locator('[data-viewer-zoom-in]').click();
    check((await page.locator('[data-viewer-image]').boundingBox()).width > initial.width, 'zoom must enlarge the image, not only a label');
    while (!(await page.locator('[data-viewer-zoom-in]').isDisabled())) await page.locator('[data-viewer-zoom-in]').click();
    check(await page.locator('[data-viewer-zoom-in]').isDisabled(), 'zoom must have an upper bound');
    const stage = page.locator('[data-viewer-stage]');
    const overflow = await stage.evaluate(s => s.scrollWidth > s.clientWidth || s.scrollHeight > s.clientHeight);
    check(overflow, 'zoomed image must be scrollable');
    await stage.evaluate(s => { s.scrollLeft = 0; });
    await stage.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('[data-viewer-stage]').scrollLeft > 0, { timeout: 2000 });
    check(await page.locator('[data-viewer-counter]').textContent() === '1 / 6', 'stage arrow must pan without changing images');
    await stage.evaluate(s => { s.scrollLeft = 200; s.scrollTop = 100; });
    const box = await stage.boundingBox();
    const before = await stage.evaluate(s => s.scrollLeft);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 - 80, box.y + box.height / 2 - 30); await page.mouse.up();
    check(await stage.evaluate(s => s.scrollLeft) > before, 'drag must pan a zoomed image');
    await page.locator('[data-viewer-fit]').click();
    check(await page.locator('[data-viewer-zoom-out]').isDisabled(), 'fit resets zoom to lower bound');
    await page.keyboard.press('Escape');
    check(!(await viewer.isVisible()), 'Escape closes the viewer');
    check(await trigger.evaluate(a => a === document.activeElement), 'closing restores focus to the image trigger');
  });
  await scenario('project-scoped gallery, keyboard and singleton boundaries', async () => {
    await page.goto('http://127.0.0.1:4323/#project-web');
    await page.locator('#project-web .project-preview a').click();
    await page.locator('#image-viewer').waitFor({state:'visible', timeout:2000});
    check(await page.locator('[data-viewer-prev]').isDisabled(), 'first image has no previous');
    await page.keyboard.press('ArrowRight');
    check(await page.locator('[data-viewer-counter]').textContent() === '2 / 6', 'right arrow moves within gallery');
    for(let i=0;i<8;i++) await page.locator('[data-viewer-next]').click({ force: true, timeout:500 }).catch(()=>{});
    check(await page.locator('[data-viewer-counter]').textContent() === '6 / 6', 'last image stays inside current project');
    check(await page.locator('[data-viewer-next]').isDisabled(), 'last image has no next');
    await page.locator('[data-viewer-close]').click();
    await page.locator('#tab-project-piano').click();
    await page.locator('#project-piano .project-preview a').click();
    check(await page.locator('[data-viewer-counter]').textContent() === '1 / 1', 'single-image project must not reuse other project gallery');
    check(await page.locator('[data-viewer-prev]').isDisabled() && await page.locator('[data-viewer-next]').isDisabled(), 'single image has no navigation');
    await page.locator('[data-viewer-close]').click();
  });
  if (failures.length) throw new Error(failures.join('\n'));
  return { passed: 3, failures };
}
