# OptiQube — project guide

Standalone prototype under `src/optiqube/`, rebuilt from the real product. Read this
before working on OptiQube. Repo-wide rules (commit, archive, registry, deployment)
come from the root [CLAUDE.md](../CLAUDE.md) and still apply here.

## What this is

A faithful Vue rebuild of the **customer-facing OptiQube app** — the React product
that lives in `/Users/majorosmark/Work/optiqube` (`client/src/`). Layout, copy,
tokens and interaction are taken from that source; the data behind them is mock.

**Deliberately out of scope:**

- The internal **Ops** tool (`/ops/*` in the product) — 11 sections of admin.
- The `lab/*` experimental pages and the dev-only `proto` route.

When a screen needs checking against the original, the source file is named in the
table below. The real app is React 18 + Vite + wouter + Tailwind; the port keeps the
same class names and inline token styles, so the two read side by side.

## Where things live

| Thing | File |
|-------|------|
| Design tokens (CSS) | `src/optiqube/optiqube.css` — the `--oq-*` set, light and dark |
| Design tokens (JS mirror) | `src/optiqube/tokens.js` — `BRAND`, shadows, logo, font |
| App shell + internal router | `src/optiqube/OptiqubeAppView.vue` |
| Screen picker (dev entry) | `src/optiqube/OptiqubeDevStartView.vue` |
| Mock data + state + flows | `src/optiqube/store.js` |
| Components | `src/optiqube/components/` — `Oq*` |
| Screens | `src/optiqube/screens/` |
| Creative images | `public/optiqube/inspiration/` (the product's own gallery set, downscaled) |

## Tokens

The whole `--oq-*` token set is ported, light **and** dark. It is scoped to
`.oq-root` rather than `:root`, because this prototype shares a document with the
other products in this repo — never move it to `:root`.

Read tokens through `BRAND` in `tokens.js`, never as raw hex. The `gray*` names
describe the light-mode origin, not the rendered colour: `gray200` is the hairline
rule, `gray100` a sunken fill, `gray50` a subtle one.

Dark mode is a `data-oq-theme="dark"` attribute on the root, toggled from the
sidebar (a prototype affordance — in the product the theme lives in account
settings, which this port also has under Personal details).

## Routing

There is no router library. `store.js` holds `state.path` as the product's
nest-relative path (`/campaigns/cmp_1/ads/ad_1`), and `navigate(path)` moves
between screens. `OptiqubeAppView.vue` maps a path to a screen and decides two
things:

- **`bareScreens`** — auth and account settings render without the product
  sidebar, matching the routes that sit above `/app/:accountId` in the product.
- **`fillMain`** — screens that own their height (the catalog grid, the session
  thread) instead of scrolling inside `main`.

`isSection()` in the store carries the sidebar's active-nav rules verbatim,
including the one that keeps `/campaigns/:id/products` out of the Campaigns
section.

## Screens

| Path | Screen | Ported from |
|------|--------|-------------|
| `/agentic` | `AgenticHomeScreen` | `pages/agentic.tsx` |
| `/session` | `SessionScreen` | `pages/agentic-session.tsx` |
| `/campaigns` | `CampaignsScreen` | `pages/campaigns.tsx` |
| `/campaigns/:id` | `CampaignWorkspaceScreen` | `components/CampaignWorkspace.tsx` |
| `/campaigns/:id/ads/:adId` | `CampaignAdScreen` | same, ad half |
| `/campaigns/:id/bulk` | `BulkScreen` | `pages/bulk.tsx` |
| `/campaigns/:id/handoff` | `HandoffScreen` | `pages/handoff.tsx` |
| `/library` | `LibraryScreen` | `pages/library.tsx` |
| `/products` | `ProductsScreen` | `pages/catalog-products.tsx` |
| `/help/meta-feeds` | `HelpMetaFeedsScreen` | `pages/help-meta-feeds.tsx` |
| `/settings` | `SettingsScreen` | `pages/settings.tsx` + `BrandKitCard` |
| `/settings/catalog` | `SettingsCatalogScreen` | `pages/settings-catalog.tsx` |
| `/settings/meta` | `SettingsMetaScreen` | `pages/settings-meta.tsx` |
| `/onboarding` | `OnboardingScreen` | `pages/onboarding.tsx` |
| `/login` `/register` `/forgot-password` `/reset-password` `/verify-email` `/invite` | the matching `*Screen` | the matching page |
| `/account/*` | `Account*Screen` | `pages/account-*.tsx` |

## The session flow

`SessionScreen` is the product's core, so it is interactive rather than static.
`store.js` drives it with a script that walks the real phases: pick a campaign
type → pick a seed product → a progress block whose steps land one at a time →
four concepts → apply across the catalog, where the cells fill in one by one.

**Gotcha:** the blocks live in a `reactive` array. Mutating a block you still hold
a reference to from before the `push` does nothing — Vue only tracks writes made
through its proxy. Read the block back out (`session.blocks[session.blocks.length - 1]`)
and mutate that.

## Components

OptiQube has its **own component set** in `src/optiqube/components/`, prefixed
`Oq*`:

| Component | Purpose |
|-----------|---------|
| `OqBrandSwitcher` | Store switcher in the sidebar |
| `OqUserMenu` | Account menu with plan + credits |
| `OqWizardChrome` | Settings wizard frame (title, steps, back) |
| `OqChoiceCard` | Selectable card in a wizard |
| `OqAccountLayout` | Account settings page frame with its own nav |
| `OqCampaignThumb` | Campaign row thumbnail / style placeholder |
| `OqStatusChip` | Campaign status pill |
| `OqToggle` | Toggle switch |
| `OqWordmark` | Theme-aware logo |
| `OqGoogleSection` | Google button + "or" rule |
| `OqPasswordStrength` | Password strength meter |

**Use the `Oq*` components inside OptiQube, not the shared
`src/components/shared/` catalog.** They follow the OptiQube token system. If a
screen needs a component that doesn't exist yet, create it in
`src/optiqube/components/` as an `Oq*` component following the existing ones.

## Conventions

- Colours and type come from `tokens.js` — never arbitrary Tailwind defaults.
- Keep the product's own copy. The wording on these screens was written for it;
  rephrasing it silently makes the prototype stop being a reference.
- New OptiQube views still follow the
  [Adding New Views](../CLAUDE.md#adding-new-views) steps. OptiQube entries use
  `product: 'optiqube'`. Two are registered: `optiqube-dev-start` (the screen
  picker) and `optiqube` (the app, `matchPrefix: 'optiqube'`).
