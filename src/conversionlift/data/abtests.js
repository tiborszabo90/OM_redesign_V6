// A/B tests shared by the list, the detail (#/cl-abtest/<id>), and the home.
// The tool is product-page only. A test pits any set of variables against each
// other — 1-on-1 (control vs one variable) or several at once (multivariate).
// `matchup` lists the competing arms (the first is usually the original/control).
export const abtests = [
  {
    id: 'titles', projectId: 'titles', name: 'Benefit-led product titles', project: 'All product pages · titles',
    element: 'all product pages', status: 'Running', lift: '+12.4%', sig: '96%', started: 'May 28', audience: 'All visitors',
    matchup: ['Original', 'Benefit-led titles'],
    variables: [{ name: 'Benefit-led product titles', projectId: 'titles' }],
    metrics: [
      { label: 'Conversion lift', value: '+12.4%', tone: 'pos', sub: 'vs. control' },
      { label: 'Sessions', value: '18,240', sub: '9,120 / variation' },
      { label: 'Added revenue', value: '$4,120', tone: 'pos', sub: 'projected / mo' },
      { label: 'Significance', value: '96%', sub: 'stat. confidence' },
    ],
    variations: [
      { label: 'Original', text: 'Feature-first product titles', sessions: '9,120', cvr: '4.1%', lift: '—', winner: false },
      { label: 'Benefit-led titles', text: 'Benefit-led titles across all product pages', sessions: '9,120', cvr: '4.8%', lift: '+12.4%', winner: true },
    ],
  },
  {
    id: 'bestsellers', projectId: 'bestsellers', name: 'Best-seller page polish', project: 'Top 50 SKUs',
    element: 'the top 50 product pages', status: 'Running', lift: '+4.8%', sig: '95%', started: 'Jun 2', audience: 'All visitors',
    matchup: ['Original', 'Titles + badges', 'Titles + imagery + badges'],
    variables: [{ name: 'Best-seller page polish', projectId: 'bestsellers' }],
    metrics: [
      { label: 'Conversion lift', value: '+4.8%', tone: 'pos', sub: 'best vs. control' },
      { label: 'Sessions', value: '12,400', sub: '3 variations' },
      { label: 'Added revenue', value: '$1,900', tone: 'pos', sub: 'projected / mo' },
      { label: 'Significance', value: '95%', sub: 'stat. confidence' },
    ],
    variations: [
      { label: 'Original', text: 'Current best-seller pages', sessions: '4,100', cvr: '5.0%', lift: '—', winner: false },
      { label: 'Titles + badges', text: 'Benefit-led titles with a trust-badge row', sessions: '4,100', cvr: '5.1%', lift: '+2.0%', winner: false },
      { label: 'Titles + imagery + badges', text: 'Polished titles, lifestyle imagery and trust badges', sessions: '4,200', cvr: '5.2%', lift: '+4.8%', winner: true },
    ],
  },
  {
    id: 'new-arrivals', projectId: 'new-arrivals', name: 'Heading variable test', project: 'New arrival PDPs',
    element: 'the new arrival product pages', status: 'Running', lift: '+8.3%', sig: '88%', started: 'May 12', audience: 'All visitors',
    matchup: ['Original', 'Heading variable 1', 'Heading variable 2', 'Heading variable 3'],
    variables: [{ name: 'Benefit-led headline', projectId: 'benefit-headline' }],
    // Sequential A/B tests: each heading variable runs against the original in its own round.
    sequence: {
      current: 'V2',
      rounds: [
        {
          name: 'Round 1', status: 'Completed', dates: 'May 12 – May 24', sig: '97%', winner: 'variant', lift: '+8.3%',
          control: { label: 'Original', text: 'Modern Trail Pack 28L', cvr: '3.6%' },
          variant: { label: 'V1', text: 'Built for the long haul — Trail Pack 28L', cvr: '3.9%' },
        },
        {
          name: 'Round 2', status: 'Running', dates: 'May 26 – now', sig: '88%', winner: null, lift: '+5.6%',
          control: { label: 'Original', text: 'Modern Trail Pack 28L', cvr: '3.6%' },
          variant: { label: 'V2', text: 'Pack once. Go anywhere.', cvr: '3.8%' },
        },
        {
          name: 'Round 3', status: 'Planned', dates: 'Queued', sig: null, winner: null, lift: null,
          control: { label: 'Original', text: 'Modern Trail Pack 28L' },
          variant: { label: 'V3', text: 'Last day: 25% off the Trail Pack 28L' },
        },
      ],
    },
    metrics: [
      { label: 'Conversion lift', value: '+5.6%', tone: 'pos', sub: 'V2 vs. original' },
      { label: 'Sessions', value: '6,200', sub: '3,100 / variation' },
      { label: 'Added revenue', value: '$1,600', tone: 'pos', sub: 'projected / mo' },
      { label: 'Significance', value: '88%', sub: 'stat. confidence' },
    ],
    variations: [
      { label: 'Original', text: 'Modern Trail Pack 28L', sessions: '9,300', cvr: '3.6%', lift: '—', winner: false },
      { label: 'Heading variable 1 (V1)', text: 'Built for the long haul — Trail Pack 28L', sessions: '3,100', cvr: '3.9%', lift: '+8.3%', winner: false },
      { label: 'Heading variable 2 (V2)', text: 'Pack once. Go anywhere.', sessions: '3,100', cvr: '3.8%', lift: '+5.6%', winner: true },
      { label: 'Heading variable 3 (V3)', text: 'Last day: 25% off the Trail Pack 28L', sessions: '—', cvr: '—', lift: '—', winner: false },
    ],
  },
  {
    id: 'headline-vs-imagery', projectId: 'benefit-headline', name: 'Heading + benefit list vs heading + lifestyle image',
    element: 'all product pages', status: 'Running', lift: '+9.3%', sig: '92%', started: 'Jun 8', audience: 'All visitors',
    // Two variables bundled per arm, the two bundles tested head-to-head.
    sides: [
      ['Heading', 'Benefit list'],
      ['Heading', 'Lifestyle image'],
    ],
    matchup: ['Heading + Benefit list', 'Heading + Lifestyle image'],
    variables: [
      { name: 'Heading', projectId: 'benefit-headline' },
      { name: 'Benefit list', projectId: 'trust-badges' },
      { name: 'Lifestyle image', projectId: 'apparel' },
    ],
    metrics: [
      { label: 'Conversion lift', value: '+9.3%', tone: 'pos', sub: 'best bundle' },
      { label: 'Sessions', value: '16,800', sub: '8,400 / variation' },
      { label: 'Added revenue', value: '$2,700', tone: 'pos', sub: 'projected / mo' },
      { label: 'Significance', value: '92%', sub: 'stat. confidence' },
    ],
    variations: [
      { label: 'Heading + Benefit list', parts: [{ name: 'Heading', projectId: 'benefit-headline' }, { name: 'Benefit list', projectId: 'trust-badges' }], text: 'Benefit-led heading with a scannable benefit list', sessions: '8,400', cvr: '4.2%', lift: '+3.4%', winner: false },
      { label: 'Heading + Lifestyle image', parts: [{ name: 'Heading', projectId: 'benefit-headline' }, { name: 'Lifestyle image', projectId: 'apparel' }], text: 'Benefit-led heading with a lifestyle hero image', sessions: '8,400', cvr: '4.5%', lift: '+9.3%', winner: true },
    ],
  },
]

export const getTest = (id) => abtests.find(t => t.id === id) || abtests[0]

// Resolve a matchup/variation label to the variable (project) it belongs to, so
// variable names can be made clickable. The control ("Original") has no variable.
export function matchupLink(test, label) {
  if (!test || !label || /original/i.test(label)) return null
  const vars = test.variables || []
  if (!vars.length) return null
  const exact = vars.find(v => v.name === label)
  if (exact) return exact.projectId
  const partial = vars.find(v => label.includes(v.name))
  if (partial) return partial.projectId
  if (vars.length === 1) return vars[0].projectId
  return null
}
