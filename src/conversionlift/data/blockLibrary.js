// ============================================================================
// Block library (ConversionLift, Flow B · Type-first, Flow E · Library-first)
// An illustrated library of concrete block templates. Each block carries its
// location + content_type; each has one or more STYLE VERSIONS the user picks.
// The chosen version's `content` is what gets applied on the store page.
// ============================================================================

const U = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`

export const blockLibrary = [
  {
    key: 'headline',
    name: 'Benefit headline',
    description: 'Replace the product title with a benefit-led headline.',
    content_type: 'text',
    location: 'Product title',
    versions: [
      { id: 'hl-1', label: 'Benefit-led', content: { text: 'Carry more, feel less, all day' } },
    ],
  },
  {
    key: 'hero',
    name: 'Image with badges',
    description: 'A lifestyle image with trust/benefit badges.',
    content_type: 'text+image',
    location: 'Image with badge',
    versions: [
      { id: 'hero-1', label: 'On the trail', content: { image: U('1465056836041-7f43ac27dcb5'), badge: ['Field-tested', '4.8★ rated', '2-yr warranty'] } },
      { id: 'hero-2', label: 'Summit', content: { image: U('1506905925346-21bda4d32df4'), badge: ['Ultralight', 'Waterproof', '28L capacity'] } },
      { id: 'hero-3', label: 'Basecamp', content: { image: U('1504280390367-361c6d9f38f4'), badge: ['Free returns', 'Ships in 24h', 'Secure checkout'] } },
    ],
  },
  {
    key: 'trust',
    name: 'Trust badges',
    description: 'A reassurance row under the buy box.',
    content_type: 'text',
    location: 'Below add-to-cart',
    versions: [
      { id: 'tr-1', label: 'Essentials', content: { text: 'Free 30-day returns · 2-year warranty · Secure checkout' } },
    ],
  },
  {
    key: 'bullets',
    name: 'Benefit bullets',
    description: 'Turn the description into scannable benefit bullets.',
    content_type: 'text',
    location: 'Description bullets',
    versions: [
      { id: 'bl-1', label: 'Benefit-led', content: { text: 'Waterproof in any weather\nVentilated back panel\nFits a 15" laptop\nLifetime guarantee' } },
    ],
  },
  {
    key: 'listimage',
    name: 'Benefit list with image',
    description: 'A benefit list paired with a supporting image.',
    content_type: 'text+image',
    location: 'Above the details',
    versions: [
      { id: 'li-1', label: 'On the trail', content: { image: U('1533055640609-24b498dfd74c'), text: 'Waterproof in any weather\nVentilated back panel\nFits a 15" laptop\nLifetime guarantee' } },
      { id: 'li-2', label: 'In context', content: { image: U('1622260614153-03223fb72052'), text: 'Carries up to 20kg\nComfort-fit straps\nQuick-access pockets' } },
    ],
  },
]
