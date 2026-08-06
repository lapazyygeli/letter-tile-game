import { createBrowserRouter, redirect } from 'react-router'
import AppLayout from './features/AppLayout'
import { HomePage } from './features/home/HomePage'
import { AuthLayout } from './features/auth/AuthLayout'
import { LoginPage } from './features/auth/login/LoginPage'
import { SignUpPage } from './features/auth/signup/SignUpPage'
import { tokenStore } from './lib/tokenStore'
import { refreshAccessToken } from './lib/apiClient'
import { guestStore } from './lib/guestStore'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { StatisticsPage } from './features/statistics/StatisticsPage'
import { NotFoundPage } from './features/not-found/NotFoundPage'
import { SinglePlayerPage } from './features/game/pages/singleplayer/SinglePlayerPage'

export type PlayerAreaLoaderData = {
  user: { username: string } | null
  isGuest: boolean
}

// TODO: there's really no need to put username inside jwt.
// we could fetch that later

// Check if a player is authenticated as a user
// Try using the current access token.
// If it does not exist (or has expired), try to retrieve a new one using the refresh token.
// If the refresh succeeds it means player has a valid refreshToken, and so is authenticated.
// Otherwise, the player is not authenticated.
/**
 *
 * @returns If the player is authenticated return resolved username as Promise. If not, return null
 */
async function resolveAuthentication(): Promise<{ username: string } | null> {
  const payload = tokenStore.getPayload()
  if (payload) return { username: payload.name }

  const newAccessToken = await refreshAccessToken()
  if (newAccessToken) {
    const payload = tokenStore.getPayload()
    return payload ? { username: payload.name } : null
  }
  return null
}

// Ensure that player isn't logged in as a user
async function requireUnauthenticated() {
  const user = await resolveAuthentication()
  if (user) return redirect('/dashboard')
  return null
}

// TODO: popup modal in the dashboard instead of immediate redirect
// Ensure that player is logged in as a user
async function requireAuthenticated() {
  const user = await resolveAuthentication()
  if (!user) return redirect('/auth/login')
  return null
}

// Ensure that the player is either: a guest or logged-in as a user
// If not, redirect to '/auth/login'
async function requirePlayerAccess(): Promise<PlayerAreaLoaderData | Response> {
  const user = await resolveAuthentication()
  const isGuest = guestStore.get()
  // TODO: loader data can be accessed in a component via
  // useRouteLoaderData("<routeid>")

  //A logged-in user always bypasses guest mode.
  if (user) {
    if (isGuest) guestStore.set(false)
    return { user, isGuest: false }
  }
  if (isGuest) return { user: null, isGuest: true }

  // if (!user && !isGuest)
  return redirect('/auth/login')
}

// TODO: handle routes which don't match
export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'auth',
        Component: AuthLayout,
        loader: requireUnauthenticated,
        children: [
          { index: true, loader: () => redirect('/') },
          { path: 'login', Component: LoginPage },
          { path: 'signup', Component: SignUpPage },
        ],
      },
      {
        id: 'app-area',
        loader: requirePlayerAccess,
        children: [
          { path: 'dashboard', Component: DashboardPage },
          {
            path: 'statistics',
            loader: requireAuthenticated,
            Component: StatisticsPage,
          },
          {
            path: 'game',
            children: [
              { index: true, loader: () => redirect('/dashboard') },
              { path: 'singleplayer', Component: SinglePlayerPage },
              { path: 'multiplayer', Component: null },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
