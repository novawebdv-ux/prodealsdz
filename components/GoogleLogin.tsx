
'use client'

import React from 'react'
import { setCurrentUser } from '@/lib/auth'

export default function GoogleLogin({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const handleGoogleLogin = () => {
    // محاكاة تسجيل الدخول بجوجل
    const mockUser = {
      email: prompt('أدخل البريد الإلكتروني:') || '',
      name: prompt('أدخل الاسم:') || '',
      picture: '/images/logo.png'
    }
    
    if (mockUser.email && mockUser.name) {
      setCurrentUser(mockUser)
      onLoginSuccess?.()
      window.location.reload()
    }
  }

  const handleGuestMode = () => {
    setCurrentUser({
      email: 'guest@prodeals.dz',
      name: 'زائر',
    })
    onLoginSuccess?.()
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <button 
        className="btn btn-primary" 
        onClick={handleGoogleLogin}
        style={{ width: '100%' }}
      >
        🔐 تسجيل الدخول بجوجل
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={handleGuestMode}
        style={{ width: '100%' }}
      >
        👤 الدخول كزائر
      </button>
    </div>
  )
}
