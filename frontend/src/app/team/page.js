import Image from 'next/image';
import SkyBackground from '@/components/SkyBackground';
import { getTeamMembers } from '@/lib/strapi';
import styles from '../../styles/Team.module.css';
import { Modak } from 'next/font/google';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Meet the Team – Kiwi Explorers',
  description: 'Get to know the wonderful teachers and staff at Kiwi Explorers.',
};

// Helper: break a slash-separated role string into lines of max two segments each
function renderRole(role) {
  const parts = role.split(' / ').map(p => p.trim());
  const lines = [];

  for (let i = 0; i < parts.length; i += 2) {
    lines.push(parts.slice(i, i + 2).join(' / '));
  }

  return lines.map((line, idx) => (
    <span key={idx}>
      {line}
      {idx < lines.length - 1 && <br />}
    </span>
  ));
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  // animated heading letters
  const heading = 'Meet the Team'.split('').map((ch, i) => {
    const duration = (1 + Math.random()).toFixed(2);
    const delay = (-Math.random() * Number(duration)).toFixed(2);
    return (
      <span
        key={i}
        className={styles.bounce}
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
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
                  <p className={styles.title}>{renderRole(m.role)}</p>
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
