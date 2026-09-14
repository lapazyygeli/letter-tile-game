import { type GameMode } from '../db/models/game-stats.model.ts'
import {
  gameStatsRepository,
  type LeaderboardEntry,
  type RecentGame,
  type SingleplayerSummary,
} from '../repositories/game-stats.repository.ts'
import type { SaveGameStatsBody } from '../schemas/game-stats.schema.ts'

const LEADERBOARD_SIZE = 10

export type MyStatistics = {
  singleplayer: SingleplayerSummary
  recentGames: RecentGame[]
}

export type Leaderboard = {
  fastestCompletions: LeaderboardEntry[]
  mostGamesCompleted: LeaderboardEntry[]
}

/**
 * Deduce the longest word and its length from request body's word array
 */
function getLongestWord(words: string[]): {
  longestWord: string | null
  longestWordLength: number
} {
  if (words.length === 0) return { longestWord: null, longestWordLength: 0 }
  const longestWord = words.reduce((longest, word) =>
    word.length > longest.length ? word : longest,
  )
  return { longestWord, longestWordLength: longestWord.length }
}

/**
 * Derive wordCount/longestWord/longestWordLength on the server.
 */
export async function saveGameStats(userId: string, body: SaveGameStatsBody) {
  const { longestWord, longestWordLength } = getLongestWord(body.wordsFormed)

  return await gameStatsRepository.createGameStats({
    userId,
    mode: body.mode,
    outcome: body.outcome,
    durationSeconds: body.durationSeconds,
    wordsFormed: body.wordsFormed,
    wordCount: body.wordsFormed.length,
    longestWord,
    longestWordLength,
    tilesPlaced: body.tilesPlaced,
    settings: body.settings,
    rulesetVersion: body.rulesetVersion,
  })
}

/**
 * Compose user's summary and recent games into the one payload their
 * statistics page needs. Deliberately scoped to the signed-in user
 * only. See leaderboard.service.ts for the separate, cross-user view.
 */
export async function getMyStatistics(userId: string): Promise<MyStatistics> {
  const [singleplayer, recentGames] = await Promise.all([
    gameStatsRepository.getSingleplayerUserSummary(userId),
    gameStatsRepository.getRecentGames(userId, 'singleplayer', 20),
  ])
  return { singleplayer, recentGames }
}

/**
 * Compose the individual leaderboard queries into the one payload the leaderboard view needs.
 * Each query stays independently reusable, this just assembles them for the specific view.
 */
export async function getLeaderboard(mode: GameMode): Promise<Leaderboard> {
  const [fastestCompletions, mostGamesCompleted] = await Promise.all([
    gameStatsRepository.getFastestCompletionsLeaderboard(
      mode,
      LEADERBOARD_SIZE,
    ),
    gameStatsRepository.getMostGamesCompletedLeaderboard(
      mode,
      LEADERBOARD_SIZE,
    ),
  ])
  return { fastestCompletions, mostGamesCompleted }
}
