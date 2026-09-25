const GUEST_FLAG_KEY = 'alphabet-ninja:isGuest'

function readStoredGuestFlag(): boolean {
  try {
    return sessionStorage.getItem(GUEST_FLAG_KEY) === 'true'
  } catch {
    // fall back to the in-memory-only behavior there.
    return false
  }
}

// Keep guest mode across page refreshes, but not across browser sessions.
let guest = readStoredGuestFlag()

export const guestStore = {
  get: () => guest,
  set: (value: boolean) => {
    guest = value
    try {
      if (value) {
        sessionStorage.setItem(GUEST_FLAG_KEY, 'true')
      } else {
        sessionStorage.removeItem(GUEST_FLAG_KEY)
      }
    } catch {}
  },
}
