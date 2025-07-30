// app/layout.js
import { Geist, Geist_Mono, Atma } from 'next/font/google'
import './globals.css'

import Nav                       from '@/components/Nav'
import SkyBackground             from '@/components/SkyBackground'
import PageWrapper               from '@/components/PageWrapper'
import { RouteTransitionProvider } from '@/contexts/RouteTransitionContext'

import { getMenuItems, getNavigationLogo } from '@/lib/strapi'

/* ─────────── Fonts ─────────── */
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const atma      = Atma({
  variable: '--font-atma',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

/* ─────────── Metadata ─────────── */
export const metadata = {
  title:       'Kiwi Explorers',
  description: 'Where little explorers learn and grow every day',
}

/* ─────────── Revalidation (ISR) ─────────── */
export const revalidate = 60     // ⬅︎ affects every route below this layout

/* ─────────── Layout ─────────── */
export default async function RootLayout({ children }) {
  const [menuItems, logo] = await Promise.all([
    getMenuItems(),
    getNavigationLogo(),
  ])

  return (
    <html lang="en">
      <body
        className={`site antialiased
          ${geistSans.variable} ${geistMono.variable} ${atma.variable}`}
      >
        <RouteTransitionProvider>
          {/* backdrop */}
          <SkyBackground />

          {/* navigation */}
          <Nav menuItems={menuItems} logo={logo} />

          {/* page content */}
          <main className="grow">
            <PageWrapper>{children}</PageWrapper>
          </main>

          {/* footer (inside RouteTransitionProvider so it can animate) */}
          <footer className="py-6 text-center text-sm opacity-80">
            © {new Date().getFullYear()} Kiwi Explorers
          </footer>
        </RouteTransitionProvider>
      </body>
    </html>
  )
}
