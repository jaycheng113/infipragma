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

    // 1. Add two tasks
    await page.type('#task-input', 'Persist task one');
    await page.click('#add-btn');
    await page.type('#task-input', 'Persist task two');
    await page.click('#add-btn');

    // 2. Verify tasks are saved in localStorage
    const storedData = await page.evaluate(() => localStorage.getItem('todoapp-tasks'));
    if (!storedData) throw new Error('No data found in localStorage');
    const parsed = JSON.parse(storedData);
    if (parsed.length !== 2) throw new Error(`Expected 2 tasks in localStorage, got ${parsed.length}`);

    // 3. Reload the page — tasks should persist
    await page.reload({ waitUntil: 'domcontentloaded' });

    const taskTexts = await page.$$eval('.task-list li .task-text', els => els.map(el => el.textContent));
    if (taskTexts.length !== 2) {
      throw new Error(`Expected 2 tasks after reload, got ${taskTexts.length}`);
    }
    if (taskTexts[0] !== 'Persist task one' || taskTexts[1] !== 'Persist task two') {
      throw new Error(`Task texts after reload don't match: ${JSON.stringify(taskTexts)}`);
    }

    // 4. Complete a task and verify persistence after reload
    await page.click('.task-list li:first-child input[type="checkbox"]');
    await page.reload({ waitUntil: 'domcontentloaded' });

    const firstCompleted = await page.$eval('.task-list li:first-child', el => el.classList.contains('completed'));
    if (!firstCompleted) throw new Error('Completed state did not persist after reload');

    // 5. Delete a task and verify persistence after reload
    await page.click('.task-list li:last-child .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('.task-list li').length === 1, { timeout: 2000 });
    await page.reload({ waitUntil: 'domcontentloaded' });

    const remainingCount = await page.$$eval('.task-list li', items => items.length);
    if (remainingCount !== 1) {
      throw new Error(`Expected 1 task after delete+reload, got ${remainingCount}`);
    }

    // 6. Handle corrupt localStorage data gracefully
    await page.evaluate(() => localStorage.setItem('todoapp-tasks', 'not valid json!!!'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const tasksAfterCorrupt = await page.$$eval('.task-list li', items => items.length);
    if (tasksAfterCorrupt !== 0) {
      throw new Error(`Expected 0 tasks after corrupt data, got ${tasksAfterCorrupt}`);
    }

    // 7. Handle missing localStorage data gracefully
    await page.evaluate(() => localStorage.removeItem('todoapp-tasks'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const tasksAfterMissing = await page.$$eval('.task-list li', items => items.length);
    if (tasksAfterMissing !== 0) {
      throw new Error(`Expected 0 tasks after missing data, got ${tasksAfterMissing}`);
    }

    console.log('PASS: core-localstorage-persist');
  } catch (err) {
    console.error('FAIL: core-localstorage-persist —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
