import { Outlet } from 'react-router'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { AuthContextProvider } from '../context/AuthContext'

function AppLayout() {
  useScrollToHash()

  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  )
}

export default AppLayout
