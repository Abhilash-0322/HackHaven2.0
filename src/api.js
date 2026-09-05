const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const demoUser = {
  id: 'demo-user',
  username: 'flow_state',
  email: 'you@zenheaven.app',
  full_name: 'Flow seeker',
  calm_coins: 248,
}

export const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'CBT', 'Stress'], experience_years: 12, bio: 'Evidence-based support for busy minds, with a warm and practical approach.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247 },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Self-esteem', 'Relationships', 'Transitions'], experience_years: 8, bio: 'A grounded space to reconnect with yourself and the people you love.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654 },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief', 'Identity', 'Life transitions'], experience_years: 7, bio: 'Culturally sensitive care for the chapters that change everything.', hourly_rate: 95, languages: ['English', 'Hindi'], rating: 4.8, total_sessions: 445 },
]

export const demoBooks = [
  { id: 'book-1', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes, lists, and stories for difficult days and gentle resets.', image_url: 'https://covers.openlibrary.org/b/isbn/1838855615-L.jpg' },
  { id: 'book-2', title: 'Atomic Habits', author: 'James Clear', description: 'Tiny changes that create remarkable results over time.', image_url: 'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg' },
  { id: 'book-3', title: 'Wintering', author: 'Katherine May', description: 'The power of rest and retreat in difficult times.', image_url: 'https://covers.openlibrary.org/b/isbn/0593189699-L.jpg' },
  { id: 'book-4', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', description: 'Mindfulness and self-compassion for a noisy world.', image_url: 'https://covers.openlibrary.org/b/isbn/0143130773-L.jpg' },
]

export const demoSongs = [
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80', spotify_uri: 'spotify:track:demo1' },
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', spotify_uri: 'spotify:track:demo2' },
  { name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', spotify_uri: 'spotify:track:demo3' },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', album_cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80', spotify_uri: 'spotify:track:demo4' },
]

async function request(path, options = {}) {
  const token = localStorage.getItem('zen_token')
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
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  chat: (payload) => request('/mental-health/chat', { method: 'POST', body: JSON.stringify(payload) }),
  journalEntries: () => request('/journal/entries'),
  journalPrompts: () => request('/journal/prompts'),
  createJournal: (payload) => request('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMood: (content) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
  booksByMood: () => request('/books/recommend-by-mood'),
  searchBooks: (q) => request(`/books/search?q=${encodeURIComponent(q)}`),
  songs: () => request('/songs'),
  recommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: () => request('/therapists/'),
  therapist: (id) => request(`/therapists/${id}`),
  appointments: (userId) => request(`/therapists/appointments/user/${userId}?upcoming_only=true`),
  bookAppointment: (payload) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  dailyGoals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  rates: () => request('/coins/exchange-rates'),
}

export async function streamChat(message, threadId, onEvent) {
  const token = localStorage.getItem('zen_token')
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ message, thread_id: threadId }),
  })
  if (!response.ok || !response.body) throw new Error('Stream unavailable')
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
      if (line) {
        try { onEvent(JSON.parse(line.replace('data: ', ''))) } catch { /* ignore malformed SSE frames */ }
      }
    })
  }
}
