import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('http://localhost:5000/**', route => {
    const path = new URL(route.request().url()).pathname;
    const fixtures = {
      '/posts': { posts: [], hasMore: false },
      '/posts/category-counts': {},
      '/community/stats': { members: 0, postsShared: 0 },
    };
    return route.fulfill({ json: fixtures[path] ?? [] });
  });
});

test('skip link moves keyboard focus to main', async ({ page }) => {
  await page.goto('/login');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('mobile menu opens, contains focus, and restores focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  for (let i = 0; i < 15 && !(await toggle.evaluate(el => el === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Menu' });
  await expect(dialog).toBeVisible();
  const links = dialog.getByRole('link');
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(links.last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('login submits with Enter and exposes server errors as an alert', async ({ page }) => {
  await page.route('**/auth/login', route => route.fulfill({ status: 401, json: { message: 'Invalid credentials' } }));
  await page.goto('/login');
  await page.getByLabel('Nickname').fill('keyboard-user');
  await page.getByLabel('Password', { exact: true }).fill('incorrect-password');
  await page.getByLabel('Password', { exact: true }).press('Enter');
  await expect(page.getByRole('alert')).toHaveText('Invalid credentials');
});

for (const mode of ['mobile', 'reduced motion']) {
  test(`${mode} homepage shows welcome steps without a media player`, async ({ page }) => {
    const animationRequests = [];
    page.on('request', request => {
      if (/AnimatedIntro-[^/]+\.js/.test(request.url())) animationRequests.push(request.url());
    });
    if (mode === 'mobile') await page.setViewportSize({ width: 375, height: 812 });
    else await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'How SafeSpace works' })).toContainText('Share anonymously');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(animationRequests).toEqual([]);
  });
}

test('desktop intro animates welcome cards without playback controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const intro = page.getByRole('region', { name: 'How SafeSpace works' });
  await expect(intro.getByRole('listitem')).toHaveCount(3);
  await expect(intro.locator('video, audio, button')).toHaveCount(0);
  expect(await intro.locator('li').first().evaluate(el => getComputedStyle(el).animationName)).toBe('journey-arrive');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => intro.locator('li').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});


test('welcome actions lead into the live community and registration', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the community' }).click();
  await expect(page).toHaveURL(/#community-feed$/);
  await expect(page.locator('#community-feed')).toBeFocused();
  await page.getByRole('link', { name: 'Find your safe space' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('mobile drawer closes when navigation expands to desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('sidebar topics filter actual feed entries', async ({ page }) => {
  await page.route('**/posts/category-counts', route => route.fulfill({ json: { mental_health: 1, gratitude: 1 } }));
  await page.route('**/posts?**', route => route.fulfill({ json: {
    posts: [
      { _id: 'first', author: { _id: 'one', pseudonym: 'Reader one' }, category: 'mental_health', content: 'Making space for a difficult day.', reactions: [], createdAt: new Date().toISOString() },
      { _id: 'second', author: { _id: 'two', pseudonym: 'Reader two' }, category: 'gratitude', content: 'Grateful for a quiet morning.', reactions: [], createdAt: new Date().toISOString() },
    ], hasMore: false,
  } }));
  await page.goto('/');
  await expect(page.getByText('Grateful for a quiet morning.', { exact: true })).toBeVisible();
  await page.getByRole('complementary', { name: 'Community sidebar' }).getByRole('button', { name: /Mental Health/ }).click();
  await expect(page.getByText('Making space for a difficult day.', { exact: true })).toBeVisible();
  await expect(page.getByText('Grateful for a quiet morning.', { exact: true })).toHaveCount(0);
});


test('journaling background autoplays silently without player controls and can pause', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('.welcome-scene video');
  await expect.poll(() => video.evaluate(el => el.currentTime)).toBeGreaterThan(0.2);
  expect(await video.evaluate(el => el.muted && el.loop && el.playsInline && !el.controls)).toBe(true);
  await page.getByRole('button', { name: 'Pause background' }).click();
  await expect.poll(() => video.evaluate(el => el.paused)).toBe(true);
  await page.getByRole('button', { name: 'Resume background' }).click();
  await expect.poll(() => video.evaluate(el => el.paused)).toBe(false);
});

test('reduced motion uses only the local journaling still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const videoRequests = [];
  page.on('request', request => { if (request.url().endsWith('dream-journal.mp4')) videoRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.welcome-scene img')).toBeVisible();
  await expect(page.locator('.welcome-scene video')).toHaveCount(0);
  expect(videoRequests).toEqual([]);
});

test('failed background footage keeps the poster and navigation available', async ({ page }) => {
  await page.route('**/dream-journal.mp4', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.welcome-scene video')).toHaveCount(0);
  expect(await page.locator('.welcome-scene img').evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('link', { name: 'Find your safe space' })).toBeVisible();
});


test('home navigation overlays the video and becomes solid on scroll', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav).toHaveClass(/navbar-home/);
  await expect(nav).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await page.locator('.welcome-hero').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(0);
  await page.evaluate(() => window.scrollTo({ top: 220, behavior: 'instant' }));
  await expect(nav).toHaveClass(/navbar-scrolled/);
  await expect(nav).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(nav).not.toHaveClass(/navbar-scrolled/);
  await expect(nav).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.goto('/login');
  await expect(nav).not.toHaveClass(/navbar-home/);
  await expect(nav).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
