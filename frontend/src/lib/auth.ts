export interface User {
  id: number
  email: string
  username: string
  created_at: string
}

export function saveAuth(token: string, user: User) {
  localStorage.setItem('vt_token', token)
  localStorage.setItem('vt_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('vt_token')
  localStorage.removeItem('vt_user')
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('vt_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('vt_token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
