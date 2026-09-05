const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export const apiUrl = API_URL;

function authHeaders() {
  const token = localStorage.getItem("zenheaven_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...authHeaders(),
    ...(options.headers || {})
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || payload.message || "Something went wrong");
  }
  return payload;
}

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  balance: () => request("/coins/balance"),
  transactions: () => request("/coins/transactions"),
  goals: () => request("/coins/daily-goals"),
  exchangeRates: () => request("/coins/exchange-rates"),
  achievements: () => request("/coins/achievements"),
  streak: () => request("/coins/streak"),
  earnCoins: (body) => request("/coins/earn", { method: "POST", body: JSON.stringify(body) }),
  spendCoins: (body) => request("/coins/spend", { method: "POST", body: JSON.stringify(body) }),
  insights: () => request("/journal/insights"),
  analyzeMood: (content) => request("/journal/analyze-mood", { method: "POST", body: JSON.stringify({ content }) }),
  updateJournal: (id, body) => request(`/journal/entries/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  songDetails: (song, artist) => request(`/song_details?song=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}`),
  appointments: (userId) => request(`/therapists/appointments/user/${userId}`),
  cancelAppointment: (id) => request(`/therapists/appointments/${id}`, { method: "DELETE" }),
  updateProfile: (body) => request("/auth/me", { method: "PUT", body: JSON.stringify(body) }),
  threads: () => request("/mental-health/threads"),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: "DELETE" }),
  journals: () => request("/journal/entries"),
  prompts: () => request("/journal/prompts"),
  createJournal: (body) => request("/journal/entries", { method: "POST", body: JSON.stringify(body) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: "DELETE" }),
  booksByMood: () => request("/books/recommend-by-mood"),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  bookRecommendations: (id) => request(`/books/recommend/${id}`),
  songs: () => request("/songs"),
  recommendSongs: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: (params = "") => request(`/therapists/${params ? `?${params}` : ""}`),
  therapist: (id) => request(`/therapists/${id}`),
  bookAppointment: (body) => request("/therapists/appointments", { method: "POST", body: JSON.stringify(body) })
};

export async function streamChat(message, threadId, onEvent, signal) {
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ message, thread_id: threadId || null })
  });
  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Chat connection failed");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";
    for (const event of events) {
      const line = event.split("\n").find((item) => item.startsWith("data:"));
      if (!line) continue;
      try {
        onEvent(JSON.parse(line.replace(/^data:\s*/, "")));
      } catch {
        // Ignore incomplete server-sent event frames.
      }
    }
    if (done) break;
  }
}
