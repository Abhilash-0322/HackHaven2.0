import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Award, BookHeart, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleHelp,
  Coins, Compass, Heart, Home, Library, Link2, LoaderCircle, LockKeyhole, LogOut, Menu, MessageCircle,
  Music2, Play, Plus, Search, Send, Sparkles, Star, Stethoscope, Sun, Trash2, TrendingUp,
  UserRound, UsersRound, Wallet, X, Zap,
} from 'lucide-react'
import { api, streamChat } from './api'
import { useAuth } from './main'

const fallbackBooks = [
  { id: '1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', description: 'A gentle invitation to pause, notice, and find peace in a noisy world.' },
  { id: '2', title: 'Maybe You Should Talk to Someone', author: 'Lori Gottlieb', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', description: 'A warm and honest look at what it means to be human and seek help.' },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', description: 'Tiny changes, remarkable results, and a kinder way to build a life you love.' },
]
const fallbackTherapists = [
  { _id: '1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Stress Management'], experience_years: 12, bio: 'CBT and mindfulness specialist helping you build practical tools for steadier days.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247, photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300' },
  { _id: '2', name: 'Maya Rodriguez, LMFT', specializations: ['Self-Esteem', 'Life Transitions'], experience_years: 8, bio: 'A compassionate partner for reconnecting with yourself and your relationships.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654, photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300' },
  { _id: '3', name: 'Dr. Michael Chen', specializations: ['Trauma', 'Family Therapy'], experience_years: 15, bio: 'Evidence-based support for processing difficult experiences at your own pace.', hourly_rate: 135, languages: ['English', 'Mandarin'], rating: 4.7, total_sessions: 892, photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300' },
]

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'CalmBot', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Reading room', icon: Library },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Therapists', icon: Stethoscope },
]

function Logo({ light = false }) {
  return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`}><span className="logo-mark"><Sparkles size={16} /></span><span>zenheaven</span></Link>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function WalletConnectButton({ compact = false }) {
  const [wallet, setWallet] = useState(() => localStorage.getItem('zenheaven_wallet') || '')
  const connect = () => {
    const nextWallet = wallet ? '' : '0x7f3a...c91d'
    setWallet(nextWallet)
    if (nextWallet) localStorage.setItem('zenheaven_wallet', nextWallet)
    else localStorage.removeItem('zenheaven_wallet')
  }
  return <button className={`wallet-connect ${compact ? 'wallet-compact' : ''} ${wallet ? 'wallet-connected' : ''}`} onClick={connect}><Wallet size={compact ? 15 : 16} /><span>{wallet || 'Connect wallet'}</span>{wallet && <Link2 size={13} />}</button>
}

function Toast({ message, onClose }) {
  if (!message) return null
  return <div className="toast"><Check size={16} />{message}<button onClick={onClose}><X size={15} /></button></div>
}

function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav"><Logo /><div className="landing-links"><a href="#how-it-works">How it works</a><a href="#tools">Your toolkit</a><WalletConnectButton compact /><Link to="/login">Sign in</Link><Link className="button button-primary" to="/register">Begin gently <ArrowRight size={16} /></Link></div></nav>
      <main>
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot" /> A softer place to land</div><h1>Own your<br /><em>better days.</em></h1><p>ZenHeaven brings your mental wellness toolkit into one quiet, caring space — with a private wallet for the rituals you choose to keep.</p><div className="hero-actions"><Link to="/register" className="button button-primary button-lg">Start your journey <ArrowRight size={18} /></Link><WalletConnectButton /><a className="text-link" href="#how-it-works">Explore the space <ChevronRight size={16} /></a></div><div className="hero-note"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span></div><span>Join a community choosing gentler growth</span></div></div>
          <div className="hero-art"><div className="sun-glow" /><div className="hero-orb orb-one" /><div className="hero-orb orb-two" /><div className="hero-card quote-card"><Wallet size={18} /><p>Your calm, your keys, your pace.</p><span>— a private ritual layer</span></div><div className="hero-card mood-card"><span className="mood-icon"><Sun size={22} /></span><div><small>Today’s check-in</small><strong>A little hopeful</strong></div><ChevronRight size={18} /></div><div className="art-label">breathe in <span>•</span> breathe out</div></div>
        </section>
        <section className="trusted"><span>Thoughtfully designed for your whole self</span><div><span><Heart size={15} /> self-aware</span><span><LockKeyhole size={15} /> private by default</span><span><Wallet size={15} /> wallet-ready</span></div></section>
        <section className="landing-section" id="how-it-works"><div className="section-heading centered"><span className="eyebrow">Your everyday support system</span><h2>Small rituals.<br /><em>Real shifts.</em></h2><p>There’s no right way to feel better. Pick what feels useful today.</p></div><div className="feature-grid"><FeatureCard icon={MessageCircle} title="Talk it out" text="A calm, always-on conversation to help you untangle thoughts and find your next step." color="purple" to="/chat" /><FeatureCard icon={BookOpen} title="Write it down" text="A private journal for the things you want to remember, release, or understand." color="peach" to="/journal" /><FeatureCard icon={Music2} title="Set the mood" text="Personalized soundscapes and songs to meet you exactly where you are." color="blue" to="/music" /></div></section>
        <section className="landing-quote"><div className="quote-symbol">“</div><blockquote>Healing isn’t linear.<br /><em>It’s a practice of returning.</em></blockquote><p>Come as you are. Leave with a little more space inside.</p><Link to="/register" className="button button-light">Find your space <ArrowRight size={16} /></Link></section>
        <section className="landing-section" id="tools"><div className="section-heading"><span className="eyebrow">Everything in one place</span><h2>Your care,<br /><em>your rhythm.</em></h2></div><div className="tool-strip"><ToolItem icon={BookHeart} text="Books that meet your mood" /><ToolItem icon={UsersRound} text="Therapists you can trust" /><ToolItem icon={Coins} text="Rewards for showing up" /></div></section>
      </main>
      <footer className="landing-footer"><Logo light /><span>© 2025 ZenHeaven. A softer way forward.</span><div><a href="#how-it-works">About</a><a href="#tools">Privacy</a></div></footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text, color, to }) {
  return <Link to={to} className={`feature-card feature-${color}`}><span className="feature-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p><span className="circle-arrow"><ArrowRight size={16} /></span></Link>
}
function ToolItem({ icon: Icon, text }) { return <div className="tool-item"><span><Icon size={21} /></span><strong>{text}</strong><ChevronRight size={17} /></div> }

function AuthPage({ mode }) {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (user) navigate('/dashboard', { replace: true }) }, [user, navigate])
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true)
    try { signIn(isRegister ? await api.register(form) : await api.login({ username: form.username, password: form.password })); navigate('/dashboard') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-visual"><Logo light /><div className="auth-visual-copy"><span className="eyebrow">A softer way forward</span><h1>There is space<br /><em>for you here.</em></h1><p>Take a breath. You’re in a judgment-free zone built for the real, unfinished, everyday work of feeling better.</p><div className="auth-stars"><Sparkles size={15} /> Made with care for your whole self</div></div><div className="auth-visual-shape shape-a" /><div className="auth-visual-shape shape-b" /></div><div className="auth-form-wrap"><div className="auth-form"><div className="mobile-logo"><Logo /></div><span className="eyebrow">{isRegister ? 'Begin your journey' : 'Welcome back'}</span><h2>{isRegister ? 'Create your safe space.' : 'Good to see you again.'}</h2><p className="form-intro">{isRegister ? 'A few details, then we’ll take it one gentle step at a time.' : 'Your space is ready when you are.'}</p>{error && <div className="error-banner">{error}</div>}<form onSubmit={submit}>{isRegister && <label>What should we call you?<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name (optional)" /></label>}<label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Choose a username" autoComplete="username" /></label>{isRegister && <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={isRegister ? 'At least 6 characters' : 'Your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label><Button type="submit" className="full-width" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18} /> : isRegister ? 'Create my space' : 'Enter ZenHeaven'} <ArrowRight size={17} /></Button></form><p className="switch-auth">{isRegister ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p><span className="privacy-note"><LockKeyhole size={13} /> Your personal space is private and secure.</span></div></div></div>
}

function Layout() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navTitle = navItems.find((item) => location.pathname === item.to)?.label || 'Overview'
  return <div className="app-shell"><aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}><div className="sidebar-top"><Logo /><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={20} /></button></div><div className="sidebar-profile"><div className="profile-avatar">{(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}</div><div><strong>{user?.full_name || user?.username || 'Friend'}</strong><span>your space</span></div><ChevronRight size={15} /></div><nav className="main-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label}</span>{label === 'CalmBot' && <span className="nav-new">AI</span>}</NavLink>)}<div className="nav-divider" /><NavLink to="/coins" onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'active coins-nav' : 'coins-nav'}><Coins size={18} /><span>Calm Coins</span><span className="coin-pip">✦</span></NavLink></nav><div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={15} /><p><strong>Take a pause.</strong><br />You’re doing better than you think.</p></div><button className="logout-button" onClick={signOut}><LogOut size={16} /> Sign out</button></div></aside><div className="app-main"><header className="app-header"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div><span className="header-kicker">YOUR WELLNESS SPACE</span><h1>{navTitle}</h1></div><div className="header-actions"><Link className="header-coin" to="/coins"><Coins size={16} /><span>Calm Coins</span><strong>{user?.calm_coins ?? '—'}</strong></Link><button className="header-help"><CircleHelp size={20} /></button></div></header><main className="content"><Outlet /></main></div></div>
}

function SectionHeader({ eyebrow, title, subtitle, action }) { return <div className="section-header"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function EmptyState({ icon: Icon = Sparkles, title, text, action }) { return <div className="empty-state"><span><Icon size={25} /></span><h3>{title}</h3><p>{text}</p>{action}</div> }
function Metric({ icon: Icon, label, value, trend, tone = 'purple' }) { return <div className={`metric-card metric-${tone}`}><span className="metric-icon"><Icon size={19} /></span><span className="metric-label">{label}</span><strong>{value}</strong>{trend && <small><TrendingUp size={13} /> {trend}</small>}</div> }

function Dashboard() {
  const { user } = useAuth()
  const [journals, setJournals] = useState([])
  const [threads, setThreads] = useState([])
  const [balance, setBalance] = useState(user?.calm_coins ?? 0)
  useEffect(() => { Promise.all([api.journals().catch(() => []), api.threads().catch(() => ({ threads: [] })), api.balance().catch(() => ({ balance: user?.calm_coins ?? 0 }))]).then(([j, t, b]) => { setJournals(Array.isArray(j) ? j : []); setThreads(t.threads || []); setBalance(b.balance) }) }, [user])
  const firstName = (user?.full_name || user?.username || 'friend').split(' ')[0]
  return <div className="dashboard-page"><div className="welcome-banner"><div><span className="eyebrow">SATURDAY, SEPTEMBER 5</span><h2>Good evening, {firstName}. <span>✦</span></h2><p>What would feel supportive right now?</p></div><div className="welcome-art"><div className="mini-sun"><Sun size={30} /></div><span>you’re allowed<br />to take it slow</span></div></div><div className="metric-grid"><Metric icon={Heart} label="Current feeling" value="Open to check-in" trend="Make space" tone="peach" /><Metric icon={MessageCircle} label="Conversations" value={threads.length} trend="Your reflections" tone="blue" /><Metric icon={BookOpen} label="Journal entries" value={journals.length} trend="Keep showing up" tone="lavender" /><Metric icon={Coins} label="Calm Coins" value={balance} trend="Keep growing" tone="gold" /></div><div className="dashboard-grid"><section className="panel checkin-panel"><div className="panel-heading"><div><span className="eyebrow">A MOMENT FOR YOU</span><h3>How are you arriving today?</h3></div><span className="panel-spark"><Sparkles size={17} /></span></div><p className="panel-muted">No need to overthink it. Choose the feeling that’s closest.</p><div className="mood-row"><MoodButton emoji="☀️" label="Bright" /><MoodButton emoji="🌿" label="Calm" /><MoodButton emoji="🌧️" label="Heavy" /><MoodButton emoji="🌊" label="Restless" /><MoodButton emoji="✨" label="Hopeful" /></div><Link className="soft-link" to="/journal">Write a little more <ArrowRight size={15} /></Link></section><section className="panel today-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR NEXT STEP</span><h3>Make it a gentle one</h3></div><span className="round-icon"><Zap size={17} /></span></div><div className="next-step"><span className="next-step-icon"><MessageCircle size={20} /></span><div><strong>Talk with CalmBot</strong><p>Untangle a thought in a safe space.</p></div><Link to="/chat"><ArrowRight size={17} /></Link></div><div className="next-step"><span className="next-step-icon next-peach"><BookHeart size={20} /></span><div><strong>Find a book for today</strong><p>Something comforting, curated for you.</p></div><Link to="/books"><ArrowRight size={17} /></Link></div><div className="next-step"><span className="next-step-icon next-gold"><Music2 size={20} /></span><div><strong>Set a soundscape</strong><p>Let the right song meet you there.</p></div><Link to="/music"><ArrowRight size={17} /></Link></div></section></div><div className="bottom-grid"><section className="panel mini-journal"><div className="panel-heading"><div><span className="eyebrow">YOUR REFLECTIONS</span><h3>Recent journal</h3></div><Link className="soft-link" to="/journal">See all <ArrowRight size={14} /></Link></div>{journals.slice(0, 2).map((entry) => <div className="journal-preview" key={entry._id || entry.id}><span className="journal-date">{formatDate(entry.created_at)}</span><strong>{entry.title || 'A quiet reflection'}</strong><p>{entry.content}</p></div>)}{!journals.length && <p className="empty-inline">Your first reflection is waiting for you.</p>}</section><section className="panel quote-panel"><span className="quote-mark">“</span><p>Almost everything will work again if you unplug it for a few minutes, including you.</p><span className="quote-author">— Anne Lamott</span><div className="quote-stars"><Sparkles size={16} /> A little reminder from ZenHeaven</div></section></div></div>
}
function MoodButton({ emoji, label }) { const [selected, setSelected] = useState(false); return <button className={`mood-button ${selected ? 'selected' : ''}`} onClick={() => setSelected(!selected)}><span>{emoji}</span><small>{label}</small></button> }

function Chat() {
  const [threads, setThreads] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { api.threads().then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const selectThread = async (id) => { setActiveId(id); try { const data = await api.thread(id); setMessages(data.messages || []) } catch { setError('Could not load that conversation.') } }
  const send = async (event) => {
    event?.preventDefault(); const message = input.trim(); if (!message || busy) return
    setInput(''); setError(''); setBusy(true); const localId = `local-${Date.now()}`; setMessages((current) => [...current, { id: localId, content: message, is_user: true }, { id: `${localId}-bot`, content: '', is_user: false }])
    try {
      await streamChat(message, activeId, (eventData) => {
        if (eventData.type === 'thread_id') setActiveId(eventData.data)
        if (eventData.type === 'token') setMessages((current) => current.map((item) => item.id === `${localId}-bot` ? { ...item, content: item.content + eventData.data } : item))
        if (eventData.type === 'complete') { const threadId = eventData.data?.thread_id; if (threadId) setActiveId(threadId); api.threads().then((data) => setThreads(data.threads || [])).catch(() => {}) }
      })
    } catch (err) { setError(err.message); setMessages((current) => current.map((item) => item.id === `${localId}-bot` ? { ...item, content: 'I’m having a quiet moment on my end. Please try again, or write your thoughts in the journal while we reconnect.' } : item)) } finally { setBusy(false) }
  }
  const newChat = () => { setActiveId(null); setMessages([]); setError('') }
  return <div className="chat-page"><div className="chat-sidebar panel"><div className="chat-sidebar-head"><div><span className="eyebrow">YOUR CONVERSATIONS</span><h3>Safe to explore</h3></div><button className="icon-button" onClick={newChat}><Plus size={18} /></button></div><Button variant="soft" className="new-chat" onClick={newChat}><Plus size={16} /> New conversation</Button><div className="thread-list">{threads.map((thread) => <button key={thread.id} className={`thread-item ${activeId === thread.id ? 'active' : ''}`} onClick={() => selectThread(thread.id)}><MessageCircle size={16} /><span><strong>{thread.title}</strong><small>{thread.last_message || 'A safe place to begin'}</small></span><ChevronRight size={15} /></button>)}{!threads.length && <div className="thread-empty"><Sparkles size={22} /><p>Your conversations will appear here.</p></div>}</div><div className="chat-note"><LockKeyhole size={14} /> Conversations are private to you.</div></div><section className="chat-window panel"><div className="chat-window-head"><div className="bot-avatar"><Sparkles size={18} /></div><div><strong>CalmBot</strong><span><i /> Here to listen</span></div><button className="icon-button"><CircleHelp size={18} /></button></div><div className="messages"><div className="bot-welcome"><span className="welcome-spark"><Sparkles size={18} /></span><h3>Hi, I’m CalmBot.</h3><p>This is a judgment-free space to untangle what’s on your mind. What feels present for you today?</p><div className="suggestion-row"><button onClick={() => setInput('I feel a little overwhelmed today.')}>I feel overwhelmed</button><button onClick={() => setInput('Help me slow down for a minute.')}>Help me slow down</button></div></div>{messages.map((message) => <div key={message.id} className={`message ${message.is_user ? 'user-message' : 'bot-message'}`}><div className="message-avatar">{message.is_user ? <UserRound size={15} /> : <Sparkles size={14} />}</div><div><p>{message.content || <span className="typing"><i /><i /><i /></span>}</p>{message.coins_earned > 0 && <small className="earned-note"><Coins size={12} /> +{message.coins_earned} Calm Coins</small>}</div></div>)}{error && <div className="chat-error">{error}</div>}</div><form className="chat-composer" onSubmit={send}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what’s on your mind…" disabled={busy} /><button type="submit" disabled={busy || !input.trim()}><Send size={18} /></button><small>CalmBot is supportive, not a replacement for professional care.</small></form></section></div>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  useEffect(() => { api.journals().then((data) => setEntries(Array.isArray(data) ? data : [])).catch(() => {}); api.prompts().then(setPrompts).catch(() => {}) }, [])
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; setBusy(true); try { const entry = await api.createJournal({ content, mood: mood || null, tags: [] }); setEntries((current) => [entry, ...current]); setContent(''); setMood(''); setShowEditor(false); setToast('Your reflection has been saved. +10 Calm Coins') } catch (err) { setToast(err.message) } finally { setBusy(false) } }
  const remove = async (id) => { try { await api.deleteJournal(id); setEntries((current) => current.filter((item) => (item._id || item.id) !== id)); setToast('Reflection removed.') } catch (err) { setToast(err.message) } }
  return <div className="journal-page"><Toast message={toast} onClose={() => setToast('')} /><SectionHeader eyebrow="YOUR PRIVATE REFLECTIONS" title="Journal" subtitle="A quiet place to notice what’s true." action={<Button onClick={() => setShowEditor(true)}><Plus size={17} /> New reflection</Button>} /><div className="journal-layout"><section className="journal-entries">{showEditor && <form className="panel editor-card" onSubmit={save}><div className="editor-top"><div><span className="eyebrow">RIGHT NOW</span><h3>What’s on your mind?</h3></div><button type="button" className="icon-button" onClick={() => setShowEditor(false)}><X size={18} /></button></div><textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} placeholder="There is no wrong way to write here…" rows={7} /><div className="editor-bottom"><div className="mood-select"><span>Feeling</span>{['calm', 'hopeful', 'heavy', 'anxious'].map((item) => <button type="button" className={mood === item ? 'active' : ''} key={item} onClick={() => setMood(item)}>{item}</button>)}</div><Button type="submit" disabled={busy || !content.trim()}>{busy ? <LoaderCircle size={17} className="spin" /> : 'Save reflection'} <ArrowRight size={16} /></Button></div></form>}{entries.map((entry) => <article className="journal-entry panel" key={entry._id || entry.id}><div className="entry-meta"><span>{formatDate(entry.created_at)}</span>{entry.mood && <span className="mood-tag">{entry.mood}</span>}<button onClick={() => remove(entry._id || entry.id)} aria-label="Delete entry"><Trash2 size={15} /></button></div><h3>{entry.title || 'A moment to remember'}</h3><p>{entry.content}</p>{entry.mood_analysis?.description && <div className="entry-insight"><Sparkles size={14} /> {entry.mood_analysis.description}</div>}</article>)}{!entries.length && !showEditor && <EmptyState icon={BookOpen} title="Your page is blank — for now." text="A few honest lines can make a little more room inside." action={<Button onClick={() => setShowEditor(true)}><Plus size={16} /> Start writing</Button>} />}</section><aside className="journal-aside"><div className="panel prompt-card"><span className="prompt-icon"><Sparkles size={20} /></span><span className="eyebrow">A LITTLE PROMPT</span><h3>{prompts[0]?.prompt || 'What made you smile today?'}</h3><button className="soft-link" onClick={() => setContent(prompts[0]?.prompt || '')}>Use this prompt <ArrowRight size={15} /></button></div><div className="panel journal-stats"><div className="panel-heading"><div><span className="eyebrow">YOUR PRACTICE</span><h3>Keep returning</h3></div><TrendingUp size={18} /></div><div className="streak-number"><strong>{entries.length}</strong><span>reflections<br />so far</span></div><div className="streak-line"><span style={{ width: `${Math.min(entries.length * 12, 100)}%` }} /></div><p>Every entry is a small act of self-trust.</p></div></aside></div></div>
}

function Books() {
  const [books, setBooks] = useState(fallbackBooks)
  const [mood, setMood] = useState('your current mood')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { api.booksByMood().then((data) => { if (data.books?.length) { setBooks(data.books); setMood(data.mood || 'your current mood') } }).catch(() => {}) }, [])
  const searchBooks = async (event) => { event.preventDefault(); if (!search.trim()) return; setBusy(true); try { const data = await api.searchBooks(search); setBooks(data.books || []) } catch { /* keep recommendations visible */ } finally { setBusy(false) } }
  return <div className="books-page"><SectionHeader eyebrow="THE READING ROOM" title="A good book can be company." subtitle={`Curated for ${mood}. Take what you need.`} action={<form className="search-box" onSubmit={searchBooks}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the collection" /><button disabled={busy}>{busy ? <LoaderCircle className="spin" size={15} /> : <ArrowRight size={16} />}</button></form>} /><div className="book-feature"><div><span className="eyebrow">TODAY’S SHELF</span><h3>Stories for the<br /><em>space you’re in.</em></h3><p>Whether you need comfort, clarity, or a spark of possibility — start here.</p></div><div className="book-stack"><div className="book-spine spine-one" /><div className="book-spine spine-two" /><div className="book-cover-main"><BookOpen size={32} /><small>YOUR NEXT<br />CHAPTER</small></div></div><span className="feature-star">✦</span></div><div className="books-grid">{books.map((book, index) => <article className="book-card" key={book.id || index}><div className="book-image">{book.image_url ? <img src={book.image_url} alt="" /> : <BookOpen size={30} />}<span className="book-number">0{index + 1}</span></div><div className="book-card-copy"><span className="eyebrow">FOR YOUR JOURNEY</span><h3>{book.title}</h3><p className="book-author">by {book.author || 'Unknown author'}</p><p>{book.description || 'A thoughtful companion for your wellbeing journey.'}</p><button className="soft-link">Explore book <ArrowRight size={15} /></button></div></article>)}</div></div>
}

function Music() {
  const [songs, setSongs] = useState([])
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const discover = async (event) => { event?.preventDefault(); setBusy(true); try { const data = await api.recommendSongs(query || songs[0] || ''); setSongs(data.recommendations || []) } catch { setSongs([]) } finally { setBusy(false) } }
  useEffect(() => { api.songs().then((data) => setSongs((data.songs || []).slice(0, 8))).catch(() => setSongs(['Weightless', 'Bloom', 'Holocene', 'Sunset Lover', 'River Flows in You'])) }, [])
  return <div className="music-page"><div className="music-hero"><div><span className="eyebrow">YOUR SOUNDSPACE</span><h2>Let the music<br /><em>hold you.</em></h2><p>Find a song that meets you where you are, then let it take you somewhere softer.</p><form className="music-search" onSubmit={discover}><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name a song you love…" /><button>{busy ? <LoaderCircle className="spin" size={16} /> : <ArrowRight size={16} />}</button></form></div><div className="music-orb"><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><Music2 size={43} /></div></div><div className="section-header music-header"><div><span className="eyebrow">A QUIET MIX</span><h2>For your current mood</h2></div><span className="music-chip"><Sparkles size={14} /> AI recommendations</span></div><div className="song-list">{songs.slice(0, 8).map((song, index) => { const name = typeof song === 'string' ? song : song.name; const artist = typeof song === 'string' ? 'ZenHeaven selection' : song.artist; return <div className={`song-row ${selected === index ? 'playing' : ''}`} key={`${name}-${index}`}><span className="song-index">{selected === index ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><span className="song-art"><Music2 size={16} /></span><div><strong>{name}</strong><small>{artist}</small></div><span className="song-mood">{index % 2 ? 'steady' : 'soft focus'}</span><button className="play-button" onClick={() => setSelected(selected === index ? null : index)}>{selected === index ? '❚❚' : <Play size={15} fill="currentColor" />}</button></div> })}{!songs.length && <EmptyState icon={Music2} title="Your soundscape is quiet." text="Try searching for a song to begin." />}</div></div>
}

function Therapists() {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [filter, setFilter] = useState('')
  useEffect(() => { api.therapists().then((data) => { if (data?.length) setTherapists(data) }).catch(() => {}) }, [])
  const visible = useMemo(() => filter ? therapists.filter((item) => item.specializations?.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))) : therapists, [filter, therapists])
  return <div className="therapists-page"><div className="therapist-intro"><div><span className="eyebrow">CARE, WHEN YOU’RE READY</span><h2>Find a person<br /><em>who gets it.</em></h2><p>Real support from licensed professionals, matched to your pace and your needs.</p></div><div className="therapist-illustration"><div className="heart-blob"><Heart size={45} /></div><span>you don’t<br />have to do<br />this alone</span></div></div><div className="filter-bar"><div className="filter-label"><UsersRound size={17} /> {visible.length} therapists available</div><div className="filter-pills">{['', 'Anxiety', 'Depression', 'Self-Esteem', 'Trauma'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item || 'All specialties'}</button>)}</div></div><div className="therapist-grid">{visible.map((therapist) => <article className="therapist-card" key={therapist._id || therapist.id}><div className="therapist-photo">{therapist.photo_url ? <img src={therapist.photo_url} alt="" /> : <UserRound size={35} />}<span className="verified"><Check size={11} /></span></div><div className="therapist-info"><div className="therapist-rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'} <span>• {therapist.total_sessions || 400} sessions</span></div><h3>{therapist.name}</h3><p className="therapist-specialty">{therapist.specializations?.join(' · ')}</p><p>{therapist.bio}</p><div className="therapist-bottom"><span><strong>${therapist.hourly_rate}</strong> / session</span><Button variant="outline">View profile <ArrowRight size={15} /></Button></div></div></article>)}</div></div>
}

function CalmCoinsPage() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(user?.calm_coins || 0)
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [streak, setStreak] = useState(0)
  useEffect(() => { Promise.all([api.balance().catch(() => ({ balance: user?.calm_coins || 0 })), api.transactions().catch(() => []), api.goals().catch(() => []), api.streak().catch(() => ({ current_streak: 0 }))]).then(([b, t, g, s]) => { setBalance(b.balance); setTransactions(t); setGoals(g); setStreak(s.current_streak) }) }, [user])
  return <div className="coins-page"><div className="coins-hero"><div><span className="eyebrow">YOUR WELLNESS REWARDS</span><h2>Small steps<br /><em>add up.</em></h2><p>Calm Coins celebrate every time you choose yourself.</p></div><div className="coin-balance"><Coins size={30} /><span>YOUR BALANCE</span><strong>{balance}</strong><small>Calm Coins</small></div></div><div className="coins-stats"><Metric icon={Zap} label="Current streak" value={`${streak} days`} trend="Keep the rhythm" tone="gold" /><Metric icon={Award} label="Today’s progress" value={`${goals.filter((goal) => goal.completed).length}/${goals.length || 4}`} trend="One moment at a time" tone="lavender" /><Metric icon={TrendingUp} label="Ways to earn" value="+5–15" trend="Per ritual" tone="blue" /></div><div className="coins-grid"><section className="panel goals-panel"><div className="panel-heading"><div><span className="eyebrow">TODAY’S RITUALS</span><h3>Show up for yourself</h3></div><span className="panel-spark"><Sparkles size={17} /></span></div><div className="goal-list">{(goals.length ? goals : [{ title: 'Chat with CalmBot', coins: 5, completed: false, current: 0 }, { title: 'Write in your journal', coins: 10, completed: false, current: 0 }, { title: 'Take a mindful pause', coins: 5, completed: false, current: 0 }]).map((goal, index) => <div className={`goal-row ${goal.completed ? 'complete' : ''}`} key={goal.id || index}><span className="goal-icon">{goal.completed ? <Check size={16} /> : <span>{index + 1}</span>}</span><div><strong>{goal.title}</strong><small>{goal.completed ? 'Completed today' : 'A gentle step toward feeling better'}</small></div><b>+{goal.coins} <Coins size={13} /></b></div>)}</div></section><section className="panel transaction-panel"><div className="panel-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Your coin trail</h3></div><Coins size={19} /></div>{transactions.slice(0, 5).map((item, index) => <div className="transaction-row" key={item._id || index}><span>{item.transaction_type === 'spend' ? '↗' : '✦'}</span><div><strong>{item.description || 'Wellness activity'}</strong><small>{formatDate(item.timestamp)}</small></div><b className={item.transaction_type === 'spend' ? 'spend' : ''}>{item.transaction_type === 'spend' ? '-' : '+'}{item.amount}</b></div>)}{!transactions.length && <p className="empty-inline">Your first Calm Coin is waiting for you.</p>}</section></div></div>
}

function formatDate(value) { if (!value) return 'Today'; const date = new Date(value); return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

export default { LandingPage, AuthPage, Layout, Dashboard, Chat, Journal, Books, Music, Therapists, Coins: CalmCoinsPage }
