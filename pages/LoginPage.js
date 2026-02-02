import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole('textbox', { name: 'Username or Email' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
  }

  async goto() {
    await this.page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async submitEmpty() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async assertValidationErrors() {
    await expect(this.page.getByText(/required/i)).toBeVisible();
  }

  async assertLoginFailedGeneric() {
    await expect(this.page.getByText(/wrong email or password|invalid/i)).toBeVisible();
  }
}





