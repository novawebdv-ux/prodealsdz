
'use client'

import React, { useState, useEffect } from 'react'
import styles from './BuyModal.module.css'

interface Product {
  id: string
  title: string
  price: number
  discountPrice?: number | null
  discountEndDate?: string | null
}

interface BuyModalProps {
  product: Product
  onClose: () => void
  customerEmail: string
  customerName: string
}

export default function BuyModal({ product, onClose, customerEmail, customerName }: BuyModalProps) {
  const [paymentInfo, setPaymentInfo] = useState({ 
    ripNumber: '', 
    ripKey: '', 
    ccpNumber: '', 
    ccpKey: '', 
    ccpName: '' 
  })
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const hasActiveDiscount = product.discountPrice && product.discountPrice > 0 && 
    product.discountEndDate && new Date(product.discountEndDate) > new Date()
  
  const finalPrice = hasActiveDiscount ? product.discountPrice! : product.price

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setPaymentInfo({
        ripNumber: data.ripNumber || '',
        ripKey: data.ripKey || '',
        ccpNumber: data.ccpNumber || '',
        ccpKey: data.ccpKey || '',
        ccpName: data.ccpName || ''
      }))
      .catch(err => console.error('Error fetching payment info:', err))
  }, [])

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

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
          productPrice: finalPrice,
          total: finalPrice,
          receiptImageUrl: url,
          paymentMethod: 'rip',
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
        <h2>شراء: {product.title}</h2>

        <div className={styles.paymentInfo}>
          <h4>📋 معلومات الدفع</h4>
          
          <div className={styles.ccpBox}>
            <p><strong>رقم الحساب (RIP):</strong></p>
            <div className={styles.numberWithCopy}>
              <p className={styles.ccpNumber}>{paymentInfo.ripNumber || 'جاري التحميل...'}</p>
              <button 
                type="button"
                onClick={() => handleCopy(paymentInfo.ripNumber, 'ripNumber')}
                className={styles.copyButton}
              >
                {copied === 'ripNumber' ? '✓ تم النسخ' : '📋 نسخ'}
              </button>
            </div>

            <div className={styles.instagramBox}>
              <p><strong>📱 تواصل معنا لتلقي جميع معلومات الدفع</strong></p>
              <a 
                href="https://www.instagram.com/pro_dealsdz?igsh=MXN6M3dvaWNpa2plbw=="
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagramButton}
              >
                <span>📩</span> أرسل رسالة على Instagram
              </a>
            </div>
            
            <p><strong>المبلغ:</strong> <span style={{ 
              color: '#e74c3c', 
              fontWeight: 'bold',
              fontSize: '18px' 
            }}>{finalPrice.toLocaleString()} دج</span></p>
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
