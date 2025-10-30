'use client'

import React, { useEffect, useState } from 'react'
import { type Product, type Order, DEFAULT_ADMIN } from '@/lib/data'
import styles from './admin.module.css'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('prodeals_admin_logged_in')
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true)
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('prodeals_admin_logged_in', 'true')
      }
    } else {
      alert('بيانات تسجيل الدخول غير صحيحة')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('prodeals_admin_logged_in')
    }
  }

  function fetchData() {
    if (typeof window === 'undefined') return

    if (activeTab === 'products') {
      const stored = localStorage.getItem('prodeals_products')
      if (stored) {
        setProducts(JSON.parse(stored))
      }
    } else if (activeTab === 'orders') {
      const stored = localStorage.getItem('prodeals_orders')
      if (stored) {
        setOrders(JSON.parse(stored))
      }
    }
  }

  function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const productData: Product = {
      id: editingProduct?.id || 'prod_' + Date.now(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    }

    let updatedProducts: Product[]
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? productData : p
      )
    } else {
      updatedProducts = [...products, productData]
    }

    localStorage.setItem('prodeals_products', JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
    setShowProductModal(false)
    setEditingProduct(null)
  }

  function handleDeleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updatedProducts = products.filter((p) => p.id !== id)
      localStorage.setItem('prodeals_products', JSON.stringify(updatedProducts))
      setProducts(updatedProducts)
    }
  }

  function handleOrderStatus(id: string, status: 'confirmed' | 'rejected') {
    const updatedOrders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    )
    localStorage.setItem('prodeals_orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <h1>لوحة تحكم الأدمن</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
            البريد: {DEFAULT_ADMIN.email}<br />
            كلمة المرور: {DEFAULT_ADMIN.password}
          </p>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminPanel}>
      <header className={styles.header}>
        <h1>لوحة تحكم ProDeals</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </header>

      <div className={styles.tabs}>
        <button
          className={activeTab === 'orders' ? styles.activeTab : ''}
          onClick={() => setActiveTab('orders')}
        >
          الطلبات
        </button>
        <button
          className={activeTab === 'products' ? styles.activeTab : ''}
          onClick={() => setActiveTab('products')}
        >
          المنتجات
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'orders' && (
          <div>
            <h2>إدارة الطلبات</h2>
            {orders.length === 0 ? (
              <p>لا توجد طلبات حالياً</p>
            ) : (
              <div className={styles.ordersGrid}>
                {orders.map((order) => (
                  <div key={order.id} className={`card ${styles.orderCard}`}>
                    <div className={styles.orderHeader}>
                      <h3>{order.customer_name}</h3>
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status === 'pending' && 'قيد الانتظار'}
                        {order.status === 'confirmed' && 'مؤكد'}
                        {order.status === 'rejected' && 'مرفوض'}
                      </span>
                    </div>
                    <p>البريد: {order.customer_email}</p>
                    <p>الهاتف: {order.customer_phone}</p>
                    <p>الإجمالي: {order.total.toLocaleString()} دج</p>
                    <div className={styles.orderProducts}>
                      <strong>المنتجات:</strong>
                      <ul>
                        {order.products.map((p, i) => (
                          <li key={i}>{p.title}</li>
                        ))}
                      </ul>
                    </div>
                    {order.status === 'pending' && (
                      <div className={styles.orderActions}>
                        <button
                          className="btn btn-success"
                          onClick={() => handleOrderStatus(order.id, 'confirmed')}
                        >
                          تأكيد
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleOrderStatus(order.id, 'rejected')}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>إدارة المنتجات</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowProductModal(true)}
              >
                + إضافة منتج جديد
              </button>
            </div>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.id} className="card">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p className={styles.price}>{product.price.toLocaleString()} دج</p>
                  <div className={styles.productActions}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingProduct(product)
                        setShowProductModal(true)
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showProductModal && (
        <div className="modal-overlay" onClick={() => {
          setShowProductModal(false)
          setEditingProduct(null)
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className={styles.formGroup}>
                <label>اسم المنتج</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingProduct?.title}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>الوصف</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>السعر (دج)</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
                  }}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
