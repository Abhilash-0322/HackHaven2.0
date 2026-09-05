const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function api(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.detail || body.message || 'The sanctuary is temporarily offline.')
  return body
}

export function rememberSession(token, user) {
  localStorage.setItem('zenheaven_token', token)
  localStorage.setItem('zenheaven_user', JSON.stringify(user))
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('zenheaven_user') || 'null')
  } catch {
    return null
  }
}

export const demoUser = {
  id: 'did-demo-7c4b',
  username: 'maya',
  email: 'maya@zenheaven.local',
  full_name: 'Maya Anand',
  calm_coins: 240,
}

export const demoTracks = [
  { name: 'A Walk', artist: 'Tycho', album_cover_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&q=80', spotify_uri: null },
  { name: 'Bloom', artist: 'Odesza', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', spotify_uri: null },
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80', spotify_uri: null },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', album_cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80', spotify_uri: null },
]

export const demoBooks = [
  { id: 'demo-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80', description: 'Reflections on mindfulness and the quiet wisdom of slowing down.' },
  { id: 'demo-2', title: 'Atlas of the Heart', author: 'Brené Brown', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80', description: 'Mapping the language of human emotions to build a more wholehearted life.' },
  { id: 'demo-3', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80', description: 'The power of rest and retreat in difficult times.' },
  { id: 'demo-4', title: 'How to Do Nothing', author: 'Jenny Odell', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80', description: 'Resisting the attention economy and reconnecting with the world.' },
]

export const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D in Clinical Psychology, Stanford University', bio: 'CBT and mindfulness specialist helping clients build a gentler relationship with their inner world.', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247 },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy, NYU', bio: 'A warm, collaborative therapist for people navigating change, connection, and self-trust.', photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654 },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Cultural Identity', 'Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive therapy to help you find meaning through life’s difficult transitions.', photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, total_sessions: 445 },
]

export async function withFallback(request, fallback) {
  try {
    return await request()
  } catch {
    return fallback
  }
}
