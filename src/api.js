const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const demoUser = {
  id: 'demo-vault-user',
  username: 'maya',
  email: 'maya@zenheaven.app',
  full_name: 'Maya',
  calm_coins: 2840,
}

async function request(path, options = {}) {
  const token = localStorage.getItem('zen_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'Request unavailable')
  return response.json()
}

export const api = {
  base: API_URL,
  async login(payload) {
    const result = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem('zen_token', result.access_token)
    return result.user
  },
  async register(payload) {
    const result = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem('zen_token', result.access_token)
    return result.user
  },
  me: () => request('/auth/me'),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  goals: () => request('/coins/daily-goals'),
  therapists: () => request('/therapists/'),
  books: (mood = 'balanced') => request(`/books/recommend-by-mood?user_id=${encodeURIComponent(mood === 'balanced' ? '' : mood)}`),
  journal: () => request('/journal/entries'),
  prompts: () => request('/journal/prompts'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  async chat(message, threadId, onEvent) {
    const token = localStorage.getItem('zen_token')
    const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ message, thread_id: threadId || null }),
    })
    if (!response.ok || !response.body) throw new Error('Chat is resting right now')
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
        const line = event.split('\n').find((item) => item.startsWith('data: '))
        if (line) onEvent(JSON.parse(line.slice(6)))
      })
    }
  },
  createJournal: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
  earnCoins: (payload) => request('/coins/earn', { method: 'POST', body: JSON.stringify(payload) }),
}

export async function withFallback(fn, fallback) {
  try {
    return await fn()
  } catch {
    return fallback
  }
}
