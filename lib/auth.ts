
export const ADMIN_EMAILS = [
  'txmax984@gmail.com',
  'madimoh44@gmail.com',
  'bouazzasalah120120@gmail.com'
]

let cachedAdminEmails: string[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60000 // 1 دقيقة

export interface User {
  email: string
  name: string
  picture?: string
}

export async function isAdmin(email: string): Promise<boolean> {
  const adminEmails = await getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

export function isAdminSync(email: string): boolean {
  // للاستخدام الفوري مع القائمة المؤقتة
  if (cachedAdminEmails) {
    return cachedAdminEmails.includes(email.toLowerCase())
  }
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('prodeals_user')
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('prodeals_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('prodeals_user')
  }
}

export async function getAdminEmails(): Promise<string[]> {
  // استخدام الكاش لتقليل الطلبات
  const now = Date.now()
  if (cachedAdminEmails && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedAdminEmails
  }

  try {
    const res = await fetch('/api/admins')
    if (res.ok) {
      const data = await res.json()
      const emails = data.emails || ADMIN_EMAILS
      cachedAdminEmails = emails
      cacheTimestamp = now
      return emails
    }
  } catch (error) {
    console.error('Error fetching admin emails:', error)
  }
  
  cachedAdminEmails = ADMIN_EMAILS
  cacheTimestamp = now
  return ADMIN_EMAILS
}

export function clearAdminCache() {
  cachedAdminEmails = null
  cacheTimestamp = 0
}

export async function addAdminEmail(email: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return res.ok
  } catch (error) {
    console.error('Error adding admin:', error)
    return false
  }
}

export async function removeAdminEmail(email: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return res.ok
  } catch (error) {
    console.error('Error removing admin:', error)
    return false
  }
}
