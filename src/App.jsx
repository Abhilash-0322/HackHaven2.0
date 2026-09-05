import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, Brain, Check, ChevronDown, CircleDollarSign, Clock3,
  Compass, Headphones, Heart, LayoutDashboard, Library, LogIn, LogOut, Menu,
  MessageCircle, Moon, Music2, PenLine, Plus, Search, Send, ShieldCheck,
  Sparkles, Star, Sun, UserRound, Users, Wallet, X, Zap,
} from 'lucide-react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_access_token'
const USER_KEY = 'zenheaven_user'

const demoThreads = [
  { id: 'demo-1', title: 'A quieter start', last_message: 'I want to feel less rushed today.', message_count: 4 },
  { id: 'demo-2', title: 'Making room for rest', last_message: 'Rest feels like a difficult practice.', message_count: 8 },
]
const demoBooks = [
  { id: 'book-1', title: 'The Book of Joy', author: 'Dalai Lama & Desmond Tutu', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80', description: 'Lasting happiness in a changing world.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80', description: 'The power of rest and retreat in difficult times.' },
  { id: 'book-3', title: 'A Psalm for the Wild-Built', author: 'Becky Chambers', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80', description: 'A gentle story about purpose and listening.' },
]
const demoSongs = [
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' },
  { name: 'An Ending (Ascent)', artist: 'Brian Eno', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
  { name: 'Near Light', artist: 'Ólafur Arnalds', album_cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
]
const demoTherapists = [
  { _id: 'therapist-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Depression', 'Stress Management'], experience_years: 12, education: 'Ph.D. Clinical Psychology, Stanford', bio: 'Evidence-based care for anxiety, depression, and the in-between moments.', hourly_rate: 120, languages: ['English', 'Spanish'], rating: 4.8, total_sessions: 1247 },
  { _id: 'therapist-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, education: 'M.S. Marriage & Family Therapy, NYU', bio: 'A warm, direct space to understand patterns and build healthier connections.', hourly_rate: 100, languages: ['English', 'Spanish'], rating: 4.9, total_sessions: 654 },
]

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }
  return response.json()
}

function useApi(fetcher, fallback, deps = []) {
  const [state, setState] = useState({ data: fallback, loading: true, error: '' })
  useEffect(() => {
    let active = true
    fetcher().then((data) => active && setState({ data, loading: false, error: '' }))
      .catch((error) => active && setState({ data: fallback, loading: false, error: error.message }))
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

function Logo({ compact = false }) {
  return <Link to="/" className="flex items-center gap-3">
    <span className="grid h-8 w-8 place-items-center border border-copper text-copper"><span className="font-serif text-xl leading-none">Z</span></span>
    {!compact && <span className="text-sm font-bold tracking-[.18em] text-paper">ZENHEAVEN</span>}
  </Link>
}

function Button({ children, variant = 'copper', className = '', ...props }) {
  return <button className={`${variant === 'copper' ? 'button-copper' : 'button-ghost'} ${className}`} {...props}>{children}</button>
}

function PageTitle({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
    <div><p className="eyebrow mb-3">{eyebrow}</p><h1 className="font-serif text-4xl text-paper md:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>}</div>
    {action}
  </div>
}

function Shell({ children, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    ['dashboard', 'Overview', LayoutDashboard], ['chat', 'Companion', MessageCircle],
    ['journal', 'Journal', PenLine], ['books', 'Library', BookOpen],
    ['music', 'Sound', Headphones], ['therapists', 'Care team', Users],
    ['coins', 'Calm Coins', CircleDollarSign],
  ]
  return <div className="noise min-h-screen bg-ink">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-[#0c1016] px-5 py-6 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12 flex items-center justify-between"><Logo /><button onClick={() => setMobileOpen(false)} className="text-slate-500 lg:hidden"><X size={18} /></button></div>
      <div className="mb-4 flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" /><span className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-500">Private session</span></div>
      <nav className="space-y-1">
        {links.map(([to, label, Icon]) => <NavLink key={to} to={`/${to}`} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 px-3 py-3 text-sm transition ${isActive ? 'border-l-2 border-copper bg-copper/10 text-copper' : 'border-l-2 border-transparent text-slate-400 hover:bg-white/[.03] hover:text-paper'}`}><Icon size={16} strokeWidth={1.7} />{label}</NavLink>)}
      </nav>
      <div className="mt-auto border-t border-line pt-5">
        <div className="mb-4 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-sage/15 text-sage"><UserRound size={15} /></span><div className="min-w-0"><p className="truncate text-sm text-paper">{user?.full_name || user?.username || 'Guest'}</p><p className="font-mono text-[10px] uppercase text-slate-500">Member</p></div></div>
        <button onClick={onLogout} className="flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-slate-500 transition hover:text-copper"><LogOut size={14} /> Sign out</button>
      </div>
    </aside>
    {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/70 lg:hidden" />}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-ink/90 px-5 backdrop-blur md:px-10">
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 lg:hidden"><Menu size={20} /></button>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-slate-600 md:flex"><span>ZEN / 01</span><span className="text-copper">·</span><span>Inner life operating system</span></div>
        <Link to="/coins" className="ml-auto flex items-center gap-2 border border-line px-3 py-2 text-xs text-copper hover:border-copper"><CircleDollarSign size={14} /><span>Calm Coins</span></Link>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">{children}</main>
    </div>
  </div>
}

function Home() {
  return <div className="grid-paper min-h-screen bg-ink">
    <header className="flex items-center justify-between border-b border-line px-5 py-5 md:px-12"><Logo /><div className="flex items-center gap-5"><Link to="/login" className="hidden text-xs uppercase tracking-widest text-slate-400 hover:text-copper sm:block">Sign in</Link><Link to="/register" className="button-copper">Enter ZenHeaven <ArrowRight size={14} /></Link></div></header>
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:px-12 md:pt-32">
      <div className="max-w-4xl"><p className="eyebrow mb-6">A private operating system for your inner life</p><h1 className="font-serif text-6xl leading-[.95] tracking-tight text-paper md:text-8xl">Make space<br /><span className="text-copper">for yourself.</span></h1><p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">A considered place to reflect, reset, and move through the day with more intention. No noise. Just the right tools, in one quiet room.</p><div className="mt-10 flex flex-wrap gap-3"><Link to="/register" className="button-copper">Begin your practice <ArrowRight size={15} /></Link><Link to="/login" className="button-ghost">I have an account</Link></div></div>
      <div className="mt-24 grid gap-px border border-line bg-line md:grid-cols-3"><Feature icon={PenLine} number="01" title="Reflect" text="A private journal that helps you notice the patterns beneath the day." /><Feature icon={MessageCircle} number="02" title="Be heard" text="A compassionate AI companion, available when you need a little perspective." /><Feature icon={Compass} number="03" title="Find your way" text="Curated books, sound, and human care for the season you’re in." /></div>
      <div className="mt-20 flex items-center justify-between border-t border-line pt-5 font-mono text-[10px] uppercase tracking-widest text-slate-600"><span>Built for better days</span><span>Est. 2024 / v1.0</span></div>
    </main>
  </div>
}

function Feature({ icon: Icon, number, title, text }) {
  return <div className="bg-[#0c1016] p-7"><div className="mb-10 flex items-center justify-between"><Icon size={18} className="text-copper" strokeWidth={1.5} /><span className="font-mono text-[10px] text-slate-600">{number}</span></div><h2 className="font-serif text-2xl text-paper">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></div>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await apiRequest(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      onAuth(data); navigate('/dashboard')
    } catch (requestError) { setError(`${requestError.message}. The API is at ${API_URL}.`) } finally { setLoading(false) }
  }
  return <div className="grid-paper flex min-h-screen items-center justify-center bg-ink px-5 py-10"><div className="w-full max-w-5xl border border-line bg-[#0d1117] md:grid md:grid-cols-[1fr_1.1fr]">
    <div className="hidden flex-col justify-between border-r border-line p-10 md:flex"><Logo /><div><p className="eyebrow mb-5">ZenHeaven / Private access</p><h1 className="font-serif text-5xl leading-tight text-paper">Come back<br /><span className="text-copper">to yourself.</span></h1><p className="mt-6 max-w-xs text-sm leading-6 text-slate-500">Your reflections and conversations stay yours. Settle in, then take the next small step.</p></div><span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Secure by design</span>
    </div>
    <div className="p-7 md:p-12"><div className="mb-10 flex items-center justify-between md:hidden"><Logo /><Link to="/" className="text-slate-500"><X size={18} /></Link></div><p className="eyebrow mb-3">{isRegister ? 'New account' : 'Welcome back'}</p><h2 className="font-serif text-4xl text-paper">{isRegister ? 'Start your practice.' : 'Continue where you left off.'}</h2><p className="mt-3 text-sm text-slate-500">{isRegister ? 'A few details, then the room is yours.' : 'Your quiet room is waiting.'}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">{isRegister && <Field label="Full name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="How should we call you?" />}<Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="your-quiet-name" required />{isRegister && <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" required />}<Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="At least 6 characters" required />{error && <p className="border border-red-900/70 bg-red-950/20 px-3 py-3 text-xs leading-5 text-red-300">{error}</p>}<Button className="mt-2 w-full">{loading ? 'Opening room…' : isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={14} /></Button></form>
      <p className="mt-8 text-center text-xs text-slate-500">{isRegister ? 'Already a member?' : 'New here?'} <Link className="text-copper hover:underline" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
    </div>
  </div></div>
}

function Field({ label, value, onChange, type = 'text', placeholder, required = false }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</span><input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} /></label>
}

function Dashboard({ user }) {
  const balance = useApi(() => apiRequest('/coins/balance'), { balance: user?.calm_coins || 0 }, [])
  const transactions = useApi(() => apiRequest('/coins/transactions?limit=4'), [], [])
  const firstName = user?.full_name?.split(' ')[0] || user?.username || 'friend'
  return <><PageTitle eyebrow="Your room / Overview" title={`Good to see you, ${firstName}.`} description="A small check-in before the rest of the day begins." action={<span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Saturday / 05 Sep 2026</span>} /><div className="grid gap-4 md:grid-cols-3"><Stat label="Calm coins" value={balance.data.balance ?? 0} icon={CircleDollarSign} accent /><Stat label="Current practice" value="3 days" sub="Your longest: 12 days" icon={Zap} /><Stat label="Room status" value="Open" sub="Everything is in order" icon={ShieldCheck} /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><section className="panel p-6 md:p-8"><div className="mb-8 flex items-start justify-between"><div><p className="eyebrow mb-2">Today’s invitation</p><h2 className="font-serif text-3xl text-paper">What needs your attention?</h2></div><Sparkles size={20} className="text-copper" /></div><p className="max-w-lg text-base leading-7 text-slate-400">You don’t have to solve everything today. Name one thing honestly, and let that be enough for now.</p><div className="mt-8 flex flex-wrap gap-2"><Link to="/journal" className="button-copper">Write it down <PenLine size={14} /></Link><Link to="/chat" className="button-ghost">Talk it through <MessageCircle size={14} /></Link></div></section><section className="panel p-6"><p className="eyebrow mb-5">Recent activity</p>{transactions.loading ? <Loading /> : <div className="space-y-4">{(transactions.data.length ? transactions.data : [{ amount: 10, source: 'journal', description: 'Created a new journal entry' }, { amount: 5, source: 'chat', description: 'Checked in with Companion' }]).map((item, index) => <div key={item._id || index} className="flex items-start justify-between border-b border-line pb-3 last:border-0"><div><p className="text-sm text-paper">{item.description}</p><p className="mt-1 font-mono text-[10px] uppercase text-slate-600">{item.source}</p></div><span className="font-mono text-xs text-sage">+{item.amount}</span></div>)}</div>}</section></div><div className="mt-5 grid gap-4 md:grid-cols-3"><QuickLink to="/books" icon={BookOpen} title="Read something" text="For your current mood" /><QuickLink to="/music" icon={Music2} title="Find a frequency" text="A softer soundtrack" /><QuickLink to="/therapists" icon={Users} title="Meet your care team" text="Human support, when ready" /></div></>
}

function Stat({ label, value, sub, icon: Icon, accent = false }) {
  return <div className="panel p-5"><div className="mb-8 flex justify-between"><span className="eyebrow">{label}</span><Icon size={16} className={accent ? 'text-copper' : 'text-slate-600'} /></div><p className={`font-serif text-3xl ${accent ? 'text-copper' : 'text-paper'}`}>{value}</p><p className="mt-2 text-xs text-slate-500">{sub || 'Available to you'}</p></div>
}
function QuickLink({ to, icon: Icon, title, text }) {
  return <Link to={to} className="panel group flex items-center gap-4 p-5 transition hover:border-copper"><span className="grid h-10 w-10 place-items-center border border-line text-copper group-hover:border-copper"><Icon size={17} /></span><span><span className="block text-sm text-paper">{title}</span><span className="mt-1 block text-xs text-slate-500">{text}</span></span><ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-copper" /></Link>
}
function Loading() { return <div className="flex items-center gap-2 py-4 font-mono text-[10px] uppercase tracking-widest text-slate-600"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-copper" /> Loading</div> }

function Chat() {
  const [threads, setThreads] = useState(demoThreads)
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', content: 'Welcome back. This is a quiet space to say what is true, without needing to make it sound any particular way.', is_user: false }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [thought, setThought] = useState('')
  useEffect(() => { apiRequest('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const openThread = async (threadId) => {
    setActive(threadId)
    try { const data = await apiRequest(`/mental-health/threads/${threadId}`); setMessages(data.messages || []) } catch { setMessages([]) }
  }
  const send = async (event) => {
    event.preventDefault(); const message = input.trim(); if (!message || streaming) return
    setInput(''); setStreaming(true); setThought('Preparing a thoughtful response…'); setMessages((current) => [...current, { id: `user-${Date.now()}`, content: message, is_user: true }, { id: `assistant-${Date.now()}`, content: '', is_user: false }])
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }, body: JSON.stringify({ message, thread_id: active }) })
      if (!response.ok || !response.body) throw new Error('stream unavailable')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n'); buffer = events.pop() || ''
        events.forEach((chunk) => {
          const line = chunk.split('\n').find((entry) => entry.startsWith('data:')); if (!line) return
          try {
            const payload = JSON.parse(line.slice(5).trim())
            if (payload.type === 'thread_id') setActive(payload.data)
            if (payload.type === 'thinking') setThought(payload.data)
            if (payload.type === 'token') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: item.content + payload.data } : item))
            if (payload.type === 'complete') setThought('Response complete · +5 Calm Coins')
          } catch { /* Ignore incomplete SSE frames. */ }
        })
      }
    } catch {
      const fallback = 'I’m here with you. Take one slow breath, then tell me what feels most present right now. We can stay with one small piece at a time.'
      setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: fallback } : item)); setThought('Offline reflection mode')
    } finally { setStreaming(false) }
  }
  return <div className="grid min-h-[calc(100vh-10rem)] gap-5 xl:grid-cols-[280px_1fr]"><section className="panel flex flex-col p-4"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Companion</p><p className="mt-1 text-xs text-slate-500">Private conversations</p></div><button onClick={() => { setActive(null); setMessages([]) }} className="border border-line p-2 text-slate-400 hover:border-copper hover:text-copper"><Plus size={15} /></button></div><div className="mb-5 flex items-center gap-2 border border-sage/30 bg-sage/5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-sage"><span className="h-1.5 w-1.5 rounded-full bg-sage" /> Companion is here</div><div className="space-y-1">{threads.map((thread) => <button key={thread.id} onClick={() => openThread(thread.id)} className={`w-full border-l-2 p-3 text-left transition ${active === thread.id ? 'border-copper bg-copper/10' : 'border-transparent hover:bg-white/[.03]'}`}><p className="truncate text-sm text-paper">{thread.title}</p><p className="mt-1 truncate text-xs text-slate-600">{thread.last_message}</p></button>)}</div><p className="mt-auto px-2 pt-8 font-mono text-[9px] uppercase leading-4 tracking-wider text-slate-600">Conversations are encrypted in transit.<br />This is support, not clinical care.</p></section><section className="panel flex min-h-[560px] flex-col"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="text-sm text-paper">{active ? threads.find((item) => item.id === active)?.title || 'Conversation' : 'A fresh conversation'}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-600">CalmBot / Online</p></div><span className="tag">SSE live</span></div><div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8">{messages.length === 0 ? <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center"><div className="mb-5 grid h-14 w-14 place-items-center border border-copper/50 text-copper"><Brain size={23} strokeWidth={1.3} /></div><h2 className="font-serif text-3xl text-paper">What’s on your mind?</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">There’s no right way to begin. A sentence, a question, or simply “I don’t know.”</p></div> : messages.map((message) => <div key={message.id} className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] ${message.is_user ? 'bg-copper px-4 py-3 text-ink' : 'border-l border-copper bg-[#0d1117] px-4 py-3 text-slate-300'}`}><p className="whitespace-pre-wrap text-sm leading-7">{message.content || (streaming ? '…' : '')}</p><p className={`mt-2 font-mono text-[9px] uppercase tracking-wider ${message.is_user ? 'text-ink/60' : 'text-slate-600'}`}>{message.is_user ? 'You' : 'CalmBot'}</p></div></div>)}</div><div className="border-t border-line px-5 py-4"><p className="mb-3 min-h-4 font-mono text-[10px] text-copper">{thought}</p><form onSubmit={send} className="flex gap-2"><input className="field" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write what feels true…" /><Button disabled={streaming} className="px-4"><Send size={15} /></Button></form></div></section></div>
}

function Journal() {
  const entries = useApi(() => apiRequest('/journal/entries'), [], [])
  const prompts = useApi(() => apiRequest('/journal/prompts'), [], [])
  const [content, setContent] = useState(''); const [mood, setMood] = useState(''); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const save = async () => { if (!content.trim()) return; setSaving(true); try { await apiRequest('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: mood || null, tags: [] }) }); setSaved(true); setContent(''); setMood(''); entries.data.unshift({ content, mood: mood || 'reflective', title: 'A new reflection', created_at: new Date().toISOString() }) } catch { setSaved(true); setContent('') } finally { setSaving(false) } }
  return <><PageTitle eyebrow="The archive / Journal" title="Make a record of today." description="You don’t need to write beautifully. You only need to leave yourself a trace." action={<Button onClick={save} disabled={!content.trim() || saving}>{saved ? <><Check size={14} /> Saved</> : <><PenLine size={14} /> Save entry</>}</Button>} /><div className="grid gap-5 xl:grid-cols-[1fr_360px]"><section className="panel min-h-[500px] p-6 md:p-8"><div className="mb-7 flex flex-wrap gap-2"><button className={`tag ${mood === '' ? 'border-copper text-copper' : ''}`} onClick={() => setMood('')}>No label</button>{['calm', 'hopeful', 'anxious', 'grateful', 'tired'].map((item) => <button key={item} className={`tag ${mood === item ? 'border-copper text-copper' : ''}`} onClick={() => setMood(item)}>{item}</button>)}</div><textarea className="min-h-[360px] w-full resize-none bg-transparent text-lg leading-8 text-paper outline-none placeholder:text-slate-700" value={content} onChange={(event) => { setContent(event.target.value); setSaved(false) }} placeholder="Begin anywhere…" /><div className="flex justify-between border-t border-line pt-4 font-mono text-[10px] uppercase tracking-widest text-slate-600"><span>{content.length} characters</span><span>Private by default</span></div></section><div className="space-y-5"><section className="panel p-6"><p className="eyebrow mb-4">A prompt, if useful</p>{prompts.data.length ? <p className="font-serif text-2xl leading-snug text-paper">“{prompts.data[0].prompt}”</p> : <p className="font-serif text-2xl leading-snug text-paper">“What made you smile today?”</p>}<button onClick={() => setContent(`${prompts.data[0]?.prompt || 'What made you smile today?'}\n\n`)} className="mt-5 text-xs uppercase tracking-widest text-copper hover:underline">Use this prompt <ArrowRight size={12} className="ml-1 inline" /></button></section><section className="panel p-6"><p className="eyebrow mb-4">Recent entries</p>{entries.loading ? <Loading /> : (entries.data.length ? entries.data.slice(0, 4).map((entry, index) => <div key={entry._id || index} className="border-b border-line py-3 last:border-0"><p className="text-sm text-paper">{entry.title || 'Untitled reflection'}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{entry.content}</p><p className="mt-2 font-mono text-[9px] uppercase text-copper">{entry.mood || 'reflection'}</p></div>) : <p className="text-sm leading-6 text-slate-500">Your first entry will live here. Start with one honest sentence.</p>)}</section></div></div></>
}

function Books() {
  const [query, setQuery] = useState(''); const [results, setResults] = useState(null); const recommendations = useApi(() => apiRequest('/books/recommend-by-mood'), { mood: 'balanced', mood_description: 'Books selected to enhance your general well-being', books: demoBooks }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const data = await apiRequest(`/books/search?q=${encodeURIComponent(query)}&max_results=8`); setResults(data.books) } catch { setResults(demoBooks) } }
  const books = results || recommendations.data.books || demoBooks
  return <><PageTitle eyebrow="The library / Curated for you" title="Read into a new perspective." description={recommendations.data.mood_description || 'A considered shelf for the season you are in.'} action={<form onSubmit={search} className="flex gap-2"><input className="field w-48 py-2" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books" /><button className="button-ghost px-3"><Search size={15} /></button></form>} /><div className="mb-5 flex items-center gap-3"><span className="eyebrow">Shelf mood</span><span className="tag border-copper text-copper">{recommendations.data.mood || 'balanced'}</span>{results && <button onClick={() => setResults(null)} className="ml-auto text-xs text-slate-500 hover:text-copper">Clear search <X size={12} className="inline" /></button>}</div><div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">{books.map((book, index) => <BookCard key={book.id || index} book={book} />)}</div></>
}
function BookCard({ book }) { return <article className="group bg-[#0d1117] p-5"><div className="mb-5 aspect-[4/5] overflow-hidden bg-[#161c24]">{book.image_url ? <img src={book.image_url} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /> : <div className="grid h-full place-items-center"><BookOpen className="text-copper" size={30} /></div>}</div><p className="font-serif text-xl text-paper">{book.title}</p><p className="mt-1 text-sm text-copper">{book.author}</p><p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">{book.description}</p><button className="mt-5 border-t border-line pt-3 text-[10px] uppercase tracking-widest text-slate-500 transition hover:text-copper">View details <ArrowRight size={12} className="ml-1 inline" /></button></article> }

function Music() {
  const [song, setSong] = useState(''); const [playing, setPlaying] = useState(null)
  const songs = useApi(() => apiRequest('/songs'), { songs: [] }, [])
  const [recommendations, setRecommendations] = useState(demoSongs)
  const recommend = async (event) => { event.preventDefault(); if (!song) return; try { const data = await apiRequest(`/recommend?song=${encodeURIComponent(song)}`); setRecommendations(data.recommendations) } catch { setRecommendations(demoSongs) } }
  const songNames = songs.data.songs?.slice(0, 10) || []
  return <><PageTitle eyebrow="The sound room / Music" title="Find a softer frequency." description="Sound can be a form of care. Choose a song, and let the next few minutes be enough." action={<span className="tag border-sage text-sage"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-sage" /> Listening mode</span>} /><section className="panel mb-5 p-6 md:p-8"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow mb-3">Start with a song you know</p><h2 className="font-serif text-3xl text-paper">Build a small orbit.</h2></div><form onSubmit={recommend} className="flex w-full gap-2 md:max-w-md"><select className="field" value={song} onChange={(event) => setSong(event.target.value)}><option value="">Choose a track</option>{songNames.map((item) => <option key={item} value={item}>{item}</option>)}</select><Button disabled={!song}><Search size={15} /></Button></form></div></section><div className="grid gap-4 md:grid-cols-3">{recommendations.map((item, index) => <article key={item.name || index} className={`panel group p-4 ${playing === index ? 'border-copper' : ''}`}><div className="relative aspect-square overflow-hidden bg-[#161c24]">{item.album_cover_url && <img src={item.album_cover_url} alt="" className="h-full w-full object-cover opacity-75 grayscale transition group-hover:scale-105 group-hover:grayscale-0" />}<button onClick={() => setPlaying(playing === index ? null : index)} className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-copper text-ink">{playing === index ? <span className="flex gap-1"><i className="h-4 w-1 bg-ink" /><i className="h-4 w-1 bg-ink" /></span> : <span className="ml-0.5">▶</span>}</button></div><div className="flex items-center justify-between pt-4"><div><p className="font-serif text-xl text-paper">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.artist}</p></div><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></div></article>)}</div></>
}

function Therapists() {
  const therapists = useApi(() => apiRequest('/therapists/'), demoTherapists, [])
  const [selected, setSelected] = useState(null)
  return <><PageTitle eyebrow="The care team / Human support" title="You don’t have to do it alone." description="Licensed professionals, thoughtfully introduced. Take your time finding the right fit." action={<span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-sage"><ShieldCheck size={14} /> Vetted practitioners</span>} /><div className="mb-6 flex gap-2"><button className="tag border-copper text-copper">All specialties</button><button className="tag">Anxiety</button><button className="tag">Relationships</button><button className="tag">Transitions</button></div><div className="grid gap-4 lg:grid-cols-2">{therapists.data.map((therapist) => <article key={therapist._id || therapist.id} className="panel p-6 transition hover:border-copper/60 md:p-7"><div className="flex gap-5"><div className="grid h-16 w-16 shrink-0 place-items-center border border-copper/40 bg-copper/5 text-copper"><UserRound size={25} strokeWidth={1.2} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-2xl text-paper">{therapist.name}</h2><p className="mt-1 text-xs text-slate-500">{therapist.experience_years} years experience · {therapist.languages?.join(', ')}</p></div><span className="flex items-center gap-1 font-mono text-xs text-copper"><Star size={12} fill="currentColor" /> {therapist.rating}</span></div><div className="mt-4 flex flex-wrap gap-2">{therapist.specializations?.map((specialization) => <span key={specialization} className="tag">{specialization}</span>)}</div><p className="mt-5 text-sm leading-6 text-slate-400">{therapist.bio}</p><div className="mt-6 flex items-center justify-between border-t border-line pt-4"><span className="font-mono text-xs text-slate-500">${therapist.hourly_rate} <span className="text-[10px] uppercase">/ session</span></span><Button onClick={() => setSelected(therapist)} className="px-3 py-2">View profile <ArrowRight size={13} /></Button></div></div></div></article>)}</div>{selected && <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5" onClick={() => setSelected(null)}><div className="panel max-w-lg p-7" onClick={(event) => event.stopPropagation()}><div className="flex justify-between"><div><p className="eyebrow mb-2">Practitioner profile</p><h2 className="font-serif text-3xl text-paper">{selected.name}</h2></div><button onClick={() => setSelected(null)} className="text-slate-500"><X size={18} /></button></div><p className="mt-6 text-sm leading-7 text-slate-400">{selected.bio} {selected.education}.</p><Button className="mt-7 w-full" onClick={() => setSelected(null)}>Request a first conversation <ArrowRight size={14} /></Button></div></div>}</>
}

function Coins() {
  const balance = useApi(() => apiRequest('/coins/balance'), { balance: 0 }, [])
  const transactions = useApi(() => apiRequest('/coins/transactions?limit=20'), [], [])
  const goals = useApi(() => apiRequest('/coins/daily-goals'), [], [])
  return <><PageTitle eyebrow="Your economy / Calm Coins" title="Small actions add up." description="Calm Coins are a gentle way to notice the practices that support you. There’s no scoreboard here — just momentum." action={<div className="text-right"><p className="eyebrow">Current balance</p><p className="font-serif text-4xl text-copper">{balance.data.balance ?? 0}</p></div>} /><div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><section className="panel p-6 md:p-8"><div className="mb-8 flex items-center justify-between"><div><p className="eyebrow mb-2">Today’s practices</p><h2 className="font-serif text-3xl text-paper">Keep it gentle.</h2></div><Moon className="text-copper" size={23} /></div>{goals.data.length ? goals.data.map((goal) => <div key={goal.id} className="mb-5 flex items-center gap-4 border-b border-line pb-4 last:border-0"><span className={`grid h-9 w-9 place-items-center border ${goal.completed ? 'border-sage text-sage' : 'border-line text-slate-600'}`}>{goal.completed ? <Check size={15} /> : <CircleDollarSign size={15} />}</span><div className="flex-1"><p className="text-sm text-paper">{goal.title}</p><p className="mt-1 text-xs text-slate-500">{goal.current} / {goal.target} complete</p></div><span className="font-mono text-xs text-copper">+{goal.coins}</span></div>) : <div className="grid gap-4 sm:grid-cols-2"><EarnCard icon={PenLine} title="Write a journal" coins="+10" /><EarnCard icon={MessageCircle} title="Check in with CalmBot" coins="+5" /><EarnCard icon={Heart} title="Track your mood" coins="+5" /><EarnCard icon={BookOpen} title="Read something kind" coins="+8" /></div>}</section><section className="panel p-6 md:p-8"><p className="eyebrow mb-5">Ledger / Recent activity</p>{transactions.data.length ? transactions.data.map((item, index) => <div key={item._id || index} className="flex items-start justify-between border-b border-line py-4 first:pt-0 last:border-0"><div><p className="text-sm text-paper">{item.description}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">{item.source} · {item.transaction_type}</p></div><span className={item.transaction_type === 'spend' ? 'font-mono text-xs text-slate-400' : 'font-mono text-xs text-sage'}>{item.transaction_type === 'spend' ? '-' : '+'}{item.amount}</span></div>) : <p className="text-sm leading-6 text-slate-500">Your ledger will appear after your first practice. Start anywhere.</p>}</section></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><EarnCard icon={Sparkles} title="First steps" coins="50" text="Start your mental health journey" /><EarnCard icon={Zap} title="Weekly rhythm" coins="50" text="Show up for seven days" /><EarnCard icon={Wallet} title="Premium insights" coins="100" text="Unlock when you’re ready" /></div></>
}
function EarnCard({ icon: Icon, title, coins, text }) { return <div className="border border-line p-5"><div className="mb-7 flex items-center justify-between"><Icon size={17} className="text-copper" /><span className="font-mono text-xs text-copper">+{coins}</span></div><p className="text-sm text-paper">{title}</p>{text && <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>}</div> }

function ProtectedRoute({ user, children }) { return user ? children : <Navigate to="/login" replace /> }

function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } })
  const onAuth = useCallback((data) => { localStorage.setItem(TOKEN_KEY, data.access_token); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); setUser(data.user) }, [])
  const onLogout = useCallback(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null) }, [])
  const location = useLocation()
  const inApp = location.pathname.startsWith('/dashboard') || ['/chat', '/journal', '/books', '/music', '/therapists', '/coins'].includes(location.pathname)
  if (!inApp) return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={onAuth} />} /><Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onAuth={onAuth} />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
  return <Shell user={user} onLogout={onLogout}><Routes><Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} /><Route path="/chat" element={<ProtectedRoute user={user}><Chat /></ProtectedRoute>} /><Route path="/journal" element={<ProtectedRoute user={user}><Journal /></ProtectedRoute>} /><Route path="/books" element={<ProtectedRoute user={user}><Books /></ProtectedRoute>} /><Route path="/music" element={<ProtectedRoute user={user}><Music /></ProtectedRoute>} /><Route path="/therapists" element={<ProtectedRoute user={user}><Therapists /></ProtectedRoute>} /><Route path="/coins" element={<ProtectedRoute user={user}><Coins /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></Shell>
}

export default App
