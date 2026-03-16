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

    // 1. ARIA roles exist on key elements
    const mainRole = await page.$eval('main', el => el.getAttribute('role'));
    if (mainRole !== 'main') throw new Error('main element missing role="main"');

    const formLabel = await page.$eval('#task-form', el => el.getAttribute('aria-label'));
    if (!formLabel) throw new Error('Task form missing aria-label');

    const inputLabel = await page.$eval('#task-input', el => el.getAttribute('aria-label'));
    if (!inputLabel) throw new Error('Task input missing aria-label');

    const filterBarRole = await page.$eval('#filter-bar', el => el.getAttribute('role'));
    if (filterBarRole !== 'toolbar') throw new Error('Filter bar missing role="toolbar"');

    const taskListRole = await page.$eval('#task-list', el => el.getAttribute('role'));
    if (taskListRole !== 'list') throw new Error('Task list missing role="list"');

    // 2. Filter buttons have aria-pressed
    const allBtnPressed = await page.$eval('.filter-btn[data-filter="all"]', el => el.getAttribute('aria-pressed'));
    if (allBtnPressed !== 'true') throw new Error('All filter button should have aria-pressed="true"');
    const activeBtnPressed = await page.$eval('.filter-btn[data-filter="active"]', el => el.getAttribute('aria-pressed'));
    if (activeBtnPressed !== 'false') throw new Error('Active filter button should have aria-pressed="false"');

    // 3. aria-live region exists for announcements
    const liveRegion = await page.$('#status-announcer');
    if (!liveRegion) throw new Error('aria-live status announcer not found');
    const liveAttr = await page.$eval('#status-announcer', el => el.getAttribute('aria-live'));
    if (liveAttr !== 'polite') throw new Error('Status announcer missing aria-live="polite"');

    // 4. Task counter has aria-live
    const counterLive = await page.$eval('#task-counter', el => el.getAttribute('aria-live'));
    if (counterLive !== 'polite') throw new Error('Task counter missing aria-live="polite"');

    // 5. Add a task and verify announcement
    await page.type('#task-input', 'Accessibility test task');
    await page.click('#add-btn');
    await new Promise(r => setTimeout(r, 400));

    const addAnnouncement = await page.$eval('#status-announcer', el => el.textContent);
    if (!addAnnouncement.includes('Task added')) {
      throw new Error('Expected "Task added" announcement, got: "' + addAnnouncement + '"');
    }

    // 6. Task checkbox has aria-label
    const checkboxLabel = await page.$eval('.task-list input[type="checkbox"]', el => el.getAttribute('aria-label'));
    if (!checkboxLabel || !checkboxLabel.includes('Accessibility test task')) {
      throw new Error('Task checkbox missing proper aria-label, got: "' + checkboxLabel + '"');
    }

    // 7. Delete button has aria-label
    const deleteBtnLabel = await page.$eval('.delete-btn', el => el.getAttribute('aria-label'));
    if (!deleteBtnLabel || !deleteBtnLabel.includes('Delete')) {
      throw new Error('Delete button missing aria-label');
    }

    // 8. Toggle all checkbox has aria-label
    const toggleAllLabel = await page.$eval('#toggle-all', el => el.getAttribute('aria-label'));
    if (!toggleAllLabel) throw new Error('Toggle all checkbox missing aria-label');

    // 9. Keyboard navigation — Tab to add button and press Enter
    await page.type('#task-input', 'Keyboard task');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 400));

    const tasks = await page.$$('.task-list li');
    if (tasks.length !== 2) throw new Error('Expected 2 tasks after keyboard submit, got ' + tasks.length);

    // 10. Focus-visible styles are defined (verify outline exists on focused element)
    await page.focus('#task-input');
    const focusOutline = await page.evaluate(() => {
      const el = document.querySelector('#task-input');
      el.focus();
      return getComputedStyle(el).outlineStyle;
    });
    // focus-visible may not trigger via JS focus in all browsers, so just verify CSS is present
    const hasFocusVisibleCSS = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText && rules[j].selectorText.includes('focus-visible')) {
              return true;
            }
          }
        } catch (e) { /* cross-origin */ }
      }
      return false;
    });
    if (!hasFocusVisibleCSS) throw new Error('No :focus-visible CSS rules found');

    // 11. Completing a task announces the change
    await page.click('.task-list input[type="checkbox"]');
    await new Promise(r => setTimeout(r, 400));
    const completeAnnouncement = await page.$eval('#status-announcer', el => el.textContent);
    if (!completeAnnouncement.includes('completed') && !completeAnnouncement.includes('marked active')) {
      throw new Error('Expected completion announcement, got: "' + completeAnnouncement + '"');
    }

    // 12. Filter click updates aria-pressed
    await page.click('.filter-btn[data-filter="completed"]');
    await new Promise(r => setTimeout(r, 200));
    const completedPressed = await page.$eval('.filter-btn[data-filter="completed"]', el => el.getAttribute('aria-pressed'));
    if (completedPressed !== 'true') throw new Error('Completed filter aria-pressed should be true after click');
    const allPressedAfter = await page.$eval('.filter-btn[data-filter="all"]', el => el.getAttribute('aria-pressed'));
    if (allPressedAfter !== 'false') throw new Error('All filter aria-pressed should be false after switching');

    // 13. sr-only class exists in CSS
    const hasSrOnly = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText && rules[j].selectorText.includes('sr-only')) {
              return true;
            }
          }
        } catch (e) { /* cross-origin */ }
      }
      return false;
    });
    if (!hasSrOnly) throw new Error('No .sr-only CSS class found');

    // 14. Semantic HTML — buttons are <button> elements
    const addBtnTag = await page.$eval('#add-btn', el => el.tagName);
    if (addBtnTag !== 'BUTTON') throw new Error('Add button should be a <button> element');
    const clearBtnTag = await page.$eval('#clear-completed-btn', el => el.tagName);
    if (clearBtnTag !== 'BUTTON') throw new Error('Clear completed should be a <button> element');
    const themeToggleTag = await page.$eval('#theme-toggle', el => el.tagName);
    if (themeToggleTag !== 'BUTTON') throw new Error('Theme toggle should be a <button> element');

    // 15. Delete task announces deletion
    await page.click('.filter-btn[data-filter="all"]');
    await new Promise(r => setTimeout(r, 200));
    await page.click('.delete-btn');
    await new Promise(r => setTimeout(r, 500));
    const deleteAnnouncement = await page.$eval('#status-announcer', el => el.textContent);
    if (!deleteAnnouncement.includes('deleted')) {
      throw new Error('Expected "deleted" announcement, got: "' + deleteAnnouncement + '"');
    }

    console.log('PASS: polish-accessibility');
  } catch (err) {
    console.error('FAIL: polish-accessibility —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
