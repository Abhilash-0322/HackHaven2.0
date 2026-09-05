const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const TOKEN_KEY = 'zenheaven_token'

export async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || `Request failed (${response.status})`)
  return response.status === 204 ? null : response.json()
}

export const authApi = {
  login: (body) => api('/auth/login', { method: 'POST', body }),
  register: (body) => api('/auth/register', { method: 'POST', body }),
  me: () => api('/auth/me'),
}

export const FALLBACK = {
  user: { id: 'demo-user', username: 'explorer', full_name: 'Ari Explorer', email: 'ari@zenheaven.local', calm_coins: 1280 },
  blocks: [
    { number: 18420987, hash: '0x8a7c...41de', txs: 142, time: '12 sec ago', state: 'finalized', fee: '0.00004 ETH' },
    { number: 18420986, hash: '0x17ef...9b20', txs: 98, time: '28 sec ago', state: 'finalized', fee: '0.00003 ETH' },
    { number: 18420985, hash: '0x4d19...e8a1', txs: 217, time: '44 sec ago', state: 'finalized', fee: '0.00006 ETH' },
    { number: 18420984, hash: '0xb02f...0c77', txs: 76, time: '59 sec ago', state: 'finalized', fee: '0.00002 ETH' },
  ],
  activity: [
    { hash: '0x93c1...7fa2', type: 'Journal entry', detail: 'mood signal committed', value: '+12 CALM', time: '2 min ago', tone: 'lime' },
    { hash: '0x4e20...a91d', type: 'Sound room', detail: 'listening path minted', value: '+8 CALM', time: '14 min ago', tone: 'blue' },
    { hash: '0x0ab8...16c4', type: 'Daily protocol', detail: 'check-in completed', value: '+20 CALM', time: '1 hr ago', tone: 'purple' },
  ],
}

export async function safeApi(path, fallback) {
  try {
    return await api(path)
  } catch {
    return fallback
  }
}
