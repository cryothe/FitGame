import { useState, type FormEvent } from 'react'
import { EXERCISES, rankForCount, type ExerciseId } from './data/exercises'
import { useExerciseCounts } from './hooks/useExerciseCounts'

const QUICK_ADDS = [1, 5, 10, 25]

export default function App() {
  const { counts, addReps, resetAll } = useExerciseCounts()
  const [selected, setSelected] = useState<ExerciseId>('pushups')
  const [custom, setCustom] = useState('')

  const progress = rankForCount(counts[selected])
  const selectedExercise = EXERCISES.find((e) => e.id === selected)!

  function handleCustomSubmit(e: FormEvent) {
    e.preventDefault()
    const n = Number(custom)
    if (!Number.isFinite(n) || n <= 0) return
    addReps(selected, n)
    setCustom('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">
          Fit<em>Game</em>
        </h1>
        <p className="tagline">Log reps. Climb ranks.</p>
      </header>

      <section className="picker" aria-label="Exercises">
        {EXERCISES.map((ex) => {
          const r = rankForCount(counts[ex.id])
          return (
            <button
              key={ex.id}
              type="button"
              className={`ex-btn${selected === ex.id ? ' selected' : ''}`}
              onClick={() => setSelected(ex.id)}
            >
              <span className="ex-name">{ex.name}</span>
              <span className={`rank-pill rank-${r.rank}`}>{r.label}</span>
              <span className="ex-count">{counts[ex.id].toLocaleString()} reps</span>
            </button>
          )
        })}
      </section>

      <section className="detail" aria-labelledby="detail-title">
        <div className="detail-head">
          <h2 id="detail-title">{selectedExercise.name}</h2>
          <span className={`rank-pill large rank-${progress.rank}`}>{progress.label}</span>
        </div>

        <p className="total">
          <strong>{counts[selected].toLocaleString()}</strong> lifetime reps
        </p>

        <div className="rank-bar-block">
          {progress.next ? (
            <>
              <div className="rank-bar-labels">
                <span>{progress.label}</span>
                <span>{progress.next.label}</span>
              </div>
              <div
                className="rank-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress.percent}
                aria-label={`Progress to ${progress.next.label}`}
              >
                <div className="rank-bar-fill" style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="rank-bar-meta">
                {(progress.next.min - counts[selected]).toLocaleString()} reps to{' '}
                {progress.next.label} ({progress.percent}%)
              </p>
            </>
          ) : (
            <p className="rank-bar-meta maxed">Champion rank — maxed out.</p>
          )}
        </div>

        <div className="add-panel">
          <p className="add-label">Add reps</p>
          <div className="quick-row">
            {QUICK_ADDS.map((n) => (
              <button
                key={n}
                type="button"
                className="btn"
                onClick={() => addReps(selected, n)}
              >
                +{n}
              </button>
            ))}
          </div>
          <form className="custom-row" onSubmit={handleCustomSubmit}>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              aria-label="Custom rep amount"
            />
            <button type="submit" className="btn primary">
              Add
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <button type="button" className="reset" onClick={resetAll}>
          Reset all counts
        </button>
      </footer>
    </div>
  )
}
