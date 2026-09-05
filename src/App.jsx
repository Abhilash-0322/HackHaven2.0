import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Headphones,
  Heart,
  Leaf,
  LineChart,
  LockKeyhole,
  MessageCircle,
  Mic2,
  Moon,
  MoreHorizontal,
  MoveUpRight,
  Pause,
  PenLine,
  Play,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Sprout,
  Sun,
  Timer,
  UserRound,
  Users,
  Wallet,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Compass },
  { to: '/chat', label: 'AI companion', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Soundscapes', icon: Headphones },
  { to: '/therapists', label: 'Guides', icon: Users },
  { to: '/coins', label: 'Calm coins', icon: Zap },
]

const moods = [
  { label: 'Drained', icon: '−', color: 'mood-lilac' },
  { label: 'Low', icon: '↘', color: 'mood-peach' },
  { label: 'Okay', icon: '•', color: 'mood-sage' },
  { label: 'Good', icon: '↗', color: 'mood-yellow' },
  { label: 'Bright', icon: '✦', color: 'mood-blue' },
]

const journalEntries = [
  { date: 'Today, 8:42 AM', title: 'A softer start', text: 'I noticed the morning light before reaching for my phone.', mood: 'Good', color: 'mood-yellow' },
  { date: 'Yesterday, 10:18 PM', title: 'Small wins count', text: 'Finished the thing I was avoiding. That felt quietly great.', mood: 'Okay', color: 'mood-sage' },
  { date: 'Monday, 7:36 PM', title: 'Room to breathe', text: 'A long walk and a voice note to Mira helped me reset.', mood: 'Good', color: 'mood-yellow' },
]

const recommendedBooks = [
  { title: 'The Art of Rest', author: 'Claudia Hammond', tag: 'For a busy mind', cover: 'rest' },
  { title: 'How to Do Nothing', author: 'Jenny Odell', tag: 'For perspective', cover: 'nothing' },
  { title: 'Wintering', author: 'Katherine May', tag: 'For a tender season', cover: 'winter' },
]

const therapists = [
  { name: 'Dr. Maya Chen', role: 'Somatic therapist', initials: 'MC', tone: 'avatar-mint', available: 'Today · 4:30 PM', rating: '4.9', sessions: '286 sessions' },
  { name: 'Alex Rivers', role: 'Mindfulness guide', initials: 'AR', tone: 'avatar-lilac', available: 'Tomorrow · 9:00 AM', rating: '5.0', sessions: '148 sessions' },
  { name: 'Priya Nair', role: 'CBT & anxiety care', initials: 'PN', tone: 'avatar-peach', available: 'Thu · 6:00 PM', rating: '4.8', sessions: '321 sessions' },
]

function Logo({ dark = false }) {
  return (
    <Link className={`logo ${dark ? 'logo-dark' : ''}`} to="/">
      <span className="logo-mark"><Leaf size={15} strokeWidth={2.5} /></span>
      <span>zenheaven</span>
    </Link>
  )
}

function Button({ children, to, variant = 'primary', icon: Icon, onClick, type = 'button' }) {
  const className = `button button-${variant}`
  if (to) return <Link className={className} to={to}>{children}{Icon && <Icon size={16} />}</Link>
  return <button className={className} onClick={onClick} type={type}>{children}{Icon && <Icon size={16} />}</button>
}

function Home() {
  return (
    <div className="landing">
      <header className="landing-nav page-width">
        <Logo />
        <nav className="landing-links">
          <a href="#rituals">Rituals</a>
          <a href="#how-it-works">How it works</a>
          <a href="#safety">Safety</a>
        </nav>
        <div className="landing-actions">
          <Link to="/login" className="text-link">Sign in</Link>
          <Button to="/register" variant="dark">Enter ZenHeaven <ArrowUpRight size={15} /></Button>
        </div>
      </header>

      <main>
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> The calm layer of the internet</div>
            <h1>A calmer<br /><em>place to be.</em></h1>
            <p className="hero-lede">ZenHeaven is a wellness world for real life. A quiet corner to check in, find perspective, and meet yourself where you are.</p>
            <div className="hero-actions">
              <Button to="/register" variant="dark" icon={ArrowRight}>Begin your ritual</Button>
              <a className="play-link" href="#how-it-works"><span className="play-circle"><Play size={13} fill="currentColor" /></span> See how it works</a>
            </div>
            <div className="hero-proof"><div className="avatar-stack"><span>AM</span><span>JR</span><span>SK</span><span>+</span></div><span>Join 12,400 people making space for themselves.</span></div>
          </div>
          <div className="hero-orbit">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-card orbit-card-top"><Sparkles size={15} /><span>your inner world<br /><strong>is worth tending to</strong></span></div>
            <div className="orbit-card orbit-card-bottom"><span className="mini-label">TODAY'S SIGNAL</span><strong>Stillness</strong><span className="signal-line"><i /> <i /> <i /> <i /> <i /></span></div>
            <div className="planet"><div className="planet-glow" /><Moon size={72} strokeWidth={1} /></div>
            <div className="floating-pill floating-pill-left"><span className="status-live" /> 2,108 finding their calm</div>
            <div className="floating-pill floating-pill-right"><Heart size={14} fill="currentColor" /> no judgment here</div>
          </div>
        </section>

        <section className="marquee-section"><div className="marquee-track"><span>CHECK IN</span><span>REFLECT</span><span>RECONNECT</span><span>REST</span><span>CHECK IN</span><span>REFLECT</span><span>RECONNECT</span><span>REST</span></div></section>

        <section className="manifesto page-width" id="how-it-works">
          <div className="section-kicker">01 — A different kind of network</div>
          <div className="manifesto-grid"><h2>Not another app<br />asking you to <em>optimize.</em></h2><div><p>We believe wellness isn’t a performance. It’s a practice of paying attention — to your body, your patterns, your people, and the quiet signals underneath it all.</p><a className="arrow-link" href="#rituals">Explore the rituals <ArrowDownRight size={18} /></a></div></div>
        </section>

        <section className="rituals page-width" id="rituals">
          <div className="section-heading"><div><div className="section-kicker">02 — Your personal toolkit</div><h2>Build a world<br />that feels <em>like you.</em></h2></div><p>One home for the little things that make a big difference.</p></div>
          <div className="ritual-grid">
            <Link className="ritual-card ritual-card-large" to="/chat"><div className="ritual-art art-orbit"><div className="art-ring" /><div className="art-core"><Brain size={27} /></div></div><div className="ritual-content"><span>01 / MIND</span><h3>A companion who listens.</h3><p>Talk it out with a thoughtful AI that remembers what matters.</p><ArrowUpRight size={20} /></div></Link>
            <Link className="ritual-card ritual-card-dark" to="/journal"><div className="ritual-content"><span>02 / NOTICE</span><h3>Put it into words.</h3><p>A private journal for the moments in between.</p><ArrowUpRight size={20} /></div><div className="scribble">your<br /><em>thoughts</em><br />belong here<span>✦</span></div></Link>
            <Link className="ritual-card ritual-card-warm" to="/music"><div className="ritual-content"><span>03 / FEEL</span><h3>Find your frequency.</h3><p>Soundscapes tuned to wherever you are today.</p><ArrowUpRight size={20} /></div><div className="waveform">{[20, 38, 54, 30, 70, 48, 84, 38, 56, 26, 66, 42, 74, 30, 52].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></Link>
            <Link className="ritual-card ritual-card-book" to="/books"><div className="book-orbit"><BookOpen size={21} /></div><div className="ritual-content"><span>04 / GROW</span><h3>A book for this chapter.</h3><p>Read into new ways of seeing.</p><ArrowUpRight size={20} /></div></Link>
          </div>
        </section>

        <section className="quote-section" id="safety"><div className="quote-mark">“</div><blockquote>There is no algorithm for being okay.<br /><em>There is only paying attention.</em></blockquote><div className="quote-caption">— The ZenHeaven principle</div></section>

        <section className="final-cta page-width"><div className="cta-orb" /><div className="section-kicker">03 — Your invitation</div><h2>Come as you are.<br /><em>Leave with more space.</em></h2><Button to="/register" variant="dark" icon={ArrowUpRight}>Make your way in</Button><p>Free to begin · private by design · always human</p></section>
      </main>
      <footer className="landing-footer page-width"><Logo /><span>© 2024 ZenHeaven</span><div><a href="#safety">Privacy</a><a href="#safety">Care guide</a><a href="#safety">Contact</a></div></footer>
    </div>
  )
}

function AppShell({ children }) {
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo dark />
        <div className="sidebar-label">Your space</div>
        <nav className="sidebar-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} to={to}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{to === '/chat' && <span className="nav-badge">AI</span>}</NavLink>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-label">Come back to yourself</div><div className="streak-card"><div className="streak-icon"><Sprout size={18} /></div><div><strong>4 day streak</strong><span>Keep the ritual going</span></div><ArrowUpRight size={15} /></div><button className="support-link"><CircleHelp size={16} /> Need a little help?</button></div>
      </aside>
      <div className="app-main">
        <header className="app-header"><div className="breadcrumbs"><span>zenheaven</span><span>/</span><strong>{navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Space'}</strong></div><div className="header-actions"><button className="icon-button" aria-label="Settings"><Settings2 size={18} /></button><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)}><span className="profile-avatar">AK</span><span>Aarav K.</span><ChevronDown size={14} /></button>{profileOpen && <div className="profile-menu"><strong>Aarav Kumar</strong><span>Free member</span><Link to="/">Exit to landing</Link></div>}</div></header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

function PageIntro({ eyebrow, title, children, action }) {
  return <div className="page-intro"><div><div className="section-kicker">{eyebrow}</div><h1>{title}</h1>{children && <p>{children}</p>}</div>{action}</div>
}

function Dashboard() {
  const [selectedMood, setSelectedMood] = useState('Good')
  return <div className="dashboard">
    <PageIntro eyebrow="Tuesday, October 22 · 09:41" title={<>Good morning, Aarav <span className="wave">✦</span></>}><span className="intro-italic">You made it here. That’s enough for today.</span></PageIntro>
    <section className="dashboard-grid">
      <div className="checkin-card panel"><div className="panel-top"><div><span className="overline">DAILY CHECK-IN</span><h2>How is your inner weather?</h2></div><span className="card-count">01 / 03</span></div><div className="weather-moods">{moods.map((mood) => <button key={mood.label} className={`weather-mood ${mood.color} ${selectedMood === mood.label ? 'selected' : ''}`} onClick={() => setSelectedMood(mood.label)}><span>{mood.icon}</span><small>{mood.label}</small></button>)}</div><div className="checkin-footer"><span>One honest word is a good place to start.</span><button className="circle-arrow"><ArrowRight size={17} /></button></div></div>
      <div className="daily-prompt panel panel-dark"><div className="panel-top"><span className="overline">A NOTE FOR YOU</span><MoreHorizontal size={18} /></div><div className="prompt-quote">“You don’t have to have it all figured out to take the next right step.”</div><div className="prompt-footer"><span>— The ZenHeaven library</span><button className="round-icon"><ArrowUpRight size={16} /></button></div></div>
      <div className="metric-card panel"><div className="metric-top"><div className="metric-icon metric-green"><LineChart size={18} /></div><span className="trend-up">+12%</span></div><span className="overline">MINDFUL MINUTES</span><strong>248 <small>min</small></strong><div className="spark-bars">{[35, 48, 28, 62, 45, 74, 58, 86, 68, 94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span className="metric-caption">vs. 221 last week</span></div>
      <div className="ritual-progress panel"><div className="panel-top"><span className="overline">YOUR RITUALS</span><button className="small-link">View all <ArrowUpRight size={13} /></button></div><div className="ritual-list"><div><span className="ritual-check done"><Check size={13} /></span><span>Morning check-in</span><small>08:42</small></div><div><span className="ritual-check done"><Check size={13} /></span><span>10 minute reset</span><small>09:03</small></div><div><span className="ritual-check"><span /></span><span>Write a few lines</span><small>+ 12 coins</small></div></div></div>
    </section>
    <section className="dashboard-lower"><div className="section-bar"><div><span className="overline">FOR THIS MOMENT</span><h2>Go where you’re pulled.</h2></div><button className="small-link">Explore all <ArrowRight size={14} /></button></div><div className="moment-grid"><Link to="/music" className="moment-card moment-sound"><div><span className="moment-label"><Headphones size={13} /> SOUND</span><h3>For a busy mind</h3><p>Ambient frequencies · 18 min</p></div><span className="moment-play"><Play size={15} fill="currentColor" /></span><div className="mini-wave">{[10, 22, 37, 56, 42, 68, 24, 46, 30, 57, 34, 20].map((height, index) => <i key={index} style={{ height: `${height}px` }} />)}</div></Link><Link to="/journal" className="moment-card moment-write"><div><span className="moment-label"><PenLine size={13} /> JOURNAL</span><h3>What’s asking<br />for attention?</h3></div><ArrowUpRight size={19} /></Link><Link to="/chat" className="moment-card moment-chat"><div><span className="moment-label"><Sparkles size={13} /> COMPANION</span><h3>Talk it out<br />with Saha.</h3></div><div className="chat-orb"><MessageCircle size={17} /></div></Link></div></section>
  </div>
}

function Chat() {
  const [messages, setMessages] = useState([{ from: 'saha', text: 'Hey Aarav. I’m here with you. What feels most present right now?' }])
  const [draft, setDraft] = useState('')
  const sendMessage = (event) => {
    event.preventDefault()
    if (!draft.trim()) return
    const message = draft.trim()
    setMessages((current) => [...current, { from: 'you', text: message }, { from: 'saha', text: 'Thank you for putting that into words. Want to stay with that feeling for a moment?' }])
    setDraft('')
  }
  return <div className="chat-page"><PageIntro eyebrow="AI COMPANION · SAHA" title="A place to say it out loud." action={<span className="online-pill"><span /> Saha is here</span>}><span className="intro-italic">No fixing. No performing. Just a little more room to think.</span></PageIntro><div className="chat-layout"><aside className="thread-list panel"><div className="thread-head"><span className="overline">RECENT THREADS</span><button className="circle-button"><Plus size={16} /></button></div>{['When everything feels loud', 'A tiny win today', 'Finding my next step'].map((thread, index) => <button className={`thread-item ${index === 0 ? 'current' : ''}`} key={thread}><span>{thread}</span><small>{index === 0 ? 'Now' : `${index + 1}d ago`}</small></button>)}<div className="thread-note"><LockKeyhole size={14} /><span>Your conversations are private<br />and encrypted.</span></div></aside><section className="chat-window panel"><div className="chat-window-head"><div className="saha-avatar"><Sparkles size={18} /></div><div><strong>Saha</strong><span>ZenHeaven companion · gentle mode</span></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="messages">{messages.map((message, index) => <div className={`message-row ${message.from}`} key={`${message.text}-${index}`}><div className="message-avatar">{message.from === 'saha' ? <Sparkles size={14} /> : 'AK'}</div><div className="message-bubble"><p>{message.text}</p><small>{message.from === 'saha' ? 'Saha' : 'You'} · just now</small></div></div>)}</div><div className="suggestions"><button onClick={() => setDraft('I feel a little overwhelmed')}>I feel overwhelmed</button><button onClick={() => setDraft('Help me slow down')}>Help me slow down</button><button onClick={() => setDraft('I have a small win')}>I have a small win</button></div><form className="chat-composer" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write what’s on your mind..." aria-label="Message Saha" /><button type="button" className="mic-button"><Mic2 size={17} /></button><button className="send-button" type="submit"><Send size={17} /></button></form><div className="chat-disclaimer"><LockKeyhole size={12} /> Saha is an AI companion, not a replacement for professional care.</div></section></div></div>
}

function Journal() {
  const [entry, setEntry] = useState('')
  const [saved, setSaved] = useState(false)
  const saveEntry = () => { if (entry.trim()) { setSaved(true); setEntry('') } }
  return <div className="journal-page"><PageIntro eyebrow="YOUR INNER LOG · 18 ENTRIES" title="Make a little room." action={<Button variant="soft" icon={Plus}>New entry</Button>}><span className="intro-italic">A private place for the things that don’t need to be solved.</span></PageIntro><div className="journal-layout"><section className="write-card panel"><div className="write-card-head"><span className="overline">NEW ENTRY · OCT 22, 2024</span><div className="write-tools"><button><Moon size={15} /></button><button><MoreHorizontal size={15} /></button></div></div><textarea value={entry} onChange={(event) => { setEntry(event.target.value); setSaved(false) }} placeholder="What’s here today?" /><div className="write-footer"><span>{saved ? <><Check size={14} /> Entry held safely.</> : 'Only you can see this.'}</span><button className="save-button" onClick={saveEntry}>{saved ? 'Saved' : 'Save entry'} <ArrowUpRight size={14} /></button></div></section><aside className="entries-column"><div className="section-bar compact"><div><span className="overline">RECENT ENTRIES</span><h2>Looking back.</h2></div><button className="small-link">All entries <ArrowRight size={14} /></button></div>{journalEntries.map((item) => <article className="entry-card" key={item.title}><div className={`entry-mood ${item.color}`}><span /></div><div><span className="entry-date">{item.date}</span><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight size={15} /></article>)}</aside></div></div>
}

function Books() {
  const [savedBooks, setSavedBooks] = useState([])
  const toggleBook = (title) => setSavedBooks((current) => current.includes(title) ? current.filter((book) => book !== title) : [...current, title])
  return <div className="books-page"><PageIntro eyebrow="THE ZENHEAVEN LIBRARY · CURATED FOR YOU" title="A good book can shift a room." action={<div className="search-box"><span>⌕</span><input placeholder="Search the library" /></div>}><span className="intro-italic">Thoughtful words for wherever you happen to be.</span></PageIntro><div className="featured-book panel"><div className="book-cover featured-cover"><div className="cover-sun" /><span>the<br /><em>comfort</em><br />book</span><small>MATT HAIG</small></div><div className="featured-copy"><span className="overline">RECOMMENDED FOR YOUR RECENT CHECK-INS</span><h2>The Comfort Book</h2><p className="book-author">Matt Haig</p><p>Notes, lists, and stories for difficult days. A gentle reminder that even the smallest things can be a source of comfort.</p><div className="book-tags"><span>Perspective</span><span>Gentle</span><span>4.8 / 5</span></div><Button variant="dark" icon={ArrowUpRight}>Open the book</Button></div><div className="featured-number">01</div></div><div className="section-bar library-heading"><div><span className="overline">SELECTED FOR YOU</span><h2>Keep exploring.</h2></div><button className="small-link">Browse all <ArrowRight size={14} /></button></div><div className="book-grid">{recommendedBooks.map((book, index) => <article className="book-card" key={book.title}><div className={`book-cover cover-${book.cover}`}><span>{book.title}</span><small>{book.author}</small></div><button className={`save-book ${savedBooks.includes(book.title) ? 'saved' : ''}`} onClick={() => toggleBook(book.title)} aria-label={`Save ${book.title}`}><Heart size={16} fill={savedBooks.includes(book.title) ? 'currentColor' : 'none'} /></button><span className="book-tag">{book.tag}</span><h3>{book.title}</h3><p>{book.author}</p></article>)}</div></div>
}

function Music() {
  const [playing, setPlaying] = useState(false)
  return <div className="music-page"><PageIntro eyebrow="SOUND ROOM · CURATED BY YOUR RHYTHM" title="Find your frequency." action={<div className="sound-status"><span className="status-live" /> Sound room open</div>}><span className="intro-italic">Some days need a song. Some need a softer sound.</span></PageIntro><div className="sound-hero panel"><div className="sound-visual"><div className="sound-center"><Headphones size={31} /></div><div className="sound-ripple ripple-a" /><div className="sound-ripple ripple-b" /><div className="sound-ripple ripple-c" /></div><div className="sound-copy"><span className="overline">YOUR CURRENT MIX · 18 MIN</span><h2>Soft focus</h2><p>Warm drones, distant rain, and enough space for your thoughts to settle.</p><div className="sound-meta"><span><Timer size={14} /> 18:24</span><span><Sparkles size={14} /> Focus</span></div><div className="player-controls"><button className="track-skip">−15</button><button className="player-play" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button><button className="track-skip">+30</button><div className="progress-line"><span /></div><span className="timecode">04:28</span></div></div></div><div className="section-bar library-heading"><div><span className="overline">MORE TO FEEL</span><h2>Rooms for every weather.</h2></div></div><div className="sound-grid">{[{ name: 'Slow mornings', time: '12 min', tone: 'sound-morning', icon: Sun }, { name: 'Let it move', time: '24 min', tone: 'sound-move', icon: Wind }, { name: 'Deep night', time: '31 min', tone: 'sound-night', icon: Moon }].map(({ name, time, tone, icon: Icon }) => <button className={`sound-card ${tone}`} key={name} onClick={() => setPlaying(true)}><div className="sound-card-icon"><Icon size={19} /></div><span>{time}</span><h3>{name}</h3><div className="card-wave">{[25, 60, 35, 78, 48, 30, 68, 40].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><ArrowUpRight size={16} /></button>)}</div></div>
}

function Therapists() {
  const [booked, setBooked] = useState('')
  return <div className="therapists-page"><PageIntro eyebrow="THE GUIDE NETWORK · HUMAN SUPPORT" title="You don’t have to hold it alone." action={<span className="verified-pill"><Check size={13} /> All guides verified</span>}><span className="intro-italic">People with the training to listen. People with the time to stay.</span></PageIntro><div className="guide-banner panel"><div className="banner-icon"><Heart size={19} /></div><div><strong>Looking for the right kind of support?</strong><p>Answer three gentle questions and we’ll find a guide who meets you where you are.</p></div><Button variant="soft" icon={ArrowRight}>Find my match</Button></div><div className="section-bar library-heading"><div><span className="overline">AVAILABLE THIS WEEK</span><h2>Meet your guides.</h2></div><div className="filter-button">All specialties <ChevronDown size={14} /></div></div><div className="guide-grid">{therapists.map((therapist) => <article className="guide-card panel" key={therapist.name}><div className={`guide-avatar ${therapist.tone}`}>{therapist.initials}<span className="verified-dot"><Check size={10} /></span></div><div className="guide-info"><span className="guide-role">{therapist.role}</span><h3>{therapist.name}</h3><div className="guide-rating"><span>★ {therapist.rating}</span><span>{therapist.sessions}</span></div></div><div className="guide-availability"><CalendarDays size={15} /><span>Next opening</span><strong>{therapist.available}</strong></div><button className="guide-book" onClick={() => setBooked(therapist.name)}>{booked === therapist.name ? <><Check size={15} /> Requested</> : <>View profile <ArrowUpRight size={15} /></>}</button></article>)}</div></div>
}

function Coins() {
  const [claimed, setClaimed] = useState(false)
  return <div className="coins-page"><PageIntro eyebrow="CALM COINS · YOUR WELLNESS ECONOMY" title="Good things compound." action={<div className="coin-balance"><span className="coin-symbol">✦</span><strong>2,480</strong><span>CALM</span></div>}><span className="intro-italic">A little proof that showing up for yourself counts.</span></PageIntro><div className="coin-grid"><section className="coin-wallet panel-dark"><div className="panel-top"><span className="overline">YOUR BALANCE</span><Wallet size={18} /></div><div className="big-balance">2,480 <small>CALM</small></div><div className="balance-footer"><span><ArrowUpRight size={14} /> +340 this week</span><button>Transaction history <ArrowRight size={14} /></button></div><div className="coin-orbit coin-orbit-one" /><div className="coin-orbit coin-orbit-two" /></section><section className="daily-goal panel"><div className="panel-top"><div><span className="overline">TODAY'S GENTLE GOAL</span><h2>Three small acts.</h2></div><span className="goal-count">2 / 3</span></div><div className="goal-list"><div className="goal-row completed"><span><Check size={13} /></span><div><strong>Daily check-in</strong><small>Completed this morning</small></div><b>+20</b></div><div className="goal-row completed"><span><Check size={13} /></span><div><strong>10 minute reset</strong><small>Completed 09:03</small></div><b>+30</b></div><div className={`goal-row ${claimed ? 'completed' : ''}`}><span>{claimed ? <Check size={13} /> : <Plus size={13} />}</span><div><strong>Write in your journal</strong><small>{claimed ? 'Completed just now' : 'A thought is enough'}</small></div><b>+40</b></div></div><button className="goal-cta" onClick={() => setClaimed(true)}>{claimed ? 'Goal complete — nice work' : 'Open journal'} <ArrowUpRight size={15} /></button></section></div><section className="coin-info"><div><span className="overline">WHY CALM COINS?</span><h2>Attention is<br /><em>valuable.</em></h2></div><div className="coin-info-copy"><p>Calm Coins are our way of making the invisible visible. They’re not about streaks or pressure — just a soft nudge to notice the care you’re already giving yourself.</p><div className="coin-rules"><span><Sprout size={16} /> Earn by showing up</span><span><Users size={16} /> Give them away</span><span><Heart size={16} /> Spend on support</span></div></div></section></div>
}

function AuthPage({ register = false }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  return <div className="auth-page"><div className="auth-art"><Logo dark /><div className="auth-quote"><span className="quote-mark">“</span><h2>There is more<br />space in you<br /><em>than you think.</em></h2><span>— A note from the quiet side</span></div><div className="auth-orbit-art"><div /><div /><Moon size={62} /></div><span className="auth-art-footer">ZENHEAVEN / 01</span></div><div className="auth-form-wrap"><div className="auth-form"><Link className="back-link" to="/"><ArrowDownRight size={15} /> Back to zenheaven</Link><div className="auth-heading"><span className="section-kicker">{register ? 'BEGIN YOUR RITUAL' : 'WELCOME BACK'}</span><h1>{register ? <>Make some<br /><em>space.</em></> : <>Good to see<br /><em>you again.</em></>}</h1><p>{register ? 'A quieter corner is waiting for you.' : 'Your space is right where you left it.'}</p></div><form onSubmit={(event) => { event.preventDefault(); navigate('/dashboard') }}><label>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@somewhere.com" /></label>{register && <label>What should we call you?<input type="text" placeholder="Your first name" /></label>}<Button type="submit" variant="dark">{register ? 'Create my space' : 'Enter my space'} <ArrowRight size={16} /></Button></form><div className="auth-divider"><span>or continue with</span></div><button className="social-button">◉ <span>Continue with Google</span></button><p className="auth-switch">{register ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create one'}</Link></p><small className="auth-legal">By continuing, you agree to our <a href="/">care terms</a> and <a href="/">privacy promise</a>.</small></div></div></div>
}

function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route element={<AppShell />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Route><Route path="*" element={<Home />} /></Routes>
}

export default App
