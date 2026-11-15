export type Exercise = {
  id: string
  name: string
  reps?: number
  durationSec?: number
  cue: string
}

export type Quest = {
  id: string
  title: string
  blurb: string
  difficulty: 'easy' | 'mid' | 'hard'
  xp: number
  minutes: number
  tag: string
  exercises: Exercise[]
}

export const QUESTS: Quest[] = [
  {
    id: 'spark-sprint',
    title: 'Spark Sprint',
    blurb: 'Wake the system with a short burst of power moves.',
    difficulty: 'easy',
    xp: 120,
    minutes: 8,
    tag: 'Warm-up',
    exercises: [
      { id: 'js', name: 'Jumping jacks', durationSec: 40, cue: 'Loose arms, soft landings.' },
      { id: 'sq', name: 'Bodyweight squats', reps: 15, cue: 'Sit back, chest tall.' },
      { id: 'pl', name: 'High plank hold', durationSec: 30, cue: 'Squeeze glutes, steady breath.' },
      { id: 'lu', name: 'Alternating lunges', reps: 12, cue: 'Front knee tracks over toes.' },
    ],
  },
  {
    id: 'core-rift',
    title: 'Core Rift',
    blurb: 'Seal the midsection. Earn bonus XP if you finish without pausing.',
    difficulty: 'mid',
    xp: 200,
    minutes: 12,
    tag: 'Core',
    exercises: [
      { id: 'cr', name: 'Dead bugs', reps: 16, cue: 'Press low back into the floor.' },
      { id: 'ss', name: 'Side plank (L)', durationSec: 25, cue: 'Hips stacked and lifted.' },
      { id: 'ssr', name: 'Side plank (R)', durationSec: 25, cue: 'Hips stacked and lifted.' },
      { id: 'hb', name: 'Hollow body hold', durationSec: 30, cue: 'Ribs down, legs long.' },
      { id: 'mb', name: 'Mountain climbers', durationSec: 40, cue: 'Quick but controlled.' },
    ],
  },
  {
    id: 'iron-ascent',
    title: 'Iron Ascent',
    blurb: 'A full-body climb. Finish this to unlock the next tier.',
    difficulty: 'hard',
    xp: 340,
    minutes: 18,
    tag: 'Strength',
    exercises: [
      { id: 'pu', name: 'Push-ups', reps: 12, cue: 'Elbows ~45°, full range.' },
      { id: 'gs', name: 'Glute bridges', reps: 18, cue: 'Pause at the top.' },
      { id: 'rs', name: 'Reverse lunges', reps: 16, cue: 'Step back, stay upright.' },
      { id: 'sp', name: 'Superman holds', durationSec: 25, cue: 'Long neck, lift gently.' },
      { id: 'ws', name: 'Wall sit', durationSec: 40, cue: 'Thighs parallel if you can.' },
      { id: 'bur', name: 'Slow burpees', reps: 8, cue: 'Quality over speed.' },
    ],
  },
]

export const ACHIEVEMENTS = [
  {
    id: 'first-clear',
    title: 'First Clear',
    description: 'Complete any quest.',
    threshold: 1,
    kind: 'quests' as const,
  },
  {
    id: 'streak-3',
    title: 'Ember Streak',
    description: 'Train three days in a row.',
    threshold: 3,
    kind: 'streak' as const,
  },
  {
    id: 'xp-500',
    title: 'Half-Kilo Charge',
    description: 'Reach 500 total XP.',
    threshold: 500,
    kind: 'xp' as const,
  },
  {
    id: 'xp-1500',
    title: 'Volt Veteran',
    description: 'Reach 1,500 total XP.',
    threshold: 1500,
    kind: 'xp' as const,
  },
  {
    id: 'quests-5',
    title: 'Quest Runner',
    description: 'Clear five quests.',
    threshold: 5,
    kind: 'quests' as const,
  },
]

export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.45))
}

export function levelFromXp(totalXp: number): { level: number; into: number; need: number } {
  let level = 1
  let remaining = totalXp
  let need = xpForLevel(level)

  while (remaining >= need) {
    remaining -= need
    level += 1
    need = xpForLevel(level)
  }

  return { level, into: remaining, need }
}
