import { test, expect } from '@playwright/test';

// Fixtures stay inside browser tests; no live accounts or records are changed.
async function prepare(page, role = 'admin') {
  await page.addInitScript((role) => {
    if (role === 'counselor') {
      localStorage.setItem('counselor', JSON.stringify({ _id: 'preview', name: 'Preview counselor' }));
      localStorage.setItem('counselorToken', 'preview');
    } else {
      localStorage.setItem('user', JSON.stringify({ id: 'preview', pseudonym: 'Preview member', role, avatarId: 0, bio: '', createdAt: '2026-01-01' }));
      localStorage.setItem('token', 'preview');
    }
  }, role);
  await page.route('http://localhost:5000/**', route => {
    const path = new URL(route.request().url()).pathname;
    const fixtures = {
      '/posts': { posts: [], hasMore: false },
      '/threads': { threads: [], hasMore: false },
      '/auth/me/stats': { postCount: 0, replyCount: 0 },
      '/threads/preview': { _id: 'preview', author: { _id: 'other', pseudonym: 'Preview author' }, category: 'mental_health', title: 'A conversation for layout review', body: 'A longer thought can have room to breathe. This is fixture content for browser testing.', upvotes: 0, upvotedBy: [], createdAt: '2026-10-19' },
      '/counselors': [{ _id: 'preview', name: 'Preview counselor', credentials: 'Sample credentials for browser testing', specialties: ['mental_health'], verified: true, availability: 'Available', weeklySchedule: [{ dayOfWeek: 1, slots: ['10:00'] }] }],
      '/counselors/preview/availability': { slots: ['10:00', '11:00'] },
      '/counselors/me/schedule': { weeklySchedule: [] },
      '/admin/analytics': { postsByCategory: [], flaggedCount: 0, avgResolutionMs: 0 },
    };
    if (path === '/auth/profile') return route.fulfill({ json: JSON.parse(route.request().postData()) });
    return route.fulfill({ json: fixtures[path] ?? [] });
  });
}

async function checkPage(page, path) {
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const width of [1440, 768, 390, 320]) {
  test(`member screens remain readable at ${width}px`, async ({ page }) => {
    await prepare(page, 'user');
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/profile', '/my-activity', '/posts/new', '/threads/new', '/threads/preview', '/counselors/preview']) {
      await checkPage(page, path);
      if (width === 1440 && ['/profile', '/posts/new', '/counselors/preview'].includes(path)) {
        await page.screenshot({ path: `screenshots/inner-${path.replaceAll('/', '-')}.png` });
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const width of [1440, 390, 320]) {
  test(`administration and counselor workspace fit at ${width}px`, async ({ page, context }) => {
    await prepare(page);
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/admin', '/admin/posts', '/admin/reports', '/admin/counselors', '/admin/bookings', '/admin/analytics', '/admin/audit-log']) {
      await checkPage(page, path);
    }
    if (width === 1440) await page.screenshot({ path: 'screenshots/inner-admin.png' });
    const counselorPage = await context.newPage();
    await prepare(counselorPage, 'counselor');
    await counselorPage.setViewportSize({ width, height: 1000 });
    counselorPage.on('pageerror', error => errors.push(error.message));
    await checkPage(counselorPage, '/counselor/bookings');
    await expect(counselorPage.getByRole('heading', { name: 'My weekly schedule' })).toBeVisible();
    expect(errors).toEqual([]);
    await counselorPage.close();
  });
}

test('profile edits save without losing the settings context', async ({ page }) => {
  await prepare(page, 'user');
  await page.goto('/profile');
  await page.getByRole('textbox', { name: 'About me' }).fill('Here to listen.');
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Save profile', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'About me' })).toHaveValue('Here to listen.');
});

test('booking retains its date, time, and confirmation steps', async ({ page }) => {
  await prepare(page, 'user');
  await page.goto('/counselors/preview');
  await page.locator('.calendar-day:not([disabled])').first().click();
  await expect(page.getByText(/Step 2 of 3/)).toBeVisible();
  await page.getByRole('button', { name: '10:00', exact: true }).click();
  await expect(page.getByText(/Step 3 of 3/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByText(/Step 2 of 3/)).toBeVisible();
});

test('information navigation links to readable sections', async ({ page }) => {
  await page.goto('/privacy');
  const contents = page.getByRole('navigation', { name: 'On this page' });
  const link = contents.getByRole('link').first();
  await link.click();
  await expect(page).toHaveURL(/#section-/);
});

test('failed thread and audit requests expose retry actions', async ({ page }) => {
  await prepare(page);
  await page.route('http://localhost:5000/threads/preview', route => route.fulfill({ status: 503, json: {} }));
  await page.goto('/threads/preview');
  await expect(page.getByText('Unable to load this conversation. Please try again.')).toBeVisible();
  await page.route('**/admin/actions', route => route.fulfill({ status: 503, json: {} }));
  await page.goto('/admin/audit-log');
  await expect(page.getByRole('alert')).toContainText('Unable to load the audit log');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
