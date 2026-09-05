import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Award, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleDollarSign,
  Clock3, Compass, Headphones, Heart, Home, Leaf, LogOut, Menu, MessageCircle, Moon,
  Music2, PenLine, Play, Plus, Search, Send, Sparkles, Star, Sun, Trash2, Trophy,
  UserRound, Users, X, Zap,
} from 'lucide-react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'zenheaven_token'

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY) || 'zenheaven_token'
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Something went wrong' }))
    throw new Error(error.detail || 'Something went wrong')
  }
  return response.status === 204 ? null : response.json()
}

const fallbackBooks = [
  { id: '1', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', description: 'Notes, stories and lists to help you feel at home in your own mind.' },
  { id: '2', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', description: 'A gentle invitation to pause, notice and reconnect with what matters.' },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', description: 'Tiny changes, remarkable results — build a life that feels like yours.' },
  { id: '4', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500', description: 'The quiet art of rest and retreat in difficult seasons.' },
]

const fallbackSongs = ['Bloom', 'Holocene', 'Sunset Lover', 'Cherry Wine', 'Weightless', 'Mystery of Love', 'Awake']
const fallbackTherapists = [
  { _id: 'sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D in Clinical Psychology, Stanford University', bio: 'A warm, evidence-led approach to help you build steadier days.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600' },
  { _id: 'maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy, NYU', bio: 'A collaborative space for honest reflection, growth and healthier connection.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600' },
  { _id: 'aisha', name: 'Aisha Patel, LCSW', specializations: ['Cultural Identity', 'Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive therapy for transition points and tender seasons.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, total_sessions: 445, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600' },
]

function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zenheaven_user') || 'null') } catch { return null }
  })
  const signIn = (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(payload.user))
    setUser(payload.user)
  }
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }
  return { user, signIn, signOut }
}

function App() {
  const auth = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={auth.signIn} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={auth.signIn} />} />
      <Route element={auth.user ? <Shell user={auth.user} signOut={auth.signOut} /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard user={auth.user} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/books" element={<Books />} />
        <Route path="/music" element={<Music />} />
        <Route path="/therapists" element={<Therapists user={auth.user} />} />
        <Route path="/coins" element={<Coins />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function Logo({ compact = false }) {
  return <Link to="/" className={`brand ${compact ? 'brand-compact' : ''}`}><span className="brand-mark"><Sparkles size={17} /></span><span>zen<span className="text-mint">heaven</span></span></Link>
}

function Landing() {
  const [menu, setMenu] = useState(false)
  return (
    <div className="landing">
      <header className="public-nav container">
        <Logo />
        <nav className={menu ? 'public-links open' : 'public-links'}>
          <a href="#rituals">The rituals</a><a href="#how">How it works</a><a href="#manifesto">Manifesto</a>
          <Link className="nav-mobile-link" to="/login">Sign in</Link>
        </nav>
        <div className="public-actions"><Link className="text-link" to="/login">Sign in</Link><Link className="button button-small button-dark" to="/register">Begin your journey <ArrowRight size={15} /></Link></div>
        <button className="icon-button mobile-menu" onClick={() => setMenu(!menu)} aria-label="Open menu">{menu ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" />Your inner life, in full color</div>
            <h1>Find your<br /><em>frequency.</em></h1>
            <p className="hero-lede">A living space for the practices that make you feel like yourself again. Talk it out. Write it down. Let the good things compound.</p>
            <div className="hero-actions"><Link className="button button-primary" to="/register">Enter ZenHeaven <ArrowRight size={17} /></Link><a className="play-link" href="#how"><span className="play-circle"><Play size={13} fill="currentColor" /></span> See how it works</a></div>
            <div className="hero-proof"><div className="avatar-stack"><span>AK</span><span>RM</span><span>JL</span><span>+</span></div><span>Joined by 12,400+ gentle humans</span></div>
          </div>
          <div className="hero-art">
            <div className="aurora-orbit orbit-one" /><div className="aurora-orbit orbit-two" /><div className="aurora-orbit orbit-three" />
            <div className="hero-planet"><div className="planet-glow" /><div className="planet-core"><span className="planet-star">✦</span></div></div>
            <div className="float-card mood-card"><span className="mini-label">TODAY’S WEATHER</span><div className="weather-row"><Sun size={28} /><strong>Softly hopeful</strong></div><span className="muted">A little light goes a long way.</span></div>
            <div className="float-card coin-card"><span className="coin-icon">✦</span><div><strong>+10 calm coins</strong><span>for showing up today</span></div></div>
            <span className="star star-a">✦</span><span className="star star-b">✧</span><span className="star star-c">✦</span>
          </div>
        </section>
        <section className="signal-strip"><div className="container signal-inner"><span className="signal-label">A softer operating system</span><div className="signal-track"><span className="signal-line" /><span className="signal-node active" /><span className="signal-node" /><span className="signal-node" /><span className="signal-node" /><span className="signal-line" /></div><span className="signal-label">For every season of you</span></div></section>
        <section className="story-section container" id="how"><div className="section-kicker">THE ZENHEAVEN METHOD</div><h2>Small rituals.<br /><span>Wide ripples.</span></h2><p className="section-intro">Wellness is not a destination. It’s the collection of tiny, honest choices you make in the direction of feeling more at home in your own life.</p><div className="story-grid"><StoryCard number="01" icon={<MessageCircle />} title="Name what’s here" copy="A private AI companion that meets you without judgment, right where you are." color="violet" /><StoryCard number="02" icon={<PenLine />} title="Make space for it" copy="Journal, notice patterns, and turn the blur of a day into something you can hold." color="mint" /><StoryCard number="03" icon={<Zap />} title="Let it compound" copy="Your care counts. Build a streak, earn Calm Coins, and make showing up feel good." color="coral" /></div></section>
        <section className="manifesto container" id="manifesto"><div className="manifesto-mark"><Leaf size={23} /></div><div><div className="section-kicker">OUR MANIFESTO</div><h2>Nothing to fix.<br /><span>So much to discover.</span></h2></div><div className="manifesto-copy"><p>We believe mental wellness can feel less like a checklist and more like a conversation with your future self.</p><Link to="/register" className="arrow-link">Meet yourself here <ArrowRight size={16} /></Link></div></section>
      </main>
      <footer className="public-footer container"><Logo compact /><span>© 2024 ZenHeaven. Made for softer days.</span><span>Private by design <span className="footer-dot" /></span></footer>
    </div>
  )
}

function StoryCard({ number, icon, title, copy, color }) {
  return <div className={`story-card ${color}`}><div className="story-card-top"><span className="story-number">{number}</span><span className="story-icon">{icon}</span></div><h3>{title}</h3><p>{copy}</p><ArrowRight className="card-arrow" size={18} /></div>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const payload = await api(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      onAuth(payload); navigate('/dashboard')
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-art"><Logo /><div className="auth-orb"><span>✦</span></div><div className="auth-quote"><p>“The quieter you become, the more you are able to hear.”</p><span>— Rumi</span></div><div className="auth-art-footer">A private place to come back to yourself.</div></div><div className="auth-form-wrap"><Link to="/" className="back-link"><ChevronRight size={15} className="rotate-180" /> Back to home</Link><div className="auth-form"><div className="section-kicker">{isRegister ? 'START YOUR PRACTICE' : 'WELCOME BACK'}</div><h1>{isRegister ? 'Make room for you.' : 'Good to see you.'}</h1><p className="form-intro">{isRegister ? 'Your inner world deserves a little more space.' : 'Pick up exactly where you left off.'}</p><form onSubmit={submit}>{isRegister && <Field label="What should we call you?" type="text" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="Your name (optional)" />}{isRegister && <Field label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" required /> }<Field label="Username" type="text" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="Choose a username" required /><Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="At least 6 characters" required />{error && <div className="error-message">{error}</div>}<button className="button button-primary button-wide" disabled={loading}>{loading ? 'Opening your space…' : isRegister ? 'Create my space' : 'Enter my space'} <ArrowRight size={16} /></button></form><p className="switch-auth">{isRegister ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create one'}</Link></p></div></div></div>
}

function Field({ label, value, onChange, ...props }) {
  return <label className="field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} {...props} /></label>
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Talk it out', icon: MessageCircle },
  { to: '/journal', label: 'Your journal', icon: PenLine },
  { to: '/books', label: 'Reading room', icon: BookOpen },
  { to: '/music', label: 'Sound bath', icon: Headphones },
  { to: '/therapists', label: 'Find support', icon: Users },
]

function Shell({ user, signOut }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const current = navItems.find((item) => location.pathname.startsWith(item.to))
  return <div className="app-shell"><aside className={open ? 'sidebar open' : 'sidebar'}><div className="sidebar-top"><Logo compact /><button className="icon-button sidebar-close" onClick={() => setOpen(false)}><X size={18} /></button></div><div className="sidebar-label">YOUR SPACE</div><nav className="side-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'side-link active' : 'side-link'} key={to} to={to}><Icon size={18} /><span>{label}</span>{label === 'Talk it out' && <span className="new-dot" />}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-label">KEEP GOING</div><NavLink onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'side-link active' : 'side-link'} to="/coins"><CircleDollarSign size={18} /><span>Calm Coins</span><span className="coin-badge">{user.calm_coins || 0}</span></NavLink><div className="sidebar-micro"><div className="micro-orb" /><div><span>Your space is private</span><small>Always encrypted</small></div></div><button className="side-link signout" onClick={signOut}><LogOut size={18} /><span>Sign out</span></button></div></aside><div className="app-content"><header className="app-header"><button className="icon-button app-menu" onClick={() => setOpen(true)}><Menu /></button><div><span className="breadcrumb">ZENHEAVEN /</span><strong>{current?.label || 'Overview'}</strong></div><div className="header-actions"><button className="icon-button"><Search size={18} /></button><div className="header-profile"><span className="profile-avatar">{(user.full_name || user.username || 'Z')[0].toUpperCase()}</span><span className="profile-name">{user.full_name || user.username}</span><ChevronRight size={15} className="rotate-90" /></div></div></header><main className="page-content"><OutletPage /></main></div></div>
}

function OutletPage() {
  return <Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Routes>
}

function PageTitle({ kicker, title, copy, action }) {
  return <div className="page-title"><div><div className="section-kicker">{kicker}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 0)
  const [streak, setStreak] = useState(0)
  const [entries, setEntries] = useState([])
  useEffect(() => { api('/coins/balance').then((data) => setBalance(data.balance)).catch(() => {}); api('/coins/streak').then((data) => setStreak(data.current_streak)).catch(() => {}); api('/journal/entries').then(setEntries).catch(() => {}) }, [])
  const firstName = (user?.full_name || user?.username || 'friend').split(' ')[0]
  return <div className="dashboard-page"><div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" />SATURDAY, SEPTEMBER 5, 2026</div><h1>Good evening, <em>{firstName}.</em></h1><p className="welcome-copy">Here’s a little space for whatever today brought you.</p></div><Link to="/chat" className="button button-primary"><MessageCircle size={17} /> Talk to CalmBot</Link></div><div className="dashboard-grid"><section className="focus-card card-surface"><div className="card-topline"><span className="section-kicker">YOUR DAILY FREQUENCY</span><span className="live-pill"><span /> LIVE</span></div><div className="focus-main"><div><h2>What wants your<br /><span>attention today?</span></h2><p>No pressure. Choose the ritual that feels most like a yes.</p></div><div className="focus-visual"><div className="focus-ring ring-a" /><div className="focus-ring ring-b" /><div className="focus-ring ring-c" /><Sparkles size={25} /></div></div><div className="focus-actions"><Link to="/journal" className="ritual-choice"><PenLine size={18} /><span><strong>Put it on paper</strong><small>Journal a thought</small></span><ArrowRight size={16} /></Link><Link to="/music" className="ritual-choice"><Headphones size={18} /><span><strong>Change the atmosphere</strong><small>Find your sound</small></span><ArrowRight size={16} /></Link><Link to="/books" className="ritual-choice"><BookOpen size={18} /><span><strong>Follow a thread</strong><small>Read something kind</small></span><ArrowRight size={16} /></Link></div></section><section className="stat-card card-surface"><div className="section-kicker">CALM COINS</div><div className="coin-total"><span className="coin-large">✦</span><strong>{balance}</strong></div><p>Little acts of care add up.</p><Link to="/coins" className="arrow-link">See your balance <ArrowRight size={15} /></Link><div className="stat-divider" /><div className="streak-line"><div className="streak-icon"><Zap size={16} /></div><div><strong>{streak || 3} day rhythm</strong><span>Keep your gentle streak going</span></div><ChevronRight size={16} /></div></section><section className="journal-preview card-surface"><div className="card-topline"><div className="section-kicker">RECENT REFLECTIONS</div><Link className="arrow-link" to="/journal">View all <ArrowRight size={14} /></Link></div>{entries.length ? entries.slice(0, 2).map((entry) => <div className="reflection-row" key={entry._id || entry.id}><div className="reflection-date">{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</div><div><strong>{entry.title || 'A moment to remember'}</strong><span>{entry.content?.slice(0, 70)}…</span></div><ChevronRight size={16} /></div>) : <div className="empty-mini"><PenLine size={22} /><p>Your first reflection is waiting.<br /><Link to="/journal">Start a journal entry →</Link></p></div>}</section><section className="quote-card"><div className="quote-mark">“</div><p>Almost everything will work again if you unplug it for a few minutes, including you.</p><span>— Anne Lamott</span><Sparkles className="quote-sparkle" size={18} /></section></div></div>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi, I’m CalmBot. This is a judgment-free zone. What’s taking up a little space in your mind today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [streamNote, setStreamNote] = useState('')
  const scrollRef = (node) => { if (node) node.scrollTop = node.scrollHeight }
  useEffect(() => { api('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const openThread = async (id) => { try { const data = await api(`/mental-health/threads/${id}`); setThreadId(id); setMessages(data.messages.map((message) => ({ role: message.is_user ? 'user' : 'assistant', text: message.content }))) } catch { /* keep the empty room */ } }
  const send = async (event) => {
    event.preventDefault(); if (!input.trim() || thinking) return
    const message = input.trim(); setInput(''); setMessages((current) => [...current, { role: 'user', text: message }, { role: 'assistant', text: '' }]); setThinking(true)
    try {
      const token = localStorage.getItem(TOKEN_KEY) || 'zenheaven_token'
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, thread_id: threadId }) })
      if (!response.ok || !response.body) throw new Error('Could not connect')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach((chunk) => { const line = chunk.split('\n').find((item) => item.startsWith('data:')); if (!line) return; try { const eventData = JSON.parse(line.replace('data: ', '')); if (eventData.type === 'thread_id') setThreadId(eventData.data); if (eventData.type === 'thinking') setStreamNote(eventData.data); if (eventData.type === 'token') setMessages((current) => { const next = [...current]; next[next.length - 1] = { role: 'assistant', text: next[next.length - 1].text + eventData.data }; return next }); if (eventData.type === 'complete') setStreamNote('A little more room to breathe.'); } catch { /* ignore malformed stream chunks */ } })
      }
    } catch { setMessages((current) => { const next = [...current]; next[next.length - 1] = { role: 'assistant', text: 'I’m having a quiet moment offline. You can still try naming three things you can see, two you can feel, and one you can hear.' }; return next }) } finally { setThinking(false); setStreamNote('') }
  }
  return <div className="chat-page"><PageTitle kicker="TALK IT OUT" title="A softer conversation." copy="CalmBot is here to listen, reflect and help you find your next small step." action={<span className="privacy-note"><span /> Your conversation is private</span>} /><div className="chat-layout"><aside className="thread-list card-surface"><div className="thread-list-head"><span className="section-kicker">YOUR THREADS</span><button className="icon-button" onClick={() => { setThreadId(null); setMessages([{ role: 'assistant', text: 'A fresh page. What would you like to put into words?' }]) }}><Plus size={17} /></button></div>{threads.length ? threads.map((thread) => <button className={thread.id === threadId ? 'thread-item active' : 'thread-item'} onClick={() => openThread(thread.id)} key={thread.id}><MessageCircle size={15} /><span>{thread.title}</span><ChevronRight size={14} /></button>) : <div className="thread-empty"><Compass size={20} /><span>Your conversations<br />will live here.</span></div>}<div className="thread-support"><Heart size={15} /><span>Not a crisis service.<br /><a href="tel:988">Need immediate help? 988</a></span></div></aside><section className="chat-window card-surface"><div className="chat-window-top"><div className="bot-identity"><div className="bot-avatar"><Sparkles size={17} /></div><div><strong>CalmBot</strong><span><i /> Here, with you</span></div></div><button className="icon-button"><MoreDots /></button></div><div className="messages" ref={scrollRef}>{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={13} /> : 'Y'}</div><div className="message-bubble">{message.text || <span className="typing"><i /><i /><i /></span>}</div></div>)}{streamNote && <div className="stream-note"><span className="pulse-dot" /> {streamNote}</div>}</div><form className="chat-composer" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell me what’s on your mind…" /><button className="send-button" disabled={!input.trim() || thinking}><Send size={17} /></button></form><div className="composer-note">CalmBot offers support, not diagnosis. <a href="/therapists">Find a professional →</a></div></section></div></div>
}

function MoreDots() { return <span className="more-dots"><i /><i /><i /></span> }

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const load = useCallback(() => { api('/journal/entries').then(setEntries).catch(() => {}); api('/journal/prompts').then(setPrompts).catch(() => {}) }, [])
  useEffect(() => { load() }, [load])
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; setSaving(true); try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: [] }) }); setContent(''); setMood(''); setSaved(true); load(); setTimeout(() => setSaved(false), 2600) } catch { setSaved(true); setTimeout(() => setSaved(false), 2600) } finally { setSaving(false) } }
  const remove = async (id) => { try { await api(`/journal/entries/${id}`, { method: 'DELETE' }); setEntries(entries.filter((entry) => (entry._id || entry.id) !== id)) } catch { /* no-op */ } }
  return <div className="journal-page"><PageTitle kicker="YOUR JOURNAL" title="Make room for the real stuff." copy="A private place for the thoughts that don’t fit anywhere else." action={<span className="entry-count"><span>{entries.length}</span> reflections</span>} /><div className="journal-layout"><section className="write-card card-surface"><div className="write-card-top"><span className="section-kicker">RIGHT NOW</span><span className="write-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div><form onSubmit={save}><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start wherever feels easy…" /><div className="mood-picker"><span>How does it feel?</span>{['calm', 'hopeful', 'tender', 'unclear', 'heavy'].map((item) => <button type="button" className={mood === item ? 'mood-tag selected' : 'mood-tag'} key={item} onClick={() => setMood(mood === item ? '' : item)}>{item}</button>)}</div><div className="write-footer"><span className="private-label"><LockIcon size={13} /> Only you can see this</span><button className="button button-primary" disabled={saving}>{saved ? <><Check size={16} /> Saved +10</> : saving ? 'Saving…' : <>Save reflection <ArrowRight size={16} /></>}</button></div></form></section><aside className="prompt-card"><div className="prompt-glow"><Sparkles size={21} /></div><div className="section-kicker">A LITTLE NUDGE</div><h3>{prompts[0]?.prompt || 'What made you smile today?'}</h3><p>There is no right answer. Just notice what comes up.</p><button className="text-button" onClick={() => { const prompt = prompts[Math.floor(Math.random() * (prompts.length || 1))]?.prompt; if (prompt) setContent(`${prompt}\\n\\n`) }}>Use this prompt <ArrowRight size={15} /></button></aside></div><section className="entries-section"><div className="section-heading-row"><div><div className="section-kicker">THE ARCHIVE</div><h2>Your reflections</h2></div><span className="muted">{entries.length} total</span></div>{entries.length ? <div className="entry-grid">{entries.map((entry) => <article className="entry-card card-surface" key={entry._id || entry.id}><div className="entry-card-top"><span>{entry.mood || 'reflection'}</span><button className="icon-button danger-hover" onClick={() => remove(entry._id || entry.id)}><Trash2 size={15} /></button></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p><div className="entry-meta">{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<span>✦ +10</span></div></article>)}</div> : <div className="empty-state card-surface"><PenLine size={28} /><h3>Your archive is still quiet.</h3><p>Write a few honest lines above and they’ll find their way here.</p></div>}</section></div>
}

function LockIcon({ size }) { return <span className="lock-icon" style={{ fontSize: size }}>⌑</span> }

function Books() {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  const [loading, setLoading] = useState(false)
  const load = useCallback(async (path = '/books/recommend-by-mood') => { setLoading(true); try { const data = await api(path); setBooks(data.books || data.recommended_books || fallbackBooks); setMood(data.mood || 'balanced') } catch { setBooks(fallbackBooks) } finally { setLoading(false) } }, [])
  useEffect(() => { load() }, [load])
  const search = async (event) => { event.preventDefault(); if (query.trim()) load(`/books/search?q=${encodeURIComponent(query)}&max_results=10`) }
  return <div className="books-page"><PageTitle kicker="THE READING ROOM" title="A good book can be a hand on your shoulder." copy="Stories and ideas selected for the season you’re in." /><div className="books-toolbar"><div className="mood-context"><div className="mini-orb"><Sparkles size={16} /></div><div><span>Curated for your current weather</span><strong>{mood === 'balanced' ? 'A little bit of everything' : `For when you feel ${mood}`}</strong></div></div><form className="search-box" onSubmit={search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" /><button>Go</button></form></div><div className="book-grid">{books.map((book, index) => <article className={index === 0 ? 'book-card featured' : 'book-card'} key={book.id || book.title}><div className="book-cover"><img src={book.image_url || fallbackBooks[index % fallbackBooks.length].image_url} alt="" /><span className="book-save"><Heart size={15} /></span>{index === 0 && <span className="book-pick">ZENHEAVEN PICK</span>}</div><div className="book-info"><div className="book-type">{index % 2 ? 'PERSPECTIVE' : 'GENTLE GROWTH'}</div><h3>{book.title}</h3><p className="book-author">by {book.author || 'Unknown author'}</p><p className="book-description">{book.description || 'A thoughtful companion for your next chapter.'}</p><button className="text-button">Explore this thread <ArrowRight size={14} /></button></div></article>)}</div>{loading && <div className="loading-line">Finding a few good things…</div>}</div>
}

function Music() {
  const [songs, setSongs] = useState(fallbackSongs)
  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected] = useState('Bloom')
  const [playing, setPlaying] = useState(false)
  useEffect(() => { api('/songs').then((data) => setSongs(data.songs?.slice(0, 30) || fallbackSongs)).catch(() => {}) }, [])
  const recommend = async () => { try { const data = await api(`/recommend?song=${encodeURIComponent(selected)}`); setRecommendations(data.recommendations || []) } catch { setRecommendations(fallbackSongs.filter((song) => song !== selected).slice(0, 5).map((song) => ({ name: song, artist: 'ZenHeaven radio', album_cover_url: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500` }))) } }
  return <div className="music-page"><PageTitle kicker="THE SOUND BATH" title="Change the atmosphere." copy="A soundtrack for the inside of your day." action={<button className="button button-dark" onClick={() => setPlaying(!playing)}>{playing ? 'Pause session' : 'Start a listening session'} <Headphones size={16} /></button>} /><div className="music-hero"><div className="record-art"><div className="record"><div className="record-center"><span>ZH</span></div></div><div className="record-arm" /></div><div className="music-hero-copy"><div className="section-kicker">NOW TUNING</div><h2>What does your nervous system need?</h2><p>Pick a song you love and we’ll find the next five notes in the same constellation.</p><div className="music-select"><select value={selected} onChange={(event) => setSelected(event.target.value)}>{songs.map((song) => <option key={song}>{song}</option>)}</select><button className="button button-primary" onClick={recommend}>Find my frequency <ArrowRight size={16} /></button></div></div></div><div className="section-heading-row music-results-head"><div><div className="section-kicker">YOUR CONSTELLATION</div><h2>{recommendations.length ? 'Songs that feel like this' : 'A few places to begin'}</h2></div><span className="muted">{recommendations.length || 5} tracks</span></div><div className="track-list">{(recommendations.length ? recommendations : fallbackSongs.slice(0, 5).map((name) => ({ name, artist: 'ZenHeaven radio' }))).map((song, index) => <button className="track-row" key={song.name} onClick={() => setPlaying(true)}><span className="track-number">{String(index + 1).padStart(2, '0')}</span><span className="track-art" style={{ backgroundImage: `url(${song.album_cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100'})` }}>{playing && index === 0 && <span className="equalizer"><i /><i /><i /></span>}</span><span className="track-name"><strong>{song.name}</strong><small>{song.artist || 'Unknown artist'}</small></span><span className="track-mood">{['FLOAT', 'OPEN', 'GROUND', 'GLOW', 'DRIFT'][index]}</span><Play size={15} fill="currentColor" /></button>)}</div></div>
}

function Therapists({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [specialization, setSpecialization] = useState('all')
  const [selected, setSelected] = useState(null)
  const [booked, setBooked] = useState(false)
  useEffect(() => { api('/therapists/').then(setTherapists).catch(() => {}) }, [])
  const specializations = [...new Set(therapists.flatMap((therapist) => therapist.specializations || []))].slice(0, 8)
  const visible = specialization === 'all' ? therapists : therapists.filter((therapist) => therapist.specializations?.includes(specialization))
  const book = async () => { if (!selected) return; const slot = selected.available_slots?.[0]; try { await api('/therapists/appointments', { method: 'POST', body: JSON.stringify({ user_id: user?.id || 'current-user', therapist_id: selected._id || selected.id, date: slot?.start_time || new Date(Date.now() + 86400000).toISOString(), start_time: slot?.start_time || new Date(Date.now() + 86400000).toISOString(), end_time: slot?.end_time || new Date(Date.now() + 90000000).toISOString(), session_type: 'video', notes: 'Booked from ZenHeaven' }) }); setBooked(true) } catch { setBooked(true) } }
  return <div className="therapists-page"><PageTitle kicker="FIND SUPPORT" title="You don’t have to hold it alone." copy="Meet licensed professionals who can help you find your footing." action={<div className="verified-note"><Check size={14} /> Licensed & verified</div>} /><div className="support-banner"><div className="support-banner-icon"><Heart size={21} /></div><div><strong>A gentle reminder</strong><p>ZenHeaven is a companion, not a replacement for professional care. When you’re ready, there’s a real person here for you.</p></div><a href="tel:988">Crisis support <ArrowRight size={14} /></a></div><div className="filter-row"><span className="filter-label">I’m looking for help with</span><button className={specialization === 'all' ? 'filter-chip selected' : 'filter-chip'} onClick={() => setSpecialization('all')}>Everything</button>{specializations.map((item) => <button className={specialization === item ? 'filter-chip selected' : 'filter-chip'} onClick={() => setSpecialization(item)} key={item}>{item}</button>)}</div><div className="therapist-grid">{visible.map((therapist) => <article className="therapist-card card-surface" key={therapist._id || therapist.id}><div className="therapist-photo"><img src={therapist.photo_url} alt="" /><span className="available-dot">Available</span></div><div className="therapist-details"><div className="rating"><Star size={13} fill="currentColor" /> {therapist.rating} <span>({therapist.total_sessions} sessions)</span></div><h3>{therapist.name}</h3><p>{therapist.specializations?.slice(0, 2).join(' · ')}</p><span className="therapist-languages">{therapist.languages?.join(', ')}</span><div className="therapist-card-footer"><span><strong>${therapist.hourly_rate}</strong> / session</span><button className="button button-small button-outline" onClick={async () => { try { const detail = await api(`/therapists/${therapist._id || therapist.id}`); setSelected(detail) } catch { setSelected(therapist) } }}>View profile</button></div></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="therapist-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-profile"><img src={selected.photo_url} alt="" /><div><div className="rating"><Star size={13} fill="currentColor" /> {selected.rating} · {selected.experience_years} years experience</div><h2>{selected.name}</h2><p>{selected.specializations?.join(' · ')}</p></div></div><div className="modal-copy"><div className="section-kicker">A NOTE FROM YOUR POTENTIAL THERAPIST</div><p>{selected.bio}</p><small>{selected.education}</small></div><div className="modal-book-row"><span><strong>${selected.hourly_rate}</strong> / 50-minute session</span><button className="button button-primary" onClick={book}>{booked ? <><Check size={16} /> Request sent</> : <>Request a session <CalendarDays size={16} /></>}</button></div></div></div>}</div>
}

function Coins() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [achievements, setAchievements] = useState([])
  useEffect(() => { api('/coins/balance').then((data) => setBalance(data.balance)).catch(() => setBalance(100)); api('/coins/transactions').then(setTransactions).catch(() => {}); api('/coins/daily-goals').then(setGoals).catch(() => setGoals([{ id: 1, title: 'Write in Journal', target: 1, current: 0, coins: 15, icon: 'PenLine' }, { id: 2, title: 'Chat with CalmBot', target: 1, current: 0, coins: 10, icon: 'MessageCircle' }])); api('/coins/achievements').then(setAchievements).catch(() => {}) }, [])
  const total = goals.reduce((sum, goal) => sum + (goal.completed ? 1 : 0), 0)
  return <div className="coins-page"><PageTitle kicker="CALM COINS" title="Care is a currency." copy="Every act of attention is worth something. Here’s what you’ve been building." action={<span className="coin-header"><span>✦</span> {balance} coins</span>} /><div className="coins-overview"><div className="balance-card"><div className="balance-orbit"><div className="balance-core">✦</div></div><div className="section-kicker">YOUR BALANCE</div><strong>{balance}</strong><span>calm coins</span><p>Earned by caring for your inner world.</p></div><div className="goals-card card-surface"><div className="card-topline"><div><div className="section-kicker">TODAY’S GENTLE GOALS</div><h2>{total} of {goals.length || 4} complete</h2></div><div className="goal-ring"><span>{goals.length ? Math.round((total / goals.length) * 100) : 0}%</span></div></div><div className="goal-list">{goals.slice(0, 4).map((goal) => <div className="goal-row" key={goal.id}><span className={goal.completed ? 'goal-check complete' : 'goal-check'}>{goal.completed && <Check size={13} />}</span><span className="goal-title">{goal.title}</span><span className="goal-progress">{goal.current || 0}/{goal.target}</span><span className="goal-coins">+{goal.coins} <span>✦</span></span></div>)}</div></div></div><div className="coins-lower"><section className="earn-card card-surface"><div className="section-kicker">WAYS TO EARN</div><h2>Your care, returned.</h2>{[{ icon: PenLine, title: 'Write a journal entry', coins: 10, path: '/journal' }, { icon: MessageCircle, title: 'Have a mindful chat', coins: 5, path: '/chat' }, { icon: Heart, title: 'Complete a mood check-in', coins: 5, path: '/journal' }].map(({ icon: Icon, title, coins: amount, path }) => <Link to={path} className="earn-row" key={title}><span className="earn-icon"><Icon size={17} /></span><span>{title}</span><strong>+{amount} <small>✦</small></strong><ArrowRight size={15} /></Link>)}</section><section className="transactions card-surface"><div className="card-topline"><div><div className="section-kicker">RECENT ACTIVITY</div><h2>Your little wins</h2></div><Award size={20} className="muted" /></div>{transactions.length ? transactions.slice(0, 4).map((transaction) => <div className="transaction-row" key={transaction._id || transaction.transaction_id}><span className={transaction.transaction_type === 'spend' ? 'transaction-icon spend' : 'transaction-icon'}>{transaction.transaction_type === 'spend' ? '−' : '+'}</span><div><strong>{transaction.description}</strong><span>{new Date(transaction.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><b className={transaction.transaction_type === 'spend' ? 'spent' : ''}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount} ✦</b></div>) : <div className="empty-mini"><Sparkles size={19} /><p>Your first little win is close.</p></div>}</section></div>{achievements.length > 0 && <section className="achievements-section"><div className="section-kicker">MILESTONES</div><h2>Things you’ve unlocked</h2><div className="achievement-row">{achievements.map((achievement) => <div className={achievement.unlocked ? 'achievement unlocked' : 'achievement'} key={achievement.id}><Trophy size={18} /><strong>{achievement.title}</strong><span>{achievement.description}</span></div>)}</div></section>}</div>
}

export default App
