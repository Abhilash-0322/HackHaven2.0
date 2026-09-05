import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, Brain,
  Check, ChevronDown, ChevronRight, CircleHelp, Coins, Headphones, Heart,
  LayoutDashboard, LineChart, LogOut, Menu, MessageCircle, Music2, PenLine,
  Plus, Search, Settings2, ShieldCheck, Sparkles, Stethoscope, TrendingUp,
  UserRound, Users, Wallet, X, Zap,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const navItems = [
  { to: '/dashboard', label: 'Desk', icon: LayoutDashboard },
  { to: '/chat', label: 'Co-pilot', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Care network', icon: Stethoscope },
  { to: '/coins', label: 'Rewards', icon: Coins },
]

const markets = [
  { symbol: 'BTC-PERP', name: 'Bitcoin', price: '$68,421.80', change: '+4.82%', trend: 'up', points: '2,8 16,15 28,11 40,22 52,17 64,27 76,21 88,9 102,12 116,3' },
  { symbol: 'ETH-PERP', name: 'Ethereum', price: '$3,482.14', change: '+2.16%', trend: 'up', points: '2,22 16,18 28,24 40,12 52,16 64,8 76,15 88,6 102,11 116,2' },
  { symbol: 'SOL-PERP', name: 'Solana', price: '$164.92', change: '-1.24%', trend: 'down', points: '2,4 16,8 28,5 40,16 52,11 64,18 76,14 88,24 102,20 116,29' },
  { symbol: 'ARB-PERP', name: 'Arbitrum', price: '$1.12', change: '+6.08%', trend: 'up', points: '2,26 16,20 28,23 40,9 52,15 64,6 76,11 88,3 102,8 116,1' },
]

const fallbackThreads = [
  { id: 'mindful-morning', title: 'Morning market ritual', last_message: 'A calm start is a trading edge.', message_count: 4 },
  { id: 'risk-reset', title: 'Resetting after a loss', last_message: 'Let’s make space for the lesson.', message_count: 8 },
  { id: 'focus-session', title: 'Focus before the open', last_message: 'Your breathing practice is ready.', message_count: 2 },
]

const fallbackBooks = [
  { title: 'The Psychology of Money', author: 'Morgan Housel', tag: 'Mindset', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80' },
  { title: 'Trading in the Zone', author: 'Mark Douglas', tag: 'Discipline', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
  { title: 'The Art of Stillness', author: 'Pico Iyer', tag: 'Recovery', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80' },
]

const fallbackTherapists = [
  { name: 'Dr. Maya Shah', role: 'Performance psychologist', focus: 'Trading anxiety · Burnout', initials: 'MS', color: 'violet', next: 'Today · 6:30 PM' },
  { name: 'Alex Rivers', role: 'Mindfulness coach', focus: 'Focus · Emotional regulation', initials: 'AR', color: 'cyan', next: 'Tomorrow · 10:00 AM' },
  { name: 'Dr. Jonah Kim', role: 'Clinical therapist', focus: 'Stress · Sleep · Confidence', initials: 'JK', color: 'amber', next: 'Fri · 4:00 PM' },
]

function readUser() {
  try { return JSON.parse(localStorage.getItem('zenheaven_user')) } catch { return null }
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('zenheaven_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

function Sparkline({ points, trend = 'up', large = false }) {
  const color = trend === 'down' ? '#f87171' : '#36d5ba'
  return (
    <svg className={large ? 'sparkline sparkline-large' : 'sparkline'} viewBox="0 0 118 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth={large ? '1.5' : '1.8'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Brand() {
  return (
    <NavLink to="/dashboard" className="brand">
      <span className="brand-mark"><Sparkles size={17} /></span>
      <span>zen<span className="brand-light">heaven</span></span>
    </NavLink>
  )
}

function Sidebar({ mobileOpen, closeMobile }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top">
        <Brand />
        <button className="icon-btn close-menu" onClick={closeMobile} aria-label="Close menu"><X size={18} /></button>
      </div>
      <div className="desk-switcher">
        <span className="desk-avatar">ZH</span>
        <span><small>WORKSPACE</small><strong>ZenHeaven desk</strong></span>
        <ChevronDown size={15} className="muted-icon" />
      </div>
      <nav className="nav-list">
        <span className="nav-label">Workspace</span>
        {navItems.slice(0, 2).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={closeMobile} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={17} /><span>{label}</span>{label === 'Co-pilot' && <span className="nav-dot" />}
          </NavLink>
        ))}
        <span className="nav-label nav-label-spaced">Wellbeing</span>
        {navItems.slice(2, 6).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={closeMobile} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={17} /><span>{label}</span>
          </NavLink>
        ))}
        <span className="nav-label nav-label-spaced">Community</span>
        <NavLink to="/coins" onClick={closeMobile} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Coins size={17} /><span>Rewards</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="protocol-card">
          <div className="protocol-icon"><ShieldCheck size={16} /></div>
          <div><strong>Private by default</strong><p>Your data stays yours.</p></div>
        </div>
        <NavLink to="/login" className="nav-item logout-item"><LogOut size={17} /><span>Sign out</span></NavLink>
      </div>
    </aside>
  )
}

function Topbar({ openMobile }) {
  const location = useLocation()
  const title = navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Desk'
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={openMobile} aria-label="Open menu"><Menu size={20} /></button>
      <div className="breadcrumb"><span>ZenHeaven</span><ChevronRight size={14} /><strong>{title}</strong></div>
      <div className="topbar-actions">
        <div className="network-status"><span className="live-dot" /> Live data <span className="network-name">· Base</span></div>
        <button className="icon-btn" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button>
        <div className="profile-pill"><span className="profile-photo">AL</span><span className="profile-name">alex.lumen</span><ChevronDown size={14} /></div>
      </div>
    </header>
  )
}

function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => setMobileOpen(false), [children])
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <Topbar openMobile={() => setMobileOpen(true)} />
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action}
    </div>
  )
}

function MetricCard({ label, value, change, icon: Icon, tone = 'mint', foot }) {
  return (
    <div className="metric-card">
      <div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={15} /></span></div>
      <strong className="metric-value">{value}</strong>
      <div className="metric-foot">{change && <span className={change.startsWith('-') ? 'negative' : 'positive'}>{change.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}</span>}<span>{foot}</span></div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('7D')
  const [watching, setWatching] = useState('BTC-PERP')
  const [toast, setToast] = useState('')
  const current = markets.find((market) => market.symbol === watching) || markets[0]
  const showToast = (message) => { setToast(message); setTimeout(() => setToast(''), 2600) }
  return (
    <>
      <SectionHeading eyebrow="Saturday, 05 September 2026" title="Good evening, Alex." description="Trade with a clear head. Your edge starts here." action={<button className="primary-btn" onClick={() => navigate('/chat')}><Sparkles size={16} /> Check in with co-pilot</button>} />
      <div className="notice-strip"><span className="notice-pulse"><Activity size={15} /></span><span><strong>Market pulse:</strong> Volatility is cooling. A good moment to review your thesis before sizing up.</span><button onClick={() => navigate('/chat')}>Open reflection <ChevronRight size={14} /></button></div>
      <div className="metrics-grid">
        <MetricCard label="Portfolio balance" value="$24,680.42" change="+8.42%" foot="vs. last month" icon={Wallet} />
        <MetricCard label="Available margin" value="$8,942.16" change="+$1,240" foot="since yesterday" icon={BarChart3} tone="blue" />
        <MetricCard label="Calm score" value="82 / 100" change="+12 pts" foot="this week" icon={Heart} tone="violet" />
        <MetricCard label="Win rate" value="68.4%" change="+4.8%" foot="last 30 trades" icon={TrendingUp} tone="amber" />
      </div>
      <div className="dashboard-grid">
        <section className="surface chart-surface">
          <div className="surface-heading">
            <div><span className="eyebrow">Market overview</span><h2>{current.symbol} <span className="live-chip">Perpetual</span></h2></div>
            <div className="period-tabs">{['1H', '4H', '1D', '7D', '1M'].map((item) => <button key={item} className={period === item ? 'selected' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div>
          </div>
          <div className="chart-meta"><div><strong>{current.price}</strong><span className="positive"><ArrowUpRight size={14} /> {current.change}</span></div><span className="muted-copy">24h volume $1.84B</span></div>
          <div className="big-chart">
            <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
            <svg viewBox="0 0 720 230" preserveAspectRatio="none" aria-label={`${current.symbol} price chart`}>
              <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#36d5ba" stopOpacity=".22" /><stop offset="100%" stopColor="#36d5ba" stopOpacity="0" /></linearGradient></defs>
              <path d="M0,180 C34,159 52,176 81,141 S131,123 159,151 S203,111 228,132 S269,77 300,94 S342,125 369,103 S413,63 442,82 S474,36 504,66 S546,49 570,61 S616,30 642,46 S683,16 720,26 V230 H0 Z" fill="url(#chartFill)" />
              <path d="M0,180 C34,159 52,176 81,141 S131,123 159,151 S203,111 228,132 S269,77 300,94 S342,125 369,103 S413,63 442,82 S474,36 504,66 S546,49 570,61 S616,30 642,46 S683,16 720,26" fill="none" stroke="#36d5ba" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <circle cx="720" cy="26" r="5" fill="#36d5ba" /><circle cx="720" cy="26" r="10" fill="#36d5ba" fillOpacity=".12" />
            </svg>
            <div className="chart-labels"><span>Sep 01</span><span>Sep 02</span><span>Sep 03</span><span>Sep 04</span><span>Sep 05</span></div>
          </div>
          <div className="chart-footer"><span><i className="legend-dot mint" /> Mark price <strong>$68,421.80</strong></span><span><i className="legend-dot purple" /> Index price <strong>$68,410.22</strong></span><span className="chart-footer-right">Funding <strong className="positive">0.0082%</strong> · 01:42:18</span></div>
        </section>
        <section className="surface watchlist-surface">
          <div className="surface-heading"><div><span className="eyebrow">Markets</span><h2>Watchlist</h2></div><button className="icon-btn" onClick={() => showToast('Watchlist settings coming soon')} aria-label="Watchlist settings"><Settings2 size={16} /></button></div>
          <div className="market-list">{markets.map((market) => <button className={`market-row ${watching === market.symbol ? 'market-selected' : ''}`} key={market.symbol} onClick={() => setWatching(market.symbol)}><span className="coin-token">{market.symbol.slice(0, 1)}</span><span className="market-name"><strong>{market.symbol}</strong><small>{market.name}</small></span><span className="market-spark"><Sparkline points={market.points} trend={market.trend} /></span><span className="market-value"><strong>{market.price}</strong><small className={market.trend === 'down' ? 'negative' : 'positive'}>{market.change}</small></span></button>)}</div>
          <button className="text-btn full-btn" onClick={() => showToast('Market explorer opened')}>View all markets <ChevronRight size={14} /></button>
        </section>
      </div>
      <div className="dashboard-grid lower-grid">
        <section className="surface positions-surface">
          <div className="surface-heading"><div><span className="eyebrow">Your account</span><h2>Open positions <span className="count-badge">3</span></h2></div><button className="text-btn" onClick={() => showToast('All positions are visible here')}>Manage <ChevronRight size={14} /></button></div>
          <div className="table-wrap"><table><thead><tr><th>Market</th><th>Size</th><th>Entry price</th><th>Mark price</th><th>Unrealized PnL</th><th>Leverage</th></tr></thead><tbody><tr><td><span className="table-market-icon orange">₿</span><strong>BTC-PERP</strong></td><td>0.18 BTC</td><td>$64,280.40</td><td>$68,421.80</td><td className="positive">+$745.45 <small>+18.22%</small></td><td><span className="leverage">5x</span></td></tr><tr><td><span className="table-market-icon blue">Ξ</span><strong>ETH-PERP</strong></td><td>2.40 ETH</td><td>$3,210.12</td><td>$3,482.14</td><td className="positive">+$652.85 <small>+8.47%</small></td><td><span className="leverage">3x</span></td></tr><tr><td><span className="table-market-icon violet">◎</span><strong>SOL-PERP</strong></td><td>18.00 SOL</td><td>$171.20</td><td>$164.92</td><td className="negative">-$113.04 <small>-3.67%</small></td><td><span className="leverage">2x</span></td></tr></tbody></table></div>
        </section>
        <section className="surface ritual-surface"><div className="ritual-glow" /><span className="eyebrow">Before you trade</span><h2>Take a clear breath.</h2><p>A 60-second reset can help you notice the difference between conviction and urgency.</p><button className="secondary-btn" onClick={() => navigate('/chat')}><Brain size={16} /> Start a reset</button><div className="ritual-meta"><span><Check size={14} /> 4 resets this week</span><span>+25 calm points</span></div></section>
      </div>
      {toast && <div className="toast"><Check size={15} /> {toast}</div>}
    </>
  )
}

function ChatPage() {
  const [threads, setThreads] = useState(fallbackThreads)
  const [activeId, setActiveId] = useState(fallbackThreads[0].id)
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', text: 'Good evening, Alex. Before we look at the charts, how are you arriving at the desk today?' }, { id: 2, role: 'user', text: 'A little scattered. I want to be intentional with my risk tonight.' }, { id: 3, role: 'assistant', text: 'That is a useful signal. Let’s keep the session small: name the feeling, define one invalidation level, and give yourself permission to walk away. What would “enough” look like for this session?' }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const activeThread = threads.find((thread) => thread.id === activeId) || threads[0]

  async function sendMessage(event) {
    event.preventDefault()
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text }])
    setStreaming(true)
    let replied = false
    try {
      const token = localStorage.getItem('zenheaven_token')
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ message: text, thread_id: activeId }) })
      if (!response.ok || !response.body) throw new Error('demo fallback')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let responseText = ''
      const messageId = Date.now() + 1
      setMessages((current) => [...current, { id: messageId, role: 'assistant', text: '' }])
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        events.forEach((eventBlock) => {
          const line = eventBlock.split('\n').find((lineItem) => lineItem.startsWith('data:'))
          if (!line) return
          try {
            const payload = JSON.parse(line.replace(/^data:\s*/, ''))
            if (payload.type === 'token') { responseText += payload.data; replied = true; setMessages((current) => current.map((message) => message.id === messageId ? { ...message, text: responseText } : message)) }
          } catch { /* Ignore incomplete SSE frames. */ }
        })
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setMessages((current) => [...current, { id: Date.now() + 2, role: 'assistant', text: 'I hear the scattered feeling. Try a 4–6 breath: inhale for four, exhale for six. Then write one sentence that describes your risk boundary before opening a position.' }])
    } finally {
      if (!replied) setThreads((current) => current.map((thread) => thread.id === activeId ? { ...thread, last_message: text } : thread))
      setStreaming(false)
    }
  }

  function newThread() {
    const next = { id: `thread-${Date.now()}`, title: 'New reflection', last_message: 'A new space to think clearly.', message_count: 0 }
    setThreads((current) => [next, ...current]); setActiveId(next.id); setMessages([{ id: Date.now(), role: 'assistant', text: 'A fresh space. What would you like to make room for today?' }])
  }
  return (
    <div className="chat-layout">
      <section className="surface threads-panel"><div className="panel-heading"><div><span className="eyebrow">Private sessions</span><h2>Co-pilot</h2></div><button className="add-btn" onClick={newThread}><Plus size={17} /></button></div><p className="panel-intro">A calm place to process the market and yourself.</p><button className="new-thread-btn" onClick={newThread}><Plus size={16} /> New reflection</button><div className="thread-list">{threads.map((thread) => <button className={`thread-item ${activeId === thread.id ? 'active' : ''}`} onClick={() => setActiveId(thread.id)} key={thread.id}><span className="thread-icon"><MessageCircle size={15} /></span><span><strong>{thread.title}</strong><small>{thread.last_message}</small></span><ChevronRight size={14} /></button>)}</div></section>
      <section className="surface chat-panel"><div className="chat-header"><div className="bot-avatar"><Sparkles size={18} /></div><div><h2>ZenHeaven co-pilot</h2><span><span className="live-dot" /> Here when you need a reset</span></div><button className="icon-btn chat-info"><CircleHelp size={17} /></button></div><div className="chat-context"><span className="context-icon"><ShieldCheck size={14} /></span><span>Your reflections are private and are never used to make trades.</span></div><div className="messages">{messages.map((message) => <div className={`message-row ${message.role}`} key={message.id}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={13} /> : 'AL'}</div><div className="message-bubble">{message.text || <span className="typing"><i /><i /><i /></span>}<small>{message.role === 'assistant' ? 'ZenHeaven co-pilot' : 'You'} · just now</small></div></div>)}{streaming && <div className="thinking-label"><span className="live-dot" /> Co-pilot is thinking...</div>}</div><form className="chat-composer" onSubmit={sendMessage}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Share what’s on your mind..." rows="1" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(event) } }} /><button type="submit" className="send-btn" disabled={!input.trim() || streaming}><ArrowUpRight size={17} /></button></form><div className="composer-hint"><span>Press Enter to send · Shift + Enter for a new line</span><span><ShieldCheck size={13} /> Encrypted</span></div></section>
    </div>
  )
}

function JournalPage() {
  const [entry, setEntry] = useState('')
  const [entries, setEntries] = useState([{ title: 'A slower, sharper session', date: 'Today, 5:48 PM', mood: 'Grounded', text: 'I waited for the setup instead of chasing the first move. The pause felt unfamiliar, but useful.' }, { title: 'Learning from the red', date: 'Yesterday, 9:12 PM', mood: 'Reflective', text: 'Losses can be information without becoming a verdict on my ability.' }])
  const saveEntry = async () => { if (!entry.trim()) return; const newEntry = { title: entry.trim().split(/[.!?]/)[0].slice(0, 34) || 'Untitled reflection', date: 'Just now', mood: 'Unrated', text: entry.trim() }; setEntries((current) => [newEntry, ...current]); setEntry(''); try { await apiFetch('/journal/entries', { method: 'POST', body: JSON.stringify({ content: newEntry.text, mood: 'calm', tags: ['trading'] }) }) } catch { /* Demo mode keeps the local entry. */ } }
  return <><SectionHeading eyebrow="Your private log" title="Journal" description="Turn market moments into information, not self-judgment." action={<button className="secondary-btn" onClick={() => setEntry('Today I noticed...')}><PenLine size={16} /> New entry</button>} /><div className="journal-grid"><section className="surface journal-editor"><div className="editor-top"><span className="eyebrow">Reflection prompt</span><button className="text-btn">Shuffle prompt <Zap size={14} /></button></div><h2>What did you notice in yourself today?</h2><textarea value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="The market is a mirror. Write without editing..." /><div className="editor-bottom"><span><ShieldCheck size={14} /> Private journal</span><button className="primary-btn" onClick={saveEntry}>Save reflection <ArrowUpRight size={15} /></button></div></section><aside className="surface insight-card"><div className="insight-orb"><Brain size={23} /></div><span className="eyebrow">Weekly insight</span><h3>You’re giving yourself more room to pause.</h3><p>Three of your last five entries mention waiting for clarity before entering. That’s a meaningful shift in your process.</p><div className="insight-progress"><span style={{ width: '72%' }} /></div><small>72% consistency · based on your last 10 entries</small></aside></div><section className="journal-entries"><div className="subsection-header"><div><span className="eyebrow">Your reflections</span><h2>Recent entries</h2></div><span className="muted-copy">{entries.length} entries</span></div><div className="entry-list">{entries.map((item, index) => <article className="surface entry-card" key={`${item.title}-${index}`}><div className="entry-date">{item.date}<span className="mood-pill"><span /> {item.mood}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="text-btn">Read entry <ChevronRight size={14} /></button></article>)}</div></section></>
}

function BooksPage() {
  const [query, setQuery] = useState('')
  const filtered = fallbackBooks.filter((book) => `${book.title} ${book.author} ${book.tag}`.toLowerCase().includes(query.toLowerCase()))
  return <><SectionHeading eyebrow="Curated for your edge" title="Library" description="Books for a more thoughtful relationship with risk, work, and rest." action={<div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search library" /></div>} /><div className="featured-book surface"><div className="featured-cover"><BookOpen size={30} /></div><div><span className="eyebrow">Featured this week · 4 min read</span><h2>The gap between signal and reaction</h2><p>“The first discipline is to not let a temporary feeling become a permanent decision.”</p><button className="secondary-btn">Continue reading <ArrowUpRight size={15} /></button></div><div className="featured-mark">01</div></div><div className="subsection-header library-header"><div><span className="eyebrow">Your shelves</span><h2>Recommended reading</h2></div><button className="text-btn">Browse all <ChevronRight size={14} /></button></div><div className="book-grid">{filtered.map((book) => <article className="book-card surface" key={book.title}><img src={book.cover} alt="" /><div className="book-info"><span className="tag">{book.tag}</span><h3>{book.title}</h3><p>{book.author}</p><button className="text-btn">Add to shelf <Plus size={14} /></button></div></article>)}</div></>
}

function MusicPage() {
  const [playing, setPlaying] = useState('Deep focus')
  const playlists = [{ name: 'Deep focus', count: '24 tracks', color: 'teal', icon: Brain }, { name: 'After the close', count: '18 tracks', color: 'purple', icon: MoonIcon }, { name: 'Slow mornings', count: '31 tracks', color: 'amber', icon: Heart }]
  return <><SectionHeading eyebrow="Sound for every state" title="Soundscape" description="Audio rituals to help you arrive, focus, and come down." action={<button className="secondary-btn"><Music2 size={16} /> Open Spotify</button>} /><section className="music-hero surface"><div className="album-art"><div className="album-ring ring-one" /><div className="album-ring ring-two" /><span><Headphones size={28} /></span></div><div className="music-copy"><span className="eyebrow">Now playing · curated for you</span><h2>{playing}</h2><p>Ambient frequencies for a clear, unhurried mind.</p><div className="player-controls"><button className="play-btn" onClick={() => setPlaying(playing === 'Deep focus' ? 'Deep focus · paused' : 'Deep focus')}><span>▶</span></button><div className="player-track"><div className="track-line"><span style={{ width: '38%' }} /></div><div><small>12:42</small><small>38:00</small></div></div></div></div><div className="music-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></section><div className="subsection-header"><div><span className="eyebrow">Your sound rituals</span><h2>Playlists for your process</h2></div></div><div className="playlist-grid">{playlists.map(({ name, count, color, icon: Icon }) => <button className={`playlist-card surface ${color}`} key={name} onClick={() => setPlaying(name)}><span className="playlist-icon"><Icon size={19} /></span><span><strong>{name}</strong><small>{count}</small></span><span className="playlist-play">▶</span></button>)}</div></>
}

function MoonIcon({ size = 19 }) { return <span style={{ fontSize: size }}>◒</span> }

function TherapistsPage() {
  const [booked, setBooked] = useState('')
  return <><SectionHeading eyebrow="Human support" title="Care network" description="The strongest traders know when to bring in another perspective." action={<button className="secondary-btn"><Users size={16} /> My appointments</button>} /><div className="care-banner surface"><div className="care-banner-icon"><Heart size={22} /></div><div><h2>Support is part of your strategy.</h2><p>Connect with vetted professionals who understand high-performance work and the emotional load of markets.</p></div><span className="care-banner-stat"><strong>4.9 / 5</strong><small>community rating</small></span></div><div className="subsection-header"><div><span className="eyebrow">Available this week</span><h2>Find your person</h2></div><div className="filter-pills"><button className="selected">All specialties</button><button>Online now</button></div></div><div className="therapist-grid">{fallbackTherapists.map((therapist) => <article className="therapist-card surface" key={therapist.name}><div className={`therapist-avatar ${therapist.color}`}>{therapist.initials}<span className="online-badge" /></div><div className="therapist-head"><div><h3>{therapist.name}</h3><p>{therapist.role}</p></div><button className="icon-btn"><Heart size={16} /></button></div><div className="focus-tags">{therapist.focus.split(' · ').map((focus) => <span key={focus}>{focus}</span>)}</div><div className="therapist-next"><span>Next opening</span><strong>{therapist.next}</strong></div><button className={`full-btn ${booked === therapist.name ? 'booked-btn' : 'primary-btn'}`} onClick={() => setBooked(therapist.name)}>{booked === therapist.name ? <><Check size={15} /> Request sent</> : <>View availability <ArrowUpRight size={15} /></>}</button></article>)}</div></>
}

function CoinsPage() {
  return <><SectionHeading eyebrow="Your wellbeing economy" title="Rewards" description="Calm actions compound. See how your consistency adds up." action={<button className="primary-btn"><Coins size={16} /> Redeem points</button>} /><section className="coins-hero surface"><div className="coin-balance"><span className="coin-symbol">✦</span><div><span className="eyebrow">Current balance</span><strong>2,840 <small>ZEN</small></strong><span className="positive"><ArrowUpRight size={14} /> 240 this month</span></div></div><div className="coin-level"><span>Level 4 · Steady mind</span><div className="level-progress"><span style={{ width: '64%' }} /></div><small>160 ZEN to next level</small></div></section><div className="rewards-grid"><section className="surface activity-card"><div className="subsection-header"><div><span className="eyebrow">How you earn</span><h2>Recent activity</h2></div><button className="text-btn">See all <ChevronRight size={14} /></button></div><div className="activity-list"><ActivityRow icon={PenLine} label="Completed a journal reflection" date="Today, 5:48 PM" points="+10 ZEN" /><ActivityRow icon={Brain} label="Completed a co-pilot reset" date="Today, 4:12 PM" points="+25 ZEN" /><ActivityRow icon={BookOpen} label="Finished a reading session" date="Yesterday" points="+15 ZEN" /><ActivityRow icon={Heart} label="Booked a care session" date="Sep 02" points="+50 ZEN" /></div></section><section className="surface streak-card"><div className="streak-flame">✦</div><span className="eyebrow">Consistency streak</span><strong>12 days</strong><p>You’re building a reliable practice. Keep showing up for yourself.</p><div className="week-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className={index < 6 ? 'done' : ''} key={`${day}-${index}`}>{index < 6 ? <Check size={12} /> : day}</span>)}</div></section></div></>
}

function ActivityRow({ icon: Icon, label, date, points }) { return <div className="activity-row"><span className="activity-icon"><Icon size={15} /></span><span><strong>{label}</strong><small>{date}</small></span><b>{points}</b></div> }

function AuthPage({ register = false }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const result = await apiFetch(register ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(register ? { ...form, full_name: form.username } : { username: form.username, password: form.password }) })
      localStorage.setItem('zenheaven_token', result.access_token); localStorage.setItem('zenheaven_user', JSON.stringify(result.user)); navigate('/dashboard')
    } catch {
      localStorage.setItem('zenheaven_user', JSON.stringify({ username: form.username || 'alex.lumen', calm_coins: 100 }))
      navigate('/dashboard')
    } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-visual"><Brand /><div className="auth-quote"><span className="eyebrow">A calmer trading desk</span><h1>Make space for<br /><em>better decisions.</em></h1><p>ZenHeaven helps you hold the whole picture — the charts, the mind, and everything in between.</p><div className="auth-orbit"><span className="orbit-dot one" /><span className="orbit-dot two" /><span className="orbit-dot three" /><Sparkles size={25} /></div></div><small className="auth-foot">© 2026 ZenHeaven · Built for a clearer edge</small></div><div className="auth-form-side"><div className="auth-mobile-brand"><Brand /></div><div className="auth-form-wrap"><span className="eyebrow">{register ? 'Join the desk' : 'Welcome back'}</span><h2>{register ? 'Create your account' : 'Sign in to ZenHeaven'}</h2><p>{register ? 'Start building a calmer relationship with the market.' : 'Your private space is ready when you are.'}</p><form onSubmit={submit}>{register && <label>Display name<input required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Alex Lumen" /></label>}<label>Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="alex.lumen" /></label>{register && <label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>}<label>Password<div className="password-field"><input type="password" required minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" /><span>Show</span></div></label>{error && <div className="error-text">{error}</div>}<button className="primary-btn auth-submit" disabled={loading}>{loading ? 'Opening your desk...' : register ? 'Create account' : 'Enter the desk'} <ArrowUpRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button className="social-btn"><span>G</span> Continue with Google</button><p className="auth-switch">{register ? 'Already have an account?' : 'New to ZenHeaven?'} <button onClick={() => navigate(register ? '/login' : '/register')}>{register ? 'Sign in' : 'Create an account'}</button></p></div></div></div>
}

function App() {
  const user = useMemo(readUser, [])
  return <Routes><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route element={<AppShell />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<ChatPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/music" element={<MusicPage />} /><Route path="/therapists" element={<TherapistsPage />} /><Route path="/coins" element={<CoinsPage />} /><Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} /></Route></Routes>
}

export default App
