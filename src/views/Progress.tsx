import { ACHIEVEMENTS } from '../data/quests'

type Props = {
  level: number
  into: number
  need: number
  totalXp: number
  streak: number
  questsCompleted: number
  unlockedAchievements: string[]
  onReset: () => void
}

export function Progress({
  level,
  into,
  need,
  totalXp,
  streak,
  questsCompleted,
  unlockedAchievements,
  onReset,
}: Props) {
  const pct = Math.min(100, Math.round((into / need) * 100))

  return (
    <div className="section">
      <div className="section-head">
        <h1>Your progress</h1>
        <p>Levels, streaks, and unlocks from quests you clear in FitGame.</p>
      </div>

      <div className="player-strip">
        <div className="level-block">
          <h3>Level {level}</h3>
          <div className="muted">
            {into} / {need} XP · {totalXp} lifetime
          </div>
          <div className="xp-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="stat-row">
          <div className="stat">
            <strong>{streak}</strong>
            <span>Day streak</span>
          </div>
          <div className="stat">
            <strong>{questsCompleted}</strong>
            <span>Quests cleared</span>
          </div>
          <div className="stat">
            <strong>{unlockedAchievements.length}</strong>
            <span>Achievements</span>
          </div>
        </div>
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          margin: '0 0 1rem',
          fontSize: '1.4rem',
        }}
      >
        Achievements
      </h2>
      <div className="achieve-grid">
        {ACHIEVEMENTS.map((a, i) => {
          const unlocked = unlockedAchievements.includes(a.id)
          return (
            <div
              key={a.id}
              className={`achieve${unlocked ? ' unlocked' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="achieve-icon" aria-hidden>
                {unlocked ? '✓' : '·'}
              </div>
              <div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <button type="button" className="btn btn-danger" onClick={onReset}>
          Reset local progress
        </button>
      </div>
    </div>
  )
}
