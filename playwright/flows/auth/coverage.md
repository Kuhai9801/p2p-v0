# Auth Journey Coverage

**Analysis date:** 2026-06-25

---

## Section 1 — Coverage at a Glance

| # | Journey | Desktop | Mobile | Notes |
|---|---|---|---|---|
| Flow 1 | Happy-path login with valid credentials | ❌ | ❌ | Core smoke test — highest priority |
| Flow 2 | Login page renders all expected elements | ❌ | ❌ | Read-only — safe on production |
| Flow 3 | Unauthenticated user is redirected to login | ❌ | ❌ | Redirect target varies by user type |
| G1 | Invalid email — button disabled / validation shown | ❌ | ❌ | |
| G2 | Invalid credentials show error state | ❌ | ❌ | Requires wrong password — staging only |

---

## Section 2 — Gaps

| Gap | Description | Proposed spec file |
|---|---|---|
| G1 | "Log in" button is disabled when email field is empty; invalid email format is rejected before submission | `auth/verify-login-invalid-email.spec.ts` |
| G2 | Submitting wrong password on `/enter-password` shows an inline error message | `auth/verify-login-invalid-credentials.spec.ts` |

> Step-by-step test cases for each gap: [`flow.md — Gap Flows`](./flow.md#gap-flows)

---

## Section 3 — Priority List

| Priority | Spec file | Gap / Flow | Reason |
|---|---|---|---|
| P0 | `auth/verify-login-happy-path.spec.ts` | Flow 1 | Login is the entry point to every other test — must pass before any other suite runs |
| P1 | `auth/verify-login-page-elements.spec.ts` | Flow 2 | Verifies the login page renders correctly — safe smoke check on both staging and production |
| P1 | `auth/verify-unauthenticated-redirect.spec.ts` | Flow 3 | Guards against a regression where unauthenticated users can access protected routes |
| P2 | `auth/verify-login-invalid-email.spec.ts` | G1 | Validates client-side guard on the email field; non-blocking but important UX coverage |
| P2 | `auth/verify-login-invalid-credentials.spec.ts` | G2 | Validates error handling on wrong password; important but not release-blocking |
