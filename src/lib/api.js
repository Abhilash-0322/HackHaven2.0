export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const TOKEN_KEY = 'zenheaven_token';
export const USER_KEY = 'zenheaven_user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function getStoredUser() {
  try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
export function setStoredUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try { const body = await response.json(); detail = body.detail || body.message || detail; if (typeof detail === 'object') detail = JSON.stringify(detail); } catch { /* */ }
    throw new Error(detail);
  }
  if (response.status === 204) return null;
  const ct = response.headers.get('content-type') || '';
  return ct.includes('application/json') ? response.json() : response.text();
}

export const authApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
};

export const chatApi = {
  getThreads: (limit = 20, offset = 0) => request(`/mental-health/threads?limit=${limit}&offset=${offset}`),
  getThread: (threadId) => request(`/mental-health/threads/${threadId}`),
  deleteThread: (threadId) => request(`/mental-health/threads/${threadId}`, { method: 'DELETE' }),
  streamChat: (message, threadId, onEvent) => {
    const controller = new AbortController();
    const token = getToken();
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/mental-health/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ message, thread_id: threadId || null }),
          signal: controller.signal,
        });
        if (!response.ok) { const err = await response.json().catch(() => ({})); onEvent({ type: 'error', data: err.detail || 'Stream failed' }); return; }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) { try { onEvent(JSON.parse(line.slice(6))); } catch { /* */ } }
          }
        }
      } catch (err) { if (err.name !== 'AbortError') onEvent({ type: 'error', data: err.message }); }
    })();
    return () => controller.abort();
  },
};

export const journalApi = {
  getEntries: () => request('/journal/entries'),
  createEntry: (data) => request('/journal/entries', { method: 'POST', body: JSON.stringify(data) }),
  deleteEntry: (id) => request(`/journal/entries/${id}`, { method: 'DELETE' }),
  getPrompts: () => request('/journal/prompts'),
  getInsights: () => request('/journal/insights'),
  analyzeMood: (content) => request('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
};

export const booksApi = {
  recommendByMood: (userId) => request(`/books/recommend-by-mood${userId ? `?user_id=${userId}` : ''}`),
  search: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
};

export const musicApi = {
  getSongs: () => request('/songs'),
  getRecommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
};

export const therapistsApi = {
  list: () => request('/therapists/'),
  get: (id) => request(`/therapists/${id}`),
  bookAppointment: (data) => request('/therapists/appointments', { method: 'POST', body: JSON.stringify(data) }),
};

export const coinsApi = {
  getBalance: () => request('/coins/balance'),
  spend: (amount, source, description) => request('/coins/spend', { method: 'POST', body: JSON.stringify({ amount, source, description }) }),
  getTransactions: (limit = 20) => request(`/coins/transactions?limit=${limit}`),
  getDailyGoals: () => request('/coins/daily-goals'),
  getAchievements: () => request('/coins/achievements'),
  getStreak: () => request('/coins/streak'),
};
