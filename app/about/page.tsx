
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './about.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />

      <main className="container">
        <motion.div
          className={styles.aboutHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>من نحن</h1>
          <p>تعرف على قصتنا ورؤيتنا</p>
        </motion.div>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <h2>قصتنا</h2>
            <p>
              ProDeals هي منصة جزائرية رائدة في مجال المنتجات الرقمية. بدأنا رحلتنا برؤية واضحة:
              توفير أفضل المنتجات الرقمية للسوق الجزائري بأسعار منافسة وجودة عالية.
            </p>
            <p>
              نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع، ونعمل جاهدين لتحقيق هذا الهدف
              من خلال منصتنا الإلكترونية السهلة الاستخدام.
            </p>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card">
            <h2>رؤيتنا</h2>
            <p>
              أن نكون المنصة الأولى والأكثر موثوقية للمنتجات الرقمية في الجزائر، ونساهم في
              تطوير السوق الرقمي المحلي.
            </p>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card">
            <h2>قيمنا</h2>
            <div className="grid grid-2">
              <div>
                <h3>🎯 الجودة</h3>
                <p>نختار منتجاتنا بعناية فائقة</p>
              </div>
              <div>
                <h3>🤝 الثقة</h3>
                <p>نبني علاقات طويلة الأمد مع عملائنا</p>
              </div>
              <div>
                <h3>⚡ السرعة</h3>
                <p>تسليم فوري وخدمة سريعة</p>
              </div>
              <div>
                <h3>💎 الابتكار</h3>
                <p>نتطور باستمرار لتلبية احتياجاتكم</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 ProDeals — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
