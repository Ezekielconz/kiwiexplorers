import Image           from 'next/image';
import SkyBackground   from '@/components/SkyBackground';
import { getTeamMembers } from '@/lib/strapi';
import styles          from '../../styles/Team.module.css';
import { Modak }       from 'next/font/google';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Meet the Team – Kiwi Explorers',
  description: 'Get to know the wonderful teachers and staff at Kiwi Explorers.',
};

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

/* split heading, give every char its own random timing */
const heading = 'Meet the Team'.split('').map((ch, i) => {
  /* 1 – 2 s duration, random start phase with negative delay */
  const duration = (1 + Math.random()).toFixed(2);
  const delay    = (-Math.random() * duration).toFixed(2);

  return (
    <span
      key={i}
      className={styles.bounce}
      style={{
        animationDuration: `${duration}s`,
        animationDelay:    `${delay}s`,
      }}
    >
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  );

  
});




  return (
    <main className={styles.team}>
      <SkyBackground />

      <section className={styles.content}>
        <h1 className={modak.className}>{heading}</h1>

        {teamMembers.length === 0 ? (
          <p>No team members found.</p>
        ) : (
          <ul className={styles.profileGrid}>
            {teamMembers.map((m) => (
              <li key={m.id} className={styles.profileCard}>
                {m.img && (
                  <div className={styles.thumbWrap}>
                    <Image
                      src={m.img}
                      alt={m.alt}
                      width={120}
                      height={120}
                      className={styles.profileImage}
                    />
                  </div>
                )}

                <div className={styles.description}>
                  <h3 className={styles.name}>{m.name}</h3>
                  <p className={styles.title}>{m.role}</p>
                  {m.bio && <p className={styles.bio}>{m.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
