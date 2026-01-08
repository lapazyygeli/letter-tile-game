import bgGradient from '../../assets/images/bg-gradient.png'

type HeroProps = {
  onButtonClick?: () => void
}

export function Hero({ onButtonClick }: HeroProps) {
  return (
    <header
      className={`h-screen items-center bg-cover bg-center`}
      style={{ backgroundImage: `url(${bgGradient})` }}
    >
      <div className='mx-auto flex h-full w-max items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-6 text-xl uppercase md:text-3xl'>
            Craft words with precision.
            <br />
            Think like a ninja.
          </h1>
          <p className='text-text-mutated mb-20 text-[0.8rem]'>
            Fast-paced tile game where you build words horizontally <br /> and
            vertically.
          </p>
          <button
            onClick={onButtonClick}
            className='border-green bg-green-dark text-green-light shadow-green-dark hover:text-text hover:bg-green cursor-pointer border px-16 py-3 shadow-md transition-transform duration-300 hover:scale-105'
          >
            Play Now
          </button>
        </div>
      </div>
    </header>
  )
}
