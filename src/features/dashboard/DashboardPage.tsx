import { Link, useNavigate, useRouteLoaderData } from 'react-router'
import { logout } from '../../api/auth'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { AboutSection } from '../../components/AboutSection'
import type { PlayerAreaLoaderData } from '../../routes'

export function DashboardPage() {
  const { user, isGuest } = useRouteLoaderData(
    'app-area',
  ) as PlayerAreaLoaderData
  const { exitAsGuest } = useAuth()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      exitAsGuest()
      navigate('/')
    },
  })

  return (
    <div className='bg-bg-dark min-h-screen'>
      <div className='inset-x-0 min-[508px]:absolute'>
        <nav className='mx-auto flex max-w-7xl justify-center gap-4 px-8 py-10 sm:px-16 md:justify-end'>
          {user && (
            <Link
              to='/statistics'
              className='after:block after:h-0.5 after:w-full after:origin-left after:scale-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out after:content-[""] hover:text-white hover:after:scale-100'
            >
              Statistics
            </Link>
          )}
          <Link
            to='#about'
            className='after:block after:h-0.5 after:w-full after:origin-left after:scale-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out after:content-[""] hover:text-white hover:after:scale-100'
          >
            How to play
          </Link>
          <button
            type='button'
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className='cursor-pointer after:block after:h-0.5 after:w-full after:origin-left after:scale-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out after:content-[""] hover:text-white hover:after:scale-100'
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </nav>
      </div>

      <div className='flex min-h-screen items-center justify-center'>
        <div className='grid w-full max-w-3xl grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-11 px-8 sm:p-8'>
          <div className='border-t-border-hightlight bg-bg-gradient-hover border-border flex flex-col items-center rounded-lg border p-8'>
            <span className='text-[50px]'>🧍‍♂️</span>
            <h2 className='mb-4 text-3xl'>Singleplayer</h2>
            <p className='text-text-mutated mb-4 min-h-12 text-center'>
              Challenge the computer while the clock is ticking.
            </p>
            <button
              onClick={() => navigate('/game/singleplayer')}
              className='bg-green-primary text-bg-dark mt-auto cursor-pointer rounded-lg px-6.25 py-2.5 hover:opacity-80'
              type='button'
            >
              Select
            </button>
          </div>
          <div className='relative flex flex-col'>
            <div className='from-green/20 absolute inset-0 bg-linear-to-tr via-black/30 to-transparent' />
            <div className='border-t-border-hightlight bg-bg-gradient-hover border-border flex flex-col items-center rounded-lg border p-8'>
              <span className='text-[50px]'>👥</span>
              <h2 className='mb-4 text-3xl'>Multiplayer</h2>
              <p className='text-text-mutated mb-4 min-h-12 text-center'>
                Not available, in development.
              </p>
              <button
                className='bg-green-primary text-bg-dark mt-auto cursor-pointer rounded-lg px-6.25 py-2.5 hover:opacity-80'
                type='button'
                disabled={isGuest}
                title={isGuest ? 'Login to play multiplayer' : 'Select'}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>

      <AboutSection />
    </div>
  )
}
