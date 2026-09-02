import {
  DRAG_REVEAL_RADIUS,
  STARTER_RADIUS,
  VISIBLE_PADDING,
} from '../constants'
import type { LetterTile, PlacedTileMap, Position } from '../types'
import { isConnected, positionToKey } from './board'
import { isValidWord } from './dictionary'
import { extractSequences, type LetterSequence } from './wordExtractor'

/**
 * Return the board cells that should be marked as invalid.
 *
 * A single-letter sequence is always invalid because it does not form a word.
 * For multi-letter sequences, all cells belonging to a word that is not found
 * in the dictionary are returned.
 */
export function getInvalidCells(
  dictionary: Set<string>,
  words: LetterSequence[],
  singleLetters: LetterSequence[],
): Position[] {
  const invalidWords = words.filter(
    ({ word }) => !isValidWord(dictionary, word),
  )

  return [
    ...singleLetters.flatMap(({ cells }) => cells),
    ...invalidWords.flatMap(({ cells }) => cells),
  ]
}

type BoardEvaluation =
  | {
      outcome: 'won'
      words: LetterSequence[]
    }
  | {
      outcome: 'invalid'
      invalidCells: Position[]
    }
  | {
      outcome: 'not-won'
    }

/**
 * Evaluate the current board and determine whether the game has been won,
 * contains invalid cells, or is still in progress.
 *
 * A board is considered winning when:
 * - there are no invalid cells
 * - the player's hand is empty
 * - at least one word has been formed
 * - all placed tiles are connected
 */
export function evaluateBoard(
  board: PlacedTileMap,
  hand: LetterTile[],
  dictionary: Set<string>,
): BoardEvaluation {
  const { words, singleLetters } = extractSequences(board)

  const invalidCells = getInvalidCells(dictionary, words, singleLetters)

  const isWinningBoard =
    invalidCells.length === 0 &&
    hand.length === 0 &&
    words.length > 0 &&
    isConnected(board)

  if (isWinningBoard) {
    return {
      outcome: 'won',
      words,
    }
  }

  if (invalidCells.length > 0) {
    return {
      outcome: 'invalid',
      invalidCells,
    }
  }

  return {
    outcome: 'not-won',
  }
}

type GetCellsToRenderArgs = {
  board: PlacedTileMap
  keepStarterCellsAfterFirstTile?: boolean
  includeDragRevealCells?: boolean
  activeDragPosition: Position | null
  // If none of the tiles are dragged this is null
  // Position of the currently dragged tile in the board
}

/**
 * Returns the board cells that should currently be rendered.
 *
 * The returned cells are built from three possible sources:
 *
 * 1. Starter cells
 *    - On an empty board, starter cells are always included.
 *    - When `keepStarterCellsAfterFirstTile` is `true`, starter cells
 *      remain visible even after tiles have been placed on the board.
 *
 * 2. Placed tiles
 *    - For every placed tile, cells within `VISIBLE_PADDING` are included.
 *    - This creates the normal visible padding around the occupied board area.
 *
 * 3. Drag reveal cells
 *    - When `includeDragRevealCells` is `true` and a tile is being dragged,
 *      cells within `DRAG_REVEAL_RADIUS` of the dragged tile are included.
 *    - `activeDragPosition` is `null` when no tile is currently being dragged.
 *
 * Duplicate cells are removed based on their position key, so a cell that is
 * included by multiple sources is only returned once.
 *
 * @param args - Configuration for determining which cells should be rendered.
 * @param args.board - The current board data
 * @param args.keepStarterCellsAfterFirstTile - Whether starter cells should
 * remain visible after the first tile has been placed. Defaults to `true`.
 * @param args.includeDragRevealCells - Whether to include additional cells
 * around the currently dragged tile. Defaults to `true`.
 * @param args.activeDragPosition - The position of the currently dragged tile,
 * or `null` when no tile is being dragged.
 * @returns An array of unique positions representing all cells that should
 * currently be rendered.
 */
export function getCellsToRender({
  board,
  keepStarterCellsAfterFirstTile = true,
  includeDragRevealCells = true,
  activeDragPosition,
}: GetCellsToRenderArgs): Position[] {
  const alreadyRenderedCellsAsKeys = new Set<string>()
  const cellsToRender: Position[] = []
  const addToCellsToRender = (cell: Position) => {
    const key = positionToKey(cell)
    if (alreadyRenderedCellsAsKeys.has(key)) return
    alreadyRenderedCellsAsKeys.add(key)
    cellsToRender.push(cell)
  }

  // This adds starter cells only on an empty board or
  // shows them always (if shouldIncludeStarterCells = true)
  // Positions in key format (e.g. "1,2", "-8,5")
  const occupiedPositions: string[] = Object.keys(board)
  const isBoardEmpty = occupiedPositions.length === 0
  const shouldIncludeStarterCells =
    isBoardEmpty || keepStarterCellsAfterFirstTile
  if (shouldIncludeStarterCells) {
    for (let x = -STARTER_RADIUS; x <= STARTER_RADIUS; x++) {
      for (let y = -STARTER_RADIUS; y <= STARTER_RADIUS; y++) {
        addToCellsToRender({ x, y })
      }
    }
  }

  // This defines the padding cells based on placed tiles (if we have any).
  // For each placed tile adds new tiles based on VISIBLE_PADDING
  for (const occupiedPos of occupiedPositions) {
    const [x, y] = occupiedPos.split(',').map(Number)
    for (let dx = -VISIBLE_PADDING; dx <= VISIBLE_PADDING; dx += 1) {
      for (let dy = -VISIBLE_PADDING; dy <= VISIBLE_PADDING; dy += 1) {
        addToCellsToRender({ x: x + dx, y: y + dy })
      }
    }
  }

  if (includeDragRevealCells && activeDragPosition) {
    for (let dx = -DRAG_REVEAL_RADIUS; dx <= DRAG_REVEAL_RADIUS; dx += 1) {
      for (let dy = -DRAG_REVEAL_RADIUS; dy <= DRAG_REVEAL_RADIUS; dy += 1) {
        addToCellsToRender({
          x: activeDragPosition.x + dx,
          y: activeDragPosition.y + dy,
        })
      }
    }
  }

  return cellsToRender
}
