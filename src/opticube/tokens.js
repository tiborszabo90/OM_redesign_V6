// ============================================================================
// OptiCube design tokens (JS mirror of opticube.css)
// Single source of truth for the design guide swatch rendering.
// ============================================================================

export const primaryScale = [
  { step: '50', hex: '#EEF0FF' },
  { step: '100', hex: '#E0E3FF' },
  { step: '200', hex: '#C4C9FF' },
  { step: '300', hex: '#A5ABFF' },
  { step: '400', hex: '#8488FB' },
  { step: '500', hex: '#6366F1', brand: true },
  { step: '600', hex: '#4F46E5' },
  { step: '700', hex: '#4338CA' },
  { step: '800', hex: '#3730A3' },
  { step: '900', hex: '#312E81' },
]

export const neutralScale = [
  { step: '50', hex: '#F8FAFC' },
  { step: '100', hex: '#F1F5F9' },
  { step: '200', hex: '#E2E8F0' },
  { step: '300', hex: '#CBD5E1' },
  { step: '400', hex: '#94A3B8' },
  { step: '500', hex: '#64748B' },
  { step: '600', hex: '#475569' },
  { step: '700', hex: '#334155' },
  { step: '800', hex: '#1E293B' },
  { step: '900', hex: '#0F172A' },
]

export const semanticColors = [
  { name: 'Success', hex: '#10B981', soft: '#D1FAE5' },
  { name: 'Warning', hex: '#F59E0B', soft: '#FEF3C7' },
  { name: 'Danger', hex: '#EF4444', soft: '#FEE2E2' },
  { name: 'Info', hex: '#3B82F6', soft: '#DBEAFE' },
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
  { name: 'sm', value: '6px', cls: 'rounded-[6px]' },
  { name: 'md', value: '10px', cls: 'rounded-[10px]' },
  { name: 'lg', value: '14px', cls: 'rounded-[14px]' },
  { name: 'xl', value: '20px', cls: 'rounded-[20px]' },
  { name: 'full', value: '9999px', cls: 'rounded-full' },
]

export const shadows = [
  { name: 'sm', cls: 'shadow-[0_1px_2px_rgba(15,23,42,0.06)]' },
  { name: 'md', cls: 'shadow-[0_4px_12px_rgba(15,23,42,0.08)]' },
  { name: 'lg', cls: 'shadow-[0_12px_28px_rgba(15,23,42,0.12)]' },
  { name: 'glow', cls: 'shadow-[0_8px_24px_rgba(99,102,241,0.35)]' },
]
