'use client'

import React, { useEffect, useState } from 'react'
import { type Product, type Order } from '@/lib/data'
import { getCurrentUser, ADMIN_EMAIL, isAdmin } from '@/lib/auth'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import styles from './admin.module.css'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser && isAdmin(currentUser.email)) {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  

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
      <>
        <Header />
        <WhatsAppButton />
        <div className={styles.loginPage}>
          <div className={styles.loginCard}>
            <h1>⛔ غير مصرح</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              هذه الصفحة مخصصة للمسؤول فقط ({ADMIN_EMAIL})
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-primary"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <WhatsAppButton />
      <div className={styles.adminPanel}>
        <header className={styles.header}>
          <h1>لوحة تحكم ProDeals</h1>
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
    </>
  )
}
