import { useDraggable } from '@dnd-kit/react'
import type { Position, TileDragData } from '../../types.ts'

type DraggableTileProps = {
  id: string
  letter: string
  source: 'hand' | 'board' // tells where the dragging begins
  position?: Position // the position in the board (if placed)
}

/**
 * The actual draggable tile in the game. A position / drop area where
 * the board tile is dropped is called BoardCell.
 */
export function BoardTile({
  id,
  letter,
  source,
  position,
}: DraggableTileProps) {
  const data: TileDragData = {
    type: 'tile',
    tileId: id,
    letter,
    source,
    position,
  }

  const { ref, isDragging } = useDraggable({
    id: `tile:${id}`,
    data,
  })

  return (
    <div
      ref={ref}
      data-tile-handle
      className={[
        'touch-none',
        isDragging ? 'opacity-30' : 'cursor-grab active:cursor-grabbing',
      ].join(' ')}
    >
      <div className='flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-lg font-bold text-amber-900 uppercase shadow ring-1 ring-amber-300 select-none'>
        {letter}
      </div>
    </div>
  )
}
