import { test, expect } from '@playwright/test';

const selectors = {
  username: 'input[name="usernameOrEmail"]',
  password: 'input[name="password"]',
};

async function loginAdmin(page) {
  const username = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;
  if (!username || !pass) throw new Error('Missing ADMIN_USERNAME / ADMIN_PASSWORD');

  await page.goto('/');

  await page.locator(selectors.username).fill(username);
  await page.locator(selectors.password).fill(pass);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByText('Sentry Dashboard')).toBeVisible();
  await expect(page.getByText('Admin', { exact: true })).toBeVisible();
}

async function signOut(page) {
  await page.getByText('Admin', { exact: true }).click();
  await page.getByText('Sign out', { exact: true }).click();

  await expect(page.locator(selectors.username)).toBeVisible();
  await expect(page.locator(selectors.password)).toBeVisible();
}

test.describe('Admin authentication & session security', () => {
  test('Admin can log in successfully', async ({ page }) => {
    await loginAdmin(page);
  });

  test('Authenticated admin can access /assets via direct URL', async ({ page }) => {
    await loginAdmin(page);

    await page.goto('/assets');

    await expect(page).toHaveURL(/\/assets\/?$/);
    await expect(page).not.toHaveURL(/\/auth\/?$/);
    await expect(page.getByText('Admin', { exact: true })).toBeVisible();
  });

  test('Invalid password is rejected with a safe error', async ({ page }) => {
    const username = process.env.ADMIN_USERNAME;
    if (!username) throw new Error('Missing ADMIN_USERNAME');

    await page.goto('/');

    await page.locator(selectors.username).fill(username);
    await page.locator(selectors.password).fill('wrong-password');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Failed to login')).toBeVisible();
    await expect(page.getByText('Invalid username/email or password')).toBeVisible();

    await expect(page.getByText(/user not found|email does not exist/i)).toHaveCount(0);
  });

  test('Empty submit shows validation on both fields', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Username or email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('Sign out invalidates the session (direct URL is blocked)', async ({ page }) => {
    await loginAdmin(page);
    await signOut(page);

    await page.goto('/assets');

    // App redirects unauthenticated users to /auth
    await expect(page).toHaveURL(/\/auth\/?$/);
    await expect(page.locator(selectors.username)).toBeVisible();
  });

  test('Clearing cookies/storage forces re-authentication', async ({ page, context }) => {
    await loginAdmin(page);

    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/assets');

    await expect(page).toHaveURL(/\/auth\/?$/);
    await expect(page.locator(selectors.username)).toBeVisible();
    await expect(page.locator(selectors.password)).toBeVisible();
  });
});



