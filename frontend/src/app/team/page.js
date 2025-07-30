// app/team/page.js

import SkyBackground from '@/components/SkyBackground';
import styles       from '../../styles/Team.module.css';

export const metadata = {
  title: 'Meet the Team – Kiwi Explorers',
  description:
    'Get to know the wonderful teachers and staff at Kiwi Explorers.',
};

const teamMembers = [
  {
    name: 'Jane Smith',
    role: 'Lead Teacher',
    img: '/team/jane-smith.jpg',
    bio: 'With over 10 years in early childhood education, Jane creates engaging, play-based learning experiences.',
  },
  {
    name: 'Emily Johnson',
    role: 'Assistant Teacher',
    img: '/team/emily-johnson.jpg',
    bio: 'Emily brings warmth and creativity, helping each child feel safe and inspired.',
  },
  {
    name: 'Carlos Brown',
    role: 'Art Instructor',
    img: '/team/carlos-brown.jpg',
    bio: 'Carlos encourages expressive art projects, fostering imagination and fine motor skills.',
  },
  {
    name: 'Aroha Lee',
    role: 'Music & Movement',
    img: '/team/aroha-lee.jpg',
    bio: 'Aroha leads our joyful music and dance sessions, connecting culture and rhythm.',
  },
  {
    name: 'Nadia Patel',
    role: 'Outdoor Coordinator',
    img: '/team/nadia-patel.jpg',
    bio: 'Nadia guides nature walks and outdoor exploration, building confidence and curiosity.',
  },
  {
    name: 'Liam Walker',
    role: 'Support Staff',
    img: '/team/liam-walker.jpg',
    bio: 'Liam ensures our space is safe, welcoming, and full of fun surprises.',
  },
];

export default function TeamPage() {
  return (
    <main className={styles.team}>
      {/* animated backdrop – client-only */}
      <SkyBackground />

      <section className={styles.content}>
        <h1>Meet the Team</h1>
        <div className={styles.profileGrid}>
          {teamMembers.map((member) => (
            <div key={member.name} className={styles.profileCard}>
              <img
                src={member.img}
                alt={member.name}
                className={styles.profileImage}
                loading="lazy"
              />
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
