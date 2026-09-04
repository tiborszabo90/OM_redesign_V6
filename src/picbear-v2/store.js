import { reactive } from 'vue'

// Product-list thumbnails use the 3 clean studio product shots we have,
// mapped by category (bag = coffee/beans, cup = drinks/glassware, mug = mugs/gear),
// so the grid reads like a real product catalog rather than lifestyle photos.
// The first 36 are hand-written; the catalog is then padded out to CATALOG_SIZE
// with long-tail variants, so the demo store is the size of a real one.
const curatedProducts = [
  { id: 1, name: 'Lumina Glow Cream 50ml', price: '€14.90', img: '/picbear/lumina-glow-cream-50ml.jpg', category: 'Coffee', sales: 412, bestseller: true },
  { id: 2, name: 'Espresso cup, stone white', price: '€19.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 356 },
  { id: 3, name: 'Cold brew glass', price: '€9.50', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 301 },
  { id: 4, name: 'Ceramic mug, cream', price: '€12.00', img: '/picbear/mug-cookies.jpg', category: 'Drinkware', sales: 287 },
  { id: 5, name: 'Whole beans 1kg', price: '€24.90', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 244 },
  { id: 6, name: 'Single origin Ethiopia', price: '€16.50', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 231 },
  { id: 7, name: 'Latte set for two', price: '€22.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 198 },
  { id: 8, name: 'Home barista machine', price: '€349.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 176 },
  { id: 9, name: 'Walnut coffee cup', price: '€11.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 154 },
  { id: 10, name: 'Filter starter kit', price: '€29.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 121 },
  { id: 11, name: 'Barista workshop ticket', price: '€45.00', img: '/picbear/mug-cookies.jpg', category: 'Experiences', sales: 87 },
  { id: 12, name: 'Coffee tasting for two', price: '€39.00', img: '/picbear/cup-espresso.jpg', category: 'Experiences', sales: 45 },
  { id: 13, name: 'Decaf house blend 250g', price: '€14.90', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 118 },
  { id: 14, name: 'Colombia Huila 250g', price: '€16.50', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 109 },
  { id: 15, name: 'Guatemala Antigua 250g', price: '€16.50', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 102 },
  { id: 16, name: 'Brazil Santos 1kg', price: '€24.90', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 96 },
  { id: 17, name: 'Cortado glass set', price: '€18.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 91 },
  { id: 18, name: 'Milk frother, matte black', price: '€29.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 88 },
  { id: 19, name: 'Reusable travel cup', price: '€16.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 84 },
  { id: 20, name: 'Manual coffee grinder', price: '€39.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 79 },
  { id: 21, name: 'Gooseneck kettle', price: '€45.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 74 },
  { id: 22, name: 'Paper filters, 100 pack', price: '€6.50', img: '/picbear/mug-cookies.jpg', category: 'Accessories', sales: 71 },
  { id: 23, name: 'Cold brew bottle 1L', price: '€19.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 66 },
  { id: 24, name: 'Espresso tamper', price: '€22.00', img: '/picbear/mug-cookies.jpg', category: 'Accessories', sales: 61 },
  { id: 25, name: 'Knock box', price: '€26.00', img: '/picbear/mug-cookies.jpg', category: 'Accessories', sales: 57 },
  { id: 26, name: 'Tasting flight set', price: '€34.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 52 },
  { id: 27, name: "Roaster's tote bag", price: '€12.00', img: '/picbear/mug-cookies.jpg', category: 'Merch', sales: 48 },
  { id: 28, name: 'Ceramic pour-over dripper', price: '€24.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 44 },
  { id: 29, name: 'Double-wall glasses, pair', price: '€21.00', img: '/picbear/cup-espresso.jpg', category: 'Drinkware', sales: 40 },
  { id: 30, name: 'Signature Roast 1kg', price: '€39.00', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 36 },
  { id: 31, name: 'Holiday blend 250g', price: '€15.90', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 33 },
  { id: 32, name: 'Oat milk, barista edition', price: '€3.50', img: '/picbear/cup-espresso.jpg', category: 'Accessories', sales: 29 },
  { id: 33, name: 'Digital coffee scale', price: '€32.00', img: '/picbear/mug-cookies.jpg', category: 'Equipment', sales: 25 },
  { id: 34, name: 'Storage canister, steel', price: '€18.00', img: '/picbear/mug-cookies.jpg', category: 'Accessories', sales: 21 },
  { id: 35, name: 'Gift card', price: '€25.00', img: '/picbear/mug-cookies.jpg', category: 'Merch', sales: 18 },
  { id: 36, name: 'Sampler box, 4 origins', price: '€29.00', img: '/picbear/bag-studio.jpg', category: 'Coffee', sales: 15 },
]

// Long tail: every curated product gets a few variants so the catalog reaches a
// realistic size. Sales keep declining, so the curated ones stay the bestsellers.
const CATALOG_SIZE = 234
const variantSuffixes = ['2-pack', 'Gift box', 'Refill', 'Limited edition', 'Subscription', 'Sample size', 'Bulk pack', 'Seasonal edition']

export const products = [...curatedProducts]
for (let i = products.length; i < CATALOG_SIZE; i++) {
  const base = curatedProducts[i % curatedProducts.length]
  const suffix = variantSuffixes[Math.floor(i / curatedProducts.length) % variantSuffixes.length]
  products.push({
    id: i + 1,
    name: `${base.name} · ${suffix}`,
    price: base.price,
    img: base.img,
    category: base.category,
    sales: Math.max(1, 14 - Math.floor((i - curatedProducts.length) / 16)),
  })
}

export const bestseller = products[0]

// Storefront collections, derived from the catalog (used by the product filters).
export const productCategories = [...new Set(products.map(p => p.category))]

export const styleOptions = [
  {
    id: 'lifestyle',
    name: 'Lifestyle background',
    desc: 'Your product in a realistic scene with natural light and real context.',
    img: '/picbear/lattes-plants.jpg',
    preview: '/picbear/style-lifestyle.jpg',
  },
  {
    id: 'badge',
    name: 'Badge overlay',
    desc: 'Keeps your clean background and adds one tasteful badge that fits the product.',
    img: '/picbear/bag-studio.jpg',
    overlay: 'badge',
    preview: '/picbear/style-badge.jpg',
  },
  {
    id: 'callouts',
    name: 'Value prop callouts',
    desc: '1 to 3 benefit callouts, extracted from your title, description and tags.',
    img: '/picbear/bag-studio.jpg',
    overlay: 'callouts',
    preview: '/picbear/style-callouts.jpg',
  },
  {
    id: 'people',
    name: 'People using product',
    desc: 'Real people enjoying your product in an authentic everyday setting.',
    img: '/picbear/people-kitchen.jpg',
    preview: '/picbear/style-people.jpg',
  },
]

// Images other stores already generated, shown while the previews render.
// Titles and style labels come from the PicBear gallery these creatives are from.
export const inspirationFeed = [
  { img: '/picbear/feed/gen_01.jpg', title: 'Catalog sample 01', style: 'Lifestyle' },
  { img: '/picbear/feed/badge-02-floating-pills.jpg', title: 'Floating pills', style: 'Badge' },
  { img: '/picbear/feed/gen_02.jpg', title: 'Catalog sample 02', style: 'Badge' },
  { img: '/picbear/feed/lifestyle-01-classic-split.jpg', title: 'Classic vertical split', style: 'Lifestyle' },
  { img: '/picbear/feed/gen_03.jpg', title: 'Catalog sample 03', style: 'Mixed' },
  { img: '/picbear/feed/mixed-01-kitchen-headline.jpg', title: 'Kitchen headline', style: 'Mixed' },
  { img: '/picbear/feed/gen_04.jpg', title: 'Catalog sample 04', style: 'Callout' },
  { img: '/picbear/feed/lifestyle-03-soft-diagonal.jpg', title: 'Soft diagonal', style: 'Lifestyle' },
  { img: '/picbear/feed/gen_05.jpg', title: 'Catalog sample 05', style: 'Mixed' },
  { img: '/picbear/feed/callout-05-toothbrush.jpg', title: 'Curved leaders', style: 'Callout' },
  { img: '/picbear/feed/gen_06.jpg', title: 'Catalog sample 06', style: 'Callout' },
  { img: '/picbear/feed/mixed-02-gaming-caps.jpg', title: 'Bold caps promo', style: 'Mixed' },
  { img: '/picbear/feed/gen_07.jpg', title: 'Catalog sample 07', style: 'Mixed' },
  { img: '/picbear/feed/badge-05-horizontal-rows.jpg', title: 'Horizontal rows', style: 'Badge' },
  { img: '/picbear/feed/gen_08.jpg', title: 'Catalog sample 08', style: 'Callout' },
  { img: '/picbear/feed/mixed-04-outdoor-pills.jpg', title: 'Bottom pill row', style: 'Mixed' },
  { img: '/picbear/feed/gen_09.jpg', title: 'Catalog sample 09', style: 'Callout' },
  { img: '/picbear/feed/callout-04-circular.jpg', title: 'Circular / top-down', style: 'Callout' },
  { img: '/picbear/feed/gen_10.jpg', title: 'Catalog sample 10', style: 'Callout' },
  { img: '/picbear/feed/gen_12.jpg', title: 'Catalog sample 11', style: 'Lifestyle' },
]

export const placementOptions = [
  { id: 'replace', name: 'Replace main image', desc: 'Swap the hero photo with the AI version.' },
  { id: 'below-hero', name: 'Below the hero', desc: 'Add the AI image right after the main photos.', recommended: true },
  { id: 'below-desc', name: 'Below the description', desc: 'Add the AI image under the product description.' },
  { id: 'custom', name: 'Custom', desc: 'Specify a CSS selector manually.' },
]

// Insert position relative to the custom CSS selector.
export const insertModes = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' },
]

// Gallery slot the AI image takes when the placement is "Replace main image".
// The original product photo is always kept, just reordered.
export const galleryPositions = [
  { value: 'main', label: 'Main image' },
  { value: 'second', label: 'Second image' },
  { value: 'last', label: 'Last image' },
]

export const ratioOptions = ['1:1', '4:3', '3:4', '16:9', '4:5']

export function ratioCss(r) {
  return r.replace(':', ' / ')
}

export const subscriptionPlans = [
  {
    id: 'free', name: 'Free', price: '€0', per: 'month', images: 10,
    blurb: 'Try Picbear on your bestsellers, no card needed.',
    features: ['10 AI images included', 'All 4 styles', 'Fine-tune & regenerate'],
  },
  {
    id: 'starter', name: 'Starter', price: '€9', per: 'month', images: 50,
    blurb: 'For small catalogs that want every product covered.',
    features: ['50 AI images / month', 'All 4 styles', 'Fine-tune & regenerate'],
  },
  {
    id: 'growth', name: 'Growth', price: '€19', per: 'month', images: 200, recommended: true,
    blurb: 'The full toolkit to turn images into revenue.',
    features: ['200 AI images / month', 'A/B testing', 'Seasonal variations', 'Priority support'],
  },
]

// Named variation batches shown on the Variations list page.
// Each opens a sub-page with a review-style list of its products.
// autoAdd / autoPublish are per-variation automation toggles; instructions and
// the ratios apply to every image in the batch (edited on its fine-tune sub-page).
// productIds = products picked for the variation, generatedIds = the ones that
// already have an image; the rest are waiting for a later generation batch.
export const variationBatches = reactive([
  { id: 'main', name: 'Product image change', styleId: 'lifestyle', productIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], generatedIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], status: 'live', ctr: '4.8%', autoAdd: true, autoPublish: false, placement: 'below-hero', galleryPos: 'main', customSelector: '', customMode: 'below', instructions: '', ratioSame: true, desktopRatio: '4:3', mobileRatio: '4:3' },
  { id: 'badge', name: 'Image with badge', styleId: 'badge', productIds: [1, 2, 3, 4, 5, 6], generatedIds: [1, 2, 3, 4, 5, 6], status: 'live', ctr: '4.1%', autoAdd: false, autoPublish: false, placement: 'replace', galleryPos: 'main', customSelector: '', customMode: 'below', instructions: '', ratioSame: true, desktopRatio: '1:1', mobileRatio: '1:1' },
  { id: 'callouts', name: 'Value prop callouts', styleId: 'callouts', productIds: [1, 2, 3, 4], generatedIds: [1, 2, 3, 4], status: 'draft', ctr: null, autoAdd: false, autoPublish: false, placement: 'below-desc', galleryPos: 'main', customSelector: '', customMode: 'below', instructions: '', ratioSame: true, desktopRatio: '4:3', mobileRatio: '4:3' },
  { id: 'people', name: 'People using product', styleId: 'people', productIds: [1, 2, 3], generatedIds: [1, 2, 3], status: 'paused', ctr: '3.6%', autoAdd: false, autoPublish: false, placement: 'below-hero', galleryPos: 'main', customSelector: '', customMode: 'below', instructions: '', ratioSame: false, desktopRatio: '16:9', mobileRatio: '4:5' },
])

// A/B tests: each test pits a variation's AI images against the original photos
// on a 50/50 traffic split. Two seeds: one finished (proof), one in progress.
export const abTests = reactive([
  {
    id: 'badge-test',
    variationId: 'badge',
    name: 'Image with badge vs Original',
    status: 'completed',       // running | completed
    day: 14, days: 14,
    winner: 'variant',
    applied: false,
    confidence: 96,
    uplift: '+27%',
    autoStop: true,
    minOrders: 50,
    stopConfidence: 95,
    // Raw counts; rates (ATC, CVR, AOV) are derived in the view.
    arms: {
      original: { visitors: 1418, addToCarts: 58, orders: 39, revenue: 612, chanceToWin: 4 },
      variant: { visitors: 1425, addToCarts: 74, orders: 51, revenue: 844, chanceToWin: 96 },
    },
  },
  {
    id: 'main-test',
    variationId: 'main',
    name: 'Product image change vs Original',
    status: 'running',
    day: 3, days: 14,
    winner: null,
    applied: false,
    confidence: 62,
    uplift: '+14%',
    autoStop: true,
    minOrders: 50,
    stopConfidence: 95,
    arms: {
      original: { visitors: 402, addToCarts: 16, orders: 9, revenue: 141, chanceToWin: 38 },
      variant: { visitors: 396, addToCarts: 18, orders: 11, revenue: 177, chanceToWin: 62 },
    },
  },
])

export const state = reactive({
  screen: 'welcome',         // launch on the welcome intro; it leads to the type selector. welcome | home (active account) | home-onboarding-fallback (setup guide) | style | placement | products | generate | review | finetune | enable | done | plans
  appTab: 'home',            // picbear subnav: home | variations | abtests
  openVariation: null,       // variation batch id open on the Variations sub-page (drives the URL)
  editSection: null,         // 'image' | 'placement' | 'automation' when editing that variation (drives the URL)
  openAbTest: null,          // A/B test id open on the A/B Tests sub-page, or 'new' for setup (drives the URL)
  abTestPrefill: null,       // variation id to preselect when the A/B test setup opens
  style: null,
  placement: 'below-hero',
  galleryPos: 'main',        // gallery slot used when placement is 'replace'
  customSelector: '',        // CSS selector used when placement is 'custom'
  customMode: 'below',       // 'above' | 'below' the custom selector
  selected: products.filter(p => p.sales >= 121).map(p => p.id),
  instructions: '',
  ratioSame: true,          // image ratio picked on the generate step, applies to the whole batch
  desktopRatio: '4:3',
  mobileRatio: '4:3',
  previewsSeen: false,
  generated: {},             // id -> 'pending' | 'done'
  approved: {},
  themeEnabled: false,
  published: false,
  steps: { style: false, placement: false, products: false, generate: false, live: false },
  abTestRunning: false,
  newVariationFlow: false,   // true while the wizard runs to add a variation, not to onboard
  genPhase: 'preview',       // generate screen: preview (fine-tune the already-generated image) | batch
  editingId: null,           // product id being fine-tuned
  editReturn: 'review',      // screen to return to from the editor
  imageSettings: {},         // id -> { instructions, ratioSame, desktopRatio, mobileRatio, placement }
  plan: 'trial',             // 'trial' | subscription plan id ('starter' | 'growth' | 'scale')
  imageLimit: 10,            // selectable products; lifted by subscribing
  settings: {                // app settings (Settings screen)
    emailOnFinish: true,     // email when a batch finishes
    weeklyDigest: true,      // weekly performance summary email
  },
})

export function stepsDone() {
  return Object.values(state.steps).filter(Boolean).length
}

export function styleById(id) {
  return styleOptions.find(s => s.id === id)
}

export function editSettings(id) {
  if (!state.imageSettings[id]) {
    state.imageSettings[id] = {
      instructions: '',
      ratioSame: true,
      desktopRatio: '4:3',
      mobileRatio: '4:3',
      placement: state.placement,
    }
  }
  return state.imageSettings[id]
}

// Adding a variation after setup reuses the onboarding wizard (style → placement
// → products → generate → review → enable). The flag marks that run so the last
// step creates a new batch instead of onboarding the account again.
export function startVariationFlow() {
  state.newVariationFlow = true
  state.style = null
  state.instructions = ''
  state.previewsSeen = true   // the previews already exist by now, no generating skeletons
  state.generated = {}
  state.approved = {}
  state.genPhase = 'preview'
  state.appTab = 'home'
  state.screen = 'style'
}

// Start a new variation based on an existing one: the look and instructions
// carry over, placement and products start fresh (this is not a duplicate).
// The wizard picks up at the placement step since the look is already set.
export function startVariationFlowFrom(batchId) {
  const src = variationBatches.find(b => b.id === batchId)
  if (!src) return startVariationFlow()
  state.newVariationFlow = true
  state.style = src.styleId
  state.instructions = src.instructions
  state.previewsSeen = true
  state.generated = {}
  state.approved = {}
  state.genPhase = 'preview'
  state.placement = 'below-hero'
  state.galleryPos = 'main'
  state.customSelector = ''
  state.customMode = 'below'
  state.selected = products.filter(p => p.sales >= 121).map(p => p.id)
  state.steps.style = true
  state.appTab = 'home'
  state.screen = 'placement'
}

export function exitVariationFlow() {
  state.newVariationFlow = false
  state.appTab = 'variations'
  state.openVariation = null
  state.editSection = null
  state.screen = 'home'
}

// Publishing at the end of that run turns the wizard picks into a live batch.
export function finishVariationFlow() {
  const style = styleById(state.style) || styleOptions[0]
  const sameLook = variationBatches.filter(b => b.name.startsWith(style.name)).length
  const id = 'batch-' + (variationBatches.length + 1)
  variationBatches.push({
    id,
    name: sameLook ? `${style.name} ${sameLook + 1}` : style.name,
    styleId: style.id,
    productIds: [...state.selected],
    generatedIds: state.selected.filter(pid => state.generated[pid] === 'done'),
    status: 'live',
    ctr: null,
    autoAdd: false,
    autoPublish: false,
    placement: state.placement,
    galleryPos: state.galleryPos,
    customSelector: state.customSelector,
    customMode: state.customMode,
    instructions: state.instructions,
    ratioSame: state.ratioSame,
    desktopRatio: state.desktopRatio,
    mobileRatio: state.mobileRatio,
  })
  state.newVariationFlow = false
  state.appTab = 'variations'
  state.openVariation = id
  state.editSection = null
  state.screen = 'home'
}

// Deleting a variation drops its A/B tests as well: a test that measures images
// which no longer exist has nothing left to compare.
export function deleteVariation(batchId) {
  const i = variationBatches.findIndex(b => b.id === batchId)
  if (i >= 0) variationBatches.splice(i, 1)
  for (let j = abTests.length - 1; j >= 0; j--) {
    if (abTests[j].variationId === batchId) abTests.splice(j, 1)
  }
  state.abTestRunning = abTests.some(t => t.status === 'running')
  state.openVariation = null
  state.editSection = null
}

// The generate step ends here: the wizard picks become a draft variation and its
// first batch starts rendering on that variation's own page.
export function startVariationBatch(batchSize) {
  const style = styleById(state.style) || styleOptions[0]
  const sameLook = variationBatches.filter(b => b.name.startsWith(style.name)).length
  const id = 'batch-' + (variationBatches.length + 1)
  const productIds = [...state.selected]

  const batch = {
    id,
    name: sameLook ? `${style.name} ${sameLook + 1}` : style.name,
    styleId: style.id,
    productIds,
    generatedIds: [],
    status: 'draft',
    ctr: null,
    autoAdd: false,
    autoPublish: false,
    placement: state.placement,
    galleryPos: state.galleryPos,
    customSelector: state.customSelector,
    customMode: state.customMode,
    instructions: state.instructions,
    ratioSame: state.ratioSame,
    desktopRatio: state.desktopRatio,
    mobileRatio: state.mobileRatio,
  }
  variationBatches.push(batch)
  const live = variationBatches[variationBatches.length - 1]

  // Only the picked amount renders now; the rest stay queued in the variation.
  state.generated = {}
  productIds.slice(0, batchSize).forEach((pid, i) => {
    state.generated[pid] = 'pending'
    setTimeout(() => {
      state.generated[pid] = 'done'
      live.generatedIds.push(pid)
    }, 1200 + i * 1200)
  })

  state.newVariationFlow = false
  state.published = true
  state.themeEnabled = true
  state.appTab = 'variations'
  state.openVariation = id
  state.editSection = null
  state.screen = 'home'
}

export function openEditor(id, from) {
  editSettings(id)
  state.editingId = id
  state.editReturn = from
  state.appTab = 'home'      // finetune is a wizard screen; leave the variations/abtests tab
  state.screen = 'finetune'
}
