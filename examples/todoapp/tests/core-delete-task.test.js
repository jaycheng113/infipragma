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

    // Add three tasks
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    // 1. Delete button exists per task
    const deleteBtns = await page.$$eval('#task-list li .delete-btn', els => els.length);
    if (deleteBtns !== 3) throw new Error(`Expected 3 delete buttons, got ${deleteBtns}`);

    // 2. Delete the second task (Task B)
    await page.click('#task-list li:nth-child(2) .delete-btn');
    // Wait for delete animation to complete
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 2, { timeout: 2000 });

    const afterDelete = await page.$$eval('#task-list li .task-text', els => els.map(e => e.textContent));
    if (afterDelete.length !== 2) throw new Error(`Expected 2 tasks after delete, got ${afterDelete.length}`);
    if (afterDelete[0] !== 'Task A') throw new Error(`Expected first task 'Task A', got '${afterDelete[0]}'`);
    if (afterDelete[1] !== 'Task C') throw new Error(`Expected second task 'Task C', got '${afterDelete[1]}'`);

    // 3. Deletion persists after reload
    await page.reload({ waitUntil: 'domcontentloaded' });

    const afterReload = await page.$$eval('#task-list li .task-text', els => els.map(e => e.textContent));
    if (afterReload.length !== 2) throw new Error(`Expected 2 tasks after reload, got ${afterReload.length}`);
    if (afterReload[0] !== 'Task A') throw new Error(`Expected 'Task A' after reload, got '${afterReload[0]}'`);
    if (afterReload[1] !== 'Task C') throw new Error(`Expected 'Task C' after reload, got '${afterReload[1]}'`);

    // 4. Delete all remaining tasks — empty state should appear
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 1, { timeout: 2000 });
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 0, { timeout: 2000 });

    const remaining = await page.$$eval('#task-list li', els => els.length);
    if (remaining !== 0) throw new Error(`Expected 0 tasks after deleting all, got ${remaining}`);

    const emptyVisible = await page.$eval('#empty-state', el => !el.classList.contains('hidden'));
    if (!emptyVisible) throw new Error('Empty state should be visible when no tasks remain');

    console.log('PASS: core-delete-task');
  } catch (err) {
    console.error('FAIL: core-delete-task —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
