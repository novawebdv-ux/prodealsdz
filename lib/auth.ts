
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
