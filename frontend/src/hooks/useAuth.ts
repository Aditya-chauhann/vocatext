'use client'
import { useState, useEffect } from 'react'
import { getUser, clearAuth, type User } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const u = getUser()
    setUser(u)
    setLoading(false)
    if (requireAuth && !u) router.push('/login')
  }, [requireAuth, router])

  const logout = () => {
    clearAuth()
    router.push('/login')
  }

  return { user, loading, logout }
}
