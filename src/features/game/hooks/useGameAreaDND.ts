import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { CellDropData, Position, TileDragData } from '../types'
import { useGameStore } from '../hooks/useGameStore'
import { positionToKey } from '../engine/board'

type DragOverHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>['onDragOver']
>

type DragEndHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>['onDragEnd']
>

export function useGameAreaDND() {
  const board = useGameStore((state) => state.board)
  const { placeTile, returnTile, swapTiles } = useGameStore(
    (state) => state.actions,
  )

  const [activeDragPosition, setActiveDragPosition] = useState<Position | null>(
    null,
  )

  /**
   * Tracks which board cell the dragged tile is currently hovering over (setActiveDragPosition).
   * When the pointer is no longer over a valid cell, the active position is cleared (null).
   */
  const handleDragOver = useCallback<DragOverHandler>((event) => {
    const droptargetData = event.operation.target?.data as
      | CellDropData
      | undefined

    setActiveDragPosition(
      droptargetData?.type === 'cell' ? droptargetData.position : null,
    )
  }, [])

  /**
   * Handles the result of a completed tile drag.
   *
   * A tile dragged from the board is moved to an empty cell or swapped
   * with the tile already occupying the target cell.
   *
   * If a board tile is dropped outside the board, it is returned to the
   * hand. A cancelled drag does not change the board.
   */
  const handleDragEnd = useCallback<DragEndHandler>(
    (event) => {
      setActiveDragPosition(null)

      if (event.canceled) return

      const draggablesourceData = event.operation.source?.data as
        | TileDragData
        | undefined

      const droptargetData = event.operation.target?.data as
        | CellDropData
        | undefined

      if (!draggablesourceData) return

      if (!droptargetData || droptargetData.type !== 'cell') {
        // Dropped outside the grid: if it came from the board, send it home.
        if (
          draggablesourceData.source === 'board' &&
          draggablesourceData.position
        ) {
          returnTile(draggablesourceData.position)
        }
        return
      }

      // Swap the tiles if you place one tile on top of another.
      const targetTile = board[positionToKey(droptargetData.position)]
      if (
        draggablesourceData.source === 'board' &&
        draggablesourceData.position &&
        targetTile
      ) {
        swapTiles(draggablesourceData.position, droptargetData.position)
        return
      }

      placeTile(
        draggablesourceData.tileId,
        draggablesourceData.letter,
        droptargetData.position,
        draggablesourceData.source,
        draggablesourceData.position,
      )
    },
    [placeTile, returnTile, board, swapTiles],
  )

  return {
    activeDragPosition,
    handleDragOver,
    handleDragEnd,
  }
}
