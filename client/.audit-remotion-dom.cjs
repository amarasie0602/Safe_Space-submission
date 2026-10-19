const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const h3 = document.querySelector('.intro-story h3');
    if (!h3) return 'no h3 found';
    const cs = getComputedStyle(h3);
    const parent = h3.closest('[style]');
    const parentCs = parent ? getComputedStyle(parent) : null;
    return {
      text: h3.textContent,
      h3_color: cs.color,
      h3_fontSize: cs.fontSize,
      parent_opacity: parentCs?.opacity,
      parent_translate: parentCs?.translate,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
