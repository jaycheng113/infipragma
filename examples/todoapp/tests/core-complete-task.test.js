const puppeteer = require('puppeteer');

const APP_URL = 'http://localhost:8080';

(async () => {
  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Clear localStorage before test
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Add two tasks
    await page.type('#task-input', 'Buy groceries');
    await page.click('#add-btn');
    await page.type('#task-input', 'Walk the dog');
    await page.click('#add-btn');

    // 1. Checkbox exists per task
    const checkboxes = await page.$$eval('#task-list li input[type="checkbox"]', els => els.length);
    if (checkboxes !== 2) throw new Error(`Expected 2 checkboxes, got ${checkboxes}`);

    // 2. Tasks start as not completed
    const initialChecked = await page.$$eval('#task-list li input[type="checkbox"]', els => els.map(e => e.checked));
    if (initialChecked[0] || initialChecked[1]) throw new Error('Tasks should start unchecked');

    // 3. Toggle first task to completed
    await page.click('#task-list li:nth-child(1) input[type="checkbox"]');

    const firstCompleted = await page.$eval('#task-list li:nth-child(1)', el => el.classList.contains('completed'));
    if (!firstCompleted) throw new Error('First task should have completed class after click');

    const firstChecked = await page.$eval('#task-list li:nth-child(1) input[type="checkbox"]', el => el.checked);
    if (!firstChecked) throw new Error('First task checkbox should be checked');

    // 4. Visual distinction — strikethrough and muted color
    const textDeco = await page.$eval('#task-list li:nth-child(1) .task-text', el => {
      return window.getComputedStyle(el).textDecorationLine || window.getComputedStyle(el).textDecoration;
    });
    if (!textDeco.includes('line-through')) throw new Error(`Expected line-through, got: ${textDeco}`);

    const color = await page.$eval('#task-list li:nth-child(1) .task-text', el => {
      return window.getComputedStyle(el).color;
    });
    // #aaa = rgb(170, 170, 170) — muted color for completed
    if (!color.includes('170')) throw new Error(`Expected muted color for completed task, got: ${color}`);

    // 5. Second task remains active
    const secondCompleted = await page.$eval('#task-list li:nth-child(2)', el => el.classList.contains('completed'));
    if (secondCompleted) throw new Error('Second task should remain active');

    // 6. Toggle first task back to active
    await page.click('#task-list li:nth-child(1) input[type="checkbox"]');

    const firstAfterUntoggle = await page.$eval('#task-list li:nth-child(1)', el => el.classList.contains('completed'));
    if (firstAfterUntoggle) throw new Error('First task should be active after untoggling');

    const firstUnchecked = await page.$eval('#task-list li:nth-child(1) input[type="checkbox"]', el => el.checked);
    if (firstUnchecked) throw new Error('First task checkbox should be unchecked after untoggling');

    // 7. State persists after reload
    // Complete second task first
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');
    await page.reload({ waitUntil: 'domcontentloaded' });

    const afterReloadChecked = await page.$$eval('#task-list li input[type="checkbox"]', els => els.map(e => e.checked));
    if (afterReloadChecked[0]) throw new Error('First task should remain unchecked after reload');
    if (!afterReloadChecked[1]) throw new Error('Second task should remain checked after reload');

    const afterReloadCompleted = await page.$eval('#task-list li:nth-child(2)', el => el.classList.contains('completed'));
    if (!afterReloadCompleted) throw new Error('Second task should still have completed class after reload');

    console.log('PASS: core-complete-task');
  } catch (err) {
    console.error('FAIL: core-complete-task —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
