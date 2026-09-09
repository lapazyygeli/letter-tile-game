import { LETTER_DISTRIBUTION } from '../constants.ts'
import type { LetterTile } from '../types.ts'

/**
 * Create a tile bag to pull tiles from. Is based on LETTER_DISTRIBUTION.
 * Each tile is given a unique id.
 * @returns shuffled tile bag
 */
export function createTileBag(): LetterTile[] {
  const tiles: LetterTile[] = []
  let counter = 0

  for (const [letter, count] of Object.entries(LETTER_DISTRIBUTION)) {
    for (let i = 0; i < count; i += 1) {
      tiles.push({ id: `tile-${letter}-${counter}`, letter })
      counter += 1
    }
  }

  return shuffle(tiles)
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Draw the specified number of tiles (count) from the beginning of the bag.
 * Returns the drawn tiles and the remaining bag separately.
 * Doesn't mean drawing on a screen, but rather pulling from the bag.
 * @param bag - The tile bag to draw tiles from. Bag = all possible tiles.
 * @param count - The number of tiles to draw.
 * @returns The drawn tiles and the remaining tiles in the bag.
 */
export function drawTiles(
  bag: LetterTile[],
  count: number,
): { drawn: LetterTile[]; remaining: LetterTile[] } {
  return { drawn: bag.slice(0, count), remaining: bag.slice(count) }
}
