import { useState } from 'react'
import MenuIcon from '../../assets/icons/menu_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import CloseIcon from '../../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import { useLockBodyScroll } from '../../hooks/lock-body-scroll'

type NavbarProps = {
  title?: string
  navLinks: string[]
}

export function Navbar({ title, navLinks }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useLockBodyScroll(isMenuOpen)

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <nav className='sticky top-0 md:static'>
      {/* Default menu for desktop and mobile (when not open = default) */}
      <div className='bg-bg-dark flex items-center justify-between px-8 py-8 md:px-16 md:py-10'>
        <span className='text-xl'>{title}</span>
        <button className='md:hidden' onClick={handleToggleMenu}>
          <MenuIcon className='h-10 w-10' />
        </button>
        <ul className='hidden items-center justify-center gap-x-5 md:flex'>
          {navLinks.map((navLinkTitle) => (
            <li className='cursor-pointer after:block after:h-0.5 after:w-full after:origin-left after:scale-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out after:content-[""] hover:text-white hover:after:scale-100'>
              {navLinkTitle}
            </li>
          ))}
        </ul>
      </div>

      {/* TODO: Animate mobile menu open/close */}
      {/* Mobile menu when menu is open */}
      {isMenuOpen && (
        <div className='bg-bg-dark fixed inset-0 flex flex-col'>
          <div className='bg-bg-dark flex items-center justify-between px-8 py-8'>
            <span className='text-xl'>{title}</span>
            <button onClick={handleToggleMenu}>
              <CloseIcon className='h-10 w-10' />
            </button>
          </div>
          <div className='grow'>
            <ul className='flex h-full flex-col items-center justify-center gap-8 text-3xl'>
              {navLinks.map((navLinkTitle) => (
                <li className='cursor-pointer hover:text-white'>
                  {navLinkTitle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}
