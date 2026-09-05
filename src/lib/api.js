const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const error = await response.json()
      detail = error.detail || detail
    } catch {
      // Keep the friendly fallback when the server returns no JSON.
    }
    throw new Error(detail)
  }
  if (response.status === 204) return null
  return response.json()
}

const json = (body) => JSON.stringify(body)

export const api = {
  auth: {
    login: (body) => request('/auth/login', { method: 'POST', body: json(body) }),
    register: (body) => request('/auth/register', { method: 'POST', body: json(body) }),
    me: () => request('/auth/me'),
  },
  dashboard: {
    goals: () => request('/coins/daily-goals'),
    streak: () => request('/coins/streak'),
    balance: () => request('/coins/balance'),
  },
  journal: {
    entries: () => request('/journal/entries'),
    prompts: () => request('/journal/prompts'),
    insights: () => request('/journal/insights'),
    create: (body) => request('/journal/entries', { method: 'POST', body: json(body) }),
    analyze: (body) => request('/journal/analyze-mood', { method: 'POST', body: json(body) }),
    remove: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  },
  chat: {
    threads: () => request('/mental-health/threads'),
    thread: (id) => request(`/mental-health/threads/${id}`),
    removeThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  },
  books: {
    byMood: () => request('/books/recommend-by-mood'),
    search: (query) => request(`/books/search?q=${encodeURIComponent(query)}&max_results=10`),
    similar: (id) => request(`/books/recommend/${id}`),
  },
  music: {
    songs: () => request('/songs'),
    recommend: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
    details: (song, artist) => request(`/song_details?song=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}`),
  },
  therapists: {
    list: (query = '') => request(`/therapists/${query}`),
    detail: (id) => request(`/therapists/${id}`),
    book: (body) => request('/therapists/appointments', { method: 'POST', body: json(body) }),
  },
  coins: {
    balance: () => request('/coins/balance'),
    transactions: () => request('/coins/transactions'),
    goals: () => request('/coins/daily-goals'),
    achievements: () => request('/coins/achievements'),
    rates: () => request('/coins/exchange-rates'),
  },
}

export async function streamChat(message, threadId, onEvent) {
  const token = getToken()
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: json({ message, thread_id: threadId || null }),
  })
  if (!response.ok) throw new Error('The calm assistant is taking a quiet moment. Try again.')
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
      const line = chunk.split('\n').find((item) => item.startsWith('data: '))
      if (!line) return
      try { onEvent(JSON.parse(line.slice(6))) } catch { /* Ignore malformed keep-alive chunks. */ }
    })
  }
}
