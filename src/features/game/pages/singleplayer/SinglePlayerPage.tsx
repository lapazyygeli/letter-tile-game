import { useNavigate } from 'react-router'
import { GameArea } from '../../components/GameArea'

export function SinglePlayerPage() {
  const navigate = useNavigate()

  return (
    <GameArea
      onBackToMenu={() => navigate('/dashboard')}
      onGameEnd={(_result) => {}}
    />
  )
}
