/* eslint-disable no-unused-vars, react-refresh/only-export-components */
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleHelp, Coins, Heart,
  Home, Leaf, LoaderCircle, LockKeyhole, LogOut, Menu, MessageCircle, Music2, Plus, Search, Send,
  Sparkles, Star, Sun, UsersRound, X, Zap,
} from 'lucide-react'
import { api, demoBooks, demoTherapists, demoUser, getStoredUser, signIn, signOut, streamChat, tryApi } from './api'
import './styles.css'

const moods = [
  { label: 'Calm', emoji: '◒', color: 'mint' },
  { label: 'Hopeful', emoji: '✦', color: 'lemon' },
  { label: 'Anxious', emoji: '◌', color: 'lilac' },
  { label: 'Low', emoji: '☁', color: 'sky' },
]

function Logo() {
  return <Link className="brand" to="/"><span className="brand-mark"><Sparkles size={17} /></span><span>zenheaven</span></Link>
}

function BrowserShell({ children, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const nav = [
    { to: '/dashboard', label: 'Home', icon: Home, tone: 'mint' },
    { to: '/chat', label: 'Talk it out', icon: MessageCircle, tone: 'coral' },
    { to: '/journal', label: 'Journal', icon: BookOpen, tone: 'lilac' },
    { to: '/books', label: 'Library', icon: Brain, tone: 'lemon' },
    { to: '/music', label: 'Soundtrack', icon: Music2, tone: 'sky' },
    { to: '/therapists', label: 'Care team', icon: UsersRound, tone: 'peach' },
    { to: '/coins', label: 'Calm coins', icon: Coins, tone: 'yellow' },
  ]
  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top"><Logo /><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <div className="workspace-pill"><span className="avatar avatar-small">{(user?.full_name || 'A').charAt(0)}</span><span><b>{user?.full_name || 'Alex Morgan'}</b><small>my space</small></span><ChevronRight size={15} /></div>
        <nav className="tab-list">
          <p className="eyebrow side-label">Your space</p>
          {nav.map(({ to, label, icon: Icon, tone }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `arc-tab ${isActive ? 'active' : ''}`}>
              <span className={`tab-icon ${tone}`}><Icon size={17} /></span><span>{label}</span>{to === '/chat' && <i className="tab-live" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-goal"><div className="goal-top"><span>today’s gentle goal</span><span>2/3</span></div><div className="progress"><span style={{ width: '66%' }} /></div><small>One small step counts.</small></div>
          <button className="side-action"><CircleHelp size={16} /> Help center</button>
          <button className="side-action" onClick={onLogout}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <div className="mobile-bar"><button onClick={() => setMobileOpen(true)}><Menu size={20} /></button><Logo /><span className="status-dot" /></div>
      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <main className="main-area">
        <div className="browser-topline"><span className="traffic"><i /><i /><i /></span><span className="breadcrumb">{location.pathname === '/dashboard' ? 'home' : location.pathname.replace('/', '') || 'home'}</span><span className="topline-right"><span className="status-dot" /> private & encrypted</span></div>
        {children}
      </main>
    </div>
  )
}

function PageHead({ eyebrow, title, description, action }) {
  return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav"><Logo /><div className="landing-links"><a href="#why">why zenheaven</a><a href="#how">how it works</a><Link to="/login">sign in <ArrowUpRight size={14} /></Link></div></header>
      <section className="hero">
        <div className="hero-copy"><span className="kicker"><span className="sparkle-dot" /> a softer space for your mind</span><h1>Make room for<br /><em>better days.</em></h1><p>ZenHeaven is your colorful little corner of the internet for checking in, talking things out, and finding your next small step.</p><div className="hero-actions"><Link className="button button-primary" to="/register">find your footing <ArrowRight size={17} /></Link><span className="tiny-note"><span className="avatar-stack"><i>J</i><i>M</i><i>S</i></span> a safe space for 4k+ minds</span></div></div>
        <div className="hero-art">
          <div className="art-glow" /><div className="hero-window">
            <div className="window-top"><span className="traffic"><i /><i /><i /></span><span>your inner world</span><span>•••</span></div>
            <div className="window-tabs"><span className="window-tab tab-pink">home</span><span className="window-tab tab-yellow">today</span><span className="window-tab tab-blue">mood notes</span></div>
            <div className="hero-card"><div className="sun-orbit"><Sun size={34} /></div><span className="eyebrow">a tiny check-in</span><h3>How are you arriving today?</h3><div className="mood-row"><span>☹</span><span>◔</span><span className="selected">◒</span><span>◕</span><span>☺</span></div><div className="fake-input">I’m feeling a little... <ArrowRight size={15} /></div></div>
          </div>
          <div className="float-note note-one"><span>✦</span><b>no pressure,</b><small>just presence</small></div><div className="float-note note-two"><Music2 size={16} /><span>your calm mix<br /><b>is ready</b></span></div>
        </div>
      </section>
      <section className="story-strip" id="why"><div className="strip-label">a home for<br /><em>all of you</em></div><div className="strip-card"><span className="strip-number">01</span><h3>notice</h3><p>Meet yourself where you are, without having to make it pretty.</p></div><div className="strip-card"><span className="strip-number">02</span><h3>nourish</h3><p>Find tools, people, and rituals that feel like they’re made for you.</p></div><div className="strip-card"><span className="strip-number">03</span><h3>grow</h3><p>Small moments of care add up to a life that feels more like yours.</p></div></section>
      <section className="landing-bottom" id="how"><div><span className="eyebrow">your way in</span><h2>Start wherever<br /><em>you need to.</em></h2></div><div className="entry-list"><Link to="/chat"><span className="entry-icon coral"><MessageCircle size={20} /></span><span><b>Talk to someone</b><small>A judgment-free place to put it into words.</small></span><ArrowUpRight /></Link><Link to="/journal"><span className="entry-icon lilac"><BookOpen size={20} /></span><span><b>Write it down</b><small>Make sense of the noise, one line at a time.</small></span><ArrowUpRight /></Link><Link to="/music"><span className="entry-icon sky"><Music2 size={20} /></span><span><b>Change the atmosphere</b><small>A soundtrack for exactly where you are.</small></span><ArrowUpRight /></Link></div></section>
      <footer className="landing-footer"><Logo /><span>made with care for the complicated bits.</span><span>© 2025 ZenHeaven</span></footer>
    </div>
  )
}

function AuthPage({ register = false, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try { const user = await signIn(form.username, form.password, register, form.name); onAuth(user); navigate('/dashboard') } catch (err) { setError(err.message); if (register) { const user = { ...demoUser, full_name: form.name || 'Alex Morgan', username: form.username || 'alex' }; localStorage.setItem('zenheaven_user', JSON.stringify(user)); onAuth(user); navigate('/dashboard') } } finally { setLoading(false) }
  }
  return <div className="auth-page"><div className="auth-aside"><Logo /><div className="auth-quote"><span className="quote-mark">“</span><h2>You don’t have to have it all figured out to begin.</h2><p>One honest moment is enough.</p><span className="quote-line" /></div><div className="auth-art">✦<span>◒</span>☁</div></div><div className="auth-form-wrap"><Link className="back-link" to="/"><ArrowRight size={14} className="back-arrow" /> back to the open sky</Link><div className="auth-form"><span className="eyebrow">{register ? 'your space starts here' : 'welcome back, friend'}</span><h1>{register ? 'Let’s make<br /><em>some room.</em>' : 'Good to see<br /><em>you again.</em>'}</h1><p>{register ? 'A soft place to land, made just for you.' : 'Your little corner has been waiting.'}</p><form onSubmit={submit}>{register && <label>what should we call you?<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" /></label>}<label>{register ? 'email address' : 'username or email'}<input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder={register ? 'you@example.com' : 'alex'} /></label><label>password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>{error && <div className="form-error">{error} <span>Demo access is available — use any details.</span></div>}<Button disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : register ? 'create my space' : 'step inside'} <ArrowRight size={17} /></Button></form><div className="auth-switch">{register ? 'Already have a space?' : 'New around here?'} <Link to={register ? '/login' : '/register'}>{register ? 'sign in' : 'create yours'}</Link></div><small className="privacy-note"><LockKeyhole size={13} /> private by design · your thoughts belong to you</small></div></div></div>
}

function Dashboard({ user }) {
  const navigate = useNavigate()
  const [mood, setMood] = useState('Calm')
  return <div className="content dashboard"><div className="dashboard-greeting"><div><span className="eyebrow">monday, september 08</span><h1>Good morning, {user?.full_name?.split(' ')[0] || 'Alex'} <span className="wave">✦</span></h1><p>Let’s take this one gently.</p></div><div className="dashboard-avatar avatar">{(user?.full_name || 'A').charAt(0)}</div></div><div className="dashboard-grid"><section className="panel checkin-panel"><div className="panel-heading"><div><span className="eyebrow">01 · right now</span><h2>How are you arriving?</h2></div><span className="soft-label">2 min check-in</span></div><div className="mood-pills">{moods.map(item => <button key={item.label} className={`mood-pill ${mood === item.label ? 'chosen' : ''} ${item.color}`} onClick={() => setMood(item.label)}><span>{item.emoji}</span>{item.label}</button>)}</div><div className="checkin-note"><span className="quote-mark small">“</span><p>{mood === 'Calm' ? 'There’s a little stillness here. Let’s notice it.' : `It’s okay to feel ${mood.toLowerCase()}. You don’t have to rush past it.`}</p><Button variant="dark" onClick={() => navigate('/journal')}>save this moment <ArrowRight size={16} /></Button></div></section><section className="panel week-panel"><div className="panel-heading"><div><span className="eyebrow">your week in color</span><h2>Small steps, seen.</h2></div><ArrowUpRight size={18} /></div><div className="week-chart"><div className="chart-y"><span>great</span><span>okay</span><span>heavy</span></div><div className="bars">{[55, 76, 42, 68, 82, 50, 88].map((height, i) => <div className="bar-wrap" key={i}><div className={`bar bar-${i}`} style={{ height: `${height}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small></div>)}</div></div><div className="week-foot"><span><i className="legend-dot mint" /> feeling a little more grounded</span><b>+12%</b></div></section><section className="panel next-panel"><div className="next-illustration"><Leaf size={43} /></div><div><span className="eyebrow">a nudge, not a task</span><h3>Try a 3-minute reset</h3><p>Put both feet on the floor. Name five things you can see.</p><Button variant="text" onClick={() => navigate('/chat')}>take me there <ArrowRight size={15} /></Button></div></section><section className="panel explore-panel"><div className="panel-heading"><div><span className="eyebrow">your toolkit</span><h2>Keep exploring.</h2></div></div><div className="explore-links"><Link to="/books"><span className="entry-icon lemon"><BookOpen size={18} /></span><b>read something kind</b><ArrowUpRight size={15} /></Link><Link to="/therapists"><span className="entry-icon lilac"><UsersRound size={18} /></span><b>meet your care team</b><ArrowUpRight size={15} /></Link></div></section></div></div>
}

const demoMessages = [{ id: 'welcome', is_user: false, content: 'Hey, I’m here. No fixing, no performing — just a little room to say what’s true. What’s taking up space today?' }]
function ChatPage() {
  const [messages, setMessages] = useState(demoMessages)
  const [draft, setDraft] = useState('')
  const [threadId, setThreadId] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [threads, setThreads] = useState([])
  useEffect(() => { tryApi('/mental-health/threads', { threads: [] }).then(data => setThreads(data.threads || [])) }, [])
  async function send(event) {
    event?.preventDefault(); const text = draft.trim(); if (!text || thinking) return
    setDraft(''); setMessages(prev => [...prev, { id: Date.now(), is_user: true, content: text }, { id: `reply-${Date.now()}`, is_user: false, content: '', pending: true }]); setThinking(true)
    let reply = ''
    try {
      await streamChat(text, threadId, event => { if (event.type === 'thread_id') setThreadId(event.data); if (event.type === 'token') { reply += event.data; setMessages(prev => prev.map((item, i) => i === prev.length - 1 ? { ...item, content: reply, pending: false } : item)) } if (event.type === 'complete') setThinking(false) })
    } catch { reply = 'I’m here with you. The connection is taking a quiet moment, but you can still try putting one small part of it into words.'; setMessages(prev => prev.map((item, i) => i === prev.length - 1 ? { ...item, content: reply, pending: false } : item)) } finally { setThinking(false) }
  }
  return <div className="content chat-page"><PageHead eyebrow="talk it out · private space" title={<>You can say it<br /><em>as it is.</em></>} description="A quiet, judgment-free conversation with CalmBot. It’s okay if you don’t know where to start." action={<span className="privacy-chip"><LockKeyhole size={14} /> private session</span>} /><div className="chat-layout"><aside className="threads"><div className="thread-heading"><span>your conversations</span><button title="New conversation" onClick={() => { setThreadId(null); setMessages(demoMessages) }}><Plus size={16} /></button></div>{threads.length ? threads.map(thread => <button className="thread-item" key={thread.id} onClick={() => setThreadId(thread.id)}><MessageCircle size={14} /><span>{thread.title}</span></button>) : <div className="empty-threads"><span>✦</span><p>Your conversations<br />will live here.</p></div>}</aside><section className="chat-window"><div className="bot-presence"><span className="bot-orb"><Sparkles size={18} /></span><span><b>CalmBot</b><small>listening softly · online</small></span><span className="live-pill"><i /> live</span></div><div className="message-list">{messages.map(message => <div className={`message-row ${message.is_user ? 'user-message' : ''}`} key={message.id}><div className={`message-avatar ${message.is_user ? 'user' : ''}`}>{message.is_user ? 'A' : <Sparkles size={15} />}</div><div className={`message-bubble ${message.pending ? 'pending' : ''}`}>{message.pending ? <span className="typing"><i /><i /><i /></span> : message.content}</div></div>)}</div><form className="chat-compose" onSubmit={send}><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type what’s on your mind..." /><button aria-label="Send message" disabled={thinking || !draft.trim()}><Send size={17} /></button></form><p className="chat-disclaimer">CalmBot is a supportive tool, not a replacement for professional care. If you’re in immediate danger, contact local emergency services.</p></section></div></div>
}

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saved, setSaved] = useState(false)
  useEffect(() => { tryApi('/journal/entries', []).then(setEntries) }, [])
  async function saveEntry() {
    if (!content.trim()) return
    const newEntry = { _id: `local-${Date.now()}`, title: content.slice(0, 34), content, mood, created_at: new Date().toISOString() }
    setEntries(prev => [newEntry, ...prev]); setContent(''); setSaved(true); setTimeout(() => setSaved(false), 2200)
    try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [] }) }) } catch { /* local-first fallback */ }
  }
  const prompt = 'What would feel like enough for today?'
  return <div className="content"><PageHead eyebrow="journal · a place to land" title={<>Let it out,<br /><em>leave it lighter.</em></>} description="No perfect words required. This page is yours to be honest, unfinished, and human." action={<span className="streak-chip"><span>✦</span> 4 day writing streak</span>} /><div className="journal-layout"><section className="journal-editor panel"><div className="editor-top"><span className="eyebrow">today · september 08</span><span className="editor-lock"><LockKeyhole size={13} /> only you can see this</span></div><h2>{prompt}</h2><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start wherever the feeling starts..." /><div className="editor-foot"><div className="mood-select"><span>today feels</span>{['calm', 'hopeful', 'anxious', 'heavy'].map(item => <button className={mood === item ? 'selected' : ''} onClick={() => setMood(item)} key={item}>{item}</button>)}</div><Button onClick={saveEntry}>{saved ? <><Check size={16} /> saved</> : <>save entry <ArrowRight size={16} /></>}</Button></div></section><aside className="journal-side"><div className="prompt-card"><span className="eyebrow">if you need a nudge</span><p>“What’s something your future self might thank you for noticing today?”</p><button onClick={() => setContent('I’m noticing that ')}>use this prompt <ArrowRight size={14} /></button></div><div className="entries-card panel"><div className="panel-heading"><div><span className="eyebrow">your pages</span><h3>Recent reflections</h3></div><span className="count">{entries.length}</span></div>{entries.length ? entries.slice(0, 4).map(entry => <div className="entry-row" key={entry._id || entry.id}><span className="entry-mood">{entry.mood === 'calm' ? '◒' : '✦'}</span><span><b>{entry.title || 'A moment to remember'}</b><small>{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></span><ChevronRight size={15} /></div>) : <div className="empty-state"><BookOpen size={18} /><p>Your first page is waiting.</p></div>}</div></aside></div></div>
}

function BooksPage() {
  const [books, setBooks] = useState(demoBooks)
  const [query, setQuery] = useState('')
  useEffect(() => { tryApi('/books/recommend-by-mood', { books: demoBooks }).then(data => { if (data.books?.length) setBooks(data.books) }) }, [])
  async function search(event) { event.preventDefault(); if (!query) return; const data = await tryApi(`/books/search?q=${encodeURIComponent(query)}&max_results=10`, { books: demoBooks }); setBooks(data.books || demoBooks) }
  return <div className="content"><PageHead eyebrow="library · words that meet you there" title={<>A good book can be<br /><em>a soft handrail.</em></>} description="Curated by your recent mood, the books below are here to keep you company." action={<form className="search-box" onSubmit={search}><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="find a title..." /></form>} /><div className="recommend-banner"><div className="banner-sun"><Sun size={22} /></div><div><span className="eyebrow">picked for your calm</span><h3>Stories with a little more light in them.</h3><p>Based on your latest check-in · calm</p></div><span className="banner-mark">✦</span></div><div className="book-grid">{books.map((book, index) => <article className="book-card" key={book.id}><div className={`book-cover cover-${index % 4}`}>{book.image_url ? <img src={book.image_url} alt="" /> : <><span>{book.title?.split(' ').slice(0, 2).join(' ')}</span><i>✦</i></>}</div><div className="book-info"><span className="book-type">a gentle read</span><h3>{book.title}</h3><p>{book.author}</p><small>{book.description || 'A thoughtful companion for your next chapter.'}</small><button>open the cover <ArrowUpRight size={14} /></button></div></article>)}</div></div>
}

const tracks = [{ title: 'Bloom', artist: 'The Paper Kites', gradient: 'track-green' }, { title: 'Holocene', artist: 'Bon Iver', gradient: 'track-lilac' }, { title: 'Sunset Lover', artist: 'Petit Biscuit', gradient: 'track-orange' }, { title: 'Cherry Wine', artist: 'Hozier', gradient: 'track-blue' }]
function MusicPage() {
  const [playing, setPlaying] = useState(null)
  const [song, setSong] = useState('')
  const [recommendations, setRecommendations] = useState([])
  async function recommend(event) { event.preventDefault(); if (!song) return; const data = await tryApi(`/recommend?song=${encodeURIComponent(song)}`, { recommendations: tracks.map(item => ({ name: item.title, artist: item.artist })) }); setRecommendations(data.recommendations || []) }
  return <div className="content"><PageHead eyebrow="soundtrack · shift the atmosphere" title={<>Press play on<br /><em>something softer.</em></>} description="A small, mood-shaped corner for when words aren’t quite the thing." action={<span className="now-playing"><span className="equalizer"><i /><i /><i /></span> nothing playing</span>} /><div className="music-hero panel"><div className="music-orbit"><div className="orbit-center"><Music2 size={36} /></div><span>♪</span><span>♫</span><span>✦</span></div><div><span className="eyebrow">your mood mix · calm</span><h2>For slow mornings<br />and open windows.</h2><p>4 tracks · 16 minutes of breathing room</p><Button variant="dark" onClick={() => setPlaying(playing === 0 ? null : 0)}>{playing === 0 ? 'pause mix' : 'play the mix'} <span className="play-triangle">▶</span></Button></div></div><div className="music-section-heading"><div><span className="eyebrow">a few good things</span><h2>Made for this moment.</h2></div><form className="song-search" onSubmit={recommend}><input value={song} onChange={e => setSong(e.target.value)} placeholder="name a song you love..." /><button><ArrowRight size={16} /></button></form></div><div className="track-list">{(recommendations.length ? recommendations.map(item => ({ title: item.name, artist: item.artist, gradient: 'track-lilac' })) : tracks).map((track, i) => <button className={`track-row ${playing === i ? 'is-playing' : ''}`} key={`${track.title}-${i}`} onClick={() => setPlaying(playing === i ? null : i)}><span className={`album-art ${track.gradient}`}>{playing === i ? <span className="equalizer"><i /><i /><i /></span> : <Music2 size={18} />}</span><span className="track-number">{String(i + 1).padStart(2, '0')}</span><span className="track-meta"><b>{track.title}</b><small>{track.artist}</small></span><span className="track-duration">{['3:46', '5:36', '3:58', '4:01'][i] || '4:12'}</span><ArrowUpRight size={16} /></button>)}</div></div>
}

function TherapistsPage({ user }) {
  const [therapists, setTherapists] = useState(demoTherapists)
  const [selected, setSelected] = useState(null)
  const [booked, setBooked] = useState(false)
  useEffect(() => { tryApi('/therapists/', demoTherapists).then(data => { if (data?.length) setTherapists(data) }) }, [])
  async function book() {
    if (!selected) return
    const date = new Date(Date.now() + 86400000); date.setHours(10, 0, 0, 0); const end = new Date(date.getTime() + 3600000)
    try { await api('/therapists/appointments', { method: 'POST', body: JSON.stringify({ user_id: user?.id || demoUser.id, therapist_id: selected._id || selected.id, date: date.toISOString(), start_time: date.toISOString(), end_time: end.toISOString(), session_type: 'video' }) }) } catch { /* demo booking stays available */ }
    setBooked(true)
  }
  return <div className="content"><PageHead eyebrow="care team · people in your corner" title={<>Find someone who<br /><em>gets it.</em></>} description="Real humans, thoughtful care, and no need to explain why you’re looking for support." action={<span className="verified-chip"><Check size={14} /> vetted practitioners</span>} /><div className="care-note"><Heart size={17} /><span>Starting therapy is a brave, practical thing. You can browse at your own pace — there’s no pressure to book.</span></div><div className="therapist-grid">{therapists.map((therapist, index) => <article className="therapist-card panel" key={therapist._id || therapist.id}><div className={`therapist-photo photo-${index % 3}`}>{therapist.photo_url ? <img src={therapist.photo_url} alt="" /> : <span>{therapist.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>}<span className="online-dot" /></div><div className="therapist-main"><div className="therapist-name"><div><span className="eyebrow">licensed therapist</span><h3>{therapist.name}</h3></div><span className="rating"><Star size={13} fill="currentColor" /> {therapist.rating || '4.8'}</span></div><div className="specializations">{(therapist.specializations || []).slice(0, 3).map(s => <span key={s}>{s}</span>)}</div><p>{therapist.bio}</p><div className="therapist-foot"><span>from <b>${therapist.hourly_rate}</b> / session</span><Button variant="outline" onClick={() => { setSelected(therapist); setBooked(false) }}>view profile <ArrowUpRight size={14} /></Button></div></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="booking-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>{booked ? <div className="booking-success"><span className="success-mark"><Check size={24} /></span><span className="eyebrow">you’re on the calendar</span><h2>Your first step is booked.</h2><p>We’ll hold a video session with {selected.name} for you tomorrow at 10:00 AM.</p><Button onClick={() => setSelected(null)}>got it <ArrowRight size={16} /></Button></div> : <><span className="eyebrow">your potential care match</span><h2>{selected.name}</h2><p>{selected.bio}</p><div className="modal-details"><span><CalendarDays size={16} /> next opening<br /><b>tomorrow · 10:00 AM</b></span><span><Coins size={16} /> session rate<br /><b>${selected.hourly_rate} / hour</b></span></div><Button onClick={book}>book a gentle first step <ArrowRight size={16} /></Button><small>Free 15-minute intro · no commitment</small></>}</div></div>}</div>
}

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 280)
  const [transactions, setTransactions] = useState([])
  useEffect(() => { tryApi('/coins/balance', { balance: user?.calm_coins || 280 }).then(data => setBalance(data.balance ?? 280)); tryApi('/coins/transactions', []).then(setTransactions) }, [user])
  const rewards = [{ title: 'premium insights', desc: 'See patterns in your check-ins.', cost: 100, icon: Brain, tone: 'lilac' }, { title: 'custom meditation', desc: 'A guided pause, made for today.', cost: 150, icon: Leaf, tone: 'mint' }, { title: 'priority support', desc: 'Move a little faster when you need it.', cost: 300, icon: Zap, tone: 'lemon' }]
  return <div className="content"><PageHead eyebrow="calm coins · little rewards for showing up" title={<>Care is a practice.<br /><em>So is celebrating.</em></>} description="Every time you choose yourself, you earn a few coins to spend on deeper support." action={<div className="coin-balance"><Coins size={17} /><b>{balance}</b><span>coins</span></div>} /><div className="coins-layout"><section className="coin-main"><div className="coin-hero"><div className="coin-stack"><span>✦</span><Coins size={54} /></div><div><span className="eyebrow">your balance</span><strong>{balance}</strong><span className="coin-word">calm coins</span><p>+5 for a chat · +10 for a journal entry</p></div><div className="coin-confetti">✦<span>·</span>✧</div></div><div className="reward-heading"><div><span className="eyebrow">spend a little care</span><h2>Good things to choose from.</h2></div><span className="soft-label">coming soon</span></div><div className="reward-grid">{rewards.map(({ title, desc, cost, icon: Icon, tone }) => <article className="reward-card panel" key={title}><span className={`entry-icon ${tone}`}><Icon size={19} /></span><h3>{title}</h3><p>{desc}</p><button disabled={balance < cost}><Coins size={14} /> {cost} <ArrowRight size={14} /></button></article>)}</div></section><aside className="coin-side"><div className="streak-card"><span className="eyebrow">your gentle streak</span><div className="streak-number">4 <small>days</small></div><p>Showing up is the whole point.</p><div className="streak-days">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => <span className={i < 4 ? 'done' : ''} key={i}>{i < 4 ? '✦' : day}</span>)}</div></div><div className="transactions panel"><div className="panel-heading"><h3>Recent earning</h3><ArrowUpRight size={15} /></div>{(transactions.length ? transactions : [{ description: 'Daily check-in', amount: 10 }, { description: 'Made space in journal', amount: 10 }, { description: 'Talked it out', amount: 5 }]).map((transaction, i) => <div className="transaction" key={i}><span className="transaction-icon">✦</span><span><b>{transaction.description || transaction.source}</b><small>{i + 1} day ago</small></span><strong>+{transaction.amount}</strong></div>)}</div></aside></div></div>
}

function App() {
  const [user, setUser] = useState(getStoredUser() || null)
  function logout() { signOut(); setUser(null) }
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage onAuth={setUser} />} /><Route path="/register" element={<AuthPage register onAuth={setUser} />} /><Route path="*" element={user ? <BrowserShell user={user} onLogout={logout}><Routes><Route path="/dashboard" element={<Dashboard user={user} />} /><Route path="/chat" element={<ChatPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/music" element={<MusicPage />} /><Route path="/therapists" element={<TherapistsPage user={user} />} /><Route path="/coins" element={<CoinsPage user={user} />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></BrowserShell> : <Navigate to="/login" replace />} /></Routes>
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>)
