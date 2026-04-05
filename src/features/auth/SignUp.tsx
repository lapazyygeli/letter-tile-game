import { useState } from 'react'
import CloseIcon from '../../assets/icons/close_24dp_E6E6E6_FILL0_wght400_GRAD0_opsz24.svg?react'
import { useNavigate } from 'react-router'
import { FormInput } from '../../components/FormInput'

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

export function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormData(initialFormData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // TODO: remove these if not needed really
  const navigateToLogin = () => {
    navigate('/auth/login')
  }
  const navigateToHome = () => {
    navigate('/')
  }

  return (
    <div className='bg-bg border-border relative w-full max-w-130 border px-10 py-10 md:px-20'>
      <button
        onClick={navigateToHome}
        className='absolute top-3 right-3 cursor-pointer md:top-5 md:right-5'
      >
        <CloseIcon className='fill-text-mutated-dark h-8.75 w-8.75' />
      </button>
      <div className='mx-auto w-full max-w-90'>
        <div className='mb-6 text-center'>
          <h1 className='text-green-light mb-2 text-center text-3xl'>
            Alphabet Ninja
          </h1>
          <p className='text-text-mutated-dark'>Create a new account.</p>
        </div>
        <div className='mb-5 flex'>
          <button
            onClick={navigateToLogin}
            className='hover:border-green-light hover:text-green-light border-text-mutated-dark text-text-mutated-dark w-1/2 cursor-pointer border-b-2 py-4 transition-colors duration-500'
          >
            Login
          </button>
          <button className='border-green-light text-green-light w-1/2 border-b-2 py-4'>
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className='mb-10'>
          {inputs.map((input, index) => (
            <FormInput
              key={index}
              name={input.name}
              value={formData[input.name]}
              type={input.type}
              placeholder={input.placeholder}
              autoComplete={input.autoComplete}
              required={input.required}
              onChange={handleInputChange}
            />
          ))}
          <button
            type='submit'
            className='bg-green text-text mt-4 w-full cursor-pointer rounded-lg py-3'
          >
            Sign Up
          </button>
        </form>
        <hr className='border-border pb-0.5' />
      </div>
    </div>
  )
}
