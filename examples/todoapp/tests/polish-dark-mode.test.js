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

    // 1. Theme toggle button exists
    const toggleBtn = await page.$('#theme-toggle');
    if (!toggleBtn) throw new Error('Theme toggle button not found');

    // 2. Default theme is light (no saved pref, no prefers-color-scheme override)
    const defaultTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    if (defaultTheme !== 'light') {
      throw new Error(`Expected default theme "light", got "${defaultTheme}"`);
    }

    // 3. Toggle icon should be moon (light mode)
    const lightIcon = await page.$eval('#theme-toggle', el => el.textContent);
    if (!lightIcon.includes('\uD83C\uDF19')) {
      throw new Error(`Expected moon icon in light mode, got "${lightIcon}"`);
    }

    // 4. Light mode has correct background color
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    if (lightBg !== 'rgb(245, 245, 245)') {
      throw new Error(`Expected light bg rgb(245, 245, 245), got "${lightBg}"`);
    }

    // 5. Click toggle to switch to dark mode
    await page.click('#theme-toggle');

    const darkTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    if (darkTheme !== 'dark') {
      throw new Error(`Expected theme "dark" after toggle, got "${darkTheme}"`);
    }

    // 6. Dark mode icon should be sun
    const darkIcon = await page.$eval('#theme-toggle', el => el.textContent);
    if (!darkIcon.includes('\u2600')) {
      throw new Error(`Expected sun icon in dark mode, got "${darkIcon}"`);
    }

    // 7. Dark mode has correct background color
    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    if (darkBg !== 'rgb(26, 26, 46)') {
      throw new Error(`Expected dark bg rgb(26, 26, 46), got "${darkBg}"`);
    }

    // 8. Theme preference persists in localStorage
    const savedTheme = await page.evaluate(() =>
      localStorage.getItem('todoapp-theme')
    );
    if (savedTheme !== 'dark') {
      throw new Error(`Expected localStorage theme "dark", got "${savedTheme}"`);
    }

    // 9. Theme persists across page reload
    await page.reload({ waitUntil: 'domcontentloaded' });
    const reloadedTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    if (reloadedTheme !== 'dark') {
      throw new Error(`Expected theme "dark" after reload, got "${reloadedTheme}"`);
    }

    // 10. Toggle back to light
    await page.click('#theme-toggle');
    const backToLight = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    if (backToLight !== 'light') {
      throw new Error(`Expected theme "light" after second toggle, got "${backToLight}"`);
    }

    // 11. CSS custom properties are defined (check card bg changes with theme)
    const lightCardBg = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.app-container')).backgroundColor
    );
    if (lightCardBg !== 'rgb(255, 255, 255)') {
      throw new Error(`Expected light card bg rgb(255, 255, 255), got "${lightCardBg}"`);
    }

    // Switch to dark and verify card bg changes
    await page.click('#theme-toggle');
    const darkCardBg = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.app-container')).backgroundColor
    );
    if (darkCardBg === 'rgb(255, 255, 255)') {
      throw new Error('Card background did not change in dark mode');
    }

    // 12. Respects prefers-color-scheme when no saved preference
    await page.evaluate(() => localStorage.removeItem('todoapp-theme'));
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const systemDarkTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    if (systemDarkTheme !== 'dark') {
      throw new Error(`Expected system dark theme, got "${systemDarkTheme}"`);
    }

    console.log('PASS: polish-dark-mode');
  } catch (err) {
    console.error('FAIL: polish-dark-mode —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
