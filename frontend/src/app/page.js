// src/app/page.js
import { getHomePage } from '@/lib/strapi'
import styles from '../styles/Home.module.css'

export default async function Home() {
  const data = await getHomePage()

  if (!data) {
    return (
      <main className={styles.main}>
        <p>
          No homepage content found.<br />
          Go to Strapi Admin → Content Manager → Homepage → Create one and add
          a heroTitle.
        </p>
      </main>
    )
  }

  const { heroTitle } = data

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>{heroTitle}</h1>
      </section>
    </main>
  )
}
