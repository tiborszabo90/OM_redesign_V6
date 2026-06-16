// Sidebar menu for the Conversion Lift home/product screens.
// Same as the default dashboard, but "Insights" is replaced by "Conversion Lift".
import { Home, LayoutGrid, Users, ArrowUpRight, TrendingUp, PanelsTopLeft, GitBranch, LayoutTemplate } from 'lucide-vue-next'

export const clNavItems = [
  { id: 'home', label: 'Home', iconComponent: Home },
  { id: 'campaigns', label: 'Campaigns', iconComponent: LayoutGrid },
  { id: 'conversion-lift', label: 'Conversion\nLift', iconComponent: ArrowUpRight },
  { id: 'audience', label: 'Audience', iconComponent: Users },
  { id: 'analytics', label: 'Analytics', iconComponent: TrendingUp },
  { id: 'library', label: 'Templates', iconComponent: PanelsTopLeft },
  { id: 'settings', label: 'A/B Tests', iconComponent: GitBranch },
  { id: 'template-manager', label: 'Template\nmanager', iconComponent: LayoutTemplate }
]

// Flyout submenu children for the "Conversion Lift" item — each opens its own
// product subpage.
export const clFlyoutChildren = [
  { id: 'cl-ai-texts', label: 'AI Texts & Images', to: 'conversion-lift-product' },
  { id: 'cl-catalog', label: 'Product catalog', to: 'conversion-lift-catalog' },
  { id: 'cl-reco', label: 'AI recommendations', to: 'conversion-lift-reco' },
]

// clNavItems with the Conversion Lift item carrying its flyout children.
export const clNavItemsWithFlyout = clNavItems.map((i) =>
  i.id === 'conversion-lift' ? { ...i, children: clFlyoutChildren } : i
)
