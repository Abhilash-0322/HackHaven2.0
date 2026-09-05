import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleDollarSign, Clock3, Headphones,
  Heart, Home, Leaf, LockKeyhole, LogIn, Menu, MessageCircle, Moon, Play, Search, Send, Sparkles,
  Star, Stethoscope, Sun, Trophy, UserRound, WandSparkles, X, Zap,
} from 'lucide-react'
import { api, demoBooks, demoSongs, demoTherapists, demoUser, streamChat } from './api'
import './styles.css'

const navItems = [
  { to: '/dashboard', label: 'Pulse', icon: Home },
  { to: '/chat', label: 'CalmBot', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Reads', icon: Brain },
  { to: '/music', label: 'Sound', icon: Headphones },
  { to: '/therapists', label: 'Care', icon: Stethoscope },
  { to: '/coins', label: 'Coins', icon: CircleDollarSign },
]

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zen_user') || 'null'))
  const [toast, setToast] = useState('')
  const login = (nextUser, token = 'demo-token') => {
    localStorage.setItem('zen_user', JSON.stringify(nextUser))
    localStorage.setItem('zen_token', token)
    setUser(nextUser)
  }
  const logout = () => {
    localStorage.removeItem('zen_user')
    localStorage.removeItem('zen_token')
    setUser(null)
  }
  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" onAuth={login} notify={notify} />} />
        <Route path="/register" element={<AuthPage mode="register" onAuth={login} notify={notify} />} />
        <Route element={<AppShell user={user} onLogout={logout} />}>
          <Route path="/dashboard" element={<Dashboard user={user || demoUser} />} />
          <Route path="/chat" element={<Chat user={user || demoUser} notify={notify} />} />
          <Route path="/journal" element={<Journal notify={notify} />} />
          <Route path="/books" element={<Books notify={notify} />} />
          <Route path="/music" element={<Music notify={notify} />} />
          <Route path="/therapists" element={<Therapists user={user || demoUser} notify={notify} />} />
          <Route path="/coins" element={<Coins notify={notify} />} />
        </Route>
      </Routes>
      {toast && <div className="toast"><Check size={15} /> {toast}</div>}
    </BrowserRouter>
  )
}

function Logo({ light = false }) {
  return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`}><span className="logo-mark"><Zap size={17} fill="currentColor" /></span><span>ZEN<span className="text-neon">HEAVEN</span></span></Link>
}

function Landing() {
  const navigate = useNavigate()
  return (
    <main className="landing">
      <nav className="landing-nav page-wrap">
        <Logo light />
        <div className="nav-actions">
          <Link to="/login" className="button button-ghost">Sign in</Link>
          <Link to="/register" className="button button-primary">Start free <ArrowRight size={15} /></Link>
        </div>
      </nav>
      <section className="hero page-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> your next calm state is loading</div>
          <h1>Feel better.<br /><span>Faster.</span></h1>
          <p className="hero-sub">ZenHeaven is your always-on mental wellness layer — a supportive AI, honest journaling, and the right human care when you need it.</p>
          <div className="hero-actions">
            <button className="button button-primary button-large" onClick={() => navigate('/register')}>Enter your flow <ArrowRight size={18} /></button>
            <a className="text-link" href="#signal">See how it works <ChevronRight size={15} /></a>
          </div>
          <div className="hero-meta"><span><Check size={13} /> no judgment</span><span><Check size={13} /> private by design</span><span><Check size={13} /> always here</span></div>
        </div>
        <div className="hero-visual">
          <div className="orbital orbital-one" /><div className="orbital orbital-two" />
          <div className="hero-card glass-card">
            <div className="card-topline"><span className="mono-label">LIVE / 01</span><span className="status-pill"><span className="live-dot" /> online</span></div>
            <div className="signal-icon"><Brain size={28} /></div>
            <span className="mono-label">CURRENT SIGNAL</span>
            <h3>Quietly becoming<br /><span>more you.</span></h3>
            <div className="signal-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="card-foot"><span>your pace</span><span className="text-neon">87% aligned</span></div>
          </div>
          <div className="floating-chip chip-top"><Sparkles size={14} /> gentle progress</div>
          <div className="floating-chip chip-bottom"><Leaf size={14} /> safe space</div>
        </div>
      </section>
      <section className="signal-section page-wrap" id="signal">
        <div className="section-kicker">ONE SIGNAL. MANY WAYS IN.</div>
        <div className="feature-grid">
          <Feature icon={MessageCircle} number="01" title="Talk it out" copy="A calm, context-aware chat that meets you where you are." color="purple" />
          <Feature icon={BookOpen} number="02" title="Make space" copy="Turn the noise into a journal entry, mood insight, or tiny win." color="green" />
          <Feature icon={Stethoscope} number="03" title="Go human" copy="Find qualified therapists when support needs a deeper layer." color="orange" />
        </div>
      </section>
      <footer className="landing-footer page-wrap"><Logo light /><span>built for the in-between moments.</span><span className="mono-label">ZH / 2025</span></footer>
    </main>
  )
}

function Feature({ icon: Icon, number, title, copy, color }) {
  return <div className={`feature-card feature-${color}`}><div className="feature-icon"><Icon size={21} /></div><span className="mono-label">{number}</span><h3>{title}</h3><p>{copy}</p><ArrowRight size={16} className="feature-arrow" /></div>
}

function AppShell({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const active = navItems.find((item) => location.pathname.startsWith(item.to))
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="side-brand"><Logo /><button className="mobile-close" onClick={() => setOpen(false)}><X size={19} /></button></div>
        <div className="workspace-label mono-label">YOUR WELLNESS OS</div>
        <nav className="side-nav">
          {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{label === 'CalmBot' && <span className="new-badge">AI</span>}</NavLink>)}
        </nav>
        <div className="side-bottom">
          <div className="side-prompt"><Sparkles size={16} className="text-neon" /><p>Small steps<br /><strong>count here.</strong></p></div>
          {user ? <button className="account-chip" onClick={onLogout}><span className="avatar">{(user.full_name || user.username || 'Z')[0]}</span><span><strong>{user.full_name || user.username}</strong><small>Sign out</small></span><LogIn size={14} /></button> : <Link to="/login" className="account-chip"><span className="avatar"><UserRound size={15} /></span><span><strong>Guest mode</strong><small>Sign in</small></span><LogIn size={14} /></Link>}
        </div>
      </aside>
      <div className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}><Menu size={21} /></button>
          <div><span className="mono-label">ZENHEAVEN / </span><span className="topbar-current">{active?.label || 'Pulse'}</span></div>
          <div className="topbar-right"><span className="connection"><span className="live-dot" /> systems nominal</span><Link to="/coins" className="coin-balance"><CircleDollarSign size={15} /> {user?.calm_coins ?? 248}</Link></div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}

function PageIntro({ kicker, title, copy, action }) {
  return <div className="page-intro"><div><div className="section-kicker">{kicker}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user.calm_coins || 248)
  const [goals, setGoals] = useState([])
  useEffect(() => { api.balance().then((data) => setBalance(data.balance)).catch(() => {}); api.dailyGoals().then(setGoals).catch(() => {}) }, [])
  const displayGoals = goals.length ? goals : [{ title: 'Chat with CalmBot', current: 1, target: 1, coins: 5, completed: true }, { title: 'Write in Journal', current: 0, target: 1, coins: 15, completed: false }, { title: 'Take a mood check', current: 0, target: 1, coins: 5, completed: false }]
  return <div className="dashboard">
    <PageIntro kicker="SATURDAY / SEPT 05" title={<>Good evening, <span className="text-neon">{(user.full_name || 'friend').split(' ')[0]}.</span></>} copy="A little check-in can change the shape of your whole day." action={<div className="streak-chip"><Sun size={17} /><span><strong>04</strong> day flow</span></div>} />
    <div className="dashboard-grid">
      <section className="welcome-card panel-card"><div className="card-topline"><span className="mono-label">YOUR DAILY SIGNAL</span><span className="signal-status">● IN RANGE</span></div><div className="welcome-main"><div><span className="mood-orb"><Moon size={25} /></span><h2>Make room<br />for <span>ease.</span></h2><p>Even one honest minute counts as movement.</p><Link to="/journal" className="text-link">Start a check-in <ArrowRight size={15} /></Link></div><div className="mini-chart"><div className="chart-label"><span>WEEKLY FLOW</span><strong>+24%</strong></div><div className="bars">{[35, 48, 42, 70, 56, 82, 68].map((height, i) => <i key={i} style={{ height: `${height}%` }} className={i === 5 ? 'bar-active' : ''} />)}</div><div className="chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div></div></section>
      <section className="coin-card panel-card"><div className="card-topline"><span className="mono-label">CALM COINS</span><CircleDollarSign size={17} className="text-neon" /></div><div className="coin-number">{balance}<small>cc</small></div><p>Earned through showing up for yourself.</p><Link to="/coins" className="text-link">View rewards <ArrowRight size={15} /></Link></section>
      <section className="goals-card panel-card"><div className="card-topline"><span className="mono-label">TODAY'S MICRO-WINS</span><span className="mono-label">{displayGoals.filter((goal) => goal.completed).length}/{displayGoals.length}</span></div><div className="goal-list">{displayGoals.map((goal, i) => <div className={`goal-row ${goal.completed ? 'goal-done' : ''}`} key={goal.id || i}><span className="goal-check">{goal.completed && <Check size={12} />}</span><span>{goal.title}</span><span className="goal-coins">+{goal.coins}</span></div>)}</div><Link to="/coins" className="text-link">See all goals <ArrowRight size={15} /></Link></section>
      <section className="quick-card panel-card"><div className="section-kicker">QUICK ACCESS</div><div className="quick-grid"><QuickLink to="/chat" icon={MessageCircle} label="Talk to CalmBot" /><QuickLink to="/music" icon={Headphones} label="Find a sound" /><QuickLink to="/books" icon={Brain} label="Read something" /><QuickLink to="/therapists" icon={Stethoscope} label="Find a human" /></div></section>
    </div>
  </div>
}

function QuickLink({ to, icon: Icon, label }) {
  return <Link to={to} className="quick-link"><span><Icon size={17} /></span>{label}<ArrowRight size={14} /></Link>
}

function AuthPage({ mode, onAuth, notify }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const result = await (isRegister ? api.register(form) : api.login({ username: form.username, password: form.password }))
      onAuth(result.user, result.access_token); navigate('/dashboard')
    } catch (err) {
      if (isRegister || !form.username) { setError(err.message); setLoading(false); return }
      onAuth({ ...demoUser, username: form.username }, 'demo-token'); notify('Demo mode active — connect your API to sync data'); navigate('/dashboard')
    }
  }
  return <main className="auth-page"><div className="auth-side"><Logo light /><div className="auth-side-copy"><span className="eyebrow"><span className="live-dot" /> your space is ready</span><h1>Take a breath.<br /><span>Then begin.</span></h1><p>There’s no perfect way to feel. ZenHeaven gives you a private place to notice what’s real and find your next small step.</p></div><span className="mono-label">ZH / YOUR PACE, YOUR SPACE</span></div><div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowRight size={15} className="rotate-180" /> back home</Link><div className="auth-form"><div className="section-kicker">{isRegister ? 'CREATE YOUR SPACE' : 'WELCOME BACK'}</div><h2>{isRegister ? 'Start your flow.' : 'Re-enter the quiet.'}</h2><p className="form-copy">{isRegister ? 'A softer dashboard is a few seconds away.' : 'Your tools, thoughts, and progress are waiting.'}</p><form onSubmit={submit}>{isRegister && <label>YOUR NAME<input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="How should we call you?" /></label>}<label>USERNAME<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="flow_state" /></label>{isRegister && <label>EMAIL<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>PASSWORD<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-primary button-full" disabled={loading}>{loading ? 'connecting...' : isRegister ? <>Create my space <ArrowRight size={16} /></> : <>Enter ZenHeaven <LogIn size={16} /></>}</button></form><div className="auth-switch">{isRegister ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></div><div className="privacy-note"><LockKeyhole size={13} /> your data stays yours</div></div></div></main>
}

function Chat({ user, notify }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', content: `Hey ${user.full_name?.split(' ')[0] || 'there'}. I’m here. What’s taking up the most space in your mind right now?` }])
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  useEffect(() => { api.threads().then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const send = async (event) => {
    event?.preventDefault()
    const clean = message.trim()
    if (!clean || thinking) return
    setMessage(''); setMessages((current) => [...current, { role: 'user', content: clean }]); setThinking(true); setStreamingText('')
    try {
      await streamChat(clean, threadId, (eventData) => {
        if (eventData.type === 'thread_id') setThreadId(eventData.data)
        if (eventData.type === 'token') setStreamingText((text) => text + eventData.data)
        if (eventData.type === 'complete') { setMessages((current) => [...current, { role: 'assistant', content: streamingText || 'You showed up for this moment. That matters. Try naming the feeling without needing to solve it immediately.' }]); setStreamingText(''); setThinking(false) }
        if (eventData.type === 'error') throw new Error(eventData.data)
      })
      setThinking(false)
    } catch {
      const fallback = clean.toLowerCase().includes('anxious') ? 'Let’s slow the moment down together. Try one longer exhale than inhale, then name three things you can see around you. You do not have to solve the whole day at once.' : 'That sounds like a lot to carry. I’m glad you put it into words. What would feel like the kindest next five minutes?'
      window.setTimeout(() => { setMessages((current) => [...current, { role: 'assistant', content: fallback }]); setThinking(false) }, 450)
      notify('Using local support mode — your API can bring the full CalmBot online')
    }
  }
  return <div className="chat-page"><PageIntro kicker="CALMBOT / ALWAYS ON" title={<>A little more <span className="text-purple">space.</span></>} copy="Talk freely. No fixing, no performing — just a place to put it down." action={<div className="bot-status"><span className="live-dot" /> listening</div>} /><div className="chat-layout"><aside className="thread-panel panel-card"><div className="card-topline"><span className="mono-label">CONVERSATIONS</span><button className="icon-button" onClick={() => { setThreadId(null); setMessages([{ role: 'assistant', content: 'Fresh page. What’s present for you right now?' }]) }}><Sparkles size={15} /></button></div>{threads.length ? threads.map((thread) => <button className="thread-row" key={thread.id} onClick={() => api.thread(thread.id).then((data) => { setThreadId(thread.id); setMessages((data.messages || []).map((m) => ({ role: m.is_user ? 'user' : 'assistant', content: m.content }))) }).catch(() => {})}><MessageCircle size={14} /><span>{thread.title}</span></button>) : <div className="empty-thread"><MessageCircle size={19} /><p>Your conversations<br />will land here.</p></div>}<div className="thread-tip"><Sparkles size={14} /><span>Every honest message<br />earns <strong>+5 calm coins</strong></span></div></aside><section className="chat-window panel-card"><div className="chat-header"><div className="bot-avatar"><Brain size={18} /></div><div><strong>CalmBot</strong><small>empathetic AI support</small></div><span className="chat-encrypted"><LockKeyhole size={12} /> private</span></div><div className="messages">{messages.map((item, index) => <div className={`message-row ${item.role}`} key={index}><div className="message">{item.content}</div>{item.role === 'assistant' && <span className="message-time">CALMBOT / NOW</span>}</div>)}{thinking && <div className="message-row assistant"><div className="message thinking"><i /><i /><i /></div>{streamingText && <div className="stream-copy">{streamingText}</div>}</div>}</div><div className="chat-safety">CalmBot is supportive, not a replacement for professional care. If you’re in immediate danger, contact local emergency services.</div><form className="chat-composer" onSubmit={send}><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type what’s on your mind..." /><button aria-label="Send message" className="send-button" disabled={thinking}><Send size={17} /></button></form></section></div></div>
}

function Journal({ notify }) {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saving, setSaving] = useState(false)
  const moods = ['calm', 'hopeful', 'anxious', 'tired', 'grateful']
  useEffect(() => { api.journalEntries().then(setEntries).catch(() => {}); api.journalPrompts().then(setPrompts).catch(() => {}) }, [])
  const save = async (event) => {
    event.preventDefault(); if (!content.trim()) return
    setSaving(true)
    const local = { _id: `local-${Date.now()}`, title: content.trim().split(' ').slice(0, 5).join(' '), content, mood, created_at: new Date().toISOString() }
    try { const result = await api.createJournal({ content, mood, tags: [] }); setEntries((current) => [result, ...current]) } catch { setEntries((current) => [local, ...current]); notify('Saved locally — connect your API to sync your journal') }
    setContent(''); setSaving(false); notify('+10 calm coins · check-in saved')
  }
  const promptList = prompts.length ? prompts : [{ prompt: 'What made you smile today?', category: 'gratitude' }, { prompt: 'What is one small win you had today?', category: 'achievements' }, { prompt: 'Describe a moment of calm you experienced recently.', category: 'mindfulness' }]
  return <div className="journal-page"><PageIntro kicker="JOURNAL / MAKE SPACE" title={<>Put it <span className="text-neon">down.</span></>} copy="A private log for the thoughts that deserve somewhere to land." action={<div className="journal-count"><BookOpen size={16} /> {entries.length} entries</div>} /><div className="journal-layout"><section className="journal-editor panel-card"><div className="card-topline"><span className="mono-label">NEW ENTRY / {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}</span><span className="autosave"><span className="live-dot" /> autosave on</span></div><form onSubmit={save}><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start wherever you are..." /><div className="mood-picker"><span className="mono-label">HOW ARE YOU FEELING?</span><div>{moods.map((item) => <button type="button" className={mood === item ? 'selected' : ''} key={item} onClick={() => setMood(item)}>{item}</button>)}</div></div><button className="button button-primary" disabled={saving || !content.trim()}>{saving ? 'saving...' : <>Save this moment <ArrowRight size={15} /></>}</button></form></section><aside className="prompt-panel panel-card"><div className="section-kicker">PROMPT DECK</div><h3>Need a way in?</h3>{promptList.slice(0, 3).map((item, index) => <button className="prompt-row" key={index} onClick={() => setContent(item.prompt)}><span className="prompt-number">0{index + 1}</span><span>{item.prompt}</span><ArrowRight size={14} /></button>)}<div className="prompt-footer"><WandSparkles size={15} /> prompts shift with your practice</div></aside></div><section className="entry-history"><div className="section-kicker">RECENT SIGNALS</div>{entries.length ? <div className="entry-grid">{entries.slice(0, 6).map((entry) => <article className="entry-card panel-card" key={entry._id || entry.id}><div className="entry-head"><span className={`mood-tag mood-${entry.mood}`}>{entry.mood || 'reflection'}</span><span className="mono-label">{new Date(entry.created_at || Date.now()).toLocaleDateString()}</span></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p><ChevronRight size={15} /></article>)}</div> : <div className="empty-state panel-card"><BookOpen size={20} /><p>Your entries will appear here.<br /><span>There is no wrong way to begin.</span></p></div>}</section></div>
}

function Books({ notify }) {
  const [books, setBooks] = useState(demoBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const result = await api.searchBooks(query); setBooks(result.books || []) } catch { setBooks(demoBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))); notify('Showing your starter shelf') } }
  useEffect(() => { api.booksByMood().then((data) => { setMood(data.mood); if (data.books?.length) setBooks(data.books) }).catch(() => {}) }, [])
  return <div className="books-page"><PageIntro kicker="READS / YOUR HEADSPACE" title={<>A good book<br /><span className="text-purple">changes the room.</span></>} copy={`Picked for your ${mood} state — because what you take in matters.`} action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the shelf..." /></form>} /><div className="recommend-banner"><div><div className="section-kicker">MOOD-MATCHED FOR YOU</div><h3>Read something that meets you gently.</h3></div><div className="recommend-mark"><Brain size={25} /></div></div><div className="book-grid">{books.slice(0, 8).map((book, index) => <article className="book-card" key={book.id || index}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <div className="cover-fallback"><BookOpen size={26} /><span>ZH READS</span></div>}<span className="book-index">0{index + 1}</span></div><div className="book-info"><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p><small>{book.description || 'A new perspective for your next chapter.'}</small><button className="text-link">Open recommendation <ArrowRight size={14} /></button></div></article>)}</div></div>
}

function Music({ notify }) {
  const [songs, setSongs] = useState(demoSongs)
  const [selected, setSelected] = useState(demoSongs[0])
  const [playing, setPlaying] = useState(false)
  const [search, setSearch] = useState('')
  const find = async (event) => { event.preventDefault(); try { const data = await api.recommendations(search || selected.name); setSongs(data.recommendations?.length ? data.recommendations : demoSongs) } catch { setSongs(demoSongs); notify('Your offline soundscape is ready') } }
  useEffect(() => { api.songs().then((data) => { if (data.songs?.length) setSearch(data.songs[0]) }).catch(() => {}) }, [])
  return <div className="music-page"><PageIntro kicker="SOUND / CHANGE THE FREQUENCY" title={<>Find your <span className="text-neon">signal.</span></>} copy="Music for wherever your nervous system is today." action={<div className="now-playing-chip"><span className="equalizer"><i /><i /><i /></span> {playing ? 'playing now' : 'ready when you are'}</div>} /><div className="music-hero panel-card"><div className="music-art" style={{ backgroundImage: `url(${selected.album_cover_url})` }}><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ' : <Play size={24} fill="currentColor" />}</button></div><div className="music-copy"><div className="section-kicker">YOUR RESET TRACK</div><h2>{selected.name}</h2><p>{selected.artist}</p><div className="waveform">{Array.from({ length: 40 }).map((_, i) => <i key={i} style={{ height: `${18 + ((i * 17) % 45)}%` }} />)}</div><div className="music-controls"><span>0:00</span><div className="progress"><i /></div><span>4:12</span></div><a className="text-link" href={selected.spotify_uri?.startsWith('spotify:') ? 'https://open.spotify.com' : selected.spotify_uri} target="_blank" rel="noreferrer">open in Spotify <ArrowRight size={14} /></a></div></div><form className="music-search" onSubmit={find}><div><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter a song you love..." /></div><button className="button button-primary">Build my flow <Sparkles size={15} /></button></form><div className="section-kicker">RECOMMENDED AROUND THIS FREQUENCY</div><div className="song-list">{songs.slice(0, 6).map((song, index) => <button className={`song-row ${selected.name === song.name ? 'song-active' : ''}`} key={song.name + index} onClick={() => { setSelected(song); setPlaying(true) }}><span className="song-num">{String(index + 1).padStart(2, '0')}</span><span className="song-thumb" style={{ backgroundImage: `url(${song.album_cover_url})` }} /><span className="song-details"><strong>{song.name}</strong><small>{song.artist}</small></span><span className="song-duration">3:{String(12 + index * 7).padStart(2, '0')}</span><Play size={15} /></button>)}</div></div>
}

function Therapists({ user, notify }) {
  const [therapists, setTherapists] = useState(demoTherapists)
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(false)
  useEffect(() => { api.therapists().then((data) => { if (data?.length) setTherapists(data) }).catch(() => {}) }, [])
  const book = async () => { if (!selected) return; setBooking(true); const date = new Date(Date.now() + 86400000); const payload = { user_id: user.id, therapist_id: selected._id || selected.id, date: date.toISOString(), start_time: date.toISOString(), end_time: new Date(date.getTime() + 3600000).toISOString(), session_type: 'video' }; try { await api.bookAppointment(payload); notify('Session requested — we’ll see you there') } catch { notify('Demo booking saved — connect your API to confirm') } setBooking(false); setSelected(null) }
  return <div className="therapists-page"><PageIntro kicker="CARE / GO DEEPER" title={<>Human support,<br /><span className="text-orange">when you’re ready.</span></>} copy="Licensed professionals. Real listening. A next step that feels like yours." action={<div className="verified-chip"><Check size={14} /> all practitioners verified</div>} /><div className="care-note panel-card"><div className="care-note-icon"><Heart size={19} /></div><div><strong>You don’t need to be in crisis to ask for care.</strong><p>Therapy can be a place to understand yourself before things feel urgent.</p></div></div><div className="therapist-filters"><span className="mono-label">MATCHED TO YOUR NEED</span><button className="filter-active">All practitioners</button><button>Anxiety & stress</button><button>Relationships</button><button>Life changes</button></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card panel-card" key={therapist._id || therapist.id}><div className="therapist-avatar"><UserRound size={29} /></div><div className="therapist-meta"><span className="verified"><Check size={11} /> verified</span><span className="rating"><Star size={12} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><h3>{therapist.name}</h3><p className="therapist-focus">{(therapist.specializations || []).join(' · ')}</p><p className="therapist-bio">{therapist.bio}</p><div className="therapist-foot"><span><Clock3 size={14} /> {therapist.experience_years} yrs</span><strong>${therapist.hourly_rate}<small>/ session</small></strong></div><button className="button button-outline button-full" onClick={() => setSelected(therapist)}>View availability <ArrowRight size={15} /></button></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="booking-modal panel-card" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button><div className="section-kicker">SESSION REQUEST</div><h2>Meet {selected.name.split(',')[0]}.</h2><p className="form-copy">Choose a simple starting point. Your first session can just be a conversation about what’s been going on.</p><div className="time-options"><button className="time-option selected"><CalendarDays size={16} /><span><strong>Tomorrow</strong><small>09:00 — 10:00</small></span><Check size={15} /></button><button className="time-option"><CalendarDays size={16} /><span><strong>Next available</strong><small>Monday, 14:00 — 15:00</small></span></button></div><button className="button button-primary button-full" onClick={book} disabled={booking}>{booking ? 'requesting...' : <>Request video session <ArrowRight size={15} /></>}</button><span className="modal-note"><LockKeyhole size={12} /> no commitment until confirmed</span></div></div>}</div>
}

function Coins({ notify }) {
  const [balance, setBalance] = useState(248)
  const [transactions, setTransactions] = useState([])
  const [achievements, setAchievements] = useState([])
  useEffect(() => { api.balance().then((data) => setBalance(data.balance)).catch(() => {}); api.transactions().then(setTransactions).catch(() => {}); api.achievements().then(setAchievements).catch(() => {}) }, [])
  const txns = transactions.length ? transactions : [{ amount: 15, description: 'Journal check-in', source: 'journal', timestamp: new Date().toISOString() }, { amount: 5, description: 'CalmBot conversation', source: 'mental_health_chat', timestamp: new Date(Date.now() - 86400000).toISOString() }, { amount: 50, description: 'Welcome to ZenHeaven', source: 'welcome', timestamp: new Date(Date.now() - 172800000).toISOString() }]
  const badges = achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental health journey', unlocked: true, coins: 50 }, { title: 'Consistent chatter', description: 'Chat for 7 days in a row', unlocked: false, coins: 100 }, { title: 'Wellness warrior', description: 'Earn 1000 total coins', unlocked: false, coins: 300 }]
  return <div className="coins-page"><PageIntro kicker="CALM COINS / YOUR ENERGY" title={<>Progress you can <span className="text-neon">feel.</span></>} copy="Every tiny act of care adds up. Spend it on deeper support when you’re ready." action={<div className="coin-balance-large"><CircleDollarSign size={17} /> {balance} CC</div>} /><div className="coins-layout"><section className="balance-card panel-card"><div className="card-topline"><span className="mono-label">CURRENT BALANCE</span><span className="status-pill">active</span></div><div className="big-balance">{balance}<small>calm coins</small></div><div className="balance-progress"><div style={{ width: `${Math.min((balance / 500) * 100, 100)}%` }} /></div><div className="balance-foot"><span>next reward: <strong>500 CC</strong></span><span>{500 - balance} to go</span></div><Link to="/journal" className="button button-primary">Earn more coins <ArrowRight size={15} /></Link></section><section className="earn-card panel-card"><div className="section-kicker">HOW TO EARN</div><EarnRow icon={MessageCircle} label="Talk with CalmBot" coins="+5" to="/chat" /><EarnRow icon={BookOpen} label="Write a journal entry" coins="+10" to="/journal" /><EarnRow icon={Heart} label="Complete a mood check" coins="+5" to="/journal" /><EarnRow icon={CalendarDays} label="Book a care session" coins="+50" to="/therapists" /></section></div><div className="coins-lower"><section><div className="section-kicker">RECENT ACTIVITY</div><div className="transaction-list panel-card">{txns.slice(0, 5).map((txn, i) => <div className="transaction-row" key={txn._id || i}><span className="transaction-icon"><Zap size={15} /></span><span><strong>{txn.description}</strong><small>{txn.source} · {new Date(txn.timestamp).toLocaleDateString()}</small></span><b>+{txn.amount}</b></div>)}</div></section><section><div className="section-kicker">MILESTONES</div><div className="achievement-list">{badges.map((badge, i) => <div className={`achievement-row panel-card ${badge.unlocked ? 'unlocked' : ''}`} key={badge.id || i}><span className="achievement-icon">{badge.unlocked ? <Trophy size={17} /> : <LockKeyhole size={16} />}</span><span><strong>{badge.title}</strong><small>{badge.description}</small></span><b>{badge.coins}</b></div>)}</div></section></div></div>
}

function EarnRow({ icon: Icon, label, coins, to }) {
  return <Link className="earn-row" to={to}><span className="earn-icon"><Icon size={16} /></span><span>{label}</span><strong>{coins}</strong><ChevronRight size={14} /></Link>
}

createRoot(document.getElementById('root')).render(<App />)
