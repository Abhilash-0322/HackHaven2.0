const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const demoUser = {
  id: 'demo-zen',
  username: 'maya',
  email: 'maya@zenheaven.co',
  full_name: 'Maya',
  calm_coins: 248,
}

export const demoThreads = [
  { id: 'thread-1', title: 'A gentler Monday', last_message: 'I feel a little more present now.', message_count: 8, updated_at: new Date().toISOString() },
  { id: 'thread-2', title: 'Making space for change', last_message: 'Small steps still count.', message_count: 4, updated_at: new Date(Date.now() - 86400000).toISOString() },
]

export const demoEntries = [
  { _id: 'journal-1', title: 'A quiet kind of progress', content: 'I took the long way home today. There was enough light left to notice the trees.', mood: 'hopeful', tags: ['reflection', 'outside'], created_at: new Date().toISOString() },
  { _id: 'journal-2', title: 'Learning to pause', content: 'Today I caught myself rushing and remembered I do not have to solve everything at once.', mood: 'calm', tags: ['mindfulness'], created_at: new Date(Date.now() - 172800000).toISOString() },
]

export const demoBooks = [
  { id: 'book-1', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'Notes, lists and stories to help you feel less alone.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'The power of rest and retreat in difficult times.' },
  { id: 'book-3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80', description: 'A lyrical invitation to listen to the living world.' },
  { id: 'book-4', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80', description: 'Reflections for a less hurried, more mindful life.' },
]

export const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, bio: 'A warm, practical approach to making sense of difficult seasons.', photo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247 },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, bio: 'Support for rebuilding trust with yourself and the people you love.', photo_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=85', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654 },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Cultural Identity', 'Transitions'], experience_years: 7, bio: 'Culturally sensitive care for the in-between chapters of life.', photo_url: 'https://images.unsplash.com/photo-1643297654410-1d6e2e3de8b3?auto=format&fit=crop&w=600&q=85', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, total_sessions: 445 },
]

export const demoSongs = [
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80' },
  { name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80' },
  { name: 'Anchor', artist: 'Novo Amor', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80' },
  { name: 'Mystery of Love', artist: 'Sufjan Stevens', album_cover_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=500&q=80' },
]

export async function api(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'Something went wrong')
  return response.json()
}

export async function safeApi(path, fallback, options = {}) {
  try {
    return await api(path, options)
  } catch {
    return fallback
  }
}

export async function signIn(payload, register = false) {
  const result = await api(register ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  localStorage.setItem('zenheaven_token', result.access_token)
  localStorage.setItem('zenheaven_user', JSON.stringify(result.user))
  return result.user
}
