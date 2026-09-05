const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('zenheaven_token')

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

export const api = {
  baseUrl: API_URL,
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  journals: () => request('/journal/entries'),
  prompts: () => request('/journal/prompts'),
  createJournal: (body) => request('/journal/entries', { method: 'POST', body: JSON.stringify(body) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  booksByMood: () => request('/books/recommend-by-mood'),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  songs: () => request('/songs'),
  recommendSongs: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: (params = '') => request(`/therapists/${params}`),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  goals: () => request('/coins/daily-goals'),
  streak: () => request('/coins/streak'),
}

export async function streamChat(message, threadId, onEvent, signal) {
  const token = getToken()
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, thread_id: threadId || null }),
    signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Unable to reach CalmBot')
  }
  if (!response.body) throw new Error('Streaming is not supported by this browser')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    for (const chunk of events) {
      const line = chunk.split('\n').find((item) => item.startsWith('data:'))
      if (!line) continue
      try {
        onEvent(JSON.parse(line.slice(5).trim()))
      } catch {
        // Ignore malformed SSE chunks so a partial response can continue.
      }
    }
    if (done) break
  }
}
