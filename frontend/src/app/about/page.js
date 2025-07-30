// app/about/page.js

import SkyBackground from '@/components/SkyBackground';   
import styles        from '../../styles/About.module.css';

export const metadata = {
  title: 'About – Kiwi Explorers',
  description:
    'Our mission, vision and teaching philosophy grounded in Te Whāriki.',
};

export default function AboutPage() {
  return (
    <main className={styles.about}>
      {/* animated backdrop – runs only in the browser */}
      <SkyBackground />

      {/* Actual content card, now centered */}
      <article className={styles.content}>
        <h1>About Kiwi Explorers</h1>

        <section>
          <h2>Mission</h2>
          <p>
            <em>“When teachers nurture children’s interests, we all grow and learn together.”</em>
          </p>

          <h2>Vision</h2>
          <p>
            A welcoming place of <strong>whanaungatanga</strong> where our community feels at
            home.
          </p>
        </section>

        <section>
          <h2>Our Philosophy</h2>
          <p>
            Kiwi Explorers is a warm, safe and stimulating space where children lead their own
            play and teachers join in as guides and fellow explorers.
          </p>

          <p>Our practice is woven around four <em>Te Whāriki</em> principles:</p>

          <table>
            <thead>
              <tr>
                <th>Principle</th>
                <th>What it looks like here</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  Empowerment – <span lang="mi">Mana Atua</span>
                </th>
                <td>
                  Children choose, create and test their own ideas. We protect their wellbeing
                  and champion their voice.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  Holistic – <span lang="mi">Kotahitanga</span>
                </th>
                <td>
                  Thinking, feeling, moving and belonging grow side-by-side, with whānau always
                  part of the journey.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  Family &amp; Community – <span lang="mi">Whānau Tangata</span>
                </th>
                <td>
                  We honour each family’s culture and knowledge, linking home, centre and
                  community.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  Relationships – <span lang="mi">Ngā Hononga</span>
                </th>
                <td>
                  Teachers model kindness, fairness and curiosity; tamariki learn to reason,
                  investigate and collaborate.
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Together these principles nurture confident, capable learners, from our youngest
            infants right up until it’s time for school.
          </p>
        </section>
      </article>
    </main>
  );
}
