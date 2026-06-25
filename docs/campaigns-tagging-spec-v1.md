# Campaign Tagging & Saved Views — Spec v1 (prototype-driven)

> **Goal:** document the problem, the chosen solution, and the open design fork for the
> `campaigns-v3-tagging` prototype. Scope is the OptiMonk-style campaigns list. All state is
> static/local, consistent with the rest of this repo.
>
> **Prototype views:**
> - v1 (bottom-up): `/#/campaigns-v3-tagging` — `src/views/CampaignsV3TaggingView.vue`
> - v2 (top-down): `/#/campaigns-v3-taggingv2` — `src/views/CampaignsV3TaggingV2View.vue` (see §7)

---

## 1. The problem

Users with many campaigns can't manage or find them in the list. Today they cope by
**stuffing organizational hints into the campaign name** — e.g. `Black Friday`, `2026`,
`Spring`. That workaround is a strong signal of a missing data layer:

- A single campaign often needs **multiple, overlapping labels** at once (`Black Friday` **and**
  `2026` **and** `Email`).
- Users want to **group and find** campaigns by these labels, not just read them.
- The name field is overloaded because there's **no dedicated place** for this metadata.

**Jobs-to-be-done:** (1) categorize a campaign in more than one way, (2) filter the list down to
a category fast, (3) operate on a whole group at once.

### Why the naming workaround is the wrong tool

- **Brittle & inconsistent** — `BF`, `Black Friday`, `blackfriday` don't match; no shared vocabulary.
- **Can't filter** — only `search`, and search on a polluted name is noisy.
- **One dimension only** — a name can't cleanly express "both 2026 and Spring."
- **Clutters the UI** — long prefixed names dominate the card.

---

## 2. Options considered

| Option | Fit | Tradeoff |
|---|---|---|
| **Tags / labels (many-to-many)** | ★ Strong | Needs a small filter + management UI |
| Folders (one-to-many) | Weak | A campaign lives in *one* folder — breaks the `2026` + `Spring` overlap |
| Custom columns / fields | Overkill | Heavier data model than the problem needs |

The naming hack is essentially a hand-rolled **many-to-many tagging system**, so **tags are the
natural, lowest-friction fit**. Folders would be a regression.

---

## 3. The solution (built in v1)

Two complementary primitives:

- **Tags** = explicit, many-to-many labels the user assigns. Fixes the root cause, kills the
  naming hack. *(the data layer)*
- **Saved views** = a stored snapshot of filter criteria, surfaced as one-click chips.
  *(the access layer)*

> Principle: **tags are durable data; views are disposable, shareable lenses on top.** Neither
> re-creates the brittle naming hack.

### 3.1 Two-tier control bar

```
┌─ VIEWS (saved filters) ───────────────────────────────────────────────┐
│  All  Active  Inactive  Archive  ┊  Black Friday 2026 ✕  VIP ✕         │
│                                   ↳ when modified: Update · Save as new · Reset │
└────────────────────────────────────────────────────────────────────────┘
┌─ REFINE (ad-hoc) ─────────────────────────────────────────────────────┐
│  [Domain ▾]   [🔍 Search]   [🏷 Tags ▾ (multi)]          [⇅ Sort] [📅 Time] │
└────────────────────────────────────────────────────────────────────────┘
```

- **Tier 1 — Views:** the old status filters (`All / Active / Inactive / Archive`) are now the
  first four **system views**. Custom views follow after a divider, each with an inline `✕` to
  delete. **Single-select** — the user is always in exactly one view.
- **Tier 2 — Refine:** domain, search, and a **Tags multi-select**, plus sort/time.

### 3.2 Criteria-based saved views

A view is a snapshot of `{ status, tags[] }`. Selecting a view applies its criteria to the list.
When the current selection diverges from the active view, an **"Unsaved changes"** affordance
offers:

- **Update "name"** — overwrite the active custom view's criteria (custom views only).
- **Save as new view** — open a modal, name it, persist current criteria as a new view.
- **Reset** — revert to the active view's saved criteria.

Status is owned by views (set via system views); tag changes drive the "modified" state.

### 3.3 Tags

- **On cards:** color-coded pills under the campaign name, each with an `✕` to remove.
- **Inline editing:** a `+ Tag` popover toggles existing tags or creates a new one on the fly.
- **Auto-color:** each tag's color is derived by **hashing its name** → stable, distinct, zero-config.
- **Search-aware:** search matches tag names as well as campaign names.
- **Filtering semantics:** multiple selected tags are **AND** (campaign must have all of them).

### 3.4 Supporting component changes

- `Tag.vue` — optional `color` hex prop for soft auto-tinted pills.
- `CampaignCard.vue` — optional `#tags` slot in both list and grid variants (no effect on other views).

---

## 4. Data model (prototype sketch)

```js
// each campaign gains:
campaign.tags = ['Black Friday', '2026']

const savedViews = [
  { id: 'all',    label: 'All',    system: true,  criteria: { status: 'all',    tags: [] } },
  { id: 'active', label: 'Active', system: true,  criteria: { status: 'active', tags: [] } },
  // …inactive, archive…
  { id: 'bf26',   label: 'Black Friday 2026', system: false, criteria: { status: 'active', tags: ['Black Friday','2026'] } },
]
```

---

## 5. Open design fork — view creation flow

Two philosophies for how a view is born (decision pending):

| | **Bottom-up (current)** | **Top-down (proposed)** |
|---|---|---|
| Flow | Filter ad-hoc → "Save as new view" promotes current state | "+ New view" → builder modal: name + tags/status → save |
| Mental model | "Keep what I'm looking at" | "Author a view deliberately" |
| Rename / edit | Not built | Falls out for free — same builder reopens to edit |
| Cost | Fast but ambiguous | Intentional, a couple more clicks |

**Sub-decisions for the top-down approach:**

1. **Refine Tags filter** — keep as transient ad-hoc filtering (recommended), or remove so views
   are the only way to filter by tags?
2. **Builder scope** — name + tags only, or also let users set status?

---

## 6. Deferred (not in v1)

- Bulk-tagging from the multi-select bar.
- ~~"Suggest tags from existing names" migration helper (scan names for `Black Friday`, `2026`, …).~~ → implemented in v2 as **AI suggested tags** (see §7.1).
- Tag management (rename / recolor / merge tags globally).
- Drag-to-reorder views; view sharing across teammates.

---

## 7. v2 — top-down filter builder (`campaigns-v3-taggingv2`)

v2 resolves the §5 fork in favor of the **top-down** philosophy: filters are *authored
deliberately* instead of being promoted from ad-hoc state.

- **Filter controls cluster:** two **icon-only** ghost buttons (a **+** for new filter and a
  **pencil** for edit mode, each with a tooltip) sit together as a control group directly after
  the chips (left-aligned, separated from the chips by a divider). Keeping the two affordances
  adjacent communicates that both act on the saved-filter set.
- **New filter (+)** opens a **builder modal** (name + tags). Saving creates a new saved filter
  and activates it. In edit mode it stays visible but **disabled** (dimmed) so the cluster width
  is stable.
- **Edit mode (pencil toggle):** since rename/delete are rare, the chips stay clean by default.
  The pencil toggle in the controls cluster enters *edit mode* (active styling while on). While on:
  clicking a custom filter opens the builder pre-populated (rename / modify, no filtering); each
  custom chip shows an **✕** to delete; system views are dimmed and inert. In normal mode,
  clicking a chip just applies the filter.
- The old bottom-up **"Unsaved changes → Update / Save as new / Reset"** affordance is removed —
  authoring now lives entirely in the builder + edit mode.

**Resolved sub-decisions (from §5):**

1. **Refine Tags filter** — *kept* as transient ad-hoc filtering, alongside saved filters.
2. **Builder scope** — *tags only*. New custom filters use `status: 'all'`; status remains owned
   by the four system views.

### 7.1 AI suggested tags

v2 adds an AI-assisted path for the cold-start tagging problem: users with many untagged
campaigns get suggested tags instead of labeling everything by hand. Suggestions are
**proposed, never auto-applied**.

- **Entry point:** a small **Sparkles** button on each campaign card ("Suggest tags with AI")
  opens a **"Suggested tags"** review modal.
- **Scope toggle:** **This campaign** / **All in this view (N)** — switching scope re-runs the
  analysis. Opening from a card starts in *single* scope; *list* scope covers the current
  `filteredCampaigns`.
- **Generation:** a **mock heuristic over campaign name + metrics** (`tagKeywordMap`, e.g.
  `black friday` → `Black Friday`, plus a `High performer` tag for high-conversion campaigns).
  Only tags the campaign doesn't already have are suggested. A short analyzing spinner simulates
  the model call; an empty state shows when there's nothing to suggest.
- **Review & apply:** each suggested tag is individually **accept/exclude** (accepted by default);
  **Apply (N)** commits only the accepted tags, creating any new tag names in the catalog.

> Implementation note: heuristic/mock only — no real model call. The flow exists to validate the
> hypothesis that high-campaign-count users benefit from AI-assisted tagging.

Everything else (system views, tags-on-cards, inline tag editing, auto-color) is unchanged from v1.

---

## 8. Implementation brief — `campaigns-v3-taggingv2` (acceptance criteria)

Scope is the **tagging + filtering** behavior only. Each item is a testable acceptance
criterion. **AI suggested tags (§8.6) is _nice to have_** — ship everything else first; the
feature set is complete without it. Everything else in the campaigns list (header, sort, cards,
pagination, multi-select bar, chat) is unchanged from the base view and out of scope here.

### 8.1 Tier 1 — Saved filters (chips)
- [ ] **System views** render first: **All, Active, Inactive, Archive**. Each carries
  `criteria = { status, tags: [] }` (`all` / `active` / `inactive` / `archive`).
- [ ] **Custom views** render after a divider (seed: **Black Friday 2026** =
  `{status:'active', tags:['Black Friday','2026']}`, **VIP** = `{status:'all', tags:['VIP']}`).
- [ ] Default active view is **All**; the active chip is visually highlighted.
- [ ] Clicking a chip (normal mode) **applies** that view: sets the status filter and the
  selected tags from its `criteria`.

### 8.2 Filter controls cluster
- [ ] Two **icon-only** ghost buttons sit together after the chips (divider before them,
  left-aligned): a **+** ("New filter") and a **pencil** ("Edit filters").
- [ ] **+** opens the builder in **create** mode. It is **disabled (dimmed)** while edit mode
  is on (stays visible so the row width is stable).
- [ ] The **pencil** toggles edit mode and shows an active state while on (tooltip flips to
  "Done editing filters").

### 8.3 Filter builder modal (create / edit)
- [ ] Title is **"New filter"** (create) or **"Edit filter"** (edit).
- [ ] Fields: **name** (required; Enter submits) and **tags** (`MultiSelect` over the master
  tag list). It is **tags-only** — no status picker.
- [ ] **Create:** appends a custom view `{ status:'all', tags }` and activates it.
- [ ] **Edit:** updates the view's label + tags; if it's the active view, re-applies it.
- [ ] Primary button is disabled until the name is non-empty; **Cancel** closes without saving.

### 8.4 Edit mode
- [ ] While on: clicking a **custom** chip opens the builder pre-populated (rename/modify, **no
  filtering**); clicking a system chip does nothing.
- [ ] Each **custom** chip shows an **✕** (delete) — visible **only in edit mode**.
- [ ] **System** chips are **dimmed and inert** (no hover, no click) in edit mode.
- [ ] Deleting the active custom view falls back to the first saved view.

### 8.5 Tier 2 — Refine (ad-hoc filters)
- [ ] **Domain** dropdown (with logo icon); choosing **"+ Add new domain"** opens
  `AddDomainModal` and inserts the new domain.
- [ ] **Search** input filters by **campaign name OR tag name** (case-insensitive substring).
- [ ] **Tags** `MultiSelect` drives ad-hoc tag filtering; selecting a saved view pre-fills it,
  but refine edits are transient (not persisted to the view).
- [ ] **Filtering semantics:** status (active/inactive/all) ∧ **all** selected tags present
  (AND) ∧ search match.

### 8.6 Inline per-campaign tagging (card `#tags` slot)
- [ ] Show each campaign's tags as color-coded `Tag` pills, each with an **✕** to remove.
- [ ] A **"+ Tag"** popover (one open at a time) has a search/create input and a list of all
  tags filtered by the input; applied tags show a checkmark and toggle on click.
- [ ] When the typed value is new, a **"+ Create '…'"** row adds it to the master list and the
  campaign. Enter also creates.
- [ ] **Auto-color:** each tag's color is derived by hashing its name (stable, zero-config).

### 8.7 AI suggested tags — _nice to have_
> Build last; the view is shippable without it. Suggestions are **proposed, never auto-applied**.
- [ ] A **Sparkles** button on each card opens a **"Suggested tags"** review modal.
- [ ] Scope toggle: **This campaign** / **All in this view (N)**; switching re-runs analysis.
- [ ] Suggestions come from a **mock heuristic over name + metrics** (keyword map; a
  "High performer" tag for high-conversion campaigns); only tags not already applied are shown.
  Include a short analyzing spinner and an empty state.
- [ ] Each suggested tag is individually **accept/exclude** (accepted by default); **Apply (N)**
  commits only accepted tags, creating any new tag names.
