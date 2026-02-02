import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Sidebar } from '../pages/Sidebar';
import { ManagementPage } from '../pages/ManagementPage';

const env = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
};

const OPERATOR = {
  username: () => env('OPERATOR_USERNAME'),
  password: () => env('OPERATOR_PASSWORD'),
};

const ROUTES = {
  allowed: [
    '/assets',
    '/devices',
    '/vulnerabilities',
    '/asset-dashboard',
    '/devices-dashboard',
    '/vulnerabilities-dashboard',
  ],
  restricted: [
    { url: '/managementAssets', title: 'Management Assets' },
    { url: '/managementDevices', title: 'Management Devices' },
    { url: '/managementVulnerabilities', title: 'Management Vulnerabilities' },
  ],
};

test.describe('Operator | Auth + RBAC', () => {
  test('Log in succeeds and Management navigation is hidden', async ({ page }) => {
    const login = new LoginPage(page);
    const sidebar = new Sidebar(page);

    await login.goto();
    await login.login(OPERATOR.username(), OPERATOR.password());

    await sidebar.assertRole('Operator');
    await sidebar.assertManagementVisible(false);
  });

  test('Return-to redirect: user is returned to requested page after Log in', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('/assets');
    await expect(page).toHaveURL(/\/auth\/?$/);

    await login.login(OPERATOR.username(), OPERATOR.password());

    await expect(page, 'User should not remain on /auth after Log in').not.toHaveURL(/\/auth\/?$/);
    await expect(page).toHaveURL(/\/assets\/?$/);
  });

  test('Direct URL: Operator can open allowed pages', async ({ page }) => {
    const login = new LoginPage(page);
    const sidebar = new Sidebar(page);

    await login.goto();
    await login.login(OPERATOR.username(), OPERATOR.password());
    await sidebar.assertRole('Operator');

    for (const url of ROUTES.allowed) {
      await test.step(`Open allowed route: ${url}`, async () => {
        await page.goto(url);
        await expect(page, `Should not be redirected to /auth for: ${url}`).not.toHaveURL(/\/auth\/?$/);
        await sidebar.assertNotForbidden();
      });
    }
  });

  test('RBAC (FAIL): Operator must not access Management pages via direct URL (no UI leak)', async ({ page }) => {
    const login = new LoginPage(page);
    const sidebar = new Sidebar(page);
    const management = new ManagementPage(page);

    await login.goto();
    await login.login(OPERATOR.username(), OPERATOR.password());

    await sidebar.assertRole('Operator');
    await sidebar.assertManagementVisible(false);

    for (const { url, title } of ROUTES.restricted) {
      await test.step(`Restricted route should be blocked: ${url}`, async () => {
        await page.goto(url);

        // Operator must never see Management header (even for a moment)
        await management.assertNoManagementHeaderVisible();

        // Valid outcomes: redirect to /auth OR access denied / forbidden UI
        await login.assertOnAuthOrForbidden();
      });
    }
  });

  test('Back button after sign out does not reveal protected content', async ({ page }) => {
    const login = new LoginPage(page);
    const sidebar = new Sidebar(page);

    await login.goto();
    await login.login(OPERATOR.username(), OPERATOR.password());
    await sidebar.assertRole('Operator');

    await page.goto('/assets');
    await expect(page).toHaveURL(/\/assets\/?$/);

    await sidebar.signOut('Operator');

    await page.goBack();

    await expect(page, 'After sign out, going back must not restore protected content').toHaveURL(/\/auth\/?$/);
  });

  test('Invalid password is rejected with generic error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(OPERATOR.username(), 'wrong-password');

    await login.assertLoginFailedGeneric();
  });

  test('Empty submit is blocked by validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.submitEmpty();

    await login.assertValidationErrors();
  });
  
});



