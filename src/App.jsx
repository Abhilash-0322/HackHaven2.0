import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowUpRight, BadgeCheck, BookMarked, BookOpen, Brain, CalendarDays, Check,
  ChevronRight, CircleDollarSign, Clock3, Command, Compass, Headphones, Heart, Home,
  Layers3, Leaf, Library, ListFilter, Loader2, LockKeyhole, LogOut, Mail, Menu, MessageCircle,
  Mic2, Moon, MoreHorizontal, Music2, PanelLeft, PenLine, Play, Plus, Search, Send, Settings2,
  ShieldCheck, Sparkles, Star, Sun, Trash2, Trophy, UserRound, UsersRound, WandSparkles, X, Zap,
} from 'lucide-react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, clearSession, getSavedUser, setSession } from './lib/api'

const demoUser = { username: 'maya', full_name: 'Maya Chen', email: 'maya@example.com', calm_coins: 248 }
const demoJournal = [
  { _id: 'demo-1', title: 'A softer start', content: 'I made space for a quiet morning and noticed how much lighter everything felt after a walk.', mood: 'calm', created_at: new Date().toISOString(), tags: ['morning', 'reflection'] },
  { _id: 'demo-2', title: 'Naming the noise', content: 'Today felt loud, but writing down what I can control helped me find a little room to breathe.', mood: 'hopeful', created_at: new Date(Date.now() - 86400000).toISOString(), tags: ['growth'] },
]
const demoBooks = [
  { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', description: 'Reflections on mindfulness, relationships, and creating room for the present moment.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80', description: 'The restorative power of rest and retreat in difficult seasons of life.' },
  { id: 'book-3', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80', description: 'Notes, lists, and stories for difficult days and unexpected joy.' },
]
const demoSongs = ['Weightless — Marconi Union', 'Bloom — ODESZA', 'A Walk — Tycho', 'Holocene — Bon Iver', 'Sunset Lover — Petit Biscuit']
const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness', 'Stress Management'], experience_years: 12, hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'], bio: 'Cognitive behavioral therapy and mindfulness techniques for finding steadier ground.', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'], bio: 'A warm, collaborative space to navigate change and build healthier connections.', photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80' },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Cultural Identity', 'Transitions'], experience_years: 7, hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi'], bio: 'Culturally sensitive support for the seasons that ask us to become someone new.', photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
]

const navItems = [
  { to: '/dashboard', label: 'Canvas', icon: Home },
  { to: '/chat', label: 'Conversations', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Sound room', icon: Music2 },
  { to: '/therapists', label: 'Care team', icon: UsersRound },
  { to: '/coins', label: 'Calm coins', icon: CircleDollarSign },
]

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function SectionLabel({ children, icon: Icon = Sparkles }) {
  return <span className="eyebrow"><Icon size={13} strokeWidth={2.4} /> {children}</span>
}

function Avatar({ user = demoUser, small = false }) {
  return <div className={`avatar ${small ? 'avatar-small' : ''}`} title={user.full_name || user.username}>{(user.full_name || user.username || 'Z').slice(0, 1).toUpperCase()}</div>
}

function StatusDot({ color = 'green' }) {
  return <span className={`status-dot status-${color}`} />
}

function App() {
  const [user, setUser] = useState(getSavedUser())
  const onAuth = (payload) => {
    setSession(payload.access_token, payload.user)
    setUser(payload.user)
  }
  const onLogout = () => { clearSession(); setUser(null) }
  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={onAuth} />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onAuth={onAuth} />} />
      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<AppShell user={user} onLogout={onLogout} />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/books" element={<Books />} />
          <Route path="/music" element={<Music />} />
          <Route path="/therapists" element={<Therapists user={user} />} />
          <Route path="/coins" element={<Coins user={user} />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ProtectedRoute({ user }) {
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function AppShell({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Canvas'
  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Leaf size={17} /></div>
          <span>zenheaven</span>
          <span className="brand-badge">BETA</span>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon">M</div>
          <div><strong>maya’s space</strong><small>Personal workspace</small></div>
          <ChevronRight size={15} className="muted-icon" />
        </div>
        <div className="side-caption">YOUR SPACE</div>
        <nav className="main-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
              <Icon size={17} /><span>{label}</span>{label === 'Conversations' && <span className="nav-count">3</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="side-caption">STUDIO</div>
        <NavLink to="/dashboard" className="nav-item"><Layers3 size={17} /><span>Design system</span></NavLink>
        <NavLink to="/dashboard" className="nav-item"><Settings2 size={17} /><span>Preferences</span></NavLink>
        <div className="sidebar-bottom">
          <div className="presence-card"><StatusDot /><span>All systems gentle</span><MoreHorizontal size={15} /></div>
          <div className="profile-row"><Avatar user={user} small /><div><strong>{user?.full_name || user?.username || 'Friend'}</strong><small>Free plan</small></div><button onClick={onLogout} className="icon-button" title="Sign out"><LogOut size={15} /></button></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen((open) => !open)}><Menu size={19} /></button><span className="crumb-muted">Maya’s space</span><ChevronRight size={14} /><strong>{title}</strong></div>
          <div className="topbar-actions"><div className="live-pill"><StatusDot /> <span>Synced</span></div><button className="icon-button"><Search size={17} /></button><button className="icon-button"><BellIcon /></button><Avatar user={user} small /></div>
        </header>
        <div className="content-scroll"><Outlet /></div>
      </main>
    </div>
  )
}

function BellIcon() {
  return <span className="bell-icon"><span /></span>
}

function Landing({ user }) {
  return (
    <div className="landing-page">
      <div className="landing-nav">
        <Link to="/" className="brand"><div className="brand-mark"><Leaf size={17} /></div><span>zenheaven</span><span className="brand-badge">BETA</span></Link>
        <div className="landing-links"><a href="#how-it-works">How it works</a><a href="#spaces">Spaces</a><a href="#care">Care, thoughtfully</a></div>
        <div className="landing-actions">{user ? <Link to="/dashboard" className="button button-ghost">Open workspace <ArrowUpRight size={15} /></Link> : <><Link to="/login" className="button button-ghost">Sign in</Link><Link to="/register" className="button button-primary">Create your space <ArrowUpRight size={15} /></Link></>}</div>
      </div>
      <section className="hero-section">
        <div className="hero-copy">
          <SectionLabel icon={Sparkles}>A softer operating system for being human</SectionLabel>
          <h1>Make a little<br /><span>room for you.</span></h1>
          <p>ZenHeaven brings the gentle things into one quiet workspace — honest conversations, small rituals, and support that meets you where you are.</p>
          <div className="hero-actions"><Link to={user ? '/dashboard' : '/register'} className="button button-primary button-large">Start with a check-in <ArrowUpRight size={17} /></Link><a href="#how-it-works" className="text-link">See how it feels <ChevronRight size={16} /></a></div>
          <div className="hero-proof"><div className="proof-avatars"><Avatar user={{ full_name: 'A' }} small /><Avatar user={{ full_name: 'J' }} small /><Avatar user={{ full_name: 'R' }} small /><span>+</span></div><p><strong>18,000+</strong> people making space<br />for themselves this week</p></div>
        </div>
        <div className="hero-canvas">
          <div className="canvas-window window-large">
            <div className="window-top"><div className="window-dots"><i /><i /><i /></div><span><Command size={12} /> / today’s canvas</span><MoreHorizontal size={15} /></div>
            <div className="window-body">
              <div className="canvas-sidebar-mini"><span className="mini-dot active" /><span className="mini-line" /><span className="mini-line short" /><span className="mini-dot" /><span className="mini-line" /><span className="mini-line tiny" /></div>
              <div className="canvas-main">
                <div className="canvas-toolbar"><span className="toolbar-pill"><Sun size={13} /> Wednesday, 24 Apr</span><span className="toolbar-icons"><PanelLeft size={14} /><ListFilter size={14} /></span></div>
                <div className="canvas-greeting"><small>GOOD MORNING, MAYA</small><h3>How are you arriving today?</h3><span>There’s no right answer. Just a place to begin.</span></div>
                <div className="mood-grid"><div className="mood-card selected"><span>🌿</span><strong>Steady</strong><small>feeling grounded</small></div><div className="mood-card"><span>☁️</span><strong>Cloudy</strong><small>somewhere in-between</small></div><div className="mood-card"><span>✨</span><strong>Bright</strong><small>energy is here</small></div></div>
                <div className="canvas-note"><div className="note-icon"><PenLine size={14} /></div><div><strong>A note to come back to</strong><p>“I don’t have to figure out the whole day right now.”</p></div><ChevronRight size={15} /></div>
              </div>
            </div>
          </div>
          <div className="floating-card floating-card-top"><div className="floating-icon purple"><MessageCircle size={15} /></div><div><strong>New reflection</strong><small>3 min ago · private</small></div><span className="sparkle-dot">✦</span></div>
          <div className="floating-card floating-card-bottom"><div className="mini-wave"><i /><i /><i /><i /><i /><i /><i /></div><div><strong>Quiet focus</strong><small>12:48 remaining</small></div><PauseIcon /></div>
        </div>
      </section>
      <section className="logo-strip"><span>DESIGNED FOR REAL LIFE</span><div><strong>your thoughts</strong><strong>your pace</strong><strong>your people</strong><strong>your becoming</strong></div></section>
      <section className="story-section" id="how-it-works">
        <div className="story-heading"><SectionLabel icon={Compass}>One workspace, many ways in</SectionLabel><h2>Not another thing<br />to keep up with.</h2><p>Your wellbeing isn’t a project to optimize. It’s a relationship to tend to. ZenHeaven gives you a few beautiful doorways in — then gets out of the way.</p></div>
        <div className="story-cards" id="spaces"><StoryCard number="01" icon={MessageCircle} title="Talk it out" text="A calm, always-open conversation for the thoughts that need somewhere to go." color="lilac" /><StoryCard number="02" icon={PenLine} title="Leave a trace" text="Journal privately, notice your patterns, and let small insights find you." color="peach" /><StoryCard number="03" icon={Headphones} title="Shift the room" text="Sound, books, and tiny rituals chosen for the version of you that’s here today." color="mint" /></div>
      </section>
      <section className="quote-section" id="care"><div className="quote-mark">“</div><blockquote>Care shouldn’t feel like another tab<br />you forgot to close.</blockquote><p>— the ZenHeaven principle</p></section>
      <footer className="landing-footer"><Link to="/" className="brand"><div className="brand-mark"><Leaf size={17} /></div><span>zenheaven</span></Link><span>Built for softer days and honest ones.</span><span>© 2024 ZenHeaven</span></footer>
    </div>
  )
}

function StoryCard({ number, icon: Icon, title, text, color }) {
  return <div className={`story-card story-${color}`}><div className="story-card-top"><span>{number}</span><div className="story-icon"><Icon size={18} /></div></div><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={18} className="story-arrow" /></div>
}

function PauseIcon() {
  return <span className="pause-icon"><i /><i /></span>
}

function AuthPage({ mode, onAuth }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const payload = isLogin ? { username: form.username, password: form.password } : form
      const result = isLogin ? await api.auth.login(payload) : await api.auth.register(payload)
      onAuth(result); navigate('/dashboard')
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.') } finally { setLoading(false) }
  }
  return (
    <div className="auth-page">
      <div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" />
      <Link to="/" className="auth-brand"><div className="brand-mark"><Leaf size={17} /></div><span>zenheaven</span></Link>
      <div className="auth-grid">
        <div className="auth-intro"><SectionLabel icon={Leaf}>A private place to land</SectionLabel><h1>Come as you are.<br /><em>Stay a while.</em></h1><p>Everything here is built to help you hear yourself a little more clearly.</p><div className="auth-mantra"><span>“</span><p>Nothing to prove.<br />Nothing to perform.</p></div></div>
        <div className="auth-card"><div className="auth-card-heading"><div className="auth-card-icon"><Sparkles size={17} /></div><div><h2>{isLogin ? 'Welcome back' : 'Make your space'}</h2><p>{isLogin ? 'Pick up wherever you left off.' : 'A softer place starts with one step.'}</p></div></div><form onSubmit={submit}>
          {!isLogin && <label>What should we call you?<div className="input-wrap"><UserRound size={16} /><input value={form.full_name} onChange={update('full_name')} placeholder="Your name" required /></div></label>}
          <label>Username<div className="input-wrap"><span className="input-prefix">@</span><input value={form.username} onChange={update('username')} placeholder="yourname" required /></div></label>
          {!isLogin && <label>Email<div className="input-wrap"><Mail size={16} /><input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required /></div></label>}
          <label>Password<div className="input-wrap"><LockKeyhole size={16} /><input type="password" value={form.password} onChange={update('password')} placeholder="At least 6 characters" minLength="6" required /></div></label>
          {isLogin && <div className="form-meta"><label className="check-label"><input type="checkbox" /> <span>Keep me signed in</span></label><a href="#reset">Forgot password?</a></div>}
          {error && <div className="form-error">{error}</div>}
          <Button className="submit-button" disabled={loading}>{loading ? <><Loader2 size={16} className="spin" /> Opening your space…</> : <>{isLogin ? 'Enter my space' : 'Create my space'} <ArrowUpRight size={16} /></>}</Button>
        </form><div className="auth-switch">{isLogin ? 'New here?' : 'Already have a space?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></div><div className="secure-note"><ShieldCheck size={13} /> Your space is private by design</div></div>
      </div>
    </div>
  )
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><SectionLabel icon={Sparkles}>{eyebrow}</SectionLabel><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const [entries, setEntries] = useState(demoJournal)
  const [balance, setBalance] = useState(user?.calm_coins || 248)
  useEffect(() => { let active = true; Promise.allSettled([api.journal.entries(), api.coins.balance()]).then(([journal, coins]) => { if (!active) return; if (journal.status === 'fulfilled' && Array.isArray(journal.value)) setEntries(journal.value.slice(0, 3)); if (coins.status === 'fulfilled') setBalance(coins.value.balance) }); return () => { active = false } }, [])
  const firstName = (user?.full_name || user?.username || 'friend').split(' ')[0]
  return <div className="page-wrap"><PageHeader eyebrow="Wednesday, 24 April 2024" title={`Good morning, ${firstName}.`} description="A small check-in can change the shape of a whole day." action={<button className="icon-button"><MoreHorizontal size={19} /></button>} />
    <div className="dashboard-grid">
      <section className="panel checkin-panel"><div className="panel-header"><div><span className="panel-kicker">TODAY’S CHECK-IN</span><h2>How are you arriving?</h2></div><span className="panel-menu">•••</span></div><p className="panel-intro">No right answer. Just a place to begin.</p><div className="checkin-options"><MoodChoice emoji="🌿" label="Steady" caption="feeling grounded" active /><MoodChoice emoji="☁️" label="Cloudy" caption="somewhere in-between" /><MoodChoice emoji="✨" label="Bright" caption="energy is here" /><MoodChoice emoji="🌙" label="Tender" caption="moving gently" /></div><div className="checkin-footer"><span><StatusDot /> Saved just now</span><Button variant="soft">Add a note <ArrowUpRight size={14} /></Button></div></section>
      <section className="panel coin-panel"><div className="coin-orbit"><CircleDollarSign size={23} /></div><span className="panel-kicker">CALM COINS</span><strong>{balance}</strong><p>earned by showing up<br />for yourself</p><Link to="/coins" className="panel-link">View your progress <ArrowUpRight size={14} /></Link></section>
      <section className="panel rhythm-panel"><div className="panel-header"><div><span className="panel-kicker">YOUR RHYTHM</span><h2>7 day check-in</h2></div><Activity size={18} className="muted-icon" /></div><div className="rhythm-bars">{[38, 58, 44, 72, 52, 84, 66].map((height, index) => <div className="rhythm-day" key={index}><span style={{ height: `${height}%` }} className={index === 6 ? 'today' : ''} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div><div className="rhythm-caption"><strong>4 days</strong><span>you’ve made space this week</span><ArrowUpRight size={14} /></div></section>
      <section className="panel reflection-panel"><div className="panel-header"><div><span className="panel-kicker">RECENT REFLECTIONS</span><h2>Keep noticing</h2></div><Link to="/journal" className="panel-link">See all <ArrowUpRight size={14} /></Link></div><div className="reflection-list">{entries.map((entry) => <Link to="/journal" className="reflection-row" key={entry._id || entry.id}><div className="reflection-mood">{entry.mood === 'calm' ? '🌿' : '☀️'}</div><div><strong>{entry.title || 'A quiet reflection'}</strong><p>{entry.content}</p><small>{formatDate(entry.created_at)}</small></div><ChevronRight size={16} className="muted-icon" /></Link>)}</div></section>
      <section className="panel next-panel"><div className="next-glow" /><span className="panel-kicker">A GENTLE NUDGE</span><h2>What would feel<br /><em>good enough</em> today?</h2><p>Try the 3-minute grounding exercise when you have a moment.</p><Link to="/music" className="button button-dark">Make some room <ArrowUpRight size={15} /></Link></section>
    </div>
  </div>
}

function MoodChoice({ emoji, label, caption, active }) {
  return <button className={`mood-choice ${active ? 'mood-choice-active' : ''}`}><span>{emoji}</span><strong>{label}</strong><small>{caption}</small>{active && <Check size={13} />}</button>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', is_user: false, content: 'Hey, I’m here. What’s taking up a little space in your mind today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  useEffect(() => { api.chat.threads().then((data) => setThreads(data.threads || [])).catch(() => setThreads([])) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])
  const chooseThread = async (id) => { setActiveThread(id); try { const data = await api.chat.thread(id); setMessages(data.messages || []) } catch { setMessages([]) } }
  const send = async (event) => {
    event?.preventDefault(); const message = input.trim(); if (!message || loading) return
    setInput(''); setLoading(true); setThinking('Finding the right words…'); setMessages((current) => [...current, { id: `user-${Date.now()}`, is_user: true, content: message }])
    let response = ''; let currentThread = activeThread
    try {
      for await (const eventData of api.chat.stream(message, activeThread)) {
        if (eventData.type === 'thread_id') currentThread = eventData.data
        if (eventData.type === 'thinking') setThinking(eventData.data)
        if (eventData.type === 'response_start') { setThinking(''); setMessages((current) => [...current, { id: `bot-${Date.now()}`, is_user: false, content: '' }]) }
        if (eventData.type === 'token') { response += eventData.data; setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: response } : item)) }
      }
      setActiveThread(currentThread); api.chat.threads().then((data) => setThreads(data.threads || [])).catch(() => {})
    } catch {
      const fallback = 'I’m with you. Try noticing one thing you can feel, one thing you can hear, and one small thing you need right now.'
      setThinking(''); setMessages((current) => [...current, { id: `bot-${Date.now()}`, is_user: false, content: fallback }])
    } finally { setThinking(''); setLoading(false) }
  }
  return <div className="chat-layout"><aside className="chat-sidebar"><div className="chat-sidebar-head"><div><span className="panel-kicker">YOUR THREADS</span><h2>Conversations</h2></div><button className="icon-button" onClick={() => { setActiveThread(null); setMessages([{ id: 'welcome', is_user: false, content: 'A fresh page. What would you like to talk through?' }]) }}><Plus size={17} /></button></div><Button variant="soft" className="new-thread-button" onClick={() => { setActiveThread(null); setMessages([{ id: 'welcome', is_user: false, content: 'A fresh page. What would you like to talk through?' }]) }}><Plus size={15} /> New conversation</Button><div className="thread-list">{threads.map((thread) => <button key={thread.id} className={`thread-row ${activeThread === thread.id ? 'thread-active' : ''}`} onClick={() => chooseThread(thread.id)}><MessageCircle size={15} /><span><strong>{thread.title}</strong><small>{thread.last_message || 'A quiet conversation'}</small></span><ChevronRight size={14} /></button>)}{threads.length === 0 && <div className="empty-note"><Sparkles size={16} /><p>Your conversations will appear here.</p></div>}</div><div className="chat-sidebar-note"><ShieldCheck size={16} /><span>Your conversations are private and yours to keep.</span></div></aside><section className="chat-main"><div className="chat-top"><div className="chat-agent"><div className="agent-avatar"><Brain size={18} /></div><div><strong>CalmBot</strong><span><StatusDot /> Online · here to listen</span></div></div><div className="chat-tools"><button className="icon-button"><MoreHorizontal size={18} /></button></div></div><div className="message-stream">{messages.map((message) => <MessageBubble key={message.id} message={message} />)}{thinking && <div className="thinking-row"><div className="agent-avatar tiny"><Brain size={14} /></div><div className="thinking-bubble"><span>{thinking}</span><div className="typing"><i /><i /><i /></div></div></div>}<div ref={endRef} /></div><div className="chat-composer-wrap"><div className="suggestion-row"><button onClick={() => setInput('I need a little help slowing down')}>Help me slow down</button><button onClick={() => setInput('Can we talk through how I’m feeling?')}>Talk it through</button><button onClick={() => setInput('Give me a tiny grounding exercise')}>A grounding exercise</button></div><form className="chat-composer" onSubmit={send}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write what’s on your mind…" rows="1" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(event) } }} /><button className="composer-action" type="button"><Mic2 size={18} /></button><button className="send-button" disabled={loading || !input.trim()}>{loading ? <Loader2 size={17} className="spin" /> : <Send size={17} />}</button></form><small className="composer-note"><LockKeyhole size={11} /> CalmBot is a support tool, not a replacement for professional care.</small></div></section></div>
}

function MessageBubble({ message }) {
  return <div className={`message-row ${message.is_user ? 'message-user' : ''}`}>{!message.is_user && <div className="agent-avatar tiny"><Brain size={14} /></div>}<div className={`message-bubble ${message.is_user ? 'bubble-user' : ''}`}><p>{message.content}</p>{message.coins_earned > 0 && <small className="coin-earned">+{message.coins_earned} coins</small>}</div></div>
}

function Journal() {
  const [entries, setEntries] = useState(demoJournal)
  const [prompt, setPrompt] = useState('What made you smile today?')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saving, setSaving] = useState(false)
  useEffect(() => { api.journal.entries().then((data) => Array.isArray(data) && setEntries(data)).catch(() => {}) ; api.journal.prompts().then((data) => data?.[0]?.prompt && setPrompt(data[0].prompt)).catch(() => {}) }, [])
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; setSaving(true); const body = { content, mood, tags: [] }; try { const entry = await api.journal.create(body); setEntries((current) => [entry, ...current]); } catch { setEntries((current) => [{ _id: `local-${Date.now()}`, title: 'A moment to remember', content, mood, created_at: new Date().toISOString() }, ...current]) } finally { setContent(''); setSaving(false) } }
  return <div className="page-wrap"><PageHeader eyebrow="A private corner" title="Journal" description="A place to leave the day somewhere gentle." action={<Button variant="soft"><Sparkles size={15} /> Prompt me</Button>} /><div className="journal-grid"><section className="panel journal-editor"><div className="editor-header"><div className="editor-date"><span className="date-number">24</span><div><strong>Wednesday</strong><small>April 2024</small></div></div><div className="editor-actions"><span className="saved-label"><StatusDot /> Autosaved</span><MoreHorizontal size={18} className="muted-icon" /></div></div><div className="prompt-chip"><Sparkles size={14} /><span>{prompt}</span><button onClick={() => setPrompt('What do you need more of this week?')}><WandSparkles size={14} /></button></div><form onSubmit={save}><textarea className="journal-textarea" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start anywhere. There is no wrong way to write here…" /><div className="editor-footer"><div className="mood-select"><span>Today feels</span>{['calm', 'hopeful', 'tender', 'cloudy'].map((value) => <button type="button" key={value} onClick={() => setMood(value)} className={mood === value ? 'selected' : ''}>{value}</button>)}</div><Button disabled={!content.trim() || saving}>{saving ? <><Loader2 size={15} className="spin" /> Saving…</> : <>Save reflection <ArrowUpRight size={15} /></>}</Button></div></form></section><aside className="journal-side"><div className="panel insight-card"><div className="insight-sun"><Sun size={17} /></div><span className="panel-kicker">A LITTLE INSIGHT</span><h3>Your writing has been<br /><em>making room.</em></h3><p>You’ve returned to the page 4 times this month. That’s a beautiful kind of consistency.</p><Link to="/coins" className="panel-link">See your rhythm <ArrowUpRight size={14} /></Link></div><div className="panel prompt-list"><div className="panel-header"><div><span className="panel-kicker">KEEP THESE CLOSE</span><h3>Writing prompts</h3></div><BookMarked size={17} className="muted-icon" /></div>{['What would feel like enough today?', 'Where did you notice ease?', 'What are you ready to release?'].map((item) => <button className="prompt-list-row" key={item} onClick={() => setPrompt(item)}><span>{item}</span><ArrowUpRight size={14} /></button>)}</div></aside></div><section className="journal-history"><div className="section-line"><div><span className="panel-kicker">YOUR TRAIL</span><h2>Recent reflections</h2></div><button className="filter-button"><ListFilter size={15} /> Newest first</button></div><div className="history-grid">{entries.map((entry) => <article className="history-card" key={entry._id || entry.id}><div className="history-card-top"><span className="mood-badge">{entry.mood === 'calm' ? '🌿' : entry.mood === 'hopeful' ? '✨' : '☁️'} {entry.mood || 'reflective'}</span><MoreHorizontal size={15} className="muted-icon" /></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p><footer><span>{formatDate(entry.created_at)}</span><span>{entry.tags?.length || 0} notes</span></footer></article>)}</div></section></div>
}

function Books() {
  const [books, setBooks] = useState(demoBooks); const [query, setQuery] = useState(''); const [searching, setSearching] = useState(false)
  useEffect(() => { api.books.byMood().then((data) => data.books?.length && setBooks(data.books)).catch(() => {}) }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; setSearching(true); try { const data = await api.books.search(query); if (Array.isArray(data)) setBooks(data); else if (data.books) setBooks(data.books) } catch { /* Keep the curated shelf when offline. */ } finally { setSearching(false) } }
  return <div className="page-wrap"><PageHeader eyebrow="A shelf for your inner life" title="The quiet library" description="Books selected for the mood you’re carrying today." action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book…" /><button>{searching ? <Loader2 size={15} className="spin" /> : <ArrowUpRight size={15} />}</button></form>} /><div className="library-hero panel"><div><SectionLabel icon={BookOpen}>Picked for a steady mood</SectionLabel><h2>A few good places<br /><em>to land.</em></h2><p>Books for when you want a little more perspective, a little less noise.</p><button className="text-link">Explore the collection <ArrowUpRight size={15} /></button></div><div className="book-stack">{books.slice(0, 3).map((book, index) => <div className={`stack-book stack-${index}`} key={book.id} style={{ backgroundImage: `url(${book.image_url})` }}><span>{book.title}</span></div>)}</div></div><div className="section-line books-line"><div><span className="panel-kicker">YOUR CURRENT SHELF</span><h2>For the season you’re in</h2></div><button className="filter-button"><ListFilter size={15} /> Sort by mood</button></div><div className="book-grid">{books.map((book) => <BookCard book={book} key={book.id} />)}</div></div>
}

function BookCard({ book }) {
  return <article className="book-card"><div className="book-cover" style={{ backgroundImage: `url(${book.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'})` }}><span className="cover-label">ZENHEAVEN EDIT</span><button className="save-book"><Heart size={15} /></button></div><div className="book-card-body"><span className="book-type">REFLECTION · WELLBEING</span><h3>{book.title}</h3><p>by {book.author || 'Unknown author'}</p><div className="book-bottom"><span><Star size={13} fill="currentColor" /> 4.8</span><ArrowUpRight size={16} /></div></div></article>
}

function Music() {
  const [songs, setSongs] = useState(demoSongs.map((name, index) => ({ name, artist: ['Marconi Union', 'ODESZA', 'Tycho', 'Bon Iver', 'Petit Biscuit'][index], album_cover_url: `https://images.unsplash.com/photo-${['1514525253161-7a46d19cd819', '1493225457124-a3eb161ffa5f', '1511379938547-c1f69419868d', '1506157786151-b8491531f063', '1524368535928-5b5b00ddc76b'][index]}?w=400&q=80` }))); const [active, setActive] = useState(0); const [playing, setPlaying] = useState(false); const [loading, setLoading] = useState(false)
  useEffect(() => { api.music.songs().then((data) => { const list = data.songs || []; if (list.length) setSongs(list.slice(0, 8).map((name) => ({ name, artist: 'ZenHeaven radio', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' }))) }).catch(() => {}) }, [])
  const recommend = async () => { setLoading(true); try { const data = await api.music.recommend(songs[active].name); if (data.recommendations?.length) setSongs(data.recommendations) } catch { /* Keep the local listening room available. */ } finally { setLoading(false) } }
  return <div className="page-wrap"><PageHeader eyebrow="Sound for the in-between" title="Sound room" description="A soundtrack for whatever today needs to become." action={<Button variant="soft" onClick={recommend}>{loading ? <Loader2 size={15} className="spin" /> : <WandSparkles size={15} />} Find my next track</Button>} /><div className="music-layout"><section className="panel player-card"><div className="player-art" style={{ backgroundImage: `url(${songs[active]?.album_cover_url})` }}><div className="art-overlay"><span>NOW PLAYING</span><button className="player-play" onClick={() => setPlaying(!playing)}>{playing ? <PauseIcon /> : <Play size={20} fill="currentColor" />}</button></div></div><div className="player-details"><span className="panel-kicker">SOFT FOCUS · MIX 01</span><h2>{songs[active]?.name?.split(' — ')[0]}</h2><p>{songs[active]?.artist}</p><div className="progress-line"><span style={{ width: playing ? '42%' : '18%' }} /></div><div className="player-times"><span>02:14</span><span>04:08</span></div><div className="player-controls"><button><MoreHorizontal size={18} /></button><button><ArrowUpRight size={16} /></button><button className="play-small" onClick={() => setPlaying(!playing)}>{playing ? <PauseIcon /> : <Play size={16} fill="currentColor" />}</button><button><Heart size={17} /></button><button><ListFilter size={17} /></button></div></div></section><aside className="panel queue-panel"><div className="panel-header"><div><span className="panel-kicker">UP NEXT</span><h2>Quiet focus</h2></div><span className="queue-count">{songs.length} tracks</span></div><div className="queue-list">{songs.map((song, index) => <button key={`${song.name}-${index}`} className={`queue-row ${active === index ? 'queue-active' : ''}`} onClick={() => { setActive(index); setPlaying(true) }}><span className="queue-number">{active === index && playing ? <span className="eq"><i /><i /><i /></span> : String(index + 1).padStart(2, '0')}</span><span className="queue-art" style={{ backgroundImage: `url(${song.album_cover_url})` }} /><span className="queue-info"><strong>{song.name}</strong><small>{song.artist}</small></span><span className="queue-duration">{index % 2 ? '03:48' : '04:08'}</span></button>)}</div></aside></div><div className="music-bottom"><div><span className="panel-kicker">WHY THIS MIX</span><h2>Made for a mind<br /><em>in motion.</em></h2></div><p>Gentle rhythm, low stakes, and a little room between the notes. Let the background do some of the holding.</p><div className="sound-tags"><span><Moon size={14} /> Low stimulation</span><span><Leaf size={14} /> Instrumental</span><span><Heart size={14} /> Restorative</span></div></div></div>
}

function Therapists({ user }) {
  const [therapists, setTherapists] = useState(demoTherapists); const [selected, setSelected] = useState(null); const [booking, setBooking] = useState(false)
  useEffect(() => { api.therapists.list().then((data) => data.length && setTherapists(data)).catch(() => {}) }, [])
  return <div className="page-wrap"><PageHeader eyebrow="People in your corner" title="Your care team" description="Professional support, thoughtfully matched to the season you’re in." action={<Button variant="soft"><ListFilter size={15} /> Filter care</Button>} /><div className="care-banner panel"><div className="care-banner-icon"><ShieldCheck size={20} /></div><div><strong>Looking for the right fit?</strong><p>Every practitioner here is licensed, vetted, and committed to meeting you with care.</p></div><ArrowUpRight size={17} /></div><div className="section-line"><div><span className="panel-kicker">AVAILABLE TO YOU</span><h2>Meet your people</h2></div><span className="results-count">{therapists.length} practitioners</span></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card panel" key={therapist._id || therapist.id}><div className="therapist-head"><img src={therapist.photo_url} alt="" /><span className="online-badge"><StatusDot /> Available</span><button className="save-therapist"><Heart size={15} /></button></div><div className="therapist-body"><div className="therapist-name"><div><h3>{therapist.name}</h3><p>{therapist.experience_years} years experience</p></div><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><div className="specialization-list">{therapist.specializations?.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div><p className="therapist-bio">{therapist.bio}</p><div className="therapist-foot"><span className="rate"><strong>${therapist.hourly_rate}</strong> / session</span><Button onClick={() => { setSelected(therapist); setBooking(true) }}>View profile <ArrowUpRight size={14} /></Button></div></div></article>)}</div>{booking && selected && <BookingModal therapist={selected} user={user} onClose={() => setBooking(false)} />}</div>
}

function BookingModal({ therapist, user, onClose }) {
  const [date, setDate] = useState(''); const [start, setStart] = useState('10:00'); const [status, setStatus] = useState(''); const [saving, setSaving] = useState(false)
  const submit = async (event) => { event.preventDefault(); setSaving(true); const startDate = new Date(`${date}T${start}:00`); const endDate = new Date(startDate.getTime() + 3600000); try { await api.therapists.book({ user_id: user?.id || 'current-user', therapist_id: therapist._id || therapist.id, date: startDate.toISOString(), start_time: startDate.toISOString(), end_time: endDate.toISOString(), session_type: 'video' }); setStatus('Your session is booked. We’ll see you there.'); } catch (error) { setStatus(error.message || 'That slot is not available yet.') } finally { setSaving(false) } }
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={onClose}><X size={17} /></button><SectionLabel icon={CalendarDays}>Make some room</SectionLabel><h2>Book with {therapist.name.split(',')[0]}</h2><p>Choose a time that feels workable. You can always change your mind later.</p>{status ? <div className="booking-success"><Check size={22} /><strong>{status}</strong><Button onClick={onClose}>Done</Button></div> : <form className="booking-form" onSubmit={submit}><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label>Time<select value={start} onChange={(event) => setStart(event.target.value)}><option>09:00</option><option>10:00</option><option>11:00</option><option>14:00</option><option>15:00</option></select></label><div className="booking-note"><VideoIcon /> 50-minute video session · ${therapist.hourly_rate}</div><Button disabled={saving}>{saving ? <><Loader2 size={15} className="spin" /> Checking availability…</> : <>Request this time <ArrowUpRight size={15} /></>}</Button></form>}</div></div>
}

function VideoIcon() { return <span className="video-icon"><span /></span> }

function Coins({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 248); const [transactions, setTransactions] = useState([]); const [rates, setRates] = useState(null)
  useEffect(() => { Promise.allSettled([api.coins.balance(), api.coins.transactions(), api.coins.rates()]).then(([b, t, r]) => { if (b.status === 'fulfilled') setBalance(b.value.balance); if (t.status === 'fulfilled') setTransactions(t.value); if (r.status === 'fulfilled') setRates(r.value) }) }, [])
  const demoTransactions = [{ description: 'Completed a check-in', source: 'daily_checkin', amount: 10, transaction_type: 'earn' }, { description: 'Journal reflection', source: 'journal', amount: 15, transaction_type: 'earn' }, { description: 'Chat with CalmBot', source: 'mental_health_chat', amount: 5, transaction_type: 'earn' }]
  return <div className="page-wrap"><PageHeader eyebrow="A little thank you for showing up" title="Calm coins" description="Not a score. Just a soft nudge to notice the care you’re already giving yourself." action={<Button variant="soft"><Trophy size={15} /> View achievements</Button>} /><div className="coins-top"><section className="panel balance-card"><div className="balance-sparkle">✦</div><span className="panel-kicker">YOUR BALANCE</span><strong>{balance}</strong><span className="balance-unit">CALM COINS</span><p>That’s {balance > 200 ? 'a beautiful amount of showing up' : 'a beginning worth celebrating'}.</p><div className="balance-footer"><span><StatusDot /> Updated just now</span><CircleDollarSign size={20} /></div></section><section className="panel earn-card"><div className="panel-header"><div><span className="panel-kicker">WAYS TO EARN</span><h2>Small acts count</h2></div><Zap size={18} className="accent-icon" /></div>{[['Check in today', 'A moment to notice yourself', '+10'], ['Write a reflection', 'Put a thought somewhere safe', '+15'], ['Talk it through', 'You don’t have to hold it alone', '+5']].map(([title, desc, amount]) => <div className="earn-row" key={title}><div className="earn-icon"><Check size={14} /></div><div><strong>{title}</strong><span>{desc}</span></div><b>{amount}</b></div>)}</section></div><div className="coins-bottom"><section className="panel transaction-card"><div className="panel-header"><div><span className="panel-kicker">THE TRAIL</span><h2>Recent activity</h2></div><button className="filter-button"><ListFilter size={15} /> All activity</button></div><div className="transaction-list">{(transactions.length ? transactions : demoTransactions).map((transaction, index) => <div className="transaction-row" key={transaction._id || index}><div className={`transaction-icon ${transaction.transaction_type === 'spend' ? 'spend' : ''}`}>{transaction.transaction_type === 'spend' ? <ArrowUpRight size={15} /> : <ArrowUpRight size={15} className="rotate-neg" />}</div><div><strong>{transaction.description}</strong><small>{transaction.source?.replaceAll('_', ' ') || 'wellbeing'}</small></div><b className={transaction.transaction_type === 'spend' ? 'spend-text' : ''}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</b></div>)}</div></section><section className="panel reward-card"><div className="reward-orbit"><Trophy size={19} /></div><span className="panel-kicker">NEXT MILESTONE</span><h2>Consistent<br /><em>care.</em></h2><p>52 more coins until you unlock your next gentle reward.</p><div className="milestone-track"><span style={{ width: '72%' }} /></div><div className="milestone-labels"><span>248 coins</span><span>300 coins</span></div><Button variant="dark">See rewards <ArrowUpRight size={15} /></Button></section></div>{rates && <div className="rates-note"><Sparkles size={14} /> Your earning rates are synced with the ZenHeaven API.</div>}</div>
}

function formatDate(value) {
  if (!value) return 'Today'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Today'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}

export default App
