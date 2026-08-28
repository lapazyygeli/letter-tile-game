import { useGameStore } from '../hooks/useGameStore'

type GameHeaderProps = {
  onCheck: () => void
  onOpenMenu: () => void
}

export function GameHeader({ onCheck, onOpenMenu }: GameHeaderProps) {
  const elapsedSeconds = useGameStore((state) => state.elapsedSeconds)

  return (
    <header className='flex h-full items-center justify-between border-b border-amber-200 bg-white px-4'>
      <button
        type='button'
        onClick={onOpenMenu}
        className='cursor-pointer text-xl text-amber-700'
      >
        ☰
      </button>

      <span className='font-mono text-lg text-amber-900'>
        Elapsed time: {formatTime(elapsedSeconds)}
      </span>

      <button
        type='button'
        onClick={onCheck}
        className='cursor-pointer rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white'
      >
        Check
      </button>
    </header>
  )
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
