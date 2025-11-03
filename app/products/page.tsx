'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/Header'
import BuyModal from '@/components/BuyModal'
import Breadcrumbs from '@/components/Breadcrumbs'
import styles from './products.module.css'

interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string | null
  postPurchaseContent?: string | null
  discountPrice?: number | null
  discountEndDate?: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
    setUser(getCurrentUser())
  }, [])

  async function loadProducts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    }
  }

  const handleBuyClick = (product: Product) => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      window.location.href = '/login'
      return
    }
    if (user.email === 'guest@prodeals.dz') {
      alert('الزوار لا يمكنهم الشراء. يرجى تسجيل الدخول بحساب Google.')
      return
    }
    setSelectedProduct(product)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateDaysRemaining = (endDate: string): number => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className="container">
        <Breadcrumbs items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المنتجات' }
        ]} />
        
        <div className={styles.pageHeader}>
          <h1>المنتجات الرقمية</h1>
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            className={styles.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section className={`grid grid-3 ${styles.products}`}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <div className={styles.productThumb}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className={styles.imagePlaceholder}>📦</div>
                )}
              </div>
              <h3>{product.title}</h3>
              <p className={styles.productDesc}>
                {product.description.length > 80
                  ? product.description.substring(0, 80) + '...'
                  : product.description}
              </p>
              {product.discountPrice && product.discountEndDate && new Date(product.discountEndDate) > new Date() ? (
                <div className={styles.priceSection}>
                  <div className={styles.discountBadge}>
                    🏷️ {Math.round((1 - product.discountPrice / product.price) * 100)}% تخفيض
                  </div>
                  <div className={styles.daysRemaining}>
                    ⏰ باقي {calculateDaysRemaining(product.discountEndDate)} {calculateDaysRemaining(product.discountEndDate) === 1 ? 'يوم' : 'أيام'}
                  </div>
                  <div className={styles.prices}>
                    <span className={styles.originalPrice}>{product.price.toLocaleString('ar-DZ')} دج</span>
                    <span className={styles.discountPrice}>{product.discountPrice.toLocaleString('ar-DZ')} دج</span>
                  </div>
                </div>
              ) : (
                <div className={styles.price}>{product.price.toLocaleString('ar-DZ')} دج</div>
              )}
              <div className={styles.actions}>
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBuyClick(product)
                  }}
                >
                  🛒 شراء الآن
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDetailsProduct(product)
                  }}
                >
                  📋 التفاصيل
                </button>
              </div>
            </div>
          ))}
        </section>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm ? 'لم يتم العثور على منتجات' : 'لا توجد منتجات حالياً'}
          </div>
        )}
      </main>

      {selectedProduct && user && (
        <BuyModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          customerEmail={user.email}
          customerName={user.name}
        />
      )}

      {detailsProduct && (
        <div className={styles.modal} onClick={() => setDetailsProduct(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDetailsProduct(null)}>
              ✕
            </button>
            <div className={styles.modalBody}>
              {detailsProduct.imageUrl && (
                <div className={styles.modalImage}>
                  <img src={detailsProduct.imageUrl} alt={detailsProduct.title} />
                </div>
              )}
              <h2>{detailsProduct.title}</h2>
              {detailsProduct.discountPrice && detailsProduct.discountEndDate && new Date(detailsProduct.discountEndDate) > new Date() ? (
                <div className={styles.modalPriceSection}>
                  <div className={styles.discountBadge}>
                    🏷️ {Math.round((1 - detailsProduct.discountPrice / detailsProduct.price) * 100)}% تخفيض
                  </div>
                  <div className={styles.daysRemaining}>
                    ⏰ باقي {calculateDaysRemaining(detailsProduct.discountEndDate)} {calculateDaysRemaining(detailsProduct.discountEndDate) === 1 ? 'يوم' : 'أيام'}
                  </div>
                  <div className={styles.modalPrices}>
                    <span className={styles.modalOriginalPrice}>{detailsProduct.price.toLocaleString('ar-DZ')} دج</span>
                    <span className={styles.modalDiscountPrice}>{detailsProduct.discountPrice.toLocaleString('ar-DZ')} دج</span>
                  </div>
                </div>
              ) : (
                <div className={styles.modalPrice}>
                  {detailsProduct.price.toLocaleString('ar-DZ')} دج
                </div>
              )}
              <div className={styles.modalDescription}>
                <h3>الوصف</h3>
                <p>{detailsProduct.description}</p>
              </div>
              <div className={styles.modalActions}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setDetailsProduct(null)
                    handleBuyClick(detailsProduct)
                  }}
                  style={{ width: '100%' }}
                >
                  🛒 شراء الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
