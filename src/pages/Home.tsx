import { Navbar } from '../features/home/Navbar'
import { Hero } from '../features/home/Hero'
import { About } from '../features/home/About'
import type { NavLink } from '../features/home/types'
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

export function Home() {
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
      <About />
    </div>
  )
}
