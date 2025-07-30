// components/PageWrapper.js
'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function PageWrapper({ children }) {
  const pathname = usePathname()
  return (
    <>
      {children}
      {pathname !== '/' && <Footer />}
    </>
  )
}
