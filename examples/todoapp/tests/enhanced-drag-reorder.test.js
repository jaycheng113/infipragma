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

    // 1. Add three tasks
    await page.type('#task-input', 'Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task B');
    await page.click('#add-btn');
    await page.type('#task-input', 'Task C');
    await page.click('#add-btn');

    // 2. Verify initial order
    let texts = await page.$$eval('#task-list li .task-text', els => els.map(el => el.textContent));
    if (texts[0] !== 'Task A' || texts[1] !== 'Task B' || texts[2] !== 'Task C') {
      throw new Error(`Initial order wrong: ${texts.join(', ')}`);
    }

    // 3. Verify draggable attribute exists on all items
    const draggableCount = await page.$$eval('#task-list li[draggable="true"]', els => els.length);
    if (draggableCount !== 3) throw new Error(`Expected 3 draggable items, got ${draggableCount}`);

    // 4. Simulate drag reorder using the app's moveTask by dispatching drag events
    // Since Puppeteer can't easily simulate HTML5 drag-and-drop natively,
    // we verify the underlying moveTask mechanism via dataTransfer simulation
    await page.evaluate(() => {
      const items = document.querySelectorAll('#task-list li');
      const firstItem = items[0];
      const thirdItem = items[2];

      // Create and dispatch dragstart on first item
      const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dragStartEvent.dataTransfer.setData('text/plain', firstItem.getAttribute('data-task-id'));
      firstItem.dispatchEvent(dragStartEvent);

      // Create and dispatch drop on third item (bottom half to insert after)
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dropEvent.dataTransfer.setData('text/plain', firstItem.getAttribute('data-task-id'));

      // We need to set clientY to be in the bottom half of the third item
      const rect = thirdItem.getBoundingClientRect();
      Object.defineProperty(dropEvent, 'clientY', { value: rect.top + rect.height * 0.75 });
      thirdItem.dispatchEvent(dropEvent);

      // Dispatch dragend
      const dragEndEvent = new DragEvent('dragend', { bubbles: true, cancelable: true });
      firstItem.dispatchEvent(dragEndEvent);
    });

    // 5. Verify new order: Task B, Task C, Task A
    texts = await page.$$eval('#task-list li .task-text', els => els.map(el => el.textContent));
    if (texts[0] !== 'Task B' || texts[1] !== 'Task C' || texts[2] !== 'Task A') {
      throw new Error(`After drag, expected "Task B, Task C, Task A", got "${texts.join(', ')}"`);
    }

    // 6. Verify persistence after reload
    await page.reload({ waitUntil: 'domcontentloaded' });
    texts = await page.$$eval('#task-list li .task-text', els => els.map(el => el.textContent));
    if (texts[0] !== 'Task B' || texts[1] !== 'Task C' || texts[2] !== 'Task A') {
      throw new Error(`After reload, expected "Task B, Task C, Task A", got "${texts.join(', ')}"`);
    }

    // 7. Test dragging to top (insert before)
    await page.evaluate(() => {
      const items = document.querySelectorAll('#task-list li');
      const lastItem = items[2]; // Task A
      const firstItem = items[0]; // Task B

      const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dragStartEvent.dataTransfer.setData('text/plain', lastItem.getAttribute('data-task-id'));
      lastItem.dispatchEvent(dragStartEvent);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dropEvent.dataTransfer.setData('text/plain', lastItem.getAttribute('data-task-id'));

      const rect = firstItem.getBoundingClientRect();
      Object.defineProperty(dropEvent, 'clientY', { value: rect.top + rect.height * 0.25 });
      firstItem.dispatchEvent(dropEvent);

      const dragEndEvent = new DragEvent('dragend', { bubbles: true, cancelable: true });
      lastItem.dispatchEvent(dragEndEvent);
    });

    // 8. Verify: Task A, Task B, Task C (back to original)
    texts = await page.$$eval('#task-list li .task-text', els => els.map(el => el.textContent));
    if (texts[0] !== 'Task A' || texts[1] !== 'Task B' || texts[2] !== 'Task C') {
      throw new Error(`After drag to top, expected "Task A, Task B, Task C", got "${texts.join(', ')}"`);
    }

    console.log('PASS: enhanced-drag-reorder');
  } catch (err) {
    console.error('FAIL: enhanced-drag-reorder —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
