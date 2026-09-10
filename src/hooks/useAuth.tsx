import { useNavigate } from 'react-router'
import { guestStore } from '../lib/guestStore'
import { tokenStore } from '../lib/tokenStore'
import { logout } from '../api/auth'

export function useAuth() {
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
    navigate('/dashboard')
  }

  const exitAsGuest = () => {
    guestStore.set(false)
  }

  return { playAsGuest, exitAsGuest }
}
