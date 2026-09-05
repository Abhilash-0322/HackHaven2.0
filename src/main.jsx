import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowUpRight as ArrowUpRightIcon,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Coins,
  Command,
  Compass,
  Copy,
  CornerDownLeft,
  Crown,
  Flame,
  Headphones,
  Heart,
  Home,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Moon,
  Music2,
  NotebookPen,
  Plus,
  Play,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
  UsersRound,
  WandSparkles,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const navGroups = [
  {
    label: 'Core',
    items: [
      { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, key: '1' },
      { to: '/chat', label: 'CalmBot', icon: MessageCircle, key: '2', badge: 'live' },
      { to: '/journal', label: 'Journal', icon: NotebookPen, key: '3' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { to: '/books', label: 'Library', icon: BookOpen, key: '4' },
      { to: '/music', label: 'Soundroom', icon: Music2, key: '5' },
      { to: '/therapists', label: 'Therapists', icon: UsersRound, key: '6' },
      { to: '/coins', label: 'Calm Coins', icon: Coins, key: '7', badge: '126' },
    ],
  },
]

const demoUser = {
  id: 'demo-user',
  username: 'alex',
  email: 'alex@zenheaven.app',
  full_name: 'Alex Morgan',
  calm_coins: 126,
}

const demoThreads = [
  { id: 'thread-1', title: 'A softer start to the week', message_count: 8, last_message: 'I feel a little lighter now.', updated_at: '2026-09-05T15:10:00Z' },
  { id: 'thread-2', title: 'Finding focus without pressure', message_count: 12, last_message: 'Let’s try a gentle reset.', updated_at: '2026-09-04T17:40:00Z' },
  { id: 'thread-3', title: 'Untangling the Sunday feeling', message_count: 6, last_message: 'That makes sense.', updated_at: '2026-09-02T09:20:00Z' },
]

const demoMessages = [
  { id: 'welcome', is_user: false, content: 'Hey Alex. I’m CalmBot, your private space to pause, reflect, and find your next small step. What feels most present for you today?', timestamp: '2026-09-05T15:06:00Z' },
  { id: 'user-1', is_user: true, content: 'I’m carrying a lot of tiny tasks and somehow they all feel urgent.', timestamp: '2026-09-05T15:08:00Z' },
  { id: 'bot-1', is_user: false, content: 'That sounds like a lot of mental tabs open at once. We could make the next step smaller: name the one task that would create the most relief, then give it ten unhurried minutes. The rest can wait for that signal.', timestamp: '2026-09-05T15:09:00Z' },
  { id: 'user-2', is_user: true, content: 'I feel a little lighter now.', timestamp: '2026-09-05T15:10:00Z' },
]

const journalSeed = [
  { id: 'j-1', title: 'A quieter kind of progress', content: 'Today I noticed I did not need to solve everything before I could feel okay. A walk, a glass of water, and one honest conversation were enough for now.', mood: 'hopeful', tags: ['self-care', 'small wins'], created_at: '2026-09-05T11:20:00Z' },
  { id: 'j-2', title: 'Room to breathe', content: 'The morning was slow in a good way. I made breakfast without checking my phone and remembered that rest is part of the plan, not a detour from it.', mood: 'calm', tags: ['mindfulness'], created_at: '2026-09-04T08:40:00Z' },
  { id: 'j-3', title: 'Naming the noise', content: 'Work felt louder than usual. Writing down the worry gave it edges, which made it feel less like the whole room.', mood: 'reflective', tags: ['reflection'], created_at: '2026-09-02T19:15:00Z' },
]

const bookSeed = [
  { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', category: 'Mindfulness', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=480&q=80', description: 'A gentle invitation to pause and meet your life with more warmth.' },
  { id: 'book-2', title: 'The Comfort Book', author: 'Matt Haig', category: 'Hope', image_url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80', description: 'Notes, lists, and stories for days that feel a little harder.' },
  { id: 'book-3', title: 'Atomic Habits', author: 'James Clear', category: 'Growth', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80', description: 'Small, repeatable choices that help you build a life that fits.' },
  { id: 'book-4', title: 'Wintering', author: 'Katherine May', category: 'Rest', image_url: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=480&q=80', description: 'The quiet wisdom of retreat and renewal in difficult seasons.' },
]

const musicSeed = [
  { name: 'Weightless', artist: 'Marconi Union', mood: 'deep focus', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80', color: '#d5e3df' },
  { name: 'Holocene', artist: 'Bon Iver', mood: 'reflective', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80', color: '#c7d8e3' },
  { name: 'Bloom', artist: 'The Paper Kites', mood: 'hopeful', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80', color: '#d5e0c4' },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', mood: 'lighter', cover: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=300&q=80', color: '#f2d0a8' },
]

const therapistSeed = [
  { id: 1, name: 'Dr. Maya Rao', specialty: 'Anxiety & life transitions', initials: 'MR', color: '#cbd7ff', rating: '4.9', next: 'Today, 6:30 PM', mode: 'Video' },
  { id: 2, name: 'Jordan Ellis, LCSW', specialty: 'Burnout & relationships', initials: 'JE', color: '#ead4cb', rating: '4.8', next: 'Tomorrow, 9:00 AM', mode: 'Video' },
  { id: 3, name: 'Priya Nair, PhD', specialty: 'Mindfulness & self-worth', initials: 'PN', color: '#d7e1cb', rating: '5.0', next: 'Thu, 3:00 PM', mode: 'Audio' },
]

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('zen_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Request failed')
  return response.json()
}

function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zen_user')) || null
    } catch {
      return null
    }
  })

  const login = async (payload, register = false) => {
    try {
      const data = await apiFetch(register ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(payload) })
      localStorage.setItem('zen_token', data.access_token)
      localStorage.setItem('zen_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch {
      const nextUser = { ...demoUser, username: payload.username || 'alex', email: payload.email || demoUser.email, full_name: payload.full_name || 'Alex Morgan' }
      localStorage.setItem('zen_token', 'demo-token')
      localStorage.setItem('zen_user', JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    }
  }

  const logout = () => {
    localStorage.removeItem('zen_token')
    localStorage.removeItem('zen_user')
    setUser(null)
  }

  return { user, login, logout, setUser }
}

function Logo({ compact = false }) {
  return (
    <Link className={`brand ${compact ? 'brand-compact' : ''}`} to="/dashboard">
      <span className="brand-mark"><Sparkles size={15} strokeWidth={2.5} /></span>
      {!compact && <span>zen<span className="brand-accent">heaven</span></span>}
    </Link>
  )
}

function AppShell({ children, user, logout }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentLabel = navGroups.flatMap((group) => group.items).find((item) => location.pathname === item.to)?.label || 'Workspace'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon"><Code2 size={15} /></div>
          <div><span className="eyebrow">Workspace</span><strong>my calm space</strong></div>
          <ChevronDown size={14} className="muted-icon" />
        </div>
        <nav className="nav-area">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.label}</span>
                    {item.badge && <span className={`nav-badge ${item.badge === 'live' ? 'live-badge' : ''}`}>{item.badge}</span>}
                    <span className="nav-key">{item.key}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
          <div className="nav-group nav-group-bottom">
            <div className="nav-label">System</div>
            <NavLink to="/settings" className="nav-item"><Settings2 size={17} strokeWidth={1.8} /><span>Settings</span></NavLink>
            <button className="nav-item nav-button" onClick={logout}><LogOut size={17} strokeWidth={1.8} /><span>Sign out</span></button>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>All systems calm</span>
          <CircleHelp size={14} className="muted-icon footer-help" />
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumbs"><span className="breadcrumb-home">zenheaven</span><ChevronRight size={13} /><span>{currentLabel}</span></div>
          <div className="topbar-actions">
            <button className="command-btn" onClick={() => window.dispatchEvent(new Event('zen-command'))}><Command size={14} /><span>Search</span><kbd>⌘ K</kbd></button>
            <button className="icon-btn notification-btn" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button>
            <Link to="/settings" className="avatar" title={user?.full_name || 'Profile'}>{(user?.full_name || 'A').slice(0, 1).toUpperCase()}</Link>
          </div>
        </header>
        <div className="content-area">{children}</div>
      </main>
    </div>
  )
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div><div className="eyebrow page-eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action}
    </div>
  )
}

function SectionTitle({ icon: Icon, children, action }) {
  return <div className="section-title"><div className="section-title-left">{Icon && <Icon size={16} />}<h2>{children}</h2></div>{action}</div>
}

function StatCard({ label, value, meta, icon: Icon, tone = 'cream' }) {
  return <div className={`stat-card tone-${tone}`}><div className="stat-card-top"><span>{label}</span><span className="stat-icon"><Icon size={16} /></span></div><strong>{value}</strong><small>{meta}</small></div>
}

function Dashboard({ user }) {
  const firstName = user?.full_name?.split(' ')[0] || 'Alex'
  return (
    <div className="page page-dashboard">
      <div className="welcome-row">
        <div><div className="eyebrow page-eyebrow">Saturday, September 5, 2026</div><h1>Good evening, {firstName}<span className="title-spark">✦</span></h1><p className="page-intro">A small check-in is still a meaningful one.</p></div>
        <div className="header-pills"><span className="soft-pill"><Flame size={14} /> 4 day streak</span><span className="soft-pill coin-pill"><Coins size={14} /> {user?.calm_coins || 126}</span></div>
      </div>
      <div className="dashboard-grid">
        <section className="bento-card hero-card">
          <div className="hero-card-copy"><div className="chip chip-violet"><Sparkles size={13} /> Today&apos;s space</div><h2>Let the day be<br /><em>lighter.</em></h2><p>There is no perfect way to feel. Start with what is true, and we&apos;ll take it from there.</p><Link className="button button-dark" to="/chat">Open CalmBot <ArrowUpRight size={16} /></Link></div>
          <div className="orbital-art"><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital-core"><Wind size={27} /></div><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">✧</span></div>
        </section>
        <div className="stats-stack"><StatCard label="Calm coins" value={user?.calm_coins || 126} meta="+ 15 this week" icon={Coins} tone="peach" /><StatCard label="Journal entries" value="12" meta="+ 3 this month" icon={NotebookPen} tone="lilac" /></div>
        <section className="bento-card checkin-card">
          <div className="card-heading"><div><div className="eyebrow">Daily check-in</div><h3>How are you arriving?</h3></div><span className="mini-date">05 / 09</span></div>
          <div className="mood-options"><button className="mood-option"><span>😌</span><small>Calm</small></button><button className="mood-option selected"><span>🙂</span><small>Okay</small></button><button className="mood-option"><span>😟</span><small>Low</small></button><button className="mood-option"><span>😵</span><small>Overloaded</small></button></div>
          <div className="checkin-foot"><span><Zap size={14} /> Earn 5 coins</span><button className="text-button">Save check-in <ArrowUpRight size={14} /></button></div>
        </section>
        <section className="bento-card focus-card">
          <div className="card-heading"><div><div className="eyebrow">Your focus</div><h3>Gentle momentum</h3></div><Target size={19} /></div>
          <div className="progress-ring-wrap"><div className="progress-ring"><span>68<small>%</small></span></div><div><strong>3 of 4</strong><p>small rituals complete</p></div></div>
          <div className="ritual-list"><div><CheckCircle2 size={15} /><span>Morning check-in</span></div><div><CheckCircle2 size={15} /><span>10 min with CalmBot</span></div><div><CheckCircle2 size={15} /><span>Write one reflection</span></div><div className="ritual-open"><span className="empty-check" />Read for 15 minutes</div></div>
        </section>
        <section className="bento-card activity-card">
          <SectionTitle icon={BarChart3} action={<button className="icon-btn"><MoreHorizontal size={17} /></button>}>Your rhythm</SectionTitle>
          <div className="activity-metric"><strong>+24%</strong><span><TrendingUp size={13} /> vs last week</span></div>
          <MiniChart />
          <div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </section>
        <section className="bento-card prompt-card"><div className="prompt-mark">“</div><div className="eyebrow">A prompt for now</div><blockquote>What would it look like to give yourself the same patience you give a friend?</blockquote><Link to="/journal" className="text-button">Write about it <ArrowUpRight size={14} /></Link></section>
        <section className="bento-card quick-card"><div className="eyebrow">Quick access</div><div className="quick-links"><Link to="/music"><span className="quick-icon sage"><Headphones size={16} /></span><span>Reset playlist</span><ArrowUpRight size={14} /></Link><Link to="/therapists"><span className="quick-icon blue"><UsersRound size={16} /></span><span>Meet a therapist</span><ArrowUpRight size={14} /></Link><Link to="/books"><span className="quick-icon yellow"><BookOpen size={16} /></span><span>Find a good read</span><ArrowUpRight size={14} /></Link></div></section>
      </div>
    </div>
  )
}

function MiniChart() {
  return <div className="mini-chart"><div className="chart-grid" /><svg viewBox="0 0 520 130" preserveAspectRatio="none" aria-label="Weekly wellness chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7970ed" stopOpacity=".24" /><stop offset="100%" stopColor="#7970ed" stopOpacity="0" /></linearGradient></defs><path d="M0,104 C28,96 50,100 76,82 S121,87 151,66 S196,72 222,79 S256,33 287,54 S330,42 359,62 S405,42 434,45 S484,12 520,25 V130 H0 Z" fill="url(#chartFill)" /><path d="M0,104 C28,96 50,100 76,82 S121,87 151,66 S196,72 222,79 S256,33 287,54 S330,42 359,62 S405,42 434,45 S484,12 520,25" fill="none" stroke="#7168dd" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg></div>
}

function Chat({ user }) {
  const [threads, setThreads] = useState(demoThreads)
  const [activeId, setActiveId] = useState('thread-1')
  const [messages, setMessages] = useState(demoMessages)
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)
  const activeThread = threads.find((thread) => thread.id === activeId) || threads[0]

  useEffect(() => {
    apiFetch('/mental-health/threads').then((data) => {
      if (data?.threads?.length) setThreads(data.threads)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const loadThread = async (thread) => {
    setActiveId(thread.id)
    try {
      const data = await apiFetch(`/mental-health/threads/${thread.id}`)
      setMessages(data.messages || [])
    } catch {
      setMessages(thread.id === 'thread-1' ? demoMessages : [{ id: `welcome-${thread.id}`, is_user: false, content: 'Welcome back. What would feel supportive to explore today?', timestamp: new Date().toISOString() }])
    }
  }

  const sendMessage = async (event) => {
    event?.preventDefault()
    const message = draft.trim()
    if (!message || thinking) return
    setDraft('')
    setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: message, timestamp: new Date().toISOString() }])
    setThinking(true)
    setStreaming(true)
    let gotResponse = false
    try {
      const token = localStorage.getItem('zen_token')
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, thread_id: activeId }) })
      if (!response.ok || !response.body) throw new Error('offline')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let responseText = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        events.forEach((eventChunk) => {
          const line = eventChunk.split('\n').find((lineItem) => lineItem.startsWith('data:'))
          if (!line) return
          const payload = JSON.parse(line.replace(/^data:\s*/, ''))
          if (payload.type === 'thinking') setThinking(true)
          if (payload.type === 'response_start') setThinking(false)
          if (payload.type === 'token') {
            gotResponse = true
            responseText += payload.data
            setMessages((current) => {
              const withoutDraft = current.filter((item) => item.id !== 'streaming-response')
              return [...withoutDraft, { id: 'streaming-response', is_user: false, content: responseText, timestamp: new Date().toISOString() }]
            })
          }
          if (payload.type === 'complete') setStreaming(false)
        })
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
    if (!gotResponse) {
      const response = message.toLowerCase().includes('stress')
        ? 'Stress can make every task feel like a fire alarm. Try choosing one thing you can finish in ten minutes, then let that count as enough for this moment.'
        : 'Thank you for putting that into words. We can make room for it here, without needing to solve everything at once. What part feels heaviest right now?'
      setMessages((current) => [...current.filter((item) => item.id !== 'streaming-response'), { id: `bot-${Date.now()}`, is_user: false, content: response, timestamp: new Date().toISOString() }])
    }
    setThinking(false)
    setStreaming(false)
  }

  return (
    <div className="chat-workspace">
      <aside className="thread-panel">
        <div className="thread-panel-head"><div><div className="eyebrow">Private workspace</div><h2>Conversations</h2></div><button className="round-button" onClick={() => { setActiveId('new'); setMessages([]) }}><Plus size={17} /></button></div>
        <button className="new-thread-button" onClick={() => { setActiveId('new'); setMessages([]) }}><Plus size={15} /> New conversation <span>⌘ N</span></button>
        <div className="thread-list">
          <div className="thread-section-label">Recent</div>
          {threads.map((thread) => <button key={thread.id} className={`thread-item ${thread.id === activeId ? 'selected' : ''}`} onClick={() => loadThread(thread)}><span className="thread-dot" /><span className="thread-copy"><strong>{thread.title}</strong><small>{thread.last_message}</small></span><MoreHorizontal size={15} className="thread-more" /></button>)}
        </div>
        <div className="thread-panel-foot"><div className="safe-badge"><ShieldCheck size={15} /><span><strong>Private by default</strong><small>Your conversations stay yours.</small></span></div></div>
      </aside>
      <section className="chat-panel">
        <div className="chat-head"><div className="chat-head-title"><div className="bot-avatar"><Bot size={18} /></div><div><strong>CalmBot</strong><span><i className="online-dot" /> Online · here to listen</span></div></div><div className="chat-head-actions"><button className="icon-btn"><Copy size={16} /></button><button className="icon-btn"><MoreHorizontal size={17} /></button></div></div>
        <div className="chat-context"><Sparkles size={14} /><span>Supportive space · not a replacement for professional care</span><button><X size={13} /></button></div>
        <div className="messages" ref={scrollRef}>
          <div className="conversation-date"><span>Today, September 5</span></div>
          {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
          {thinking && <div className="message-row bot-row"><div className="message-avatar bot-avatar"><Bot size={14} /></div><div className="thinking-bubble"><span /><span /><span /></div></div>}
        </div>
        <form className="composer" onSubmit={sendMessage}><div className="composer-inner"><textarea ref={textareaRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(event) } }} placeholder="Share what&apos;s on your mind..." rows="1" /><div className="composer-tools"><span><LockKeyhole size={12} /> Private</span><span className="composer-hint">Shift + Enter for new line</span><button className="send-button" type="submit" disabled={!draft.trim() || streaming}><Send size={16} /></button></div></div></form>
      </section>
      <aside className="chat-insight-panel"><div className="eyebrow">Session notes</div><h3>A little context</h3><div className="insight-mood"><span className="mood-orb">🙂</span><div><small>Current check-in</small><strong>Feeling okay</strong></div><ChevronRight size={15} /></div><div className="insight-divider" /><div className="eyebrow">Suggested for you</div><Link to="/journal" className="suggestion-card"><span className="suggestion-icon lavender"><NotebookPen size={16} /></span><span><strong>Put it into words</strong><small>2 min reflection</small></span><ArrowUpRight size={14} /></Link><Link to="/music" className="suggestion-card"><span className="suggestion-icon green"><Headphones size={16} /></span><span><strong>Reset your nervous system</strong><small>12 min playlist</small></span><ArrowUpRight size={14} /></Link><div className="chat-disclaimer"><ShieldCheck size={15} /><p>If you&apos;re in immediate danger, contact local emergency services or a crisis helpline.</p></div></aside>
    </div>
  )
}

function MessageBubble({ message }) {
  return <div className={`message-row ${message.is_user ? 'user-row' : 'bot-row'}`}>{!message.is_user && <div className="message-avatar bot-avatar"><Bot size={14} /></div>}<div className="message-content"><div className={`message-bubble ${message.is_user ? 'user-bubble' : 'bot-bubble'}`}>{message.content}</div><small className="message-time">{message.is_user ? 'You' : 'CalmBot'} · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div></div>
}

function Journal({ user }) {
  const [entries, setEntries] = useState(journalSeed)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(null)
  const prompts = ['What made you smile today?', 'What would feel like enough for today?', 'Where did you notice a little ease?']

  useEffect(() => { apiFetch('/journal/entries').then((data) => Array.isArray(data) && setEntries(data)).catch(() => {}) }, [])
  const saveEntry = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const data = await apiFetch('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [] }) })
      setEntries((current) => [data, ...current])
    } catch {
      setEntries((current) => [{ id: `local-${Date.now()}`, title: content.split(' ').slice(0, 5).join(' '), content, mood, tags: ['today'], created_at: new Date().toISOString() }, ...current])
    }
    setContent('')
    setSaving(false)
  }

  return <div className="page"><PageHeader eyebrow="Reflect / journal" title="A place to come back to yourself." description="Notice what&apos;s here. You don&apos;t have to make it beautiful." action={<button className="button button-dark" onClick={() => document.querySelector('.journal-editor textarea')?.focus()}><Plus size={16} /> New entry</button>} /><div className="journal-layout"><section className="journal-editor bento-card"><div className="editor-top"><div className="chip chip-lilac"><NotebookPen size={13} /> New reflection</div><span className="autosave"><span className="status-dot" /> Autosaved</span></div><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start wherever feels easiest..." /><div className="editor-prompt"><Lightbulb size={15} /><span>{prompts[Math.floor((new Date().getDate() - 1) / 10) % prompts.length]}</span><button onClick={() => setContent((current) => `${current}${current ? '\n\n' : ''}${prompts[Math.floor(Math.random() * prompts.length)]} `)}><WandSparkles size={14} /> Use prompt</button></div><div className="editor-bottom"><div className="mood-select"><span>Mood</span>{['calm', 'okay', 'low', 'hopeful'].map((item) => <button key={item} className={mood === item ? 'active' : ''} onClick={() => setMood(item)}>{item}</button>)}</div><button className="button button-violet" onClick={saveEntry} disabled={!content.trim() || saving}>{saving ? 'Saving...' : 'Save entry'} <CornerDownLeft size={15} /></button></div></section><aside className="journal-side"><div className="bento-card insight-widget"><div className="card-heading"><div><div className="eyebrow">Your reflections</div><h3>A gentle pattern</h3></div><Sparkles size={17} /></div><div className="insight-graph"><div className="insight-bars"><span style={{ height: '35%' }} /><span style={{ height: '52%' }} /><span style={{ height: '44%' }} /><span style={{ height: '67%' }} /><span style={{ height: '58%' }} /><span style={{ height: '79%' }} /><span style={{ height: '73%' }} /></div><div className="chart-labels"><span>30 Aug</span><span>Today</span></div></div><p>You&apos;ve made space for yourself <strong>3 times</strong> this week.</p><Link className="text-button" to="/coins">See your progress <ArrowUpRight size={14} /></Link></div><div className="bento-card grounding-widget"><Wind size={20} /><h3>Need a softer landing?</h3><p>Take three slow breaths before you write. Nothing needs to be fixed here.</p><button className="text-button">Start breathing <Play size={13} fill="currentColor" /></button></div></aside></div><section className="entries-section"><SectionTitle icon={NotebookPen} action={<span className="count-label">{entries.length} entries</span>}>Recent reflections</SectionTitle><div className="entries-grid">{entries.map((entry) => <button className="entry-card" key={entry.id || entry._id} onClick={() => setSelected(entry)}><div className="entry-card-top"><span className={`mood-dot mood-${entry.mood || 'calm'}`} /><span>{new Date(entry.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span><MoreHorizontal size={15} /></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p><div className="entry-tags">{(entry.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div></button>)}</div></section>{selected && <Modal title={selected.title || 'Reflection'} onClose={() => setSelected(null)}><div className="entry-modal-date">{new Date(selected.created_at || Date.now()).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</div><p className="modal-entry-text">{selected.content}</p><div className="entry-modal-mood"><span className={`mood-dot mood-${selected.mood}`} /> Felt {selected.mood}</div></Modal>}</div>
}

function Books() {
  const [books, setBooks] = useState(bookSeed)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const search = async (event) => {
    event?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await apiFetch(`/books/search?q=${encodeURIComponent(query)}&max_results=10`)
      if (data.books?.length) setBooks(data.books)
    } catch {
      setBooks(bookSeed.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())))
    }
    setLoading(false)
  }
  return <div className="page"><PageHeader eyebrow="Explore / library" title="Books for the season you&apos;re in." description="A curated shelf for clarity, comfort, and becoming." action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library..." /><kbd>↵</kbd></form>} /><div className="book-feature bento-card"><div className="book-feature-copy"><div className="chip chip-peach"><Sparkles size={13} /> Based on your recent check-in</div><h2>For when your mind<br />needs <em>more room.</em></h2><p>“The mind is not a vessel to be filled but a fire to be kindled.”</p><span className="book-feature-author">— Plutarch</span><button className="button button-dark" onClick={() => setQuery('mindfulness')}>Explore mindful reads <ArrowUpRight size={16} /></button></div><div className="book-stack"><BookCover book={bookSeed[1]} large /><BookCover book={bookSeed[0]} /><BookCover book={bookSeed[3]} /></div></div><div className="library-toolbar"><SectionTitle icon={BookOpen}>Your shelf</SectionTitle><div className="filter-pills"><button className="active">For you</button><button>Mindfulness</button><button>Growth</button><button>Rest</button></div></div><div className="books-grid">{loading ? <div className="loading-state">Finding a few good pages...</div> : books.map((book) => <BookCard key={book.id} book={book} />)}</div></div>
}

function BookCover({ book, large = false }) { return <div className={`book-cover ${large ? 'large' : ''}`} style={{ backgroundImage: `linear-gradient(135deg, rgba(25,31,42,.05), rgba(25,31,42,.35)), url(${book.image_url})` }}><span>{book.title}</span></div> }
function BookCard({ book }) { return <article className="book-card"><BookCover book={book} /><div className="book-card-copy"><div className="book-category">{book.category || 'Wellness'}</div><h3>{book.title}</h3><p>{book.author}</p><div className="book-card-foot"><button className="icon-btn"><Plus size={15} /></button><button className="text-button">View details <ArrowUpRight size={13} /></button></div></div></article> }

function Music() {
  const [activeTrack, setActiveTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [songs, setSongs] = useState(musicSeed)
  useEffect(() => { apiFetch('/songs').then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 4).map((name, index) => ({ ...musicSeed[index % musicSeed.length], name }))) }).catch(() => {}) }, [])
  const track = songs[activeTrack] || musicSeed[0]
  return <div className="page"><PageHeader eyebrow="Explore / soundroom" title="Sound for your inner weather." description="Small doses of music, tuned to where you are." action={<button className="button button-outline"><Headphones size={16} /> Connect Spotify</button>} /><div className="music-layout"><section className="music-player bento-card" style={{ '--player-color': track.color }}><div className="music-player-top"><div className="chip chip-sage"><Music2 size={13} /> Now playing</div><button className="icon-btn"><MoreHorizontal size={17} /></button></div><div className="album-stage"><div className="vinyl"><div className="vinyl-label" /></div><img src={track.cover} alt="" /></div><div className="now-playing-copy"><div className="eyebrow">{track.mood}</div><h2>{track.name}</h2><p>{track.artist}</p></div><div className="music-progress"><div><span>1:24</span><span>4:18</span></div><div className="music-progress-bar"><span /></div></div><div className="player-controls"><button><ArrowUpRightIcon size={17} className="rotate-180" /></button><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? <span className="pause-symbol">Ⅱ</span> : <Play size={18} fill="currentColor" />}</button><button><ArrowUpRightIcon size={17} /></button></div></section><section className="playlist-panel"><div className="playlist-header"><div><div className="eyebrow">Curated for you</div><h2>The exhale playlist</h2></div><span className="track-count">{songs.length} tracks</span></div><p className="playlist-description">A soft landing for busy thoughts. Let the edges blur a little.</p><div className="track-list">{songs.map((song, index) => <button className={`track-row ${index === activeTrack ? 'active' : ''}`} key={`${song.name}-${index}`} onClick={() => { setActiveTrack(index); setPlaying(true) }}><span className="track-number">{index === activeTrack && playing ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><img src={song.cover} alt="" /><span className="track-info"><strong>{song.name}</strong><small>{song.artist}</small></span><span className="track-mood">{song.mood}</span><span className="track-time">4:{index === 0 ? '18' : '02'}</span><MoreHorizontal size={15} /></button>)}</div></section></div><div className="mood-sound-banner"><div className="sound-banner-icon"><Moon size={19} /></div><div><strong>Match your mood</strong><p>Tell us how you&apos;re feeling and we&apos;ll find the frequency.</p></div><button className="button button-dark">Check in <ArrowUpRight size={15} /></button></div></div>
}

function Therapists() {
  const [therapists, setTherapists] = useState(therapistSeed)
  useEffect(() => { apiFetch('/therapists').then((data) => Array.isArray(data) && data.length && setTherapists(data)).catch(() => {}) }, [])
  return <div className="page"><PageHeader eyebrow="Explore / care team" title="Support that meets you where you are." description="Licensed professionals, thoughtful matching, and no pressure to have it all figured out." action={<button className="button button-dark"><Search size={16} /> Find your match</button>} /><div className="care-note"><ShieldCheck size={18} /><div><strong>A safe, confidential space</strong><p>All practitioners are vetted and licensed in their area of practice.</p></div><span>Learn about safety <ArrowUpRight size={14} /></span></div><div className="therapist-toolbar"><SectionTitle icon={UsersRound}>Available now</SectionTitle><div className="filter-pills"><button className="active">All specialties</button><button>Video</button><button>Audio</button><button>Under $100</button></div></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist.id}><div className="therapist-card-top"><div className="therapist-avatar" style={{ backgroundColor: therapist.color }}>{therapist.initials || therapist.name?.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><button className="icon-btn"><MoreHorizontal size={17} /></button></div><div className="therapist-rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.9'} <span>·</span> 32 sessions</div><h3>{therapist.name}</h3><p>{therapist.specialty || 'Mental wellness support'}</p><div className="therapist-next"><span><i className="online-dot" /> Next available</span><strong>{therapist.next || 'This week'}</strong></div><button className="button button-outline full-button">View profile <ArrowUpRight size={15} /></button></article>)}</div></div>
}

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 126)
  const [transactions, setTransactions] = useState([{ amount: 10, source: 'Journal entry', description: 'A quieter kind of progress', timestamp: '2026-09-05T11:20:00Z', transaction_type: 'earn' }, { amount: 5, source: 'Daily check-in', description: 'Checked in with your mood', timestamp: '2026-09-05T09:01:00Z', transaction_type: 'earn' }, { amount: 15, source: 'Journal entry', description: 'Room to breathe', timestamp: '2026-09-04T08:40:00Z', transaction_type: 'earn' }, { amount: 50, source: 'Weekly streak', description: 'Four days of showing up', timestamp: '2026-09-03T18:10:00Z', transaction_type: 'earn' }])
  useEffect(() => { apiFetch('/coins/balance').then((data) => setBalance(data.balance)).catch(() => {}); apiFetch('/coins/transactions').then((data) => Array.isArray(data) && setTransactions(data)).catch(() => {}) }, [])
  const goals = [{ icon: MessageCircle, title: 'Chat with CalmBot', progress: 1, target: 1, coins: 5, done: true }, { icon: NotebookPen, title: 'Write in your journal', progress: 1, target: 1, coins: 10, done: true }, { icon: Heart, title: 'Complete mood check', progress: 0, target: 1, coins: 5, done: false }, { icon: BookOpen, title: 'Read a wellness page', progress: 0, target: 1, coins: 8, done: false }]
  return <div className="page"><PageHeader eyebrow="Your rewards" title="Calm Coins" description="A little encouragement for the work you&apos;re already doing." action={<button className="button button-outline"><CircleHelp size={16} /> How coins work</button>} /><div className="coins-top-grid"><section className="coin-balance-card bento-card"><div className="coin-orbit"><div className="coin-core"><Coins size={26} /></div><span>✦</span><span>✧</span></div><div><div className="eyebrow">Current balance</div><strong className="coin-balance">{balance}</strong><p>Calm Coins <span>·</span> +30 this month</p></div><div className="coin-card-foot"><span><TrendingUp size={14} /> You&apos;re in the top 24% this week</span><button className="button button-light">Redeem coins <ArrowUpRight size={14} /></button></div></section><div className="coin-stats"><StatCard label="Earned this month" value="+ 76" meta="up 18% from August" icon={ArrowUpRight} tone="sage" /><StatCard label="Current streak" value="4 days" meta="best: 12 days" icon={Flame} tone="peach" /></div></div><div className="coins-content-grid"><section><SectionTitle icon={Target}>Today&apos;s rituals</SectionTitle><div className="goal-list">{goals.map((goal) => { const Icon = goal.icon; return <div className={`goal-row ${goal.done ? 'goal-done' : ''}`} key={goal.title}><span className="goal-icon"><Icon size={16} /></span><div className="goal-copy"><strong>{goal.title}</strong><div className="goal-progress"><span style={{ width: `${goal.progress * 100}%` }} /></div><small>{goal.progress} / {goal.target} complete</small></div><span className="goal-coins"><Coins size={13} /> +{goal.coins}</span>{goal.done && <CheckCircle2 size={17} className="goal-check" />}</div> })}</div></section><section><SectionTitle icon={BarChart3}>Recent activity</SectionTitle><div className="transaction-list">{transactions.slice(0, 5).map((transaction, index) => <div className="transaction-row" key={`${transaction.description}-${index}`}><span className={`transaction-icon ${transaction.transaction_type === 'spend' ? 'spent' : ''}`}>{transaction.transaction_type === 'spend' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}</span><div><strong>{transaction.source || 'Wellness ritual'}</strong><small>{transaction.description}</small></div><span className={transaction.transaction_type === 'spend' ? 'amount-spent' : 'amount-earned'}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</span></div>)}</div></section></div><div className="coin-earn-banner"><div className="earn-banner-orb"><Sparkles size={20} /></div><div><strong>Every small act counts.</strong><p>Keep showing up for yourself. Your coins are a record of that care.</p></div><div className="earn-steps"><span><Check size={12} /> Journal</span><span><Check size={12} /> Reflect</span><span><Check size={12} /> Rest</span></div></div></div>
}

function Settings() {
  return <div className="page settings-page"><PageHeader eyebrow="System / preferences" title="Make it yours." description="Your space, your pace, your boundaries." /><div className="settings-layout"><div className="settings-nav"><button className="active"><UserRound size={16} /> Profile</button><button><Bell size={16} /> Notifications</button><button><ShieldCheck size={16} /> Privacy</button><button><Settings2 size={16} /> Preferences</button></div><section className="settings-card bento-card"><div className="settings-card-head"><div><h2>Profile</h2><p>How you show up in your calm space.</p></div><button className="button button-outline">Save changes</button></div><div className="profile-preview"><div className="large-avatar">A</div><div><strong>Alex Morgan</strong><p>alex@zenheaven.app</p><button className="text-button">Change avatar <ArrowUpRight size={13} /></button></div></div><label className="field-label">Display name<input defaultValue="Alex Morgan" /></label><label className="field-label">Email address<input defaultValue="alex@zenheaven.app" /></label><div className="settings-divider" /><div className="privacy-row"><div><strong>Private by default</strong><p>Your reflections and conversations are only visible to you.</p></div><div className="toggle on"><span /></div></div></section></div></div>
}

function Modal({ title, children, onClose }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={(event) => event.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={17} /></button></div>{children}</div></div> }

function AuthPage({ mode, login }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', full_name: '', password: '' })
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => { event.preventDefault(); setLoading(true); await login(form, isRegister); navigate('/dashboard'); setLoading(false) }
  return <div className="auth-page"><div className="auth-visual"><Logo /><div className="auth-visual-copy"><div className="chip chip-violet"><Sparkles size={13} /> A softer operating system</div><h1>Make space for<br /><em>what matters.</em></h1><p>ZenHeaven brings your reflections, support, and small rituals into one calm workspace.</p><div className="auth-quote"><span>“</span><p>The present moment is filled with joy and happiness. If you are attentive, you will see it.</p><small>— Thich Nhat Hanh</small></div></div><div className="auth-visual-footer"><span><ShieldCheck size={14} /> Private & secure</span><span><Heart size={14} /> Built with care</span></div></div><div className="auth-form-side"><div className="auth-form-wrap"><div className="auth-mobile-logo"><Logo compact /></div><div className="auth-form-head"><div className="eyebrow">{isRegister ? 'Start your space' : 'Welcome back'}</div><h2>{isRegister ? 'A little room for you.' : 'Good to see you again.'}</h2><p>{isRegister ? 'Create your private wellness workspace.' : 'Pick up where you left off.'}</p></div><form onSubmit={submit}>{isRegister && <label className="field-label">Your name<input required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} placeholder="Alex Morgan" /></label>}<label className="field-label">Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="alex" /></label>{isRegister && <label className="field-label">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>}<label className="field-label">Password<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" /></label>{!isRegister && <div className="form-options"><label><input type="checkbox" /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div>}<button className="button button-dark auth-submit" disabled={loading}>{loading ? 'Opening your space...' : isRegister ? 'Create my space' : 'Enter ZenHeaven'} <ArrowUpRight size={16} /></button></form><div className="auth-switch">{isRegister ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></div><div className="auth-note"><LockKeyhole size={13} /> Your data is encrypted and never sold.</div></div></div></div>
}

function ProtectedRoute({ user, children }) { return user ? children : <Navigate to="/login" replace /> }

function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  useEffect(() => { const openPalette = () => setOpen(true); window.addEventListener('zen-command', openPalette); return () => window.removeEventListener('zen-command', openPalette) }, [])
  if (!open) return null
  const commands = [{ label: 'Go to overview', icon: LayoutDashboard, to: '/dashboard' }, { label: 'Open CalmBot', icon: MessageCircle, to: '/chat' }, { label: 'Write in journal', icon: NotebookPen, to: '/journal' }, { label: 'Find a therapist', icon: UsersRound, to: '/therapists' }, { label: 'Open settings', icon: Settings2, to: '/settings' }]
  const visible = commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()))
  return <div className="modal-backdrop palette-backdrop" onClick={() => setOpen(false)}><div className="command-palette" onClick={(event) => event.stopPropagation()}><div className="palette-search"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Where would you like to go?" /><kbd>ESC</kbd></div><div className="palette-results">{visible.map((command) => { const Icon = command.icon; return <button key={command.to} onClick={() => { navigate(command.to); setOpen(false) }}><span><Icon size={16} /></span>{command.label}<ArrowUpRight size={14} /></button> })}</div><div className="palette-footer"><span><CornerDownLeft size={13} /> select</span><span><ChevronDown size={13} /><ChevronUp size={13} /> navigate</span><span><kbd>ESC</kbd> close</span></div></div></div>
}

function App() {
  const { user, login, logout } = useAuth()
  return <><Routes><Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" login={login} />} /><Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" login={login} />} /><Route path="*" element={<ProtectedRoute user={user}><AppShell user={user} logout={logout}><Routes><Route path="/dashboard" element={<Dashboard user={user} />} /><Route path="/chat" element={<Chat user={user} />} /><Route path="/journal" element={<Journal user={user} />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<CoinsPage user={user} />} /><Route path="/settings" element={<Settings />} /><Route path="/" element={<Navigate to="/dashboard" replace />} /></Routes></AppShell></ProtectedRoute>} /></Routes><CommandPalette /></>
}

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>)
