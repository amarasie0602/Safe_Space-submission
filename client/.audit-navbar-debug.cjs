const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    const tabs = document.querySelector('.navbar-tabs');
    const cs = getComputedStyle(tabs);
    const links = [...tabs.querySelectorAll('a')].map((a) => {
      const r = a.getBoundingClientRect();
      const acs = getComputedStyle(a);
      return { text: a.textContent, x: r.x, w: r.width, display: acs.display, width: acs.width };
    });
    return { containerDisplay: cs.display, containerWidth: cs.width, links };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
