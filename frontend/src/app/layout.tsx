import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VocaText — Speech to Text',
  description: 'Real-time speech transcription powered by AI. Record, transcribe, and export your voice with precision.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
