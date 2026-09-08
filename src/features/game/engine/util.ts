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

type GetBaseCellsOptions = {
  keepStarterCellsAfterFirstTile?: boolean
  // Position to exclude from padding generation - used while a board tile
  // is being dragged, so the halo around its origin cell collapses
  // immediately instead of waiting until the drop completes.
  excludePosition?: Position | null
}

/**
 * Returns the board's base cells that should be rendered based on the board's
 * current state.
 *
 * The returned cells are built from two sources:
 *
 * 1. Starter cells
 *    - On an empty board, starter cells are always included in the beginning.
 *    - When `keepStarterCellsAfterFirstTile` is `true`, starter cells
 *      remain visible even after first tile has been placed on the board.
 *
 * 2. Placed tiles
 *    - For every placed tile, cells within `VISIBLE_PADDING` are included.
 *    - This creates the normal visible padding around the occupied board area.
 *
 * Duplicate cells are removed based on their position key, so a cell that is
 * included by multiple sources is only returned once.
 *
 * @param board - The current board.
 * @param options - Configuration for determining which cells should be rendered.
 * @param options.keepStarterCellsAfterFirstTile - Whether starter cells should
 * remain visible after the first tile has been placed. Defaults to `true`.
 * @param options.excludePosition - Position to exclude from padding generation.
 * @returns An array of unique positions representing all cells that should
 * currently be rendered.
 */
export function getBaseCells(
  board: PlacedTileMap,
  {
    keepStarterCellsAfterFirstTile = true,
    excludePosition = null,
  }: GetBaseCellsOptions = {},
): Position[] {
  const alreadyAddedCellsAsKeys = new Set<string>()
  const cells: Position[] = []

  const addCell = (cell: Position) => {
    const key = positionToKey(cell)
    if (alreadyAddedCellsAsKeys.has(key)) return
    alreadyAddedCellsAsKeys.add(key)
    cells.push(cell)
  }

  const excludeKey = excludePosition ? positionToKey(excludePosition) : null

  // Positions in key format (e.g. "1,2", "-8,5"), excluding the tile
  // currently being dragged (if any) so its padding doesn't linger.
  const occupiedPositions: string[] = Object.keys(board).filter(
    (key) => key !== excludeKey,
  )

  const isBoardEmpty = occupiedPositions.length === 0
  const shouldIncludeStarterCells =
    isBoardEmpty || keepStarterCellsAfterFirstTile

  if (shouldIncludeStarterCells) {
    for (let x = -STARTER_RADIUS; x <= STARTER_RADIUS; x++) {
      for (let y = -STARTER_RADIUS; y <= STARTER_RADIUS; y++) {
        addCell({ x, y })
      }
    }
  }

  for (const occupiedPos of occupiedPositions) {
    const [x, y] = occupiedPos.split(',').map(Number)
    for (let dx = -VISIBLE_PADDING; dx <= VISIBLE_PADDING; dx += 1) {
      for (let dy = -VISIBLE_PADDING; dy <= VISIBLE_PADDING; dy += 1) {
        addCell({ x: x + dx, y: y + dy })
      }
    }
  }

  return cells
}

/**
 * Returns the extra cells that should be revealed around the position of
 * the tile currently being dragged, within `DRAG_REVEAL_RADIUS`.
 *
 * Only ever called on desktop (non-touch) devices - see useGameAreaDND,
 * which never updates activeDragPosition away from `null` on touch, so
 * this function simply never runs there.
 *
 * @param activeDragPosition - The position of the currently dragged tile.
 * @returns An array of positions around the drag position.
 */
export function getDragRevealCells(activeDragPosition: Position): Position[] {
  const cells: Position[] = []

  for (let dx = -DRAG_REVEAL_RADIUS; dx <= DRAG_REVEAL_RADIUS; dx += 1) {
    for (let dy = -DRAG_REVEAL_RADIUS; dy <= DRAG_REVEAL_RADIUS; dy += 1) {
      cells.push({
        x: activeDragPosition.x + dx,
        y: activeDragPosition.y + dy,
      })
    }
  }

  return cells
}

// A single, stable empty array reference so callers that depend on this in
// useMemo deps don't get a fresh array (and thus a fresh cellsToRender)
// every render when there's nothing to reveal.
export const EMPTY_CELLS: Position[] = []

/**
 * Merges two cell lists. Removes duplicates based on their position key
 * (not object identity).
 *
 * @param base - The base cell list
 * @param extra - Additional cells to merge in (e.g. from `getDragRevealCells`).
 * @returns A single array of unique positions.
 */
export function mergeUniqueCells(
  base: Position[],
  extra: Position[],
): Position[] {
  if (extra.length === 0) return base

  const seen = new Set(base.map(positionToKey))
  const merged = [...base]

  for (const cell of extra) {
    const key = positionToKey(cell)

    if (seen.has(key)) continue

    seen.add(key)
    merged.push(cell)
  }

  return merged
}
