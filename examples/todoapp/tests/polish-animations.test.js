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

    // 1. Add a task and verify fade-in animation class is applied
    await page.type('#task-input', 'Animated task');
    await page.click('#add-btn');

    // The task-adding class should be present briefly; check animation-name on the li
    const hasAnimation = await page.evaluate(() => {
      const li = document.querySelector('#task-list li');
      if (!li) return false;
      const style = getComputedStyle(li);
      // Check if animation-name includes task-fade-in or if the class is present
      return li.classList.contains('task-adding') || style.animationName === 'task-fade-in';
    });
    // Note: animation may have already completed by the time we check, so also verify CSS keyframes exist
    const fadeInKeyframeExists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].type === CSSRule.KEYFRAMES_RULE && rules[j].name === 'task-fade-in') {
              return true;
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
      return false;
    });
    if (!fadeInKeyframeExists) {
      throw new Error('CSS @keyframes task-fade-in not found');
    }

    // 2. Verify the task-adding CSS class has correct animation property
    const addingAnimProp = await page.evaluate(() => {
      const el = document.createElement('div');
      el.className = 'task-adding';
      // Create a temporary li inside task-list to test computed style
      const taskList = document.querySelector('#task-list');
      const li = document.createElement('li');
      li.className = 'task-adding';
      taskList.appendChild(li);
      const style = getComputedStyle(li);
      const animName = style.animationName;
      taskList.removeChild(li);
      return animName;
    });
    if (addingAnimProp !== 'task-fade-in') {
      throw new Error(`Expected task-adding animation-name "task-fade-in", got "${addingAnimProp}"`);
    }

    // 3. Verify task-deleting CSS class has fade-out animation
    const fadeOutKeyframeExists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].type === CSSRule.KEYFRAMES_RULE && rules[j].name === 'task-fade-out') {
              return true;
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
      return false;
    });
    if (!fadeOutKeyframeExists) {
      throw new Error('CSS @keyframes task-fade-out not found');
    }

    const deletingAnimProp = await page.evaluate(() => {
      const taskList = document.querySelector('#task-list');
      const li = document.createElement('li');
      li.className = 'task-deleting';
      taskList.appendChild(li);
      const style = getComputedStyle(li);
      const animName = style.animationName;
      taskList.removeChild(li);
      return animName;
    });
    if (deletingAnimProp !== 'task-fade-out') {
      throw new Error(`Expected task-deleting animation-name "task-fade-out", got "${deletingAnimProp}"`);
    }

    // 4. Verify that .task-text has a CSS transition for color (completing transition)
    const taskTextTransition = await page.evaluate(() => {
      const span = document.querySelector('.task-text');
      if (!span) return '';
      return getComputedStyle(span).transition;
    });
    if (!taskTextTransition.includes('color')) {
      throw new Error(`Expected .task-text to have color transition, got "${taskTextTransition}"`);
    }

    // 5. Delete a task and verify animation triggers then task is removed
    const taskCountBefore = await page.$$eval('#task-list li', els => els.length);
    if (taskCountBefore !== 1) {
      throw new Error(`Expected 1 task before delete, got ${taskCountBefore}`);
    }

    // Set up a mutation observer to capture the task-deleting class before DOM removal
    await page.evaluate(() => {
      window.__deletingClassSeen = false;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            if (m.target.classList.contains('task-deleting')) {
              window.__deletingClassSeen = true;
            }
          }
        });
      });
      const list = document.querySelector('#task-list');
      list.querySelectorAll('li').forEach(li => {
        observer.observe(li, { attributes: true });
      });
    });

    // Click delete
    await page.click('.delete-btn');

    // Wait for animation to complete and task to be removed
    await page.waitForFunction(
      () => document.querySelectorAll('#task-list li').length === 0,
      { timeout: 2000 }
    );

    // Verify the deleting class was applied during the animation
    const deletingClassWasSeen = await page.evaluate(() => window.__deletingClassSeen);
    if (!deletingClassWasSeen) {
      throw new Error('Expected task-deleting class to be applied during delete animation');
    }

    const taskCountAfter = await page.$$eval('#task-list li', els => els.length);
    if (taskCountAfter !== 0) {
      throw new Error(`Expected 0 tasks after delete animation, got ${taskCountAfter}`);
    }

    // 6. Verify completing a task applies visual transition (color change)
    // Add a new task
    await page.type('#task-input', 'Complete me');
    await page.click('#add-btn');
    await page.waitForSelector('#task-list li');

    // Get text color before completing
    const colorBefore = await page.evaluate(() => {
      const span = document.querySelector('.task-text');
      return getComputedStyle(span).color;
    });

    // Complete the task
    await page.click('#task-list li input[type="checkbox"]');

    // Wait a moment for transition
    await new Promise(r => setTimeout(r, 350));

    const colorAfter = await page.evaluate(() => {
      const span = document.querySelector('.task-text');
      return getComputedStyle(span).color;
    });

    if (colorBefore === colorAfter) {
      throw new Error('Expected text color to change after completing task');
    }

    // 7. Verify CSS-only approach: no JS animation libraries loaded
    const noAnimLibrary = await page.evaluate(() => {
      return typeof window.gsap === 'undefined' &&
             typeof window.anime === 'undefined' &&
             typeof window.Velocity === 'undefined';
    });
    if (!noAnimLibrary) {
      throw new Error('JS animation library detected — should use CSS only');
    }

    console.log('PASS: polish-animations');
  } catch (err) {
    console.error('FAIL: polish-animations —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
