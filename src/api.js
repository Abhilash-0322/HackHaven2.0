const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const api = async (path, options = {}) => {
  const token = localStorage.getItem('zenheaven_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

export const authApi = {
  login: (payload) => api('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => api('/auth/me'),
}

export const featureApi = {
  threads: () => api('/mental-health/threads'),
  thread: (id) => api(`/mental-health/threads/${id}`),
  journal: () => api('/journal/entries'),
  prompts: () => api('/journal/prompts'),
  books: () => api('/books/recommend-by-mood'),
  searchBooks: (query) => api(`/books/search?q=${encodeURIComponent(query)}`),
  songs: () => api('/songs'),
  recommendSongs: (song) => api(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: () => api('/therapists/'),
  coins: () => api('/coins/balance'),
  transactions: () => api('/coins/transactions'),
  goals: () => api('/coins/daily-goals'),
}

export const streamChat = async (payload, onEvent) => {
  const token = localStorage.getItem('zenheaven_token')
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  })
  if (!response.ok || !response.body) throw new Error('Unable to open the support stream')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() || ''
    chunks.forEach((chunk) => {
      const line = chunk.split('\n').find((part) => part.startsWith('data:'))
      if (line) {
        try { onEvent(JSON.parse(line.replace(/^data:\s*/, ''))) } catch { /* ignore malformed heartbeat */ }
      }
    })
  }
}

export const offline = (error, fallback) => {
  console.info('ZenHeaven API fallback:', error.message)
  return fallback
}
