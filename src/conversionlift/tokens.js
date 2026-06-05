// ============================================================================
// ConversionLift design tokens (JS mirror for the design guide swatches)
// ConversionLift reuses the OptiMonk palette (--color-om-*) with a sky accent
// (--cl-accent-*). These arrays only drive the design-guide rendering.
// ============================================================================

// -- Brand · Sky (--cl-accent, the ConversionLift brand / primary colour) ----
export const brandScale = [
  { step: '50', hex: '#F0F9FF' },
  { step: '100', hex: '#E0F2FE' },
  { step: '200', hex: '#BAE6FD' },
  { step: '400', hex: '#38BDF8' },
  { step: '500', hex: '#0EA5E9', brand: true },
  { step: '600', hex: '#0284C7' },
  { step: '700', hex: '#0369A1' },
]

// -- Neutral · Gray (om-gray) ------------------------------------------------
export const neutralScale = [
  { step: '50', hex: '#F9FAFB' },
  { step: '100', hex: '#F1F2F4' },
  { step: '200', hex: '#E3E5E8' },
  { step: '300', hex: '#D5D8DD' },
  { step: '400', hex: '#B9BEC6' },
  { step: '500', hex: '#8F97A4' },
  { step: '600', hex: '#505763' },
  { step: '700', hex: '#23262A' },
  { step: '800', hex: '#1A1C1F' },
  { step: '900', hex: '#111213' },
]

export const semanticColors = [
  { name: 'Success', hex: '#2CC896', soft: '#D6F5EC' },
  { name: 'Warning', hex: '#F59E0B', soft: '#FEF3C7' },
  { name: 'Danger', hex: '#EF4444', soft: '#FEE2E2' },
  { name: 'Info', hex: '#0EA5E9', soft: '#E0F2FE' },
]

export const typeScale = [
  { name: 'Display', cls: 'text-5xl font-bold', sample: 'Aa', spec: '40 / 700' },
  { name: 'Heading 1', cls: 'text-3xl font-semibold', sample: 'Aa', spec: '30 / 600' },
  { name: 'Heading 2', cls: 'text-2xl font-semibold', sample: 'Aa', spec: '24 / 600' },
  { name: 'Heading 3', cls: 'text-xl font-medium', sample: 'Aa', spec: '20 / 500' },
  { name: 'Body', cls: 'text-base font-normal', sample: 'The quick brown fox', spec: '16 / 400' },
  { name: 'Small', cls: 'text-sm font-normal', sample: 'The quick brown fox', spec: '14 / 400' },
  { name: 'Caption', cls: 'text-xs font-medium uppercase tracking-wide', sample: 'Caption label', spec: '12 / 500' },
]

export const radii = [
  { name: 'sm', value: '6px', cls: 'rounded-md' },
  { name: 'md', value: '10px', cls: 'rounded-[10px]' },
  { name: 'lg', value: '14px', cls: 'rounded-[14px]' },
  { name: 'xl', value: '16px', cls: 'rounded-2xl' },
  { name: 'full', value: '9999px', cls: 'rounded-full' },
]

export const shadows = [
  { name: 'sm', cls: 'shadow-[0_1px_2px_rgba(17,18,19,0.06)]' },
  { name: 'md', cls: 'shadow-[0_4px_12px_rgba(17,18,19,0.08)]' },
  { name: 'lg', cls: 'shadow-[0_12px_28px_rgba(17,18,19,0.12)]' },
  { name: 'accent', cls: 'shadow-[0_8px_24px_rgba(14,165,233,0.30)]' },
]

// -- ConversionLift domain badges (documents the product-specific patterns) --

// Optimization type (replace vs embed)
export const optimizationTypes = [
  { key: 'replace', label: 'Replace', variant: 'orange', desc: 'Swap an existing page element.' },
  { key: 'embed', label: 'Embed', variant: 'green-light', desc: 'Insert a new generated block.' },
]

// Content type produced by a generation
export const contentTypes = [
  { key: 'text', label: 'Text', variant: 'gray', icon: 'Type' },
  { key: 'image', label: 'Image', variant: 'gray', icon: 'Image' },
  { key: 'text+image', label: 'Text + Image', variant: 'gray', icon: 'LayoutTemplate' },
]

// Generated item lifecycle status
export const itemStatuses = [
  { key: 'pending', label: 'Pending', variant: 'gray-muted' },
  { key: 'generated', label: 'Generated', variant: 'gray' },
  { key: 'edited', label: 'Edited', variant: 'yellow' },
  { key: 'approved', label: 'Approved', variant: 'green-light' },
  { key: 'rejected', label: 'Rejected', variant: 'outlined' },
]

// Experiment status
export const experimentStatuses = [
  { key: 'draft', label: 'Draft', variant: 'gray-muted' },
  { key: 'live', label: 'Live', variant: 'green' },
  { key: 'completed', label: 'Completed', variant: 'gray' },
]
