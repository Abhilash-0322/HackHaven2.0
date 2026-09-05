const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'zenheaven_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || data.message || 'Something went wrong.')
  return data
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  goals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  streak: () => request('/coins/streak'),
  songs: () => request('/songs'),
  recommend: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  journals: () => request('/journal/entries'),
  prompts: () => request('/journal/prompts'),
  createJournal: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  booksByMood: () => request('/books/recommend-by-mood'),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  therapists: () => request('/therapists/'),
  appointments: (userId) => request(`/therapists/appointments/user/${userId}?upcoming_only=true`),
  bookAppointment: (payload) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  chatStream: (payload) => fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(payload),
  }),
}

export const isApiConfigured = () => Boolean(import.meta.env.VITE_API_URL)
