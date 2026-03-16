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

    // 1. Filter buttons exist
    const filterBtns = await page.$$eval('.filter-btn', els => els.map(e => e.getAttribute('data-filter')));
    if (filterBtns.length !== 3) throw new Error(`Expected 3 filter buttons, got ${filterBtns.length}`);
    if (!filterBtns.includes('all') || !filterBtns.includes('active') || !filterBtns.includes('completed')) {
      throw new Error(`Missing filter buttons: ${filterBtns.join(', ')}`);
    }

    // 2. "All" is active by default
    const allBtnActive = await page.$eval('.filter-btn[data-filter="all"]', el => el.classList.contains('active'));
    if (!allBtnActive) throw new Error('"All" filter should be active by default');

    // Add tasks: 2 active, 1 completed
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    // Complete Task B
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');

    // 3. "All" shows all 3 tasks
    let visibleTasks = await page.$$eval('#task-list li', els => els.length);
    if (visibleTasks !== 3) throw new Error(`All filter: expected 3 tasks, got ${visibleTasks}`);

    // 4. Click "Active" — shows only active tasks (Task A, Task C)
    await page.click('.filter-btn[data-filter="active"]');

    const activeBtnActive = await page.$eval('.filter-btn[data-filter="active"]', el => el.classList.contains('active'));
    if (!activeBtnActive) throw new Error('"Active" filter button should be highlighted');

    const allBtnNotActive = await page.$eval('.filter-btn[data-filter="all"]', el => el.classList.contains('active'));
    if (allBtnNotActive) throw new Error('"All" filter button should not be highlighted when "Active" is selected');

    visibleTasks = await page.$$eval('#task-list li', els => els.length);
    if (visibleTasks !== 2) throw new Error(`Active filter: expected 2 tasks, got ${visibleTasks}`);

    const activeTexts = await page.$$eval('#task-list li .task-text', els => els.map(e => e.textContent));
    if (activeTexts.includes('Task B')) throw new Error('Active filter should not show completed Task B');

    // 5. Click "Completed" — shows only completed tasks (Task B)
    await page.click('.filter-btn[data-filter="completed"]');

    const completedBtnActive = await page.$eval('.filter-btn[data-filter="completed"]', el => el.classList.contains('active'));
    if (!completedBtnActive) throw new Error('"Completed" filter button should be highlighted');

    visibleTasks = await page.$$eval('#task-list li', els => els.length);
    if (visibleTasks !== 1) throw new Error(`Completed filter: expected 1 task, got ${visibleTasks}`);

    const completedTexts = await page.$$eval('#task-list li .task-text', els => els.map(e => e.textContent));
    if (completedTexts[0] !== 'Task B') throw new Error(`Completed filter should show Task B, got: ${completedTexts[0]}`);

    // 6. Click "All" again — shows all 3
    await page.click('.filter-btn[data-filter="all"]');
    visibleTasks = await page.$$eval('#task-list li', els => els.length);
    if (visibleTasks !== 3) throw new Error(`All filter after switch: expected 3 tasks, got ${visibleTasks}`);

    console.log('PASS: enhanced-filter-tasks');
  } catch (err) {
    console.error('FAIL: enhanced-filter-tasks —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
