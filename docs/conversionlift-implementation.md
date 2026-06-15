# ConversionLift — Implementation (as-built baseline)

> **This is the established baseline.** The screens, components, state, and mock
> layer below already exist and work. When extending ConversionLift, **build on
> these and reuse them** — do not rebuild from scratch. Keep this file fresh as
> the implementation evolves.
>
> Design intent: [conversionlift-spec-v1.md](conversionlift-spec-v1.md) ·
> Flows: [conversionlift-flows-v1.md](conversionlift-flows-v1.md)

---

## 1. Product & entry points

ConversionLift is registered as a **product** (`productDefinitions.conversionlift`
in `src/registry/index.js`, sky accent `#0EA5E9`). All code lives in
`src/conversionlift/`.

| View id | Route | What it is |
|---|---|---|
| `conversionlift` | `#/conversionlift` | **Dev Start** — registry-driven button grid of all ConversionLift views. |
| `conversionlift-design-guide` | `#/conversionlift-design-guide` | Design guide (tokens, shared components, domain badges). |
| `cl-flow-1` | `#/cl-flow-1` | **Flow A · Assistant-led** |
| `cl-flow-2` | `#/cl-flow-2` | **Flow B · Type-first** |
| `cl-flow-3` | `#/cl-flow-3` | **Flow C · Generate-first** |
| `cl-flow-4` | `#/cl-flow-4` | **Flow D · Assistant-led** (duplicate of Flow A, for divergence) |
| `cl-flow-5` | `#/cl-flow-5` | **Flow E · Library-first** (Flow D + library at the start) |
| `cl-flow-6` | `#/cl-flow-6` | **Flow F · Recommendations-first** (Analyzing → pick recommendations → Compose) |
| `cl-home` | `#/cl-home` | **Home** — left nav (Projects / A/B tests / Insights) + a greeting **assistant chat**. Generate's "Notify me & leave" lands here. |
| `cl-scope-1` | `#/cl-scope-1` | **Product-select variant 1** — list + category filters + checkboxes (precise manual) |
| `cl-scope-2` | `#/cl-scope-2` | **Product-select variant 2** — visual product grid, tap to select (visual manual) |
| `cl-scope-3` | `#/cl-scope-3` | **Product-select variant 3** — rule/segment builder (category + price + rating → live-matched set) |
| `cl-scope-4` | `#/cl-scope-4` | **Product-select variant 4** — hybrid: rule segment + per-row fine-tune (manual exclude) + Lock-at-launch/Keep-in-sync (recommended direction) |

All are registered in `src/registry/views.js` with `product: 'conversionlift'`,
and emit `navigate` (wired to `handleDevNavigate` in `App.vue`'s `eventsConfig`).
New ConversionLift views auto-appear on Dev Start (it lists `getProductViews('conversionlift')`).

**Terminology — what a "variant" is.** A **variant** is **one enhancement (e.g. a
benefit headline) applied across every targeted product page** — a single
experiment arm tested against the control. The AI generates a **per-page version**
of that variant for each product page (its own copy/image), but the whole set is
**one variant**, not many. So generation produces **one variant rendered across N
pages**; the per-page pieces are "page versions", never separate variants.
"Add a variant" (A/B test setup) means adding **another** such enhancement bundle
as a second test arm. Don't call the per-page generated pieces "variants". The
**Control↔Variant** preview toggle is a separate, unrelated use of the word.

---

## 2. The three flows (single-page, implicit product)

Each flow is **one view component** that holds a local `step` index and renders
shared step components inside `ClFlowShell` (top bar + step indicator). All flows
operate on **one implicit representative product** — no product picker, no bulk,
no connect (connect happens at launch, outside these flows).

| Flow | View | Steps (as built) |
|---|---|---|
| **A · Assistant-led** | `Flow1View.vue` | Site → **Optimize** (P+G) → Preview |
| **B · Type-first** | `Flow2View.vue` | Site → **Library** → **Place & refine** → Preview |
| **C · Generate-first** | `Flow3View.vue` | Site → **Library** → **Place** → Preview |
| **D · Assistant-led** | `Flow4View.vue` | Site → **Compose** (merged optimize + preview) → **Launch** (ready-to-launch confirmation). |
| **E · Library-first** | `Flow5View.vue` | Like Flow D but with a **Library at the start** (Flow B's `CLBlockLibraryStep` in **`multi` mode — pick several enhancements, one version each**): Site → **Library** → **Compose** → **Launch**. The picks are **seeded into the Compose editor** (`CLComposeStep` `seeds` array prop — added as extra items alongside the scan suggestions; they stack rather than swap). |
| **F · Recommendations-first** | `Flow6View.vue` | Site → **Analyzing** (~3.8s) → **Recommendations** (`CLRecommendStep`, pick one) → **Compose** (`include` = the pick) → **Scope** (`CLScopeStep`, rule + fine-tune → targeted products) → **Audience** (`CLAudienceStep`, who's entered into the test) → **Generate** (`CLGenerateStep`, bulk progress) → *(Review → experiment → connect → launch: TBD placeholder)*. Steps are hash-routed (`#/cl-flow-6/<slug>`). |

Step → component map:

| Step | Component | Role |
|---|---|---|
| Site (U) | `CLAddDomainStep.vue` | URL only + mock "analyze". Platform is **auto-detected by the AI**, never asked of the user. |
| Library (Flow C) | `CLEnhancementLibraryStep.vue` | **Category-level enhancement library** (5 illustrated cards — photo for hero/gallery, icon tile for text). Clicking a card **advances immediately** (no confirm button) and carries the enhancement's representative `content` + `location` straight to placement. |
| Library (Flow B) | `CLBlockLibraryStep.vue` | **Illustrated enhancement library** (`data/blockLibrary.js`) — concrete enhancements (Benefit headline, **Image with badges**, Trust badges, Benefit bullets, **Benefit list with image**) shown as image/mock previews. Headline / Trust / Bullets have a **single** version and share **one divider-separated row**; Image-with-badges and Benefit-list-with-image have several **style versions** and get their own sections below. The version card is the shared `ClLibraryCard.vue`. UI term is "enhancement" (the data export is still `blockLibrary`). The chosen version carries `location` + `content_type` + `content`. A **`multi` prop** (Flow E) lets the user pick **several enhancements at once** (one version each) and emits an **array** of selections. |
| Place & refine (Flow B) | `CLRefineStep.vue` | The chosen enhancement shown **in-context on the store page**; other content-type-appropriate positions are clickable **zones** (move it), and a **chat rail** refines the content (shorter / another image / bolder). |
| Optimize (P+G) | `CLOptimizeStep.vue` | **In-context suggestions on the store page** (numbered pins) + a suggestions panel (no chat, no dropdown/Accept button). **Click a card or its on-page pin to add** it — generates and applies in-context (green ring); click again to remove. Add as many as you like; Continue carries all to Preview. |
| Place (C) | `CLPlacementStep.vue` | Pick a position **on the store page** (zones). Pre-selects the enhancement's own location (`suggestedLocation` prop). |
| Preview (V) | `CLPreviewStep.vue` | The store page with **one or more** applied changes (`items` array), Control↔Variant toggle, and an **AI chat rail** to refine the applied content (shorter / another image / bolder). Used by flows A/B/C. |
| Scope (Flow F) | `CLScopeStep.vue` | **Rule-first product targeting**: a segment rule (category / price / rating + "only in stock" / "only with traffic"), live match count, **Lock-at-launch / Keep-in-sync**, and a **manual fine-tune** list (exclude per product) with **Import CSV** + **sort**. Emits the targeted products. Standalone preview: `#/cl-scope-4` (the other `cl-scope-*` are alternative explorations). |
| Audience (Flow F) | `CLAudienceStep.vue` | **Audience targeting** for the experiment with **mixed logic via condition groups**: each group has its own `ALL`/`ANY` over attribute + operator + value rows, and groups are combined by an outer `AND`/`OR` — e.g. `(New AND Mobile) OR (Returning AND Desktop)`. Add/remove conditions and groups. **No conditions = everyone**; a mock **estimated reach %** is computed per-group then combined. Attributes: visitor type, device, country, traffic source, browser, landing-page URL, cart value, sessions, days-since-visit. Standalone preview: `#/cl-audience`. |
| Generate (Flow F) | `CLGenerateStep.vue` | **Bulk generation progress** over the targeted products (**~30s per product**, sim via `useGeneration.js`): a prominent **banner CTA** ("We've started generating your variant" + **"Notify me & leave"** → emits `leave`), progress + ETA, **Pause / Cancel**, and the **full product list** with live per-page status (done / writing / queued — one **page version** of the variant per product). On completion the banner turns green ("Your variant is ready across all N pages") with a clear **"Review variant"** CTA (emits `next`). Standalone preview: `#/cl-generate`. |
| Recommendations (Flow F) | `CLRecommendStep.vue` | **Review + pick** screen: **left = the store page with every recommendation already embedded** (preview, so the user can see/understand each); **right = itemized recommendation cards** (name + type + rationale, none selected by default, **single-select — one at a time**). **Clicking a card — or clicking the embedded enhancement on the page itself** (`ClStorePage` `selectable` → regions clickable, no toolbar) — **selects it AND scrolls the page to that enhancement** (`scrollToEntry` via `data-entry`), and the selected enhancement is **highlighted on the page** (sky ring via `focusedId`); clicking the selected one again deselects. (`ClRegion` applied regions show the sky active ring whenever `active`; the **"Variant" corner tag was removed** everywhere.) A **Next** button in the flow header (teleported to `#cl-topbar-end`) carries the picked id to Compose (`include`). |
| Compose (Flow D) | `CLComposeStep.vue` | **Merged optimize + preview.** Top bar (`ClFlowShell`) = logo + **Back** (after the logo) + (teleported into `#cl-topbar-end`) the **Control↔Variant** toggle, a **Preview** button, and a **Next** button (emits `next`); no product selector, no title, no step indicator. **Left = chat:** each content is a **borderless card in the chat flow** (heading + description only — no controls on the card; the **whole card is clickable** to focus the element). **Once the chat starts, the cards collapse to sticky chips** at the top (each chip **toggles focus** on click, shows the **card view in a hover tooltip**, and the focused chip is the **context indicator** with an **X to deselect**); the messages flow below. A **hidden** enhancement stays in the chip bar as a greyed, struck-through chip with a **"Show" affordance** — clicking it **un-hides** the enhancement (re-enables, focuses, and scrolls to it). Bigger textarea input with inline submit (no context pill — **the focused chip is the context indicator**); refinement is **scoped** to the focused element; **per-enhancement quick-refinement suggestions** (the `REFINEMENTS` map — each element gets its own fitting tags). **Right = wider store page** (chrome = grey dots + URL, no refresh). **Variant** applies all enhancements; **Control = clean original (no embeds)**. **Editing lives only on the page**: selecting a **text element** (title / trust / bullets) opens a floating **editor popover** above it (`ClTextToolbar`) — a **formatting row** (font family, size stepper, bold, align, colour swatches, list/link/highlight/bg controls — no leading text-type button), plus the **hide** button and, when the element has more than one position, a **Position stepper** (`N/total`). (Refinement-by-prompt happens in the left chat, not in the popover.) Style is **applied to the in-page text live** (`style` per item → inline CSS via `css()`/`ClEmbed`). The popover is rendered inside the scroll container and its left is **clamped so it never overflows the page**. **Every** selected element opens the popover with the prompt input; the **image-with-badge** element shows the popover too (prompt input + position stepper + hide, but no text-formatting row, via the `isText` prop). **Selecting an element on the left (card/chip) scrolls the page on the right to it** (`scrollToEntry` via each region's `data-entry`); in chip form the focused chip shows a **filled selected state**. **Positions** (`ENHANCEMENT_POSITIONS` in `CLComposeStep.vue`, first = each element's default): **Product title** is single-spot (no stepper, hide only). The other **three repositionable elements — Below add-to-cart, Description bullets, Image with badge — share the same set of positions** (`Below add-to-cart` / `Description bullets` / `Above the details` / `Image with badge`); the **product-image swap (Gallery) is deliberately excluded**. Per-element ordering just puts each one's natural spot at Position 1. **Elements never swap**: when two land on the same spot they **stack** one under the other (`regions` groups items by anchor into an array; `ClEmbed` renders each entry generically — image+badge, a ` · ` badge-row, or a newline bullet-list — so any element renders cleanly at any spot). Changing position **smooth-scrolls the page to the new spot** (each region has a `data-anchor`); **clicking empty page area deselects**. A **floating hint pill** shows once and never returns after the first selection. **Image-with-badge** renders the image with a **badge** (3 short, semi-transparent pills + check icon). A **Preview** button in the top bar hides the left panel, makes the page **full-width** and **frameless** (`ClStorePage` `frameless` → no rings/overlays, content shown inline). **Single-element mode** (when only one enhancement is present, e.g. Flow F's one picked recommendation): no cards/chips and **no manual selection** (`hideable` off) — the one element is **auto-focused**, so the **editor toolbar shows by default** over it (no Hide button, via `canHide`), the page **auto-scrolls to it** on load, and the AI greets with "What would you like to change…" (chat edits scope to the element). |

---

## 3. The in-context store page (the key idea)

**Suggestions and placements are shown on a realistic product page**, not in a
detached card list. It should read like the merchant's real site, scraped after
domain entry.

- **`ClStorePage.vue`** — a complete, clean outdoor-store PDP ("PeakGear") inside
  a **browser frame** (traffic-light dots + address bar). Real imagery from the
  Unsplash CDN (`data/storeImages.js`): gallery (main + thumbnails), related
  products, lifestyle hero. Sections: header/nav, breadcrumb, gallery, title,
  rating, price (+ compare-at), colour/capacity, ATC + wishlist, description tabs,
  related products, footer.
- **`ClEmbed.vue`** — generic content renderer for one applied enhancement entry
  (image+badge pills / image+benefit-list / plain image / ` · ` badge-row /
  newline bullet-list, with the text-toolbar inline style applied). Used inside `ClRegion` for `applied` entries on the
  store page, so any enhancement renders cleanly at any anchor (and entries can
  stack at one anchor).
- **`ClRegion.vue`** — overlay wrapper around an anchored page region, driven by a
  `regions` prop. Three visual states:
  - `pin` — numbered sky pin + ring (a suggestion sits here),
  - `zone` — dashed outline + "AI suggests" tag (a placement target, Flow C),
  - `applied` — green ring + "Variant" tag (generated content shown in place).

**Anchors** (page regions) and the `location → anchor` map used everywhere:

| Optimization `location` | anchor |
|---|---|
| `Product title` | `title` (replace) |
| `Below add-to-cart` | `belowAtc` (embed) |
| `Description bullets` | `description` (replace) |
| `Image with badge` | `hero` (embed) |
| `Above the details` | `aboveTabs` (embed, above the Description/Spec/Reviews tabs) |
| `Gallery` | `gallery` (embed) |

`ClStorePage` props: `regions` (object keyed by anchor; each value is **either a single region** `{ state, index, content, location, label, suggested }` — flows A/B/C — **or an array of stacked entries** `{ id, state, content, location, positions, style }` — Flow D), `activeAnchor` (flows A/B/C, active-by-anchor), `focusedId` (Flow D, active-by-id), `previewMode` (`control`|`variant`), `url`, `hideable`. Emits `region` / `hide` / `position` / `style` carrying the entry `id` when present (Flow D) else the anchor (flows A/B/C). In `control` preview mode, `applied` entries are suppressed (originals show).

---

## 4. Shared flow infra

| Component | Role |
|---|---|
| `ClFlowShell.vue` | Top bar (ConversionLift + flow title + exit) and the step indicator. Wraps every flow. Emits `exit`. |
| `ClChatRail.vue` | Inline AI chat rail (messages + suggestion chips + input). Emits `send`. Used in **Preview** (all flows) and Flow B's **Place & refine** to refine content. (Flow A's Optimize has no chat.) |
| `ClTextToolbar.vue` | Floating **editor popover** for a selected **text** element in Compose: a rich-text formatting row (font / size / bold / align / colour + visual controls) + hide + position stepper (no prompt input — that lives in the left chat). Emits `update` (style patch), `hide`, `step`. Positioned + clamped by `CLComposeStep`. |
| `ClStorePage.vue` / `ClRegion.vue` | See §3. |

---

## 5. Data & mock layer (AI-agnostic contract)

| File | Exports |
|---|---|
| `data/catalog.js` | `catalogs`, `getCatalog(domainId)` — deterministic per-domain product catalogs (peakgear 36, glowskin 24). |
| `data/domains.js` | `demoDomains` (glowskin = connected, peakgear = not_connected), `getDomain`. |
| `data/optimizations.js` | `demoOptimizations`, `getOptimizations(domainId)` — the 4 scan suggestions (peakgear). |
| `data/analytics.js` | `demoExperimentResult` — one live experiment's aggregated lift + significance + 14-day series. |
| `data/placeholder.js` | `placeholderImage(label, seed)` — offline SVG data-URI (used for generated image content). |
| `data/storeImages.js` | `storeImages` — real Unsplash CDN photos for the PDP. |
| `mockGenerate.js` | `scan(domainId)`, `generate(optimization, products)`, `chatReply(message)`. |
| `flowDemo.js` | Flow wiring: `DEMO_DOMAIN` (peakgear), `representativeProduct()`, `getScan()`, `genContent()`, `CONTENT_TYPES`, `cardMatchesType()`, re-exports `generateOptions`/`chatReply`. |
| `composables/useConversionLift.js` | Workspace-level state (active domain, optimizations, scope, generated items, experiment draft) — for the broader bulk tool; the single-page flows mostly use `flowDemo.js`. |

**Demo wiring:** flows back onto the **peakgear** demo data (the typed URL is
cosmetic). The representative product is `getCatalog('peakgear.example')[0]`.

**To swap in a real AI later:** replace the bodies of `scan` / `generate` /
`generateOptions` / `chatReply`; the return shapes are the contract, so the UI is
unchanged. Images: `storeImages` (Unsplash CDN, needs network) for the PDP;
generated-image content uses `placeholderImage` (offline).

---

## 6. Styling / theming

- ConversionLift uses **OptiMonk `om-*` tokens** with a **sky brand**. The semantic
  primary (`--om-primary*` in `src/style.css`, default om-orange) is overridden to
  sky under `html.cl-theme`, which `App.vue` toggles when the active product is
  ConversionLift. Generic shared primitives (Button, Checkbox, FormInput, Dropdown,
  etc.) inherit it → sky inside ConversionLift, orange in OptiMonk.
- The **store page itself** uses a neutral merchant palette (slate + forest-green
  accent) — it's the customer's site, not ConversionLift chrome.
- `tokens.js` / `conversionlift.css`: design-guide token mirror + `--cl-accent-*`.

---

## 7. Conventions when extending

- **Reuse** `ClStorePage` + `ClRegion` for anything that shows content on the page;
  reuse the step components and `ClFlowShell`; reuse `shared/` primitives (Button,
  Tag, Dropdown, FormInput…) per the repo Component Reuse Rule.
- Keep the **mock contract** (`scan`/`generate`/`generateOptions`/`chatReply`) shapes
  stable.
- New flow screens: add a step component in `components/`, render it from the flow
  view inside `ClFlowShell`, advance via local `step`.
- New top-level views: register in `views.js` (`product: 'conversionlift'`), wire
  `navigate` in `App.vue` — they then auto-appear on Dev Start.
