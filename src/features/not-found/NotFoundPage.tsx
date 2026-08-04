import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className='bg-bg-dark flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl'>404</h1>
      <p className='text-text-mutated'>Page not found</p>
      <Link to='/' className='text-green-light'>
        Go home
      </Link>
    </div>
  )
}
