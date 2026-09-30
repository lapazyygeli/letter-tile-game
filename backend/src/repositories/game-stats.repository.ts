import { Types } from 'mongoose'
import {
  GameStats,
  type GameMode,
  type IGameStats,
} from '../db/models/game-stats.model.ts'

type CreateGameStatsInput = Omit<IGameStats, 'playedAt' | 'userId'> & {
  userId: string | Types.ObjectId
}

async function createGameStats(data: CreateGameStatsInput) {
  const gameStats = new GameStats(data)
  return await gameStats.save()
}

export type RecentGame = Pick<
  IGameStats,
  | 'outcome'
  | 'durationSeconds'
  | 'wordsFormed'
  | 'wordCount'
  | 'longestWord'
  | 'longestWordLength'
  | 'tilesPlaced'
  | 'settings'
  | 'rulesetVersion'
  | 'playedAt'
> & { _id: Types.ObjectId }

async function getRecentGames(
  userId: string,
  mode: GameMode,
  limit: number,
): Promise<RecentGame[]> {
  return await GameStats.find({ userId: new Types.ObjectId(userId), mode })
    .sort({ playedAt: -1 })
    .limit(limit)
    .lean()
}

export type FavoriteWord = { word: string; count: number }

/**
 * Computed on every read rather than maintained as a running counter.
 * Word arrays per game are small and games per user is modest currently,
 * so this is cheap (revisit if needed).
 *
 * @returns The most frequently used word. If multiple words are equally
 * common, the one that comes first alphabetically is selected.
 */
async function getUserFavoriteWord(
  userId: string,
  mode: GameMode,
): Promise<FavoriteWord | null> {
  const [result] = await GameStats.aggregate<FavoriteWord>([
    { $match: { userId: new Types.ObjectId(userId), mode } },
    { $unwind: '$wordsFormed' },
    { $group: { _id: '$wordsFormed', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 1 },
    { $project: { _id: 0, word: '$_id', count: 1 } },
  ])
  return result ?? null
}

export type SingleplayerSummary = {
  gamesCompleted: number
  bestDurationSeconds: number | null
  averageDurationSeconds: number | null
  totalWordsFormed: number
  favoriteWord: FavoriteWord | null
}

const EMPTY_SINGLEPLAYER_TOTALS: Omit<SingleplayerSummary, 'favoriteWord'> = {
  gamesCompleted: 0,
  bestDurationSeconds: null,
  averageDurationSeconds: null,
  totalWordsFormed: 0,
}

// Singleplayer has no lose condition currently, so every saved row already
// represents a completed game.
async function getSingleplayerUserSummary(
  userId: string,
): Promise<SingleplayerSummary> {
  const [totals] = await GameStats.aggregate<
    Omit<SingleplayerSummary, 'favoriteWord'>
  >([
    { $match: { userId: new Types.ObjectId(userId), mode: 'singleplayer' } },
    {
      $group: {
        _id: null,
        gamesCompleted: { $sum: 1 },
        bestDurationSeconds: { $min: '$durationSeconds' },
        averageDurationSeconds: { $avg: '$durationSeconds' },
        totalWordsFormed: { $sum: '$wordCount' },
      },
    },
    { $project: { _id: 0 } },
  ])

  const favoriteWord = await getUserFavoriteWord(userId, 'singleplayer')

  return { ...(totals ?? EMPTY_SINGLEPLAYER_TOTALS), favoriteWord }
}

export type LeaderboardEntry = {
  userId: Types.ObjectId
  username: string
  value: number // best time | amount of games
}

// One row per player (their personal best), not one row per game - this
// keeps a single strong player from occupying every slot on the board.
async function getFastestCompletionsLeaderboard(
  mode: GameMode,
  limit: number,
): Promise<LeaderboardEntry[]> {
  return await GameStats.aggregate<LeaderboardEntry>([
    { $match: { mode, outcome: 'completed' } },
    { $group: { _id: '$userId', value: { $min: '$durationSeconds' } } },
    { $sort: { value: 1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        username: '$user.username',
        value: 1,
      },
    },
  ])
}

// One row per player, ranked by total completed games.
async function getMostGamesCompletedLeaderboard(
  mode: GameMode,
  limit: number,
): Promise<LeaderboardEntry[]> {
  return await GameStats.aggregate<LeaderboardEntry>([
    { $match: { mode, outcome: 'completed' } },
    { $group: { _id: '$userId', value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        username: '$user.username',
        value: 1,
      },
    },
  ])
}

export const gameStatsRepository = {
  createGameStats,
  getRecentGames,
  getUserFavoriteWord,
  getSingleplayerUserSummary,
  getFastestCompletionsLeaderboard,
  getMostGamesCompletedLeaderboard,
}
