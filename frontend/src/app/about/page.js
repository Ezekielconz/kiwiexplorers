import SkyBackground   from '@/components/SkyBackground';
import { getAboutPage } from '@/lib/strapi';
import styles          from '../../styles/About.module.css';
import { Modak }       from 'next/font/google';

const modak = Modak({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: 'About – Kiwi Explorers',
  description: 'Our mission, vision and teaching philosophy grounded in Te Whāriki.',
};

export default async function AboutPage() {
  const data = await getAboutPage();

  /* Animated Modak heading */
  const heading = 'About Kiwi Explorers'.split('').map((ch, i) => {
    const dur   = (1 + Math.random()).toFixed(2) + 's';
    const delay = (-Math.random()).toFixed(2) + 's';
    return (
      <span
        key={i}
        className={styles.bounce}
        style={{ animationDuration: dur, animationDelay: delay }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    );
  });

  return (
    <main className={styles.about}>
      <SkyBackground />

      {!data ? (
        <div className={styles.content}>
          <p>No about-page content found.</p>
        </div>
      ) : (
        <article className={styles.content}>
          <h1 className={modak.className}>{heading}</h1>

          {[
            { title: 'Mission', body: <em>{data.missionQuote}</em> },
            { title: 'Vision',  body: data.visionText },
            {
              title: 'Our Philosophy',
              body: (
                <>
                  <div
                    className={styles.richText}
                    dangerouslySetInnerHTML={{ __html: data.philosophy }}
                  />
                  <p>
                    Our practice is woven around four <em>Te Whāriki</em> principles:
                  </p>
                  <div className={styles.tableContainer}>
                    <table>
                      <thead>
                        <tr><th>Principle</th><th>What it looks like here</th></tr>
                      </thead>
                      <tbody>
                        {data.principles.map((p, i) => (
                          <tr key={i}>
                            <th scope="row">
                              {p.title} – <span lang="mi">{p.labelMi}</span>
                            </th>
                            <td
                              dangerouslySetInnerHTML={{ __html: p.description }}
                            />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p>
                    Together these principles nurture confident, capable learners,
                    from our youngest infants right up until it&rsquo;s time for school.
                  </p>
                </>
              ),
            },
          ].map((sec, i) => (
            <section key={sec.title} className={styles.sectionCard}>
              <h2 className={styles.cardTitle}>{sec.title}</h2>
              <div className={styles.sectionBody}>{sec.body}</div>
            </section>
          ))}
        </article>
      )}
    </main>
  );
}
