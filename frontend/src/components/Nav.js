'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'   // ⬅ add usePathname
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Nav.module.css'

export default function Nav({ menuItems, logo }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const router   = useRouter()
  const pathname = usePathname()                           // ← current route

  /* ----- Scroll handler: toggle transparent / solid ----- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ----- Close the drawer on route change ----- */
  useEffect(() => {
    const close = () => setOpen(false)
    router.events?.on('routeChangeStart', close)
    return () => router.events?.off('routeChangeStart', close)
  }, [router])

  /* ----- Helper classes ----- */
  const navStateClass = scrolled ? styles.solid : styles.transparent
  const burgerClass   = `${styles.burger} ${open ? styles.burgerOpen : ''}`
  const listClass     = `${styles.navList} ${open ? styles.navListOpen : ''}`

  return (
    <nav className={`${styles.nav} ${navStateClass}`}>
      {/* ---------- Logo / site title ---------- */}
      <div className={styles.logoWrapper}>
        <Link href="/" onClick={() => setOpen(false)}>
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || 'Site logo'}
              width={120}
              height={40}
              priority
            />
          ) : (
            <span className={styles.siteTitle}>Kiwi Explorers</span>
          )}
        </Link>
      </div>

      {/* ---------- Burger button (mobile) ---------- */}
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className={burgerClass}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className={styles.line1} />
        <div className={styles.line2} />
        <div className={styles.line3} />
      </button>

      {/* ---------- Navigation links ---------- */}
      <ul className={listClass}>
        {menuItems.map(item => {
          const isEnrol = item.label.toLowerCase() === 'enrol'
          /* current page? root link is special-cased */
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          const linkClass = `${isEnrol ? styles.enrolButton : styles.navLink}
                             ${isActive ? styles.activeLink : ''}`

          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={linkClass}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setOpen(false)}
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
