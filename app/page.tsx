'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />

      <main className="container">
        <section className={styles.hero}>
          <h2>مرحباً بك في ProDeals</h2>
          <p>منصة جزائرية رائدة لبيع المنتجات الرقمية</p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-primary">
              تصفح المنتجات
            </Link>
            <Link href="/about" className="btn btn-secondary">
              تعرف علينا
            </Link>
          </div>
        </section>

        <section className={styles.sellerProfile}>
          <div className="card">
            <div className={styles.profileHeader}>
              <Image
                src="/images/logo.png"
                alt="Seller"
                width={100}
                height={100}
                className={styles.sellerAvatar}
                loading="lazy"
              />
              <div className={styles.sellerInfo}>
                <h3>ProDeals Team</h3>
                <p>بائع موثوق | منتجات رقمية عالية الجودة</p>
                <div className={styles.sellerStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>500+</span>
                    <span className={styles.statLabel}>عميل راضي</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>4.9</span>
                    <span className={styles.statLabel}>⭐ تقييم</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>100+</span>
                    <span className={styles.statLabel}>منتج</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.profileDescription}>
              <h4>نبذة عن البائع</h4>
              <p>
                نحن فريق محترف متخصص في تقديم أفضل المنتجات الرقمية للسوق الجزائري.
                نلتزم بالجودة العالية والخدمة الممتازة لجميع عملائنا.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <h3>لماذا تختار ProDeals؟</h3>
          <div className="grid grid-3">
            <div className="card">
              <div className={styles.featureIcon}>🎯</div>
              <h4>منتجات عالية الجودة</h4>
              <p>نقدم أفضل المنتجات الرقمية المختارة بعناية</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>⚡</div>
              <h4>تسليم فوري</h4>
              <p>احصل على منتجاتك فوراً بعد الدفع</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>💎</div>
              <h4>دعم متواصل</h4>
              <p>فريق الدعم متاح دائماً لمساعدتك</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 ProDeals — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}