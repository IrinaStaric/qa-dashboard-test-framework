# Sign In — Test Cases

## Scope
This document partially covers functional, negative, session, and security-focused test cases for the **Sign in** page (`/auth`) in the QA Dashboard application.

---

### TC-SIGNIN-001 — Page loads and core elements are visible
- **Type**: UI
- **Preconditions**: None
- **Steps**:
  1. Navigate to `/auth`.
- **Expected**:
  - Username/Email input is visible.
  - Password input is visible.
  - “Log in” button is visible.
  - Inputs have accessible labels.

---

### TC-SIGNIN-002 — Successful sign in as Admin
- **Type**: Functional / Session
- **Preconditions**: Valid Admin credentials exist.
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter valid Admin username/email and password.
  3. Click “Log in”.
- **Expected**:
  - User is authenticated.
  - User is redirected to the post-login landing page.
  - Session token/cookie is present.

---

### TC-SIGNIN-003 — Successful sign in as Operator
- **Type**: Functional / Session
- **Preconditions**: Valid Operator credentials exist.
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter valid Operator username/email and password.
  3. Click “Log in”.
- **Expected**:
  - User is authenticated.
  - User sees Operator-allowed navigation.
  - Restricted admin/management items are not visible in the UI.

---

### TC-SIGNIN-004 — Login fails with Admin username and Operator password

**Type:** Negative / Security  
**Preconditions:**  
- Admin account exists  
- Operator account exists  

**Steps:**
1. Navigate to `/auth`.
2. Enter **Admin username/email**.
3. Enter **Operator password**.
4. Click **“Log in”**.
**Expected:**
- Authentication is rejected.
- User remains on the Sign In page.
- Generic error message is displayed (no indication which credential is incorrect).
- No session cookie/token is created.
- No protected routes are accessible.

---

### TC-SIGNIN-005 — Login fails with Operator username and Admin password

**Type:** Negative / Security  
**Preconditions:**  
- Admin account exists  
- Operator account exists  

**Steps:**
1. Navigate to `/auth`.
2. Enter **Operator username/email**.
3. Enter **Admin password**.
4. Click **“Log in”**.
**Expected:**
- Authentication is rejected.
- User remains on the Sign In page.
- Generic error message is displayed (no indication which credential is incorrect).
- No session cookie/token is created.
- Role or account information is not exposed.

---

### TC-SIGNIN-006 — Invalid password is rejected (generic error)
- **Type**: Security
- **Preconditions**: Valid username/email exists.
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter valid username/email.
  3. Enter invalid password.
  4. Click “Log in”.
- **Expected**:
  - Login is rejected.
  - A generic error is shown.
  - No session token/cookie is created.

---

### TC-SIGNIN-007 — Invalid username/email is rejected (generic error)
- **Type**: Security
- **Preconditions**: None
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter invalid/nonexistent username/email.
  3. Enter any password.
  4. Click “Log in”.
- **Expected**:
  - Login is rejected.
  - Generic error is shown (no hint whether user exists).
  - No session token/cookie is created.

---

### TC-SIGNIN-008 — Empty submit triggers validation (both fields)
- **Type**: Functional / UI
- **Preconditions**: None
- **Steps**:
  1. Navigate to `/auth`.
  2. Click “Log in” without entering anything.
- **Expected**:
  - Validation is shown for Username/Email (required).
  - Validation is shown for Password (required).
  - No request is sent that authenticates the user.

---

### TC-SIGNIN-009 — Username empty triggers validation
- **Type**: Functional / UI
- **Steps**:
  1. Navigate to `/auth`.
  2. Leave Username/Email empty.
  3. Fill Password with any value.
  4. Click “Log in”.
- **Expected**:
  - Username/Email required validation is shown.
  - User remains unauthenticated.

---

### TC-SIGNIN-010 — Password empty triggers validation
- **Type**: Functional / UI
- **Steps**:
  1. Navigate to `/auth`.
  2. Fill Username/Email with any value.
  3. Leave Password empty.
  4. Click “Log in”.
- **Expected**:
  - Password required validation is shown.
  - User remains unauthenticated.

---

### TC-SIGNIN-011 — Whitespace-only values are treated as empty
- **Type**: Security / Functional
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter spaces in Username/Email.
  3. Enter spaces in Password.
  4. Click “Log in”.
- **Expected**:
  - Required validation is shown, or request is rejected.
  - No authentication occurs.

---

### TC-SIGNIN-012 — Trim behavior for username/email
- **Type**: Functional
- **Priority**: P2
- **Steps**:
  1. Navigate to `/auth`.
  2. Enter valid username/email with leading/trailing spaces.
  3. Enter valid password.
  4. Click “Log in”.
- **Expected**:
  - Either input is trimmed and login succeeds, or login fails consistently by design.
  - Behavior is consistent and documented.

---

### TC-SIGNIN-013 — Password field masks characters
- **Type**: UI/Security
- **Steps**:
  1. Navigate to `/auth`.
  2. Type into Password input.
- **Expected**:
  - Password characters are masked.
  - Copy/paste is allowed or blocked consistently per requirements.

---

### TC-SIGNIN-014 — Enter key submits the form
- **Type**: Functional / UX
- **Steps**:
  1. Navigate to `/auth`.
  2. Fill valid credentials.
  3. Press Enter.
- **Expected**:
  - Form is submitted.
  - User is logged in.

---

### TC-SIGNIN-015 — Rate limiting / force protection (behavioral)
- **Type**: Security
- **Steps**:
  1. Attempt login with invalid credentials repeatedly (e.g., 10+ times).
- **Expected**:
  - Application throttles attempts, shows cooldown, or blocks temporarily (based on design).
  - Response times and messages do not allow enumeration.

---

### TC-SIGNIN-016 — No sensitive data in error messages
- **Type**: Security
- **Steps**:
  1. Attempt login with invalid credentials.
- **Expected**:
  - Error does not expose:
    - whether the username exists
    - password policy details
    - stack traces or SQL errors
  - No secrets appear in UI.

---

### TC-SIGNIN-017 — Secure session cookie flags
- **Type**: Security / Session
- **Steps**:
  1. Log in successfully.
  2. Inspect cookies in browser dev tools.
- **Expected**:
  - Session cookie uses secure attributes where applicable:
    - `HttpOnly` recommended
    - `SameSite` set appropriately
    - `Secure` in HTTPS environments

---

### TC-SIGNIN-018 — Session persists across page refresh
- **Type**: Session
- **Steps**:
  1. Log in successfully.
  2. Refresh the page.
- **Expected**:
  - User remains authenticated.
  - No redirect back to `/auth`.

---

### TC-SIGNIN-019 — Logout invalidates session
- **Type**: Session / Security
- **Steps**:
  1. Log in successfully.
  2. Log out.
  3. Attempt to access a protected route directly.
- **Expected**:
  - User is redirected to `/auth` (or equivalent).
  - Protected routes are not accessible.

---

### TC-SIGNIN-020 — Direct access protection: unauthenticated user
- **Type**: Security / RBAC
- **Steps**:
  1. Open a new incognito session.
  2. Navigate directly to `/managementAssets`.
- **Expected**:
  - User is blocked (redirect to `/auth` or 401/403 UX).
  - No sensitive management content renders.

---

### TC-SIGNIN-021 — RBAC: Operator must not access Management pages
- **Type**: Security / RBAC ( Role base access control )
- **Steps**:
  1. Log in as Operator.
  2. Navigate directly to `/managementAssets`.
- **Expected**:
  - Access is denied (redirect, 403, or access-denied screen).
  - No management header/content is visible.
  - No ability to interact with management data.

---


### TC-SIGNIN-022 — XSS payload in username/email is safely handled
- **Type**: Security
- **Steps**:
  1. Enter a typical XSS string in username/email.
  2. Enter any password and submit.
- **Expected**:
  - No script execution.
  - Input is treated as text.
  - No reflected payload in error UI.

---

### TC-SIGNIN-023 — SQL injection-style payload does not break auth
- **Type**: Security
- **Steps**:
  1. Enter a SQL injection-style string in username.
  2. Submit with any password.
- **Expected**:
  - No server error surfaces in UI.
  - Login is rejected normally.
  - No sensitive error details exposed.

---

### TC-SIGNIN-024 — Browser back button does not reveal protected content after logout
- **Type**: Security / Session
- **Steps**:
  1. Log in successfully.
  2. Navigate to a protected page.
  3. Log out.
  4. Press browser Back.
- **Expected**:
  - Protected content is not accessible.
  - User is redirected to `/auth` or blocked.

---

### TC-SIGNIN-025 — Multi-tab behavior: logout in one tab affects others
- **Type**: Session
- **Steps**:
  1. Log in.
  2. Open a protected page in two tabs.
  3. Log out in tab A.
  4. Refresh tab B.
- **Expected**:
  - Tab B becomes unauthenticated after refresh (or immediately, depending on implementation).

