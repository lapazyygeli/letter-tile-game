import { Outlet } from 'react-router'
import { useScrollToHash } from '../hooks/useScrollToHash'

function AppLayout() {
  useScrollToHash()

  // Add any providers here
  // if needed
  return <Outlet />
}

export default AppLayout
