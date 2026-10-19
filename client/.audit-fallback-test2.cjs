const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  for (const t of [500, 1500, 3000, 4000]) {
    await page.waitForTimeout(t === 500 ? 500 : 1000);
    const info = await page.evaluate(() => {
      const el = document.querySelector('.intro-story');
      const h3 = el.querySelector('h3');
      const cs = h3 ? getComputedStyle(h3.parentElement) : null;
      return { isStatic: el.classList.contains('intro-story-static'), opacity: cs?.opacity, text: h3?.textContent };
    });
    console.log(`t~${t}ms`, JSON.stringify(info));
  }
  await browser.close();
})();
