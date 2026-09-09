import type { PlacedTile, PlacedTileMap, Position } from '../types.ts'

/**
 * Converts a board position into a string (key) format.
 *
 * @example
 * positionToKey({ x: 1, y: 2 }) // "1,2"
 * positionToKey({ x: -2, y: -5 }) // "-2,-5"
 */
export function positionToKey(position: Position): string {
  return `${position.x},${position.y}`
}

/**
 * Place a tile on the board at its position.
 * Return a new board without modifying the original.
 * @param board - The current board.
 * @param tile - The tile to place on the board.
 * @returns A new board containing the placed tile.
 */
export function placeTileAt(
  board: PlacedTileMap,
  tile: PlacedTile,
): PlacedTileMap {
  return { ...board, [positionToKey(tile)]: tile }
}

/**
 * Remove the tile at the specified position from the board.
 * Return a new board without modifying the original.
 * @param board - The current board.
 * @param position - The position of the tile to remove.
 * @returns A new board without the tile at the specified position.
 */
export function removeTileAt(
  board: PlacedTileMap,
  position: Position,
): PlacedTileMap {
  const newBoard = { ...board }
  delete newBoard[positionToKey(position)]
  return newBoard
}

/**
 * Get the tile at the specified position on the board.
 * @param board - The current board.
 * @param position - The position to look up.
 * @returns The tile at the position, or undefined if the position is empty.
 */
export function getTileAt(
  board: PlacedTileMap,
  position: Position,
): PlacedTile | undefined {
  return board[positionToKey(position)]
}

//  Offset to find adjacent tiles
const NEIGHBOR_OFFSETS: Position[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]

/**
 * BFS from an (arbitrary) tile: the board is "connected" if every placed tile
 * is reachable. If board has 1 or 0 tiles it returns true by default.
 */
export function isConnected(board: PlacedTileMap): boolean {
  // keys are Position objs in string format e.g. "1,2"
  const keys = Object.keys(board)
  if (keys.length <= 1) return true

  const visited = new Set<string>()
  const start = board[keys[0]]
  const queue: Position[] = [start]
  visited.add(positionToKey(start))

  while (queue.length > 0) {
    const current = queue.shift() as Position
    for (const offset of NEIGHBOR_OFFSETS) {
      const next = { x: current.x + offset.x, y: current.y + offset.y }
      const key = positionToKey(next)
      if (!visited.has(key) && board[key]) {
        visited.add(key)
        queue.push(next)
      }
    }
  }

  return visited.size === keys.length
}
