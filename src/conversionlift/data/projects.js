// Projects shared by the list and the detail view. The tool is specialised for
// PRODUCT PAGE optimization — every project targets product pages (a slice of
// them). Each project manages one variable (a bundle of generated content),
// tested as a whole against the original.
export const projects = [
  { id: 'benefit-headline', name: 'Benefit-led headline', kind: 'text', element: 'All product pages · headline', images: 36, audience: 'All visitors', status: 'Review', test: null, updated: '2h ago',
    note: 'Rewrites the product headline as a short, benefit-led line across every product page, reviewed as one variable.' },
  { id: 'titles', name: 'Benefit-led product titles', kind: 'text', element: 'All product pages · titles', images: 36, audience: 'All visitors', status: 'Testing', test: { id: 'titles', status: 'Running', lift: '+12.4%' }, updated: '2h ago',
    note: 'Rewrites every product title as a benefit-led headline that keeps the key spec.' },
  { id: 'bestsellers', name: 'Best-seller page polish', element: 'Top 50 SKUs', images: 50, audience: 'All visitors', status: 'Testing', test: { id: 'bestsellers', status: 'Running', lift: '+4.8%' }, updated: '6h ago',
    note: 'Optimized titles, imagery and trust badges for the 50 best-selling product pages.' },
  { id: 'new-arrivals', name: 'New arrival pages', element: 'New arrival PDPs', images: 18, audience: 'All visitors', status: 'Live', test: { id: 'new-arrivals', status: 'Completed', lift: '+15.2%' }, updated: '1w ago',
    note: 'Lifestyle hero imagery and benefit bullets for new arrival product pages. Winning variable rolled out.' },
  { id: 'trust-badges', name: 'Trust badges on product pages', element: 'All PDPs · buy box', images: 36, audience: 'All visitors', status: 'Draft', test: null, updated: '5d ago',
    note: 'A trust-badge row (returns, warranty, secure checkout) near the buy box on every product page.' },
  { id: 'apparel', name: 'Apparel product pages', element: 'Apparel PDPs', images: 24, audience: 'All visitors', status: 'Live', test: null, updated: '1d ago',
    note: 'Refreshed imagery and benefit-led copy applied directly to the apparel product pages.' },
]

export const getProject = (id) => projects.find(p => p.id === id) || projects[0]
