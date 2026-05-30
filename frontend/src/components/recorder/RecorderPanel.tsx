'use client'
import { useState, useRef } from 'react'
import { useRecorder } from '@/hooks/useRecorder'
import { transcribeApi } from '@/lib/api'
import { formatDuration } from '@/lib/utils'
import { Mic, Square, RotateCcw, Upload, AlertCircle, FileAudio } from 'lucide-react'
import TranscriptPanel from '@/components/transcript/TranscriptPanel'

type Mode = 'record' | 'upload'

export default function RecorderPanel() {
  const { state, duration, audioBlob, error, start, stop, reset } = useRecorder()
  const [mode, setMode] = useState<Mode>('record')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [transcriptData, setTranscriptData] = useState<Record<string, unknown> | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTranscribe = async (blob?: Blob | File) => {
    const target = blob || audioBlob
    if (!target) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const res = await transcribeApi.upload(target)
      setTranscript(res.data.transcript.text)
      setTranscriptData(res.data.transcript)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Transcription failed'
      setUploadError(msg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    setTranscript(null)
    setTranscriptData(null)
    setUploadError(null)
  }

  const handleReset = () => {
    reset()
    setUploadFile(null)
    setTranscript(null)
    setTranscriptData(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const switchMode = (m: Mode) => {
    handleReset()
    setMode(m)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '760px', margin: '0 auto' }}>

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
        {(['record', 'upload'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              flex: 1, padding: '0.6rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: mode === m ? 'var(--bg-elevated)' : 'transparent',
              color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
              borderColor: mode === m ? 'var(--border-hover)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            {m === 'record' ? <Mic size={15} /> : <FileAudio size={15} />}
            {m === 'record' ? 'Record microphone' : 'Upload audio file'}
          </button>
        ))}
      </div>

      {/* ── RECORD MODE ── */}
      {mode === 'record' && (
        <div className="card" style={{ padding: '3rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {state === 'recording' && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Timer */}
          <div className="font-mono" style={{
            fontSize: '3rem', fontWeight: 400,
            color: state === 'recording' ? 'var(--amber)' : 'var(--text-muted)',
            letterSpacing: '0.05em', marginBottom: '2rem', transition: 'color 0.3s',
          }}>
            {formatDuration(duration)}
          </div>

          {/* Waveform */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '40px', marginBottom: '2rem' }}>
            {state === 'recording'
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="wave-bar" style={{ height: '32px', animationDelay: `${(i * 0.08).toFixed(2)}s` }} />
                ))
              : Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ width: '3px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
                ))
            }
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {state === 'idle' && (
              <button onClick={start} style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--amber)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,160,32,0.3)' }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <Mic size={32} color="#0D0D0B" strokeWidth={2} />
              </button>
            )}

            {state === 'recording' && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[1, 2].map(i => (
                  <div key={i} style={{
                    position: 'absolute', width: '80px', height: '80px', borderRadius: '50%',
                    border: '2px solid var(--amber)',
                    animation: `pulse-ring 1.5s ease-out ${i * 0.4}s infinite`, opacity: 0,
                  }} />
                ))}
                <button onClick={stop} style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--danger)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                  transition: 'transform 0.2s',
                }}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
                >
                  <Square size={28} color="white" fill="white" />
                </button>
              </div>
            )}

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {state === 'idle' && 'Click to start recording'}
              {state === 'recording' && 'Recording — click to stop'}
              {state === 'stopped' && 'Recording complete'}
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.2)' }}>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* ── UPLOAD MODE ── */}
      {mode === 'upload' && (
        <div className="card" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.webm,.ogg,.m4a,.mp4,.mkv,.flac"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="audio-upload"
          />

          {!uploadFile ? (
            <label htmlFor="audio-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{
                border: '2px dashed var(--border)', borderRadius: '12px',
                padding: '3rem 2rem', transition: 'border-color 0.2s',
              }}
                onMouseOver={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)')}
                onMouseOut={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
              >
                <FileAudio size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Drop an audio file or <span style={{ color: 'var(--amber)' }}>browse</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  MP3, WAV, WebM, OGG, M4A, FLAC — up to 50MB
                </p>
              </div>
            </label>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <FileAudio size={20} color="var(--amber)" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{uploadFile.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      {(state === 'stopped' || uploadFile) && !transcript && (
        <div className="animate-fade-up" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => mode === 'upload' && uploadFile ? handleTranscribe(uploadFile) : handleTranscribe()}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <Upload size={16} />
            {isUploading ? 'Transcribing…' : 'Transcribe'}
          </button>
          <button
            className="btn-ghost"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <RotateCcw size={15} />
            {mode === 'record' ? 'New recording' : 'Choose different file'}
          </button>
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', borderRadius: '8px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.2)' }}>
          <AlertCircle size={15} color="var(--danger)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{uploadError}</span>
        </div>
      )}

      {/* Loading */}
      {isUploading && (
        <div className="card animate-fade-up" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="wave-bar" style={{ height: '24px', animationDelay: `${(i * 0.1).toFixed(1)}s` }} />
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Whisper is processing your audio…</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>This may take a few seconds</p>
        </div>
      )}

      {/* Transcript result */}
      {transcript && transcriptData && !isUploading && (
        <TranscriptPanel
          transcript={transcript}
          data={transcriptData as { id: number; title: string; language?: string; duration_seconds?: number; created_at: string }}
          onNewRecording={handleReset}
        />
      )}
    </div>
  )
}
