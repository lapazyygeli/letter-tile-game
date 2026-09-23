import type { GameAreaTheme } from '../hooks/useGameAreaTheme'
import { useGameStore } from '../hooks/useGameStore'
import { ThemeToggleButton } from './ThemeToggleButton'

type GameHeaderProps = {
  onCheck: () => void
  onOpenMenu: () => void
  theme: GameAreaTheme
  onToggleTheme: () => void
}

export function GameHeader({
  onCheck,
  onOpenMenu,
  theme,
  onToggleTheme,
}: GameHeaderProps) {
  const elapsedSeconds = useGameStore((state) => state.elapsedSeconds)

  return (
    <header className='border-gamearea-border bg-gamearea-bg flex h-full items-center justify-between border-b px-4'>
      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onOpenMenu}
          className='text-gamearea-header-text cursor-pointer text-xl'
        >
          ☰
        </button>
        <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />
      </div>

      <span className='text-gamearea-header-text font-mono text-[15px] min-[350px]:text-[16px] sm:text-lg'>
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
