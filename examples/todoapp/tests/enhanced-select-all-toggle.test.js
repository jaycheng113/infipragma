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

    // 1. Toggle-all container should be hidden when no tasks exist
    const hiddenInitially = await page.$eval('#toggle-all-container', el => el.classList.contains('hidden'));
    if (!hiddenInitially) throw new Error('Toggle-all should be hidden when no tasks exist');

    // 2. Add 3 tasks
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    // 3. Toggle-all container should be visible now
    const visibleAfterAdd = await page.$eval('#toggle-all-container', el => !el.classList.contains('hidden'));
    if (!visibleAfterAdd) throw new Error('Toggle-all should be visible when tasks exist');

    // 4. Toggle-all checkbox should be unchecked (not all completed)
    const uncheckedInitially = await page.$eval('#toggle-all', el => !el.checked);
    if (!uncheckedInitially) throw new Error('Toggle-all should be unchecked when tasks are active');

    // 5. Click toggle-all — all tasks should become completed
    await page.click('#toggle-all');
    const allCompleted = await page.$$eval('#task-list li', items =>
      items.every(li => li.classList.contains('completed'))
    );
    if (!allCompleted) throw new Error('All tasks should be completed after toggle-all click');

    // 6. Toggle-all checkbox should be checked now
    const checkedAfterToggle = await page.$eval('#toggle-all', el => el.checked);
    if (!checkedAfterToggle) throw new Error('Toggle-all should be checked when all tasks are completed');

    // 7. Click toggle-all again — all tasks should become active
    await page.click('#toggle-all');
    const allActive = await page.$$eval('#task-list li', items =>
      items.every(li => !li.classList.contains('completed'))
    );
    if (!allActive) throw new Error('All tasks should be active after second toggle-all click');

    // 8. Complete one task manually, then click toggle-all — all should complete
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');
    await page.click('#toggle-all');
    const allCompletedAgain = await page.$$eval('#task-list li', items =>
      items.every(li => li.classList.contains('completed'))
    );
    if (!allCompletedAgain) throw new Error('All tasks should be completed when some were active and toggle-all clicked');

    // 9. Verify persistence — reload and check
    await page.reload({ waitUntil: 'domcontentloaded' });
    const allCompletedAfterReload = await page.$$eval('#task-list li', items =>
      items.every(li => li.classList.contains('completed'))
    );
    if (!allCompletedAfterReload) throw new Error('Completed state should persist after reload');

    // 10. Toggle-all checkbox should be checked after reload
    const checkedAfterReload = await page.$eval('#toggle-all', el => el.checked);
    if (!checkedAfterReload) throw new Error('Toggle-all should be checked after reload when all completed');

    console.log('PASS: enhanced-select-all-toggle');
  } catch (err) {
    console.error('FAIL: enhanced-select-all-toggle —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
