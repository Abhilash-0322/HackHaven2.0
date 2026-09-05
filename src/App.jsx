import { createContext, useContext, useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookHeart, BookOpen, Brain, Check, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Coins, Headphones, Heart, Home, Leaf, LogOut, Menu, MessageCircle, MoreHorizontal,
  Music2, Plus, Search, Send, Sparkles, Star, Stethoscope, Sun, Trash2, Trophy,
  UserRound, X, Zap, ArrowUpRight,
} from 'lucide-react'
import { api, clearToken, getToken, saveToken, streamChat } from './lib/api'

const AuthContext = createContext(null)
const useAuth = () => useContext(AuthContext)

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/chat', label: 'Talk it out', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Reading nook', icon: BookHeart },
  { to: '/music', label: 'Sound room', icon: Headphones },
  { to: '/therapists', label: 'Find support', icon: Stethoscope },
  { to: '/coins', label: 'Calm coins', icon: Coins },
]

const fallbackGoals = [
  { id: 1, title: 'Check in with yourself', target: 1, current: 0, coins: 10, icon: 'Heart' },
  { id: 2, title: 'Write in your journal', target: 1, current: 0, coins: 15, icon: 'BookOpen' },
  { id: 3, title: 'Take one mindful pause', target: 1, current: 0, coins: 5, icon: 'Brain' },
]

function useAsync(load, initial, deps = []) {
  const [value, setValue] = useState(initial)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    setLoading(true)
    load().then((result) => active && setValue(result)).catch(() => active && setValue(initial)).finally(() => active && setLoading(false))
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return [value, setValue, loading]
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))
  useEffect(() => {
    if (!getToken()) { setLoading(false); return }
    api.auth.me().then(setUser).catch(() => { clearToken(); setUser(null) }).finally(() => setLoading(false))
  }, [])
  const signIn = (session) => { saveToken(session.access_token); setUser(session.user) }
  const signOut = () => { clearToken(); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/books" element={<Books />} />
      <Route path="/music" element={<Music />} />
      <Route path="/therapists" element={<Therapists />} />
      <Route path="/coins" element={<CoinsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider>
}

function Landing() {
  const { user } = useAuth()
  return <div className="landing-shell">
    <div className="landing-nav"><Link className="brand" to="/"><span className="brand-mark"><Leaf size={17} /></span> zenheaven</Link><div className="landing-links"><span>made for softer days</span>{user ? <Link className="text-link" to="/dashboard">Open workspace <ArrowRight size={15} /></Link> : <Link className="button button-small" to="/login">Enter workspace <ArrowRight size={15} /></Link>}</div></div>
    <main className="landing-main">
      <div className="landing-copy"><span className="eyebrow"><Sparkles size={13} /> a gentler place to land</span><h1>Your mind deserves<br /><em>some room.</em></h1><p>ZenHeaven is a quiet, block-based workspace for checking in, finding perspective, and taking care of yourself — one small step at a time.</p><div className="landing-actions"><Link className="button" to={user ? '/dashboard' : '/register'}>Start your workspace <ArrowRight size={16} /></Link><span className="micro-copy"><span className="dot-green" /> private by design</span></div></div>
      <div className="landing-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="landing-card"><div className="mini-card-top"><span className="mini-dot" /><span>today, gently</span><MoreHorizontal size={16} /></div><h3>How are you arriving?</h3><p>There is no right answer. Just notice what is here.</p><div className="mood-row"><span>🌿</span><span>☁️</span><span>🌤️</span><span>☀️</span></div><div className="line-placeholder short" /><div className="line-placeholder" /></div><div className="leaf-illustration">✦</div></div>
    </main>
    <div className="landing-foot"><span>journal</span><span>·</span><span>conversation</span><span>·</span><span>connection</span><span>·</span><span>care</span></div>
  </div>
}

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', full_name: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const session = isRegister ? await api.auth.register(form) : await api.auth.login({ username: form.username, password: form.password })
      signIn(session); navigate('/dashboard')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="auth-shell"><Link className="brand auth-brand" to="/"><span className="brand-mark"><Leaf size={17} /></span> zenheaven</Link><div className="auth-panel"><div className="auth-heading"><span className="eyebrow"><Sparkles size={13} /> your quiet corner</span><h1>{isRegister ? 'Make space for you.' : 'Welcome back.'}</h1><p>{isRegister ? 'A small, private workspace for the things that matter.' : 'Pick up wherever you left off.'}</p></div><form className="auth-form" onSubmit={submit}>{isRegister && <Field label="What should we call you?" value={form.full_name} onChange={update('full_name')} placeholder="Your name (optional)" />}{<Field label="Username" value={form.username} onChange={update('username')} placeholder="your-username" required />}{isRegister && <Field label="Email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />}<Field label="Password" type="password" value={form.password} onChange={update('password')} placeholder="At least 6 characters" required />{error && <div className="form-error"><CircleHelp size={15} /> {error}</div>}<button className="button button-full" disabled={busy}>{busy ? 'One moment…' : isRegister ? 'Create my workspace' : 'Continue'} <ArrowRight size={16} /></button></form><p className="auth-switch">{isRegister ? 'Already have a workspace?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create one'}</Link></p></div><div className="auth-note"><span>✦</span> Nothing here needs to be perfect.</div></div>
}

function Field({ label, type = 'text', ...props }) {
  return <label className="field"><span>{label}</span><input type={type} {...props} /></label>
}

function ProtectedLayout() {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  if (loading) return <div className="loading-screen"><Leaf size={22} /><span>settling in…</span></div>
  if (!user) return <Navigate to="/login" replace />
  return <div className="app-shell"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button><Sidebar open={mobileOpen} close={() => setMobileOpen(false)} /><main className="workspace"><Topbar /><div className="page-content"><OutletPlaceholder /></div></main></div>
}

function OutletPlaceholder() {
  const location = useLocation()
  return <Routes>
    <Route path="*" element={<PageRouter location={location} />} />
  </Routes>
}

function PageRouter({ location }) {
  const path = location.pathname
  if (path === '/dashboard') return <Dashboard />
  if (path === '/chat') return <Chat />
  if (path === '/journal') return <Journal />
  if (path === '/books') return <Books />
  if (path === '/music') return <Music />
  if (path === '/therapists') return <Therapists />
  return <CoinsPage />
}

function Sidebar({ open, close }) {
  const { user, signOut } = useAuth()
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-head"><Link className="brand" to="/dashboard" onClick={close}><span className="brand-mark"><Leaf size={17} /></span> zenheaven</Link><button className="sidebar-close" onClick={close}><X size={17} /></button></div><div className="workspace-switch"><span className="workspace-icon">☁</span><span><strong>My workspace</strong><small>personal space</small></span><ChevronDown size={15} /></div><div className="nav-label">workspace</div><nav>{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Calm coins' && <span className="nav-badge">✦</span>}</NavLink>)}</nav><div className="sidebar-spacer" /><div className="sidebar-note"><Sparkles size={15} /><div><strong>tiny steps count</strong><span>There is no rush here.</span></div></div><div className="sidebar-user"><div className="avatar">{(user?.full_name || user?.username || 'Z').slice(0, 1).toUpperCase()}</div><div><strong>{user?.full_name || user?.username}</strong><span>your account</span></div><button title="Sign out" onClick={signOut}><LogOut size={16} /></button></div></aside>
}

function Topbar() {
  const { user } = useAuth()
  const location = useLocation()
  const current = navItems.find((item) => location.pathname.startsWith(item.to))
  return <header className="topbar"><div className="breadcrumbs"><span>My workspace</span><ChevronRight size={14} /><strong>{current?.label || 'Home'}</strong></div><div className="topbar-right"><span className="topbar-date">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span><div className="top-avatar">{(user?.full_name || user?.username || 'Z').slice(0, 1).toUpperCase()}</div></div></header>
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Block({ icon, title, children, className = '', accent = '' }) {
  return <section className={`block ${accent} ${className}`}><div className="block-title">{icon && <span className="block-icon">{icon}</span>}<h2>{title}</h2><MoreHorizontal size={16} className="block-more" /></div>{children}</section>
}

function ToggleBlock({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return <div className={`toggle-block ${open ? 'open' : ''}`}><button className="toggle-heading" onClick={() => setOpen(!open)}><span className="toggle-chevron">{open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>{icon}<strong>{title}</strong><span className="toggle-rule" /></button>{open && <div className="toggle-body">{children}</div>}</div>
}

function Dashboard() {
  const { user } = useAuth()
  const [balance, , balanceLoading] = useAsync(() => api.dashboard.balance(), { balance: user?.calm_coins || 100 })
  const [goals] = useAsync(() => api.dashboard.goals(), fallbackGoals)
  const [streak] = useAsync(() => api.dashboard.streak(), { current_streak: 0 })
  const [entries] = useAsync(() => api.journal.entries(), [])
  const completed = goals.filter((goal) => goal.completed || goal.current >= goal.target).length
  return <div className="dashboard-page"><PageHeader eyebrow="Saturday, September 5" title={`Good evening, ${user?.full_name?.split(' ')[0] || user?.username || 'friend'}.`} description="A little room to notice how you are doing." action={<Link className="button button-small" to="/journal"><Plus size={15} /> New entry</Link>} /><div className="dashboard-grid"><Block className="welcome-block" title="today's intention" icon={<Sun size={15} />} accent="accent-lilac"><div className="intention"><div className="intention-mark">✦</div><div><h3>Move at the pace of your breath.</h3><p>You do not have to solve everything today. Showing up is enough.</p></div></div><div className="block-footer"><span>from your workspace</span><span className="tiny-chip">gentle reminder</span></div></Block><Block title="your rhythm" icon={<Zap size={15} />}><div className="rhythm-stat"><strong>{streak.current_streak || 0}</strong><span>day{streak.current_streak === 1 ? '' : 's'} of showing up</span></div><div className="week-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className={index < Math.min(streak.current_streak || 0, 7) ? 'filled' : index === 5 ? 'today' : ''}><i />{day}</span>)}</div></Block><Block title="calm coins" icon={<Coins size={15} />} accent="accent-yellow"><div className="coin-stat"><span className="coin-glyph">✦</span><strong>{balanceLoading ? '—' : balance.balance ?? 0}</strong><span>coins to spend on care</span></div><Link to="/coins" className="block-link">See your progress <ArrowRight size={14} /></Link></Block><Block className="goals-block" title="small things for today" icon={<Check size={15} />}><div className="progress-label"><span>{completed} of {goals.length || 3} complete</span><span>{Math.round((completed / (goals.length || 3)) * 100)}%</span></div><div className="progress-track"><span style={{ width: `${(completed / (goals.length || 3)) * 100}%` }} /></div><div className="goal-list">{(goals.length ? goals : fallbackGoals).slice(0, 3).map((goal) => <div className="goal-row" key={goal.id}><span className={`check-circle ${goal.completed || goal.current >= goal.target ? 'done' : ''}`}>{(goal.completed || goal.current >= goal.target) && <Check size={12} />}</span><span>{goal.title}</span><span className="goal-coins">+{goal.coins} <span>✦</span></span></div>)}</div></Block><Block className="recent-block" title="recent reflections" icon={<BookOpen size={15} />}><div className="reflection-list">{entries.length ? entries.slice(0, 3).map((entry) => <Link to="/journal" className="reflection-row" key={entry._id || entry.id}><span className="reflection-dot" /><span><strong>{entry.title || 'A quiet reflection'}</strong><small>{entry.mood || 'untitled moment'} · {formatDate(entry.created_at)}</small></span><ChevronRight size={14} /></Link>) : <div className="empty-inline"><span>✎</span><p>Your first reflection is waiting for you.</p><Link to="/journal">Write something <ArrowRight size={13} /></Link></div>}</div></Block><div className="dashboard-quote"><span>“</span><p>Almost everything will work again if you unplug it for a few minutes, including you.</p><small>— Anne Lamott</small></div></div></div>
}

function Journal() {
  const [entries, setEntries, loading] = useAsync(() => api.journal.entries(), [])
  const [prompts] = useAsync(() => api.journal.prompts(), [{ prompt: 'What made you smile today?', category: 'gratitude' }, { prompt: 'What is asking for your attention?', category: 'reflection' }])
  const [insights] = useAsync(() => api.journal.insights(), { total_entries: 0, top_moods: [] })
  const [composer, setComposer] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  async function remove(id) { if (!window.confirm('Remove this reflection?')) return; try { await api.journal.remove(id); setEntries(entries.filter((item) => (item._id || item.id) !== id)) } catch { /* Preserve the entry if the API is unavailable. */ } }
  return <div><PageHeader eyebrow="a place to be honest" title="Journal" description="Put down what is on your mind. It does not need to be polished." action={<button className="button button-small" onClick={() => setComposer(true)}><Plus size={15} /> New reflection</button>} /><div className="journal-layout"><div className="journal-main"><ToggleBlock icon={<Sparkles size={15} />} title="prompts for right now"><div className="prompt-grid">{prompts.slice(0, 4).map((prompt, index) => <button className={`prompt-card prompt-${index + 1}`} key={prompt.prompt} onClick={() => { setSelectedPrompt(prompt.prompt); setComposer(true) }}><span>{prompt.category}</span><strong>{prompt.prompt}</strong><ArrowRight size={14} /></button>)}</div></ToggleBlock><Block title={`${entries.length || 0} reflections`} icon={<BookOpen size={15} />}>{loading ? <LoadingRows /> : entries.length ? <div className="entry-list">{entries.map((entry) => <article className="entry-row" key={entry._id || entry.id}><div className="entry-date">{formatDate(entry.created_at, true)}</div><div className="entry-content"><div className="entry-top"><h3>{entry.title || 'A moment to remember'}</h3><span className="mood-pill">{entry.mood || 'reflecting'}</span></div><p>{entry.content}</p><div className="entry-meta">{(entry.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}<button onClick={() => remove(entry._id || entry.id)} aria-label="Delete reflection"><Trash2 size={14} /></button></div></div></article>)}</div> : <EmptyState icon="✎" title="A blank page can be kind." text="Start with one honest sentence. You can always write more later." action="Write your first reflection" onClick={() => setComposer(true)} />}</Block></div><aside className="journal-aside"><Block title="your patterns" icon={<Brain size={15} />} accent="accent-lilac"><div className="insight-big"><strong>{insights.total_entries || entries.length || 0}</strong><span>total reflections</span></div>{insights.top_moods?.length ? <div className="mood-bars">{insights.top_moods.slice(0, 3).map((mood, index) => <div className="mood-bar" key={mood._id}><div><span>{mood._id}</span><small>{mood.count}</small></div><i style={{ width: `${Math.max(20, 100 - index * 22)}%` }} /></div>)}</div> : <p className="aside-copy">Your patterns will gently appear as you spend time here.</p>}</Block><Block title="writing ritual" icon={<Clock3 size={15} />}><div className="ritual"><span className="ritual-icon">☕</span><strong>Find a tiny window</strong><p>Even five minutes of noticing can change the shape of a day.</p></div></Block></aside></div>{composer && <Composer initialPrompt={selectedPrompt} close={() => { setComposer(false); setSelectedPrompt(null) }} saved={(entry) => { setEntries([entry, ...entries]); setComposer(false); setSelectedPrompt(null) }} />}</div>
}

function Composer({ initialPrompt, close, saved }) {
  const [content, setContent] = useState(initialPrompt || '')
  const [mood, setMood] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); if (!content.trim()) return
    setBusy(true)
    try { const entry = await api.journal.create({ content, mood: mood || null, tags: [] }); saved(entry) } catch { saved({ id: `local-${Date.now()}`, content, mood: mood || 'reflecting', title: 'A moment to remember', created_at: new Date().toISOString(), tags: [] }) } finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><form className="composer modal-card" onSubmit={submit}><div className="modal-head"><div><span className="eyebrow">new reflection</span><h2>What is here today?</h2></div><button type="button" onClick={close}><X size={18} /></button></div><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start wherever feels easiest…" /><div className="mood-select"><span>mood, if you want to name it</span>{['calm', 'hopeful', 'tired', 'anxious', 'grateful'].map((item) => <button type="button" className={mood === item ? 'selected' : ''} onClick={() => setMood(item)} key={item}>{item}</button>)}</div><div className="modal-actions"><span>✦ earns 10 calm coins</span><button className="button button-small" disabled={busy || !content.trim()}>{busy ? 'Saving…' : 'Save reflection'} <ArrowRight size={15} /></button></div></form></div>
}

function Chat() {
  const [threads, setThreads] = useAsync(() => api.chat.threads().then((data) => data.threads || []), [])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [sending, setSending] = useState(false)
  useEffect(() => { if (selected) api.chat.thread(selected).then((data) => setMessages(data.messages || [])).catch(() => setMessages([])) }, [selected])
  async function send(event) {
    event.preventDefault(); const message = input.trim(); if (!message || sending) return
    setInput(''); setSending(true); setThinking('opening a little space…'); setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: message }])
    let assistantId = `assistant-${Date.now()}`
    setMessages((current) => [...current, { id: assistantId, is_user: false, content: '' }])
    try {
      await streamChat(message, selected, (eventData) => {
        if (eventData.type === 'thread_id') { setSelected(eventData.data); if (!threads.some((thread) => thread.id === eventData.data)) setThreads([{ id: eventData.data, title: 'New conversation', message_count: 0 }, ...threads]) }
        if (eventData.type === 'thinking') setThinking(eventData.data)
        if (eventData.type === 'response_start') setThinking('')
        if (eventData.type === 'token') setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + eventData.data } : item))
        if (eventData.type === 'complete') { setThinking(''); assistantId = eventData.data.message_id || assistantId }
        if (eventData.type === 'error') setThinking(eventData.data)
      })
    } catch (error) { setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: 'I am here with you, but the connection is resting. Please try sending that again in a moment.' } : item)); setThinking(error.message) } finally { setSending(false) }
  }
  return <div className="chat-page"><PageHeader eyebrow="a conversation without judgment" title="Talk it out" description="You can bring the tangled version. CalmBot will meet you there." action={<span className="privacy-note"><span className="dot-green" /> private conversation</span>} /><div className="chat-layout"><aside className="thread-panel"><div className="thread-head"><strong>your conversations</strong><button title="New conversation" onClick={() => { setSelected(null); setMessages([]) }}><Plus size={15} /></button></div>{threads.length ? threads.map((thread) => <button className={`thread-row ${selected === thread.id ? 'selected' : ''}`} key={thread.id} onClick={() => setSelected(thread.id)}><span className="thread-icon"><MessageCircle size={14} /></span><span><strong>{thread.title}</strong><small>{thread.message_count || 0} notes</small></span></button>) : <p className="thread-empty">Your conversations will live here.</p>}<div className="thread-bottom"><Sparkles size={14} /> <span>5 coins per conversation</span></div></aside><section className="chat-window"><div className="chat-intro"><div className="bot-orb"><Leaf size={23} /></div><h2>Hi, I’m CalmBot.</h2><p>Think of me as a quiet place to put things down. What’s taking up space in your mind?</p><div className="starter-prompts"><button onClick={() => setInput('I feel a little overwhelmed today')}>I feel overwhelmed <ArrowRight size={13} /></button><button onClick={() => setInput('Help me find a moment of calm')}>Help me find some calm <ArrowRight size={13} /></button></div></div><div className="messages">{messages.map((message) => <div className={`message ${message.is_user ? 'from-user' : 'from-bot'}`} key={message.id}><div className="message-avatar">{message.is_user ? <UserRound size={14} /> : <Leaf size={14} />}</div><div className="message-bubble">{message.content || <span className="typing"><i /><i /><i /></span>}</div></div>)}{thinking && <div className="thinking"><Sparkles size={13} /> {thinking}</div>}</div><form className="chat-input" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Share what’s on your mind…" /><button disabled={!input.trim() || sending}><Send size={17} /></button></form><small className="chat-disclaimer">CalmBot offers supportive reflection, not medical advice. If you are in immediate danger, contact local emergency services.</small></section></div></div>
}

function Books() {
  const [data, , loading] = useAsync(() => api.books.byMood(), { mood: 'balanced', mood_description: 'Books selected to enhance your general well-being', books: [] })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  async function search(event) { event.preventDefault(); if (!query.trim()) return; setSearching(true); try { setResults((await api.books.search(query)).books || []) } catch { setResults([]) } finally { setSearching(false) } }
  const books = results || data.books || []
  return <div><PageHeader eyebrow="pages for your inner life" title="Reading nook" description="A shelf of ideas to meet you where you are." action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf…" /><button>{searching ? '…' : 'Go'}</button></form>} /><ToggleBlock icon={<Sparkles size={15} />} title={`picked for your ${data.mood || 'balanced'} mood`}><div className="mood-banner"><span className="mood-emoji">☁</span><div><strong>{data.mood_description || 'A few gentle recommendations for today.'}</strong><span>Based on your latest check-in · <Link to="/journal">update your mood</Link></span></div></div></ToggleBlock><div className="section-label">{results ? `search results for “${query}”` : 'recommended reads'} <span>{books.length} books</span></div>{loading ? <LoadingRows /> : books.length ? <div className="book-grid">{books.map((book, index) => <BookCard key={book.id || index} book={book} index={index} />)}</div> : <EmptyState icon="⌁" title="The shelf is still being arranged." text="Try searching for a book, author, or idea that feels good today." />}</div>
}

function BookCard({ book, index }) {
  const colors = ['book-sage', 'book-lilac', 'book-peach', 'book-sky']
  return <article className="book-card"><div className={`book-cover ${colors[index % colors.length]}`}>{book.image_url ? <img src={book.image_url} alt="" /> : <><span>zenheaven</span><strong>{book.title}</strong><small>{book.author}</small></>}</div><div className="book-info"><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p><span className="book-description">{book.description || 'A thoughtful companion for your shelf.'}</span><button className="save-book"><Heart size={14} /> save for later</button></div></article>
}

function Music() {
  const [songs, , loading] = useAsync(() => api.music.songs().then((data) => data.songs || []), ['Weightless', 'Bloom', 'Holocene', 'Sunset Lover', 'Near Light'])
  const [selected, setSelected] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  async function recommend(song) { setSelected(song); try { setRecommendations((await api.music.recommend(song)).recommendations || []) } catch { setRecommendations([]) } }
  return <div><PageHeader eyebrow="sound for the space between thoughts" title="Sound room" description="A little atmosphere can make a lot of room." action={<span className="tiny-chip"><Music2 size={13} /> curated for calm</span>} /><div className="music-layout"><Block title="choose a starting point" icon={<Headphones size={15} />}><p className="block-description">Pick a song and we’ll find a few neighboring moods.</p><div className="song-list">{loading ? <LoadingRows /> : songs.slice(0, 8).map((song, index) => <button className={`song-row ${selected === song ? 'selected' : ''}`} key={song} onClick={() => recommend(song)}><span className="album-art">{['◒', '◌', '◍', '◓'][index % 4]}</span><span><strong>{song}</strong><small>{index % 2 ? 'slow mornings' : 'a little lighter'}</small></span><span className="play-button">{selected === song ? '●' : '▶'}</span></button>)}</div></Block><div className="now-playing"><div className="record"><div>✦</div></div><span className="eyebrow">now, gently</span><h2>{selected || 'Choose a song'}</h2><p>{selected ? 'Let the edges soften for a little while.' : 'Select something from the list to begin.'}</p><div className="fake-progress"><span /></div><div className="player-controls"><button>↶</button><button className="player-play">{selected ? 'Ⅱ' : '▶'}</button><button>↷</button></div></div></div>{selected && <Block title={`near ${selected}`} icon={<Sparkles size={15} />}><div className="recommendation-row">{recommendations.length ? recommendations.map((song) => <button key={song.name} onClick={() => recommend(song)}><span className="album-art small">◌</span><span><strong>{song.name}</strong><small>{song.artist}</small></span><ArrowRight size={14} /></button>) : <p className="aside-copy">Recommendations will appear when the music library is connected.</p>}</div></Block>}</div>
}

function Therapists() {
  const [therapists, , loading] = useAsync(() => api.therapists.list().catch(() => []), [])
  const [filter, setFilter] = useState('')
  const filtered = therapists.filter((therapist) => !filter || therapist.specializations?.some((item) => item.toLowerCase().includes(filter.toLowerCase())))
  return <div><PageHeader eyebrow="support, when you want it" title="Find support" description="You do not have to carry everything alone. Browse licensed professionals at your own pace." /><div className="support-banner"><div className="support-icon"><Heart size={20} /></div><div><strong>Not sure where to start?</strong><p>Look for the specialty that sounds closest to what you’re experiencing today.</p></div><a href="https://988lifeline.org/" target="_blank" rel="noreferrer">Crisis resources <ArrowUpRight size={14} /></a></div><div className="filter-row"><span className="section-label">available professionals <span>{filtered.length} matches</span></span><div className="filter-pills">{['', 'Anxiety', 'Depression', 'Stress', 'Relationships'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item || 'All specialties'}</button>)}</div></div>{loading ? <LoadingRows /> : filtered.length ? <div className="therapist-grid">{filtered.map((therapist) => <TherapistCard therapist={therapist} key={therapist._id || therapist.id} />)}</div> : <EmptyState icon="♡" title="No professionals found yet." text="The directory may be taking a moment to wake up. Try again shortly." />}</div>
}

function TherapistCard({ therapist }) {
  const [open, setOpen] = useState(false)
  const name = therapist.name || 'A trusted professional'
  return <article className="therapist-card"><div className="therapist-top"><div className="therapist-avatar">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><span className="verified"><Check size={11} /> verified</span></div><h3>{name}</h3><p>{therapist.education || 'Licensed mental health professional'}</p><div className="specialties">{(therapist.specializations || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div><div className="therapist-meta"><span><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span><span>{therapist.experience_years || 8} yrs exp.</span><span>${therapist.hourly_rate || 95}/hr</span></div><button className="button button-small button-full" onClick={() => setOpen(!open)}>{open ? 'Hide availability' : 'View availability'} <ArrowRight size={14} /></button>{open && <div className="availability"><span>next available sessions</span><div><button>Tomorrow · 10:00</button><button>Thu · 14:30</button></div></div>}</article>
}

function CoinsPage() {
  const [balance] = useAsync(() => api.coins.balance(), { balance: 0 })
  const [transactions] = useAsync(() => api.coins.transactions(), [])
  const [achievements] = useAsync(() => api.coins.achievements(), [])
  const [rates] = useAsync(() => api.coins.rates(), { earning: {} })
  return <div><PageHeader eyebrow="small rewards for showing up" title="Calm coins" description="A gentle nudge to keep choosing yourself." /><div className="coins-hero"><div className="coin-hero-icon">✦</div><div><span>your current balance</span><strong>{balance.balance ?? 0}</strong><small>calm coins</small></div><div className="coin-hero-copy"><strong>Every small act of care counts.</strong><p>Write, reflect, talk, and collect coins you can put toward deeper support.</p></div></div><div className="coins-grid"><Block title="ways to earn" icon={<Zap size={15} />}><div className="rate-list">{Object.entries(rates.earning || { mental_health_chat: 5, journal_entry: 15, daily_checkin: 10 }).slice(0, 4).map(([key, value]) => <div className="rate-row" key={key}><span className="rate-icon">{key.includes('journal') ? '✎' : key.includes('chat') ? '◌' : '✦'}</span><span>{key.replaceAll('_', ' ')}</span><strong>+{value} <small>✦</small></strong></div>)}</div></Block><Block title="milestones" icon={<Trophy size={15} />}><div className="achievement-list">{(achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental health journey', unlocked: true, coins: 50 }, { title: 'Wellness warrior', description: 'Keep building your practice', unlocked: false, coins: 300 }]).map((achievement) => <div className={`achievement-row ${achievement.unlocked ? 'unlocked' : ''}`} key={achievement.title}><span>{achievement.unlocked ? <Check size={15} /> : '·'}</span><div><strong>{achievement.title}</strong><small>{achievement.description}</small></div><em>+{achievement.coins}</em></div>)}</div></Block><Block className="transactions-block" title="recent activity" icon={<Clock3 size={15} />}><div className="transaction-list">{transactions.length ? transactions.slice(0, 5).map((item) => <div className="transaction-row" key={item._id}><span className={item.transaction_type === 'spend' ? 'spent' : ''}>{item.transaction_type === 'spend' ? '−' : '+'}{item.amount}</span><div><strong>{item.description}</strong><small>{formatDate(item.timestamp)}</small></div><em>✦</em></div>) : <EmptyState icon="✦" title="Your activity will appear here." text="A journal entry or conversation is a good place to begin." />}</div></Block></div></div>
}

function LoadingRows() { return <div className="loading-rows"><span /><span /><span /></div> }
function EmptyState({ icon, title, text, action, onClick }) { return <div className="empty-state"><span className="empty-icon">{icon}</span><h3>{title}</h3><p>{text}</p>{action && <button className="text-link" onClick={onClick}>{action} <ArrowRight size={14} /></button>}</div> }
function formatDate(value, long = false) { if (!value) return 'just now'; const date = new Date(value); return new Intl.DateTimeFormat('en', long ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' }).format(date) }

export default App
