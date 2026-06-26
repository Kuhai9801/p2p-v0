# Deriv P2P — Web App

Web application for the Deriv P2P. Built with Next.js 15 App Router and React 19, deployed on Cloudflare Pages.

## Project Structure

```
p2pv0/
├── app/                        # App Router pages & route handlers
│   ├── page.tsx                # Markets (home)
│   ├── ads/                    # My Ads
│   ├── advertiser/             # Advertiser profile
│   ├── orders/                 # Orders
│   ├── profile/                # User profile
│   ├── wallet/                 # Wallet & transfer
│   ├── login/                  # Auth (Ory Kratos)
│   ├── api/                    # Route handlers (proxy to Kratos etc.)
│   └── layout.tsx
├── components/                 # Feature & shared components
│   ├── ui/                     # Radix primitives (Button, Dialog, Tabs, ...)
│   ├── buy-sell/
│   ├── order-details/
│   ├── market-filter/
│   └── ...
├── hooks/                      # Custom hooks (use-api-queries, use-websocket, ...)
├── stores/                     # Zustand stores
├── services/api/               # API client (Ory + P2P backend)
├── contexts/                   # React contexts (websocket, alert-dialog, ...)
├── lib/
│   ├── i18n/translations/      # 12 locale JSON files (en, de, es, fr, ...)
│   └── utils.ts
├── analytics/                  # Event tracking helpers
├── public/icons/               # SVG/PNG assets
├── playwright/                 # E2E tests
└── __tests__/                  # Jest unit/integration tests
```

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Commands

```bash
pnpm dev               # Start dev server
pnpm build             # Next.js build + Cloudflare Pages adapter (next-on-pages)
pnpm lint              # ESLint via next lint
npx tsc --noEmit       # TypeScript typecheck
pnpm test:e2e          # Playwright E2E tests (headless)
pnpm test:e2e:ui       # Playwright with interactive UI
pnpm test:e2e:headed   # Playwright in headed browser mode
pnpm test:e2e:debug    # Playwright debug mode
```

## Key Patterns

### State management

- **Server state** — React Query via `hooks/use-api-queries.ts`. Default 2-minute staleTime for balance queries.
- **Client state** — Zustand stores (`useUserDataStore`, `useMarketFilterStore`, `useOrderSidebarStore`). Use selectors to minimise re-renders.
- **Local UI state** — `useState` / `useReducer` inside components.

### API layer

All API calls go through `services/api/`. Each file maps to a backend domain (`api-auth.ts`, `api-buy-sell.ts`, `api-chat.ts`, ...). React Query hooks in `hooks/use-api-queries.ts` wrap these for data fetching.

### i18n

`useTranslations()` returns `{ t, locale }`. `t(key, params?)` resolves dotted keys (e.g. `"market.noBalanceTitle"`). English is the fallback for missing keys.

When adding a new string:
1. Add to `lib/i18n/translations/en.json` (required).
2. Add translated values to all other locale files (`bn, de, es, fr, it, ko, pl, pt, ru, sw, vi`).
3. Never hardcode user-facing strings in components.

### UI components

- Use `components/ui/` Radix wrappers (Button, Alert, Dialog, Tabs, ...) — never use raw HTML buttons or custom modals when a primitive exists.
- Follow the `cva` variant pattern for new primitives.
- Tailwind-first. Use design tokens from `tailwind.config.ts` (`bg-error-light`, `text-grayscale-100`, ...) — never hardcode hex colors.

### WebSocket

Single shared `WebSocketContext` wraps the whole app. Subscribe from components via `useWebSocketContext()`. Channels: `users/me`, `adverts/currency/{currency}/{type}`, `users_online`. Filter callbacks on `data.options.channel` before reading the payload.

### Auth (Ory Kratos)

Login: `GET /self-service/login/api` → `POST /self-service/login?flow={flowId}`. Session token passed via `X-Session-Token` header. See `services/api/api-auth.ts`.

### Routing

App Router. Use `useRouter()` / `useSearchParams()` / `usePathname()` from `next/navigation`. Deep links use URL search params (e.g. `/wallet?operation=TRANSFER`). Call `router.replace()` after consuming a deep-link param to keep the URL clean.

## pnpm Lockfile Policy

**Never edit or commit `pnpm-lock.yaml` / `pnpm-workspace.yaml` unless `package.json` intentionally changed.** If a hook or install accidentally modified lockfiles, revert before committing:

```bash
git checkout -- pnpm-lock.yaml pnpm-workspace.yaml
```

## Verification (run before PR)

```bash
npx tsc --noEmit   # typecheck
pnpm lint          # eslint
pnpm test:e2e      # playwright
```
