# QA Dashboard — Playwright Test Framework

## Overview
End-to-end and API test framework for the **QA Dashboard** application,
built with **Playwright (JavaScript)**.

The framework validates authentication, role-based access control (RBAC),
and partially  **Management Assets** functionality, with an emphasis on
security and negative scenarios.

---

## Tech Stack
- Playwright
- JavaScript (Node.js)
- dotenv

---

## Roles Covered
- **Admin**
- **Operator**

Detailed scope, test cases, and documented issues are available under `/docs`.

---

## Test Coverage

Test coverage is documented through a selected set of representative test cases,
defined under `docs/test-cases/` and documented issues are available under `/docs`. 

- `SIGN_IN.md` — authentication, validation, and session scenarios  
- `OPERATOR_AUTH_RBAC.md` — RBAC enforcement and authorization boundaries  
- `ADMIN_MANAGEMENT_ASSETS.md` — Management Assets functionality for Admin role  

These test cases are **not intended to be exhaustive**.  
They demonstrate the testing approach, coverage priorities, and quality focus
for the scoped areas of the application.  
The structure is designed to allow straightforward extension as coverage expands.

---

## Application Runtime

The application is expected to be available locally during test execution.

- The application serves the UI at:  
  `http://localhost:5480`

- Port `5481` is exposed in the provided release configuration; however:
  - HTTP requests via browser or `curl` are reset
  - The port is not stable or usable for test execution

- UI functionality operates correctly via port `5480`,
  indicating backend availability through the same server/port.

---

## Running the Tests

```bash
npm install
npx playwright install
npx playwright test


