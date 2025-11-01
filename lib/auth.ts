
export const ADMIN_EMAILS = [
  'txmax984@gmail.com',
  'madimoh44@gmail.com',
  'bouazzasalah120120@gmail.com'
]

export interface User {
  email: string
  name: string
  picture?: string
}

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
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
  try {
    const res = await fetch('/api/admins')
    if (res.ok) {
      const data = await res.json()
      return data.emails || ADMIN_EMAILS
    }
  } catch (error) {
    console.error('Error fetching admin emails:', error)
  }
  return ADMIN_EMAILS
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
