import { Link } from 'react-router'
import CloseIcon from '../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import type { NavLink } from '../types/navlink.ts'

type MenuModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  links: NavLink[]
}

export function MenuModal({ isOpen, onClose, title, links }: MenuModalProps) {
  return (
    isOpen && (
      <div className='bg-bg-dark fixed inset-0 z-100 flex flex-col'>
        <div className='bg-bg-dark flex items-center justify-between px-8 py-8'>
          <span className='text-xl'>{title}</span>
          <button onClick={onClose}>
            <CloseIcon className='h-10 w-10 cursor-pointer' />
          </button>
        </div>
        <div className='grow'>
          <ul className='flex h-full flex-col items-center justify-center gap-8 text-3xl'>
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className='cursor-pointer hover:text-white'
                onClick={onClose}
              >
                {link.title}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    )
  )
}
