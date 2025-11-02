import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'ProDeals - منصة المنتجات الرقمية',
  description: 'منصة جزائرية لبيع المنتجات الرقمية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
