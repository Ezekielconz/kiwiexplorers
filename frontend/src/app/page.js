// app/page.js
import { getHomePage } from '@/lib/strapi';
import HeroClient      from '@/components/HeroClient';
import styles          from '../styles/Home.module.css';

export default async function Home() {
  const data = await getHomePage();
  return (
    <main className={styles.main}>
      {data ? <HeroClient heroTitle={data.heroTitle} /> : <p>No homepage content found.</p>}
    </main>
  );
}
