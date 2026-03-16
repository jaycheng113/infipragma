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

    // 1. Task list container exists
    const taskListEl = await page.$('#task-list');
    if (!taskListEl) throw new Error('Task list container (#task-list) not found');

    // 2. Task list is a <ul> element
    const tagName = await page.$eval('#task-list', el => el.tagName);
    if (tagName !== 'UL') throw new Error(`Expected UL, got ${tagName}`);

    // 3. Add multiple tasks and verify they all display
    await page.type('#task-input', 'Task Alpha');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task Beta');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task Gamma');
    await page.click('#add-btn');

    const items = await page.$$eval('#task-list li', els => els.length);
    if (items !== 3) throw new Error(`Expected 3 tasks, got ${items}`);

    // 4. Each task shows its text content
    const texts = await page.$$eval('#task-list li .task-text', els => els.map(e => e.textContent));
    if (texts[0] !== 'Task Alpha' || texts[1] !== 'Task Beta' || texts[2] !== 'Task Gamma') {
      throw new Error(`Unexpected task texts: ${JSON.stringify(texts)}`);
    }

    // 5. Each task has a checkbox for status
    const checkboxes = await page.$$eval('#task-list li input[type="checkbox"]', els => els.length);
    if (checkboxes !== 3) throw new Error(`Expected 3 checkboxes, got ${checkboxes}`);

    // 6. Completion status shown visually — toggle a task and verify strikethrough
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');
    const isCompleted = await page.$eval('#task-list li:nth-child(2)', el => el.classList.contains('completed'));
    if (!isCompleted) throw new Error('Second task should have completed class after checkbox click');

    const textDecoration = await page.$eval('#task-list li:nth-child(2) .task-text', el => {
      return window.getComputedStyle(el).textDecorationLine || window.getComputedStyle(el).textDecoration;
    });
    if (!textDecoration.includes('line-through')) {
      throw new Error(`Expected line-through on completed task, got: ${textDecoration}`);
    }

    // 7. Task list is scrollable (has overflow-y set)
    const overflowY = await page.$eval('#task-list', el => window.getComputedStyle(el).overflowY);
    if (overflowY !== 'auto' && overflowY !== 'scroll') {
      throw new Error(`Expected scrollable task list (overflow-y: auto/scroll), got: ${overflowY}`);
    }

    // 8. List updates on data change — delete a task and verify count updates
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 2, { timeout: 2000 });
    const afterDelete = await page.$$eval('#task-list li', els => els.length);
    if (afterDelete !== 2) throw new Error(`Expected 2 tasks after delete, got ${afterDelete}`);

    console.log('PASS: core-display-tasks');
  } catch (err) {
    console.error('FAIL: core-display-tasks —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
