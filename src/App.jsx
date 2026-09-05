import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookHeart, BookOpen, Check, ChevronRight, CircleHelp,
  Coins, Headphones, Heart, Leaf, LogOut, Menu, MessageCircle, Moon, Music2, Play,
  Plus, Search, Send, Sparkles, Star, Sun, Trash2, UserRound, UsersRound, X, Wind, Zap
} from "lucide-react";
import {
  Link, Navigate, NavLink, Outlet, Route, Routes, useNavigate
} from "react-router-dom";
import { api, streamChat } from "./api";

const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("zenheaven_user")) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("zenheaven_token"));

  const signIn = (payload) => {
    localStorage.setItem("zenheaven_token", payload.access_token);
    localStorage.setItem("zenheaven_user", JSON.stringify(payload.user));
    setToken(payload.access_token);
    setUser(payload.user);
  };
  const signOut = () => {
    localStorage.removeItem("zenheaven_token");
    localStorage.removeItem("zenheaven_user");
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, signIn, signOut }}>{/* app */}<Outlet /></AuthContext.Provider>;
}

function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

const navItems = [
  { to: "/dashboard", label: "Today", icon: Sun },
  { to: "/chat", label: "Talk it out", icon: MessageCircle },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/books", label: "Read", icon: BookHeart },
  { to: "/music", label: "Listen", icon: Music2 },
  { to: "/therapists", label: "Find support", icon: UsersRound }
];

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/books" element={<Books />} />
            <Route path="/music" element={<Music />} />
            <Route path="/therapists" element={<Therapists />} />
            <Route path="/coins" element={<CoinsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function AppShell() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand-mark"><span>z</span><div><b>zenheaven</b><small>your softer space</small></div></div>
        <button className="close-menu" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
        <div className="nav-label">YOUR SPACE</div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Icon size={18} strokeWidth={1.8} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/coins" className="coin-nav"><Coins size={17} /> Calm coins <span>{user?.calm_coins ?? 0}</span></NavLink>
          <div className="profile-mini"><div className="avatar">{(user?.full_name || user?.username || "Z").charAt(0).toUpperCase()}</div><div><b>{user?.full_name || user?.username || "Friend"}</b><small>Taking it one day at a time</small></div><button onClick={() => { signOut(); navigate("/"); }} aria-label="Sign out"><LogOut size={16} /></button></div>
        </div>
      </aside>
      {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <header className="mobile-header"><button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button><div className="mobile-logo">zenheaven</div><Link to="/coins"><Coins size={18} /></Link></header>
        <Outlet />
      </main>
    </div>
  );
}

function Landing() {
  const { token } = useAuth();
  const startPath = token ? "/dashboard" : "/register";
  return (
    <div className="landing">
      <header className="landing-nav page-width">
        <Link to="/" className="brand-mark"><span>z</span><div><b>zenheaven</b><small>your softer space</small></div></Link>
        <div className="landing-actions"><a href="#how-it-works">How it works</a><Link to="/login" className="text-link">Sign in</Link><Link to={startPath} className="button button-small">Begin gently <ArrowRight size={15} /></Link></div>
      </header>
      <section className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> NO POLISH. JUST HONEST SPACE.</div>
          <h1>FEEL IT.<br /><i>NAME IT.</i></h1>
          <p className="hero-lede">A quiet corner for your thoughts, feelings, and the small steps that make today feel lighter.</p>
          <div className="hero-buttons"><Link to={startPath} className="button">Make space for yourself <ArrowRight size={17} /></Link><a href="#how-it-works" className="button button-ghost">See how it works <ChevronRight size={16} /></a></div>
          <div className="trusted"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>made for real, everyday humans</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a calm sunrise">
          <div className="sun-disc" /><div className="hill hill-back" /><div className="hill hill-front" />
          <div className="floating-note note-one">take a breath <Wind size={13} /></div><div className="floating-note note-two"><Moon size={13} /> sleep well</div>
          <div className="plant"><i /><i /><i /><b /></div><div className="hero-ring" />
        </div>
      </section>
      <section className="story-strip" id="how-it-works">
        <div className="page-width"><div className="eyebrow">THE ZENHEAVEN WAY</div><h2>Wellness isn’t a finish line.<br /><i>It’s a rhythm.</i></h2><p>Notice where you are. Find what helps. Return whenever you need to.</p>
          <div className="story-cards"><StoryCard num="01" icon={MessageCircle} title="Let it out" text="A thoughtful AI companion that listens without trying to fix you." to={startPath} /><StoryCard num="02" icon={BookOpen} title="Make meaning" text="A private journal for noticing patterns, celebrating small wins." to={startPath} /><StoryCard num="03" icon={Headphones} title="Settle in" text="Curated music, books, and support for exactly where you are." to={startPath} /></div>
        </div>
      </section>
      <section className="quote-section page-width"><div className="quote-mark">“</div><blockquote>You don’t have to have it all figured out. You just have to give yourself a place to begin.</blockquote><span>— a gentle reminder from us to you</span></section>
      <footer className="landing-footer page-width"><Link to="/" className="brand-mark"><span>z</span><div><b>zenheaven</b><small>your softer space</small></div></Link><span>Built for the in-between moments.</span></footer>
    </div>
  );
}

function StoryCard({ num, icon: Icon, title, text, to }) {
  return <Link to={to} className="story-card"><div className="card-top"><span>{num}</span><Icon size={22} /></div><h3>{title}</h3><p>{text}</p><ArrowRight size={18} className="card-arrow" /></Link>;
}

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const payload = isRegister ? await api.register(form) : await api.login({ username: form.username, password: form.password });
      signIn(payload); navigate("/dashboard");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <div className="auth-page"><Link to="/" className="auth-brand">zenheaven <span>✦</span></Link><div className="auth-layout"><div className="auth-visual"><div className="eyebrow"><span className="pulse-dot" /> a softer space</div><h1>{isRegister ? <>Start where<br /><i>you are.</i></> : <>Good to see<br /><i>you again.</i></>}</h1><p>{isRegister ? "There is no perfect way to begin. Just a small, honest moment with yourself." : "Whatever today holds, you don’t have to hold it alone."}</p><div className="auth-sun" /></div><form className="auth-form" onSubmit={submit}><div className="form-heading"><span>{isRegister ? "01 / JOIN THE SPACE" : "WELCOME BACK"}</span><h2>{isRegister ? "Create your account" : "Sign in to your space"}</h2><p>{isRegister ? "Your calm corner is a few details away." : "Your space is waiting for you."}</p></div>{isRegister && <label>What should we call you?<input required minLength="3" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name (optional)" /></label>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="choose a username" /></label>{isRegister && <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="at least 6 characters" /></label>{error && <div className="error-message">{error}</div>}<button className="button full-button" disabled={loading}>{loading ? "One moment…" : isRegister ? <>Create my space <ArrowRight size={16} /></> : <>Enter ZenHeaven <ArrowRight size={16} /></>}</button><p className="form-switch">{isRegister ? "Already have a space?" : "New to ZenHeaven?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p></form></div></div>;
}

function PageHeader({ eyebrow, title, sub, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>{action}</div>;
}

function Loading() { return <div className="loading-state"><span className="loader" /> finding your calm…</div>; }
function ApiError({ message = "Couldn’t reach your space right now." }) { return <div className="api-error"><CircleHelp size={18} /><span>{message}<small>Check that the ZenHeaven API is running, then try again.</small></span></div>; }
function EmptyState({ icon: Icon = Sparkles, title, text, action }) { return <div className="empty-state"><Icon size={28} /><h3>{title}</h3><p>{text}</p>{action}</div>; }

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ balance: null, goals: [], threads: [] });
  const [error, setError] = useState("");
  useEffect(() => { Promise.allSettled([api.balance(), api.goals(), api.threads()]).then(([balance, goals, threads]) => { setData({ balance: balance.status === "fulfilled" ? balance.value.balance : user?.calm_coins || 0, goals: goals.status === "fulfilled" ? goals.value : [], threads: threads.status === "fulfilled" ? threads.value.threads : [] }); if ([balance, goals, threads].every((item) => item.status === "rejected")) setError("Your dashboard is taking a quiet moment to load."); }); }, [user]);
  const completed = data.goals.filter((goal) => goal.completed).length;
  return <div className="page"><PageHeader eyebrow="SATURDAY, SEPTEMBER 5" title={<>A softer day, <i>{user?.full_name?.split(" ")[0] || user?.username || "friend"}.</i></>} sub="You showed up. That already counts for something." action={<Link to="/journal" className="button button-small"><Plus size={16} /> New journal entry</Link>} />{error && <ApiError message={error} />}<div className="dashboard-grid"><section className="welcome-card"><div className="welcome-card-copy"><span className="card-kicker">YOUR DAILY PAUSE</span><h2>What would feel supportive <i>right now?</i></h2><p>There’s no wrong door. Follow what your mind and body are asking for.</p><div className="mood-pills"><Link to="/chat"><MessageCircle size={15} /> Talk it out</Link><Link to="/journal"><BookOpen size={15} /> Put it down</Link><Link to="/music"><Headphones size={15} /> Find some calm</Link></div></div><div className="breathing-orb"><div><span>inhale</span><b>4</b></div></div></section><section className="progress-card"><div className="section-heading"><div><span className="card-kicker">TODAY’S RHYTHM</span><h3>Small steps, gently.</h3></div><span className="progress-count">{completed}/{data.goals.length || 4}</span></div><div className="progress-line"><span style={{ width: `${data.goals.length ? completed / data.goals.length * 100 : 0}%` }} /></div><div className="goal-list">{(data.goals.length ? data.goals : [{ title: "Start a gentle check-in", coins: 5 }, { title: "Write one honest line", coins: 10 }, { title: "Take a mindful pause", coins: 5 }]).slice(0, 3).map((goal, index) => <div className="goal-row" key={goal.id || index}><span className={`goal-icon ${goal.completed ? "done" : ""}`}>{goal.completed ? <Check size={14} /> : <span />}</span><span>{goal.title}</span><b>+{goal.coins} <Coins size={13} /></b></div>)}</div><Link to="/coins" className="subtle-link">View your calm coins <ArrowRight size={14} /></Link></section></div><div className="section-heading page-section-heading"><div><span className="card-kicker">YOUR TOOLKIT</span><h2>Meet yourself where you are.</h2></div></div><div className="toolkit-grid"><Link to="/chat" className="tool-card green"><span className="tool-icon"><MessageCircle /></span><h3>A listening ear</h3><p>Chat with CalmBot, your always-here companion.</p><ArrowRight /></Link><Link to="/journal" className="tool-card cream"><span className="tool-icon"><BookOpen /></span><h3>A blank page</h3><p>Make room for what’s on your mind today.</p><ArrowRight /></Link><Link to="/therapists" className="tool-card lilac"><span className="tool-icon"><UsersRound /></span><h3>A helping hand</h3><p>Find a professional when you’re ready.</p><ArrowRight /></Link></div><div className="dashboard-bottom"><section><div className="section-heading"><div><span className="card-kicker">RECENT CONVERSATIONS</span><h3>Keep the thread going.</h3></div><Link to="/chat" className="subtle-link">All chats <ArrowRight size={14} /></Link></div>{data.threads.length ? data.threads.slice(0, 2).map((thread) => <Link to={`/chat?thread=${thread.id}`} className="thread-row" key={thread.id}><span className="thread-icon"><MessageCircle size={16} /></span><span><b>{thread.title}</b><small>{thread.last_message || "Continue your conversation"}</small></span><ChevronRight size={16} /></Link>) : <p className="muted-copy">Your conversations will appear here when you start a chat.</p>}</section><section className="quote-card"><Sparkles size={18} /><p>“Almost everything will work again if you unplug it for a few minutes, including you.”</p><small>— Anne Lamott</small></section></div></div>;
}

function Chat() {
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const loadThreads = async () => { try { const result = await api.threads(); setThreads(result.threads || []); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { loadThreads(); return () => abortRef.current?.abort(); }, []);
  const openThread = async (thread) => { setActive(thread); try { const result = await api.thread(thread.id); setMessages(result.messages || []); } catch (err) { setError(err.message); } };
  const send = async (event) => {
    event.preventDefault(); const message = draft.trim(); if (!message || sending) return;
    setDraft(""); setSending(true); setError(""); setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: message }, { id: `answer-${Date.now()}`, is_user: false, content: "", streaming: true }]);
    abortRef.current = new AbortController();
    try { await streamChat(message, active?.id, (eventData) => { if (eventData.type === "thread_id") { setActive((current) => current || { id: eventData.data, title: "New conversation" }); } if (eventData.type === "token") setMessages((current) => { const copy = [...current]; copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + eventData.data }; return copy; }); if (eventData.type === "complete") { setMessages((current) => { const copy = [...current]; copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false }; return copy; }); loadThreads(); } if (eventData.type === "error") setError(eventData.data); }, abortRef.current.signal); } catch (err) { if (err.name !== "AbortError") { setError(err.message); setMessages((current) => current.slice(0, -1)); } } finally { setSending(false); }
  };
  return <div className="page chat-page"><PageHeader eyebrow="A SAFE PLACE TO SAY IT" title={<>You can put it<br /><i>down here.</i></>} sub="CalmBot listens with care. Start anywhere." /><div className="chat-layout"><aside className="thread-sidebar"><div className="thread-sidebar-head"><span>YOUR THREADS</span><button onClick={() => { setActive(null); setMessages([]); }} aria-label="New chat"><Plus size={16} /></button></div>{loading ? <Loading /> : threads.length ? threads.map((thread) => <button className={`thread-item ${active?.id === thread.id ? "selected" : ""}`} key={thread.id} onClick={() => openThread(thread)}><MessageCircle size={15} /><span><b>{thread.title}</b><small>{thread.last_message || "No messages yet"}</small></span></button>) : <p className="thread-empty">Your first conversation can start whenever you’re ready.</p>}</aside><section className="chat-window"><div className="chat-window-top"><span className="bot-status"><span className="pulse-dot" /> CalmBot is here</span><span className="bot-note">not a replacement for professional care</span></div><div className="message-list">{messages.length ? messages.map((message, index) => <div className={`message ${message.is_user ? "message-user" : "message-bot"}`} key={message.id || index}><div className="message-avatar">{message.is_user ? <UserRound size={15} /> : "z"}</div><div className="message-bubble">{message.content || (message.streaming ? <span className="typing"><i /><i /><i /></span> : "")}{message.streaming && message.content && <span className="cursor-blink" />}</div></div>) : <div className="chat-intro"><div className="intro-orb"><Leaf size={27} /></div><h3>A moment just for you.</h3><p>Share what’s on your mind, or choose a gentle place to begin.</p><div className="prompt-chips">{["I feel a little overwhelmed", "Help me slow down", "I need a small win"].map((prompt) => <button key={prompt} onClick={() => setDraft(prompt)}>{prompt}</button>)}</div></div>}{error && <ApiError message={error} />}</div><form className="chat-composer" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What’s present for you today?" aria-label="Message CalmBot" /><button disabled={sending || !draft.trim()} aria-label="Send message"><Send size={18} /></button></form></section></div></div>;
}

function Journal() {
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = () => Promise.allSettled([api.journals(), api.prompts()]).then(([journal, prompt]) => { if (journal.status === "fulfilled") setEntries(journal.value); if (prompt.status === "fulfilled") setPrompts(prompt.value); });
  useEffect(() => { load(); }, []);
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; setSaving(true); setError(""); try { await api.createJournal({ content, mood, tags: [] }); setContent(""); load(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  const remove = async (id) => { try { await api.deleteJournal(id); setEntries((current) => current.filter((entry) => (entry._id || entry.id) !== id)); } catch (err) { setError(err.message); } };
  return <div className="page"><PageHeader eyebrow="YOUR PRIVATE PAGE" title={<>Make a little room<br /><i>for your thoughts.</i></>} sub="Nothing to perform here. Just notice what’s true." action={<span className="privacy-note">🔒 private to you</span>} />{error && <ApiError message={error} />}<div className="journal-layout"><form className="journal-editor" onSubmit={save}><div className="editor-top"><span>Saturday, September 5</span><span className="entry-number">ENTRY {String(entries.length + 1).padStart(2, "0")}</span></div><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What’s moving through you today?" /><div className="editor-bottom"><div className="mood-select"><span>Today feels</span>{["calm", "tender", "heavy", "hopeful"].map((item) => <button type="button" className={mood === item ? "selected" : ""} onClick={() => setMood(item)} key={item}>{item}</button>)}</div><button className="button button-small" disabled={saving || !content.trim()}>{saving ? "Saving…" : <>Save this moment <ArrowRight size={15} /></>}</button></div></form><aside className="prompt-card"><div className="prompt-icon"><Sparkles size={18} /></div><span className="card-kicker">A GENTLE PROMPT</span><h3>{prompts[0]?.prompt || "What would you like to remember about today?"}</h3><button className="subtle-link" onClick={() => prompts.length && setContent(prompts[Math.floor(Math.random() * prompts.length)].prompt)}>Give me another <ArrowRight size={14} /></button></aside></div><div className="journal-history"><div className="section-heading"><div><span className="card-kicker">YOUR REFLECTIONS</span><h2>Looking back, kindly.</h2></div><span className="muted-copy">{entries.length} {entries.length === 1 ? "entry" : "entries"}</span></div>{entries.length ? <div className="entry-grid">{entries.slice(0, 6).map((entry) => { const id = entry._id || entry.id; return <article className="entry-card" key={id}><div className="entry-meta"><span>{entry.mood || "reflective"}</span><button onClick={() => remove(id)} aria-label="Delete journal entry"><Trash2 size={14} /></button></div><h3>{entry.title || "A moment with myself"}</h3><p>{entry.content}</p><small>{entry.created_at ? new Date(entry.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Recently"}</small></article>; })}</div> : <EmptyState icon={BookOpen} title="Your pages are waiting." text="When you’re ready, write one honest line. That’s enough." />}</div></div>;
}

function Books() {
  const [recommendations, setRecommendations] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { api.booksByMood().then(setRecommendations).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const result = await api.searchBooks(query); setResults(result.books || []); } catch (err) { setError(err.message); } };
  const books = results.length ? results : recommendations?.books || [];
  return <div className="page"><PageHeader eyebrow="A QUIET KIND OF COMPANY" title={<>Find something<br /><i>to get lost in.</i></>} sub="Stories and ideas for the mood you’re carrying." /><form className="search-bar" onSubmit={search}><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a book, author, or feeling…" /><button>Search</button></form>{error && <ApiError message={error} />}{loading ? <Loading /> : <><div className="recommendation-banner"><div><span className="card-kicker">PICKED FOR YOUR RECENT MOOD</span><h2>{recommendations?.mood_description || "Books to help you settle, wonder, and grow."}</h2></div><BookHeart size={42} strokeWidth={1} /></div><div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>{!books.length && <EmptyState icon={BookOpen} title="No books found yet." text="Try searching for a feeling like calm, hope, or courage." />}</>}</div>;
}

function BookCard({ book }) { return <article className="book-card"><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <BookOpen size={28} />}<span className="cover-leaf">✦</span></div><div className="book-info"><span className="book-type">A RECOMMENDATION</span><h3>{book.title}</h3><p>{book.author || "Unknown author"}</p>{book.description && <small>{book.description}</small>}<button className="subtle-link"><BookmarkIcon /> Save for later</button></div></article>; }
function BookmarkIcon() { return <BookHeart size={14} />; }

function Music() {
  const [songs, setSongs] = useState([]);
  const [chosen, setChosen] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { api.songs().then((result) => setSongs(result.songs || [])).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const getRecommendations = async (event) => { event.preventDefault(); if (!chosen) return; try { const result = await api.recommendSongs(chosen); setRecommendations(result.recommendations || []); } catch (err) { setError(err.message); } };
  return <div className="page music-page"><PageHeader eyebrow="A SOFTER SOUNDTRACK" title={<>Press play on<br /><i>feeling better.</i></>} sub="Music can meet you exactly where words can’t." /><div className="music-hero"><div className="vinyl"><div className="vinyl-label"><Music2 size={18} /></div></div><div><span className="card-kicker">YOUR SOUNDTRACK, YOUR WAY</span><h2>Find the song<br />that shifts the room.</h2><p>Choose something you love and we’ll find a few kindred sounds.</p><form className="music-picker" onSubmit={getRecommendations}><select value={chosen} onChange={(event) => setChosen(event.target.value)}><option value="">Choose a song to begin…</option>{songs.slice(0, 100).map((song) => <option key={song}>{song}</option>)}</select><button className="button button-small" disabled={!chosen}><Play size={14} fill="currentColor" /> Find my mix</button></form></div></div>{error && <ApiError message={error} />}{loading ? <Loading /> : <section className="music-results"><div className="section-heading"><div><span className="card-kicker">{recommendations.length ? "BECAUSE YOU LIKE THAT" : "A FEW PLACES TO START"}</span><h2>{recommendations.length ? "Sounds that belong together." : "Let something gentle in."}</h2></div></div><div className="song-list">{(recommendations.length ? recommendations : songs.slice(0, 5).map((name) => ({ name, artist: "ZenHeaven selection", album_cover_url: "" }))).map((song, index) => <div className="song-row" key={`${song.name}-${index}`}><div className="album-art">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={17} />}</div><span><b>{song.name}</b><small>{song.artist}</small></span><button aria-label={`Play ${song.name}`} onClick={() => song.spotify_uri && window.open(`https://open.spotify.com/track/${song.spotify_uri.split(":").pop()}`, "_blank")}><Play size={15} fill="currentColor" /></button></div>)}</div></section>}</div>;
}

function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => { api.therapists().then(setTherapists).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const book = async (event) => { event.preventDefault(); if (!slot || !selected) return; const date = new Date(slot); try { await api.bookAppointment({ user_id: user.id, therapist_id: selected._id || selected.id, date: date.toISOString(), start_time: date.toISOString(), end_time: new Date(date.getTime() + 3600000).toISOString(), session_type: "video" }); setSelected(null); alert("Your session is booked. You made a thoughtful choice."); } catch (err) { setError(err.message); } };
  return <div className="page"><PageHeader eyebrow="WHEN YOU’RE READY" title={<>You don’t have to<br /><i>do this alone.</i></>} sub="Meet qualified professionals who can walk alongside you." /><div className="support-note"><Heart size={18} fill="currentColor" /><span><b>A note of care:</b> ZenHeaven is for everyday support, not emergencies. If you’re in immediate danger, contact your local emergency services.</span></div>{error && <ApiError message={error} />}{loading ? <Loading /> : <div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="therapist-photo">{therapist.photo_url ? <img src={therapist.photo_url} alt="" /> : <UserRound size={32} />}</div><div className="therapist-content"><span className="rating"><Star size={14} fill="currentColor" /> {therapist.rating || "4.8"} <small>· {therapist.experience_years} years experience</small></span><h2>{therapist.name}</h2><p className="specializations">{(therapist.specializations || []).join("  ·  ")}</p><p>{therapist.bio}</p><div className="therapist-footer"><span><b>${therapist.hourly_rate}</b> / session</span><button className="button button-small" onClick={() => setSelected(therapist)}>See availability <ArrowRight size={14} /></button></div></div></article>)}</div>}{!loading && !therapists.length && <EmptyState icon={UsersRound} title="Support is gathering." text="No therapist profiles came back from the API yet." />}{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><form className="booking-modal" onSubmit={book} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button><span className="card-kicker">BOOK A SESSION</span><h2>Find time with<br /><i>{selected.name}</i></h2><p>Choose an open hour that feels right for you.</p><select required value={slot} onChange={(event) => setSlot(event.target.value)}><option value="">Select an available time</option>{(selected.available_slots || []).slice(0, 10).map((item) => <option key={item.start_time} value={item.start_time}>{new Date(item.start_time).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric" })}</option>)}</select><button className="button full-button">Book this session <ArrowRight size={16} /></button></form></div>}</div>;
}

function CoinsPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [rates, setRates] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { Promise.allSettled([api.balance(), api.transactions(), api.goals(), api.exchangeRates()]).then(([balanceResult, txResult, goalResult, rateResult]) => { if (balanceResult.status === "fulfilled") setBalance(balanceResult.value.balance); if (txResult.status === "fulfilled") setTransactions(txResult.value); if (goalResult.status === "fulfilled") setGoals(goalResult.value); if (rateResult.status === "fulfilled") setRates(rateResult.value); if ([balanceResult, txResult, goalResult, rateResult].every((result) => result.status === "rejected")) setError("Your Calm Coins wallet is taking a moment to wake up."); }); }, []);
  return <div className="page"><PageHeader eyebrow="YOUR GENTLE REWARDS" title={<>A little credit<br /><i>for showing up.</i></>} sub="Calm Coins celebrate the small ways you care for yourself." />{error && <ApiError message={error} />}<div className="coins-hero"><div className="coin-sun"><Coins size={39} /></div><div><span className="card-kicker">YOUR CALM COINS</span><strong>{balance}</strong><p>coins waiting to be used for more care</p></div><div className="coin-sparkles"><Sparkles /><Sparkles /><Sparkles /></div></div><div className="coin-grid"><section className="coin-panel"><div className="section-heading"><div><span className="card-kicker">TODAY’S INVITATIONS</span><h2>Care, with a little sparkle.</h2></div></div>{goals.length ? goals.map((goal) => <div className="coin-goal" key={goal.id}><span className={goal.completed ? "goal-icon done" : "goal-icon"}>{goal.completed ? <Check size={14} /> : <Zap size={14} />}</span><span><b>{goal.title}</b><small>{goal.completed ? "You did it today" : `${goal.current || 0} of ${goal.target} complete`}</small></span><strong>+{goal.coins}</strong></div>) : <Loading />}</section><section className="coin-panel"><div className="section-heading"><div><span className="card-kicker">RECENT ACTIVITY</span><h2>Your little wins.</h2></div></div>{transactions.length ? transactions.slice(0, 5).map((item, index) => <div className="transaction-row" key={item._id || item.transaction_id || index}><span>{item.transaction_type === "earn" ? "+" : "−"}</span><span><b>{item.description}</b><small>{item.source}</small></span><strong className={item.transaction_type === "earn" ? "positive" : ""}>{item.amount}</strong></div>) : <p className="muted-copy">Your activity will appear after your first check-in.</p>}</section></div><section className="exchange-card"><div><span className="card-kicker">HOW IT WORKS</span><h2>Coins are just a thank-you.</h2><p>Use them to unlock supportive experiences as you build your rhythm.</p></div><div className="rate-list">{Object.entries(rates?.earning || { mental_health_chat: 5, journal_entry: 15, daily_checkin: 10 }).slice(0, 3).map(([name, value]) => <span key={name}><b>+{value}</b> {name.replaceAll("_", " ")}</span>)}</div></section></div>;
}

export default App;
