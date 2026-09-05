const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export async function api(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Something went wrong')
  return data
}

export const authApi = {
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
}

export const fallbackTherapists = [
  { _id: 'sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D in Clinical Psychology, Stanford University', bio: 'CBT and mindfulness practices for a steadier inner world.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247, photo_url: 'https://i.pravatar.cc/160?img=47' },
  { _id: 'maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy, NYU', bio: 'A warm, collaborative space to reconnect with yourself and others.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654, photo_url: 'https://i.pravatar.cc/160?img=44' },
  { _id: 'aisha', name: 'Aisha Patel, LCSW', specializations: ['Cultural Identity', 'Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive care for the chapters that change us.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, total_sessions: 445, photo_url: 'https://i.pravatar.cc/160?img=32' },
]

export const fallbackBooks = [
  { id: '1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80', description: 'Reflections on mindfulness, stillness and the art of being present.' },
  { id: '2', title: 'Atlas of the Heart', author: 'Brené Brown', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80', description: 'Mapping the language of human experience and emotional connection.' },
  { id: '3', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80', description: 'The power of rest and retreat in difficult times.' },
  { id: '4', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80', description: 'Notes, lists and stories for difficult days.' },
]
