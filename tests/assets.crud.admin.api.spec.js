import { test, expect, request, chromium } from '@playwright/test';
import fs from 'fs';

test.describe.serial('Admin | Assets CRUD (API)', () => {
  const baseURL = process.env.PW_BASE_URL || 'http://localhost:5480';
  const storagePath = 'test-results/admin.storage.json';

  const TYPE_ID_HYDROPOWER = 'ca0c7923-4e76-43e8-9a0a-06d888d5f44d';

  let api;
  let assetId;
  let assetName;
  let createdAt;

  function readJwtFromStorageState(path) {
    const raw = fs.readFileSync(path, 'utf-8');
    const state = JSON.parse(raw);
    const cookie = (state.cookies || []).find((c) => c.name === 'jwtToken');
    return cookie?.value || null;
  }

  async function call(action, input) {
    const res = await api.post(`/api/managementAssets?action=${encodeURIComponent(action)}`, {
      data: { action, input },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      
    }
    return { res, text, json };
  }

  function extractRecords(body) {
    return body?.result?.records || body?.records || body?.data?.records || [];
  }

  async function getRecordsPage(page, pageSize = 50) {
    const { res, text, json } = await call('table_getRecords', {
      page,
      search: '',
      pageSize,
    });

    expect(res.ok(), `table_getRecords failed: ${res.status()} | ${text}`).toBeTruthy();
    return extractRecords(json);
  }

  async function findByNameExact(name, { maxPages = 10, pageSize = 50, retries = 10, delayMs = 200 } = {}) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      for (let p = 1; p <= maxPages; p++) {
        const records = await getRecordsPage(p, pageSize);
        const found = records.find((r) => String(r?.name || '').trim() === name);
        if (found) return found;
        if (!records.length) break;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return null;
  }

  async function findById(id, { maxPages = 10, pageSize = 50 } = {}) {
    for (let p = 1; p <= maxPages; p++) {
      const records = await getRecordsPage(p, pageSize);
      const found = records.find((r) => String(r?.id) === String(id));
      if (found) return found;
      if (!records.length) break;
    }
    return null;
  }

  test.beforeAll(async () => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    expect(username, 'ADMIN_USERNAME is missing').toBeTruthy();
    expect(password, 'ADMIN_PASSWORD is missing').toBeTruthy();

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${baseURL}/auth`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Admin', { exact: true })).toBeVisible({ timeout: 15000 });

    await context.storageState({ path: storagePath });
    await browser.close();

    const token = readJwtFromStorageState(storagePath);
    expect(token, 'jwtToken cookie not found after login').toBeTruthy();

    api = await request.newContext({
      baseURL,
      storageState: storagePath,
      extraHTTPHeaders: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    if (api) await api.dispose();
  });

  test('Create', async () => {
    assetName = `asset-${Date.now()}`;
    createdAt = new Date().toISOString();

    const { res, text } = await call('table_createRecord', {
      values: {
        name: assetName,
        created_at: createdAt,
        type_id: TYPE_ID_HYDROPOWER,
      },
    });

    expect(res.ok(), `Create failed: ${res.status()} | ${text}`).toBeTruthy();

    const created = await findByNameExact(assetName);
    expect(created, 'Created asset not found in table_getRecords (search disabled)').toBeTruthy();

    assetId = created.id;
    expect(assetId, 'Created asset has no id').toBeTruthy();
  });

  test('Read', async () => {
    const found = await findById(assetId);
    expect(found, 'Asset not found by id in table_getRecords').toBeTruthy();
    expect(String(found.id)).toBe(String(assetId));
    expect(String(found.name).trim()).toBe(assetName);
  });

  test('Update', async () => {
    const updatedName = `${assetName}-updated`;

    const { res, text } = await call('table_updateRecord', {
      primaryKeyValue: assetId,
      values: {
        name: updatedName,
        created_at: createdAt,
        type_id: TYPE_ID_HYDROPOWER,
      },
    });

    expect(res.ok(), `Update failed: ${res.status()} | ${text}`).toBeTruthy();

    const updated = await findById(assetId);
    expect(updated, 'Updated asset not found by id after update').toBeTruthy();
    expect(String(updated.name).trim()).toBe(updatedName);

    assetName = updatedName;
  });

  test('Delete', async () => {
    const { res, text } = await call('table_deleteRecord', {
      primaryKeyValues: [assetId],
    });
  
    expect(res.ok(), `Delete failed: ${res.status()} | ${text}`).toBeTruthy();
  
    const stillThere = await findById(assetId);
    expect(stillThere, 'Asset still exists after delete').toBeNull();
  });
  
});







