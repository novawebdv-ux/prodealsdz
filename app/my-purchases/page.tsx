'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/Header'
import styles from './purchases.module.css'

interface Purchase {
  id: string
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
      setPurchases(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading purchases:', error)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.email === 'guest@prodeals.dz') {
    return (
      <div className={styles.page}>
        <Header />
        <main className="container">
          <div className={styles.emptyState}>
            <h1 className={styles.pageTitle}>مشترياتي</h1>
            <p className={styles.emptyText}>يرجى تسجيل الدخول بحساب Google لرؤية مشترياتك</p>
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
      
      <main className="container">
        <h1 className={styles.pageTitle}>مشترياتي</h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>لم تقم بشراء أي منتجات بعد</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/products'}>
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className={styles.purchasesGrid}>
            {purchases.map((purchase) => (
              <div key={purchase.id} className={`card ${styles.purchaseCard}`}>
                <div className={styles.productIcon}>✅</div>
                <h3 className={styles.productTitle}>{purchase.productTitle}</h3>
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
