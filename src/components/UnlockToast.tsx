import { useEffect } from 'react'
import { ACHIEVEMENTS } from '../data/quests'

type Props = {
  ids: string[]
  onDismiss: () => void
}

export function UnlockToast({ ids, onDismiss }: Props) {
  useEffect(() => {
    if (!ids.length) return
    const t = window.setTimeout(onDismiss, 4200)
    return () => window.clearTimeout(t)
  }, [ids, onDismiss])

  if (!ids.length) return null

  const titles = ids
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.title)
    .filter(Boolean)
    .join(', ')

  return (
    <div className="toast" role="status">
      Achievement unlocked: <strong>{titles}</strong>
    </div>
  )
}
