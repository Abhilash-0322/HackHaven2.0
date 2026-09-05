const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('zenheaven_token')

export const setSession = (token, user) => {
  localStorage.setItem('zenheaven_token', token)
  localStorage.setItem('zenheaven_user', JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem('zenheaven_token')
  localStorage.removeItem('zenheaven_user')
}

export const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('zenheaven_user') || 'null')
  } catch {
    return null
  }
}

const request = async (path, options = {}) => {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) {
    const message = typeof payload === 'object' ? payload.detail : payload
    throw new Error(message || `Request failed (${response.status})`)
  }
  return payload
}

const json = (method, path, body) => request(path, { method, body: JSON.stringify(body) })

export const api = {
  root: () => request('/'),
  auth: {
    login: (body) => json('POST', '/auth/login', body),
    register: (body) => json('POST', '/auth/register', body),
    me: () => request('/auth/me'),
    update: (body) => json('PUT', '/auth/me', body),
  },
  chat: {
    threads: () => request('/mental-health/threads'),
    thread: (id) => request(`/mental-health/threads/${id}`),
    send: (message, threadId) => json('POST', '/mental-health/chat', { message, thread_id: threadId || null, stream: false }),
    deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
    renameThread: (id, title) => json('PUT', `/mental-health/threads/${id}/title`, { title }),
    stream: async function* (message, threadId, signal) {
      const token = getToken()
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message, thread_id: threadId || null }),
        signal,
      })
      if (!response.ok || !response.body) throw new Error(`Chat stream failed (${response.status})`)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { value, done } = await reader.read()
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        for (const event of events) {
          const line = event.split('\n').find((part) => part.startsWith('data: '))
          if (!line) continue
          try {
            yield JSON.parse(line.slice(6))
          } catch {
            yield { type: 'token', data: line.slice(6) }
          }
        }
        if (done) break
      }
    },
  },
  journal: {
    entries: () => request('/journal/entries'),
    create: (body) => json('POST', '/journal/entries', body),
    update: (id, body) => json('PUT', `/journal/entries/${id}`, body),
    remove: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
    prompts: () => request('/journal/prompts'),
    insights: () => request('/journal/insights'),
    analyze: (content) => json('POST', '/journal/analyze-mood', { content }),
  },
  books: {
    byMood: () => request('/books/recommend-by-mood'),
    search: (query) => request(`/books/search?query=${encodeURIComponent(query)}`),
    similar: (id) => request(`/books/recommend/${id}`),
  },
  music: {
    songs: () => request('/songs'),
    recommend: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
    details: (song, artist) => request(`/song_details?song=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}`),
  },
  therapists: {
    list: (params = '') => request(`/therapists/${params}`),
    specializations: () => request('/therapists/specializations'),
    appointments: (userId) => request(`/therapists/appointments/user/${userId}`),
    book: (body) => json('POST', '/therapists/appointments', body),
  },
  coins: {
    balance: () => request('/coins/balance'),
    transactions: () => request('/coins/transactions'),
    rates: () => request('/coins/exchange-rates'),
    goals: () => request('/coins/daily-goals'),
    achievements: () => request('/coins/achievements'),
    streak: () => request('/coins/streak'),
    earn: (body) => json('POST', '/coins/earn', body),
    spend: (body) => json('POST', '/coins/spend', body),
  },
}

export const apiUrl = API_URL
