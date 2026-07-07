import { createContext, useContext, useState } from 'react'

/*
Mutta jos olet menossa cookie-pohjaiseen authiin (kuten edellisessä viestissä puhuttiin), 
en tekisi tätä tokenille ollenkaan.

Mieluummin:
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
}

Tai jopa ilman Contextia:
const { data: user } = useQuery({
  queryKey: ['me'],
  queryFn: getMe,
})
*/
type AuthContextType = {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
})

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [token, setToken] = useState<string | null>(null)
  return <AuthContext value={{ token, setToken }}>{children}</AuthContext>
}

export function useAuth() {
  const { token, setToken } = useContext(AuthContext)
  return [token, setToken]
}

// Maybe own folder for contexts
// and keep just hook in hooks
