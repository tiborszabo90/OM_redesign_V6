// ============================================================================
// Real store imagery (ConversionLift demo PDP)
// Verified Unsplash CDN photos so the prototype PDP looks like a real scraped
// outdoor-gear store, not placeholders. Curated by ID (all return 200).
// ============================================================================

const U = (id, w = 800, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${h ? `&h=${h}` : ''}`

export const storeImages = {
  // Product gallery (main + thumbnails)
  gallery: [
    U('1553062407-98eeb64c6a62', 900, 900),
    U('1533055640609-24b498dfd74c', 400, 400),
    U('1546938576-6e6a64f317cc', 400, 400),
    U('1622260614153-03223fb72052', 400, 400),
  ],
  // Lifestyle hero (embed, above the fold)
  hero: U('1465056836041-7f43ac27dcb5', 1400, 600),
  // Related products
  related: [
    { img: U('1551028719-00167b16eac5', 500, 500), name: 'Alpine M Shell Jacket', price: 189 },
    { img: U('1504280390367-361c6d9f38f4', 500, 500), name: 'Skyline 2P Tent', price: 259 },
    { img: U('1571687949921-1306bfb24b72', 500, 500), name: 'Trail Runner Boot', price: 139 },
    { img: U('1517438476312-10d79c077509', 500, 500), name: 'Glacier 60L Pack', price: 159 },
  ],
}
