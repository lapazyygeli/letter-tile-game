import { useNavigate, useRouteLoaderData } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { GameArea } from '../../components/GameArea'
import { saveGameStats } from '../../../../api/game-stats'
import type { PlayerAreaLoaderData } from '../../../../routes'
import type { GameResult } from '../../types'

export function SinglePlayerPage() {
  const navigate = useNavigate()
  const { isGuest } = useRouteLoaderData('app-area') as PlayerAreaLoaderData

  const saveStatsMutation = useMutation({
    mutationFn: saveGameStats,
  })

  const handleGameEnd = (result: GameResult) => {
    // Guests have no account to attach stats to and the backend would
    // reject this anyway (no access token). Skip the doomed request.
    if (isGuest) return
    saveStatsMutation.mutate(result)
  }

  return (
    <GameArea
      onBackToMenu={() => navigate('/dashboard')}
      onGameEnd={handleGameEnd}
    />
  )
}
