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

    // 1. Submit empty input — no task should be added
    await page.click('#add-btn');
    let taskCount = await page.$$eval('.task-list li', items => items.length);
    if (taskCount !== 0) {
      throw new Error(`Empty submit should not add task, got ${taskCount} tasks`);
    }

    // 2. Input should get 'invalid' class on empty submit
    let hasInvalid = await page.$eval('#task-input', el => el.classList.contains('invalid'));
    if (!hasInvalid) {
      throw new Error('Input should have "invalid" class after empty submit');
    }

    // 3. Input should retain focus after rejection
    let focusedId = await page.evaluate(() => document.activeElement.id);
    if (focusedId !== 'task-input') {
      throw new Error(`Expected focus on task-input, got "${focusedId}"`);
    }

    // 4. Submit whitespace-only input — no task should be added
    await page.type('#task-input', '   ');
    // Typing removes the invalid class
    hasInvalid = await page.$eval('#task-input', el => el.classList.contains('invalid'));
    if (hasInvalid) {
      throw new Error('Typing should remove "invalid" class');
    }

    // Clear and type whitespace fresh
    await page.evaluate(() => {
      document.getElementById('task-input').value = '   ';
    });
    await page.click('#add-btn');
    taskCount = await page.$$eval('.task-list li', items => items.length);
    if (taskCount !== 0) {
      throw new Error(`Whitespace-only submit should not add task, got ${taskCount} tasks`);
    }

    // 5. Input gets invalid class on whitespace submit
    hasInvalid = await page.$eval('#task-input', el => el.classList.contains('invalid'));
    if (!hasInvalid) {
      throw new Error('Input should have "invalid" class after whitespace-only submit');
    }

    // 6. Valid input should still work correctly
    await page.evaluate(() => {
      document.getElementById('task-input').value = '';
    });
    await page.type('#task-input', 'Valid task');
    await page.click('#add-btn');
    taskCount = await page.$$eval('.task-list li', items => items.length);
    if (taskCount !== 1) {
      throw new Error(`Valid task should be added, got ${taskCount} tasks`);
    }

    const taskText = await page.$eval('.task-list li .task-text', el => el.textContent);
    if (taskText !== 'Valid task') {
      throw new Error(`Expected "Valid task", got "${taskText}"`);
    }

    console.log('PASS: core-input-validation');
  } catch (err) {
    console.error('FAIL: core-input-validation —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
