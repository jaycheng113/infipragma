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

    // 1. Clear completed button should be hidden when no tasks exist
    const btnHiddenInitially = await page.$eval('#clear-completed-btn', el => el.classList.contains('hidden'));
    if (!btnHiddenInitially) throw new Error('Clear completed button should be hidden when no tasks exist');

    // 2. Add 3 tasks
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    // 3. Button should still be hidden (no completed tasks)
    const btnHiddenNoCompleted = await page.$eval('#clear-completed-btn', el => el.classList.contains('hidden'));
    if (!btnHiddenNoCompleted) throw new Error('Clear completed button should be hidden when no tasks are completed');

    // 4. Complete 2 tasks — button should appear
    await page.click('#task-list li:nth-child(1) input[type="checkbox"]');
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');

    const btnVisibleAfterComplete = await page.$eval('#clear-completed-btn', el => !el.classList.contains('hidden'));
    if (!btnVisibleAfterComplete) throw new Error('Clear completed button should be visible when completed tasks exist');

    // 5. Click clear completed — only active task should remain
    await page.click('#clear-completed-btn');

    const remainingTasks = await page.$$eval('#task-list li', items => items.map(li => li.querySelector('.task-text').textContent));
    if (remainingTasks.length !== 1) throw new Error(`Expected 1 remaining task, got ${remainingTasks.length}`);
    if (remainingTasks[0] !== 'Task C') throw new Error(`Expected remaining task "Task C", got "${remainingTasks[0]}"`);

    // 6. Button should be hidden again (no completed tasks)
    const btnHiddenAfterClear = await page.$eval('#clear-completed-btn', el => el.classList.contains('hidden'));
    if (!btnHiddenAfterClear) throw new Error('Clear completed button should be hidden after clearing');

    // 7. Counter should show 1 item left
    const counterText = await page.$eval('#task-counter', el => el.textContent);
    if (counterText !== '1 item left') throw new Error(`Expected "1 item left", got "${counterText}"`);

    // 8. Verify persistence — reload and check
    await page.reload({ waitUntil: 'domcontentloaded' });
    const tasksAfterReload = await page.$$eval('#task-list li', items => items.length);
    if (tasksAfterReload !== 1) throw new Error(`After reload, expected 1 task, got ${tasksAfterReload}`);

    console.log('PASS: enhanced-clear-completed');
  } catch (err) {
    console.error('FAIL: enhanced-clear-completed —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
