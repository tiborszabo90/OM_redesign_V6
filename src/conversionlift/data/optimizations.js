// ============================================================================
// Demo optimization suggestions (ConversionLift)
// These are the cards the CRO assistant "scans" out for peakgear.example.
// One card = one Optimization (a reusable generation definition). The mock
// scan() in mockGenerate.js returns these; generate() fans each out to
// per-product Generated items using the templates in mockGenerate.js.
//
// Each card carries the persuasion fields surfaced on the home + recommend
// step: diagnosis (problem on this store), estimated lift/revenue range,
// confidence, reach, priority, a benchmark, and a before/after sample.
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
      // persuasion
      diagnosis: 'Your titles are feature-first and average just 3 words.',
      metric: 'PDP-to-cart click-through is 4.1%, below the category benchmark.',
      lift: '+6-11% add-to-cart',
      revenue: '$2,400-4,400 / mo',
      reach: '36 product pages · ~18,200 visitors/mo',
      priority: 'Highest-impact quick win',
      benchmark: '78% of top-performing outdoor stores use benefit-led titles.',
      before: 'Trailblazer 28L Backpack',
      after: 'Trailblazer 28L: all-day comfort, fits a 2-day trek',
    },
    {
      id: 'opt-pg-trust',
      type: 'embed',
      location: 'Below add-to-cart',
      content_type: 'text',
      suggested_scope: 'all',
      rationale:
        'Product pages show no trust signals near the buy box. A row of trust badges (returns, warranty, secure checkout) reduces purchase anxiety at the decision point.',
      brief: 'Generate a 3-badge trust row tailored to the product category.',
      brand_constraints: 'Short labels, icon + 2-3 words each. Reassuring, factual.',
      confidence: 0.74,
      status: 'suggested',
      diagnosis: 'None of your 36 product pages show trust signals near the buy box.',
      metric: 'Cart abandonment peaks right at the payment step.',
      lift: '+3-7% checkout completion',
      revenue: '$1,300-3,000 / mo',
      reach: '36 product pages · ~18,200 visitors/mo',
      priority: 'Quick win',
      benchmark: 'Trust badges at the buy box appear on 85% of high-converting stores.',
      before: 'No trust row near the buy box',
      after: '30-day returns · 2-year warranty · Secure checkout',
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
      diagnosis: 'Backpack descriptions are dense paragraphs with no scannable bullets.',
      metric: 'Description scroll-depth drops off after the first paragraph.',
      lift: '+4-8% description engagement',
      revenue: '$700-1,600 / mo',
      reach: 'Backpacks category · 9 product pages',
      priority: 'Worth testing',
      benchmark: 'Scannable bullets shorten time-to-decision in high-consideration categories.',
      before: 'The Trailblazer 28L is a versatile, durable ripstop pack designed for...',
      after: 'Waterproof, built for 2-day treks · 1.2 kg ultralight frame · Fits a 15" laptop',
    },
    {
      id: 'opt-pg-hero',
      type: 'embed',
      location: 'Image with badge',
      content_type: 'text+image',
      suggested_scope: 'all',
      rationale:
        'Listings use studio shots only. A lifestyle hero with context (gear in use) plus a short caption raises perceived value and add-to-cart rate.',
      brief: 'Generate a lifestyle hero image with a one-line caption per product.',
      brand_constraints: 'Caption max 8 words, present tense, action-oriented.',
      confidence: 0.71,
      status: 'suggested',
      diagnosis: 'Listings use studio shots only, with no lifestyle context.',
      metric: 'Image engagement is concentrated on the first studio shot.',
      lift: '+5-9% add-to-cart',
      revenue: '$2,000-3,800 / mo',
      reach: '36 product pages · ~18,200 visitors/mo',
      priority: 'High impact',
      benchmark: '90% of top outdoor stores use lifestyle hero imagery on PDPs.',
      before: 'Studio product shot on white',
      after: 'Lifestyle hero in use + caption: "Built for the long haul"',
    },
  ],
}

export function getOptimizations(domainId) {
  return (demoOptimizations[domainId] || []).map(o => ({ ...o }))
}
