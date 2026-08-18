import type { LetterTile } from '../../types.ts'
import { BoardTile } from './BoardTile'

type TileCountProps = {
  count: number
}

function TileCount({ count }: TileCountProps) {
  if (count <= 3) return null

  return (
    <span className='pointer-events-none absolute -top-2 -right-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-xs font-bold text-white'>
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
          className='absolute flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-lg font-bold text-amber-900 uppercase shadow ring-1 ring-amber-300'
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
          className='flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-lg font-bold text-amber-900 uppercase ring-2 ring-amber-500'
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
export function TileStack({
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
