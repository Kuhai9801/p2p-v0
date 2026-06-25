# Fixtures Reference — p2p-v0

> **Purpose:** Documents all available Playwright fixtures for p2p-v0 tests.
> Import `test` from `playwright/fixtures/fixtures.ts` — never from `@playwright/test` directly.

---

## Import

```typescript
import { test, expect } from "../fixtures/fixtures";
```

---

## Available Fixtures

| Fixture | Type | Route covered | Notes |
|---|---|---|---|
| `loginPage` | `LoginPage` | `/login`, `/enter-password` | Handles full Ory Kratos 2-step login |
| `marketPage` | `MarketPage` | `/` (root) | P2P Markets home |
| `adsPage` | `AdsPage` | `/ads` | My Ads list |
| `advertiserPage` | `AdvertiserPage` | `/advertiser/[id]` | Advertiser profile |
| `ordersPage` | `OrdersPage` | `/orders` | Orders list |
| `orderDetailPage` | `OrderDetailPage` | `/orders/[id]` | Single order detail |
| `profilePage` | `ProfilePage` | `/profile` | User profile |
| `walletPage` | `WalletPage` | `/wallet` | P2P wallet |
| `isMobileViewport` | `boolean` | — | `true` when viewport width < 1024px |

> **Note:** All fixtures automatically suppress the WebAuthn/Passkeys OS prompt via an init script — no manual setup needed.

---

## Usage Patterns

### Pattern A — Login via fixture in `beforeEach`

```typescript
test.describe("Market flow", { tag: ["@market", "@smoke"] }, () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.login();
    });

    test("VERIFY market page loads", async ({ marketPage }) => {
        await expect(marketPage.heading, "Market heading should be visible").toBeVisible();
    });
});
```

### Pattern B — Login via `loginHelpers` in `beforeAll` (shared browser session)

Use when tests in a suite share state and logging in once is sufficient:

```typescript
import { loginHelpers } from "../utils";

test.describe("Ads flow", { tag: ["@ads", "@staging"] }, () => {
    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await loginHelpers.login(page, process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    });
});
```

### Pattern C — Env var credentials (pre-existing test account)

```typescript
test.beforeEach(async ({ loginPage }) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    if (!email || !password) throw new Error("TEST_EMAIL and TEST_PASSWORD must be set in .env.staging");
    await loginPage.login(email, password);
});
```

---

## Login Flow Detail

`loginPage.login(email?, password?)` handles the full Ory Kratos 2-step flow:

1. Navigates to `/login` (or waits if already there)
2. Enters email → submits
3. Waits for redirect to `/enter-password`
4. Enters password → submits
5. Waits for redirect to `/` (MarketPage)

Falls back to `process.env.TEST_EMAIL` / `process.env.TEST_PASSWORD` if no arguments passed.

---

## Adding a New Fixture

1. Create the Page Object in `playwright/pages/`
2. Import it in `playwright/fixtures/fixtures.ts`
3. Add the type to the `base.extend<{...}>()` generic
4. Add the fixture implementation block
