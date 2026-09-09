import { useEffect } from 'react'
import { useGameStore } from './useGameStore'
import { GAME_STATUS } from '../types'

export function useGameTimer() {
  const status = useGameStore((state) => state.status)
  const tick = useGameStore((state) => state.actions.tick)

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [status, tick])
}
