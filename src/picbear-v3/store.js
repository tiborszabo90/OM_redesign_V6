import { reactive } from 'vue'

// The demo store is a skincare and drugstore shop. The catalog below is real
// product data (names, prices, categories, packshots) pulled from the Shopify
// storefront of naturisimo.com; see public/picbear/shop/products.json for the
// source URL of each item. Product 1 is the Lumina demo product the generated
// previews are made of, so it stays the bestseller.
// The catalog is padded out to CATALOG_SIZE with long-tail variants, so the demo
// store is the size of a real one.
const curatedProducts = [
  { id: 1, name: 'Lumina Glow Cream 50ml', price: '€14.90', img: '/picbear/lumina-glow-cream-50ml.jpg', category: 'Skincare', sales: 412, bestseller: true },
  { id: 2, name: 'Susanne Kaufmann Collagen Mousse Serum', price: '€55.00', img: '/picbear/shop/susanne-kaufmann-collagen-mousse-serum.jpg', category: 'Skincare', sales: 356 },
  { id: 3, name: 'Bioeffect Imprinting Hydrogel Mask', price: '€75.00', img: '/picbear/shop/imprinting-hydrogel-mask.jpg', category: 'Skincare', sales: 301 },
  { id: 4, name: 'Beauty of Joseon Revive Eye Serum Ginseng + Retinal', price: '€22.00', img: '/picbear/shop/beauty-of-joseon-revive-eye-serum-ginseng-retina.jpg', category: 'Skincare', sales: 287 },
  { id: 5, name: 'Noble Panacea The Exceptional Eye Lift Concentrate - 12 Doses', price: '€280.00', img: '/picbear/shop/noble-panacea-the-exceptional-eye-lift-concentra.jpg', category: 'Skincare', sales: 244 },
  { id: 6, name: 'Le Rub Repairing Face Mask', price: '€44.00', img: '/picbear/shop/le-rub-repairing-face-mask.jpg', category: 'Skincare', sales: 231 },
  { id: 7, name: 'Odacité Bu+L Sagging Skin Serum Concentrate', price: '€26.40', img: '/picbear/shop/odacite-sagging-skin-serum-concentrate.jpg', category: 'Skincare', sales: 198 },
  { id: 8, name: 'Axis-y Spot The Difference Blemish Treatment', price: '€22.00', img: '/picbear/shop/axis-y-spot-the-difference-blemish-treatment.jpg', category: 'Skincare', sales: 176 },
  { id: 9, name: 'Oskia Midnight Eye-Q Intelligent Peptide Eye Cream', price: '€90.00', img: '/picbear/shop/oskia-midnight-eye-q-intelligent-peptide-eye-cre.jpg', category: 'Skincare', sales: 154 },
  { id: 10, name: 'Biodance Radiant Vita Niacinamide Serum', price: '€24.00', img: '/picbear/shop/biodance-radiant-vita-niacinamide-serum.jpg', category: 'Skincare', sales: 121 },
  { id: 11, name: 'Skin1004 Madagascar Centella Ampoule', price: '€26.00', img: '/picbear/shop/skin1004-madagascar-centella-ampoule.jpg', category: 'Skincare', sales: 118 },
  { id: 12, name: 'Talm Sunveil SPF50+ Dark Spot Correcting Fluid Sunscreen', price: '€32.00', img: '/picbear/shop/talm-sunveil-spf50-dark-spot-correcting-fluid-su.jpg', category: 'Skincare', sales: 109 },
  { id: 13, name: 'Tata Harper Water-Lock Moisturizer Travel Size', price: '€25.00', img: '/picbear/shop/tata-harper-water-lock-moisturizer-travel-size.jpg', category: 'Skincare', sales: 102 },
  { id: 14, name: 'Dermalogica Stabilizing Repair Serum', price: '€65.00', img: '/picbear/shop/dermalogica-stabilizing-repair-serum.jpg', category: 'Body', sales: 96 },
  { id: 15, name: 'Cecily Braden The Lymphatic Brush Combo', price: '€133.00', img: '/picbear/shop/cecily-braden-the-lymphatic-brush-combo.jpg', category: 'Body', sales: 91 },
  { id: 16, name: 'Le Rub Sunscreen Mist SPF50', price: '€44.00', img: '/picbear/shop/le-rub-sunscreen-mist-spf50.jpg', category: 'Body', sales: 88 },
  { id: 17, name: 'L:a Bruket Solstice Revival Body Set', price: '€33.00', img: '/picbear/shop/la-bruket-solstice-revival-body-set.jpg', category: 'Body', sales: 84 },
  { id: 18, name: 'Birkenstock 3-Step Foot Care Kit', price: '€28.00', img: '/picbear/shop/birkenstock-3-step-foot-care-kit.jpg', category: 'Body', sales: 79 },
  { id: 19, name: 'Cair Cleansing Water', price: '€54.00', img: '/picbear/shop/cair-cleansing-water.jpg', category: 'Hair', sales: 74 },
  { id: 20, name: 'K18 AirWash™ Dry Shampoo', price: '€48.00', img: '/picbear/shop/k18-airwash-dry-shampoo.jpg', category: 'Hair', sales: 71 },
  { id: 21, name: 'Slip Pure Silk Scrunchies Back to Basics – Black', price: '€42.00', img: '/picbear/shop/slip-pure-silk-scrunchies-back-to-basics-black.jpg', category: 'Hair', sales: 66 },
  { id: 22, name: 'Flora Lab Paris Pure Ingredient Booster No.1 Hyaluronic Acid', price: '€70.00', img: '/picbear/shop/flora-lab-paris-pure-ingredient-booster-no-1-hya.jpg', category: 'Hair', sales: 61 },
  { id: 23, name: 'Combeau The Rebalancing Hair Calm Duo', price: '€97.00', img: '/picbear/shop/combeau-the-rebalancing-hair-calm-duo.jpg', category: 'Hair', sales: 57 },
  { id: 24, name: 'Westman Atelier Liquid Foundation Brush', price: '€88.00', img: '/picbear/shop/westman-atelier-liquid-foundation-brush.jpg', category: 'Make-up', sales: 52 },
  { id: 25, name: 'Violette_FR Invisible Bandage Soothing & Repairing Gel', price: '€18.00', img: '/picbear/shop/violette-fr-invisible-bandage-soothing-repairing.jpg', category: 'Make-up', sales: 48 },
  { id: 26, name: 'Les Filles En Rouje Lola Blush Brush', price: '€27.00', img: '/picbear/shop/les-filles-en-rouje-lola-blush-brush.jpg', category: 'Make-up', sales: 44 },
  { id: 27, name: 'Westman Atelier Suprême Bio Complex Liquid Foundation', price: '€65.00', img: '/picbear/shop/westman-atelier-supreme-bio-complex-liquid-found.jpg', category: 'Make-up', sales: 40 },
  { id: 28, name: 'Mimétique Skin 360° – The Starter Kit', price: '€49.00', img: '/picbear/shop/mimetique-skin-360-the-starter-kit.jpg', category: 'Wellness', sales: 36 },
  { id: 29, name: 'Lauvée Sponge Sleeves', price: '€9.00', img: '/picbear/shop/lauvee-sponge-sleeves.jpg', category: 'Wellness', sales: 33 },
  { id: 30, name: 'Combeau The Moisturizer Discovery Set', price: '€49.00', img: '/picbear/shop/combeau-the-moisturizer-discovery-set.jpg', category: 'Wellness', sales: 29 },
  { id: 31, name: 'Nooance LED Eye Mask X200', price: '€245.00', img: '/picbear/shop/nooance-led-eye-mask-x200.jpg', category: 'Wellness', sales: 25 },
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

// Where an upgraded image goes on the product page. The visual check tries each
// of the first three on the live page; 'custom' targets an element by selector,
// so there is nothing for the check to pick.
export const placementOptions = [
  { id: 'replace', name: 'Replace main image', desc: 'Swap the hero photo with the AI version.' },
  { id: 'below-hero', name: 'Below the hero', desc: 'Add the AI image right after the main photos.', recommended: true },
  { id: 'below-desc', name: 'Below the description', desc: 'Add the AI image under the product description.' },
  { id: 'custom', name: 'Custom', desc: 'Specify a CSS selector manually.' },
]

export const DEFAULT_PLACEMENT = 'below-hero'

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
  placement: DEFAULT_PLACEMENT,
  galleryPos: 'main',        // gallery slot used when placement is 'replace'
  customSelector: '',        // CSS selector used when placement is 'custom'
  customMode: 'below',       // 'above' | 'below' the custom selector
  selected: products.map(p => p.id),   // the whole catalog to begin with
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
  state.placement = DEFAULT_PLACEMENT
  state.galleryPos = 'main'
  state.customSelector = ''
  state.customMode = 'below'
  state.selected = products.map(p => p.id)
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
// Every generated image is approved by hand before it can go live. The flag is
// kept per variation, so two variations covering the same product don't share it.
export const approvals = reactive({})
// Whether an approved image is served on the storefront. It moves on its own:
// activating or pausing the variation never touches it.
export const liveImages = reactive({})

export function isApproved(batchId, productId) {
  return !!approvals[`${batchId}:${productId}`]
}

export function approveImage(batchId, productId) {
  approvals[`${batchId}:${productId}`] = true
  liveImages[`${batchId}:${productId}`] = true   // approved means live, until switched off
}

export function isImageLive(batchId, productId) {
  return !!liveImages[`${batchId}:${productId}`]
}

export function toggleImageLive(batchId, productId) {
  const key = `${batchId}:${productId}`
  liveImages[key] = !liveImages[key]
}

// The generation run in progress, so a variation page can follow it and stop it.
export const batchRun = reactive({ batchId: null, ids: [], done: 0, running: false })
let batchTimers = []

// Stopping keeps everything already generated; the rest are marked as cut short,
// so the variation shows what never got an image. Generate more picks them up.
export function stopBatch() {
  batchTimers.forEach(clearTimeout)
  batchTimers = []
  batchRun.running = false
  batchRun.ids.forEach(pid => {
    if (state.generated[pid] === 'pending') state.generated[pid] = 'stopped'
  })
}

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
  const running = productIds.slice(0, batchSize)
  batchRun.batchId = id
  batchRun.ids = [...running]
  batchRun.done = 0
  batchRun.running = running.length > 0
  batchTimers = running.map((pid, i) => {
    state.generated[pid] = 'pending'
    return setTimeout(() => {
      state.generated[pid] = 'done'
      live.generatedIds.push(pid)
      batchRun.done++
      if (batchRun.done >= batchRun.ids.length) batchRun.running = false
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

// The next chunk into a variation that already exists, tracked like the first
// run so the progress bar and Stop work the same way.
export function generateMore(batchId, count) {
  const live = variationBatches.find(b => b.id === batchId)
  if (!live) return
  const queue = live.productIds.filter(id => !live.generatedIds.includes(id)).slice(0, count)
  if (!queue.length) return

  batchTimers.forEach(clearTimeout)
  batchRun.batchId = batchId
  batchRun.ids = [...queue]
  batchRun.done = 0
  batchRun.running = true
  batchTimers = queue.map((pid, i) => {
    state.generated[pid] = 'pending'
    return setTimeout(() => {
      state.generated[pid] = 'done'
      live.generatedIds.push(pid)
      batchRun.done++
      if (batchRun.done >= batchRun.ids.length) batchRun.running = false
    }, 1200 + i * 1200)
  })
}

export function openEditor(id, from) {
  editSettings(id)
  state.editingId = id
  state.editReturn = from
  state.appTab = 'home'      // finetune is a wizard screen; leave the variations/abtests tab
  state.screen = 'finetune'
}
