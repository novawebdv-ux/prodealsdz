'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <main className="container">
        <section className={styles.hero}>
          <h2>مرحباً بك في ProDeals</h2>
          <p>منصة جزائرية رائدة لبيع المنتجات الرقمية</p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-primary" prefetch={true}>
              تصفح المنتجات
            </Link>
            <Link href="/about" className="btn btn-secondary" prefetch={true}>
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
                <div className={styles.socialLinks}>
                  <a 
                    href="https://www.instagram.com/pro_dealsdz?igsh=cnoyenQwYmF1dWw2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.socialCard} ${styles.instagram}`}
                  >
                    <div className={styles.cardGlow}></div>
                    <div className={styles.socialIconCircle}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                      </svg>
                    </div>
                    <div className={styles.socialContent}>
                      <h4>Instagram</h4>
                      <p>@pro_dealsdz</p>
                      <span className={styles.followButton}>تابعنا الآن →</span>
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.tiktok.com/@pro_dealsdzz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.socialCard} ${styles.tiktok}`}
                  >
                    <div className={styles.cardGlow}></div>
                    <div className={styles.socialIconCircle}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <div className={styles.socialContent}>
                      <h4>TikTok</h4>
                      <p>@pro_dealsdzz</p>
                      <span className={styles.followButton}>تابعنا الآن →</span>
                    </div>
                  </a>
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