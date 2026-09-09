import { useMemo } from 'react'
import type { PlacedTileMap, Position } from '../types'
import {
  EMPTY_CELLS,
  getBaseCells,
  getDragRevealCells,
  mergeUniqueCells,
} from '../engine/util'

type UseCellsToRenderArgs = {
  board: PlacedTileMap
  // If none of the tiles are dragged this is null.
  // Position of the currently dragged tile in the board.
  activeDragPosition: Position | null
  // Origin position of the tile currently being dragged from the board or
  // null if the drag started from the hand (or no drag is active).
  dragSourcePosition?: Position | null
  keepStarterCellsAfterFirstTile?: boolean
  includeDragRevealCells?: boolean
}

/**
 * Returns the board cells that should currently be rendered. Combines the
 * board's base cells with extra cells revealed by an active drag.
 *
 * @param args.board - The current board.
 * @param args.activeDragPosition - The position of the currently dragged
 * tile, or `null` when no tile is being dragged (always null on touch).
 * @returns An array of unique positions representing all cells that should
 * currently be rendered.
 */
export function useCellsToRender({
  board,
  activeDragPosition,
  dragSourcePosition = null,
  keepStarterCellsAfterFirstTile = true,
  includeDragRevealCells = true,
}: UseCellsToRenderArgs): Position[] {
  const baseCells = useMemo(
    () =>
      getBaseCells(board, {
        keepStarterCellsAfterFirstTile,
        excludePosition: dragSourcePosition,
      }),
    [board, keepStarterCellsAfterFirstTile, dragSourcePosition],
  )

  // On touch, activeDragPosition never changes from null (see
  // useGameAreaDND), so this stays EMPTY_CELLS and never re-runs during a
  // drag. On desktop it recomputes on hover, restoring the original reveal
  // behaviour there.
  const revealCells = useMemo(() => {
    if (!includeDragRevealCells || !activeDragPosition) {
      return EMPTY_CELLS
    }

    return getDragRevealCells(activeDragPosition)
  }, [includeDragRevealCells, activeDragPosition])

  return useMemo(
    () => mergeUniqueCells(baseCells, revealCells),
    [baseCells, revealCells],
  )
}
