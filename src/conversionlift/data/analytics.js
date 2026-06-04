// ============================================================================
// Demo analytics (ConversionLift)
// One live experiment's aggregated result over the scope. Significance is a
// SHOWN signal from demo data (no real stats engine in v1, per spec §9.5).
// ============================================================================

// 14-day timeseries: control vs treatment conversion rate (%).
function buildSeries() {
  const days = []
  const control = []
  const treatment = []
  // Deterministic gentle ramp so treatment pulls ahead over time.
  const ctrlBase = [1.9, 2.0, 2.1, 1.8, 2.2, 2.0, 2.1, 2.3, 2.0, 2.1, 2.2, 2.0, 2.1, 2.2]
  const trtBase = [2.0, 2.2, 2.4, 2.3, 2.6, 2.5, 2.7, 2.9, 2.6, 2.8, 2.9, 2.7, 2.8, 3.0]
  for (let i = 0; i < 14; i++) {
    days.push(`Day ${i + 1}`)
    control.push(ctrlBase[i])
    treatment.push(trtBase[i])
  }
  return { days, control, treatment }
}

export const demoExperimentResult = {
  experiment_id: 'exp-pg-trust',
  optimization_id: 'opt-pg-trust',
  domain_id: 'peakgear.example',
  scope_product_count: 36,
  status: 'live',
  significance: { significant: true, confidence: 0.95, label: 'Significant · 95% confidence' },
  arms: [
    {
      key: 'control',
      label: 'Control (original)',
      visitors: 18420,
      conversion_rate: 2.1,
      add_to_cart_rate: 8.4,
      revenue_per_visitor: 1.94,
    },
    {
      key: 'treatment',
      label: 'Trust badges',
      visitors: 18510,
      conversion_rate: 2.7,
      add_to_cart_rate: 10.1,
      revenue_per_visitor: 2.48,
    },
  ],
  lift: {
    conversion_pct: 28,
    add_to_cart_pct: 20,
    revenue_per_visitor_pct: 28,
  },
  auto_winner: { enabled: true, status: 'leading', arm: 'treatment' },
  series: buildSeries(),
  // Optional top/flop products within the scope.
  top_products: [
    { title: 'Trailblazer 45L Backpack', lift_pct: 41 },
    { title: 'Alpine M Shell Jacket', lift_pct: 36 },
    { title: 'Skyline 2P Tent', lift_pct: 33 },
  ],
  flop_products: [
    { title: 'Canyon 46 Boot', lift_pct: -4 },
    { title: 'Outpost 1P Tent', lift_pct: 2 },
  ],
}
