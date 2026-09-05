import { createElement, useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BookOpen, Bot, Brain, Check, ChevronDown, CircleHelp,
  Coins, Compass, Headphones, Heart, Leaf, Library, LoaderCircle, LockKeyhole,
  LogOut, Menu, MessageCircle, Mic, Music2, Plus, Search, Send, Settings2, ShieldCheck,
  Sparkles, Star, Stethoscope, Trash2, TrendingUp, UserRound, Users, X, Zap,
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const fallbackThreads = [{ id: 'demo', title: 'A quiet place to begin', last_message: 'Your space is ready whenever you are.', message_count: 2 }]
const fallbackJournals = [
  { _id: 'a', title: 'A slower morning', content: 'I made room for a quiet coffee and the day felt possible again.', mood: 'calm', created_at: new Date().toISOString(), tags: ['mindfulness'] },
]

async function api(path, options = {}) {
  const token = localStorage.getItem('zen_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zen_user') || 'null'))
  const login = (payload) => {
    localStorage.setItem('zen_token', payload.access_token)
    localStorage.setItem('zen_user', JSON.stringify(payload.user))
    setUser(payload.user)
  }
  const logout = () => {
    localStorage.removeItem('zen_token')
    localStorage.removeItem('zen_user')
    setUser(null)
  }
  return { user, login, logout }
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Compass },
  { to: '/chat', label: 'CalmBot', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Reading room', icon: Library },
  { to: '/music', label: 'Soundscape', icon: Headphones },
  { to: '/therapists', label: 'Care network', icon: Users },
  { to: '/coins', label: 'Calm Coins', icon: Coins },
]

function Logo({ light = false }) {
  return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`}><span className="logo-mark"><span /></span><span>zenheaven</span></Link>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function App() {
  const auth = useAuth()
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<AuthPage mode="login" onAuth={auth.login} />} />
    <Route path="/register" element={<AuthPage mode="register" onAuth={auth.login} />} />
    <Route element={<AppShell user={auth.user} logout={auth.logout} />}>
      <Route path="/dashboard" element={<Dashboard user={auth.user} />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/books" element={<Books />} />
      <Route path="/music" element={<Music />} />
      <Route path="/therapists" element={<Therapists user={auth.user} />} />
      <Route path="/coins" element={<CoinsPage />} />
    </Route>
  </Routes>
}

function Landing() {
  return <div className="landing">
    <header className="landing-nav page-width">
      <Logo light />
      <nav className="landing-links"><a href="#method">The method</a><a href="#care">Care network</a><a href="#signal">Our signal</a></nav>
      <div className="landing-actions"><Link to="/login" className="text-link">Sign in <ArrowUpRight size={14} /></Link><Link to="/register"><Button variant="light">Open a space <ArrowRight size={15} /></Button></Link></div>
    </header>
    <main>
      <section className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow light-eyebrow"><span className="pulse-dot" /> private by design <span className="eyebrow-line" /> v.02.25</div>
          <h1>Your mind<br /><em>deserves</em> room.</h1>
          <p className="hero-lede">ZenHeaven is a quiet layer for the moments between. Notice what is here. Find your next steady step.</p>
          <div className="hero-ctas"><Link to="/register"><Button variant="light">Begin gently <ArrowRight size={17} /></Button></Link><a href="#method" className="circle-link"><span>Explore the layer</span><span className="circle-arrow"><ArrowDownIcon /></span></a></div>
          <div className="hero-note"><ShieldCheck size={16} /> Your data stays yours. Always.</div>
        </div>
        <div className="hero-art" aria-label="Abstract blue orb">
          <div className="orb-grid" /><div className="orb-glow" /><div className="orb"><div className="orb-core" /><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /></div>
          <div className="orb-label label-top"><span>signal / 01</span><strong>present</strong></div>
          <div className="orb-label label-bottom"><span>layer state</span><strong>steady <i /></strong></div>
          <div className="orbit-text">HEAVEN // MIND // BODY // HEAVEN // MIND // BODY</div>
        </div>
      </section>
      <div className="ticker"><div className="ticker-track"><span>LESS NOISE</span><i>✦</i><span>MORE NOTICE</span><i>✦</i><span>SMALL STEPS</span><i>✦</i><span>LESS NOISE</span><i>✦</i><span>MORE NOTICE</span><i>✦</i><span>SMALL STEPS</span></div></div>
      <section id="method" className="method page-width">
        <div className="section-intro"><div className="eyebrow"><span>01</span> / how it works</div><h2>A softer kind<br />of <em>infrastructure.</em></h2></div>
        <div className="method-grid"><MethodCard number="01" icon={MessageCircle} title="Talk it out" copy="A thoughtful conversation, available when you need a little less alone." /><MethodCard number="02" icon={BookOpen} title="Make a note" copy="A private place to put the day down. Patterns become visible over time." /><MethodCard number="03" icon={Compass} title="Find your way" copy="Books, music, and real humans — all tuned to where you are right now." /></div>
      </section>
      <section id="signal" className="signal-band"><div className="page-width signal-inner"><div className="signal-copy"><div className="eyebrow light-eyebrow"><span>02</span> / a different signal</div><h2>Not optimized<br />for <em>more.</em></h2><p>Most platforms ask you to keep up. ZenHeaven asks a better question: what would support look like today?</p><Link to="/register" className="arrow-link">Step inside <ArrowRight size={17} /></Link></div><div className="signal-stat"><span className="stat-big">7.4<span>k</span></span><span className="stat-label">small steps taken<br />this week</span><div className="stat-bars"><i /><i /><i /><i /><i /><i /><i /></div></div></div></section>
      <section id="care" className="care-callout page-width"><div className="eyebrow"><span>03</span> / when you need more</div><div><h2>There is a human<br />on the other side.</h2><p>Connect with licensed therapists who understand that care is not one-size-fits-all.</p></div><Link to="/therapists" className="round-button"><ArrowUpRight size={21} /></Link></section>
    </main>
    <footer className="landing-footer page-width"><Logo light /><span>© 2025 ZenHeaven / built for becoming</span><span className="footer-status"><i /> systems feeling good</span></footer>
  </div>
}

function ArrowDownIcon() { return <ArrowRight size={15} style={{ transform: 'rotate(90deg)' }} /> }
function MethodCard({ number, icon, title, copy }) {
  return <article className="method-card"><div className="card-top"><span>{number}</span>{createElement(icon, { size: 20 })}</div><h3>{title}</h3><p>{copy}</p><ArrowUpRight className="card-arrow" size={18} /></article>
}

function AppShell({ user, logout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="side-brand"><Logo /><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={19} /></button></div>
      <div className="side-section-label">your space</div>
      <nav className="side-nav">{navItems.map(({ to, label, icon }) => <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><span>{createElement(icon, { size: 17 })}</span><span>{label}</span>{to === '/chat' && <i className="nav-live" />}</NavLink>)}</nav>
      <div className="side-bottom"><div className="side-help"><CircleHelp size={17} /><span>Need support?</span><ArrowUpRight size={14} /></div><div className="side-profile"><div className="avatar">{(user?.username || 'G').slice(0, 1).toUpperCase()}</div><div><strong>{user?.full_name || user?.username || 'Guest mind'}</strong><span>personal space</span></div><button onClick={() => { logout(); navigate('/') }} title="Sign out"><LogOut size={15} /></button></div></div>
    </aside>
    {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    <div className="main-shell">
      <header className="app-topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumbs"><span>zenheaven</span><span>/</span><strong>{navItems.find((n) => location.pathname.startsWith(n.to))?.label || 'space'}</strong></div><div className="top-actions"><div className="coin-pill"><Coins size={14} /><span>{user?.calm_coins ?? 100}</span><small>calm coins</small></div><button className="icon-button"><Settings2 size={17} /></button></div></header>
      <main className="app-content"><Outlet /></main>
    </div>
  </div>
}

function PageHead({ eyebrow, title, children }) {
  return <div className="page-head"><div><div className="eyebrow"><span>{eyebrow}</span> / zenheaven</div><h1>{title}</h1></div>{children}</div>
}
function Loading() { return <div className="loading"><LoaderCircle className="spin" size={22} /><span>syncing your space</span></div> }
function ErrorNote({ message }) { return <div className="error-note"><Zap size={16} /> {message || 'The layer is taking a breath. Try again shortly.'}</div> }
function EmptyState({ icon = Sparkles, title, copy }) { return <div className="empty-state">{createElement(icon, { size: 25 })}<h3>{title}</h3><p>{copy}</p></div> }

function Dashboard({ user }) {
  const [data, setData] = useState({ threads: fallbackThreads, journals: fallbackJournals, balance: user?.calm_coins ?? 100, streak: 4 })
  useEffect(() => {
    Promise.allSettled([api('/mental-health/threads'), api('/journal/entries'), api('/coins/balance'), api('/coins/streak')]).then(([threads, journals, balance, streak]) => setData({
      threads: threads.status === 'fulfilled' ? threads.value.threads : fallbackThreads,
      journals: journals.status === 'fulfilled' ? journals.value : fallbackJournals,
      balance: balance.status === 'fulfilled' ? balance.value.balance : user?.calm_coins ?? 100,
      streak: streak.status === 'fulfilled' ? streak.value.current_streak : 4,
    }))
  }, [user])
  return <div className="dashboard page-wrap"><PageHead eyebrow="00 / overview" title={<>Good to see you, <em>{user?.full_name?.split(' ')[0] || user?.username || 'friend'}.</em></>}><Link to="/chat"><Button>Start a conversation <ArrowRight size={16} /></Button></Link></PageHead>
    <div className="dashboard-grid"><section className="welcome-panel panel-blue"><div className="panel-kicker"><span className="pulse-dot" /> live layer</div><h2>How are you<br /><em>arriving</em> today?</h2><p>There is no right answer. Just a place to start.</p><Link to="/chat" className="panel-action">Talk to CalmBot <ArrowUpRight size={16} /></Link><div className="panel-orbit" /></section>
      <section className="stat-panel panel"><div className="panel-label">your rhythm <TrendingUp size={15} /></div><div className="stat-value">{data.streak}<small>days</small></div><p>of showing up for yourself</p><div className="mini-week">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={`${d}-${i}`} className={i < data.streak ? 'filled' : ''}>{d}<i /></span>)}</div></section>
      <section className="stat-panel panel"><div className="panel-label">calm coins <Coins size={15} /></div><div className="stat-value">{data.balance}<small>cc</small></div><p>available to spend on care</p><Link to="/coins" className="text-arrow">View your wallet <ArrowRight size={14} /></Link></section>
      <section className="recent-panel panel"><div className="section-row"><div><div className="panel-label">recent reflections</div><h3>Journal, in fragments.</h3></div><Link to="/journal" className="text-arrow">View all <ArrowRight size={14} /></Link></div>{data.journals.slice(0, 2).map((j) => <div className="reflection-row" key={j._id || j.id}><div className="mood-dot" /><div><strong>{j.title || 'A moment to remember'}</strong><span>{j.content}</span></div><time>{formatDate(j.created_at)}</time></div>)}</section>
      <section className="chat-preview panel"><div className="section-row"><div><div className="panel-label">your conversations</div><h3>Open threads.</h3></div><Link to="/chat" className="text-arrow">All threads <ArrowRight size={14} /></Link></div>{data.threads.slice(0, 2).map((thread) => <Link to={`/chat?thread=${thread.id}`} className="thread-row" key={thread.id}><div className="thread-icon"><MessageCircle size={16} /></div><div><strong>{thread.title}</strong><span>{thread.last_message || 'Continue where you left off.'}</span></div><ArrowRight size={15} /></Link>)}</section>
    </div>
  </div>
}

function formatDate(value) { if (!value) return 'today'; const date = new Date(value); return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }

function AuthPage({ mode, onAuth }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { const data = await api(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) }); onAuth(data); navigate('/dashboard') }
    catch (err) { setError(err.message); setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-top"><Logo light /><span>01 / entry point</span></div><div className="auth-art"><div className="auth-lines" /><div className="auth-orb" /></div><div className="auth-quote"><span>“</span><p>Nothing to fix.<br />Just something to notice.</p><small>— the ZenHeaven principle</small></div></div><div className="auth-form-wrap"><div className="auth-form-top"><Link to="/" className="back-link">← return to zenheaven</Link><span>{isRegister ? 'already here?' : 'new here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'sign in' : 'create space'}</Link></span></div><form className="auth-form" onSubmit={submit}><div className="eyebrow"><span>zenheaven</span> / {isRegister ? 'create account' : 'welcome back'}</div><h1>{isRegister ? <>Make room<br /><em>for yourself.</em></> : <>Welcome<br /><em>back in.</em></>}</h1><p className="form-intro">{isRegister ? 'A private space for the work of becoming.' : 'Your quiet layer is waiting.'}</p>{isRegister && <Field label="your name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} placeholder="What should we call you?" /> }<Field label="username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} placeholder="your handle" /><>{isRegister && <Field label="email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />}</><Field label="password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" />{error && <div className="form-error">{error}</div>}<Button className="submit-button" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17} /> : isRegister ? 'Create my space' : 'Enter my space'} {!busy && <ArrowRight size={16} />}</Button><div className="secure-note"><LockKeyhole size={13} /> encrypted, private, yours</div></form></div></div>
}

function Field({ label, value, onChange, placeholder, type = 'text' }) { return <label className="field"><span>{label}</span><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label> }

function Chat() {
  const [threads, setThreads] = useState(fallbackThreads)
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [sending, setSending] = useState(false)
  const location = useLocation()
  useEffect(() => { api('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  useEffect(() => { const id = new URLSearchParams(location.search).get('thread'); if (id) selectThread(id) }, [location.search])
  async function selectThread(id) { setActiveThread(id); try { const data = await api(`/mental-health/threads/${id}`); setMessages(data.messages || []) } catch { setMessages([]) } }
  async function sendMessage(event) {
    event?.preventDefault(); if (!input.trim() || sending) return
    const message = input.trim(); setInput(''); setSending(true); setThinking('opening a calm channel'); setMessages((current) => [...current, { id: `temp-${Date.now()}`, is_user: true, content: message }])
    try {
      const response = await fetch(`${API}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('zen_token')}` }, body: JSON.stringify({ message, thread_id: activeThread }) })
      if (!response.ok || !response.body) throw new Error('Unable to reach CalmBot')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let bot = ''
      setMessages((current) => [...current, { id: `bot-${Date.now()}`, is_user: false, content: '' }])
      while (true) {
        const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach((chunk) => { const line = chunk.split('\n').find((part) => part.startsWith('data:')); if (!line) return; try { const eventData = JSON.parse(line.slice(5)); if (eventData.type === 'thread_id') setActiveThread(eventData.data); if (eventData.type === 'thinking') setThinking(eventData.data); if (eventData.type === 'token') { bot += eventData.data; setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: bot } : item)) } if (eventData.type === 'complete') setThinking('') } catch { /* ignore partial event */ } })
      }
      api('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {})
    } catch { setMessages((current) => [...current, { id: `fallback-${Date.now()}`, is_user: false, content: 'I’m here with you. The connection is taking a moment, but you can keep writing and we’ll pick it up.' }]); setThinking('') }
    setSending(false)
  }
  return <div className="chat-page"><div className="chat-sidebar"><div className="chat-side-head"><div><div className="eyebrow"><span>your mind</span> / threads</div><h2>Conversations</h2></div><button className="square-add" onClick={() => { setActiveThread(null); setMessages([]) }}><Plus size={18} /></button></div><div className="thread-search"><Search size={15} /><input placeholder="Find a thread" /></div><div className="threads-list">{threads.map((thread) => <button key={thread.id} className={`thread-item ${activeThread === thread.id ? 'selected' : ''}`} onClick={() => selectThread(thread.id)}><span className="thread-status" /><div><strong>{thread.title}</strong><span>{thread.last_message || 'No messages yet'}</span></div><small>{thread.message_count || 0}</small></button>)}</div><div className="chat-side-foot"><ShieldCheck size={15} /> private conversation</div></div><div className="chat-window"><div className="chat-window-head"><div className="bot-identity"><div className="bot-avatar"><Bot size={20} /></div><div><strong>CalmBot <i /></strong><span>your thoughtful companion</span></div></div><button className="icon-button"><MoreDots /></button></div><div className="messages"><div className="chat-welcome"><div className="welcome-spark"><Sparkles size={23} /></div><h1>Take a breath.<br /><em>Start anywhere.</em></h1><p>This is a judgment-free zone. What feels most present for you today?</p><div className="prompt-chips">{['I feel a little overwhelmed', 'Help me slow down', 'I want to reflect'].map((prompt) => <button key={prompt} onClick={() => setInput(prompt)}>{prompt} <ArrowUpRight size={13} /></button>)}</div></div>{messages.map((message) => <div className={`message-row ${message.is_user ? 'user-message' : 'bot-message'}`} key={message.id}><div className="message-avatar">{message.is_user ? <UserRound size={15} /> : <Bot size={15} />}</div><div className="message-bubble">{message.content || <span className="typing"><i /><i /><i /></span>}</div></div>)}{thinking && <div className="thinking"><span className="thinking-dot" /> {thinking}</div>}</div><form className="chat-composer" onSubmit={sendMessage}><button type="button" className="composer-icon"><Plus size={18} /></button><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write what’s on your mind..." /><button type="button" className="composer-icon"><Mic size={17} /></button><button className="send-button" disabled={sending}><Send size={17} /></button></form><div className="composer-note">CalmBot is supportive, not a replacement for professional care. <a href="tel:988">Need urgent help?</a></div></div></div>
}
function MoreDots() { return <span className="more-dots"><i /><i /><i /></span> }

function Journal() {
  const [entries, setEntries] = useState(fallbackJournals); const [prompts, setPrompts] = useState([]); const [content, setContent] = useState(''); const [mood, setMood] = useState(''); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState('')
  const load = useCallback(() => { api('/journal/entries').then(setEntries).catch(() => {}); api('/journal/prompts').then(setPrompts).catch(() => {}) }, [])
  useEffect(load, [load])
  async function saveEntry(event) { event.preventDefault(); if (!content.trim()) return; setSaving(true); try { const entry = await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: [] }) }); setEntries((current) => [entry, ...current]); setContent(''); setMood(''); setNotice('+10 Calm Coins earned') } catch (err) { setNotice(err.message) } finally { setSaving(false) } }
  async function deleteEntry(id) { try { await api(`/journal/entries/${id}`, { method: 'DELETE' }); setEntries((current) => current.filter((item) => (item._id || item.id) !== id)) } catch { setNotice('This reflection could not be removed.') } }
  return <div className="page-wrap"><PageHead eyebrow="02 / reflect" title={<>The page is<br /><em>yours.</em></>}><div className="streak-badge"><span className="flame">✦</span><strong>4 day</strong><span>reflection rhythm</span></div></PageHead><div className="journal-grid"><section className="write-card panel"><div className="panel-label">new reflection <span>private by default</span></div><form onSubmit={saveEntry}><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What wants to be written down?" /><div className="write-footer"><div className="mood-select"><span>feeling</span>{['calm', 'hopeful', 'heavy', 'clear'].map((item) => <button type="button" key={item} onClick={() => setMood(item)} className={mood === item ? 'chosen' : ''}>{item}</button>)}</div><Button disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <>Save reflection <ArrowUpRight size={15} /></>}</Button></div></form>{notice && <div className="coin-notice"><Check size={14} /> {notice}</div>}</section><aside className="prompt-card"><div className="prompt-orb"><Sparkles size={19} /></div><div className="panel-label">a prompt for now</div><h3>{prompts[0]?.prompt || 'What made a little more space in your day?'}</h3><button onClick={() => setContent(prompts[0]?.prompt || '')}>Use this prompt <ArrowRight size={14} /></button></aside></div><div className="entries-section"><div className="section-row"><div><div className="eyebrow"><span>your archive</span> / {entries.length} entries</div><h2>Fragments of you.</h2></div><button className="filter-button">all moods <ChevronDown size={14} /></button></div><div className="entries-grid">{entries.map((entry) => <article className="entry-card" key={entry._id || entry.id}><div className="entry-top"><span className={`mood-tag mood-${entry.mood || 'calm'}`}>{entry.mood || 'unmarked'}</span><button onClick={() => deleteEntry(entry._id || entry.id)}><Trash2 size={14} /></button></div><h3>{entry.title || 'A quiet entry'}</h3><p>{entry.content}</p><time>{formatDate(entry.created_at)}</time></article>)}</div></div></div>
}

function Books() {
  const [books, setBooks] = useState([]); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [mood, setMood] = useState('your recent mood')
  useEffect(() => { api('/books/recommend-by-mood').then((data) => { setBooks(data.books || []); setMood(data.mood || 'balanced') }).catch(() => {}).finally(() => setLoading(false)) }, [])
  async function search(event) { event.preventDefault(); if (!query.trim()) return; setLoading(true); try { const data = await api(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); setBooks(data.books || []); setMood(`search: ${query}`) } catch { setMood('reading room unavailable') } finally { setLoading(false) } }
  return <div className="page-wrap"><PageHead eyebrow="03 / reframe" title={<>A good book<br /><em>can meet you.</em></>}><form className="search-form" onSubmit={search}><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the reading room" /><button><ArrowRight size={16} /></button></form></PageHead><div className="recommend-banner panel-blue"><div><span className="panel-kicker">curated for {mood}</span><h2>Stories that make<br />space for <em>possibility.</em></h2></div><div className="banner-mark"><BookOpen size={26} /></div></div><div className="section-row library-row"><div><div className="eyebrow"><span>the reading room</span> / recommendations</div><h2>Pick up a perspective.</h2></div><span className="result-count">{books.length} volumes</span></div>{loading ? <Loading /> : <div className="book-grid">{books.map((book) => <article className="book-card" key={book.id}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <div className="cover-placeholder"><Library size={27} /></div>}</div><div className="book-meta"><span>recommended read</span><h3>{book.title}</h3><p>{book.author}</p><button onClick={() => api(`/books/recommend/${book.id}`).catch(() => {})}>Explore similar <ArrowUpRight size={14} /></button></div></article>)}</div>}</div>
}

function Music() {
  const [songs, setSongs] = useState([]); const [recommendations, setRecommendations] = useState([]); const [selected, setSelected] = useState(''); const [loading, setLoading] = useState(true)
  useEffect(() => { api('/songs').then((data) => setSongs((data.songs || []).slice(0, 12))).catch(() => {}).finally(() => setLoading(false)) }, [])
  async function recommend() { if (!selected) return; setLoading(true); try { const data = await api(`/recommend?song=${encodeURIComponent(selected)}`); setRecommendations(data.recommendations || []) } catch { setRecommendations([]) } finally { setLoading(false) } }
  return <div className="page-wrap music-page"><PageHead eyebrow="04 / regulate" title={<>Find your<br /><em>frequency.</em></>}><div className="now-playing"><div className="sound-bars"><i /><i /><i /><i /><i /></div><span>soundscape / open</span></div></PageHead><div className="music-hero panel"><div className="vinyl"><div className="vinyl-label"><Music2 size={25} /></div></div><div className="music-hero-copy"><div className="panel-label">your listening room</div><h2>Some days need<br /><em>a softer soundtrack.</em></h2><p>Choose a song you already love. We’ll find what might hold the same feeling.</p><div className="music-picker"><select value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Choose a song from the room</option>{songs.map((song) => <option key={song} value={song}>{song}</option>)}</select><Button onClick={recommend}>Tune in <ArrowRight size={15} /></Button></div></div></div>{recommendations.length > 0 && <><div className="section-row music-list-head"><div><div className="eyebrow"><span>because you chose</span> / {selected}</div><h2>Follow the feeling.</h2></div></div><div className="song-list">{recommendations.map((song, index) => <div className="song-row" key={`${song.name}-${index}`}><span className="song-index">0{index + 1}</span><div className="album-art">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={16} />}</div><div className="song-info"><strong>{song.name}</strong><span>{song.artist}</span></div><button onClick={() => song.spotify_uri && window.open(`https://open.spotify.com/track/${song.spotify_uri.split(':').pop()}`, '_blank')}><ArrowUpRight size={16} /></button></div>)}</div></>}{loading && <Loading />}</div>
}

function Therapists() {
  const [therapists, setTherapists] = useState([]); const [selected, setSelected] = useState(null); const [specialization, setSpecialization] = useState(''); const [notice, setNotice] = useState('')
  useEffect(() => { api(`/therapists/${specialization ? `?specialization=${encodeURIComponent(specialization)}` : ''}`).then(setTherapists).catch(() => {}) }, [specialization])
  return <div className="page-wrap"><PageHead eyebrow="05 / connect" title={<>Care, with<br /><em>context.</em></>}><div className="verified-badge"><ShieldCheck size={16} /><span>licensed practitioners</span></div></PageHead><div className="care-intro"><p>When self-guided support isn’t quite enough, find a person who can listen with you.</p><div className="care-filters"><select value={specialization} onChange={(e) => setSpecialization(e.target.value)}><option value="">All specialties</option><option>Anxiety</option><option>Depression</option><option>Trauma</option><option>Relationships</option><option>Grief & Loss</option></select><span>{therapists.length || '—'} practitioners</span></div></div>{notice && <div className="coin-notice"><Check size={14} /> {notice}</div>}<div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="therapist-photo">{therapist.photo_url ? <img src={therapist.photo_url} alt="" /> : <UserRound size={31} />}</div><div className="therapist-details"><div className="therapist-rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'} <span>· {therapist.experience_years} years</span></div><h3>{therapist.name}</h3><p>{therapist.bio}</p><div className="tag-row">{(therapist.specializations || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><button onClick={() => setSelected(therapist)}>View availability <ArrowRight size={14} /></button></div></article>)}</div>{therapists.length === 0 && <EmptyState icon={Stethoscope} title="Care network is loading" copy="Connect the API to see practitioners near your context." />}{selected && <Modal onClose={() => setSelected(null)}><div className="modal-eyebrow">booking / {selected.name}</div><h2>Choose a time<br /><em>that feels right.</em></h2><p className="modal-copy">{selected.bio}</p><div className="slots">{[1, 2, 3, 4].map((slot) => <button key={slot} onClick={() => { setNotice('Availability request noted — we’ll hold the space for you.'); setSelected(null) }}>Tomorrow · {slot + 8}:00 AM <ArrowRight size={14} /></button>)}</div><small>Sessions are {selected.hourly_rate ? `$${selected.hourly_rate}/hour` : 'priced transparently'} · video by default</small></Modal>}</div>
}
function Modal({ children, onClose }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={17} /></button>{children}</div></div> }

function CoinsPage() {
  const [balance, setBalance] = useState(100); const [transactions, setTransactions] = useState([]); const [goals, setGoals] = useState([]); const [achievements, setAchievements] = useState([])
  useEffect(() => { Promise.allSettled([api('/coins/balance'), api('/coins/transactions'), api('/coins/daily-goals'), api('/coins/achievements')]).then(([b, t, g, a]) => { if (b.status === 'fulfilled') setBalance(b.value.balance); if (t.status === 'fulfilled') setTransactions(t.value); if (g.status === 'fulfilled') setGoals(g.value); if (a.status === 'fulfilled') setAchievements(a.value) }) }, [])
  return <div className="page-wrap"><PageHead eyebrow="06 / reward presence" title={<>A little energy<br /><em>returned.</em></>}><div className="coin-header"><Coins size={17} /><span>calm coin wallet</span></div></PageHead><div className="wallet-grid"><section className="wallet-card panel-blue"><div className="panel-kicker">available balance</div><div className="wallet-balance">{balance}<span>cc</span></div><p>Use coins to unlock deeper support and celebrate showing up.</p><div className="wallet-foot"><span>1 cc = one small step</span><Coins size={18} /></div></section><section className="goal-card panel"><div className="panel-label">today’s gentle goals</div>{(goals.length ? goals : [{ id: 1, title: 'Chat with CalmBot', current: 0, target: 1, coins: 10 }, { id: 2, title: 'Write in your journal', current: 0, target: 1, coins: 15 }, { id: 3, title: 'Complete a mood check', current: 0, target: 1, coins: 5 }]).map((goal) => <div className="goal-row" key={goal.id}><div className={`goal-check ${goal.completed ? 'done' : ''}`}>{goal.completed && <Check size={12} />}</div><div><strong>{goal.title}</strong><span>{goal.current}/{goal.target} complete</span></div><b>+{goal.coins}</b></div>)}</section></div><div className="wallet-lower"><section><div className="section-row"><div><div className="eyebrow"><span>your activity</span> / ledger</div><h2>Every step counts.</h2></div></div><div className="transactions">{transactions.length === 0 ? <EmptyState icon={TrendingUp} title="Your ledger starts here" copy="Complete a reflection or conversation to see your first entry." /> : transactions.map((transaction) => <div className="transaction-row" key={transaction._id}><div className="transaction-icon"><Zap size={15} /></div><div><strong>{transaction.description}</strong><span>{formatDate(transaction.timestamp)} · {transaction.source}</span></div><b className={transaction.transaction_type === 'spend' ? 'spent' : ''}>{transaction.transaction_type === 'spend' ? '' : '+'}{transaction.amount} cc</b></div>)}</div></section><section className="achievements"><div className="eyebrow"><span>milestones</span> / unlocked</div><h2>Quiet wins.</h2>{(achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental health journey', unlocked: true, icon: Star }, { title: 'Consistent chatter', description: 'Chat for 7 days in a row', unlocked: false, icon: MessageCircle }, { title: 'Wellness warrior', description: 'Earn 1,000 total coins', unlocked: false, icon: Zap }]).map((item, i) => <div className={`achievement ${item.unlocked ? 'unlocked' : ''}`} key={item.id || i}><div className="achievement-icon">{item.unlocked ? <Check size={15} /> : <LockKeyhole size={14} />}</div><div><strong>{item.title}</strong><span>{item.description}</span></div></div>)}</section></div></div>
}

export default App
