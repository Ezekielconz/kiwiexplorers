// app/team/page.js
import Image          from 'next/image';
import SkyBackground  from '@/components/SkyBackground';
import { getTeamMembers } from '@/lib/strapi';
import styles         from '../../styles/Team.module.css';

export const metadata = {
  title: 'Meet the Team – Kiwi Explorers',
  description: 'Get to know the wonderful teachers and staff at Kiwi Explorers.',
};

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();   // ← CMS data

  return (
    <main className={styles.team}>
      <SkyBackground />

      <section className={styles.content}>
        <h1>Meet the Team</h1>

        {teamMembers.length === 0 ? (
          <p>No team members found.</p>
        ) : (
          <div className={styles.profileGrid}>
            {teamMembers.map((m) => (
              <div key={m.id} className={styles.profileCard}>
                {m.img && (
                  <Image
                    src={m.img}
                    alt={m.alt}
                    width={120}
                    height={120}
                    className={styles.profileImage}
                  />
                )}
                <h3 className={styles.name}>{m.name}</h3>
                <p className={styles.role}>{m.role}</p>
                {m.bio && <p className={styles.bio}>{m.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
