'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import BuyModal from '@/components/BuyModal'
import styles from './products.module.css'

interface Product {
  id: string
  title: string
  description: string
  price: number
  downloadLink?: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  return (
    <div className={styles.page}>
      <Header />
      <WhatsAppButton />

      <main className="container">
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
            <div
              key={product.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleBuyClick(product)}
            >
              <div className={styles.productThumb}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className={styles.imagePlaceholder}>📦</div>
                )}
              </div>
              <h3>{product.title}</h3>
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
    </div>
  )
}
