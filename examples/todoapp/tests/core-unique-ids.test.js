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

    // 1. Add multiple tasks rapidly to test uniqueness
    const taskTexts = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
    for (const text of taskTexts) {
      await page.type('#task-input', text);
      await page.click('#add-btn');
    }

    // 2. Verify all tasks have unique IDs via data-task-id attribute
    const ids = await page.$$eval('.task-list li', items =>
      items.map(item => item.getAttribute('data-task-id'))
    );

    if (ids.length !== taskTexts.length) {
      throw new Error(`Expected ${taskTexts.length} tasks, got ${ids.length}`);
    }

    // 3. All IDs must be non-empty strings
    for (let i = 0; i < ids.length; i++) {
      if (!ids[i] || typeof ids[i] !== 'string' || ids[i].trim() === '') {
        throw new Error(`Task ${i} has invalid ID: "${ids[i]}"`);
      }
    }

    // 4. All IDs must be unique
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new Error(`Duplicate IDs found: ${JSON.stringify(ids)}`);
    }

    // 5. Verify IDs are used for task operations (toggle via checkbox)
    const firstId = ids[0];
    const firstCheckbox = await page.$(`li[data-task-id="${firstId}"] input[type="checkbox"]`);
    if (!firstCheckbox) throw new Error('Cannot find checkbox for first task by ID');
    await firstCheckbox.click();

    // Verify only the targeted task was toggled
    const completedIds = await page.$$eval('.task-list li.completed', items =>
      items.map(item => item.getAttribute('data-task-id'))
    );
    if (completedIds.length !== 1 || completedIds[0] !== firstId) {
      throw new Error(`Expected only task ${firstId} completed, got: ${JSON.stringify(completedIds)}`);
    }

    // 6. Verify IDs are used for delete operations
    const secondId = ids[1];
    const deleteBtn = await page.$(`li[data-task-id="${secondId}"] .delete-btn`);
    if (!deleteBtn) throw new Error('Cannot find delete button for second task by ID');
    await deleteBtn.click();
    await page.waitForFunction(
      (id) => !document.querySelector(`li[data-task-id="${id}"]`),
      { timeout: 2000 },
      secondId
    );

    const remainingIds = await page.$$eval('.task-list li', items =>
      items.map(item => item.getAttribute('data-task-id'))
    );
    if (remainingIds.includes(secondId)) {
      throw new Error(`Task ${secondId} should have been deleted`);
    }
    if (remainingIds.length !== taskTexts.length - 1) {
      throw new Error(`Expected ${taskTexts.length - 1} tasks, got ${remainingIds.length}`);
    }

    // 7. Verify IDs persist in localStorage
    const storedTasks = await page.evaluate((key) => {
      return JSON.parse(localStorage.getItem(key));
    }, 'todoapp-tasks');

    for (const task of storedTasks) {
      if (!task.id || typeof task.id !== 'string' || task.id.trim() === '') {
        throw new Error(`Stored task missing valid ID: ${JSON.stringify(task)}`);
      }
    }

    const storedIds = storedTasks.map(t => t.id);
    const storedUniqueIds = new Set(storedIds);
    if (storedUniqueIds.size !== storedIds.length) {
      throw new Error(`Duplicate IDs in localStorage: ${JSON.stringify(storedIds)}`);
    }

    console.log('PASS: core-unique-ids');
  } catch (err) {
    console.error('FAIL: core-unique-ids —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
