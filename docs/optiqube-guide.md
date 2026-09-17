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
| `/session-v2` … `/session-v5` | `SessionV2–V5Screen` | prototype-only: parallel runs, see below |
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

Clicking one of the four concepts opens `OqConceptOverlay`, ported from the
product's `SessionConceptOverlay` over `ConceptOverlay`: step 1 is the direction on
the seed product, step 2 the same direction on two more (the pair is changeable), step
3 the draft campaign. Notes and Try chips refine what is on screen, and the window can
be put down in the corner — which is why its whole state lives in `conceptOverlay` in
`store.js` and the component only draws it. The shell mounts it, not `SessionScreen`,
so the corner card survives walking off to another screen.

### Four takes on the concept click

The overlay is the product's own answer, and it has two costs: it covers the thread,
and it holds the session for the minute its round takes — so the other three
directions cannot be tried until it lands. `/session-v2` … `/session-v4` are the
alternatives, all three built on the same `runs` model in `store.js`: a click starts a
run on three products, runs tick side by side on their own timers, and the session's
own composer stays the only place anyone types. It talks to the session by default; a
chip appears on it when the note names a run, when a run is clicked, or when one was
just worked on in a window; clicking that run again — or the chip's own ✕ — goes back
to the session, and so does putting V5's window down. A turn
about a run carries that run's name in the thread. A round is a block: the first
one when the run starts, and one more for every note — the block above keeps the
pictures it was asked about, so the thread reads as the history of the direction.
A finished run is placed with **Use this**, which asks in two steps
(`OqCampaignPicker`): an existing campaign or a new one, and then either which campaign
and which of its ad sets — an ad lives in an ad set — or the new campaign's name.
Campaigns drafted in the session join the list, so a second run can go into the first
one's campaign. The run stays in the thread either way, so it can be used twice. They differ only in where a run is drawn — and V5 in whether there is also a
window to open one in: it keeps the original's big frames and step strip, but the
window is a lens over a run that lives in the thread, and its right-hand column is the
session's own turns about that run rather than a second chat. `startRun(concept,
{ stage: 'one', open: true })` is what makes V5's click behave like the original's.

| Path | Screen | Where the runs live |
|------|--------|---------------------|
| `/session` | `SessionScreen` | V1 — the ported overlay, one at a time |
| `/session-v2` | `SessionV2Screen` | inline in the thread, where they were started |
| `/session-v3` | `SessionV3Screen` | a tabbed panel beside the chat (the tab is the scope) |
| `/session-v4` | `SessionV4Screen` | a rail above the composer, one card unfolds at a time |
| `/session-v5` | `SessionV5Screen` | inline like V2, plus the original's window as a lens over one run |

**Gotcha:** the blocks live in a `reactive` array. Mutating a block you still hold
a reference to from before the `push` does nothing — Vue only tracks writes made
through its proxy. Read the block back out (`session.blocks[session.blocks.length - 1]`)
and mutate that.

## Components

OptiQube has its **own component set** in `src/optiqube/components/`, prefixed
`Oq*`:

| Component | Purpose |
|-----------|---------|
| `OqConceptOverlay` | The original's window on a concept card — panel and corner card |
| `OqRunOverlay` | V5's window: one run large, over the session's own turns |
| `OqProductPicker` | The 3 products a direction is generated on |
| `OqCampaignPicker` | Where a finished run goes: existing campaign + ad set, or a new one |
| `OqSessionHeader` | Session title bar: rename in place, what it is doing |
| `OqSessionThread` | The session thread the V2–V4 screens share |
| `OqSessionComposer` | The session's one input, with the scope pill |
| `OqRunScope` | The composer's chip: which run the next note is about |
| `OqRunDetail` | One run opened up: three creatives + its actions |
| `OqRunCard` | One run at a glance: thumbnails, progress, state |
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
