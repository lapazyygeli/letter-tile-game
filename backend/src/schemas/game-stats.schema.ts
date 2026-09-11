import { z } from 'zod'

const gameSettingsSchema = z.object({
  handSize: z.number().int().positive(),
  totalTiles: z.number().int().positive(),
})

// wordCount, longestWord and longestWordLength
// can be deduced from wordsFormed
export const saveGameStatsSchema = z.object({
  mode: z.enum(['singleplayer', 'multiplayer']),
  outcome: z.enum(['completed', 'won', 'lost']),
  durationSeconds: z.number().int().min(0),
  wordsFormed: z.array(z.string().min(1).max(64)).max(500),
  tilesPlaced: z.number().int().min(0),
  settings: gameSettingsSchema,
  rulesetVersion: z.number().int().min(1),
})

export type SaveGameStatsBody = z.infer<typeof saveGameStatsSchema>
