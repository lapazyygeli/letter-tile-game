import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { CellDropData, Position, TileDragData } from '../types'
import { useGameStore } from '../hooks/useGameStore'
import { positionToKey } from '../engine/board'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'
import { useIsCoarsePointer } from './useIsCoarsePointer'

type Sensors = NonNullable<ComponentProps<typeof DragDropProvider>['sensors']>

type DragStartHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>['onDragStart']
>

type DragOverHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>['onDragOver']
>

type DragEndHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>['onDragEnd']
>

function samePosition(a: Position | null, b: Position | null): boolean {
  if (a === b) return true
  if (!a || !b) return false

  return a.x === b.x && a.y === b.y
}

export function useGameAreaDND() {
  const board = useGameStore((state) => state.board)
  const { placeTile, returnTile, swapTiles } = useGameStore(
    (state) => state.actions,
  )
  const isCoarsePointer = useIsCoarsePointer()

  const [activeDragPosition, setActiveDragPosition] = useState<Position | null>(
    null,
  )

  const [dragSourcePosition, setDragSourcePosition] = useState<Position | null>(
    null,
  )

  const handleDragStart = useCallback<DragStartHandler>((event) => {
    const sourceData = event.operation.source?.data as TileDragData | undefined

    setDragSourcePosition(
      sourceData?.source === 'board' && sourceData.position
        ? sourceData.position
        : null,
    )
  }, [])

  /**
   * Tracks which board cell the dragged tile is currently hovering over (setActiveDragPosition).
   * When the pointer is no longer over a valid cell, the active position is cleared (null).
   *
   */
  const handleDragOver = useCallback<DragOverHandler>(
    (event) => {
      if (isCoarsePointer) return

      const droptargetData = event.operation.target?.data as
        | CellDropData
        | undefined

      const next =
        droptargetData?.type === 'cell' ? droptargetData.position : null

      setActiveDragPosition((prev) => (samePosition(prev, next) ? prev : next))
    },
    [isCoarsePointer],
  )

  /**
   * Handles the result of a completed tile drag. A tile dragged from the board
   * is moved to an empty cell or swapped with the tile already occupying the
   * target cell. If a board tile is dropped outside the board, it is returned
   * to the hand. A cancelled drag does not change the board.
   */
  const handleDragEnd = useCallback<DragEndHandler>(
    (event) => {
      setActiveDragPosition(null)
      setDragSourcePosition(null)

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
    dragSourcePosition,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}

export const sensors: Sensors = (defaults) => [
  ...defaults.filter((sensor) => sensor !== PointerSensor),
  PointerSensor.configure({
    activationConstraints: (event) => {
      if (event.pointerType === 'touch') {
        return [new PointerActivationConstraints.Distance({ value: 6 })]
      }

      // mouse / pen
      return [new PointerActivationConstraints.Distance({ value: 8 })]
    },
  }),
]
