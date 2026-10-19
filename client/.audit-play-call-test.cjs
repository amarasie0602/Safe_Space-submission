const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  page.on('console', (m) => console.log('[console]', m.text()));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.mouse.click(50, 50);
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    // Reach into React internals isn't possible, but we can at least see
    // if ANY player instance in the DOM reports isPlaying via a global.
    return document.querySelectorAll('.intro-story').length;
  });
  console.log('intro-story elements found:', info);
  await browser.close();
})();
