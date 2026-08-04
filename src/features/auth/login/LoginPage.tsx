import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ErrorToast } from '../../../components/ErrorToast'
import { useAuth } from '../../../hooks/useAuth'
import { login } from '../../../api/auth'

// TODO: replace buttons to Links

type LoginFormData = {
  username: string
  password: string
}

const initialFormData: LoginFormData = {
  username: '',
  password: '',
}

function FormDescription() {
  return (
    <div className='mb-6 text-center'>
      <h1 className='text-green-light mb-2 text-center text-3xl'>
        Alphabet Ninja
      </h1>
      <p className='text-text-mutated-dark'>Join the word battle</p>
    </div>
  )
}

function FormNavigation() {
  const navigate = useNavigate()

  return (
    <div className='mb-5 flex'>
      <button className='border-green-light text-green-light w-1/2 border-b-2 py-4'>
        Login
      </button>
      <button
        onClick={() => navigate('/auth/signup')}
        className='hover:border-green-light hover:text-green-light border-text-mutated-dark text-text-mutated-dark w-1/2 cursor-pointer border-b-2 py-4 transition-colors duration-500'
      >
        Sign Up
      </button>
    </div>
  )
}

/* MAIN COMPONENT */
export function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData)
  const { isGuest, playAsGuest, exitAsGuest } = useAuth()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => login(credentials),
    onSuccess: () => {
      if (isGuest) exitAsGuest()
      navigate('/dashboard')
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elemValue = e.target.value
    const elemName = e.target.name
    setFormData((prev) => ({
      ...prev,
      [elemName]: elemValue,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation.mutate({
      username: formData.username,
      password: formData.password,
    })
  }

  return (
    <div>
      <ErrorToast
        message={loginMutation.error?.message ?? null}
        onClose={() => loginMutation.reset()}
      />
      <FormDescription />
      <FormNavigation />
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          className={`bg-bg-light mb-4 w-full border px-6 py-3 ${loginMutation.error ? 'border-red-500' : 'border-border'}`}
          autoComplete='off'
          name='username'
          onChange={handleInputChange}
        />
        <input
          type='password'
          placeholder='Password'
          className={`bg-bg-light mb-4 w-full border px-6 py-3 ${loginMutation.error ? 'border-red-500' : 'border-border'}`}
          autoComplete='off'
          name='password'
          onChange={handleInputChange}
        />
        <button
          type='submit'
          disabled={loginMutation.isPending}
          className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login & Play'}
        </button>
      </form>
      <div className='mb-10 text-center text-xs'>
        <hr className='border-border pb-7' />
        <p className='text-text-mutated-dark mb-2'>Just want to try?</p>
        <button
          onClick={playAsGuest}
          className='text-green-light cursor-pointer'
        >
          Play as Guest --&gt;
        </button>
      </div>
    </div>
  )
}
