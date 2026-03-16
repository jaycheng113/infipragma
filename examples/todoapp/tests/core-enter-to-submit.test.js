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

    // 1. Type a task and press Enter (not click the button)
    await page.type('#task-input', 'Task via Enter');
    await page.keyboard.press('Enter');

    // 2. Task should appear in the list
    const taskText = await page.$eval('.task-list li .task-text', el => el.textContent);
    if (taskText !== 'Task via Enter') {
      throw new Error(`Expected "Task via Enter", got "${taskText}"`);
    }

    // 3. Input should be cleared after Enter submission
    const inputVal = await page.$eval('#task-input', el => el.value);
    if (inputVal !== '') {
      throw new Error(`Input not cleared after Enter, value: "${inputVal}"`);
    }

    // 4. Input should retain focus after Enter submission
    const isFocused = await page.$eval('#task-input', el => document.activeElement === el);
    if (!isFocused) {
      throw new Error('Input should retain focus after Enter submission');
    }

    // 5. Add a second task via Enter
    await page.type('#task-input', 'Second task via Enter');
    await page.keyboard.press('Enter');

    const taskCount = await page.$$eval('.task-list li', items => items.length);
    if (taskCount !== 2) {
      throw new Error(`Expected 2 tasks, got ${taskCount}`);
    }

    // 6. Verify no page reload happened (form default prevented)
    const allTexts = await page.$$eval('.task-list li .task-text', els => els.map(el => el.textContent));
    if (allTexts[0] !== 'Task via Enter' || allTexts[1] !== 'Second task via Enter') {
      throw new Error(`Unexpected task texts: ${JSON.stringify(allTexts)}`);
    }

    // 7. Empty/whitespace Enter should NOT add a task
    await page.type('#task-input', '   ');
    await page.keyboard.press('Enter');

    const taskCountAfter = await page.$$eval('.task-list li', items => items.length);
    if (taskCountAfter !== 2) {
      throw new Error(`Empty Enter should not add task, expected 2 tasks, got ${taskCountAfter}`);
    }

    console.log('PASS: core-enter-to-submit');
  } catch (err) {
    console.error('FAIL: core-enter-to-submit —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
