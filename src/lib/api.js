const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const apiBase = API_BASE

async function request(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed (${response.status})`)
  }
  return data
}

export const api = {
  request,
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  getThreads: () => request('/mental-health/threads'),
  getThread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  streamChat: async (payload, onEvent) => {
    const token = localStorage.getItem('zenheaven_token')
    const response = await fetch(`${API_BASE}/mental-health/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok || !response.body) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Unable to connect to CalmBot')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() || ''
      events.forEach((event) => {
        const line = event.split('\n').find((item) => item.startsWith('data:'))
        if (!line) return
        try {
          onEvent(JSON.parse(line.replace(/^data:\s*/, '')))
        } catch {
          // Ignore malformed keep-alive chunks.
        }
      })
    }
  },
  getJournal: () => request('/journal/entries'),
  createJournal: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  getPrompts: () => request('/journal/prompts'),
  analyzeMood: (content) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  moodBooks: () => request('/books/recommend-by-mood'),
  getSongs: () => request('/songs'),
  getRecommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  getTherapists: () => request('/therapists/'),
  getTherapist: (id) => request(`/therapists/${id}`),
  bookAppointment: (payload) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  getBalance: () => request('/coins/balance'),
  getTransactions: () => request('/coins/transactions'),
  getGoals: () => request('/coins/daily-goals'),
  getAchievements: () => request('/coins/achievements'),
  getStreak: () => request('/coins/streak'),
}

export function formatError(error) {
  return error?.message || 'Something went wrong. Please try again.'
}
