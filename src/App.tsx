import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteNav } from './components/SiteNav'
import { UnlockToast } from './components/UnlockToast'
import { useGameState } from './hooks/useGameState'
import { Home } from './views/Home'
import { Progress } from './views/Progress'
import { Quests } from './views/Quests'
import { Workout } from './views/Workout'

export default function App() {
  const { state, levelInfo, justUnlocked, completeQuest, dismissUnlocks, resetProgress } =
    useGameState()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <SiteNav level={levelInfo.level} totalXp={state.totalXp} streak={state.streak} />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home level={levelInfo.level} streak={state.streak} />}
            />
            <Route
              path="/quests"
              element={
                <Quests
                  level={levelInfo.level}
                  into={levelInfo.into}
                  need={levelInfo.need}
                  totalXp={state.totalXp}
                  streak={state.streak}
                  questsCompleted={state.questsCompleted}
                  completedQuestIds={state.completedQuestIds}
                />
              }
            />
            <Route
              path="/progress"
              element={
                <Progress
                  level={levelInfo.level}
                  into={levelInfo.into}
                  need={levelInfo.need}
                  totalXp={state.totalXp}
                  streak={state.streak}
                  questsCompleted={state.questsCompleted}
                  unlockedAchievements={state.unlockedAchievements}
                  onReset={resetProgress}
                />
              }
            />
            <Route path="/workout/:questId" element={<Workout onComplete={completeQuest} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <p className="footer-note">FitGame frontend · React · progress stored locally</p>
        <UnlockToast ids={justUnlocked} onDismiss={dismissUnlocks} />
      </div>
    </BrowserRouter>
  )
}
