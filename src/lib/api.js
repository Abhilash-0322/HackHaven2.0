export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'zenheaven_token';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || data.message || `Request failed (${response.status})`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export function authHeaders(token, extra = {}) {
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: authHeaders(token, options.headers) });
  return parseJsonResponse(response);
}

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  me: () => apiRequest('/auth/me'),
};

export async function streamChat(message, threadId, onEvent) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/mental-health/chat/stream`, {
    method: 'POST', headers: authHeaders(token), body: JSON.stringify({ message, thread_id: threadId || null }),
  });
  if (!response.ok) throw new Error('Chat stream request failed');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() || '';
    for (const chunk of chunks) {
      if (!chunk.startsWith('data: ')) continue;
      try { onEvent(JSON.parse(chunk.slice(6))); } catch { /* skip */ }
    }
  }
}

export const chatApi = {
  getThreads: (limit = 20, offset = 0) => apiRequest(`/mental-health/threads?limit=${limit}&offset=${offset}`),
  getThread: (threadId) => apiRequest(`/mental-health/threads/${threadId}`),
  deleteThread: (threadId) => apiRequest(`/mental-health/threads/${threadId}`, { method: 'DELETE' }),
  streamChat,
};

export const journalApi = {
  getEntries: () => apiRequest('/journal/entries'),
  createEntry: (entry) => apiRequest('/journal/entries', { method: 'POST', body: JSON.stringify(entry) }),
  deleteEntry: (id) => apiRequest(`/journal/entries/${id}`, { method: 'DELETE' }),
  analyzeMood: (content) => apiRequest('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) }),
  getPrompts: () => apiRequest('/journal/prompts'),
  getInsights: () => apiRequest('/journal/insights'),
};

export const booksApi = {
  recommendByMood: (userId) => apiRequest(`/books/recommend-by-mood${userId ? `?user_id=${userId}` : ''}`),
  search: (query) => apiRequest(`/books/search?q=${encodeURIComponent(query)}`),
  recommend: (bookId) => apiRequest(`/books/recommend/${encodeURIComponent(bookId)}`),
};

export const musicApi = {
  getSongs: () => apiRequest('/songs'),
  recommend: (song) => apiRequest(`/recommend?song=${encodeURIComponent(song)}`),
};

export const therapistsApi = {
  list: (params = {}) => { const q = new URLSearchParams(params).toString(); return apiRequest(`/therapists${q ? `?${q}` : ''}`); },
  get: (id) => apiRequest(`/therapists/${id}`),
  bookAppointment: (appointment) => apiRequest('/therapists/appointments', { method: 'POST', body: JSON.stringify(appointment) }),
  getUserAppointments: (userId) => apiRequest(`/therapists/appointments/user/${userId}`),
  cancelAppointment: (id) => apiRequest(`/therapists/appointments/${id}`, { method: 'DELETE' }),
};

export const coinsApi = {
  getBalance: () => apiRequest('/coins/balance'),
  getTransactions: (limit = 20) => apiRequest(`/coins/transactions?limit=${limit}`),
  getDailyGoals: () => apiRequest('/coins/daily-goals'),
  getAchievements: () => apiRequest('/coins/achievements'),
  getStreak: () => apiRequest('/coins/streak'),
  spend: (amount, source, description) => apiRequest('/coins/spend', { method: 'POST', body: JSON.stringify({ amount, source, description }) }),
  redeem: (amount, source, description) => apiRequest('/coins/spend', { method: 'POST', body: JSON.stringify({ amount, source, description }) }),
};
