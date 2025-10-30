
'use client'

import React from 'react'
import Header from '@/components/Header'
import GoogleLogin from '@/components/GoogleLogin'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />
      
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>تسجيل الدخول</h1>
          <p>سجل الدخول للوصول إلى جميع ميزات الموقع</p>
          <div className={styles.loginForm}>
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  )
}
