const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => consoleMsgs.push(m.type() + ': ' + m.text()));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const el = await page.$('.intro-story');
  const box = await el.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => {
    const h3 = document.querySelector('.intro-story h3');
    const cs = getComputedStyle(h3.parentElement);
    return { text: h3.textContent, opacity: cs.opacity };
  });
  console.log('after clicking player directly:', JSON.stringify(after));
  console.log('console messages mentioning play/pause/autoplay:');
  console.log(consoleMsgs.filter(m => /play|pause|autoplay|audio/i.test(m)).join('\n'));
  await browser.close();
})();
