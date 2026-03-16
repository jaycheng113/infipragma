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

    // 1. Favicon link element exists in head
    const faviconHref = await page.evaluate(() => {
      const link = document.querySelector('link[rel="icon"]');
      return link ? link.getAttribute('href') : null;
    });
    if (!faviconHref || !faviconHref.includes('favicon')) {
      throw new Error('Favicon link not found in HTML head');
    }

    // 2. Favicon file is accessible (SVG)
    const faviconResponse = await page.goto(APP_URL + '/favicon.svg');
    if (!faviconResponse.ok()) {
      throw new Error('Favicon file not accessible at /favicon.svg');
    }
    const faviconContentType = faviconResponse.headers()['content-type'] || '';
    // Go back to the app
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });

    // 3. With no tasks, title should be "TodoApp" (no count prefix)
    const emptyTitle = await page.title();
    if (emptyTitle !== 'TodoApp') {
      throw new Error(`Expected title "TodoApp" with no tasks, got "${emptyTitle}"`);
    }

    // 4. Add a task — title should update to show count
    await page.type('#task-input', 'Test task one');
    await page.click('#add-btn');
    const oneTaskTitle = await page.title();
    if (oneTaskTitle !== '(1) TodoApp') {
      throw new Error(`Expected title "(1) TodoApp" after adding 1 task, got "${oneTaskTitle}"`);
    }

    // 5. Add a second task — count should increase
    await page.type('#task-input', 'Test task two');
    await page.click('#add-btn');
    const twoTaskTitle = await page.title();
    if (twoTaskTitle !== '(2) TodoApp') {
      throw new Error(`Expected title "(2) TodoApp" after adding 2 tasks, got "${twoTaskTitle}"`);
    }

    // 6. Complete a task — active count should decrease
    const firstCheckbox = await page.$('.task-list li:first-child input[type="checkbox"]');
    await firstCheckbox.click();
    const afterCompleteTitle = await page.title();
    if (afterCompleteTitle !== '(1) TodoApp') {
      throw new Error(`Expected title "(1) TodoApp" after completing a task, got "${afterCompleteTitle}"`);
    }

    // 7. Complete all tasks — title should revert to "TodoApp"
    const secondCheckbox = await page.$('.task-list li:nth-child(2) input[type="checkbox"]');
    await secondCheckbox.click();
    const allCompleteTitle = await page.title();
    if (allCompleteTitle !== 'TodoApp') {
      throw new Error(`Expected title "TodoApp" when all tasks complete, got "${allCompleteTitle}"`);
    }

    // 8. Title persists correctly after page reload
    // Uncheck a task first so we have active tasks
    const uncheckBox = await page.$('.task-list li:first-child input[type="checkbox"]');
    await uncheckBox.click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    const reloadTitle = await page.title();
    if (reloadTitle !== '(1) TodoApp') {
      throw new Error(`Expected title "(1) TodoApp" after reload, got "${reloadTitle}"`);
    }

    console.log('PASS: polish-favicon-title');
  } catch (err) {
    console.error('FAIL: polish-favicon-title —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
