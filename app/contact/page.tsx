
'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './contact.module.css'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // يمكن إضافة منطق إرسال الرسالة هنا
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />

      <main className="container">
        <div className={styles.contactHeader}>
          <h1>اتصل بنا</h1>
          <p>نحن هنا للإجابة على استفساراتك</p>
        </div>

        <div className="grid grid-2">
          <div>
            <div className="card">
              <h2>معلومات الاتصال</h2>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📧</span>
                  <div>
                    <h3>البريد الإلكتروني</h3>
                    <p>madimoh44@gmail.com</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📱</span>
                  <div>
                    <h3>واتساب</h3>
                    <p>+213 XXX XXX XXX</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>🕒</span>
                  <div>
                    <h3>ساعات العمل</h3>
                    <p>السبت - الخميس: 9:00 - 18:00</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📍</span>
                  <div>
                    <h3>الموقع</h3>
                    <p>الجزائر</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h2>أرسل لنا رسالة</h2>
              {submitted && (
                <div className={styles.successMessage}>
                  ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                </div>
              )}
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label>الاسم الكامل</label>
                  <input type="text" required />
                </div>
                <div className={styles.formGroup}>
                  <label>البريد الإلكتروني</label>
                  <input type="email" required />
                </div>
                <div className={styles.formGroup}>
                  <label>رقم الهاتف</label>
                  <input type="tel" required />
                </div>
                <div className={styles.formGroup}>
                  <label>الموضوع</label>
                  <input type="text" required />
                </div>
                <div className={styles.formGroup}>
                  <label>الرسالة</label>
                  <textarea rows={5} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 ProDeals — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
