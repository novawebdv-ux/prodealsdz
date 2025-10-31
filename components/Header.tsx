
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCurrentUser, setCurrentUser, isAdmin } from '@/lib/auth'
import styles from './Header.module.css'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileMenu])

  const handleLogout = () => {
    setCurrentUser(null)
    setUser(null)
    setShowMobileMenu(false)
    router.push('/')
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/logo.png"
                alt="ProDeals Logo"
                width={60}
                height={60}
                className={styles.logo}
                priority
              />
            </div>
            <div className={styles.brandText}>
              <h1>ProDeals</h1>
              <p>منصة جزائرية للمنتجات الرقمية</p>
            </div>
          </Link>

          {/* زر الهامبرغر للموبايل */}
          <button 
            className={styles.hamburger}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="القائمة"
          >
            <span className={showMobileMenu ? styles.hamburgerActive : ''}></span>
            <span className={showMobileMenu ? styles.hamburgerActive : ''}></span>
            <span className={showMobileMenu ? styles.hamburgerActive : ''}></span>
          </button>

          {/* القائمة للشاشات الكبيرة */}
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink} prefetch={true}>الرئيسية</Link>
            <Link href="/products" className={styles.navLink} prefetch={true}>المنتجات</Link>
            <Link href="/about" className={styles.navLink} prefetch={true}>حولنا</Link>
            <Link href="/contact" className={styles.navLink} prefetch={true}>اتصل بنا</Link>
            {user && user.email !== 'guest@prodeals.dz' && (
              <Link href="/my-purchases" className={styles.navLink} prefetch={true}>مشترياتي</Link>
            )}
            {user && isAdmin(user.email) && (
              <Link href="/admin" className={styles.navLink} prefetch={true}>لوحة التحكم</Link>
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
              <Link href="/login" className="btn btn-primary" prefetch={true}>
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* القائمة الجانبية للموبايل */}
        {showMobileMenu && (
          <>
            <div 
              className={styles.overlay}
              onClick={closeMobileMenu}
            />
            <div className={styles.mobileMenu}>
              <div className={styles.mobileMenuHeader}>
                <h2>القائمة</h2>
                <button 
                  className={styles.closeButton}
                  onClick={closeMobileMenu}
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>

              <nav className={styles.mobileNav}>
                <div className={styles.mobileNavSection}>
                  <h3 className={styles.sectionTitle}>التصفح</h3>
                  <Link href="/" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                    <span className={styles.navIcon}>🏠</span>
                    <span>الرئيسية</span>
                  </Link>
                  <Link href="/products" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                    <span className={styles.navIcon}>🛍️</span>
                    <span>المنتجات</span>
                  </Link>
                  <Link href="/about" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                    <span className={styles.navIcon}>ℹ️</span>
                    <span>حولنا</span>
                  </Link>
                  <Link href="/contact" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                    <span className={styles.navIcon}>📞</span>
                    <span>اتصل بنا</span>
                  </Link>
                  {user && user.email !== 'guest@prodeals.dz' && (
                    <Link href="/my-purchases" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                      <span className={styles.navIcon}>📦</span>
                      <span>مشترياتي</span>
                    </Link>
                  )}
                </div>

                {user && isAdmin(user.email) && (
                  <>
                    <div className={styles.mobileMenuDivider}></div>
                    <div className={styles.mobileNavSection}>
                      <h3 className={styles.sectionTitle}>الإدارة</h3>
                      <Link href="/admin" className={styles.mobileNavLink} onClick={closeMobileMenu} prefetch={true}>
                        <span className={styles.navIcon}>⚙️</span>
                        <span>لوحة التحكم</span>
                      </Link>
                    </div>
                  </>
                )}

                <div className={styles.mobileMenuDivider}></div>

                {user ? (
                  <div className={styles.mobileUserSection}>
                    <h3 className={styles.sectionTitle}>الحساب</h3>
                    <div className={styles.mobileUserInfo}>
                      {user.picture && (
                        <Image src={user.picture} alt={user.name} width={48} height={48} style={{ borderRadius: '50%' }} />
                      )}
                      <div>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', marginTop: '14px', marginLeft: '6px', marginRight: '6px' }}>
                      🚪 تسجيل الخروج
                    </button>
                  </div>
                ) : (
                  <div className={styles.mobileNavSection}>
                    <h3 className={styles.sectionTitle}>الحساب</h3>
                    <Link href="/login" className="btn btn-primary" onClick={closeMobileMenu} prefetch={true} style={{ width: '100%', marginLeft: '6px', marginRight: '6px' }}>
                      🔐 تسجيل الدخول
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
    </header>
  )
}
