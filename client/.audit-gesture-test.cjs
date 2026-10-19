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
  // Simulate a real visitor clicking something elsewhere on the page shortly
  // after landing — e.g. a nav link area, not the player itself.
  await page.mouse.click(50, 50);
  await page.waitForTimeout(2800);
  const info = await page.evaluate(() => {
    const el = document.querySelector('.intro-story');
    const h3 = el.querySelector('h3');
    const cs = h3 ? getComputedStyle(h3.parentElement) : null;
    return { isStatic: el.classList.contains('intro-story-static'), opacity: cs?.opacity, text: h3?.textContent };
  });
  console.log('After early click elsewhere, 2.8s later:', JSON.stringify(info));
  await page.waitForTimeout(1500);
  const info2 = await page.evaluate(() => {
    const el = document.querySelector('.intro-story');
    const h3 = el.querySelector('h3');
    return { isStatic: el.classList.contains('intro-story-static'), text: h3?.textContent };
  });
  console.log('1.5s further (beat should have advanced if truly playing):', JSON.stringify(info2));
  await browser.close();
})();
