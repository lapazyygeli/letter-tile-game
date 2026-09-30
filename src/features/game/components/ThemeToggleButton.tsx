import SunIcon from '../../../assets/icons/sun.svg?react'
import MoonIcon from '../../../assets/icons/moon.svg?react'
import type { GameAreaTheme } from '../hooks/useGameAreaTheme'

type ThemeToggleButtonProps = {
  theme: GameAreaTheme
  onToggle: () => void
}

export function ThemeToggleButton({ theme, onToggle }: ThemeToggleButtonProps) {
  const label = theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'

  return (
    <button
      type='button'
      onClick={onToggle}
      title={label}
      aria-label={label}
      className='bg-gamearea-change-btn text-gamearea-change-btn-text flex h-9 w-9 cursor-pointer items-center justify-center rounded-md'
    >
      {theme === 'dark' ? (
        <SunIcon className='h-5 w-5' />
      ) : (
        <MoonIcon className='h-5 w-5' />
      )}
    </button>
  )
}
