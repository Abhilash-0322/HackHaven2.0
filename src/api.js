const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const request = async (path, options = {}) => {
  const token = localStorage.getItem('zenheaven_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

const json = (body) => ({ method: 'POST', body: JSON.stringify(body) })

export const api = {
  register: (body) => request('/auth/register', json(body)),
  login: (body) => request('/auth/login', json(body)),
  me: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  balance: () => request('/coins/balance'),
  transactions: () => request('/coins/transactions'),
  goals: () => request('/coins/daily-goals'),
  achievements: () => request('/coins/achievements'),
  streak: () => request('/coins/streak'),
  exchangeRates: () => request('/coins/exchange-rates'),
  earn: (body) => request('/coins/earn', json(body)),
  spend: (body) => request('/coins/spend', json(body)),
  threads: () => request('/mental-health/threads'),
  thread: (id) => request(`/mental-health/threads/${id}`),
  chat: (body) => request('/mental-health/chat', json(body)),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: 'DELETE' }),
  entries: () => request('/journal/entries'),
  prompts: () => request('/journal/prompts'),
  insights: () => request('/journal/insights'),
  createEntry: (body) => request('/journal/entries', json(body)),
  deleteEntry: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  analyzeMood: (body) => request('/journal/analyze-mood', json(body)),
  booksByMood: () => request('/books/recommend-by-mood'),
  searchBooks: (q) => request(`/books/search?q=${encodeURIComponent(q)}`),
  bookRecommendations: (id) => request(`/books/recommend/${id}`),
  songs: () => request('/songs'),
  recommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: () => request('/therapists/'),
  therapist: (id) => request(`/therapists/${id}`),
  appointments: (userId) => request(`/therapists/appointments/user/${userId}?upcoming_only=true`),
  bookAppointment: (body) => request('/therapists/appointments', json(body)),
}

export const demoBooks = [
  { id: '1', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes on hope, survival and the small things that make life worth living.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', description: 'Tiny changes, remarkable results. A practical guide to building better habits.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' },
  { id: '3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', description: 'Indigenous wisdom, scientific knowledge and the teachings of plants.', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80' },
  { id: '4', title: 'The Creative Act', author: 'Rick Rubin', description: 'A beautiful field guide for living a more creative, awake life.', image_url: 'https://images.unsplash.com/photo-1511108690759-009cbe9f7340?w=400&q=80' },
]

export const demoTherapists = [
  { _id: 'demo-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, rating: 4.9, hourly_rate: 120, languages: ['English', 'Spanish'], bio: 'CBT and mindfulness therapist helping people return to a steadier center.', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
  { _id: 'demo-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem'], experience_years: 8, rating: 4.8, hourly_rate: 100, languages: ['English', 'Spanish'], bio: 'Warm, practical support for relationships, transitions and self-trust.', photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
  { _id: 'demo-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Life Transitions'], experience_years: 7, rating: 4.9, hourly_rate: 95, languages: ['English', 'Hindi'], bio: 'Culturally sensitive therapy for finding meaning through change.', photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
]

export const demoSongs = ['Good Days', 'Golden Hour', 'Bloom', 'Sunset Lover', 'Lovely Day']
