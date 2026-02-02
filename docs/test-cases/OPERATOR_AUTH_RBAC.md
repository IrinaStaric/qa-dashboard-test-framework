# Operator — Authentication & RBAC (UI + Security) Test Cases

## Scope
This document defines manual test cases for:
- Authentication flows for Operator user
- Session handling and access control expectations
- RBAC enforcement (navigation + direct URL access)
- UI security leakage (restricted content visible to Operator)

## Roles & Test Data
- Operator credentials: use values provided in the documentation.
- Environment: local app running at `http://localhost:5480`
- Browsers: Chromium, WebKit.

## General Preconditions
- App is running and reachable.
- Operator user exists and is active.

---

## Test Cases

### OP-AUTH-001 — Login page renders required controls  
**Type:** Functional / UI  
**Preconditions:** None  
**Steps:**
1. Navigate to `/auth`.
2. Observe the login form.
**Expected:**
- Username/Email input is visible.
- Password input is visible.
- Log in button is visible.
- No console errors blocking page functionality.

---

### OP-AUTH-002 — Successful login as Operator  
**Type:** Functional  
**Steps:**
1. Navigate to `/auth`.
2. Enter valid Operator username/email.
3. Enter valid Operator password.
4. Click **Log in**.
**Expected:**
- User is authenticated and redirected to a permitted Operator landing page (Lists/Dashboard).
- Operator identity indicator is visible
- Session cookie/token is created.

---

### OP-AUTH-003 — Invalid password is rejected (generic error)  
**Type:** Security / Functional  
**Steps:**
1. Navigate to `/auth`.
2. Enter valid Operator username/email.
3. Enter an invalid password.
4. Click **Log in**.
**Expected:**
- Login fails.
- Error message is shown and does **not** reveal whether username exists.
- No privileged navigation becomes available.

---

### OP-AUTH-004 — Unknown username is rejected (generic error)  
**Type:** Security / Functional  
**Steps:**
1. Navigate to `/auth`.
2. Enter a non-existing username/email.
3. Enter any password.
4. Click **Log in**.
**Expected:**
- Login fails with generic error.

---

### OP-AUTH-005 — Empty submit triggers validation (both fields)  
**Type:** Functional / UX  
**Steps:**
1. Navigate to `/auth`.
2. Do not enter any data.
3. Click **Log in**.
**Expected:**
- Validation errors displayed for **both** username/email and password (field-level messages).
- No network request that attempts authentication (or request is rejected immediately with 4xx).

---

### OP-AUTH-006 — Validation: only username filled 
**Type:** Functional / UX  
**Steps:**
1. Navigate to `/auth`.
2. Fill username/email only.
3. Click **Log in**.
**Expected:**
- “Password is required” shown.
- No successful login.

---

### OP-AUTH-007 — Validation: only password filled  
**Type:** Functional / UX  
**Steps:**
1. Navigate to `/auth`.
2. Fill password only.
3. Click **Log in**.
**Expected:**
- “Username/email is required” shown.
- No successful login.

---

### OP-AUTH-008 — Password field is masked by default  
**Type:** UI  
**Steps:**
1. Navigate to `/auth`.
2. Type any password.
**Expected:**
- Password characters are masked.
- Toggling visibility (if present) behaves correctly (icon state matches visibility).

---

### OP-SESS-001 — Session persists after refresh  
**Type:** Functional  
**Preconditions:** Operator logged in  
**Steps:**
1. Refresh the page.
**Expected:**
- User remains authenticated.
- No redirect to `/auth`.

---

### OP-SESS-002 — Logout invalidates session (if logout exists) 
**Type:** Security / Functional  
**Preconditions:** Operator logged in  
**Steps:**
1. Trigger logout (UI action).
2. Try to open a permitted page directly (e.g., `/assets`).
**Expected:**
- User is redirected to `/auth`.
- Session cookie/token is cleared/invalidated.

---

### OP-RBAC-001 — Operator cannot see Management menu items  
**Type:** Security / UI  
**Preconditions:** Operator logged in  
**Steps:**
1. Observe left navigation menu.
**Expected:**
- No “Management Assets/Devices/Vulnerabilities” links are visible.
- Only allowed pages are present (Lists/Dashboards).

---

### OP-RBAC-002 — Direct URL access to `/managementAssets` is blocked  
**Type:** Security  
**Preconditions:** Operator logged in  
**Steps:**
1. Navigate directly to `/managementAssets`.
**Expected:**
- Access is denied: redirect to permitted page or show “Not authorized/Forbidden”.
- Restricted page title/header is not visible.
- No management table content is rendered.

---

### OP-RBAC-003 — Direct URL access to `/managementDevices` is blocked  
**Type:** Security  
**Steps:**
1. Navigate directly to `/managementDevices`.
**Expected:**
- Blocked as above (no restricted header/content).

---

### OP-RBAC-004 — Direct URL access to `/managementVulnerabilities` is blocked  
**Type:** Security  
**Steps:**
1. Navigate directly to `/managementVulnerabilities`.
**Expected:**
- Blocked as above.

---

### OP-RBAC-005 — Operator cannot call management CRUD APIs (server-side)  
**Type:** Security / API  
**Preconditions:** Operator logged in  
**Steps:**
1. Open DevTools → Console.
2. Attempt a POST to a management endpoint (same endpoint used by Admin CRUD) with Operator session.
**Expected:**
- Server denies with 401/403 (not 500).
- No data changes occur.

---

### OP-RBAC-006 — Operator cannot access “Add record” functionality even via UI injection  
**Type:** Security  
**Preconditions:** Operator logged in  
**Steps:**
1. Navigate to any visible page.
2. Attempt to open a management modal via direct DOM manipulation (if possible).
**Expected:**
- Server-side enforcement prevents creation/update/delete.
- Any attempt results in 401/403 and no record is created.

---

### OP-RBAC-007 — UI leakage check: restricted header must not render  
**Type:** Security / UI  
**Preconditions:** Operator logged in  
**Steps:**
1. Navigate directly to `/managementAssets`.
2. Observe page title/header area.
**Expected:**
- “Management Assets” header is not shown.
- No management table is shown.
- This is treated as a security issue if visible.

---

### OP-RBAC-008 — UI leakage check: restricted header must not render  
**Type:** Security / UI  
**Preconditions:** Operator logged in  
**Steps:**
1. Navigate directly to `/managementDevices`.
2. Observe page title/header area.
**Expected:**
- “Management Devices” header is not shown.
- No management table is shown.
- This is treated as a security issue if visible.

---

### OP-RBAC-009 — UI leakage check: restricted header must not render  
**Type:** Security / UI  
**Preconditions:** Operator logged in  
**Steps:**
1. Navigate directly to `/managementVulnerabilities`.
2. Observe page title/header area.
**Expected:**
- “Management Vulnerabilities” header is not shown.
- No management table is shown.
- This is treated as a security issue if visible.

