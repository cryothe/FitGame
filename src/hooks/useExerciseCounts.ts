import { useCallback, useEffect, useState } from 'react'
import { EXERCISES, type ExerciseId } from '../data/exercises'

const STORAGE_KEY = 'fitgame-counts-v1'

export type Counts = Record<ExerciseId, number>

function emptyCounts(): Counts {
  return EXERCISES.reduce((acc, ex) => {
    acc[ex.id] = 0
    return acc
  }, {} as Counts)
}

function loadCounts(): Counts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCounts()
    const parsed = JSON.parse(raw) as Partial<Counts>
    return { ...emptyCounts(), ...parsed }
  } catch {
    return emptyCounts()
  }
}

export function useExerciseCounts() {
  const [counts, setCounts] = useState<Counts>(() => loadCounts())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts))
  }, [counts])

  const addReps = useCallback((id: ExerciseId, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return
    const n = Math.floor(amount)
    setCounts((prev) => ({ ...prev, [id]: prev[id] + n }))
  }, [])

  const resetAll = useCallback(() => {
    setCounts(emptyCounts())
  }, [])

  return { counts, addReps, resetAll }
}
