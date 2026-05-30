'use client'
import { useState } from 'react'
import { Copy, Download, Check, Clock, Globe, Mic } from 'lucide-react'
import { formatDuration, formatDate, downloadText, downloadJSON } from '@/lib/utils'

interface Props {
  transcript: string
  data: {
    id: number
    title: string
    language?: string
    duration_seconds?: number
    created_at: string
  }
  onNewRecording?: () => void
}

export default function TranscriptPanel({ transcript, data, onNewRecording }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card animate-fade-up" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <div>
          <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {data.title || `Transcript #${data.id}`}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {data.duration_seconds && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={12} />
                {formatDuration(data.duration_seconds)}
              </span>
            )}
            {data.language && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Globe size={12} />
                {data.language.toUpperCase()}
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatDate(data.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={handleCopy}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} color="var(--sage)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => downloadText(transcript, `transcript-${data.id}.txt`)}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
            title="Download as .txt"
          >
            <Download size={14} />
            .txt
          </button>
          <button
            onClick={() => downloadJSON({ ...data, text: transcript }, `transcript-${data.id}.json`)}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
            title="Download as .json"
          >
            <Download size={14} />
            .json
          </button>
        </div>
      </div>

      {/* Transcript text */}
      <div style={{
        background: 'var(--bg)',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        lineHeight: '1.9',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'var(--font-body)',
      }}>
        {transcript}
      </div>

      {/* Word count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {transcript.split(/\s+/).filter(Boolean).length} words · {transcript.length} characters
        </span>
        {onNewRecording && (
          <button
            onClick={onNewRecording}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0' }}
          >
            <Mic size={13} />
            New recording
          </button>
        )}
      </div>
    </div>
  )
}
