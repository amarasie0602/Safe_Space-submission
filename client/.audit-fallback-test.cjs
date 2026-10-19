const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  // No interaction at all for 3 seconds — should trigger the stall fallback.
  await page.waitForTimeout(3200);
  const info = await page.evaluate(() => {
    const el = document.querySelector('.intro-story');
    return {
      isStatic: el.classList.contains('intro-story-static'),
      text: el.innerText.slice(0, 100),
    };
  });
  console.log('No-interaction result:', JSON.stringify(info));
  await browser.close();
})();
