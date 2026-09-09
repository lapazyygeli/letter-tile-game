import styles from './GameArea.module.css'
import { useCallback, useEffect, useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { GAME_STATUS, type GameResult } from '../types.ts'
import { useGameStore } from '../hooks/useGameStore'
import { GameHeader } from './GameHeader'
import { Sidebar } from './sidebar/Sidebar'
import { Board } from './board/Board'
import { GameEndModal } from './modal/GameEndModal'
import { MenuModal } from '../../../components/MenuModal'
import type { NavLink } from '../../../types/navlink'
import { sensors, useGameAreaDND } from '../hooks/useGameAreaDND.ts'
import { useGameTimer } from '../hooks/useGameTimer.ts'
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll.ts'

const gameAreaMenuModalNavLinks: NavLink[] = [
  {
    title: 'Back to menu',
    to: '/dashboard',
  },
]

type GameAreaProps = {
  onGameEnd?: (result: GameResult) => void
  onBackToMenu: () => void
}

export function GameArea({ onGameEnd, onBackToMenu }: GameAreaProps) {
  const status = useGameStore((state) => state.status)
  const lastResult = useGameStore((state) => state.lastResult)
  const { start, checkWords } = useGameStore((state) => state.actions)
  const {
    activeDragPosition,
    dragSourcePosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  } = useGameAreaDND()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useGameTimer()
  useLockBodyScroll(true)

  useEffect(() => {
    start()
  }, [start])

  const handleCheck = useCallback(
    () => checkWords(onGameEnd),
    [checkWords, onGameEnd],
  )

  if (status === GAME_STATUS.IDLE) {
    return (
      <div className='flex h-full items-center justify-center text-amber-700'>
        Loading dictionary...
      </div>
    )
  }

  return (
    <div className='touch-none'>
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title='Alphabet Ninja'
        links={gameAreaMenuModalNavLinks}
      />

      <div className={`${styles.grid} h-dvh`}>
        <div className={styles.header}>
          <GameHeader
            onCheck={handleCheck}
            onOpenMenu={() => setIsMenuOpen(true)}
          />
        </div>
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.board}>
            <Board
              activeDragPosition={activeDragPosition}
              dragSourcePosition={dragSourcePosition}
            />
          </div>
        </DragDropProvider>
      </div>

      {status === GAME_STATUS.WON && lastResult && (
        <GameEndModal
          result={lastResult}
          onPlayAgain={onBackToMenu}
          onBackToMenu={onBackToMenu}
        />
      )}
    </div>
  )
}
