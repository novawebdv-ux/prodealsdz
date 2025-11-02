'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser, isAdmin, clearAdminCache } from '@/lib/auth'
import Header from '@/components/Header'
import styles from './admin.module.css'

interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string | null
  downloadLink?: string | null
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  productTitle: string
  productPrice: number
  total: number
  status: string
  receiptImageUrl: string | null
  rejectionReason: string | null
  createdAt: string
}

interface Settings {
  ccpNumber: string
  ccpName: string
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'admins'>('orders')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [settings, setSettings] = useState<Settings>({ ccpNumber: '', ccpName: '' })
  const [ccpNumber, setCcpNumber] = useState('')
  const [ccpName, setCcpName] = useState('')
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null)
  
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    async function checkAuth() {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.email)
        setIsAuthenticated(adminStatus)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  async function fetchData() {
    try {
      if (activeTab === 'products') {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders')
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } else if (activeTab === 'settings') {
        const res = await fetch('/api/settings')
        const data = await res.json()
        setSettings(data || { ccpNumber: '', ccpName: '' })
        setCcpNumber(data?.ccpNumber || '')
        setCcpName(data?.ccpName || '')
      } else if (activeTab === 'admins') {
        const res = await fetch('/api/admins')
        const data = await res.json()
        setAdminEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let imageUrl = editingProduct?.imageUrl || null

    if (productImage) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', productImage)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })
      
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        imageUrl = url
      }
    }

    const productData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseInt(formData.get('price') as string),
      imageUrl: imageUrl,
      downloadLink: formData.get('downloadLink') as string || null,
    }

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
    }

    setShowProductModal(false)
    setEditingProduct(null)
    setProductImage(null)
    setProductImagePreview(null)
    fetchData()
  }

  async function handleDeleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchData()
    }
  }

  async function handleConfirmOrder(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    })
    fetchData()
    alert('✅ تم تأكيد الطلبية بنجاح!')
  }

  function openRejectModal(id: string) {
    setRejectingOrderId(id)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  async function handleRejectOrder() {
    if (!rejectionReason.trim()) {
      alert('يرجى كتابة سبب الرفض')
      return
    }

    await fetch(`/api/orders/${rejectingOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'rejected',
        rejectionReason: rejectionReason 
      }),
    })
    
    setShowRejectModal(false)
    setRejectingOrderId(null)
    setRejectionReason('')
    fetchData()
    alert('❌ تم رفض الطلبية')
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الطلبية؟')) {
      return
    }

    await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })
    
    fetchData()
    alert('✅ تم حذف الطلبية بنجاح!')
  }

  async function handleSettingsUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const settingsData = {
      ccpNumber: ccpNumber,
      ccpName: ccpName,
    }

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    })

    if (res.ok) {
      const updatedSettings = await res.json()
      setSettings(updatedSettings)
      setCcpNumber(updatedSettings.ccpNumber)
      setCcpName(updatedSettings.ccpName)
      alert('✅ تم تحديث الإعدادات بنجاح!')
    } else {
      alert('❌ فشل في تحديث الإعدادات')
    }
  }

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      alert('❌ يرجى إدخال بريد إلكتروني صحيح')
      return
    }

    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newAdminEmail.trim() })
    })

    if (res.ok) {
      const { clearAdminCache } = await import('@/lib/auth')
      clearAdminCache()
      alert('✅ تم إضافة المسؤول بنجاح!')
      setNewAdminEmail('')
      fetchData()
    } else {
      alert('❌ فشل في إضافة المسؤول')
    }
  }

  async function handleRemoveAdmin(email: string) {
    if (adminEmails.length <= 1) {
      alert('❌ لا يمكن حذف آخر مسؤول!')
      return
    }

    if (!confirm(`هل أنت متأكد من إزالة ${email} من قائمة المسؤولين؟`)) {
      return
    }

    const res = await fetch('/api/admins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (res.ok) {
      const { clearAdminCache } = await import('@/lib/auth')
      clearAdminCache()
      alert('✅ تم إزالة المسؤول بنجاح!')
      fetchData()
    } else {
      alert('❌ فشل في إزالة المسؤول')
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className={styles.loginPage}>
          <div className={styles.loginCard}>
            <h1>⛔ غير مصرح</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              هذه الصفحة مخصصة للمشرفين فقط
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
          <button
            className={activeTab === 'settings' ? styles.activeTab : ''}
            onClick={() => setActiveTab('settings')}
          >
            الإعدادات
          </button>
          <button
            className={activeTab === 'admins' ? styles.activeTab : ''}
            onClick={() => setActiveTab('admins')}
          >
            المسؤولين
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
                        <h3>{order.customerName}</h3>
                        <span className={`${styles.status} ${styles[order.status]}`}>
                          {order.status === 'pending' && '⏳ قيد الانتظار'}
                          {order.status === 'confirmed' && '✅ مؤكد'}
                          {order.status === 'rejected' && '❌ مرفوض'}
                        </span>
                      </div>
                      <p><strong>البريد:</strong> {order.customerEmail}</p>
                      <p><strong>المنتج:</strong> {order.productTitle}</p>
                      <p><strong>المبلغ:</strong> {order.total.toLocaleString()} دج</p>
                      <p><strong>التاريخ:</strong> {new Date(order.createdAt).toLocaleString('ar-DZ')}</p>
                      
                      {order.receiptImageUrl && (
                        <div className={styles.receiptImage}>
                          <strong>صورة الوصل:</strong>
                          <img src={order.receiptImageUrl} alt="Receipt" />
                        </div>
                      )}

                      {order.rejectionReason && (
                        <div className={styles.rejectionReason}>
                          <strong>سبب الرفض:</strong>
                          <p>{order.rejectionReason}</p>
                        </div>
                      )}

                      {order.status === 'pending' && (
                        <div className={styles.orderActions}>
                          <button
                            className="btn btn-success"
                            onClick={() => handleConfirmOrder(order.id)}
                          >
                            ✅ تأكيد
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => openRejectModal(order.id)}
                          >
                            ❌ رفض
                          </button>
                        </div>
                      )}

                      {(order.status === 'confirmed' || order.status === 'rejected') && (
                        <div className={styles.orderActions}>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            🗑️ حذف
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
                    {product.imageUrl && (
                      <div className={styles.productImage}>
                        <img src={product.imageUrl} alt={product.title} />
                      </div>
                    )}
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p className={styles.price}>{product.price.toLocaleString()} دج</p>
                    {product.downloadLink && (
                      <p className={styles.downloadLink}>
                        <small>🔗 {product.downloadLink}</small>
                      </p>
                    )}
                    <div className={styles.productActions}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingProduct(product)
                          setProductImagePreview(product.imageUrl || null)
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

          {activeTab === 'settings' && (
            <div>
              <h2>إعدادات بريدي موب (CCP)</h2>
              <div className={`card ${styles.settingsCard}`}>
                <form onSubmit={handleSettingsUpdate}>
                  <div className={styles.formGroup}>
                    <label>رقم الحساب (CCP)</label>
                    <input
                      type="text"
                      value={ccpNumber}
                      onChange={(e) => setCcpNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>الاسم</label>
                    <input
                      type="text"
                      value={ccpName}
                      onChange={(e) => setCcpName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    حفظ التغييرات
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div>
              <h2>إدارة المسؤولين</h2>
              
              <div className={`card ${styles.settingsCard}`} style={{ marginBottom: '30px' }}>
                <h3>إضافة مسؤول جديد</h3>
                <form onSubmit={handleAddAdmin}>
                  <div className={styles.formGroup}>
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    + إضافة مسؤول
                  </button>
                </form>
              </div>

              <div className={styles.adminsGrid}>
                {adminEmails.map((email, index) => (
                  <div key={index} className="card">
                    <div className={styles.adminCard}>
                      <div className={styles.adminInfo}>
                        <span className={styles.adminIcon}>👤</span>
                        <div>
                          <h3>{email}</h3>
                          <p className={styles.adminBadge}>مسؤول</p>
                        </div>
                      </div>
                      {adminEmails.length > 1 && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveAdmin(email)}
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {adminEmails.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                  لا يوجد مسؤولين حالياً
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showProductModal && (
        <div className="modal-overlay" onClick={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setProductImage(null)
          setProductImagePreview(null)
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className={styles.formGroup}>
                <label>صورة المنتج</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setProductImage(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setProductImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className={styles.fileInput}
                />
                {productImagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={productImagePreview} alt="Preview" />
                  </div>
                )}
              </div>
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
              <div className={styles.formGroup}>
                <label>رابط التحميل (اختياري)</label>
                <input
                  type="url"
                  name="downloadLink"
                  defaultValue={editingProduct?.downloadLink || ''}
                  placeholder="https://..."
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
                    setProductImage(null)
                    setProductImagePreview(null)
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

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>رفض الطلبية</h2>
            <div className={styles.formGroup}>
              <label>سبب الرفض</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="اكتب سبب رفض الطلبية..."
                required
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRejectOrder}
              >
                رفض الطلبية
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
