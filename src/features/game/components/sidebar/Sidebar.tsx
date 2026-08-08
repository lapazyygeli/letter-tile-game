import { useMemo, useState } from 'react'
import type { LetterTile } from '../../types.ts'
import { MIN_TILES_TO_EXCHANGE } from '../../constants.ts'
import { TileStack } from './TileStack'
// TODO: correct type defs

type OpenSidebarProps = {
  hand: LetterTile[]
  bagCount: number
  groups: [string, LetterTile[]][]
  canExchange: boolean
  exchangeMode: boolean
  setExchangeMode: React.Dispatch<React.SetStateAction<boolean>>
  onExchange: (tileId: string) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function OpenSidebar({
  hand,
  bagCount,
  groups,
  canExchange,
  exchangeMode,
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
              exchangeMode
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

      {exchangeMode && (
        <p className='border-b border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700'>
          Tap a letter to replace it with three{' '}
          <br className='hidden md:inline' />
          new ones.
        </p>
      )}

      <div className='flex flex-wrap gap-3 p-3 md:grid md:auto-rows-min md:grid-cols-4 md:place-items-center md:gap-3'>
        {groups.map(([letter, tiles]) => (
          <TileStack
            key={letter}
            letter={letter}
            tiles={tiles}
            exchangeMode={exchangeMode}
            onExchange={(tileId) => {
              onExchange(tileId)
              setExchangeMode(false)
            }}
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

type SidebarProps = {
  hand: LetterTile[]
  bagCount: number
  onExchange: (tileId: string) => void
}

export function Sidebar({ hand, bagCount, onExchange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [exchangeMode, setExchangeMode] = useState(false)
  const groups = useGroupedHand(hand)
  const canExchange = bagCount >= MIN_TILES_TO_EXCHANGE

  return (
    <aside className={`h-full border-t border-r border-amber-200 bg-white`}>
      {isOpen ? (
        <OpenSidebar
          hand={hand}
          bagCount={bagCount}
          canExchange={canExchange}
          exchangeMode={exchangeMode}
          groups={groups}
          onExchange={onExchange}
          setExchangeMode={setExchangeMode}
          setIsOpen={setIsOpen}
        />
      ) : (
        <ClosedSidebar hand={hand} setIsOpen={setIsOpen} />
      )}
    </aside>
  )
}

function useGroupedHand(hand: LetterTile[]): [string, LetterTile[]][] {
  return useMemo(() => {
    const map = new Map<string, LetterTile[]>()
    for (const tile of hand) {
      const group = map.get(tile.letter) ?? []
      group.push(tile)
      map.set(tile.letter, group)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [hand])
}
