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

    // Add a task so we have interactive elements to test
    await page.type('#task-input', 'Hover test task');
    await page.click('#add-btn');
    await page.waitForSelector('#task-list li');

    // 1. Verify buttons have transition properties (150-200ms range)
    const addBtnTransition = await page.evaluate(() => {
      const btn = document.querySelector('#add-btn');
      return getComputedStyle(btn).transition;
    });
    if (!addBtnTransition || addBtnTransition === 'all 0s ease 0s') {
      throw new Error('Add button should have CSS transitions, got: ' + addBtnTransition);
    }

    // 2. Verify delete button is hidden by default (opacity: 0) and revealed on hover
    const deleteBtnOpacity = await page.evaluate(() => {
      const btn = document.querySelector('.delete-btn');
      return getComputedStyle(btn).opacity;
    });
    if (deleteBtnOpacity !== '0') {
      throw new Error('Delete button should be hidden (opacity: 0) by default, got: ' + deleteBtnOpacity);
    }

    // Hover over the task list item to reveal delete button
    const liHandle = await page.$('#task-list li');
    await liHandle.hover();
    await new Promise(r => setTimeout(r, 200)); // Wait for transition

    const deleteBtnOpacityAfterHover = await page.evaluate(() => {
      const btn = document.querySelector('.delete-btn');
      return getComputedStyle(btn).opacity;
    });
    if (deleteBtnOpacityAfterHover !== '1') {
      throw new Error('Delete button should be visible (opacity: 1) on hover, got: ' + deleteBtnOpacityAfterHover);
    }

    // 3. Verify delete button has transition property
    const deleteBtnTransition = await page.evaluate(() => {
      const btn = document.querySelector('.delete-btn');
      return getComputedStyle(btn).transition;
    });
    if (!deleteBtnTransition.includes('opacity')) {
      throw new Error('Delete button should have opacity transition, got: ' + deleteBtnTransition);
    }

    // 4. Verify input field has hover border-color change via CSS rule
    const inputTransition = await page.evaluate(() => {
      const input = document.querySelector('#task-input');
      return getComputedStyle(input).transition;
    });
    if (!inputTransition.includes('border')) {
      throw new Error('Task input should have border transition, got: ' + inputTransition);
    }

    // 5. Verify focus-visible styles exist in the stylesheet
    const focusVisibleRuleExists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            const selectorText = rules[j].selectorText || '';
            if (selectorText.includes('focus-visible')) {
              return true;
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
      return false;
    });
    if (!focusVisibleRuleExists) {
      throw new Error('Expected :focus-visible CSS rules for keyboard navigation');
    }

    // 6. Verify filter buttons have transition
    const filterBtnTransition = await page.evaluate(() => {
      const btn = document.querySelector('.filter-btn');
      return getComputedStyle(btn).transition;
    });
    if (!filterBtnTransition || filterBtnTransition === 'all 0s ease 0s') {
      throw new Error('Filter button should have CSS transitions, got: ' + filterBtnTransition);
    }

    // 7. Verify theme toggle has transition
    const themeToggleTransition = await page.evaluate(() => {
      const btn = document.querySelector('.theme-toggle');
      return getComputedStyle(btn).transition;
    });
    if (!themeToggleTransition || themeToggleTransition === 'all 0s ease 0s') {
      throw new Error('Theme toggle should have CSS transitions, got: ' + themeToggleTransition);
    }

    // 8. Verify transitions are in the 150-200ms range (0.15s-0.2s)
    const transitionDurations = await page.evaluate(() => {
      const elements = [
        document.querySelector('#add-btn'),
        document.querySelector('.filter-btn'),
        document.querySelector('.delete-btn'),
        document.querySelector('.theme-toggle'),
      ];
      return elements.map(el => getComputedStyle(el).transitionDuration);
    });

    for (const duration of transitionDurations) {
      // Parse durations like "0.15s, 0.15s, 0.15s" — each should be between 0.1s and 0.3s
      const values = duration.split(',').map(d => parseFloat(d.trim()));
      for (const v of values) {
        if (v < 0.1 || v > 0.3) {
          throw new Error('Transition duration should be 150-200ms range, got: ' + v + 's in "' + duration + '"');
        }
      }
    }

    console.log('PASS: polish-hover-states');
  } catch (err) {
    console.error('FAIL: polish-hover-states —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
