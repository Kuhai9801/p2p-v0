# 📋 Auth Journey Spec — What to Test

> **Purpose:** Describes the Login flow on `staging-dp2p.deriv.com`. Defines *what* to verify at each step.
>
> **Feature location:** `/login` → `/enter-password` → `/` (P2P Markets home)
> **URL:** `https://staging-dp2p.deriv.com/login`
> **Authentication:** Not required — these are the flows that establish authentication
> **Note:** Login is driven by Ory Kratos. The p2p-v0 app itself has no active `app/login/page.tsx` — unauthenticated users are redirected to the external login service. The `LoginPage` POM navigates directly to `/login` which resolves to the Ory Kratos-backed login screen on staging.

---

## Section 1 — Shared Login Steps

> Referenced by Flows 1 and 2. Substitute `[email]` and `[password]` with the values listed in each flow section.

**Prerequisites:** Valid staging account credentials in `playwright/.env.staging` (`TEST_EMAIL`, `TEST_PASSWORD`)

| # | Step | Action | Expected Result | Test Data |
|---|------|--------|-----------------|-----------|
| 1 | Navigate to login | Navigate to `/login` | Page loads; heading visible; email input visible | — |
| 2 | Enter email | Type email address into the email field | Email appears in the input | `[email]` |
| 3 | Submit email | Click the "Log in" button | Button is enabled when email is non-empty; page transitions to `/enter-password` | — |
| 4 | Enter password | Type password into the password field | Password field is visible and accepts input | `[password]` |
| 5 | Submit password | Click the "Log in" button | App redirects to `/` (P2P Markets home); page loads successfully | — |

---

## Section 2 — Per-Flow Sections

### Flow 1 — verify-login-happy-path.spec.ts

**Display name:** Happy-path login with valid credentials

**Prerequisites:** Pre-existing test account in `TEST_EMAIL` / `TEST_PASSWORD` env vars

| # | Step | Action | Expected Result | Test Data |
|---|------|--------|-----------------|-----------|
| 1 | Navigate to login | Navigate to `/login` | Login page heading is visible | — |
| 2 | Verify login page elements | Observe page | Email input is visible; "Log in" button is visible | — |
| 3 | Enter email | Type email into the email field | Email value appears in the field | `TEST_EMAIL` |
| 4 | Submit email | Click "Log in" button | Transitions to `/enter-password`; password input is visible | — |
| 5 | Enter password | Type password into the password field | Password is accepted | `TEST_PASSWORD` |
| 6 | Submit login | Click "Log in" button | Redirects to `/`; P2P Markets page loads | — |
| 7 | Verify post-login state | Observe the market page | Market page is visible (Buy/Sell tabs or ad list present) | — |

---

### Flow 2 — verify-login-page-elements.spec.ts

**Display name:** Login page renders all expected elements

**Prerequisites:** None — read-only page load

| # | Step | Action | Expected Result | Test Data |
|---|------|--------|-----------------|-----------|
| 1 | Navigate to login | Navigate to `/login` | Page loads without errors | — |
| 2 | Verify heading | Observe heading | "Welcome back!" heading is visible | — |
| 3 | Verify email label | Observe form label | "Email" label is visible | — |
| 4 | Verify email input | Observe input field | Email input with placeholder `"name@email.com"` is visible | — |
| 5 | Verify Log in button | Observe button | "Log in" button is visible | — |
| 6 | Verify Sign up link | Observe footer | "Don't have an account yet?" text and "Sign up" link are visible | — |

---

### Flow 3 — verify-unauthenticated-redirect.spec.ts

**Display name:** Unauthenticated user is redirected to login

**Prerequisites:** No active session (fresh browser context, no stored cookies)

| # | Step | Action | Expected Result | Test Data |
|---|------|--------|-----------------|-----------|
| 1 | Navigate to protected route | Navigate to `/` (P2P Markets) without a session | App redirects away from `/` | — |
| 2 | Verify redirect target | Observe URL after redirect | URL is no longer `/`; user lands on a login page (either `/login` or external Deriv login) | — |

---

## Gap Flows

> These are test cases for coverage gaps. The proposed spec file for each gap is in [`coverage.md`](./coverage.md).

### G1 — Invalid email format rejected on login

| # | Test case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Submit non-email string | Navigate to `/login`; type a non-email string (e.g. `"notanemail"`); click "Log in" | "Log in" button stays disabled while email field is blank, or an error is shown for invalid email |
| 2 | Submit empty email | Navigate to `/login`; leave email blank; observe button state | "Log in" button is disabled when the email field is empty |

### G2 — Invalid credentials show error state

| # | Test case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Wrong password | Navigate to `/login`; enter valid email; submit; enter wrong password on `/enter-password`; submit | An inline error message is displayed; user stays on `/enter-password` |
| 2 | Non-existent email | Navigate to `/login`; enter an email that has no account; submit | An error message is shown on the login page or the password step |
