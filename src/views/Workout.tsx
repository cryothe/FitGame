import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QUESTS, type Quest } from '../data/quests'

type Props = {
  onComplete: (quest: Quest) => void
}

export function Workout({ onComplete }: Props) {
  const { questId } = useParams()
  const navigate = useNavigate()
  const quest = useMemo(() => QUESTS.find((q) => q.id === questId), [questId])

  const [step, setStep] = useState(0)
  const [finished, setFinished] = useState(false)
  const [awarded, setAwarded] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const exercise = quest?.exercises[step]

  useEffect(() => {
    if (!exercise?.durationSec) {
      setTimerRunning(false)
      setSecondsLeft(0)
      return
    }
    setSecondsLeft(exercise.durationSec)
    setTimerRunning(false)
  }, [exercise])

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id)
          setTimerRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, secondsLeft])

  if (!quest) {
    return (
      <div className="workout">
        <h1>Quest not found</h1>
        <p style={{ color: 'var(--muted)' }}>That mission isn&apos;t on the board.</p>
        <Link className="btn btn-primary" to="/quests">
          Back to quests
        </Link>
      </div>
    )
  }

  const total = quest.exercises.length
  const isTimed = Boolean(exercise?.durationSec)

  function advance() {
    if (!quest) return
    if (step >= total - 1) {
      setFinished(true)
      if (!awarded) {
        onComplete(quest)
        setAwarded(true)
      }
      return
    }
    setStep((s) => s + 1)
  }

  if (finished) {
    return (
      <div className="workout">
        <div className="complete-panel">
          <h2>Quest cleared</h2>
          <div className="xp-gain">+{quest.xp} XP</div>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {quest.title} is in the books. Keep the streak alive tomorrow.
          </p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/quests">
              More quests
            </Link>
            <Link className="btn btn-ghost" to="/progress">
              View progress
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="workout">
      <div className="workout-top">
        <div>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/quests')} style={{ padding: '0.4rem 0.8rem', marginBottom: '0.75rem' }}>
            ← Exit
          </button>
          <h1>{quest.title}</h1>
        </div>
        <div className="progress-ring-label">
          {step + 1} / {total}
        </div>
      </div>

      <div className="exercise-stage" key={exercise?.id}>
        <div className="exercise-index">Move {step + 1}</div>
        <h2 className="exercise-name">{exercise?.name}</h2>
        <p className="exercise-target">
          {isTimed ? `${exercise?.durationSec}s hold / work` : `${exercise?.reps} reps`}
        </p>
        <p className="exercise-cue">{exercise?.cue}</p>

        {isTimed && (
          <div className="timer" aria-live="polite">
            {secondsLeft}
          </div>
        )}

        <div className="workout-actions">
          {isTimed && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setTimerRunning((r) => !r)}
              disabled={secondsLeft === 0}
            >
              {timerRunning ? 'Pause' : secondsLeft === exercise?.durationSec ? 'Start timer' : 'Resume'}
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={advance}>
            {step >= total - 1 ? 'Finish quest' : 'Next move'}
          </button>
        </div>
      </div>

      <div className="step-dots" aria-hidden>
        {quest.exercises.map((ex, i) => (
          <span
            key={ex.id}
            className={i < step ? 'done' : i === step ? 'current' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
