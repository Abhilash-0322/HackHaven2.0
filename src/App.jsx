import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Compass,
  Heart,
  Home,
  Leaf,
  LoaderCircle,
  LogOut,
  Menu,
  MessageCircle,
  Music2,
  PenLine,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  SunMedium,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, getToken, streamChat } from './api'

const casts = [
  {
    avatar: 'MS',
    handle: 'mira.s',
    time: '8m',
    body: 'A gentle reminder: you do not need to optimize your healing. Some days, showing up softly is the whole practice.',
    tags: ['#softness', '#selfcompassion'],
    likes: 48,
    replies: 12,
    color: 'lavender',
  },
  {
    avatar: 'JK',
    handle: 'julesk',
    time: '31m',
    body: 'Went outside before opening any apps today. The sky was doing a lot of emotional labor for me.',
    tags: ['#smallwins', '#offline'],
    likes: 31,
    replies: 7,
    color: 'peach',
  },
  {
    avatar: 'AR',
    handle: 'alina.reflects',
    time: '1h',
    body: 'What is one feeling you are making room for this week? Mine is uncertainty — it keeps asking for a chair at the table.',
    tags: ['#reflection', '#community'],
    likes: 79,
    replies: 24,
    color: 'mint',
  },
]

const fallbackBooks = [
  { id: 'book-1', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'Notes and small observations for difficult days.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'The quiet art of rest and retreat in hard seasons.' },
  { id: 'book-3', title: 'The Things You Can See', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80', description: 'A calming guide to finding stillness in a busy world.' },
]

const fallbackSongs = [
  { name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Anchor', artist: 'Novo Amor', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80' },
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80' },
]

const fallbackTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D in Clinical Psychology, Stanford University', bio: 'A warm, practical approach blending CBT and mindfulness.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy, NYU', bio: 'Helping people build kinder relationships with themselves and others.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80' },
  { _id: 'therapist-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Life Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Culturally sensitive care for transitions, grief, and finding meaning.', hourly_rate: 95, languages: ['English', 'Hindi', 'Gujarati'], rating: 4.8, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80' },
]

const moods = ['calm', 'hopeful', 'anxious', 'tired', 'grateful']

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zenheaven_user')) || null
    } catch {
      return null
    }
  })

  const signIn = (payload) => {
    localStorage.setItem('zenheaven_token', payload.access_token || 'demo-token')
    localStorage.setItem('zenheaven_user', JSON.stringify(payload.user || payload))
    setUser(payload.user || payload)
  }

  const signOut = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }

  return (
    <div className="app-shell">
      <TopBar user={user} signOut={signOut} />
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<AuthPage mode="login" onAuth={signIn} />} />
        <Route path="/register" element={<AuthPage mode="register" onAuth={signIn} />} />
        <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute user={user}><ChatPage /></PrivateRoute>} />
        <Route path="/journal" element={<PrivateRoute user={user}><JournalPage /></PrivateRoute>} />
        <Route path="/books" element={<PrivateRoute user={user}><BooksPage /></PrivateRoute>} />
        <Route path="/music" element={<PrivateRoute user={user}><MusicPage /></PrivateRoute>} />
        <Route path="/therapists" element={<PrivateRoute user={user}><TherapistsPage user={user} /></PrivateRoute>} />
        <Route path="/coins" element={<PrivateRoute user={user}><CoinsPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function PrivateRoute({ user, children }) {
  return user || getToken() ? children : <Navigate to="/login" replace />
}

function TopBar({ user, signOut }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/chat', label: 'Chat', icon: MessageCircle },
    { to: '/journal', label: 'Journal', icon: PenLine },
    { to: '/books', label: 'Library', icon: BookOpen },
    { to: '/music', label: 'Sound', icon: Music2 },
    { to: '/therapists', label: 'Care', icon: UsersRound },
  ]
  if (location.pathname === '/login' || location.pathname === '/register') return null
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark"><Sparkles size={16} /></span>
        <span>zenheaven</span>
      </Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`top-nav ${open ? 'is-open' : ''}`}>
        {user && navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        {!user && <Link className="nav-link" to="/login">Sign in</Link>}
        {user ? (
          <button className="profile-chip" onClick={signOut} title="Sign out">
            <span className="avatar avatar-small">{(user.full_name || user.username || 'Z').slice(0, 1).toUpperCase()}</span>
            <span>{user.username || 'you'}</span><LogOut size={14} />
          </button>
        ) : <Link className="button button-dark compact" to="/register">Join the circle <ArrowUpRight size={14} /></Link>}
      </nav>
    </header>
  )
}

function LandingPage({ user }) {
  const navigate = useNavigate()
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> a softer space for your inner world</div>
          <h1>Come as you are.<br /><em>Leave a little lighter.</em></h1>
          <p className="hero-lede">ZenHeaven is a quiet corner of the internet for honest check-ins, gentle conversations, and the small practices that help you feel like yourself again.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => navigate(user ? '/dashboard' : '/register')}>Find your signal <ArrowRight size={16} /></button>
            <a className="text-link" href="#story">How it works <ArrowDownIcon /></a>
          </div>
          <div className="trusted-row"><div className="mini-avatars"><span>AS</span><span>MK</span><span>JR</span><span>+</span></div><span>joined by 2,400+ gentle humans</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of a calm sunrise">
          <div className="sun-disc" />
          <div className="hill hill-back" /><div className="hill hill-front" />
          <div className="art-note note-one"><Heart size={15} fill="currentColor" /> today can be different</div>
          <div className="art-note note-two"><Leaf size={15} /> take the next kind step</div>
          <div className="art-caption"><span>01</span><span>make room for what’s here</span></div>
        </div>
      </section>
      <section className="ticker"><div>daily check-ins</div><span>✦</span><div>human stories</div><span>✦</span><div>AI with boundaries</div><span>✦</span><div>tiny rituals</div><span>✦</span><div>daily check-ins</div></section>
      <section id="story" className="story-section content-width">
        <div className="section-kicker">THE ZENHEAVEN WAY <span>✦</span></div>
        <div className="story-grid">
          <div><h2>Wellbeing isn’t a destination.<br /><em>It’s a conversation.</em></h2></div>
          <div><p>We made ZenHeaven for the in-between moments: the Sunday scaries, the 2am thoughts, the quiet wins no one else sees. Start with one honest signal, then follow what feels helpful.</p><Link className="text-link" to={user ? '/dashboard' : '/register'}>Step inside <ArrowRight size={15} /></Link></div>
        </div>
        <div className="feature-cards">
          <FeatureCard number="01" icon={<MessageCircle />} title="Say it out loud" text="A calm AI companion that listens without trying to fix you. Pick up the thread whenever you’re ready." to="/chat" />
          <FeatureCard number="02" icon={<PenLine />} title="Make a little space" text="Journal in your own words, notice your patterns, and collect the thoughts worth keeping." to="/journal" />
          <FeatureCard number="03" icon={<UsersRound />} title="Find your people" text="Explore care that meets you where you are — from soft community casts to licensed therapists." to="/therapists" />
        </div>
      </section>
      <section className="landing-feed content-width">
        <div className="feed-heading"><div><div className="section-kicker">THE DAILY CAST <span>✦</span></div><h2>A little less alone.</h2></div><Link to={user ? '/dashboard' : '/register'} className="text-link">Enter the feed <ArrowRight size={15} /></Link></div>
        <div className="cast-grid">{casts.map((cast) => <CastCard key={cast.handle} cast={cast} />)}</div>
      </section>
      <section className="quote-section"><div className="quote-mark">“</div><blockquote>You don’t have to be positive.<br /><em>You just have to be present.</em></blockquote><div className="quote-byline">— a note from the ZenHeaven community</div></section>
      <Footer />
    </main>
  )
}

function ArrowDownIcon() {
  return <span className="arrow-down">↓</span>
}

function FeatureCard({ number, icon, title, text, to }) {
  return <Link to={to} className="feature-card"><div className="feature-top"><span className="feature-number">{number}</span><span className="feature-icon">{icon}</span></div><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowUpRight size={16} /></span></Link>
}

function CastCard({ cast }) {
  return <article className={`cast-card ${cast.color}`}><div className="cast-meta"><span className="avatar">{cast.avatar}</span><div><strong>@{cast.handle}</strong><span>{cast.time} ago</span></div><button className="more-button">•••</button></div><p>{cast.body}</p><div className="cast-tags">{cast.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="cast-actions"><span>♡ {cast.likes}</span><span>◌ {cast.replies}</span><span className="cast-share">↗</span></div></article>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      onAuth(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(`${err.message}. You can continue in preview mode.`)
    } finally {
      setLoading(false)
    }
  }

  const demo = () => {
    onAuth({ access_token: 'preview-token', user: { username: 'maya', full_name: 'Maya', email: 'maya@example.com', calm_coins: 240 } })
    navigate('/dashboard')
  }

  return <main className="auth-page"><div className="auth-art"><Link className="brand brand-light" to="/"><span className="brand-mark"><Sparkles size={16} /></span><span>zenheaven</span></Link><div className="auth-art-copy"><span>“</span><h2>A place to put down<br />what you’re carrying.</h2><p>Gentle tools for the days that need a little more care.</p></div><div className="auth-art-footer">softly, steadily, together <span>✦</span></div></div><div className="auth-form-wrap"><div className="auth-form"><div className="eyebrow">WELCOME BACK, SOUL</div><h1>{isRegister ? 'Start where you are.' : 'Good to see you again.'}</h1><p>{isRegister ? 'Your quieter corner is waiting.' : 'Let’s pick up where you left off.'}</p><form onSubmit={submit}>{isRegister && <><label>What should we call you?<input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" /></label></>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. stillwaters" /></label>{isRegister && <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6+ characters" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark button-wide" disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : isRegister ? 'Create my space' : 'Enter ZenHeaven'} <ArrowRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button className="button button-outline button-wide" onClick={demo}>Continue with preview <Sparkles size={15} /></button><p className="auth-switch">{isRegister ? 'Already have a space?' : 'New here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></div></div></main>
}

function Dashboard({ user }) {
  const [activeMood, setActiveMood] = useState('calm')
  const displayName = user?.full_name?.split(' ')[0] || user?.username || 'friend'
  return <main className="app-page content-width"><div className="dashboard-welcome"><div><div className="section-kicker">SATURDAY, SEPTEMBER 05 <span>✦</span></div><h1>Good morning, {displayName}.</h1><p className="page-lede">There is no perfect way to feel today. Let’s start with what’s true.</p></div><Link to="/coins" className="coin-pill"><CircleDollarSign size={16} /> {user?.calm_coins || 240} <span>calm coins</span><ArrowUpRight size={14} /></Link></div><section className="signal-panel"><div className="signal-copy"><span className="signal-label"><SunMedium size={15} /> your daily signal</span><h2>How are you arriving today?</h2><p>A check-in is not a test. It’s just a moment to notice.</p><div className="mood-row">{moods.map((mood) => <button key={mood} className={activeMood === mood ? 'mood-button active' : 'mood-button'} onClick={() => setActiveMood(mood)}><span className={`mood-face ${mood}`}>{mood === 'calm' ? '◡' : mood === 'hopeful' ? '✦' : mood === 'anxious' ? '◌' : mood === 'tired' ? '—' : '♡'}</span>{mood}</button>)}</div></div><div className="signal-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><Sparkles size={24} /><span>feeling<br />{activeMood}</span></div></div></section><div className="dashboard-grid"><section className="dashboard-main"><div className="section-title-row"><div><div className="section-kicker">YOUR SPACE <span>✦</span></div><h2>Choose your next small thing.</h2></div><button className="icon-button" title="Customize"><Settings2 size={17} /></button></div><div className="tool-grid"><ToolCard to="/chat" icon={<MessageCircle />} label="talk it through" title="A little support" detail="Your private, always-on listening space." tone="purple" /><ToolCard to="/journal" icon={<PenLine />} label="put it down" title="Open your journal" detail="Turn the noise into a few honest lines." tone="peach" /><ToolCard to="/music" icon={<Music2 />} label="find your rhythm" title="Set the mood" detail="A soundscape for exactly where you are." tone="mint" /><ToolCard to="/books" icon={<BookOpen />} label="go a little deeper" title="Read something kind" detail="Thoughtful recommendations for your season." tone="cream" /></div><div className="dashboard-cast-title"><div><div className="section-kicker">FROM THE CAST <span>✦</span></div><h2>Today’s gentle notes</h2></div><Link className="text-link" to="/">See all <ArrowRight size={14} /></Link></div>{casts.slice(0, 2).map((cast) => <CastCard key={cast.handle} cast={cast} />)}</section><aside className="dashboard-side"><div className="side-card streak-card"><div className="side-card-head"><span className="side-icon"><Trophy size={17} /></span><span>your rhythm</span><button className="more-button">•••</button></div><div className="streak-number">04 <span>days</span></div><p>You’ve checked in four days in a row. That counts.</p><div className="week-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`} className={index < 4 ? 'week-day done' : index === 5 ? 'week-day today' : 'week-day'}><span>{index < 4 ? <Check size={12} /> : ''}</span><small>{day}</small></div>)}</div></div><div className="side-card prompt-card"><span className="section-kicker">A QUESTION FOR YOU</span><h3>What would feel like enough for today?</h3><Link to="/journal" className="button button-light">Write it down <PenLine size={14} /></Link></div></aside></div></main>
}

function ToolCard({ to, icon, label, title, detail, tone }) {
  return <Link to={to} className={`tool-card ${tone}`}><div className="tool-icon">{icon}</div><span className="tool-label">{label}</span><h3>{title}</h3><p>{detail}</p><ArrowUpRight className="tool-arrow" size={17} /></Link>
}

function ChatPage() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi, I’m here. No need to have the right words — what’s been taking up space in your mind today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [thought, setThought] = useState('')

  useEffect(() => {
    apiFetch('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {})
  }, [])

  const sendMessage = async (event) => {
    event?.preventDefault()
    const text = input.trim()
    if (!text || thinking) return
    setInput('')
    setMessages((current) => [...current, { role: 'user', text }])
    setMessages((current) => [...current, { role: 'assistant', text: '' }])
    setThinking(true)
    try {
      await streamChat(text, threadId, (eventData) => {
        if (eventData.type === 'thread_id') setThreadId(eventData.data)
        if (eventData.type === 'thinking') setThought(eventData.data)
        if (eventData.type === 'token') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, text: item.text + eventData.data } : item))
        if (eventData.type === 'complete') {
          setThinking(false)
          setThought('')
        }
      })
    } catch {
      setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, text: 'I’m having a quiet technical moment. You can still take one slow breath and try again in a little while.' } : item))
      setThinking(false)
      setThought('')
    }
  }

  return <main className="chat-page content-width"><div className="page-heading"><div><div className="section-kicker">YOUR PRIVATE SPACE <span>✦</span></div><h1>Let’s talk it through.</h1><p className="page-lede">No judgement. No rush. Just a place to start.</p></div><span className="privacy-pill"><span className="pulse-dot" /> private & secure</span></div><div className="chat-layout"><aside className="thread-sidebar"><div className="thread-head"><strong>Conversations</strong><button className="icon-button" onClick={() => { setThreadId(null); setMessages([{ role: 'assistant', text: 'A fresh page. What would you like to explore?' }]) }}><Plus size={17} /></button></div>{threads.length ? threads.map((thread) => <button className={thread.id === threadId ? 'thread-item active' : 'thread-item'} key={thread.id} onClick={() => { setThreadId(thread.id); apiFetch(`/mental-health/threads/${thread.id}`).then((data) => setMessages(data.messages.map((message) => ({ role: message.is_user ? 'user' : 'assistant', text: message.content })))).catch(() => {}) }}><span>{thread.title}</span><small>{thread.message_count} notes</small></button>) : <div className="empty-threads"><MessageCircle size={20} /><p>Your conversations will live here.</p></div>}</aside><section className="chat-window"><div className="chat-window-top"><div className="bot-status"><span className="bot-orb"><Sparkles size={17} /></span><div><strong>CalmBot</strong><span>here to listen</span></div></div><button className="more-button">•••</button></div><div className="messages">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={14} /> : 'you'}</div><div className="message-bubble">{message.text || <span className="typing"><i /><i /><i /></span>} {message.role === 'assistant' && index === messages.length - 1 && thinking && <small className="thinking-label">{thought}</small>}</div></div>)}</div><form className="chat-composer" onSubmit={sendMessage}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what’s on your mind..." /><button aria-label="Send message" disabled={thinking || !input.trim()}><Send size={17} /></button></form><p className="chat-note">CalmBot is a supportive tool, not a replacement for professional care. <Link to="/therapists">Find a therapist</Link></p></section></div></main>
}

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => { apiFetch('/journal/entries').then(setEntries).catch(() => {}) }, [])
  const saveEntry = async (event) => {
    event.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const entry = await apiFetch('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [mood] }) })
      setEntries((current) => [entry, ...current])
    } catch {
      setEntries((current) => [{ _id: `local-${Date.now()}`, title: 'A small honest moment', content, mood, created_at: new Date().toISOString() }, ...current])
    } finally {
      setContent('')
      setSaved(true)
      setLoading(false)
      window.setTimeout(() => setSaved(false), 2400)
    }
  }
  return <main className="app-page content-width"><div className="page-heading"><div><div className="section-kicker">THE REFLECTION ROOM <span>✦</span></div><h1>Make room for the real.</h1><p className="page-lede">You don’t need a polished thought. Start with the one that keeps returning.</p></div><span className="date-stamp"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><div className="journal-layout"><form className="journal-editor" onSubmit={saveEntry}><div className="editor-top"><span className="editor-status"><span className="pulse-dot" /> new entry</span><span className="editor-hint">saved privately</span></div><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What feels present for you right now?" /><div className="editor-bottom"><div className="mood-select"><span>feeling</span>{moods.slice(0, 4).map((item) => <button type="button" key={item} className={mood === item ? 'selected' : ''} onClick={() => setMood(item)}>{item}</button>)}</div><button className="button button-dark" disabled={loading}>{saved ? <><Check size={16} /> saved</> : loading ? <LoaderCircle className="spin" size={16} /> : <>Save this moment <ArrowRight size={15} /></>}</button></div></form><aside className="journal-prompt"><span className="prompt-spark"><Sparkles size={16} /></span><div className="section-kicker">A GENTLE PROMPT</div><h2>What would feel like enough for today?</h2><p>You can answer in a sentence, a paragraph, or just a word. There is no wrong way to be here.</p><button className="text-link" onClick={() => setContent('Today, enough would feel like... ')}>Use this prompt <ArrowRight size={15} /></button></aside></div><div className="entries-section"><div className="section-title-row"><div><div className="section-kicker">YOUR NOTES <span>✦</span></div><h2>Pieces of your becoming.</h2></div><span className="entry-count">{entries.length} entries</span></div>{entries.length ? <div className="entry-list">{entries.map((entry) => <article className="entry-item" key={entry._id || entry.id}><div className={`entry-mood ${entry.mood || 'calm'}`}>{(entry.mood || 'calm').slice(0, 1).toUpperCase()}</div><div><span className="entry-date">{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span><h3>{entry.title || 'A quiet note'}</h3><p>{entry.content}</p></div><ArrowUpRight size={17} /></article>)}</div> : <div className="empty-state"><PenLine size={22} /><p>Your first note can be small. A sentence is enough.</p></div>}</div></main>
}

function BooksPage() {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  useEffect(() => { apiFetch('/books/recommend-by-mood').then((data) => { if (data.books?.length) { setBooks(data.books); setMood(data.mood) } }).catch(() => {}) }, [])
  const search = async (event) => {
    event.preventDefault()
    if (!query.trim()) return
    try { const data = await apiFetch(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); setBooks(data.books || []) } catch { setBooks(fallbackBooks) }
  }
  return <main className="app-page content-width"><div className="books-hero"><div><div className="section-kicker">THE LITTLE LIBRARY <span>✦</span></div><h1>Words for your season.</h1><p className="page-lede">A handful of books that meet you where you are — no homework required.</p></div><div className="book-sun"><BookOpen size={26} /></div></div><div className="library-toolbar"><div className="filter-pills"><span>curated for</span><button className="active">{mood}</button><button>recently saved</button><button>popular with the cast</button></div><form className="search-form" onSubmit={search}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the library" /></form></div><div className="book-grid">{books.map((book, index) => <article className="book-card" key={book.id || book.title}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <div className={`cover-placeholder cover-${index % 3}`}><BookOpen size={22} /><span>{book.title}</span></div>}<button className="save-book" aria-label="Save book"><Heart size={16} /></button></div><div className="book-info"><span className="book-type">a good read for you</span><h3>{book.title}</h3><p>{book.author}</p><small>{book.description || 'A thoughtful companion for your wellbeing journey.'}</small></div></article>)}</div></main>
}

function MusicPage() {
  const [songs, setSongs] = useState(fallbackSongs)
  const [current, setCurrent] = useState(null)
  const [songQuery, setSongQuery] = useState('')
  useEffect(() => { apiFetch('/songs').then(async (data) => { const names = (data.songs || []).slice(0, 6); const details = await Promise.all(names.map((name) => apiFetch(`/song_details?song=${encodeURIComponent(name)}&artist=Various`).catch(() => null))); const valid = details.filter(Boolean); if (valid.length) setSongs(valid) }).catch(() => {}) }, [])
  const recommend = async (event) => {
    event.preventDefault()
    if (!songQuery.trim()) return
    try { const data = await apiFetch(`/recommend?song=${encodeURIComponent(songQuery)}`); setSongs([data.input_song ? { name: data.input_song, artist: 'Your starting point' } : null, ...(data.recommendations || [])].filter(Boolean)) } catch { setSongs(fallbackSongs) }
  }
  return <main className="app-page content-width"><div className="music-hero"><div><div className="section-kicker">THE SOUND ROOM <span>✦</span></div><h1>Let the day have a soundtrack.</h1><p className="page-lede">Music can hold what words can’t. Start with a feeling and let the rest unfold.</p><form className="music-search" onSubmit={recommend}><Music2 size={18} /><input value={songQuery} onChange={(e) => setSongQuery(e.target.value)} placeholder="Name a song you’re feeling..." /><button><ArrowRight size={16} /></button></form></div><div className="music-art"><div className="vinyl"><div className="vinyl-label">ZH<br /><small>03</small></div></div><div className="music-art-note">press play<br /><em>stay awhile</em></div></div></div><div className="section-title-row music-title"><div><div className="section-kicker">A SOFT MIX <span>✦</span></div><h2>For a {current ? 'moment like this' : 'slow morning'}.</h2></div><span className="music-duration"><Clock3 size={15} /> 42 min · restorative</span></div><div className="song-list">{songs.map((song, index) => <button key={`${song.name}-${index}`} className={current?.name === song.name ? 'song-row playing' : 'song-row'} onClick={() => setCurrent(song)}><span className="song-index">{current?.name === song.name ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><span className="song-art">{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <Music2 size={15} />}</span><span className="song-name"><strong>{song.name}</strong><small>{song.artist}</small></span><span className="song-wave">···</span><span className="song-length">{['3:42', '4:08', '3:25', '5:11'][index % 4]}</span><ArrowUpRight size={15} /></button>)}</div>{current && <div className="now-playing"><div className="now-playing-art"><Music2 size={17} /></div><div><span>now playing</span><strong>{current.name}</strong></div><div className="playing-bars"><i /><i /><i /><i /></div><button onClick={() => setCurrent(null)}><X size={16} /></button></div>}</main>
}

function TherapistsPage({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [specialization, setSpecialization] = useState('all')
  const [selected, setSelected] = useState(null)
  const [booked, setBooked] = useState(false)
  useEffect(() => { apiFetch('/therapists/').then((data) => { if (data.length) setTherapists(data) }).catch(() => {}) }, [])
  const specializations = ['all', ...new Set(therapists.flatMap((item) => item.specializations || []))]
  const filtered = specialization === 'all' ? therapists : therapists.filter((item) => item.specializations?.includes(specialization))
  return <main className="app-page content-width"><div className="care-hero"><div><div className="section-kicker">THE CARE CIRCLE <span>✦</span></div><h1>Support, at your pace.</h1><p className="page-lede">Finding the right person can take time. We’ll make the first step feel a little easier.</p></div><div className="care-stat"><span>24/7</span><small>someone to talk to</small></div></div><div className="specialization-row"><span>i’m looking for help with</span>{specializations.slice(0, 7).map((item) => <button key={item} className={specialization === item ? 'active' : ''} onClick={() => setSpecialization(item)}>{item}</button>)}</div><div className="care-layout"><div className="therapist-list"><div className="list-header"><h2>People who can help.</h2><span>{filtered.length} practitioners</span></div>{filtered.map((therapist) => <TherapistCard key={therapist._id || therapist.id} therapist={therapist} onSelect={() => { setSelected(therapist); setBooked(false) }} />)}</div><aside className="care-aside"><div className="crisis-card"><span className="crisis-icon"><Heart size={16} /></span><span className="section-kicker">NEED HELP RIGHT NOW?</span><h3>You deserve immediate support.</h3><p>If you’re in immediate danger, contact your local emergency service. In the US and Canada, call or text 988.</p><a href="tel:988" className="text-link">Call 988 <ArrowUpRight size={14} /></a></div><div className="care-note"><Sparkles size={17} /><p>It’s okay if the first person isn’t the right fit. Your comfort matters here.</p></div></aside></div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="booking-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-therapist"><img src={selected.photo_url} alt="" /><div><div className="section-kicker">A GOOD PLACE TO START</div><h2>{selected.name}</h2><p>{selected.specializations?.join(' · ')}</p></div></div><p className="modal-bio">{selected.bio}</p><div className="availability"><span>next available</span><button>Tue, Sep 08 · 10:00 AM</button><button>Wed, Sep 09 · 3:00 PM</button></div>{booked ? <div className="booking-success"><Check size={18} /><strong>You’re on the calendar.</strong><p>We’ll send the details to your account.</p></div> : <button className="button button-dark button-wide" onClick={() => { setBooked(true); apiFetch('/therapists/appointments', { method: 'POST', body: JSON.stringify({ user_id: user?.id || 'preview-user', therapist_id: selected._id, date: '2026-09-08T00:00:00', start_time: '2026-09-08T10:00:00', end_time: '2026-09-08T11:00:00', session_type: 'video' }) }).catch(() => {}) }}>Request this time <ArrowRight size={15} /></button>}</div></div>}</main>
}

function TherapistCard({ therapist, onSelect }) {
  return <article className="therapist-card"><img src={therapist.photo_url} alt="" /><div className="therapist-info"><div className="therapist-heading"><div><h3>{therapist.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'} <small>({therapist.total_sessions || 300} sessions)</small></span></div><span className="rate">${therapist.hourly_rate}<small>/ session</small></span></div><p>{therapist.bio}</p><div className="specialization-tags">{therapist.specializations?.map((item) => <span key={item}>{item}</span>)}</div><div className="therapist-bottom"><span><Compass size={14} /> {therapist.languages?.join(', ')}</span><button className="button button-outline compact" onClick={onSelect}>View profile <ArrowUpRight size={14} /></button></div></div></article>
}

function CoinsPage() {
  const [balance, setBalance] = useState(240)
  const [transactions, setTransactions] = useState([])
  useEffect(() => { apiFetch('/coins/balance').then((data) => setBalance(data.balance)).catch(() => {}); apiFetch('/coins/transactions').then(setTransactions).catch(() => {}) }, [])
  const rewards = [{ icon: <Brain />, title: 'Premium insights', detail: 'A deeper look at your patterns', cost: 100 }, { icon: <Music2 />, title: 'Custom meditation', detail: 'A soundscape made for you', cost: 150 }, { icon: <UsersRound />, title: 'Therapist session', detail: 'One 1-on-1 care session', cost: 500 }]
  return <main className="app-page content-width"><div className="coins-hero"><div><div className="section-kicker">THE GOOD STUFF <span>✦</span></div><h1>Small care, that adds up.</h1><p className="page-lede">Calm coins are little thank-yous for choosing yourself — one chat, page, and check-in at a time.</p></div><div className="balance-orb"><CircleDollarSign size={27} /><span>{balance}</span><small>calm coins</small></div></div><div className="coins-grid"><section className="earn-card"><div className="section-title-row"><div><div className="section-kicker">KEEP SHOWING UP <span>✦</span></div><h2>Ways to earn today.</h2></div><span className="streak-mini"><Trophy size={14} /> 4 day streak</span></div>{[['Chat with CalmBot', 'Have a supportive conversation', 5, <MessageCircle />], ['Write in your journal', 'Put one honest thought down', 15, <PenLine />], ['Complete a mood check', 'Notice where you are today', 5, <Heart />]].map(([title, detail, amount, icon]) => <div className="earn-row" key={title}><span className="earn-icon">{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><span className="earn-amount">+{amount}</span></div>)}</section><section className="rewards-card"><div className="section-kicker">A LITTLE SOMETHING <span>✦</span></div><h2>Spend it on care.</h2>{rewards.map((reward) => <div className="reward-row" key={reward.title}><span className="reward-icon">{reward.icon}</span><div><strong>{reward.title}</strong><small>{reward.detail}</small></div><button disabled={balance < reward.cost}>{reward.cost} <CircleDollarSign size={13} /></button></div>)}</section></div><section className="transactions"><div className="section-title-row"><div><div className="section-kicker">YOUR TRAIL <span>✦</span></div><h2>Where your coins went.</h2></div><span className="entry-count">recent activity</span></div>{transactions.length ? transactions.map((transaction) => <div className="transaction-row" key={transaction._id}><span className={transaction.transaction_type === 'earn' ? 'transaction-symbol earn' : 'transaction-symbol spend'}>{transaction.transaction_type === 'earn' ? '+' : '−'}</span><div><strong>{transaction.description}</strong><small>{new Date(transaction.timestamp).toLocaleDateString()}</small></div><span>{transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}</span></div>) : <div className="empty-state"><CircleDollarSign size={22} /><p>Your care trail will appear here as you go.</p></div>}</section></main>
}

function Footer() {
  return <footer className="site-footer content-width"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>zenheaven</span></div><span>made for the tender-hearted <span className="footer-heart">♥</span></span><div><Link to="/login">sign in</Link><Link to="/register">join us</Link></div></footer>
}

export default App
