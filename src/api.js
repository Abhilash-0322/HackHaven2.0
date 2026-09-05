const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('zenheaven_token')
export const setToken = (token) => localStorage.setItem('zenheaven_token', token)
export const clearToken = () => localStorage.removeItem('zenheaven_token')

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    let message = 'Something went wrong'
    try {
      const data = await response.json()
      message = data.detail || message
    } catch {
      // Keep the generic message when the API does not return JSON.
    }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  journalEntries: () => request('/journal/entries'),
  createJournal: (body) => request('/journal/entries', { method: 'POST', body: JSON.stringify(body) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  prompts: () => request('/journal/prompts'),
  insights: () => request('/journal/insights'),
  analyzeMood: (body) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify(body) }),
  songs: () => request('/songs'),
  recommendSongs: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  moodBooks: () => request('/books/recommend-by-mood'),
  therapists: (query = '') => request(`/therapists/${query}`),
  therapist: (id) => request(`/therapists/${id}`),
  bookAppointment: (body) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(body) }),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  goals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  streak: () => request('/coins/streak'),
  earnCoins: (body) => request('/coins/earn', { method: 'POST', body: JSON.stringify(body) }),
}

export async function streamChat(message, threadId, onEvent) {
  const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'text/event-stream' })
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok) throw new Error('Unable to connect to CalmBot')
  if (!response.body) throw new Error('Streaming is unavailable')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    events.forEach((event) => {
      const line = event.split('\n').find((item) => item.startsWith('data:'))
      if (!line) return
      try {
        onEvent(JSON.parse(line.replace(/^data:\s*/, '')))
      } catch {
        // Ignore malformed heartbeat chunks.
      }
    })
    if (done) break
  }
}
