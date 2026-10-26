import { refresh } from '../api/auth'
import { tokenStore } from './tokenStore'

let pendingRefresh: Promise<string | null> | null = null

// Prevent multiple simultaneous refresh requests.
// Deduplicates concurrent 401s — only one refresh call in flight at a time
// Return jwt as a Promise resolving to header.payload.signature or null
export async function refreshAccessToken(): Promise<string | null> {
  if (!pendingRefresh) {
    pendingRefresh = refresh().finally(() => {
      pendingRefresh = null
    })
  }
  return pendingRefresh
}

// True if the url points to our own API. Compares resolved origins rather
// than string prefixes: VITE_API_URL is empty when the API is served from
// the site's own origin, and every string starts with ''.
function isApiUrl(url: string): boolean {
  const apiOrigin = new URL(
    import.meta.env.VITE_API_URL || '/',
    window.location.origin,
  ).origin
  return new URL(url, window.location.origin).origin === apiOrigin
}

// Set access token automatically to request if a such is present.
// If request returns with 401, new accessToken is generated
// and a same request is made with a new accessToken (assuming that
// valid refreshToken exists. otherwise promise resolves to response
// containing failed status code and response).
export async function apiFetch(
  path: string,
  fetchOptions: RequestInit,
): Promise<Response> {
  // Never send the access token (or refresh it) for another origin.
  if (!isApiUrl(path)) return fetch(path, fetchOptions)

  const headers = new Headers(fetchOptions.headers)
  const accessToken = tokenStore.get()
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  let res = await fetch(path, { ...fetchOptions, headers: headers })
  // 401: access token missing, 403: access token expired/invalid
  if (res.status === 401 || res.status === 403) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      res = await fetch(path, { ...fetchOptions, headers })
    }
  }
  return res
}
