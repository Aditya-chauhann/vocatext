'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { Mic, AlertCircle, X, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; username?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const errs: typeof fieldErrors = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!username) errs.username = 'Username is required'
    else if (username.length < 3) errs.username = 'Username must be at least 3 characters'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const res = await authApi.register({ email, username, password })
      saveAuth(res.data.token, res.data.user)
      router.push('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed. Please try again.'
      // Map server errors to specific fields
      if (msg.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: msg }))
      } else if (msg.toLowerCase().includes('username')) {
        setFieldErrors(prev => ({ ...prev, username: msg }))
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const passwordStrength = password.length === 0 ? null : password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong'
  const strengthColor = { weak: '#E05050', medium: '#E8A020', strong: '#7A9E7E' }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(232,160,32,0.06) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Mic size={24} color="#0D0D0B" strokeWidth={2} />
          </div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Start transcribing your voice today</p>
        </div>

        {/* General error banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.5rem', padding: '0.875rem 1rem', borderRadius: '10px',
            background: 'rgba(224,80,80,0.12)', border: '1px solid rgba(224,80,80,0.3)',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ fontSize: '0.875rem', color: '#ff7070' }}>{error}</span>
            </div>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.375rem', letterSpacing: '0.05em' }}>EMAIL</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearFieldError('email') }}
                placeholder="you@example.com"
                style={{ borderColor: fieldErrors.email ? 'rgba(224,80,80,0.6)' : undefined }}
              />
              {fieldErrors.email && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.375rem', fontSize: '0.78rem', color: '#ff7070' }}>
                  <AlertCircle size={12} />{fieldErrors.email}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.375rem', letterSpacing: '0.05em' }}>USERNAME</label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); clearFieldError('username') }}
                placeholder="johndoe"
                style={{ borderColor: fieldErrors.username ? 'rgba(224,80,80,0.6)' : undefined }}
              />
              {fieldErrors.username && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.375rem', fontSize: '0.78rem', color: '#ff7070' }}>
                  <AlertCircle size={12} />{fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.375rem', letterSpacing: '0.05em' }}>PASSWORD</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); clearFieldError('password') }}
                placeholder="Min. 6 characters"
                style={{ borderColor: fieldErrors.password ? 'rgba(224,80,80,0.6)' : undefined }}
              />
              {/* Password strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {['weak', 'medium', 'strong'].map((level, i) => (
                      <div key={level} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: passwordStrength && ['weak', 'medium', 'strong'].indexOf(passwordStrength) >= i
                          ? strengthColor[passwordStrength as keyof typeof strengthColor]
                          : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: passwordStrength ? strengthColor[passwordStrength as keyof typeof strengthColor] : 'var(--text-muted)' }}>
                    {passwordStrength === 'weak' && 'Weak password'}
                    {passwordStrength === 'medium' && 'Good password'}
                    {passwordStrength === 'strong' && '✓ Strong password'}
                  </p>
                </div>
              )}
              {fieldErrors.password && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.375rem', fontSize: '0.78rem', color: '#ff7070' }}>
                  <AlertCircle size={12} />{fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.95rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Creating account…' : (
                <><CheckCircle size={16} /> Create account</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
