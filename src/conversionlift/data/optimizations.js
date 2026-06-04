// ============================================================================
// Demo optimization suggestions (ConversionLift)
// These are the cards the CRO assistant "scans" out for peakgear.example.
// One card = one Optimization (a reusable generation definition). The mock
// scan() in mockGenerate.js returns these; generate() fans each out to
// per-product Generated items using the templates in mockGenerate.js.
// ============================================================================

export const demoOptimizations = {
  'peakgear.example': [
    {
      id: 'opt-pg-title',
      type: 'replace',
      location: 'Product title',
      content_type: 'text',
      suggested_scope: 'all',
      rationale:
        'Titles are feature-first ("45L Backpack") rather than benefit-led. A benefit-driven headline that names the outcome lifts click and add-to-cart intent.',
      brief: 'Rewrite the product title as a benefit-led headline that keeps the key spec.',
      brand_constraints: 'Keep it under 60 characters. Confident, outdoorsy, no hype.',
      confidence: 0.82,
      status: 'suggested',
    },
    {
      id: 'opt-pg-trust',
      type: 'embed',
      location: 'Below add-to-cart',
      content_type: 'text+image',
      suggested_scope: 'all',
      rationale:
        'Product pages show no trust signals near the buy box. A row of trust badges (returns, warranty, secure checkout) reduces purchase anxiety at the decision point.',
      brief: 'Generate a 3-badge trust row tailored to the product category.',
      brand_constraints: 'Short labels, icon + 2-3 words each. Reassuring, factual.',
      confidence: 0.74,
      status: 'suggested',
    },
    {
      id: 'opt-pg-bullets',
      type: 'replace',
      location: 'Description bullets',
      content_type: 'text',
      suggested_scope: 'filter:category=Backpacks',
      rationale:
        'Backpack descriptions are dense paragraphs. Scannable benefit bullets help shoppers compare specs faster, which matters most in this high-consideration category.',
      brief: 'Turn the description into 4 scannable benefit bullets from the product features.',
      brand_constraints: 'Lead each bullet with the benefit, then the spec. No filler.',
      confidence: 0.68,
      status: 'suggested',
    },
    {
      id: 'opt-pg-hero',
      type: 'embed',
      location: 'Above the fold (hero)',
      content_type: 'text+image',
      suggested_scope: 'all',
      rationale:
        'Listings use studio shots only. A lifestyle hero with context (gear in use) plus a short caption raises perceived value and add-to-cart rate.',
      brief: 'Generate a lifestyle hero image with a one-line caption per product.',
      brand_constraints: 'Caption max 8 words, present tense, action-oriented.',
      confidence: 0.71,
      status: 'suggested',
    },
  ],
}

export function getOptimizations(domainId) {
  return (demoOptimizations[domainId] || []).map(o => ({ ...o }))
}
