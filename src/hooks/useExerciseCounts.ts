import AsyncStorage from '@react-native-async-storage/async-storage'
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

export function useExerciseCounts() {
  const [counts, setCounts] = useState<Counts>(emptyCounts)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as Partial<Counts>
          setCounts({ ...emptyCounts(), ...parsed })
        }
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counts)).catch(() => {})
  }, [counts, ready])

  const addReps = useCallback((id: ExerciseId, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return
    const n = Math.floor(amount)
    setCounts((prev) => ({ ...prev, [id]: prev[id] + n }))
  }, [])

  const resetAll = useCallback(() => {
    setCounts(emptyCounts())
  }, [])

  return { counts, ready, addReps, resetAll }
}
