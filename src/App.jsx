/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Coins as CoinsIcon,
  Compass,
  Hash,
  Heart,
  Home,
  Library,
  LogOut,
  Menu,
  MessageCircle,
  Music2,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const FALLBACK_THREADS = [
  { id: 'welcome', title: 'Finding a little more ease', last_message: 'You deserve room to breathe today.', updated_at: new Date().toISOString(), message_count: 4 },
  { id: 'sleep', title: 'Resetting my sleep rhythm', last_message: 'Small rituals can make nights softer.', updated_at: new Date(Date.now() - 86400000).toISOString(), message_count: 8 },
]
const FALLBACK_MESSAGES = [
  { id: 'welcome-1', is_user: false, content: 'Hey, I’m CalmBot. This is a judgment-free space to untangle what’s on your mind. What would feel supportive right now?', timestamp: new Date().toISOString() },
]
const NAV_ITEMS = [
  { to: '/dashboard', label: 'overview', icon: Home },
  { to: '/chat', label: 'calmbot', icon: MessageCircle },
  { to: '/journal', label: 'journal', icon: BookOpen },
  { to: '/books', label: 'reading room', icon: Library },
  { to: '/music', label: 'mood radio', icon: Music2 },
  { to: '/therapists', label: 'care team', icon: Stethoscope },
  { to: '/coins', label: 'calm coins', icon: CoinsIcon },
]
const MEMBERS = [
  { name: 'Maya Chen', handle: 'breathing through it', initials: 'MC', color: 'purple' },
  { name: 'Arjun Rao', handle: 'one day at a time', initials: 'AR', color: 'orange' },
  { name: 'Sofia Lin', handle: 'finding the bright side', initials: 'SL', color: '' },
  { name: 'Noah Williams', handle: 'listening in', initials: 'NW', color: 'purple', idle: true },
]
const MOODS = ['calm', 'hopeful', 'anxious', 'tired', 'grateful', 'overwhelmed']

async function apiFetch(path, options = {}, token = '') {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const error = await response.json()
      message = error.detail || message
    } catch {
      // Keep the useful status message when the API does not return JSON.
    }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

const AuthContext = createContext(null)
function useAuth() { return useContext(AuthContext) }

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('zenheaven_token') || '')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zenheaven_user') || 'null') } catch { return null }
  })
  const [authError, setAuthError] = useState('')

  const persist = (data) => {
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('zenheaven_token', data.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(data.user))
  }
  const authenticate = async (mode, values) => {
    setAuthError('')
    try {
      const data = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(values) })
      persist(data)
      return true
    } catch (error) {
      setAuthError(error.message || 'Unable to connect to ZenHeaven right now.')
      return false
    }
  }
  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
  }
  const value = { token, user, authError, login: (v) => authenticate('login', v), register: (v) => authenticate('register', v), logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Brand({ compact = false }) {
  return <Link to="/" className="brand" aria-label="ZenHeaven home">
    <span className="brand-mark"><Sparkles size={15} /></span>
    {!compact && <span className="brand-title">zenheaven</span>}
  </Link>
}

function Rail() {
  return <aside className="icon-rail">
    <Link to="/" className="server-button" title="ZenHeaven server"><small>ZH</small></Link>
    <div className="rail-divider" />
    <NavLink to="/dashboard" className={({ isActive }) => `rail-button ${isActive ? 'active' : ''}`} title="Overview"><Home size={18} /></NavLink>
    <NavLink to="/chat" className={({ isActive }) => `rail-button ${isActive ? 'active' : ''}`} title="CalmBot"><MessageCircle size={18} /></NavLink>
    <NavLink to="/journal" className={({ isActive }) => `rail-button ${isActive ? 'active' : ''}`} title="Journal"><BookOpen size={18} /></NavLink>
    <div style={{ flex: 1 }} />
    <button className="rail-button" title="Help"><CircleHelp size={17} /></button>
    <NavLink to="/login" className="rail-button" title="Profile"><UserRound size={17} /></NavLink>
  </aside>
}

function SidePanel() {
  const { user, logout } = useAuth()
  return <aside className="side-panel">
    <Brand />
    <div className="section-label">channels <Plus size={13} /></div>
    <nav className="channel-list">
      <NavLink to="/" end className={({ isActive }) => `channel-link ${isActive ? 'active' : ''}`}><Hash size={15} /> lobby</NavLink>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `channel-link ${isActive ? 'active' : ''}`}><Icon size={15} /> {label}</NavLink>)}
    </nav>
    <div className="section-label" style={{ marginTop: 30 }}>server guide <ChevronRight size={13} /></div>
    <div className="channel-list">
      <Link className="channel-link" to="/dashboard"><Compass size={15} /> start here</Link>
      <Link className="channel-link" to="/therapists"><ShieldCheck size={15} /> safety & support</Link>
    </div>
    <div className="side-footer-wrap">
      <div className="side-foot">
        <span className="avatar">{(user?.username || 'you').slice(0, 2).toUpperCase()}</span>
        <div className="user-meta"><strong>{user?.username || 'guest listener'}</strong><span>quietly online</span></div>
        {user ? <button className="ghost-btn" style={{ padding: 5, minHeight: 25, border: 0 }} onClick={logout}><LogOut size={13} /></button> : <Link to="/login" className="ghost-btn" style={{ padding: 5, minHeight: 25, border: 0 }}><ArrowRight size={13} /></Link>}
      </div>
    </div>
  </aside>
}

function MemberRail() {
  return <aside className="right-rail">
    <div className="rail-heading"><h3>gentle company</h3><span className="online-count">24 online</span></div>
    <div className="member-group">
      <div className="member-label">listening now — 4</div>
      {MEMBERS.slice(0, 3).map((member) => <Member key={member.name} {...member} />)}
    </div>
    <div className="member-group">
      <div className="member-label">taking it slow — 1</div>
      <Member {...MEMBERS[3]} />
    </div>
    <div className="surface-card" style={{ padding: 14, marginTop: 25, background: '#1d2028' }}>
      <div className="eyebrow">a small reminder</div>
      <p style={{ margin: '10px 0 0', color: '#9aa2b4', fontSize: 11, lineHeight: 1.6 }}>You don’t have to be productive to deserve care.</p>
    </div>
  </aside>
}

function Member({ name, handle, initials, color, idle }) {
  return <div className="member-row"><span className={`avatar ${color}`}>{initials}</span><div className="member-name"><strong>{name}</strong><span>{handle}</span></div><span className={`status-dot ${idle ? 'idle' : ''}`} /></div>
}

function AppLayout() {
  const location = useLocation()
  const current = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))
  return <div className="app-shell"><div className="app-grid"><Rail /><SidePanel /><main className="main-content">
    <header className="topbar">
      <div className="topbar-title"><Hash size={17} /> {current?.label || 'lobby'}</div>
      <div className="topbar-actions"><button className="ghost-btn"><Search size={14} /> <span className="hide-mobile">search server</span></button><Link className="ghost-btn" to="/login"><UserRound size={14} /></Link><button className="ghost-btn mobile-only"><Menu size={14} /></button></div>
    </header>
    <Outlet />
  </main><MemberRail /></div></div>
}

function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function PageTitle({ eyebrow, title, description, action }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Landing() {
  return <div className="content-scroll">
    <div className="hero-grid">
      <section className="hero"><div className="eyebrow">zenheaven / lobby</div><h1>A quieter corner of the internet.</h1><p>A gentle community server for checking in with yourself, finding supportive tools, and taking the next small step.</p><div className="hero-actions"><Link to="/register" className="primary-btn">join the community <ArrowRight size={14} /></Link><Link to="/dashboard" className="ghost-btn">explore the rooms</Link></div></section>
      <section className="signal-card"><div><div className="pulse">all systems gentle</div><h3>you belong here.</h3><p>Come as you are. Leave the performance at the door.</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 26 }}><span className="avatar">ZH</span><span style={{ color: '#8ca296', fontSize: 10 }}>24 people are here now</span></div></section>
    </div>
    <div className="section-heading"><div><h2>rooms for your wellbeing</h2><p>Drop into whatever feels useful today.</p></div><Link to="/dashboard" className="text-link">see all <ChevronRight size={13} /></Link></div>
    <div className="feature-grid">
      <Feature icon={MessageCircle} title="calmbot" body="A compassionate AI listener for the thoughts that feel too loud." to="/chat" />
      <Feature icon={BookOpen} title="journal" body="Put the day down somewhere safe. Track your patterns without judgment." to="/journal" />
      <Feature icon={Music2} title="mood radio" body="Soundtracks for your nervous system, matched to the moment." to="/music" />
    </div>
    <div className="section-heading"><div><h2>the community rhythm</h2><p>Small rituals add up to a softer week.</p></div></div>
    <div className="dashboard-grid"><div className="surface-card"><div className="card-head"><div><h3>weekly check-ins</h3><p>your gentle consistency, not a scorecard</p></div><BarChart3 size={17} color="#838cff" /></div><div className="metric">4 <span className="metric-label">days present</span></div><div className="progress-track"><div className="progress-value" style={{ width: '57%' }} /></div><p style={{ color: '#747d90', fontSize: 10, margin: '9px 0 0' }}>2 more check-ins to reach this week’s soft goal</p></div><div className="surface-card"><div className="card-head"><div><h3>today in zenheaven</h3><p>the latest little moments</p></div><Zap size={17} color="#f1cc72" /></div><Activity title="Maya shared a breathing win" time="8m" /><Activity title="New prompt in journal" time="1h" /><Activity title="3 people joined mood radio" time="3h" /></div></div>
  </div>
}

function Feature({ icon: Icon, title, body, to }) {
  return <Link to={to} className="feature-card"><div className="feature-icon"><Icon size={17} /></div><h3>{title}</h3><p>{body}</p></Link>
}
function Activity({ title, time }) {
  return <div className="activity-row"><span className="activity-dot" /><div><strong>{title}</strong><span>in the ZenHeaven server</span></div><span className="activity-time">{time}</span></div>
}

function Dashboard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(user?.calm_coins || 0)
  useEffect(() => { if (user) apiFetch('/coins/balance', {}, localStorage.getItem('zenheaven_token') || '').then((data) => setBalance(data.balance)).catch(() => {}) }, [user])
  return <div className="content-scroll"><PageTitle eyebrow="server / overview" title={`Good to see you, ${user?.full_name || user?.username || 'friend'}.`} description="A small snapshot of your wellbeing space. There is no perfect way to use it." action={<Link to="/chat" className="primary-btn">check in <MessageCircle size={14} /></Link>} /><div className="dashboard-grid"><div className="surface-card"><div className="card-head"><div><h2>your rhythm</h2><p>the things you’ve made space for lately</p></div><Heart size={18} color="#ff9f94" /></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}><div><div className="metric">4</div><div className="metric-label">check-ins</div></div><div><div className="metric">{balance}</div><div className="metric-label">calm coins</div></div><div><div className="metric">2</div><div className="metric-label">journal days</div></div></div><div className="progress-track"><div className="progress-value" style={{ width: '64%' }} /></div><p style={{ color: '#7b8498', fontSize: 11, margin: '12px 0 0' }}>Your consistency is building a kind of trust with yourself.</p></div><div className="surface-card"><div className="card-head"><div><h2>next gentle step</h2><p>you only need to choose one</p></div><Sparkles size={17} color="#8c96ff" /></div><Link to="/journal" className="activity-row"><span className="activity-dot" /><div><strong>Write one honest sentence</strong><span>+10 coins · 3 minutes</span></div><ChevronRight size={14} color="#747c90" /></Link><Link to="/music" className="activity-row"><span className="activity-dot" style={{ background: '#6ee7b7' }} /><div><strong>Put on a softer soundtrack</strong><span>+5 coins · no pressure</span></div><ChevronRight size={14} color="#747c90" /></Link><Link to="/therapists" className="activity-row"><span className="activity-dot" style={{ background: '#ffb59d' }} /><div><strong>Meet your care team</strong><span>Browse licensed support</span></div><ChevronRight size={14} color="#747c90" /></Link></div></div><div className="section-heading"><div><h2>your community toolkit</h2><p>Different tools for different kinds of days.</p></div></div><div className="feature-grid"><Feature icon={MessageCircle} title="talk it through" body="CalmBot is open whenever you need to untangle a thought." to="/chat" /><Feature icon={Library} title="read something kind" body="Recommendations for wherever your mood is today." to="/books" /><Feature icon={Stethoscope} title="find a professional" body="Browse therapists and make an appointment when ready." to="/therapists" /></div></div>
}

function Chat() {
  const { user } = useAuth()
  const [threads, setThreads] = useState(FALLBACK_THREADS)
  const [selectedId, setSelectedId] = useState('welcome')
  const [messages, setMessages] = useState(FALLBACK_MESSAGES)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [thinking, setThinking] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { apiFetch('/mental-health/threads', {}, localStorage.getItem('zenheaven_token') || '').then((data) => { if (data.threads?.length) { setThreads(data.threads); setSelectedId(data.threads[0].id) } }).catch(() => {}) }, [])
  useEffect(() => {
    if (!selectedId || selectedId === 'welcome') { setMessages(FALLBACK_MESSAGES); return }
    apiFetch(`/mental-health/threads/${selectedId}`, {}, localStorage.getItem('zenheaven_token') || '').then((data) => setMessages(data.messages || [])).catch(() => {})
  }, [selectedId])
  const sendMessage = async (event) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || typing) return
    setDraft('')
    setError('')
    setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: message, timestamp: new Date().toISOString() }])
    setTyping(true)
    setThinking('connecting to calm support…')
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('zenheaven_token') || ''}` }, body: JSON.stringify({ message, thread_id: selectedId === 'welcome' ? null : selectedId }) })
      if (!response.ok || !response.body) throw new Error('The support stream is unavailable.')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let responseText = ''
      const assistantId = `assistant-${Date.now()}`
      setMessages((current) => [...current, { id: assistantId, is_user: false, content: '', timestamp: new Date().toISOString() }])
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        for (const eventChunk of events) {
          const line = eventChunk.split('\n').find((entry) => entry.startsWith('data:'))
          if (!line) continue
          try {
            const payload = JSON.parse(line.replace(/^data:\s*/, ''))
            if (payload.type === 'thread_id') { setSelectedId(payload.data); setThreads((current) => [{ ...FALLBACK_THREADS[0], id: payload.data, title: 'A new conversation' }, ...current.filter((thread) => thread.id !== 'welcome')]) }
            if (payload.type === 'thinking') setThinking(payload.data)
            if (payload.type === 'response_start') setThinking('')
            if (payload.type === 'token') { responseText += payload.data; setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: responseText } : item)) }
            if (payload.type === 'complete') setThinking('')
          } catch {
            // An incomplete SSE frame is held in the next buffer.
          }
        }
      }
    } catch (requestError) {
      setError(requestError.message || 'CalmBot could not respond.')
      setMessages((current) => [...current, { id: `fallback-${Date.now()}`, is_user: false, content: 'I’m having trouble reaching the support stream. You can still take one slow breath with me: in for four, out for six. We can try again when you’re ready.', timestamp: new Date().toISOString() }])
    } finally { setTyping(false); setThinking('') }
  }
  return <div className="content-scroll"><PageTitle eyebrow="room / calmbot" title="A place to put the thoughts." description="Talk with an empathetic AI support guide. This is not a replacement for emergency or professional care." action={<span className="pulse">private thread</span>} /><div className="page-layout"><div className="chat-window"><div className="chat-header"><span className="avatar purple"><Brain size={16} /></span><div><strong>CalmBot</strong><span>available for a check-in</span></div></div><div className="messages">{messages.map((message) => <div key={message.id} className={`message ${message.is_user ? 'user' : ''}`}><span className={`avatar ${message.is_user ? '' : 'purple'}`}>{message.is_user ? (user?.username || 'you').slice(0, 2).toUpperCase() : 'CB'}</span><div><div className="message-meta"><span>{message.is_user ? 'you' : 'calmbot'}</span><span>{formatTime(message.timestamp)}</span></div><div className="message-content">{message.content || (typing && <span className="typing"><i /><i /><i /></span>)}</div></div></div>)}{thinking && <div style={{ color: '#7e88a1', fontSize: 10, paddingLeft: 43 }}>{thinking}</div>}</div><form className="chat-compose" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="say whatever is true right now…" aria-label="Message CalmBot" /><button type="submit" className="primary-btn" aria-label="Send message"><Send size={15} /></button></form></div><aside className="surface-card" style={{ alignSelf: 'start' }}><div className="card-head"><div><h3>your threads</h3><p>private conversations</p></div><button className="ghost-btn" style={{ minHeight: 28, padding: 6 }} onClick={() => { setSelectedId('welcome'); setMessages(FALLBACK_MESSAGES) }}><Plus size={13} /></button></div><div className="thread-list">{threads.map((thread) => <button key={thread.id} className={`thread-item ${selectedId === thread.id ? 'active' : ''}`} onClick={() => setSelectedId(thread.id)}><span className="avatar purple"><MessageCircle size={13} /></span><div><strong>{thread.title}</strong><span>{thread.message_count || 0} messages · {formatTime(thread.updated_at)}</span></div></button>)}</div>{error && <div className="error-message" style={{ marginTop: 13 }}>{error}</div>}<p style={{ color: '#697285', fontSize: 10, lineHeight: 1.5, margin: '18px 0 0' }}>If you’re in immediate danger, contact local emergency services. CalmBot is here for everyday support, not crisis response.</p></aside></div></div>
}

function formatTime(value) {
  if (!value) return 'now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'now'
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => { apiFetch('/journal/entries', {}, localStorage.getItem('zenheaven_token') || '').then(setEntries).catch(() => {}); apiFetch('/journal/prompts').then(setPrompts).catch(() => {}) }, [])
  const saveEntry = async (event) => {
    event.preventDefault()
    if (!content.trim()) return
    setSaving(true); setNotice('')
    try {
      const entry = await apiFetch('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [mood] }) }, localStorage.getItem('zenheaven_token') || '')
      setEntries((current) => [entry, ...current]); setContent(''); setNotice('Saved to your private journal · +10 Calm Coins')
    } catch (error) { setNotice(error.message || 'Could not save this entry.') } finally { setSaving(false) }
  }
  return <div className="content-scroll"><PageTitle eyebrow="room / journal" title="Put the day down somewhere." description="A private place for reflection, patterns, and the things you don’t need to carry around." action={<span className="eyebrow">encrypted in spirit</span>} /><div className="page-layout"><form className="surface-card form-grid" onSubmit={saveEntry}><div className="card-head"><div><h2>new entry</h2><p>There is no wrong way to write this.</p></div><BookOpen size={18} color="#9da5ff" /></div><div className="field"><label htmlFor="entry">What’s here today?</label><textarea id="entry" value={content} onChange={(event) => setContent(event.target.value)} placeholder="I notice that…" /></div><div className="field"><label>Which word is closest?</label><div className="mood-pills">{MOODS.map((item) => <button type="button" key={item} className={`mood-pill ${mood === item ? 'selected' : ''}`} onClick={() => setMood(item)}>{item}</button>)}</div></div>{notice && <div className={notice.startsWith('Saved') ? 'success-message' : 'error-message'}>{notice}</div>}<button className="primary-btn" disabled={saving}>{saving ? 'saving…' : 'save entry'} <ArrowRight size={14} /></button><div className="surface-card" style={{ padding: 13, background: '#14161b' }}><div className="eyebrow">try this prompt</div><p style={{ color: '#a5adbe', fontSize: 11, lineHeight: 1.5, margin: '8px 0 0' }}>{prompts[0]?.prompt || 'What is one small thing that helped you make it through today?'}</p></div></form><aside><div className="surface-card"><div className="card-head"><div><h3>your entries</h3><p>{entries.length} moments saved</p></div><BarChart3 size={16} color="#838cff" /></div><div className="journal-list">{entries.length ? entries.map((entry) => <JournalEntry key={entry._id || entry.id} entry={entry} />) : <div className="empty-state"><BookOpen size={21} /><p>Your first entry can be just one sentence.</p></div>}</div></div></aside></div></div>
}

function JournalEntry({ entry }) {
  return <article className="journal-entry"><h3>{entry.title || 'A moment from today'}</h3><p>{entry.content}</p><div className="entry-meta"><span>{formatTime(entry.created_at)}</span>{entry.mood && <span className="tag">{entry.mood}</span>}</div></article>
}

const SAMPLE_BOOKS = [
  { id: 'sample-1', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes and small thoughts for difficult days.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' },
  { id: 'sample-2', title: 'Wintering', author: 'Katherine May', description: 'The power of rest and retreat in difficult times.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80' },
  { id: 'sample-3', title: 'The Book of Delights', author: 'Ross Gay', description: 'A practice of noticing what is beautiful and true.', image_url: 'https://images.unsplash.com/photo-1511108690759-009324a90311?w=500&q=80' },
]
function Books() {
  const [books, setBooks] = useState(SAMPLE_BOOKS)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const search = async (event) => {
    event?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try { const data = await apiFetch(`/books/search?q=${encodeURIComponent(query)}&max_results=9`); setBooks(data.books || []) } catch { setBooks(SAMPLE_BOOKS) } finally { setLoading(false) }
  }
  useEffect(() => { apiFetch('/books/recommend-by-mood').then((data) => { if (data.books?.length) setBooks(data.books) }).catch(() => {}) }, [])
  return <div className="content-scroll"><PageTitle eyebrow="room / reading room" title="Something kind to read." description="Books selected to meet you where your mood is, with enough room left for your own interpretation." action={<form onSubmit={search} style={{ display: 'flex', gap: 7 }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search books" style={{ width: 150, padding: '9px 10px', border: '1px solid #303542', borderRadius: 8, color: '#eee', background: '#121419', fontSize: 11 }} /><button className="ghost-btn" style={{ minHeight: 34, padding: 8 }}><Search size={14} /></button></form>} /><div className="surface-card" style={{ marginBottom: 15, padding: 15, display: 'flex', alignItems: 'center', gap: 11, color: '#9ba3b6', fontSize: 11 }}><Sparkles size={16} color="#f1cc72" /> Based on your recent mood: <strong style={{ color: '#e5e8ee' }}>a little more calm</strong><span style={{ marginLeft: 'auto', color: '#6e778a' }}>Google Books recommendations</span></div>{loading ? <div className="loading">finding a few good pages…</div> : <div className="book-grid">{books.map((book) => <BookCard book={book} key={book.id} />)}</div>}</div>
}
function BookCard({ book }) {
  return <article className="book-card"><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <BookOpen size={28} />}</div><div className="book-info"><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p><button className="soft-btn" onClick={() => apiFetch(`/books/recommend/${book.id}`).catch(() => {})}>find similar <ChevronRight size={12} /></button></div></article>
}

const SAMPLE_SONGS = [
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', spotify_uri: 'spotify:track:0' },
  { name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', spotify_uri: 'spotify:track:1' },
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80', spotify_uri: 'spotify:track:2' },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', album_cover_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80', spotify_uri: 'spotify:track:3' },
]
function Music() {
  const [songs, setSongs] = useState(SAMPLE_SONGS)
  const [selected, setSelected] = useState(SAMPLE_SONGS[0].name)
  const [query, setQuery] = useState('')
  const [recommendations, setRecommendations] = useState([])
  useEffect(() => { apiFetch('/songs').then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 14).map((name) => ({ name, artist: 'ZenHeaven radio' }))) }).catch(() => {}) }, [])
  const getRecommendations = async () => { try { const data = await apiFetch(`/recommend?song=${encodeURIComponent(selected)}`); setRecommendations(data.recommendations || []) } catch { setRecommendations(SAMPLE_SONGS.slice(1)) } }
  const filtered = songs.filter((song) => song.name.toLowerCase().includes(query.toLowerCase()))
  return <div className="content-scroll"><PageTitle eyebrow="room / mood radio" title="Let the room sound softer." description="A small, low-stakes soundtrack for grounding, focus, or simply being where you are." action={<div className="pulse">now playing · quiet hours</div>} /><div className="dashboard-grid"><div className="surface-card"><div className="card-head"><div><h3>soft focus</h3><p>curated for a nervous system exhale</p></div><Music2 size={18} color="#9da5ff" /></div><div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '13px 0 20px' }}><span className="album-art" style={{ width: 75, height: 75 }}><Music2 size={25} /></span><div><div className="eyebrow">up next</div><h2 style={{ margin: '5px 0', fontFamily: 'Space Grotesk', fontSize: 20 }}>{selected || 'choose a song'}</h2><p style={{ color: '#7e8799', fontSize: 11, margin: 0 }}>a gentle place to begin</p></div></div><div className="field"><label htmlFor="song-search">search the library</label><input id="song-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="find a song…" /></div><div className="music-list" style={{ marginTop: 12 }}>{filtered.slice(0, 6).map((song) => <button className="music-row" key={song.name} onClick={() => setSelected(song.name)}><span className="album-art">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={15} />}</span><span className="song-info" style={{ textAlign: 'left' }}><strong>{song.name}</strong><span>{song.artist || 'ZenHeaven radio'}</span></span>{selected === song.name && <Check size={14} color="#6ee7b7" />}</button>)}</div><button className="primary-btn" style={{ width: '100%', marginTop: 15 }} onClick={getRecommendations}>build me a similar set <Sparkles size={14} /></button></div><div className="surface-card"><div className="card-head"><div><h3>recommended next</h3><p>from the song you chose</p></div><Heart size={16} color="#ff9f94" /></div><div className="music-list">{(recommendations.length ? recommendations : SAMPLE_SONGS.slice(1, 4)).map((song) => <MusicRecommendation key={song.name} song={song} />)}</div></div></div></div>
}
function MusicRecommendation({ song }) { return <div className="music-row"><span className="album-art">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={15} />}</span><span className="song-info"><strong>{song.name}</strong><span>{song.artist}</span></span><button className="ghost-btn" style={{ minHeight: 27, padding: 6 }} onClick={() => song.spotify_uri && window.open(song.spotify_uri, '_blank')}><ArrowRight size={13} /></button></div> }

const SAMPLE_THERAPISTS = [
  { _id: 'sample-therapist-1', name: 'Dr. Priya Shah', specializations: ['Anxiety', 'Mindfulness'], bio: 'Warm, collaborative support for anxious minds and life transitions.', rating: 4.9, hourly_rate: 45 },
  { _id: 'sample-therapist-2', name: 'Jordan Williams, LCSW', specializations: ['Burnout', 'Relationships'], bio: 'A grounded space for patterns, boundaries, and building a life that fits.', rating: 4.8, hourly_rate: 55 },
  { _id: 'sample-therapist-3', name: 'Mina Park, LPC', specializations: ['Grief', 'Self-worth'], bio: 'Gentle, practical sessions centered on your pace and your story.', rating: 4.9, hourly_rate: 50 },
  { _id: 'sample-therapist-4', name: 'Alex Morgan, LMFT', specializations: ['Trauma-informed', 'Stress'], bio: 'Supportive care for when everything feels like a lot at once.', rating: 4.7, hourly_rate: 48 },
]
function Therapists() {
  const [therapists, setTherapists] = useState(SAMPLE_THERAPISTS)
  const [specialization, setSpecialization] = useState('')
  useEffect(() => { apiFetch('/therapists/').then((data) => { if (data.length) setTherapists(data) }).catch(() => {}) }, [])
  const filtered = therapists.filter((therapist) => !specialization || (therapist.specializations || []).some((item) => item.toLowerCase().includes(specialization.toLowerCase())))
  return <div className="content-scroll"><PageTitle eyebrow="room / care team" title="Support that meets you there." description="Licensed professionals for the days when a little more support would help. Browse without committing to anything." action={<select value={specialization} onChange={(event) => setSpecialization(event.target.value)} style={{ padding: '9px 10px', border: '1px solid #303542', borderRadius: 8, color: '#cdd2dc', background: '#181b21', fontSize: 11 }}><option value="">all specialties</option><option value="anxiety">anxiety</option><option value="stress">stress</option><option value="mindfulness">mindfulness</option><option value="grief">grief</option></select>} /><div className="surface-card" style={{ padding: 15, marginBottom: 15, display: 'flex', gap: 10, color: '#9ba3b6', fontSize: 11 }}><ShieldCheck size={16} color="#6ee7b7" /> Every profile is reviewed. You choose if and when you reach out.</div><div className="therapist-grid">{filtered.map((therapist) => <TherapistCard key={therapist._id || therapist.id} therapist={therapist} />)}</div></div>
}
function TherapistCard({ therapist }) {
  const initials = (therapist.name || 'Care').split(' ').map((part) => part[0]).slice(0, 2).join('')
  return <article className="therapist-card"><div className="therapist-head"><span className="avatar orange">{initials}</span><div style={{ flex: 1 }}><h3>{therapist.name}</h3><p>{(therapist.specializations || []).join(' · ')}</p></div><button className="ghost-btn" style={{ minHeight: 28, padding: 7 }}><CircleHelp size={13} /></button></div><p style={{ marginTop: 15 }}>{therapist.bio || 'A thoughtful, person-centered approach to your wellbeing.'}</p><div className="rating">★ {therapist.rating || '4.8'} <span className="rate">${therapist.hourly_rate || 50} / session</span></div><button className="primary-btn" style={{ width: '100%', marginTop: 15 }} onClick={() => alert('Sign in to book a session with this therapist.')}>view availability <ArrowRight size={13} /></button></article>
}

function Coins() {
  const [balance, setBalance] = useState(0)
  const [goals, setGoals] = useState([])
  const [transactions, setTransactions] = useState([])
  useEffect(() => { const token = localStorage.getItem('zenheaven_token') || ''; Promise.all([apiFetch('/coins/balance', {}, token), apiFetch('/coins/daily-goals', {}, token), apiFetch('/coins/transactions', {}, token)]).then(([balanceData, goalsData, transactionData]) => { setBalance(balanceData.balance || 0); setGoals(goalsData || []); setTransactions(transactionData || []) }).catch(() => {}) }, [])
  const visibleGoals = goals.length ? goals : [{ id: 1, title: 'Chat with AI Therapist', target: 1, current: 0, coins: 10 }, { id: 2, title: 'Write in Journal', target: 1, current: 0, coins: 15 }, { id: 3, title: 'Complete Mood Check', target: 1, current: 0, coins: 5 }]
  return <div className="content-scroll"><PageTitle eyebrow="room / calm coins" title="Tiny rewards for showing up." description="Calm Coins celebrate the small actions that support you. They are a nudge, never a measure of your worth." /><div className="coin-hero"><div><div className="eyebrow">current balance</div><div className="coin-number">{balance}</div><div className="coin-label">calm coins available</div></div><CoinsIcon size={58} color="#f1cc72" strokeWidth={1} /></div><div className="dashboard-grid" style={{ marginTop: 15 }}><div className="surface-card"><div className="card-head"><div><h3>today’s gentle goals</h3><p>pick whatever has enough room in it</p></div><Sparkles size={16} color="#f1cc72" /></div><div className="goal-list">{visibleGoals.map((goal) => <div className="goal" key={goal.id}><Zap size={15} /><div className="goal-info"><strong>{goal.title}</strong><span>{goal.current || 0} / {goal.target} complete · +{goal.coins} coins</span></div>{goal.completed ? <Check size={15} className="check" /> : <ChevronRight size={14} color="#747c8e" />}</div>)}</div></div><div className="surface-card"><div className="card-head"><div><h3>recent activity</h3><p>where your coins came from</p></div><BarChart3 size={16} color="#f1cc72" /></div>{transactions.length ? transactions.slice(0, 5).map((item) => <Activity key={item._id} title={item.description} time={`${item.amount > 0 ? '+' : ''}${item.amount}`} />) : <div className="empty-state"><CoinsIcon size={20} /><p>Your first check-in will start the trail.</p></div>}</div></div></div>
}

function AuthPage({ mode = 'login' }) {
  const { user, login, register, authError } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const isRegister = mode === 'register'
  const submit = async (event) => { event.preventDefault(); setLoading(true); const success = await (isRegister ? register(values) : login({ username: values.username, password: values.password })); setLoading(false); if (success) navigate('/dashboard') }
  return <div className="auth-shell"><div className="auth-card"><div className="auth-copy"><Brand /><div className="eyebrow">a server for softer days</div><h1>There’s room for you here.</h1><p>ZenHeaven brings supportive conversations, private reflection, and helpful next steps into one calm corner.</p><div style={{ display: 'flex', gap: 9, marginTop: 36, color: '#c5caed', fontSize: 11 }}><ShieldCheck size={15} /> made for your pace</div></div><div className="auth-form"><div className="eyebrow">{isRegister ? 'join zenheaven' : 'welcome back'}</div><h2>{isRegister ? 'Make a little room.' : 'Good to see you.'}</h2><p>{isRegister ? 'Create an account and keep your wellbeing tools together.' : 'Sign in to return to your community space.'}</p><form className="form-grid" onSubmit={submit}>{isRegister && <div className="field"><label htmlFor="name">your name</label><input id="name" value={values.full_name} onChange={(event) => setValues({ ...values, full_name: event.target.value })} placeholder="how should we call you?" /></div>}<div className="field"><label htmlFor="username">username</label><input id="username" required value={values.username} onChange={(event) => setValues({ ...values, username: event.target.value })} placeholder="your quiet corner name" /></div>{isRegister && <div className="field"><label htmlFor="email">email</label><input id="email" type="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" /> </div>}<div className="field"><label htmlFor="password">password</label><input id="password" type="password" minLength={6} required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="at least 6 characters" /></div>{authError && <div className="error-message">{authError}</div>}<button className="primary-btn" disabled={loading}>{loading ? 'connecting…' : isRegister ? 'join zenheaven' : 'enter the server'} <ArrowRight size={14} /></button></form><div className="auth-footer">{isRegister ? <>already have a place? <Link to="/login">sign in</Link></> : <>new here? <Link to="/register">create an account</Link></>}</div></div></div></div>
}

function App() {
  return <AuthProvider><Routes><Route element={<AppLayout />}><Route path="/" element={<Landing />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Route></Route><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>
}

export default App
