// ============================================================================
// Placeholder image helper (ConversionLift demo)
// v1 prototype uses placeholder images instead of real image generation.
// Returns a self-contained SVG data URI (offline-safe, deterministic) so
// catalog thumbnails and generated "image" content render without network.
// ============================================================================

const PALETTE = [
  ['#0EA5E9', '#0369A1'], // sky
  ['#F06431', '#C2410C'], // om orange
  ['#10B981', '#047857'], // emerald
  ['#8B5CF6', '#6D28D9'], // violet
  ['#F59E0B', '#B45309'], // amber
  ['#EC4899', '#BE185D'], // pink
]

// Stable hash so the same seed always maps to the same colour + no Math.random.
function hash(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h)
}

function initials(label) {
  return label
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
}

// label  — text shown on the placeholder (product title or content label)
// seed   — string controlling the colour (defaults to label)
export function placeholderImage(label = '', seed = label) {
  const [from, to] = PALETTE[hash(seed) % PALETTE.length]
  const text = initials(label)
  const id = `g${hash(seed)}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#${id})"/>
    <text x="200" y="165" font-family="Inter, sans-serif" font-size="96" font-weight="700"
      fill="rgba(255,255,255,0.92)" text-anchor="middle">${text}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
