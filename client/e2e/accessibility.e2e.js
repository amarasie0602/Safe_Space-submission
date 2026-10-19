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
  expect(await intro.locator('li').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
