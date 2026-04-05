import { Outlet } from 'react-router'

export function Auth() {
  return (
    <div className='bg-bg-dark flex min-h-screen items-center justify-center p-4'>
      <Outlet />
    </div>
  )
}
