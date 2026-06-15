<template>
  <div class="h-full flex">
    <!-- LEFT: chat with content cards (hidden in preview) -->
    <aside v-if="!preview" class="w-96 shrink-0 border-r border-om-gray-200 bg-white flex flex-col h-full">
      <div ref="scroller" class="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        <!-- Multi-element (Flow D/E), before chat: full cards wedged into the flow -->
        <template v-if="!single && !chatStarted">
          <p class="text-sm text-om-gray-600">Here's what I added to your page:</p>
          <div
            v-for="item in items"
            :key="item.card.id"
            @click="focusCard(item)"
            class="rounded-xl p-2.5 cursor-pointer transition-colors"
            :class="[!item.enabled ? 'opacity-55' : '', focusedId === item.card.id ? 'bg-(--cl-accent-50)' : 'hover:bg-om-gray-50']"
          >
            <div class="flex items-center gap-1.5">
              <EyeOff v-if="!item.enabled" :size="13" class="text-om-gray-400 shrink-0" />
              <span class="text-sm font-semibold text-om-gray-800">{{ item.card.location }}</span>
            </div>
            <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ item.card.rationale }}</p>
          </div>
        </template>

        <!-- Multi-element, once the chat starts: enhancements collapse to sticky chips -->
        <template v-if="!single && chatStarted">
          <div class="sticky top-0 z-10 bg-white -mx-4 px-4 pt-1 pb-2 border-b border-om-gray-100 flex flex-wrap gap-1.5">
            <div v-for="item in items" :key="item.card.id" class="relative" @mouseenter="hoverId = item.card.id" @mouseleave="hoverId = null">
              <button @click="item.enabled ? toggleFocus(item) : unhide(item)" :title="item.enabled ? '' : 'Show again'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer"
                :class="[
                  focusedId === item.card.id
                    ? 'border-(--cl-accent-500) bg-(--cl-accent-500) text-white shadow-sm'
                    : (item.enabled ? 'border-(--cl-accent-200) bg-(--cl-accent-50) text-[#0369A1] hover:border-(--cl-accent-400)' : 'border-om-gray-200 text-om-gray-400 hover:border-om-gray-300')
                ]">
                <EyeOff v-if="!item.enabled" :size="11" class="shrink-0" />
                <span :class="!item.enabled ? 'line-through' : ''">{{ item.card.location }}</span>
                <X v-if="item.enabled && focusedId === item.card.id" :size="11" class="opacity-80 hover:opacity-100" @click.stop="clearFocus" />
                <span v-if="!item.enabled" class="inline-flex items-center gap-0.5 -mr-0.5 text-[10px] font-semibold text-[#0284C7]"><Eye :size="11" />Show</span>
              </button>
              <!-- hover tooltip: the card's view -->
              <div v-if="hoverId === item.card.id" class="absolute left-0 top-full mt-1.5 z-40 w-64 bg-white rounded-xl border border-om-gray-200 shadow-[0_12px_28px_rgba(17,18,19,0.16)] p-3 pointer-events-none">
                <div class="flex items-center gap-1.5">
                  <EyeOff v-if="!item.enabled" :size="13" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm font-semibold text-om-gray-800">{{ item.card.location }}</span>
                </div>
                <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ item.card.rationale }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Conversation (single-element Flow F, or once the chat starts) -->
        <template v-if="single || chatStarted">
          <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line"
              :class="m.role === 'user' ? 'bg-(--cl-accent-500) text-white rounded-br-sm' : 'bg-om-gray-100 text-om-gray-700 rounded-bl-sm'">{{ m.text }}</div>
          </div>
        </template>
      </div>

      <!-- input -->
      <div class="px-4 pt-2 pb-3 border-t border-om-gray-100 shrink-0">
        <div class="mb-2">
          <div class="text-[11px] text-om-gray-400 mb-1.5">Quick refinements</div>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="s in suggestions" :key="s" @click="onChat(s)"
              class="text-xs px-2.5 py-1 rounded-full border border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-400) hover:text-[#0284C7] transition-colors cursor-pointer">{{ s }}</button>
          </div>
        </div>
        <div class="rounded-xl border border-om-gray-200 focus-within:border-(--cl-accent-400) px-2.5 pt-2 pb-1.5 transition-colors">
          <textarea v-model="draft" rows="2" @keydown.enter.exact.prevent="onChat(draft)"
            :placeholder="focused ? 'Refine this content…' : 'Ask me to refine…'"
            class="w-full resize-none bg-transparent text-sm focus:outline-none leading-snug"></textarea>
          <div class="flex justify-end">
            <Button size="sm" icon-only :disabled="!draft.trim()" @click="onChat(draft)"><template #icon><ArrowUp :size="16" /></template></Button>
          </div>
        </div>
      </div>
    </aside>

    <!-- RIGHT: the live page (click on empty area deselects) -->
    <div class="flex-1 min-h-0 relative">
      <div ref="pageScroll" class="absolute inset-0 overflow-y-auto bg-om-gray-100 px-6 py-5" @click="clearFocus">
        <div ref="pageFrame" :class="preview ? 'w-full' : (device === 'mobile' ? 'w-[400px] max-w-full mx-auto' : 'max-w-5xl mx-auto')">
          <ClStorePage :product="product" :regions="regions" :focused-id="focusedId" :preview-mode="mode" :hideable="!single && !preview" :frameless="preview" :device="device" @region="selectRegion" @hide="hideRegion" @position="onPosition" />
        </div>

        <!-- Text-editor popover for the selected text element (clamped within the page) -->
        <div v-if="editorPos && focused && !preview" ref="popoverEl" class="absolute z-30" :style="{ top: editorPos.top + 'px', left: editorPos.left != null ? editorPos.left + 'px' : 'auto', right: editorPos.right != null ? editorPos.right + 'px' : 'auto', width: editorPos.width != null ? editorPos.width + 'px' : 'auto', transform: 'translateY(-100%) translateY(-8px)' }">
          <ClTextToolbar :value="focused.style" :is-text="!focused.content.image" :pos-count="focusedPositions.length" :cur-idx="focusedPosIdx" :can-hide="!single" :device="device"
            @update="p => onStyle(focusedId, p)" @hide="hideRegion(focusedId)" @step="onStep" />
        </div>
      </div>

      <transition name="cl-hint">
        <div v-if="!hintDismissed && !single && !preview" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 rounded-full bg-white shadow-[0_8px_24px_rgba(17,18,19,0.2)] border border-om-gray-200 px-4 py-2 text-sm font-medium text-om-gray-700 whitespace-nowrap">
          <MousePointerClick :size="15" class="text-[#0EA5E9] shrink-0" /> Click an element to edit it
        </div>
      </transition>
    </div>

    <!-- Top-bar controls: product selector + Control/Variable (teleported into the shell header) -->
    <Teleport to="#cl-topbar-end">
      <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
        <button v-for="d in ['desktop', 'mobile']" :key="d" @click="device = d" :title="d === 'desktop' ? 'Desktop' : 'Mobile'"
          class="px-2 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer"
          :class="device === d ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">
          <component :is="d === 'desktop' ? Monitor : Smartphone" :size="14" />
        </button>
      </div>
      <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
        <button v-for="m in modes" :key="m.key" @click="mode = m.key"
          class="px-2.5 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="mode === m.key ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">{{ m.label }}</button>
      </div>
      <Button size="sm" variant="secondary" @click="preview = !preview">
        <template #icon><component :is="preview ? EyeOff : Eye" :size="15" /></template>{{ preview ? 'Exit preview' : 'Preview' }}
      </Button>
      <Button size="sm" variant="primary" @click="emit('next')">Next</Button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { ArrowUp, EyeOff, Eye, X, MousePointerClick, Monitor, Smartphone } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import ClStorePage from './ClStorePage.vue'
import ClTextToolbar from './ClTextToolbar.vue'
import { placeholderImage } from '../data/placeholder.js'
import { storeImages } from '../data/storeImages.js'
import { getScan, genContent, chatReply, representativeProduct } from '../flowDemo.js'

const props = defineProps({
  // Enhancements chosen from the library (Flow E) — seeded into the editor.
  seeds: { type: Array, default: () => [] }, // [{ location, content_type, content }]
  // Limit the scan recommendations to these ids (Flow F: only the ones the user picked).
  include: { type: Array, default: null }, // [cardId] or null = all
})
const emit = defineEmits(['next'])
const product = ref(representativeProduct())

const ANCHOR = {
  'Product title': 'title',
  'Below add-to-cart': 'belowAtc',
  'Description bullets': 'description',
  'Image with badge': 'hero',
  'Above the details': 'aboveTabs',
  'Gallery': 'gallery',
}
// The repositionable enhancements all share the SAME set of positions (the
// product-image swap / "Gallery" is deliberately excluded). Per-enhancement
// order just puts each one's natural spot first (= Position 1). The title is
// fixed (it replaces the product title).
const ENHANCEMENT_POSITIONS = {
  'opt-pg-title': ['Product title'],
  'opt-pg-trust': ['Below add-to-cart', 'Description bullets', 'Above the details', 'Image with badge'],
  'opt-pg-bullets': ['Description bullets', 'Below add-to-cart', 'Above the details', 'Image with badge'],
  'opt-pg-hero': ['Above the details', 'Image with badge', 'Below add-to-cart', 'Description bullets'],
}
// First entry of each list is also its default location.
const DEFAULT_LOCATION = {
  'opt-pg-title': 'Product title',
  'opt-pg-trust': 'Below add-to-cart',
  'opt-pg-bullets': 'Description bullets',
  'opt-pg-hero': 'Above the details',
}

// Per-enhancement default text style (matches the store page's natural look).
const STYLE_DEFAULTS = {
  'opt-pg-title': { font: 'Inter', size: 24, bold: true, align: 'left', color: '' },
  'opt-pg-trust': { font: 'Inter', size: 12, bold: false, align: 'left', color: '#52525b' },
  'opt-pg-bullets': { font: 'Inter', size: 14, bold: false, align: 'left', color: '#3f3f46' },
}

function adjust(content, type) {
  const p = product.value
  const out = { ...content }
  if (type === 'text') { delete out.image; if (!out.text) out.text = p.title }
  else if (type === 'image') { delete out.text; if (!out.image) out.image = placeholderImage(p.title, p.id + '-img') }
  else { if (!out.text) out.text = `Discover the ${p.attributes.category.toLowerCase()}`; if (!out.image) out.image = placeholderImage(p.title, p.id + '-ti') }
  return out
}

const SEED_ID = 'opt-lib'
const LOC_STYLE = { 'Product title': 'opt-pg-title', 'Below add-to-cart': 'opt-pg-trust', 'Description bullets': 'opt-pg-bullets' }
function styleFor(id) { return { ...(STYLE_DEFAULTS[id] || { font: 'Inter', size: 14, bold: false, align: 'left', color: '' }) } }

const baseItems = getScan()
  .filter(card => !props.include || props.include.includes(card.id))
  .map(card => ({
  card,
  enabled: true,
  // Default position = the enhancement's natural spot.
  location: DEFAULT_LOCATION[card.id] || card.location,
  content: adjust(genContent(card, product.value), card.content_type),
  style: styleFor(card.id),
}))
// Flow E: enhancements picked from the library are seeded into the editor.
props.seeds.forEach((s, i) => {
  baseItems.push({
    card: { id: `${SEED_ID}-${i}`, location: s.location, content_type: s.content_type, rationale: 'Added from the library.' },
    enabled: true,
    location: s.location,
    // Use the library content as-is (it is already complete; adjust would add a stray placeholder image).
    content: { ...s.content },
    style: styleFor(LOC_STYLE[s.location]),
  })
})
const items = ref(baseItems)

const mode = ref('variant')
const modes = [{ key: 'control', label: 'Control' }, { key: 'variant', label: 'Variable' }]
const device = ref('desktop') // desktop | mobile preview of the store page
const preview = ref(false) // full-width, frameless live preview of the page
// Single-element mode (Flow F): one picked recommendation → no cards/chips, no manual
// selection; the editor toolbar shows by default over the one element.
const single = computed(() => items.value.length === 1)
const focusedId = ref(items.value.length === 1 ? items.value[0].card.id : null)
const focused = computed(() => items.value.find(i => i.card.id === focusedId.value) || null)
const hintDismissed = ref(false) // the floating hint disappears on first selection and never returns

function candidates(item) {
  return ENHANCEMENT_POSITIONS[item.card.id] || [item.location]
}

// Each anchor holds a stack of enabled enhancements (no swapping — elements
// that land on the same spot simply stack one under the other).
const regions = computed(() => {
  const out = {}
  for (const it of items.value) {
    if (!it.enabled) continue
    const anchor = ANCHOR[it.location] || 'belowAtc'
    ;(out[anchor] ||= []).push({ id: it.card.id, state: 'applied', content: it.content, location: it.location, positions: candidates(it), style: it.style })
  }
  return out
})

const byId = (id) => items.value.find(x => x.card.id === id)

// Clicking an embedded element selects + focuses it; clicking empty page area deselects.
function selectRegion(id) {
  focusedId.value = id
  hintDismissed.value = true
}
function clearFocus() { if (!single.value) focusedId.value = null } // single mode keeps the one element focused
// Clicking a card/chip on the left focuses its element AND scrolls the page to it.
function focusCard(item) {
  focusedId.value = item.card.id
  hintDismissed.value = true
  if (item.enabled) scrollToEntry(item.card.id)
}
// Chips toggle focus (click again deselects).
const hoverId = ref(null)
function toggleFocus(item) {
  if (focusedId.value === item.card.id) clearFocus()
  else focusCard(item)
}
function hideRegion(id) {
  const it = byId(id)
  if (it) it.enabled = false
  clearFocus()
}
// Apply a style patch from the text-editor popover.
function onStyle(id, patch) {
  const it = byId(id)
  if (it) it.style = { ...it.style, ...patch }
  placeEditor()
}
// Re-enable a hidden enhancement from its chip, then focus + scroll to it.
function unhide(item) {
  item.enabled = true
  focusCard(item)
}
const pageScroll = ref(null)
async function scrollToEntry(id) {
  await nextTick()
  const el = pageScroll.value?.querySelector(`[data-entry="${id}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
async function onPosition(id, loc) {
  const it = byId(id)
  if (!it) return
  it.location = loc
  await scrollToEntry(id)
  placeEditor()
}

// --- text-editor popover (positioned over the selected text element, clamped in) ---
const editorPos = ref(null)
const popoverEl = ref(null)
const pageFrame = ref(null)
const focusedPositions = computed(() => (focused.value ? candidates(focused.value) : []))
const focusedPosIdx = computed(() => Math.max(0, focusedPositions.value.indexOf(focused.value?.location)))
function onStep(d) {
  const next = focusedPositions.value[focusedPosIdx.value + d]
  if (next && focusedId.value) onPosition(focusedId.value, next)
}
async function placeEditor() {
  await nextTick()
  const sc = pageScroll.value
  const f = focused.value
  // Every selected element gets the editor popover (text elements also get the
  // formatting row; image-with-badge just gets the prompt + position/hide).
  if (!sc || !f || !f.enabled) { editorPos.value = null; return }
  const el = sc.querySelector(`[data-entry="${f.card.id}"]`)
  if (!el) { editorPos.value = null; return }
  const scRect = sc.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const top = elRect.top - scRect.top + sc.scrollTop
  // Mobile: a frame-width toolbar bar above the element (scrolls horizontally if needed).
  if (device.value === 'mobile' && pageFrame.value) {
    const fr = pageFrame.value.getBoundingClientRect()
    const frameLeft = fr.left - scRect.left + sc.scrollLeft
    editorPos.value = { top, left: Math.max(6, frameLeft + 6), right: null, width: Math.round(fr.width - 12) }
    return
  }
  // Image elements have a sparse, content-width toolbar → right-align it to the
  // element's right edge. Text elements keep the wide toolbar, left-aligned + clamped.
  if (f.content.image) {
    const elRight = elRect.right - scRect.left + sc.scrollLeft
    const right = Math.max(12, sc.clientWidth - elRight)
    editorPos.value = { top, left: null, right }
  } else {
    // Centre the toolbar over the element. Render first (rough centre), then
    // re-centre against the toolbar's actual width and clamp inside the page.
    const elCenter = elRect.left - scRect.left + sc.scrollLeft + elRect.width / 2
    editorPos.value = { top, left: Math.max(12, elCenter - 260), right: null }
    await nextTick()
    const w = popoverEl.value?.offsetWidth || 460
    // On mobile, clamp to the phone frame (not the wide scroll area) so the
    // toolbar stays on the page, above the element.
    let lo = 12, hi = sc.clientWidth - w - 12
    if (device.value === 'mobile' && pageFrame.value) {
      const fr = pageFrame.value.getBoundingClientRect()
      const frameLeft = fr.left - scRect.left + sc.scrollLeft
      lo = frameLeft + 6
      hi = frameLeft + fr.width - w - 6
    }
    const left = Math.max(lo, Math.min(elCenter - w / 2, hi))
    editorPos.value = { top, left, right: null }
  }
}
// Reposition on selection change AND on device switch (the page reflows).
watch([focusedId, device], () => placeEditor(), { immediate: true })
// Switching to mobile re-centres the page on the selected element. Wait for the
// reflow (nextTick + rAF), then scroll the container by the element's offset from centre.
watch(device, async (d) => {
  if (d !== 'mobile' || !focusedId.value) return
  await nextTick()
  setTimeout(() => {
    const sc = pageScroll.value
    const el = sc?.querySelector(`[data-entry="${focusedId.value}"]`)
    if (!sc || !el) return
    const er = el.getBoundingClientRect(), sr = sc.getBoundingClientRect()
    sc.scrollTo({ top: sc.scrollTop + (er.top + er.height / 2) - (sr.top + sr.height / 2) })
  }, 250)
})
// Single-element mode: scroll the page to the one inserted enhancement on load.
onMounted(() => { if (single.value) scrollToEntry(items.value[0].id) })

// --- chat refinement ---
// Single-element mode greets with the AI asking what to change (no cards).
const messages = ref(items.value.length === 1
  ? [{ role: 'assistant', text: `What would you like to change about the ${items.value[0].card.location.toLowerCase()}?` }]
  : [])
const draft = ref('')
const scroller = ref(null)
const chatStarted = computed(() => messages.value.length > 0)

// Each enhancement gets its own fitting quick-refinement suggestions.
const REFINEMENTS = {
  'opt-pg-title': ['Shorten it', 'More benefit-driven', 'Add the brand', 'Make it bolder'],
  'opt-pg-trust': ['Add a guarantee', 'Shorten each', 'Add secure-payment', 'Reorder by impact'],
  'opt-pg-bullets': ['Fewer bullets', 'Lead with benefits', 'Add a stat', 'Be more specific'],
  'opt-pg-hero': ['Swap the image', 'Try another badge', 'Fewer badges', 'Brighter photo'],
}
const suggestions = computed(() => {
  const f = focused.value || (single.value ? items.value[0] : null)
  if (f) return REFINEMENTS[f.card.id] || ['Shorten the copy', 'Make it bolder']
  return ['Shorten the copy', 'Make it bolder', 'Swap the image']
})

const imgPool = [storeImages.hero, storeImages.gallery[2], storeImages.related[0].img, storeImages.gallery[1]]
let imgIdx = 0
function nextImage() { imgIdx = (imgIdx + 1) % imgPool.length; return imgPool[imgIdx] }
function shorten(s) { const head = s.split(' — ')[0].split('. ')[0]; const w = head.split(/\s+/); return w.slice(0, Math.min(6, w.length)).join(' ') }

function onChat(text) {
  const t = (text || '').trim()
  if (!t) return
  messages.value.push({ role: 'user', text: t })
  const r = chatReply(t)
  messages.value.push({ role: 'assistant', text: r.text })
  draft.value = ''
  const lt = t.toLowerCase()
  items.value = items.value.map(it => {
    if (focusedId.value && it.card.id !== focusedId.value) return it
    const c = { ...it.content }
    if (/(short|rövid|rovid)/.test(lt) && c.text) c.text = shorten(c.text)
    else if (/(image|kép|kep|lifestyle|photo|másik|masik|swap)/.test(lt) && c.image) c.image = nextImage()
    else if (/(bold|merész|meresz|punch)/.test(lt) && c.text) c.text = c.text.replace(/[.!]+$/, '') + ' — guaranteed.'
    return { ...it, content: c }
  })
  placeEditor()
}

watch(() => messages.value.length, async () => { await nextTick(); if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight })
</script>

<style scoped>
.cl-hint-enter-active, .cl-hint-leave-active { transition: opacity 0.2s ease; }
.cl-hint-enter-from, .cl-hint-leave-to { opacity: 0; }
</style>
