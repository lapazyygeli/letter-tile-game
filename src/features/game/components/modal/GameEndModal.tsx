import type { GameResult } from '../../types.ts'

type GameEndModalProps = {
  result: GameResult
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export function GameEndModal({
  result,
  onPlayAgain,
  onBackToMenu,
}: GameEndModalProps) {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-gamearea-endmodal border-gamearea-border w-full max-w-sm rounded-lg border p-6 shadow-xl'>
        <h2 className='text-gamearea-card-text text-xl font-bold'>
          {getHeading(result.outcome)}
        </h2>

        <dl className='text-gamearea-card-text/90 mt-4 space-y-2 text-sm'>
          <Stat label='Time' value={formatDuration(result.durationSeconds)} />
          <Stat
            label='Words formed'
            value={result.wordsFormed.length.toString()}
          />
          <Stat label='Tiles played' value={result.tilesPlaced.toString()} />
        </dl>

        <div className='mt-6 flex gap-3'>
          <button
            type='button'
            onClick={onPlayAgain}
            className='bg-gamearea-board flex-1 cursor-pointer rounded-md py-2 text-white'
          >
            Play again
          </button>
          <button
            type='button'
            onClick={onBackToMenu}
            className='border-gamearea-card-text text-gamearea-card-text flex-1 cursor-pointer rounded-md border py-2'
          >
            Back to menu
          </button>
        </div>
      </div>
    </div>
  )
}

function getHeading(outcome: GameResult['outcome']): string {
  switch (outcome) {
    case 'completed':
      return 'Board complete!'
    case 'won':
      return 'You won!'
    case 'lost':
      return 'Game over'
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between'>
      <dt>{label}</dt>
      <dd className='font-semibold'>{value}</dd>
    </div>
  )
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes} min ${seconds} s`
}
