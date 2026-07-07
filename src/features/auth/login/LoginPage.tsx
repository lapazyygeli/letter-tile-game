import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from '../../../api/users'
import { ErrorToast } from '../../../components/ErrorToast'

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
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {},
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
      <form className='mb-10' onSubmit={handleSubmit}>
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
          onClick={() => {}}
          className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
        >
          Login & Play
        </button>
        <hr className='border-border pb-7' />
        <div className='text-center text-xs'>
          <p className='text-text-mutated-dark mb-2'>Just want to try?</p>
          <button
            onClick={() => {}}
            className='text-green-light cursor-pointer'
          >
            Play as Guest --&gt;
          </button>
        </div>
      </form>
    </div>
  )
}
