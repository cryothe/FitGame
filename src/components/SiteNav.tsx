import { NavLink } from 'react-router-dom'

type Props = {
  level: number
  totalXp: number
  streak: number
}

export function SiteNav({ level, totalXp, streak }: Props) {
  return (
    <header className="site-nav">
      <NavLink to="/" className="brand-mark" end>
        <span aria-hidden />
        FitGame
      </NavLink>
      <nav className="nav-links" aria-label="Primary">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/quests">Quests</NavLink>
        <NavLink to="/progress">Progress</NavLink>
      </nav>
      <div className="nav-meta" aria-label="Player stats">
        <span className="xp-chip">Lv {level}</span>
        <span>{totalXp} XP</span>
        <span>{streak} day streak</span>
      </div>
    </header>
  )
}
