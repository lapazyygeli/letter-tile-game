import MenuIcon from '../../assets/icons/menu_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'

export function Navbar() {
  return (
    <nav className='sm:px-16 sm:py-10'>
      <div className='flex items-center justify-between px-8 py-8'>
        <span className='text-xl'>Alphabet Ninja</span>
        <button>
          <MenuIcon className='h-10 w-10' />
        </button>
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
