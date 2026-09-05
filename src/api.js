const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getToken = () => localStorage.getItem("zenheaven_token");

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || payload.message || "Something went wrong. Please try again.");
  }
  return payload;
}

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  balance: () => request("/coins/balance"),
  transactions: () => request("/coins/transactions"),
  dailyGoals: () => request("/coins/daily-goals"),
  achievements: () => request("/coins/achievements"),
  streak: () => request("/coins/streak"),
  threads: () => request("/mental-health/threads"),
  thread: (id) => request(`/mental-health/threads/${id}`),
  deleteThread: (id) => request(`/mental-health/threads/${id}`, { method: "DELETE" }),
  journals: () => request("/journal/entries"),
  prompts: () => request("/journal/prompts"),
  createJournal: (body) => request("/journal/entries", { method: "POST", body: JSON.stringify(body) }),
  deleteJournal: (id) => request(`/journal/entries/${id}`, { method: "DELETE" }),
  booksByMood: () => request("/books/recommend-by-mood"),
  searchBooks: (query) => request(`/books/search?q=${encodeURIComponent(query)}`),
  songs: () => request("/songs"),
  recommendations: (song) => request(`/recommend?song=${encodeURIComponent(song)}`),
  therapists: (filters = "") => request(`/therapists/${filters}`),
  therapist: (id) => request(`/therapists/${id}`),
  bookAppointment: (body) => request("/therapists/appointments", { method: "POST", body: JSON.stringify(body) }),
};

export async function streamChat(message, threadId, onEvent) {
  const token = getToken();
  const response = await fetch(`${API_URL}/mental-health/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, thread_id: threadId || null }),
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Unable to connect to CalmBot.");
  }

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
      if (line) {
        try {
          onEvent(JSON.parse(line.replace(/^data:\s*/, "")));
        } catch {
          // Ignore malformed keep-alive chunks.
        }
      }
    });
  }
}
