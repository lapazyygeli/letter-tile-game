import { Navbar } from '../features/home/Navbar'

export function Home() {
  return (
    <div>
      <section className='bg-bg-dark h-screen'>
        <Navbar />
        <p>Hi there! (from Home component)</p>
      </section>
      <section className='bg-blue-900'>
        <h2>How To Play</h2>
      </section>
    </div>
  )
}
