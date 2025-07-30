'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

/**
 * Hero section that sits in front of the site-wide SkyBackground.
 * No clouds or vehicles here—those come from SkyBackground,
 * which is mounted once in app/layout.js.
 */
export default function HeroClient({ heroTitle }) {
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

      {/* Sub-line */}
      <motion.p
        className={styles.sub}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Where little explorers learn&nbsp;&amp; grow every day!
      </motion.p>

      {/* Buttons */}
      <div className={styles.buttonGroup}>
        <Link href="/about" className={styles.secondaryButton}>
          Discover
        </Link>
        <motion.a
          href="/enrol"
          className={styles.cta}
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          Enrol&nbsp;Now
        </motion.a>
      </div>
    </section>
  );
}
