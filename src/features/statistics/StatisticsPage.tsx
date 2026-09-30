import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  getMyGameStats,
  getLeaderboardStats,
  type SingleplayerSummary,
  type LeaderboardEntry,
} from '../../api/game-stats'

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

export function StatisticsPage() {
  const myStats = useQuery({
    queryKey: ['statistics', 'me'],
    queryFn: getMyGameStats,
  })
  const leaderboard = useQuery({
    queryKey: ['statistics', 'leaderboard'],
    queryFn: getLeaderboardStats,
  })

  return (
    <div className='bg-bg-dark text-text min-h-screen'>
      <div className='mx-auto max-w-7xl px-8 py-12'>
        <div className='mb-10 flex items-center justify-between gap-4'>
          <h1 className='text-3xl'>Statistics</h1>
          <Link
            to='/dashboard'
            className='border-border hover:border-border-hightlight text-text-mutated hover:text-text rounded-md border px-4 py-2 text-sm transition-colors'
          >
            ← Back to dashboard
          </Link>
        </div>

        <section className='mb-10'>
          <h2 className='mb-4 text-xl'>Your singleplayer stats</h2>
          {myStats.isPending && <p className='text-text-mutated'>Loading…</p>}
          {myStats.isError && (
            <p className='text-red-500'>
              {myStats.error instanceof Error
                ? myStats.error.message
                : 'Something went wrong'}
            </p>
          )}
          {myStats.data && <SummaryGrid summary={myStats.data.singleplayer} />}
        </section>

        {myStats.data && (
          <section className='mb-14'>
            <h2 className='mb-4 text-xl'>Recent games</h2>
            {myStats.data.recentGames.length === 0 ? (
              <p className='text-text-mutated'>No games played yet.</p>
            ) : (
              <div className='border-border overflow-x-auto rounded-lg border'>
                <table className='w-full text-left text-xs sm:text-sm'>
                  <thead>
                    <tr className='border-border text-text-mutated border-b'>
                      <th className='px-2 py-3 font-medium sm:px-4'>Played</th>
                      <th className='px-2 py-3 font-medium sm:px-4'>Time</th>
                      <th className='px-2 py-3 font-medium sm:px-4'>Words</th>
                      <th className='px-2 py-3 font-medium sm:px-4'>
                        Longest word
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myStats.data.recentGames.map((game) => (
                      <tr
                        key={game._id}
                        className='border-border border-b last:border-b-0'
                      >
                        <td className='px-2 py-3 sm:px-4'>
                          {new Date(game.playedAt).toLocaleString()}
                        </td>
                        <td className='px-2 py-3 sm:px-4'>
                          {formatDuration(game.durationSeconds)}
                        </td>
                        <td className='px-2 py-3 sm:px-4'>{game.wordCount}</td>
                        <td className='px-2 py-3 wrap-anywhere sm:px-4'>
                          {game.longestWord ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <section className='border-t-border-hightlight bg-bg-gradient-hover border-border rounded-lg border p-8'>
          <h2 className='mb-6 text-xl'>🏆 Leaderboard</h2>
          {leaderboard.isPending && (
            <p className='text-text-mutated'>Loading…</p>
          )}
          {leaderboard.isError && (
            <p className='text-red-500'>
              {leaderboard.error instanceof Error
                ? leaderboard.error.message
                : 'Something went wrong'}
            </p>
          )}
          {leaderboard.data && (
            <div className='grid gap-10 sm:grid-cols-2'>
              <LeaderboardList
                title='Fastest completions'
                entries={leaderboard.data.fastestCompletions}
                formatValue={formatDuration}
              />
              <LeaderboardList
                title='Most games completed'
                entries={leaderboard.data.mostGamesCompleted}
                formatValue={(value) => value.toString()}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function SummaryGrid({ summary }: { summary: SingleplayerSummary }) {
  return (
    <dl className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
      <Stat label='Games completed' value={summary.gamesCompleted.toString()} />
      <Stat
        label='Best time'
        value={
          summary.bestDurationSeconds !== null
            ? formatDuration(summary.bestDurationSeconds)
            : '—'
        }
      />
      <Stat label='Words formed' value={summary.totalWordsFormed.toString()} />
      <Stat label='Favorite word' value={summary.favoriteWord?.word ?? '—'} />
    </dl>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-border bg-bg-light rounded-md border p-4 text-center'>
      <dt className='text-text-mutated text-xs'>{label}</dt>
      <dd className='mt-1 text-xl font-semibold'>{value}</dd>
    </div>
  )
}

type LeaderboardListProps = {
  title: string
  entries: LeaderboardEntry[]
  formatValue: (value: number) => string
}

function LeaderboardList({
  title,
  entries,
  formatValue,
}: LeaderboardListProps) {
  return (
    <div>
      <h3 className='text-text-mutated mb-3 text-sm tracking-wide uppercase'>
        {title}
      </h3>
      {entries.length === 0 ? (
        <p className='text-text-mutated text-sm'>No entries yet.</p>
      ) : (
        <ol className='space-y-1'>
          {entries.map((entry, index) => (
            <li key={entry.userId} className='flex justify-between text-sm'>
              <span>
                {index + 1}. {entry.username}
              </span>
              <span className='font-semibold'>{formatValue(entry.value)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
