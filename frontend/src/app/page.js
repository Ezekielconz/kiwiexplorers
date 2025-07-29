// src/app/page.js
import { getHomePage } from '../lib/strapi';
import styles from '../styles/Home.module.css';

export default async function Home() {
  const data = await getHomePage();

  // If you haven’t created the entry yet, show a friendly prompt
  if (!data) {
    return (
      <main className={styles.main}>
        <p>
          No homepage content found.<br/>
          Go to Strapi Admin → Content Manager → Homepage → Create one and add a heroTitle.
        </p>
      </main>
    );
  }

  // Destructure exactly the field you have
  const { heroTitle } = data;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>{heroTitle}</h1>
      </section>
    </main>
  );
}
