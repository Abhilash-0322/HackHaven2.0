import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight, BookOpen, Check, ChevronRight, Coins, Headphones, Heart, Image,
  Leaf, LoaderCircle, LogIn, LogOut, Menu, MessageCircle, MoreHorizontal, PenLine,
  Play, Plus, Search, Send, Sparkles, Star, Users, X,
} from 'lucide-react'
import './index.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const navItems = [
  { to: '/dashboard', label: 'Gallery', icon: Image },
  { to: '/chat', label: 'CalmBot', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Sound room', icon: Headphones },
  { to: '/therapists', label: 'Therapists', icon: Users },
  { to: '/coins', label: 'Calm coins', icon: Coins },
]

const artWorks = [
  { title: 'Blue hour / 02', artist: 'Nina Ito', medium: 'Digital collage', image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=1200&q=85', accent: 'cobalt' },
  { title: 'The quiet between', artist: 'Ava Mahmoud', medium: 'Motion still', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85', accent: 'coral' },
  { title: 'Soft architecture', artist: 'Milo Park', medium: 'Generative art', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85', accent: 'acid' },
]

const fallbackBooks = [
  { id: '1', title: 'The Book of Delights', author: 'Ross Gay', description: 'A daily practice of noticing the small, vivid things that keep us here.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80' },
  { id: '2', title: 'Wintering', author: 'Katherine May', description: 'The quiet art of rest and retreat in difficult seasons.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
  { id: '3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', description: 'Wisdom, science, and a generous way of seeing the natural world.', image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80' },
]

const fallbackTracks = [
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80' },
  { name: 'A Calf Born in Winter', artist: 'Khruangbin', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80' },
  { name: 'Near Light', artist: 'Ólafur Arnalds', album_cover_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=500&q=80' },
]

const fallbackTherapists = [
  { _id: 'sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80', bio: 'Warm, practical support for anxiety and the pressure of everyday life.' },
  { _id: 'maya', name: 'Maya Rodriguez, LMFT', specializations: ['Self-esteem', 'Relationships'], experience_years: 8, hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80', bio: 'A collaborative space to understand patterns and build healthier connections.' },
  { _id: 'aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief', 'Life transitions'], experience_years: 7, hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi'], photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=500&q=80', bio: 'Culturally sensitive care for change, loss, and finding your next chapter.' },
]

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Something went wrong')
  return response.json()
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zenheaven_user') || 'null'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const signIn = (payload) => {
    localStorage.setItem('zenheaven_token', payload.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(payload.user))
    setUser(payload.user)
  }
  const signOut = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" onAuth={signIn} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={signIn} />} />
      <Route element={<AppShell user={user} onSignOut={signOut} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/chat" element={<ChatPage user={user} />} />
        <Route path="/journal" element={<JournalPage user={user} />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/therapists" element={<TherapistsPage user={user} />} />
        <Route path="/coins" element={<CoinsPage user={user} />} />
      </Route>
    </Routes>
  )
}

function AppShell({ user, onSignOut, mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Gallery'
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-block">
          <Link to="/" className="brand-mark" onClick={() => setMobileOpen(false)}>
            <span className="brand-orbit"><span /></span>
            <span>zen<span>heaven</span></span>
          </Link>
          <button className="icon-button mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          <p className="brand-caption">A private gallery<br />for your inner world.</p>
        </div>
        <nav className="main-nav">
          <p className="eyebrow nav-label">Your space</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'CalmBot' && <span className="live-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="studio-note"><Sparkles size={15} /><span>New drop<br /><strong>Sunday reset</strong></span><ArrowUpRight size={14} /></div>
          {user ? (
            <button className="user-chip" onClick={onSignOut}>
              <span className="avatar">{(user.full_name || user.username || 'Z')[0].toUpperCase()}</span>
              <span><strong>{user.full_name || user.username}</strong><small>Sign out</small></span><LogOut size={15} />
            </button>
          ) : (
            <Link className="user-chip guest-chip" to="/login"><span className="avatar">Z</span><span><strong>Enter gallery</strong><small>Sign in to sync</small></span><LogIn size={15} /></Link>
          )}
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19} /></button><span className="muted-slash">/</span><span>{pageName}</span></div>
          <div className="topbar-actions"><span className="status-pill"><span className="status-dot" />Your space is private</span><button className="icon-button"><Search size={18} /></button><span className="topbar-date">05 SEP 2026</span></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}

function SectionHeading({ kicker, title, description, action }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{kicker}</p><h1>{title}</h1>{description && <p className="section-description">{description}</p>}</div>
      {action}
    </div>
  )
}

function Dashboard({ user }) {
  const navigate = useNavigate()
  const displayName = user?.full_name?.split(' ')[0] || user?.username || 'friend'
  return (
    <div className="dashboard page-enter">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="hero-meta"><span className="number-index">01</span><span className="line" /><span>THE DAILY EDIT</span></div>
          <h1>Make room<br />for <em>you.</em></h1>
          <p className="hero-lede">A small, considered collection of practices for feeling more like yourself, {displayName}.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => navigate('/journal')}>Begin a reflection <ArrowUpRight size={15} /></button><button className="text-button" onClick={() => navigate('/chat')}>Talk to CalmBot <ChevronRight size={15} /></button></div>
        </div>
        <div className="hero-art">
          <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=90" alt="Abstract pink and blue artwork" />
          <div className="art-stamp"><span>Curated<br />for calm</span><span className="stamp-star">✳</span></div>
          <div className="art-caption"><span>Quiet study no. 04</span><span>01 — 03</span></div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-cell"><span className="stat-label">Your current mood</span><strong><span className="mood-sun">☼</span> Open</strong><small>Not a label. Just a starting point.</small></div>
        <div className="stat-cell"><span className="stat-label">Gallery streak</span><strong>04 <small>days</small></strong><small>Keep the thread going.</small></div>
        <div className="stat-cell"><span className="stat-label">Calm coins</span><strong>{user?.calm_coins ?? 120} <Coins size={18} /></strong><small>Earned by showing up.</small></div>
        <div className="stat-cell stat-cta" onClick={() => navigate('/coins')}><span className="stat-label">Today’s invitation</span><strong>Write one true line <ArrowUpRight size={17} /></strong></div>
      </section>

      <section className="ritual-section">
        <div className="ritual-header"><div><p className="eyebrow">The collection / 03 practices</p><h2>Choose your<br /><em>next small thing.</em></h2></div><p className="ritual-note">There is no right order.<br />Follow the one that feels lightest.</p></div>
        <div className="ritual-grid">
          <RitualCard index="01" tone="coral" icon={<PenLine size={24} />} title="Put it down" text="A five minute journal for what’s here." to="/journal" />
          <RitualCard index="02" tone="blue" icon={<MessageCircle size={24} />} title="Be met" text="A thoughtful conversation, whenever you need it." to="/chat" />
          <RitualCard index="03" tone="acid" icon={<Headphones size={24} />} title="Tune in" text="A soundscape selected for your nervous system." to="/music" />
        </div>
      </section>

      <section className="art-editorial">
        <div className="editorial-heading"><p className="eyebrow">From the studio</p><h2>Things we’re<br /><em>holding onto.</em></h2><Link to="/books" className="text-button">View the library <ArrowUpRight size={15} /></Link></div>
        <div className="art-grid">{artWorks.map((art) => <ArtworkCard key={art.title} art={art} />)}</div>
      </section>
    </div>
  )
}

function RitualCard({ index, tone, icon, title, text, to }) {
  return <Link to={to} className={`ritual-card ${tone}`}><span className="card-index">{index}</span><span className="ritual-icon">{icon}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="card-arrow" size={18} /></Link>
}

function ArtworkCard({ art }) {
  return <article className="art-card"><div className="art-image-wrap"><img src={art.image} alt={art.title} /><span className={`art-accent ${art.accent}`} /></div><div className="art-card-meta"><div><h3>{art.title}</h3><p>{art.artist} · {art.medium}</p></div><button className="round-arrow" aria-label={`Open ${art.title}`}><ArrowUpRight size={16} /></button></div></article>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const payload = await apiFetch(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      onAuth(payload); navigate('/dashboard')
    } catch (err) {
      setError(`${err.message}. You can still explore the gallery.`)
    } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-art"><Link to="/" className="brand-mark"><span className="brand-orbit"><span /></span><span>zen<span>heaven</span></span></Link><div className="auth-art-copy"><p className="eyebrow">A private gallery for your inner world</p><h1>Come as<br /><em>you are.</em></h1><p>Nothing to perform. Nothing to optimize. Just a softer place to land.</p></div><span className="auth-art-credit">Artwork / Quiet study no. 04</span></div><div className="auth-form-side"><Link to="/" className="back-link">← Return to gallery</Link><div className="auth-form-wrap"><p className="eyebrow">{isRegister ? 'Begin your collection' : 'Welcome back'}</p><h2>{isRegister ? 'Make a little room.' : 'Good to see you.'}</h2><p className="auth-subtitle">{isRegister ? 'Your space is private, from the first word.' : 'Pick up where you left off.'}</p><form onSubmit={submit}>{isRegister && <label>What should we call you?<input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" /></label>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="your-handle" /></label>{isRegister && <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Six characters or more" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark button-wide" disabled={loading}>{loading ? <LoaderCircle className="spin" size={16} /> : isRegister ? 'Create my space' : 'Enter the gallery'}<ArrowUpRight size={16} /></button></form><p className="auth-switch">{isRegister ? 'Already have a space?' : 'New here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></div></div></div>
}

function ChatPage({ user }) {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', content: 'Hi. I’m here with you. What feels most present today?', is_user: false }])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [mobileThreads, setMobileThreads] = useState(false)
  useEffect(() => { apiFetch('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const sendMessage = async (event) => {
    event?.preventDefault()
    const message = draft.trim(); if (!message || thinking) return
    setDraft(''); setThinking(true)
    setMessages((current) => [...current, { id: Date.now(), content: message, is_user: true }, { id: `reply-${Date.now()}`, content: '', is_user: false, streaming: true }])
    const replyId = `reply-${Date.now()}`
    const updateReply = (content) => setMessages((current) => current.map((item) => item.id === replyId ? { ...item, content } : item))
    try {
      const response = await fetch(`${API_BASE}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('zenheaven_token') ? { Authorization: `Bearer ${localStorage.getItem('zenheaven_token')}` } : {}) }, body: JSON.stringify({ message, thread_id: activeThread?.id || null }) })
      if (!response.ok || !response.body) throw new Error('Offline')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let full = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n'); buffer = events.pop() || ''
        events.forEach((eventChunk) => {
          const line = eventChunk.split('\n').find((part) => part.startsWith('data:'))
          if (!line) return
          try { const payload = JSON.parse(line.replace('data: ', '')); if (payload.type === 'token') { full += payload.data; updateReply(full) } if (payload.type === 'complete') setThinking(false) } catch { /* partial event */ }
        })
      }
      updateReply(full || 'I’m listening. Give yourself a little more space to say what you mean.')
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 650))
      updateReply('I’m listening. You don’t have to solve everything right now — we can stay with one small piece together.')
    } finally { setThinking(false); setMessages((current) => current.map((item) => item.id === replyId ? { ...item, streaming: false } : item)) }
  }
  return <div className="chat-page page-enter"><div className={`thread-drawer ${mobileThreads ? 'drawer-open' : ''}`}><div className="drawer-head"><div><p className="eyebrow">Your conversations</p><h2>Threads</h2></div><button className="icon-button mobile-close" onClick={() => setMobileThreads(false)}><X size={17} /></button></div><button className="new-thread" onClick={() => { setMessages([{ id: 'welcome', content: 'Hi. I’m here with you. What feels most present today?', is_user: false }]); setActiveThread(null); setMobileThreads(false) }}><Plus size={16} /> New conversation</button><div className="thread-list">{threads.length ? threads.map((thread) => <button className={`thread-item ${activeThread?.id === thread.id ? 'selected' : ''}`} key={thread.id} onClick={() => setActiveThread(thread)}><span className="thread-symbol">◌</span><span><strong>{thread.title}</strong><small>{thread.last_message || 'A quiet beginning'}</small></span></button>) : <div className="empty-threads"><span>✳</span><p>Your conversations<br />will live here.</p></div>}</div><div className="drawer-footer"><Leaf size={14} /> Conversations are private</div></div>{mobileThreads && <button className="mobile-scrim" onClick={() => setMobileThreads(false)} aria-label="Close threads" />}<section className="chat-window"><div className="chat-topline"><button className="button button-ghost mobile-thread-button" onClick={() => setMobileThreads(true)}><Menu size={16} /> Threads</button><div><p className="eyebrow">CalmBot / live room</p><h1>{activeThread?.title || 'A place to put things down.'}</h1></div><span className="bot-status"><span className="status-dot" /> online</span></div><div className="message-list">{messages.map((message) => <div key={message.id} className={`message-row ${message.is_user ? 'user-message' : ''}`}><div className={`message-avatar ${message.is_user ? 'user-avatar' : 'bot-avatar'}`}>{message.is_user ? (user?.username?.[0] || 'Y').toUpperCase() : <Sparkles size={15} />}</div><div className="message-body"><span className="message-author">{message.is_user ? 'You' : 'CalmBot'}</span><p>{message.content || <span className="typing"><i /><i /><i /></span>}</p></div></div>)}</div><div className="chat-composer-wrap"><div className="prompt-chips"><button onClick={() => setDraft('I feel a little overwhelmed today.')}>I feel overwhelmed</button><button onClick={() => setDraft('Help me find a little calm.')}>Help me find calm</button><button onClick={() => setDraft('I want to celebrate a small win.')}>A small win</button></div><form className="chat-composer" onSubmit={sendMessage}><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What’s on your mind?" rows={1} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) } }} /><button className="send-button" disabled={thinking || !draft.trim()} aria-label="Send message">{thinking ? <LoaderCircle className="spin" size={18} /> : <Send size={17} />}</button></form><p className="composer-note"><Leaf size={12} /> CalmBot is a supportive tool, not a replacement for professional care.</p></div></section></div>
}

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('open')
  const [saved, setSaved] = useState(false)
  const moods = ['open', 'calm', 'hopeful', 'tender', 'heavy']
  useEffect(() => { apiFetch('/journal/entries').then((data) => setEntries(Array.isArray(data) ? data : [])).catch(() => {}) }, [])
  const saveEntry = async (event) => {
    event.preventDefault(); if (!content.trim()) return
    try { const entry = await apiFetch('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [] }) }); setEntries((current) => [entry, ...current]) } catch { setEntries((current) => [{ _id: Date.now(), content, mood, title: 'A note to self', created_at: new Date().toISOString() }, ...current]) }
    setContent(''); setSaved(true); setTimeout(() => setSaved(false), 3000)
  }
  return <div className="journal-page page-enter"><SectionHeading kicker="The inner archive / 01" title={<>A page for<br /><em>what’s here.</em></>} description="You don’t need the perfect words. Start with the honest ones." action={<button className="button button-dark" onClick={() => document.querySelector('.journal-editor textarea')?.focus()}><PenLine size={15} /> New entry</button>} /><div className="journal-layout"><form className="journal-editor" onSubmit={saveEntry}><div className="editor-top"><span>Today, 05 September 2026</span><span className="entry-number">ENTRY / {String(entries.length + 1).padStart(2, '0')}</span></div><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What do you want to remember about today?" /><div className="editor-bottom"><div><span className="mood-label">This feels</span><div className="mood-picker">{moods.map((item) => <button type="button" className={mood === item ? 'selected' : ''} key={item} onClick={() => setMood(item)}>{item}</button>)}</div></div><button className="button button-dark" disabled={!content.trim()}>{saved ? <><Check size={15} /> Saved</> : <>Keep this <ArrowUpRight size={15} /></>}</button></div></form><aside className="journal-aside"><div className="prompt-card"><span className="prompt-mark">“</span><p>What felt a little easier than it used to?</p><span className="prompt-foot">A gentle prompt / 04</span></div><div className="archive-list"><div className="archive-head"><p className="eyebrow">Recent pages</p><span>{entries.length || 0} total</span></div>{entries.slice(0, 4).map((entry, index) => <div className="archive-row" key={entry._id || index}><span className="archive-date">{entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Sep 05'}</span><span><strong>{entry.title || 'A page to return to'}</strong><small>{entry.mood || 'open'} · {String(entry.content || '').slice(0, 40)}…</small></span><ArrowUpRight size={14} /></div>)}{!entries.length && <p className="empty-copy">Your first page is waiting.</p>}</div></aside></div></div>
}

function BooksPage() {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  useEffect(() => { apiFetch('/books/recommend-by-mood').then((data) => data.books?.length && setBooks(data.books)).catch(() => {}) }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const data = await apiFetch(`/books/search?q=${encodeURIComponent(query)}`); if (data.books?.length) setBooks(data.books) } catch { /* keep curated books */ } }
  return <div className="library-page page-enter"><SectionHeading kicker="The reference room / 02" title={<>Read something<br /><em>that meets you.</em></>} description="A considered shelf for the days you need a little more perspective." action={<form className="search-field" onSubmit={search}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the shelf" /></form>} /><div className="library-feature"><div className="feature-copy"><p className="eyebrow">The current shelf / curated for open</p><h2>Books for<br /><em>staying soft.</em></h2><p>For the part of you that is still curious, even on the harder days.</p><button className="button button-light">Explore the shelf <ArrowUpRight size={15} /></button></div><div className="feature-book-stack">{books.slice(0, 3).map((book, index) => <img key={book.id} style={{ zIndex: 3 - index, transform: `translateX(${index * 44}px) rotate(${index === 1 ? 3 : index === 2 ? 7 : -4}deg)` }} src={book.image_url || fallbackBooks[index].image_url} alt={book.title} />)}</div></div><div className="books-grid">{books.map((book, index) => <article className="book-card" key={book.id || index}><div className="book-cover"><img src={book.image_url || fallbackBooks[index % 3].image_url} alt="" /><span className="book-save"><Heart size={15} /></span></div><div className="book-meta"><span className="book-index">0{index + 1}</span><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p><small>{book.description || 'A quiet companion for your next chapter.'}</small></div></article>)}</div></div>
}

function MusicPage() {
  const [tracks, setTracks] = useState(fallbackTracks)
  const [playing, setPlaying] = useState(null)
  const [song, setSong] = useState('')
  useEffect(() => { apiFetch('/songs').then(async (data) => { if (data.songs?.length) { const details = await Promise.all(data.songs.slice(0, 6).map((name) => apiFetch(`/song_details?song=${encodeURIComponent(name)}&artist=Unknown`).catch(() => ({ name, artist: 'ZenHeaven radio', album_cover_url: fallbackTracks[0].album_cover_url })))); setTracks(details) } }).catch(() => {}) }, [])
  const filtered = tracks.filter((track) => `${track.name} ${track.artist}`.toLowerCase().includes(song.toLowerCase()))
  return <div className="music-page page-enter"><SectionHeading kicker="The sound room / 03" title={<>Let the room<br /><em>sound different.</em></>} description="A low-volume corner of the gallery. Press play, take what you need." action={<div className="sound-search"><Search size={16} /><input value={song} onChange={(e) => setSong(e.target.value)} placeholder="Find a feeling" /></div>} /><div className="music-hero"><div className="vinyl-art"><div className="vinyl-disc"><div /></div><span className="vinyl-label">ZH<br /><small>01</small></span></div><div className="music-hero-copy"><p className="eyebrow">Now curated / a softer pace</p><h2>For the hours<br /><em>between things.</em></h2><p>Start with an ambient mix shaped around your current mood.</p><div className="mix-progress"><span /><div><span>00:00</span><span>28:40</span></div></div><button className="button button-light" onClick={() => setPlaying(playing ? null : 'mix')}>{playing ? 'Pause mix' : 'Play full mix'} <Play size={14} fill="currentColor" /></button></div></div><div className="track-list"><div className="track-list-head"><p className="eyebrow">The queue / {filtered.length} pieces</p><span>All moods · 45 min</span></div>{filtered.map((track, index) => <button className={`track-row ${playing === track.name ? 'playing' : ''}`} key={`${track.name}-${index}`} onClick={() => setPlaying(playing === track.name ? null : track.name)}><span className="track-number">{playing === track.name ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><img src={track.album_cover_url || fallbackTracks[index % 3].album_cover_url} alt="" /><span className="track-name"><strong>{track.name}</strong><small>{track.artist}</small></span><span className="track-duration">04:{String(12 + index * 7).padStart(2, '0')}</span><span className="track-play">{playing === track.name ? 'pause' : 'play'} <ChevronRight size={14} /></span></button>)}</div></div>
}

function TherapistsPage({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [selected, setSelected] = useState(null)
  useEffect(() => { apiFetch('/therapists/').then((data) => data?.length && setTherapists(data)).catch(() => {}) }, [])
  return <div className="therapists-page page-enter"><SectionHeading kicker="The human room / 04" title={<>Find a person<br /><em>to talk to.</em></>} description="Licensed, kind, and human. Browse at your own pace." action={<div className="trust-note"><ShieldIcon /><span>All practitioners<br /><strong>verified</strong></span></div>} /><div className="therapist-banner"><div><span className="eyebrow">A good first step</span><h2>You don’t have to<br /><em>know where to start.</em></h2></div><p>Filter by what you’re carrying, or simply choose the face that makes you exhale.</p></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="therapist-photo"><img src={therapist.photo_url || fallbackTherapists[0].photo_url} alt={therapist.name} /><span className="available-badge"><span /> accepting clients</span><button className="photo-more"><MoreHorizontal size={17} /></button></div><div className="therapist-info"><div className="therapist-name-row"><div><h3>{therapist.name}</h3><p>{therapist.experience_years} years experience</p></div><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><p className="therapist-bio">{therapist.bio}</p><div className="tag-row">{(therapist.specializations || []).slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="therapist-foot"><span>${therapist.hourly_rate}<small> / session</small></span><button className="text-button" onClick={() => setSelected(therapist)}>View profile <ArrowUpRight size={14} /></button></div></div></article>)}</div>{selected && <div className="modal-scrim" onClick={() => setSelected(null)}><div className="therapist-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={18} /></button><img src={selected.photo_url || fallbackTherapists[0].photo_url} alt="" /><div><p className="eyebrow">Verified practitioner</p><h2>{selected.name}</h2><p>{selected.bio}</p><div className="tag-row">{selected.specializations?.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="button button-dark" onClick={() => alert(user ? 'Choose a time slot in the API calendar to continue.' : 'Sign in to book a session.')}>Request a first session <ArrowUpRight size={15} /></button></div></div></div>}</div>
}

function ShieldIcon() { return <span className="shield-icon">✓</span> }

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 120)
  const [transactions, setTransactions] = useState([])
  useEffect(() => { apiFetch('/coins/balance').then((data) => setBalance(data.balance)).catch(() => {}); apiFetch('/coins/transactions').then((data) => setTransactions(data)).catch(() => {}) }, [])
  const rewards = [{ icon: '✳', title: 'Premium insights', detail: 'A deeper look at your patterns', cost: 100, tone: 'coral' }, { icon: '◌', title: 'Custom meditation', detail: 'A practice made for this moment', cost: 150, tone: 'blue' }, { icon: '☼', title: 'Therapist session', detail: 'Put coins toward a real conversation', cost: 500, tone: 'acid' }]
  return <div className="coins-page page-enter"><SectionHeading kicker="The exchange / 05" title={<>Small acts,<br /><em>real value.</em></>} description="Calm coins are a gentle way to notice the energy you put into yourself." action={<span className="coin-balance"><Coins size={16} /> {balance} coins</span>} /><div className="coin-overview"><div className="coin-orbit"><span className="coin-core">✳</span><span className="orbit-ring ring-one" /><span className="orbit-ring ring-two" /></div><div><p className="eyebrow">Your balance</p><strong>{balance} <small>calm coins</small></strong><p>You earned <b>+10</b> this week by making time for yourself.</p><div className="coin-progress"><span style={{ width: `${Math.min(100, (balance / 500) * 100)}%` }} /></div><small>500 coins unlock a supported session</small></div><div className="coin-metric"><span>Current streak</span><strong>04 <small>days</small></strong><span className="streak-dots"><i /><i /><i /><i className="muted" /><i className="muted" /><i className="muted" /><i className="muted" /></span></div></div><div className="rewards-section"><div className="rewards-heading"><div><p className="eyebrow">The cabinet / what’s possible</p><h2>Spend them<br /><em>with intention.</em></h2></div><p>Nothing here is urgent.<br />Let it be a thank you.</p></div><div className="rewards-grid">{rewards.map((reward) => <article className={`reward-card ${reward.tone}`} key={reward.title}><span className="reward-icon">{reward.icon}</span><span className="reward-cost"><Coins size={13} /> {reward.cost}</span><h3>{reward.title}</h3><p>{reward.detail}</p><button className="round-arrow"><ArrowUpRight size={16} /></button></article>)}</div></div><div className="transactions"><div className="archive-head"><p className="eyebrow">Recent exchanges</p><span>View all <ArrowUpRight size={13} /></span></div>{transactions.slice(0, 4).map((item, index) => <div className="transaction-row" key={item._id || index}><span className="transaction-symbol">{item.transaction_type === 'spend' ? '−' : '+'}</span><span><strong>{item.description || 'A moment for yourself'}</strong><small>{item.source || 'wellness'} · {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Today'}</small></span><b className={item.transaction_type === 'spend' ? 'spent' : ''}>{item.transaction_type === 'spend' ? '-' : '+'}{item.amount || 10}</b></div>)}{!transactions.length && <div className="empty-copy">Your exchanges will appear here as you build your practice.</div>}</div></div>
}

function Root() {
  return <BrowserRouter><App /></BrowserRouter>
}

createRoot(document.getElementById('root')).render(<Root />)

export default Root
