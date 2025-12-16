import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div>
      <p>AuthLayout text</p>
      <Outlet />
    </div>
  )
}
