import { viewDefinitions } from './views.js'
import { flowDefinitions } from './flows.js'
import { sectionLabels } from './sections.js'

// Product ecosystem definitions
// home = landing view id when entering / resetting the product
export const productDefinitions = {
  optimonk: { id: 'optimonk', label: 'OptiMonk', home: 'dev-start', accent: '#F06431' },
  opticube: { id: 'opticube', label: 'OptiCube', home: 'opticube', accent: '#6366F1' },
  picbear: { id: 'picbear', label: 'Picbear', home: 'picbear', accent: '#10B981' },
  conversionlift: { id: 'conversionlift', label: 'ConversionLift', home: 'conversionlift', accent: '#0EA5E9' },
}

// Build lookup maps
const viewMap = new Map()
const slugToViewMap = new Map()
const viewToSlugMap = new Map()

for (const def of viewDefinitions) {
  viewMap.set(def.id, def)
  const slug = def.slug || def.id
  slugToViewMap.set(slug, def.id)
  viewToSlugMap.set(def.id, slug)
}

// Precomputed sets
const logoHiddenSet = new Set(
  viewDefinitions.filter(v => v.hideLogo !== false).map(v => v.id)
)

// -- Public API --------------------------------------------------------------

export function getView(id) {
  return viewMap.get(id) || null
}

export function resolveView(viewId) {
  // Exact match first
  if (viewMap.has(viewId)) return viewMap.get(viewId)
  // Prefix match (for settings-ai-*, etc.)
  for (const def of viewDefinitions) {
    if (def.matchPrefix && viewId.startsWith(def.matchPrefix)) return def
  }
  return null
}

export function getViewBySlug(slug) {
  return slugToViewMap.get(slug) || null
}

export function getSlugForView(id) {
  return viewToSlugMap.get(id) || id
}

export function getArchivedViews() {
  return viewDefinitions.filter(v => v.status === 'archived')
}

export function getActiveViews() {
  return viewDefinitions.filter(v => v.status === 'active')
}

export function isLogoHidden(viewId) {
  if (!viewId) return true
  if (logoHiddenSet.has(viewId)) return true
  // Prefix check for generated sub-views not explicitly in the set
  for (const def of viewDefinitions) {
    if (def.matchPrefix && viewId.startsWith(def.matchPrefix) && def.hideLogo !== false) return true
  }
  return false
}

export function getSectionItems(sectionKey) {
  return viewDefinitions.filter(v => v.section === sectionKey && v.status === 'active')
}

export function getSectionForView(viewId) {
  const def = viewMap.get(viewId)
  return def?.section || null
}

export function getFlow(id) {
  return flowDefinitions[id] || null
}

// Product scoping ------------------------------------------------------------
// Returns the product a view belongs to. Views without an explicit `product`
// field belong to OptiMonk (the original product).
export function getProductForView(viewId) {
  if (!viewId) return 'optimonk'
  const def = resolveView(viewId)
  return def?.product || 'optimonk'
}

// All views that belong to a given product (for product-scoped nav).
export function getProductViews(product) {
  return viewDefinitions.filter(
    v => v.product === product && (v.status === 'active' || v.status === 'system')
  )
}

export { sectionLabels, flowDefinitions, viewDefinitions }
