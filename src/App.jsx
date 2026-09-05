import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Award, BookOpen, Brain, Check, ChevronRight, CircleDollarSign, Clock3,
  Headphones, Heart, Home, Library, LogOut, Menu, MessageCircle, Music2, Pause,
  Play, Plus, Search, Send, ShieldCheck, Sparkles, Star, Stethoscope, Trash2, Trophy,
  UserRound, Users, X, Zap,
} from "lucide-react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const navItems = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/chat", label: "Companion", icon: MessageCircle },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/books", label: "Reading room", icon: Library },
  { to: "/music", label: "Music catalog", icon: Music2 },
  { to: "/therapists", label: "Practitioners", icon: Stethoscope },
  { to: "/coins", label: "Calm coins", icon: CircleDollarSign },
];

const demoTracks = [
  { name: "Weightless", artist: "Marconi Union", genre: "Ambient", duration: "8:00", color: "cream" },
  { name: "Bloom", artist: "The Paper Kites", genre: "Indie folk", duration: "3:30", color: "blue" },
  { name: "Sunset Lover", artist: "Petit Biscuit", genre: "Electronic", duration: "3:58", color: "yellow" },
  { name: "A Walk", artist: "Tycho", genre: "Downtempo", duration: "5:19", color: "cream" },
  { name: "Holocene", artist: "Bon Iver", genre: "Indie", duration: "5:36", color: "blue" },
  { name: "Anchor", artist: "Novo Amor", genre: "Acoustic", duration: "3:12", color: "yellow" },
];
const demoBooks = [
  { id: "book-1", title: "The Comfort Book", author: "Matt Haig", description: "A small collection of notes, lists and stories for difficult days.", tone: "" },
  { id: "book-2", title: "Wintering", author: "Katherine May", description: "The quiet art of rest and retreat in difficult times.", tone: "tone-2" },
  { id: "book-3", title: "The Book of Joy", author: "Dalai Lama & Desmond Tutu", description: "Lasting happiness in a changing world.", tone: "tone-3" },
  { id: "book-4", title: "How to Do Nothing", author: "Jenny Odell", description: "Resisting the attention economy and finding a richer life.", tone: "tone-4" },
];
const demoTherapists = [
  { id: "therapist-1", name: "Dr. Sarah Johnson", specializations: ["Anxiety", "Mindfulness"], experience_years: 12, bio: "CBT and mindfulness for navigating busy minds with more ease.", hourly_rate: 120, rating: 4.8, languages: ["English", "Spanish"] },
  { id: "therapist-2", name: "Dr. Michael Chen", specializations: ["Trauma", "PTSD"], experience_years: 15, bio: "Evidence-based support for processing trauma and rebuilding safety.", hourly_rate: 135, rating: 4.7, languages: ["English", "Mandarin"] },
  { id: "therapist-3", name: "Maya Rodriguez, LMFT", specializations: ["Relationships", "Self-esteem"], experience_years: 8, bio: "A warm space to explore connection, boundaries, and self-worth.", hourly_rate: 100, rating: 4.9, languages: ["English", "Spanish"] },
  { id: "therapist-4", name: "Aisha Patel, LCSW", specializations: ["Grief", "Life transitions"], experience_years: 7, bio: "Culturally sensitive care for change, loss, and finding new meaning.", hourly_rate: 95, rating: 4.8, languages: ["English", "Hindi"] },
];
const demoJournals = [
  { id: "j-1", title: "A softer start", content: "I gave myself space to move slowly this morning. The small ritual of tea and an open window helped.", mood: "calm", created_at: "2026-09-04T08:30:00Z" },
  { id: "j-2", title: "One small win", content: "I sent the email I had been avoiding. It was not as scary as I imagined, and now I have room for the rest of my day.", mood: "hopeful", created_at: "2026-09-02T16:10:00Z" },
];
const demoThreads = [
  { id: "thread-1", title: "Making room for quiet", message_count: 6, last_message: "I have been feeling a little overwhelmed." },
  { id: "thread-2", title: "Finding a gentler rhythm", message_count: 4, last_message: "Can you help me make a plan?" },
];

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("zenheaven_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || "Request failed");
  return response.json();
}

function useToast() {
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  return [toast, setToast];
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("zenheaven_user") || "null"));
  const [toast, setToast] = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authPages = ["/login", "/register"].includes(location.pathname);

  function handleAuth(data) {
    localStorage.setItem("zenheaven_token", data.access_token || "demo-token");
    localStorage.setItem("zenheaven_user", JSON.stringify(data.user || { username: data.username || "guest", calm_coins: 100 }));
    setUser(data.user || { username: "guest", calm_coins: 100 });
    setToast("Welcome to your catalog.");
    navigate("/dashboard");
  }
  function logout() {
    localStorage.removeItem("zenheaven_token");
    localStorage.removeItem("zenheaven_user");
    setUser(null);
    navigate("/");
  }

  if (authPages) {
    return <><Topbar user={user} onLogout={logout} /><Routes><Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} />} /><Route path="/register" element={<AuthPage mode="register" onAuth={handleAuth} />} /></Routes>{toast && <div className="toast">{toast}</div>}</>;
  }

  return (
    <div className="app-shell">
      <Topbar user={user} onLogout={logout} onMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="body-layout">
        <Sidebar user={user} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} onToast={setToast} />} />
            <Route path="/chat" element={<ChatPage user={user} onToast={setToast} />} />
            <Route path="/journal" element={<JournalPage onToast={setToast} />} />
            <Route path="/books" element={<BooksPage onToast={setToast} />} />
            <Route path="/music" element={<MusicPage onToast={setToast} />} />
            <Route path="/therapists" element={<TherapistsPage user={user} onToast={setToast} />} />
            <Route path="/coins" element={<CoinsPage user={user} onToast={setToast} />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        </main>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Topbar({ user, onLogout, onMenu }) {
  return (
    <header className="topbar">
      <button className="button button-ghost mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <Link className="brand" to="/"><span className="brand-mark" /><span className="brand-name">zen<span>heaven</span></span></Link>
      <div className="topbar-meta"><span>CATALOG / 30</span><strong>{user ? `@${user.username || "member"}` : "private wellness records"}</strong>{user ? <button className="topbar-cta" onClick={onLogout}>Sign out</button> : <Link className="topbar-cta" to="/login">Member login</Link>}</div>
    </header>
  );
}

function Sidebar({ user, open, onClose }) {
  return <aside className={`sidebar ${open ? "open" : ""}`} onClick={onClose}>
    <p className="sidebar-kicker">Your collection</p>
    {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon /><span>{label}</span></NavLink>)}
    <div className="sidebar-bottom"><strong>{user ? `${user.full_name || user.username || "Member"}` : "Guest catalog"}</strong>{user ? "Your records are private by default." : <Link to="/login">Sign in to sync →</Link>}</div>
  </aside>;
}

function Landing({ user }) {
  const navigate = useNavigate();
  return <div className="content-wrap">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow">ZENHEAVEN / PERSONAL CATALOG</div><h1 className="page-title">A quieter place to come back to.</h1><p className="page-subtitle">Keep track of the things that help: honest conversations, small entries, good books, and songs that know where to land.</p><div style={{ display: "flex", gap: 10, marginTop: 28 }}><button className="button button-primary" onClick={() => navigate(user ? "/dashboard" : "/register")}>{user ? "Open my catalog" : "Start your record"} <ArrowRight size={15} /></button><Link className="button button-dark" to="/music">Browse the archive</Link></div></div>
      <div className="hero-art"><span className="art-label">SIDE A — TAKE A BREATH</span></div>
    </section>
    <div className="section-heading"><h2>One collection, many ways in</h2><span>04 departments</span></div>
    <div className="catalog-grid">
      {[["01", "Companion", "A thoughtful chat when your thoughts feel loud.", MessageCircle, "/chat"], ["02", "Field notes", "A private place for the daily details.", BookOpen, "/journal"], ["03", "Listening room", "Soundtracks for the state you are in.", Headphones, "/music"], ["04", "Human support", "Find a practitioner at your pace.", Users, "/therapists"]].map(([number, title, copy, Icon, to]) => <Link className="catalog-card" to={to} key={title}><span className="catalog-card-index">{number}</span><Icon /><h3>{title}</h3><p>{copy}</p></Link>)}
    </div>
    <p className="mono" style={{ color: "#706a63", fontSize: 10, marginTop: 44 }}>A CATALOG FOR FEELING BETTER, ONE ENTRY AT A TIME.</p>
  </div>;
}

function Dashboard({ user, onToast }) {
  const [balance, setBalance] = useState(user?.calm_coins ?? 100);
  useEffect(() => { apiRequest("/coins/balance").then((data) => setBalance(data.balance)).catch(() => {}); }, []);
  return <div className="content-wrap">
    <div className="eyebrow">PERSONAL RECORD / ISSUE 01</div><h1 className="page-title">Good to see you,<br /><span style={{ color: "#e4513e" }}>{user?.full_name?.split(" ")[0] || user?.username || "friend"}.</span></h1><p className="page-subtitle">Your space is ready. What would feel supportive right now?</p>
    <div className="stat-grid" style={{ marginTop: 42 }}><Stat label="Current streak" value="04 days" note="Keep the rhythm going" accent /><Stat label="Field notes" value="12 entries" note="2 this week" /><Stat label="Calm coins" value={balance} note="Available to spend" /><Stat label="Your mood" value="Steady" note="From your last check-in" /></div>
    <div className="section-heading"><h2>Pick up where you left off</h2><Link className="button button-ghost" to="/journal">View all <ChevronRight size={14} /></Link></div>
    <div className="split-grid"><div className="panel"><div className="panel-head"><h3>Recent activity</h3><span className="mono" style={{ color: "#706a63", fontSize: 10 }}>LIVE RECORD</span></div><div className="panel-body"><Activity icon={MessageCircle} title="Talked with your companion" description="Finding a gentler rhythm" meta="TODAY" /><Activity icon={BookOpen} title="Added a field note" description="A softer start" meta="YESTERDAY" /><Activity icon={Music2} title="Played a listening session" description="Night drive / side A" meta="SEP 02" /></div></div><div className="panel"><div className="panel-head"><h3>Today’s intention</h3><Sparkles size={16} color="#efbd4d" /></div><div className="panel-body"><p style={{ font: "600 22px 'Space Grotesk'", lineHeight: 1.15, margin: "8px 0 18px" }}>Make a little room for what you need.</p><p style={{ color: "#a7a097", fontSize: 13, lineHeight: 1.5 }}>A check-in takes less than two minutes. You can always come back later.</p><Link className="button button-primary" to="/journal" style={{ marginTop: 15 }}>Write a field note <ArrowRight size={14} /></Link></div></div></div>
    <div className="section-heading"><h2>Your departments</h2><span>Catalog index</span></div><div className="catalog-grid">{navItems.slice(1, 5).map(({ to, label, icon: Icon }, index) => <Link className="catalog-card" to={to} key={to}><span className="catalog-card-index">0{index + 1}</span><Icon /><h3>{label}</h3><p>{["Talk it out, without a waiting room.", "Notice what is moving through you.", "A softer soundtrack for the day.", "Browse trusted human support."][index]}</p></Link>)}</div>
    <button className="button button-ghost" onClick={() => onToast("Your catalog is saved automatically.")} style={{ marginTop: 24 }}> <ShieldCheck size={14} /> Privacy note</button>
  </div>;
}

function Stat({ label, value, note, accent }) { return <div className={`stat-card ${accent ? "accent" : ""}`}><small>{label}</small><strong>{value}</strong><p>{note}</p></div>; }
function Activity({ icon: Icon, title, description, meta }) { return <div className="feed-row"><div className="record-thumb"><Icon size={16} color="#f4efe7" /></div><div><h4>{title}</h4><p>{description}</p></div><span className="row-meta">{meta}</span></div>; }

function AuthPage({ mode, onAuth }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await apiRequest(`/auth/${isLogin ? "login" : "register"}`, { method: "POST", body: JSON.stringify(isLogin ? { username: form.username, password: form.password } : form) });
      onAuth(data);
    } catch {
      if (!form.username || !form.password || (!isLogin && !form.email)) { setError("Please complete the required fields."); setLoading(false); return; }
      onAuth({ user: { username: form.username, full_name: form.full_name, calm_coins: 100 }, access_token: "demo-token" });
    }
  }
  return <div className="content-wrap" style={{ minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" }}><form className="form-card" onSubmit={submit}><div className="eyebrow">MEMBERS / {isLogin ? "RETURNING" : "NEW RECORD"}</div><h1>{isLogin ? "Welcome back." : "Start your record."}</h1><p>{isLogin ? "Pick up your collection where you left it." : "A private space for the practices that help you feel more like yourself."}</p>{!isLogin && <div className="field"><label>Full name</label><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="How should we call you?" /></div>}<div className="field"><label>Username</label><input className="input" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="your handle" /></div>{!isLogin && <div className="field"><label>Email</label><input className="input" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>}<div className="field"><label>Password</label><input className="input" required type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Six characters minimum" /></div>{error && <div className="error-message">{error}</div>}<button className="button button-primary" style={{ width: "100%" }} disabled={loading}>{loading ? "Opening record..." : isLogin ? "Enter catalog" : "Create my record"} <ArrowRight size={14} /></button><p className="form-note">{isLogin ? <>New here? <Link to="/register">Create a record</Link></> : <>Already a member? <Link to="/login">Sign in</Link></>}</p></form></div>;
}

function ChatPage({ user, onToast }) {
  const [threads, setThreads] = useState(demoThreads);
  const [activeId, setActiveId] = useState("thread-1");
  const [messages, setMessages] = useState([{ id: "welcome", content: "I’m here. We can take this one small thought at a time. What’s present for you today?", is_user: false, timestamp: new Date().toISOString() }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { apiRequest("/mental-health/threads").then((data) => setThreads(data.threads || [])).catch(() => {}); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);
  async function sendMessage(event) {
    event?.preventDefault(); if (!input.trim() || sending) return;
    const text = input.trim(); setInput(""); setSending(true); setThinking("Listening closely…"); setMessages((current) => [...current, { id: `u-${Date.now()}`, content: text, is_user: true, timestamp: new Date().toISOString() }]);
    try {
      const token = localStorage.getItem("zenheaven_token");
      const response = await fetch(`${API_BASE}/mental-health/chat/stream`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message: text, thread_id: activeId }) });
      if (!response.ok || !response.body) throw new Error("offline");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = ""; let buffer = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n"); buffer = chunks.pop() || "";
        chunks.forEach((chunk) => { const line = chunk.split("\n").find((part) => part.startsWith("data:")); if (!line) return; const eventData = JSON.parse(line.slice(5)); if (eventData.type === "thinking") setThinking(eventData.data); if (eventData.type === "token") answer += eventData.data; if (eventData.type === "complete") setThinking(""); });
        if (answer) setMessages((current) => [...current.filter((message) => message.id !== "streaming"), { id: "streaming", content: answer, is_user: false, timestamp: new Date().toISOString() }]);
      }
      setMessages((current) => current.map((message) => message.id === "streaming" ? { ...message, id: `a-${Date.now()}` } : message));
    } catch {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      setMessages((current) => [...current, { id: `a-${Date.now()}`, content: "Thank you for putting that into words. We can slow it down together. What part of this feels heaviest right now?", is_user: false, timestamp: new Date().toISOString() }]);
      setThinking(""); onToast("Demo mode: connect the API to enable live responses.");
    } finally { setSending(false); setThinking(""); }
  }
  return <div className="chat-layout"><aside className="thread-sidebar"><button className="button button-primary" style={{ width: "100%", marginBottom: 24 }} onClick={() => { setActiveId(null); setMessages([]); }}><Plus size={15} /> New conversation</button><h3>Conversations <span className="mono" style={{ color: "#706a63", fontSize: 10 }}>({threads.length})</span></h3>{threads.map((thread) => <div className={`thread-item ${activeId === thread.id ? "active" : ""}`} key={thread.id} onClick={() => setActiveId(thread.id)}><strong>{thread.title}</strong><small>{thread.message_count || 0} notes · {thread.last_message || "A quiet beginning"}</small></div>)}</aside><section className="chat-main"><div className="chat-header"><div><h1>{activeId ? threads.find((thread) => thread.id === activeId)?.title || "Your companion" : "New conversation"}</h1><span className="online">● private / online</span></div><span className="mono" style={{ color: "#706a63", fontSize: 10 }}>+5 COINS / SESSION</span></div><div className="messages">{messages.length === 0 && <div className="empty-state"><Sparkles size={20} /><p>A blank page can be a good place to begin.</p></div>}{messages.map((message) => <div className={`message ${message.is_user ? "user" : ""}`} key={message.id}><div className="avatar">{message.is_user ? (user?.username?.[0] || "Y").toUpperCase() : "ZH"}</div><div><div className="message-content">{message.content}</div><div className="message-meta">{message.is_user ? "YOU" : "ZENHEAVEN"} · {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div></div></div>)}{thinking && <div className="thinking">{thinking}</div>}<div ref={endRef} /></div><form className="chat-composer" onSubmit={sendMessage}><input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write what’s on your mind…" /><button className="button button-primary" aria-label="Send message" disabled={sending}><Send size={15} /></button></form></section></div>;
}

function JournalPage({ onToast }) {
  const [entries, setEntries] = useState(demoJournals); const [content, setContent] = useState(""); const [mood, setMood] = useState("calm"); const [showComposer, setShowComposer] = useState(false); const [saving, setSaving] = useState(false);
  useEffect(() => { apiRequest("/journal/entries").then((data) => setEntries(Array.isArray(data) ? data : [])).catch(() => {}); }, []);
  async function saveEntry(event) { event.preventDefault(); if (!content.trim()) return; setSaving(true); const payload = { content, mood, tags: [] }; try { const created = await apiRequest("/journal/entries", { method: "POST", body: JSON.stringify(payload) }); setEntries((current) => [created, ...current]); onToast("+10 calm coins · field note saved"); } catch { setEntries((current) => [{ id: `j-${Date.now()}`, title: "A new page", content, mood, created_at: new Date().toISOString() }, ...current]); onToast("Demo mode: your field note is saved locally for now."); } setContent(""); setShowComposer(false); setSaving(false); }
  return <div className="content-wrap"><div className="eyebrow">FIELD NOTES / PRIVATE BY DEFAULT</div><h1 className="page-title">The everyday,<br /><span style={{ color: "#efbd4d" }}>written down.</span></h1><p className="page-subtitle">There is no right way to keep a record. A sentence, a list, or a page can all be enough.</p><div className="toolbar"><button className="button button-primary" onClick={() => setShowComposer(!showComposer)}>{showComposer ? <X size={15} /> : <Plus size={15} />} {showComposer ? "Close editor" : "New field note"}</button><span className="pill"><ShieldCheck size={12} /> encrypted feeling space</span></div>{showComposer && <div className="journal-compose" style={{ marginBottom: 38 }}><form className="panel" onSubmit={saveEntry}><div className="panel-head"><h3>New field note</h3><span className="mono" style={{ color: "#706a63", fontSize: 10 }}>+10 COINS</span></div><div className="panel-body"><div className="field"><label>How are you arriving?</label><textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Let the first sentence be imperfect…" autoFocus /></div><div className="field"><label>Current mood</label><select className="select" value={mood} onChange={(e) => setMood(e.target.value)}>{["calm", "hopeful", "anxious", "tired", "grateful", "overwhelmed"].map((item) => <option key={item}>{item}</option>)}</select></div><button className="button button-primary" disabled={saving}>{saving ? "Saving…" : "Save field note"} <Check size={14} /></button></div></form><div className="panel"><div className="panel-head"><h3>Try a prompt</h3><Sparkles size={15} color="#efbd4d" /></div><div className="panel-body prompt-list">{["What made you smile today?", "What is asking for your attention?", "Name one small win from today.", "If today were weather, what would it be?"].map((prompt) => <button key={prompt} onClick={() => setContent(`${prompt}\n\n`)}>{prompt} <ArrowRight size={12} style={{ float: "right" }} /></button>)}</div></div></div>}<div className="section-heading"><h2>Recent pages</h2><span>{entries.length} entries in your archive</span></div>{entries.length ? <div className="journal-list">{entries.map((entry) => <article className="journal-card" key={entry.id || entry._id}><span className="date">{new Date(entry.created_at || Date.now()).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span><h3>{entry.title || "Untitled field note"}</h3><p>{entry.content}</p><span className="mood-tag">{entry.mood || "unmarked"}</span></article>)}</div> : <div className="empty-state"><BookOpen size={21} /><p>Your first page is waiting.</p></div>}</div>;
}

function BooksPage({ onToast }) {
  const [books, setBooks] = useState(demoBooks); const [query, setQuery] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => { apiRequest("/books/recommend-by-mood").then((data) => { if (data.books?.length) setBooks(data.books); }).catch(() => {}); }, []);
  async function search(event) { event.preventDefault(); if (!query.trim()) return; setLoading(true); try { const data = await apiRequest(`/books/search?q=${encodeURIComponent(query)}&max_results=8`); setBooks(data.books || []); } catch { onToast("Showing the reading room sample catalog."); } setLoading(false); }
  return <div className="content-wrap"><div className="eyebrow">READING ROOM / CURATED BY YOUR MOOD</div><h1 className="page-title">Good books<br /><span style={{ color: "#e4513e" }}>for this chapter.</span></h1><p className="page-subtitle">A small shelf of ideas, comfort, and perspective. Start with what feels useful today.</p><form className="toolbar" onSubmit={search}><div style={{ position: "relative", flex: "0 1 310px" }}><Search size={15} color="#a7a097" style={{ position: "absolute", left: 12, top: 13 }} /><input className="input" style={{ paddingLeft: 36 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the reading room…" /></div><button className="button button-dark" disabled={loading}>{loading ? "Searching…" : "Search"} <ArrowRight size={14} /></button></form><div className="panel" style={{ marginBottom: 38 }}><div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 15 }}><div className="record-thumb yellow"><Heart size={16} color="#171411" /></div><div><span className="mono" style={{ color: "#efbd4d", fontSize: 10 }}>BASED ON YOUR LAST FIELD NOTE</span><p style={{ margin: "5px 0 0", fontSize: 14 }}>A softer shelf for a <strong>calm</strong> mind.</p></div></div></div><div className="section-heading"><h2>Selected for you</h2><span>{books.length} volumes</span></div><div className="book-grid">{books.map((book, index) => <article className="book-card" key={book.id || book.volume_id || index}><div className={`book-cover ${book.tone || `tone-${(index % 4) + 1}`}`}><span className="mono" style={{ position: "absolute", top: 15, left: 15, zIndex: 1, color: "rgba(20,18,15,.7)", fontSize: 10 }}>ZH / {String(index + 1).padStart(2, "0")}</span></div><div className="book-info"><h3>{book.title}</h3><p>{book.author || "Unknown author"}</p><small>Open volume <ChevronRight size={11} style={{ verticalAlign: "middle" }} /></small></div></article>)}</div></div>;
}

function MusicPage({ onToast }) {
  const [tracks, setTracks] = useState(demoTracks); const [playing, setPlaying] = useState(null); const [filter, setFilter] = useState("All");
  useEffect(() => { apiRequest("/songs").then((data) => { if (data.songs?.length) setTracks(data.songs.slice(0, 12).map((name, index) => ({ name, artist: "Catalog archive", genre: ["Ambient", "Indie", "Electronic"][index % 3], duration: "4:12", color: ["cream", "blue", "yellow"][index % 3] }))); }).catch(() => {}); }, []);
  const genres = ["All", ...new Set(tracks.map((track) => track.genre))]; const filtered = filter === "All" ? tracks : tracks.filter((track) => track.genre === filter);
  function toggle(track) { setPlaying(playing?.name === track.name ? null : track); if (playing?.name !== track.name) onToast(`Now playing — ${track.name}`); }
  return <div className="content-wrap"><div className="eyebrow">LISTENING ROOM / MOOD MIXES</div><h1 className="page-title">Songs for<br /><span style={{ color: "#efbd4d" }}>the in-between.</span></h1><p className="page-subtitle">An evolving catalog of music for grounding, processing, and letting the day be a little less loud.</p><div className="toolbar">{genres.map((genre) => <button className={`pill ${filter === genre ? "active" : ""}`} key={genre} onClick={() => setFilter(genre)}>{genre}</button>)}</div><div className="panel" style={{ margin: "28px 0 38px", background: "#e4513e", color: "#fff6ed" }}><div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 20 }}><div className="record-thumb" style={{ background: "#f6d6bd" }}><Headphones size={17} color="#271916" /></div><div style={{ flex: 1 }}><span className="mono" style={{ fontSize: 10, color: "#ffd8c4" }}>TODAY'S MIX / SIDE A</span><h2 className="display" style={{ margin: "5px 0", fontSize: 24 }}>Soft focus</h2><p style={{ margin: 0, fontSize: 12, color: "#ffd8c4" }}>40 minutes of spacious sound for when you need to settle in.</p></div><button className="button" style={{ background: "#171411", color: "#fff6ed" }} onClick={() => toggle(tracks[0])}><Play size={14} fill="currentColor" /> Play mix</button></div></div><div className="section-heading"><h2>Catalog / tracks</h2><span>{filtered.length} records</span></div><div className="music-table"><div className="music-row heading"><span>#</span><span>Title</span><span>Genre</span><span>Length</span><span /></div>{filtered.map((track, index) => <div className="music-row" key={`${track.name}-${index}`}><span className="mono">{String(index + 1).padStart(2, "0")}</span><div className="music-title"><button className="play-button" onClick={() => toggle(track)}>{playing?.name === track.name ? <Pause size={11} fill="currentColor" /> : <Play size={11} />}</button><div><strong>{track.name}</strong><span>{track.artist}</span></div></div><span>{track.genre}</span><span className="mono">{track.duration}</span><button className="button button-ghost" onClick={() => onToast("Saved to your quiet queue.")}><Plus size={15} /></button></div>)}</div>{playing && <div className="player"><div className="record-thumb yellow"><Music2 size={16} color="#151310" /></div><div className="player-info"><strong>{playing.name}</strong><span>{playing.artist}</span></div><div className="player-track"><span /></div><div className="player-controls"><button onClick={() => setPlaying(null)}><Pause size={17} fill="currentColor" /></button><span className="mono" style={{ fontSize: 10, color: "#a7a097" }}>02:14 / {playing.duration}</span></div></div>}</div>;
}

function TherapistsPage({ user, onToast }) {
  const [therapists, setTherapists] = useState(demoTherapists); const [specialization, setSpecialization] = useState("All"); const [selected, setSelected] = useState(null);
  useEffect(() => { apiRequest("/therapists/").then((data) => { if (data?.length) setTherapists(data); }).catch(() => {}); }, []);
  const specialties = ["All", ...new Set(therapists.flatMap((therapist) => therapist.specializations || []))]; const filtered = specialization === "All" ? therapists : therapists.filter((therapist) => therapist.specializations?.includes(specialization));
  async function book(therapist) { try { await apiRequest("/therapists/appointments", { method: "POST", body: JSON.stringify({ user_id: user?.id || "demo-user", therapist_id: therapist.id || therapist._id, date: new Date(Date.now() + 86400000).toISOString(), start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString(), session_type: "video" }) }); onToast("Appointment request sent."); } catch { onToast("Demo booking saved — connect the API to confirm."); } setSelected(null); }
  return <div className="content-wrap"><div className="eyebrow">HUMAN SUPPORT / TAKE YOUR TIME</div><h1 className="page-title">Care with<br /><span style={{ color: "#e4513e" }}>a human voice.</span></h1><p className="page-subtitle">Browse licensed practitioners and find a pace, specialty, and person that feels like a good fit.</p><div className="toolbar">{specialties.slice(0, 6).map((item) => <button className={`pill ${specialization === item ? "active" : ""}`} onClick={() => setSpecialization(item)} key={item}>{item}</button>)}</div><div className="therapist-grid">{filtered.map((therapist) => <article className="therapist-card" key={therapist.id || therapist._id}><div className="therapist-avatar">{therapist.name.split(" ").filter((part) => part[0] !== "(").slice(0, 2).map((part) => part[0]).join("")}</div><h3>{therapist.name}</h3><span className="specialty">{therapist.specializations?.slice(0, 2).join(" / ")}</span><p>{therapist.bio}</p><div className="chip-row">{(therapist.languages || ["English"]).map((language) => <span className="chip" key={language}>{language}</span>)}</div><div className="therapist-footer"><span><Star size={11} fill="currentColor" style={{ verticalAlign: "middle" }} /> {therapist.rating || "4.8"} · {therapist.experience_years} yrs</span><strong>${therapist.hourly_rate}<small style={{ color: "#a7a097", fontWeight: 400 }}>/hr</small></strong></div><button className="button button-dark" style={{ width: "100%", marginTop: 17 }} onClick={() => setSelected(therapist)}>View availability <ArrowRight size={13} /></button></article>)}</div>{selected && <div className="toast" style={{ maxWidth: 350, bottom: 22 }}><button className="button button-ghost" style={{ position: "absolute", right: 5, top: 0 }} onClick={() => setSelected(null)}><X size={15} /></button><div className="eyebrow">REQUEST A SESSION</div><h3 className="display" style={{ margin: "8px 0" }}>{selected.name}</h3><p style={{ color: "#5f5951", fontSize: 13, lineHeight: 1.45 }}>The next available opening is tomorrow. Request a one-hour video session?</p><button className="button button-primary" onClick={() => book(selected)}>Request appointment <Check size={14} /></button></div>}</div>;
}

function CoinsPage({ user, onToast }) {
  const [balance, setBalance] = useState(user?.calm_coins ?? 100); const [transactions, setTransactions] = useState([]);
  useEffect(() => { apiRequest("/coins/balance").then((data) => setBalance(data.balance)).catch(() => {}); apiRequest("/coins/transactions").then((data) => setTransactions(data)).catch(() => setTransactions([{ amount: 10, source: "journal", description: "Created a new field note", timestamp: new Date().toISOString(), transaction_type: "earn" }, { amount: 5, source: "mental_health_chat", description: "Engaged with your companion", timestamp: new Date(Date.now() - 86400000).toISOString(), transaction_type: "earn" }])); }, []);
  const goals = [{ icon: MessageCircle, title: "Talk with your companion", copy: "0 / 1 today", coins: "+5" }, { icon: BookOpen, title: "Write a field note", copy: "0 / 1 today", coins: "+10" }, { icon: Heart, title: "Complete a mood check", copy: "0 / 1 today", coins: "+5" }, { icon: Brain, title: "Read a wellbeing article", copy: "0 / 1 today", coins: "+8" }];
  return <div className="content-wrap"><div className="eyebrow">CALM COINS / YOUR WELLNESS ECONOMY</div><h1 className="page-title">Small acts<br /><span style={{ color: "#efbd4d" }}>add up.</span></h1><p className="page-subtitle">Calm coins are a gentle nudge to keep showing up for yourself. Earn them through care, then use them for deeper support.</p><div className="coin-hero" style={{ marginTop: 42 }}><div className="coin-balance"><small>Available balance</small><strong>{balance}</strong><p>CALM COINS</p></div><div className="panel"><div className="panel-head"><h3>Today's collection goals</h3><span className="mono" style={{ color: "#efbd4d", fontSize: 10 }}>0 / 4 COMPLETE</span></div><div className="panel-body">{goals.map(({ icon: Icon, title, copy, coins }) => <div className="goal-row" key={title}><div className="goal-icon"><Icon size={15} /></div><div className="goal-copy"><strong>{title}</strong><span>{copy}</span></div><span className="goal-status">{coins}</span></div>)}</div></div></div><div className="section-heading"><h2>Exchange rates</h2><span>how the catalog works</span></div><div className="stat-grid"><Stat label="Chat session" value="+5" note="coins per session" accent /><Stat label="Field note" value="+10" note="coins per entry" /><Stat label="7 day streak" value="+50" note="weekly bonus" /><Stat label="Therapist session" value="500" note="coins to redeem" /></div><div className="section-heading"><h2>Ledger</h2><button className="button button-ghost" onClick={() => onToast("Your coin history is private.")}><ShieldCheck size={13} /> Private ledger</button></div><div className="panel"><div className="panel-body">{transactions.length ? transactions.slice(0, 5).map((item, index) => <div className="feed-row" key={item._id || index}><div className="record-thumb yellow"><Zap size={15} color="#171411" /></div><div><h4>{item.description}</h4><p>{new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} · {item.source}</p></div><span className="row-meta" style={{ color: "#8cc288" }}>+{item.amount}</span></div>) : <div className="empty-state"><CircleDollarSign size={20} /><p>Your first calm coin is waiting in the ledger.</p></div>}</div></div></div>;
}

export default App;
