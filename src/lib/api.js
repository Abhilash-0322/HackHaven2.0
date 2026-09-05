export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data.detail || data.message || `Request failed (${response.status})`
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }
  return data
}

export const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  return parseResponse(response)
}

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => apiRequest('/auth/me'),
}

export const journalApi = {
  getEntries: () => apiRequest('/journal/entries'),
  getPrompts: () => apiRequest('/journal/prompts'),
  createEntry: (entry) => apiRequest('/journal/entries', { method: 'POST', body: JSON.stringify(entry) }),
  analyzeMood: (content) => apiRequest('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
}

export const booksApi = {
  byMood: () => apiRequest('/books/recommend-by-mood'),
  search: (query) => apiRequest(`/books/search?q=${encodeURIComponent(query)}`),
  similar: (id) => apiRequest(`/books/recommend/${encodeURIComponent(id)}`),
}

export const musicApi = {
  songs: () => apiRequest('/songs'),
  recommend: (song) => apiRequest(`/recommend?song=${encodeURIComponent(song)}`),
}

export const therapistsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/therapists/${query ? `?${query}` : ''}`)
  },
  specializations: () => apiRequest('/therapists/specializations'),
  book: (appointment) => apiRequest('/therapists/appointments', { method: 'POST', body: JSON.stringify(appointment) }),
}

export const coinsApi = {
  balance: () => apiRequest('/coins/balance'),
  transactions: () => apiRequest('/coins/transactions?limit=20'),
  goals: () => apiRequest('/coins/daily-goals'),
  streak: () => apiRequest('/coins/streak'),
}

export const chatApi = {
  threads: () => apiRequest('/mental-health/threads'),
  thread: (id) => apiRequest(`/mental-health/threads/${id}`),
}

export async function streamChat(message, threadId, onEvent) {
  const response = await fetch(`${API_BASE_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok) throw new Error('Chat stream request failed')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() || ''
    chunks.forEach((chunk) => {
      if (!chunk.startsWith('data: ')) return
      try { onEvent(JSON.parse(chunk.slice(6))) } catch { /* ignore incomplete SSE frames */ }
    })
  }
}
