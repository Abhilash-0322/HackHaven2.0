const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function api(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'API unavailable')
  return response.json()
}

export async function safeApi(path, fallback, options = {}) {
  try { return await api(path, options) } catch { return fallback }
}

export async function recordRitual(message) {
  return api('/journal/entries', { method: 'POST', body: JSON.stringify({ content: message, mood: 'hopeful', tags: ['zenheaven', 'web3'] }) })
}
