import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownUp, ArrowRight, BarChart3, Bell, BookOpen, Check, ChevronDown, CircleHelp,
  Clock3, Compass, Copy, Cpu, ExternalLink, Headphones, Home, Leaf, Library, LockKeyhole,
  Menu, MessageCircle, Moon, MoreHorizontal, MoveUpRight, Music2, NotebookPen, PanelLeft,
  Pause, Play, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Star, Sun, UserRound,
  UsersRound, Wallet, X, Zap,
} from "lucide-react";
import { assets, books, journalEntries, movements, networks, therapists, tracks } from "./data";
import { registerUser, signIn, streamChat } from "./api";

const navGroups = [
  {
    label: "Navigate",
    links: [
      { to: "/dashboard", label: "Overview", icon: Home },
      { to: "/chat", label: "Ask Zen", icon: MessageCircle, badge: "AI" },
      { to: "/journal", label: "Journal", icon: NotebookPen },
    ],
  },
  {
    label: "Explore",
    links: [
      { to: "/books", label: "Library", icon: BookOpen },
      { to: "/music", label: "Soundscape", icon: Music2 },
      { to: "/therapists", label: "Guides", icon: UsersRound },
      { to: "/coins", label: "Assets", icon: Wallet },
    ],
  },
];

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zenheaven_user") || "null");
    } catch {
      return null;
    }
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const authenticate = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem("zenheaven_user", JSON.stringify(nextUser));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" onAuthenticate={authenticate} />} />
        <Route path="/register" element={<AuthPage mode="register" onAuthenticate={authenticate} />} />
        <Route element={<AppShell user={user} onLogout={() => { setUser(null); localStorage.removeItem("zenheaven_user"); }} onNotice={setNotice} />}>
          <Route path="/dashboard" element={<DashboardPage onNotice={setNotice} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/journal" element={<JournalPage onNotice={setNotice} />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/therapists" element={<TherapistsPage onNotice={setNotice} />} />
          <Route path="/coins" element={<CoinsPage />} />
        </Route>
        <Route path="*" element={<LandingPage />} />
      </Routes>
      {notice && <div className="toast"><Check size={16} /> {notice}</div>}
    </>
  );
}

function AppShell({ user, onLogout, onNotice }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const current = navGroups.flatMap((group) => group.links).find((link) => location.pathname.startsWith(link.to));
  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <Link to="/" className="brand"><span className="brand-mark"><span /></span>zenheaven</Link>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="side-network">
          <span className="network-dot" /> Mainnet <ChevronDown size={13} />
        </div>
        <nav className="side-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.links.map(({ to, label, icon: Icon, badge }) => (
                <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{badge && <em>{badge}</em>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="side-card">
            <span className="mini-orbit"><Sparkles size={14} /></span>
            <div><strong>Make room for calm.</strong><small>Your daily reset is ready.</small></div>
            <ArrowRight size={15} />
          </div>
          <NavLink to="/settings" className="nav-link"><Settings2 size={17} /><span>Preferences</span></NavLink>
          <div className="profile-row">
            <span className="avatar">{(user?.name || "A").slice(0, 1).toUpperCase()}</span>
            <div><strong>{user?.name || "Alex Morgan"}</strong><small>{user?.email || "alex@zenheaven.app"}</small></div>
            <button className="more-btn" onClick={onLogout} title="Sign out"><MoreHorizontal size={17} /></button>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="crumb"><span>ZenHeaven</span><ArrowRight size={13} /><strong>{current?.label || "Workspace"}</strong></div>
          <div className="top-actions">
            <button className="icon-btn" aria-label="Help"><CircleHelp size={18} /></button>
            <button className="icon-btn notification" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="connect-btn" onClick={() => onNotice("Wallet connected · 0x71...B4e2")}><span className="wallet-pulse" /> 0x71...B4e2</button>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" className="brand"><span className="brand-mark"><span /></span>zenheaven</Link>
        <nav><a href="#how-it-works">How it works</a><a href="#rituals">Rituals</a><a href="#journal">Field notes</a></nav>
        <div className="landing-actions"><Link to="/login" className="text-link">Sign in</Link><Link to="/register" className="button button-dark">Enter ZenHeaven <ArrowRight size={16} /></Link></div>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> A calmer protocol for a noisy world</div>
          <h1>Move value.<br /><i>Keep your peace.</i></h1>
          <p>ZenHeaven is your gentle command center for on-chain life — bridge, learn, reflect, and find your next right move without the noise.</p>
          <div className="hero-actions"><Link to="/register" className="button button-dark button-large">Open your sanctuary <ArrowRight size={17} /></Link><Link to="/dashboard" className="watch-link"><span className="play-circle"><Play size={11} fill="currentColor" /></span> See the workspace</Link></div>
          <div className="hero-proof"><div className="proof-avatars"><span>JD</span><span>MK</span><span>RS</span><span>+</span></div><span><strong>12,400+</strong> people finding their signal</span></div>
        </div>
        <div className="hero-art">
          <div className="sun-orb" />
          <div className="hero-grid" />
          <div className="float-card quote-card"><span className="quote-mark">“</span><p>Clarity is not<br />a destination.</p><small>— morning note, 07:14</small></div>
          <div className="float-card bridge-card"><div className="card-top"><span className="status-chip">● settled</span><MoreHorizontal size={16} /></div><strong>$2,400.00</strong><span className="muted">Ethereum <ArrowRight size={12} /> Base</span><div className="bridge-line"><span /><span /><span /><span /><span /></div></div>
          <div className="float-card leaf-card"><Leaf size={16} /><span>Take a breath</span></div>
        </div>
      </section>
      <section className="marquee"><span>BRIDGE WITH INTENTION</span><span>BRIDGE WITH INTENTION</span><span>BRIDGE WITH INTENTION</span><span>BRIDGE WITH INTENTION</span></section>
      <section className="landing-section intro-section" id="how-it-works">
        <div className="section-kicker">01 / THE INVITATION</div>
        <div className="split-heading"><h2>Your on-chain life<br /><i>deserves softness.</i></h2><p>Most tools ask you to optimize everything. ZenHeaven asks a different question: what would make this moment feel more spacious?</p></div>
        <div className="feature-trio" id="rituals">
          <FeatureCard number="01" icon={ArrowDownUp} title="Move with ease" copy="A cross-chain bridge that makes the technical feel human. See the path, fee, and finality before you commit." />
          <FeatureCard number="02" icon={NotebookPen} title="Notice the signal" copy="A private journal and daily check-ins for the patterns beneath your portfolio, projects, and pace." />
          <FeatureCard number="03" icon={Sparkles} title="Stay connected" copy="Thoughtful guides, books, soundscapes, and an AI companion for every kind of market weather." />
        </div>
      </section>
      <section className="quote-band" id="journal"><div className="quote-band-inner"><span className="quote-mark">“</span><blockquote>The goal isn't to become<br /><i>unshakeable.</i> It's to return.</blockquote><span className="signature">The ZenHeaven field guide <ArrowRight size={15} /></span></div></section>
      <footer className="landing-footer"><Link to="/" className="brand"><span className="brand-mark"><span /></span>zenheaven</Link><span>© 2026 ZenHeaven protocol</span><span>Built for better days on-chain <span className="footer-heart">✦</span></span></footer>
    </div>
  );
}

function FeatureCard({ number, icon: Icon, title, copy }) {
  return <div className="feature-card"><span className="feature-number">{number}</span><div className="feature-icon"><Icon size={20} /></div><h3>{title}</h3><p>{copy}</p><ArrowRight size={17} className="feature-arrow" /></div>;
}

function AuthPage({ mode, onAuthenticate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const result = isRegister ? await registerUser(form.name, form.email, form.password) : await signIn(form.email, form.password);
      onAuthenticate(result.user);
      navigate("/dashboard");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <div className="auth-page"><div className="auth-visual"><Link to="/" className="brand brand-light"><span className="brand-mark"><span /></span>zenheaven</Link><div className="auth-visual-copy"><span className="eyebrow"><span className="live-dot" /> Your quiet corner of the internet</span><h1>Come back<br /><i>to yourself.</i></h1><p>A little more spaciousness, one block at a time.</p></div><div className="auth-orbit"><span /><span /><span /></div><small className="auth-foot">Private by design · Open by intention</small></div><div className="auth-form-side"><div className="auth-form-wrap"><Link to="/" className="mobile-brand brand"><span className="brand-mark"><span /></span>zenheaven</Link><div className="auth-heading"><span className="section-kicker">WELCOME {isRegister ? "IN" : "BACK"}</span><h2>{isRegister ? "Make some room." : "Good to see you."}</h2><p>{isRegister ? "Your calmer workspace is a few details away." : "Pick up where you left off."}</p></div><form onSubmit={submit}>{isRegister && <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What should we call you?" /></label>}<label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark submit-button" disabled={loading}>{loading ? "Opening..." : isRegister ? "Create my space" : "Enter ZenHeaven"} <ArrowRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button className="social-button"><span className="google-g">G</span> Continue with Google</button><p className="switch-auth">{isRegister ? "Already have a space?" : "New here?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p></div></div></div>;
}

function PageHeader({ kicker, title, copy, action }) {
  return <div className="page-header"><div><span className="section-kicker">{kicker}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>;
}

function DashboardPage({ onNotice }) {
  const [from, setFrom] = useState(networks[0]);
  const [to, setTo] = useState(networks[2]);
  const [asset, setAsset] = useState(assets[0]);
  const [amount, setAmount] = useState("2,400");
  const [step, setStep] = useState(0);
  const flip = () => { setFrom(to); setTo(from); };
  const bridge = () => { setStep(1); window.setTimeout(() => { setStep(2); onNotice("Bridge route ready · review the details"); }, 600); };
  return <div className="dashboard"><PageHeader kicker="SATURDAY, SEP 05  ·  08:24 PM" title={<>A softer way to<br /><i>move forward.</i></>} copy="Good evening, Alex. Here’s the shape of your on-chain world." action={<button className="button button-light" onClick={() => onNotice("All systems are operational")}><ShieldCheck size={16} /> System calm</button>} /><div className="metric-grid"><Metric label="Total balance" value="$18,344.22" change="+8.2%" icon={Wallet} /><Metric label="Across networks" value="04" change="All connected" icon={Compass} /><Metric label="This month" value="$6,820" change="volume moved" icon={BarChart3} /><Metric label="Wellbeing streak" value="12 days" change="Keep showing up" icon={Sun} /></div><div className="dashboard-grid"><section className="panel bridge-panel"><div className="panel-heading"><div><span className="section-kicker">THE BRIDGE</span><h2>Move between worlds.</h2></div><span className="live-tag"><i /> Live routes</span></div><div className="bridge-form"><div className="network-field"><label>From</label><div className="network-select"><span className="chain-icon" style={{ background: from.color }}>{from.logo}</span><div><strong>{from.name}</strong><small>{from.balance}</small></div><select value={from.name} onChange={(e) => setFrom(networks.find((n) => n.name === e.target.value))}>{networks.map((network) => <option key={network.name}>{network.name}</option>)}</select><ChevronDown size={16} /></div></div><button className="swap-btn" onClick={flip} aria-label="Swap networks"><ArrowDownUp size={16} /></button><div className="network-field"><label>To</label><div className="network-select"><span className="chain-icon" style={{ background: to.color }}>{to.logo}</span><div><strong>{to.name}</strong><small>Receive on destination</small></div><select value={to.name} onChange={(e) => setTo(networks.find((n) => n.name === e.target.value))}>{networks.map((network) => <option key={network.name}>{network.name}</option>)}</select><ChevronDown size={16} /></div></div><div className="amount-field"><div><label>You send</label><div className="amount-input"><input value={amount} onChange={(e) => setAmount(e.target.value)} /><select value={asset.name} onChange={(e) => setAsset(assets.find((a) => a.name === e.target.value))}>{assets.map((item) => <option key={item.name}>{item.name}</option>)}</select></div></div><span className="available">Balance {asset.balance} {asset.name}</span></div><div className="route-summary"><div><span><Clock3 size={14} /> ~ 2 min</span><span><Zap size={14} /> $0.42 fee</span></div><span>1 {asset.name} = 1 {asset.name}</span></div><button className="button button-lime bridge-cta" onClick={bridge}>{step === 0 ? "Review bridge route" : step === 1 ? "Finding best route..." : "Route ready · Continue"} <ArrowRight size={17} /></button></div></section><section className="panel calm-panel"><div className="panel-heading"><div><span className="section-kicker">TODAY’S RESET</span><h2>Arrive as you are.</h2></div><span className="moon-icon"><Moon size={16} /></span></div><div className="calm-visual"><div className="calm-ring"><span>12</span><small>day streak</small></div><div className="orbit-label label-one">breathe</div><div className="orbit-label label-two">notice</div></div><p className="calm-copy">You’ve made space for yourself 12 days in a row. That is a kind of wealth too.</p><Link to="/journal" className="text-arrow">Open today’s journal <ArrowRight size={15} /></Link></section></div><section className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">RECENT MOVEMENT</span><h2>Your trail, at a glance.</h2></div><Link to="/coins" className="text-arrow">View all activity <ArrowRight size={15} /></Link></div><ActivityTable /></section></div>;
}

function Metric({ label, value, change, icon: Icon }) { return <div className="metric-card"><span className="metric-icon"><Icon size={16} /></span><span className="metric-label">{label}</span><strong>{value}</strong><small>{change}</small></div>; }

function ActivityTable() {
  return <div className="activity-list">{movements.slice(0, 3).map((item) => <div className="activity-row" key={item.hash}><span className={`activity-symbol ${item.type.toLowerCase()}`}>{item.type === "Bridge" ? <ArrowDownUp size={16} /> : <ArrowRight size={16} />}</span><div className="activity-main"><strong>{item.type} <span>{item.from} <ArrowRight size={11} /> {item.to}</span></strong><small>{item.time} · {item.hash}</small></div><strong className="activity-amount">{item.asset}</strong><span className="status-settled"><Check size={12} /> {item.status}</span><ExternalLink size={15} className="external" /></div>)}</div>;
}

function ChatPage() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hey Alex. I’m here. What’s taking up a little space in your head today?" }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const send = (text = input) => {
    if (!text.trim() || streaming) return;
    setInput(""); setStreaming(true);
    setMessages((items) => [...items, { role: "user", text }, { role: "assistant", text: "" }]);
    streamChat(text, (token) => setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, text: item.text + token } : item)), () => setStreaming(false));
  };
  return <div className="chat-page"><PageHeader kicker="ASK ZEN  ·  PRIVATE THREAD" title={<>A second mind,<br /><i>without the noise.</i></>} copy="A thoughtful place to untangle, reflect, and find your next small step." action={<button className="button button-light"><LockKeyhole size={15} /> Private thread</button>} /><div className="chat-layout"><aside className="thread-list panel"><div className="thread-header"><strong>Threads</strong><button className="icon-btn"><Plus size={17} /></button></div><div className="thread-search"><Search size={14} /><input placeholder="Search threads" /></div><div className="threads"><div className="thread active"><span className="thread-orb">✦</span><div><strong>Finding some clarity</strong><small>Today · 8:20 PM</small></div><MoreHorizontal size={15} /></div><div className="thread"><span className="thread-orb muted-orb">○</span><div><strong>The bridge & the breath</strong><small>Yesterday</small></div></div><div className="thread"><span className="thread-orb muted-orb">○</span><div><strong>What is enough?</strong><small>Aug 29</small></div></div></div><div className="thread-tip"><Sparkles size={15} /><p><strong>Zen tip</strong><br />You can ask me to help you notice patterns in your journal.</p></div></aside><section className="chat-window panel"><div className="chat-window-head"><div className="assistant-identity"><span className="assistant-avatar"><Sparkles size={17} /></span><div><strong>Zen</strong><small><i /> here with you</small></div></div><button className="icon-btn"><MoreHorizontal size={17} /></button></div><div className="messages">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}><span className="message-avatar">{message.role === "assistant" ? <Sparkles size={13} /> : "A"}</span><div><small>{message.role === "assistant" ? "ZEN · JUST NOW" : "YOU · JUST NOW"}</small><p>{message.text}{streaming && index === messages.length - 1 && <span className="typing-cursor">▋</span>}</p></div></div>)}</div><div className="suggestions"><span>Try asking</span><button onClick={() => send("I feel a little scattered today")}>I feel scattered</button><button onClick={() => send("Help me make a small plan")}>Make a small plan</button><button onClick={() => send("Give me a two-minute reset")}>Two-minute reset</button></div><form className="chat-composer" onSubmit={(e) => { e.preventDefault(); send(); }}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="What’s on your mind?" /><button aria-label="Send message" disabled={streaming}><Send size={17} /></button></form><div className="chat-disclaimer"><LockKeyhole size={12} /> Your thread is private · Zen is not a substitute for professional care</div></section></div></div>;
}

function JournalPage({ onNotice }) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("Grounded");
  const save = () => { if (!entry.trim()) return; setEntry(""); onNotice("Journal entry saved · a moment held"); };
  return <div><PageHeader kicker="FIELD NOTES  ·  PRIVATE BY DEFAULT" title={<>Notice what<br /><i>is becoming.</i></>} copy="A place to leave breadcrumbs for the person you’re becoming." action={<div className="streak-pill"><span>✦</span> 12 day streak</div>} /><div className="journal-grid"><section className="panel journal-compose"><div className="panel-heading"><div><span className="section-kicker">TODAY · SEP 05</span><h2>What’s present?</h2></div><span className="journal-date">SAT<br /><strong>05</strong></span></div><textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Start wherever you are..." /><div className="mood-row"><span>How are you arriving?</span>{["Grounded", "Clear", "Tender", "Restless"].map((item) => <button key={item} className={mood === item ? "selected" : ""} onClick={() => setMood(item)}><i className={`mood-dot mood-${item.toLowerCase()}`} /> {item}</button>)}</div><div className="compose-footer"><span><LockKeyhole size={13} /> Only you can see this</span><button className="button button-dark" onClick={save}>Save note <ArrowRight size={15} /></button></div></section><section className="panel reflection-panel"><span className="section-kicker">A SMALL REFLECTION</span><div className="reflection-quote">“</div><blockquote>What would become possible if you didn't need to solve everything today?</blockquote><span className="reflection-byline">A note from ZenHeaven</span><div className="reflection-art"><span /><span /><span /></div></section></div><section className="journal-history"><div className="panel-heading"><div><span className="section-kicker">YOUR THREAD</span><h2>Recent notes.</h2></div><button className="filter-btn">All moods <ChevronDown size={14} /></button></div><div className="journal-list">{journalEntries.map((item) => <article key={item.date} className="journal-entry"><span className="entry-date">{item.date}</span><span className="entry-marker" style={{ background: item.color }} /><div><h3>{item.title}</h3><p>{item.excerpt}</p></div><span className="mood-tag">{item.mood}</span><MoreHorizontal size={16} /></article>)}</div></section></div>;
}

function BooksPage() {
  const [query, setQuery] = useState("");
  const shown = books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div><PageHeader kicker="THE LIBRARY  ·  CURATED FOR CURIOSITY" title={<>Good ideas<br /><i>compound too.</i></>} copy="Books for the quiet hours, the uncertain seasons, and the long game." action={<button className="button button-light"><Library size={16} /> My shelf <span className="button-count">3</span></button>} /><div className="library-toolbar"><div className="tabs"><button className="active">For you</button><button>Mindset</button><button>Protocols</button><button>Practice</button></div><div className="search-field"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a book..." /></div></div><div className="book-grid">{shown.map((book) => <article className="book-card" key={book.title}><div className="book-cover" style={{ background: book.accent }}><span className="cover-logo">ZH</span><strong>{book.cover}</strong><small>ZENHEAVEN EDITION</small></div><div className="book-info"><span>{book.category}</span><h3>{book.title}</h3><p>{book.author}</p><button className="text-arrow">Save to shelf <Plus size={14} /></button></div></article>)}</div><div className="reading-note"><span className="reading-icon"><BookOpen size={17} /></span><div><span className="section-kicker">CURRENTLY READING</span><strong>How to Do Nothing <span>by Jenny Odell</span></strong></div><div className="reading-progress"><span /><small>42% complete</small></div><button className="button button-dark">Continue <ArrowRight size={15} /></button></div></div>;
}

function MusicPage() {
  const [playing, setPlaying] = useState(null);
  return <div><PageHeader kicker="SOUNDSCAPE  ·  PLAYLIST FOR THE PRESENT" title={<>Find your<br /><i>frequency.</i></>} copy="Music to meet the moment — whether you’re moving, making, or simply being." action={<button className="button button-light"><Headphones size={16} /> Connect device</button>} /><section className="music-hero"><div><span className="eyebrow"><span className="live-dot" /> Curated for your energy</span><h2>Slow mornings,<br /><i>soft focus.</i></h2><p>A 42 minute mix for starting without rushing.</p><button className="button button-dark" onClick={() => setPlaying(0)}>{playing === 0 ? <Pause size={15} /> : <Play size={15} fill="currentColor" />} {playing === 0 ? "Playing now" : "Play mix"}</button></div><div className="music-art"><div className="sound-circle circle-a" /><div className="sound-circle circle-b" /><div className="sound-circle circle-c" /><div className="art-note">♫</div></div></section><div className="music-heading"><div><span className="section-kicker">YOUR DAILY FREQUENCIES</span><h2>Made for right now.</h2></div><div className="mood-filters"><button className="active">All</button><button>Focus</button><button>Calm</button><button>Lift</button></div></div><div className="track-list">{tracks.map((track, index) => <div className={`track-row ${playing === index ? "is-playing" : ""}`} key={track.title}><button className="track-number" onClick={() => setPlaying(playing === index ? null : index)}>{playing === index ? <Pause size={14} /> : <span>0{index + 1}</span>}</button><span className="track-art" style={{ background: track.color }}>{playing === index ? <Music2 size={17} /> : <span>{track.title.slice(0, 1)}</span>}</span><div className="track-title"><strong>{track.title}</strong><small>{track.artist}</small></div><span className="track-mood">{track.mood}</span><span className="track-duration">{track.duration}</span><button className="icon-btn"><MoreHorizontal size={16} /></button></div>)}</div><div className="now-playing"><span className="equalizer"><i /><i /><i /><i /></span><div><strong>{playing !== null ? tracks[playing].title : "Nothing playing"}</strong><small>{playing !== null ? tracks[playing].artist : "Choose a track to begin"}</small></div><div className="player-controls"><button className="icon-btn"><ArrowDownUp size={14} /></button><button className="play-btn" onClick={() => setPlaying(playing === null ? 0 : null)}>{playing === null ? <Play size={15} fill="currentColor" /> : <Pause size={15} />}</button><button className="icon-btn"><MoreHorizontal size={16} /></button></div><div className="volume"><span /><span /><span /><span /><span /></div></div></div>;
}

function TherapistsPage({ onNotice }) {
  return <div><PageHeader kicker="THE GUIDE ROOM  ·  HUMAN SUPPORT" title={<>You don’t have<br /><i>to hold it alone.</i></>} copy="Licensed, thoughtful humans for the moments that benefit from a little company." action={<button className="button button-lime" onClick={() => onNotice("Tell us what kind of support you need")}><Sparkles size={16} /> Find my match</button>} /><div className="support-banner"><div className="support-symbol"><HeartShape /></div><div><span className="section-kicker">A NOTE ON SUPPORT</span><h3>Asking for help is a form of self-trust.</h3><p>Every guide here is vetted, licensed, and trained to meet you where you are — including the intersection of mental wellbeing and digital life.</p></div><ArrowRight size={18} /></div><div className="therapist-heading"><div><span className="section-kicker">AVAILABLE GUIDES</span><h2>Find your person.</h2></div><div className="search-field"><Search size={15} /><input placeholder="Search by specialty..." /></div></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist.name}><div className="therapist-top"><span className="therapist-avatar" style={{ background: therapist.color }}>{therapist.initials}</span><button className="icon-btn"><MoreHorizontal size={16} /></button></div><span className="available-label"><i /> Available this week</span><h3>{therapist.name}</h3><p>{therapist.role}</p><div className="therapist-meta"><span><Clock3 size={14} /> {therapist.next}</span><span>{therapist.rate}</span></div><button className="button button-outline" onClick={() => onNotice(`Request sent to ${therapist.name}`)}>View profile <ArrowRight size={15} /></button></article>)}</div><div className="emergency-note"><ShieldCheck size={18} /><p><strong>Need immediate support?</strong> ZenHeaven is not an emergency service. If you’re in danger, contact your local emergency services or a crisis line in your region.</p><a href="https://findahelpline.com/" target="_blank" rel="noreferrer">Find a helpline <ExternalLink size={13} /></a></div></div>;
}

function HeartShape() { return <span className="heart-shape">♡</span>; }

function CoinsPage() {
  const [active, setActive] = useState("All assets");
  return <div><PageHeader kicker="ASSETS  ·  YOUR ON-CHAIN HOME" title={<>Know what you<br /><i>hold lightly.</i></>} copy="A clear view of your value, across every network you call home." action={<button className="button button-dark"><Plus size={16} /> Add asset</button>} /><div className="portfolio-total panel"><div><span className="section-kicker">TOTAL PORTFOLIO VALUE</span><div className="big-balance">$18,344<span>.22</span></div><span className="balance-change"><MoveUpRight size={14} /> $1,384.10 (8.16%) this month</span></div><div className="portfolio-chart"><svg viewBox="0 0 420 110" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d5ff3f" stopOpacity=".25" /><stop offset="1" stopColor="#d5ff3f" stopOpacity="0" /></linearGradient></defs><path d="M0,85 C25,80 35,70 55,74 S92,53 112,62 S150,45 170,51 S202,20 226,39 S260,51 280,30 S312,42 330,25 S367,30 389,14 S410,17 420,5 V110 H0 Z" fill="url(#chartFill)" /><path d="M0,85 C25,80 35,70 55,74 S92,53 112,62 S150,45 170,51 S202,20 226,39 S260,51 280,30 S312,42 330,25 S367,30 389,14 S410,17 420,5" fill="none" stroke="#d5ff3f" strokeWidth="2.5" /></svg><div className="chart-labels"><span>Aug 05</span><span>Aug 19</span><span>Sep 05</span></div></div></div><div className="asset-toolbar"><div className="tabs">{["All assets", "Ethereum", "Arbitrum", "Base"].map((tab) => <button className={active === tab ? "active" : ""} key={tab} onClick={() => setActive(tab)}>{tab}</button>)}</div><button className="filter-btn"><ArrowDownUp size={14} /> Sort: Value <ChevronDown size={14} /></button></div><div className="assets-table panel"><div className="asset-table-head"><span>Asset</span><span>Balance</span><span>Price</span><span>Allocation</span><span /></div>{assets.map((asset, index) => <div className="asset-row" key={asset.name}><div className="asset-name"><span className="asset-coin" style={{ background: asset.color }}>{asset.name === "USDC" ? "$" : asset.name === "ETH" ? "◆" : "₿"}</span><div><strong>{asset.name}</strong><small>{asset.label}</small></div></div><strong>{asset.balance}</strong><span>{asset.usd}</span><div className="allocation"><span><i style={{ width: `${[58, 27, 15][index]}%` }} /></span><small>{[58, 27, 15][index]}%</small></div><button className="icon-btn"><MoreHorizontal size={16} /></button></div>)}</div><div className="movement-section"><div className="panel-heading"><div><span className="section-kicker">MOVEMENT LOG</span><h2>Everything leaves a trace.</h2></div><button className="filter-btn">Last 30 days <ChevronDown size={14} /></button></div><div className="assets-movements panel"><ActivityTable /></div></div></div>;
}

export default App;
