import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  BookOpenText,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Compass,
  Heart,
  Home,
  Leaf,
  Library,
  LogOut,
  Menu,
  MessageCircle,
  Mic2,
  Moon,
  Music2,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const avatarColors = ["avatar-coral", "avatar-blue", "avatar-green", "avatar-plum"];

const fallbackBooks = [
  { id: "book-1", title: "The Comfort Book", author: "Matt Haig", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80", description: "A collection of notes, lists, and stories for difficult days." },
  { id: "book-2", title: "Atomic Habits", author: "James Clear", image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80", description: "Tiny changes, remarkable results. Build a better daily rhythm." },
  { id: "book-3", title: "Wintering", author: "Katherine May", image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80", description: "The power of rest and retreat in difficult times." },
  { id: "book-4", title: "Maybe You Should Talk to Someone", author: "Lori Gottlieb", image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80", description: "A therapist, her patients, and the human stories between." },
];

const fallbackTherapists = [
  { _id: "therapist-1", name: "Dr. Sarah Johnson", specializations: ["Anxiety", "Depression", "Stress Management"], experience_years: 12, education: "Ph.D in Clinical Psychology, Stanford University", bio: "CBT and mindfulness for anxious minds finding their footing.", hourly_rate: 120, languages: ["English", "Spanish"], rating: 4.8, total_sessions: 1247 },
  { _id: "therapist-2", name: "Dr. Michael Chen", specializations: ["Trauma", "PTSD", "Family Therapy"], experience_years: 15, education: "Psy.D in Clinical Psychology, Columbia University", bio: "A steady, evidence-based space to process and rebuild.", hourly_rate: 135, languages: ["English", "Mandarin"], rating: 4.7, total_sessions: 892 },
  { _id: "therapist-3", name: "Maya Rodriguez, LMFT", specializations: ["Relationships", "Couples Therapy", "Self-Esteem"], experience_years: 8, education: "M.S. in Marriage and Family Therapy, NYU", bio: "Helping you create healthier connections, starting with yourself.", hourly_rate: 100, languages: ["English", "Spanish"], rating: 4.9, total_sessions: 654 },
];

const fallbackJournal = [
  { _id: "entry-1", title: "A softer start", content: "I made time for coffee without checking my phone. It felt small, but my whole morning had more room in it.", mood: "calm", tags: ["morning", "presence"], created_at: new Date().toISOString() },
  { _id: "entry-2", title: "Naming the pressure", content: "Work felt loud today. I noticed the urge to fix everything at once and chose one next step instead.", mood: "hopeful", tags: ["work", "growth"], created_at: new Date(Date.now() - 86400000).toISOString() },
];

async function request(path, options = {}, token = "") {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || "Something went wrong");
  return response.json();
}

function initials(name = "Zen") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value) {
  if (!value) return "Today";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function Logo({ dark = false }) {
  return <Link to="/" className={`logo ${dark ? "logo-dark" : ""}`}><span className="logo-mark"><Leaf size={16} strokeWidth={2.5} /></span><span>zenheaven</span></Link>;
}

function Button({ children, variant = "primary", className = "", type = "button", ...props }) {
  return <button type={type} className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function Landing() {
  return (
    <main className="landing">
      <nav className="landing-nav page-width">
        <Logo />
        <div className="landing-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Inside ZenHeaven</a>
          <a href="#manifesto">Our why</a>
        </div>
        <div className="landing-actions">
          <Link to="/login" className="text-link">Log in</Link>
          <Link to="/register" className="button button-dark">Get started <ArrowUpRight size={16} /></Link>
        </div>
        <Link to="/register" className="mobile-cta">Start <ArrowUpRight size={15} /></Link>
      </nav>

      <section className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YC S26 / Mental wellness, reimagined</div>
          <h1>A calmer<br /><em>operating system</em><br />for your mind.</h1>
          <p className="hero-lede">ZenHeaven brings your everyday mental health into one gentle, intelligent place. Notice what you need. Take the next small step.</p>
          <div className="hero-actions">
            <Link to="/register" className="button button-coral button-lg">Find your calm <ArrowRight size={18} /></Link>
            <a href="#how-it-works" className="watch-link"><span className="play-circle">▶</span> See how it works</a>
          </div>
          <div className="hero-proof"><div className="proof-avatars"><span>AM</span><span>JR</span><span>SK</span><span>+14k</span></div><span>Built for the days you need it most.</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-sun sun-one" />
          <div className="hero-sun sun-two" />
          <div className="product-window">
            <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>zenheaven / today</span><div className="window-command">⌘ K</div></div>
            <div className="mini-dashboard">
              <aside className="mini-side"><div className="mini-logo"><Leaf size={12} /></div><div className="mini-nav active"><Home size={14} /></div><div className="mini-nav"><MessageCircle size={14} /></div><div className="mini-nav"><BookOpenText size={14} /></div><div className="mini-nav"><Music2 size={14} /></div><div className="mini-spacer" /><div className="mini-nav"><CircleDollarSign size={14} /></div></aside>
              <div className="mini-main"><div className="mini-greeting"><span>MONDAY, OCTOBER 14</span><b>Good morning, Arjun <span className="wave">✦</span></b></div><div className="mini-stats"><div className="mini-stat"><span>YOUR CHECK-IN</span><strong>Feeling <b>grounded</b></strong><div className="mood-bar"><i /><i /><i /><i className="muted" /><i className="muted" /></div></div><div className="mini-stat coin-stat"><span>CALM COINS</span><strong>240 <CircleDollarSign size={17} /></strong><small>+35 this week <ArrowUpRight size={11} /></small></div></div><div className="mini-focus"><div><span className="card-label">YOUR NEXT SMALL STEP</span><h3>Make space for what matters.</h3><p>Take 3 minutes to write what's on your mind.</p><button>Open journal <ArrowRight size={12} /></button></div><div className="focus-blob"><Leaf size={58} /></div></div><div className="mini-row"><div><span className="card-label">YOUR RHYTHM</span><div className="rhythm-bars"><i /><i /><i /><i /><i /><i /><i /></div><small>7 day check-in streak</small></div><div className="mini-book"><BookOpen size={15} /><span>For your headspace</span><b>Wintering</b></div></div></div></div>
          </div>
          <div className="floating-note note-top"><span className="note-icon yellow"><Sparkles size={16} /></span><div><b>Small steps count</b><span>+10 calm coins</span></div></div>
          <div className="floating-note note-bottom"><span className="note-icon blue"><ShieldCheck size={16} /></span><div><b>Your space is private</b><span>Always encrypted</span></div></div>
        </div>
      </section>

      <section className="logo-strip page-width"><span>THE NEW DEFAULT FOR</span><div><b>your inner world</b><b>your daily rhythm</b><b>your becoming</b></div></section>

      <section className="story-section page-width" id="how-it-works">
        <div className="section-kicker">01 / A BETTER WAY IN</div>
        <div className="story-grid"><h2>Wellness shouldn't<br /><span>feel like homework.</span></h2><div><p className="large-copy">Most mental health tools ask you to work harder. ZenHeaven meets you where you are, then makes the next right thing feel a little more possible.</p><a href="#features" className="arrow-link">See the whole picture <ArrowUpRight size={16} /></a></div></div>
        <div className="step-row"><div className="step-card"><span className="step-number">01</span><div className="step-icon coral"><Sun size={22} /></div><h3>Notice</h3><p>A two-minute check-in turns a vague feeling into something you can work with.</p></div><div className="step-card"><span className="step-number">02</span><div className="step-icon yellow"><Compass size={22} /></div><h3>Choose</h3><p>Get a tiny, relevant next step — from a journal prompt to a human conversation.</p></div><div className="step-card"><span className="step-number">03</span><div className="step-icon blue"><Zap size={22} /></div><h3>Keep going</h3><p>Your progress compounds quietly, with support that gets to know your rhythm.</p></div></div>
      </section>

      <section className="feature-section" id="features"><div className="page-width feature-intro"><div className="section-kicker">02 / ONE HOME FOR YOUR HEADSPACE</div><h2>Everything you need<br /><em>to feel more like you.</em></h2></div><div className="feature-collage page-width"><div className="collage-card collage-chat"><div className="collage-top"><span className="live-dot" /> CALMBOT / ONLINE <MessageCircle size={16} /></div><div className="chat-line bot">Hey. No need to have the right words. What's taking up the most space today?</div><div className="chat-line user">I've been feeling stretched thin.</div><div className="chat-line bot">That makes sense. Let's find one edge to soften.</div><div className="chat-input">Tell CalmBot what's on your mind <Send size={14} /></div><span className="collage-label">24/7 AI SUPPORT</span></div><div className="collage-card collage-journal"><div className="journal-squiggle">✦</div><span className="collage-label">JOURNAL + REFLECT</span><h3>Your thoughts<br />deserve room.</h3><p>Write freely. Get a little clarity back.</p><ArrowUpRight className="card-arrow" size={20} /></div><div className="collage-card collage-music"><Music2 size={20} /><span>MOOD-BASED MUSIC</span><div className="vinyl"><div /></div><h3>Soundtrack<br />your soft days.</h3><div className="track"><i /><span>Holocene — Bon Iver</span><b>2:48</b></div></div><div className="collage-card collage-people"><div className="people-stack"><span>DR</span><span>MC</span><span>AP</span></div><span className="collage-label">HUMAN CARE, WHEN YOU WANT IT</span><h3>Find your<br /><em>person.</em></h3><p>Licensed therapists who get it.</p><ArrowUpRight className="card-arrow" size={20} /></div></div></section>

      <section className="manifesto page-width" id="manifesto"><div className="manifesto-mark"><Leaf size={32} /></div><p>“The goal isn't to become a new person. It's to make enough space to hear the one you've been all along.”</p><span>— THE ZENHEAVEN MANIFESTO</span></section>
      <footer className="landing-footer page-width"><Logo /><span>© 2026 ZenHeaven, Inc.</span><div><a href="#how-it-works">How it works</a><a href="#features">Features</a><Link to="/login">Log in</Link></div><span className="footer-tag">Made for your becoming <span>✦</span></span></footer>
    </main>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await request(`/auth/${isLogin ? "login" : "register"}`, { method: "POST", body: JSON.stringify(isLogin ? { username: form.username, password: form.password } : form) });
      localStorage.setItem("zen_token", data.access_token);
      localStorage.setItem("zen_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      if (isLogin && form.username && form.password) {
        const user = { username: form.username, full_name: form.username, calm_coins: 100, id: "demo-user" };
        localStorage.setItem("zen_token", "demo-token");
        localStorage.setItem("zen_user", JSON.stringify(user));
        navigate("/dashboard");
      } else setError(err.message);
    } finally { setLoading(false); }
  };
  return <main className="auth-page"><div className="auth-art"><div className="auth-art-top"><Logo dark /><span>PRIVATE BY DEFAULT <ShieldCheck size={14} /></span></div><div className="auth-quote"><div className="quote-mark">“</div><h1>Your mind is<br /><em>worth tending to.</em></h1><p>One small, kind choice at a time.</p></div><div className="auth-orbit"><div /><div /><Leaf size={62} /></div><span className="auth-art-footer">ZENHEAVEN / 01</span></div><div className="auth-form-wrap"><Link to="/" className="back-home">← Back home</Link><div className="auth-form"><span className="section-kicker">WELCOME {isLogin ? "BACK" : "IN"}</span><h2>{isLogin ? "Good to see you." : "Start where you are."}</h2><p>{isLogin ? "Your headspace is waiting." : "A calmer day starts with one small step."}</p><form onSubmit={submit}>{!isLogin && <label>What should we call you?<input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" /></label>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="you" /></label>{!isLogin && <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>{error && <div className="form-error">{error}</div>}<Button type="submit" className="full-button" disabled={loading}>{loading ? "Opening your space..." : isLogin ? "Enter ZenHeaven" : "Create my space"} <ArrowRight size={17} /></Button></form><div className="auth-switch">{isLogin ? "New here?" : "Already have an account?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create your space" : "Log in"}</Link></div><small className="privacy-note"><ShieldCheck size={14} /> Your data is yours. We never sell it.</small></div></div></main>;
}

function ProtectedRoute({ children }) {
  return localStorage.getItem("zen_token") ? children : <Navigate to="/login" replace />;
}

const navItems = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/chat", label: "CalmBot", icon: MessageCircle },
  { to: "/journal", label: "Journal", icon: BookOpenText },
  { to: "/books", label: "Library", icon: Library },
  { to: "/music", label: "Soundtrack", icon: Music2 },
  { to: "/therapists", label: "Find a therapist", icon: UsersRound },
];

function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("zen_user") || '{"username":"friend","full_name":"Friend","calm_coins":100}'));
  const [balance, setBalance] = useState(user.calm_coins || 100);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    request("/coins/balance", {}, localStorage.getItem("zen_token")).then((data) => setBalance(data.balance)).catch(() => {});
  }, []);
  const logout = () => { localStorage.removeItem("zen_token"); localStorage.removeItem("zen_user"); navigate("/"); };
  const displayName = user.full_name || user.username || "friend";
  return <div className="app-shell"><aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}><div className="side-top"><Logo /><button className="close-sidebar" onClick={() => setMobileOpen(false)}><X size={20} /></button></div><div className="side-label">YOUR SPACE</div><nav className="app-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}><Icon size={18} /><span>{label}</span>{label === "CalmBot" && <span className="new-pill">NEW</span>}</NavLink>)}</nav><div className="side-label side-label-lower">MORE WAYS IN</div><NavLink to="/coins" className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}><CircleDollarSign size={18} /><span>Calm Coins</span></NavLink><div className="side-bottom"><div className="side-coins"><div className="coin-orb"><CircleDollarSign size={15} /></div><div><span>YOUR BALANCE</span><b>{balance} coins</b></div><ChevronRight size={15} /></div><button className="profile-row" onClick={logout}><span className="avatar avatar-small">{initials(displayName)}</span><span><b>{displayName}</b><small>Sign out</small></span><LogOut size={15} /></button></div></aside><div className="app-content"><header className="app-header"><button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumbs"><span>ZenHeaven</span><ChevronRight size={14} /><b>{navItems.find((item) => location.pathname.startsWith(item.to))?.label || (location.pathname === "/coins" ? "Calm Coins" : "Your space")}</b></div><div className="header-actions"><button className="icon-button"><Search size={18} /></button><Link to="/coins" className="header-coin"><CircleDollarSign size={16} /> {balance}</Link><span className="avatar">{initials(displayName)}</span></div></header><div className="app-main">{children}</div></div></div>;
}

function PageIntro({ kicker, title, description, action }) {
  return <div className="page-intro"><div><span className="section-kicker">{kicker}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("zen_user") || '{"full_name":"friend","username":"friend"}');
  const [mood, setMood] = useState("grounded");
  const moods = [{ label: "low", emoji: "☁" }, { label: "tender", emoji: "◌" }, { label: "okay", emoji: "◡" }, { label: "grounded", emoji: "✦" }, { label: "bright", emoji: "☀" }];
  return <div className="dashboard-page"><PageIntro kicker="MONDAY / OCTOBER 14, 2026" title={<>Good morning, {user.full_name || user.username} <span className="title-spark">✦</span></>} description="You don't have to do it all today." action={<button className="date-button"><CalendarDays size={16} /> This week <ChevronDown size={15} /></button>} /><section className="checkin-card"><div className="checkin-copy"><span className="card-label">A 30-SECOND CHECK-IN</span><h2>How are you arriving today?</h2><p>No wrong answers. Just a place to begin.</p><div className="mood-options">{moods.map((item) => <button key={item.label} className={mood === item.label ? "selected" : ""} onClick={() => setMood(item.label)}><span>{item.emoji}</span>{item.label}</button>)}</div></div><div className="checkin-art"><div className="art-sun" /><div className="art-hill hill-back" /><div className="art-hill hill-front" /><Leaf className="art-leaf" size={34} /></div></section><div className="dashboard-grid"><section className="today-card panel"><div className="panel-heading"><div><span className="card-label">YOUR NEXT SMALL STEP</span><h3>Make space for what matters.</h3></div><div className="round-icon coral"><BookOpenText size={19} /></div></div><p>Write down one thing that’s taking up space in your head. You don’t have to solve it yet.</p><Link to="/journal" className="panel-link">Open journal <ArrowRight size={15} /></Link></section><section className="streak-card panel"><div className="panel-heading"><div><span className="card-label">YOUR RHYTHM</span><h3>7 day streak <span>✦</span></h3></div><div className="round-icon yellow"><Zap size={19} /></div></div><div className="streak-days">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <div key={`${day}-${index}`} className={index < 5 ? "done" : index === 5 ? "today" : ""}><span>{day}</span><i>{index < 5 ? "✓" : index === 5 ? "•" : ""}</i></div>)}</div><p>Keep your gentle momentum going.</p></section></div><section className="quick-grid"><Link to="/chat" className="quick-card quick-chat"><div><span className="card-label">NEED TO UNLOAD?</span><h3>Talk it out<br /><em>with CalmBot.</em></h3><span className="quick-arrow"><ArrowUpRight size={17} /></span></div><div className="quick-bubble"><MessageCircle size={24} /></div></Link><Link to="/therapists" className="quick-card quick-human"><div><span className="card-label">WHEN YOU’RE READY</span><h3>Find your<br /><em>person.</em></h3><span className="quick-arrow"><ArrowUpRight size={17} /></span></div><div className="quick-people"><span>DR</span><span>MC</span><span>AP</span></div></Link><Link to="/music" className="quick-card quick-music"><div><span className="card-label">MATCH YOUR MOOD</span><h3>A soundtrack<br /><em>for right now.</em></h3><span className="quick-arrow"><ArrowUpRight size={17} /></span></div><div className="mini-vinyl"><div /></div></Link></section></div>;
}

function ChatPage() {
  const token = localStorage.getItem("zen_token");
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hey, I’m CalmBot. No need to have the right words — what’s taking up the most space today?" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thought, setThought] = useState("");
  useEffect(() => { request("/mental-health/threads", {}, token).then((data) => setThreads(data.threads || [])).catch(() => setThreads([{ id: "demo", title: "A little overwhelmed", last_message: "Finding one edge to soften." }])); }, [token]);
  const sendMessage = async (event) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || thinking) return;
    setInput(""); setMessages((prev) => [...prev, { role: "user", content: message }]); setThinking(true); setThought("CalmBot is making space for your message…");
    let responseText = "";
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, thread_id: threadId }) });
      if (!response.ok || !response.body) throw new Error("stream unavailable");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n"); buffer = events.pop() || "";
        events.forEach((eventChunk) => {
          const line = eventChunk.split("\n").find((part) => part.startsWith("data:"));
          if (!line) return;
          const payload = JSON.parse(line.replace("data:", "").trim());
          if (payload.type === "thread_id") setThreadId(payload.data);
          if (payload.type === "thinking") setThought(payload.data);
          if (payload.type === "token") { responseText += payload.data; setMessages((prev) => prev.map((item, index) => index === prev.length - 1 ? { ...item, content: responseText } : item)); }
        });
      }
    } catch (_err) {
      responseText = "That sounds like a lot to be carrying. You don’t have to untangle everything at once — what would feel like a 1% softer next step?";
      await new Promise((resolve) => setTimeout(resolve, 450));
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } finally { setThinking(false); setThought(""); }
  };
  return <div className="chat-page"><div className="chat-sidebar"><div className="chat-side-header"><div><span className="section-kicker">YOUR CONVERSATIONS</span><h3>Threads</h3></div><button className="round-button" onClick={() => { setThreadId(null); setMessages([{ role: "assistant", content: "A fresh page. What’s present for you right now?" }]); }}><Plus size={18} /></button></div><button className="new-chat-button" onClick={() => { setThreadId(null); setMessages([{ role: "assistant", content: "A fresh page. What’s present for you right now?" }]); }}><Plus size={16} /> New conversation</button><div className="thread-list">{threads.map((thread, index) => <button key={thread.id || index} className={threadId === thread.id ? "active" : ""} onClick={() => setThreadId(thread.id)}><MessageCircle size={15} /><span><b>{thread.title}</b><small>{thread.last_message || "A conversation with CalmBot"}</small></span><ChevronRight size={14} /></button>)}</div><div className="chat-side-note"><ShieldCheck size={17} /><span><b>Your space is private.</b> Conversations are yours alone.</span></div></div><div className="chat-main"><div className="chat-heading"><div className="bot-avatar"><Sparkles size={19} /></div><div><h1>CalmBot</h1><p><span className="online-dot" /> Here, whenever you need a little space</p></div><button className="icon-button"><Mic2 size={18} /></button></div><div className="messages"><div className="chat-date">TODAY <span /></div>{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}><div className={`message-avatar ${message.role}`}>{message.role === "assistant" ? <Sparkles size={14} /> : initials("you")}</div><div className="message-bubble">{message.content || <span className="typing"><i /><i /><i /></span>}<small>{message.role === "assistant" ? "CalmBot" : "You"} · just now</small></div></div>)}{thinking && <div className="thinking-label"><Sparkles size={13} /> {thought}</div>}</div><div className="chat-composer-wrap"><div className="suggestion-row"><button onClick={() => setInput("I’m feeling a little overwhelmed")}>I’m feeling overwhelmed</button><button onClick={() => setInput("Help me slow down")}>Help me slow down</button><button onClick={() => setInput("I need a tiny win")}>I need a tiny win</button></div><form className="chat-composer" onSubmit={sendMessage}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="What’s on your mind?" /><button aria-label="Send message"><Send size={18} /></button></form><p className="chat-disclaimer"><ShieldCheck size={13} /> CalmBot is a supportive tool, not a replacement for professional care. If you’re in immediate danger, contact local emergency services.</p></div></div></div>;
}

function JournalPage() {
  const token = localStorage.getItem("zen_token");
  const [entries, setEntries] = useState([]);
  const [writing, setWriting] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  const [saved, setSaved] = useState(false);
  useEffect(() => { request("/journal/entries", {}, token).then(setEntries).catch(() => setEntries(fallbackJournal)); }, [token]);
  const saveEntry = async (event) => {
    event.preventDefault(); if (!content.trim()) return;
    const optimistic = { _id: `local-${Date.now()}`, title: content.split(".")[0].slice(0, 35) || "A new reflection", content, mood, tags: ["reflection"], created_at: new Date().toISOString() };
    setEntries((prev) => [optimistic, ...prev]); setContent(""); setWriting(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
    try { await request("/journal/entries", { method: "POST", body: JSON.stringify({ content: optimistic.content, mood, tags: optimistic.tags }) }, token); } catch (_err) { /* keep the local reflection visible */ }
  };
  return <div className="journal-page"><PageIntro kicker="JOURNAL / REFLECT" title={<>Give your thoughts<br /><em>some room.</em></>} description="A private place to notice what’s true, without needing to make it pretty." action={<Button onClick={() => setWriting(true)}><Plus size={17} /> New entry</Button>} />{saved && <div className="saved-toast"><Check size={16} /> Entry saved · +10 Calm Coins</div>}<div className="journal-layout"><div className="journal-main">{writing && <form className="writing-card panel" onSubmit={saveEntry}><div className="writing-head"><span className="card-label">NEW REFLECTION / {formatDate()}</span><button type="button" className="icon-button" onClick={() => setWriting(false)}><X size={18} /></button></div><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start anywhere… What’s present for you right now?" /><div className="writing-controls"><div className="mood-select"><span>How are you feeling?</span>{["calm", "hopeful", "tender", "anxious"].map((item) => <button type="button" key={item} className={mood === item ? "selected" : ""} onClick={() => setMood(item)}>{item}</button>)}</div><Button type="submit">Save entry <ArrowRight size={16} /></Button></div></form>}<div className="journal-list-heading"><span className="section-kicker">YOUR REFLECTIONS</span><span>{entries.length} entries</span></div>{entries.map((entry) => <article className="journal-entry panel" key={entry._id}><div className="entry-meta"><span className={`mood-dot mood-${(entry.mood || "calm").toLowerCase().replace(" ", "-")}`} /><span>{entry.mood || "reflective"}</span><span>·</span><span>{formatDate(entry.created_at || entry.date)}</span><button className="more-button">•••</button></div><h3>{entry.title || "A quiet moment"}</h3><p>{entry.content}</p><div className="entry-footer">{(entry.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}<button>Read reflection <ArrowRight size={14} /></button></div></article>)}</div><aside className="journal-aside"><div className="prompt-card"><div className="prompt-spark">✦</div><span className="card-label">TODAY’S PROMPT</span><h3>What would feel like enough for today?</h3><button onClick={() => { setWriting(true); setContent("What would feel like enough for today? "); }}>Use this prompt <ArrowRight size={15} /></button></div><div className="insight-card panel"><div className="panel-heading"><span className="card-label">YOUR INSIGHTS</span><Brain size={18} /></div><div className="insight-number">12 <small>entries this month</small></div><div className="insight-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><p><Sparkles size={14} /> You’ve been making space consistently.</p><Link to="/coins">View your rhythm <ArrowRight size={14} /></Link></div></aside></div></div>;
}

function BooksPage() {
  const token = localStorage.getItem("zen_token");
  const [books, setBooks] = useState(fallbackBooks);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("calm");
  const [loading, setLoading] = useState(false);
  const findBooks = async (event) => {
    event?.preventDefault(); setLoading(true);
    try { const data = await request(query ? `/books/search?q=${encodeURIComponent(query)}&max_results=10` : "/books/recommend-by-mood", {}, token); setBooks(data.books || []); } catch (_err) { setBooks(fallbackBooks.filter((book) => !query || `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))); } finally { setLoading(false); }
  };
  return <div className="books-page"><PageIntro kicker="LIBRARY / READ + GROW" title={<>A good book<br /><em>for right now.</em></>} description="Thoughtful recommendations for the mood you’re carrying." action={<form className="search-box" onSubmit={findBooks}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, author, or feeling" /><button>Search</button></form>} /><div className="mood-tabs"><span>RECOMMEND FOR</span>{["calm", "hopeful", "anxious", "curious"].map((item) => <button key={item} className={mood === item ? "active" : ""} onClick={() => { setMood(item); setQuery(item); }}>{item}</button>)}</div><div className="books-feature"><div className="book-feature-copy"><span className="card-label">BASED ON YOUR RECENT REFLECTIONS</span><h2>For the season<br />you’re in.</h2><p>Books can’t fix everything. But the right one can make you feel less alone in it.</p><button onClick={findBooks}>Refresh recommendations <Sparkles size={15} /></button></div><div className="book-stack"><div className="book-cover cover-back">The<br />Comfort<br />Book</div><div className="book-cover cover-mid">WINTERING</div><div className="book-cover cover-front">Maybe<br />You Should<br />Talk to<br />Someone</div></div></div><div className="library-heading"><div><span className="section-kicker">{loading ? "FINDING YOUR NEXT READ…" : "YOUR SHORTLIST"}</span><h3>Handpicked for you</h3></div><span>{books.length} books <ChevronRight size={15} /></span></div><div className="book-grid">{books.map((book) => <article className="book-card" key={book.id}><div className="book-image">{book.image_url ? <img src={book.image_url} alt="" /> : <BookOpen size={30} />}<button className="save-book"><Plus size={16} /></button></div><div className="book-info"><span>FOR {mood.toUpperCase()} DAYS</span><h3>{book.title}</h3><p>{book.author}</p><button>View book <ArrowUpRight size={14} /></button></div></article>)}</div></div>;
}

const fallbackSongs = [{ name: "Holocene", artist: "Bon Iver", album_cover_url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80" }, { name: "Bloom", artist: "The Paper Kites", album_cover_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" }, { name: "Space Song", artist: "Beach House", album_cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" }];
function MusicPage() {
  const [songs, setSongs] = useState(fallbackSongs);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => { request("/songs").then((data) => setSongs((data.songs || []).slice(0, 8).map((name) => ({ name, artist: "ZenHeaven radio", album_cover_url: fallbackSongs[0].album_cover_url })))).catch(() => {}); }, []);
  const filtered = songs.filter((song) => song.name.toLowerCase().includes(search.toLowerCase()));
  return <div className="music-page"><PageIntro kicker="SOUNDTRACK / LISTEN IN" title={<>Let the music<br /><em>meet you there.</em></>} description="Sound can hold what words can’t. Pick a feeling, press play, and let the room change." action={<div className="music-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a song" /></div>} /><div className="music-hero"><div className="music-hero-copy"><span className="card-label">A CURATED MIX FOR</span><h2>Quietly<br />hopeful</h2><p>Soft edges, open windows, somewhere to go.</p><button onClick={() => setPlaying(!playing)} className="play-button">{playing ? "Pause mix" : "Play mix"} <span>{playing ? "Ⅱ" : "▶"}</span></button></div><div className="music-art"><div className="large-vinyl"><div className="vinyl-label"><Leaf size={24} /></div></div><div className="music-spark spark-a">✦</div><div className="music-spark spark-b">✧</div></div></div><div className="music-content"><div className="track-list"><div className="library-heading"><div><span className="section-kicker">YOUR SOUNDTRACK</span><h3>For this moment</h3></div><span>{filtered.length} tracks</span></div>{filtered.map((song, index) => <button className={`track-row ${active === index ? "active" : ""}`} key={`${song.name}-${index}`} onClick={() => { setActive(index); setPlaying(true); }}><span className="track-number">{active === index && playing ? "◼" : String(index + 1).padStart(2, "0")}</span><span className="track-thumb">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={15} />}</span><span className="track-name"><b>{song.name}</b><small>{song.artist}</small></span><span className="track-wave">{active === index && playing ? "▂▅▇▅▃" : "···"}</span><span className="track-more">•••</span></button>)}</div><aside className="now-playing panel"><span className="card-label">NOW PLAYING</span><div className="now-cover"><img src={songs[active]?.album_cover_url || fallbackSongs[0].album_cover_url} alt="" /></div><h3>{songs[active]?.name || "Holocene"}</h3><p>{songs[active]?.artist || "Bon Iver"}</p><div className="progress"><i style={{ width: playing ? "42%" : "12%" }} /></div><div className="time-row"><span>1:18</span><span>3:55</span></div><div className="player-buttons"><button>↶</button><button className="player-play" onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▶"}</button><button>↷</button></div></aside></div></div>;
}

function TherapistsPage() {
  const token = localStorage.getItem("zen_token");
  const [therapists, setTherapists] = useState(fallbackTherapists);
  const [filter, setFilter] = useState("All specialties");
  const [selected, setSelected] = useState(null);
  const [booked, setBooked] = useState(false);
  useEffect(() => { request("/therapists/").then(setTherapists).catch(() => {}); }, [token]);
  const specialties = ["All specialties", "Anxiety", "Depression", "Relationships", "Trauma"];
  const visible = therapists.filter((therapist) => filter === "All specialties" || therapist.specializations?.some((item) => item.toLowerCase().includes(filter.toLowerCase())));
  const book = async () => {
    setBooked(true);
    if (selected) { try { await request("/therapists/appointments", { method: "POST", body: JSON.stringify({ user_id: "current-user", therapist_id: selected._id, date: new Date(Date.now() + 86400000).toISOString(), start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString(), session_type: "video" }) }, token); } catch (_err) { /* demo confirmation */ } }
  };
  return <div className="therapists-page"><PageIntro kicker="HUMAN CARE / FIND YOUR PERSON" title={<>The right support<br /><em>changes things.</em></>} description="Licensed therapists, matched to the way you want to be supported. Take your time." action={<div className="verified-note"><ShieldCheck size={17} /><span><b>All therapists verified</b><small>Licensed & reviewed by our care team</small></span></div>} /><div className="therapist-toolbar"><div className="specialty-tabs">{specialties.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="sort-button">Sort: Top rated <ChevronDown size={15} /></button></div><div className="therapist-grid">{visible.map((therapist, index) => <article className="therapist-card panel" key={therapist._id}><div className={`therapist-photo ${avatarColors[index % avatarColors.length]}`}><span>{initials(therapist.name)}</span><i><ShieldCheck size={12} /></i></div><div className="therapist-card-head"><div><h3>{therapist.name}</h3><p>{therapist.specializations?.slice(0, 2).join(" · ")}</p></div><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating}</span></div><p className="therapist-bio">{therapist.bio}</p><div className="therapist-details"><span><Clock3 size={14} /> {therapist.experience_years} years</span><span><GlobeIcon /> {therapist.languages?.[0]}</span></div><div className="therapist-card-footer"><span><b>${therapist.hourly_rate}</b> / session</span><button onClick={() => { setSelected(therapist); setBooked(false); }}>View profile <ArrowRight size={14} /></button></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={19} /></button>{booked ? <div className="booking-success"><div><Check size={26} /></div><span className="section-kicker">YOU’RE ALL SET</span><h2>Time made for you.</h2><p>Your video session request with {selected.name} is confirmed for tomorrow. We’ll send a reminder before you begin.</p><Button onClick={() => setSelected(null)}>Back to therapists <ArrowRight size={15} /></Button></div> : <><div className={`modal-avatar ${avatarColors[0]}`}>{initials(selected.name)}</div><span className="section-kicker">LICENSED THERAPIST</span><h2>{selected.name}</h2><p className="modal-specialty">{selected.specializations?.join(" · ")}</p><p>{selected.bio}</p><div className="session-options"><button className="session-option active"><span>Video session</span><b>${selected.hourly_rate}</b><small>Tomorrow · 10:00 AM</small></button><button className="session-option"><span>Send a message</span><b>Free</b><small>Usually replies in 24h</small></button></div><Button className="full-button" onClick={book}>Request this session <ArrowRight size={16} /></Button></>}</div></div>}</div>;
}

function GlobeIcon() {
  return <span className="globe-icon">◎</span>;
}

function CoinsPage() {
  const token = localStorage.getItem("zen_token");
  const [balance, setBalance] = useState(100);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([{ title: "Chat with CalmBot", current: 1, target: 1, coins: 10, completed: true }, { title: "Write in Journal", current: 0, target: 1, coins: 15, completed: false }, { title: "Complete mood check", current: 1, target: 1, coins: 5, completed: true }, { title: "Read a wellness article", current: 0, target: 1, coins: 8, completed: false }]);
  useEffect(() => { request("/coins/balance", {}, token).then((data) => setBalance(data.balance)).catch(() => {}); request("/coins/transactions", {}, token).then(setTransactions).catch(() => {}); request("/coins/daily-goals", {}, token).then(setGoals).catch(() => {}); }, [token]);
  return <div className="coins-page"><PageIntro kicker="CALM COINS / YOUR PROGRESS" title={<>Small steps.<br /><em>Real momentum.</em></>} description="Every act of care counts. Calm Coins make your invisible progress visible." action={<div className="coin-balance-chip"><CircleDollarSign size={20} /><span><small>YOUR BALANCE</small><b>{balance} coins</b></span></div>} /><div className="coins-grid"><section className="coin-hero"><div className="coin-hero-copy"><span className="card-label">YOUR CALM ACCOUNT</span><h2>{balance}</h2><p>Calm Coins available</p><div className="coin-hero-actions"><button onClick={() => request("/coins/earn", { method: "POST", body: JSON.stringify({ amount: 5, source: "daily_checkin", description: "Checked in today" }) }, token).then((data) => setBalance(data.new_balance)).catch(() => setBalance((value) => value + 5))}>+ Earn coins</button><Link to="/journal">See ways to earn <ArrowRight size={15} /></Link></div></div><div className="coin-graphic"><div className="coin-large"><CircleDollarSign size={44} /></div><span>✦</span><span>✧</span><span>✦</span></div></section><section className="goals-card panel"><div className="panel-heading"><div><span className="card-label">TODAY’S GENTLE GOALS</span><h3>Care compounds.</h3></div><Target size={19} /></div><div className="goals-list">{goals.map((goal, index) => <div className={`goal-row ${goal.completed ? "completed" : ""}`} key={goal.id || index}><div className="goal-icon">{goal.completed ? <Check size={15} /> : <span>{index + 1}</span>}</div><div className="goal-copy"><b>{goal.title}</b><small>{goal.current}/{goal.target} complete</small></div><span>+{goal.coins}</span></div>)}</div></section></div><div className="coin-lower-grid"><section className="transactions panel"><div className="library-heading"><div><span className="section-kicker">ACTIVITY</span><h3>Coin history</h3></div><button>View all <ArrowRight size={14} /></button></div>{transactions.length ? transactions.slice(0, 5).map((item, index) => <div className="transaction-row" key={item._id || index}><div className="transaction-icon"><Sparkles size={15} /></div><span><b>{item.description}</b><small>{formatDate(item.timestamp)}</small></span><strong className={item.transaction_type === "spend" ? "spent" : ""}>{item.transaction_type === "spend" ? "-" : "+"}{item.amount}</strong></div>) : <div className="empty-transactions"><Sparkles size={17} /> Complete a check-in to start your coin history.</div>}</section><section className="achievements panel"><span className="card-label">ACHIEVEMENTS</span><h3>Keep showing up.</h3><div className="achievement-row"><div className="achievement-icon"><Award size={20} /></div><span><b>First steps</b><small>Started your mental health journey</small></span><Check size={16} /></div><div className="achievement-row locked"><div className="achievement-icon"><Heart size={20} /></div><span><b>Mood master</b><small>Track your mood for 30 days</small></span><span>•••</span></div><Link to="/dashboard">See all achievements <ArrowRight size={14} /></Link></section></div></div>;
}

function App() {
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="*" element={<ProtectedRoute><AppShell><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<ChatPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/music" element={<MusicPage />} /><Route path="/therapists" element={<TherapistsPage />} /><Route path="/coins" element={<CoinsPage />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AppShell></ProtectedRoute>} /></Routes>;
}

export default App;
