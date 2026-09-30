import { memo } from 'react'
import type { LetterTile } from '../../types.ts'
import { BoardTile } from './BoardTile'

type TileCountProps = {
  count: number
}

function TileCount({ count }: TileCountProps) {
  if (count <= 3) return null

  return (
    <span className='bg-gamearea-board pointer-events-none absolute -top-2 -right-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white'>
      {count}
    </span>
  )
}

// ------------------------------------------------------------------------

type TileStackShadowsProps = {
  letter: string
  count: number
}

function TileStackShadows({ letter, count }: TileStackShadowsProps) {
  //  All tiles are displayed here except for one, which is draggable.
  //  These here, are shadow tiles and the one draggable is in <TileStackTopTile>
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`shadow-${i}`}
          className='bg-gamearea-card text-gamearea-card-text ring-gamearea-card-border absolute flex h-11 w-11 items-center justify-center rounded-md text-lg font-bold uppercase shadow ring-1'
          style={{
            left: `${i * 2 + 2}px`,
            bottom: `${i * 4 + 4}px`,
            zIndex: count - i,
          }}
        >
          {letter}
        </div>
      ))}
    </>
  )
}

// ------------------------------------------------------------------------

type TileStackTopTileProps = {
  tile: LetterTile
  letter: string
  isExchangeMode: boolean
  onExchange: (tileId: string) => void
}

function TileStackTopTile({
  tile,
  letter,
  isExchangeMode,
  onExchange,
}: TileStackTopTileProps) {
  return (
    <div key={tile.id} className='absolute z-3'>
      {isExchangeMode ? (
        <button
          type='button'
          onClick={() => onExchange(tile.id)}
          className='bg-gamearea-card text-gamearea-card-text ring-gamearea-board flex h-11 w-11 items-center justify-center rounded-md text-lg font-bold uppercase ring-2'
        >
          {letter}
        </button>
      ) : (
        <BoardTile id={tile.id} letter={letter} source='hand' />
      )}
    </div>
  )
}

// ------------------------------------------------------------------------

type TileStackProps = {
  letter: string
  tiles: LetterTile[]
  isExchangeMode: boolean
  onExchange: (tileId: string) => void
}

// -- MAIN COMPONENT --
// -- Pile of tiles for a specific letter --
// BoardTile is the actual draggable element. When it's dragged to its final
// position tiles variable changes and TileStack renders again with new topTile
function TileStackImpl({
  letter,
  tiles,
  isExchangeMode,
  onExchange,
}: TileStackProps) {
  const topTile = tiles[0]
  const shadowTileCount = Math.min(tiles.length, 3) - 1

  return (
    <div className='relative h-11 w-11'>
      <TileStackShadows letter={letter} count={shadowTileCount} />
      <TileStackTopTile
        tile={topTile}
        letter={letter}
        isExchangeMode={isExchangeMode}
        onExchange={onExchange}
      />
      <TileCount count={tiles.length} />
    </div>
  )
}

/**
 * Bails out unless something that actually affects the rendered output
 * changed. `tiles` is compared by reference, not by content: useGroupedHand
 * memoizes its output on the `hand` array reference, so the same letter's
 * tile array keeps the same identity across renders where the hand hasn't
 * changed - reference equality here is both correct and far cheaper than
 * comparing tile ids one by one.
 *
 * `onExchange` must also be a stable reference for this to have any effect
 * - see the corresponding fix in Sidebar.tsx (useCallback instead of an
 * inline arrow function).
 */
function areEqual(prev: TileStackProps, next: TileStackProps): boolean {
  return (
    prev.letter === next.letter &&
    prev.tiles === next.tiles &&
    prev.isExchangeMode === next.isExchangeMode &&
    prev.onExchange === next.onExchange
  )
}

export const TileStack = memo(TileStackImpl, areEqual)
