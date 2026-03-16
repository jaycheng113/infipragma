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

    // 1. Counter should be hidden when no tasks exist
    const footerHidden = await page.$eval('#task-footer', el => el.classList.contains('hidden'));
    if (!footerHidden) throw new Error('Task footer should be hidden when no tasks exist');

    // 2. Add 3 tasks — counter should show "3 items left"
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    const footerVisible = await page.$eval('#task-footer', el => !el.classList.contains('hidden'));
    if (!footerVisible) throw new Error('Task footer should be visible when tasks exist');

    let counterText = await page.$eval('#task-counter', el => el.textContent);
    if (counterText !== '3 items left') throw new Error(`Expected "3 items left", got "${counterText}"`);

    // 3. Complete one task — counter should show "2 items left"
    await page.click('#task-list li:nth-child(1) input[type="checkbox"]');
    counterText = await page.$eval('#task-counter', el => el.textContent);
    if (counterText !== '2 items left') throw new Error(`Expected "2 items left", got "${counterText}"`);

    // 4. Complete another — counter should show "1 item left" (singular)
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');
    counterText = await page.$eval('#task-counter', el => el.textContent);
    if (counterText !== '1 item left') throw new Error(`Expected "1 item left", got "${counterText}"`);

    // 5. Complete all — counter should show "0 items left"
    await page.click('#task-list li:nth-child(3) input[type="checkbox"]');
    counterText = await page.$eval('#task-counter', el => el.textContent);
    if (counterText !== '0 items left') throw new Error(`Expected "0 items left", got "${counterText}"`);

    // 6. Delete all tasks — footer should hide
    // Uncomplete first to test delete
    await page.click('#task-list li:nth-child(1) input[type="checkbox"]');
    // Delete all 3 tasks (wait for animation between each)
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 2, { timeout: 2000 });
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 1, { timeout: 2000 });
    await page.click('#task-list li:nth-child(1) .delete-btn');
    await page.waitForFunction(() => document.querySelectorAll('#task-list li').length === 0, { timeout: 2000 });

    const footerHiddenAfterDelete = await page.$eval('#task-footer', el => el.classList.contains('hidden'));
    if (!footerHiddenAfterDelete) throw new Error('Task footer should hide when all tasks are deleted');

    console.log('PASS: enhanced-task-counter');
  } catch (err) {
    console.error('FAIL: enhanced-task-counter —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
