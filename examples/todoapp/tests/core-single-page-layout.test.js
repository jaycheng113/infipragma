const puppeteer = require('puppeteer');

const APP_URL = 'http://localhost:8080';

(async () => {
  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    // 1. Semantic HTML structure: header, main, footer exist
    const hasHeader = await page.$('header') !== null;
    const hasMain = await page.$('main') !== null;
    const hasFooter = await page.$('footer') !== null;
    if (!hasHeader || !hasMain || !hasFooter) {
      throw new Error('Page must have semantic header, main, and footer elements');
    }

    // 2. Centered content with max-width container
    const containerStyles = await page.$eval('.app-container', el => {
      const cs = window.getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        width: el.getBoundingClientRect().width,
        viewportWidth: window.innerWidth
      };
    });
    if (containerStyles.maxWidth === 'none') {
      throw new Error('App container must have a max-width set');
    }

    // 3. Card styling with padding and shadow
    const cardStyles = await page.$eval('.app-container', el => {
      const cs = window.getComputedStyle(el);
      return {
        padding: parseFloat(cs.paddingTop),
        boxShadow: cs.boxShadow,
        borderRadius: cs.borderRadius
      };
    });
    if (cardStyles.padding <= 0) {
      throw new Error('App container must have padding');
    }
    if (cardStyles.boxShadow === 'none') {
      throw new Error('App container must have a box-shadow');
    }

    // 4. App title/heading exists
    const heading = await page.$eval('header h1', el => el.textContent.trim());
    if (!heading || heading.length === 0) {
      throw new Error('App must have a heading in the header');
    }

    // 5. Content is visually centered (container narrower than viewport on wide screens)
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    const layout = await page.$eval('.app-container', el => {
      const rect = el.getBoundingClientRect();
      return {
        containerWidth: rect.width,
        viewportWidth: window.innerWidth,
        leftOffset: rect.left,
        rightSpace: window.innerWidth - rect.right
      };
    });
    if (layout.containerWidth >= layout.viewportWidth) {
      throw new Error('Container should be narrower than viewport on wide screens');
    }
    // Check roughly centered (left and right margins within 10px of each other)
    if (Math.abs(layout.leftOffset - layout.rightSpace) > 10) {
      throw new Error('Container should be horizontally centered');
    }

    console.log('PASS: core-single-page-layout');
  } catch (err) {
    console.error('FAIL: core-single-page-layout —', err.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    process.exit(exitCode);
  }
})();
