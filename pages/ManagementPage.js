import { expect } from '@playwright/test';

export class ManagementPage {
  constructor(page) {
    this.page = page;

    // Shared header used across all Management pages
    this.headerTitle = page.locator('div.page-module__headerTitle___f7Dpt');
  }

  async assertNoManagementHeaderVisible() {
    const visibleTitle = (await this.headerTitle.first().textContent().catch(() => ''))?.trim();

    // Any Management header visible for Operator is a UI security-leak
    await expect(
      this.page.getByText(/Management (Assets|Devices|Vulnerabilities)/i),
      `RBAC UI leak: visible header "${visibleTitle || 'unknown'}"`
    ).toHaveCount(0);
  }

  async assertNoHeaderLeak() {
    await this.assertNoManagementHeaderVisible();
  }
}

