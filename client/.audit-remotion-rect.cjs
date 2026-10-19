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
    const introStory = document.querySelector('.intro-story');
    const player = document.querySelector('.intro-story > div');
    return {
      h3Rect: h3 ? h3.getBoundingClientRect() : null,
      introStoryRect: introStory ? introStory.getBoundingClientRect() : null,
      playerHTML: player ? player.outerHTML.slice(0, 300) : null,
      playerChildCount: player ? player.children.length : null,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
