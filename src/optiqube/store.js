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
  /** The tab an ad page opens on when something sends the merchant straight to it. */
  adTab: null,
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
  credits: reactive({ balance: 640, granted: 1000 }),
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
  {
    id: 'cmp_6',
    name: 'No catalog — winter launch',
    domain: 'nordicsupply.com',
    updatedAt: agoISO(12),
    status: 'draft',
    active: false,
    kpis: null,
    previewUrl: null,
    creativeLabel: 'Mixed',
    creativePresetId: 'mixed',
    variantSummary: '3 AI + control',
    adsManagerUrl: null,
    noCatalog: true,
  },
]

export function campaignById(id) {
  return campaigns.find((c) => c.id === id) || null
}

/**
 * A campaign that has no catalog to run on: the one drafted before a catalog was
 * connected (`noCatalog`), or any of them once the workspace's catalog is removed.
 */
export function campaignNeedsCatalog(ws) {
  return Boolean(ws) && (Boolean(ws.noCatalog) || !connections.catalog.connected)
}

/** Connected from inside a campaign: the flag goes, on the row and on the workspace. */
export function catalogConnectedFor(campaignId) {
  const row = campaignById(campaignId)
  if (row) row.noCatalog = false
  if (workspaceCampaigns[campaignId]) workspaceCampaigns[campaignId].noCatalog = false
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

// -- Concept overlay ---------------------------------------------------------

/**
 * The window a concept card opens.
 *
 * Ported from the product's `SessionConceptOverlay` over `ConceptOverlay`: step 1 is
 * the direction on the seed product, step 2 the same direction on two more, step 3
 * the campaign. Notes and Try chips refine what is on screen.
 *
 * All of it lives here rather than in the component, because the window can be put
 * down in the corner and picked up again with every word of the conversation intact —
 * in the product that is the point of parking a window, and state held by a modal
 * that unmounts could not survive it.
 */
export const conceptOverlay = reactive({
  open: false,
  minimized: false,
  /** The last step is a beat on the way out: the header moves to 3, then it closes. */
  closing: false,
  conceptId: null,
  styleId: null,
  label: '',
  seed: null,
  stage: 'one',
  companionIds: [],
  creatives: [],
  thread: [],
  chips: {},
  input: '',
  busy: false,
  roundStartedAt: null,
  /** A round has run under this window — what lets the corner card say "ready". */
  sawRound: false,
  waitAsked: false,
  versions: [],
  activeVersionId: null,
  pickerOpen: false,
})

/** The Try sentences. A click writes one into the composer; it is never auto-sent. */
const OVERLAY_CHIPS = [
  { id: 'logo', chip: 'Add the store logo.', badge: 'LOGO' },
  { id: 'back-to-school', chip: 'Make it back to school.', badge: 'Back to school' },
  { id: 'holiday', chip: 'Make it festive / Christmas.', badge: 'Festive' },
  { id: 'badge-larger', chip: 'Make the badge text larger.', badge: 'larger' },
]

/** Badge swaps the weakest seasonal for a sentence about its own badges. */
export function overlayTryChips() {
  const [logo, backToSchool, holiday, larger] = OVERLAY_CHIPS
  return conceptOverlay.label === 'Badge' ? [logo, backToSchool, larger] : [logo, backToSchool, holiday]
}

/** The badges drawn over a finished frame — what the chips so far have asked for. */
export function overlayChipBadges() {
  return OVERLAY_CHIPS.filter((c) => conceptOverlay.chips[c.id]).map((c) => c.badge)
}

const OVERLAY_COPY = {
  line: (style, seedName, others) =>
    [
      `This is the ${style} direction on ${seedName}.`,
      others > 0
        ? `If you like it, click the button above and I'll show it on ${others === 1 ? 'the other product' : `the other ${others} products`}.`
        : 'If you like it, click the button above.',
      'If you want changes, write below and I’ll update it.',
    ].join('\n\n'),
  ackGenerate: (others) =>
    `Okay, generating on ${others === 1 ? 'the other product' : `the other ${others} products`}.`,
  doneGenerate: 'Done. Shall we make a draft campaign from this?',
  ackRefine: 'Okay, I’ll update it.',
  doneRefine: 'Done, it’s updated.',
  waitAsk:
    'This usually takes about a minute. Do you want to wait here, or shall I put it in the corner so you can carry on with something else?',
  waitStay: 'I’ll wait here',
  waitGo: 'Put it down — I’ll carry on',
  waitStayAck: 'Staying with it, then.',
  waitGoAck: 'It’s in the corner — open it whenever you like. I’ll keep going.',
}

export const overlayCopy = OVERLAY_COPY

/** The header strip. Step 2 counts whatever the preview actually covers. */
export function overlaySteps() {
  const total = conceptOverlay.companionIds.length + 1
  return [
    { n: 1, label: 'Concept refinement' },
    { n: 2, label: `Preview on ${total} ${total === 1 ? 'product' : 'products'}` },
    { n: 3, label: 'Create campaign' },
  ]
}

export function overlayHeaderStep() {
  if (conceptOverlay.closing) return 3
  return conceptOverlay.stage === 'three' ? 2 : 1
}

export function overlayCta() {
  const others = conceptOverlay.companionIds.length
  if (conceptOverlay.stage === 'three') return 'I like this — create the campaign'
  return others > 0
    ? `I like this — generate it on ${others} more ${others === 1 ? 'product' : 'products'}`
    : 'I like this'
}

/** The gallery renders for one style — what a round of this direction hands back. */
function styleImages(presetId) {
  return inspirationCatalog.filter((i) => i.id.includes(presetId)).map((i) => i.imageUrl)
}

/** The next render of this style, so a refine visibly changes the picture. */
function nextStyleImage(presetId, current) {
  const list = styleImages(presetId)
  if (!list.length) return current
  const at = list.indexOf(current)
  return list[(at + 1) % list.length]
}

export function overlayCompanions() {
  return conceptOverlay.companionIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
}

function overlayMsg(role, text, options) {
  conceptOverlay.thread.push({
    id: `m_${conceptOverlay.thread.length}_${Date.now()}`,
    role,
    text,
    options: options ?? null,
  })
  return conceptOverlay.thread[conceptOverlay.thread.length - 1]
}

function overlayIntro() {
  conceptOverlay.thread = []
  overlayMsg(
    'bot',
    OVERLAY_COPY.line(conceptOverlay.label, conceptOverlay.seed?.name ?? 'this product', conceptOverlay.companionIds.length),
  )
}

/** The two companions step 2 covers by default: the next catalog rows with a picture. */
function defaultCompanionIds(seedId) {
  return products.filter((p) => p.imageUrl && p.id !== seedId).slice(0, 2).map((p) => p.id)
}

export function openConceptOverlay(concept) {
  const seed = session.seed ?? { id: products[0].id, name: products[0].name }
  conceptOverlay.open = true
  conceptOverlay.minimized = false
  conceptOverlay.closing = false
  conceptOverlay.conceptId = concept.id
  conceptOverlay.styleId = concept.presetId
  conceptOverlay.label = concept.label
  conceptOverlay.seed = seed
  conceptOverlay.stage = 'one'
  conceptOverlay.companionIds = defaultCompanionIds(seed.id)
  conceptOverlay.creatives = [
    { productId: seed.id, name: seed.name, imageUrl: concept.imageUrl, isSeed: true, status: 'ready' },
  ]
  conceptOverlay.chips = {}
  conceptOverlay.input = ''
  conceptOverlay.busy = false
  conceptOverlay.roundStartedAt = null
  conceptOverlay.sawRound = false
  conceptOverlay.waitAsked = false
  conceptOverlay.versions = [{ id: 'v1', imageUrl: concept.imageUrl, ask: null }]
  conceptOverlay.activeVersionId = 'v1'
  conceptOverlay.pickerOpen = false
  overlayIntro()
}

export function closeConceptOverlay() {
  conceptOverlay.open = false
  conceptOverlay.minimized = false
  conceptOverlay.closing = false
  conceptOverlay.pickerOpen = false
}

export function minimizeOverlay() {
  conceptOverlay.minimized = true
  conceptOverlay.pickerOpen = false
}

export function restoreOverlay() {
  conceptOverlay.minimized = false
}

export function setOverlayCompanions(ids) {
  // The picker hands back the run's whole set, the seed included — it is a slot in
  // there, not a companion.
  conceptOverlay.companionIds = ids.filter((id) => id !== conceptOverlay.seed?.id).slice(0, 2)
  conceptOverlay.pickerOpen = false
  // The intro counts the companions, so a re-pick before the round has to re-count.
  if (conceptOverlay.thread.length === 1) overlayIntro()
}

/** A round starts: ask once whether this is worth waiting for. */
function startRound() {
  conceptOverlay.busy = true
  conceptOverlay.sawRound = true
  conceptOverlay.roundStartedAt = Date.now()
  if (conceptOverlay.waitAsked) return
  conceptOverlay.waitAsked = true
  overlayMsg('bot', OVERLAY_COPY.waitAsk, [
    { id: 'overlay-wait-stay', label: OVERLAY_COPY.waitStay },
    { id: 'overlay-wait-go', label: OVERLAY_COPY.waitGo },
  ])
}

function endRound() {
  conceptOverlay.busy = false
  conceptOverlay.roundStartedAt = null
  // The wait it asked about is over: an answer now would put down a finished window.
  for (const m of conceptOverlay.thread) {
    if (m.options?.some((o) => o.id === 'overlay-wait-go')) m.options = null
  }
}

export function answerOverlayWait(msgId, optionId) {
  const msg = conceptOverlay.thread.find((m) => m.id === msgId)
  if (msg) msg.options = null
  if (optionId === 'overlay-wait-go') {
    overlayMsg('bot', OVERLAY_COPY.waitGoAck)
    minimizeOverlay()
    return
  }
  overlayMsg('bot', OVERLAY_COPY.waitStayAck)
}

/** Step 1's button: the same direction on the two companions. */
export function overlayGenerateMore() {
  if (conceptOverlay.busy || conceptOverlay.stage !== 'one') return
  const companions = overlayCompanions()
  if (!companions.length) return
  overlayMsg('bot', OVERLAY_COPY.ackGenerate(companions.length))
  conceptOverlay.stage = 'three'
  conceptOverlay.creatives = [
    conceptOverlay.creatives[0],
    ...companions.map((p) => ({
      productId: p.id,
      name: p.name,
      imageUrl: null,
      isSeed: false,
      status: 'pending',
    })),
  ]
  startRound()

  const cells = conceptOverlay.creatives
  const renders = styleImages(conceptOverlay.styleId)
  companions.forEach((_, i) => {
    setTimeout(() => {
      const cell = cells[i + 1]
      cell.imageUrl = renders[(i + 1) % renders.length]
      cell.status = 'ready'
      if (i === companions.length - 1) {
        endRound()
        overlayMsg('bot', OVERLAY_COPY.doneGenerate)
      }
    }, 2200 + i * 900)
  })
}

/** The composer. A note redraws what is on screen — one frame or all three. */
export function sendOverlayNote() {
  const text = conceptOverlay.input.trim()
  if (!text || conceptOverlay.busy || conceptOverlay.closing) return
  conceptOverlay.input = ''
  overlayMsg('user', text)

  // A chip whose sentence went out unedited is now part of what this creative says.
  for (const c of OVERLAY_CHIPS) {
    if (c.chip === text) {
      conceptOverlay.chips[c.id] = true
      if (c.id === 'badge-larger') conceptOverlay.chips['badge-smaller'] = false
    }
  }

  overlayMsg('bot', OVERLAY_COPY.ackRefine)
  startRound()
  const cells = conceptOverlay.creatives
  for (const cell of cells) cell.status = 'pending'

  setTimeout(() => {
    for (const cell of cells) {
      cell.imageUrl = nextStyleImage(conceptOverlay.styleId, cell.imageUrl)
      cell.status = 'ready'
    }
    // History belongs to the single frame: once three are rendered, a step back
    // would be a promise about pictures this strip cannot restore.
    if (conceptOverlay.stage === 'one') {
      conceptOverlay.versions.push({
        id: `v${conceptOverlay.versions.length + 1}`,
        imageUrl: cells[0].imageUrl,
        ask: text,
      })
      conceptOverlay.activeVersionId = conceptOverlay.versions[conceptOverlay.versions.length - 1].id
    }
    endRound()
    overlayMsg('bot', OVERLAY_COPY.doneRefine)
  }, 2600)
}

/** Write a Try sentence into the composer — the merchant still presses send. */
export function fillOverlayChip(id) {
  conceptOverlay.input = OVERLAY_CHIPS.find((c) => c.id === id)?.chip ?? ''
}

/** Look at an earlier render without undoing the refine that replaced it. */
export function peekOverlayVersion(id) {
  const version = conceptOverlay.versions.find((v) => v.id === id)
  if (!version) return
  conceptOverlay.activeVersionId = id
  conceptOverlay.creatives[0].imageUrl = version.imageUrl
}

/** The second, deliberate click: the peeked version becomes the concept again. */
export function keepOverlayVersion() {
  const at = conceptOverlay.versions.findIndex((v) => v.id === conceptOverlay.activeVersionId)
  if (at < 0) return
  conceptOverlay.versions = conceptOverlay.versions.slice(0, at + 1)
}

/** Step 3: the draft campaign, and the session thread carries the record of it. */
export function overlayCreateCampaign() {
  if (conceptOverlay.busy || conceptOverlay.closing) return
  conceptOverlay.closing = true
  const label = conceptOverlay.label
  const covered = conceptOverlay.creatives.length
  setTimeout(() => {
    closeConceptOverlay()
    session.blocks.push({
      kind: 'assistant',
      text: `Campaign **${session.title}** is drafted from the **${label}** direction on ${covered} products. Open it from Campaigns when you want to publish it to Meta.`,
    })
    session.phase = 'ready'
  }, 700)
}

// -- Parallel runs -----------------------------------------------------------

/**
 * A direction being generated on three products, of which several can be in flight.
 *
 * The overlay (`conceptOverlay`) is the product's own answer to a concept card, and
 * it has two costs: it covers the thread, and it holds the session for the minute its
 * round takes — so the other three directions cannot be tried until it lands. This is
 * the alternative the V2–V4 session screens are built on: a click starts a run, runs
 * tick side by side, and the session's own composer is the only place anyone types.
 *
 * Each run owns its own cells and its own timers. Nothing here is shared between two
 * runs, which is the whole point.
 */
export const runs = reactive([])

/** How many products one round covers. */
export const RUN_PRODUCT_SLOTS = 3

/**
 * Which run the composer is talking to — `null` is the session itself, and the
 * default.
 *
 * `cleared` is the merchant having taken the chip off: it stops the composer from
 * reading the run back out of the same sentence and putting it straight back on.
 */
export const runScope = reactive({ runId: null, cleared: false })

/** Point the composer at a run — a click on it, or a window opened on it. */
export function focusRun(id) {
  runScope.runId = id
  runScope.cleared = false
}

/**
 * Back to the session.
 *
 * The lock only covers the sentence in the box: taking the chip off a note being
 * typed means that note is about the session, and the composer must not read the run
 * back out of the same words. With an empty box there is no sentence to lock, and the
 * next one is free to name whatever it likes.
 */
export function clearRunScope() {
  runScope.runId = null
  runScope.cleared = Boolean(session.input.trim())
}

/**
 * The run opened up large, or none.
 *
 * V5 keeps the original's window — the big frames and the room to fine-tune — but a
 * run that is put down goes back to being a block in the thread rather than a card in
 * the corner, and the window is only ever a view of it. So there is nothing here but
 * an id: closing the window cannot lose anything, because the run was never in it.
 */
export const runOverlay = reactive({ runId: null, choose: false })

/** `choose` opens the window on its product step — a finished run's "Use this". */
export function openRun(id, opts = {}) {
  runOverlay.choose = Boolean(opts.choose)
  runOverlay.runId = id
  focusRun(id)
}

/**
 * Put it down: back to the thread, where the run goes on rendering — and back to the
 * session, which is the composer's resting state. Leaving the context on meant the
 * next thing typed went to a run nobody was looking at any more.
 */
export function minimizeRun() {
  runOverlay.runId = null
  runScope.runId = null
  runScope.cleared = false
}

let runSeq = 0

export function runById(id) {
  return runs.find((r) => r.id === id) ?? null
}

export function runForConcept(conceptId) {
  return runs.find((r) => r.conceptId === conceptId) ?? null
}

export function runCells(run) {
  return run.cells
}

/** The block in the thread this run is currently drawing into. */
function currentRunBlock(runId) {
  for (let i = session.blocks.length - 1; i >= 0; i -= 1) {
    const b = session.blocks[i]
    if (b.kind === 'run' && b.runId === runId) return b
  }
  return null
}

/**
 * Point the run and the block it is drawing into at the same cells.
 *
 * The thread keeps one block per round, and a block holds the pictures that round
 * produced — so an earlier block goes on showing what it showed. A block that shared
 * the run's live array would silently rewrite its own history every time a note
 * redrew the creatives.
 */
function attachCells(run, cells) {
  run.cells = cells
  const block = currentRunBlock(run.id)
  if (block) block.cells = cells
}

export function runPending(run) {
  return run.cells.filter((c) => c.status === 'pending').length
}

/** The two products beside the seed: the next catalog rows that have a picture. */
function defaultRunCompanions(seedId) {
  return products.filter((p) => p.imageUrl && p.id !== seedId).slice(0, 2)
}

function renderCells(run, images, delay = 2500, step = 1500) {
  // One charge per round, at the one place every round passes through.
  spendCredits(runPending(run))
  run.status = 'running'
  run.startedAt = Date.now()
  run.cells.forEach((cell, i) => {
    if (cell.status !== 'pending') return
    setTimeout(() => {
      cell.imageUrl = images[i % images.length]
      cell.status = 'ready'
      if (!runPending(run)) {
        run.status = 'ready'
        run.startedAt = null
      }
    }, delay + i * step)
  })
}

/**
 * Start a direction.
 *
 * `stage: 'one'` is the original's opening move — the concept on its seed product,
 * with the three-product round left to `expandRun` — and `open` puts the window up on
 * it. The screens that go straight to three pass neither.
 *
 * Returns the run either way: a second click on a card that is already running is a
 * request to look at it, not to pay for it twice.
 */
export function startRun(concept, opts = {}) {
  const solo = opts.stage === 'one'
  const existing = runForConcept(concept.id)
  if (existing) {
    focusRun(existing.id)
    if (opts.open) runOverlay.runId = existing.id
    return existing
  }
  const seed = session.seed ?? { id: products[0].id, name: products[0].name }
  const companionIds = defaultRunCompanions(seed.id).map((p) => p.id)
  runSeq += 1
  runs.push({
    id: `run_${runSeq}`,
    conceptId: concept.id,
    styleId: concept.presetId,
    label: concept.label,
    seedId: seed.id,
    // The products this round covers. The seed leads because the concept was drawn
    // from it, but it is a slot like the others and can be swapped out.
    productIds: [seed.id, ...companionIds],
    // Always born on the seed alone; `expandRun` is what makes it a three-product
    // round, whether that is the merchant pressing the button or the line above.
    stage: 'one',
    cells: [{ productId: seed.id, name: seed.name, imageUrl: concept.imageUrl, status: 'ready' }],
    chips: {},
    status: 'ready',
    startedAt: null,
  })
  const run = runs[runs.length - 1]
  focusRun(run.id)
  if (opts.open) runOverlay.runId = run.id
  // The thread carries a marker so a screen that draws runs inline keeps them in the
  // order they were started; the screens that draw runs elsewhere skip this block.
  // Pushed before the round, so the round's own line lands under its block.
  session.blocks.push({ kind: 'run', runId: run.id, cells: run.cells })
  if (!solo) expandRun(run.id)
  return run
}

/** The other two products, rendering. The original's step 1 button. */
export function expandRun(runId) {
  const run = runById(runId)
  if (!run || run.stage === 'three') return
  run.stage = 'three'
  const n = run.productIds.length
  session.blocks.push({
    kind: 'assistant',
    text: `Okay — generating **${run.label}** on ${n === 1 ? 'one product' : `${n} products`}.`,
    runLabel: run.label,
  })
  // The seed keeps the picture the concept was drawn as; everything else renders.
  attachCells(run, run.productIds.map((id) => {
    const p = products.find((x) => x.id === id)
    if (id === run.seedId) return run.cells[0]
    return { productId: id, name: p?.name ?? id, imageUrl: null, status: 'pending' }
  }))
  renderCells(run, styleImages(run.styleId))
}

/**
 * Opened but not yet worked on: the concept on its seed, as it came. V3 keeps these out
 * of its column and lets the window close on them without asking — there is nothing to
 * discard until a note has redrawn it or it has been generated on its products.
 */
export function runIsDraft(run) {
  return run.stage === 'one' && !run.refined
}

export function setRunProducts(runId, productIds) {
  const run = runById(runId)
  if (!run) return
  run.productIds = productIds.slice(0, RUN_PRODUCT_SLOTS)
  // Before the round these are a plan and nothing is drawn; after it, a product that
  // was not in the last round has a frame to fill.
  if (run.stage !== 'three') return
  attachCells(run, run.productIds.map((id) => {
    const p = products.find((x) => x.id === id)
    const kept = run.cells.find((c) => c.productId === id)
    return kept ?? { productId: id, name: p?.name ?? id, imageUrl: null, status: 'pending' }
  }))
  if (runPending(run)) renderCells(run, styleImages(run.styleId), 1800, 1200)
}

/** The products a run is about to cover, by name. */
export function runProductNames(run) {
  return run.productIds
    .map((id) => products.find((p) => p.id === id)?.name)
    .filter(Boolean)
}

/**
 * What the session has said about this run.
 *
 * Read out of the session's own thread rather than kept beside it: the window and the
 * thread have to be the same conversation, or typing in one and reading the other is
 * the confusion the overlay had.
 */
export function runTurns(run) {
  return session.blocks.filter(
    (b) => (b.kind === 'user' || b.kind === 'assistant') && b.runLabel === run.label,
  )
}

/** Drop a run. The pictures go with it — the thread keeps what was said about them. */
export function dismissRun(runId) {
  const at = runs.findIndex((r) => r.id === runId)
  if (at >= 0) runs.splice(at, 1)
  if (runScope.runId === runId) runScope.runId = null
  if (runOverlay.runId === runId) runOverlay.runId = null
  for (let i = session.blocks.length - 1; i >= 0; i -= 1) {
    if (session.blocks[i].kind === 'run' && session.blocks[i].runId === runId) {
      session.blocks.splice(i, 1)
    }
  }
}

/**
 * A note sent while a run is in scope.
 *
 * It lands in the session's own thread — tagged with the run it is about, because one
 * conversation with a label on each turn is still one conversation, and a second chat
 * box per run was the thing that made the overlay confusing.
 */
export function refineRun(runId, text) {
  const run = runById(runId)
  if (!run) return
  session.blocks.push({ kind: 'user', text, runLabel: run.label })
  run.refined = true
  for (const c of OVERLAY_CHIPS) {
    if (c.chip === text) run.chips[c.id] = true
  }
  session.blocks.push({
    kind: 'assistant',
    text: `Okay — redrawing the **${run.label}** creatives.`,
    runLabel: run.label,
  })
  // A new round is a new block: the one above keeps the pictures it was asked about,
  // and the answer to this note arrives where the note was typed.
  const next = run.cells.map((c) => ({ ...c, status: 'pending' }))
  session.blocks.push({ kind: 'run', runId: run.id, cells: next })
  attachCells(run, next)
  const images = styleImages(run.styleId)
  const at = images.indexOf(next[0].imageUrl)
  renderCells(run, images.slice(at + 1).concat(images.slice(0, at + 1)), 2200, 900)
}

/** The run's rounds, oldest first: the block each one drew into and the note that asked for it. */
export function runVersions(run) {
  const out = []
  let ask = null
  for (const b of session.blocks) {
    if (b.kind === 'user' && b.runLabel === run.label) ask = b.text
    if (b.kind === 'run' && b.runId === run.id) {
      out.push({ block: b, imageUrl: b.cells[0]?.imageUrl ?? null, ask: out.length ? ask : 'Original' })
    }
  }
  return out
}

/** The peeked round becomes the run again. The rounds after it go; what was said stays. */
export function keepRunVersion(runId, block) {
  const run = runById(runId)
  if (!run) return
  const at = session.blocks.indexOf(block)
  for (let i = session.blocks.length - 1; i > at; i -= 1) {
    if (session.blocks[i].kind === 'run' && session.blocks[i].runId === runId) session.blocks.splice(i, 1)
  }
  run.cells = block.cells
}

/** The badges a run's notes so far have earned. */
export function runChipBadges(run) {
  return OVERLAY_CHIPS.filter((c) => run.chips[c.id]).map((c) => c.badge)
}

/** The Try sentences, for a run rather than the overlay's single concept. */
export function runTryChips(run) {
  const [logo, backToSchool, holiday, larger] = OVERLAY_CHIPS
  return run?.label === 'Badge' ? [logo, backToSchool, larger] : [logo, backToSchool, holiday]
}

/**
 * Campaigns drafted in this session.
 *
 * Kept beside the mock catalogue rather than pushed into it: `campaigns` is the list
 * the Campaigns screen reads, and a prototype that rewrote it would have to answer for
 * what happens on a reload. Listed by the chooser, so a second run can be added to the
 * campaign the first one just made.
 */
export const sessionDrafts = reactive([])

/** What the chooser offers: the store's campaigns, plus anything made here. */
export function campaignOptions() {
  return [
    ...sessionDrafts,
    ...campaigns.map((c) => ({ id: c.id, name: c.name, status: c.status })),
  ]
}

/**
 * The ad sets an ad can be added to.
 *
 * An ad lives in an ad set, not in a campaign, so naming the campaign is only half the
 * answer — and the half that says the least, since the budget and the audience are the
 * ad set's.
 */
export function campaignAdSets(campaignId) {
  const draft = sessionDrafts.find((c) => c.id === campaignId)
  if (draft) return draft.adSets
  return (workspaceFor(campaignId)?.adSets ?? []).map((a) => ({ id: a.id, name: a.name }))
}

/**
 * Take a run somewhere: into a campaign that exists, or into a new one.
 *
 * The run stays where it is. Using a direction is not being done with it — the same
 * creatives can go to a second campaign, and the thread keeps the pictures either way.
 */
export function useRunInCampaign(runId, choice) {
  const run = runById(runId)
  if (!run) return
  if (choice.campaignId) {
    const target = campaignOptions().find((c) => c.id === choice.campaignId)
    const set = campaignAdSets(choice.campaignId).find((a) => a.id === choice.adSetId)
    session.blocks.push({
      kind: 'assistant',
      text: `Added the **${run.label}** ad — ${run.catalogIds?.length ?? run.cells.length} products — to **${target?.name ?? 'the campaign'}**${set ? ` · ${set.name}` : ''}. Open it from Campaigns when you want to publish it to Meta.`,
      runLabel: run.label,
    })
    placeRunAd(run, choice.campaignId, choice.adSetId)
    return
  }
  const name = choice.name?.trim() || session.title
  const id = `cmp_draft_${sessionDrafts.length + 1}`
  const adSetId = `as_draft_${sessionDrafts.length + 1}`
  sessionDrafts.push({
    id,
    name,
    status: 'draft',
    // The product gives a new campaign one quiet ad set rather than asking for a name
    // nobody has an opinion about yet.
    adSets: [{ id: adSetId, name: 'Default ad set' }],
  })
  session.blocks.push({
    kind: 'assistant',
    text: `Campaign **${name}** is drafted from the **${run.label}** direction on ${run.catalogIds?.length ?? run.cells.length} products. Open it from Campaigns when you want to publish it to Meta.`,
    runLabel: run.label,
  })
  placeRunAd(run, id, adSetId, {
    id,
    name,
    domain: activeBrand().domain,
    status: 'draft',
    objective: 'Sales',
    advantagePlus: false,
    kpis: { last_7d: null, last_30d: null, maximum: null },
    adSets: [{ id: adSetId, name: 'Default ad set', budget: '€50 / day', schedule: 'Runs continuously', goal: 'Purchases', ads: [] }],
  })
}

/** Where a style goes when the catalog is put off: the draft that waits for one. */
export const NO_CATALOG_CAMPAIGN_ID = 'cmp_6'

/**
 * "Not now" on the choose-products step: the style goes into the no-catalog draft as an
 * ad on the products it was previewed on — nothing more can be picked without a
 * catalog — and the merchant lands there, where connecting it is the next step.
 */
export function keepRunWithoutCatalog(runId) {
  const run = runById(runId)
  if (!run) return
  run.catalogIds = [...run.productIds]
  const target = campaignById(NO_CATALOG_CAMPAIGN_ID)
  session.blocks.push({
    kind: 'assistant',
    text: `Saved the **${run.label}** style to **${target.name}** on the ${run.productIds.length} products it was previewed on. Connect your catalog there when you want to add products and go live.`,
    runLabel: run.label,
  })
  placeRunAd(run, target.id, workspaceFor(target.id).adSets[0].id)
}

let generationSeq = 0

/**
 * The run as an ad, and the merchant taken to the campaign it went into.
 *
 * The creatives the preview drew go in as they are. The rest of the products picked in
 * step 3 start generating straight away, and `generation` is what the campaign page
 * reports on while they land — one charge per product, as every round is charged.
 */
function placeRunAd(run, campaignId, adSetId, campaign) {
  if (!workspaceCampaigns[campaignId]) workspaceCampaigns[campaignId] = campaign ?? workspaceFor(campaignId)
  const ws = workspaceCampaigns[campaignId]
  const set = ws.adSets.find((a) => a.id === adSetId) ?? ws.adSets[0]
  const productIds = [...(run.catalogIds ?? run.productIds)]
  const drawn = run.cells
    .filter((c) => c.imageUrl)
    .map((c, i) => ({ id: `crt_${run.id}_${i}`, productId: c.productId, productName: c.name, imageUrl: c.imageUrl }))

  // The same direction placed in the same ad set again is the same ad, brought up to
  // the new pick — not a second copy of it beside the first.
  let ad = set.ads.find((a) => a.runId === run.id)
  if (ad) {
    const kept = ad.creatives.filter((c) => productIds.includes(c.productId))
    ad.creatives = [...kept, ...drawn.filter((d) => !kept.some((c) => c.productId === d.productId))]
    ad.productIds = productIds
  } else {
    set.ads.push({ id: `ad_${run.id}`, runId: run.id, name: run.label, productIds, creatives: drawn, generation: null })
    ad = set.ads[set.ads.length - 1]
  }

  // One report on the page: the round just started. An older one is over, finished or not.
  for (const s of ws.adSets) for (const a of s.ads) if (a !== ad) a.generation = null

  const missing = productIds.filter((id) => !ad.creatives.some((c) => c.productId === id))
  generationSeq += 1
  const gen = missing.length ? { id: generationSeq, total: missing.length, done: 0, status: 'running' } : null
  ad.generation = gen
  navigate(`/campaigns/${campaignId}`)
  if (!gen) return

  spendCredits(missing.length)
  const images = styleImages(run.styleId)
  missing.forEach((id, i) => {
    setTimeout(() => {
      // A later placement of this ad took over; this round's pictures are not wanted.
      if (ad.generation?.id !== gen.id) return
      const p = products.find((x) => x.id === id)
      ad.creatives.push({
        id: `crt_${run.id}_${gen.id}_${i}`,
        productId: id,
        productName: p?.name ?? id,
        imageUrl: images[i % images.length],
      })
      ad.generation.done += 1
      if (ad.generation.done === ad.generation.total) ad.generation.status = 'ready'
    }, 1200 + i * 1400)
  })
}

/** Open an ad on its Products tab — where a finished generation is reviewed. */
export function reviewAd(campaignId, adId) {
  state.adTab = 'products'
  navigate(`/campaigns/${campaignId}/ads/${adId}`)
}

// -- Credits -----------------------------------------------------------------

/**
 * What a task costs.
 *
 * One credit is one rendered creative, because that is the only thing in a session
 * that costs anything: the reading, the brand match and the conversation are free.
 * That makes every price on screen countable rather than a number to be trusted —
 * four concepts is four, a direction on two more products is two.
 */
const GRANTED_CREDITS = account.credits.granted

function spendCredits(n) {
  if (n <= 0) return
  account.credits.balance = Math.max(0, account.credits.balance - n)
}

/** What the four concepts on the seed product cost. */
const CONCEPTS_COST = 4

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
  /** The product the concepts were built on — the overlay's step 1 is this one. */
  seed: null,
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
  session.seed = null
  // A prototype is reset over and over, and a balance that only ever fell would be at
  // zero by the third look. The account's own credits go back with the task.
  account.credits.balance = GRANTED_CREDITS - 360
  runs.splice(0, runs.length)
  sessionDrafts.splice(0, sessionDrafts.length)
  runScope.runId = null
  runScope.cleared = false
  runOverlay.runId = null
  closeConceptOverlay()
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
  session.seed = { id: opt.productId ?? opt.id, name: opt.label }
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
  spendCredits(CONCEPTS_COST)
  // One product, four directions: every card shows the seed's image until the
  // mock has a per-style render of the same product.
  const seedImage =
    products.find((p) => p.id === session.seed.id)?.imageUrl ?? inspirationCatalog[0].imageUrl
  session.blocks.push({
    kind: 'concepts',
    seedProductName: seed.label,
    concepts: creativePresets.map((preset) => ({
      id: `cpt_${preset.id}`,
      presetId: preset.id,
      label: preset.label,
      description: preset.description,
      imageUrl: seedImage,
    })),
  })
  session.blocks.push({
    kind: 'assistant',
    text: 'Four concepts for **' + seed.label + '**. Tell me what to change, or take one further.',
  })
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
  spendCredits(products.filter((p) => p.imageUrl).length)
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
        session.phase = 'ready'
      }
    }, 600 + i * 450)
  })
}

/** The four concepts on screen, or none — the newest block wins. */
function openConcepts() {
  for (let i = session.blocks.length - 1; i >= 0; i -= 1) {
    if (session.blocks[i].kind === 'concepts') return session.blocks[i].concepts
  }
  return []
}

/** Letters only, so "Call-Out", "call out" and "callout" are one word. */
const bareLetters = (text) => text.toLowerCase().replace(/[^a-z]/g, '')

/**
 * Which direction a note is about, read out of the note itself.
 *
 * `'all'` where it says so, the concept where it names one — by style or by the letter
 * the card carries, matched as a capital so the "a" in every other sentence is not a
 * direction — and `null` where it says neither. Null is the whole point: a note that
 * does not say which of four creatives to change cannot be guessed at, because the
 * wrong guess spends a round on the wrong direction.
 */
function conceptFromNote(text, concepts) {
  if (/\b(all|both|each|every|them)\b/i.test(text)) return 'all'
  const typed = bareLetters(text)
  const named = concepts.find((c) => typed.includes(bareLetters(c.label)))
  if (named) return named
  const letter = text.match(/\b([A-D])\b/)
  if (letter) return concepts[letter[1].charCodeAt(0) - 65] ?? null
  return null
}

const STANDING_ASK =
  'Noted — I kept that as a standing ask, so every creative rendered from here on follows it.'

function answerStandingAsk(delay = 900) {
  session.busy = true
  setTimeout(() => {
    session.blocks.push({ kind: 'assistant', text: STANDING_ASK })
    session.busy = false
  }, delay)
}

/**
 * A note typed at the session rather than at a run.
 *
 * With four concepts on screen and nothing saying which one, the agent asks instead of
 * picking: the question and the four answers are a turn in the thread, the same shape
 * as every other question it asks, so the conversation carries the ambiguity rather
 * than a modal interrupting it.
 */
export function sendRefine() {
  const text = session.input.trim()
  if (!text) return
  session.input = ''
  session.blocks.push({ kind: 'user', text })

  const concepts = openConcepts()
  const said = concepts.length ? conceptFromNote(text, concepts) : 'all'
  if (said === 'all') {
    answerStandingAsk()
    return
  }
  if (said) {
    // It named its direction. Nothing to ask.
    startRun(said)
    return
  }

  session.busy = true
  setTimeout(() => {
    session.blocks.push({
      kind: 'assistant',
      text: 'Which one should that change — or all four?',
    })
    session.blocks.push({
      kind: 'options',
      purpose: 'clarify',
      // Kept on the block so the thread can show what is being answered.
      note: text,
      options: [
        ...concepts.map((c, i) => ({
          id: c.id,
          label: c.label,
          letter: String.fromCharCode(65 + i),
          imageUrl: c.imageUrl,
        })),
        { id: 'all', label: 'All four' },
      ],
      disabled: false,
    })
    session.busy = false
  }, 700)
}

/**
 * The answer to that question.
 *
 * Returns the concept the screen should now start a direction on — each session screen
 * starts one its own way — or null where the answer was "all four", which is a standing
 * ask and renders nothing.
 */
export function clarifyPick(opt) {
  disableOptions('clarify')
  session.blocks.push({ kind: 'user', text: opt.label })
  if (opt.id === 'all') {
    answerStandingAsk(700)
    return null
  }
  return openConcepts().find((c) => c.id === opt.id) ?? null
}

// -- Campaign workspace ------------------------------------------------------

/**
 * A campaign as the workspace reads it: ad sets, the ads under them, and the
 * creatives each ad carries. The tree is what the page is — everything else on
 * the screen describes one of these three levels.
 */
const workspaceCreative = (i, name, productId) => ({
  id: `crt_${i}`,
  productName: name,
  productId,
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
  // Drafted from a session before any catalog was connected: three creatives on products
  // the store scan found, and nothing on Meta yet.
  cmp_6: {
    id: 'cmp_6',
    name: 'No catalog — winter launch',
    domain: 'nordicsupply.com',
    status: 'draft',
    objective: 'Sales',
    advantagePlus: false,
    noCatalog: true,
    kpis: { last_7d: null, last_30d: null, maximum: null },
    adSets: [
      {
        id: 'as_nc1',
        name: 'Broad — EU',
        budget: '€50 / day',
        schedule: 'Runs continuously',
        goal: 'Purchases',
        ads: [
          {
            id: 'ad_nc1',
            name: 'Mixed — winter launch',
            productIds: [0, 1, 2].map((i) => products[i].id),
            creatives: [0, 1, 2].map((i) => workspaceCreative(i + 10, products[i].name, products[i].id)),
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
