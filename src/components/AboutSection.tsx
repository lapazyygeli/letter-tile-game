export function AboutSection() {
  return (
    <section
      id='about'
      className='bg-bg-dark border-t-bg-light border-t-2 px-6 py-20'
    >
      <h2 className='text-text mx-auto mb-14 w-fit text-2xl uppercase'>
        How To Play
      </h2>
      <div className='mx-auto mb-10 grid max-w-4xl grid-cols-1 place-items-center gap-x-6.75 gap-y-6.75 sm:grid-cols-2 md:grid-cols-4'>
        <div className='bg-bg border-border flex h-full w-full max-w-80 flex-col items-center rounded-lg border-2 px-0.5 pt-7.5 lg:px-4'>
          <span className='mb-7.5 text-[48px]'>🧩</span>
          <p className='mb-4 text-[20px]'>Build & Solve</p>
          <p className='text-text-mutated mb-4.5 w-full text-center text-[12px] leading-4.75'>
            Create words horizontally
            <br /> and vertically — only from
            <br /> left to right and top to
            <br /> bottom.
          </p>
        </div>
        <div className='bg-bg border-border flex h-full w-full max-w-80 flex-col items-center rounded-lg border-2 px-0.5 pt-7.5 lg:px-4'>
          <span className='mb-7.5 text-[48px]'>⏱</span>
          <p className='mb-4 text-[20px]'>Time Your Best</p>
          <p className='text-text-mutated mb-4.5 w-full text-center text-[12px] leading-4.75'>
            Time is ticking! Race against
            <br className='span md:hidden' /> the clock and save your best
            <br className='span md:hidden' /> times.
          </p>
        </div>
        <div className='bg-bg border-border flex h-full w-full max-w-80 flex-col items-center rounded-lg border-2 px-0.5 pt-7.5 lg:px-4'>
          <span className='mb-7.5 text-[48px]'>👤</span>
          <p className='mb-4 text-[20px]'>Your choice</p>
          <p className='text-text-mutated mb-4.5 w-full text-center text-[12px] leading-4.75'>
            Play as a guest or sign in to save your progress.
          </p>
        </div>
        <div className='bg-bg border-border flex h-full w-full max-w-80 flex-col items-center rounded-lg border-2 px-0.5 pt-7.5 lg:px-4'>
          <span className='mb-7.5 text-[48px]'>⚡</span>
          <p className='mb-4 text-[20px]'>Track Your Stats</p>
          <p className='text-text-mutated mb-4.5 w-full text-center text-[12px] leading-4.75'>
            Keep track of your games and
            <br className='span md:hidden' /> see your progress. Follow your
            <br className='span md:hidden' /> results and personal bests.
          </p>
        </div>
      </div>
      <div className='bg-bg-gradient-hover border-border mx-auto mb-10 max-w-4xl rounded-lg border-2 p-8.5'>
        <h1 className='text-text mx-auto mb-8.5 w-fit text-[20px]'>
          Game Mechanics
        </h1>
        <div className='text-text-mutated space-y-4 text-[15px] leading-relaxed'>
          <p>
            - When a game starts, you receive a hand of letters drawn randomly
            from a shared pool. Your goal is to place every letter from your
            hand onto the board, arranging them so that every group of connected
            letters forms a real word.
          </p>

          <p>
            - Words can only run in two directions. From left to right or from
            top to bottom, never diagonally and never backwards. A single letter
            placed on its own does not count as a word, so make sure every
            letter you place belongs to a longer sequence. In the end, every
            letter must be connected to at least one other letter, so that all
            letters form one connected group.
          </p>

          <p>
            - Letters can be rearranged freely during play. Drag a letter from
            your hand onto an empty spot on the board or drag a letter that is
            already on the board to a new position. If you drop a letter on top
            of another letter, the two simply swap places.
          </p>

          <p>
            - If a letter in your hand feels impossible to use, you don't have
            to hold onto it forever. Exchange it for three new letters drawn
            from the pool instead, as long as enough letters remain in the pool.
          </p>

          <p>
            - Whenever you think the board looks right, press the CHECK BUTTON.
            Any word that isn't valid gets outlined in red, showing exactly what
            needs to be fixed. Make the necessary changes and press the button
            again as many times as needed. You win the game when your hand is
            completely empty, every tile on the board is connected into a single
            group with no tiles standing alone and every word formed on the
            board is valid.
          </p>
        </div>
      </div>
    </section>
  )
}
