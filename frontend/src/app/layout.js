// app/layout.js
import { Geist, Geist_Mono, Atma } from 'next/font/google'
import './globals.css'

import Nav                      from '@/components/Nav'
import SkyBackground            from '@/components/SkyBackground'
import PageWrapper              from '@/components/PageWrapper'
import { RouteTransitionProvider } from '@/contexts/RouteTransitionContext'

import { getMenuItems, getNavigationLogo } from '@/lib/strapi'

/* fonts */
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const atma      = Atma({
  variable: '--font-atma',
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  display: 'swap',
})

export const metadata = {
  title: 'Kiwi Explorers',
  description: 'Where little explorers learn and grow every day',
}

export default async function RootLayout({ children }) {
  const [menuItems, logo] = await Promise.all([
    getMenuItems(),
    getNavigationLogo(),
  ])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${atma.variable} antialiased`}
      >
        <RouteTransitionProvider>
          {/* 🔵 Backdrop: clouds + vehicles */}
          <SkyBackground />

          {/* Navigation */}
          <Nav menuItems={menuItems} logo={logo} />

          {/* Page content + conditional footer */}
          <PageWrapper>
            {children}
          </PageWrapper>
        </RouteTransitionProvider>
      </body>
    </html>
  )
}
