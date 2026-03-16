const puppeteer = require('puppeteer');

const APP_URL = 'http://localhost:8080';

(async () => {
  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // 1. Viewport meta tag exists
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    const viewportMeta = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
    if (!viewportMeta || !viewportMeta.includes('width=device-width')) {
      throw new Error('Viewport meta tag must include width=device-width');
    }

    // 2. Fluid widths — container uses relative units (max-width set, width adapts)
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    const desktopWidth = await page.$eval('.app-container', el => el.getBoundingClientRect().width);

    await page.setViewport({ width: 400, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    const mobileWidth = await page.$eval('.app-container', el => el.getBoundingClientRect().width);

    if (mobileWidth >= desktopWidth) {
      throw new Error('Container must be narrower on mobile than desktop (fluid width)');
    }

    // 3. Media queries — on small screens, styles adapt (e.g. reduced padding, adjusted layout)
    await page.setViewport({ width: 375, height: 667 }); // iPhone-like
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    // Add a task so we can test interactive elements
    await page.type('#task-input', 'Responsive test task');
    await page.click('#add-btn');

    // 4. Touch-friendly tap targets — all interactive elements >= 44px height
    const tapTargets = await page.evaluate(() => {
      const elements = [
        document.querySelector('#add-btn'),
        document.querySelector('#task-input'),
        ...document.querySelectorAll('.filter-btn'),
        ...document.querySelectorAll('.delete-btn'),
        ...document.querySelectorAll('input[type="checkbox"]')
      ].filter(Boolean);

      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: el.className,
          height: rect.height,
          width: rect.width
        };
      });
    });

    const tooSmall = tapTargets.filter(t => t.height < 44 && t.width < 44);
    if (tooSmall.length > 0) {
      const details = tooSmall.map(t => `${t.tag}.${t.className}: ${t.width}x${t.height}`).join(', ');
      throw new Error(`Touch targets must be at least 44px in one dimension: ${details}`);
    }

    // 5. Layout remains usable on mobile — input and buttons are visible and not overflowing
    const containerOverflow = await page.evaluate(() => {
      const container = document.querySelector('.app-container');
      const rect = container.getBoundingClientRect();
      return {
        right: rect.right,
        viewportWidth: window.innerWidth,
        overflows: rect.right > window.innerWidth + 1
      };
    });

    if (containerOverflow.overflows) {
      throw new Error('Container must not overflow the viewport on mobile');
    }

    // 6. Very small screen (360px) — layout still works
    await page.setViewport({ width: 360, height: 640 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    const smallScreenOk = await page.evaluate(() => {
      const container = document.querySelector('.app-container');
      const rect = container.getBoundingClientRect();
      return rect.right <= window.innerWidth + 1;
    });

    if (!smallScreenOk) {
      throw new Error('Layout must not overflow on 360px wide screens');
    }

    console.log('PASS: enhanced-responsive-design');
  } catch (err) {
    console.error('FAIL: enhanced-responsive-design —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
