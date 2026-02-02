# Test Scope — QA Dashboard

## Purpose
This document defines the testing scope for the QA Dashboard application.
The focus is on authentication, role-based access control (RBAC),
Management Assets functionality, and security-relevant scenarios.

The scope reflects real application behavior observed during testing,
Including known backend and UI limitations.

---

## In Scope

### Authentication
- Login with valid credentials
- Invalid credentials handling
- Empty form validation
- Error messaging behavior
- Logout behavior
- Session persistence (only basic checks implemented; deep session lifecycle testing is out of the current scope scope)
- Multi-browser session behavior (basic security-related scenarios validated)

---

### Roles Covered

#### Admin
- Full access to Management Assets
- CRUD operations (API-level)
- UI verification (tables, sorting, pagination)
- Search and filtering
- Refresh behavior
- Export functionality
- Security scenarios (XSS, session handling)

#### Operator
- Limited access
- Authentication and validation
- RBAC enforcement
- Restricted route access via direct URL
- UI security leakage checks
- Navigation and header visibility

---

### Management Assets (Admin)
- Create / Read / Update / Delete
- Sorting (A–Z, Z–A)
- Pagination and records per page
- Search and filtering
- Refresh results behavior
- Export options (CSV, XLSX, JSON)
- XSS input validation
- UI consistency and data integrity

---

## Out of Scope

The following areas are intentionally excluded from the current testing scope:

- Performance, load, and stress testing
- Mobile responsiveness and mobile-specific behaviors
- Third-party integrations and external services
- Cross-browser coverage beyond supported desktop browsers
- UI/visual design consistency and layout accuracy
- Dashboard-level pages and views not directly related to test objectives, including:
  - Assets Dashboard
  - Devices Dashboard
  - Vulnerabilities Dashboard
- Management sections outside the Assets domain:
  - Management Devices
  - Management Vulnerabilities
  - AssetDashboard
  - DevicesDashboard
  - VulnerabilitiesDashboard

These areas contain visual inconsistencies, data presentation issues, and functional gaps, but they are **not evaluated within the scope of the current project**.

---

## Known Constraints

During test execution, the following limitations were observed:

- Some backend endpoints return `500` responses for valid requests, indicating server-side issues
- Certain UI actions are partially implemented or not functional
- Session invalidation behavior is inconsistent across browsers and concurrent sessions
- Route protection and authorization checks may occur after UI rendering in some flows

All confirmed issues are documented as formal bug reports in the `/bugs` directory.

---

## Test Environment

- Application URL: `http://localhost:5480`
- Port `5481` is not used / not stable
- Tests are executed locally using **Playwright (JavaScript)**
- Environment configuration is managed via `.env` files (with sensitive values excluded from version control)

-------

## Improvements & Future Enhancements

The current implementation focuses on a selected set of critical scenarios to demonstrate structure, depth, and quality of approach within the given timeframe.

With additional time, the following areas would be addressed:

### Testability
- Introduction of stable selectors (e.g. `data-testid`) for key UI elements to reduce flakiness and long-term maintenance cost.
- More consistent use of role-based and accessibility-friendly locators across the UI.

### Coverage Expansion
- Broader authentication and session-related scenarios, including token expiration and edge-case session handling.
- Deeper RBAC validation at both UI and API levels, ensuring forbidden actions are explicitly blocked (e.g. proper `403` responses).
- Additional negative and security-oriented cases, including extended XSS and boundary-input scenarios.

### Framework Refinement
- Refactoring shared flows into reusable fixtures and helpers to reduce duplication.
- Minor structural refactoring of page objects to improve readability and scalability as the test suite grows.

