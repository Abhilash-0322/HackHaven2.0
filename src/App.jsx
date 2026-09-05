import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowRight, BarChart3, BookOpen, Brain, Check, ChevronDown,
  CircleDollarSign, Clock3, Code2, Compass, Copy, Database, FileText, Gauge, Globe2,
  Hash, Headphones, Home, Layers3, Library, LineChart, LockKeyhole, LogOut, Menu,
  MessageCircle, Network, PenLine, Plus, Radio, Search, Send, Settings2, ShieldCheck,
  Sparkles, Terminal, UserRound, UsersRound, Wallet, X, Zap,
} from 'lucide-react'
import { api, authApi, FALLBACK, safeApi, TOKEN_KEY } from './lib/api'

const AuthContext = createContext(null)
const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(FALLBACK.user)
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    authApi.me().then(setUser).catch(() => localStorage.removeItem(TOKEN_KEY))
  }, [])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])
  const value = useMemo(() => ({
    user,
    toast,
    notify: setToast,
    login: async (body) => {
      try {
        const result = await authApi.login(body)
        localStorage.setItem(TOKEN_KEY, result.access_token)
        setUser(result.user)
      } catch {
        setUser({ ...FALLBACK.user, username: body.username || FALLBACK.user.username })
        setToast('Demo mode active — backend connection unavailable')
      }
    },
    register: async (body) => {
      try {
        const result = await authApi.register(body)
        localStorage.setItem(TOKEN_KEY, result.access_token)
        setUser(result.user)
      } catch {
        setUser({ ...FALLBACK.user, username: body.username || FALLBACK.user.username, full_name: body.full_name || FALLBACK.user.full_name })
        setToast('Demo account ready — backend connection unavailable')
      }
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY)
      setUser(FALLBACK.user)
      setToast('Signed out of your explorer')
    },
  }), [toast, user])
  return <AuthContext.Provider value={value}>{children}{toast && <div className="toast">{toast}<button onClick={() => setToast('')}><X size={14} /></button></div>}</AuthContext.Provider>
}

function Logo({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'text-white' : ''}`}><span className="brand-mark"><Layers3 size={17} /></span><span>zen<span className="brand-accent">heaven</span></span></Link>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function Eyebrow({ children }) {
  return <p className="eyebrow"><span className="eyebrow-line" />{children}</p>
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Talk space', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: Library },
  { to: '/music', label: 'Sound room', icon: Headphones },
  { to: '/therapists', label: 'Practitioners', icon: UsersRound },
  { to: '/coins', label: 'Calm coins', icon: CircleDollarSign },
]

function Landing() {
  const blocks = FALLBACK.blocks
  return <div className="landing noise">
    <div className="landing-glow glow-one" /><div className="landing-glow glow-two" />
    <nav className="landing-nav shell"><Logo /><div className="landing-links"><a href="#protocol">Protocol</a><a href="#signals">Signals</a><a href="#manifesto">Manifesto</a></div><div className="nav-actions"><Link to="/login" className="text-link">Sign in</Link><Link to="/register"><Button>Open explorer <ArrowRight size={15} /></Button></Link></div></nav>
    <main>
      <section className="hero shell">
        <div className="hero-copy"><Eyebrow>ROLLUP / 01 · A quieter way to move</Eyebrow><h1>Every inner world has a <span className="text-gradient">heartbeat.</span></h1><p className="hero-sub">ZenHeaven is a block explorer for the human layer — a calm operating system that turns daily care into visible momentum.</p><div className="hero-actions"><Link to="/register"><Button className="button-lg">Start a new block <ArrowRight size={16} /></Button></Link><a href="#protocol" className="text-link">Explore the protocol <ChevronDown size={15} /></a></div><div className="hero-proof"><div className="avatar-stack"><span>A</span><span>J</span><span>M</span><span>R</span></div><p><strong>2,840</strong> people are choosing<br />a better next block this week</p></div></div>
        <div className="hero-terminal"><div className="terminal-head"><div className="traffic"><i /><i /><i /></div><span>zenheaven://sequencer</span><span className="terminal-live"><b /> LIVE</span></div><div className="terminal-body"><div className="terminal-label"><span>latest commitment</span><span className="font-mono">#018420987</span></div><div className="ring-wrap"><div className="ring ring-a" /><div className="ring ring-b" /><div className="ring ring-c" /><div className="core"><Sparkles size={23} /><strong>in sync</strong><span>wellbeing index</span></div></div><div className="terminal-grid"><div><span>block time</span><strong>2.4s</strong></div><div><span>gas used</span><strong>34.8%</strong></div><div><span>calm balance</span><strong className="accent-text">1,280 ◈</strong></div></div><div className="terminal-log"><span className="log-dot" /> <span>your next small step is ready</span><span className="log-time">now</span></div></div></div>
      </section>
      <section className="ticker"><div className="shell ticker-inner"><span>ZENHEAVEN MAINNET</span><span>◈</span><span>FINALITY IS A FEELING</span><span>◈</span><span>COMMIT SMALL WINS</span><span>◈</span><span>ZENHEAVEN MAINNET</span></div></section>
      <section id="protocol" className="story shell"><div className="story-intro"><Eyebrow>ROLLUP / 02 · The protocol</Eyebrow><h2>Small actions.<br /><span className="muted">Strong confirmations.</span></h2><p>Wellbeing should not feel like another dashboard to maintain. ZenHeaven keeps the interface quiet and the signal honest.</p></div><div className="feature-grid"><Feature index="01" icon={<MessageCircle />} title="Talk it out" copy="An always-on companion for the thoughts that need somewhere to land." /><Feature index="02" icon={<PenLine />} title="Commit a journal" copy="Write a block of context. Watch patterns emerge without judgment." /><Feature index="03" icon={<Radio />} title="Shift your state" copy="Find music and books that meet you at the exact edge of now." /><Feature index="04" icon={<UsersRound />} title="Bridge to care" copy="When the next block needs a human, find a practitioner who fits." /></div></section>
      <section id="signals" className="signal-section"><div className="shell signal-layout"><div><Eyebrow>ROLLUP / 03 · The signal</Eyebrow><h2>A calmer mind is a <span className="text-gradient">daily practice.</span></h2><p>There is no finish line. Just a chain of moments that become a life when you choose to notice them.</p><Link to="/register" className="inline-link">Begin your first block <ArrowRight size={15} /></Link></div><div className="mini-chain">{blocks.map((block, index) => <div className="chain-card" key={block.number}><div className="chain-line">{index < blocks.length - 1 && <span />}</div><div className="chain-card-body"><div className="chain-top"><span className="chain-num">#{String(block.number).slice(-6)}</span><span className="status-pill"><i /> finalized</span></div><strong>{block.hash}</strong><p>{block.txs} actions · {block.time}</p></div></div>)}</div></div></section>
      <section id="manifesto" className="manifesto shell"><div className="manifesto-quote">“The best version of you is not a destination.<br /><span>It’s the next block.</span>”</div><div className="manifesto-foot"><span>ZENHEAVEN / HUMAN LAYER</span><span>BUILT FOR BETTER DAYS <ArrowRight size={14} /></span></div></section>
    </main><footer className="landing-footer shell"><Logo /><span>© 2025 ZenHeaven protocol</span><span className="font-mono">STATUS: NOMINAL</span></footer>
  </div>
}

function Feature({ index, icon, title, copy }) {
  return <article className="feature-card"><div className="feature-top"><span>{index}</span><span className="feature-icon">{icon}</span></div><h3>{title}</h3><p>{copy}</p><ArrowRight className="feature-arrow" size={15} /></article>
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [busy, setBusy] = useState(false)
  if (user && localStorage.getItem(TOKEN_KEY)) return <Navigate to="/dashboard" replace />
  const submit = async (event) => {
    event.preventDefault(); setBusy(true)
    try { await (isLogin ? login({ username: form.username, password: form.password }) : register(form)); navigate('/dashboard') } finally { setBusy(false) }
  }
  return <div className="auth-page noise"><nav className="shell auth-nav"><Logo /><Link to="/" className="text-link"><ArrowRight className="rotate-180" size={15} /> Back home</Link></nav><main className="auth-grid shell"><div className="auth-pitch"><Eyebrow>ZENHEAVEN / PRIVATE BETA</Eyebrow><h1>Make space for<br /><span className="text-gradient">what matters.</span></h1><p>One calm operating system for the messy, beautiful work of being human.</p><div className="auth-list"><span><ShieldCheck size={16} /> Your data stays yours</span><span><Zap size={16} /> Built for tiny, daily wins</span></div></div><div className="auth-card"><p className="eyebrow plain">ACCESS PORTAL</p><h2>{isLogin ? 'Welcome back.' : 'Begin your practice.'}</h2><p className="auth-note">{isLogin ? 'Pick up wherever you left off.' : 'A better day starts with one small decision.'}</p><form onSubmit={submit}>{!isLogin && <Field label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="How should we call you?" />}{!isLogin && <Field label="Email" type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@somewhere.com" />}<Field label="Username" value={form.username} required onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="your handle" /><Field label="Password" type="password" value={form.password} required onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /><Button disabled={busy} className="form-submit">{busy ? 'Syncing…' : isLogin ? 'Enter my space' : 'Create my space'} <ArrowRight size={15} /></Button></form><p className="auth-switch">{isLogin ? 'New to ZenHeaven?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p></div></main></div>
}

function Field({ label, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} /></label>
}

function AppShell({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const current = navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0]
  return <div className="app-shell"><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-logo"><Logo /></div><div className="network-select"><span className="network-dot" /> ZenHeaven Mainnet <ChevronDown size={13} /></div><p className="side-label">YOUR SPACE</p><nav className="side-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={16} /><span>{label}</span>{location.pathname === to && <i />}</NavLink>)}</nav><div className="sidebar-bottom"><div className="side-status"><span className="network-dot" /> all systems nominal</div><div className="user-row"><span className="user-avatar">{(user?.full_name || 'A')[0]}</span><div><strong>{user?.full_name || user?.username}</strong><small>@{user?.username}</small></div><button onClick={logout} aria-label="Sign out"><LogOut size={14} /></button></div></div></aside><div className="app-content"><header className="app-header"><button className="mobile-menu" onClick={() => setOpen(!open)}><Menu size={19} /></button><div><span className="header-kicker">ZENHEAVEN /</span><strong>{current.label}</strong></div><div className="header-actions"><span className="header-network"><span className="network-dot" /> Sequencer healthy</span><Link to="/coins" className="balance"><CircleDollarSign size={14} /> {user?.calm_coins || 1280}</Link><button className="icon-button"><Settings2 size={16} /></button></div></header><main className="page-content">{children}</main></div></div>
}

function PageTitle({ eyebrow, title, copy, action }) {
  return <div className="page-title"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>
}

function StatCard({ label, value, detail, icon: Icon, tone = 'lime' }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={17} /></div><span className="stat-live"><i /> live</span><p>{label}</p><strong>{value}</strong><small>{detail}</small></div>
}

function Dashboard() {
  const { user } = useAuth()
  const [blocks, setBlocks] = useState(FALLBACK.blocks)
  const [activity, setActivity] = useState(FALLBACK.activity)
  useEffect(() => {
    safeApi('/coins/transactions', FALLBACK.activity).then((data) => {
      if (Array.isArray(data) && data.length) setActivity(data.map((item) => ({ ...item, type: item.source || 'Daily protocol', detail: item.description || 'wellness signal committed', value: `+${item.amount || 10} CALM`, time: 'recently' })))
    })
    safeApi('/coins/balance', { balance: user.calm_coins }).then((data) => setBlocks((current) => current.map((item, index) => index === 0 ? { ...item, fee: `${data.balance || 1280} CALM` } : item)))
  }, [user.calm_coins])
  return <><PageTitle eyebrow="OVERVIEW / YOUR SIGNAL" title={`Good to see you, ${user?.full_name?.split(' ')[0] || 'Explorer'}.`} copy="Your wellbeing is a practice, not a performance. Here’s your signal today." action={<Link to="/chat"><Button><MessageCircle size={15} /> Check in</Button></Link>} /><div className="stats-grid"><StatCard label="Calm balance" value={(user?.calm_coins || 1280).toLocaleString()} detail="coins available to you" icon={CircleDollarSign} tone="purple" /><StatCard label="Current rhythm" value="12 days" detail="your gentle consistency" icon={Activity} /><StatCard label="Today's blocks" value="04 / 05" detail="small wins count" icon={Gauge} /><StatCard label="Wellbeing index" value="84.2" detail="up 6.4% this week" icon={LineChart} /></div><div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><Eyebrow>THE LATEST BLOCKS</Eyebrow><h2>Proof of practice.</h2></div><Link to="/coins" className="panel-link">View ledger <ArrowRight size={14} /></Link></div><div className="block-list">{blocks.map((block) => <BlockRow key={block.number} block={block} />)}</div><Link to="/journal" className="commit-cta"><span><Plus size={15} /> Commit a new block</span><ArrowRight size={15} /></Link></section><section className="panel signal-panel"><div className="panel-head"><div><Eyebrow>WELLBEING INDEX</Eyebrow><h2>Moving in the right direction.</h2></div><span className="period">7D <ChevronDown size={13} /></span></div><div className="chart-wrap"><div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart"><div className="chart-grid" /><svg viewBox="0 0 520 190" preserveAspectRatio="none" role="img" aria-label="Wellbeing index chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d6ff4a" stopOpacity=".25" /><stop offset="1" stopColor="#d6ff4a" stopOpacity="0" /></linearGradient></defs><path d="M0 158 C42 151 57 135 88 143 S128 130 154 142 S199 115 225 127 S258 121 286 105 S326 122 352 99 S397 107 420 76 S466 71 520 30 V190 H0Z" fill="url(#chartFill)" /><path d="M0 158 C42 151 57 135 88 143 S128 130 154 142 S199 115 225 127 S258 121 286 105 S326 122 352 99 S397 107 420 76 S466 71 520 30" fill="none" stroke="#d6ff4a" strokeWidth="2.5" /></svg><div className="chart-tooltip"><strong>84.2</strong><span>today</span></div></div></div><div className="chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div className="signal-footer"><span><i className="dot-lime" /> wellbeing index</span><strong>+6.4%</strong></div></section></div><section className="panel activity-panel"><div className="panel-head"><div><Eyebrow>RECENT ACTIVITY</Eyebrow><h2>Chain activity.</h2></div><Link to="/chat" className="panel-link">Open talk space <ArrowRight size={14} /></Link></div><div className="activity-list">{activity.map((item, index) => <ActivityRow key={`${item.hash || item.type}-${index}`} item={item} />)}</div></section></>
}

function BlockRow({ block }) {
  return <div className="block-row"><span className="block-symbol"><Database size={15} /></span><div className="block-main"><strong>Block #{block.number.toLocaleString()}</strong><span>{block.hash}</span></div><div className="block-meta"><span>{block.txs} txns</span><span>{block.time}</span></div><span className="status-pill"><i /> {block.state}</span><Copy size={14} className="row-copy" /></div>
}

function ActivityRow({ item }) {
  return <div className="activity-row"><span className={`activity-icon ${item.tone || 'lime'}`}>{item.tone === 'blue' ? <Headphones size={15} /> : item.tone === 'purple' ? <Sparkles size={15} /> : <PenLine size={15} />}</span><div><strong>{item.type}</strong><span>{item.detail} · {item.hash || '0x2fe1...c04d'}</span></div><span className="activity-value">{item.value}</span><span className="activity-time">{item.time}</span></div>
}

function Chat() {
  const { notify } = useAuth()
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hey, I’m here. What would feel useful to put into words today?' }])
  const [input, setInput] = useState('')
  const send = async (event) => {
    event.preventDefault()
    if (!input.trim()) return
    const text = input.trim(); setInput(''); setMessages((items) => [...items, { role: 'user', text }])
    try { await api('/mental-health/chat', { method: 'POST', body: { message: text } }) } catch { notify('Your note is held locally in demo mode') }
    setTimeout(() => setMessages((items) => [...items, { role: 'assistant', text: 'That sounds worth noticing. You do not have to solve the whole block at once — what is one kind next step?' }]), 450)
  }
  return <><PageTitle eyebrow="TALK SPACE / PRIVATE SUPPORT" title="You can say it here." copy="A quiet, intelligent space to untangle what’s on your mind." /><div className="chat-layout"><section className="panel chat-panel"><div className="chat-header"><span className="chat-avatar"><Brain size={18} /></span><div><strong>CalmBot <span className="online-pill"><i /> online</span></strong><small>A private place to say the unsaid.</small></div><span className="ml-auto font-mono text-xs text-dim">THREAD #0A91</span></div><div className="chat-messages">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}><span>{message.text}</span></div>)}</div><form className="chat-input" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Say what’s true…" /><button type="submit"><Send size={16} /></button></form><p className="chat-footnote"><LockKeyhole size={11} /> ZenHeaven is a support tool, not a replacement for professional care.</p></section><aside className="panel prompt-panel"><Eyebrow>STARTING POINTS</Eyebrow><h2>Open a block.</h2><p>There’s no perfect way to begin. Try one of these.</p>{['I feel a little off today', 'Help me slow down', 'I need a fresh perspective'].map((prompt) => <button key={prompt} onClick={() => setInput(prompt)} className="prompt-chip">{prompt}<ArrowRight size={13} /></button>)}<div className="privacy-note"><ShieldCheck size={17} /><span><strong>Private by design</strong><br />Your check-ins are yours.</span></div></aside></div></>
}

function Journal() {
  const { notify } = useAuth()
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState([])
  const [mood, setMood] = useState('calm')
  const save = async () => {
    if (!content.trim()) return
    setEntries((items) => [{ content, mood, created_at: new Date().toISOString() }, ...items]); setContent(''); notify('New journal block committed')
    try { await api('/journal/entries', { method: 'POST', body: { content, mood, tags: [] } }) } catch { /* optimistic demo */ }
  }
  return <><PageTitle eyebrow="JOURNAL / YOUR SIGNAL" title="Write it down." copy="A place to turn the noise into something you can see." action={<Button variant="secondary" onClick={() => document.getElementById('journal-entry')?.focus()}><PenLine size={15} /> New entry</Button>} /><div className="journal-grid"><section className="panel journal-editor"><div className="panel-head"><div><Eyebrow>NEW ENTRY</Eyebrow><h2>Commit a moment.</h2></div><span className="font-mono text-xs text-dim">{content.length} chars</span></div><textarea id="journal-entry" value={content} onChange={(event) => setContent(event.target.value)} placeholder="What is present for you right now?" /><div className="editor-foot"><div><span className="field-caption">MOOD SIGNAL</span><div className="mood-list">{['calm', 'hopeful', 'anxious', 'grateful'].map((item) => <button key={item} className={mood === item ? 'selected' : ''} onClick={() => setMood(item)}>{item}</button>)}</div></div><Button onClick={save} disabled={!content.trim()}><Check size={15} /> Save block</Button></div></section><section className="panel prompt-panel"><Eyebrow>PROTOCOL PROMPTS</Eyebrow><h2>A way in.</h2><p>Use a prompt to begin the next honest block.</p>{['What would feel like enough today?', 'Describe a moment of calm.', 'What deserves your attention tomorrow?'].map((prompt) => <button className="prompt-card" key={prompt} onClick={() => setContent(`${prompt}\n\n`)}><Sparkles size={14} />{prompt}</button>)}</section></div><section className="journal-archive"><div className="panel-head"><div><Eyebrow>ARCHIVE</Eyebrow><h2>Recent reflections.</h2></div><span className="font-mono text-xs text-dim">{entries.length} entries</span></div>{entries.length ? <div className="entry-grid">{entries.map((entry, index) => <article className="entry-card" key={`${entry.created_at}-${index}`}><span className="mood-tag">{entry.mood}</span><p>{entry.content}</p><small>{new Date(entry.created_at).toLocaleDateString()}</small></article>)}</div> : <div className="empty-state"><PenLine size={22} /><p>The page is yours.</p><span>Your saved reflections will gather here over time.</span></div>}</section></>
}

function Books() {
  const fallback = [{ title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', tag: 'REFLECTION', color: 'sage' }, { title: 'Wintering', author: 'Katherine May', tag: 'RESILIENCE', color: 'blue' }, { title: 'The Comfort Book', author: 'Matt Haig', tag: 'PERSPECTIVE', color: 'gold' }, { title: 'Atomic Habits', author: 'James Clear', tag: 'MOMENTUM', color: 'purple' }]
  const [books, setBooks] = useState(fallback)
  const [query, setQuery] = useState('')
  useEffect(() => { safeApi('/books/recommend-by-mood', { books: fallback }).then((data) => { if (data.books?.length) setBooks(data.books) }) }, [])
  const shown = books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageTitle eyebrow="LIBRARY / CURATED FOR YOU" title="Pages that meet you." copy="Thoughtful reads selected for the block you are in." action={<label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search library" /></label>} /><div className="book-grid">{shown.map((book, index) => <article className={`book-card ${book.color || ['sage', 'blue', 'gold', 'purple'][index % 4]}`} key={book.id || book.title}><div className="book-cover"><span>{book.tag || 'READING PATH'}</span><BookOpen size={34} /><strong>{book.title}</strong></div><div className="book-info"><h3>{book.title}</h3><p>{book.author}</p><button>Find adjacent reads <ArrowRight size={13} /></button></div></article>)}</div></>
}

function Music() {
  const fallback = ['Holocene', 'Bloom', 'Weightless', 'Sunset Lover', 'A Walk']
  const [songs, setSongs] = useState(fallback)
  const [selected, setSelected] = useState('')
  const [recommendations, setRecommendations] = useState([])
  useEffect(() => { safeApi('/songs', { songs: fallback }).then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 100)) }) }, [])
  const build = async () => { if (!selected) return; const data = await safeApi(`/recommend?song=${encodeURIComponent(selected)}`, { recommendations: fallback.filter((song) => song !== selected).map((name) => ({ name, artist: 'ZenHeaven signal', album_cover_url: '' })) }); setRecommendations(data.recommendations || []) }
  return <><PageTitle eyebrow="SOUND ROOM / SHIFT YOUR STATE" title="A frequency for now." copy="Pick an anchor. We’ll find the next places your attention might want to go." /><div className="music-grid"><section className="panel music-picker"><div className="music-icon"><Headphones size={20} /></div><Eyebrow>CHOOSE AN ANCHOR</Eyebrow><h2>What sounds like you?</h2><p>Music can be a handrail. Let it hold the moment.</p><select value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Select a song</option>{songs.map((song) => <option key={song} value={song}>{song}</option>)}</select><Button onClick={build} disabled={!selected}><Sparkles size={15} /> Build listening path</Button></section><section><div className="panel-head"><div><Eyebrow>YOUR ORBIT</Eyebrow><h2>{recommendations.length ? 'Next in the sequence.' : 'Your next sequence.'}</h2></div><Radio className="text-dim" size={19} /></div>{recommendations.length ? <div className="song-list">{recommendations.map((song, index) => <div className="song-row" key={`${song.name}-${index}`}><span className="song-number">0{index + 1}</span><span className="album-art"><MusicGlyph /></span><div><strong>{song.name}</strong><small>{song.artist}</small></div><PlayIcon /><span className="song-time">03:{String(12 + index).padStart(2, '0')}</span></div>)}</div> : <div className="empty-state music-empty"><Headphones size={24} /><p>The quiet before the first track.</p><span>Choose an anchor to generate a listening path.</span></div>}</section></div></>
}

function MusicGlyph() {
  return <span className="bars"><i /><i /><i /><i /></span>
}
function PlayIcon() {
  return <span className="play-icon">▶</span>
}

function Therapists() {
  const people = [{ name: 'Dr. Maya Chen', role: 'Mindfulness · anxiety', years: 12, rating: '4.9', initials: 'MC' }, { name: 'Alex Rivera, LCSW', role: 'Burnout · transitions', years: 8, rating: '4.8', initials: 'AR' }, { name: 'Samira Okafor', role: 'Trauma-informed care', years: 15, rating: '5.0', initials: 'SO' }, { name: 'Jon Bell, LMFT', role: 'Relationships · identity', years: 9, rating: '4.9', initials: 'JB' }]
  const { notify } = useAuth()
  return <><PageTitle eyebrow="PRACTITIONERS / HUMAN SUPPORT" title="You don’t have to do it alone." copy="When the next block needs a human, find a practitioner who fits the moment." /><div className="therapist-grid"><section className="people-grid">{people.map((person) => <article className="person-card" key={person.name}><div className={`person-avatar ${person.initials.toLowerCase()}`}>{person.initials}</div><div className="person-title"><h3>{person.name}</h3><p>{person.role}</p></div><span className="person-rating">★ {person.rating}</span><div className="person-foot"><span>{person.years} years experience</span><Button variant="secondary" onClick={() => notify(`${person.name}'s next available block is tomorrow`)}>View times <ArrowRight size={13} /></Button></div></article>)}</section><aside className="panel calendar-panel"><Eyebrow>YOUR CALENDAR</Eyebrow><h2>Upcoming sessions.</h2><div className="empty-state"><Clock3 size={23} /><p>Nothing booked.</p><span>Your future sessions will show up here.</span></div><div className="care-note"><HeartIcon /><span>A small reminder<br /><strong>Reaching out is a form of progress.</strong></span></div></aside></div></>
}

function HeartIcon() {
  return <span className="heart-icon">♡</span>
}

function Coins() {
  const { notify } = useAuth()
  const [balance, setBalance] = useState(1280)
  const [amount, setAmount] = useState(100)
  useEffect(() => { safeApi('/coins/balance', { balance: 1280 }).then((data) => setBalance(data.balance || 1280)) }, [])
  const spend = () => { if (balance < amount) return; setBalance((value) => value - amount); notify('Reward redeemed — keep the rhythm') }
  return <><PageTitle eyebrow="CALM COINS / YOUR ECONOMY" title="Reward the return." copy="Make the invisible work of showing up a little more visible." action={<Button variant="secondary" onClick={spend}><Wallet size={15} /> Redeem {amount} ◈</Button>} /><div className="coin-hero"><div><Eyebrow>AVAILABLE BALANCE</Eyebrow><div className="coin-balance">{balance.toLocaleString()} <span>◈</span></div><div className="coin-meta"><span><small>CURRENT STREAK</small><strong>12 <em>days</em></strong></span><span><small>NEXT UNLOCK</small><strong>100 <em>◈</em></strong></span></div></div><div className="coin-orbit"><div /><div /><CircleDollarSign size={38} /></div></div><div className="coin-grid"><section className="panel"><Eyebrow>DAILY PROGRESS</Eyebrow><h2>Keep the rhythm.</h2>{['Talk with AI companion', 'Write a journal entry', 'Complete mood check'].map((item, index) => <div className="goal-row" key={item}><span className={index < 2 ? 'goal-done' : ''}>{index < 2 ? <Check size={13} /> : `0${index + 1}`}</span><strong>{item}</strong><em>+{[10, 15, 5][index]} ◈</em></div>)}</section><section className="panel"><div className="panel-head"><div><Eyebrow>LEDGER</Eyebrow><h2>Recent movement.</h2></div><RefreshIcon /></div>{FALLBACK.activity.map((item) => <ActivityRow key={item.hash} item={item} />)}<div className="redeem-options"><span>REDEEM A REWARD</span>{[100, 150, 200].map((value) => <button className={amount === value ? 'chosen' : ''} key={value} onClick={() => setAmount(value)}>{value} ◈</button>)}</div></section></div></>
}

function RefreshIcon() {
  return <Activity size={16} className="text-dim" />
}

function App() {
  return <AuthProvider><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="*" element={<AppShell><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AppShell>} /></Routes></AuthProvider>
}

export default App
