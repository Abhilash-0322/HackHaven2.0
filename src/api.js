const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const getToken = () => localStorage.getItem('zenheaven_token')

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    let detail = 'Something went wrong'
    try {
      const body = await response.json()
      detail = body.detail || detail
    } catch {
      // Keep the friendly fallback message.
    }
    throw new Error(detail)
  }
  return response.json()
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  streak: () => request('/coins/streak'),
  goals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  journalEntries: () => request('/journal/entries'),
  prompts: () => request('/journal/prompts'),
  createJournal: (body) => request('/journal/entries', { method: 'POST', body: JSON.stringify(body) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  books: (mood = '') => request(`/books/recommend-by-mood${mood ? `?user_id=${encodeURIComponent(mood)}` : ''}`),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  therapists: () => request('/therapists/'),
  therapist: (id) => request(`/therapists/${id}`),
  songs: () => request('/songs'),
  recommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
}

export const streamChat = async (message, threadId, onEvent) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok || !response.body) throw new Error('Chat is taking a quiet moment. Try again soon.')

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
      if (line) {
        try { onEvent(JSON.parse(line.slice(6))) } catch { /* Ignore malformed keep-alive chunks. */ }
      }
    })
  }
}

export const demo = {
  user: { id: 'demo-user', username: 'maya', email: 'maya@example.com', full_name: 'Maya', calm_coins: 248 },
  streak: { current_streak: 7, longest_streak: 12 },
  goals: [
    { id: 1, title: 'Check in with your mind', current: 1, target: 1, coins: 10, completed: true, icon: 'Heart' },
    { id: 2, title: 'Write one honest line', current: 0, target: 1, coins: 15, completed: false, icon: 'BookOpen' },
    { id: 3, title: 'Take a mindful pause', current: 0, target: 1, coins: 5, completed: false, icon: 'Wind' },
  ],
  entries: [
    { _id: 'demo-1', title: 'A softer start', content: 'I gave myself ten quiet minutes before opening my phone. The day felt less rushed.', mood: 'calm', tags: ['morning', 'self-care'], created_at: '2025-06-18T08:30:00Z' },
    { _id: 'demo-2', title: 'Small wins count', content: 'I asked for help instead of carrying everything alone. That felt brave.', mood: 'hopeful', tags: ['growth'], created_at: '2025-06-16T19:10:00Z' },
  ],
  threads: [
    { id: 'demo-thread', title: 'Finding a little more calm', message_count: 4, last_message: 'I want to feel less overwhelmed.' },
  ],
  therapists: [
    { _id: 'sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, education: 'Ph.D. Clinical Psychology', bio: 'Warm, practical support for anxious minds and busy lives.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 1247, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&q=80' },
    { _id: 'maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem'], experience_years: 8, education: 'M.S. Marriage & Family Therapy', bio: 'A compassionate space to build healthier connections with yourself and others.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 654, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=240&q=80' },
    { _id: 'aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive care for seasons of change, loss, and becoming.', hourly_rate: 95, languages: ['English', 'Hindi'], rating: 4.9, total_sessions: 445, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=240&q=80' },
  ],
}
