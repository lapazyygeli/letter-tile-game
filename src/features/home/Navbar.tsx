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
    <nav className='sticky top-0'>
      <div className={`${isMenuOpen && 'flex h-screen flex-col'}`}>
        <div className='bg-bg-dark flex items-center justify-between px-8 py-8'>
          <span className='text-xl'>{title}</span>
          <button onClick={handleToggleMenu}>
            <MenuIcon className='h-10 w-10' />
          </button>
        </div>
        {isMenuOpen && (
          <div className='grow bg-red-400'>
            <ul className='flex h-full flex-col items-center justify-center gap-8 text-3xl'>
              <li>About</li>
              <li>Log In</li>
              <li>Sign Up</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

/*
<nav className='bg-amber-900 sm:px-16 sm:py-10'>
      <div className='sm:flex sm:justify-between'>
        <div>
          <span>Alphabet Ninja</span>
          <img className='sm:inline' src='#' alt='logo' />
        </div>
        <ul className='sm:flex'>
          <li>About</li>
          <li>Log In</li>
          <li>Sign Up</li>
        </ul>
      </div>
    </nav>
*/
