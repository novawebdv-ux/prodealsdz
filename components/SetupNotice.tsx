'use client'

export default function SetupNotice() {
  const isConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

  if (isConfigured) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      color: '#fff',
      padding: '15px 20px',
      textAlign: 'center',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontWeight: 600,
    }}>
      ⚠️ يرجى إعداد Supabase أولاً - راجع ملف SETUP_GUIDE_AR.md للتعليمات
    </div>
  )
}
