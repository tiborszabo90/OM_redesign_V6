// Shared bulk-generation simulation (per-product, ~30s each) used by the
// generate step and the screen proposals.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getCatalog } from './data/catalog.js'
import { getOptimizations } from './data/optimizations.js'
import { generate } from './mockGenerate.js'
import { storeImages } from './data/storeImages.js'

export function useGeneration(products) {
  const PER_ITEM_MS = 30000 // each product takes 30s
  const imgs = [...storeImages.gallery, ...storeImages.related.map(r => r.img)]
  const base = products && products.length ? products : getCatalog('peakgear.example')
  const optimization = getOptimizations('peakgear.example')[0]
  const items = generate(optimization, base).items.map((it, i) => ({
    id: it.id,
    title: it.product_title,
    snippet: (it.content.text || it.content.badge?.join(' · ') || 'Generated content').split('\n')[0],
    img: imgs[i % imgs.length],
  }))
  const total = items.length

  const status = ref('generating') // generating | paused | done | cancelled
  const done = ref(0)
  const background = ref(false)
  let timer = null

  const pct = computed(() => Math.round((done.value / total) * 100))
  const recent = computed(() => items.slice(Math.max(0, done.value - 7), done.value).reverse())
  const etaLabel = computed(() => {
    const s = Math.ceil((total - done.value) * PER_ITEM_MS / 1000)
    return s > 60 ? `~${Math.ceil(s / 60)} min left` : `~${s}s left`
  })
  const statusOf = (i) => (i < done.value ? 'done' : i === done.value ? 'active' : 'queued')

  function tick() {
    if (done.value >= total) { finish(); return }
    done.value++
    if (done.value >= total) finish()
  }
  function start() { timer = setInterval(tick, PER_ITEM_MS) }
  function finish() { clearInterval(timer); timer = null; status.value = 'done' }
  function togglePause() {
    if (status.value === 'generating') { clearInterval(timer); timer = null; status.value = 'paused' }
    else if (status.value === 'paused') { status.value = 'generating'; start() }
  }
  function cancel() { clearInterval(timer); timer = null; status.value = 'cancelled' }
  function restart() { done.value = 0; background.value = false; status.value = 'generating'; start() }

  onMounted(start)
  onBeforeUnmount(() => clearInterval(timer))

  return { items, total, status, done, background, pct, recent, etaLabel, statusOf, togglePause, cancel, restart }
}
