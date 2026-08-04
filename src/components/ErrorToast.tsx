import CloseIcon from '../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'

type ErrorToastProps = {
  message: string | null
  onClose: () => void
}

export function ErrorToast({ message, onClose }: ErrorToastProps) {
  if (!message) return null

  return (
    <div className='animate-slide-in fixed inset-x-0 top-0 w-screen rounded-b-md bg-red-500 px-6 py-4 font-sans font-light text-white shadow-lg shadow-red-900/90 sm:py-2'>
      <div className='flex items-center justify-between'>
        <p>{message}</p>
        <CloseIcon onClick={onClose} className='cursor-pointer' />
      </div>
    </div>
  )
}
