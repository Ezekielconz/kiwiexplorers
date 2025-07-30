// src/components/Nav.js
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Nav.module.css'

export default function Nav({ menuItems, logo }) {
  return (
    <nav className={styles.nav}>
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
                className={isEnrol ? styles.enrolButton : styles.navLink}
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
