import { useDroppable } from '@dnd-kit/react'
import { CELL_SIZE } from '../../constants'
import type { CellDropData, PlacedTile, Position } from '../../types'
import { BoardTile } from '../sidebar/BoardTile'
import { memo } from 'react'

type BoardCellProps = {
  pos: Position
  tile?: PlacedTile // placed tile in the boardcell. if doesn't exists, it doesn't render it
  isInvalid: boolean // is the letter part of a whole word and is the word correct/existing?
}
/**
 * BoardCell is a component where draggable `BoardTile`s from the sidebar can be placed.
 * About styling: BoardCells are positioned relative to the coordinate system's origin.
 * Because a BoardCell's width and height are CELL_SIZE, its starting
 * position has to take this into account: pos.x * CELL_SIZE and pos.y * CELL_SIZE.
 * The -CELL_SIZE / 2 offset moves the BoardCell's top-left corner half a cell up
 * and left, so that (pos.x, pos.y) specifies the center point of the BoardCell.
 *
 * The coordinate system works so that:
 * - the horizontal axis goes from left to right, from negative to positive
 * - the vertical axis goes from top to bottom, from negative to positive
 *
 */

function BoardCellImpl({ pos, tile, isInvalid }: BoardCellProps) {
  const data: CellDropData = { type: 'cell', position: pos }

  const { isDropTarget, ref } = useDroppable({
    id: `cell:${pos.x},${pos.y}`,
    data,
  })

  return (
    <div
      ref={ref}
      className={[
        'border-gamearea-board absolute flex items-center justify-center border text-red-700 transition-colors',
        isDropTarget ? 'bg-drag-hover' : 'bg-transparent',
        isInvalid ? 'bg-red-50/60 ring-2 ring-red-500 ring-inset' : '',
      ].join(' ')}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        left: pos.x * CELL_SIZE - CELL_SIZE / 2,
        top: pos.y * CELL_SIZE - CELL_SIZE / 2,
      }}
    >
      {tile && (
        <BoardTile
          key={tile.id}
          id={tile.id}
          letter={tile.letter}
          source='board'
          position={pos}
        />
      )}
    </div>
  )
}

function areEqual(prev: BoardCellProps, next: BoardCellProps): boolean {
  return (
    prev.pos.x === next.pos.x &&
    prev.pos.y === next.pos.y &&
    prev.tile === next.tile &&
    prev.isInvalid === next.isInvalid
  )
}

export const BoardCell = memo(BoardCellImpl, areEqual)
