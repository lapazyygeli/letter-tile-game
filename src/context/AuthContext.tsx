import { createContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { guestStore } from '../lib/guestStore'
import { tokenStore } from '../lib/tokenStore'
import { logout } from '../api/auth'

type AuthContextValue = {
  isGuest: boolean
  playAsGuest: () => void
  exitAsGuest: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(() => guestStore.get())
  const navigate = useNavigate()

  const playAsGuest = async () => {
    if (tokenStore.get()) {
      try {
        await logout()
      } catch {
        tokenStore.set(null)
      }
    }
    guestStore.set(true)
    setIsGuest(true)
    navigate('/dashboard')
  }

  const exitAsGuest = () => {
    guestStore.set(false)
    setIsGuest(false)
  }

  return (
    <AuthContext value={{ isGuest, playAsGuest, exitAsGuest }}>
      {children}
    </AuthContext>
  )
}
