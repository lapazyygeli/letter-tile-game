import { apiFetch } from '../lib/apiClient'
import type { GameResult } from '../features/game/types'

export type FavoriteWord = { word: string; count: number }

export type SingleplayerSummary = {
  gamesCompleted: number
  bestDurationSeconds: number | null
  averageDurationSeconds: number | null
  totalWordsFormed: number
  favoriteWord: FavoriteWord | null
}

export type RecentGame = {
  _id: string
  outcome: 'completed' | 'won' | 'lost'
  durationSeconds: number
  wordsFormed: string[]
  wordCount: number
  longestWord: string | null
  longestWordLength: number
  tilesPlaced: number
  settings: { handSize: number; totalTiles: number }
  rulesetVersion: number
  playedAt: string
}

export type MyStatistics = {
  singleplayer: SingleplayerSummary
  recentGames: RecentGame[]
}

export type LeaderboardEntry = {
  userId: string
  username: string
  value: number
}

export type Leaderboard = {
  fastestCompletions: LeaderboardEntry[]
  mostGamesCompleted: LeaderboardEntry[]
}

const API_URL = import.meta.env.VITE_API_URL

// Save user's game
export async function saveGameStats(result: GameResult): Promise<void> {
  const res = await apiFetch(`${API_URL}/api/v1/stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to save statistics')
  }
}

// Get the signed-in player's own statistics
export async function getMyGameStats(): Promise<MyStatistics> {
  const res = await apiFetch(`${API_URL}/api/v1/stats/me`, { method: 'GET' })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to load statistics')
  }
  return res.json()
}

// Cross-user rankings - singleplayer only for now.
export async function getLeaderboardStats(): Promise<Leaderboard> {
  const res = await apiFetch(`${API_URL}/api/v1/stats/leaderboard`, {
    method: 'GET',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to load leaderboard')
  }
  return res.json()
}
