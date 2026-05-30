'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Navbar from '@/components/ui/Navbar'
import RecorderPanel from '@/components/recorder/RecorderPanel'

export default function HomePage() {
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh',
        paddingTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '80px 1.5rem 4rem',
      }}>
        {/* Hero text */}
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}>
            Your voice,<br />
            <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>perfectly transcribed.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.7 }}>
            Record your microphone and get accurate text in seconds — powered by OpenAI Whisper, running privately on your server.
          </p>
        </div>

        {/* Recorder */}
        <div style={{ width: '100%' }}>
          <RecorderPanel />
        </div>
      </main>
    </>
  )
}
