import { Navbar } from '../features/home/Navbar'
import { Hero } from '../features/home/Hero'

const navLinks = ['About', 'Log In', 'Sign Up']

export function Home() {
  return (
    <div>
      <Navbar title='Alphabet Ninja' navLinks={navLinks} />
      <Hero />
      <section className='bg-blue-900'>
        <h2>How To Play</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
          delectus. Delectus, ea eius? Provident corrupti aliquam consequuntur
          alias! Debitis culpa quos quaerat eveniet rem, eaque neque maxime
          aspernatur vel id! Sit, ipsam. Debitis mollitia saepe porro suscipit
          magnam a vero quidem, aperiam quis. Sequi nisi possimus et, minima,
          illum nam laudantium dignissimos harum odio, fugit vel! Quas inventore
          adipisci aliquid. Ea perferendis facilis reprehenderit quisquam fuga
          nemo possimus repudiandae assumenda animi deleniti repellendus quae
          laboriosam modi aperiam nostrum veritatis itaque, distinctio, tempora
          ipsam. Odio veniam earum, ea doloribus eius quis. Sunt, dignissimos
          quisquam numquam laborum nam reiciendis, aperiam, non hic quaerat
          delectus dolorem ex rerum praesentium velit omnis aut placeat modi
          aliquam? Adipisci, est iure culpa qui officiis sequi voluptate. Nisi
          dolores perferendis, quos fugiat recusandae minima consequatur cumque
          tempora natus obcaecati autem sequi, pariatur sapiente accusantium aut
          dolorum architecto blanditiis provident dolore eos illo enim quasi,
          ullam quidem? Adipisci! Sed dolorem blanditiis, voluptate alias facere
          id excepturi aliquam quibusdam voluptatum porro. Eaque, blanditiis?
          Dolore delectus facilis recusandae fugiat, ipsam quos vel est, minima,
          exercitationem cum officiis consequuntur alias totam. Voluptatibus
          pariatur animi ullam dignissimos atque, quidem repellat voluptates
          natus nesciunt quibusdam alias molestias consequatur tenetur aut
          aspernatur accusamus facilis nam, provident impedit qui deleniti
          libero! Sint beatae accusantium obcaecati?
        </p>
        {/* ei tartte määrittää tälle sectionille korkeutta
        laitetaan vaan tavaraa sisälle ja sen verran otetaan
        automaattisesti korkeutta*/}
      </section>
    </div>
  )
}
