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

    // 1. Empty state should be visible when no tasks exist
    const emptyVisible = await page.$eval('#empty-state', el => {
      return !el.classList.contains('hidden') && el.offsetParent !== null;
    });
    if (!emptyVisible) {
      throw new Error('Empty state should be visible when no tasks exist');
    }

    // 2. Empty state should contain a friendly message
    const emptyText = await page.$eval('#empty-state', el => el.textContent);
    if (!emptyText || emptyText.trim().length === 0) {
      throw new Error('Empty state should display a message');
    }

    // 3. Add a task — empty state should disappear
    await page.type('#task-input', 'Test task');
    await page.click('#add-btn');

    const hiddenAfterAdd = await page.$eval('#empty-state', el => el.classList.contains('hidden'));
    if (!hiddenAfterAdd) {
      throw new Error('Empty state should be hidden after adding a task');
    }

    // 4. Delete the task — empty state should reappear
    await page.click('.delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 0, { timeout: 2000 });

    const visibleAfterDelete = await page.$eval('#empty-state', el => {
      return !el.classList.contains('hidden');
    });
    if (!visibleAfterDelete) {
      throw new Error('Empty state should reappear after deleting all tasks');
    }

    console.log('PASS: core-empty-state');
  } catch (err) {
    console.error('FAIL: core-empty-state —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
