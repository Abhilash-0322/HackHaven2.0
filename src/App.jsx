import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const STORAGE_KEY = 'zenheaven-session'

const moods = [
  { label: 'Soft', emoji: '☁', color: 'lavender' },
  { label: 'Clear', emoji: '◒', color: 'sage' },
  { label: 'Tender', emoji: '♡', color: 'rose' },
  { label: 'Heavy', emoji: '◌', color: 'sand' },
]

const fallbackBooks = [
  { id: 'book-1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'Reflections on mindfulness and the quiet beauty of an unhurried life.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'The wisdom of rest and retreat in difficult seasons.' },
  { id: 'book-3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80', description: 'A generous, grounding invitation to pay attention to the living world.' },
  { id: 'book-4', title: 'The Book of Delights', author: 'Ross Gay', image_url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=500&q=80', description: 'Small notes of attention that make an ordinary day feel luminous.' },
]

const fallbackTherapists = [
  { id: 'demo-sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'], bio: 'CBT and mindfulness-based support for anxiety, low mood, and major life transitions.', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
  { id: 'demo-maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'], bio: 'Warm, collaborative therapy for relationships, identity, and building a kinder inner voice.', photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80' },
  { id: 'demo-aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Cultural Identity', 'Life Transitions'], experience_years: 7, hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi', 'Gujarati'], bio: 'Culturally sensitive support as you move through grief, change, and finding meaning.', photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80' },
]

const fallbackSongs = [
  { name: 'Bloom', artist: 'The Paper Kites', album_cover_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=500&q=80' },
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80' },
  { name: 'Mystery of Love', artist: 'Sufjan Stevens', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80' },
]

async function api(path, options = {}) {
  const token = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.access_token
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return path
}

function Icon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    chat: <><path d="M20 11.5a7.4 7.4 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L3 20l1.5-4A7.4 7.4 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    journal: <><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" /><path d="M5 18a2 2 0 0 0 2 2M9 8h6M9 12h6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 5.5V21M8 7h8" /></>,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M16 14a5 5 0 0 1 4 5" /></>,
    coin: <><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10.5c0-1.5 5-1.5 5 0s-5 1.5-5 3 5 1.5 5 0M12 4v1M12 19v1" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.home}</svg>
}

function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '' }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button button-${variant} ${className}`}>{children}</button>
}

function Logo({ compact = false }) {
  return <button className={`logo ${compact ? 'logo-compact' : ''}`} onClick={() => navigate('/')} aria-label="Go home"><span className="logo-mark">✦</span><span>zenheaven</span></button>
}

function Sidebar({ path, user, onLogout }) {
  const links = [
    ['/', 'Home', 'home'], ['/dashboard', 'My space', 'sun'], ['/chat', 'Talk it out', 'chat'],
    ['/journal', 'Journal', 'journal'], ['/books', 'Reading room', 'book'], ['/music', 'Sound bath', 'music'],
    ['/therapists', 'Find support', 'people'], ['/coins', 'Calm coins', 'coin'],
  ]
  return <aside className="sidebar">
    <Logo />
    <div className="sidebar-label">Your sanctuary</div>
    <nav>{links.map(([href, label, icon]) => <button key={href} onClick={() => navigate(href)} className={`nav-item ${path === href ? 'active' : ''}`}><Icon name={icon} /> <span>{label}</span>{href === '/chat' && <span className="nav-dot" />}</button>)}</nav>
    <div className="sidebar-bottom">
      <div className="side-note"><span className="tiny-spark">✦</span><p>There is no right way<br />to take care of yourself.</p></div>
      <div className="profile-mini"><div className="avatar">{(user?.full_name || user?.username || 'G').slice(0, 1).toUpperCase()}</div><div><strong>{user?.full_name || user?.username || 'Guest'}</strong><small>Taking it one day at a time</small></div><button onClick={onLogout} aria-label="Log out"><Icon name="logout" size={16} /></button></div>
    </div>
  </aside>
}

function MobileBar({ path }) {
  const links = [['/dashboard', 'My space', 'sun'], ['/chat', 'Talk', 'chat'], ['/journal', 'Write', 'journal'], ['/books', 'Read', 'book']]
  return <div className="mobile-bar">{links.map(([href, label, icon]) => <button key={href} onClick={() => navigate(href)} className={path === href ? 'active' : ''}><Icon name={icon} size={19} /><span>{label}</span></button>)}</div>
}

function PageHeader({ eyebrow, title, copy, action }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</header>
}

function SectionTitle({ eyebrow, title, action }) {
  return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action}</div>
}

function Shell({ children, path, user, onLogout }) {
  return <div className="app-shell"><Sidebar path={path} user={user} onLogout={onLogout} /><main className="main-content"><div className="mobile-top"><Logo compact /><button onClick={() => navigate('/dashboard')} className="mobile-menu"><Icon name="menu" /></button></div>{children}</main><MobileBar path={path} /></div>
}

function Home({ user }) {
  const [mood, setMood] = useState('')
  return <div className="home-page">
    <div className="home-top"><Logo compact /><button className="text-link" onClick={() => navigate(user ? '/dashboard' : '/login')}>{user ? 'Open my space' : 'Sign in'} <Icon name="arrow" size={16} /></button></div>
    <section className="hero"><div className="hero-copy"><div className="eyebrow">A softer place to land</div><h1>Feel a little<br /><em>more like you.</em></h1><p>ZenHeaven is a quiet collection of tools, people, and small rituals for whatever you’re carrying today.</p><div className="hero-actions"><Button onClick={() => navigate(user ? '/dashboard' : '/register')}>Begin where you are <Icon name="arrow" size={16} /></Button><button className="text-link" onClick={() => navigate('/chat')}>Meet CalmBot <span className="play-circle">▶</span></button></div></div><div className="hero-art"><div className="sun-orb" /><div className="art-leaf leaf-one">⌁</div><div className="art-leaf leaf-two">⌁</div><div className="art-copy"><span>01</span><p>Nothing to fix.<br />Just somewhere to begin.</p></div></div></section>
    <section className="mood-check"><div><div className="eyebrow">A moment of noticing</div><h2>How are you arriving?</h2><p>No labels, no judgement. Just a check-in with yourself.</p></div><div className="mood-options">{moods.map(item => <button key={item.label} onClick={() => setMood(item.label)} className={`mood-option ${item.color} ${mood === item.label ? 'selected' : ''}`}><span>{item.emoji}</span><small>{item.label}</small></button>)}</div>{mood && <div className="mood-response">You’re feeling <strong>{mood.toLowerCase()}</strong>. That’s enough information for today. <button onClick={() => navigate('/chat')}>Find a gentle next step <Icon name="arrow" size={14} /></button></div>}</section>
    <section className="home-grid"><div className="home-card quote-card"><span className="card-kicker">A note for today</span><p>“Almost everything will work again if you unplug it for a few minutes, including you.”</p><small>— Anne Lamott</small></div><button className="home-card feature-card" onClick={() => navigate('/journal')}><div><span className="card-kicker">Make room for the day</span><h3>Write it down,<br /><em>let it breathe.</em></h3></div><span className="card-arrow"><Icon name="arrow" size={18} /></span></button><button className="home-card feature-card green" onClick={() => navigate('/music')}><div><span className="card-kicker">A playlist for your nervous system</span><h3>Press play on<br /><em>something gentle.</em></h3></div><span className="card-arrow"><Icon name="arrow" size={18} /></span></button></section>
  </div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 100)
  const [streak, setStreak] = useState(3)
  useEffect(() => { Promise.all([api('/coins/balance'), api('/coins/streak')]).then(([b, s]) => { setBalance(b.balance); setStreak(s.current_streak) }).catch(() => {}) }, [])
  return <div className="page"><PageHeader eyebrow="Sunday, September 5" title={<>Good morning, <em>{(user?.full_name || user?.username || 'friend').split(' ')[0]}.</em></>} copy="You don’t have to do it all today. One small thing is a good place to start." action={<div className="balance-pill"><Icon name="coin" size={16} /> {balance} <span>calm coins</span></div>} />
    <div className="dashboard-grid"><section className="checkin-card"><div><span className="card-kicker">Daily check-in</span><h2>What would feel<br /><em>supportive today?</em></h2><p>A two-minute pause can change the shape of a whole day.</p></div><button onClick={() => navigate('/journal')} className="circle-action"><Icon name="arrow" /></button><div className="card-stamp">02 <span>MINUTES</span></div></section><section className="streak-card"><span className="card-kicker">Your rhythm</span><div className="streak-number">{streak}<small>days</small></div><p>Showing up counts.<br />Keep your gentle streak going.</p><div className="streak-dots">{[0, 1, 2, 3, 4, 5, 6].map(day => <span className={day < streak ? 'filled' : ''} key={day}>{day < streak ? '✦' : '·'}</span>)}</div></section></div>
    <SectionTitle eyebrow="A little guidance" title="Choose your next small thing" />
    <div className="ritual-grid"><button onClick={() => navigate('/chat')} className="ritual-card cream"><span className="ritual-icon">◌</span><span className="card-kicker">When thoughts feel loud</span><h3>Talk it out</h3><p>CalmBot is here to listen without trying to rush you.</p><span className="card-arrow"><Icon name="arrow" size={16} /></span></button><button onClick={() => navigate('/journal')} className="ritual-card lilac"><span className="ritual-icon">✎</span><span className="card-kicker">When you need space</span><h3>Put pen to page</h3><p>Give the feeling a name. It might become lighter.</p><span className="card-arrow"><Icon name="arrow" size={16} /></span></button><button onClick={() => navigate('/books')} className="ritual-card sage-card"><span className="ritual-icon">⌂</span><span className="card-kicker">When you need a reset</span><h3>Read something kind</h3><p>A few pages can be a small doorway out.</p><span className="card-arrow"><Icon name="arrow" size={16} /></span></button></div>
    <div className="dashboard-footer"><div><span className="eyebrow">Your week in words</span><p>“I am learning that rest is not a reward. It is part of the work.”</p></div><button className="text-link" onClick={() => navigate('/coins')}>See your progress <Icon name="arrow" size={15} /></button></div>
  </div>
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isRegister = mode === 'register'
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const data = await api(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); onAuth(data.user); navigate('/dashboard')
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'The sanctuary is offline. Start the API or try again in a moment.' : err.message)
    } finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-art"><div className="auth-art-inner"><Logo /><div className="auth-quote"><span>“</span><p>You are allowed<br />to take up space<br />in your own life.</p><small>— ZenHeaven</small></div><div className="auth-orbit">✦</div></div></div><div className="auth-form-wrap"><button className="back-link" onClick={() => navigate('/')}><Icon name="arrow" size={15} /> Back home</button><div className="auth-form"><div className="eyebrow">{isRegister ? 'A good place to begin' : 'Welcome back'}</div><h1>{isRegister ? <>Make a little<br /><em>room for you.</em></> : <>Come back to<br /><em>yourself.</em></>}</h1><p>{isRegister ? 'Create your private space for small rituals and honest moments.' : 'Your quiet corner is waiting for you.'}</p><form onSubmit={submit}>{isRegister && <label>Your name<input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="What should we call you?" /></label>}<label>Username<input required minLength="3" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="your gentle handle" /></label>{isRegister && <label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}<label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="six quiet characters or more" /></label>{error && <div className="form-error">{error}</div>}<Button type="submit" disabled={busy} className="full-width">{busy ? 'Just a moment…' : isRegister ? 'Create my space' : 'Enter my space'} <Icon name="arrow" size={16} /></Button></form><p className="auth-switch">{isRegister ? 'Already have a space?' : 'New here?'} <button onClick={() => navigate(isRegister ? '/login' : '/register')}>{isRegister ? 'Sign in' : 'Create one'}</button></p></div></div></div>
}

function Chat({ user }) {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', content: 'Hi, I’m CalmBot. You can bring me whatever is here — a tangled thought, a hard day, or nothing in particular. Where would you like to begin?', is_user: false }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [thought, setThought] = useState('')
  const endRef = useRef(null)
  useEffect(() => { api('/mental-health/threads').then(data => setThreads(data.threads || [])).catch(() => {}) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thought])
  async function loadThread(thread) {
    setActiveThread(thread.id); setThought('')
    try { const data = await api(`/mental-health/threads/${thread.id}`); setMessages(data.messages || []) } catch (_) {}
  }
  async function sendMessage(event) {
    event?.preventDefault(); const message = input.trim(); if (!message || thinking) return
    setInput(''); setMessages(prev => [...prev, { id: `u-${Date.now()}`, content: message, is_user: true }]); setThinking(true); setThought('')
    let response = ''
    try {
      const token = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.access_token
      const res = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, thread_id: activeThread }) })
      if (!res.ok || !res.body) throw new Error('stream unavailable')
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach(chunk => { const line = chunk.split('\n').find(item => item.startsWith('data:')); if (!line) return; try { const payload = JSON.parse(line.slice(5)); if (payload.type === 'thread_id') setActiveThread(payload.data); if (payload.type === 'thinking') setThought(payload.data); if (payload.type === 'token') { response += payload.data; setMessages(prev => [...prev.filter(item => item.id !== 'streaming'), { id: 'streaming', content: response, is_user: false }]) } if (payload.type === 'complete') setThought('') } catch (_) {} })
      }
    } catch (_) {
      response = 'I’m here with you. The connection is taking a quiet moment, but you can try again or write down what you’re feeling while we reconnect.'
    }
    if (response) setMessages(prev => [...prev.filter(item => item.id !== 'streaming'), { id: `a-${Date.now()}`, content: response, is_user: false }])
    setThinking(false); setThought('')
  }
  return <div className="page chat-page"><PageHeader eyebrow="A listening space" title={<>You can say<br /><em>anything here.</em></>} copy="CalmBot is not a replacement for a therapist, but it can help you feel a little less alone between moments." action={<div className="safety-note">⌁ <span>Private & supportive</span></div>} /><div className="chat-layout"><aside className="threads"><div className="threads-heading"><span>Past conversations</span><button onClick={() => { setActiveThread(null); setMessages([{ id: 'welcome', content: 'Hi, I’m CalmBot. What’s on your mind today?', is_user: false }]) }}><Icon name="plus" size={16} /></button></div>{threads.length ? threads.map(thread => <button key={thread.id} className={`thread ${activeThread === thread.id ? 'active' : ''}`} onClick={() => loadThread(thread)}><strong>{thread.title}</strong><small>{thread.last_message || 'A moment of reflection'}</small></button>) : <div className="empty-small">Your conversations<br />will live here.</div>}<div className="chat-sidebar-foot">If you’re in immediate danger, please contact your local emergency services.<button>View crisis resources <Icon name="arrow" size={13} /></button></div></aside><section className="chat-window"><div className="chat-window-top"><span><i className="online-dot" /> CalmBot</span><small>Here to listen</small></div><div className="messages">{messages.map(message => <div key={message.id} className={`message-row ${message.is_user ? 'user-message' : ''}`}><div className={`message-avatar ${message.is_user ? 'user-avatar' : ''}`}>{message.is_user ? (user?.username || 'Y').slice(0, 1).toUpperCase() : '✦'}</div><div className="message-bubble"><p>{message.content}</p>{!message.is_user && message.id !== 'welcome' && <small>CalmBot · just now</small>}</div></div>)}{thinking && thought && <div className="thought-row"><span className="thinking-dots">•••</span>{thought}</div>}<div ref={endRef} /></div><form className="chat-composer" onSubmit={sendMessage}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Write whatever is here…" disabled={thinking} /><button type="submit" aria-label="Send message" disabled={thinking || !input.trim()}><Icon name="arrow" size={18} /></button></form><div className="composer-note">CalmBot offers general support, not medical advice. <span>·</span> <button>Need urgent help?</button></div></section></div></div>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const load = useCallback(() => { api('/journal/entries').then(setEntries).catch(() => {}); api('/journal/prompts').then(setPrompts).catch(() => {}) }, [])
  useEffect(() => load(), [load])
  async function save() {
    if (!content.trim()) return; setLoading(true)
    try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: [] }) }); setContent(''); setMood(''); setSaved(true); load(); setTimeout(() => setSaved(false), 2500) } catch (_) { setSaved(true); setTimeout(() => setSaved(false), 2500) } finally { setLoading(false) }
  }
  return <div className="page"><PageHeader eyebrow="Your private pages" title={<>A place to put<br /><em>the whole day.</em></>} copy="You don’t need the perfect words. Honest ones are more than enough." action={<Button onClick={() => document.querySelector('.journal-editor')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="plus" size={16} /> New entry</Button>} /><div className="journal-layout"><section><div className="journal-editor"><div className="editor-top"><span className="card-kicker">Sunday, September 5</span><span className="word-count">{content.length} / 1000</span></div><textarea className="journal-textarea" maxLength={1000} value={content} onChange={e => setContent(e.target.value)} placeholder="What is asking for your attention today?" /><div className="editor-bottom"><div className="mood-select"><span>Today feels</span>{['calm', 'hopeful', 'tender', 'heavy'].map(item => <button key={item} onClick={() => setMood(item)} className={mood === item ? 'chosen' : ''}>{item}</button>)}</div><Button onClick={save} disabled={!content.trim() || loading}>{saved ? <><Icon name="check" size={16} /> Saved to your pages</> : <>Save entry <Icon name="arrow" size={16} /></>}</Button></div></div><div className="prompt-row"><span className="card-kicker">Need a beginning?</span><div className="prompt-scroll">{(prompts.length ? prompts : [{ prompt: 'What made you smile today?' }, { prompt: 'What are you ready to put down?' }, { prompt: 'Describe a moment of calm.' }]).slice(0, 3).map(prompt => <button key={prompt.prompt} onClick={() => setContent(prompt.prompt + '\n\n')}><span>“</span>{prompt.prompt}<Icon name="arrow" size={14} /></button>)}</div></div></section><aside className="entry-list"><SectionTitle eyebrow="Your entries" title="Looking back" action={<span className="entry-count">{entries.length || 0}</span>} />{entries.length ? entries.slice(0, 4).map(entry => <div className="entry-item" key={entry._id || entry.id}><div className="entry-date">{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div><div><strong>{entry.title || 'A page from your day'}</strong><p>{entry.content}</p><span className="entry-mood">{entry.mood || 'reflection'}</span></div></div>) : <div className="empty-state"><span>✎</span><p>Your pages will collect here,<br />one honest moment at a time.</p></div>}</aside></div></div>
}

function Books() {
  const [books, setBooks] = useState(fallbackBooks)
  const [mood, setMood] = useState('balanced')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  useEffect(() => { api('/books/recommend-by-mood').then(data => { if (data.books?.length) setBooks(data.books); setMood(data.mood || 'balanced') }).catch(() => {}) }, [])
  async function search(event) {
    event.preventDefault(); if (!query.trim()) return; setSearching(true)
    try { const data = await api(`/books/search?q=${encodeURIComponent(query)}&max_results=8`); if (data.books?.length) setBooks(data.books) } catch (_) {} finally { setSearching(false) }
  }
  return <div className="page"><PageHeader eyebrow="The reading room" title={<>A few good words<br /><em>to keep nearby.</em></>} copy={`Curated for a ${mood} moment. Take what you need, leave the rest.`} action={<form className="search-form" onSubmit={search}><Icon name="search" size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a book…" /><button>{searching ? '…' : 'Search'}</button></form>} /><div className="book-feature"><div><span className="card-kicker">For your current chapter</span><h2>Books can be<br /><em>soft places to land.</em></h2><p>There’s no pressure to finish. Let a sentence meet you where you are.</p></div><div className="feature-book-stack"><div className="stack-book back" /><div className="stack-book front"><span>READ<br />SLOWLY</span></div></div></div><SectionTitle eyebrow="Selected for you" title="Open a new page" action={<span className="view-note">{books.length} books waiting</span>} /><div className="books-grid">{books.map((book, index) => <article className="book-card" key={book.id || book.title}><div className="book-cover">{book.image_url ? <img src={book.image_url} alt="" /> : <div className={`cover-placeholder cover-${index % 3}`}><span>zen<br />heaven</span></div>}<span className="bookmark">♡</span></div><div className="book-info"><span className="book-number">0{index + 1}</span><h3>{book.title}</h3><p>{book.author || 'Unknown author'}</p><small>{book.description || 'A thoughtful companion for your wellbeing journey.'}</small><button className="read-link" onClick={() => window.open(`https://books.google.com/books?q=${encodeURIComponent(book.title)}`, '_blank')} >Explore book <Icon name="external" size={13} /></button></div></article>)}</div></div>
}

function Music() {
  const [songs, setSongs] = useState(fallbackSongs)
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('')
  useEffect(() => { api('/songs').then(data => { if (data.songs?.length) api(`/recommend?song=${encodeURIComponent(data.songs[0])}`).then(rec => setSongs([...(rec.recommendations || [])])).catch(() => {}) }).catch(() => {}) }, [])
  const current = songs[selected] || songs[0]
  return <div className="page music-page"><PageHeader eyebrow="The sound bath" title={<>Let the day be<br /><em>a little quieter.</em></>} copy="A handful of songs for your nervous system. Headphones recommended, expectations not." action={<div className="music-status"><span className="sound-bars"><i /><i /><i /><i /></span> Curated for slowing down</div>} /><div className="music-hero"><div className="record-art"><div className="record"><div className="record-label">✦<small>ZH</small></div></div><div className="record-shadow" /></div><div className="music-now"><span className="card-kicker">Now playing</span><h2>{current.name}</h2><p>{current.artist}</p><div className="progress-line"><span style={{ width: '38%' }} /></div><div className="player-controls"><button onClick={() => setSelected((selected - 1 + songs.length) % songs.length)}>◀</button><button className="play-button" onClick={() => current?.spotify_uri && window.open(`https://open.spotify.com/track/${current.spotify_uri.split(':').pop()}`, '_blank')}>▶</button><button onClick={() => setSelected((selected + 1) % songs.length)}>▶</button></div></div><div className="music-note"><span>“</span><p>Sometimes the most productive thing you can do is listen to one song all the way through.</p></div></div><SectionTitle eyebrow="A gentle rotation" title="Songs for this moment" action={<div className="music-search"><Icon name="search" size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter artists or songs" /></div>} /><div className="song-list">{songs.filter(song => `${song.name} ${song.artist}`.toLowerCase().includes(query.toLowerCase())).map((song, index) => <button key={`${song.name}-${index}`} onClick={() => setSelected(index)} className={`song-row ${selected === index ? 'playing' : ''}`}><span className="song-index">{selected === index ? <span className="mini-bars">▮▮</span> : `0${index + 1}`}</span>{song.album_cover_url ? <img src={song.album_cover_url} alt="" /> : <span className="song-thumb">✦</span>}<span className="song-details"><strong>{song.name}</strong><small>{song.artist}</small></span><span className="song-time">3:{index === 0 ? '42' : '18'}</span><span className="song-more">···</span></button>)}</div></div>
}

function Therapists() {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [filter, setFilter] = useState('All specialties')
  const [selected, setSelected] = useState(null)
  useEffect(() => { api('/therapists/').then(data => { if (data.length) setTherapists(data) }).catch(() => {}) }, [])
  const specialties = ['All specialties', ...new Set(therapists.flatMap(item => item.specializations || []))]
  const filtered = filter === 'All specialties' ? therapists : therapists.filter(item => item.specializations?.includes(filter))
  return <div className="page"><PageHeader eyebrow="Support, when you want it" title={<>You don’t have to<br /><em>carry it alone.</em></>} copy="Meet licensed professionals who can help you make sense of things, at your pace." action={<Button variant="outline"><span className="verified-mark">✓</span> How we verify</Button>} /><div className="support-banner"><div className="support-icon">♡</div><div><span className="card-kicker">A gentle reminder</span><p>Reaching out is not a sign that something is wrong with you. It’s a sign that you’re listening.</p></div></div><div className="filter-row"><div className="filter-tabs">{specialties.slice(0, 5).map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>)}</div><span className="view-note">{filtered.length} practitioners</span></div><div className="therapist-grid">{filtered.map((person, index) => <article className="therapist-card" key={person.id || person._id || person.name}><div className="therapist-photo">{person.photo_url ? <img src={person.photo_url} alt="" /> : <span>{person.name.slice(0, 1)}</span>}<span className="verified-badge">✓</span></div><div className="therapist-main"><div className="therapist-top"><div><h3>{person.name}</h3><p>{person.specializations?.slice(0, 2).join(' · ')}</p></div><span className="rating">★ {person.rating || 4.8}</span></div><p className="therapist-bio">{person.bio}</p><div className="therapist-meta"><span>{person.experience_years} years experience</span><span>{(person.languages || ['English']).join(', ')}</span></div><div className="therapist-bottom"><strong>${person.hourly_rate}<small>/ session</small></strong><Button onClick={() => setSelected(person)}>View profile <Icon name="arrow" size={14} /></Button></div></div></article>)}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="profile-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><div className="modal-person"><div className="therapist-photo large">{selected.photo_url ? <img src={selected.photo_url} alt="" /> : <span>{selected.name.slice(0, 1)}</span>}</div><div><div className="eyebrow">Licensed professional</div><h2>{selected.name}</h2><p>{selected.specializations?.join(' · ')}</p></div></div><p className="modal-bio">{selected.bio}</p><div className="booking-options"><div><span className="card-kicker">Session rate</span><strong>${selected.hourly_rate}<small>/ hour</small></strong></div><Button onClick={() => { setSelected(null); alert('Connect this profile to your appointment flow when you are ready.') }}>See available times <Icon name="arrow" size={15} /></Button></div></div></div>}</div>
}

function Coins() {
  const [balance, setBalance] = useState(100)
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([{ title: 'Chat with AI Therapist', current: 1, target: 1, coins: 10, completed: true }, { title: 'Write in Journal', current: 0, target: 1, coins: 15 }, { title: 'Complete Mood Check', current: 0, target: 1, coins: 5 }, { title: 'Read something kind', current: 0, target: 1, coins: 8 }])
  useEffect(() => { Promise.all([api('/coins/balance'), api('/coins/transactions'), api('/coins/daily-goals')]).then(([b, t, g]) => { setBalance(b.balance); setTransactions(t); if (g.length) setGoals(g) }).catch(() => {}) }, [])
  return <div className="page coins-page"><PageHeader eyebrow="Your gentle economy" title={<>Small acts of care<br /><em>add up.</em></>} copy="Calm coins are a little nudge to keep showing up for yourself. No hustle required." action={<div className="coin-balance-large"><span>✦</span><strong>{balance}</strong><small>calm coins</small></div>} /><div className="coins-grid"><section className="goals-card"><SectionTitle eyebrow="Today’s invitations" title="Ways to refill" /><div className="goal-list">{goals.map((goal, index) => <div className={`goal-row ${goal.completed ? 'complete' : ''}`} key={goal.id || index}><div className="goal-icon">{goal.completed ? <Icon name="check" size={16} /> : ['◌', '✎', '♡', '⌂'][index]}</div><div className="goal-copy"><strong>{goal.title}</strong><div className="goal-progress"><span style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} /></div><small>{goal.completed ? 'Complete for today' : `${goal.current || 0} of ${goal.target} complete`}</small></div><span className="goal-coins">+{goal.coins} <Icon name="coin" size={13} /></span></div>)}</div></section><section className="coin-story"><div className="coin-sun">✦</div><span className="card-kicker">The idea behind calm coins</span><h2>Care is<br /><em>worth something.</em></h2><p>Not because you need to earn rest — you don’t. Coins simply celebrate the small, often invisible ways you care for your inner world.</p><button className="text-link">How it works <Icon name="arrow" size={15} /></button></section></div><section className="transactions"><SectionTitle eyebrow="Your history" title="Recent movement" action={<button className="text-link">See all <Icon name="arrow" size={14} /></button>} />{transactions.length ? transactions.slice(0, 5).map(transaction => <div className="transaction-row" key={transaction._id || transaction.transaction_id}><span className="transaction-symbol">{transaction.transaction_type === 'earn' ? '↗' : '↘'}</span><div><strong>{transaction.description}</strong><small>{transaction.source} · {new Date(transaction.timestamp).toLocaleDateString()}</small></div><b className={transaction.transaction_type === 'earn' ? 'earned' : ''}>{transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.amount}</b></div>) : <div className="empty-state horizontal"><span>✦</span><p>Your first act of care will appear here.</p></div>}</section></div>
}

export default function App() {
  const path = usePath()
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.user || null)
  const logout = () => { localStorage.removeItem(STORAGE_KEY); setUser(null); navigate('/') }
  if (path === '/login' || path === '/register') return <AuthPage mode={path.slice(1)} onAuth={setUser} />
  let content
  if (path === '/chat') content = user ? <Chat user={user} /> : <Home user={user} />
  else if (path === '/dashboard') content = user ? <Dashboard user={user} /> : <Home user={user} />
  else if (path === '/journal') content = user ? <Journal /> : <Home user={user} />
  else if (path === '/books') content = <Books />
  else if (path === '/music') content = <Music />
  else if (path === '/therapists') content = <Therapists />
  else if (path === '/coins') content = user ? <Coins /> : <Home user={user} />
  else content = <Home user={user} />
  return <Shell path={path} user={user} onLogout={logout}>{content}</Shell>
}
