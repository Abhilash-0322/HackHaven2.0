const API_URL = import.meta.env.VITE_API_URL || "";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(email, password) {
  if (API_URL) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Could not sign in");
    return response.json();
  }
  await wait(500);
  return { user: { email, name: email.split("@")[0] }, token: "demo-session" };
}

export async function registerUser(name, email, password) {
  if (API_URL) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error("Could not create account");
    return response.json();
  }
  await wait(500);
  return { user: { email, name }, token: "demo-session" };
}

export function streamChat(message, onToken, onDone) {
  if (API_URL) {
    const source = new EventSource(`${API_URL}/chat/stream?message=${encodeURIComponent(message)}`);
    source.onmessage = (event) => onToken(event.data);
    source.onerror = () => {
      source.close();
      onDone();
    };
    return () => source.close();
  }

  const response = `That’s a thoughtful signal to notice. When the network feels noisy, try separating the next small action from the whole outcome. You can bridge the asset, take a breath, and revisit the bigger decision later.`;
  const words = response.split(" ");
  let index = 0;
  const timer = window.setInterval(() => {
    onToken(`${words[index]} `);
    index += 1;
    if (index >= words.length) {
      window.clearInterval(timer);
      onDone();
    }
  }, 45);
  return () => window.clearInterval(timer);
}

