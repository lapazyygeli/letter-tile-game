import { AuthCard } from '../../components/AuthCard'
import { useNavigate } from 'react-router'

export function Login() {
  const navigate = useNavigate()

  // TODO: remove these if not needed really
  const navigateToDashboard = () => {}
  const navigateToSignUp = () => {
    navigate('/auth/signup')
  }
  const navigateToHome = () => {
    navigate('/')
  }

  return (
    <AuthCard onClose={navigateToHome}>
      <div className='mb-6 text-center'>
        <h1 className='text-green-light mb-2 text-center text-3xl'>
          Alphabet Ninja
        </h1>
        <p className='text-text-mutated-dark'>Join the word battle</p>
      </div>
      <div className='mb-5 flex'>
        <button className='border-green-light text-green-light w-1/2 border-b-2 py-4'>
          Login
        </button>
        <button
          onClick={navigateToSignUp}
          className='hover:border-green-light hover:text-green-light border-text-mutated-dark text-text-mutated-dark w-1/2 cursor-pointer border-b-2 py-4 transition-colors duration-500'
        >
          Sign Up
        </button>
      </div>
      <form className='mb-10'>
        <input
          type='text'
          placeholder='Username'
          className='border-border bg-bg-light mb-4 w-full border px-6 py-3'
        />
        <input
          type='password'
          placeholder='Password'
          className='border-border bg-bg-light mb-4 w-full border px-6 py-3'
        />
        <button
          onClick={() => {}}
          className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
        >
          Login & Play
        </button>
      </form>
      <hr className='border-border pb-7' />
      <div className='text-center text-xs'>
        <p className='text-text-mutated-dark mb-2'>Just want to try?</p>
        <button
          onClick={navigateToDashboard}
          className='text-green-light cursor-pointer'
        >
          Play as Guest --&gt;
        </button>
      </div>
    </AuthCard>
  )
}
