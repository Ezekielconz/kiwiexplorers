'use client';
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Nav.module.css'

export default function Nav({ menuItems, logo }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`${styles.nav} ${
        scrolled ? styles.solid : styles.transparent
      }`}
    >
      <div className={styles.logoWrapper}>
        <Link href="/">
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || 'Logo'}
              width={120}
              height={40}
            />
          ) : (
            <span className={styles.siteTitle}>Kiwi Explorers</span>
          )}
        </Link>
      </div>

      <ul className={styles.navList}>
        {menuItems.map(item => {
          const isEnrol = item.label.toLowerCase() === 'enrol'
          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={
                  isEnrol ? styles.enrolButton : styles.navLink
                }
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
