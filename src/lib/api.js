const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const token = () => localStorage.getItem("zenheaven_token");

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

export const api = {
  baseUrl: API_URL,
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  threads: () => request("/mental-health/threads"),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: "DELETE" }),
  sendChat: (payload) => request("/mental-health/chat", { method: "POST", body: JSON.stringify(payload) }),
  entries: () => request("/journal/entries"),
  prompts: () => request("/journal/prompts"),
  createEntry: (payload) => request("/journal/entries", { method: "POST", body: JSON.stringify(payload) }),
  deleteEntry: (id) => request(`/journal/entries/${id}`, { method: "DELETE" }),
  insights: () => request("/journal/insights"),
  booksByMood: (userId) => request(`/books/recommend-by-mood${userId ? `?user_id=${userId}` : ""}`),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  songs: () => request("/songs"),
  recommendSongs: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: (filters = "") => request(`/therapists/${filters ? `?${filters}` : ""}`),
  therapist: (id) => request(`/therapists/${id}`),
  appointments: (userId) => request(`/therapists/appointments/user/${userId}`),
  bookAppointment: (payload) => request("/therapists/appointments", { method: "POST", body: JSON.stringify(payload) }),
  coinBalance: () => request("/coins/balance"),
  transactions: () => request("/coins/transactions"),
  goals: () => request("/coins/daily-goals"),
  achievements: () => request("/coins/achievements"),
  streak: () => request("/coins/streak"),
};

export async function streamChat(payload, handlers) {
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok || !response.body) throw new Error("Unable to connect to CalmBot");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";
    events.forEach((event) => {
      const line = event.split("\n").find((item) => item.startsWith("data:"));
      if (!line) return;
      try {
        const parsed = JSON.parse(line.replace(/^data:\s*/, ""));
        const callback = handlers[parsed.type];
        if (callback) callback(parsed.data);
      } catch {
        // Ignore malformed keep-alive events.
      }
    });
  }
}
