// ============================================================================
// ConversionLift workflow state
// Module-level refs so every ConversionLift view shares the same active
// domain / optimization / scope / generated-items / experiment context across
// navigation (same pattern as useWorkflowState.js, but a separate store — the
// spec's "useWorkflowState" name collides with the existing AI-image one).
// ============================================================================

import { ref, reactive, computed } from 'vue'
import { demoDomains } from '../conversionlift/data/domains.js'
import { getCatalog } from '../conversionlift/data/catalog.js'
import { demoExperimentResult } from '../conversionlift/data/analytics.js'
import { scan, generate, chatReply } from '../conversionlift/mockGenerate.js'

// -- Core context ------------------------------------------------------------

export const domains = reactive(demoDomains.map(d => ({ ...d })))
export const activeDomainId = ref(null)

export const activeDomain = computed(() => domains.find(d => d.id === activeDomainId.value) || null)
export const catalog = computed(() => (activeDomainId.value ? getCatalog(activeDomainId.value) : []))

// -- Assistant: scan suggestions + chat thread -------------------------------

export const optimizations = ref([]) // scan output (suggestion cards)
export const chatThread = ref([])     // [{ role: 'user' | 'assistant', text }]

// -- Accepted optimization + scope -------------------------------------------

export const activeOptimization = ref(null)
// scope: { mode: 'all' | 'collection' | 'filter' | 'selection', category?, productIds? }
export const scope = ref({ mode: 'all' })

export const scopedProducts = computed(() => resolveScope(scope.value, catalog.value))
export const scopedCount = computed(() => scopedProducts.value.length)

// -- Generation (bulk review) ------------------------------------------------

export const generatedItems = ref([])
export const generationProgress = reactive({ done: 0, total: 0, running: false })

// -- Experiment draft + result ----------------------------------------------

export const experimentDraft = ref(null)
export const experimentResult = demoExperimentResult // live demo experiment

// ============================================================================
// Actions
// ============================================================================

export function setActiveDomain(id) {
  if (activeDomainId.value === id) return
  activeDomainId.value = id
  // Reset per-domain context on switch.
  optimizations.value = []
  chatThread.value = []
  activeOptimization.value = null
  scope.value = { mode: 'all' }
  generatedItems.value = []
  generationProgress.done = 0
  generationProgress.total = 0
  generationProgress.running = false
  experimentDraft.value = null
  runScan()
}

export function addDomain({ name, url, platform = 'Custom' }) {
  const id = url
  if (!domains.find(d => d.id === id)) {
    domains.push({
      id,
      name: name || url,
      url,
      platform,
      connection_status: 'not_connected',
      productCount: 0,
    })
  }
  return id
}

export function connectActiveDomain() {
  if (activeDomain.value) activeDomain.value.connection_status = 'connected'
}

export function runScan() {
  if (!activeDomainId.value) return
  optimizations.value = scan(activeDomainId.value).optimizations
}

export function acceptOptimization(opt) {
  activeOptimization.value = { ...opt, status: 'accepted' }
  scope.value = parseScope(opt.suggested_scope)
}

export function setScope(next) {
  scope.value = next
}

// Build all generated items for the active optimization over the scope.
// Returns the items; views drive the reveal animation via generationProgress.
export function runGeneration() {
  if (!activeOptimization.value) return []
  const { items } = generate(activeOptimization.value, scopedProducts.value)
  generatedItems.value = items
  generationProgress.total = items.length
  generationProgress.done = items.length
  generationProgress.running = false
  return items
}

export function updateItemContent(itemId, content) {
  const item = generatedItems.value.find(i => i.id === itemId)
  if (item) {
    item.content = { ...item.content, ...content }
    item.status = 'edited'
  }
}

export function setItemStatus(itemId, status) {
  const item = generatedItems.value.find(i => i.id === itemId)
  if (item) item.status = status
}

export function approveAll() {
  generatedItems.value.forEach(i => { i.status = 'approved' })
}

export function regenerateItem(itemId) {
  const item = generatedItems.value.find(i => i.id === itemId)
  if (!item) return
  const product = scopedProducts.value.find(p => p.product_page_id === item.product_page_id)
  if (!product) return
  const fresh = generate(activeOptimization.value, [product]).items[0]
  item.content = fresh.content
  item.status = 'generated'
}

export function buildExperimentDraft() {
  experimentDraft.value = {
    optimization_id: activeOptimization.value?.id,
    arms: [
      { key: 'control', label: 'Control (original)' },
      { key: 'treatment', label: 'Generated treatment' },
    ],
    traffic_split: 50,
    goal_metric: 'conversion_rate',
    duration_days: 14,
    auto_winner: false,
    scope_product_count: scopedCount.value,
    status: 'draft',
  }
  return experimentDraft.value
}

export function sendChat(message) {
  chatThread.value.push({ role: 'user', text: message })
  const reply = chatReply(message, activeDomainId.value)
  chatThread.value.push({ role: 'assistant', text: reply.text })

  if (reply.kind === 'new_card') {
    optimizations.value = [reply.card, ...optimizations.value]
  } else if (reply.kind === 'modify') {
    const target = optimizations.value.find(o => o.id === reply.targetId)
    if (target) Object.assign(target, reply.patch)
  }
  return reply
}

// ============================================================================
// Scope helpers
// ============================================================================

// Parse a suggested_scope string ("all" | "collection:..." | "filter:category=X")
// from the optimization into an internal scope object.
function parseScope(suggested) {
  if (!suggested || suggested === 'all') return { mode: 'all' }
  const [mode, rest] = suggested.split(':')
  if (mode === 'filter') {
    const [key, value] = (rest || '').split('=')
    if (key === 'category') return { mode: 'filter', category: value }
    return { mode: 'filter' }
  }
  if (mode === 'collection') return { mode: 'collection', category: rest }
  return { mode: 'all' }
}

function resolveScope(s, products) {
  if (!s || s.mode === 'all') return products
  if (s.mode === 'filter' || s.mode === 'collection') {
    if (!s.category) return products
    return products.filter(p => p.attributes.category === s.category)
  }
  if (s.mode === 'selection') {
    const ids = new Set(s.productIds || [])
    return products.filter(p => ids.has(p.product_page_id))
  }
  return products
}
