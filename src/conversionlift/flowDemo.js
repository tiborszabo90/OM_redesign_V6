// ============================================================================
// Flow demo wiring (ConversionLift, single-page flows A/B/C)
// The flows operate on one IMPLICIT representative product. We back them with
// the peakgear demo data; the typed URL is cosmetic. No bulk, no product picker.
// ============================================================================

import { getCatalog } from './data/catalog.js'
import { scan, generate, chatReply } from './mockGenerate.js'

export const DEMO_DOMAIN = 'peakgear.example'

// Combined potential if ALL scan recommendations are applied together. We show a
// single aggregate estimate (per-recommendation lifts can't be substantiated alone).
export const POTENTIAL_LIFT = '+10-15%'

// The representative product the preview renders on.
export function representativeProduct() {
  return getCatalog(DEMO_DOMAIN)[0]
}

// Scan suggestions (the 4 optimization cards).
export function getScan() {
  return scan(DEMO_DOMAIN).optimizations
}

// Generate the content for one optimization on the single representative product.
export function genContent(optimization, product) {
  return generate(optimization, [product]).items[0].content
}

// Does an optimization card match a chosen content-type filter?
// Cards that contain the chosen token match (so "image" surfaces text+image too).
export function cardMatchesType(card, type) {
  if (!type) return true
  if (card.content_type === type) return true
  return card.content_type.split('+').includes(type)
}

export { chatReply }
