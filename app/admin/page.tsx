'use client'

import React, { useEffect, useState } from 'react'
import { supabase, type Product, type Order, type Admin } from '@/lib/supabase'
import styles from './admin.module.css'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'admins'>('orders')
  
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAdminModal, setShowAdminModal] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  async function checkAuth() {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.session.user.id)
        .single()
      
      if (adminData) {
        setIsAuthenticated(true)
      }
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.session) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.session.user.id)
        .single()
      
      if (adminData) {
        setIsAuthenticated(true)
      } else {
        alert('ليس لديك صلاحيات أدمن')
        await supabase.auth.signOut()
      }
    } else {
      alert('خطأ في تسجيل الدخول')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  async function fetchData() {
    if (activeTab === 'products') {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    } else if (activeTab === 'orders') {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    } else if (activeTab === 'admins') {
      const { data } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setAdmins(data)
    }
  }

  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const productData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    }

    if (editingProduct) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([productData])
    }

    setShowProductModal(false)
    setEditingProduct(null)
    fetchData()
  }

  async function handleDeleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    }
  }

  async function handleOrderStatus(id: string, status: 'confirmed' | 'rejected') {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchData()
  }

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newEmail = formData.get('email') as string
    const newPassword = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    })

    if (data.user) {
      await supabase.from('admins').insert([
        {
          id: data.user.id,
          email: newEmail,
        },
      ])
      setShowAdminModal(false)
      fetchData()
      alert('تم إضافة الأدمن بنجاح')
    } else {
      alert('حدث خطأ: ' + error?.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <h1>لوحة تحكم الأدمن</h1>
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
                        {order.products.map((p: any, i: number) => (
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

        {activeTab === 'admins' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>إدارة المسؤولين</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAdminModal(true)}
              >
                + إضافة مسؤول جديد
              </button>
            </div>
            <div className={styles.adminsGrid}>
              {admins.map((admin) => (
                <div key={admin.id} className="card">
                  <p><strong>البريد:</strong> {admin.email}</p>
                  <p><strong>تاريخ الإضافة:</strong> {new Date(admin.created_at).toLocaleDateString('ar-DZ')}</p>
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

      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>إضافة مسؤول جديد</h2>
            <form onSubmit={handleAddAdmin}>
              <div className={styles.formGroup}>
                <label>البريد الإلكتروني</label>
                <input type="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label>كلمة المرور</label>
                <input type="password" name="password" required minLength={6} />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdminModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
