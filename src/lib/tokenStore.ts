import { jwtDecode } from 'jwt-decode'

// 5-second buffer for clock differences between server
// and client to accelerate the removal of old tokens
const CLOCK_BUFFER_MS = 5000

type TokenPayload = {
  sub: string
  name: string
  iat: number
  exp: number
}

// As a string (header.payload.signature) like td indicates
let accessToken: null | string = null

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token
  },
  getPayload: (): TokenPayload | null => {
    if (!accessToken) return null
    try {
      const payload = jwtDecode<TokenPayload>(accessToken)
      const isExpired = payload.exp * 1000 < Date.now() - CLOCK_BUFFER_MS
      if (isExpired) {
        accessToken = null
        return null
      }
      return payload
    } catch {
      return null
    }
  },
}
