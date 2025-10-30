
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getCurrentUser, setCurrentUser, isAdmin } from '@/lib/auth'
import styles from './Header.module.css'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={styles.logoWrapper}
            >
              <Image
                src="/images/logo.png"
                alt="ProDeals Logo"
                width={60}
                height={60}
                className={styles.logo}
                priority
              />
            </motion.div>
            <div className={styles.brandText}>
              <h1>ProDeals</h1>
              <p>منصة جزائرية للمنتجات الرقمية</p>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>الرئيسية</Link>
            <Link href="/products" className={styles.navLink}>المنتجات</Link>
            <Link href="/about" className={styles.navLink}>حولنا</Link>
            <Link href="/contact" className={styles.navLink}>اتصل بنا</Link>
            {user && isAdmin(user.email) && (
              <Link href="/admin" className={styles.navLink}>لوحة التحكم</Link>
            )}
            
            {user ? (
              <div className={styles.userMenu}>
                <button 
                  className={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.picture && (
                    <Image src={user.picture} alt={user.name} width={32} height={32} style={{ borderRadius: '50%' }} />
                  )}
                  <span>{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className={styles.dropdown}>
                    <button onClick={handleLogout} className="btn btn-danger">
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary">
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
