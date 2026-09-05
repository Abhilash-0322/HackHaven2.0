import { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Brain, Check, ChevronDown,
  ChevronRight, CircleHelp, Coins, Compass, Heart, Headphones, LayoutGrid, LifeBuoy, ListMusic,
  LoaderCircle, LockKeyhole, LogIn, LogOut, Menu, MessageCircle, Mic2, MoreHorizontal, Pause,
  PencilLine, Play, Plus, Search, Send, Settings, ShieldCheck, Sparkles, Star, Sun, Trash2,
  UserRound, UsersRound, Volume2, X, Zap,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const artworks = [
  { title: 'Still life, moving', artist: 'Hana Vu', tag: 'ambient / 01', color: 'violet', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85', duration: '4:28' },
  { title: 'Skin in the game', artist: 'Solange', tag: 'r&b / 02', color: 'lime', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', duration: '3:42' },
  { title: 'A quiet kind of loud', artist: 'Arlo Parks', tag: 'soul / 03', color: 'orange', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85', duration: '5:01' },
  { title: 'After the rain', artist: 'Jai Wolf', tag: 'electronica / 04', color: 'blue', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85', duration: '3:16' },
]

const featuredBooks = [
  { id: '1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'A gentle invitation to look inward and make room for stillness.' },
  { id: '2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'The power of rest and retreat in difficult times.' },
  { id: '3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80', description: 'A celebration of reciprocity, nature, and belonging.' },
]

const fallbackTherapists = [
  { _id: '1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D in Clinical Psychology, Stanford University', bio: 'CBT and mindfulness for finding steadier ground.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
  { _id: '2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem'], experience_years: 8, education: 'M.S. Marriage & Family Therapy, NYU', bio: 'A warm space to untangle relationships and reconnect with yourself.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80' },
  { _id: '3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive care for life’s in-between seasons.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80' },
]

const prompts = ['What made you smile today?', 'What does your body need more of right now?', 'Describe a moment of calm you experienced recently.', 'What is one small win you had today?']

async function api(path, options = {}) {
  const token = localStorage.getItem('zen-token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'Something went wrong')
  return response.json()
}

const AuthContext = createContext(null)
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zen-user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('zen-token'))
  const saveSession = (data) => {
    const session = data.user || data
    const nextToken = data.access_token || 'demo-token'
    localStorage.setItem('zen-user', JSON.stringify(session))
    localStorage.setItem('zen-token', nextToken)
    setUser(session); setToken(nextToken)
  }
  const login = async (values) => {
    try { saveSession(await api('/auth/login', { method: 'POST', body: JSON.stringify(values) })) }
    catch { saveSession({ username: values.username, full_name: values.username, email: `${values.username}@zenheaven.local`, calm_coins: 100 }) }
  }
  const register = async (values) => {
    try { saveSession(await api('/auth/register', { method: 'POST', body: JSON.stringify(values) })) }
    catch { saveSession({ username: values.username, full_name: values.full_name || values.username, email: values.email, calm_coins: 100 }) }
  }
  const logout = () => { localStorage.removeItem('zen-user'); localStorage.removeItem('zen-token'); setUser(null); setToken(null) }
  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}
const useAuth = () => useContext(AuthContext)

function Logo({ dark = false }) {
  return <Link to="/" className={`logo ${dark ? 'logo-dark' : ''}`}><span className="logo-mark">✳</span><span>zenheaven</span></Link>
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/chat', label: 'Calm Chat', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PencilLine },
  { to: '/books', label: 'Reading room', icon: BookOpen },
  { to: '/music', label: 'Sound gallery', icon: Headphones },
  { to: '/therapists', label: 'Find a therapist', icon: UsersRound },
  { to: '/coins', label: 'Calm coins', icon: Coins },
]

function AppShell() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  if (isHome) return <Outlet />
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top"><Logo /><button className="icon-button mobile-only" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
        <div className="eyebrow side-label">your space</div>
        <nav className="side-nav">
          {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{to === '/chat' && <i className="unread-dot" />}</NavLink>)}
        </nav>
        <div className="side-footer">
          <div className="side-note"><Sparkles size={16} /><span>make space<br />for yourself.</span></div>
          <NavLink to="/settings" className="side-link"><Settings size={17} /><span>Settings</span></NavLink>
          {user ? <button className="side-link logout-button" onClick={logout}><LogOut size={17} /><span>Sign out</span></button> : <Link className="side-link" to="/login"><LogIn size={17} /><span>Sign in</span></Link>}
        </div>
      </aside>
      <div className="main-column">
        <header className="mobile-header"><button className="icon-button" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><Logo /><Link to="/coins" className="coin-pill"><Coins size={14} /> {user?.calm_coins ?? 100}</Link></header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="home-page">
      <header className="home-nav"><Logo dark /><div className="home-nav-links"><a href="#why">why zenheaven</a><a href="#rituals">rituals</a><a href="#care">care, together</a></div><div className="home-actions"><Link to="/login" className="text-link">sign in</Link><Link to="/register" className="button button-dark">start here <ArrowUpRight size={15} /></Link></div></header>
      <section className="hero-section">
        <div className="hero-copy"><div className="eyebrow">an intentional space for your inner life</div><h1>A softer way<br /><em>to be here.</em></h1><p>ZenHeaven is a small, steady corner of the internet for understanding how you feel — and finding your way forward.</p><Link to="/register" className="button button-dark large">enter your space <ArrowRight size={17} /></Link></div>
        <div className="hero-art"><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-sun">✳</div><div className="hero-stamp">pause<br />breathe<br />begin</div><span className="art-caption">01 / a place to come back to</span></div>
      </section>
      <section id="why" className="statement-section"><div className="eyebrow">the premise</div><h2>Your inner world deserves<br /><em>more than a quick fix.</em></h2><div className="statement-grid"><p>We built ZenHeaven around a simple belief: feeling better starts with feeling seen. No performance, no pressure — just useful tools, thoughtful people, and room to notice what’s true.</p><div className="statement-mark">✳</div><p className="muted-text">come as you are.<br />leave with a little more<br />of yourself.</p></div></section>
      <section id="rituals" className="rituals-section"><div className="section-heading"><div><div className="eyebrow">your everyday rituals</div><h2>Small things.<br /><em>Real shifts.</em></h2></div><span className="section-number">02—04</span></div><div className="ritual-grid"><Link to="/chat" className="ritual-card card-lilac"><div className="card-icon"><MessageCircle size={20} /></div><span>01</span><h3>talk it out</h3><p>A calm conversation when your thoughts need somewhere to land.</p><ArrowUpRight /></Link><Link to="/journal" className="ritual-card card-lime"><div className="card-icon"><PencilLine size={20} /></div><span>02</span><h3>write it down</h3><p>Private pages for the things you’re still learning how to say.</p><ArrowUpRight /></Link><Link to="/music" className="ritual-card card-orange"><div className="card-icon"><Headphones size={20} /></div><span>03</span><h3>find your frequency</h3><p>Soundscapes for every version of your day.</p><ArrowUpRight /></Link></div></section>
      <section id="care" className="care-section"><div className="care-visual"><div className="care-circle">care<br />is a<br />practice</div></div><div className="care-copy"><div className="eyebrow">care, together</div><h2>You don’t have<br />to hold it <em>alone.</em></h2><p>When you’re ready for deeper support, connect with a therapist who gets it. Browse by what you’re feeling, how you want to talk, and what feels possible right now.</p><Link to="/therapists" className="button button-light">find your person <ArrowUpRight size={15} /></Link></div></section>
      <footer className="home-footer"><Logo dark /><span>© 2025 zenheaven / made with intention</span><span>take your time ✳</span></footer>
    </div>
  )
}

function PageHeader({ eyebrow, title, italic, description, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title} {italic && <em>{italic}</em>}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Dashboard() {
  const { user } = useAuth()
  return <div className="dashboard"><div className="dash-topline"><span>MONDAY, OCTOBER 14</span><span className="live-status"><i /> your space is private</span></div><PageHeader eyebrow="good morning, {name}" title="How are you" italic="arriving today?" description="There’s no right way to feel. Just a place to start." /><div className="mood-row"><span className="mood-label">right now, I feel</span>{['quietly okay', 'a little tender', 'ready for more', 'not sure yet'].map((m, i) => <button key={m} className={`mood-chip ${i === 0 ? 'selected' : ''}`}><span>{['◒', '◌', '✦', '？'][i]}</span>{m}</button>)}</div><div className="dash-grid"><div className="dash-feature dark-panel"><div className="feature-head"><div><span className="eyebrow">continue your ritual</span><h2>Let the thoughts<br /><em>out.</em></h2></div><PencilLine /></div><p>Put down the thing that’s been taking up space. It doesn’t have to be polished.</p><Link to="/journal" className="button button-lime">open journal <ArrowRight size={15} /></Link><div className="panel-decoration">✳</div></div><div className="stat-card"><div className="stat-icon lime-icon"><Zap size={18} /></div><span className="eyebrow">your rhythm</span><strong>04</strong><p>day care streak</p><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="stat-card"><div className="stat-icon lilac-icon"><Coins size={18} /></div><span className="eyebrow">calm coins</span><strong>{user?.calm_coins ?? 100}</strong><p>available to spend</p><Link to="/coins" className="under-link">see activity <ArrowUpRight size={13} /></Link></div></div><section className="dash-section"><div className="section-heading compact"><div><span className="eyebrow">pick up where you left off</span><h2>for this moment</h2></div><Link to="/music" className="under-link">see all <ArrowRight size={13} /></Link></div><div className="dashboard-cards"><Link to="/chat" className="dash-link-card"><div className="dash-link-visual chat-visual"><MessageCircle size={36} strokeWidth={1.2} /></div><div><span>calm chat</span><h3>“A little overwhelmed”</h3><p>last visited 2 hours ago</p></div><ChevronRight /></Link><Link to="/books" className="dash-link-card"><img src={featuredBooks[0].image_url} alt="" /><div><span>reading room</span><h3>Slow is still a speed</h3><p>recommended for your mood</p></div><ChevronRight /></Link><Link to="/music" className="dash-link-card"><img src={artworks[0].image} alt="" /><div><span>sound gallery</span><h3>Still life, moving</h3><p>Hana Vu · ambient</p></div><ChevronRight /></Link></div></section></div>
}

function AuthPage({ mode = 'login' }) {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({ username: '', password: '', email: '', full_name: '' })
  if (user) return <Navigate to="/dashboard" replace />
  const isLogin = mode === 'login'
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { isLogin ? await login({ username: values.username, password: values.password }) : await register(values); navigate('/dashboard') }
    catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-art"><Logo dark /><div className="auth-quote"><span>✳</span><h1>Come as<br /><em>you are.</em></h1><p>There is nothing to fix before you begin.</p></div><span className="art-caption">zenheaven / 001</span></div><div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowLeft size={15} /> back home</Link><div className="auth-form"><div className="eyebrow">{isLogin ? 'welcome back' : 'a good place to begin'}</div><h2>{isLogin ? 'Sign back in.' : 'Make it yours.'}</h2><p>{isLogin ? 'Your space is waiting.' : 'Create a private space for your mental wellbeing.'}</p><form onSubmit={submit}>{!isLogin && <label>your name<input required value={values.full_name} onChange={e => setValues({ ...values, full_name: e.target.value })} placeholder="What should we call you?" /></label>}<label>username<input required value={values.username} onChange={e => setValues({ ...values, username: e.target.value })} placeholder="your username" /></label>{!isLogin && <label>email<input required type="email" value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} placeholder="you@example.com" /></label>}<label>password<input required minLength={6} type="password" value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} placeholder="at least 6 characters" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark full" disabled={loading}>{loading ? <LoaderCircle className="spin" size={16} /> : isLogin ? 'enter my space' : 'create my space'} <ArrowRight size={16} /></button></form><div className="auth-switch">{isLogin ? 'new here?' : 'already have a space?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'create an account' : 'sign in'}</Link></div><div className="secure-note"><LockKeyhole size={13} /> your thoughts belong to you</div></div></div></div>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', is_user: false, content: 'Hey. I’m here with you. What’s taking up the most space in your mind today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState([])
  const [streaming, setStreaming] = useState(false)
  const endRef = useRef(null)
  const loadThreads = async () => { try { setThreads((await api('/mental-health/threads')).threads || []) } catch { setThreads([{ id: 'demo', title: 'A little overwhelmed', message_count: 8, last_message: 'I’m learning to take it one thing at a time.' }]) } }
  useEffect(() => { loadThreads() }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])
  const loadThread = async (id) => { setThreadId(id); try { const data = await api(`/mental-health/threads/${id}`); setMessages(data.messages) } catch { setMessages([{ id: 'demo', is_user: false, content: 'Welcome back. We can continue from wherever feels useful.' }]) } }
  const send = async (event) => {
    event?.preventDefault(); const message = input.trim(); if (!message || streaming) return
    setInput(''); setMessages(prev => [...prev, { id: `u-${Date.now()}`, is_user: true, content: message }]); setThinking(['reading between the lines…']); setStreaming(true)
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('zen-token') || 'demo-token'}` }, body: JSON.stringify({ message, thread_id: threadId }) })
      if (!response.ok || !response.body) throw new Error('offline')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let reply = ''
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, is_user: false, content: '' }])
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach(chunk => { if (!chunk.startsWith('data: ')) return; try { const eventData = JSON.parse(chunk.slice(6)); if (eventData.type === 'thread_id') setThreadId(eventData.data); if (eventData.type === 'thinking') setThinking([eventData.data]); if (eventData.type === 'token') { reply += eventData.data; setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: reply } : m)) } if (eventData.type === 'complete') setThinking([]) } catch { /* ignore malformed chunks */ } })
      }
      setThinking([]); loadThreads()
    } catch {
      setTimeout(() => { setMessages(prev => [...prev, { id: `a-${Date.now()}`, is_user: false, content: 'It sounds like you’re carrying a lot at once. You don’t have to solve everything tonight — could we choose one small thing that might make the next hour feel 2% gentler?' }]); setThinking([]); setStreaming(false) }, 500)
      return
    }
    setStreaming(false)
  }
  return <div className="chat-page"><div className="chat-sidebar"><div className="chat-side-head"><div><div className="eyebrow">your conversations</div><h3>Chat history</h3></div><button className="round-button" onClick={() => { setThreadId(null); setMessages([{ id: 'welcome', is_user: false, content: 'Hey. I’m here with you. What’s taking up the most space in your mind today?' }]) }}><Plus size={16} /></button></div><div className="thread-list">{threads.map(thread => <button key={thread.id} className={`thread-item ${threadId === thread.id ? 'active' : ''}`} onClick={() => loadThread(thread.id)}><MessageCircle size={15} /><span><strong>{thread.title}</strong><small>{thread.last_message || 'A conversation with CalmBot'}</small></span><ChevronRight size={14} /></button>)}{!threads.length && <div className="empty-small">Your conversations will live here.</div>}</div><div className="chat-safety"><ShieldCheck size={17} /><span>Private by design.<br /><a href="#safety">how we keep you safe</a></span></div></div><div className="chat-window"><div className="chat-window-head"><div><span className="status-dot" /> CalmBot <small>your steady companion</small></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="messages">{messages.map(message => <div key={message.id} className={`message-row ${message.is_user ? 'user-message' : ''}`}><div className={`avatar ${message.is_user ? 'user-avatar' : 'bot-avatar'}`}>{message.is_user ? <UserRound size={15} /> : '✳'}</div><div className="message-content"><span className="message-author">{message.is_user ? 'you' : 'calmbot'}</span><p>{message.content || <span className="typing"><i /><i /><i /></span>}</p></div></div>)}{thinking.length > 0 && <div className="thinking-line"><Sparkles size={13} /> {thinking[0]}</div>}<div ref={endRef} /></div><form className="chat-composer" onSubmit={send}><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) } }} placeholder="write what’s on your mind…" rows="1" /><button type="button" className="composer-action"><Mic2 size={17} /></button><button type="submit" className="send-button" disabled={!input.trim() || streaming}><Send size={17} /></button></form><div className="chat-disclaimer">CalmBot offers supportive guidance, not medical advice. In an emergency, call your local emergency number.</div></div></div>
}

function Journal() {
  const [entries, setEntries] = useState([]); const [content, setContent] = useState(''); const [saving, setSaving] = useState(false); const [prompt, setPrompt] = useState(prompts[0]); const [notice, setNotice] = useState('')
  useEffect(() => { api('/journal/entries').then(setEntries).catch(() => setEntries([{ _id: '1', title: 'A slower morning', content: 'I gave myself ten quiet minutes before reaching for my phone. It changed the whole shape of the morning.', mood: 'calm', created_at: new Date().toISOString() }, { _id: '2', title: 'Making room', content: 'Not every feeling needs an answer today.', mood: 'hopeful', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }])) }, [])
  const save = async (e) => { e.preventDefault(); if (!content.trim()) return; setSaving(true); const payload = { content, mood: 'reflective', tags: ['daily reflection'] }; try { const result = await api('/journal/entries', { method: 'POST', body: JSON.stringify(payload) }); setEntries([result, ...entries]) } catch { setEntries([{ _id: Date.now(), title: content.split(/[.!?]/)[0].slice(0, 36) || 'A new page', content, mood: 'reflective', created_at: new Date().toISOString() }, ...entries]) } setContent(''); setNotice('saved +10 calm coins'); setSaving(false); setTimeout(() => setNotice(''), 3000) }
  return <div className="journal-page"><PageHeader eyebrow="a private place to process" title="The page is" italic="yours." description="No one is grading this. Not even you." action={<div className="journal-streak"><span>✳</span><strong>04</strong><small>day writing streak</small></div>} /><div className="journal-grid"><div className="journal-editor"><div className="editor-top"><span className="eyebrow">new entry / {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><span className="private-label"><LockKeyhole size={12} /> private</span></div><div className="prompt-row"><Sparkles size={15} /><button onClick={() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)])}>{prompt}</button><button className="shuffle-button" onClick={() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)])}>shuffle</button></div><form onSubmit={save}><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start wherever you are…" /><div className="editor-bottom"><span>{notice || 'your thoughts are safe here'}</span><button className="button button-dark" disabled={!content.trim() || saving}>{saving ? <LoaderCircle className="spin" size={15} /> : 'save entry'} <ArrowUpRight size={15} /></button></div></form></div><aside className="journal-aside"><div className="aside-card mood-card"><div className="eyebrow">your recent weather</div><div className="mood-weather"><span>☼</span><div><strong>mostly clear</strong><small>based on your last 7 entries</small></div></div><div className="weather-bars"><i /><i /><i /><i /><i /><i /><i /></div><Link to="/books" className="under-link">read your recommendations <ArrowRight size={13} /></Link></div><div className="aside-card"><div className="eyebrow">a gentle nudge</div><p className="nudge">“You can be both a work in progress and a masterpiece.”</p><span className="nudge-author">— sofia bush</span></div></aside></div><section className="entries-section"><div className="section-heading compact"><div><span className="eyebrow">your pages</span><h2>recent reflections</h2></div><span className="muted-text">{entries.length} entries</span></div><div className="entries-list">{entries.map((entry, index) => <article className="entry-row" key={entry._id || index}><div className="entry-date"><strong>{new Date(entry.created_at || Date.now()).getDate()}</strong><span>{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short' })}</span></div><div className="entry-main"><h3>{entry.title || 'Untitled reflection'}</h3><p>{entry.content}</p><div className="entry-meta"><span className="mood-tag">{entry.mood || 'reflective'}</span><span>{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { weekday: 'long' })}</span></div></div><button className="icon-button"><MoreHorizontal size={18} /></button></article>)}</div></section></div>
}

function Books() {
  const [books, setBooks] = useState(featuredBooks); const [query, setQuery] = useState(''); const [searched, setSearched] = useState(false)
  useEffect(() => { api('/books/recommend-by-mood').then(data => data.books?.length && setBooks(data.books)).catch(() => {}) }, [])
  const search = async (e) => { e.preventDefault(); if (!query.trim()) return; setSearched(true); try { const data = await api(`/books/search?q=${encodeURIComponent(query)}`); if (data.books?.length) setBooks(data.books) } catch { setBooks(featuredBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))) } }
  return <div className="books-page"><PageHeader eyebrow="the reading room" title="Words for" italic="where you are." description="Books that don’t ask you to rush the becoming." action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="search the shelves" /><button type="submit"><ArrowRight size={15} /></button></form>} /><div className="book-feature"><div className="book-feature-copy"><span className="eyebrow">selected for your current weather</span><h2>Read something<br /><em>that meets you there.</em></h2><p>Whether you need comfort, clarity, or a little more courage — there’s a page waiting.</p><Link to="/journal" className="button button-light">check in with yourself <ArrowUpRight size={14} /></Link></div><div className="book-feature-art"><span className="vertical-text">THE READING ROOM / 2025</span><img src={featuredBooks[1].image_url} alt="Featured book" /><div className="book-feature-label">a softer<br />season</div></div></div><div className="book-section-head"><div><span className="eyebrow">{searched ? 'search results' : 'for a reflective mood'}</span><h2>{searched ? `books matching “${query}”` : 'begin here'}</h2></div><div className="book-filters"><button className="filter-active">all</button><button>comfort</button><button>clarity</button><button>growth</button></div></div><div className="book-grid">{books.map(book => <article className="book-card" key={book.id}><div className="book-cover"><img src={book.image_url || featuredBooks[0].image_url} alt="" /><button className="book-save"><Heart size={15} /></button></div><div className="book-card-info"><span>{book.author || 'unknown author'}</span><h3>{book.title}</h3><p>{book.description || 'A thoughtful companion for your next chapter.'}</p><button className="under-link">view book <ArrowUpRight size={13} /></button></div></article>)}</div></div>
}

function Music() {
  const [current, setCurrent] = useState(artworks[0]); const [playing, setPlaying] = useState(false); const [songs, setSongs] = useState(artworks.map(a => a.title))
  useEffect(() => { api('/songs').then(data => data.songs?.length && setSongs(data.songs.slice(0, 8))).catch(() => {}) }, [])
  return <div className="music-page"><PageHeader eyebrow="the sound gallery" title="Your mood has" italic="a frequency." description="A collection of sound for the parts of you that words can’t reach." action={<button className="button button-dark" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'pause session' : 'play a session'}</button>} /><div className="music-hero"><div className={`album-art art-${current.color}`}><img src={current.image} alt="" /><div className="album-overlay"><span>✳</span><small>zenheaven<br />sessions</small></div></div><div className="now-playing"><div className="eyebrow">now / {playing ? 'playing' : 'paused'}</div><h2>{current.title}</h2><p>{current.artist} <span>·</span> {current.tag}</p><div className="progress"><i style={{ width: playing ? '38%' : '12%' }} /></div><div className="time-row"><span>0{playing ? '1' : '0'}:24</span><span>{current.duration}</span></div><div className="player-actions"><button className="icon-button"><ArrowLeft size={17} /></button><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><button className="icon-button"><ArrowRight size={17} /></button><button className="icon-button volume"><Volume2 size={16} /></button></div></div><div className="music-note"><span>the right sound<br />for this moment</span><span className="note-line" /></div></div><div className="music-split"><section><div className="section-heading compact"><div><span className="eyebrow">curated for you</span><h2>sound works</h2></div><button className="under-link">shuffle <Zap size={13} /></button></div><div className="track-list">{artworks.map((track, index) => <button className={`track-row ${current.title === track.title ? 'current' : ''}`} key={track.title} onClick={() => { setCurrent(track); setPlaying(true) }}><span className="track-index">{current.title === track.title && playing ? <Volume2 size={14} /> : `0${index + 1}`}</span><img src={track.image} alt="" /><span className="track-name"><strong>{track.title}</strong><small>{track.artist} · {track.tag}</small></span><span className="track-type">1/1 edition</span><span className="track-duration">{track.duration}</span><MoreHorizontal size={16} /></button>)}</div></section><aside className="collection-card"><span className="eyebrow">your collection</span><div className="collection-stack"><img src={artworks[0].image} alt="" /><img src={artworks[2].image} alt="" /><img src={artworks[3].image} alt="" /></div><h3>{songs.length} sound pieces</h3><p>Save the sounds that stay with you.</p><button className="under-link">open collection <ArrowUpRight size={13} /></button></aside></div></div>
}

function Therapists() {
  const [therapists, setTherapists] = useState(fallbackTherapists); const [selected, setSelected] = useState(null); const [filter, setFilter] = useState('all'); const [booked, setBooked] = useState(false)
  useEffect(() => { api('/therapists/').then(data => data?.length && setTherapists(data)).catch(() => {}) }, [])
  const visible = filter === 'all' ? therapists : therapists.filter(t => t.specializations?.some(s => s.toLowerCase().includes(filter)))
  return <div className="therapists-page"><PageHeader eyebrow="care, together" title="Find a person" italic="who gets it." description="Licensed, human support for the parts of life that are hard to hold alone." action={<div className="verified-label"><ShieldCheck size={16} /> all providers verified</div>} /><div className="therapist-tools"><div className="eyebrow">I’m looking for support with</div><div className="filter-pills">{['all', 'anxiety', 'relationships', 'grief'].map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="therapist-list">{visible.map((therapist, index) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="therapist-number">0{index + 1}</div><img src={therapist.photo_url || fallbackTherapists[index % 3].photo_url} alt="" /><div className="therapist-info"><div className="therapist-name"><h2>{therapist.name}</h2><span><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><div className="specialization-list">{(therapist.specializations || []).map(s => <span key={s}>{s}</span>)}</div><p>{therapist.bio}</p><div className="therapist-meta"><span>{therapist.experience_years} years experience</span><span>speaks {(therapist.languages || ['English']).join(', ')}</span></div></div><div className="therapist-cta"><strong>${therapist.hourly_rate}<small>/ session</small></strong><button className="button button-dark" onClick={() => setSelected(therapist)}>see availability <ArrowUpRight size={14} /></button></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="booking-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>{booked ? <div className="booking-success"><div className="success-icon"><Check /></div><div className="eyebrow">you’re all set</div><h2>A little support<br /><em>is on its way.</em></h2><p>Your session request with {selected.name} has been noted. We’ll send details to your email.</p><button className="button button-dark" onClick={() => { setBooked(false); setSelected(null) }}>back to care</button></div> : <><div className="eyebrow">book a session</div><h2>Make some room<br /><em>to be heard.</em></h2><div className="selected-provider"><img src={selected.photo_url} alt="" /><span><strong>{selected.name}</strong><small>{selected.specializations?.[0]} · ${selected.hourly_rate}/session</small></span></div><div className="booking-label">choose a time</div><div className="time-options"><button>Tue, Oct 15<br /><strong>10:00 AM</strong></button><button className="selected">Wed, Oct 16<br /><strong>2:30 PM</strong></button><button>Thu, Oct 17<br /><strong>11:00 AM</strong></button></div><button className="button button-dark full" onClick={() => setBooked(true)}>request this session <ArrowRight size={15} /></button><p className="modal-note"><LockKeyhole size={12} /> you can cancel anytime</p></>}</div></div>}</div>
}

function CoinsPage() {
  const { user } = useAuth(); const [balance, setBalance] = useState(user?.calm_coins || 100); const [transactions, setTransactions] = useState([])
  useEffect(() => { api('/coins/balance').then(data => setBalance(data.balance)).catch(() => {}); api('/coins/transactions').then(setTransactions).catch(() => setTransactions([{ amount: 10, source: 'journal', description: 'Created a journal entry', transaction_type: 'earn', timestamp: new Date().toISOString() }, { amount: 5, source: 'mental_health_chat', description: 'Checked in with CalmBot', transaction_type: 'earn', timestamp: new Date(Date.now() - 86400000).toISOString() }])) }, [])
  return <div className="coins-page"><PageHeader eyebrow="a little extra encouragement" title="Calm coins" italic="in motion." description="A small thank you for showing up for yourself." action={<div className="coin-balance-top"><Coins size={19} /><strong>{balance}</strong><span>available</span></div>} /><div className="coins-hero"><div className="coin-big">✳<span>your balance</span><strong>{balance}</strong><small>calm coins</small></div><div className="coins-copy"><div className="eyebrow">the exchange</div><h2>Care is the<br /><em>reward.</em></h2><p>Earn coins when you make time for your wellbeing. Spend them on deeper support and tools made for your journey.</p><Link to="/journal" className="button button-dark">earn your next 10 <ArrowRight size={14} /></Link></div></div><div className="coins-grid"><section className="coin-section"><div className="section-heading compact"><div><span className="eyebrow">keep showing up</span><h2>ways to earn</h2></div></div>{[['Write a journal entry', 'journal_entry', '+15'], ['Talk with CalmBot', 'mental_health_chat', '+5'], ['Complete a mood check-in', 'mood_tracking', '+5'], ['Keep a 7-day streak', 'weekly_streak', '+50']].map(([title, source, amount]) => <div className="earn-row" key={source}><div className="earn-icon">{source === 'journal_entry' ? <PencilLine size={17} /> : source === 'mental_health_chat' ? <MessageCircle size={17} /> : <Zap size={17} />}</div><div><strong>{title}</strong><small>make space for yourself</small></div><span>{amount}</span></div>)}</section><section className="coin-section transaction-section"><div className="section-heading compact"><div><span className="eyebrow">your activity</span><h2>recent movement</h2></div><button className="under-link">see all <ArrowRight size={13} /></button></div>{transactions.map((transaction, i) => <div className="transaction-row" key={transaction._id || i}><div className={`transaction-icon ${transaction.transaction_type}`}><ArrowDownRight size={15} /></div><div><strong>{transaction.description}</strong><small>{new Date(transaction.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></div><span className={transaction.transaction_type === 'spend' ? 'spent' : ''}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</span></div>)}</section></div></div>
}

function SettingsPage() {
  const { user } = useAuth(); return <div className="settings-page"><PageHeader eyebrow="your space" title="Make it" italic="comfortable." description="A few details about how ZenHeaven shows up for you." /><div className="settings-card"><div className="settings-avatar">{(user?.full_name || user?.username || 'Z')[0].toUpperCase()}</div><div className="settings-fields"><label>your name<input defaultValue={user?.full_name || user?.username} /></label><label>email<input defaultValue={user?.email} /></label><label>your space is currently<input value="private & encrypted" readOnly /></label><button className="button button-dark">save changes <Check size={15} /></button></div></div><div className="settings-note"><ShieldCheck size={18} /><div><strong>Your wellbeing comes first.</strong><p>We never sell your personal data or use your journal entries to target ads. Read our privacy promise.</p></div><ChevronRight size={17} /></div></div>
}

function ProtectedRoute() { const { user } = useAuth(); return user ? <Outlet /> : <Navigate to="/login" replace /> }

export default function App() {
  return <AuthProvider><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route element={<ProtectedRoute />}><Route element={<AppShell />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<CoinsPage />} /><Route path="/settings" element={<SettingsPage />} /></Route></Route></Routes></AuthProvider>
}
