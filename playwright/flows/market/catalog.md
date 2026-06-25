# 📦 Market Technical Catalog

> **Purpose:** TypeScript method chains, locator tables, and implementation decisions for all market flows.
>
> **Feature location:** Markets (root route — `app/page.tsx`, `MarketPage.ts` POM)
> **Playwright test folder:** `playwright/tests/market/`
> **Page Object:** `playwright/pages/MarketPage.ts`

---

## Section 1 — Flow Map

| # | Journey | Spec file | Tags |
|---|---------|-----------|------|
| Flow 1 | Market page loads with Buy/Sell tabs and ad list | `market/verify-market-page-loads.spec.ts` | `@market @smoke @production @desktop @mobile` |
| Flow 2 | Switch between Buy and Sell tabs | `market/verify-market-tab-switch.spec.ts` | `@market @smoke @desktop @mobile` |
| Flow 3 | Change currency via CurrencyFilter | `market/verify-market-currency-filter.spec.ts` | `@market @staging @desktop @mobile` |
| Flow 4 | Filter ads by payment method | `market/verify-market-payment-method-filter.spec.ts` | `@market @staging @desktop @mobile` |
| Flow 5 | Apply sort and "Ads from following" filter | `market/verify-market-filter-sort.spec.ts` | `@market @staging @desktop @mobile` |
| Flow 6 | Open order sidebar from market ad row | `market/verify-market-order-sidebar.spec.ts` | `@market @smoke @staging @desktop @mobile` |
| Flow 7 | Place a buy order from market | `market/verify-market-place-buy-order.spec.ts` | `@market @staging @desktop @mobile` |
| Flow 8 | Navigate to advertiser profile from market | `market/verify-market-advertiser-profile-link.spec.ts` | `@market @staging @desktop @mobile` |
| Flow 9 | Search advertiser by nickname (mobile) | `market/verify-market-advertiser-search.spec.ts` | `@market @staging @mobile` |
| G1 | Maintenance mode disables interactions | `market/verify-market-maintenance.spec.ts` | `@market @staging @desktop @mobile` |
| G2 | No balance warning when P2P wallet is empty | `market/verify-market-no-balance-warning.spec.ts` | `@market @staging @desktop @mobile` |
| G3 | KYC gate blocks order placement | `market/verify-market-kyc-gate.spec.ts` | `@market @staging @desktop @mobile` |
| G4 | Deep link auto-selects tab and currency | `market/verify-market-deep-link.spec.ts` | `@market @staging @desktop @mobile` |
| G5 | Risk warning modal intercepts high-risk advertiser | `market/verify-market-risk-warning.spec.ts` | `@market @staging @desktop @mobile` |

---

## Section 2 — Flow Details

### Flow 1 — verify-market-page-loads.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
await expect(marketPage.buyTab, "Buy tab should be visible").toBeVisible();
await expect(marketPage.sellTab, "Sell tab should be visible").toBeVisible();
// Desktop table headers
await expect(page.getByRole("columnheader", { name: "Advertisers" }), "Advertisers column header should be visible").toBeVisible();
await expect(page.getByRole("columnheader", { name: "Rates" }), "Rates column header should be visible").toBeVisible();
await expect(page.getByRole("columnheader", { name: "Payment methods" }), "Payment methods column header should be visible").toBeVisible();
// Ad rows
await expect(marketPage.adCard.first(), "At least one ad card should be visible").toBeVisible();
// Filter controls
await expect(marketPage.currencyFilter, "Currency filter button should be visible").toBeVisible();
await expect(marketPage.paymentMethodFilter, "Payment method filter button should be visible").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Buy tab trigger | `page.getByRole("tab", { name: "Buy" })` | `t("market.buyTab")` → "Buy" | ✅ |
| Sell tab trigger | `page.getByRole("tab", { name: "Sell" })` | `t("market.sellTab")` → "Sell" | ✅ |
| Advertisers column header | `page.getByRole("columnheader", { name: "Advertisers" })` | `t("market.advertisers")` → "Advertisers" | 🔍 Verify on staging (no `role=columnheader` confirmed — may need `getByText`) |
| Rates column header | `page.getByText("Rates")` | `t("market.rates")` → "Rates" | ✅ |
| Payment methods column header | `page.getByText("Payment methods")` | `t("market.paymentMethods")` → "Payment methods" | ✅ |
| Ad card/row | `page.getByTestId("market-ad-card")` | `MarketPage.ts` POM testid ⚠️ not in source | ⚠️ POM testid — verify on staging |
| Currency filter button | `page.getByTestId("market-filter-currency")` | `MarketPage.ts` POM testid ⚠️ not in source | ⚠️ POM testid — verify on staging |
| Payment method filter | `page.getByTestId("market-filter-payment-method")` | `MarketPage.ts` POM testid ⚠️ not in source | ⚠️ POM testid — verify on staging |

---

### Flow 2 — verify-market-tab-switch.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
// Default: Buy tab active
await expect(marketPage.buyTab, "Buy tab should be active by default").toHaveAttribute("data-state", "active");
// Switch to Sell
await marketPage.clickSellTab();
await expect(marketPage.sellTab, "Sell tab should become active").toHaveAttribute("data-state", "active");
// Verify Sell action buttons appear
await expect(page.getByRole("button", { name: /Sell/ }).first(), "Sell action button should be visible on Sell tab").toBeVisible();
// Switch back to Buy
await marketPage.clickBuyTab();
await expect(marketPage.buyTab, "Buy tab should become active again").toHaveAttribute("data-state", "active");
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Buy tab | `page.getByRole("tab", { name: "Buy" })` | `t("market.buyTab")` → "Buy" | ✅ |
| Sell tab | `page.getByRole("tab", { name: "Sell" })` | `t("market.sellTab")` → "Sell" | ✅ |
| Buy action button (per row) | `page.getByRole("button", { name: /Buy/ }).first()` | `t("common.buy")` + currency suffix | ✅ (partial regex) |
| Sell action button (per row) | `page.getByRole("button", { name: /Sell/ }).first()` | `t("common.sell")` + currency suffix | ✅ (partial regex) |

> **⚠️ Tab value inversion:** In `app/page.tsx`, the "Buy" tab has `value="sell"` and the "Sell" tab has `value="buy"`. This is intentional — "Buy" tab shows sell-type ads (ads where advertisers sell crypto). The `data-state="active"` attribute is what the test observes, not the internal `value` prop. See Decision D1.

---

### Flow 3 — verify-market-currency-filter.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
// Open currency filter
await marketPage.currencyFilter.click();
// Desktop: Popover; Mobile: Drawer (90vh)
const searchInput = page.getByPlaceholder("Search");
await expect(searchInput, "Currency search input should be visible").toBeVisible();
// Search
await searchInput.fill("USD");
// Select currency from list
await page.getByText("USD", { exact: false }).first().click();
// Verify selection applied — heading changes
await expect(page.getByText("I want to buy", { exact: false }), "I want to buy heading should update").toBeVisible();
// No-results state
await searchInput.fill("ZZZ");
await expect(page.getByText("ZZZ is unavailable"), "Currency unavailable message should show").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Currency filter button | `page.getByTestId("market-filter-currency")` | `MarketPage.ts` POM ⚠️ | ⚠️ POM testid |
| Search input | `page.getByPlaceholder("Search")` | `t("common.search")` → "Search" | ✅ |
| Currency list item | `page.getByText("USD", { exact: false }).first()` | Runtime currency list (CODE - Name format) | 🔍 Verify on staging |
| "I want to buy" heading | `page.getByText("I want to buy", { exact: false })` | `t("market.iWantToBuy")` → "I want to buy" | ✅ |
| "I want to sell" heading | `page.getByText("I want to sell", { exact: false })` | `t("market.iWantToSell")` → "I want to sell" | ✅ |
| Currency unavailable | `page.getByText("ZZZ is unavailable")` | `t("filter.currencyUnavailable", { currency })` → "{currency} is unavailable" | ✅ (parameterised — use runtime currency) |

---

### Flow 4 — verify-market-payment-method-filter.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
// Open payment method filter
await marketPage.paymentMethodFilter.click();
// Desktop: Popover; Mobile: Drawer with heading "Payment method"
const pmHeading = page.getByRole("heading", { name: "Payment method" })
  .or(page.getByText("Payment method").first()); // mobile Drawer heading vs desktop Popover
await expect(pmHeading, "Payment method filter heading should be visible").toBeVisible();
// Select all checkbox visible
await expect(page.getByLabel("All payment method"), "All payment method checkbox should be visible").toBeVisible();
// Deselect all then select one method
await page.getByLabel("All payment method").uncheck();
await page.getByText("Bank Transfer", { exact: false }).first().click(); // method display_name varies
// Apply
await page.getByRole("button", { name: "Apply" }).click();
// Filter button label changes to "Payment method (1)"
await expect(page.getByText("Payment method (1)", { exact: false }), "Filter badge count should show 1").toBeVisible();
// Reset
await marketPage.paymentMethodFilter.click();
await page.getByRole("button", { name: "Reset" }).click();
await expect(page.getByText("Payment method", { exact: true }), "Filter badge should reset").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Payment method filter button | `page.getByTestId("market-filter-payment-method")` | `MarketPage.ts` POM ⚠️ | ⚠️ POM testid |
| Drawer heading (mobile) | `page.getByRole("heading", { name: "Payment method" })` | `t("paymentMethod.title")` → "Payment method" | ✅ |
| All payment method checkbox | `page.getByLabel("All payment method")` | `t("paymentMethod.allPaymentMethod")` → "All payment method" | ✅ |
| Search input in filter | `page.getByPlaceholder("Search")` | `t("paymentMethod.search")` → "Search" | ✅ |
| Apply button | `page.getByRole("button", { name: "Apply" })` | `t("paymentMethod.apply")` → "Apply" | ✅ |
| Reset button | `page.getByRole("button", { name: "Reset" })` | `t("paymentMethod.reset")` → "Reset" | ✅ |
| Filter count badge | `page.getByText("Payment method (1)", { exact: false })` | `t("market.paymentMethodSelected", { count: 1 })` → "Payment method (1)" | ✅ |

---

### Flow 5 — verify-market-filter-sort.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
// Open filter/sort dropdown
const filterBtn = page.getByRole("button", { name: "Filter" })
  .or(page.locator("[aria-label='Filter']"));
await filterBtn.click();
// Following filter checkbox
const followingCheckbox = page.getByLabel("Ads from advertisers you follow");
await expect(followingCheckbox, "Ads from following checkbox should be visible").toBeVisible();
await followingCheckbox.check();
// Sort by radio
await page.getByLabel("Exchange rate (low-high)").check();
// Apply (mobile only — desktop applies on close)
const applyBtn = page.getByRole("button", { name: "Apply filters" });
if (await applyBtn.isVisible()) {
  await applyBtn.click();
}
// Red dot indicator on filter button
await expect(page.locator("[data-has-active-filters='true'], .red-dot"), "Active filter indicator should be visible").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Filter button | `page.getByRole("button", { name: "Filter" })` | `t("filter.filter")` → "Filter" | 🔍 Verify on staging (filter button label may be icon-only on desktop) |
| Following filter | `page.getByLabel("Ads from advertisers you follow")` | `t("filter.adsFromFollowing")` → "Ads from advertisers you follow" | ✅ |
| Exchange rate radio | `page.getByLabel("Exchange rate (low-high)")` | `t("filter.exchangeRateLowHigh")` → "Exchange rate (low-high)" | ✅ |
| Tier level radio | `page.getByLabel("Tier level (high-low)")` | `t("filter.tierLevelHighLow")` → "Tier level (high-low)" | ✅ |
| User rating radio | `page.getByLabel("User rating (high-low)")` | `t("filter.userRatingHighLow")` → "User rating (high-low)" | ✅ |
| Apply filters button (mobile) | `page.getByRole("button", { name: "Apply filters" })` | `t("filter.applyFilters")` → "Apply filters" | ✅ |
| Reset button (mobile) | `page.getByRole("button", { name: "Reset" })` | `t("filter.reset")` → "Reset" | ✅ |
| Active filter indicator | `page.locator(".red-dot")` | Computed `hasActiveFilters` CSS class | 🔍 Verify exact class on staging |

---

### Flow 6 — verify-market-order-sidebar.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
await expect(marketPage.adCard.first(), "At least one ad should be visible").toBeVisible();
// Click Buy button on first ad
await page.getByRole("button", { name: /Buy/ }).first().click();
// Sidebar opens (full-screen overlay — not a Dialog)
const sidebar = page.getByRole("region").filter({ hasText: "Place order" })
  .or(page.locator("[data-testid='order-sidebar']"));
await expect(sidebar, "Order sidebar should open").toBeVisible({ timeout: 8000 });
// Verify sidebar content
await expect(page.getByPlaceholder("0.00"), "Amount input should be visible").toBeVisible();
await expect(page.getByRole("button", { name: "Place order" }), "Place order button should be visible").toBeVisible();
// Place order button is disabled with no amount
await expect(page.getByRole("button", { name: "Place order" }), "Place order should be disabled initially").toBeDisabled();
// Enter valid amount
await page.getByPlaceholder("0.00").fill("100");
await expect(page.getByRole("button", { name: "Place order" }), "Place order should be enabled after amount entered").toBeEnabled();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Buy button on ad row | `page.getByRole("button", { name: /Buy/ }).first()` | `t("common.buy")` → "Buy" + currency | ✅ (partial regex) |
| Sell button on ad row | `page.getByRole("button", { name: /Sell/ }).first()` | `t("common.sell")` → "Sell" + currency | ✅ (partial regex) |
| Order sidebar container | `page.locator("[data-testid='order-sidebar']")` | Not confirmed in source — full-screen `div.fixed.inset-0` | ⚠️ Fallback: `page.getByText("Place order")` region |
| Amount input | `page.getByPlaceholder("0.00")` | Hard-coded `placeholder="0.00"` in `order-sidebar.tsx` | ✅ |
| Place order button | `page.getByRole("button", { name: "Place order" })` | `t("order.placeOrder")` → "Place order" | ✅ |
| Secure trade reminder | `page.getByText("Quick reminders for a secure trade")` | `t("order.secureTradeReminder.title")` | ✅ |
| Order limit info | `page.getByText("Order limit")` | `t("order.orderLimit")` → "Order limit" | ✅ |
| "You receive" label (buy order) | `page.getByText("You receive")` | `t("order.youReceive")` → "You receive" | ✅ |
| "You pay" label (sell order) | `page.getByText("You pay")` | `t("order.youPay")` → "You pay" | ✅ |
| Receive payment to (buy order) | `page.getByText("Receive payment to")` | `t("order.receivePaymentTo")` → "Receive payment to" | ✅ |

---

### Flow 7 — verify-market-place-buy-order.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
await page.getByRole("button", { name: /Buy/ }).first().click();
// Sidebar opens
await expect(page.getByPlaceholder("0.00"), "Amount input should be visible").toBeVisible({ timeout: 8000 });
// Select payment method (buy orders have payment method selector)
await page.getByText("Receive payment to").waitFor({ state: "visible" });
await page.getByRole("button", { name: "Select payment" }).first().click();
// Fill amount
await page.getByPlaceholder("0.00").fill("100");
// Place order
await page.getByRole("button", { name: "Place order" }).click();
// Redirects to order page
await page.waitForURL(/\/orders\//);
await expect(page, "Page should navigate to order detail").toHaveURL(/\/orders\//);
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Select payment button | `page.getByRole("button", { name: "Select payment" })` | `t("order.selectPayment")` → "Select payment" | ✅ |
| Payment method selected label | `page.getByText("Selected")` | `t("order.selected")` → "Selected" | ✅ |
| Place order button | `page.getByRole("button", { name: "Place order" })` | `t("order.placeOrder")` → "Place order" | ✅ |
| Order URL pattern | `page.waitForURL(/\/orders\//)` | `router.push("/orders/" + order.data.id)` in source | ✅ |
| Insufficient balance error | `page.getByText("Insufficient balance", { exact: false })` | `t("order.insufficientBalance")` | ✅ |
| Order limit error | `page.getByText("Order limit:", { exact: false })` | `t("order.orderLimitError", {...})` → "Order limit: {min} - {max} {currency}" | ✅ (partial) |

---

### Flow 8 — verify-market-advertiser-profile-link.spec.ts

**TypeScript method chain:**

```typescript
await marketPage.gotoMarketPage();
await expect(marketPage.adCard.first(), "Ad card should be visible").toBeVisible();
// Click advertiser name in first ad row
const advertiserName = page.locator("[data-testid='market-ad-card']").first()
  .getByRole("link").first()
  .or(page.locator("table tbody tr").first().getByRole("link").first());
await advertiserName.click();
// Navigates to advertiser profile
await page.waitForURL(/\/advertiser\//);
await expect(page, "Should navigate to advertiser profile").toHaveURL(/\/advertiser\//);
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Advertiser name link in ad row | First link in ad card/row | Not confirmed in source — may be `<a href="/advertiser/{id}">` | 🔍 Verify on staging |
| Advertiser URL pattern | `page.waitForURL(/\/advertiser\//)` | `router.push(\`/advertiser/${userId}\`)` in `handleAdvertiserClick` | ✅ |

---

### Flow 9 — verify-market-advertiser-search.spec.ts

**TypeScript method chain (mobile only):**

```typescript
// Requires mobile viewport
test.skip(!isMobileViewport, "Mobile search is mobile-only");
await marketPage.gotoMarketPage();
// Open search sheet — tap the search icon in the mobile header
const searchBtn = page.getByRole("button", { name: "Search" }).or(
  page.locator("[aria-label='Search']")
);
await searchBtn.click();
// Sheet opens from top (SheetContent side="top")
await expect(page.getByPlaceholder("Search advertiser's nickname"), "Search input should be focused").toBeVisible();
// Type nickname
await page.getByPlaceholder("Search advertiser's nickname").fill(TEST_ADVERTISER_NICKNAME);
// Results appear
await expect(page.getByRole("listitem").first(), "Search result should appear").toBeVisible();
// Tap result's buy/sell button
await page.getByRole("button", { name: /Buy|Sell/ }).first().click();
// Sheet closes, order sidebar opens
await expect(page.getByRole("button", { name: "Place order" }), "Order sidebar should open from search result").toBeVisible();
// No results
await page.getByPlaceholder("Search advertiser's nickname").fill("zzznobodyyy");
await expect(page.getByText("No results found for", { exact: false }), "No results state should be shown").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Search open button (mobile) | `page.getByRole("button", { name: "Search" })` | Icon button with `alt={t("common.search")}` → "Search" | 🔍 Verify on staging — may be icon-only |
| Search input | `page.getByPlaceholder("Search advertiser's nickname")` | `t("market.searchAdvertiserNickname")` → "Search advertiser's nickname" | ✅ |
| Search Buy tab | `page.getByRole("tab", { name: "Buy" })` | `t("market.buyTab")` → "Buy" | ✅ |
| Search Sell tab | `page.getByRole("tab", { name: "Sell" })` | `t("market.sellTab")` → "Sell" | ✅ |
| Result card | `page.getByRole("listitem").first()` | `<li>` per search result | ✅ |
| No results heading | `page.getByText("No results found for", { exact: false })` | `t("common.searchNoResultsTitle", { query })` → `No results found for "{query}"` | ✅ (partial) |
| No results description | `page.getByText("Check spelling or try finding different advertisers.")` | `t("common.searchNoResultsDescription")` | ✅ |

---

### G1 — verify-market-maintenance.spec.ts

**TypeScript method chain:**

```typescript
// Requires staging in maintenance mode or a mocked P2PSystemMaintenance response
await marketPage.gotoMarketPage();
await expect(page.getByText("No ads available"), "Maintenance empty state heading should be visible").toBeVisible();
// Buy/Sell buttons disabled
await expect(page.getByRole("button", { name: /Buy|Sell/ }).first(), "Ad action button should be disabled in maintenance").toBeDisabled();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Maintenance heading | `page.getByText("No ads available")` | `t("market.noAdsMaintenanceTitle")` → "No ads available" | ✅ |
| Disabled ad button | `page.getByRole("button", { name: /Buy|Sell/ }).first()` | `disabled={!!tempBanUntil \|\| isMaintenanceActive}` | ✅ |

---

### G2 — verify-market-no-balance-warning.spec.ts

**TypeScript method chain:**

```typescript
// Requires account with zero P2P wallet balance
await marketPage.gotoMarketPage();
const warning = page.getByText("No balance in P2P Wallet");
await expect(warning, "No balance warning should be visible").toBeVisible();
// Transfer funds button
const transferBtn = page.getByRole("button", { name: /Transfer funds/ });
await expect(transferBtn, "Transfer funds button should be visible").toBeVisible();
await transferBtn.click();
await expect(page, "Should navigate to wallet transfer deep link").toHaveURL(/\/wallet\?operation=TRANSFER/);
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Warning title | `page.getByText("No balance in P2P Wallet")` | `t("market.noBalanceTitle")` → "No balance in P2P Wallet" | ✅ |
| Warning description | `page.getByText("Your sell ads are hidden", { exact: false })` | `t("market.noBalanceDescription")` | ✅ (partial) |
| Transfer funds button | `page.getByRole("button", { name: /Transfer funds/ })` | `t("market.noBalanceTransfer")` → "Transfer funds"; aria-label includes title | ✅ |

---

### G3 — verify-market-kyc-gate.spec.ts

**TypeScript method chain:**

```typescript
// Requires KYC-unverified account
await marketPage.gotoMarketPage();
await page.getByRole("button", { name: /Buy|Sell/ }).first().click();
// KYC onboarding alert appears instead of order sidebar
await expect(page.getByRole("alertdialog"), "KYC alert dialog should be shown").toBeVisible();
// Order sidebar should NOT be visible
await expect(page.getByRole("button", { name: "Place order" }), "Order sidebar should not open without KYC").not.toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| KYC alert dialog | `page.getByRole("alertdialog")` | `showAlert(createKycOnboardingAlertConfig(...))` | 🔍 Verify alertdialog role on staging |
| Place order (should not appear) | `page.getByRole("button", { name: "Place order" })` | `t("order.placeOrder")` | ✅ |

---

### G4 — verify-market-deep-link.spec.ts

**TypeScript method chain:**

```typescript
// ?operation=sell activates Sell tab
await page.goto("/?operation=sell");
await expect(marketPage.sellTab, "Sell tab should be active via ?operation=sell deep link").toHaveAttribute("data-state", "active");

// ?currency=USD pre-selects currency
await page.goto("/?currency=USD");
await expect(page.getByText("I want to buy", { exact: false }), "I want to buy heading should show USD context").toBeVisible();

// Combined deep link
await page.goto("/?operation=sell&currency=USD");
await expect(marketPage.sellTab, "Sell tab should be active").toHaveAttribute("data-state", "active");
await expect(page.getByText("I want to sell", { exact: false }), "I want to sell heading should be visible").toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Sell tab active | `marketPage.sellTab` + `.toHaveAttribute("data-state", "active")` | `?operation=sell` sets `activeTab` in store | ✅ |
| Buy tab active | `marketPage.buyTab` + `.toHaveAttribute("data-state", "active")` | `?operation=buy` sets `activeTab` in store | ✅ |
| "I want to buy" heading | `page.getByText("I want to buy", { exact: false })` | `t("market.iWantToBuy")` → "I want to buy" | ✅ |
| "I want to sell" heading | `page.getByText("I want to sell", { exact: false })` | `t("market.iWantToSell")` → "I want to sell" | ✅ |

---

### G5 — verify-market-risk-warning.spec.ts

**TypeScript method chain:**

```typescript
// Requires an ad from a high-risk advertiser
await marketPage.gotoMarketPage();
await page.getByRole("button", { name: /Buy/ }).first().click();
// Risk warning modal appears
const riskModal = page.getByRole("dialog");
await expect(riskModal, "Risk warning modal should appear for high-risk advertiser").toBeVisible({ timeout: 8000 });
await expect(page.getByText("This advertiser has a low completion rate", { exact: false })
  .or(page.getByText("Many traders have blocked this advertiser", { exact: false })),
  "Risk warning message should be visible").toBeVisible();
// Continue anyway
await page.getByRole("button", { name: "Continue anyway" }).click();
await expect(riskModal, "Risk warning modal should close after Continue").not.toBeVisible();
await expect(page.getByRole("button", { name: "Place order" }), "Order sidebar should open after Continue").toBeVisible();
// Go back
await marketPage.gotoMarketPage();
await page.getByRole("button", { name: /Buy/ }).first().click();
await expect(page.getByRole("dialog"), "Risk warning should reappear").toBeVisible({ timeout: 8000 });
await page.getByRole("button", { name: "Go back" }).click();
await expect(page.getByRole("dialog"), "Risk warning should close on Go back").not.toBeVisible();
await expect(page.getByRole("button", { name: "Place order" }), "Order sidebar should NOT open after Go back").not.toBeVisible();
```

**Locator table:**

| Element | Locator | Source | Status |
|---------|---------|--------|--------|
| Risk warning modal | `page.getByRole("dialog")` | `RiskWarningModal` is a `Dialog` | ✅ |
| Low completion rate message | `page.getByText("This advertiser has a low completion rate", { exact: false })` | `t("market.riskWarning.lowCompletion.title")` | ✅ |
| High block count message | `page.getByText("Many traders have blocked this advertiser", { exact: false })` | `t("market.riskWarning.highBlockCount.title")` | ✅ |
| Continue anyway button | `page.getByRole("button", { name: "Continue anyway" })` | `t("market.riskWarning.continueAnyway")` → "Continue anyway" | ✅ |
| Go back button | `page.getByRole("button", { name: "Go back" })` | `t("market.riskWarning.goBack")` → "Go back"; `aria-label` also set | ✅ |

---

## Section 3 — Tags Reference

| Tag | Description |
|-----|-------------|
| `@market` | Feature area tag — all market module tests |
| `@smoke` | Critical path — must pass before any release |
| `@production` | Safe to run on production (read-only, no mutations) |
| `@staging` | Staging only — requires account state, mutations, or Mailisk |
| `@desktop` | Desktop viewport (1280×720, chromium project) |
| `@mobile` | Mobile viewport (Pixel 7 412×915, chromium-mobile project) |

---

## Section 4 — Implementation Decisions

### D1 — Tab value inversion: `value="sell"` = "Buy" tab, `value="buy"` = "Sell" tab

In `app/page.tsx`, the `<Tabs>` component has:
- `<TabsTrigger value="sell">` → renders as the **"Buy"** tab (shows sell-type ads — ads where advertisers sell, users buy)
- `<TabsTrigger value="buy">` → renders as the **"Sell"** tab (shows buy-type ads — ads where advertisers buy, users sell)

This is intentional product logic, not a bug. Tests should locate tabs by their visible label (`"Buy"`, `"Sell"`) using `getByRole("tab", { name: "Buy" })`, never by `value` prop.

---

### D2 — OrderSidebar is a full-screen overlay div, not a Dialog

`components/buy-sell/order-sidebar.tsx` renders as a `div.fixed.inset-0.z-50`, not using Radix `Dialog` or `Drawer`. There is no `role="dialog"` in the sidebar itself. Locate it by its content (`"Place order"` button, `"0.00"` placeholder) rather than by dialog role.

---

### D3 — POM testids not confirmed in source

`MarketPage.ts` references `market-tab-buy`, `market-tab-sell`, `market-filter-currency`, `market-filter-payment-method`, `market-ad-card`, `market-empty-state` but none of these `data-testid` values appear in the source files for this module. They are either pending dev additions or use `getByRole`/`getByText` fallbacks in the POM methods. Verify on staging before writing assertions that depend on these testids.

---

### D4 — CurrencyFilter and PaymentMethodsFilter have viewport-split layouts

Both components use the same pattern:
- **Desktop:** `Popover` (compact, w-80)
- **Mobile:** `Drawer` (bottom sheet; CurrencyFilter 90vh, PaymentMethodsFilter h-fit)

The mobile Drawer has a heading (`t("paymentMethod.title")` → "Payment method"); the desktop Popover does not. Assertions for headings must guard on viewport: `if (isMobileViewport) expect(heading).toBeVisible()`.

---

### D5 — MarketFilterDropdown applies immediately on desktop, requires "Apply" on mobile

`MarketFilterDropdown` on desktop closes and applies when the Popover closes (no explicit Apply button). On mobile, a Drawer with explicit "Apply filters" (`t("filter.applyFilters")`) and "Reset" (`t("filter.reset")`) buttons is shown. Tests that assert filter application must handle both paths.

---

### D6 — Mobile advertiser search is a Sheet (slides from top), not a Drawer

`MobileAdvertiserSearch` uses `<Sheet side="top">` (`SheetContent side="top"`), which slides down from the top of the viewport and occupies the full screen. It is distinct from Drawers (which slide from the bottom). There is no desktop counterpart — a desktop search input is embedded directly in the market page header area. Flow 9 is mobile-only.

---

### D7 — Risk warning modal source in `risk-warning-rules.ts`

Whether a risk warning appears is determined by `evaluateRisk(ad)` in `components/buy-sell/risk-warning/risk-warning-rules.ts`. The two conditions are: (1) advertiser completion rate below a threshold, (2) advertiser block count above a threshold. Tests for G5 require a staging advertiser account that meets one of these conditions. Without such an account, G5 flows cannot be fully automated.
