'use client'

import React, { useState } from 'react'
import { signInWithPopup, signInAnonymously } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { setCurrentUser } from '@/lib/auth'

export default function GoogleLogin({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      setCurrentUser({
        email: user.email || '',
        name: user.displayName || '',
        picture: user.photoURL || '/images/logo.png'
      })
      
      onLoginSuccess?.()
      window.location.reload()
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error)
      alert('حدث خطأ في تسجيل الدخول. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestMode = async () => {
    setIsLoading(true)
    try {
      const result = await signInAnonymously(auth)
      
      setCurrentUser({
        email: 'guest@prodeals.dz',
        name: 'زائر',
      })
      
      onLoginSuccess?.()
      window.location.reload()
    } catch (error: any) {
      console.error('خطأ في الدخول كزائر:', error)
      alert('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <button 
        className="btn btn-primary" 
        onClick={handleGoogleLogin}
        style={{ width: '100%' }}
        disabled={isLoading}
      >
        {isLoading ? '⏳ جاري التحميل...' : '🔐 تسجيل الدخول بجوجل'}
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={handleGuestMode}
        style={{ width: '100%' }}
        disabled={isLoading}
      >
        {isLoading ? '⏳ جاري التحميل...' : '👤 الدخول كزائر'}
      </button>
    </div>
  )
}
