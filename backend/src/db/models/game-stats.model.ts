import mongoose, { Schema, Types, type HydratedDocument } from 'mongoose'

export type GameMode = 'singleplayer' | 'multiplayer'

// 'completed' is for a singleplayer "win"
// 'won'/'lost' are reserved for multiplayer
export type GameOutcome = 'completed' | 'won' | 'lost'

export type GameSettings = {
  handSize: number
  totalTiles: number
}

export type IGameStats = {
  userId: Types.ObjectId
  mode: GameMode // Keeps multiplayer statistics separate from singleplayer
  outcome: GameOutcome
  durationSeconds: number
  wordsFormed: string[]
  wordCount: number
  longestWord: string | null
  longestWordLength: number
  tilesPlaced: number
  // The exact configuration a game was played under. Paired with
  // rulesetVersion below so future singleplayer settings (difficulty,
  // starting tile count, etc.) stay comparable/separable from today's
  // stats without needing a migration.
  settings: GameSettings
  // Bump manually whenever a rules change would make old and new stats
  // non-comparable. Filter on it to isolate the current ruleset or omit
  // it to combine everything.
  rulesetVersion: number
  playedAt: Date
}

export type GameStatsDocument = HydratedDocument<IGameStats>

const gameSettingsSchema = new Schema<GameSettings>(
  {
    handSize: { type: Number, required: true },
    totalTiles: { type: Number, required: true },
  },
  { _id: false },
)

const gameStatsSchema = new Schema<IGameStats>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mode: { type: String, enum: ['singleplayer', 'multiplayer'], required: true },
  outcome: { type: String, enum: ['completed', 'won', 'lost'], required: true },
  durationSeconds: { type: Number, required: true },
  wordsFormed: { type: [String], required: true, default: [] },
  wordCount: { type: Number, required: true },
  longestWord: { type: String, default: null },
  longestWordLength: { type: Number, required: true, default: 0 },
  tilesPlaced: { type: Number, required: true },
  settings: { type: gameSettingsSchema, required: true },
  rulesetVersion: { type: Number, required: true },
  playedAt: { type: Date, required: true, default: Date.now },
})

// For user's own games
// Create index to speed up db queries. 1 means asc, -1 desc.
// Mode: first comes all singleplayer games then multiplayer games
// playedAt: first comes all recent games then older ones
gameStatsSchema.index({ userId: 1, mode: 1, playedAt: -1 })

// Across all users. E.g. leaderboard. mode+outcome as a matching prefix,
// durationSeconds pre-sorted for the fastest-completion leaderboard.
gameStatsSchema.index({ mode: 1, outcome: 1, durationSeconds: 1 })

export const GameStats = mongoose.model<IGameStats>(
  'GameStats',
  gameStatsSchema,
)
