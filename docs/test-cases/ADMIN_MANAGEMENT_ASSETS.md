# Admin — Management Assets (UI + CRUD + Security) Test Cases

## Scope
This document defines manual test cases for the **Management Assets** page when accessed by an **Admin** user.

Covered areas:
- UI rendering and layout validation
- CRUD operations (Create, Read, Update, Delete)
- Pagination, sorting, filtering, and search
- Export functionality
- Refresh behavior
- Security validation (XSS, data integrity)

---

## Roles & Test Data
- Role: **Admin**
- Authentication: via valid Admin credentials
- Test data: dynamically created assets during test execution
- Environment: local app running at `http://localhost:5480`
- Browsers: Chromium, WebKit

---

## General Preconditions
- Application is running and reachable.
- Admin user is authenticated.
- Management Assets page is accessible from navigation.

---

### AM-ASSET-001 — Management Assets page loads correctly  
**Type:** UI  
**Preconditions:** Admin is logged in  
**Steps:**
1. Navigate to `/managementAssets`.
2. Observe the page layout.
**Expected:**
- Page title **Management Assets** is visible.
- Assets table is rendered.
- Columns **Name**, **Type**, **Created at** are visible.
- Action icons (View / Edit / Delete) are visible per row.
- **Add record** button is visible.
- No blocking console errors.

---

### AM-ASSET-002 — Assets list is paginated correctly  
**Type:** Functional / UI  
**Steps:**
1. Navigate to Management Assets.
2. Observe pagination controls.
3. Navigate between pages.
**Expected:**
- Pagination controls are visible.
- Page number updates correctly.
- Asset records change according to selected page.
- No duplicate or missing records.

---

### AM-ASSET-003 — Records per page selector works correctly  
**Type:** Functional  
**Steps:**
1. Change **Records per page** value (e.g., 10 → 50).
2. Observe the table content.
**Expected:**
- Number of displayed records matches selected value.
- Pagination recalculates correctly.

---


### AM-ASSET-004 — Sorting by Created at works  
**Type:** Functional  
**Steps:**
1. Click the sort arrow on **Created at** column.
2. Toggle sorting direction.
**Expected:**
- Records are sorted chronologically (oldest → newest).
- Sorting reverses correctly.

---

### AM-ASSET-005 — Sorting by Type works  
**Type:** Functional  
**Steps:**
1. Click the sort arrow on **Type** column.
2. Toggle sorting direction.
**Expected:**
- Records are sorted alphabetically ascending.
- Records are sorted alphabetically descending on second click.

---

### AM-ASSET-006 — Search filters assets correctly  
**Type:** Functional  
**Steps:**
1. Enter a keyword in the search field.
2. Observe table results.
**Expected:**
- Only matching assets are displayed.
- Non-matching assets are excluded.
- Clearing search restores full list.

---

### AM-ASSET-007 — Filters panel applies filters correctly  
**Type:** Functional  
**Steps:**
1. Open **Filters**.
2. Apply one or more filter conditions.
**Expected:**
- Asset list updates according to filter criteria.
- Active filters are visually indicated.
- Clearing filters restores default view.

---

### AM-ASSET-008 — Add new asset with valid data  
**Type:** Functional  
**Steps:**
1. Click **Add record**.
2. Enter valid Name.
3. Select valid Type.
4. Set Created at date.
5. Submit form.
**Expected:**
- Asset is created successfully.
- New asset appears in the list.
- Data is persisted after page reload.

---

### AM-ASSET-009 — Required fields are validated when creating asset  
**Type:** Validation / UI  
**Steps:**
1. Open **Add record** modal.
2. Submit form with empty required fields.
**Expected:**
- Validation messages are displayed.
- Asset is not created.

---

### AM-ASSET-010 — Edit existing asset  
**Type:** Functional  
**Steps:**
1. Click **Edit** on an existing asset.
2. Modify Name and/or Type.
3. Save changes.
**Expected:**
- Changes are saved successfully.
- Updated values are visible in the table.
- Changes persist after refresh.

---

### AM-ASSET-011 — Cancel edit does not modify asset  
**Type:** Functional  
**Steps:**
1. Open Edit modal.
2. Modify fields.
3. Cancel edit.
**Expected:**
- No changes are saved.
- Original asset data remains unchanged.

---

### AM-ASSET-012 — Delete single asset  
**Type:** Functional  
**Steps:**
1. Click **Delete** on an asset.
2. Confirm deletion.
**Expected:**
- Asset is removed from the list.
- Asset does not reappear after refresh.

---

### AM-ASSET-013 — Bulk delete multiple assets  
**Type:** Functional  
**Steps:**
1. Select multiple assets using checkboxes.
2. Click **Delete selected**.
3. Confirm deletion.
**Expected:**
- All selected assets are deleted.
- Unselected assets remain intact.

---

### AM-ASSET-014 — Bulk delete across pagination  
**Type:** Functional  
**Steps:**
1. Select assets on page 1.
2. Navigate to page 2.
3. Select additional assets.
4. Delete selected assets.
**Expected:**
- Assets from all pages are deleted.
- No partial deletion occurs.

---

### AM-ASSET-015 — Refresh records updates asset list  
**Type:** Functional  
**Steps:**
1. Click **Refresh** icon.
**Expected:**
- Asset list is reloaded.
- Newly added or removed assets are reflected.
- No duplicate records appear.

---

### AM-ASSET-016 — Export assets as CSV  
**Type:** Functional  
**Steps:**
1. Select one or more assets.
2. Choose **Export → CSV**.
**Expected:**
- CSV file is downloaded.
- File contains correct asset data.

---

### AM-ASSET-017 — Export assets as XLSX  
**Type:** Functional  
**Steps:**
1. Select one or more assets.
2. Choose **Export → XLSX**.
**Expected:**
- XLSX file is downloaded.
- File opens successfully and contains correct data.

---

### AM-ASSET-018 — Export assets as JSON  
**Type:** Functional  
**Steps:**
1. Select one or more assets.
2. Choose **Export → JSON**.
**Expected:**
- JSON file is downloaded.
- File structure and data are valid.

---

### AM-ASSET-019 — XSS protection on asset creation  
**Type:** Security  
**Steps:**
1. Create asset with script payload in Name field.
**Expected:**
- Script is not executed.
- Input is sanitized or rejected.
- No XSS occurs.

---

### AM-ASSET-020 — XSS protection on asset editing  
**Type:** Security  
**Steps:**
1. Edit existing asset.
2. Inject script payload into editable fields.
**Expected:**
- Script is not executed.
- Stored data is safe and rendered as plain text.
