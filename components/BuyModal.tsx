
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

type PaymentMethod = 'rip' | 'ccp' | null

export default function BuyModal({ product, onClose, customerEmail, customerName }: BuyModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
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
          productPrice: product.price,
          total: product.price,
          receiptImageUrl: url,
          paymentMethod: paymentMethod,
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

        {!paymentMethod ? (
          <div className={styles.paymentSelection}>
            <h3>اختر طريقة الدفع</h3>
            <div className={styles.paymentOptions}>
              <div 
                className={styles.paymentOption}
                onClick={() => setPaymentMethod('rip')}
              >
                <img 
                  src="/images/golden-card-rip.png" 
                  alt="البطاقة الذهبية RIP"
                  className={styles.paymentImage}
                />
                <p className={styles.paymentLabel}>البطاقة الذهبية (RIP)</p>
              </div>
              
              <div 
                className={styles.paymentOption}
                onClick={() => setPaymentMethod('ccp')}
              >
                <img 
                  src="/images/ccp-check.png" 
                  alt="الشيك CCP"
                  className={styles.paymentImage}
                />
                <p className={styles.paymentLabel}>الشيك البريدي (CCP)</p>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.paymentInfo}>
              <div className={styles.backButton} onClick={() => setPaymentMethod(null)}>
                ← العودة لاختيار طريقة دفع أخرى
              </div>
              
              <h4>📋 معلومات الدفع - {paymentMethod === 'rip' ? 'البطاقة الذهبية (RIP)' : 'الشيك البريدي (CCP)'}</h4>
              
              <div className={styles.ccpBox}>
                {paymentMethod === 'ccp' && (
                  <>
                    <p><strong>رقم الحساب (CCP):</strong></p>
                    <div className={styles.numberWithCopy}>
                      <p className={styles.ccpNumber}>{paymentInfo.ccpNumber || 'جاري التحميل...'}</p>
                      <button 
                        type="button"
                        onClick={() => handleCopy(paymentInfo.ccpNumber, 'ccpNumber')}
                        className={styles.copyButton}
                      >
                        {copied === 'ccpNumber' ? '✓ تم النسخ' : '📋 نسخ'}
                      </button>
                    </div>
                    <p><strong>المفتاح (Clé):</strong></p>
                    <div className={styles.numberWithCopy}>
                      <p className={styles.ccpNumber}>{paymentInfo.ccpKey || 'جاري التحميل...'}</p>
                      <button 
                        type="button"
                        onClick={() => handleCopy(paymentInfo.ccpKey, 'ccpKey')}
                        className={styles.copyButton}
                      >
                        {copied === 'ccpKey' ? '✓ تم النسخ' : '📋 نسخ'}
                      </button>
                    </div>
                    <p><strong>الاسم و اللقب:</strong> {paymentInfo.ccpName || 'ProDeals DZ'}</p>
                  </>
                )}
                
                {paymentMethod === 'rip' && (
                  <>
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
                  </>
                )}
                
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
          </>
        )}
      </div>
    </div>
  )
}
