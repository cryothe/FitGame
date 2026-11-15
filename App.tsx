import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { EXERCISES, rankForCount, type ExerciseId } from './src/data/exercises'
import { useExerciseCounts } from './src/hooks/useExerciseCounts'
import { colors, rankColor } from './src/theme'

const QUICK_ADDS = [1, 5, 10, 25]

export default function App() {
  const { counts, ready, addReps, resetAll } = useExerciseCounts()
  const [selected, setSelected] = useState<ExerciseId>('pushups')
  const [custom, setCustom] = useState('')

  const progress = rankForCount(counts[selected])
  const selectedExercise = EXERCISES.find((e) => e.id === selected)!

  function submitCustom() {
    const n = Number(custom)
    if (!Number.isFinite(n) || n <= 0) return
    addReps(selected, n)
    setCustom('')
  }

  if (!ready) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator color={colors.lime} size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>
          Fit<Text style={styles.brandAccent}>Game</Text>
        </Text>
        <Text style={styles.tagline}>Log reps. Climb ranks.</Text>

        <View style={styles.picker}>
          {EXERCISES.map((ex) => {
            const r = rankForCount(counts[ex.id])
            const active = selected === ex.id
            return (
              <Pressable
                key={ex.id}
                onPress={() => setSelected(ex.id)}
                style={[styles.exBtn, active && styles.exBtnSelected]}
              >
                <View style={styles.exTop}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={[styles.rankPill, { color: rankColor[r.rank] }]}>{r.label}</Text>
                </View>
                <Text style={styles.exCount}>{counts[ex.id].toLocaleString()} reps</Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.detail}>
          <View style={styles.detailHead}>
            <Text style={styles.detailTitle}>{selectedExercise.name}</Text>
            <Text style={[styles.rankPillLarge, { color: rankColor[progress.rank] }]}>
              {progress.label}
            </Text>
          </View>

          <Text style={styles.total}>
            <Text style={styles.totalStrong}>{counts[selected].toLocaleString()}</Text>
            {'  '}lifetime reps
          </Text>

          {progress.next ? (
            <View style={styles.barBlock}>
              <View style={styles.barLabels}>
                <Text style={styles.barLabel}>{progress.label}</Text>
                <Text style={styles.barLabel}>{progress.next.label}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${progress.percent}%` }]} />
              </View>
              <Text style={styles.barMeta}>
                {(progress.next.min - counts[selected]).toLocaleString()} reps to{' '}
                {progress.next.label} ({progress.percent}%)
              </Text>
            </View>
          ) : (
            <Text style={styles.maxed}>Champion rank — maxed out.</Text>
          )}

          <Text style={styles.addLabel}>Add reps</Text>
          <View style={styles.quickRow}>
            {QUICK_ADDS.map((n) => (
              <Pressable key={n} style={styles.btn} onPress={() => addReps(selected, n)}>
                <Text style={styles.btnText}>+{n}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.customRow}>
            <TextInput
              style={styles.input}
              value={custom}
              onChangeText={setCustom}
              keyboardType="number-pad"
              placeholder="Custom amount"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
              onSubmitEditing={submitCustom}
            />
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={submitCustom}>
              <Text style={[styles.btnText, styles.btnPrimaryText]}>Add</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={resetAll} style={styles.resetWrap}>
          <Text style={styles.reset}>Reset all counts</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.sand,
    letterSpacing: -1.5,
  },
  brandAccent: {
    color: colors.lime,
  },
  tagline: {
    marginTop: 6,
    marginBottom: 20,
    color: colors.muted,
    fontSize: 16,
  },
  picker: {
    gap: 10,
    marginBottom: 16,
  },
  exBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(19, 33, 28, 0.75)',
  },
  exBtnSelected: {
    borderColor: colors.lime,
    backgroundColor: 'rgba(200, 245, 66, 0.08)',
  },
  exTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  exName: {
    color: colors.sand,
    fontWeight: '700',
    fontSize: 17,
  },
  exCount: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 14,
  },
  rankPill: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  rankPillLarge: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detail: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.panel,
    padding: 16,
  },
  detailHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  detailTitle: {
    color: colors.sand,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  total: {
    color: colors.muted,
    marginBottom: 16,
    fontSize: 15,
  },
  totalStrong: {
    color: colors.sand,
    fontSize: 22,
    fontWeight: '700',
  },
  barBlock: {
    marginBottom: 18,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(232, 240, 228, 0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.lime,
  },
  barMeta: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
  },
  maxed: {
    color: colors.lime,
    fontWeight: '700',
    marginBottom: 18,
  },
  addLabel: {
    color: colors.sand,
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 15,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  btn: {
    borderWidth: 1,
    borderColor: 'rgba(232, 240, 228, 0.2)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnPrimary: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  btnText: {
    color: colors.sand,
    fontWeight: '700',
  },
  btnPrimaryText: {
    color: colors.ink,
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(232, 240, 228, 0.2)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: colors.sand,
    backgroundColor: 'rgba(7, 16, 12, 0.55)',
  },
  resetWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  reset: {
    color: colors.muted,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
})
