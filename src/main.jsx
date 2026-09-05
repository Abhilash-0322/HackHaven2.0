import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowUpRight, BookOpen, Brain, Check, ChevronRight, CircleDollarSign, Clock3,
  Coins, Compass, Heart, Home, LayoutDashboard, Library, LineChart, LockKeyhole,
  LogOut, Menu, MessageCircle, Music2, PenLine, Plus, Search, Send, Settings,
  ShieldCheck, Sparkles, Star, TrendingUp, UserRound, Users, Wallet, X, Zap,
} from 'lucide-react'
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, demoBooks, demoSongs, demoTherapists } from './api'
import './styles.css'

const demoUser = { id: 'demo-user', username: 'mira', email: 'mira@zenheaven.app', full_name: 'Mira K.', calm_coins: 1280 }
const creators = [
  { name: 'Mina Park', handle: '@minapark', ticker: '$MINA', color: 'peach', followers: '82.4K', price: '3.84', change: '+18.6%', avatar: 'https://i.pravatar.cc/160?img=47' },
  { name: 'Kai Sato', handle: '@kaimakes', ticker: '$KAI', color: 'violet', followers: '41.2K', price: '1.96', change: '+9.2%', avatar: 'https://i.pravatar.cc/160?img=12' },
  { name: 'Noor Elahi', handle: '@noorcreates', ticker: '$NOOR', color: 'green', followers: '24.9K', price: '0.88', change: '+6.4%', avatar: 'https://i.pravatar.cc/160?img=32' },
]

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zenheaven_user') || 'null'))
  const navigate = useNavigate()
  const signIn = (data) => {
    const nextUser = data?.user || demoUser
    if (data?.access_token) localStorage.setItem('zenheaven_token', data.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(nextUser))
    setUser(nextUser)
    navigate('/dashboard')
  }
  const signOut = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={signIn} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={signIn} />} />
      <Route element={<AppShell user={user || demoUser} onSignOut={signOut} />}>
        <Route path="/dashboard" element={<Dashboard user={user || demoUser} />} />
        <Route path="/chat" element={<Chat user={user || demoUser} />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/books" element={<Books />} />
        <Route path="/music" element={<Music />} />
        <Route path="/therapists" element={<Therapists user={user || demoUser} />} />
        <Route path="/coins" element={<CoinsPage user={user || demoUser} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span>zenheaven</Link>
        <div className="landing-links"><a href="#how">How it works</a><a href="#creators">Creators</a><a href="#community">Community</a></div>
        <div className="landing-actions"><Link to="/login" className="text-button">Log in</Link><Link to="/register" className="lime-button">Create account <ArrowUpRight size={15} /></Link></div>
      </nav>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse-dot" /> The creator economy, made personal</div>
            <h1>Your attention<br /><em>has value.</em></h1>
            <p>ZenHeaven lets you support the people who inspire you — and share in their journey. Discover creator tokens, collect access, and belong to something real.</p>
            <div className="hero-buttons"><Link to="/register" className="lime-button large">Start exploring <ArrowUpRight size={18} /></Link><a href="#how" className="outline-button large">See how it works <ChevronRight size={17} /></a></div>
            <div className="hero-proof"><div className="avatar-stack"><img src="https://i.pravatar.cc/60?img=5" /><img src="https://i.pravatar.cc/60?img=11" /><img src="https://i.pravatar.cc/60?img=25" /><span>+</span></div><span>Join 18,400 early supporters</span></div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-token"><span className="token-star">✦</span><strong>$MINA</strong><small>MINA PARK</small><div className="token-value">3.84 <span>+18.6%</span></div><div className="token-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="float-card float-top"><TrendingUp size={15} /><b>+18.6%</b><small>this week</small></div>
            <div className="float-card float-bottom"><Heart size={14} fill="currentColor" /><span>2,481 people<br /><b>believe in Mina</b></span></div>
          </div>
        </section>
        <section className="ticker-strip"><span>Built for the next wave of independent voices</span><div><b>CREATIVE FREEDOM</b><b>OWNERSHIP</b><b>COMMUNITY</b><b>TRANSPARENCY</b></div></section>
        <section className="section-block" id="how">
          <div className="section-heading"><div><span className="section-kicker">A new social layer</span><h2>Back the people<br /><em>you believe in.</em></h2></div><p>Creators get a direct, aligned way to grow. Supporters get a closer seat at the table — with utility, not empty hype.</p></div>
          <div className="feature-grid"><Feature number="01" icon={<Compass />} title="Find your people" text="Explore a living network of artists, builders and thinkers shaping culture on their own terms." /><Feature number="02" icon={<Wallet />} title="Collect a piece" text="Hold creator tokens to unlock private drops, conversations, events and the story behind the work." /><Feature number="03" icon={<Sparkles />} title="Grow together" text="Your support becomes momentum. Share in the wins, celebrate the milestones, stay close." /></div>
        </section>
        <section className="section-block creator-section" id="creators">
          <div className="section-heading compact"><div><span className="section-kicker">On the radar</span><h2>Creators worth<br /><em>showing up for.</em></h2></div><Link to="/register" className="outline-button">View all creators <ArrowUpRight size={16} /></Link></div>
          <div className="creator-grid">{creators.map((creator) => <CreatorCard key={creator.ticker} creator={creator} />)}</div>
        </section>
        <section className="join-panel" id="community"><div><span className="section-kicker">Your next chapter</span><h2>Come for the tokens.<br /><em>Stay for the people.</em></h2></div><div><p>A quieter, more human corner of the internet is waiting.</p><Link to="/register" className="ink-button">Join ZenHeaven <ArrowUpRight size={16} /></Link></div></section>
      </main>
      <footer className="landing-footer"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span>zenheaven</Link><span>© 2024 ZenHeaven. The social token platform for meaningful fandom.</span><span>Made for people who care.</span></footer>
    </div>
  )
}

function Feature({ number, icon, title, text }) {
  return <article className="feature-card"><span className="feature-number">{number}</span><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p><ArrowUpRight className="feature-arrow" size={17} /></article>
}

function CreatorCard({ creator }) {
  return <article className={`creator-card ${creator.color}`}><div className="creator-card-top"><span className="creator-category">CREATOR TOKEN</span><button aria-label={`Follow ${creator.name}`}><Plus size={17} /></button></div><div className="creator-profile"><img src={creator.avatar} alt="" /><div><h3>{creator.name}</h3><span>{creator.handle}</span></div></div><div className="creator-token-row"><div><small>Token price</small><strong>{creator.price} <span>USD</span></strong></div><div className="positive">{creator.change}</div></div><div className="creator-card-bottom"><span>{creator.ticker}</span><span>{creator.followers} supporters <ArrowUpRight size={13} /></span></div></article>
}

function AppShell({ user, onSignOut }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const nav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/coins', icon: Coins, label: 'Creator tokens' },
    { to: '/chat', icon: MessageCircle, label: 'CalmBot', badge: '5' },
    { to: '/journal', icon: PenLine, label: 'Journal' },
    { to: '/books', icon: BookOpen, label: 'Library' },
    { to: '/music', icon: Music2, label: 'Sound room' },
    { to: '/therapists', icon: Users, label: 'Therapists' },
  ]
  return <div className="app-shell"><aside className={`sidebar ${mobileOpen ? 'open' : ''}`}><div className="sidebar-brand"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={15} /></span>zenheaven</Link><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={19} /></button></div><div className="workspace-label">YOUR SPACE</div><nav className="side-nav">{nav.map(({ to, icon: Icon, label, badge }) => <NavLink onClick={() => setMobileOpen(false)} key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{badge && <b>{badge}</b>}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-token"><div className="token-mini">✦</div><div><small>YOUR BALANCE</small><strong>{user.calm_coins?.toLocaleString() || '1,280'} <span>ZEN</span></strong></div><ArrowUpRight size={15} /></div><Link to="/"><Settings size={17} /> Settings</Link><button className="signout" onClick={onSignOut}><LogOut size={17} /> Sign out</button></div></aside><div className="app-main"><header className="app-header"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="crumb"><span>ZenHeaven</span><ChevronRight size={14} /><b>{location.pathname === '/dashboard' ? 'Overview' : location.pathname.slice(1)}</b></div><div className="header-actions"><button className="icon-button"><Search size={18} /></button><div className="header-divider" /><div className="user-pill"><span className="user-avatar">{(user.full_name || user.username || 'M')[0]}</span><span className="user-name">{user.full_name || user.username || 'Mira K.'}</span><ChevronRight size={15} /></div></div></header><div className="page-wrap"><Outlet /></div></div></div>
}

function PageTitle({ eyebrow, title, children }) {
  return <div className="page-title"><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1></div>{children}</div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user.calm_coins || 1280)
  const [goals, setGoals] = useState([])
  useEffect(() => {
    Promise.allSettled([api.balance(), api.goals()]).then(([balanceResult, goalsResult]) => {
      if (balanceResult.status === 'fulfilled') setBalance(balanceResult.value.balance)
      if (goalsResult.status === 'fulfilled') setGoals(goalsResult.value)
    })
  }, [])
  const goalList = goals.length ? goals : [{ title: 'Check in with CalmBot', coins: 5, completed: false }, { title: 'Write in your journal', coins: 15, completed: true }, { title: 'Complete mood check', coins: 5, completed: false }]
  return <><PageTitle eyebrow="SATURDAY, SEPTEMBER 5" title={<>Good evening, <em>{(user.full_name || 'Mira').split(' ')[0]}.</em></>}><Link to="/coins" className="lime-button">Open token market <ArrowUpRight size={15} /></Link></PageTitle><div className="welcome-banner"><div><span className="live-label"><span className="pulse-dot" /> YOUR WELLBEING SNAPSHOT</span><h2>Make space for what<br /><em>moves you.</em></h2><p>You’ve been showing up for yourself for <b>6 days</b>. Keep your rhythm going.</p><Link to="/journal" className="ink-button">Continue your practice <ArrowUpRight size={15} /></Link></div><div className="banner-orb"><div className="orb-ring" /><span>6</span><small>DAY<br />STREAK</small></div></div><div className="stat-grid"><Stat label="Zen balance" value={balance.toLocaleString()} unit="ZEN" change="+12.4%" icon={<Coins />} /><Stat label="People you back" value="08" unit="CREATORS" change="+2 this month" icon={<Heart />} /><Stat label="Wellbeing score" value="78" unit="/ 100" change="↑ 4 pts this week" icon={<Brain />} /></div><div className="dashboard-grid"><section className="dashboard-card activity-card"><div className="card-heading"><div><span className="section-kicker">YOUR ACTIVITY</span><h3>Little actions, real momentum.</h3></div><button className="more-button">This week <ChevronRight size={14} /></button></div><div className="activity-chart"><div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-area"><div className="chart-grid-lines" /><svg viewBox="0 0 700 200" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d7f85b" stopOpacity=".36" /><stop offset="100%" stopColor="#d7f85b" stopOpacity="0" /></linearGradient></defs><path d="M0 172 C35 164 51 116 93 132 S148 148 187 101 S239 112 277 91 S327 111 360 75 S419 95 454 108 S491 90 520 50 S569 78 599 32 S656 63 700 20 V200 H0Z" fill="url(#chartFill)" /><path d="M0 172 C35 164 51 116 93 132 S148 148 187 101 S239 112 277 91 S327 111 360 75 S419 95 454 108 S491 90 520 50 S569 78 599 32 S656 63 700 20" fill="none" stroke="#b4d83d" strokeWidth="3" /></svg><div className="chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div></div></section><section className="dashboard-card goals-card"><div className="card-heading"><div><span className="section-kicker">TODAY'S QUEST</span><h3>Keep the streak alive.</h3></div><Zap size={19} className="gold-icon" /></div><div className="goal-progress"><div><strong>{goalList.filter((goal) => goal.completed).length} / {goalList.length}</strong><span>completed</span></div><div className="progress-track"><i style={{ width: `${(goalList.filter((goal) => goal.completed).length / goalList.length) * 100}%` }} /></div></div><div className="goal-list">{goalList.slice(0, 3).map((goal, index) => <div className={`goal-row ${goal.completed ? 'done' : ''}`} key={goal.id || index}><span className="goal-check">{goal.completed ? <Check size={13} /> : <span />}</span><span>{goal.title}</span><b>+{goal.coins} <small>ZEN</small></b></div>)}</div><Link to="/journal" className="text-link">View all quests <ArrowUpRight size={14} /></Link></section></div><section className="dashboard-card token-table-card"><div className="card-heading"><div><span className="section-kicker">YOUR PORTFOLIO</span><h3>Creators you’re backing.</h3></div><Link to="/coins" className="text-link">Explore market <ArrowUpRight size={14} /></Link></div><div className="token-table">{creators.map((creator, index) => <div className="token-row" key={creator.ticker}><span className="rank">0{index + 1}</span><img src={creator.avatar} alt="" /><div className="token-name"><strong>{creator.name}</strong><span>{creator.ticker}</span></div><div className="token-chart"><div className={`mini-spark spark-${index}`} /></div><b>${creator.price}</b><span className="positive">{creator.change}</span><span className="token-action">View <ArrowUpRight size={14} /></span></div>)}</div></section></>
}

function Stat({ label, value, unit, change, icon }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}<small>{unit}</small></div><span className="stat-change">{change}</span></div>
}

function CoinsPage() {
  const [activeTab, setActiveTab] = useState('discover')
  return <><PageTitle eyebrow="THE TOKEN MARKET" title={<>Support <em>what matters.</em></>}><button className="outline-button"><LineChart size={15} /> Market overview</button></PageTitle><div className="market-hero"><div><span className="live-label"><span className="pulse-dot" /> LIVE MARKET</span><h2>Attention is the<br /><em>new membership.</em></h2><p>Creator tokens give your support a signal — and unlock a closer relationship with the work you love.</p></div><div className="market-stat"><span>TOTAL MARKET CAP</span><strong>$2.84M</strong><b>↑ 24.8% <small>this month</small></b></div></div><div className="tabs"><button className={activeTab === 'discover' ? 'selected' : ''} onClick={() => setActiveTab('discover')}>Discover creators</button><button className={activeTab === 'following' ? 'selected' : ''} onClick={() => setActiveTab('following')}>Your collection <span>8</span></button></div><div className="market-grid">{creators.concat([{ name: 'Elio Santos', handle: '@elio.wav', ticker: '$ELIO', color: 'blue', followers: '18.3K', price: '2.14', change: '+4.8%', avatar: 'https://i.pravatar.cc/160?img=68' }]).map((creator) => <CreatorCard key={creator.ticker} creator={creator} />)}</div></>
}

function Chat({ user }) {
  const [messages, setMessages] = useState([{ role: 'bot', text: `Hey ${(user.full_name || 'there').split(' ')[0]}. I’m here with you. What’s taking up space in your mind today?` }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const send = async (event) => {
    event.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setMessages((current) => [...current, { role: 'user', text }])
    setSending(true)
    try {
      const result = await api.chat({ message: text, user_id: user.id })
      setMessages((current) => [...current, { role: 'bot', text: result.response }])
    } catch {
      setMessages((current) => [...current, { role: 'bot', text: 'Thank you for sharing that. Try taking one slow breath, then name one thing you can make gentler for yourself in the next ten minutes.' }])
    } finally { setSending(false) }
  }
  return <><PageTitle eyebrow="A QUIET PLACE TO LAND" title={<>Talk it <em>through.</em></>}><span className="secure-note"><ShieldCheck size={14} /> Private & encrypted</span></PageTitle><div className="chat-layout"><aside className="chat-aside"><div className="chat-agent"><div className="agent-avatar"><Sparkles size={20} /></div><div><strong>CalmBot</strong><span>Always here for you <i /></span></div></div><div className="chat-tip"><Sparkles size={15} /><p>“You don’t have to solve everything today. You only have to be here.”</p></div><span className="section-kicker">SUGGESTED STARTERS</span>{['I feel a little overwhelmed', 'Help me reset my day', 'I want to build a habit'].map((starter) => <button className="starter" key={starter} onClick={() => setInput(starter)}>{starter}<ArrowUpRight size={14} /></button>)}</aside><section className="chat-window"><div className="chat-window-top"><span><span className="pulse-dot" /> CalmBot is online</span><button><Settings size={16} /></button></div><div className="messages">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}><div className="message-avatar">{message.role === 'bot' ? <Sparkles size={14} /> : (user.full_name || 'M')[0]}</div><div><p>{message.text}</p>{message.role === 'bot' && index > 0 && <small>+5 ZEN · just now</small>}</div></div>)}{sending && <div className="message bot"><div className="message-avatar"><Sparkles size={14} /></div><div className="typing"><i /><i /><i /></div></div>}</div><form className="chat-input" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Share what’s on your mind..." /><button aria-label="Send message"><Send size={17} /></button></form><span className="chat-disclaimer">CalmBot offers support and reflection, not medical advice. If you’re in crisis, please contact local emergency services.</span></section></div></>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [text, setText] = useState('')
  const [mood, setMood] = useState('hopeful')
  const [saved, setSaved] = useState(false)
  useEffect(() => { api.entries().then(setEntries).catch(() => setEntries([{ _id: '1', title: 'The morning felt possible', content: 'I took a slow walk and noticed how much lighter the air felt.', mood: 'calm', created_at: new Date().toISOString() }])) }, [])
  const saveEntry = async () => {
    if (!text.trim()) return
    const entry = { content: text.trim(), mood, tags: ['reflection'] }
    try { const created = await api.createEntry(entry); setEntries((current) => [created, ...current]) } catch { setEntries((current) => [{ ...entry, _id: Date.now(), title: 'A note to myself', created_at: new Date().toISOString() }, ...current]) }
    setText(''); setSaved(true); setTimeout(() => setSaved(false), 2200)
  }
  return <><PageTitle eyebrow="YOUR INNER WORLD" title={<>Give your thoughts<br /><em>some room.</em></>}><button className="lime-button" onClick={() => document.querySelector('.journal-editor')?.focus()}><Plus size={16} /> New entry</button></PageTitle><div className="journal-layout"><section className="journal-editor-card"><div className="editor-top"><span><PenLine size={16} /> SATURDAY · SEPT 05, 2024</span><span className="save-state">{saved ? <><Check size={14} /> Saved</> : 'Autosave on'}</span></div><textarea className="journal-editor" value={text} onChange={(event) => setText(event.target.value)} placeholder="What’s present for you right now?" /><div className="editor-footer"><div className="mood-select"><span>Feeling</span>{['calm', 'hopeful', 'tender', 'foggy'].map((item) => <button className={mood === item ? 'picked' : ''} onClick={() => setMood(item)} key={item}>{item}</button>)}</div><button className="ink-button" onClick={saveEntry}>Save reflection <ArrowUpRight size={15} /></button></div></section><aside className="prompt-card"><span className="section-kicker">A LITTLE PROMPT</span><Sparkles size={21} className="prompt-spark" /><h3>What would feel like enough for today?</h3><p>You don’t need a perfect answer. Just start with what feels true.</p><button className="text-link" onClick={() => setText('What would feel like enough for today is...')}>Use this prompt <ArrowUpRight size={14} /></button></aside></div><section className="journal-history"><div className="card-heading"><div><span className="section-kicker">YOUR REFLECTIONS</span><h3>Looking back with kindness.</h3></div><span className="entry-count">{entries.length || 0} entries</span></div>{entries.length === 0 ? <div className="empty-state"><BookOpen size={25} /><p>Your first reflection is waiting here.</p></div> : entries.slice(0, 4).map((entry) => <article className="journal-row" key={entry._id}><span className={`mood-dot ${entry.mood || 'calm'}`} /><div><strong>{entry.title || 'Untitled reflection'}</strong><p>{entry.content}</p></div><time>{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time><ChevronRight size={15} /></article>)}</section></>
}

function Books() {
  const [books, setBooks] = useState(demoBooks)
  const [query, setQuery] = useState('')
  useEffect(() => { api.booksByMood().then((result) => result.books?.length && setBooks(result.books)).catch(() => {}) }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const result = await api.searchBooks(query); if (result.books?.length) setBooks(result.books) } catch { /* Keep curated books on API outage. */ } }
  return <><PageTitle eyebrow="THE ZENHEAVEN LIBRARY" title={<>A good book can<br /><em>change the weather.</em></>}><form className="search-field" onSubmit={search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" /></form></PageTitle><div className="library-callout"><div><span className="section-kicker">PICKED FOR YOUR MOOD</span><h2>Stories for a softer<br />kind of <em>day.</em></h2><p>Because the right words can meet you exactly where you are.</p></div><div className="book-stack"><div /><div /><div /></div></div><div className="book-grid">{books.map((book, index) => <article className="book-card" key={book.id || index}><div className="book-cover"><img src={book.image_url} alt="" /><span>0{index + 1}</span></div><div className="book-info"><h3>{book.title}</h3><p>by {book.author}</p><span>{book.description?.slice(0, 86) || 'A thoughtful read for your current season.'}</span><button className="text-link">Explore book <ArrowUpRight size={14} /></button></div></article>)}</div></>
}

function Music() {
  const [songs, setSongs] = useState(demoSongs)
  const [selected, setSelected] = useState('Good Days')
  const [recommendations, setRecommendations] = useState(['Golden Hour', 'Bloom', 'Sunset Lover'])
  useEffect(() => { api.songs().then((result) => result.songs?.length && setSongs(result.songs.slice(0, 12))).catch(() => {}) }, [])
  const findRecommendations = async (song) => { setSelected(song); try { const result = await api.recommendations(song); if (result.recommendations?.length) setRecommendations(result.recommendations.map((item) => item.name)) } catch { setRecommendations(demoSongs.filter((item) => item !== song).slice(0, 3)) } }
  return <><PageTitle eyebrow="THE SOUND ROOM" title={<>Put on something<br /><em>that feels like you.</em></>}><span className="playing-pill"><span className="equalizer"><i /><i /><i /></span> Your listening space</span></PageTitle><div className="music-layout"><section className="now-playing"><div className="album-art"><div className="vinyl" /><span>✦</span></div><div className="now-copy"><span className="section-kicker">NOW PLAYING</span><h2>{selected}</h2><p>Mood-matched mix · ZenHeaven Radio</p><div className="music-progress"><i /></div><div className="music-times"><span>1:24</span><span>3:48</span></div><div className="music-controls"><button>↶</button><button className="play-button">Ⅱ</button><button>↷</button></div></div></section><section className="mix-card"><div className="card-heading"><div><span className="section-kicker">FOR YOUR CURRENT VIBE</span><h3>Keep the feeling going.</h3></div><Music2 size={19} /></div><div className="song-list">{recommendations.map((song, index) => <button className={`song-row ${song === selected ? 'selected' : ''}`} key={song} onClick={() => findRecommendations(song)}><span className="song-number">{song === selected ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><span className="song-thumb" /><span>{song}</span><small>{['3:42', '4:01', '2:58'][index] || '3:20'}</small><ArrowUpRight size={14} /></button>)}</div></section></div><section className="song-explorer"><div className="card-heading"><div><span className="section-kicker">MUSIC LIBRARY</span><h3>Find your next repeat.</h3></div><span className="entry-count">{songs.length} tracks</span></div><div className="song-pills">{songs.map((song) => <button className={song === selected ? 'active' : ''} onClick={() => findRecommendations(song)} key={song}>{song}</button>)}</div></section></>
}

function Therapists() {
  const [therapists, setTherapists] = useState(demoTherapists)
  const [booked, setBooked] = useState('')
  useEffect(() => { api.therapists().then((result) => result.length && setTherapists(result)).catch(() => {}) }, [])
  return <><PageTitle eyebrow="PEOPLE WHO CAN HELP" title={<>Support that meets<br /><em>you where you are.</em></>}><span className="secure-note"><LockKeyhole size={14} /> Vetted & confidential</span></PageTitle><div className="therapy-intro"><div><span className="section-kicker">FIND YOUR FIT</span><h2>There’s no one right<br />way to feel better.</h2></div><p>Our network of licensed professionals is here for the whole picture — the messy, hopeful, in-between parts too.</p></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id}><img src={therapist.photo_url} alt="" /><div className="therapist-content"><div className="therapist-heading"><div><h3>{therapist.name}</h3><span>{therapist.specializations?.slice(0, 2).join(' · ')}</span></div><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><p>{therapist.bio}</p><div className="therapist-meta"><span>{therapist.experience_years} years experience</span><span>${therapist.hourly_rate}/session</span></div><button className="outline-button full" onClick={() => setBooked(therapist._id)}>{booked === therapist._id ? <><Check size={15} /> Request sent</> : <>View availability <ArrowUpRight size={15} /></>}</button></div></article>)}</div></>
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { const result = isRegister ? await api.register(form) : await api.login({ username: form.username, password: form.password }); onAuth(result) } catch (requestError) { setError(requestError.message); if (requestError.message.includes('fetch')) onAuth({ user: { ...demoUser, full_name: form.full_name || form.username || 'Mira K.' } }) } finally { setLoading(false) }
  }
  return <div className="auth-page"><Link to="/" className="brand auth-brand"><span className="brand-mark"><Sparkles size={15} /></span>zenheaven</Link><div className="auth-shell"><div className="auth-visual"><span className="section-kicker">A more human internet</span><h1>Find your<br /><em>people.</em></h1><p>Support the voices that make you feel more like yourself.</p><div className="auth-quote">“The best communities don’t just give you a place to belong. They give you a reason to show up.”</div><span className="auth-quote-by">— a note from the ZenHeaven community</span></div><div className="auth-form-wrap"><div className="auth-form-heading"><span className="section-kicker">{isRegister ? 'WELCOME IN' : 'WELCOME BACK'}</span><h2>{isRegister ? 'Create your space.' : 'Good to see you again.'}</h2><p>{isRegister ? 'Start building a more intentional feed.' : 'Pick up right where you left off.'}</p></div><form className="auth-form" onSubmit={submit}>{isRegister && <label>Full name<input value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} placeholder="How should we call you?" required /></label>}<label>Username<input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="yourname" required /></label>{isRegister && <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" required /></label>}<label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" minLength="6" required /></label>{error && <div className="form-error">{error}<button type="button" onClick={() => onAuth({ user: { ...demoUser, username: form.username || 'mira' } })}>Continue in demo mode</button></div>}<button className="ink-button full" disabled={loading}>{loading ? 'Opening your space…' : isRegister ? 'Create my account' : 'Log in to ZenHeaven'} <ArrowUpRight size={16} /></button></form><div className="auth-switch">{isRegister ? 'Already have an account?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></div><span className="auth-terms">By continuing, you agree to our Terms and Privacy Policy.</span></div></div></div>
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>)
