// src/app/page.js
import { getHomePage } from '@/lib/strapi';
import HeroClient from '@/components/HeroClient';
import styles from '../styles/Home.module.css';

export default async function Home() {
  const data = await getHomePage();
  if (!data) {
    return (
      <main className={styles.main}>
        <p>No homepage content found in Strapi.</p>
      </main>
    );
  }
  return (
    <main className={styles.main}>
      <HeroClient heroTitle={data.heroTitle} />
      {/* … your programs section … */}
    </main>
  );
}
