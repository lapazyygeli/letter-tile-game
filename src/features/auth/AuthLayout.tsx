import CloseIcon from '../../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import { Outlet, useNavigate } from 'react-router'

export function AuthLayout() {
  const navigate = useNavigate()

  return (
    <div className='bg-bg-dark flex min-h-screen items-center justify-center p-4'>
      <div className='bg-bg border-border relative w-full max-w-130 border px-10 py-10 md:px-20'>
        <button
          onClick={() => navigate('/')}
          className='absolute top-3 right-3 cursor-pointer md:top-5 md:right-5'
        >
          <CloseIcon className='fill-text-mutated-dark h-8.75 w-8.75' />
        </button>
        <div className='mx-auto w-full max-w-90'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
