import { Link } from 'react-router-dom'

type Props = {
  level: number
  streak: number
}

export function Home({ level, streak }: Props) {
  return (
    <section className="hero" aria-label="FitGame hero">
      <div className="hero-visual" aria-hidden />
      <div className="hero-copy">
        <h1 className="hero-brand">
          Fit<em>Game</em>
        </h1>
        <p className="hero-lead">
          Turn every session into a quest. Earn XP, protect your streak, and climb the board —
          one clear at a time.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/quests">
            Start today&apos;s quest
          </Link>
          <Link className="btn btn-ghost" to="/progress">
            Level {level} · {streak} day streak
          </Link>
        </div>
      </div>
    </section>
  )
}
