export const colors = {
  ink: '#0a1210',
  panel: '#13211c',
  line: 'rgba(232, 240, 228, 0.12)',
  sand: '#e8f0e4',
  muted: '#8aa394',
  lime: '#c8f542',
  bronze: '#cd7f32',
  silver: '#c0c7d1',
  gold: '#e2b23a',
  diamond: '#6ec8ff',
  champion: '#c8f542',
} as const

export const rankColor = {
  bronze: colors.bronze,
  silver: colors.silver,
  gold: colors.gold,
  diamond: colors.diamond,
  champion: colors.champion,
} as const
