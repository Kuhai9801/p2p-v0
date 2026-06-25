# Flow Document Index — p2p-v0

Master tracking file for all Playwright journey flow documents in `p2p-v0`.
This folder contains plain-English journey specifications, coverage scorecards, and technical catalogs for every feature area tested in this project.

Updated when new flows are added, tests are implemented, or coverage status changes.

Last updated: 2026-06-25 (auth + ads + advertiser + market modules added)

---

## How to Read This File

Each module section lists every documented flow with its current **status** and **priority**.

### Status Values

| Status | Meaning |
|--------|---------|
| `documented` | `flow.md` + `catalog.md` + `coverage.md` exist; no test written yet |
| `automated` | Playwright spec file exists in `playwright/tests/` and runs in CI |

### Priority Values

| Priority | Meaning |
|----------|---------|
| `P0` | Blocking — must pass before any release |
| `P1` | High — critical user path; implement next sprint |
| `P2` | Medium — important but not blocking |
| `P3` | Low — nice-to-have or edge case |
| `N/A` | Not automatable (e.g. real payment, file upload outside test control) |

---

## Coverage Summary

| Module | Total Flows | Documented | Automated |
|--------|------------|------------|-----------|
| `auth` | 5 | 5 | 0 |
| `market` | 14 | 14 | 0 |
| `ads` | 13 | 13 | 0 |
| `advertiser` | 11 | 11 | 0 |
| `orders` | 0 | 0 | 0 |
| `profile` | 0 | 0 | 0 |
| `wallet` | 0 | 0 | 0 |
| **Total** | **43** | **43** | **0** |

> Status advances: `documented` → `automated`

---

## Module: `auth` — Login / Authentication

**Flow docs:** `playwright/flows/auth/` · **Test folder:** `playwright/tests/auth/`

| Flow | Priority | Description | User State | Status |
|------|----------|-------------|------------|--------|
| Flow 1 | P0 | Happy-path login with valid credentials | Pre-existing test account | `documented` |
| Flow 2 | P1 | Login page renders all expected elements | Unauthenticated | `documented` |
| Flow 3 | P1 | Unauthenticated user is redirected to login | No session | `documented` |
| G1 | P2 | Invalid email — button disabled / validation shown | Unauthenticated | `documented` |
| G2 | P2 | Invalid credentials show error state | Unauthenticated | `documented` |

---

## Module: `market` — P2P Markets (Home)

**Flow docs:** `playwright/flows/market/` · **Test folder:** `playwright/tests/market/`

| Flow | Priority | Description | User State | Status |
|------|----------|-------------|------------|--------|
| Flow 1 | P0 | Market page loads with Buy/Sell tabs and ad list | Any logged-in user | `documented` |
| Flow 2 | P0 | Switch between Buy and Sell tabs | Any logged-in user | `documented` |
| Flow 3 | P1 | Change currency via CurrencyFilter | Any logged-in user | `documented` |
| Flow 4 | P2 | Filter ads by payment method | Any logged-in user | `documented` |
| Flow 5 | P2 | Apply sort and "Ads from following" filter | Follows at least one advertiser | `documented` |
| Flow 6 | P1 | Open order sidebar from market ad row | KYC verified, not temp-banned | `documented` |
| Flow 7 | P2 | Place a buy order from market | KYC verified, funded P2P wallet | `documented` |
| Flow 8 | P2 | Navigate to advertiser profile from market | KYC verified | `documented` |
| Flow 9 | P3 | Search advertiser by nickname (mobile) | KYC verified; mobile viewport | `documented` |
| G1 | P3 | Maintenance mode disables market interactions | Any logged-in user | `documented` |
| G2 | P2 | No balance warning when P2P wallet is empty | Zero P2P balance | `documented` |
| G3 | P3 | KYC gate blocks order placement | KYC-unverified account | `documented` |
| G4 | P1 | Deep link auto-selects tab and currency | Any logged-in user | `documented` |
| G5 | P3 | Risk warning modal intercepts high-risk advertiser | Any logged-in user | `documented` |

---

## Module: `ads` — My Ads

**Flow docs:** `playwright/flows/ads/` · **Test folder:** `playwright/tests/ads/`

| Flow | Priority | Description | User State | Status |
|------|----------|-------------|------------|--------|
| Flow 1 | P0 | My Ads page loads and displays existing ads | Has existing ads | `documented` |
| Flow 2 | P2 | My Ads page shows empty state when no ads exist | No ads | `documented` |
| Flow 3 | P0 | Create a Buy ad (3-step wizard, fixed rate) | KYC verified, P2P enabled | `documented` |
| Flow 4 | P1 | Create a Sell ad (3-step wizard, fixed rate) | Funded P2P balance | `documented` |
| Flow 5 | P1 | Edit an existing ad and save changes | Has existing ad | `documented` |
| Flow 6 | P2 | Deactivate an active ad from the actions menu | Has active ad | `documented` |
| Flow 7 | P2 | Activate an inactive ad from the actions menu | Has inactive ad | `documented` |
| Flow 8 | P1 | Delete an ad and confirm deletion | Has existing ad | `documented` |
| Flow 9 | P2 | Toggle "Hide my ads" switch | Has existing ads | `documented` |
| G1 | P3 | KYC not verified blocks ad creation | Non-KYC account | `documented` |
| G2 | P3 | Ad limit reached shows error | Account at ad limit | `documented` |
| G3 | P3 | Ad with visibility issues shows warning icon | Ad has visibility_status | `documented` |
| G4 | P3 | Cannot remove payment method with open order during edit | Ad has open order | `documented` |

---

## Module: `advertiser` — Advertiser Profile

**Flow docs:** `playwright/flows/advertiser/` · **Test folder:** `playwright/tests/advertiser/`

| Flow | Priority | Description | User State | Status |
|------|----------|-------------|------------|--------|
| Flow 1 | P0 | Advertiser profile page loads with stats and ads | Any logged-in user | `documented` |
| Flow 2 | P3 | Advertiser profile shows empty state when no active ads | Advertiser has no ads | `documented` |
| Flow 3 | P2 | Follow an advertiser | Not following advertiser | `documented` |
| Flow 4 | P2 | Unfollow an advertiser via the Following dropdown | Currently following advertiser | `documented` |
| Flow 5 | P1 | Block an advertiser | Not blocking advertiser | `documented` |
| Flow 6 | P1 | Unblock a previously blocked advertiser | Currently blocking advertiser | `documented` |
| Flow 7 | P1 | Open order sidebar from an advertiser's ad | Advertiser has active ads | `documented` |
| Flow 8 | P2 | Deep link with `?adId=` param auto-opens order sidebar | Known adId on advertiser | `documented` |
| G1 | P3 | Own profile hides Follow and Block buttons | Viewing own profile | `documented` |
| G2 | P3 | Deep link with non-existent adId shows alert | Any logged-in user | `documented` |
| G3 | P2 | View advertiser stats detail modal | Advertiser has stats | `documented` |

---

## Module: `orders` — Orders

**Flow docs:** `playwright/flows/orders/` · **Test folder:** `playwright/tests/orders/`

*No flows documented yet.*

---

## Module: `profile` — User Profile

**Flow docs:** `playwright/flows/profile/` · **Test folder:** `playwright/tests/profile/`

*No flows documented yet.*

---

## Module: `wallet` — Wallet & Transfer

**Flow docs:** `playwright/flows/wallet/` · **Test folder:** `playwright/tests/wallet/`

*No flows documented yet.*

---

## Implementation Priority Order

The recommended order for implementing new tests based on business impact and coverage gaps:

| Priority | Module | Key Flows to Implement First |
|----------|--------|------------------------------|
| **Next** | `auth` | Login happy path, invalid credentials |
| **Next** | `market` | Market page loads, Buy/Sell tab switching |
| **Soon** | `ads` | Create ad, edit ad, delete ad |
| **Soon** | `orders` | Buy order, sell order, order completion |
| **Later** | `profile` | Profile update, payment methods |
| **Later** | `wallet` | Balance display, transfer deep link |
| **Later** | `advertiser` | Advertiser profile view |

---

## How to Update This File

Ask AI to sync this file using `_orchestrator.md`:

```
Follow _orchestrator.md and sync _index.md.
```

AI will read all `coverage.md` files and `playwright/tests/` spec files, compute what's out of sync, and apply the correct edits. See `playwright/flows/_orchestrator.md` for the full instruction set.

---

## File Reference

| Module | flow.md | catalog.md | coverage.md |
|--------|---------|------------|-------------|
| auth | [flow](auth/flow.md) | [catalog](auth/catalog.md) | [coverage](auth/coverage.md) |
| market | [flow](market/flow.md) | [catalog](market/catalog.md) | [coverage](market/coverage.md) |
| ads | [flow](ads/flow.md) | [catalog](ads/catalog.md) | [coverage](ads/coverage.md) |
| advertiser | [flow](advertiser/flow.md) | [catalog](advertiser/catalog.md) | [coverage](advertiser/coverage.md) |
| orders | [flow](orders/flow.md) | [catalog](orders/catalog.md) | [coverage](orders/coverage.md) |
| profile | [flow](profile/flow.md) | [catalog](profile/catalog.md) | [coverage](profile/coverage.md) |
| wallet | [flow](wallet/flow.md) | [catalog](wallet/catalog.md) | [coverage](wallet/coverage.md) |
