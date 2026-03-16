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

    // Add tasks so we have content to verify in print mode
    await page.type('#task-input', 'Print test task 1');
    await page.click('#add-btn');
    await page.type('#task-input', 'Print test task 2');
    await page.click('#add-btn');
    await page.waitForSelector('#task-list li');

    // Complete one task
    const checkbox = await page.$('#task-list li input[type="checkbox"]');
    await checkbox.click();

    // 1. Verify @media print rules exist in the stylesheet
    const printRuleExists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].type === CSSRule.MEDIA_RULE && rules[j].conditionText === 'print') {
              return true;
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
      return false;
    });
    if (!printRuleExists) {
      throw new Error('Expected @media print CSS rules in the stylesheet');
    }

    // 2. Emulate print media and verify interactive elements are hidden
    await page.emulateMediaType('print');

    const hiddenElements = await page.evaluate(() => {
      const selectors = [
        '.task-input',
        '.filter-bar',
        '.theme-toggle',
        '.export-import-bar',
        '.delete-btn',
        '.task-footer',
        'footer',
      ];
      const results = {};
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const style = getComputedStyle(el);
          results[sel] = style.display;
        }
      }
      return results;
    });

    for (const [sel, display] of Object.entries(hiddenElements)) {
      if (display !== 'none') {
        throw new Error(`${sel} should be hidden in print mode, got display: ${display}`);
      }
    }

    // 3. Verify task list is still visible
    const taskListDisplay = await page.evaluate(() => {
      const list = document.querySelector('.task-list');
      return getComputedStyle(list).display;
    });
    if (taskListDisplay === 'none') {
      throw new Error('Task list should be visible in print mode');
    }

    // 4. Verify task items are visible
    const taskItemsVisible = await page.evaluate(() => {
      const items = document.querySelectorAll('#task-list li');
      return items.length > 0 && Array.from(items).every(li => getComputedStyle(li).display !== 'none');
    });
    if (!taskItemsVisible) {
      throw new Error('Task items should be visible in print mode');
    }

    // 5. Verify box-shadow is removed from app-container
    const containerShadow = await page.evaluate(() => {
      const container = document.querySelector('.app-container');
      return getComputedStyle(container).boxShadow;
    });
    if (containerShadow !== 'none') {
      throw new Error('App container should have no box-shadow in print mode, got: ' + containerShadow);
    }

    // 6. Verify background is removed from app-container
    const containerBg = await page.evaluate(() => {
      const container = document.querySelector('.app-container');
      const bg = getComputedStyle(container).background;
      return bg;
    });
    // "none" or transparent-like values are acceptable
    if (containerBg.includes('rgb') && !containerBg.includes('rgba(0, 0, 0, 0)')) {
      // Check if it's truly "none" — some browsers report differently
      const bgColor = await page.evaluate(() => {
        const container = document.querySelector('.app-container');
        return getComputedStyle(container).backgroundColor;
      });
      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        throw new Error('App container should have no background in print mode, got: ' + bgColor);
      }
    }

    // 7. Verify task list has no max-height restriction (overflow visible)
    const taskListOverflow = await page.evaluate(() => {
      const list = document.querySelector('.task-list');
      const style = getComputedStyle(list);
      return { maxHeight: style.maxHeight, overflow: style.overflowY };
    });
    if (taskListOverflow.maxHeight !== 'none' && taskListOverflow.maxHeight !== '') {
      throw new Error('Task list should have no max-height in print mode, got: ' + taskListOverflow.maxHeight);
    }

    // 8. Verify header is still visible
    const headerDisplay = await page.evaluate(() => {
      const h1 = document.querySelector('header h1');
      return getComputedStyle(h1).display;
    });
    if (headerDisplay === 'none') {
      throw new Error('Header should be visible in print mode');
    }

    console.log('PASS: polish-print-styles');
  } catch (err) {
    console.error('FAIL: polish-print-styles —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
