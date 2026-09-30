import { Outlet } from 'react-router'
import { useScrollToHash } from '../hooks/useScrollToHash'

function AppLayout() {
  useScrollToHash()

  return <Outlet />
}

export default AppLayout
