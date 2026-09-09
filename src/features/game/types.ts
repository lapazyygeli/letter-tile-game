export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export type Position = {
  x: number
  y: number
}

export type LetterTile = {
  id: string
  letter: string
}

export type PlacedTile = LetterTile & Position

// e.g.: {"1,2" -> PlacedTile, "-3,1" -> PlacedTile}
export type PlacedTileMap = Record<string, PlacedTile>

export type GameMode = 'singleplayer' | 'multiplayer'

export type GameResult = {
  mode: GameMode
  outcome: typeof GAME_STATUS.WON | typeof GAME_STATUS.LOST
  durationSeconds: number
  wordsFormed: string[]
  tilesPlaced: number
  tilesInHand: number
  timestamp: string
}

export type TileDragData = {
  type: 'tile'
  tileId: string
  letter: string
  source: 'hand' | 'board'
  position?: Position
}

export type CellDropData = {
  type: 'cell'
  position: Position
}
