import { useState } from 'react'
import MenuIcon from '../../assets/icons/menu_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { Link } from 'react-router'
import type { NavLink } from '../../types/navlink'
import { MenuModal } from '../../components/MenuModal'

type NavbarProps = {
  title?: string
  logo?: string
  navLinks: NavLink[]
}

export function Navbar({ title, logo, navLinks }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useLockBodyScroll(isMenuOpen)

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleMenuOpen = () => {
    setIsMenuOpen(true)
  }

  return (
    <nav className='fixed top-0 right-0 left-0 md:absolute'>
      <div className='bg-bg-dark md:bg-transparent'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-8 md:px-16 md:py-10'>
          <div className='flex items-center gap-0'>
            {logo && (
              <img src={logo} alt='' className='h-8 w-auto object-contain' />
            )}

            {title && <span className='text-xl'>{title}</span>}
          </div>

          <button
            className='md:hidden'
            onClick={handleMenuOpen}
            aria-label='Open menu'
          >
            <MenuIcon className='h-10 w-10' />
          </button>

          <ul className='hidden items-center justify-center gap-x-5 md:flex'>
            {navLinks.map((navLink, index) => (
              <Link
                key={index}
                to={navLink.to}
                className='cursor-pointer after:block after:h-0.5 after:w-full after:origin-left after:scale-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out after:content-[""] hover:text-white hover:after:scale-100'
              >
                {navLink.title}
              </Link>
            ))}
          </ul>
        </div>
      </div>
      {/* TODO: Animate mobile menu open/close */}
      {/* Mobile menu when menu is open */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        title={title}
        links={navLinks}
      />
    </nav>
  )
}
