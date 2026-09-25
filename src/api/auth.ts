import { tokenStore } from '../lib/tokenStore'

type AuthCredentials = {
  username: string
  password: string
}

const API_URL = import.meta.env.VITE_API_URL

// Save a user to db if not throwing an error
export const signup = async ({ username, password }: AuthCredentials) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? 'Signup failed')
  }
  return data as { message: string }
}

// Set access token to in-memory and set refresh token to browser as a cookie
export const login = async ({ username, password }: AuthCredentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),

    // This is needed so that Set-cookie works
    // and sets cookies correctly in the browser
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message ?? 'Login failed')
  }
  const data = (await res.json()) as { accessToken: string }
  tokenStore.set(data.accessToken)
}

// Return jwt as header.payload.signature or null
export async function refresh(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    tokenStore.set(null)
    return null
  }
  const data = (await res.json()) as { accessToken: string }
  tokenStore.set(data.accessToken)
  return data.accessToken
}

// Remove the access token and the refresh token
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } finally {
    tokenStore.set(null)
  }
}
