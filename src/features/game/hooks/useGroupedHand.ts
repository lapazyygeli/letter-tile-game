import { useMemo } from 'react'
import type { LetterTile } from '../types'

export type LetterGroup = [string, LetterTile[]]
export type SortingStrategy = (a: LetterGroup, b: LetterGroup) => number

/**
 * Group the hand by the letters
 * @returns Grouped list of letters and their corresponding LetterTile objects.
 * [[letter, the list of LetterTile objects that have that letter], ...]
 * e.g. [["a", [obj1, obj2, ]], ...]
 */
export function useGroupedHand(
  hand: LetterTile[],
  sortingStrategy: SortingStrategy = ([a], [b]) => a.localeCompare(b),
): LetterGroup[] {
  return useMemo(() => {
    const map = new Map<string, LetterTile[]>()
    for (const letterTile of hand) {
      const group = map.get(letterTile.letter) ?? []
      group.push(letterTile)
      map.set(letterTile.letter, group)
    }
    return Array.from(map.entries()).sort(sortingStrategy)
  }, [hand, sortingStrategy])
}
