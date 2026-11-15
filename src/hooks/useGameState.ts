import { useCallback, useEffect, useMemo, useState } from 'react'
import { ACHIEVEMENTS, levelFromXp, type Quest } from '../data/quests'

const STORAGE_KEY = 'fitgame-progress-v1'

export type GameState = {
  totalXp: number
  questsCompleted: number
  completedQuestIds: string[]
  streak: number
  lastActiveDate: string | null
  unlockedAchievements: string[]
}

const DEFAULT_STATE: GameState = {
  totalXp: 0,
  questsCompleted: 0,
  completedQuestIds: [],
  streak: 0,
  lastActiveDate: null,
  unlockedAchievements: [],
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw) as Partial<GameState>
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function computeUnlocks(state: GameState): string[] {
  const unlocked = new Set(state.unlockedAchievements)
  for (const a of ACHIEVEMENTS) {
    if (unlocked.has(a.id)) continue
    const value =
      a.kind === 'xp' ? state.totalXp : a.kind === 'streak' ? state.streak : state.questsCompleted
    if (value >= a.threshold) unlocked.add(a.id)
  }
  return [...unlocked]
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState())
  const [justUnlocked, setJustUnlocked] = useState<string[]>([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const levelInfo = useMemo(() => levelFromXp(state.totalXp), [state.totalXp])

  const completeQuest = useCallback((quest: Quest) => {
    setState((prev) => {
      const today = todayKey()
      let streak = prev.streak
      if (prev.lastActiveDate === today) {
        // already trained today — keep streak
      } else if (prev.lastActiveDate === yesterdayKey()) {
        streak = prev.streak + 1
      } else {
        streak = 1
      }

      const next: GameState = {
        ...prev,
        totalXp: prev.totalXp + quest.xp,
        questsCompleted: prev.questsCompleted + 1,
        completedQuestIds: prev.completedQuestIds.includes(quest.id)
          ? prev.completedQuestIds
          : [...prev.completedQuestIds, quest.id],
        streak,
        lastActiveDate: today,
        unlockedAchievements: prev.unlockedAchievements,
      }

      const unlocks = computeUnlocks(next)
      const newly = unlocks.filter((id) => !prev.unlockedAchievements.includes(id))
      if (newly.length) {
        queueMicrotask(() => setJustUnlocked(newly))
      }
      next.unlockedAchievements = unlocks
      return next
    })
  }, [])

  const dismissUnlocks = useCallback(() => setJustUnlocked([]), [])

  const resetProgress = useCallback(() => {
    setState({ ...DEFAULT_STATE })
    setJustUnlocked([])
  }, [])

  return {
    state,
    levelInfo,
    justUnlocked,
    completeQuest,
    dismissUnlocks,
    resetProgress,
  }
}
