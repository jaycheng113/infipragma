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

    // 1. Input field and Add button exist
    const input = await page.$('#task-input');
    const addBtn = await page.$('#add-btn');
    if (!input || !addBtn) throw new Error('Input or Add button not found');

    // 2. Input has placeholder
    const placeholder = await page.$eval('#task-input', el => el.placeholder);
    if (!placeholder) throw new Error('Input missing placeholder');

    // 3. Add a task via button click
    await page.type('#task-input', 'Buy groceries');
    await page.click('#add-btn');

    // 4. Task appears in the list
    const taskText = await page.$eval('.task-list li .task-text', el => el.textContent);
    if (taskText !== 'Buy groceries') {
      throw new Error(`Expected "Buy groceries", got "${taskText}"`);
    }

    // 5. Input is cleared after submission
    const inputVal = await page.$eval('#task-input', el => el.value);
    if (inputVal !== '') {
      throw new Error(`Input not cleared after submission, value: "${inputVal}"`);
    }

    // 6. Add a second task
    await page.type('#task-input', 'Walk the dog');
    await page.click('#add-btn');

    const taskCount = await page.$$eval('.task-list li', items => items.length);
    if (taskCount !== 2) {
      throw new Error(`Expected 2 tasks, got ${taskCount}`);
    }

    // 7. Verify both tasks display correctly
    const allTexts = await page.$$eval('.task-list li .task-text', els => els.map(el => el.textContent));
    if (allTexts[0] !== 'Buy groceries' || allTexts[1] !== 'Walk the dog') {
      throw new Error(`Unexpected task texts: ${JSON.stringify(allTexts)}`);
    }

    // 8. Empty state is hidden when tasks exist
    const emptyHidden = await page.$eval('#empty-state', el => el.classList.contains('hidden'));
    if (!emptyHidden) throw new Error('Empty state should be hidden when tasks exist');

    console.log('PASS: core-add-task');
  } catch (err) {
    console.error('FAIL: core-add-task —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
