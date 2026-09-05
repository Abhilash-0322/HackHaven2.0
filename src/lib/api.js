const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const TOKEN_KEY = 'zenheaven_token'

const getToken = () => localStorage.getItem(TOKEN_KEY)

export async function api(path, options = {}) {
  const { headers = {}, body, ...rest } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    body: body && !(body instanceof FormData) && typeof body !== 'string' ? JSON.stringify(body) : body,
  })
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) {
    const message = typeof payload === 'object' ? payload.detail || payload.message : payload
    throw new Error(message || `Request failed (${response.status})`)
  }
  return payload
}

export const authApi = {
  login: (body) => api('/auth/login', { method: 'POST', body }),
  register: (body) => api('/auth/register', { method: 'POST', body }),
  me: () => api('/auth/me'),
}

export async function streamChat(message, threadId, onEvent) {
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ message, ...(threadId ? { thread_id: threadId } : {}) }),
  })
  if (!response.ok || !response.body) throw new Error('Unable to open the support stream')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() || ''
    chunks.forEach((chunk) => {
      const line = chunk.split('\n').find((item) => item.startsWith('data:'))
      if (!line) return
      try { onEvent(JSON.parse(line.replace(/^data:\s*/, ''))) } catch { /* ignore partial frames */ }
    })
  }
}

export { API_URL }
