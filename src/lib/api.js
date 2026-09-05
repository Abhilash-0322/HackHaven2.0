const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('zenheaven_token')
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('zenheaven_user') || 'null')
  } catch {
    return null
  }
}

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(detail.detail || 'Something went wrong')
  }
  return response.json()
}

const demoUser = (username = 'you') => ({
  id: 'demo-user',
  username,
  email: `${username}@zenheaven.app`,
  full_name: 'Alex Morgan',
  calm_coins: 240,
})

const demoFallback = (username) => {
  const user = demoUser(username)
  localStorage.setItem('zenheaven_token', 'demo-token')
  localStorage.setItem('zenheaven_user', JSON.stringify(user))
  return { access_token: 'demo-token', token_type: 'bearer', user }
}

export const auth = {
  async login(username, password) {
    try {
      return await request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    } catch {
      return demoFallback(username)
    }
  },
  async register(payload) {
    try {
      return await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    } catch {
      return demoFallback(payload.username)
    }
  },
  async me() {
    return request('/auth/me')
  },
}

const demoThreads = [
  { id: 'demo-thread-1', title: 'A softer start to the week', last_message: 'I want to feel less overwhelmed.', message_count: 4 },
  { id: 'demo-thread-2', title: 'Making space for rest', last_message: 'How can I slow down?', message_count: 8 },
]

export const chat = {
  async threads() {
    try {
      return await request('/mental-health/threads')
    } catch {
      return { threads: demoThreads, total_count: demoThreads.length }
    }
  },
  async thread(id) {
    try {
      return await request(`/mental-health/threads/${id}`)
    } catch {
      return {
        thread: demoThreads.find((item) => item.id === id) || demoThreads[0],
        messages: [
          { id: 'welcome', content: 'Hi, I’m here with you. What feels most present today?', is_user: false },
          { id: 'demo-message', content: 'I want to feel less overwhelmed.', is_user: true },
        ],
      }
    }
  },
  async send(message, threadId, onEvent) {
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message, thread_id: threadId || null }),
      })
      if (!response.ok || !response.body) throw new Error('Chat unavailable')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        events.forEach((event) => {
          const line = event.split('\n').find((entry) => entry.startsWith('data: '))
          if (line) onEvent(JSON.parse(line.slice(6)))
        })
      }
    } catch {
      onEvent({ type: 'thinking', data: 'Taking a thoughtful pause…' })
      await new Promise((resolve) => setTimeout(resolve, 450))
      onEvent({
        type: 'complete',
        data: {
          thread_id: threadId || 'demo-thread-1',
          fallback_response:
            'Thank you for sharing that with me. You do not have to solve everything at once — what is one small, kind next step you could take in the next ten minutes?',
          coins_earned: 5,
        },
      })
    }
  },
}

const demoJournals = [
  { _id: 'journal-1', title: 'A little more spacious', content: 'I took a quiet walk and noticed I could breathe a little deeper.', mood: 'calm', created_at: new Date().toISOString() },
  { _id: 'journal-2', title: 'Naming the busy feeling', content: 'Today felt full, but writing it down made the day feel more manageable.', mood: 'hopeful', created_at: new Date(Date.now() - 86400000).toISOString() },
]

export const journal = {
  async entries() {
    try {
      return await request('/journal/entries')
    } catch {
      return demoJournals
    }
  },
  async prompts() {
    try {
      return await request('/journal/prompts')
    } catch {
      return [
        { prompt: 'What made you smile today?', category: 'gratitude' },
        { prompt: 'What is one small win you had today?', category: 'achievements' },
        { prompt: 'Describe a moment of calm you experienced recently.', category: 'mindfulness' },
      ]
    }
  },
  async create(content, mood) {
    try {
      return await request('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [] }) })
    } catch {
      const entry = { _id: `journal-${Date.now()}`, title: 'A moment worth keeping', content, mood: mood || 'reflective', created_at: new Date().toISOString() }
      return entry
    }
  },
}

const demoBooks = [
  { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'Reflections on mindfulness, rest, and being present.' },
  { id: 'book-2', title: 'Atlas of the Heart', author: 'Brené Brown', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'A generous vocabulary for the feelings that shape our lives.' },
  { id: 'book-3', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=500&q=80', description: 'The quiet beauty of rest and retreat in difficult seasons.' },
  { id: 'book-4', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80', description: 'Notes, lists, and small reminders for tender days.' },
]

export const books = {
  async recommendations() {
    try {
      return await request('/books/recommend-by-mood')
    } catch {
      return { mood: 'calm', mood_description: 'Books selected to help you feel grounded.', books: demoBooks }
    }
  },
  async search(query) {
    try {
      return await request(`/books/search?q=${encodeURIComponent(query)}`)
    } catch {
      return { books: demoBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())) }
    }
  },
}

export const music = {
  async songs() {
    try {
      return await request('/songs')
    } catch {
      return { songs: ['Bloom', 'Holocene', 'Weightless', 'Sunset Lover', 'Riverside', 'Anchor'] }
    }
  },
  async recommend(song) {
    try {
      return await request(`/recommend?song=${encodeURIComponent(song)}`)
    } catch {
      return { input_song: song, recommendations: [{ name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80' }, { name: 'Anchor', artist: 'Novo Amor', album_cover_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80' }] }
    }
  },
}

const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D. in Clinical Psychology', bio: 'Warm, practical support grounded in CBT and mindfulness.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy', bio: 'A collaborative space for navigating change and connection.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80' },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive care for the chapters that change us.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, total_sessions: 445, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80' },
]

export const therapists = {
  async list() {
    try {
      return await request('/therapists/')
    } catch {
      return demoTherapists
    }
  },
}

export const coins = {
  async balance() {
    try {
      return await request('/coins/balance')
    } catch {
      return { balance: getStoredUser()?.calm_coins || 240 }
    }
  },
  async transactions() {
    try {
      return await request('/coins/transactions')
    } catch {
      return [
        { _id: 'tx-1', amount: 10, transaction_type: 'earn', source: 'journal', description: 'Created a new journal entry', timestamp: new Date().toISOString() },
        { _id: 'tx-2', amount: 5, transaction_type: 'earn', source: 'mental_health_chat', description: 'Checked in with CalmBot', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ]
    }
  },
}
