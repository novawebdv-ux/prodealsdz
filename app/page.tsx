'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { supabase, type Product } from '@/lib/supabase'
import SetupNotice from '@/components/SetupNotice'
import styles from './page.module.css'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
    }
  }

  const addToCart = (product: Product) => {
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
      customer_name: formData.get('name') as string,
      customer_email: formData.get('email') as string,
      customer_phone: formData.get('phone') as string,
      products: cart,
      total: getTotal(),
      status: 'pending' as const,
    }

    const { error } = await supabase.from('orders').insert([order])

    if (!error) {
      alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.')
      setCart([])
      setShowCheckout(false)
      setShowCart(false)
    } else {
      alert('حدث خطأ، يرجى المحاولة مرة أخرى')
    }
  }

  return (
    <div className={styles.page}>
      <SetupNotice />
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <motion.div
              className={styles.brand}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={styles.logoWrapper}
              >
                <Image
                  src="/images/logo.png"
                  alt="ProDeals Logo"
                  width={80}
                  height={80}
                  className={styles.logo}
                  priority
                />
              </motion.div>
              <div className={styles.brandText}>
                <h1>ProDeals</h1>
                <p>منصة جزائرية للمنتجات الرقمية</p>
              </div>
            </motion.div>

            <nav className={styles.nav}>
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
            </nav>
          </div>
        </div>
      </header>

      <main className="container">
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>أفضل المنتجات الرقمية — بسيطة، أنيقة، وعملية</h2>
          <p>منتجات رقمية عالية الجودة لمبدعي المحتوى والمطورين</p>
        </motion.section>

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
                <input type="text" name="name" required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>البريد الإلكتروني</label>
                <input type="email" name="email" required />
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
