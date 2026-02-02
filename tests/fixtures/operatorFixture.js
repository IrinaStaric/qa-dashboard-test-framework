import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { Sidebar } from '../../pages/Sidebar';

const env = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
};

export const test = base.extend({
  operatorPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    const sidebar = new Sidebar(page);

    await login.goto();
    await login.login(env('OPERATOR_USERNAME'), env('OPERATOR_PASSWORD'));
    await sidebar.assertRole('Operator');

    await use({ page, login, sidebar });
  },
});

export { expect } from '@playwright/test';

