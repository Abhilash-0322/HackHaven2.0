import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Coins, Heart, Home, Leaf, Lightbulb, LogOut, Menu, MessageCircle, Mic, Moon, MoreHorizontal,
  Music2, Pause, Play, Plus, Search, Send, Settings, ShieldCheck, Sparkles, Star, Sun, Sunrise,
  Trash2, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import { api, demoUser, fallback, formatError, streamChat } from './api'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Calm chat', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Reading list', icon: BookOpen },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Find a therapist', icon: UsersRound },
]

function cn(...classes) { return classes.filter(Boolean).join(' ') }
function initials(name = 'Alex Morgan') { return name.split(' ').map((word) => word[0]).slice(0, 2).join('') }
function dateLabel(value) {
  if (!value) return 'Today'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}
function timeLabel(value) {
  if (!value) return '10:00 AM'
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function Button({ children, className = '', variant = 'dark', ...props }) {
  return <button className={cn('button', `button-${variant}`, className)} {...props}>{children}</button>
}

function Pill({ children, tone = 'neutral' }) {
  return <span className={cn('pill', `pill-${tone}`)}>{children}</span>
}

function IconButton({ children, className = '', ...props }) {
  return <button className={cn('icon-button', className)} {...props}>{children}</button>
}

function Ring({ value, color, size = 112, stroke = 9, children }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (Math.min(value, 100) / 100) * circumference
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="presentation">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e8ebe8" strokeWidth={stroke} />
        <circle className="ring-progress" cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={progress} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  )
}

function Avatar({ user, small = false }) {
  return <div className={cn('avatar', small && 'avatar-small')}>{initials(user?.full_name || user?.username)}</div>
}

function Logo({ light = false }) {
  return <Link to="/" className={cn('brand', light && 'brand-light')}><span className="brand-mark"><Leaf size={18} strokeWidth={2.5} /></span><span>zenheaven</span></Link>
}

function AppShell({ user, onLogout }) {
  const location = useLocation()
  const [mobileNav, setMobileNav] = useState(false)
  const current = navItems.find((item) => location.pathname.startsWith(item.to))
  return (
    <div className="app-shell">
      <aside className={cn('sidebar', mobileNav && 'sidebar-open')}>
        <div className="sidebar-top"><Logo /><IconButton className="mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></IconButton></div>
        <div className="workspace-label">YOUR SPACE</div>
        <nav className="main-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileNav(false)} className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></NavLink>
          ))}
        </nav>
        <div className="sidebar-section">
          <div className="workspace-label">SUPPORT</div>
          <NavLink to="/coins" onClick={() => setMobileNav(false)} className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}><Coins size={18} strokeWidth={1.8} /><span>Calm coins</span><span className="nav-count">284</span></NavLink>
          <button className="nav-link"><CircleHelp size={18} strokeWidth={1.8} /><span>Help center</span></button>
        </div>
        <div className="sidebar-bottom">
          <div className="mini-upgrade"><Sparkles size={18} /><div><strong>Make space for more</strong><span>Explore your insights</span></div><ChevronRight size={15} /></div>
          <div className="sidebar-user"><Avatar user={user} small /><div className="user-meta"><strong>{user?.full_name || user?.username || 'Alex Morgan'}</strong><span>Personal space</span></div><button aria-label="Sign out" onClick={onLogout}><LogOut size={16} /></button></div>
        </div>
      </aside>
      {mobileNav && <div className="mobile-backdrop" onClick={() => setMobileNav(false)} />}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><span>{current?.label || 'Welcome back'}</span></div>
          <div className="topbar-actions"><button className="topbar-date"><Sunrise size={16} /> Monday, 16 June <ChevronDown size={14} /></button><Avatar user={user} small /></div>
        </header>
        <div className="page-container"><Outlet /></div>
      </main>
    </div>
  )
}

function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav"><Logo /><div className="landing-links"><a href="#approach">Our approach</a><a href="#rituals">Rituals</a><Link to="/login">Sign in</Link><Link className="landing-cta" to="/register">Get started <ArrowRight size={16} /></Link></div></header>
      <section className="hero">
        <div className="hero-copy"><Pill tone="sage"><Sparkles size={13} /> your everyday wellbeing companion</Pill><h1>A little more <em>you,</em> every day.</h1><p>ZenHeaven brings your mental wellbeing into one calm, private space — with thoughtful tools that meet you exactly where you are.</p><div className="hero-actions"><Link className="button button-dark" to="/register">Begin your journey <ArrowRight size={17} /></Link><a className="text-link" href="#approach">See how it works <ChevronRight size={16} /></a></div><div className="hero-note"><div className="avatar-stack"><span className="stack-avatar stack-a">M</span><span className="stack-avatar stack-b">A</span><span className="stack-avatar stack-c">J</span></div><span>Made for the moments in between.</span></div></div>
        <div className="hero-art"><div className="art-glow" /><div className="hero-orb"><div className="orb-inner"><span>take a breath</span><strong>you are here</strong><small>and that is enough</small></div></div><div className="floating-card mood-float"><div className="float-icon float-yellow"><Sun size={17} /></div><div><span>Today's mood</span><strong>Hopeful</strong></div><ArrowUpRight size={16} /></div><div className="floating-card breath-float"><div className="float-icon float-blue"><Moon size={17} /></div><div><span>Evening ritual</span><strong>6 min to unwind</strong></div><Play size={15} fill="currentColor" /></div></div>
      </section>
      <section className="trust-row"><span>One gentle place for your</span><strong>mind</strong><strong>body</strong><strong>emotions</strong><strong>growth</strong></section>
      <section className="approach-section" id="approach"><div className="section-kicker">A softer system</div><h2>Wellbeing that feels like <em>coming home.</em></h2><p className="section-lede">The best care is the care you can return to. ZenHeaven turns small acts of self-awareness into a steady, supportive rhythm.</p><div className="feature-grid"><Feature icon={<MessageCircle />} number="01" title="Talk it out" text="A calm, always-on companion for the thoughts you do not know where to put." /><Feature icon={<BookOpen />} number="02" title="Make space" text="A private journal that helps you notice patterns and celebrate the small wins." /><Feature icon={<Heart />} number="03" title="Find your people" text="Thoughtful resources and trusted professionals, whenever you need a little more support." /></div></section>
      <section className="landing-quote" id="rituals"><div className="quote-mark">“</div><blockquote>We do not have to do all of it.<br /><em>We just have to begin.</em></blockquote><span>— the ZenHeaven principle</span><Link className="button button-light" to="/register">Find your beginning <ArrowRight size={16} /></Link></section>
      <footer className="landing-footer"><Logo /><span>© 2025 ZenHeaven</span><span>A quiet place to land.</span></footer>
    </div>
  )
}

function Feature({ icon, number, title, text }) {
  return <article className="feature-card"><div className="feature-top"><span className="feature-icon">{icon}</span><span>{number}</span></div><h3>{title}</h3><p>{text}</p><ArrowUpRight size={17} className="feature-arrow" /></article>
}

function AuthPage({ mode, onAuth }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState(isLogin ? { username: '', password: '' } : { username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const result = await (isLogin ? api.auth.login(form) : api.auth.register(form))
      localStorage.setItem('zenheaven_token', result.access_token)
      onAuth(result.user); navigate('/dashboard')
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        onAuth({ ...demoUser, username: form.username || demoUser.username, full_name: form.full_name || demoUser.full_name }); navigate('/dashboard')
      } else setError(formatError(err))
    } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-side"><Logo light /><div><Pill tone="dark">a quieter way forward</Pill><h1>There is room<br />for how you <em>feel.</em></h1><p>Start with one small moment of care. We will meet you there.</p></div><span className="auth-side-foot">Private by design. Human at heart.</span></div><div className="auth-form-wrap"><Link to="/" className="back-home"><ChevronRight size={15} className="back-icon" /> Back to zenheaven</Link><div className="auth-form"><div className="section-kicker">{isLogin ? 'Welcome back' : 'Begin gently'}</div><h2>{isLogin ? 'Good to see you.' : 'A calmer you starts here.'}</h2><p>{isLogin ? 'Pick up where you left off.' : 'Create your private space in less than a minute.'}</p><form onSubmit={submit}>{!isLogin && <label>What should we call you?<input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" /></label>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. alexmorgan" /></label>{!isLogin && <label>Email address<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>{error && <div className="form-error">{error}</div>}<Button type="submit" className="auth-submit" disabled={loading}>{loading ? 'One moment…' : isLogin ? 'Enter your space' : 'Create my space'} <ArrowRight size={17} /></Button></form><div className="auth-switch">{isLogin ? 'New to ZenHeaven?' : 'Already have a space?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></div><div className="privacy-note"><ShieldCheck size={15} /> Your data is private, secure and always yours.</div></div></div></div>
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><div className="section-kicker">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 284)
  const [journal, setJournal] = useState(fallback.journals)
  const [threads, setThreads] = useState(fallback.threads)
  useEffect(() => {
    if (!localStorage.getItem('zenheaven_token')) return
    Promise.allSettled([api.coins.balance(), api.journal.list(), api.threads.list()]).then(([coins, entries, chats]) => {
      if (coins.status === 'fulfilled') setBalance(coins.value.balance)
      if (entries.status === 'fulfilled') setJournal(entries.value)
      if (chats.status === 'fulfilled') setThreads(chats.value.threads || [])
    })
  }, [])
  return <div className="dashboard"><div className="greeting-row"><div><div className="eyebrow-with-dot"><span className="live-dot" /> Monday, June 16, 2025</div><h1>Good morning, {user?.full_name?.split(' ')[0] || 'Alex'} <span>✦</span></h1><p>How are you arriving in this moment?</p></div><Link to="/journal" className="quick-add"><Plus size={17} /> New journal entry</Link></div><div className="dashboard-grid"><section className="card checkin-card"><div className="card-heading"><div><span className="section-kicker">Daily check-in</span><h2>Check in with yourself.</h2></div><span className="date-chip">1 of 1</span></div><p className="card-muted">A moment of noticing can change the shape of your day.</p><div className="mood-row"><MoodButton emoji="😌" label="Calm" active /><MoodButton emoji="🙂" label="Good" /><MoodButton emoji="😐" label="Flat" /><MoodButton emoji="😟" label="Low" /><MoodButton emoji="😣" label="Hard" /></div><button className="subtle-link">Add a note <ArrowRight size={14} /></button></section><section className="card rings-card"><div className="card-heading"><div><span className="section-kicker">Your rhythm</span><h2>Today, in balance</h2></div><button className="more-button"><MoreHorizontal size={19} /></button></div><div className="rings-layout"><div className="rings-stack"><Ring value={72} color="#f06e4f" size={138} stroke={10}><strong>72%</strong><span>complete</span></Ring><Ring value={52} color="#6e91e8" size={110} stroke={8}><strong>3</strong><span>of 6</span></Ring><Ring value={35} color="#8bbf8d" size={82} stroke={7}><strong>12</strong><span>min</span></Ring></div><div className="ring-legend"><Legend color="#f06e4f" label="Mindful moments" value="3 / 4" /><Legend color="#6e91e8" label="Daily rituals" value="3 / 6" /><Legend color="#8bbf8d" label="Time for you" value="12 min" /></div></div></section><section className="card continue-card"><div className="card-heading"><div><span className="section-kicker">Pick up where you left off</span><h2>Continue your care</h2></div><Link to="/chat" className="circle-arrow"><ArrowUpRight size={17} /></Link></div><div className="continue-item"><div className="continue-icon coral"><MessageCircle size={19} /></div><div><strong>{threads[0]?.title || 'A softer start to the week'}</strong><span>{threads[0]?.last_message || 'Continue your conversation'}</span></div><ChevronRight size={17} /></div><div className="continue-item"><div className="continue-icon lavender"><BookOpen size={19} /></div><div><strong>{journal[0]?.title || 'A quiet morning'}</strong><span>Journaled {dateLabel(journal[0]?.created_at)}</span></div><ChevronRight size={17} /></div></section><section className="card coins-card"><div className="coin-orbit"><Coins size={23} /></div><div><span className="section-kicker">Calm coins</span><h2>{balance}</h2><p>Keep showing up for yourself.</p></div><Link to="/coins" className="subtle-link">View rewards <ArrowRight size={14} /></Link></section></div><div className="dashboard-lower"><section className="lower-feature"><div className="lower-image" /><div className="lower-copy"><Pill tone="cream"><Leaf size={13} /> for your nervous system</Pill><h2>Small steps still<br /><em>move you forward.</em></h2><p>Take six quiet minutes with a guided breathing practice designed to help you return to yourself.</p><Link to="/music" className="text-link">Explore soundscapes <ArrowRight size={15} /></Link></div></section><section className="quote-card"><span className="quote-label">A gentle reminder</span><div className="large-quote">“</div><blockquote>You are allowed to take up space in your own life.</blockquote><span className="quote-author">— ZenHeaven</span></section></div></div>
}

function MoodButton({ emoji, label, active }) { return <button className={cn('mood-button', active && 'mood-button-active')}><span>{emoji}</span><small>{label}</small></button> }
function Legend({ color, label, value }) { return <div className="legend-row"><span className="legend-dot" style={{ background: color }} /><span>{label}</span><strong>{value}</strong></div> }

function ChatPage({ user }) {
  const [threads, setThreads] = useState(fallback.threads)
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', is_user: false, content: 'Hi Alex. I’m here with you. What feels most present for you today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [thought, setThought] = useState('')
  const [mobileThreads, setMobileThreads] = useState(false)
  useEffect(() => { if (localStorage.getItem('zenheaven_token')) api.threads.list().then((result) => setThreads(result.threads || [])).catch(() => {}) }, [])
  async function chooseThread(thread) {
    setActiveThread(thread.id); setMobileThreads(false)
    if (localStorage.getItem('zenheaven_token')) {
      try { const result = await api.threads.get(thread.id); setMessages(result.messages || []) } catch { /* Keep local context. */ }
    }
  }
  function newThread() { setActiveThread(null); setMessages([{ id: 'welcome', is_user: false, content: 'Hi Alex. I’m here with you. What feels most present for you today?' }]); setMobileThreads(false) }
  async function sendMessage(event) {
    event?.preventDefault()
    const message = input.trim(); if (!message || thinking) return
    setInput(''); setThinking(true); setThought('Finding the right words…')
    setMessages((current) => [...current, { id: `user-${Date.now()}`, is_user: true, content: message }])
    if (!localStorage.getItem('zenheaven_token')) {
      setTimeout(() => { setMessages((current) => [...current, { id: `bot-${Date.now()}`, is_user: false, content: 'Thank you for sharing that. You do not have to carry everything at once. Let’s start with one small thing that would make the next ten minutes feel a little kinder.' }]); setThinking(false); setThought('') }, 850)
      return
    }
    let response = ''
    try {
      await streamChat(message, activeThread, { thread_id: (id) => setActiveThread(id), thinking: (value) => setThought(value), token: (value) => { response += value; setMessages((current) => { const last = current[current.length - 1]; if (last?.streaming) return [...current.slice(0, -1), { ...last, content: response }]; return [...current, { id: `stream-${Date.now()}`, is_user: false, content: response, streaming: true }] }) }, complete: (data) => { if (data?.thread_id) setActiveThread(data.thread_id) } })
    } catch (err) { setMessages((current) => [...current, { id: `error-${Date.now()}`, is_user: false, content: formatError(err) }]) } finally { setThinking(false); setThought('') }
  }
  return <div className="chat-layout"><aside className={cn('thread-panel', mobileThreads && 'thread-panel-open')}><div className="thread-header"><div><span className="section-kicker">Your conversations</span><h2>Calm chat</h2></div><IconButton onClick={() => setMobileThreads(false)} className="mobile-close"><X size={18} /></IconButton></div><Button variant="outline" className="new-thread" onClick={newThread}><Plus size={16} /> New conversation</Button><div className="thread-list">{threads.map((thread) => <button key={thread.id} className={cn('thread-item', thread.id === activeThread && 'thread-item-active')} onClick={() => chooseThread(thread)}><div className="thread-icon"><MessageCircle size={15} /></div><div><strong>{thread.title}</strong><span>{thread.last_message || 'A safe space to think out loud'}</span><small>{dateLabel(thread.updated_at)}</small></div></button>)}</div><div className="chat-safety"><ShieldCheck size={16} /><span>Your conversations are private and secure.</span></div></aside><div className="chat-main"><div className="chat-top"><button className="mobile-menu" onClick={() => setMobileThreads(true)}><Menu size={19} /></button><div><span className="section-kicker">A space to be honest</span><h1>{threads.find((thread) => thread.id === activeThread)?.title || 'A little room to breathe'}</h1></div><div className="chat-status"><span className="live-dot" /> CalmBot is here</div></div><div className="messages">{messages.map((message) => <div key={message.id} className={cn('message-row', message.is_user && 'message-user')}><div className={cn('message-avatar', message.is_user ? 'message-avatar-user' : 'message-avatar-bot')}>{message.is_user ? <Avatar user={user} small /> : <Leaf size={17} />}</div><div className={cn('message-bubble', message.is_user ? 'message-bubble-user' : 'message-bubble-bot')}><p>{message.content}</p>{!message.is_user && message.id === 'welcome' && <div className="suggestion-row"><button onClick={() => setInput('I feel a little overwhelmed')}>I feel overwhelmed</button><button onClick={() => setInput('Help me slow down')}>Help me slow down</button></div>}</div></div>)}{thinking && <div className="message-row"><div className="message-avatar message-avatar-bot"><Leaf size={17} /></div><div className="message-bubble message-bubble-bot thinking-bubble"><span className="typing-dots"><i /><i /><i /></span><small>{thought || 'Listening…'}</small></div></div>}</div><form className="chat-composer" onSubmit={sendMessage}><button type="button" className="composer-icon"><Mic size={18} /></button><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what is on your mind…" /><span className="composer-hint">Press ⌘ ↵</span><button type="submit" className="send-button" disabled={!input.trim() || thinking}><Send size={17} /></button></form><p className="chat-disclaimer">CalmBot offers support, not medical advice. If you are in immediate danger, please contact local emergency services.</p></div></div>
}

function JournalPage() {
  const [entries, setEntries] = useState(fallback.journals)
  const [prompts, setPrompts] = useState([])
  const [writing, setWriting] = useState(false)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saved, setSaved] = useState(false)
  useEffect(() => { if (localStorage.getItem('zenheaven_token')) { api.journal.list().then(setEntries).catch(() => {}); api.journal.prompts().then(setPrompts).catch(() => {}) } }, [])
  async function saveEntry(event) {
    event.preventDefault(); if (!content.trim()) return
    const entry = { content, mood, tags: ['reflection'] }
    try { const result = localStorage.getItem('zenheaven_token') ? await api.journal.create(entry) : { ...entry, _id: `local-${Date.now()}`, title: 'A moment to remember', created_at: new Date().toISOString() }; setEntries((current) => [result, ...current]); setContent(''); setWriting(false); setSaved(true); setTimeout(() => setSaved(false), 2800) } catch { setSaved(false) }
  }
  const prompt = prompts[0]?.prompt || 'What would feel like a small kindness to yourself today?'
  return <div className="journal-page"><PageHeader eyebrow="Your private reflection" title="Make a little space." description="Nothing to perform. Just a place to notice what is here." action={<Button onClick={() => setWriting(true)}><Plus size={17} /> New entry</Button>} />{saved && <div className="success-toast"><Check size={16} /> Your reflection is saved.</div>}<div className="journal-grid"><section className={cn('journal-write card', writing && 'journal-write-active')}><div className="journal-cover"><span className="journal-cover-word">today</span><span className="journal-cover-sub">a place to notice</span><Leaf size={42} strokeWidth={1.1} /></div>{writing ? <form className="journal-editor" onSubmit={saveEntry}><div className="editor-top"><span className="section-kicker">June 16, 2025</span><button type="button" onClick={() => setWriting(false)}><X size={18} /></button></div><h2>{prompt}</h2><textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start wherever you are…" /><div className="mood-select"><span>How are you feeling?</span><div>{['calm', 'hopeful', 'good', 'low', 'anxious'].map((item) => <button type="button" key={item} onClick={() => setMood(item)} className={cn(mood === item && 'mood-chip-active')}>{item}</button>)}</div></div><Button type="submit" disabled={!content.trim()}>Save reflection <ArrowRight size={16} /></Button></form> : <div className="journal-invite"><span className="section-kicker">The daily page</span><h2>What is asking<br /><em>to be noticed?</em></h2><p>{prompt}</p><Button onClick={() => setWriting(true)}>Begin writing <ArrowRight size={16} /></Button></div>}</section><section className="journal-side"><div className="card prompt-card"><span className="section-kicker">A thought for today</span><Lightbulb size={20} className="prompt-bulb" /><p>“You do not need a perfect plan. You only need a place to begin.”</p><span className="prompt-caption">A ZenHeaven original</span></div><div className="card streak-card"><div><span className="section-kicker">Your reflection rhythm</span><h2>4 days <em>in a row</em></h2></div><div className="week-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`} className={cn('week-day', index < 4 && 'week-day-done')}><span>{day}</span><i>{index < 4 ? <Check size={12} /> : ''}</i></div>)}</div></div></section></div><div className="entries-heading"><div><span className="section-kicker">Your pages</span><h2>Recent reflections</h2></div><button className="subtle-link">View all <ArrowRight size={14} /></button></div><div className="entry-grid">{entries.slice(0, 3).map((entry, index) => <article className="entry-card" key={entry._id || entry.id}><div className={cn('entry-color', `entry-color-${index}`)}><span>{dateLabel(entry.created_at)}</span><BookOpen size={18} /></div><div className="entry-content"><div className="entry-meta"><Pill tone={entry.mood === 'calm' ? 'sage' : 'lavender'}>{entry.mood || 'reflection'}</Pill><span>{timeLabel(entry.created_at)}</span></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p><div className="entry-footer"><span>{(entry.tags || ['reflection']).map((tag) => `#${tag}`).join('  ')}</span><button><MoreHorizontal size={17} /></button></div></div></article>)}</div></div>
}

function BooksPage() {
  const [books, setBooks] = useState(fallback.books)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('Your calm')
  const [loading, setLoading] = useState(false)
  async function search(event) { event.preventDefault(); if (!query.trim()) return; setLoading(true); try { const result = await api.books.search(query); setBooks(result.books?.length ? result.books : fallback.books) } catch { setBooks(fallback.books) } finally { setLoading(false) } }
  return <div className="library-page"><PageHeader eyebrow="Read, reflect, return" title="Books for your becoming." description="A thoughtful shelf for wherever your mind is today." action={<form className="search-box" onSubmit={search}><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the library" /><button type="submit"><ArrowRight size={16} /></button></form>} /><div className="mood-filter"><span>Showing books for</span>{['Your calm', 'Feeling stuck', 'A fresh start', 'Deep rest'].map((item) => <button key={item} onClick={() => setMood(item)} className={cn(mood === item && 'filter-active')}>{item}</button>)}</div><section className="featured-book card"><div className="featured-cover"><img src={books[0]?.image_url} alt="" /><span>editor’s pick</span></div><div className="featured-details"><Pill tone="cream"><Sparkles size={13} /> chosen for {mood.toLowerCase()}</Pill><h2>{books[0]?.title}</h2><h4>by {books[0]?.author}</h4><p>{books[0]?.description}</p><div className="book-actions"><Button onClick={() => {}}>Save to reading list <Plus size={16} /></Button><button className="text-link">View details <ArrowRight size={15} /></button></div></div><div className="featured-note"><span className="section-kicker">Why this one</span><p>“A gentle reminder that rest is not a pause from life — it is part of it.”</p></div></section><div className="library-heading"><div><span className="section-kicker">A few more for you</span><h2>Curated for this season</h2></div><button className="subtle-link">See all <ArrowRight size={14} /></button></div><div className="book-grid">{books.slice(1).map((book) => <article className="book-card" key={book.id}><div className="book-cover"><img src={book.image_url} alt="" /><button><Plus size={16} /></button></div><div className="book-info"><h3>{book.title}</h3><span>{book.author}</span><p>{book.description}</p></div></article>)}</div>{loading && <div className="loading-overlay"><span className="loader" /> Finding a thoughtful match…</div>}</div>
}

function MusicPage() {
  const [songs, setSongs] = useState(fallback.songs)
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  useEffect(() => { if (localStorage.getItem('zenheaven_token')) api.music.songs().then((data) => setSongs(data.songs?.slice(0, 12) || fallback.songs)).catch(() => {}) }, [])
  async function recommend(song) { setSelected(songs.indexOf(song)); try { const data = await api.music.recommend(song); setRecommendations(data.recommendations || []) } catch { setRecommendations([]) } }
  return <div className="music-page"><PageHeader eyebrow="Sound for your inner weather" title="Find your frequency." description="A softer soundtrack for the way you want to feel." action={<Pill tone="sage"><span className="live-dot" /> Mood-aware listening</Pill>} /><section className="music-hero"><div className="music-hero-copy"><span className="section-kicker">Your current atmosphere</span><h2>Make room for<br /><em>something lighter.</em></h2><p>Curated for a clear mind and an unhurried afternoon.</p><button className="player-button" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />} {playing ? 'Pause the mix' : 'Play the mix'}</button></div><div className="vinyl-art"><div className="vinyl"><div className="vinyl-label"><Leaf size={19} /></div></div><div className="music-wave">{[1, 2, 3, 4, 5, 6, 7].map((item) => <i key={item} style={{ height: `${18 + ((item * 17) % 33)}px` }} />)}</div></div></section><div className="music-columns"><section className="music-list-card card"><div className="card-heading"><div><span className="section-kicker">Good for a reset</span><h2>Today’s soundscape</h2></div><button className="more-button"><MoreHorizontal size={19} /></button></div><div className="song-list">{songs.slice(0, 6).map((song, index) => <button className={cn('song-row', selected === index && 'song-row-active')} key={song} onClick={() => recommend(song)}><span className="song-index">{selected === index && playing ? <Pause size={14} fill="currentColor" /> : `0${index + 1}`}</span><span className="song-cover" style={{ background: `linear-gradient(135deg, hsl(${30 + index * 38} 65% 78%), hsl(${180 + index * 25} 43% 68%))` }}>{index === 0 && <Leaf size={15} />}</span><span className="song-name"><strong>{song}</strong><small>{['Soft focus', 'Open skies', 'A slow exhale', 'Golden hour', 'Rest & restore', 'Quiet joy'][index]}</small></span><span className="song-time">{['3:48', '4:12', '5:03', '3:34', '4:27', '6:01'][index]}</span><Play size={14} className="song-play" /></button>)}</div></section><section className="music-aside"><div className="card now-playing"><span className="section-kicker">Now playing</span><div className="now-art"><div className="mini-vinyl" /></div><h3>{songs[selected]}</h3><p>ZenHeaven studio · mindful mix</p><div className="progress"><span /></div><div className="player-controls"><span>1:24</span><button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><span>3:48</span></div></div><div className="card music-tip"><Lightbulb size={19} /><div><span className="section-kicker">Try this</span><p>Put on your headphones, close your eyes, and notice three sounds around you.</p></div></div></section></div></div>
}

function TherapistsPage({ user }) {
  const [therapists, setTherapists] = useState(fallback.therapists)
  const [selected, setSelected] = useState(null)
  const [specialty, setSpecialty] = useState('All specialties')
  useEffect(() => { if (localStorage.getItem('zenheaven_token')) api.therapists.list().then((data) => setTherapists(data.length ? data : fallback.therapists)).catch(() => {}) }, [])
  const filtered = specialty === 'All specialties' ? therapists : therapists.filter((person) => person.specializations?.some((item) => item.toLowerCase().includes(specialty.toLowerCase())))
  return <div className="therapists-page"><PageHeader eyebrow="Support that meets you" title="Find your person." description="Licensed professionals, thoughtfully matched to the things you are carrying." action={<div className="therapist-trust"><ShieldCheck size={17} /><span>Verified professionals</span></div>} /><div className="therapist-controls"><div className="specialty-tabs">{['All specialties', 'Anxiety', 'Relationships', 'Life transitions'].map((item) => <button key={item} className={cn(specialty === item && 'filter-active')} onClick={() => setSpecialty(item)}>{item}</button>)}</div><button className="sort-button">Recommended <ChevronDown size={15} /></button></div><div className="therapist-grid">{filtered.map((person) => <article className="therapist-card" key={person._id}><div className="therapist-photo"><img src={person.photo_url} alt="" /><span className="online-dot" /></div><div className="therapist-card-body"><div className="therapist-rating"><Star size={13} fill="currentColor" /> {person.rating || '4.8'} <span>· {person.experience_years} years practice</span></div><h3>{person.name}</h3><p>{person.bio}</p><div className="specialty-pills">{(person.specializations || []).slice(0, 3).map((item) => <Pill key={item} tone="neutral">{item}</Pill>)}</div><div className="therapist-card-footer"><span>from <strong>${person.hourly_rate}</strong> / session</span><Button variant="outline" onClick={() => setSelected(person)}>View profile <ArrowRight size={15} /></Button></div></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="therapist-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-profile"><img src={selected.photo_url} alt="" /><div><Pill tone="sage"><span className="online-dot-inline" /> Available this week</Pill><h2>{selected.name}</h2><p>{selected.education || 'Licensed mental health professional'}</p></div></div><p className="modal-bio">{selected.bio}</p><div className="modal-details"><div><span>Specialties</span><strong>{selected.specializations?.join(' · ')}</strong></div><div><span>Languages</span><strong>{selected.languages?.join(' · ')}</strong></div></div><Button className="full-button" onClick={() => setSelected(null)}>Choose a time <CalendarDays size={16} /></Button><small className="modal-note">You can change your mind anytime.</small></div></div>}</div>
}

function CoinsPage() {
  const [balance, setBalance] = useState(284)
  const [transactions, setTransactions] = useState([])
  const [streak, setStreak] = useState(4)
  const goals = [{ title: 'Check in with yourself', icon: Heart, current: 1, target: 1, coins: 10, done: true }, { title: 'Write in your journal', icon: BookOpen, current: 0, target: 1, coins: 15 }, { title: 'Take a mindful pause', icon: Leaf, current: 0, target: 1, coins: 5 }, { title: 'Talk it out', icon: MessageCircle, current: 0, target: 1, coins: 10 }]
  useEffect(() => { if (localStorage.getItem('zenheaven_token')) Promise.allSettled([api.coins.balance(), api.coins.transactions(), api.coins.streak()]).then(([b, t, s]) => { if (b.status === 'fulfilled') setBalance(b.value.balance); if (t.status === 'fulfilled') setTransactions(t.value); if (s.status === 'fulfilled') setStreak(s.value.current_streak) }) }, [])
  return <div className="coins-page"><PageHeader eyebrow="A little encouragement" title="Your calm counts." description="Every small act of care adds up. Calm coins are a gentle way to notice your progress." action={<div className="balance-pill"><Coins size={17} /> <strong>{balance}</strong> coins</div>} /><div className="coins-grid"><section className="coin-balance-card"><div className="coin-sparkle"><Sparkles size={22} /></div><span className="section-kicker">Current balance</span><strong>{balance}</strong><p>coins to spend on deeper support</p><div className="coin-card-footer"><span><Zap size={14} /> {streak} day reflection streak</span><Link to="/journal">Keep going <ArrowRight size={14} /></Link></div></section><section className="card goals-card"><div className="card-heading"><div><span className="section-kicker">Today’s gentle goals</span><h2>Show up for you</h2></div><Pill tone="sage">+40 possible</Pill></div><div className="goal-list">{goals.map(({ title, icon: Icon, current, target, coins, done }) => <div className="goal-row" key={title}><div className={cn('goal-icon', done && 'goal-icon-done')}><Icon size={17} /></div><div className="goal-info"><strong>{title}</strong><div className="goal-progress"><span style={{ width: `${done ? 100 : 8}%` }} /></div></div><span className={cn('goal-coins', done && 'goal-coins-done')}>{done ? <Check size={14} /> : `+${coins}`}</span></div>)}</div></section></div><section className="rewards-section"><div className="entries-heading"><div><span className="section-kicker">Spend your calm</span><h2>Thoughtful rewards</h2></div><button className="subtle-link">See exchange rates <ArrowRight size={14} /></button></div><div className="reward-grid"><Reward icon={<Sparkles />} title="Personalized insights" text="A deeper look at your wellbeing patterns." cost="100" /><Reward icon={<Moon />} title="Custom meditation" text="A guided practice made for your moment." cost="150" /><Reward icon={<UsersRound />} title="Therapist session" text="One hour with a trusted professional." cost="500" /></div></section><section className="transactions-section"><div className="entries-heading"><div><span className="section-kicker">Your journey, in numbers</span><h2>Recent activity</h2></div></div><div className="transaction-list">{(transactions.length ? transactions : [{ description: 'Welcome to ZenHeaven', source: 'welcome bonus', amount: 100, transaction_type: 'earn' }, { description: 'Completed daily check-in', source: 'daily ritual', amount: 10, transaction_type: 'earn' }, { description: 'Started your journey', source: 'first steps', amount: 50, transaction_type: 'earn' }]).map((item, index) => <div className="transaction-row" key={item._id || index}><div className="transaction-icon"><Coins size={16} /></div><div><strong>{item.description}</strong><span>{item.source}</span></div><strong className={item.transaction_type === 'spend' ? 'spent' : 'earned'}>{item.transaction_type === 'spend' ? '-' : '+'}{item.amount}</strong></div>)}</div></section></div>
}
function Reward({ icon, title, text, cost }) { return <article className="reward-card"><div className="reward-icon">{icon}</div><h3>{title}</h3><p>{text}</p><button>{cost} <Coins size={14} /></button></article> }

function NotFound() { return <div className="not-found"><Leaf size={32} /><h1>A quiet little detour.</h1><p>That page is not here, but your next moment can be.</p><Link className="button button-dark" to="/dashboard">Return home</Link></div> }

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('zenheaven_user')) || null } catch { return null } })
  function onAuth(nextUser) { const next = nextUser || demoUser; setUser(next); localStorage.setItem('zenheaven_user', JSON.stringify(next)) }
  function onLogout() { localStorage.removeItem('zenheaven_token'); localStorage.removeItem('zenheaven_user'); setUser(null) }
  const currentUser = user || demoUser
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage mode="login" onAuth={onAuth} />} /><Route path="/register" element={<AuthPage mode="register" onAuth={onAuth} />} /><Route element={<AppShell user={currentUser} onLogout={onLogout} />}><Route path="/dashboard" element={<Dashboard user={currentUser} />} /><Route path="/chat" element={<ChatPage user={currentUser} />} /><Route path="/journal" element={<JournalPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/music" element={<MusicPage />} /><Route path="/therapists" element={<TherapistsPage user={currentUser} />} /><Route path="/coins" element={<CoinsPage />} /></Route><Route path="*" element={<NotFound />} /></Routes>
}
