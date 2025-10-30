
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { type Product, INITIAL_PRODUCTS } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './products.module.css'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadProducts()
    setUser(getCurrentUser())
  }, [])

  function loadProducts() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('prodeals_products')
      if (stored) {
        setProducts(JSON.parse(stored))
      } else {
        localStorage.setItem('prodeals_products', JSON.stringify(INITIAL_PRODUCTS))
        setProducts(INITIAL_PRODUCTS)
      }
    }
  }

  const addToCart = (product: Product) => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً')
      window.location.href = '/login'
      return
    }
    if (user.email === 'guest@prodeals.dz') {
      alert('الزوار لا يمكنهم الشراء. يرجى تسجيل الدخول بحساب جوجل.')
      return
    }
    setCart([...cart, product])
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const order = {
      id: 'order_' + Date.now(),
      customer_name: formData.get('name') as string,
      customer_email: user?.email || '',
      customer_phone: formData.get('phone') as string,
      products: cart,
      total: getTotal(),
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('prodeals_orders') || '[]')
      orders.push(order)
      localStorage.setItem('prodeals_orders', JSON.stringify(orders))
    }

    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.')
    setCart([])
    setShowCheckout(false)
    setShowCart(false)
  }

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
          <button
            className="btn btn-secondary"
            onClick={() => setShowCart(true)}
          >
            السلة ({cart.length})
          </button>
        </div>

        <section className={`grid grid-3 ${styles.products}`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.productThumb}>
                {product.title.split(' ')[0]}
              </div>
              <h3>{product.title}</h3>
              <p className={styles.productDesc}>{product.description}</p>
              <div className={styles.price}>
                {product.price.toLocaleString()} دج
              </div>
              <div className={styles.actions}>
                <button
                  className="btn btn-secondary"
                  onClick={() => addToCart(product)}
                >
                  أضف للسلة
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addToCart(product)
                    setShowCart(true)
                  }}
                >
                  اشترِ الآن
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>سلة المشتريات</h2>
            <div style={{ marginTop: '20px' }}>
              {cart.length === 0 ? (
                <p>السلة فارغة</p>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {item.price.toLocaleString()} دج
                      </div>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))
              )}
            </div>
            <div
              style={{
                marginTop: '20px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              الإجمالي: {getTotal().toLocaleString()} دج
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                gap: '10px',
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setShowCart(false)}
              >
                إغلاق
              </button>
              {cart.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowCart(false)
                    setShowCheckout(true)
                  }}
                >
                  إتمام الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div
          className="modal-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>إتمام الطلب</h2>
            <form onSubmit={handleCheckout} style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label>الاسم الكامل</label>
                <input type="text" name="name" defaultValue={user?.name} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>رقم الهاتف</label>
                <input type="tel" name="phone" required />
              </div>
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  سيتم التواصل معك لإتمام عملية الدفع
                </p>
              </div>
              <div
                style={{ marginTop: '20px', display: 'flex', gap: '10px' }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCheckout(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  إرسال الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2025 ProDeals — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
