import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowUpRight, BarChart3, BookOpen, Bot, Brain, Check, ChevronDown,
  ChevronRight, CircleHelp, Copy, ExternalLink, Gauge, Headphones, Heart,
  Home, Leaf, LockKeyhole, LogOut, Menu, MessageCircle, Music2, PenLine, Play,
  Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Star, TrendingUp,
  UserRound, Users, Wallet, X, Zap,
} from 'lucide-react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'zenheaven_token'
const USER_KEY = 'zenheaven_user'

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  })
  if (!response.ok) throw new Error('The protocol is taking a breath.')
  return response.status === 204 ? null : response.json()
}

const validators = [
  { name: 'ZenHeaven Prime', id: '#0042', apr: '3.42%', commission: '5%', uptime: '99.98%', status: 'Active' },
  { name: 'Northstar Collective', id: '#0091', apr: '3.39%', commission: '4%', uptime: '99.95%', status: 'Active' },
  { name: 'Liminal Labs', id: '#0158', apr: '3.35%', commission: '6%', uptime: '99.91%', status: 'Active' },
]

const books = [
  { title: 'The Infinite Machine', author: 'Camila Russo', type: 'ETHEREUM', cover: 'linear-gradient(145deg,#d6ff70,#4e725f)' },
  { title: 'The Cryptopians', author: 'Laura Shin', type: 'ORIGINS', cover: 'linear-gradient(145deg,#f2bf92,#763c36)' },
  { title: 'Proof of Stake', author: 'Vitalik Buterin', type: 'RESEARCH', cover: 'linear-gradient(145deg,#b8f2d3,#1b4850)' },
]

const tracks = [
  { name: 'Weightless', artist: 'Marconi Union', mood: 'DEEP FOCUS' },
  { name: 'An Ending (Ascent)', artist: 'Brian Eno', mood: 'OPEN AIR' },
  { name: 'Emerald Rush', artist: 'Jon Hopkins', mood: 'COMPOUND' },
  { name: 'Says', artist: 'Nils Frahm', mood: 'SETTLE IN' },
]

function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })
  const signIn = (payload) => {
    const nextUser = payload?.user || { username: payload?.username || 'zenhuman', full_name: payload?.full_name || 'Zen Human' }
    localStorage.setItem(TOKEN_KEY, payload?.access_token || 'demo-token')
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }
  return { user, signIn, signOut }
}

export default function App() {
  const auth = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={auth.signIn} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={auth.signIn} />} />
      <Route element={auth.user ? <AppShell user={auth.user} signOut={auth.signOut} /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/books" element={<Books />} />
        <Route path="/music" element={<Music />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/coins" element={<Coins />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function Logo({ inverse = false }) {
  return <Link className={`logo ${inverse ? 'logo-inverse' : ''}`} to="/"><span className="logo-mark"><Sparkles size={15} /></span><span>zen<span className="logo-accent">heaven</span></span></Link>
}

function Button({ children, className = '', ...props }) {
  return <button className={`button ${className}`} {...props}>{children}</button>
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="landing-page">
      <header className="public-header">
        <Logo inverse />
        <nav className={menuOpen ? 'public-nav open' : 'public-nav'}>
          <a href="#protocol">Protocol</a><a href="#flow">How it works</a><a href="#security">Security</a>
          <Link to="/login" className="mobile-auth-link">Sign in</Link>
        </nav>
        <div className="public-actions"><Link to="/login" className="plain-link">Sign in</Link><Link to="/register" className="button button-lime">Launch app <ArrowUpRight size={15} /></Link></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow lime-eyebrow"><span /> LIQUID STAKING, MADE SERENE</div>
            <h1>Let your ETH<br /><em>keep moving.</em></h1>
            <p className="hero-lede">Stake without sitting still. ZenHeaven turns locked ETH into a liquid position you can hold, build with, and let compound.</p>
            <div className="hero-actions"><Link to="/register" className="button button-lime button-large">Start staking <ArrowUpRight size={17} /></Link><a href="#flow" className="play-link"><span><Play size={12} fill="currentColor" /></span> See the flow</a></div>
            <div className="hero-trust"><ShieldCheck size={15} /> Non-custodial · audited · open source</div>
          </div>
          <StakeWidget />
          <div className="hero-spark spark-one">✦</div><div className="hero-spark spark-two">✧</div>
        </section>
        <section className="ticker"><div className="ticker-track"><span>Total Value Staked <strong>$482.6M</strong></span><i /><span>zETH supply <strong>231,408</strong></span><i /><span>Current APR <strong>3.42%</strong></span><i /><span>Validators <strong>1,842</strong></span><i /></div></section>
        <section className="landing-section" id="protocol">
          <div className="section-kicker">THE ZENHEAVEN PROTOCOL</div><h2>Staking should feel<br /><span>like an open door.</span></h2><p className="section-lede">Your capital can earn network rewards and stay ready for whatever comes next. ZenHeaven keeps the mechanics visible and the experience calm.</p>
          <div className="feature-grid"><Feature icon={<RefreshCw />} number="01" title="Stay liquid" copy="Mint zETH as you stake. Use your position across DeFi while your underlying ETH earns." /><Feature icon={<Gauge />} number="02" title="Compound quietly" copy="Protocol rewards flow into the exchange rate. No claims, no busywork, just a position that grows." /><Feature icon={<ShieldCheck />} number="03" title="See everything" copy="Transparent validators, simple fees, and a clear trail from deposit to withdrawal." /></div>
        </section>
        <section className="flow-section" id="flow"><div className="flow-orb" /><div className="flow-copy"><div className="section-kicker">A SIMPLE RITUAL</div><h2>Deposit.<br />Receive.<br /><span>Keep moving.</span></h2><p>Connect a wallet, choose an amount, and receive zETH in one clear transaction. Your liquidity never has to wait for your ambition.</p><Link to="/register" className="arrow-link">Enter the app <ArrowRight size={16} /></Link></div><div className="flow-steps"><FlowStep number="01" title="Connect wallet" copy="One signature. No custody." /><FlowStep number="02" title="Stake ETH" copy="Mint a liquid receipt." /><FlowStep number="03" title="Use your zETH" copy="DeFi, hold, or unwind." /></div></section>
        <section className="manifesto" id="security"><div className="manifesto-icon"><LockKeyhole size={21} /></div><div><div className="section-kicker">BUILT FOR PEACE OF MIND</div><h2>Your stake is yours.<br /><span>Your clarity is too.</span></h2></div><p>ZenHeaven is a calm interface for serious infrastructure. Audited contracts, distributed validators, and no hidden yield.</p></section>
      </main>
      <footer className="public-footer"><Logo inverse /><span>© 2026 ZenHeaven Labs</span><span><span className="status-dot" /> All systems operational</span></footer>
    </div>
  )
}

function StakeWidget({ compact = false }) {
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const numericAmount = Number(amount) || 0
  return <div className={`stake-widget ${compact ? 'compact' : ''}`}>
    <div className="widget-top"><span className="section-kicker">STAKE ETH</span><span className="network-pill"><i /> Ethereum</span></div>
    {submitted ? <div className="stake-success"><div className="success-icon"><Check /></div><h3>Position queued.</h3><p>Your {numericAmount.toFixed(3)} ETH deposit is ready for confirmation.</p><Button className="button-ghost" onClick={() => setSubmitted(false)}>Stake another <RefreshCw size={14} /></Button></div> : <><div className="amount-label"><span>YOU DEPOSIT</span><span>Balance 2.480 ETH <button onClick={() => setAmount('2.48')}>MAX</button></span></div><div className="amount-input"><input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /><span><span className="eth-token">Ξ</span> ETH <ChevronDown size={14} /></span></div><div className="conversion"><span>You receive</span><strong>{(numericAmount * 0.998).toFixed(3)} zETH</strong></div><div className="widget-rate"><span>Exchange rate</span><span>1 zETH = 1.024 ETH <TrendingUp size={13} /></span></div><Button className="button-lime button-wide" disabled={!numericAmount} onClick={() => setSubmitted(true)}>Preview stake <ArrowRight size={16} /></Button><div className="widget-foot"><ShieldCheck size={13} /> You remain in control of your keys</div></>}
  </div>
}

function Feature({ icon, number, title, copy }) {
  return <article className="feature-card"><div className="feature-head"><span>{number}</span><div className="feature-icon">{icon}</div></div><h3>{title}</h3><p>{copy}</p><ArrowUpRight className="feature-arrow" size={17} /></article>
}

function FlowStep({ number, title, copy }) {
  return <div className="flow-step"><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div><ChevronRight size={16} /></div>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const payload = await api(`/auth/${register ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(register ? form : { username: form.username, password: form.password }) })
      onAuth(payload)
    } catch {
      onAuth({ username: form.username || form.email?.split('@')[0] || 'zenhuman', full_name: form.full_name || 'Zen Human', access_token: 'local-demo-token' })
    } finally { setLoading(false); navigate('/dashboard') }
  }
  return <div className="auth-page"><div className="auth-aside"><Logo inverse /><div className="auth-orbit"><div>Ξ</div></div><div className="auth-aside-copy"><div className="section-kicker">THE QUIET SIDE OF WEB3</div><h2>Make room for<br /><span>better capital.</span></h2><p>Liquid staking for people who like their infrastructure powerful and their interface peaceful.</p></div><div className="auth-aside-foot"><ShieldCheck size={14} /> Non-custodial by design</div></div><div className="auth-main"><Link to="/" className="back-link"><ChevronRight size={15} className="back-arrow" /> Back to home</Link><div className="auth-form"><div className="section-kicker">{register ? 'CREATE YOUR POSITION' : 'WELCOME BACK'}</div><h1>{register ? 'Begin with intent.' : 'Good to see you.'}</h1><p>{register ? 'Your calm command center is a few details away.' : 'Pick up exactly where your position left off.'}</p><form onSubmit={submit}>{register && <Field label="Your name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="Satoshi, but softer" />}{register && <Field label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" required />}<Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="Choose a username" required /><Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="At least 6 characters" required />{error && <div className="form-error">{error}</div>}<Button className="button-dark button-wide" disabled={loading}>{loading ? 'Opening your space…' : register ? 'Create my space' : 'Enter my space'} <ArrowRight size={16} /></Button></form><p className="auth-switch">{register ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create one'}</Link></p></div></div></div>
}

function Field({ label, onChange, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} onChange={(event) => onChange(event.target.value)} /></label>
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Zen assistant', icon: MessageCircle },
  { to: '/journal', label: 'Position notes', icon: PenLine },
  { to: '/books', label: 'Research room', icon: BookOpen },
  { to: '/music', label: 'Focus mix', icon: Headphones },
  { to: '/therapists', label: 'Validator set', icon: Users },
]

function AppShell({ user, signOut }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const current = navItems.find((item) => location.pathname.startsWith(item.to))
  return <div className="app-shell"><aside className={open ? 'app-sidebar open' : 'app-sidebar'}><div className="sidebar-brand"><Logo /><button className="sidebar-close" onClick={() => setOpen(false)}><X size={17} /></button></div><div className="sidebar-label">YOUR COMMAND CENTER</div><nav className="side-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/dashboard'} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}><Icon size={17} /><span>{label}</span>{label === 'Zen assistant' && <i className="unread-dot" />}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-label">PROTOCOL</div><NavLink to="/coins" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}><Coins size={17} /><span>Zen points</span><b>240</b></NavLink><div className="sidebar-health"><span className="status-dot" /><div><strong>All systems operational</strong><small>Block 20,184,294</small></div></div><button className="side-link signout" onClick={signOut}><LogOut size={17} /><span>Sign out</span></button></div></aside><div className="app-main"><header className="app-header"><button className="app-menu" onClick={() => setOpen(true)}><Menu /></button><div className="crumb"><span>ZENHEAVEN /</span><strong>{current?.label || 'Overview'}</strong></div><div className="header-actions"><button className="icon-button"><Search size={17} /></button><button className="network-pill header-network"><i /> Mainnet <ChevronDown size={13} /></button><div className="profile-chip"><span>{(user.full_name || user.username || 'Z')[0].toUpperCase()}</span><strong>{user.full_name || user.username}</strong><ChevronDown size={13} /></div></div></header><main className="page-content"><Outlet /></main></div></div>
}

function PageTitle({ kicker, title, copy, action }) {
  return <div className="page-title"><div><div className="section-kicker">{kicker}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>
}

function Dashboard() {
  const [staked, setStaked] = useState(2.48)
  const [showStake, setShowStake] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => { api('/coins/balance').catch(() => {}) }, [])
  const copyAddress = () => { navigator.clipboard?.writeText('0x8D42...a91E'); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return <div className="dashboard-page"><div className="dashboard-welcome"><div><div className="eyebrow lime-eyebrow"><span /> SATURDAY, SEPTEMBER 5, 2026</div><h1>Good evening, <em>zenhuman.</em></h1><p>Your capital is calm. Your position is moving.</p></div><div className="wallet-address"><span className="wallet-live" /><span>0x8D42...a91E</span><button onClick={copyAddress} aria-label="Copy wallet address">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div></div><div className="portfolio-grid"><section className="portfolio-card"><div className="card-topline"><span className="section-kicker">TOTAL POSITION</span><span className="live-pill"><span /> LIVE</span></div><div className="portfolio-value"><strong>${(staked * 3482.4).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong><span>+3.42% <TrendingUp size={14} /></span></div><div className="portfolio-sub"><span>{staked.toFixed(3)} ETH staked</span><span>≈ {(staked * 0.998).toFixed(3)} zETH</span></div><div className="portfolio-chart"><span style={{ height: '34%' }} /><span style={{ height: '43%' }} /><span style={{ height: '39%' }} /><span style={{ height: '52%' }} /><span style={{ height: '47%' }} /><span style={{ height: '65%' }} /><span style={{ height: '57%' }} /><span style={{ height: '74%' }} /><span style={{ height: '68%' }} /><span style={{ height: '86%' }} /><span style={{ height: '79%' }} /><span style={{ height: '96%' }} /></div><div className="chart-labels"><span>30 days ago</span><span>Today</span></div></section><section className="stats-column"><Stat label="Current APR" value="3.42%" trend="+0.18%" icon={<TrendingUp />} /><Stat label="Rewards earned" value="0.084 ETH" trend="+$292.60" icon={<Sparkles />} /><Stat label="Exchange rate" value="1.024" trend="+2.4%" icon={<RefreshCw />} /></section></div><div className="dashboard-lower"><section className="activity-card surface-card"><div className="section-header"><div><div className="section-kicker">YOUR ACTIVITY</div><h2>Recent movement</h2></div><button className="plain-link">View explorer <ExternalLink size={14} /></button></div><div className="activity-list"><Activity icon={<ArrowDownLeft />} title="Staked ETH" meta="Sep 04 · 14:32" value="+1.200 ETH" positive /><Activity icon={<Sparkles />} title="Rewards accrued" meta="Sep 01 · automatic" value="+0.012 ETH" positive /><Activity icon={<ArrowUpRight />} title="zETH transfer" meta="Aug 28 · 09:16" value="-0.400 zETH" /></div></section><section className="quick-stake surface-card"><div className="section-header"><div><div className="section-kicker">KEEP MOVING</div><h2>Stake more ETH</h2></div><Zap size={19} className="accent-icon" /></div><p>Add to your position and keep your capital productive.</p><Button className="button-dark button-wide" onClick={() => setShowStake(true)}>Open staking widget <ArrowRight size={16} /></Button><div className="quick-meta"><ShieldCheck size={14} /> No lockups · 7 day exit window</div></section></div><section className="validator-section"><div className="section-header"><div><div className="section-kicker">THE SET</div><h2>Validator health</h2></div><Link to="/therapists" className="plain-link">Explore all <ArrowRight size={14} /></Link></div><div className="validator-table"><div className="table-head"><span>VALIDATOR</span><span>APR</span><span>COMMISSION</span><span>UPTIME</span><span>STATUS</span></div>{validators.map((validator) => <div className="table-row" key={validator.id}><div className="validator-name"><span className="validator-avatar">{validator.name[0]}</span><span><strong>{validator.name}</strong><small>{validator.id}</small></span></div><span>{validator.apr}</span><span>{validator.commission}</span><span>{validator.uptime}</span><span className="status-text"><i /> {validator.status}</span></div>)}</div></section>{showStake && <div className="modal-backdrop" onClick={() => setShowStake(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowStake(false)}><X size={18} /></button><StakeWidget compact /></div></div>}</div>
}

function Stat({ label, value, trend, icon }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{trend} <TrendingUp size={11} /></small></div>
}

function Activity({ icon, title, meta, value, positive }) {
  return <div className="activity-row"><span className="activity-icon">{icon}</span><div><strong>{title}</strong><small>{meta}</small></div><b className={positive ? 'positive' : ''}>{value}</b><ChevronRight size={15} /></div>
}

function Chat() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Welcome back. I can help you read the protocol, understand your position, or simply find a calmer next step. What is on your mind?' }])
  const [input, setInput] = useState('')
  const send = (event) => { event.preventDefault(); if (!input.trim()) return; const message = input.trim(); setInput(''); setMessages((items) => [...items, { role: 'user', text: message }, { role: 'assistant', text: 'I’m tracking that. Your ETH remains staked while zETH keeps your options open. Want to look at your rewards or explore the validator set?' }]) }
  return <div className="inner-page"><PageTitle kicker="ZEN ASSISTANT" title="A calmer way to ask." copy="Protocol context, position clarity, and a little less noise." action={<span className="privacy-note"><span /> Private session</span>} /><div className="chat-layout"><aside className="thread-panel surface-card"><div className="section-header"><div className="section-kicker">YOUR THREADS</div><button className="icon-button"><Plus size={16} /></button></div><button className="thread-item active"><MessageCircle size={15} /><span>Understanding zETH</span><ChevronRight size={14} /></button><button className="thread-item"><BarChart3 size={15} /><span>My rewards this month</span><ChevronRight size={14} /></button><div className="thread-help"><CircleHelp size={17} /><span>Need a human?<br /><Link to="/therapists">Talk to the set →</Link></span></div></aside><section className="chat-panel surface-card"><div className="chat-head"><div className="bot-avatar"><Bot size={17} /></div><div><strong>Zen assistant</strong><span><i /> Online · grounded in protocol docs</span></div><button className="icon-button"><Settings2 size={16} /></button></div><div className="messages">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? <Bot size={13} /> : 'Z'}</div><div className="message-bubble">{message.text}</div></div>)}</div><form className="chat-composer" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your position…" /><button className="send-button" disabled={!input.trim()}><Send size={16} /></button></form><small className="composer-note">Zen assistant provides information, not financial advice.</small></section></div></div>
}

function Journal() {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState([])
  const save = (event) => { event.preventDefault(); if (!note.trim()) return; setSaved((items) => [{ text: note, date: 'Just now' }, ...items]); setNote('') }
  return <div className="inner-page"><PageTitle kicker="POSITION NOTES" title="Make room for the long view." copy="A private space to track the ideas behind your allocations." action={<span className="entry-count">{saved.length + 3} notes</span>} /><div className="journal-layout"><section className="write-panel surface-card"><div className="section-header"><div className="section-kicker">NEW NOTE</div><span>SEPTEMBER 05, 2026</span></div><form onSubmit={save}><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What are you noticing about the market, your goals, or your own conviction?" /><div className="write-footer"><span><LockKeyhole size={13} /> Only you can see this</span><Button className="button-dark" disabled={!note.trim()}>Save note <ArrowRight size={15} /></Button></div></form></section><aside className="prompt-panel"><Sparkles size={18} /><div className="section-kicker">A LITTLE NUDGE</div><h3>What would you keep holding if the chart went quiet for a month?</h3><button className="arrow-link" onClick={() => setNote('What would I keep holding if the chart went quiet for a month?\\n\\n')}>Use this prompt <ArrowRight size={14} /></button></aside></div><section className="notes-archive"><div className="section-header"><div><div className="section-kicker">THE ARCHIVE</div><h2>Recent notes</h2></div></div>{[...saved, { text: 'The best position is the one I can explain simply.', date: 'Sep 02, 2026' }, { text: 'Compound quietly. Keep optionality.', date: 'Aug 24, 2026' }].map((item, index) => <article className="note-card surface-card" key={`${item.date}-${index}`}><span className="note-index">0{index + 1}</span><p>{item.text}</p><small>{item.date} <span>·</span> private</small></article>)}</section></div>
}

function Books() {
  const [query, setQuery] = useState('')
  const filtered = books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="inner-page"><PageTitle kicker="RESEARCH ROOM" title="Good ideas compound too." copy="A considered shelf for the systems shaping this space." /><div className="research-toolbar"><div className="recommendation"><div className="mini-spark"><Sparkles size={15} /></div><div><span>CURATED FOR YOUR POSITION</span><strong>Slow reads for fast markets</strong></div></div><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" /></div></div><div className="book-grid">{filtered.map((book, index) => <article className={`research-book ${index === 0 ? 'featured' : ''}`} key={book.title}><div className="book-cover" style={{ background: book.cover }}><span>ZH</span><small>{book.type}</small></div><div className="book-info"><div className="section-kicker">{book.type}</div><h3>{book.title}</h3><p>by {book.author}</p><button className="arrow-link">Open the thread <ArrowRight size={14} /></button></div></article>)}</div></div>
}

function Music() {
  const [playing, setPlaying] = useState(null)
  return <div className="inner-page"><PageTitle kicker="FOCUS MIX" title="Change the atmosphere." copy="A soundtrack for research, rebalance, and letting the noise pass." action={<Button className="button-dark" onClick={() => setPlaying(playing ? null : 0)}>{playing !== null ? 'Pause session' : 'Start session'} <Headphones size={15} /></Button>} /><section className="music-hero"><div className="record-wrap"><div className="record"><div className="record-label">ZH<br /><small>FOCUS</small></div></div><div className="record-arm" /></div><div><div className="section-kicker">NOW TUNING</div><h2>A little less signal.<br /><span>A little more focus.</span></h2><p>Instrumental soundscapes for the moments when your best move is to stay with the plan.</p><div className="waveform">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 50)}%` }} />)}</div></div></section><div className="section-header track-heading"><div><div className="section-kicker">YOUR CONSTELLATION</div><h2>Deep focus, on-chain</h2></div><span>04 tracks</span></div><div className="track-list">{tracks.map((track, index) => <button className={playing === index ? 'track-row playing' : 'track-row'} key={track.name} onClick={() => setPlaying(playing === index ? null : index)}><span>{String(index + 1).padStart(2, '0')}</span><span className="track-art">{playing === index ? <span className="equalizer"><i /><i /><i /></span> : <Play size={14} fill="currentColor" />}</span><span className="track-name"><strong>{track.name}</strong><small>{track.artist}</small></span><span className="track-mood">{track.mood}</span><span>{index === 0 ? '04:52' : `0${5 + index}:1${index}`}</span></button>)}</div></div>
}

function Therapists() {
  const [selected, setSelected] = useState(null)
  return <div className="inner-page"><PageTitle kicker="VALIDATOR SET" title="You don’t have to choose alone." copy="Transparent operators, healthy uptime, and a set built for resilience." action={<span className="verified-note"><ShieldCheck size={14} /> Diversified set</span>} /><div className="support-banner"><div className="support-banner-icon"><ShieldCheck size={19} /></div><div><strong>Why a validator set?</strong><p>ZenHeaven spreads stake across independent operators so no single machine carries the whole story.</p></div><span className="banner-stat">1,842 <small>validators</small></span></div><div className="filter-row"><span>Sort by</span><button className="filter-chip selected">Best health</button><button className="filter-chip">Lowest fee</button><button className="filter-chip">Highest APR</button></div><div className="operator-grid">{validators.map((validator, index) => <article className="operator-card surface-card" key={validator.id}><div className="operator-top"><span className="operator-avatar">{validator.name.slice(0, 2).toUpperCase()}</span><span className="status-text"><i /> Active</span></div><h3>{validator.name}</h3><p>Independent Ethereum validator operator with a long-term view.</p><div className="operator-stats"><span><small>APR</small><strong>{validator.apr}</strong></span><span><small>FEE</small><strong>{validator.commission}</strong></span><span><small>UPTIME</small><strong>{validator.uptime}</strong></span></div><button className="button button-outline button-wide" onClick={() => setSelected(validator)}>View operator <ArrowRight size={14} /></button></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal-card operator-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button><span className="operator-avatar large">{selected.name.slice(0, 2).toUpperCase()}</span><div className="section-kicker">OPERATOR PROFILE</div><h2>{selected.name}</h2><p>Runs a resilient, independently monitored validator fleet with a commitment to open infrastructure.</p><div className="operator-stats"><span><small>APR</small><strong>{selected.apr}</strong></span><span><small>COMMISSION</small><strong>{selected.commission}</strong></span><span><small>UPTIME</small><strong>{selected.uptime}</strong></span></div><Button className="button-lime button-wide" onClick={() => setSelected(null)}>Done <Check size={15} /></Button></div></div>}</div>
}

function Coins() {
  const [claimed, setClaimed] = useState(false)
  return <div className="inner-page"><PageTitle kicker="ZEN POINTS" title="Care is a currency." copy="A few small rituals for staying close to your long-term strategy." action={<span className="coin-balance"><Sparkles size={15} /> 240 points</span>} /><div className="points-overview"><section className="points-balance"><div className="points-orbit"><Sparkles size={23} /></div><div className="section-kicker">YOUR BALANCE</div><strong>240</strong><span>zen points</span><p>Earned by learning, reflecting, and showing up.</p></section><section className="goals-card surface-card"><div className="section-header"><div><div className="section-kicker">TODAY’S GENTLE GOALS</div><h2>2 of 4 complete</h2></div><div className="goal-progress-ring">50%</div></div><Goal title="Read a protocol note" points="15" done /><Goal title="Review validator health" points="10" done /><Goal title="Write a position note" points="10" /><Goal title="Take a focus break" points="5" /></section></div><div className="points-lower"><section className="earn-card surface-card"><div className="section-kicker">WAYS TO EARN</div><h2>Your attention, returned.</h2><Earn icon={<BookOpen />} title="Read a research note" points="+15" /><Earn icon={<PenLine />} title="Write a position note" points="+10" /><Earn icon={<Heart />} title="Complete a mindful check-in" points="+5" /></section><section className="claim-card"><div className="section-kicker">WEEKLY DROP</div><h2>Consistency<br /><span>compounds.</span></h2><p>Keep your weekly rhythm and unlock a protocol research credit.</p><Button className="button-lime button-wide" onClick={() => setClaimed(true)}>{claimed ? <><Check size={15} /> Claimed</> : <>Claim 50 points <Sparkles size={15} /></>}</Button></section></div></div>
}

function Goal({ title, points, done }) {
  return <div className="goal-row"><span className={done ? 'goal-check done' : 'goal-check'}>{done && <Check size={12} />}</span><strong>{title}</strong><span>+{points} <Sparkles size={11} /></span></div>
}

function Earn({ icon, title, points }) {
  return <div className="earn-row"><span>{icon}</span><strong>{title}</strong><b>{points}</b><ArrowRight size={14} /></div>
}
