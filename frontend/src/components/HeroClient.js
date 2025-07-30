'use client'

import { motion } from 'framer-motion'
import Link       from 'next/link'
import styles     from '../styles/Home.module.css'

export default function HeroClient({
  heroTitle,
  heroSubtitle,
  primaryButton,
  secondaryButton,
}) {
  return (
    <section className={styles.hero}>
      {/* Headline */}
      <motion.h1
        className={`${styles.title} atma-bold`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {heroTitle}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className={styles.sub}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {heroSubtitle}
      </motion.p>

      {/* Buttons */}
      <div className={styles.buttonGroup}>
        {secondaryButton?.url && (
          <Link
            href={secondaryButton.url}
            className={styles.secondaryButton}
          >
            {secondaryButton.label}
          </Link>
        )}

        {primaryButton?.url && (
          <motion.a
            href={primaryButton.url}
            className={styles.cta}
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            {primaryButton.label}
          </motion.a>
        )}
      </div>
    </section>
  )
}
