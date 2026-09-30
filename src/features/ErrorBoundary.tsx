import { Link, isRouteErrorResponse, useRouteError } from 'react-router'

export function ErrorBoundary() {
  const error = useRouteError()

  console.error('Route error:', error)

  const title = isRouteErrorResponse(error)
    ? `${error.status}`
    : 'Something went wrong'

  return (
    <div className='bg-bg-dark flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center'>
      <h1 className='text-4xl'>{title}</h1>
      <p className='text-text-mutated max-w-sm'>
        Something went wrong loading this page. Please try again.
      </p>
      <Link to='/' className='text-green-light'>
        Go home
      </Link>
    </div>
  )
}
