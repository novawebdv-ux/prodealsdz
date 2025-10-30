'use client'

import React, { useState, useEffect } from 'react'
import styles from './BuyModal.module.css'

interface Product {
  id: string
  title: string
  price: number
}

interface BuyModalProps {
  product: Product
  onClose: () => void
  customerEmail: string
  customerName: string
}

export default function BuyModal({ product, onClose, customerEmail, customerName }: BuyModalProps) {
  const [ccpInfo, setCcpInfo] = useState({ ccpNumber: '', ccpName: '' })
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setCcpInfo(data))
      .catch(err => console.error('Error fetching CCP info:', err))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!receiptImage) {
      alert('يرجى رفع صورة الوصل')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', receiptImage)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadRes.ok) throw new Error('فشل رفع الصورة')
      
      const { url } = await uploadRes.json()
      
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          customerName,
          customerPhone: '',
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          total: product.price,
          receiptImageUrl: url,
        }),
      })

      if (!orderRes.ok) throw new Error('فشل إرسال الطلبية')

      alert('✅ تم إرسال طلبك بنجاح! سيتم مراجعته من قبل الإدارة.')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('حدث خطأ أثناء إرسال الطلبية. حاول مرة أخرى.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h2>إتمام عملية الشراء</h2>
        <div className={styles.productInfo}>
          <h3>{product.title}</h3>
          <p className={styles.price}>{product.price.toLocaleString()} دج</p>
        </div>

        <div className={styles.paymentInfo}>
          <h4>📋 معلومات الدفع - بريدي موب</h4>
          <div className={styles.ccpBox}>
            <p><strong>رقم الحساب (CCP):</strong></p>
            <p className={styles.ccpNumber}>{ccpInfo.ccpNumber || 'جاري التحميل...'}</p>
            <p><strong>الاسم:</strong> {ccpInfo.ccpName || 'ProDeals DZ'}</p>
            <p><strong>المبلغ:</strong> {product.price.toLocaleString()} دج</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>📸 رفع صورة الوصل <span style={{ color: 'red' }}>*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className={styles.fileInput}
            />
            {preview && (
              <div className={styles.preview}>
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={uploading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? '⏳ جاري الإرسال...' : '✅ إرسال الطلبية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
