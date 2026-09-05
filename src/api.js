const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const demoUser = {
  id: 'demo-user',
  username: 'alex',
  email: 'alex@example.com',
  full_name: 'Alex Morgan',
  calm_coins: 284,
}

export const fallback = {
  threads: [
    { id: 'demo-thread', title: 'A softer start to the week', last_message: 'Let’s make space for one small win today.', message_count: 8, updated_at: new Date().toISOString() },
    { id: 'demo-thread-2', title: 'Working through the noise', last_message: 'You do not have to solve everything at once.', message_count: 12, updated_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  journals: [
    { _id: 'demo-journal-1', title: 'A quiet morning', content: 'I took a walk before the day began. The air felt clear and I remembered that I can choose a slower pace.', mood: 'calm', tags: ['morning', 'mindfulness'], created_at: new Date().toISOString() },
    { _id: 'demo-journal-2', title: 'Finding my footing', content: 'There was a lot on my mind, but I wrote down the next small thing instead of holding the entire week at once.', mood: 'hopeful', tags: ['growth'], created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
  books: [
    { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', description: 'A gentle guide to finding stillness and perspective in a busy world.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80' },
    { id: 'book-2', title: 'Wintering', author: 'Katherine May', description: 'The quiet power of rest and retreat in difficult seasons.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
    { id: 'book-3', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes, lists and stories to help you feel a little less alone.', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80' },
    { id: 'book-4', title: 'Atomic Habits', author: 'James Clear', description: 'Tiny changes, remarkable results — a practical reset for everyday life.', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80' },
  ],
  songs: ['Weightless', 'Bloom', 'Holocene', 'Sunset Lover', 'Anchor', 'A Moment Apart'],
  therapists: [
    { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness', 'Stress management'], experience_years: 12, bio: 'A warm, practical approach to feeling more at home in your everyday life.', hourly_rate: 120, rating: 4.9, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
    { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem', 'Life transitions'], experience_years: 8, bio: 'Helping you build kinder relationships with yourself and the people around you.', hourly_rate: 100, rating: 4.8, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80' },
    { _id: 'therapist-3', name: 'Dr. Michael Chen', specializations: ['Trauma', 'Family therapy', 'PTSD'], experience_years: 15, bio: 'Evidence-based care with patience, context and a lot of room to breathe.', hourly_rate: 135, rating: 4.7, languages: ['English', 'Mandarin'], photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80' },
  ],
}

async function request(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
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
  url: API_URL,
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/auth/me'),
    update: (payload) => request('/auth/me', { method: 'PUT', body: JSON.stringify(payload) }),
  },
  threads: {
    list: () => request('/mental-health/threads'),
    get: (id) => request(`/mental-health/threads/${id}`),
    remove: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  },
  journal: {
    list: () => request('/journal/entries'),
    create: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
    prompts: () => request('/journal/prompts'),
    insights: () => request('/journal/insights'),
    analyze: (payload) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify(payload) }),
  },
  books: {
    byMood: (userId) => request(`/books/recommend-by-mood${userId ? `?user_id=${userId}` : ''}`),
    search: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
    similar: (id) => request(`/books/recommend/${id}`),
  },
  music: {
    songs: () => request('/songs'),
    recommend: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  },
  therapists: {
    list: () => request('/therapists/'),
    detail: (id) => request(`/therapists/${id}`),
    book: (payload) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(payload) }),
    appointments: (userId) => request(`/therapists/appointments/user/${userId}?upcoming_only=true`),
  },
  coins: {
    balance: () => request('/coins/balance'),
    transactions: () => request('/coins/transactions'),
    goals: () => request('/coins/daily-goals'),
    streak: () => request('/coins/streak'),
    rates: () => request('/coins/exchange-rates'),
  },
}

export async function streamChat(message, threadId, handlers) {
  const token = localStorage.getItem('zenheaven_token')
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok || !response.body) throw new Error('Unable to start chat')
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
      const line = event.split('\n').find((entry) => entry.startsWith('data:'))
      if (!line) return
      try {
        const payload = JSON.parse(line.slice(5).trim())
        handlers[payload.type]?.(payload.data)
      } catch {
        // Ignore incomplete SSE frames.
      }
    })
  }
}

export function formatError(error) {
  return error?.message || 'Something went wrong. Please try again.'
}
