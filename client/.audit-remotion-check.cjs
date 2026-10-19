const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const el = await page.$('.intro-story');
  const box = await el.boundingBox();
  await page.screenshot({ path: 'remotion-check-1.png', clip: box });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'remotion-check-2.png', clip: box });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'remotion-check-3.png', clip: box });
  console.log('Console/page errors:', JSON.stringify(errors));
  await browser.close();
})();
