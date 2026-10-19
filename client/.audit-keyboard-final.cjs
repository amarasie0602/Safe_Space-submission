const { chromium } = require('@playwright/test');
const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ' - ' + detail : ''}`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  const BASE = 'http://localhost:5174';

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  let found = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    if (active === 'Open menu') { found = true; break; }
  }
  record('Tab order reaches mobile menu toggle', found);

  if (found) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const drawerOpen = await page.isVisible('#navbar-mobile-panel');
    record('Enter key opens mobile drawer', drawerOpen);
    if (drawerOpen) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      const drawerClosed = !(await page.isVisible('#navbar-mobile-panel'));
      record('Escape closes mobile drawer', drawerClosed);
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + '/threads', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outlineVisible = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement);
    return cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px';
  });
  record('Focused element shows a visible outline', outlineVisible);

  await browser.close();
  console.log(`\n${results.filter(r => r.pass).length}/${results.length} passed`);
})();
