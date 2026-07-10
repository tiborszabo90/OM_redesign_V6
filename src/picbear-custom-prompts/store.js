import { reactive } from 'vue'

export const products = [
  { id: 1, name: 'Signature Roast 250g', price: '€14.90', img: '/picbear/bag-studio.jpg', sales: 412, bestseller: true },
  { id: 2, name: 'Espresso cup, stone white', price: '€19.00', img: '/picbear/cup-espresso.jpg', sales: 356 },
  { id: 3, name: 'Cold brew glass', price: '€9.50', img: '/picbear/cold-brew.jpg', sales: 301 },
  { id: 4, name: 'Ceramic mug, cream', price: '€12.00', img: '/picbear/mug-cookies.jpg', sales: 287 },
  { id: 5, name: 'Whole beans 1kg', price: '€24.90', img: '/picbear/beans-pile.jpg', sales: 244 },
  { id: 6, name: 'Single origin Ethiopia', price: '€16.50', img: '/picbear/beans-burlap.jpg', sales: 231 },
  { id: 7, name: 'Latte set for two', price: '€22.00', img: '/picbear/lattes-plants.jpg', sales: 198 },
  { id: 8, name: 'Home barista machine', price: '€349.00', img: '/picbear/machine-counter.jpg', sales: 176 },
  { id: 9, name: 'Walnut coffee cup', price: '€11.00', img: '/picbear/cup-topview.jpg', sales: 154 },
  { id: 10, name: 'Filter starter kit', price: '€29.00', img: '/picbear/pouring.jpg', sales: 121 },
  { id: 11, name: 'Barista workshop ticket', price: '€45.00', img: '/picbear/people-kitchen.jpg', sales: 87 },
  { id: 12, name: 'Coffee tasting for two', price: '€39.00', img: '/picbear/people-latte.jpg', sales: 45 },
]

export const bestseller = products[0]

// Variations list for the current-product mirror (Variations tab + detail page).
export const variationList = reactive([
  { id: 1, name: 'Test 2', mode: 'Lifestyle', position: 'Replace Hero', status: 'inactive', count: 1, img: '/picbear/lattes-plants.jpg' },
  { id: 2, name: 'Variation 2', mode: 'People Using', position: 'Below Hero', status: 'inactive', count: 10, img: '/picbear/people-latte.jpg' },
  { id: 3, name: 'Variation 4', mode: 'People Using', position: 'Below Hero', status: 'inactive', count: 1, img: '/picbear/people-kitchen.jpg' },
  { id: 4, name: 'Variation 5', mode: 'People Using', position: 'Below Hero', status: 'inactive', count: 1, img: '/picbear/pouring.jpg' },
])

// "After" lifestyle thumbnails cycled for the detail products list.
const afterImages = ['/picbear/people-latte.jpg', '/picbear/people-kitchen.jpg', '/picbear/lattes-plants.jpg', '/picbear/pouring.jpg']

// ── Custom prompts ─────────────────────────────────────────────────────────
// Reusable, named AI instructions the user manages under the "Prompts" tab and
// can pick from the style step. Each is optionally based on one of the 4 looks.
export const baseLookLabels = {
  none: 'None (Custom prompt)',
  lifestyle: 'Lifestyle Background',
  badge: 'Badge Overlay',
  valueprop: 'Value Prop Callouts',
  people: 'People Using Product',
}
export const baseLookImages = {
  none: '/picbear/people-kitchen.jpg',
  lifestyle: '/picbear/lattes-plants.jpg',
  badge: '/picbear/bag-studio.jpg',
  valueprop: '/picbear/bag-studio.jpg',
  people: '/picbear/people-latte.jpg',
}

export const customPrompts = reactive([
  {
    id: 1,
    name: 'Cozy morning kitchen',
    baseStyle: 'lifestyle',
    instructions: 'Place the product on a sunlit wooden kitchen counter with a soft, cozy morning atmosphere and a gently blurred background.',
    previewProductId: 1,
    previewImg: '/picbear/lattes-plants.jpg',
  },
  {
    id: 2,
    name: 'Outdoor picnic vibe',
    baseStyle: 'people',
    instructions: 'Show a person enjoying the product outdoors at a picnic, natural daylight, relaxed summer mood.',
    previewProductId: 7,
    previewImg: '/picbear/people-latte.jpg',
  },
])

let promptCounter = 3
export function createPromptDraft() {
  return { id: null, name: '', baseStyle: 'lifestyle', instructions: '', previewProductId: products[0].id, previewImg: null }
}
export function promptById(id) {
  return customPrompts.find(p => p.id === id)
}
export function savePrompt(draft) {
  if (draft.id) {
    const i = customPrompts.findIndex(p => p.id === draft.id)
    if (i !== -1) customPrompts[i] = { ...draft }
  } else {
    customPrompts.push({ ...draft, id: promptCounter++ })
  }
}
export function deletePrompt(id) {
  const i = customPrompts.findIndex(p => p.id === id)
  if (i !== -1) customPrompts.splice(i, 1)
}
export function duplicatePrompt(id) {
  const p = customPrompts.find(x => x.id === id)
  if (p) customPrompts.push({ ...p, id: promptCounter++, name: `${p.name} (copy)` })
}

// Products shown on a variation detail page — the first `count` catalog products,
// each with a before (studio) and after (lifestyle) thumbnail, all generated.
export function variationProducts(count) {
  return products.slice(0, count).map((p, i) => ({
    id: p.id,
    name: p.name,
    before: p.img,
    after: afterImages[i % afterImages.length],
    status: 'done',
  }))
}

// Create a brand-new variation in a live "generating" state — one product done,
// one generating, the rest queued — and return its id so the detail page can
// simulate progress. Mirrors what "Start generating" opens in the live product.
let genCounter = 6
export function createGeneratingVariation() {
  const id = Date.now()
  const statuses = ['done', 'generating', 'queued', 'queued', 'queued']
  const prods = products.slice(0, 5).map((p, i) => ({
    id: p.id,
    name: p.name,
    before: p.img,
    after: afterImages[i % afterImages.length],
    status: statuses[i] || 'queued',
  }))
  variationList.unshift({
    id,
    name: `Variation ${genCounter++}`,
    mode: 'People Using',
    position: 'Below Hero',
    status: 'inactive',
    count: prods.length,
    img: afterImages[0],
    generating: true,
    products: prods,
  })
  return id
}

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

export const state = reactive({
  screen: 'home',            // home | style | placement | products | generate | review | finetune | enable | done
  appTab: 'home',            // picbear subnav: home | variations | abtests | prompts
  variationDetailId: null,   // when set on the variations tab, show the detail page
  promptEditorId: null,      // null = prompts list; 'new' or an id = editor
  style: null,
  customPromptId: null,      // selected custom prompt id when style === 'custom'
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
  genPhase: 'idle',          // generate screen: idle | sampling | sample-ready | batch
  editingId: null,           // product id being fine-tuned
  editReturn: 'review',      // screen to return to from the editor
  imageSettings: {},         // id -> { instructions, ratioSame, desktopRatio, mobileRatio, placement }
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
  state.screen = 'finetune'
}
