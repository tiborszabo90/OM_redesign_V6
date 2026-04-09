import { viewDefinitions } from './views.js'
import { flowDefinitions } from './flows.js'
import { sectionLabels } from './sections.js'

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

export { sectionLabels, flowDefinitions, viewDefinitions }
