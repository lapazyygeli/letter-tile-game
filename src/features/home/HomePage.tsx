import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { AboutPage } from '../about/AboutPage'
import type { NavLink } from '../../types/navlink'
import { useNavigate } from 'react-router'

const navLinks: NavLink[] = [
  {
    title: 'About',
    to: '/#about',
  },
  {
    title: 'Log In',
    to: '/auth/login',
  },
  {
    title: 'Sign Up',
    to: '/auth/signup',
  },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar title='Alphabet Ninja' navLinks={navLinks} />
      <Hero
        title={
          <>
            Craft words with precision.
            <br />
            Think like a ninja.
          </>
        }
        subtitle={
          <>
            Fast-paced tile game where you build words horizontally <br /> and
            vertically.
          </>
        }
        buttonText='Play Now'
        onButtonClick={() => navigate('/auth/login')}
      />
      <AboutPage />
    </div>
  )
}
