import type { ReactNode } from 'react'
import bgGradient from '../../assets/images/bg-gradient.png'

type HeroProps = {
  title: ReactNode
  subtitle?: ReactNode
  buttonText: string
  onButtonClick: () => void
}

export function Hero({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: HeroProps) {
  return (
    <header
      className={`h-screen items-center bg-cover bg-center`}
      style={{ backgroundImage: `url(${bgGradient})` }}
    >
      <div className='mx-auto flex h-full w-max items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-6 text-xl uppercase md:text-3xl'>{title}</h1>
          <p className='text-text-mutated mb-20 text-[0.8rem]'>{subtitle}</p>
          <button
            onClick={onButtonClick}
            className='border-green bg-green-dark text-green-light shadow-green-dark hover:text-text hover:bg-green cursor-pointer border px-16 py-3 shadow-md transition-transform duration-300 hover:scale-105'
          >
            {buttonText}
          </button>
        </div>
      </div>
    </header>
  )
}
