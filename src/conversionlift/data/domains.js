// ============================================================================
// Demo domains (ConversionLift)
// The Domain is the highest active context (workspace-level). Two demo shops:
// one already connected, one not — so the connect gate is exercisable.
// ============================================================================

import { catalogs } from './catalog.js'

export const demoDomains = [
  {
    id: 'glowskin.example',
    name: 'GlowSkin',
    url: 'glowskin.example',
    platform: 'Shopify',
    connection_status: 'connected',
    productCount: catalogs['glowskin.example'].length,
  },
  {
    id: 'peakgear.example',
    name: 'PeakGear',
    url: 'peakgear.example',
    platform: 'Shoprenter',
    connection_status: 'not_connected',
    productCount: catalogs['peakgear.example'].length,
  },
]

export function getDomain(id) {
  return demoDomains.find(d => d.id === id) || null
}
