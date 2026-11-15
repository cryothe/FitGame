import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { EXERCISES, type ExerciseId } from '../data/exercises'

export type Counts = Record<ExerciseId, number>

function storageKey(userId?: number) {
  return userId != null ? `fitgame-counts-v1-user-${userId}` : 'fitgame-counts-v1'
}

function emptyCounts(): Counts {
  return EXERCISES.reduce((acc, ex) => {
    acc[ex.id] = 0
    return acc
  }, {} as Counts)
}

export function useExerciseCounts(userId?: number) {
  const [counts, setCounts] = useState<Counts>(emptyCounts)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    setReady(false)
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey(userId))
        if (!cancelled) {
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<Counts>
            setCounts({ ...emptyCounts(), ...parsed })
          } else {
            setCounts(emptyCounts())
          }
        }
      } catch {
        if (!cancelled) setCounts(emptyCounts())
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (!ready) return
    AsyncStorage.setItem(storageKey(userId), JSON.stringify(counts)).catch(() => {})
  }, [counts, ready, userId])

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
