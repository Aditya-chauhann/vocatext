import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vt_token') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vt_token')
      localStorage.removeItem('vt_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

// ── Transcription ─────────────────────────────────────────────────────────────
export const transcribeApi = {
  upload: (file: Blob, title?: string) => {
    const form = new FormData()
    form.append('file', file, 'recording.webm')
    if (title) form.append('title', title)
    return api.post('/api/transcribe', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ── History ───────────────────────────────────────────────────────────────────
export const historyApi = {
  list: (page = 1, q = '') =>
    api.get(`/api/transcripts?page=${page}&q=${encodeURIComponent(q)}`),
  get: (id: number) => api.get(`/api/transcripts/${id}`),
  delete: (id: number) => api.delete(`/api/transcripts/${id}`),
}
