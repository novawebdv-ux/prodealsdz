'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './purchases.module.css'

interface Purchase {
  id: number
  productTitle: string
  downloadLink: string | null
  purchasedAt: string
}

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    if (currentUser && currentUser.email !== 'guest@prodeals.dz') {
      loadPurchases(currentUser.email)
    } else {
      setLoading(false)
    }
  }, [])

  async function loadPurchases(email: string) {
    try {
      const res = await fetch(`/api/purchases?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setPurchases(data)
    } catch (error) {
      console.error('Error loading purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.email === 'guest@prodeals.dz') {
    return (
      <div className={styles.page}>
        <Header />
        <WhatsAppButton />
        <main className="container">
          <div className={styles.emptyState}>
            <h1>مشترياتي</h1>
            <p>يرجى تسجيل الدخول بحساب Google لرؤية مشترياتك</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
              تسجيل الدخول
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />
      
      <main className="container">
        <h1>مشترياتي</h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className={styles.emptyState}>
            <p>لم تقم بشراء أي منتجات بعد</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/products'}>
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className={styles.purchasesGrid}>
            {purchases.map((purchase) => (
              <div key={purchase.id} className={`card ${styles.purchaseCard}`}>
                <div className={styles.productIcon}>✅</div>
                <h3>{purchase.productTitle}</h3>
                <p className={styles.date}>
                  تاريخ الشراء: {new Date(purchase.purchasedAt).toLocaleDateString('ar-DZ')}
                </p>
                {purchase.downloadLink ? (
                  <a 
                    href={purchase.downloadLink} 
                    className="btn btn-primary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📥 تحميل المنتج
                  </a>
                ) : (
                  <p className={styles.noLink}>الرابط غير متوفر حالياً</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
