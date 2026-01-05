import { useState } from 'react'
import MenuIcon from '../../assets/icons/menu_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import { useLockBodyScroll } from '../../hooks/lock-body-scroll'

type NavbarProps = {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useLockBodyScroll(isMenuOpen)

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <nav className='sticky top-0 md:static'>
      {/* Default menu for desktop and mobile (when not open = default) */}
      <div className='bg-bg-dark flex items-center justify-between px-8 py-8'>
        <span className='text-xl'>{title}</span>
        <button className='md:hidden' onClick={handleToggleMenu}>
          <MenuIcon className='h-10 w-10' />
        </button>
        <ul className='hidden items-center justify-center md:flex'>
          <li>About</li>
          <li>Log In</li>
          <li>Sign Up</li>
        </ul>
      </div>

      {/* Mobile menu when menu is open */}
      {isMenuOpen && (
        <div className='fixed inset-0 flex flex-col bg-red-400'>
          <div className='bg-bg-dark flex items-center justify-between px-8 py-8'>
            <span className='text-xl'>{title}</span>
            <button onClick={handleToggleMenu}>
              <MenuIcon className='h-10 w-10' />
            </button>
          </div>
          <div className='grow'>
            <ul className='flex h-full flex-col items-center justify-center gap-8 text-3xl'>
              <li>About</li>
              <li>Log In</li>
              <li>Sign Up</li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}
