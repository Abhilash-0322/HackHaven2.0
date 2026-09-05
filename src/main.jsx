import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, BookOpenText, Brain, Check, ChevronRight, CircleHelp, Coins, Compass, Heart,
  Home, Leaf, Library, LockKeyhole, LogOut, Menu, MessageCircle, Music2, PenLine, Play, Plus, Search,
  Send, ShieldCheck, Sparkles, Star, Sun, Timer, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import {
  api, demoBooks, demoEntries, demoSongs, demoTherapists, demoThreads, demoUser, safeApi, signIn,
} from './api'
import './styles.css'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Calm chat', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Reading room', icon: BookOpen },
  { to: '/music', label: 'Sound bath', icon: Music2 },
  { to: '/therapists', label: 'Therapists', icon: UsersRound },
  { to: '/coins', label: 'Calm coins', icon: Coins },
]

function Logo({ compact = false }) {
  return <Link className="logo" to={compact ? '/dashboard' : '/'}><span className="logo-mark"><Leaf size={17} strokeWidth={2.4} /></span><span>zenheaven</span></Link>
}

function Button({ children, variant = 'dark', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function Shell({ children, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setMobileOpen(false), [location.pathname])
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top"><Logo compact /><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
        <div className="sidebar-label">Your sanctuary</div>
        <nav className="side-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Calm chat' && <span className="new-dot" />}</NavLink>)}</nav>
        <div className="sidebar-bottom">
          <div className="side-note"><Sparkles size={16} /><span>Small steps count.<br /><b>Keep going gently.</b></span></div>
          <Link className="profile-mini" to="/dashboard"><span className="avatar avatar-small">M</span><span><b>{user?.full_name || 'Maya'}</b><small>Personal space</small></span><ChevronRight size={16} /></Link>
          <button className="logout-link" onClick={onLogout}><LogOut size={15} /> Sign out</button>
        </div>
      </aside>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <header className="mobile-header"><button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button><Logo compact /><Link to="/coins" className="coin-pill"><Coins size={15} /> {user?.calm_coins ?? 248}</Link></header>
        {children}
      </main>
    </div>
  )
}

function PublicHeader() {
  return <header className="public-header"><Logo /><nav className="public-nav"><a href="#rituals">Rituals</a><a href="#how-it-works">How it works</a><Link to="/login" className="button button-ghost button-small">Sign in</Link><Link to="/register" className="button button-dark button-small">Begin gently <ArrowRight size={15} /></Link></nav></header>
}

function Landing() {
  return <div className="landing">
    <PublicHeader />
    <section className="hero section-pad">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> ZENHEAVEN / DATA AVAILABILITY FOR CARE</div>
        <h1>Make room for what matters <em>with ZenHeaven.</em></h1>
        <p className="hero-lede">A data-availability layer for your inner life: private, present, and ready when you are.</p>
        <div className="hero-actions"><Link className="button button-dark" to="/register">Start where you are <ArrowRight size={17} /></Link><a href="#rituals" className="text-link">Explore the rituals <ChevronRight size={15} /></a></div>
        <div className="hero-trust"><div className="avatar-stack"><span className="avatar avatar-one">A</span><span className="avatar avatar-two">J</span><span className="avatar avatar-three">R</span><span className="avatar avatar-four">+</span></div><span><b>12,000+</b> people making space for themselves</span></div>
      </div>
      <div className="hero-art">
        <div className="sun-disc" /><div className="hero-figure"><div className="figure-head" /><div className="figure-body" /><div className="figure-arm" /><div className="figure-leaf leaf-a">✦</div><div className="figure-leaf leaf-b">✧</div></div>
        <div className="hero-sticker"><span>today’s<br />invitation</span><b>notice<br />one good<br />thing</b></div>
        <div className="hero-caption">Vol. 01 — arriving softly<br /><span>Illustrated for slow mornings</span></div>
      </div>
    </section>
    <section className="marquee"><span>DATA AVAILABILITY FOR CARE / CARE FOR YOUR INNER WEATHER</span><span>✳</span><span>DATA AVAILABILITY FOR CARE / CARE FOR YOUR INNER WEATHER</span><span>✳</span><span>DATA AVAILABILITY FOR CARE / CARE FOR YOUR INNER WEATHER</span></section>
    <section className="intro section-pad" id="how-it-works"><div className="section-kicker">01 / The premise</div><div className="intro-grid"><h2>Data Availability for Care is a practice to <em>return to.</em></h2><div><p>It is a relationship to tend. We bring the helpful things together — a place to talk, a page to reflect on, a song to shift the air — so you can meet yourself with a little more kindness.</p><Link className="text-link" to="/register">Find your starting point <ArrowRight size={15} /></Link></div></div></section>
    <section className="rituals section-pad" id="rituals"><div className="section-heading"><div><div className="section-kicker">02 / The collection</div><h2>A few ways to feel <em>held.</em></h2></div><span className="section-count">07 rituals / always growing</span></div><div className="ritual-grid"><Link className="ritual-card ritual-chat" to="/chat"><span className="card-index">01</span><MessageCircle size={24} /><h3>Calm chat</h3><p>Someone to listen, any hour.</p><ArrowRight className="card-arrow" size={18} /></Link><Link className="ritual-card ritual-journal" to="/journal"><span className="card-index">02</span><PenLine size={24} /><h3>Private pages</h3><p>Put the feeling somewhere.</p><ArrowRight className="card-arrow" size={18} /></Link><Link className="ritual-card ritual-books" to="/books"><span className="card-index">03</span><BookOpenText size={24} /><h3>Good books</h3><p>Words to meet you there.</p><ArrowRight className="card-arrow" size={18} /></Link><Link className="ritual-card ritual-music" to="/music"><span className="card-index">04</span><Music2 size={24} /><h3>Sound bath</h3><p>Let the room change shape.</p><ArrowRight className="card-arrow" size={18} /></Link></div></section>
    <section className="manifesto section-pad"><div className="manifesto-mark">✳</div><p>“You do not have to be<br /><em>fixed</em> to be worthy of care.”</p><span>— a note from the house</span></section>
    <footer className="public-footer section-pad"><Logo /><span>© 2025 ZenHeaven studio</span><div><a href="#rituals">Instagram</a><a href="#how-it-works">Our approach</a></div></footer>
  </div>
}

function AuthPage({ register = false }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      let user
      try { user = await signIn(register ? form : { username: form.username, password: form.password }, register) } catch { user = { ...demoUser, full_name: register ? form.full_name || form.username : demoUser.full_name } ; localStorage.setItem('zenheaven_user', JSON.stringify(user)) }
      navigate('/dashboard', { replace: true, state: { welcome: register } })
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-visual"><Logo /><div className="auth-quote"><span className="quote-mark">“</span><h2>Come as you are.<br /><em>Stay awhile.</em></h2><p>A private, thoughtful space for the days that feel a little more tender.</p></div><span className="auth-edition">ZENHEAVEN / EDITION 01</span></div><div className="auth-form-wrap"><Link className="back-link" to="/"><ChevronRight size={15} className="rotate-180" /> Back to the beginning</Link><div className="auth-form"><div className="eyebrow"><span className="eyebrow-line" /> {register ? 'A fresh beginning' : 'Welcome back'}</div><h1>{register ? 'Make a little<br /><em>room.</em>' : 'Good to see<br /><em>you again.</em>'}</h1><p className="form-intro">{register ? 'Your space is ready when you are.' : 'Let’s pick up somewhere gentle.'}</p><form onSubmit={submit}>{register && <label>Your name<input required value={form.full_name} onChange={update('full_name')} placeholder="What should we call you?" /></label>}<label>Username<input required value={form.username} onChange={update('username')} placeholder="your little corner" /></label>{register && <label>Email<input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" /></label>}<label>Password<input required minLength="6" type="password" value={form.password} onChange={update('password')} placeholder="Six quiet characters or more" /></label>{error && <div className="form-error">{error}</div>}<Button type="submit" className="full-button">{loading ? 'Opening your space…' : register ? <>Create my space <ArrowRight size={16} /></> : <>Enter ZenHeaven <ArrowRight size={16} /></>}</Button></form><div className="auth-switch">{register ? 'Already have a space?' : 'New here?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Begin gently'}</Link></div><div className="auth-safe"><LockKeyhole size={13} /> Your space is private by design</div></div></div></div>
}

function PageIntro({ eyebrow, title, children, action }) {
  return <div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1 dangerouslySetInnerHTML={{ __html: title }} />{children && <p>{children}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const firstName = (user?.full_name || 'Maya').split(' ')[0]
  return <div className="page"><div className="topbar"><span className="topbar-date">SATURDAY / SEPTEMBER 06, 2025</span><span className="topbar-status"><span className="status-dot" /> your space is private</span></div><PageIntro eyebrow="A gentle check-in" title={`Good morning, <em>${firstName}.</em>`}>There is no right way to be here. Start with what feels most useful today.</PageIntro><div className="dashboard-grid"><div className="welcome-card"><div className="welcome-orbit"><span>✳</span></div><div className="card-index">TODAY / 01</div><h2>How is your<br /><em>inner weather?</em></h2><p>A small check-in can change the shape of a day.</p><Link className="button button-paper" to="/journal">Check in <ArrowRight size={16} /></Link></div><div className="daily-card"><div className="card-head"><span>YOUR DAY, IN PIECES</span><Timer size={17} /></div><div className="daily-stat"><strong>3</strong><span>minutes of<br />care today</span></div><div className="progress-track"><span style={{ width: '42%' }} /></div><p>Keep a small promise to yourself.</p><Link className="text-link" to="/coins">See your rituals <ArrowRight size={15} /></Link></div><div className="continue-card"><div className="card-head"><span>PICK UP WHERE YOU LEFT OFF</span><ChevronRight size={17} /></div><div className="continue-visual"><div className="continue-lines"><span /><span /><span /><span /></div><div className="continue-quote">“Noticing is<br /><em>already</em> a kind<br />of change.”</div></div><Link to="/chat" className="continue-link"><span className="avatar avatar-small avatar-peach">Z</span><span><b>A gentler Monday</b><small>Continue your conversation</small></span><ArrowRight size={16} /></Link></div></div><section className="dashboard-lower"><div className="lower-heading"><div className="section-kicker">A considered collection</div><h2>Choose what you <em>need.</em></h2></div><div className="mini-grid"><Link to="/chat" className="mini-card"><span className="mini-icon"><MessageCircle size={18} /></span><span><b>Talk it through</b><small>Calm chat is here to listen.</small></span><ArrowRight size={16} /></Link><Link to="/music" className="mini-card"><span className="mini-icon mini-icon-lilac"><Music2 size={18} /></span><span><b>Change the air</b><small>A soundtrack for right now.</small></span><ArrowRight size={16} /></Link><Link to="/therapists" className="mini-card"><span className="mini-icon mini-icon-sand"><Heart size={18} /></span><span><b>Find a person</b><small>Care, with credentials.</small></span><ArrowRight size={16} /></Link></div></section></div>
}

function ChatPage() {
  const [threads, setThreads] = useState(demoThreads)
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)
  useEffect(() => { safeApi('/mental-health/threads', { threads: demoThreads }).then((result) => setThreads(result.threads || demoThreads)) }, [])
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, sending])
  async function openThread(id) {
    setActiveId(id)
    const data = await safeApi(`/mental-health/threads/${id}`, { messages: id === 'thread-1' ? [{ id: 'm1', is_user: false, content: 'Welcome back. What feels most present for you today?' }, { id: 'm2', is_user: true, content: 'I think I need to slow down.' }, { id: 'm3', is_user: false, content: 'That sounds like a wise place to begin. We can take this one small moment at a time.' }] : [] })
    setMessages(data.messages || [])
  }
  async function sendMessage(event) {
    event.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim(); setInput(''); setMessages((current) => [...current, { id: `local-${Date.now()}`, is_user: true, content: text }]); setSending(true)
    let streamed = false
    try {
      const token = localStorage.getItem('zenheaven_token')
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ message: text, thread_id: activeId }) })
      if (!response.ok || !response.body) throw new Error('stream unavailable')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = ''; streamed = true
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        decoder.decode(value).split('\n').filter((line) => line.startsWith('data:')).forEach((line) => { try { const eventData = JSON.parse(line.slice(5)); if (eventData.type === 'thread_id') setActiveId(eventData.data); if (eventData.type === 'token') { answer += eventData.data; setMessages((current) => [...current.filter((message) => message.id !== 'streaming'), { id: 'streaming', is_user: false, content: answer }]) } } catch { /* ignore partial SSE frames */ } })
      }
      setMessages((current) => current.map((message) => message.id === 'streaming' ? { ...message, id: `reply-${Date.now()}` } : message))
    } catch {
      setTimeout(() => setMessages((current) => [...current, { id: `reply-${Date.now()}`, is_user: false, content: 'Thank you for trusting this space with that. You do not have to figure it all out at once — what is one kind thing you could offer yourself in the next ten minutes?' }]), 450)
    } finally { setSending(false); if (!streamed) setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 500) }
  }
  return <div className="page chat-page"><PageIntro eyebrow="A listening space" title="Come as you are,<br /><em>talk it through.</em>"><span>Calm chat is a thoughtful place to put things down. It is not a replacement for professional care, just a gentle beginning.</span></PageIntro><div className="chat-layout"><aside className="thread-list"><div className="thread-list-head"><span>YOUR THREADS</span><button className="icon-button" onClick={() => { setActiveId(null); setMessages([]) }} aria-label="New thread"><Plus size={18} /></button></div><button className={`new-thread ${!activeId ? 'selected' : ''}`} onClick={() => { setActiveId(null); setMessages([]) }}><span className="new-thread-icon"><Sparkles size={15} /></span>New conversation</button>{threads.map((thread) => <button key={thread.id} className={`thread-item ${activeId === thread.id ? 'selected' : ''}`} onClick={() => openThread(thread.id)}><span>{thread.title}</span><small>{thread.message_count || 4} notes</small></button>)}<div className="crisis-note"><ShieldCheck size={16} /><span>If you are in immediate danger, contact local emergency services.</span></div></aside><section className="chat-window"><div className="chat-window-top"><div><span className="online-dot" /> CalmBot <small>here to listen</small></div><button className="icon-button"><CircleHelp size={18} /></button></div><div className="messages">{messages.length === 0 ? <div className="chat-empty"><div className="empty-sun">✳</div><h2>What is taking up<br /><em>space today?</em></h2><p>You can start anywhere. There is no perfect way to say it.</p><div className="suggestion-row"><button onClick={() => setInput('I feel a little overwhelmed')}>I feel overwhelmed</button><button onClick={() => setInput('Help me find some calm')}>Help me find some calm</button></div></div> : messages.map((message) => <div key={message.id} className={`message ${message.is_user ? 'message-user' : 'message-bot'}`}><span className={`message-avatar ${message.is_user ? 'message-avatar-user' : ''}`}>{message.is_user ? 'M' : '✳'}</span><div><p>{message.content}</p>{!message.is_user && <small><Sparkles size={11} /> CalmBot</small>}</div></div>)}{sending && <div className="typing"><span /><span /><span /> listening…</div>}<div ref={scrollRef} /></div><form className="chat-composer" onSubmit={sendMessage}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write what’s on your mind…" /><button aria-label="Send message"><Send size={18} /></button><span className="composer-note">Your words stay yours</span></form></section></div></div>
}

function JournalPage() {
  const [entries, setEntries] = useState(demoEntries); const [content, setContent] = useState(''); const [mood, setMood] = useState(''); const [saved, setSaved] = useState(false)
  useEffect(() => { safeApi('/journal/entries', demoEntries).then((data) => setEntries(Array.isArray(data) ? data : demoEntries)) }, [])
  async function save(event) {
    event.preventDefault(); if (!content.trim()) return
    const entry = { _id: `local-${Date.now()}`, title: 'A note to come back to', content, mood: mood || 'reflective', tags: [], created_at: new Date().toISOString() }
    try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: [] }) }) } catch { /* keep local journal useful offline */ }
    setEntries((current) => [entry, ...current]); setContent(''); setMood(''); setSaved(true); setTimeout(() => setSaved(false), 2400)
  }
  return <div className="page"><PageIntro eyebrow="Your private pages" title="Put the feeling<br /><em>somewhere.</em>"><span>There is no audience here. Just an honest page, waiting.</span><span className="privacy-line"><LockKeyhole size={13} /> encrypted in your space</span></PageIntro><div className="journal-layout"><form className="journal-editor" onSubmit={save}><div className="editor-top"><span>NEW ENTRY</span><span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What wants to be noticed today?" /><div className="mood-picker"><span>THE WEATHER IN YOU</span>{['calm', 'hopeful', 'tender', 'foggy'].map((option) => <button type="button" key={option} className={mood === option ? 'chosen' : ''} onClick={() => setMood(option)}>{option}</button>)}</div><div className="editor-bottom"><span>{saved ? <><Check size={15} /> saved softly</> : 'Take your time.'}</span><Button type="submit">Save this moment <ArrowRight size={15} /></Button></div></form><aside className="journal-aside"><div className="prompt-card"><Sparkles size={18} /><span>AN INVITATION</span><h3>What made you feel a little more like yourself today?</h3><button onClick={() => setContent('Today, I felt most like myself when ')}><ArrowRight size={16} /> Use this prompt</button></div><div className="entries-block"><div className="block-heading"><span>RECENT PAGES</span><Link to="/journal">View all <ArrowRight size={13} /></Link></div>{entries.slice(0, 3).map((entry) => <article className="entry-row" key={entry._id}><span className="entry-date">{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span><div><h3>{entry.title || 'Untitled moment'}</h3><p>{entry.content}</p></div><ChevronRight size={15} /></article>)}</div></aside></div></div>
}

function BooksPage() {
  const [books, setBooks] = useState(demoBooks); const [query, setQuery] = useState('')
  useEffect(() => { safeApi('/books/recommend-by-mood', { books: demoBooks }).then((result) => setBooks(result.books?.length ? result.books : demoBooks)) }, [])
  const filtered = useMemo(() => books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, query])
  return <div className="page"><PageIntro eyebrow="The reading room" title="Words for the<br /><em>in-between.</em>"><span>Books selected for the season you’re in — not the one you think you should be in.</span></PageIntro><div className="book-toolbar"><div className="mood-callout"><span className="mood-orb">✳</span><span><small>SELECTED FOR YOUR MOOD</small><b>Something hopeful</b></span></div><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book or author" /></label></div><div className="book-grid">{filtered.map((book, index) => <article className="book-card" key={book.id}><div className="book-cover" style={{ backgroundImage: `url(${book.image_url || demoBooks[index % demoBooks.length].image_url})` }}><span>0{index + 1}</span><button aria-label={`Save ${book.title}`}><Heart size={17} /></button></div><div className="book-meta"><h3>{book.title}</h3><p>{book.author}</p><span>{book.description || 'A thoughtful companion for your next chapter.'}</span></div></article>)}</div></div>
}

function MusicPage() {
  const [songs, setSongs] = useState(demoSongs); const [playing, setPlaying] = useState(null); const [search, setSearch] = useState('')
  useEffect(() => { safeApi('/songs', { songs: demoSongs.map((song) => song.name) }).then(() => setSongs(demoSongs)) }, [])
  const filtered = songs.filter((song) => `${song.name} ${song.artist}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="page"><PageIntro eyebrow="The sound bath" title="A soundtrack for<br /><em>right now.</em>"><span>Let the air shift. Start with a song and see where it takes you.</span></PageIntro><div className="music-feature"><div className="record-art"><div className="record"><div className="record-center">✳</div></div><span className="record-label">SIDE A / SLOW GLOW</span></div><div className="music-copy"><div className="section-kicker">A curated listening</div><h2>For when you need to<br /><em>come back to yourself.</em></h2><p>Four songs with enough room around them. Put them on low, or let one fill the whole room.</p><div className="music-controls"><button className="play-button" onClick={() => setPlaying(playing ? null : songs[0]?.name)}>{playing ? 'Ⅱ' : <Play size={20} fill="currentColor" />}</button><span>{playing ? 'Now playing' : 'Press play to begin'}<b>{playing || 'Slow Glow — a 24 min set'}</b></span></div></div></div><div className="music-list-head"><span>THE PLAYLIST / 04 TRACKS</span><label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection" /></label></div><div className="song-list">{filtered.map((song, index) => <button className={`song-row ${playing === song.name ? 'playing' : ''}`} key={song.name} onClick={() => setPlaying(playing === song.name ? null : song.name)}><span className="song-number">{playing === song.name ? <span className="equalizer"><i /><i /><i /></span> : `0${index + 1}`}</span><img src={song.album_cover_url} alt="" /><span className="song-title"><b>{song.name}</b><small>{song.artist}</small></span><span className="song-duration">{['04:23', '03:31', '03:48', '04:01'][index % 4]}</span><Play size={15} /></button>)}</div></div>
}

function TherapistsPage() {
  const [therapists, setTherapists] = useState(demoTherapists); const [selected, setSelected] = useState(null)
  useEffect(() => { safeApi('/therapists/', demoTherapists).then((data) => setTherapists(data?.length ? data : demoTherapists)) }, [])
  return <div className="page"><PageIntro eyebrow="People who care" title="A person to<br /><em>meet you there.</em>"><span>Licensed professionals, chosen for warmth as much as expertise. Take your time finding the right fit.</span></PageIntro><div className="therapist-filters"><span>SHOWING 12 PRACTITIONERS</span><button>All specialties <ChevronRight size={14} /></button><button>Any language <ChevronRight size={14} /></button><button>Sort by <b>best match</b> <ChevronRight size={14} /></button></div><div className="therapist-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist._id}><div className="therapist-photo"><img src={therapist.photo_url} alt={therapist.name} /><span className="verified"><Check size={12} /> verified</span></div><div className="therapist-info"><div className="rating"><Star size={14} fill="currentColor" /> {therapist.rating} <span>({therapist.total_sessions} sessions)</span></div><h2>{therapist.name}</h2><p>{therapist.specializations.slice(0, 2).join(' · ')}</p><span className="therapist-bio">{therapist.bio}</span><div className="therapist-bottom"><span><b>${therapist.hourly_rate}</b> / session</span><button className="text-link" onClick={() => setSelected(therapist)}>View profile <ArrowRight size={15} /></button></div></div></article>)}</div>{selected && <div className="modal-wrap" onClick={() => setSelected(null)}><div className="therapist-modal" onClick={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={() => setSelected(null)}><X size={18} /></button><img src={selected.photo_url} alt={selected.name} /><div><div className="eyebrow"><span className="eyebrow-line" /> {selected.experience_years} years experience</div><h2>{selected.name}</h2><p>{selected.bio}</p><div className="tag-row">{selected.specializations.map((tag) => <span key={tag}>{tag}</span>)}</div><Button onClick={() => setSelected(null)}>Choose a time <ArrowRight size={15} /></Button></div></div></div>}</div>
}

function CoinsPage({ user }) {
  const initialBalance = user?.calm_coins || 248
  const [balance, setBalance] = useState(initialBalance)
  const transactions = [{ description: 'Daily check-in', source: 'today', amount: '+10' }, { description: 'A conversation with CalmBot', source: 'yesterday', amount: '+5' }, { description: 'Journal entry', source: '2 days ago', amount: '+10' }]
  useEffect(() => { safeApi('/coins/balance', { balance: initialBalance }).then((data) => setBalance(data.balance ?? initialBalance)) }, [initialBalance])
  return <div className="page"><PageIntro eyebrow="Your gentle currency" title="Calm coins,<br /><em>earned slowly.</em>"><span>Small acts of care add up here. Spend them on more ways to be supported.</span></PageIntro><div className="coins-hero"><div className="coin-balance"><div className="coin-spark">✳</div><span>YOUR BALANCE</span><strong>{balance}</strong><small>calm coins</small></div><div className="coin-copy"><div className="section-kicker">THE POINT IS THE PRACTICE</div><h2>Care is worth<br /><em>something.</em></h2><p>Every journal entry, check-in, and honest conversation is a little investment in yourself.</p></div></div><div className="coin-columns"><section><div className="block-heading"><span>WAYS TO EARN</span><span>DAILY RHYTHM</span></div><div className="earn-list"><div><span className="earn-icon"><PenLine size={18} /></span><span><b>Write in your journal</b><small>Once a day</small></span><strong>+10</strong></div><div><span className="earn-icon earn-lilac"><MessageCircle size={18} /></span><span><b>Talk with CalmBot</b><small>Once a day</small></span><strong>+5</strong></div><div><span className="earn-icon earn-sand"><Sun size={18} /></span><span><b>Complete a check-in</b><small>Once a day</small></span><strong>+10</strong></div></div></section><section><div className="block-heading"><span>RECENT ACTIVITY</span><Link to="/coins">View all <ArrowRight size={13} /></Link></div><div className="transaction-list">{transactions.map((item) => <div key={item.description}><span><b>{item.description}</b><small>{item.source}</small></span><strong>{item.amount}</strong></div>)}</div></section></div><div className="coin-footnote"><Zap size={16} /> Your coins never expire. Use them when you need a little extra support.</div></div>
}

function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('zenheaven_user')) || demoUser } catch { return demoUser } })
  function logout() { localStorage.removeItem('zenheaven_token'); localStorage.removeItem('zenheaven_user'); setUser(null) }
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route path="*" element={user ? <Shell user={user} onLogout={logout}><Routes><Route path="/dashboard" element={<Dashboard user={user} />} /><Route path="/chat" element={<ChatPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/music" element={<MusicPage />} /><Route path="/therapists" element={<TherapistsPage />} /><Route path="/coins" element={<CoinsPage user={user} />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></Shell> : <Navigate to="/login" replace />} /></Routes>
}

export default function Root() { return <BrowserRouter><App /></BrowserRouter> }
