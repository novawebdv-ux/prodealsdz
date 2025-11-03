'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="مسار التصفح">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {item.href && index < items.length - 1 ? (
              <>
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
                <span className={styles.separator}>›</span>
              </>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
