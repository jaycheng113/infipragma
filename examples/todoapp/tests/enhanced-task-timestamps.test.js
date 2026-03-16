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

    // 1. Add a task
    await page.type('#task-input', 'Timestamp Test Task');
    await page.click('#add-btn');

    // 2. Verify timestamp element appears
    await page.waitForSelector('#task-list li .task-timestamp', { timeout: 3000 });
    const timestampText = await page.$eval('#task-list li .task-timestamp', el => el.textContent);
    if (!timestampText) throw new Error('Timestamp text is empty');
    // Newly created task should show "just now"
    if (timestampText !== 'just now') throw new Error(`Expected "just now", got "${timestampText}"`);

    // 3. Verify createdAt field is stored in localStorage
    const storedTasks = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('todoapp-tasks'));
    });
    if (!storedTasks[0].createdAt) throw new Error('createdAt field not found in stored task');
    const createdDate = new Date(storedTasks[0].createdAt);
    if (isNaN(createdDate.getTime())) throw new Error('createdAt is not a valid ISO date');

    // 4. Verify timestamp persists after reload
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#task-list li .task-timestamp', { timeout: 3000 });
    const timestampAfterReload = await page.$eval('#task-list li .task-timestamp', el => el.textContent);
    if (!timestampAfterReload) throw new Error('Timestamp missing after reload');

    // 5. Verify task-content wrapper exists (timestamp is below task text)
    const hasContent = await page.$('#task-list li .task-content');
    if (!hasContent) throw new Error('task-content wrapper not found');
    const hasTextInContent = await page.$('#task-list li .task-content .task-text');
    if (!hasTextInContent) throw new Error('task-text not inside task-content');

    // 6. Add a second task and verify both have timestamps
    await page.type('#task-input', 'Second Timestamp Task');
    await page.click('#add-btn');
    const allTimestamps = await page.$$eval('#task-list li .task-timestamp', els => els.map(el => el.textContent));
    if (allTimestamps.length !== 2) throw new Error(`Expected 2 timestamps, got ${allTimestamps.length}`);

    // 7. Test with older date — inject a task with old createdAt
    await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('todoapp-tasks'));
      const oldDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
      tasks.push({ id: 'old-task', text: 'Old Task', completed: false, createdAt: oldDate });
      localStorage.setItem('todoapp-tasks', JSON.stringify(tasks));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    const oldTimestamp = await page.$eval('#task-list li[data-task-id="old-task"] .task-timestamp', el => el.textContent);
    if (!oldTimestamp.includes('3d ago')) throw new Error(`Expected "3d ago" for old task, got "${oldTimestamp}"`);

    console.log('PASS: enhanced-task-timestamps');
  } catch (err) {
    console.error('FAIL: enhanced-task-timestamps —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
