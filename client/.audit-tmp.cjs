const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5174';
const OUT_DIR = path.join(__dirname, 'screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'large-mobile', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

const ROUTES = [
  '/', '/login', '/register', '/forgot-password', '/counselor/login',
  '/threads', '/inspiration', '/calm', '/counselors',
  '/privacy', '/terms', '/guidelines', '/contact', '/crisis-resources',
  '/not-a-real-route-xyz',
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    for (const route of ROUTES) {
      consoleErrors.length = 0;
      pageErrors.length = 0;
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(300);
        const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        const fname = `${vp.name}_${route.replace(/\//g, '_') || 'home'}.png`;
        await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true });
        results.push({
          viewport: vp.name, route, ok: true,
          consoleErrors: [...consoleErrors], pageErrors: [...pageErrors],
          hasHorizontalOverflow, screenshot: fname,
        });
      } catch (e) {
        results.push({ viewport: vp.name, route, ok: false, error: e.message });
      }
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'audit-results.json'), JSON.stringify(results, null, 2));

  const problems = results.filter(r => !r.ok || r.consoleErrors.length || r.pageErrors.length || r.hasHorizontalOverflow);
  console.log(`Total checks: ${results.length}`);
  console.log(`Problems found: ${problems.length}`);
  for (const p of problems) {
    console.log(JSON.stringify(p));
  }
})();
