'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Mic, History, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth(false)

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(13,13,11,0.85)',
        height: '60px',
        display: 'flex', alignItems: 'center',
        padding: '0 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mic size={14} color="#0D0D0B" strokeWidth={2.5} />
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            VocaText
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {user ? (
            <>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.875rem', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                <Mic size={15} />
                <span>Record</span>
              </Link>
              <Link href="/history" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.875rem', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                <History size={15} />
                <span>History</span>
              </Link>

              <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.625rem', borderRadius: '6px', background: 'var(--bg-elevated)' }}>
                  <User size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.username}</span>
                </div>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  title="Sign out"
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--danger)')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}>
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/register" className="btn-primary" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
