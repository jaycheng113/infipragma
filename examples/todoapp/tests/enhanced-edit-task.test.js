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
    await page.type('#task-input', 'Original Task');
    await page.click('#add-btn');
    // Wait for add animation to complete
    await page.waitForFunction(() => !document.querySelector('.task-adding'), { timeout: 2000 });

    // 2. Double-click to edit
    const taskText = await page.$('#task-list li:nth-child(1) .task-text');
    await taskText.click({ clickCount: 2 });

    // 3. Verify edit input appears
    const editInput = await page.$('#task-list li:nth-child(1) .edit-input');
    if (!editInput) throw new Error('Edit input should appear on double-click');

    // 4. Verify edit input has original text
    const inputValue = await page.$eval('#task-list li:nth-child(1) .edit-input', el => el.value);
    if (inputValue !== 'Original Task') throw new Error(`Expected input value "Original Task", got "${inputValue}"`);

    // 5. Clear and type new text, press Enter to save
    await editInput.click({ clickCount: 3 }); // select all
    await editInput.type('Updated Task');
    await page.keyboard.press('Enter');

    // 6. Verify text was updated
    const updatedText = await page.$eval('#task-list li:nth-child(1) .task-text', el => el.textContent);
    if (updatedText !== 'Updated Task') throw new Error(`Expected "Updated Task", got "${updatedText}"`);

    // 7. Verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    const persistedText = await page.$eval('#task-list li:nth-child(1) .task-text', el => el.textContent);
    if (persistedText !== 'Updated Task') throw new Error(`After reload, expected "Updated Task", got "${persistedText}"`);

    // 8. Test Escape to cancel — double-click to edit again
    const taskText2 = await page.$('#task-list li:nth-child(1) .task-text');
    await taskText2.click({ clickCount: 2 });

    const editInput2 = await page.$('#task-list li:nth-child(1) .edit-input');
    if (!editInput2) throw new Error('Edit input should appear on second double-click');

    await editInput2.click({ clickCount: 3 });
    await editInput2.type('Should Not Save');
    await page.keyboard.press('Escape');

    // 9. Verify original text is restored after Escape
    const restoredText = await page.$eval('#task-list li:nth-child(1) .task-text', el => el.textContent);
    if (restoredText !== 'Updated Task') throw new Error(`After Escape, expected "Updated Task", got "${restoredText}"`);

    // 10. Test blur to save — double-click to edit
    const taskText3 = await page.$('#task-list li:nth-child(1) .task-text');
    await taskText3.click({ clickCount: 2 });

    const editInput3 = await page.$('#task-list li:nth-child(1) .edit-input');
    if (!editInput3) throw new Error('Edit input should appear on third double-click');

    await editInput3.click({ clickCount: 3 });
    await editInput3.type('Blur Saved Task');
    // Click elsewhere to trigger blur
    await page.click('header h1');

    // Wait for render
    await page.waitForSelector('#task-list li:nth-child(1) .task-text');
    const blurSavedText = await page.$eval('#task-list li:nth-child(1) .task-text', el => el.textContent);
    if (blurSavedText !== 'Blur Saved Task') throw new Error(`After blur, expected "Blur Saved Task", got "${blurSavedText}"`);

    console.log('PASS: enhanced-edit-task');
  } catch (err) {
    console.error('FAIL: enhanced-edit-task —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
