import { expect } from '@playwright/test';

export class Sidebar {
  constructor(page) {
    this.page = page;
  }

  async assertRole(role) {
    await expect(this.page.getByText(role, { exact: true })).toBeVisible();
  }

  async assertManagementVisible(shouldBeVisible) {
    const management = this.page.getByText('Management', { exact: true });
    if (shouldBeVisible) {
      await expect(management).toBeVisible();
    } else {
      await expect(management).toHaveCount(0);
    }
  }

  async assertNotForbidden() {
    await expect(this.page.getByText(/cannot load records|do not have access/i)).toHaveCount(0);
  }

  async signOut(roleText) {
    await this.page.getByText(roleText, { exact: true }).click();
    await this.page.getByText('Sign out', { exact: true }).click();
  }
}
