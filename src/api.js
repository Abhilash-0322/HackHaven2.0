const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const request = async (path, options = {}) => {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.detail || 'Something went wrong')
  return body
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  journalEntries: () => request('/journal/entries'),
  journalPrompts: () => request('/journal/prompts'),
  journalInsights: () => request('/journal/insights'),
  createJournal: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMood: (content) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
  moodBooks: (userId) => request(`/books/recommend-by-mood${userId ? `?user_id=${encodeURIComponent(userId)}` : ''}`),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  similarBooks: (id) => request(`/books/recommend/${encodeURIComponent(id)}`),
  songs: () => request('/songs'),
  songRecommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: (query = '') => request(`/therapists/${query ? `?${query}` : ''}`),
  therapist: (id) => request(`/therapists/${id}`),
  appointments: (userId) => request(`/therapists/appointments/user/${encodeURIComponent(userId)}`),
  bookAppointment: (payload) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  dailyGoals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  streak: () => request('/coins/streak'),
  spend: (payload) => request('/coins/spend', { method: 'POST', body: JSON.stringify(payload) }),
}

export async function streamChat({ message, threadId, onEvent, signal }) {
  const token = getToken()
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok || !response.body) throw new Error('Unable to start the stream')
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
      try { onEvent(JSON.parse(line.replace(/^data:\s*/, ''))) } catch { /* Ignore malformed keep-alive chunks. */ }
    })
  }
}
