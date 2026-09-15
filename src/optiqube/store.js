/**
 * OptiQube prototype state.
 *
 * The product routes with wouter over real URLs; this prototype keeps the same
 * paths in `state.path` and moves between them with `navigate`, so the shell's
 * active-nav rules and every `href` read the same way they do in the app.
 *
 * Everything below the router is mock data shaped like the real payloads
 * (`shared/types.ts`), so a screen can be built against the fields it will
 * actually receive.
 */
import { reactive } from 'vue'

// -- Router ------------------------------------------------------------------

export const state = reactive({
  /** Nest-relative path, e.g. `/campaigns` or `/campaigns/cmp_2`. */
  path: '/campaigns',
  /** Screens outside the product shell: login, register, onboarding, account. */
  theme: 'light',
  /** The store the workspace is pinned to. */
  activeBrandId: 'brd_1',
  /** Whether the viewer is signed in — the shell shows a different footer for guests. */
  guest: false,
  recentsView: 'active',
})

export function navigate(path) {
  state.path = path
}

/** True when `path` is the nav entry's section — `/campaigns/cmp_2` lights Campaigns. */
export function isSection(nest) {
  if (nest === '/products') {
    return state.path === '/products' || state.path.startsWith('/products/')
  }
  if (nest === '/campaigns') {
    return (
      /^\/campaigns(\/|$)/.test(state.path) &&
      !/^\/campaigns\/[^/]+\/products/.test(state.path)
    )
  }
  return state.path === nest || state.path.startsWith(`${nest}/`)
}

export function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark'
}

// -- Styles ------------------------------------------------------------------

/** The four classic presets a catalog session runs (`shared/types.ts`). */
export const creativePresets = [
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    description: 'Product + real-world usage side by side',
    mockup: { from: '#007FFF', to: '#93C5FD' },
  },
  {
    id: 'badge',
    label: 'Badge',
    description: 'Product on a stylized background with 3 benefit badges',
    mockup: { from: '#10B981', to: '#A7F3D0' },
  },
  {
    id: 'mixed',
    label: 'Mixed',
    description: 'Lifestyle scene with headline + benefit highlights',
    mockup: { from: '#F59E0B', to: '#FDE68A' },
  },
  {
    id: 'callout',
    label: 'Call-Out',
    description: 'Centered product with feature call-out lines',
    mockup: { from: '#8B5CF6', to: '#DDD6FE' },
  },
]

const NEUTRAL_MOCKUP = { from: 'var(--oq-blue-soft)', to: 'var(--oq-blue-muted)' }

export function styleById(id) {
  return creativePresets.find((s) => s.id === id) || null
}

export function presetMockup(id) {
  return styleById(id)?.mockup ?? NEUTRAL_MOCKUP
}

// -- Account and stores ------------------------------------------------------

export const account = {
  id: 'acc_1',
  name: 'Nordic Supply Co.',
  email: 'anna@nordicsupply.com',
  displayName: 'Anna Berg',
  plan: 'Growth',
  nextPayment: '12 Oct 2026',
  credits: { balance: 640, granted: 1000 },
}

export const brands = [
  { id: 'brd_1', name: 'Nordic Supply', domain: 'nordicsupply.com' },
  { id: 'brd_2', name: 'Fjord Outdoor', domain: 'fjordoutdoor.eu' },
  { id: 'brd_3', name: 'Halló Home', domain: 'hallohome.dk' },
]

export function activeBrand() {
  return brands.find((b) => b.id === state.activeBrandId) || brands[0]
}

// -- Campaigns ---------------------------------------------------------------

/** `updatedAt` is minutes-ago at module load, so the rows read as recent. */
function agoISO(minutes) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const campaigns = [
  {
    id: 'cmp_1',
    name: 'Autumn catalog — bestsellers',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(24),
    status: 'active',
    active: true,
    kpis: { spend: 4820.5, clicks: 12840, ctr: 0.0212, roi: 3.41 },
    previewUrl: null,
    creativeLabel: 'Badge · Call-Out',
    creativePresetId: 'badge',
    variantSummary: '3 AI + control',
    adsManagerUrl: 'https://adsmanager.facebook.com/',
  },
  {
    id: 'cmp_2',
    name: 'Wool base layers — cold start',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(180),
    status: 'active',
    active: true,
    kpis: { spend: 1290.0, clicks: 3410, ctr: 0.0164, roi: 2.18 },
    previewUrl: null,
    creativeLabel: 'Lifestyle',
    creativePresetId: 'lifestyle',
    variantSummary: '2 AI + control',
    adsManagerUrl: null,
  },
  {
    id: 'cmp_3',
    name: 'Kitchen restock',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(1500),
    status: 'paused',
    active: false,
    kpis: { spend: 640.25, clicks: 1180, ctr: 0.0098, roi: 1.12 },
    previewUrl: null,
    creativeLabel: 'Mixed',
    creativePresetId: 'mixed',
    variantSummary: '3 AI + control',
    adsManagerUrl: null,
  },
  {
    id: 'cmp_4',
    name: 'Gift guide draft',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(4300),
    status: 'draft',
    active: false,
    kpis: null,
    previewUrl: null,
    creativeLabel: 'Call-Out',
    creativePresetId: 'callout',
    variantSummary: '3 AI + control',
    adsManagerUrl: null,
  },
  {
    id: 'cmp_5',
    name: 'Summer clearance',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(60 * 24 * 41),
    status: 'archived',
    active: false,
    kpis: { spend: 2210.8, clicks: 7420, ctr: 0.0188, roi: 2.74 },
    previewUrl: null,
    creativeLabel: 'Lifestyle · Badge',
    creativePresetId: 'lifestyle',
    variantSummary: '2 AI + control',
    adsManagerUrl: null,
  },
]

export function campaignById(id) {
  return campaigns.find((c) => c.id === id) || null
}

/** The sidebar lists only what is live — the same rule as the product's own list. */
export function liveCampaigns() {
  return campaigns.filter((c) => c.status === 'active')
}

export const campaignStatusFilters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'paused', label: 'Paused' },
  { id: 'archived', label: 'Archived' },
]

export function filterCampaigns(list, status, query) {
  const q = query.trim().toLowerCase()
  return list.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (q && !c.name.toLowerCase().includes(q)) return false
    return true
  })
}

// -- Recent sessions ---------------------------------------------------------

export const recentSessions = [
  {
    id: 'ses_1',
    title: 'Merino hoodie — winter scenes',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(8),
    conceptCount: 4,
    phase: 'ready',
    archived: false,
  },
  {
    id: 'ses_2',
    title: 'Cast iron pan — badge set',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(95),
    conceptCount: 3,
    phase: 'generating',
    archived: false,
  },
  {
    id: 'ses_3',
    title: 'Trail backpack',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(60 * 26),
    conceptCount: 4,
    phase: 'ready',
    archived: false,
  },
  {
    id: 'ses_4',
    title: 'Candle set — gifting',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(60 * 24 * 9),
    conceptCount: 2,
    phase: 'ready',
    archived: true,
  },
]

export function sessionById(id) {
  return recentSessions.find((s) => s.id === id) || null
}

/** Recents are grouped by age: today, this week, then older. */
export function groupRecents(list) {
  const now = Date.now()
  const day = 86_400_000
  const blocks = [
    { key: 'today', label: '', rows: [] },
    { key: 'week', label: 'Earlier this week', rows: [] },
    { key: 'older', label: 'Older', rows: [] },
  ]
  for (const row of list) {
    const age = now - Date.parse(row.updatedAt)
    if (age < day) blocks[0].rows.push(row)
    else if (age < 7 * day) blocks[1].rows.push(row)
    else blocks[2].rows.push(row)
  }
  return blocks.filter((b) => b.rows.length)
}

// -- Catalog -----------------------------------------------------------------

/**
 * The catalog as OptiQube reads it (`ScrapedProduct`).
 *
 * Built rather than listed: the Products page is a grid over tens of thousands of
 * rows with facets and paging, and a dozen hand-written products would exercise
 * none of it. Every row still carries the real fields — id, name, price, image,
 * category path, brand, availability.
 */
const CATEGORY_PATHS = [
  'Apparel > Tops > Hoodies',
  'Apparel > Tops > T-shirts',
  'Apparel > Base layers',
  'Apparel > Outerwear',
  'Apparel > Socks',
  'Home > Kitchen > Cookware',
  'Home > Kitchen > Prep',
  'Home > Bedroom',
  'Home > Decor',
  'Outdoor > Bags',
  'Outdoor > Drinkware',
  'Outdoor > Shelter',
]

const PRODUCT_NAMES = [
  'Merino wool hoodie', 'Cast iron pan, 28 cm', 'Trail backpack 30L', 'Linen bedding set',
  'Soy candle, cedar', 'Insulated bottle 750ml', 'Wool base layer, long', 'Enamel mug, 400ml',
  'Down vest', 'Chopping board, oak', 'Hiking socks, 2-pack', 'Ceramic vase, small',
  'Fleece pullover', 'Dutch oven, 4L', 'Packable rain shell', 'Waffle towel set',
  'Stoneware bowl', 'Thermos flask 500ml', 'Ribbed beanie', 'Cutting knife, 20 cm',
  'Camp chair, folding', 'Wool throw blanket', 'Leather belt', 'Espresso maker, 6 cup',
]

const BRAND_NAMES = ['Nordic Supply', 'Fjellkraft', 'Halló', 'Vinter', 'Saga Goods']

const PRODUCT_IMAGES = [
  'lifestyle-01-classic-split.jpg', 'badge-01-vertical-icons.jpg', 'mixed-01-kitchen-headline.jpg',
  'callout-01-four-corners.jpg', 'lifestyle-02-reverse-split.jpg', 'badge-02-floating-pills.jpg',
  'mixed-02-gaming-caps.jpg', 'callout-02-appliance-radial.jpg', 'lifestyle-03-soft-diagonal.jpg',
  'badge-03-pastel-stack.jpg', 'mixed-03-laundry-overlay.jpg', 'callout-03-right-rail.jpg',
]

const VARIANT_SUFFIX = ['black', 'sand', 'moss']

function buildProducts() {
  const out = []
  for (let i = 0; i < 84; i += 1) {
    const base = PRODUCT_NAMES[i % PRODUCT_NAMES.length]
    const variant = Math.floor(i / PRODUCT_NAMES.length)
    const price = 19 + ((i * 17) % 180)
    out.push({
      id: `NS-${1000 + i}`,
      name: variant ? `${base} — ${VARIANT_SUFFIX[variant - 1] ?? 'v2'}` : base,
      price: `€${price.toFixed(2)}`,
      priceValue: price,
      brand: BRAND_NAMES[i % BRAND_NAMES.length],
      category: CATEGORY_PATHS[i % CATEGORY_PATHS.length],
      availability: i % 9 === 0 ? 'out of stock' : 'in stock',
      // Some rows have no image — the tile says so in red, which is the signal
      // the page exists to give.
      imageUrl: i % 7 === 3 ? null : `/optiqube/inspiration/${PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]}`,
    })
  }
  return out
}

export const products = buildProducts()

/** The facet counts the rail draws, recomputed from whatever rows are in play. */
export function catalogFacets(rows) {
  const count = (key) => {
    const map = new Map()
    for (const r of rows) map.set(r[key], (map.get(r[key]) ?? 0) + 1)
    return [...map.entries()].map(([value, n]) => ({ value, count: n })).sort((a, b) => b.count - a.count)
  }
  return {
    brands: count('brand'),
    categories: count('category'),
    inStock: rows.filter((r) => r.availability === 'in stock').length,
    outOfStock: rows.filter((r) => r.availability === 'out of stock').length,
    withImage: rows.filter((r) => r.imageUrl).length,
  }
}

export const catalogSortOptions = [
  { value: 'default', label: 'Catalog order' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
]

export function sortProducts(rows, sort) {
  const out = [...rows]
  if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'price-asc') out.sort((a, b) => a.priceValue - b.priceValue)
  if (sort === 'price-desc') out.sort((a, b) => b.priceValue - a.priceValue)
  return out
}

/**
 * The catalog and Meta connections, as Settings reads them.
 *
 * Reactive so Settings can connect and disconnect them, which is what the two
 * states of each card are for.
 */
export const connections = reactive({
  catalog: {
    connected: true,
    source: 'XML feed',
    sourceLabel: 'XML feed · nordicsupply.com/feeds/meta-catalog.xml',
    feedUrl: 'https://nordicsupply.com/feeds/meta-catalog.xml',
    productCount: 84,
    lastSyncedAt: agoISO(42),
    errorMessage: null,
  },
  meta: {
    connected: true,
    businessName: 'Nordic Supply Co.',
    adAccountId: 'act_1043928471',
    adAccountName: 'Nordic Supply — EU',
    catalogName: 'Nordic Supply — main',
    pageName: 'Nordic Supply',
  },
})

/**
 * The brand kit — what the store scan read off the shop, per field.
 *
 * These are the `{brand_*}` prompt slots (`shared/brand-dna.ts`): an accent edited
 * here is the accent of the very next creative. `source` says where the value came
 * from, which is what the chip beside each row reports.
 */
export const brandKitFields = reactive([
  { id: 'name', label: 'Brand name', hint: 'How the ads refer to the shop', kind: 'text', value: 'Nordic Supply', source: 'scraped' },
  { id: 'language', label: 'Ad language', hint: 'The language the text on your creatives is written in', kind: 'choice', value: 'English', source: 'scraped' },
  { id: 'ink', label: 'Ink', hint: 'Primary brand color — headlines, panels, graphic chrome', kind: 'color', value: '#16233A', source: 'scraped' },
  { id: 'paper', label: 'Paper', hint: 'The surface the ad prints on', kind: 'color', value: '#F5F1EA', source: 'default' },
  { id: 'accent', label: 'Accent', hint: 'Highlight color — underlines, badges, price tags', kind: 'color', value: '#E8FF47', source: 'edited' },
  { id: 'icp', label: 'Ideal customer', hint: "The owner's own words — nothing is invented here", kind: 'longtext', value: '', source: 'default' },
])

export const brandDnaLanguages = ['English', 'Hungarian', 'German', 'Danish', 'Swedish', 'Norwegian', 'Dutch', 'French', 'Spanish', 'Italian', 'Polish', 'Czech', 'Romanian']

export const brandKitSourceLabels = {
  edited: 'Edited',
  scraped: 'From your site',
  default: 'Default',
}

// -- Formatting --------------------------------------------------------------

export function formatMoney(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatInt(n) {
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatPct(n) {
  return `${(n * 100).toFixed(2)}%`
}

export function formatRoi(n) {
  return `${n.toFixed(2)}x`
}

/** "Updated 24m ago" — the relative cue the campaign rows carry. */
export function formatUpdatedAt(iso) {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return 'Updated —'
  const mins = Math.floor((Date.now() - t) / 60_000)
  if (mins < 1) return 'Updated just now'
  if (mins < 60) return `Updated ${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Updated ${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Updated 1 day ago'
  if (days < 30) return `Updated ${days} days ago`
  return `Updated ${new Date(t).toLocaleDateString()}`
}

/** Short cue beside a Recents row: "now", "12m", "3h", "yesterday". */
export function relativeWhen(iso) {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return ''
  const mins = Math.round((Date.now() - t) / 60_000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d`
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// -- Inspiration library -----------------------------------------------------

/**
 * The gallery cards, from the product's `shared/inspiration.ts`.
 *
 * Only the OptiQube-gallery creatives travel: the brand samples beside them in
 * the product are real ads from real shops, and the prototype has no claim on
 * those. The titles and style labels are the shipped ones.
 */
export const inspirationCatalog = [
  { id: 'insp_mock_lifestyle_01', title: 'Classic vertical split', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/lifestyle-01-classic-split.jpg', styleLabel: 'Lifestyle' },
  { id: 'insp_mock_badge_01', title: 'Vertical icon stack', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/badge-01-vertical-icons.jpg', styleLabel: 'Badge' },
  { id: 'insp_mock_mixed_01', title: 'Kitchen headline', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/mixed-01-kitchen-headline.jpg', styleLabel: 'Mixed' },
  { id: 'insp_mock_callout_01', title: 'Four corners', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/callout-01-four-corners.jpg', styleLabel: 'Callout' },
  { id: 'insp_mock_lifestyle_02', title: 'Reverse split', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/lifestyle-02-reverse-split.jpg', styleLabel: 'Lifestyle' },
  { id: 'insp_mock_badge_02', title: 'Floating pills', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/badge-02-floating-pills.jpg', styleLabel: 'Badge' },
  { id: 'insp_mock_mixed_02', title: 'Bold caps promo', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/mixed-02-gaming-caps.jpg', styleLabel: 'Mixed' },
  { id: 'insp_mock_callout_02', title: 'Radial appliance', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/callout-02-appliance-radial.jpg', styleLabel: 'Callout' },
  { id: 'insp_mock_lifestyle_03', title: 'Soft diagonal', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/lifestyle-03-soft-diagonal.jpg', styleLabel: 'Lifestyle' },
  { id: 'insp_mock_badge_03', title: 'Pastel stack', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/badge-03-pastel-stack.jpg', styleLabel: 'Badge' },
  { id: 'insp_mock_mixed_03', title: 'Laundry overlay', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/mixed-03-laundry-overlay.jpg', styleLabel: 'Mixed' },
  { id: 'insp_mock_callout_03', title: 'Right rail', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/callout-03-right-rail.jpg', styleLabel: 'Callout' },
  { id: 'insp_mock_lifestyle_04', title: 'Float panel', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/lifestyle-04-float-panel.jpg', styleLabel: 'Lifestyle' },
  { id: 'insp_mock_badge_04', title: 'Numbered chips', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/badge-04-numbered-chips.jpg', styleLabel: 'Badge' },
  { id: 'insp_mock_mixed_04', title: 'Outdoor pills', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/mixed-04-outdoor-pills.jpg', styleLabel: 'Mixed' },
  { id: 'insp_mock_callout_04', title: 'Circular call-outs', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/callout-04-circular.jpg', styleLabel: 'Callout' },
  { id: 'insp_mock_lifestyle_05', title: 'Horizontal split', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/lifestyle-05-horizontal-split.jpg', styleLabel: 'Lifestyle' },
  { id: 'insp_mock_badge_05', title: 'Horizontal rows', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/badge-05-horizontal-rows.jpg', styleLabel: 'Badge' },
  { id: 'insp_mock_mixed_05', title: 'Soundbar strip', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/mixed-05-soundbar-strip.jpg', styleLabel: 'Mixed' },
  { id: 'insp_mock_callout_05', title: 'Toothbrush call-outs', brandName: 'OptiQube gallery', imageUrl: '/optiqube/inspiration/callout-05-toothbrush.jpg', styleLabel: 'Callout' },
]

// -- Account settings --------------------------------------------------------

export const teamMembers = [
  { id: 'usr_1', name: 'Anna Berg', email: 'anna@nordicsupply.com', role: 'owner', joinedAt: agoISO(60 * 24 * 220) },
  { id: 'usr_2', name: 'Tomas Lind', email: 'tomas@nordicsupply.com', role: 'admin', joinedAt: agoISO(60 * 24 * 95) },
  { id: 'usr_3', name: 'Mia Holm', email: 'mia@nordicsupply.com', role: 'member', joinedAt: agoISO(60 * 24 * 12) },
]

export const teamInvites = [
  { id: 'inv_1', email: 'jonas@nordicsupply.com', role: 'member', sentAt: agoISO(60 * 30) },
]

/** Credits spent per store in the selected period, as the Usage table reads it. */
export const usageByDomain = [
  { domain: 'nordicsupply.com', creditsUsd: 128.4, events: 412 },
  { domain: 'fjordoutdoor.eu', creditsUsd: 41.2, events: 138 },
  { domain: 'hallohome.dk', creditsUsd: 12.9, events: 44 },
]

export const usageRangePresets = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'custom', label: 'Custom' },
]

export const subscription = {
  plan: 'Growth',
  price: 149,
  interval: 'month',
  status: 'active',
  renewsAt: '12 Oct 2026',
  includedCredits: 1000,
  usedCredits: 360,
  paymentMethod: { brand: 'Visa', last4: '4242', expiry: '09/29' },
}

export const invoices = [
  { id: 'inv_2026_09', date: '12 Sep 2026', amount: 149, status: 'paid' },
  { id: 'inv_2026_08', date: '12 Aug 2026', amount: 149, status: 'paid' },
  { id: 'inv_2026_07', date: '12 Jul 2026', amount: 149, status: 'paid' },
  { id: 'inv_2026_06', date: '12 Jun 2026', amount: 49, status: 'paid' },
]

export const plans = [
  { id: 'starter', name: 'Starter', price: 49, credits: 250, blurb: 'One store, the four classic styles.' },
  { id: 'growth', name: 'Growth', price: 149, credits: 1000, blurb: 'Several stores, bulk generation, Meta push.' },
  { id: 'scale', name: 'Scale', price: 399, credits: 3000, blurb: 'Large catalogs, priority rendering, video.' },
]

export function formatCreditsUsd(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

// -- Agentic session ---------------------------------------------------------

/**
 * The session thread.
 *
 * In the product this is hydrated from `/api/sessions/:id` and advanced by a live
 * event stream. Here the same block shapes are driven by a script, so the phases a
 * session actually goes through — pick a campaign type, pick a seed product,
 * generate, refine, apply across the catalog — can each be looked at.
 */
export const session = reactive({
  title: 'New task',
  phase: 'ask_type',
  blocks: [],
  input: '',
  busy: false,
})

const CAMPAIGN_TYPE_CHIPS = [
  { id: 'general', label: 'General catalog ads' },
  { id: 'seasonal', label: 'Seasonal push' },
  { id: 'copy_ad', label: 'Copy an ad I like' },
  { id: 'video', label: 'Video ads' },
]

const NEXT_CHIPS = [
  { id: 'apply', label: 'Apply across my catalog' },
  { id: 'refine', label: 'Refine one of these' },
  { id: 'campaign', label: 'Create the campaign' },
]

/** The four seed products the session offers — real rows out of the catalog. */
function seedChips() {
  return products.slice(0, 4).map((p) => ({
    id: p.id,
    label: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    productId: p.id,
  }))
}

export function resetSession() {
  session.title = 'New task'
  session.phase = 'ask_type'
  session.busy = false
  session.input = ''
  session.blocks = [
    {
      kind: 'assistant',
      text: `I read **${activeBrand().domain}** and found ${products.length} products. What are we making today?`,
    },
    { kind: 'options', purpose: 'campaign', options: CAMPAIGN_TYPE_CHIPS, disabled: false },
  ]
}

resetSession()

/** Freeze the chips a click answered — the product disables them rather than dropping them. */
function disableOptions(purpose) {
  for (const b of session.blocks) {
    if (b.kind === 'options' && b.purpose === purpose) b.disabled = true
  }
}

export function pickCampaignType(opt) {
  disableOptions('campaign')
  session.title = opt.label
  session.blocks.push({ kind: 'user', text: opt.label })
  session.blocks.push({
    kind: 'assistant',
    text: 'Good. Which product should the first four concepts be built around?',
  })
  session.blocks.push({ kind: 'options', purpose: 'focus', options: seedChips(), disabled: false })
  session.phase = 'awaiting_focus'
}

const GEN_STEPS = [
  { id: 'read', label: 'Reading the product page…' },
  { id: 'brand', label: 'Matching your brand kit…' },
  { id: 'render', label: 'Rendering four concepts…' },
]

export function pickFocus(opt) {
  disableOptions('focus')
  session.blocks.push({ kind: 'user', text: opt.label })
  session.phase = 'generating'
  session.busy = true

  // Read the pushed block back out of the array: `reactive` tracks writes made
  // through its proxy, and the literal above is still the raw object.
  session.blocks.push({ kind: 'progress', steps: GEN_STEPS.map((s) => ({ ...s, done: false })) })
  const progress = session.blocks[session.blocks.length - 1]

  // The steps land one at a time, the way the event stream delivers them.
  GEN_STEPS.forEach((step, i) => {
    setTimeout(() => {
      progress.steps[i].done = true
      if (i === GEN_STEPS.length - 1) finishGeneration(opt)
    }, 900 * (i + 1))
  })
}

function finishGeneration(seed) {
  session.blocks.push({
    kind: 'concepts',
    seedProductName: seed.label,
    concepts: creativePresets.map((preset, i) => ({
      id: `cpt_${preset.id}`,
      presetId: preset.id,
      label: preset.label,
      description: preset.description,
      imageUrl: inspirationCatalog[i]?.imageUrl ?? null,
    })),
  })
  session.blocks.push({
    kind: 'assistant',
    text: 'Four concepts for **' + seed.label + '**. Tell me what to change, or take one further.',
  })
  session.blocks.push({ kind: 'options', purpose: 'next', options: NEXT_CHIPS, disabled: false })
  session.phase = 'ready'
  session.busy = false
}

const APPLY_STEPS = [
  { id: 'select', label: 'Choosing the products to cover…' },
  { id: 'queue', label: 'Queueing the round…' },
]

export function handleNextStep(id) {
  disableOptions('next')
  const label = NEXT_CHIPS.find((c) => c.id === id)?.label ?? id
  session.blocks.push({ kind: 'user', text: label })

  if (id === 'apply') {
    session.busy = true
    session.blocks.push({ kind: 'progress', steps: APPLY_STEPS.map((s) => ({ ...s, done: false })) })
    const progress = session.blocks[session.blocks.length - 1]
    APPLY_STEPS.forEach((step, i) => {
      setTimeout(() => {
        progress.steps[i].done = true
        if (i === APPLY_STEPS.length - 1) finishApply()
      }, 800 * (i + 1))
    })
    return
  }

  if (id === 'campaign') {
    session.blocks.push({
      kind: 'assistant',
      text: 'Campaign **' + session.title + '** is drafted with 3 AI variants and the control. Open it from Campaigns when you want to publish it to Meta.',
    })
    session.phase = 'ready'
    return
  }

  session.blocks.push({
    kind: 'assistant',
    text: 'Which one, and what should change about it? Type it below — "make the Badge one warmer, and drop the price tag" works.',
  })
  session.phase = 'ready'
}

function finishApply() {
  session.blocks.push({
    kind: 'apply',
    styleId: 'badge',
    items: products.slice(0, 8).map((p) => ({
      productId: p.id,
      name: p.name,
      imageUrl: null,
      status: 'pending',
    })),
  })
  // Same reason as the progress block: mutate the cells through the proxy.
  const items = session.blocks[session.blocks.length - 1].items
  session.busy = false

  // The cells fill in one by one, the way the render queue reports them.
  items.forEach((item, i) => {
    setTimeout(() => {
      item.imageUrl = inspirationCatalog[(i + 4) % inspirationCatalog.length].imageUrl
      item.status = 'ready'
      if (i === items.length - 1) {
        session.blocks.push({
          kind: 'assistant',
          text: '8 products covered in the **Badge** style. The rest of the catalog is queued and will land over the next hour.',
        })
        session.blocks.push({
          kind: 'options',
          purpose: 'next',
          options: [NEXT_CHIPS[2], NEXT_CHIPS[1]],
          disabled: false,
        })
        session.phase = 'ready'
      }
    }, 600 + i * 450)
  })
}

export function sendRefine() {
  const text = session.input.trim()
  if (!text) return
  session.input = ''
  session.blocks.push({ kind: 'user', text })
  session.busy = true
  setTimeout(() => {
    session.blocks.push({
      kind: 'assistant',
      text: 'Noted — I kept that as a standing ask for this style, so every creative it renders from here on follows it.',
    })
    session.busy = false
  }, 900)
}

// -- Campaign workspace ------------------------------------------------------

/**
 * A campaign as the workspace reads it: ad sets, the ads under them, and the
 * creatives each ad carries. The tree is what the page is — everything else on
 * the screen describes one of these three levels.
 */
const workspaceCreative = (i, name) => ({
  id: `crt_${i}`,
  productName: name,
  imageUrl: inspirationCatalog[i % inspirationCatalog.length].imageUrl,
})

export const workspaceCampaigns = reactive({
  cmp_1: {
    id: 'cmp_1',
    name: 'Autumn catalog — bestsellers',
    domain: 'nordicsupply.com',
    status: 'active',
    objective: 'Sales',
    advantagePlus: true,
    kpis: {
      last_7d: { Spend: '1,240', Impressions: '184,900', Clicks: '3,910', CTR: '2.11%', ROAS: '3.38x' },
      last_30d: { Spend: '4,821', Impressions: '712,400', Clicks: '12,840', CTR: '2.12%', ROAS: '3.41x' },
      maximum: { Spend: '11,940', Impressions: '1,844,200', Clicks: '31,220', CTR: '1.98%', ROAS: '3.12x' },
    },
    adSets: [
      {
        id: 'as_1',
        name: 'Broad — EU',
        budget: '€120 / day',
        schedule: 'Runs continuously',
        goal: 'Purchases',
        ads: [
          {
            id: 'ad_1',
            name: 'Badge — bestsellers',
            creatives: [0, 1, 2, 3, 4].map((i) => workspaceCreative(i, products[i].name)),
          },
          {
            id: 'ad_2',
            name: 'Call-Out — bestsellers',
            creatives: [5, 6, 7].map((i) => workspaceCreative(i, products[i].name)),
          },
        ],
      },
      {
        id: 'as_2',
        name: 'Retargeting — 30d visitors',
        budget: '€60 / day',
        schedule: 'Runs continuously',
        goal: 'Purchases',
        ads: [
          {
            id: 'ad_3',
            name: 'Control — feed images',
            creatives: [8, 9].map((i) => workspaceCreative(i, products[i].name)),
          },
        ],
      },
    ],
  },
})

export const workspaceRanges = [
  { id: 'last_7d', label: 'Last 7' },
  { id: 'last_30d', label: 'Last 30' },
  { id: 'maximum', label: 'Lifetime' },
]

export const workspaceKpiLabels = ['Spend', 'Impressions', 'Clicks', 'CTR', 'ROAS']

export const workspaceConversionGoals = ['Purchases', 'Add to cart', 'Leads', 'Link clicks']

export const workspaceCampaignTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'feeds', label: 'Feeds' },
]

/** A campaign with no workspace of its own falls back to a drafted shape. */
export function workspaceFor(id) {
  if (workspaceCampaigns[id]) return workspaceCampaigns[id]
  const c = campaignById(id)
  if (!c) return null
  return {
    id: c.id,
    name: c.name,
    domain: c.domain,
    status: c.status,
    objective: 'Sales',
    advantagePlus: false,
    kpis: { last_7d: null, last_30d: null, maximum: null },
    adSets: [
      {
        id: `${c.id}_as1`,
        name: 'Broad — EU',
        budget: '€50 / day',
        schedule: 'Runs continuously',
        goal: 'Purchases',
        ads: [
          {
            id: `${c.id}_ad1`,
            name: `${c.creativeLabel} — draft`,
            creatives: [0, 1, 2].map((i) => workspaceCreative(i + 6, products[i].name)),
          },
        ],
      },
    ],
  }
}

/** The product feeds a campaign publishes to Meta — the Feeds tab. */
export const campaignFeeds = [
  {
    id: 'feed_badge',
    styleLabel: 'Badge',
    url: 'https://feeds.optiqube.com/nordicsupply/badge.xml',
    products: 84,
    ready: 84,
    lastBuiltAt: agoISO(35),
  },
  {
    id: 'feed_callout',
    styleLabel: 'Call-Out',
    url: 'https://feeds.optiqube.com/nordicsupply/callout.xml',
    products: 84,
    ready: 61,
    lastBuiltAt: agoISO(35),
  },
]
