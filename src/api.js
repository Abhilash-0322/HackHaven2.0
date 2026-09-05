const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export const demoUser = {
  id: 'demo-user',
  username: 'alex',
  full_name: 'Alex Morgan',
  email: 'alex@example.com',
  calm_coins: 280,
}

export const demoTherapists = [
  { _id: 'sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, bio: 'Warm, practical support for untangling anxious thoughts and building calmer routines.', photo_url: '', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247 },
  { _id: 'maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem'], experience_years: 8, bio: 'A collaborative space to explore relationships, boundaries, and the stories we tell ourselves.', photo_url: '', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654 },
  { _id: 'aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Life transitions'], experience_years: 7, bio: 'Culturally sensitive care for seasons of change, grief, and finding a new sense of meaning.', photo_url: '', hourly_rate: 95, languages: ['English', 'Hindi'], rating: 4.8, total_sessions: 445 },
]

export const demoBooks = [
  { id: '1', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes, stories and ideas to help you feel a little more held.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80' },
  { id: '2', title: 'Atlas of the Heart', author: 'Brené Brown', description: 'Mapping the language of human emotion and connection.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
  { id: '3', title: 'Wintering', author: 'Katherine May', description: 'The power of rest and retreat in difficult times.', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80' },
  { id: '4', title: 'How to Do Nothing', author: 'Jenny Odell', description: 'Resisting the attention economy and coming back to yourself.', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80' },
]

const getHeaders = (json = false) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  ...(localStorage.getItem('zenheaven_token') ? { Authorization: `Bearer ${localStorage.getItem('zenheaven_token')}` } : {}),
})

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(Boolean(options.body)), ...options.headers },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'Something went wrong')
  return response.json()
}

export async function tryApi(path, fallback, options = {}) {
  try {
    return await api(path, options)
  } catch {
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

export async function signIn(username, password, register = false, full_name = '') {
  const path = register ? '/auth/register' : '/auth/login'
  const body = register ? { username, email: username.includes('@') ? username : `${username}@zenheaven.demo`, password, full_name } : { username, password }
  const data = await api(path, { method: 'POST', body: JSON.stringify(body) })
  localStorage.setItem('zenheaven_token', data.access_token)
  localStorage.setItem('zenheaven_user', JSON.stringify(data.user))
  return data.user
}

export function signOut() {
  localStorage.removeItem('zenheaven_token')
  localStorage.removeItem('zenheaven_user')
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('zenheaven_user')) || null
  } catch {
    return null
  }
}

export async function streamChat(message, threadId, onEvent) {
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ message, thread_id: threadId || null }),
  })
  if (!response.ok || !response.body) throw new Error('Chat is taking a quiet moment. Please try again.')
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
        try { onEvent(JSON.parse(line.replace(/^data:\s*/, ''))) } catch { /* ignore malformed chunks */ }
      }
    })
  }
}

export { API_URL }
