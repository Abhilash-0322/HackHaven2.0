import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  authApi, booksApi, chatApi, clearToken, coinsApi, getToken, journalApi,
  musicApi, setToken, streamChat, therapistsApi,
} from './lib/api'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zenheaven_user') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(Boolean(getToken()) && !user)

  useEffect(() => {
    if (!getToken() || user) return
    authApi.me().then(setUser).catch(() => clearToken()).finally(() => setLoading(false))
  }, [user])

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials) {
      const data = await authApi.login(credentials)
      setToken(data.access_token)
      localStorage.setItem('zenheaven_user', JSON.stringify(data.user))
      setUser(data.user)
      return data
    },
    async register(data) {
      const response = await authApi.register(data)
      setToken(response.access_token)
      localStorage.setItem('zenheaven_user', JSON.stringify(response.user))
      setUser(response.user)
      return response
    },
    logout() {
      clearToken()
      localStorage.removeItem('zenheaven_user')
      setUser(null)
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? children : <Navigate to="/login" replace />
}

function Loading() {
  return <div className="container page"><p className="mono muted">LOADING YOUR SPACE…</p></div>
}

function Logo() {
  return <Link className="wordmark" to="/"><span className="wordmark-mark">z</span> zenheaven</Link>
}

function SiteNav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navItems = user
    ? [['/dashboard', 'Today'], ['/chat', 'Companion'], ['/journal', 'Journal'], ['/books', 'Reading'], ['/music', 'Sound'], ['/therapists', 'Care']]
    : [['/', 'Home'], ['/login', 'Sign in']]

  return (
    <header className="site-nav">
      <Logo />
      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {navItems.map(([path, label]) => (
          <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        {user && <Link className="nav-coin" to="/coins">✦ {user.calm_coins ?? 0} coins</Link>}
        {user ? <button className="button small secondary" onClick={logout}>Leave</button> : <Link className="button small" to="/register">Begin here ↗</Link>}
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
      </div>
    </header>
  )
}

function SiteLayout() {
  return <div className="app-shell"><SiteNav /><main><Routes /></main><footer className="footer"><div className="container row"><span>ZENHEAVEN / A SOFTER PLACE TO LAND</span><span>MADE FOR THE IN-BETWEEN</span></div></footer></div>
}

function Home() {
  return (
    <>
      <section className="container hero">
        <div>
          <span className="eyebrow">A digital refuge for real life</span>
          <h1>Make space for <em>yourself.</em></h1>
          <p className="hero-copy">ZenHeaven is a collection of gentle tools, honest conversations, and small rituals for tending to your inner world.</p>
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <Link className="button" to="/register">Start your practice ↗</Link>
            <Link className="button secondary" to="/login">I’m returning</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="hero-card">
            <span className="card-kicker">Field note / 001</span>
            <h2>You don’t have to hold it all at once.</h2>
            <p>A tiny reminder to carry with you today. Put it somewhere you’ll find it again.</p>
          </div>
          <div className="scribble">take it slowly ✳</div>
        </div>
      </section>
      <div className="ticker"><div className="ticker-inner">{Array.from({ length: 2 }).map((_, index) => <span key={index}>A KINDER INTERNET <i className="ticker-dot">✳</i> ROOM TO FEEL <i className="ticker-dot">✳</i> TOOLS FOR THE TENDER DAYS <i className="ticker-dot">✳</i> A KINDER INTERNET <i className="ticker-dot">✳</i></span>)}</div></div>
      <section className="container section">
        <div className="section-head"><h2>Wellness is a practice, not a performance.</h2><p>Come as you are. Find one useful thing. Stay as long as you need.</p></div>
        <div className="manifesto">
          <div className="manifesto-copy"><span className="eyebrow">Our point of view</span><h3>The little rituals add up.</h3><p>There’s no perfect morning routine here. Just a set of tools designed to help you listen, reflect, connect, and begin again.</p></div>
          <div className="manifesto-list">
            {[['01', 'No judgement', 'A private corner to meet your feelings with curiosity instead of criticism.'], ['02', 'Small is enough', 'A single sentence, one song, or a five-minute conversation can shift a whole day.'], ['03', 'Support, together', 'When you need a human, find a qualified therapist who gets the whole picture.']].map(([number, title, text]) => <div className="manifesto-row" key={number}><b>{number}</b><div><h4>{title}</h4><p>{text}</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="section-head"><h2>Your everyday sanctuary.</h2><p>A modular toolkit for however today feels.</p></div>
        <div className="feature-grid">
          <FeatureCard color="lavender" icon="◌" title="Talk it out" text="An always-on companion for the thoughts you can’t quite say out loud." to="/chat" label="Open companion" />
          <FeatureCard icon="✎" title="Leave a note" text="A journal with prompts that meet you where you are, and nowhere else." to="/journal" label="Write a page" />
          <FeatureCard icon="↗" title="Find your people" text="Qualified therapists, thoughtfully presented. Care that feels human." to="/therapists" label="Meet the guides" />
          <FeatureCard icon="♫" title="Set the tone" text="Mood-based music for the walk, the work, the wind-down, and the restart." to="/music" label="Find your sound" />
          <FeatureCard icon="▤" title="Read widely" text="Books that make room for a little more clarity, courage, and calm." to="/books" label="Browse the shelf" />
        </div>
      </section>
      <section className="container quote-strip"><span>From the journal / a note to self</span><blockquote>“The goal isn’t to feel good all the time. It’s to feel like you can meet whatever arrives.”</blockquote></section>
      <section className="container section" style={{ paddingBottom: 120, textAlign: 'center' }}><span className="eyebrow">Your next page is blank</span><h2 style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', maxWidth: 720, margin: '0 auto 30px' }}>Come in, take a breath.</h2><Link className="button lime" to="/register">Make an account — it’s free ↗</Link></section>
    </>
  )
}

function FeatureCard({ icon, title, text, to, label }) {
  return <div className="feature-card"><span className="feature-icon">{icon}</span><div><h3>{title}</h3><p>{text}</p></div><Link to={to}>{label} ↗</Link></div>
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />

  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await (isLogin ? login({ username: form.username, password: form.password }) : register(form))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  return <div className="auth-shell"><aside className="auth-aside"><Logo /><h1>There is room for <em>all of you.</em></h1><small>ZENHEAVEN / EST. 2025 / FOR THE HUMAN IN PROGRESS</small></aside><div className="auth-form-wrap"><div className="auth-form"><span className="eyebrow">{isLogin ? 'Welcome back' : 'A fresh beginning'}</span><h2>{isLogin ? 'Good to see you.' : 'Come on in.'}</h2><p>{isLogin ? 'Your space is waiting exactly as you left it.' : 'Create a quiet corner for your thoughts, rituals, and next steps.'}</p>{error && <div className="error">{error}</div>}<form onSubmit={submit}>
    {!isLogin && <div className="field"><label className="label" htmlFor="full_name">Your name</label><input className="input" id="full_name" value={form.full_name} onChange={update('full_name')} placeholder="What should we call you?" /></div>}
    <div className="field"><label className="label" htmlFor="username">Username</label><input className="input" id="username" required value={form.username} onChange={update('username')} placeholder="your calm corner" /></div>
    {!isLogin && <div className="field"><label className="label" htmlFor="email">Email</label><input className="input" id="email" type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" /></div>}
    <div className="field"><label className="label" htmlFor="password">Password</label><input className="input" id="password" type="password" required minLength="6" value={form.password} onChange={update('password')} placeholder="Six or more characters" /></div>
    <button className="button" disabled={busy} type="submit">{busy ? 'One moment…' : isLogin ? 'Enter ZenHeaven ↗' : 'Create my space ↗'}</button>
  </form><p style={{ marginTop: 28 }}>{isLogin ? 'New here? ' : 'Already have a space? '}<Link style={{ textDecoration: 'underline' }} to={isLogin ? '/register' : '/login'}>{isLogin ? 'Make an account' : 'Sign in'}</Link></p></div></div></div>
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{description && <p>{description}</p>}{action}</div>
}

function Dashboard() {
  const { user } = useAuth()
  return <div className="container page"><PageHeader eyebrow="Your space / today" title={<>Hello, <em>{user?.full_name?.split(' ')[0] || user?.username || 'friend'}.</em></>} description="A few places to start, depending on what kind of day this is." /><div className="page-grid"><div className="panel panel-padding" style={{ background: 'var(--lavender)' }}><span className="eyebrow">A small invitation</span><h2>What needs your attention?</h2><p className="panel-subtitle">You don’t need to have the answer. Start with the thing that feels most present.</p><div className="stack" style={{ marginTop: 25 }}><Link className="button" to="/chat">I want to talk ↗</Link><Link className="button secondary" to="/journal">I want to write ↗</Link></div></div><div className="stack"><MiniLink to="/books" number="01" title="Something to read" text="A book for your current weather." /><MiniLink to="/music" number="02" title="A sound to hold" text="Build a softer soundtrack." /><MiniLink to="/coins" number="03" title="Your small wins" text="See the care you’ve been collecting." /></div></div><section className="section" style={{ paddingBottom: 0 }}><div className="section-head"><h2>Keep the thread.</h2><p>Your practice is not a streak to break. It’s a place to return.</p></div><div className="quote-strip"><span>Today’s note</span><blockquote>“You can do the next kind thing without knowing the whole way.”</blockquote></div></section></div>
}

function MiniLink({ to, number, title, text }) {
  return <Link className="manifesto-row" style={{ border: '1px solid var(--line)' }} to={to}><b>{number}</b><div><h4>{title} <span style={{ float: 'right' }}>↗</span></h4><p>{text}</p></div></Link>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { chatApi.threads().then((data) => setThreads(data.threads || [])).catch((err) => setError(err.message)) }, [])
  const selectThread = async (id) => {
    setThreadId(id)
    try { const data = await chatApi.thread(id); setMessages(data.messages || []) } catch (err) { setError(err.message) }
  }
  const send = async (event) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || thinking) return
    setInput('')
    setError('')
    setThinking(true)
    setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: message }, { id: `reply-${Date.now()}`, is_user: false, content: '', thinking: true }])
    try {
      await streamChat(message, threadId, (eventData) => {
        if (eventData.type === 'thread_id') setThreadId(eventData.data)
        if (eventData.type === 'thinking') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: eventData.data } : item))
        if (eventData.type === 'response_start') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: '', thinking: false } : item))
        if (eventData.type === 'token') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: `${item.content || ''}${eventData.data}`, thinking: false } : item))
        if (eventData.type === 'complete') chatApi.threads().then((data) => setThreads(data.threads || [])).catch(() => {})
      })
    } catch (err) {
      setError(err.message)
      setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: 'I couldn’t connect just now. You can try that again in a moment.', thinking: false } : item))
    } finally { setThinking(false) }
  }
  return <div className="container page"><PageHeader eyebrow="The companion" title={<>A place to <em>say it.</em></>} description="A thoughtful AI companion for untangling the thoughts that have been circling." /><div className="chat-layout"><aside className="chat-sidebar"><button className="button small" style={{ width: '100%', marginBottom: 20 }} onClick={() => { setThreadId(null); setMessages([]) }}>+ New thread</button><h3>Threads</h3>{threads.length ? threads.map((thread) => <button key={thread.id} className={`thread ${thread.id === threadId ? 'active' : ''}`} onClick={() => selectThread(thread.id)}>{thread.title}</button>) : <p className="muted" style={{ fontSize: '.72rem' }}>Your conversations will live here.</p>}</aside><section className="chat-main"><div className="chat-intro"><span className="eyebrow">Private by design</span><h2>What’s on your mind?</h2><p className="panel-subtitle">No need to make it neat. Start wherever you are.</p></div><div className="chat-messages">{messages.length === 0 && <div style={{ padding: '55px 0', textAlign: 'center' }}><span style={{ fontSize: '2rem' }}>✳</span><p className="muted">“I’ve been thinking about…” is a perfectly good place to start.</p></div>}{messages.map((message) => <div className={`message ${message.is_user ? 'user' : 'bot'}`} key={message.id}><span className="message-meta">{message.is_user ? 'You' : 'ZenHeaven companion'}</span>{message.content || 'Listening…'}</div>)}</div>{error && <div className="error" style={{ margin: '0 34px 12px' }}>{error}</div>}<form className="chat-composer" onSubmit={send}><input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write what’s here…" /><button className="button" type="submit" disabled={thinking}>{thinking ? 'Listening…' : 'Send ↗'}</button></form></section></div></div>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  useEffect(() => { journalApi.getEntries().then(setEntries).catch((err) => setError(err.message)); journalApi.getPrompts().then(setPrompts).catch(() => {}) }, [])
  const save = async (event) => {
    event.preventDefault()
    if (!content.trim()) return
    setError('')
    try {
      const entry = await journalApi.createEntry({ content, mood: mood || null, tags: [] })
      setEntries((current) => [entry, ...current])
      setContent('')
      setMood('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) { setError(err.message) }
  }
  return <div className="container page"><PageHeader eyebrow="The journal" title={<>Leave a <em>trace.</em></>} description="A place to notice what’s moving through you. No polished thoughts required." /><div className="page-grid"><form className="panel panel-padding" onSubmit={save}><span className="eyebrow">New entry / {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><label className="label" htmlFor="journal-content">What’s here today?</label><textarea className="textarea" id="journal-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start with the smallest true thing…" /><div className="form-row" style={{ marginTop: 18 }}><div className="field"><label className="label" htmlFor="mood">Mood, if you have one</label><select className="select" id="mood" value={mood} onChange={(event) => setMood(event.target.value)}><option value="">Choose gently</option>{['calm', 'hopeful', 'anxious', 'tired', 'grateful', 'overwhelmed'].map((item) => <option key={item}>{item}</option>)}</select></div><div style={{ display: 'flex', alignItems: 'end' }}><button className="button" type="submit">Keep this page ↗</button></div></div>{error && <div className="error">{error}</div>}{saved && <div className="success">Saved. You showed up for yourself today.</div>}</form><div className="stack">{prompts.slice(0, 3).map((prompt) => <div className="prompt-card" key={prompt.prompt} onClick={() => setContent(prompt.prompt)}><p>{prompt.prompt}</p><small>{prompt.category} / use this prompt</small></div>)}{!prompts.length && <div className="prompt-card"><p>What would feel kind to remember about today?</p><small>reflection / use this prompt</small></div>}</div></div><section className="section" style={{ paddingBottom: 0 }}><div className="section-head"><h2>Recent pages.</h2><p>Your writing is yours. Read it back only when it feels useful.</p></div>{entries.length ? entries.slice(0, 6).map((entry) => <article className="manifesto-row" key={entry._id || entry.id || entry.created_at}><b>{entry.mood || 'note'}</b><div><h4>{entry.title || 'Untitled page'}</h4><p>{entry.content}</p></div></article>) : <div className="panel panel-padding"><p className="muted">Your first page is waiting whenever you are.</p></div>}</section></div>
}

function Books() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  const [error, setError] = useState('')
  useEffect(() => { booksApi.byMood().then((data) => { setBooks(data.books || []); setMood(data.mood || 'balanced') }).catch((err) => setError(err.message)) }, [])
  const search = async (event) => {
    event.preventDefault()
    if (!query.trim()) return
    try { const data = await booksApi.search(query); setBooks(data.books || []); setMood(`searching “${query}”`) } catch (err) { setError(err.message) }
  }
  return <div className="container page"><PageHeader eyebrow="The reading room" title={<>A shelf for <em>where you are.</em></>} description={`Curated by your recent mood — ${mood}.`} action={<form className="row" onSubmit={search}><input className="input" style={{ minWidth: 190 }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" /><button className="button small" type="submit">Find</button></form>} />{error && <div className="error" style={{ marginBottom: 20 }}>{error}</div>}<div className="book-grid">{books.map((book, index) => <article className="book-card" key={book.id || index}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <span>{book.title}</span>}</div><div className="book-info"><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p></div></article>)}</div>{!books.length && <div className="panel panel-padding"><p className="muted">The shelf is quiet right now. Try a search, or check back in a little while.</p></div>}</div>
}

function Music() {
  const [songs, setSongs] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { musicApi.songs().then((data) => setSongs(data.songs || [])).catch((err) => setError(err.message)) }, [])
  const listen = async (song) => {
    setSelected(song)
    try { const data = await musicApi.recommend(song); setRecommendations(data.recommendations || []) } catch (err) { setError(err.message) }
  }
  return <div className="container page"><PageHeader eyebrow="The sound room" title={<>A soundtrack for <em>this moment.</em></>} description="Choose a song to find five more that understand the feeling." />{error && <div className="error" style={{ marginBottom: 20 }}>{error}</div>}<div className="page-grid"><div className="panel panel-padding"><div className="row"><div><span className="eyebrow">Available in the archive</span><h2>Pick a starting point.</h2></div><span className="mono muted">{songs.length} tracks</span></div><div className="music-list">{songs.slice(0, 12).map((song, index) => <button className="song-row" key={song} onClick={() => listen(song)} style={{ width: '100%', border: 0, borderBottom: '1px solid var(--line)', background: selected === song ? 'var(--acid)' : 'transparent', textAlign: 'left' }}><span className="song-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{song}</h3><p>Tap to make a mood mix</p></div><span>↗</span></button>)}</div>{!songs.length && <p className="muted">The archive is still tuning itself.</p>}</div><div className="panel panel-padding" style={{ background: 'var(--lavender)' }}><span className="eyebrow">Your mix</span><h2>{selected ? `Because you played “${selected}”.` : 'It starts with a song.'}</h2><p className="panel-subtitle">A few nearby feelings, found through the archive.</p><div className="stack" style={{ marginTop: 25 }}>{recommendations.map((song) => <div className="row" key={song.name}><div><strong style={{ fontSize: '.8rem' }}>{song.name}</strong><div className="muted" style={{ fontSize: '.68rem' }}>{song.artist}</div></div><span>♫</span></div>)}</div></div></div></div>
}

const fallbackTherapists = [
  { _id: 'fallback-sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, bio: 'A warm, evidence-based approach for anxious seasons and big transitions.', rating: 4.8, hourly_rate: 120 },
  { _id: 'fallback-maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem'], experience_years: 8, bio: 'Helping people build kinder relationships with themselves and each other.', rating: 4.9, hourly_rate: 100 },
  { _id: 'fallback-aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief', 'Life transitions'], experience_years: 7, bio: 'Culturally sensitive care for the chapters that change us.', rating: 4.8, hourly_rate: 95 },
]

function Therapists() {
  const { user } = useAuth()
  const [therapists, setTherapists] = useState([])
  const [error, setError] = useState('')
  const [booked, setBooked] = useState('')
  useEffect(() => { therapistsApi.list().then(setTherapists).catch((err) => { setError(err.message); setTherapists(fallbackTherapists) }) }, [])
  const book = async (therapist) => {
    const start = new Date(Date.now() + 86400000)
    start.setHours(10, 0, 0, 0)
    const end = new Date(start.getTime() + 3600000)
    try {
      await therapistsApi.book({ user_id: user.id, therapist_id: therapist._id, date: start.toISOString(), start_time: start.toISOString(), end_time: end.toISOString(), session_type: 'video' })
      setBooked(therapist.name)
    } catch (err) { setError(err.message) }
  }
  return <div className="container page"><PageHeader eyebrow="The care directory" title={<>Find a guide for <em>the next bit.</em></>} description="Licensed professionals with different lenses, lived experience, and ways of working." />{error && !therapists.length && <div className="error">{error}</div>}{booked && <div className="success" style={{ marginBottom: 20 }}>Request sent for {booked}. We’ll meet you there.</div>}<div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="avatar">{therapist.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><h3>{therapist.name}</h3><div className="muted" style={{ fontSize: '.68rem' }}>{therapist.experience_years} years in practice · ★ {therapist.rating || '4.8'}</div><div style={{ marginTop: 11 }}>{(therapist.specializations || []).slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><p>{therapist.bio}</p><div className="row"><span className="mono">${therapist.hourly_rate || 100} / session</span><button className="button small secondary" onClick={() => book(therapist)}>Request ↗</button></div></article>)}</div></div>
}

function Coins() {
  const [balance, setBalance] = useState(0)
  const [goals, setGoals] = useState([])
  const [streak, setStreak] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([coinsApi.balance(), coinsApi.goals(), coinsApi.streak(), coinsApi.transactions()]).then(([balanceData, goalData, streakData, transactionData]) => {
      setBalance(balanceData.balance || 0); setGoals(goalData || []); setStreak(streakData.current_streak || 0); setTransactions(transactionData || [])
    }).catch((err) => setError(err.message))
  }, [])
  return <div className="container page"><PageHeader eyebrow="Calm coins" title={<>Notice what you’ve <em>done.</em></>} description="A soft accounting of the care you invest in yourself. No scores, no pressure." />{error && <div className="error" style={{ marginBottom: 20 }}>{error}</div>}<div className="page-grid"><div><div className="balance-card"><small>Your balance</small><strong>{balance}</strong><span className="mono">CALM COINS / {streak} day {streak === 1 ? 'return' : 'return streak'}</span></div><div className="panel panel-padding" style={{ marginTop: 18 }}><div className="row"><h2>Today’s invitations</h2><span className="mono muted">earn gently</span></div>{goals.length ? goals.map((goal) => <div className="goal-row" key={goal.id}><div className="row"><strong>{goal.title}</strong><span className="mono">+{goal.coins}</span></div><div className="progress"><i style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} /></div></div>) : <p className="muted">Your daily invitations will appear here.</p>}</div></div><div className="panel panel-padding"><span className="eyebrow">The ledger</span><h2>Recent care.</h2>{transactions.length ? transactions.slice(0, 8).map((transaction, index) => <div className="goal-row" key={transaction._id || index}><div className="row"><strong>{transaction.description || transaction.source}</strong><span className="mono">{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</span></div><small className="muted">{transaction.source}</small></div>) : <p className="muted">Your first little win will show up here.</p>}</div></div></div>
}

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route element={<SiteLayout />}><Route index element={<Home />} /><Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /><Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} /><Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} /><Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} /><Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} /><Route path="/therapists" element={<ProtectedRoute><Therapists /></ProtectedRoute>} /><Route path="/coins" element={<ProtectedRoute><Coins /></ProtectedRoute>} /><Route path="*" element={<div className="container page"><h1>That page wandered off.</h1><Link className="button" to="/">Back home ↗</Link></div>} /></Route></Routes></AuthProvider>
}
