// ============================================================================
// Demo catalog (ConversionLift)
// Product pages are generated deterministically per domain from category
// templates. Each product carries the attributes the mock AI "generates" from
// (category, price, features, material, rating). v1 = mocked platform sync.
// ============================================================================

import { placeholderImage } from './placeholder.js'

// -- Category templates ------------------------------------------------------
// Each template produces a family of products with varied attributes.

const PEAKGEAR_CATEGORIES = [
  {
    key: 'backpacks',
    label: 'Backpacks',
    names: ['Trailblazer', 'Summit', 'Wanderer', 'Ridgeline', 'Voyager', 'Basecamp'],
    suffix: 'Backpack',
    sizes: ['28L', '45L', '60L'],
    priceRange: [89, 189],
    features: ['Waterproof', 'Ventilated back panel', 'Rain cover included', 'Hydration compatible'],
    materials: ['Ripstop nylon', 'Recycled polyester'],
  },
  {
    key: 'jackets',
    label: 'Jackets',
    names: ['Alpine', 'Stormshield', 'Glacier', 'Northwind', 'Crestline'],
    suffix: 'Shell Jacket',
    sizes: ['S', 'M', 'L', 'XL'],
    priceRange: [129, 299],
    features: ['3-layer waterproof', 'Pit zips', 'Helmet-compatible hood', 'Windproof'],
    materials: ['GORE-TEX', '20K/20K membrane'],
  },
  {
    key: 'footwear',
    label: 'Footwear',
    names: ['Bouldering', 'Trail Runner', 'Approach', 'Glacier Trek', 'Canyon'],
    suffix: 'Boot',
    sizes: ['40', '42', '44', '46'],
    priceRange: [99, 219],
    features: ['Vibram outsole', 'Gusseted tongue', 'Toe protection', 'Breathable mesh'],
    materials: ['Nubuck leather', 'Knit synthetic'],
  },
  {
    key: 'tents',
    label: 'Tents',
    names: ['Skyline', 'Outpost', 'Nomad', 'Horizon', 'Drifter'],
    suffix: 'Tent',
    sizes: ['1P', '2P', '4P'],
    priceRange: [149, 449],
    features: ['Double-wall', 'Freestanding', 'Taped seams', 'Footprint included'],
    materials: ['Silnylon', 'Polyester taffeta'],
  },
]

const GLOWSKIN_CATEGORIES = [
  {
    key: 'serums',
    label: 'Serums',
    names: ['Radiance', 'Hydra', 'Clarity', 'Renewal', 'Bright'],
    suffix: 'Serum',
    sizes: ['30ml', '50ml'],
    priceRange: [24, 68],
    features: ['Vegan', 'Fragrance-free', 'Dermatologist-tested', 'Cruelty-free'],
    materials: ['Hyaluronic acid', 'Vitamin C', 'Niacinamide'],
  },
  {
    key: 'moisturizers',
    label: 'Moisturizers',
    names: ['Dewdrop', 'Cloud', 'Velvet', 'Barrier', 'Aqua'],
    suffix: 'Cream',
    sizes: ['50ml', '100ml'],
    priceRange: [28, 72],
    features: ['Non-comedogenic', 'SPF 30', '24h hydration', 'Sensitive-skin safe'],
    materials: ['Ceramides', 'Squalane', 'Shea butter'],
  },
  {
    key: 'cleansers',
    label: 'Cleansers',
    names: ['Fresh Start', 'Gentle', 'Purify', 'Foam', 'Balance'],
    suffix: 'Cleanser',
    sizes: ['150ml', '200ml'],
    priceRange: [18, 42],
    features: ['Sulfate-free', 'pH-balanced', 'Soap-free', 'Daily use'],
    materials: ['Glycerin', 'Green tea', 'Salicylic acid'],
  },
]

function rangePick(arr, i) {
  return arr[i % arr.length]
}

function priceFor(range, i, count) {
  const [min, max] = range
  const step = count > 1 ? (max - min) / (count - 1) : 0
  return Math.round(min + step * i)
}

// Build `count` products for a domain by cycling through its categories.
function buildCatalog(domainId, baseUrl, categories, count, currency) {
  const products = []
  let i = 0
  while (products.length < count) {
    const cat = categories[i % categories.length]
    const variantIndex = Math.floor(i / categories.length)
    const name = rangePick(cat.names, variantIndex)
    const size = rangePick(cat.sizes, variantIndex)
    const title = `${name} ${size} ${cat.suffix}`
    const slug = `${name}-${size}-${cat.suffix}`.toLowerCase().replace(/\s+/g, '-')
    const id = `${domainId}-p${String(products.length + 1).padStart(3, '0')}`
    products.push({
      id,
      product_page_id: id,
      url: `https://${baseUrl}/products/${slug}`,
      title,
      preview: placeholderImage(title, id),
      attributes: {
        category: cat.label,
        categoryKey: cat.key,
        price: priceFor(cat.priceRange, variantIndex, cat.names.length),
        currency,
        size,
        material: rangePick(cat.materials, variantIndex),
        features: cat.features.slice(0, 3),
        rating: 4.1 + (i % 9) / 10,
        reviews: 12 + ((i * 37) % 480),
      },
    })
    i++
  }
  return products
}

export const catalogs = {
  'peakgear.example': buildCatalog('peakgear', 'peakgear.example', PEAKGEAR_CATEGORIES, 36, 'USD'),
  'glowskin.example': buildCatalog('glowskin', 'glowskin.example', GLOWSKIN_CATEGORIES, 24, 'USD'),
}

export function getCatalog(domainId) {
  return catalogs[domainId] || []
}
