import { useCallback, useState } from 'react'
import type { LetterTile } from '../../types.ts'
import { MIN_TILES_TO_EXCHANGE } from '../../constants.ts'
import { TileStack } from './TileStack'
import { useGroupedHand, type LetterGroup } from '../../hooks/useGroupedHand.ts'
import { useGameStore } from '../../hooks/useGameStore.ts'

type OpenSidebarProps = {
  hand: LetterTile[]
  bagCount: number
  groups: LetterGroup[]
  canExchange: boolean
  isExchangeMode: boolean
  setExchangeMode: React.Dispatch<React.SetStateAction<boolean>>
  onExchange: (tileId: string) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function OpenSidebar({
  hand,
  bagCount,
  groups,
  canExchange,
  isExchangeMode,
  setExchangeMode,
  onExchange,
  setIsOpen,
}: OpenSidebarProps) {
  return (
    <div>
      <div className='flex items-center justify-between gap-2 border-b border-amber-100 p-3'>
        <span className='text-sm font-semibold text-amber-900'>
          Letters ({hand.length})
        </span>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setExchangeMode((value) => !value)}
            disabled={!canExchange}
            className={[
              'cursor-pointer rounded-md px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40',
              isExchangeMode
                ? 'bg-amber-700 text-white'
                : 'bg-amber-100 text-amber-800',
            ].join(' ')}
          >
            Change 1→3
          </button>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='cursor-pointer text-amber-700'
          >
            ✕
          </button>
        </div>
      </div>

      {isExchangeMode && (
        <p className='border-b border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700'>
          Tap a letter to replace it with three{' '}
          <br className='hidden md:inline' />
          new ones.
        </p>
      )}

      <div className='flex flex-wrap gap-x-3 gap-y-3 p-3.5 md:grid md:auto-rows-min md:grid-cols-4 md:place-items-center'>
        {groups.map(([letter, tiles]) => (
          <TileStack
            key={letter}
            letter={letter}
            tiles={tiles}
            isExchangeMode={isExchangeMode}
            onExchange={onExchange}
          />
        ))}
      </div>

      <div className='border-t border-amber-100 p-3 text-xs text-amber-700'>
        Remaining in the bag: {bagCount}
      </div>
    </div>
  )
}

type ClosedSidebarProps = {
  hand: LetterTile[]
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ClosedSidebar({ hand, setIsOpen }: ClosedSidebarProps) {
  return (
    <>
      <div className='hidden md:block'>
        <div className='flex justify-end p-2'>
          <button
            type='button'
            onClick={() => setIsOpen(true)}
            className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-amber-100 text-amber-800'
          >
            →
          </button>
        </div>
      </div>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='fixed bottom-4 left-4 z-1 rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-lg md:hidden'
      >
        Letters ({hand.length})
      </button>
    </>
  )
}

// --- MAIN COMPONENT ---
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isExchangeMode, setExchangeMode] = useState(false)

  const { exchangeTile } = useGameStore((state) => state.actions)
  const hand = useGameStore((state) => state.hand)
  const bagCount = useGameStore((state) => state.bag.length)
  const groups = useGroupedHand(hand)
  const canExchange = bagCount >= MIN_TILES_TO_EXCHANGE

  // Stable reference across renders (as long as exchangeTile itself is
  // stable, which it is - zustand actions are defined once in create() and
  // never recreated). Without this, every TileStack would get a "new"
  // onExchange prop on every Sidebar render, and the memo added to
  // TileStack would never bail out.
  const handleExchange = useCallback(
    (tileId: string) => {
      exchangeTile(tileId)
      setExchangeMode(false)
    },
    [exchangeTile],
  )

  return (
    <aside className={`h-full border-t border-r border-amber-200 bg-white`}>
      {isOpen ? (
        <OpenSidebar
          hand={hand}
          bagCount={bagCount}
          canExchange={canExchange}
          isExchangeMode={isExchangeMode}
          groups={groups}
          onExchange={handleExchange}
          setExchangeMode={setExchangeMode}
          setIsOpen={setIsOpen}
        />
      ) : (
        <ClosedSidebar hand={hand} setIsOpen={setIsOpen} />
      )}
    </aside>
  )
}
