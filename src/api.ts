const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export type User = { id: string; username: string; email: string; full_name?: string; calm_coins: number }
export type Thread = { id: string; title: string; message_count: number; last_message?: string; updated_at?: string }
export type Message = { id?: string; content: string; is_user: boolean; timestamp?: string; coins_earned?: number }
export type Journal = { _id?: string; title?: string; content: string; mood?: string; tags?: string[]; created_at?: string }
export type Book = { id: string; title: string; author?: string; image_url?: string; description?: string }
export type Therapist = { _id: string; name: string; specializations: string[]; experience_years: number; bio: string; hourly_rate: number; languages: string[]; rating: number; photo_url?: string }

const demoUser: User = { id: 'demo-user', username: 'maya', email: 'maya@example.com', full_name: 'Maya Chen', calm_coins: 340 }
const demoThreads: Thread[] = [
  { id: 'demo-1', title: 'Making space for uncertainty', message_count: 8, last_message: 'You are allowed to take it one breath at a time.', updated_at: new Date().toISOString() },
  { id: 'demo-2', title: 'A gentler morning routine', message_count: 4, last_message: 'Small rituals can become anchors.', updated_at: new Date(Date.now() - 86400000).toISOString() },
]
const demoBooks: Book[] = [
  { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', description: 'Reflections on mindfulness and finding calm in a busy world.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', description: 'The quiet power of rest and retreat in difficult seasons.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
  { id: 'book-3', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes, lists and stories to help you feel less alone.', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80' },
]
const demoTherapists: Therapist[] = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, bio: 'Cognitive behavioral therapy and mindfulness for steadier days.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=80' },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, bio: 'A warm, collaborative space to understand your patterns and build connection.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=240&q=80' },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Cultural Identity'], experience_years: 7, bio: 'Culturally sensitive support for transitions, grief and finding meaning.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&q=80' },
]

export const getToken = () => localStorage.getItem('zen-token')
export const isDemo = () => !getToken() || localStorage.getItem('zen-demo') === 'true'
export const setSession = (token: string, user: User) => { localStorage.setItem('zen-token', token); localStorage.setItem('zen-user', JSON.stringify(user)); localStorage.removeItem('zen-demo') }
export const clearSession = () => { localStorage.removeItem('zen-token'); localStorage.removeItem('zen-user') }
export const getStoredUser = (): User | null => { try { return JSON.parse(localStorage.getItem('zen-user') || 'null') } catch { return null } }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Something went wrong')
  return response.json()
}

export async function authenticate(path: '/auth/login' | '/auth/register', body: object) {
  if (isDemo()) {
    const user = { ...demoUser, username: (body as any).username || demoUser.username, full_name: (body as any).full_name || demoUser.full_name }
    localStorage.setItem('zen-demo', 'true'); localStorage.setItem('zen-user', JSON.stringify(user))
    return { access_token: 'demo-token', user }
  }
  const result = await request<{ access_token: string; user: User }>(path, { method: 'POST', body: JSON.stringify(body) })
  setSession(result.access_token, result.user)
  return result
}

export const fetchThreads = async () => isDemo() ? demoThreads : (await request<{ threads: Thread[] }>('/mental-health/threads')).threads
export const fetchThread = async (id: string) => isDemo() ? { thread: demoThreads.find((t) => t.id === id) || demoThreads[0], messages: [{ id: '1', content: 'Welcome back. What feels most present for you today?', is_user: false }, { id: '2', content: 'I want to feel less rushed in my own life.', is_user: true }] as Message[] } : request<{ thread: Thread; messages: Message[] }>(`/mental-health/threads/${id}`)
export const deleteThread = async (id: string) => { if (!isDemo()) await request(`/mental-health/threads/${id}`, { method: 'DELETE' }) }
export const fetchJournals = async () => isDemo() ? [{ _id: 'j1', title: 'A little more room', content: 'I noticed that taking a walk before my first meeting gave me room to breathe.', mood: 'hopeful', tags: ['reflection', 'self-care'], created_at: new Date().toISOString() }] : request<Journal[]>('/journal/entries')
export const createJournal = async (body: { content: string; mood?: string; tags?: string[] }) => isDemo() ? { _id: crypto.randomUUID(), title: 'A new reflection', content: body.content, mood: body.mood, tags: body.tags, created_at: new Date().toISOString() } : request<Journal>('/journal/entries', { method: 'POST', body: JSON.stringify(body) })
export const fetchBooks = async () => isDemo() ? { mood: 'hopeful', mood_description: 'Books to nurture possibility and a softer pace.', books: demoBooks } : request<{ mood: string; mood_description: string; books: Book[] }>('/books/recommend-by-mood')
export const searchBooks = async (q: string) => isDemo() ? { books: demoBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(q.toLowerCase())) } : request<{ books: Book[] }>(`/books/search?q=${encodeURIComponent(q)}`)
export const fetchTherapists = async () => isDemo() ? demoTherapists : request<Therapist[]>('/therapists/')
export const fetchBalance = async () => isDemo() ? { balance: demoUser.calm_coins } : request<{ balance: number }>('/coins/balance')
export const fetchTransactions = async () => isDemo() ? [{ amount: 10, source: 'journal', description: 'Created a new journal entry', timestamp: new Date().toISOString() }, { amount: 5, source: 'mental_health_chat', description: 'Checked in with CalmBot', timestamp: new Date(Date.now() - 86400000).toISOString() }] : request<any[]>('/coins/transactions')

export async function streamChat(message: string, threadId: string | null, onEvent: (event: any) => void) {
  if (isDemo()) {
    const response = 'That sounds like a lot to hold at once. Let’s make the next moment a little smaller: notice your feet on the floor, soften your shoulders, and choose one kind thing you can do for yourself today.'
    onEvent({ type: 'thread_id', data: threadId || 'demo-1' }); onEvent({ type: 'thinking', data: 'Finding the gentlest way in…' }); onEvent({ type: 'response_start', data: '' })
    for (const word of response.split(' ')) { await new Promise((resolve) => setTimeout(resolve, 24)); onEvent({ type: 'token', data: `${word} ` }) }
    onEvent({ type: 'complete', data: { thread_id: threadId || 'demo-1', coins_earned: 5 } }); return
  }
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ message, thread_id: threadId }) })
  if (!response.body) throw new Error('Streaming is not supported in this browser')
  const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
  while (true) {
    const { value, done } = await reader.read(); if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n'); buffer = lines.pop() || ''
    for (const line of lines) if (line.startsWith('data: ')) try { onEvent(JSON.parse(line.slice(6))) } catch { /* skip malformed event */ }
  }
}
