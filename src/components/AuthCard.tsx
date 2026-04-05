import type { ReactNode } from 'react'
import CloseIcon from '../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'

type AuthCardProps = {
  children: ReactNode
  onClose: () => void
}

export function AuthCard({ children, onClose }: AuthCardProps) {
  return (
    <div className='bg-bg border-border relative w-full max-w-130 border px-10 py-10 md:px-20'>
      <button
        onClick={onClose}
        className='absolute top-3 right-3 cursor-pointer md:top-5 md:right-5'
      >
        <CloseIcon className='fill-text-mutated-dark h-8.75 w-8.75' />
      </button>
      <div className='mx-auto w-full max-w-90'>{children}</div>
    </div>
  )
}
