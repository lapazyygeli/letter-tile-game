export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export type Position = { x: number; y: number }
export type LetterTile = { id: string; letter: string }
export type PlacedTile = LetterTile & Position
export type PlacedTileMap = Record<string, PlacedTile> // e.g.: {"1,2" -> PlacedTile, "-3,1" -> PlacedTile}
export type GameMode = 'singleplayer' | 'multiplayer'

export type GameSettings = {
  handSize: number
  totalTiles: number
}

// Deliberately independent from GAME_STATUS above. GAME_STATUS is the
// board's internal render-state machine (idle/playing/won/lost).
// GameOutcome is what gets persisted to statistics and uses different
// values on purpose. Singleplayer has no lose condition, so a finished
// board is a "completed" run, not a "win" over anyone. 'won'/'lost' are
// reserved for multiplayer.
export type GameOutcome = 'completed' | 'won' | 'lost'

export type GameResult = {
  mode: GameMode
  outcome: GameOutcome
  durationSeconds: number
  wordsFormed: string[]
  tilesPlaced: number
  settings: GameSettings
  rulesetVersion: number
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
