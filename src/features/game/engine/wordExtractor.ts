import type { PlacedTileMap, Position } from '../types.ts'
import { getTileAt, positionToKey } from './board.ts'

export type LetterSequence = {
  // can include a single letter as a "word"
  word: string
  // cells: position for each letter of the word
  // cells[i] is the position of word[i]
  cells: Position[]
}

export type ExtractedSequences = {
  words: LetterSequence[]
  singleLetters: LetterSequence[]
}

type Axis = 'x' | 'y'

/**
 * Finds the complete letter sequence passing through a given board position
 * along the specified axis.
 *
 * The function first walks backward from `origin` until it reaches the first
 * tile in the sequence. It then walks forward from that starting position,
 * collecting each tile's letter and position until there are no more tiles.
 *
 * The returned LetterSequence's `word` and `cells` arrays are kept in the same order:
 * `cells[i]` is always the position of `word[i]`.
 *
 * The function can also return a single-letter sequence when the origin tile has
 * no adjacent tile on the given axis.
 *
 * @param board - The board containing the placed tiles.
 * @param origin - A position belonging to the sequence to find.
 * @param axis - The direction in which to find the sequence:
 * @returns The complete letter sequence and the positions of its letters.
 */
function getSequenceThrough(
  board: PlacedTileMap,
  origin: Position,
  axis: Axis,
): LetterSequence {
  // Reminder: the coordinate systems goes from left to right with negatives to positives,
  // and from top to bottom with negative to positives
  const backward = axis === 'x' ? { x: -1, y: 0 } : { x: 0, y: -1 }
  const forward = axis === 'x' ? { x: 1, y: 0 } : { x: 0, y: 1 }

  // Always roll back to the starting position of the sequence
  // before collecting letter or letters.
  let head = origin
  while (
    getTileAt(board, {
      x: head.x + backward.x,
      y: head.y + backward.y,
    })
  ) {
    head = { x: head.x + backward.x, y: head.y + backward.y }
  }

  const cells: Position[] = []
  let word = ''
  let cursor = head

  // From the starting position and forward collect all
  // separate letters (or just one letter) and their positions
  while (true) {
    const tile = getTileAt(board, cursor)
    if (!tile) break
    word += tile.letter
    cells.push(cursor)
    cursor = { x: cursor.x + forward.x, y: cursor.y + forward.y }
  }

  return { word, cells }
}

/**
 * Extracts all distinct horizontal and vertical letter sequences from the
 * current board.
 *
 * Every placed tile is used as an origin and checked along both axes (from left to
 * right and from top to bottom).
 * Because the same sequence can be discovered multiple times from different
 * tiles, each sequence is identified by its axis and starting position and
 * processed only once. So we get only unique letter sequences and their unique poss.
 *
 * Sequences containing two or more letters are returned in `words`.
 * Sequences containing exactly one letter are returned separately in
 * `singleLetters`.
 *
 * @param board - The board containing the placed tiles.
 * @returns An object containing all distinct multi-letter sequences in
 * `words` and all single-letter sequences in `singleLetters`.
 */
export function extractSequences(board: PlacedTileMap): ExtractedSequences {
  const processedSequenceStartingPoints = new Set<string>()
  const words: LetterSequence[] = []
  const singleLetters: LetterSequence[] = []

  for (const key of Object.keys(board)) {
    const position = {
      x: Number(key.split(',')[0]),
      y: Number(key.split(',')[1]),
    }

    const horizontalSequence = getSequenceThrough(board, position, 'x')
    const verticalSequence = getSequenceThrough(board, position, 'y')

    for (const [axis, sequence] of [
      ['x', horizontalSequence],
      ['y', verticalSequence],
    ] as const) {
      // Check if letter sequence is already added by checking its
      // starting pos. If yes, don't add it twice (or more times)
      const sequenceKey = `${axis}:${positionToKey(sequence.cells[0])}`
      if (processedSequenceStartingPoints.has(sequenceKey)) continue

      processedSequenceStartingPoints.add(sequenceKey)

      if (sequence.word.length >= 2) {
        words.push(sequence)
      }
    }

    if (
      horizontalSequence.word.length === 1 &&
      verticalSequence.word.length === 1
    ) {
      singleLetters.push(horizontalSequence)
    }
  }

  return {
    words,
    singleLetters,
  }
}
