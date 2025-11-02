
import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
          © 2025 ProDeals — جميع الحقوق محفوظة
        </p>
        <p className={styles.developer}>
          Developed by <span className={styles.novaweb}>NovaWeb</span>
        </p>
      </div>
    </footer>
  )
}
