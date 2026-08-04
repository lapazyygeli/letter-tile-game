import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { ErrorToast } from '../../../components/ErrorToast'
import { signup } from '../../../api/auth'

type SignUpFormData = {
  username: string
  password: string
  passwordConfirmed: string
}

const initialFormData: SignUpFormData = {
  username: '',
  password: '',
  passwordConfirmed: '',
}

function FormDescription() {
  return (
    <div className='mb-6 text-center'>
      <h1 className='text-green-light mb-2 text-center text-3xl'>
        Alphabet Ninja
      </h1>
      <p className='text-text-mutated-dark'>Create a new account.</p>
    </div>
  )
}

function FormNavigation() {
  const navigate = useNavigate()

  return (
    <div className='mb-5 flex'>
      <button
        onClick={() => navigate('/auth/login')}
        className='hover:border-green-light hover:text-green-light border-text-mutated-dark text-text-mutated-dark w-1/2 cursor-pointer border-b-2 py-4 transition-colors duration-500'
      >
        Login
      </button>
      <button className='border-green-light text-green-light w-1/2 border-b-2 py-4'>
        Sign Up
      </button>
    </div>
  )
}

/* MAIN COMPONENT */
export function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const signupMutation = useMutation({
    mutationFn: () =>
      signup({ username: formData.username, password: formData.password }),
    onSuccess: () => {
      setFormData(initialFormData)
      setErrorMessage(null)
      // TODO: could be routed automatically to dashboard (ofc we
      // have to make it login automatically)
    },
    onError: (err, variables) => {
      setErrorMessage(err.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirmed) {
      setErrorMessage('Passwords do not match')
      return
    }
    signupMutation.mutate()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div>
      <ErrorToast
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
      <FormDescription />
      <FormNavigation />
      <form onSubmit={handleSubmit}>
        <input
          name='username'
          value={formData.username}
          type='text'
          placeholder='Username'
          autoComplete='off'
          required
          onChange={handleInputChange}
          className={`bg-bg-light mb-4 w-full border px-6 py-3 ${errorMessage ? 'border-red-500' : 'border-border'}`}
        ></input>
        <input
          name='password'
          value={formData.password}
          type='password'
          placeholder='Password'
          autoComplete='off'
          required
          onChange={handleInputChange}
          className={`bg-bg-light mb-4 w-full border px-6 py-3 ${errorMessage ? 'border-red-500' : 'border-border'}`}
        ></input>
        <input
          name='passwordConfirmed'
          value={formData.passwordConfirmed}
          type='password'
          placeholder='Confirm password'
          autoComplete='off'
          required
          onChange={handleInputChange}
          className={`bg-bg-light mb-4 w-full border px-6 py-3 ${errorMessage ? 'border-red-500' : 'border-border'}`}
        ></input>
        <button
          type='submit'
          disabled={signupMutation.isPending}
          className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
        >
          Sign Up
        </button>
        <hr className='border-border mt-10 pb-0.5' />
      </form>
    </div>
  )
}
