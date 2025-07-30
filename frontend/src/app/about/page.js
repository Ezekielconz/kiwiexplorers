import SkyBackground from '@/components/SkyBackground';
import { getAboutPage } from '@/lib/strapi';
import styles from '../../styles/About.module.css';

export const metadata = {
  title: 'About – Kiwi Explorers',
  description:
    'Our mission, vision and teaching philosophy grounded in Te Whāriki.',
};

export default async function AboutPage() {
  const data = await getAboutPage();

  return (
    <main className={styles.about}>
      <SkyBackground />

      {/* Fallback if Strapi is unreachable or not yet populated */}
      {!data ? (
        <div className={styles.content}>
          <p>No about‐page content found.</p>
        </div>
      ) : (
        <article className={styles.content}>
          <h1>About Kiwi Explorers</h1>

          <section>
            <h2>Mission</h2>
            <p>
              <em>{data.missionQuote}</em>
            </p>

            <h2>Vision</h2>
            <p>{data.visionText}</p>
          </section>

          <section>
            <h2>Our Philosophy</h2>
            <div
              className={styles.richText}
              dangerouslySetInnerHTML={{ __html: data.philosophy }}
            ></div>

            <p>
              Our practice is woven around four <em>Te Whāriki</em>{' '}
              principles:
            </p>

            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Principle</th>
                    <th>What it looks like here</th>
                  </tr>
                </thead>
                <tbody>
                  {data.principles.map((p, i) => (
                    <tr key={i}>
                      <th scope="row">
                        {p.title} – <span lang="mi">{p.labelMi}</span>
                      </th>
                      <td
                        dangerouslySetInnerHTML={{ __html: p.description }}
                      ></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Together these principles nurture confident, capable
              learners, from our youngest infants right up until it’s time
              for school.
            </p>
          </section>
        </article>
      )}
    </main>
  );
}
