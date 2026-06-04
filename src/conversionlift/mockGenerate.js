// ============================================================================
// Mock AI layer (ConversionLift) — AI-agnostic contract per spec §3.
// v1 returns mocked text + placeholder images. The shape matches the contract
// so the UI is unchanged when a real /v1/messages call replaces this later.
//
//   scan(domainId)              -> { optimizations: [...] }        (suggestions)
//   generate(optimization, products) -> { optimization_id, items: [...] } (per product)
//   chatReply(message, domainId)-> { kind, ... }                   (chat refinement)
// ============================================================================

import { getOptimizations } from './data/optimizations.js'
import { placeholderImage } from './data/placeholder.js'

// -- 1) Scan: CRO assistant suggestions --------------------------------------

export function scan(domainId) {
  return { optimizations: getOptimizations(domainId) }
}

// -- 2) Bulk generation: per-product unique content --------------------------

const STATUS_EVERY_NTH_EDITED = 7

// Build the unique content for one product, driven by the optimization's
// content_type and a per-optimization template.
function buildContent(optimization, product) {
  const a = product.attributes
  const topFeature = a.features[0]

  switch (optimization.id) {
    case 'opt-pg-title': {
      const text = `${topFeature} ${a.category} Built for the Long Haul — ${product.title}`
      return { text }
    }
    case 'opt-pg-bullets': {
      const text = [
        `${a.features[0]} — performs in real conditions`,
        `${a.features[1]} — ${a.material} construction`,
        `${a.features[2]} — ready out of the box`,
        `Rated ${a.rating.toFixed(1)}★ by ${a.reviews} owners`,
      ].join('\n')
      return { text }
    }
    case 'opt-pg-trust': {
      const text = ['Free 30-day returns', '2-year warranty', 'Secure checkout'].join(' · ')
      return { text, image: placeholderImage('Trust', `${product.id}-trust`) }
    }
    case 'opt-pg-hero': {
      const text = `Field-tested ${a.category.toLowerCase()} for every trail`
      return { text, image: placeholderImage(product.title, `${product.id}-hero`) }
    }
    default:
      return { text: `Optimized content for ${product.title}` }
  }
}

export function generate(optimization, products) {
  const items = products.map((product, i) => ({
    id: `${optimization.id}__${product.product_page_id}`,
    optimization_id: optimization.id,
    product_page_id: product.product_page_id,
    product_title: product.title,
    content: buildContent(optimization, product),
    status: i % STATUS_EVERY_NTH_EDITED === STATUS_EVERY_NTH_EDITED - 1 ? 'edited' : 'generated',
    editable: true,
  }))
  return { optimization_id: optimization.id, items }
}

// -- 3) Chat refinement (keyword-triggered demo replies) ---------------------

let chatCardCounter = 1

export function chatReply(message, domainId) {
  const msg = (message || '').toLowerCase()

  if (msg.includes('urgency') || msg.includes('sürgős') || msg.includes('stock')) {
    return {
      kind: 'new_card',
      text: 'Added an urgency block suggestion. Stock/low-inventory cues create time pressure at the decision point.',
      card: {
        id: `opt-chat-urgency-${chatCardCounter++}`,
        type: 'embed',
        location: 'Below add-to-cart',
        content_type: 'text',
        suggested_scope: 'all',
        rationale: 'No urgency cues on the page. A live stock / "selling fast" line nudges hesitant buyers.',
        brief: 'Generate a stock-urgency line per product (e.g. "Only N left").',
        brand_constraints: 'Honest, no fake scarcity. One short line.',
        confidence: 0.6,
        status: 'suggested',
      },
    }
  }

  if (msg.includes('short') || msg.includes('rövid') || msg.includes('rovid')) {
    return {
      kind: 'modify',
      targetId: 'opt-pg-title',
      text: 'Tightened the headline brief to favour shorter, punchier titles (max 40 chars).',
      patch: { brand_constraints: 'Keep it under 40 characters. Punchy, benefit-first.' },
    }
  }

  if (msg.includes('image') || msg.includes('kép') || msg.includes('kep') || msg.includes('lifestyle')) {
    return {
      kind: 'new_card',
      text: 'Added an image-led variant. Lifestyle visuals raise perceived value in this category.',
      card: {
        id: `opt-chat-image-${chatCardCounter++}`,
        type: 'embed',
        location: 'Gallery',
        content_type: 'image',
        suggested_scope: 'all',
        rationale: 'Gallery is studio-only. A generated lifestyle frame adds context.',
        brief: 'Generate one lifestyle gallery image per product.',
        brand_constraints: 'Natural light, gear in use.',
        confidence: 0.64,
        status: 'suggested',
      },
    }
  }

  return {
    kind: 'note',
    text: 'Refined the suggestions based on your note. Tell me to make a block more aggressive, shorter, or add an image variant.',
  }
}
