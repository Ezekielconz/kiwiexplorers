// app/page.js
import { getHomePage } from '@/lib/strapi'
import HeroClient      from '@/components/HeroClient'
import styles          from '../styles/Home.module.css'

export default async function Home() {
  const data = await getHomePage()
  if (!data) return <p>No homepage content found.</p>

  const {
    heroTitle,
    heroSubtitle,
    primaryButtonLabel,
    primaryButtonUrl,
    secondaryButtonLabel,
    secondaryButtonUrl,
  } = data

  return (
    <main className={styles.main}>
      <HeroClient
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        primaryButton={{ label: primaryButtonLabel, url: primaryButtonUrl }}
        secondaryButton={{ label: secondaryButtonLabel, url: secondaryButtonUrl }}
      />
    </main>
  )
}
