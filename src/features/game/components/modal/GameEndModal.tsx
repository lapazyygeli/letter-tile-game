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
      <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-xl'>
        <h2 className='text-xl font-bold text-amber-900'>
          {getHeading(result.outcome)}
        </h2>

        <dl className='mt-4 space-y-2 text-sm text-amber-800'>
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
            className='flex-1 cursor-pointer rounded-md bg-amber-700 py-2 text-white'
          >
            Play again
          </button>
          <button
            type='button'
            onClick={onBackToMenu}
            className='flex-1 cursor-pointer rounded-md border border-amber-300 py-2 text-amber-800'
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
