import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CloudSun,
  Coins,
  Copy,
  Database,
  ExternalLink,
  Headphones,
  HeartPulse,
  Hexagon,
  Home,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Network,
  NotebookPen,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', path: '/', icon: Home },
      { label: 'Oracle feed', path: '/dashboard', icon: Network },
      { label: 'Ask the oracle', path: '/chat', icon: MessageCircle, badge: '3' },
      { label: 'Journal', path: '/journal', icon: NotebookPen },
    ],
  },
  {
    label: 'Discover',
    items: [
      { label: 'Reading room', path: '/books', icon: BookOpen },
      { label: 'Sound bath', path: '/music', icon: Headphones },
      { label: 'Guides', path: '/therapists', icon: Users },
    ],
  },
]

const pulseData = [34, 42, 38, 56, 47, 65, 54, 71, 62, 79, 75, 92]
const oracleRows = [
  { source: 'Restfulness', icon: CloudSun, value: '82', unit: 'good', change: '+12.4%', time: '2m ago', color: 'mint' },
  { source: 'Focus index', icon: Brain, value: '68', unit: 'steady', change: '+4.8%', time: '12m ago', color: 'blue' },
  { source: 'Social energy', icon: Users, value: '44', unit: 'low', change: '-3.2%', time: '26m ago', color: 'orange' },
  { source: 'Recovery signal', icon: HeartPulse, value: '76', unit: 'good', change: '+8.1%', time: '41m ago', color: 'purple' },
]

function Logo({ compact = false }) {
  return (
    <Link to="/" className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><Hexagon size={17} strokeWidth={2.4} /></span>
      {!compact && <span>zen<span className="brand-accent">heaven</span></span>}
    </Link>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/chat" element={<AppShell><ChatPage /></AppShell>} />
      <Route path="/journal" element={<AppShell><JournalPage /></AppShell>} />
      <Route path="/books" element={<AppShell><BooksPage /></AppShell>} />
      <Route path="/music" element={<AppShell><MusicPage /></AppShell>} />
      <Route path="/therapists" element={<AppShell><TherapistsPage /></AppShell>} />
      <Route path="/coins" element={<AppShell><CoinsPage /></AppShell>} />
      <Route path="*" element={<AppShell><Dashboard /></AppShell>} />
    </Routes>
  )
}

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const currentLabel = location.pathname === '/' ? 'Overview' : navGroups.flatMap((group) => group.items).find((item) => item.path === location.pathname)?.label || 'Overview'

  return (
    <div className="app-shell">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'is-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="network-status"><span className="status-dot" /> Oracle network <span className="status-live">LIVE</span></div>
        <nav className="side-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.items.map(({ label, path, icon: Icon, badge }) => (
                <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `side-link ${isActive || (path === '/' && location.pathname === '/') ? 'active' : ''}`}>
                  <Icon size={17} strokeWidth={1.9} />
                  <span>{label}</span>
                  {badge && <span className="nav-badge">{badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
          <div className="nav-group">
            <p className="nav-label">Economy</p>
            <NavLink to="/coins" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              <Coins size={17} strokeWidth={1.9} /><span>ZHN coins</span><span className="nav-live-dot" />
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={15} /></div>
            <p className="upgrade-title">Unlock deeper signals</p>
            <p className="upgrade-copy">Connect more data sources and go deeper.</p>
            <button className="text-button">Explore plus <ArrowUpRight size={13} /></button>
          </div>
          <NavLink to="/therapists" className="side-link quiet"><CircleHelp size={17} /><span>Need a human?</span></NavLink>
          <div className="profile-row">
            <div className="avatar avatar-lilac">AM</div>
            <div><strong>Alex Morgan</strong><span>Free explorer</span></div>
            <MoreHorizontal size={17} className="profile-more" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>ZenHeaven</span><ChevronRight size={13} /><strong>{currentLabel}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16} /><input placeholder="Search your signals" aria-label="Search your signals" /></div>
            <button className="icon-button notification-button" aria-label="Notifications"><Radio size={17} /><span /></button>
            <button className={`wallet-button ${connected ? 'connected' : ''}`} onClick={() => setConnected(!connected)}>
              <Wallet size={16} /> {connected ? '0x8A...4F1B' : 'Connect'} <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, action }) {
  return (
    <div className="page-intro">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{copy && <p className="intro-copy">{copy}</p>}</div>
      {action}
    </div>
  )
}

function Dashboard() {
  const [activeRange, setActiveRange] = useState('7D')
  return (
    <>
      <PageIntro eyebrow="Saturday, September 05, 2026" title={<>Good evening, Alex <span className="wave">✦</span></>} copy="Your inner weather is looking clear. Here’s what the network picked up." action={<button className="primary-button" onClick={() => document.querySelector('.signal-card')?.scrollIntoView({ behavior: 'smooth' })}><Sparkles size={16} /> Read my signals</button>} />
      <section className="hero-grid">
        <div className="signal-card panel">
          <div className="card-topline"><div><span className="live-kicker"><span className="status-dot" /> LIVE SIGNAL</span><h2>Your calm is compounding.</h2><p>Based on 14 verified data points across your day.</p></div><div className="score-ring"><span>78</span><small>/100</small></div></div>
          <div className="signal-graph">
            <div className="graph-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="graph-area">
              <div className="grid-lines"><i /><i /><i /><i /><i /></div>
              <svg viewBox="0 0 700 190" preserveAspectRatio="none" className="line-svg" aria-label="Calm signal graph">
                <defs><linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#63d5ad" stopOpacity=".28" /><stop offset="1" stopColor="#63d5ad" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 142 C34 126 44 140 72 121 S112 82 143 109 S190 111 220 89 S267 119 291 78 S336 77 364 88 S402 93 431 54 S469 73 503 58 S544 79 568 39 S610 58 642 30 S677 41 700 22 L700 190 L0 190Z" fill="url(#area-fill)" />
                <path d="M0 142 C34 126 44 140 72 121 S112 82 143 109 S190 111 220 89 S267 119 291 78 S336 77 364 88 S402 93 431 54 S469 73 503 58 S544 79 568 39 S610 58 642 30 S677 41 700 22" fill="none" stroke="#73dfb9" strokeWidth="3" strokeLinecap="round" />
                <circle cx="642" cy="30" r="5" fill="#07131f" stroke="#b7f9dc" strokeWidth="3" />
              </svg>
              <div className="graph-x-labels"><span>Aug 30</span><span>Aug 31</span><span>Sep 01</span><span>Sep 02</span><span>Sep 03</span><span>Sep 04</span><span>Today</span></div>
            </div>
          </div>
          <div className="graph-footer"><span><i className="legend-dot mint" /> Calm signal</span><div className="range-tabs">{['24H', '7D', '30D'].map((range) => <button className={activeRange === range ? 'active' : ''} key={range} onClick={() => setActiveRange(range)}>{range}</button>)}</div></div>
        </div>
        <div className="side-stack">
          <div className="panel mini-stat-card">
            <div className="mini-card-heading"><span className="icon-square purple"><Zap size={16} /></span><span className="muted-label">NETWORK HEALTH</span><MoreHorizontal size={17} /></div>
            <div className="stat-row"><strong>99.98%</strong><span className="trend up"><ArrowUpRight size={14} />0.14%</span></div>
            <div className="mini-bar"><span style={{ width: '88%' }} /></div><p className="micro-copy">All 12 nodes are responding normally</p>
          </div>
          <div className="panel mini-stat-card">
            <div className="mini-card-heading"><span className="icon-square orange"><Clock3 size={16} /></span><span className="muted-label">NEXT CHECK-IN</span><MoreHorizontal size={17} /></div>
            <div className="stat-row"><strong>Tomorrow</strong><span className="time-copy">09:30 AM</span></div>
            <p className="micro-copy">A gentle prompt from your future self</p><button className="inline-link">Edit check-in <ArrowUpRight size={13} /></button>
          </div>
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">NETWORK SNAPSHOT</p><h2>Signals worth noticing</h2></div><button className="ghost-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>View all signals <ArrowUpRight size={14} /></button></div>
        <div className="signal-grid">{oracleRows.map((item) => <SignalTile key={item.source} {...item} />)}</div>
      </section>
      <section className="lower-grid">
        <div className="panel activity-panel">
          <div className="section-heading compact"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Moments in the network</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div>
          <ActivityItem icon={NotebookPen} color="mint" title="Journal signal synced" copy="You named three things that felt light." time="Today, 6:42 PM" />
          <ActivityItem icon={Music2} color="purple" title="Sound bath completed" copy="12 minutes of ambient focus." time="Today, 4:18 PM" />
          <ActivityItem icon={TrendingUp} color="orange" title="Focus signal rose" copy="A 14% lift after your afternoon walk." time="Today, 2:05 PM" />
          <button className="full-link">Open activity log <ArrowUpRight size={14} /></button>
        </div>
        <div className="panel ask-panel">
          <div className="ask-glow"><Waves size={27} /></div><p className="eyebrow">ORACLE PROMPT</p><h2>What’s taking up space today?</h2><p>Ask without needing the perfect words. The oracle is listening.</p><Link to="/chat" className="primary-button">Start a conversation <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </>
  )
}

function SignalTile({ source, icon: Icon, value, unit, change, time, color }) {
  return <div className="panel signal-tile"><div className={`icon-square ${color}`}><Icon size={16} /></div><div className="tile-label"><span>{source}</span><small>{time}</small></div><div className="tile-value"><strong>{value}</strong><span>{unit}</span></div><span className={`trend ${change.startsWith('-') ? 'down' : 'up'}`}>{change.startsWith('-') ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{change}</span></div>
}

function ActivityItem({ icon: Icon, color, title, copy, time }) {
  return <div className="activity-item"><div className={`icon-square ${color}`}><Icon size={16} /></div><div><strong>{title}</strong><p>{copy}</p></div><time>{time}</time></div>
}

function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'oracle', text: 'Good evening, Alex. I’m here. What signal are you noticing in yourself right now?' }, { role: 'user', text: 'I feel like I’m carrying a lot, but I can’t quite name what it is.' }, { role: 'oracle', text: 'That sounds like a real place to be. We don’t have to name it all at once. Would it help to start with where you feel it most — in your body, your thoughts, or your surroundings?' }])
  const [draft, setDraft] = useState('')
  const sendMessage = () => { if (!draft.trim()) return; setMessages([...messages, { role: 'user', text: draft.trim() }, { role: 'oracle', text: 'I hear you. Let’s stay with that for a moment and make a little room around it.' }]); setDraft('') }
  return <div className="chat-page"><PageIntro eyebrow="PRIVATE CONVERSATION · ENCRYPTED" title="Ask the oracle" copy="A quiet place to untangle what’s on your mind. No perfect words required." action={<button className="ghost-button"><LockKeyhole size={14} /> Private session</button>} /><div className="chat-layout"><div className="panel chat-window"><div className="chat-header"><div className="oracle-avatar"><Waves size={19} /></div><div><strong>Oracle guide</strong><span><i className="status-dot" /> Available now</span></div><button className="icon-button"><Settings2 size={17} /></button></div><div className="message-list">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'oracle' ? <Waves size={14} /> : 'AM'}</div><div className="message-bubble">{message.text}<span>{index === messages.length - 1 ? 'just now' : 'earlier'}</span></div></div>)}</div><div className="suggestion-row">{['Help me slow down', 'I need perspective', 'Give me a reset'].map((suggestion) => <button key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</button>)}</div><div className="chat-input"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Write what’s true right now..." /><button onClick={sendMessage} aria-label="Send message"><Send size={17} /></button></div></div><aside className="chat-side"><div className="panel quiet-card"><Sparkles size={18} className="card-icon" /><p className="eyebrow">A SMALL REMINDER</p><h3>You can be a work in progress and still deserve rest.</h3><span className="quote-mark">“</span></div><div className="panel context-card"><p className="eyebrow">SESSION CONTEXT</p><div><span>Current signal</span><strong>Calm · 78</strong></div><div><span>Last check-in</span><strong>Today, 6:42 PM</strong></div><button className="inline-link">Manage context <Settings2 size={13} /></button></div></aside></div></div>
}

function JournalPage() {
  const [mood, setMood] = useState('Grounded')
  const [entry, setEntry] = useState('')
  const [saved, setSaved] = useState(false)
  const moods = [['Bright', '☀'], ['Grounded', '◒'], ['Tender', '♡'], ['Restless', '∿'], ['Heavy', '·']]
  const saveEntry = () => { if (entry.trim()) { setSaved(true); setEntry('') } }
  return <><PageIntro eyebrow="YOUR PRIVATE LOG" title="Journal the signal" copy="The fastest way to hear yourself is to make a little room for the honest version." action={<button className="ghost-button"><CalendarDays size={14} /> September 2026 <ChevronDown size={14} /></button>} /><div className="journal-layout"><div className="panel journal-composer"><div className="composer-top"><div><p className="eyebrow">TODAY · SEP 05</p><h2>How is your inner weather?</h2></div><div className="weather-orb"><CloudSun size={24} /></div></div><p className="prompt-copy">There is no right answer. Just the one that feels most true.</p><div className="mood-row">{moods.map(([label, symbol]) => <button className={mood === label ? 'selected' : ''} key={label} onClick={() => setMood(label)}><span>{symbol}</span>{label}</button>)}</div><textarea value={entry} onChange={(event) => { setEntry(event.target.value); setSaved(false) }} placeholder="Start with: I notice..." /><div className="composer-footer"><span><LockKeyhole size={13} /> Only you can see this</span><button className="primary-button" onClick={saveEntry}>{saved ? <><Check size={15} /> Saved to the network</> : <><Plus size={15} /> Save entry</>}</button></div></div><div className="panel reflection-card"><p className="eyebrow">YOUR WEEK IN WORDS</p><h2>More grounded than last week.</h2><p>Four entries this week mention space, breathing, or slowing down. Your signal is learning what it needs.</p><div className="word-cloud"><span className="large">space</span><span>quiet</span><span className="accent">breathe</span><span>enough</span><span className="small">walk</span><span className="accent">soft</span></div><button className="full-link">See all reflections <ArrowUpRight size={14} /></button></div></div><section className="section-block journal-history"><div className="section-heading compact"><div><p className="eyebrow">RECENT ENTRIES</p><h2>Your signal, in your words</h2></div><button className="ghost-button">View calendar <CalendarDays size={14} /></button></div><div className="entry-list"><EntryCard date="SEP 04" title="A slower morning is still a morning." mood="Grounded" copy="I took the long way home today. The world looked different when I stopped trying to get somewhere so quickly." /><EntryCard date="SEP 02" title="I made space for the good thing." mood="Bright" copy="The call with Mira left me lighter. I want to remember that connection can feel easy." /><EntryCard date="AUG 30" title="Naming the worry made it smaller." mood="Tender" copy="Not gone. Just no longer taking up the whole room." /></div></section></>
}

function EntryCard({ date, title, mood, copy }) {
  return <article className="entry-card"><div className="entry-date">{date}<span>{mood}</span></div><div><h3>{title}</h3><p>{copy}</p></div><button className="icon-button"><MoreHorizontal size={17} /></button></article>
}

function BooksPage() {
  const books = [{ title: 'Wintering', author: 'Katherine May', tag: 'Rest & renewal', gradient: 'book-sand', rating: '4.8' }, { title: 'The Comfort Book', author: 'Matt Haig', tag: 'Gentle perspective', gradient: 'book-lilac', rating: '4.7' }, { title: 'How to Do Nothing', author: 'Jenny Odell', tag: 'Attention & presence', gradient: 'book-mint', rating: '4.6' }, { title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', tag: 'Belonging', gradient: 'book-forest', rating: '4.9' }]
  return <><PageIntro eyebrow="THE READING ROOM" title="Books for your current chapter" copy="Curated by the oracle from the signals you’re tending to lately." action={<button className="primary-button"><Sparkles size={15} /> Get a recommendation</button>} /><div className="filter-row"><button className="filter-pill active">For you</button><button className="filter-pill">Rest & recovery</button><button className="filter-pill">Perspective</button><button className="filter-pill">Starting over</button><button className="filter-pill">Browse all <ChevronDown size={13} /></button></div><section className="book-grid">{books.map((book, index) => <article className="book-card panel" key={book.title}><div className={`book-cover ${book.gradient}`}><span>{String(index + 1).padStart(2, '0')}</span><BookOpen size={23} /><strong>{book.title}</strong><small>{book.author}</small></div><div className="book-details"><div className="tag-line"><span>{book.tag}</span><span className="rating"><Star size={12} fill="currentColor" /> {book.rating}</span></div><h3>{book.title}</h3><p>{book.author}</p><button className="outline-button">View book <ArrowUpRight size={13} /></button></div></article>)}</section><div className="panel book-prompt"><div className="prompt-orb"><BookOpen size={21} /></div><div><p className="eyebrow">NOT SURE WHERE TO START?</p><h2>Tell us what you need to feel.</h2></div><Link to="/chat" className="ghost-button">Ask the oracle <ArrowUpRight size={14} /></Link></div></>
}

function MusicPage() {
  const [playing, setPlaying] = useState(null)
  const tracks = [{ title: 'Soft focus', artist: 'Ambient Assembly', length: '42:18', color: 'track-blue' }, { title: 'Warm light', artist: 'Mizu', length: '28:04', color: 'track-orange' }, { title: 'Held', artist: 'The Quiet Hours', length: '36:52', color: 'track-lilac' }, { title: 'Open window', artist: 'Soluna', length: '31:26', color: 'track-mint' }]
  return <><PageIntro eyebrow="SOUND BATH" title="A softer frequency" copy="Music selected for where your nervous system is right now." action={<button className="ghost-button"><Headphones size={14} /> Connect Spotify</button>} /><div className="music-feature panel"><div className="album-art"><div className="art-sun" /><div className="art-wave wave-one" /><div className="art-wave wave-two" /><span>ZH / 01</span></div><div className="feature-copy"><p className="eyebrow">ORACLE MIX · 42 MINUTES</p><h2>Make room for stillness.</h2><p>A slow, warm collection for putting down the day without needing to solve it.</p><div className="feature-meta"><span><Waves size={14} /> 12 tracks</span><span><Activity size={14} /> 68 BPM avg.</span></div><button className="primary-button" onClick={() => setPlaying(playing === 'mix' ? null : 'mix')}>{playing === 'mix' ? <><span className="pause-bars">Ⅱ</span> Pause mix</> : <><Play size={15} fill="currentColor" /> Play mix</>}</button></div></div><section className="section-block track-section"><div className="section-heading compact"><div><p className="eyebrow">MADE FOR YOUR SIGNAL</p><h2>Today’s listening</h2></div><button className="ghost-button">See all mixes <ArrowUpRight size={14} /></button></div><div className="track-list">{tracks.map((track, index) => <div className={`track-row ${playing === index ? 'is-playing' : ''}`} key={track.title}><span className="track-number">{playing === index ? <Waves size={14} /> : `0${index + 1}`}</span><div className={`track-thumb ${track.color}`}><Music2 size={16} /></div><div className="track-info"><strong>{track.title}</strong><span>{track.artist}</span></div><div className="track-wave">{[2, 5, 3, 7, 4, 8, 5, 3, 6, 4, 7, 2].map((height, i) => <i style={{ height: `${height * 2}px` }} key={i} />)}</div><span className="track-length">{track.length}</span><button className="round-play" onClick={() => setPlaying(playing === index ? null : index)}>{playing === index ? 'Ⅱ' : <Play size={13} fill="currentColor" />}</button></div>)}</div></section></>
}

function TherapistsPage() {
  const [booked, setBooked] = useState(null)
  const people = [{ name: 'Dr. Maya Chen', role: 'Anxiety & life transitions', initials: 'MC', color: 'avatar-mint', rating: '4.98', next: 'Today, 7:30 PM' }, { name: 'Jordan Williams', role: 'Burnout & relationships', initials: 'JW', color: 'avatar-orange', rating: '4.96', next: 'Tomorrow, 10:00 AM' }, { name: 'Dr. Leila Ahmed', role: 'Mindfulness & identity', initials: 'LA', color: 'avatar-lilac', rating: '4.99', next: 'Tomorrow, 2:15 PM' }]
  return <><PageIntro eyebrow="HUMAN SUPPORT" title="When you want a human signal" copy="Real people, carefully matched. Choose a guide who understands the terrain." action={<button className="ghost-button"><Settings2 size={14} /> Match preferences</button>} /><div className="trust-banner panel"><div className="trust-icon"><ShieldCheck size={22} /></div><div><strong>Every guide is verified and licensed.</strong><p>Your conversations are private, encrypted, and yours.</p></div><span className="trust-stats"><strong>1,240+</strong> conversations held this week</span></div><div className="therapist-list">{people.map((person) => <article className="therapist-card panel" key={person.name}><div className={`therapist-avatar ${person.color}`}>{person.initials}<span className="verified"><Check size={10} /></span></div><div className="therapist-main"><div className="therapist-heading"><div><h3>{person.name}</h3><p>{person.role}</p></div><span className="rating"><Star size={13} fill="currentColor" /> {person.rating}</span></div><div className="therapist-tags"><span>Video & chat</span><span>Accepting new clients</span></div><div className="therapist-footer"><span><Clock3 size={14} /> Next opening: <strong>{person.next}</strong></span><button className="primary-button small" onClick={() => setBooked(person.name)}>{booked === person.name ? <><Check size={14} /> Request sent</> : <>View profile <ArrowUpRight size={14} /></>}</button></div></div></article>)}</div><div className="panel emergency-card"><div className="emergency-icon"><HeartPulse size={18} /></div><div><p className="eyebrow">NEED HELP RIGHT NOW?</p><h3>You don’t have to navigate a crisis alone.</h3><p>For immediate support, call or text <strong>988</strong> in the US and Canada.</p></div><button className="outline-button">Crisis resources <ExternalLink size={13} /></button></div></>
}

function CoinsPage() {
  const [staked, setStaked] = useState(false)
  return <><PageIntro eyebrow="ZHn ECONOMY" title="Your energy has value" copy="Use ZHN to unlock deeper reflections, support the network, and keep your care journey yours." action={<button className="wallet-button connected"><Wallet size={16} /> 0x8A...4F1B</button>} /><div className="coin-hero panel"><div><div className="coin-symbol"><Coins size={22} /></div><p className="eyebrow">YOUR BALANCE</p><div className="coin-balance">2,480 <span>ZHN</span></div><p className="balance-sub">≈ $24.80 USD <span className="trend up"><ArrowUpRight size={13} /> 6.8%</span></p></div><div className="coin-chart"><div className="chart-tooltip"><strong>$0.010</strong><span>current value</span></div><svg viewBox="0 0 420 140" preserveAspectRatio="none"><defs><linearGradient id="coin-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e6a96c" stopOpacity=".35" /><stop offset="1" stopColor="#e6a96c" stopOpacity="0" /></linearGradient></defs><path d="M0 120 C40 116 54 84 83 98 S123 81 151 92 S189 64 217 76 S260 67 282 45 S322 58 349 30 S392 35 420 11 V140 H0Z" fill="url(#coin-fill)" /><path d="M0 120 C40 116 54 84 83 98 S123 81 151 92 S189 64 217 76 S260 67 282 45 S322 58 349 30 S392 35 420 11" fill="none" stroke="#e6a96c" strokeWidth="3" /></svg><div className="chart-labels"><span>Aug 30</span><span>Sep 05</span></div></div></div><div className="coin-actions"><button className="primary-button"><Plus size={15} /> Earn ZHN</button><button className="ghost-button"><ArrowUpRight size={14} /> Send</button><button className="ghost-button"><Copy size={14} /> Copy address</button></div><div className="coin-grid"><div className="panel earn-card"><div className="mini-card-heading"><span className="icon-square mint"><TrendingUp size={16} /></span><span className="muted-label">CARE STAKING</span></div><h2>Put your calm to work.</h2><p>Stake your ZHN to support community care grants and earn a 4.2% network reward.</p><div className="stake-row"><div><strong>{staked ? '1,000' : '0'}</strong><span>ZHN staked</span></div><button className="primary-button small" onClick={() => setStaked(!staked)}>{staked ? 'Unstake' : 'Stake ZHN'}</button></div></div><div className="panel transactions"><div className="section-heading compact"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Wallet activity</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><Transaction icon={Sparkles} label="Care streak reward" amount="+120 ZHN" time="Today" positive /><Transaction icon={BookOpen} label="Reading room access" amount="-40 ZHN" time="Sep 03" /><Transaction icon={Users} label="Community care pool" amount="-250 ZHN" time="Sep 01" /></div></div></>
}

function Transaction({ icon: Icon, label, amount, time, positive }) {
  return <div className="transaction"><span className="transaction-icon"><Icon size={15} /></span><div><strong>{label}</strong><small>{time}</small></div><span className={positive ? 'amount positive' : 'amount'}>{amount}</span></div>
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  return <div className="auth-page"><div className="auth-art"><div className="auth-art-top"><Logo /></div><div className="auth-orbit"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit-core"><Hexagon size={45} strokeWidth={1.1} /><span>ZH</span></div><span className="orbit-token token-a"><CloudSun size={15} /></span><span className="orbit-token token-b"><HeartPulse size={15} /></span><span className="orbit-token token-c"><Waves size={15} /></span></div><div className="auth-art-copy"><p className="eyebrow">THE CALM INTELLIGENCE LAYER</p><h1>Make space<br />for <em>what’s true.</em></h1><p>ZenHeaven turns your everyday signals into a kinder way to understand yourself.</p><div className="auth-quote"><span>“</span><div><p>The best data point is the one that helps you come home to yourself.</p><small>— the oracle network</small></div></div></div><div className="auth-art-footer"><span>Built for your inner world</span><span>01 — 06</span></div></div><div className="auth-form-side"><div className="auth-mobile-logo"><Logo /></div><div className="auth-form-wrap"><p className="eyebrow">{isLogin ? 'WELCOME BACK' : 'BEGIN YOUR JOURNEY'}</p><h2>{isLogin ? 'Come back to yourself.' : 'Your signal starts here.'}</h2><p className="auth-copy">{isLogin ? 'Your quiet corner is waiting.' : 'A private space for reflection, support, and a little more clarity.'}</p>{submitted ? <div className="success-state"><div className="success-icon"><Check size={24} /></div><h3>You’re in.</h3><p>Your private network is ready. Let’s see what today has to say.</p><button className="primary-button" onClick={() => navigate('/')}>Enter ZenHeaven <ArrowUpRight size={15} /></button></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>{!isLogin && <label>What should we call you?<div className="input-wrap"><UserRound size={16} /><input placeholder="Alex Morgan" required /></div></label>}<label>Email address<div className="input-wrap"><span className="at-symbol">@</span><input type="email" placeholder="you@example.com" required /></div></label><label>Password<div className="input-wrap"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{isLogin && <div className="form-meta"><label className="checkbox-label"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="text-button">Forgot password?</button></div>}<button type="submit" className="primary-button auth-submit">{isLogin ? 'Sign in' : 'Create my space'} <ArrowUpRight size={15} /></button><div className="auth-divider"><span>or continue with</span></div><button type="button" className="social-button" onClick={() => setSubmitted(true)}><Wallet size={16} /> Connect a wallet</button></form>}<p className="auth-switch">{isLogin ? 'New to ZenHeaven?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p></div><div className="auth-legal">By continuing, you agree to our <a href="/">Terms</a> and <a href="/">Privacy Policy</a>.</div></div></div>
}

export default App
