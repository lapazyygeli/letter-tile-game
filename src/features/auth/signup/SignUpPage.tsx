import { useState } from 'react'
import { useNavigate } from 'react-router'

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

const inputs: {
  name: keyof SignUpFormData
  type: 'text' | 'password'
  placeholder: string
  autoComplete: string
  required: boolean
}[] = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Username',
    autoComplete: 'off', //'username',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'off', //'new-password',
    required: true,
  },
  {
    name: 'passwordConfirmed',
    type: 'password',
    placeholder: 'Confirm password',
    autoComplete: 'off', //'new-password',
    required: true,
  },
]

export function SignUpPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirmed) {
      setError('Passwords do not match')
      return
    }

    setError(null)
    setFormData(initialFormData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div>
      <div className='mb-6 text-center'>
        <h1 className='text-green-light mb-2 text-center text-3xl'>
          Alphabet Ninja
        </h1>
        <p className='text-text-mutated-dark'>Create a new account.</p>
      </div>
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
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <div key={index}>
            <input
              name={input.name}
              value={formData[input.name]}
              type={input.type}
              placeholder={input.placeholder}
              autoComplete={input.autoComplete}
              required={input.required}
              onChange={handleInputChange}
              className={
                'bg-bg-light border-border mb-4 w-full border px-6 py-3'
              }
            ></input>
          </div>
        ))}
        <button
          type='submit'
          className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
        >
          Sign Up
        </button>
      </form>
      {error && <p>Error</p>}
      <hr className='border-border mt-10 pb-0.5' />
    </div>
  )
}
