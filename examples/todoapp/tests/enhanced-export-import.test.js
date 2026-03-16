const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');

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

    // 1. Verify export and import buttons exist
    const exportBtn = await page.$('#export-btn');
    if (!exportBtn) throw new Error('Export button not found');
    const importInput = await page.$('#import-input');
    if (!importInput) throw new Error('Import input not found');

    // 2. Add some tasks
    await page.type('#task-input', 'Export Task A');
    await page.click('#add-btn');
    await page.type('#task-input', 'Export Task B');
    await page.click('#add-btn');

    // Complete one task
    await page.click('#task-list li:nth-child(2) input[type="checkbox"]');

    // 3. Test export — intercept the download by evaluating in-page
    const exportedJSON = await page.evaluate(() => {
      return localStorage.getItem('todoapp-tasks');
    });
    const exportedTasks = JSON.parse(exportedJSON);
    if (!Array.isArray(exportedTasks) || exportedTasks.length !== 2) {
      throw new Error(`Expected 2 tasks in storage, got ${exportedTasks ? exportedTasks.length : 0}`);
    }

    // Verify export button triggers a download (check blob URL creation)
    const downloadTriggered = await page.evaluate(() => {
      return new Promise((resolve) => {
        const origCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function (blob) {
          URL.createObjectURL = origCreateObjectURL;
          resolve(blob.type === 'application/json');
          return origCreateObjectURL(blob);
        };
        document.getElementById('export-btn').click();
      });
    });
    if (!downloadTriggered) throw new Error('Export did not create a JSON blob download');

    // 4. Test import — create a JSON file and upload it
    const importData = [
      { id: 'import-1', text: 'Imported Task X', completed: false },
      { id: 'import-2', text: 'Imported Task Y', completed: true },
      { id: 'import-3', text: 'Imported Task Z', completed: false }
    ];
    const tmpFile = path.join(os.tmpdir(), 'todoapp-test-import.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    // Upload the file
    const fileInput = await page.$('#import-input');
    await fileInput.uploadFile(tmpFile);

    // Wait for import to process
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('#task-list li');
      return items.length === 3;
    }, { timeout: 3000 });

    // 5. Verify imported tasks are displayed
    const taskTexts = await page.$$eval('#task-list li .task-text', els => els.map(el => el.textContent));
    if (taskTexts.length !== 3) throw new Error(`Expected 3 imported tasks, got ${taskTexts.length}`);
    if (!taskTexts.includes('Imported Task X')) throw new Error('Missing "Imported Task X"');
    if (!taskTexts.includes('Imported Task Y')) throw new Error('Missing "Imported Task Y"');
    if (!taskTexts.includes('Imported Task Z')) throw new Error('Missing "Imported Task Z"');

    // 6. Verify completed state was preserved
    const completedItems = await page.$$eval('#task-list li.completed .task-text', els => els.map(el => el.textContent));
    if (!completedItems.includes('Imported Task Y')) throw new Error('Imported Task Y should be completed');

    // 7. Verify persistence after reload
    await page.reload({ waitUntil: 'domcontentloaded' });
    const tasksAfterReload = await page.$$eval('#task-list li', items => items.length);
    if (tasksAfterReload !== 3) throw new Error(`After reload, expected 3 tasks, got ${tasksAfterReload}`);

    // 8. Test invalid import — should not crash
    const invalidFile = path.join(os.tmpdir(), 'todoapp-test-invalid.json');
    fs.writeFileSync(invalidFile, '{"not": "an array"}');

    // Listen for dialog (alert)
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    const fileInput2 = await page.$('#import-input');
    await fileInput2.uploadFile(invalidFile);
    await new Promise(r => setTimeout(r, 500));

    // Tasks should still be the 3 imported ones (not replaced by invalid data)
    const tasksAfterInvalid = await page.$$eval('#task-list li', items => items.length);
    if (tasksAfterInvalid !== 3) throw new Error(`After invalid import, expected 3 tasks, got ${tasksAfterInvalid}`);

    // Cleanup temp files
    fs.unlinkSync(tmpFile);
    fs.unlinkSync(invalidFile);

    console.log('PASS: enhanced-export-import');
  } catch (err) {
    console.error('FAIL: enhanced-export-import —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
