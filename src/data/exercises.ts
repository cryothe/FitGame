export type ExerciseId =
  | 'pushups'
  | 'situps'
  | 'leg-raises'
  | 'bicep-curls'
  | 'pullups'

export type Rank = 'bronze' | 'silver' | 'gold' | 'diamond' | 'champion'

export type Exercise = {
  id: ExerciseId
  name: string
}

export type RankTier = {
  rank: Rank
  label: string
  min: number
}

export const EXERCISES: Exercise[] = [
  { id: 'pushups', name: 'Pushups' },
  { id: 'situps', name: 'Situps' },
  { id: 'leg-raises', name: 'Leg raises' },
  { id: 'bicep-curls', name: 'Bicep curls' },
  { id: 'pullups', name: 'Pullups' },
]

/** Lifetime rep cutoffs for each rank (inclusive minimum). */
export const RANK_TIERS: RankTier[] = [
  { rank: 'bronze', label: 'Bronze', min: 0 },
  { rank: 'silver', label: 'Silver', min: 250 },
  { rank: 'gold', label: 'Gold', min: 1_000 },
  { rank: 'diamond', label: 'Diamond', min: 5_000 },
  { rank: 'champion', label: 'Champion', min: 15_000 },
]

export type RankProgress = {
  rank: Rank
  label: string
  next: RankTier | null
  into: number
  need: number
  percent: number
}

export function rankForCount(count: number): RankProgress {
  let current = RANK_TIERS[0]
  for (const tier of RANK_TIERS) {
    if (count >= tier.min) current = tier
  }

  const idx = RANK_TIERS.findIndex((t) => t.rank === current.rank)
  const next = idx < RANK_TIERS.length - 1 ? RANK_TIERS[idx + 1] : null

  if (!next) {
    return {
      rank: current.rank,
      label: current.label,
      next: null,
      into: 0,
      need: 0,
      percent: 100,
    }
  }

  const span = next.min - current.min
  const into = count - current.min
  const percent = Math.min(100, Math.round((into / span) * 100))

  return {
    rank: current.rank,
    label: current.label,
    next,
    into,
    need: span,
    percent,
  }
}
