'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { historyApi } from '@/lib/api'
import { formatDuration, formatDate, downloadText } from '@/lib/utils'
import Navbar from '@/components/ui/Navbar'
import { Search, Trash2, Download, Clock, Globe, ChevronLeft, ChevronRight, FileText } from 'lucide-react'

interface Transcript {
  id: number
  title: string
  text: string
  language?: string
  duration_seconds?: number
  created_at: string
}

export default function HistoryPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Transcript | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!getUser()) router.push('/login')
  }, [router])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await historyApi.list(page, query)
      setTranscripts(res.data.transcripts)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false)
    }
  }, [page, query])

  useEffect(() => { load() }, [load])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this transcript?')) return
    await historyApi.delete(id)
    if (selected?.id === id) setSelected(null)
    load()
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                Transcript history
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {total} transcript{total !== 1 ? 's' : ''} saved
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search transcripts…"
                  style={{ paddingLeft: '2.25rem', width: '240px' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
                Search
              </button>
            </form>
          </div>

          {/* Layout: list + detail */}
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '360px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Loading…
                </div>
              )}
              {!loading && transcripts.length === 0 && (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <FileText size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>No transcripts yet</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Record something on the home page</p>
                </div>
              )}
              {transcripts.map(t => (
                <div
                  key={t.id}
                  className="card"
                  onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderColor: selected?.id === t.id ? 'var(--amber)' : undefined,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.625rem' }}>
                        {t.text.slice(0, 120)}{t.text.length > 120 ? '…' : ''}
                      </p>
                      <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                        {t.duration_seconds && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <Clock size={11} />{formatDuration(t.duration_seconds)}
                          </span>
                        )}
                        {t.language && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <Globe size={11} />{t.language.toUpperCase()}
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(t.created_at)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      <button
                        onClick={e => { e.stopPropagation(); downloadText(t.text, `transcript-${t.id}.txt`) }}
                        style={{ padding: '0.375rem', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                        title="Download"
                        onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--amber)')}
                        onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={e => handleDelete(t.id, e)}
                        style={{ padding: '0.375rem', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                        title="Delete"
                        onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--danger)')}
                        onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 0.75rem' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {page} of {pages}</span>
                  <button className="btn-ghost" disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 0.75rem' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="card animate-fade-up" style={{ padding: '2rem', position: 'sticky', top: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h2 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{selected.title}</h2>
                  <button onClick={() => setSelected(null)} style={{ padding: '0.375rem', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
                </div>
                <div style={{
                  background: 'var(--bg)', borderRadius: '8px', padding: '1.25rem',
                  border: '1px solid var(--border)', lineHeight: '1.9', color: 'var(--text-primary)',
                  fontSize: '0.9rem', whiteSpace: 'pre-wrap', maxHeight: '500px', overflowY: 'auto',
                }}>
                  {selected.text}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => downloadText(selected.text, `transcript-${selected.id}.txt`)} className="btn-ghost" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Download size={14} /> .txt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
