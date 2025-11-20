export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value || 0);

export const formatPercentage = (value) =>
  `${(value ?? 0).toFixed(1)}%`;

export const partyPalette = [
  '#4C1D95',
  '#0F766E',
  '#BE185D',
  '#2563EB',
  '#EA580C',
  '#16A34A',
  '#9333EA',
  '#F97316',
  '#0EA5E9',
  '#1E293B'
];
