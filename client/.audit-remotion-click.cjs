const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  console.log('before click:', await sample(page));
  // Simulate a real user interaction, as any normal visitor would do within
  // the first second or two of landing on the page.
  await page.mouse.click(50, 50);
  await page.waitForTimeout(1000);
  console.log('1s after click:', await sample(page));
  await page.waitForTimeout(1000);
  console.log('2s after click:', await sample(page));

  async function sample(p) {
    return p.evaluate(() => {
      const h3 = document.querySelector('.intro-story h3');
      if (!h3) return 'no h3';
      const cs = getComputedStyle(h3.parentElement);
      return { text: h3.textContent, opacity: cs.opacity };
    });
  }
  await browser.close();
})();
