import { reactive } from 'vue'

// Product-list thumbnails use the 3 clean studio product shots we have,
// mapped by category (bag = coffee/beans, cup = drinks/glassware, mug = mugs/gear),
// so the grid reads like a real product catalog rather than lifestyle photos.
export const products = [
  { id: 1, name: 'Signature Roast 250g', price: '€14.90', img: '/picbear/bag-studio.jpg', sales: 412, bestseller: true },
  { id: 2, name: 'Espresso cup, stone white', price: '€19.00', img: '/picbear/cup-espresso.jpg', sales: 356 },
  { id: 3, name: 'Cold brew glass', price: '€9.50', img: '/picbear/cup-espresso.jpg', sales: 301 },
  { id: 4, name: 'Ceramic mug, cream', price: '€12.00', img: '/picbear/mug-cookies.jpg', sales: 287 },
  { id: 5, name: 'Whole beans 1kg', price: '€24.90', img: '/picbear/bag-studio.jpg', sales: 244 },
  { id: 6, name: 'Single origin Ethiopia', price: '€16.50', img: '/picbear/bag-studio.jpg', sales: 231 },
  { id: 7, name: 'Latte set for two', price: '€22.00', img: '/picbear/cup-espresso.jpg', sales: 198 },
  { id: 8, name: 'Home barista machine', price: '€349.00', img: '/picbear/mug-cookies.jpg', sales: 176 },
  { id: 9, name: 'Walnut coffee cup', price: '€11.00', img: '/picbear/cup-espresso.jpg', sales: 154 },
  { id: 10, name: 'Filter starter kit', price: '€29.00', img: '/picbear/mug-cookies.jpg', sales: 121 },
  { id: 11, name: 'Barista workshop ticket', price: '€45.00', img: '/picbear/mug-cookies.jpg', sales: 87 },
  { id: 12, name: 'Coffee tasting for two', price: '€39.00', img: '/picbear/cup-espresso.jpg', sales: 45 },
  { id: 13, name: 'Decaf house blend 250g', price: '€14.90', img: '/picbear/bag-studio.jpg', sales: 118 },
  { id: 14, name: 'Colombia Huila 250g', price: '€16.50', img: '/picbear/bag-studio.jpg', sales: 109 },
  { id: 15, name: 'Guatemala Antigua 250g', price: '€16.50', img: '/picbear/bag-studio.jpg', sales: 102 },
  { id: 16, name: 'Brazil Santos 1kg', price: '€24.90', img: '/picbear/bag-studio.jpg', sales: 96 },
  { id: 17, name: 'Cortado glass set', price: '€18.00', img: '/picbear/cup-espresso.jpg', sales: 91 },
  { id: 18, name: 'Milk frother, matte black', price: '€29.00', img: '/picbear/mug-cookies.jpg', sales: 88 },
  { id: 19, name: 'Reusable travel cup', price: '€16.00', img: '/picbear/cup-espresso.jpg', sales: 84 },
  { id: 20, name: 'Manual coffee grinder', price: '€39.00', img: '/picbear/mug-cookies.jpg', sales: 79 },
  { id: 21, name: 'Gooseneck kettle', price: '€45.00', img: '/picbear/mug-cookies.jpg', sales: 74 },
  { id: 22, name: 'Paper filters, 100 pack', price: '€6.50', img: '/picbear/mug-cookies.jpg', sales: 71 },
  { id: 23, name: 'Cold brew bottle 1L', price: '€19.00', img: '/picbear/cup-espresso.jpg', sales: 66 },
  { id: 24, name: 'Espresso tamper', price: '€22.00', img: '/picbear/mug-cookies.jpg', sales: 61 },
  { id: 25, name: 'Knock box', price: '€26.00', img: '/picbear/mug-cookies.jpg', sales: 57 },
  { id: 26, name: 'Tasting flight set', price: '€34.00', img: '/picbear/cup-espresso.jpg', sales: 52 },
  { id: 27, name: "Roaster's tote bag", price: '€12.00', img: '/picbear/mug-cookies.jpg', sales: 48 },
  { id: 28, name: 'Ceramic pour-over dripper', price: '€24.00', img: '/picbear/mug-cookies.jpg', sales: 44 },
  { id: 29, name: 'Double-wall glasses, pair', price: '€21.00', img: '/picbear/cup-espresso.jpg', sales: 40 },
  { id: 30, name: 'Signature Roast 1kg', price: '€39.00', img: '/picbear/bag-studio.jpg', sales: 36 },
  { id: 31, name: 'Holiday blend 250g', price: '€15.90', img: '/picbear/bag-studio.jpg', sales: 33 },
  { id: 32, name: 'Oat milk, barista edition', price: '€3.50', img: '/picbear/cup-espresso.jpg', sales: 29 },
  { id: 33, name: 'Digital coffee scale', price: '€32.00', img: '/picbear/mug-cookies.jpg', sales: 25 },
  { id: 34, name: 'Storage canister, steel', price: '€18.00', img: '/picbear/mug-cookies.jpg', sales: 21 },
  { id: 35, name: 'Gift card', price: '€25.00', img: '/picbear/mug-cookies.jpg', sales: 18 },
  { id: 36, name: 'Sampler box, 4 origins', price: '€29.00', img: '/picbear/bag-studio.jpg', sales: 15 },
]

export const bestseller = products[0]

export const styleOptions = [
  {
    id: 'lifestyle',
    name: 'Lifestyle background',
    desc: 'Your product in a realistic scene with natural light and real context.',
    img: '/picbear/lattes-plants.jpg',
  },
  {
    id: 'badge',
    name: 'Badge overlay',
    desc: 'Keeps your clean background and adds one tasteful badge that fits the product.',
    img: '/picbear/bag-studio.jpg',
    overlay: 'badge',
  },
  {
    id: 'callouts',
    name: 'Value prop callouts',
    desc: '1 to 3 benefit callouts, extracted from your title, description and tags.',
    img: '/picbear/bag-studio.jpg',
    overlay: 'callouts',
  },
  {
    id: 'people',
    name: 'People using product',
    desc: 'Real people enjoying your product in an authentic everyday setting.',
    img: '/picbear/people-kitchen.jpg',
  },
]

export const placementOptions = [
  { id: 'replace', name: 'Replace main image', desc: 'Swap the hero photo with the AI version.' },
  { id: 'below-hero', name: 'Below the hero', desc: 'Add the AI image right after the main photos.', recommended: true },
  { id: 'below-desc', name: 'Below the description', desc: 'Add the AI image under the product description.' },
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
// autoAdd / autoPublish are per-variation automation toggles.
export const variationBatches = reactive([
  { id: 'main', name: 'Product image change', styleId: 'lifestyle', count: 10, status: 'live', ctr: '4.8%', autoAdd: true, autoPublish: false },
  { id: 'badge', name: 'Image with badge', styleId: 'badge', count: 6, status: 'live', ctr: '4.1%', autoAdd: false, autoPublish: false },
  { id: 'callouts', name: 'Value prop callouts', styleId: 'callouts', count: 4, status: 'draft', ctr: null, autoAdd: false, autoPublish: false },
  { id: 'people', name: 'People using product', styleId: 'people', count: 3, status: 'paused', ctr: '3.6%', autoAdd: false, autoPublish: false },
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
    arms: {
      original: { visitors: 1418, atc: '4.1%', orders: 39, revenue: '€612' },
      variant: { visitors: 1425, atc: '5.2%', orders: 51, revenue: '€844' },
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
    uplift: '+11%',
    arms: {
      original: { visitors: 402, atc: '3.9%', orders: 9, revenue: '€141' },
      variant: { visitors: 396, atc: '4.4%', orders: 11, revenue: '€177' },
    },
  },
])

export const state = reactive({
  screen: 'welcome',         // launch on the welcome intro; it leads to the type selector. welcome | home (active account) | home-onboarding-fallback (setup guide) | style | placement | products | generate | review | finetune | enable | done | plans
  appTab: 'home',            // picbear subnav: home | variations | abtests
  openVariation: null,       // variation batch id open on the Variations sub-page (drives the URL)
  openAbTest: null,          // A/B test id open on the A/B Tests sub-page, or 'new' for setup (drives the URL)
  abTestPrefill: null,       // variation id to preselect when the A/B test setup opens
  style: null,
  placement: 'below-hero',
  selected: products.filter(p => p.sales >= 121).map(p => p.id),
  instructions: '',
  previewsSeen: false,
  generated: {},             // id -> 'pending' | 'done'
  approved: {},
  themeEnabled: false,
  published: false,
  steps: { style: false, placement: false, products: false, generate: false, live: false },
  abTestRunning: false,
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

export function openEditor(id, from) {
  editSettings(id)
  state.editingId = id
  state.editReturn = from
  state.appTab = 'home'      // finetune is a wizard screen; leave the variations/abtests tab
  state.screen = 'finetune'
}
