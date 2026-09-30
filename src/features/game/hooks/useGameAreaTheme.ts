import { useCallback, useEffect, useState } from 'react'

export type GameAreaTheme = 'dark' | 'light'

const STORAGE_KEY = 'alphabet-ninja:gameAreaTheme'

function readStoredTheme(): GameAreaTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function useGameAreaTheme() {
  const [theme, setTheme] = useState<GameAreaTheme>(readStoredTheme)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
