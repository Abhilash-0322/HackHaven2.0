import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'zenheaven_token'
const USER_KEY = 'zenheaven_user'

async function api(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || data.message || `Request failed (${response.status})`)
  return data
}

function readStored(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

const AuthContext = createContext(null)
function useAuth() { return useContext(AuthContext) }

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStored(USER_KEY))
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)) && !user)

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    api('/auth/me').then((nextUser) => {
      setUser(nextUser)
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    }).catch(() => {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    }).finally(() => setAuthLoading(false))
  }, [])

  const authenticate = async (payload, mode) => {
    const result = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem(TOKEN_KEY, result.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    setUser(result.user)
    return result
  }
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null)
  }
  const value = useMemo(() => ({ user, setUser, authenticate, logout, authLoading }), [user, authLoading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Logo({ dark = false }) {
  return <Link className={`logo ${dark ? 'logo-dark' : ''}`} to="/"><span>ZH</span> ZENHEAVEN</Link>
}

function Arrow() { return <span aria-hidden="true">↗</span> }
function Button({ children, className = '', ...props }) { return <button className={`button ${className}`} {...props}>{children}</button> }

function PublicHeader() {
  return <header className="public-header">
    <Logo />
    <nav className="public-nav">
      <a href="#manifesto">WHY THIS</a><a href="#kit">THE KIT</a><Link to="/login">LOG IN</Link>
      <Link className="button button-small button-black" to="/register">JOIN THE COLLECTIVE <Arrow /></Link>
    </nav>
    <Link className="mobile-join" to="/register">JOIN ↗</Link>
  </header>
}

function Landing() {
  return <div className="landing">
    <PublicHeader />
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> EMOTIONAL INFRASTRUCTURE / 001</p>
          <h1>FEEL<br /><em>LOUD.</em><br />HEAL<br />LOUDER.</h1>
          <p className="hero-lede">A private, imperfect, deeply human toolkit for getting through the day. No beige wellness. No pretending.</p>
          <div className="hero-actions"><Link to="/register" className="button button-acid">ENTER ZENHEAVEN <Arrow /></Link><a className="text-link" href="#manifesto">SCROLL TO DECODE ↓</a></div>
        </div>
        <div className="hero-art">
          <div className="sun-stamp">NO<br />BAD<br />DAYS</div>
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-note">THIS IS A<br />SOFT PLACE<br />WITH HARD<br />EDGES.</div>
          <div className="hero-index">Z / H<br /><strong>2026</strong></div>
        </div>
      </section>
      <div className="ticker"><div>● YOUR FEELINGS ARE DATA <span>✳</span> YOUR FEELINGS ARE NOT A BUG <span>✳</span> REST IS RESISTANCE <span>✳</span> </div><div aria-hidden="true">● YOUR FEELINGS ARE DATA <span>✳</span> YOUR FEELINGS ARE NOT A BUG <span>✳</span> REST IS RESISTANCE <span>✳</span> </div></div>
      <section className="manifesto container" id="manifesto">
        <div className="section-label">01 / THE PREMISE</div>
        <div className="manifesto-grid"><h2>WELLNESS<br /><span>IS NOT</span><br />AESTHETIC.</h2><div className="manifesto-body"><p className="big-copy">It’s an ongoing conversation with yourself. Sometimes messy. Sometimes magnificent.</p><p>ZenHeaven is the place to check in without checking out. Talk to an AI that listens, leave a note for tomorrow-you, find the right book, or get a real human in your corner.</p><Link to="/register" className="text-link text-link-dark">READ THE MANIFESTO <Arrow /></Link></div></div>
      </section>
      <section className="kit container" id="kit">
        <div className="section-label">02 / THE TOOLKIT</div>
        <div className="feature-stack">
          <FeatureCard number="01" title="TALK IT OUT" copy="A judgment-free chat for the thoughts that arrive after midnight." link="/chat" color="acid" />
          <FeatureCard number="02" title="LEAVE A TRACE" copy="Journal the real thing. Track the pattern. Notice the shift." link="/journal" color="pink" />
          <FeatureCard number="03" title="FIND YOUR FREQUENCY" copy="Books and music with emotional intelligence, not algorithmic noise." link="/books" color="blue" />
        </div>
      </section>
      <section className="statement"><div className="container"><p>YOU DO NOT HAVE TO<br /><span>OPTIMIZE</span> YOUR WAY<br />OUT OF BEING HUMAN.</p><Link to="/register" className="button button-acid">START WHERE YOU ARE <Arrow /></Link></div></section>
      <footer className="public-footer container"><Logo /><p>© 2026 ZENHEAVEN / MADE FOR THE IN-BETWEEN</p><a href="mailto:hello@zenheaven.local">SAY HELLO ↗</a></footer>
    </main>
  </div>
}

function FeatureCard({ number, title, copy, link, color }) {
  return <Link to={link} className={`feature-card feature-${color}`}><span className="feature-number">{number}</span><div><h3>{title}</h3><p>{copy}</p></div><span className="card-arrow"><Arrow /></span></Link>
}

function AuthPage({ register = false }) {
  const { user, authenticate } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(register ? { username: '', email: '', password: '', full_name: '' } : { username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('')
    try { await authenticate(form, register ? 'register' : 'login'); navigate('/dashboard') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-aside"><Logo dark /><p className="eyebrow">ZENHEAVEN / ACCESS NODE</p><h1>{register ? <>MAKE ROOM<br /><em>FOR YOU.</em></> : <>WELCOME<br /><em>BACK, HUMAN.</em></>}</h1><div className="auth-scribble">↘ no wellness<br />influencers beyond<br />this point</div></div><div className="auth-form-wrap"><Link to="/" className="back-link">← RETURN TO EARTH</Link><div className="auth-form"><p className="eyebrow">{register ? 'NEW SIGNAL / 001' : 'RETURN SIGNAL / 002'}</p><h2>{register ? 'CREATE YOUR ACCESS' : 'LOG BACK IN'}</h2><p className="form-intro">{register ? 'The collective is open. Bring your whole weird self.' : 'Your corner of the internet is still here.'}</p><form onSubmit={submit}>{register && <Field label="NAME / OPTIONAL" name="full_name" value={form.full_name} onChange={update} placeholder="what should we call you?" />}<Field label="USERNAME" name="username" value={form.username} onChange={update} placeholder="your-alias" required />{register && <Field label="EMAIL" name="email" type="email" value={form.email} onChange={update} placeholder="you@somewhere.com" required />}<Field label="PASSWORD" name="password" type="password" value={form.password} onChange={update} placeholder="six characters minimum" minLength={6} required />{error && <div className="form-error">{error}</div>}<Button type="submit" className="button-full button-acid" disabled={busy}>{busy ? 'CONNECTING...' : register ? <>CREATE ACCOUNT <Arrow /></> : <>ENTER DASHBOARD <Arrow /></>}</Button></form><p className="form-switch">{register ? 'Already have an account?' : 'New here?'} <Link to={register ? '/login' : '/register'}>{register ? 'LOG IN' : 'CREATE ACCESS'} <Arrow /></Link></p></div></div></div>
}

function Field({ label, name, type = 'text', ...props }) {
  return <label className="field"><span>{label}</span><input name={name} type={type} {...props} /></label>
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: '◈' }, { to: '/chat', label: 'Talk it out', icon: '↯' },
  { to: '/journal', label: 'Journal', icon: '□' }, { to: '/books', label: 'Reading room', icon: '▤' },
  { to: '/music', label: 'Sound system', icon: '♫' }, { to: '/therapists', label: 'Real humans', icon: '◎' },
  { to: '/coins', label: 'Calm coins', icon: '¢' },
]

function Protected({ children }) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <div className="loading-screen">CONNECTING TO ZENHEAVEN<span>...</span></div>
  return user ? children : <Navigate to="/login" replace />
}

function AppShell({ children }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  return <div className="app-shell"><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-top"><Logo /><button className="close-menu" onClick={() => setOpen(false)}>×</button></div><p className="side-label">YOUR TOOLKIT</p><nav className="side-nav">{navItems.map(item => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}><span>{item.icon}</span>{item.label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="side-status"><span className="live-dot" /> SYSTEMS NOMINAL</div><button className="logout" onClick={logout}>SIGN OUT ↗</button></div></aside><div className="app-main"><header className="app-header"><button className="menu-button" onClick={() => setOpen(true)}>☰ <span>MENU</span></button><p><span className="live-dot" /> PRIVATE MODE / {user?.username?.toUpperCase()}</p><Link to="/coins" className="coin-pill">¢ {user?.calm_coins ?? 0}</Link></header>{children}</div></div>
}

function PageIntro({ kicker, title, copy, action }) {
  return <div className="page-intro"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1></div>{copy && <p className="page-intro-copy">{copy}</p>}{action}</div>
}

function Dashboard() {
  const { user, setUser } = useAuth()
  const [data, setData] = useState({ balance: user?.calm_coins || 0, streak: 0, entries: [], threads: [] })
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.allSettled([api('/coins/balance'), api('/coins/streak'), api('/journal/entries'), api('/mental-health/threads')]).then(([balance, streak, entries, threads]) => {
      const next = { balance: balance.value?.balance ?? user?.calm_coins ?? 0, streak: streak.value?.current_streak ?? 0, entries: entries.value || [], threads: threads.value?.threads || [] }
      setData(next); if (next.balance !== user?.calm_coins) { const nextUser = { ...user, calm_coins: next.balance }; setUser(nextUser); localStorage.setItem(USER_KEY, JSON.stringify(nextUser)) }
    }).catch((err) => setError(err.message))
  }, [])
  const firstName = user?.full_name?.split(' ')[0] || user?.username || 'friend'
  return <div className="page container app-page"><PageIntro kicker="00 / YOUR HOME NODE" title={<>HEY, {firstName.toUpperCase()}<span className="acid">.</span></>} copy="A small dashboard for the small steps. No streak-shaming here." /><div className="dashboard-grid"><div className="dashboard-feature"><div className="feature-top"><span>THE DAILY CHECK-IN</span><span>01 / 03</span></div><h2>WHAT'S<br /><em>ALIVE</em><br />TODAY?</h2><p>You don’t need the right words. Start with one true one.</p><Link className="button button-black" to="/chat">OPEN A CONVERSATION <Arrow /></Link><div className="doodle">✳</div></div><div className="quick-stats"><Stat label="CALM COINS" value={`¢ ${data.balance}`} link="/coins" /><Stat label="CURRENT STREAK" value={`${data.streak} DAYS`} link="/coins" /><Stat label="JOURNAL ENTRIES" value={data.entries.length} link="/journal" /></div><div className="recent-panel"><div className="panel-heading"><span>RECENT SIGNALS</span><Link to="/journal">VIEW ALL ↗</Link></div>{error && <p className="inline-error">{error}</p>}{data.entries.slice(0, 3).map((entry, i) => <Link to="/journal" className="recent-item" key={entry._id || i}><span className="recent-date">{formatDate(entry.created_at)}</span><strong>{entry.title || 'Untitled reflection'}</strong><span className="mood-tag">{entry.mood || 'unread'}</span></Link>)}{!data.entries.length && <p className="empty-state">No entries yet. The blank page is not judging you.</p>}</div><div className="dashboard-quote"><p>“You are allowed to be both a masterpiece and a work in progress.”</p><span>— ZH FIELD NOTES / 004</span></div></div></div>
}

function Stat({ label, value, link }) { return <Link to={link} className="stat"><span>{label}</span><strong>{value}</strong><Arrow /></Link> }
function formatDate(value) { if (!value) return '—'; return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }

function Chat() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const loadThreads = () => api('/mental-health/threads').then(data => setThreads(data.threads || [])).catch(err => setError(err.message))
  useEffect(() => { loadThreads() }, [])
  const openThread = (id) => { setThreadId(id); api(`/mental-health/threads/${id}`).then(data => setMessages((data.messages || []).map(msg => ({ role: msg.is_user ? 'user' : 'bot', content: msg.content })))).catch(err => setError(err.message)) }
  const send = async (e) => {
    e?.preventDefault(); const message = input.trim(); if (!message || loading) return
    setInput(''); setError(''); setMessages(prev => [...prev, { role: 'user', content: message }]); setThinking([]); setMessages(prev => [...prev, { role: 'bot', content: '', streaming: true }]); setLoading(true)
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }, body: JSON.stringify({ message, thread_id: threadId }) })
      if (!response.ok || !response.body) throw new Error('The chat node did not respond.')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      const consume = (raw) => {
        raw.split('\n\n').filter(Boolean).forEach(block => {
          const line = block.split('\n').find(row => row.startsWith('data:'))
          if (!line) return
          try {
            const event = JSON.parse(line.slice(5).trim())
            if (event.type === 'thread_id') setThreadId(event.data)
            if (event.type === 'thinking') setThinking(prev => [...prev.slice(-3), event.data])
            if (event.type === 'token') setMessages(prev => prev.map((msg, i) => i === prev.length - 1 ? { ...msg, content: msg.content + event.data } : msg))
            if (event.type === 'error') setError(typeof event.data === 'string' ? event.data : 'The chat node hit a snag.')
          } catch { /* Ignore an incomplete SSE frame. */ }
        })
      }
      while (true) { const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const frames = buffer.split('\n\n'); buffer = frames.pop() || ''; consume(frames.join('\n\n')) }
      if (buffer) consume(buffer)
      setMessages(prev => prev.map(msg => ({ ...msg, streaming: false }))); loadThreads()
    } catch (err) { setError(err.message); setMessages(prev => prev.map(msg => msg.streaming ? { ...msg, content: 'Connection interrupted. Try that again in a moment.', streaming: false } : msg)) } finally { setLoading(false) }
  }
  return <div className="page chat-page"><div className="chat-sidebar"><div className="chat-sidebar-head"><p className="eyebrow">CONVERSATION LOG</p><Button className="button-black button-small" onClick={() => { setThreadId(null); setMessages([]) }}>+ NEW THREAD</Button></div>{threads.map(thread => <button className={`thread-item ${threadId === thread.id ? 'selected' : ''}`} key={thread.id} onClick={() => openThread(thread.id)}><span>↳</span><div><strong>{thread.title}</strong><small>{thread.message_count || 0} transmissions</small></div></button>)} {!threads.length && <p className="empty-state">No threads yet.<br />Make the first move.</p>}</div><div className="chat-main"><div className="chat-title"><p className="eyebrow">01 / LISTENING NODE</p><h1>TALK IT<br /><em>OUT.</em></h1><span className="chat-pulse"><i /> ONLINE / PRIVATE</span></div><div className="messages">{!messages.length && <div className="chat-welcome"><span className="welcome-mark">✳</span><p>Say the thing you’ve been editing in your head.</p><small>No diagnosis. No performance. Just a place to put it.</small></div>}{messages.map((msg, index) => <div className={`message ${msg.role}`} key={`${msg.content}-${index}`}><span className="message-label">{msg.role === 'user' ? 'YOU' : 'CALMBOT / ZH'}</span><p>{msg.content}{msg.streaming && <span className="typing-cursor">▌</span>}</p></div>)}{thinking.length > 0 && loading && <div className="thinking">{thinking[thinking.length - 1]}</div>}</div>{error && <div className="inline-error chat-error">{error}</div>}<form className="chat-input" onSubmit={send}><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type what’s on your mind..." rows="1" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) } }} /><button disabled={loading || !input.trim()} aria-label="Send message">SEND <Arrow /></button></form><p className="disclaimer">CALMBOT IS NOT A CRISIS SERVICE. IF YOU ARE IN IMMEDIATE DANGER, CONTACT LOCAL EMERGENCY SERVICES.</p></div></div>
}

function Journal() {
  const [entries, setEntries] = useState([]); const [prompts, setPrompts] = useState([]); const [insights, setInsights] = useState(null); const [content, setContent] = useState(''); const [mood, setMood] = useState(''); const [tags, setTags] = useState(''); const [analysis, setAnalysis] = useState(null); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const load = () => Promise.allSettled([api('/journal/entries'), api('/journal/prompts'), api('/journal/insights')]).then(([e, p, i]) => { setEntries(e.value || []); setPrompts(p.value || []); setInsights(i.value) })
  useEffect(() => { load() }, [])
  const analyze = async () => { if (!content.trim()) return; setBusy(true); try { setAnalysis(await api('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) })) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  const save = async (e) => { e.preventDefault(); if (!content.trim()) return; setBusy(true); setError(''); try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: tags.split(',').map(tag => tag.trim()).filter(Boolean) }) }); setContent(''); setMood(''); setTags(''); setAnalysis(null); load() } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="page container app-page"><PageIntro kicker="02 / PRIVATE ARCHIVE" title={<>LEAVE<br /><em>A TRACE.</em></>} copy="A journal is a conversation where you get the last word." /><div className="journal-grid"><form className="journal-editor" onSubmit={save}><div className="editor-bar"><span>NEW ENTRY / {new Date().toLocaleDateString('en-US').toUpperCase()}</span><span className="editor-lock">⌁ PRIVATE</span></div><button type="button" className="prompt-button" onClick={() => prompts.length && setContent(prompts[Math.floor(Math.random() * prompts.length)].prompt)}>NEED A PROMPT? <Arrow /></button><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start anywhere..." /><div className="journal-controls"><select value={mood} onChange={e => setMood(e.target.value)}><option value="">MOOD / OPTIONAL</option>{['calm', 'hopeful', 'anxious', 'sad', 'stressed', 'grateful', 'motivated'].map(item => <option key={item}>{item}</option>)}</select><input value={tags} onChange={e => setTags(e.target.value)} placeholder="TAGS / comma separated" /><Button type="button" className="button-outline" onClick={analyze} disabled={busy || !content.trim()}>ANALYZE MOOD</Button><Button className="button-acid" disabled={busy || !content.trim()}>{busy ? 'SAVING...' : <>SAVE ENTRY <Arrow /></>}</Button></div>{analysis && <div className="analysis-box"><span>MOOD READ / {analysis.mood}</span><p>{analysis.mood_description}</p>{analysis.suggestions?.map(suggestion => <small key={suggestion}>+ {suggestion}</small>)}</div>}{error && <div className="form-error">{error}</div>}</form><aside className="journal-side"><div className="side-card prompt-card"><span className="side-card-label">RANDOM PROMPT</span><p>{prompts[0]?.prompt || 'What is asking for your attention today?'}</p><button onClick={() => prompts.length && setContent(prompts[Math.floor(Math.random() * prompts.length)].prompt)}>USE THIS ↗</button></div><div className="side-card"><span className="side-card-label">YOUR PATTERNS</span><strong>{insights?.total_entries ?? entries.length}</strong><p>entries in the archive</p>{insights?.top_moods?.slice(0, 3).map(item => <div className="pattern" key={item._id}><span>{item._id}</span><b style={{ width: `${Math.min(item.count * 18, 100)}%` }} /></div>)}</div></aside></div><section className="entry-list"><div className="panel-heading"><span>ARCHIVE / {entries.length} ENTRIES</span><span>NEWEST FIRST</span></div>{entries.map(entry => <article className="entry-row" key={entry._id}><span>{formatDate(entry.created_at)}</span><div><h3>{entry.title || 'Untitled reflection'}</h3><p>{entry.content}</p></div><span className="mood-tag">{entry.mood || 'unread'}</span></article>)}</section></div>
}

function Books() {
  const [books, setBooks] = useState([]); const [mood, setMood] = useState(''); const [query, setQuery] = useState(''); const [busy, setBusy] = useState(true); const [error, setError] = useState('')
  useEffect(() => { api('/books/recommend-by-mood').then(data => { setBooks(data.books || []); setMood(data.mood || 'balanced') }).catch(err => setError(err.message)).finally(() => setBusy(false)) }, [])
  const search = async (e) => { e.preventDefault(); if (!query.trim()) return; setBusy(true); try { const data = await api(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); setBooks(data.books || []); setMood(`search: ${query}`) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="page container app-page"><PageIntro kicker="03 / READING ROOM" title={<>BOOKS FOR<br /><em>THE MOOD.</em></>} copy="The right sentence at the right time can be a small exit." action={<form className="search-box" onSubmit={search}><input value={query} onChange={e => setQuery(e.target.value)} placeholder="SEARCH THE STACK" /><button>↗</button></form>} /><div className="recommendation-banner"><span>BASED ON YOUR LATEST SIGNAL</span><strong>{mood || 'CALIBRATING...'}</strong><p>Recommendations are a starting point, not a prescription.</p></div>{error && <div className="form-error">{error}</div>}{busy ? <LoadingText /> : <div className="book-grid">{books.map(book => <a className="book-card" href={`https://books.google.com/books?id=${book.id}`} target="_blank" rel="noreferrer" key={book.id}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <span>ZH<br />READ</span>}</div><div className="book-info"><span>FIELD NOTE / BOOK</span><h3>{book.title}</h3><p>{book.author}</p><small>{book.description}</small><b>OPEN BOOK ↗</b></div></a>)}</div>}</div>
}

function Music() {
  const [songs, setSongs] = useState([]); const [selected, setSelected] = useState(''); const [recommendations, setRecommendations] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { api('/songs').then(data => setSongs(data.songs || [])).catch(err => setError(err.message)).finally(() => setLoading(false)) }, [])
  const recommend = async (e) => { e.preventDefault(); if (!selected) return; setLoading(true); setError(''); try { const data = await api(`/recommend?song=${encodeURIComponent(selected)}`); setRecommendations(data.recommendations || []) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  return <div className="page container app-page music-page"><PageIntro kicker="04 / SOUND SYSTEM" title={<>FIND YOUR<br /><em>FREQUENCY.</em></>} copy="Sometimes the nervous system needs a beat before it needs a breakthrough." /><div className="music-console"><div className="console-screen"><span>NOW TUNING</span><strong>{selected || '—'}</strong><div className="equalizer">{[1, 4, 2, 5, 3, 6, 2, 4, 1, 5, 3, 2].map((height, i) => <i style={{ animationDelay: `${i * 0.08}s`, height: `${height * 10}px` }} key={i} />)}</div></div><form className="music-form" onSubmit={recommend}><label>CHOOSE A TRACK<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">SELECT FROM THE ARCHIVE</option>{songs.slice(0, 500).map(song => <option key={song}>{song}</option>)}</select></label><Button className="button-acid" disabled={!selected || loading}>GENERATE A SOUNDTRACK <Arrow /></Button></form></div>{error && <div className="form-error">{error} — The music database may be offline.</div>}{loading && !recommendations.length ? <LoadingText /> : <div className="song-list">{recommendations.map((song, i) => <div className="song-row" key={`${song.name}-${i}`}><span className="song-index">0{i + 1}</span>{song.album_cover_url && <img src={song.album_cover_url} alt="" /> }<div><strong>{song.name || song.song}</strong><span>{song.artist}</span></div>{song.spotify_uri ? <a href={song.spotify_uri} className="song-play">PLAY ↗</a> : <span className="song-play">READY</span>}</div>)}{!recommendations.length && !loading && <div className="empty-large">SELECT A TRACK.<br /><em>LET IT REARRANGE THE ROOM.</em></div>}</div>}</div>
}

function Therapists() {
  const { user } = useAuth(); const [therapists, setTherapists] = useState([]); const [selected, setSelected] = useState(null); const [appointments, setAppointments] = useState([]); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('')
  useEffect(() => { api('/therapists/').then(setTherapists).catch(err => setMessage(err.message)); if (user?.id) api(`/therapists/appointments/user/${user.id}`).then(setAppointments).catch(() => {}) }, [user?.id])
  const choose = (therapist) => { setSelected({ ...therapist, available_slots: [] }); api(`/therapists/${therapist._id}`).then(setSelected).catch(err => setMessage(err.message)) }
  const book = async (slot) => { setBusy(true); setMessage(''); try { await api('/therapists/appointments', { method: 'POST', body: JSON.stringify({ user_id: user.id, therapist_id: selected._id, date: slot.start_time, start_time: slot.start_time, end_time: slot.end_time, session_type: 'video' }) }); setMessage('SESSION RESERVED. YOUR FUTURE SELF SAYS THANK YOU.'); setSelected(null) } catch (err) { setMessage(err.message) } finally { setBusy(false) } }
  return <div className="page container app-page"><PageIntro kicker="05 / REAL HUMANS" title={<>FIND YOUR<br /><em>PERSON.</em></>} copy="AI can hold the thread. Humans can help you pull it." /><div className="therapist-layout"><div className="therapist-list">{therapists.map(therapist => <button className="therapist-card" key={therapist._id} onClick={() => choose(therapist)}><div className="avatar">{therapist.name.split(' ').map(name => name[0]).slice(0, 2).join('')}</div><div><span>{therapist.specializations?.slice(0, 2).join(' / ')}</span><h3>{therapist.name}</h3><p>{therapist.experience_years} years experience · ★ {therapist.rating}</p></div><Arrow /></button>)}{!therapists.length && <LoadingText />}</div><aside className="appointment-panel">{selected ? <><button className="back-link panel-back" onClick={() => setSelected(null)}>← ALL PEOPLE</button><div className="selected-profile"><div className="avatar avatar-large">{selected.name.split(' ').map(name => name[0]).slice(0, 2).join('')}</div><p className="eyebrow">SELECTED HUMAN</p><h2>{selected.name}</h2><p>{selected.bio}</p><strong>${selected.hourly_rate} / SESSION</strong></div><div className="slots"><span className="side-card-label">AVAILABLE WINDOWS</span>{selected.available_slots?.slice(0, 8).map(slot => <button key={slot.start_time} onClick={() => book(slot)} disabled={busy}>{new Date(slot.start_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' })} ↗</button>)}{!selected.available_slots?.length && <p className="empty-state">No windows in the current feed.</p>}</div></> : <div className="empty-large">SELECT A HUMAN<br /><em>TO SEE THEIR WINDOWS.</em></div>}</aside></div>{message && <div className="success-banner">{message}</div>}<section className="appointments"><div className="panel-heading"><span>YOUR SCHEDULE</span><span>{appointments.length} SESSIONS</span></div>{appointments.map(item => <div className="appointment-row" key={item.appointment_id}><span>{formatDate(item.start_time)}</span><strong>{item.therapist_name}</strong><span>{item.status} / {item.session_type}</span></div>)}</section></div>
}

function Coins() {
  const [balance, setBalance] = useState(0); const [transactions, setTransactions] = useState([]); const [goals, setGoals] = useState([]); const [achievements, setAchievements] = useState([]); const [streak, setStreak] = useState(null); const [error, setError] = useState('')
  const load = () => Promise.allSettled([api('/coins/balance'), api('/coins/transactions'), api('/coins/daily-goals'), api('/coins/achievements'), api('/coins/streak')]).then(([b, t, g, a, s]) => { setBalance(b.value?.balance || 0); setTransactions(t.value || []); setGoals(g.value || []); setAchievements(a.value || []); setStreak(s.value) }).catch(err => setError(err.message))
  useEffect(() => { load() }, [])
  const spend = async (goal) => { try { await api('/coins/spend', { method: 'POST', body: JSON.stringify({ amount: goal.coins, source: 'daily_goal', description: `Redeemed reward: ${goal.title}` }) }); load() } catch (err) { setError(err.message) } }
  return <div className="page container app-page coins-page"><PageIntro kicker="06 / RECIPROCITY ENGINE" title={<>CALM<br /><em>COMPOUNDS.</em></>} copy="Every act of care counts. Calm Coins make the invisible visible." /><div className="coin-hero"><div><span className="eyebrow">AVAILABLE BALANCE</span><strong>¢ {balance}</strong><p>Earned by showing up for yourself.</p></div><div className="coin-hero-mark">¢</div></div>{error && <div className="form-error">{error}</div>}<div className="coins-grid"><section className="goal-panel"><div className="panel-heading"><span>TODAY'S MISSIONS</span><span>RESETS AT MIDNIGHT</span></div>{goals.map(goal => <div className={`goal-row ${goal.completed ? 'completed' : ''}`} key={goal.id}><span className="goal-icon">{goal.completed ? '✓' : '○'}</span><div><strong>{goal.title}</strong><small>{goal.current} / {goal.target} complete</small></div><b>+{goal.coins}</b>{goal.completed && <span className="goal-done">DONE</span>}</div>)}</section><section className="streak-panel"><span className="eyebrow">MOTION, NOT PERFECTION</span><strong>{streak?.current_streak || 0}<small>DAY<br />STREAK</small></strong><p>Come back when you can. There is no penalty for being human.</p><div className="streak-dots">{Array.from({ length: 7 }).map((_, i) => <i className={i < (streak?.current_streak || 0) ? 'filled' : ''} key={i} />)}</div></section></div><div className="transactions"><div className="panel-heading"><span>LEDGER</span><Link to="/dashboard">BACK HOME ↗</Link></div>{transactions.slice(0, 8).map((item, i) => <div className="transaction-row" key={item._id || i}><span>{formatDate(item.timestamp)}</span><div><strong>{item.description}</strong><small>{item.source}</small></div><b className={item.transaction_type === 'spend' ? 'spent' : ''}>{item.transaction_type === 'spend' ? '-' : '+'}{item.amount}¢</b></div>)}</div><div className="achievement-strip"><span className="eyebrow">UNLOCKED / {achievements.filter(item => item.unlocked).length}</span>{achievements.map(item => <button disabled={!item.unlocked} onClick={() => spend(item)} className={item.unlocked ? 'unlocked' : ''} key={item.id}><span>{item.unlocked ? '★' : '○'}</span>{item.title}</button>)}</div></div>
}

function LoadingText() { return <div className="loading-text">FETCHING FROM THE VOID<span>...</span></div> }

function App() {
  return <AuthProvider><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route path="*" element={<Protected><AppShell><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AppShell></Protected>} /></Routes></AuthProvider>
}

export default App
