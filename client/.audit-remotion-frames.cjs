const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(500);
    const sample = await page.evaluate(() => {
      const h3 = document.querySelector('.intro-story h3');
      if (!h3) return 'no h3';
      const parent = h3.parentElement;
      const cs = getComputedStyle(parent);
      return { text: h3.textContent, opacity: cs.opacity, translate: cs.translate };
    });
    console.log(`t=${(i + 1) * 500}ms`, JSON.stringify(sample));
  }
  await browser.close();
})();
