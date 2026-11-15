import { Link } from 'react-router-dom'
import { QUESTS } from '../data/quests'

type Props = {
  level: number
  into: number
  need: number
  totalXp: number
  streak: number
  questsCompleted: number
  completedQuestIds: string[]
}

export function Quests({
  level,
  into,
  need,
  totalXp,
  streak,
  questsCompleted,
  completedQuestIds,
}: Props) {
  const pct = Math.min(100, Math.round((into / need) * 100))

  return (
    <div className="section">
      <div className="section-head">
        <h1>Today&apos;s quests</h1>
        <p>Pick a mission, clear the moves, bank the XP. Sample data for now — progress stays on this device.</p>
      </div>

      <div className="player-strip">
        <div className="level-block">
          <h3>Level {level}</h3>
          <div className="muted">
            {into} / {need} XP to next level · {totalXp} total
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
        </div>
      </div>

      <div className="quest-list">
        {QUESTS.map((quest) => {
          const done = completedQuestIds.includes(quest.id)
          return (
            <Link
              key={quest.id}
              to={`/workout/${quest.id}`}
              className={`quest-item${done ? ' done' : ''}`}
            >
              <div className="quest-top">
                <span className="quest-tag">{quest.tag}</span>
                <span className={`diff ${quest.difficulty}`}>{quest.difficulty}</span>
              </div>
              <h3>{quest.title}</h3>
              <p>{quest.blurb}</p>
              <div className="quest-foot">
                <span className="xp">+{quest.xp} XP</span>
                <span>{quest.minutes} min · {done ? 'Replay' : 'Start'}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
