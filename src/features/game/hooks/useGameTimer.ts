import { useEffect } from 'react'
import { GAME_STATUS, useGameStore } from './useGameStore'

export function useGameTimer() {
  const status = useGameStore((state) => state.status)
  const tick = useGameStore((state) => state.actions.tick)

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [status, tick])
}
