import { Navbar } from '../features/home/Navbar'
import { Hero } from '../features/home/Hero'
import { About } from '../features/home/About'

const navLinks = ['About', 'Log In', 'Sign Up']

export function Home() {
  return (
    <div>
      <Navbar title='Alphabet Ninja' navLinks={navLinks} />
      <Hero />
      <About />
    </div>
  )
}
