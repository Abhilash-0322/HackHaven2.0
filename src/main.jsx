import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, Brain, CalendarDays, Check, ChevronRight,
  CircleDollarSign, Clock3, Compass, Heart, Home, Library, LoaderCircle, LockKeyhole,
  LogOut, Menu, MessageCircle, Music2, PenLine, Play, Plus, Search, Send, ShieldCheck,
  Sparkles, Star, Stethoscope, Target, Trophy, UserRound, Users, X, Zap,
} from 'lucide-react'
import { api, authApi, clearToken, fallbackBooks, fallbackTherapists, getToken, saveToken } from './api'
import './index.css'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'AI companion', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: PenLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Care circle', icon: Stethoscope },
  { to: '/coins', label: 'Calm coins', icon: CircleDollarSign },
]

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return
    authApi.me().then(setUser).catch(clearToken).finally(() => setLoading(false))
  }, [])

  const onAuth = (payload) => {
    saveToken(payload.access_token)
    setUser(payload.user)
  }
  const logout = () => { clearToken(); setUser(null) }

  if (loading) return <div className="app-shell flex min-h-screen items-center justify-center"><LoaderCircle className="animate-spin text-violet-300" /></div>
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="noise" />
        <Routes>
          <Route path="/" element={<Landing user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="login" onAuth={onAuth} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="register" onAuth={onAuth} />} />
          <Route element={<AppLayout user={user} logout={logout} />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/books" element={<Books user={user} />} />
            <Route path="/music" element={<Music />} />
            <Route path="/therapists" element={<Therapists user={user} />} />
            <Route path="/coins" element={<Coins user={user} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function Topbar({ user, onMenu }) {
  const location = useLocation()
  const current = navItems.find((item) => location.pathname.startsWith(item.to))
  return (
    <header className="relative z-20 mx-auto flex w-[min(1180px,calc(100%-28px))] items-center justify-between py-5">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/30 bg-violet-300/15 text-violet-100"><Sparkles size={18} /></span>
        <span className="font-display text-lg font-semibold tracking-tight">zen<span className="text-teal-200">heaven</span></span>
      </Link>
      <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
        <span>{current?.label || 'Your space'}</span><ChevronRight size={14} /><span className="text-slate-200">Good to see you, {user?.full_name?.split(' ')[0] || user?.username || 'friend'}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-teal-200/15 bg-teal-200/5 px-3 py-2 text-xs text-teal-100 sm:flex"><span className="pulse-dot h-2 w-2 rounded-full bg-teal-300" /> Private space</div>
        <button onClick={onMenu} className="btn-ghost rounded-xl p-2 md:hidden" aria-label="Open navigation"><Menu size={19} /></button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-teal-200 text-sm font-bold text-slate-900">{(user?.full_name || user?.username || 'Z')[0].toUpperCase()}</div>
      </div>
    </header>
  )
}

function Sidebar({ logout, mobile, close }) {
  return (
    <aside className={`${mobile ? 'fixed inset-0 z-40 w-[270px] shadow-2xl' : 'sticky top-0 hidden h-screen w-[246px] shrink-0 md:block'} glass border-l-0 border-y-0 border-white/10 px-4 py-6`}>
      <div className="mb-10 flex items-center justify-between px-2">
        <div><p className="eyebrow">Your sanctuary</p><p className="mt-1 font-display text-xl font-semibold">The commons</p></div>
        {mobile && <button onClick={close} className="btn-ghost rounded-lg p-2"><X size={16} /></button>}
      </div>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-violet-300/15 text-violet-100 shadow-[inset_3px_0_0_#a596ff]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
            <Icon size={17} className="transition group-hover:text-teal-200" /><span>{label}</span>{label === 'Calm coins' && <span className="ml-auto rounded-full bg-teal-200/10 px-2 py-0.5 text-[10px] text-teal-100">NEW</span>}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-6 left-4 right-4">
        <div className="glass-subtle mb-4 rounded-2xl p-4"><ShieldCheck size={17} className="mb-3 text-teal-200" /><p className="text-xs font-semibold">A soft place to land</p><p className="mt-1 text-[11px] leading-4 text-slate-500">Your reflections are yours. Always.</p></div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-white/5 hover:text-slate-200"><LogOut size={17} /> Sign out</button>
      </div>
    </aside>
  )
}

function AppLayout({ user, logout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="relative z-10">
      <Topbar user={user} onMenu={() => setMobileOpen(true)} />
      <div className="mx-auto flex w-[min(1280px,100%)]">
        <Sidebar logout={logout} />
        {mobileOpen && <><div className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} /><Sidebar logout={logout} mobile close={() => setMobileOpen(false)} /></>}
        <main className="min-w-0 flex-1"><RoutesOutlet user={user} /></main>
      </div>
    </div>
  )
}

function RoutesOutlet({ user }) {
  return <Routes>
    <Route path="/dashboard" element={<Dashboard user={user} />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/journal" element={<Journal />} />
    <Route path="/books" element={<Books user={user} />} />
    <Route path="/music" element={<Music />} />
    <Route path="/therapists" element={<Therapists user={user} />} />
    <Route path="/coins" element={<Coins user={user} />} />
  </Routes>
}

function Landing({ user }) {
  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      <div className="orb -right-32 top-20 h-96 w-96 bg-violet-500/15" /><div className="orb -left-48 top-[45%] h-80 w-80 bg-teal-400/10" />
      <header className="mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between py-7">
        <Link to="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/30 bg-violet-300/15 text-violet-100"><Sparkles size={18} /></span><span className="font-display text-lg font-semibold">zen<span className="text-teal-200">heaven</span></span></Link>
        <div className="flex items-center gap-3">{user ? <Link to="/dashboard" className="btn-primary rounded-xl px-5 py-2.5 text-sm font-bold">Open commons <ArrowRight className="ml-1 inline" size={15} /></Link> : <><Link to="/login" className="hidden px-4 py-2 text-sm text-slate-300 sm:block">Sign in</Link><Link to="/register" className="btn-ghost rounded-xl px-4 py-2.5 text-sm">Join the commons</Link></>}</div>
      </header>
      <section className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-14 pb-24 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:pt-24">
        <div className="fade-up"><div className="eyebrow mb-6 flex items-center gap-2"><span className="h-px w-8 bg-teal-300" /> A better way to be human</div><h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-.045em] text-slate-100 sm:text-7xl">Wellness is a<br /><span className="text-gradient">collective act.</span></h1><p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">ZenHeaven is a calm, private commons for the rituals that help you feel like yourself again.</p><div className="mt-9 flex flex-wrap gap-3"><Link to={user ? '/dashboard' : '/register'} className="btn-primary rounded-xl px-6 py-3.5 text-sm font-bold">{user ? 'Enter your space' : 'Begin your journey'} <ArrowRight className="ml-2 inline" size={16} /></Link><a href="#how" className="btn-ghost rounded-xl px-6 py-3.5 text-sm text-slate-300">See how it works</a></div><div className="mt-12 flex items-center gap-8 text-xs text-slate-500"><span><strong className="block font-display text-2xl text-slate-200">4.8k</strong>quiet check-ins</span><span><strong className="block font-display text-2xl text-slate-200">96%</strong>feel more grounded</span></div></div>
        <div className="relative fade-up [animation-delay:150ms]"><div className="glass relative mx-auto max-w-[470px] rounded-[28px] p-5 sm:p-7"><div className="mb-7 flex items-center justify-between"><div><p className="eyebrow">Today in your space</p><p className="mt-2 font-display text-xl font-semibold">A gentle reset</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-teal-200/10 text-teal-200"><Heart size={18} /></span></div><div className="rounded-2xl border border-white/10 bg-slate-950/30 p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-violet-300/15 text-violet-200"><MessageCircle size={17} /></div><div><p className="text-sm font-medium">A note from your companion</p><p className="text-xs text-slate-500">just now · private thread</p></div></div><p className="mt-5 text-sm leading-6 text-slate-300">“You don’t need to solve everything today. What would feel like a kind next step?”</p><button className="mt-5 text-xs font-semibold text-teal-200">Continue the conversation <ArrowUpRight className="ml-1 inline" size={13} /></button></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><PenLine size={16} className="text-violet-200" /><p className="mt-4 text-xs text-slate-500">Journal streak</p><p className="mt-1 font-display text-xl">06 days</p></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><CircleDollarSign size={16} className="text-teal-200" /><p className="mt-4 text-xs text-slate-500">Calm coins</p><p className="mt-1 font-display text-xl">240 <span className="text-xs text-teal-200">+12</span></p></div></div></div><div className="absolute -bottom-6 -left-5 glass rounded-2xl px-4 py-3 shadow-xl sm:-left-12"><div className="flex items-center gap-2 text-xs"><span className="grid h-7 w-7 place-items-center rounded-full bg-teal-200/15 text-teal-200"><Check size={14} /></span><span><strong className="block text-slate-200">Small wins count</strong><span className="text-slate-500">You showed up today.</span></span></div></div></div>
      </section>
      <section id="how" className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-5 border-t border-white/10 py-20 md:grid-cols-3"><Feature icon={Brain} title="Understand yourself" text="Reflect with guided journals and gentle mood insights that reveal patterns without judgment." /><Feature icon={Users} title="Feel less alone" text="Talk to an always-on AI companion or find the right human care for your next chapter." /><Feature icon={Trophy} title="Make it a practice" text="Turn caring for yourself into a small, rewarding rhythm with Calm Coins and daily goals." /></section>
      <footer className="mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between border-t border-white/10 py-7 text-xs text-slate-600"><span>© 2025 ZenHeaven commons</span><span className="flex items-center gap-2"><LockKeyhole size={12} /> Built for softer days</span></footer>
    </div>
  )
}

function Feature({ icon: Icon, title, text }) {
  return <div className="glass-subtle rounded-2xl p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><Icon size={17} /></span><h3 className="mt-5 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const register = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { const result = register ? await authApi.register(form) : await authApi.login({ username: form.username, password: form.password }); onAuth(result); navigate('/dashboard') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10"><div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/30 shadow-2xl lg:grid-cols-2"><div className="hidden bg-gradient-to-br from-violet-500/25 via-slate-900/20 to-teal-300/10 p-12 lg:block"><Link to="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/30 bg-violet-300/15 text-violet-100"><Sparkles size={18} /></span><span className="font-display font-semibold">zen<span className="text-teal-200">heaven</span></span></Link><div className="mt-32"><p className="eyebrow">A soft place to land</p><h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Come as you are.<br /><span className="text-gradient">Leave a little lighter.</span></h1><p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">Your private space for reflection, care and the small rituals that make a difference.</p></div></div><div className="p-7 sm:p-12"><Link to="/" className="mb-12 flex items-center gap-3 lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/30 bg-violet-300/15"><Sparkles size={18} /></span><span className="font-display font-semibold">zen<span className="text-teal-200">heaven</span></span></Link><p className="eyebrow">{register ? 'Open your space' : 'Welcome back'}</p><h2 className="mt-3 font-display text-3xl font-semibold">{register ? 'Begin gently.' : 'Ready when you are.'}</h2><p className="mt-3 text-sm text-slate-500">{register ? 'A few details, then your commons is ready.' : 'Pick up where you left off.'}</p><form onSubmit={submit} className="mt-8 space-y-4">{register && <Field label="What should we call you?" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="Your name" />}{register && <Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="choose a username" required />}{register && <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" required />} {!register && <Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="your username" required />}<Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="••••••••" required />{error && <p className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-xs text-rose-200">{error}</p>}<button disabled={busy} className="btn-primary mt-3 w-full rounded-xl py-3.5 text-sm font-bold disabled:opacity-50">{busy ? <LoaderCircle className="mx-auto animate-spin" size={18} /> : register ? 'Create my space' : 'Enter ZenHeaven'}</button></form><p className="mt-7 text-center text-sm text-slate-500">{register ? 'Already have a space?' : 'New to the commons?'} <Link className="font-semibold text-teal-200" to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p></div></div></div>
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">{label}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-white/[.05] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600" /></label>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [streak, setStreak] = useState({ current_streak: 6 })
  const [goals, setGoals] = useState([])
  useEffect(() => { Promise.all([api('/coins/balance'), api('/coins/streak'), api('/coins/daily-goals')]).then(([b, s, g]) => { setBalance(b.balance); setStreak(s); setGoals(g) }).catch(() => {}) }, [])
  const firstName = user?.full_name?.split(' ')[0] || user?.username || 'friend'
  return <Page><div className="fade-up"><p className="eyebrow">Saturday, September 5</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Good evening, <span className="text-gradient">{firstName}.</span></h1><p className="mt-3 text-slate-400">Let’s make a little room for what matters.</p></div><div className="flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-200/5 px-4 py-2 text-sm text-teal-100"><Zap size={15} /> {streak.current_streak || 0} day rhythm</div></div><div className="mt-10 grid gap-4 md:grid-cols-[1.45fr_1fr_1fr]"><Link to="/chat" className="glass group rounded-3xl p-6 transition hover:-translate-y-1"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-300/15 text-violet-200"><MessageCircle size={20} /></span><ArrowUpRight size={18} className="text-slate-600 transition group-hover:text-violet-200" /></div><p className="mt-14 text-xs uppercase tracking-widest text-violet-200">Suggested for now</p><h2 className="mt-2 font-display text-2xl font-semibold">A two-minute check-in</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Tell your companion what’s taking up space today.</p></Link><StatCard icon={PenLine} label="Journal entries" value="12" note="+2 this week" color="violet" /><StatCard icon={CircleDollarSign} label="Calm coins" value={balance} note="Keep your rhythm" color="teal" /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="glass rounded-3xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Your daily orbit</p><h2 className="mt-2 font-display text-xl font-semibold">Tiny actions, real momentum</h2></div><Link to="/coins" className="text-xs font-semibold text-teal-200">View rewards <ArrowRight className="ml-1 inline" size={13} /></Link></div><div className="mt-6 space-y-3">{(goals.length ? goals : [{ id: 1, title: 'Check in with your companion', current: 1, target: 1, coins: 10, completed: true, icon: 'MessageCircle' }, { id: 2, title: 'Write in your journal', current: 0, target: 1, coins: 15, completed: false, icon: 'BookOpen' }, { id: 3, title: 'Take a mindful pause', current: 0, target: 1, coins: 5, completed: false, icon: 'Heart' }]).slice(0, 3).map((goal) => <div key={goal.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.035] p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${goal.completed ? 'bg-teal-300/15 text-teal-200' : 'bg-white/5 text-slate-400'}`}>{goal.completed ? <Check size={16} /> : <Target size={16} />}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-sm"><span className={goal.completed ? 'text-slate-500 line-through' : 'text-slate-200'}>{goal.title}</span><span className="shrink-0 text-xs text-teal-200">+{goal.coins}</span></div><div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-1 rounded-full bg-teal-300" style={{ width: `${goal.completed ? 100 : (goal.current / goal.target) * 100}%` }} /></div></div></div>)}</div></div><div className="glass rounded-3xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">A moment of perspective</p><h2 className="mt-2 font-display text-xl font-semibold">You are allowed to go slowly.</h2></div><Sparkles className="text-violet-200" size={20} /></div><p className="mt-8 text-lg leading-8 text-slate-300">“The pause is not a detour. It is part of the path.”</p><div className="mt-8 flex items-center gap-3 text-xs text-slate-500"><span className="h-px w-7 bg-violet-300/50" /> Today’s reflection</div></div></div></div></Page>
}

function StatCard({ icon: Icon, label, value, note, color }) {
  return <div className="glass rounded-3xl p-6"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${color === 'teal' ? 'bg-teal-300/15 text-teal-200' : 'bg-violet-300/15 text-violet-200'}`}><Icon size={20} /></span><p className="mt-14 text-xs text-slate-500">{label}</p><p className="mt-1 font-display text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-slate-600">{note}</p></div>
}

function Page({ children, title, action }) {
  return <div className="page-wrap">{title && <div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">The commons</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{title}</h1></div>{action}</div>}{children}</div>
}

function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ id: 'welcome', content: 'Hi, I’m here with you. What feels most present for you today?', is_user: false }])
  const [thinking, setThinking] = useState('')
  const [busy, setBusy] = useState(false)
  const [threadId, setThreadId] = useState(null)
  const [threads, setThreads] = useState([])
  const endRef = useRef(null)
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, thinking])
  useEffect(() => { api('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const loadThread = async (id) => {
    try {
      const data = await api(`/mental-health/threads/${id}`)
      setThreadId(id)
      setMessages(data.messages?.length ? data.messages : [{ id: 'welcome', content: 'This thread is ready when you are.', is_user: false }])
    } catch { /* keep the current conversation available offline */ }
  }
  const send = async (event) => {
    event?.preventDefault(); if (!message.trim() || busy) return
    const outgoing = message.trim(); setMessage(''); setMessages((items) => [...items, { id: Date.now(), content: outgoing, is_user: true }]); setBusy(true); setThinking('Opening a calm thread…')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ message: outgoing, thread_id: threadId }) })
      if (!response.ok || !response.body) throw new Error('offline')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let responseText = ''; let assistantAdded = false
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach((chunk) => { const line = chunk.split('\n').find((item) => item.startsWith('data: ')); if (!line) return; try { const payload = JSON.parse(line.slice(6)); if (payload.type === 'thread_id') setThreadId(payload.data); if (payload.type === 'thinking') setThinking(payload.data); if (payload.type === 'token') { responseText += payload.data; setThinking(''); if (!assistantAdded) { setMessages((items) => [...items, { id: `assistant-${Date.now()}`, content: '', is_user: false }]); assistantAdded = true } setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: responseText } : item)) } if (payload.type === 'complete') setThinking('') } catch { /* ignore malformed stream chunks */ } })
      }
    } catch { setThinking(''); setMessages((items) => [...items, { id: `fallback-${Date.now()}`, content: 'I’m still here. The connection is taking a moment, so try again when you’re ready. In the meantime, take one slow breath in for four, and out for six.', is_user: false }]) } finally { setBusy(false); setThinking('') }
  }
  return <Page><div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]"><div className="glass rounded-3xl p-6"><p className="eyebrow">AI companion</p><h1 className="mt-3 font-display text-4xl font-semibold">A little less alone.</h1><p className="mt-4 text-sm leading-6 text-slate-400">A private, compassionate conversation for whatever is here. No diagnosis, no judgment — just a place to begin.</p><div className="mt-8 space-y-2">{['I feel overwhelmed today', 'Help me find some calm', 'I want to reflect on my week'].map((prompt) => <button key={prompt} onClick={() => setMessage(prompt)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 text-left text-xs text-slate-300 transition hover:border-violet-300/30 hover:bg-violet-300/5"><span>{prompt}</span><ArrowUpRight size={14} className="text-slate-600" /></button>)}</div>{threads.length > 0 && <div className="mt-8 border-t border-white/10 pt-5"><p className="eyebrow">Past threads</p><div className="mt-3 space-y-1">{threads.slice(0, 4).map((thread) => <button key={thread.id} onClick={() => loadThread(thread.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs ${thread.id === threadId ? 'bg-violet-300/10 text-violet-100' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}><MessageCircle size={13} /><span className="truncate">{thread.title}</span></button>)}</div></div>}<div className="mt-8 flex gap-3 border-t border-white/10 pt-5 text-[11px] leading-5 text-slate-600"><ShieldCheck className="mt-0.5 shrink-0 text-teal-200" size={15} /> If you’re in immediate danger, please contact local emergency services or a crisis line.</div></div><div className="glass flex min-h-[630px] flex-col rounded-3xl"><div className="flex items-center justify-between border-b border-white/10 p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-300/30 to-teal-300/20 text-teal-100"><Sparkles size={17} /></span><div><p className="text-sm font-semibold">Your companion</p><p className="flex items-center gap-1 text-[11px] text-teal-200"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" /> Here with you</p></div></div><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-500">PRIVATE</span></div><div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">{messages.map((item) => <div key={item.id} className={`flex gap-3 ${item.is_user ? 'justify-end' : ''}`}>{!item.is_user && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-300/10 text-violet-200"><Sparkles size={13} /></span>}<div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.is_user ? 'rounded-br-md bg-violet-300/20 text-violet-50' : 'rounded-bl-md bg-white/[.06] text-slate-300'}`}>{item.content}</div>{item.is_user && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-300/10 text-teal-200"><UserRound size={13} /></span>}</div>)}{thinking && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle className="animate-spin text-teal-200" size={14} /> {thinking}</div>}<div ref={endRef} /></div><form onSubmit={send} className="border-t border-white/10 p-4"><div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-slate-950/25 p-2 pl-4"><textarea rows="1" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(event) } }} placeholder="Share what’s on your mind…" className="max-h-28 flex-1 resize-none bg-transparent py-2 text-sm text-slate-200 placeholder:text-slate-600" /><button disabled={busy || !message.trim()} className="btn-primary grid h-9 w-9 shrink-0 place-items-center rounded-xl disabled:opacity-40"><Send size={15} /></button></div><p className="mt-2 text-center text-[10px] text-slate-600">ZenHeaven is a wellness companion, not a replacement for professional care.</p></form></div></div></Page>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [insights, setInsights] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saved, setSaved] = useState(false)
  useEffect(() => { Promise.all([api('/journal/entries'), api('/journal/prompts')]).then(([items, promptList]) => { setEntries(Array.isArray(items) ? items : []); setPrompts(promptList) }).catch(() => setPrompts([{ prompt: 'What made you smile today?', category: 'gratitude' }, { prompt: 'What is one small win you had today?', category: 'achievements' }, { prompt: 'Describe a moment of calm you experienced recently.', category: 'mindfulness' }])) }, [])
  useEffect(() => { api('/journal/insights').then(setInsights).catch(() => {}) }, [])
  const analyze = async () => { if (!content.trim()) return; try { setAnalysis(await api('/journal/analyze-mood', { method: 'POST', body: JSON.stringify({ content }) })) } catch { setAnalysis({ mood, mood_description: 'Your words are worth noticing. Stay curious and gentle with what they reveal.', suggestions: ['Take one unhurried breath', 'Name one thing you can control today'] }) } }
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; try { const item = await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood, tags: [] }) }); setEntries((current) => [item, ...current]) } catch { setEntries((current) => [{ _id: Date.now(), title: 'A moment to remember', content, mood, created_at: new Date().toISOString() }, ...current]) } setContent(''); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  return <Page><div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Your inner weather</p><h1 className="mt-2 font-display text-4xl font-semibold">Make room for the day.</h1><p className="mt-3 text-sm text-slate-500">There is no right way to write here.</p></div><div className="flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/5 px-4 py-2 text-xs text-violet-100"><PenLine size={14} /> {insights?.total_entries || 6} reflections</div></div><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><form onSubmit={save} className="glass rounded-3xl p-6 sm:p-8"><div className="flex items-center justify-between"><p className="text-sm font-semibold">A page for right now</p><span className="text-xs text-slate-600">{content.length}/2000</span></div><textarea maxLength="2000" value={content} onChange={(event) => setContent(event.target.value)} placeholder="What feels true today?" className="mt-6 min-h-[240px] w-full resize-none bg-transparent text-lg leading-8 text-slate-200 placeholder:text-slate-700" /><div className="border-t border-white/10 pt-5"><p className="mb-3 text-xs font-semibold text-slate-400">Name the weather</p><div className="flex flex-wrap gap-2">{['calm', 'hopeful', 'tender', 'anxious', 'tired'].map((item) => <button type="button" key={item} onClick={() => setMood(item)} className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${mood === item ? 'border-teal-300/40 bg-teal-300/10 text-teal-100' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>{item}</button>)}</div></div><div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={analyze} disabled={!content.trim()} className="btn-ghost rounded-xl px-4 py-3 text-sm font-semibold text-violet-100 disabled:opacity-40"><Sparkles className="mr-2 inline" size={15} /> Analyze mood</button><button disabled={!content.trim()} className="btn-primary rounded-xl px-5 py-3 text-sm font-bold disabled:opacity-40">{saved ? <><Check className="mr-2 inline" size={15} /> Saved +10 coins</> : <><Plus className="mr-2 inline" size={15} /> Save reflection</>}</button></div>{analysis && <div className="mt-5 rounded-2xl border border-teal-300/20 bg-teal-300/5 p-4"><p className="text-xs uppercase tracking-widest text-teal-200">Mood signal · {analysis.mood}</p><p className="mt-2 text-sm leading-6 text-slate-300">{analysis.mood_description}</p></div>}</form><div className="glass rounded-3xl p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">A nudge, if useful</p><h2 className="mt-2 font-display text-xl font-semibold">Try a prompt</h2></div><Sparkles className="text-violet-200" size={18} /></div><div className="mt-6 space-y-3">{prompts.slice(0, 4).map((prompt) => <button key={prompt.prompt} onClick={() => setContent(prompt.prompt + '\n\n')} className="group w-full rounded-2xl border border-white/10 bg-white/[.035] p-4 text-left"><span className="text-[10px] uppercase tracking-widest text-teal-200">{prompt.category}</span><p className="mt-2 text-sm leading-5 text-slate-300">{prompt.prompt}</p><ArrowRight className="mt-3 text-slate-600 transition group-hover:translate-x-1 group-hover:text-teal-200" size={14} /></button>)}</div></div></div><div className="mt-8"><p className="eyebrow">Your pages</p><div className="mt-4 grid gap-3 md:grid-cols-2">{(entries.length ? entries : [{ _id: 1, title: 'The kind of morning I needed', content: 'I made tea and stood by the window. Small things can hold a lot of care.', mood: 'calm', created_at: new Date().toISOString() }]).slice(0, 4).map((entry) => <div key={entry._id} className="glass-subtle rounded-2xl p-5"><div className="flex items-start justify-between"><p className="font-display font-semibold">{entry.title || 'Untitled reflection'}</p><span className="rounded-full bg-violet-300/10 px-2 py-1 text-[10px] capitalize text-violet-200">{entry.mood || 'reflection'}</span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{entry.content}</p><p className="mt-4 text-[11px] text-slate-600">{formatDate(entry.created_at)}</p></div>)}</div></div></Page>
}

function Books({ user }) {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  const [loading, setLoading] = useState(false)
  useEffect(() => { api(`/books/recommend-by-mood${user?.id ? `?user_id=${user.id}` : ''}`).then((data) => { if (data.books?.length) { setBooks(data.books); setMood(data.mood) } }).catch(() => {}) }, [user?.id])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; setLoading(true); try { const data = await api(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); setBooks(data.books || []) } catch { setBooks(fallbackBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))) } finally { setLoading(false) } }
  return <Page><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">The reading room</p><h1 className="mt-2 font-display text-4xl font-semibold">A book for this season.</h1><p className="mt-3 max-w-lg text-sm text-slate-500">Thoughtful reads, chosen around your inner weather. Currently tuned for <span className="capitalize text-teal-200">{mood}</span>.</p></div><form onSubmit={search} className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2"><Search size={16} className="text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-1 text-sm placeholder:text-slate-600" placeholder="Search the shelves…" /><button className="text-xs font-semibold text-teal-200">Search</button></form></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{loading ? <LoaderCircle className="animate-spin text-violet-200" /> : books.map((book) => <BookCard key={book.id} book={book} />)}</div></Page>
}

function BookCard({ book }) {
  const [saved, setSaved] = useState(false)
  return <article className="glass group overflow-hidden rounded-3xl"><div className="relative h-56 overflow-hidden bg-slate-800"><img src={book.image_url || fallbackBooks[0].image_url} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" /><button onClick={() => setSaved(!saved)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-950/50 text-white backdrop-blur">{saved ? <Heart size={14} fill="currentColor" className="text-teal-200" /> : <Heart size={14} />}</button></div><div className="p-5"><p className="line-clamp-2 font-display font-semibold leading-5">{book.title}</p><p className="mt-2 text-xs text-violet-200">{book.author}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{book.description}</p><button className="mt-5 text-xs font-semibold text-teal-200">Explore book <ArrowUpRight className="ml-1 inline" size={13} /></button></div></article>
}

function Music() {
  const [songs, setSongs] = useState(['Weightless', 'Bloom', 'Holocene', 'Sunset Lover', 'Clair de Lune'])
  const [selected, setSelected] = useState('Weightless')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => { api('/songs').then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 40)) }).catch(() => {}) }, [])
  const recommend = async () => { setLoading(true); try { const data = await api(`/recommend?song=${encodeURIComponent(selected)}`); setRecommendations(data.recommendations || []) } catch { setRecommendations(fallbackBooks.slice(0, 3).map((book, index) => ({ name: ['A Walk', 'Quiet Hours', 'Open Sky'][index], artist: ['ZenHeaven Radio', 'The Stillness Club', 'Ambient Assembly'][index], album_cover_url: book.image_url }))) } finally { setLoading(false) } }
  return <Page><div className="mb-9"><p className="eyebrow">Your soundscape</p><h1 className="mt-2 font-display text-4xl font-semibold">Let the room change.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Music can meet us where words can’t. Find a starting point, then let the algorithm follow your mood.</p></div><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="glass rounded-3xl p-6"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-400/50 to-teal-300/30"><Music2 size={28} /></div><div><p className="eyebrow">Mood mix</p><h2 className="mt-1 font-display text-2xl font-semibold">Soft focus</h2></div></div><div className="mt-9 space-y-3"><label className="text-xs text-slate-500">Start with a song</label><select value={selected} onChange={(event) => setSelected(event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">{songs.slice(0, 30).map((song) => <option className="bg-slate-900" key={song}>{song}</option>)}</select><button onClick={recommend} className="btn-primary mt-2 w-full rounded-xl py-3 text-sm font-bold">{loading ? <LoaderCircle className="mx-auto animate-spin" size={17} /> : <><Sparkles className="mr-2 inline" size={16} /> Build my soundscape</>}</button></div><div className="mt-8 flex gap-3 border-t border-white/10 pt-5 text-xs text-slate-600"><HeadphoneIcon /><span>Use headphones if you can. Give yourself ten undistracted minutes.</span></div></div><div className="glass rounded-3xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Curated for your current frequency</p><h2 className="mt-2 font-display text-xl font-semibold">{recommendations.length ? 'Your next listens' : 'A quiet place to start'}</h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-500">5 TRACKS</span></div><div className="mt-6 space-y-3">{(recommendations.length ? recommendations : songs.slice(0, 5).map((name, i) => ({ name, artist: ['ZenHeaven Radio', 'Cigarettes After Sex', 'Bon Iver', 'Petit Biscuit', 'Piano in the Rain'][i], album_cover_url: fallbackBooks[i % fallbackBooks.length].image_url }))).map((song, index) => <div key={`${song.name}-${index}`} className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.035] p-2.5"><span className="w-5 text-center text-xs text-slate-600">{String(index + 1).padStart(2, '0')}</span><img src={song.album_cover_url} alt="" className="h-11 w-11 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{song.name}</p><p className="mt-1 truncate text-xs text-slate-500">{song.artist}</p></div><button className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 transition group-hover:bg-teal-300/15 group-hover:text-teal-200"><Play size={13} fill="currentColor" /></button></div>)}</div></div></div></Page>
}

function HeadphoneIcon() { return <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-300/10 text-violet-200"><Music2 size={13} /></span> }

function Therapists({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [selected, setSelected] = useState(null)
  const [specialization, setSpecialization] = useState('all')
  const [message, setMessage] = useState('')
  useEffect(() => { api('/therapists/').then((data) => { if (data.length) setTherapists(data) }).catch(() => {}) }, [])
  const specialties = [...new Set(therapists.flatMap((item) => item.specializations))]
  const filtered = specialization === 'all' ? therapists : therapists.filter((item) => item.specializations.includes(specialization))
  const book = async (therapist) => { setMessage(`A request for ${therapist.name} is ready. Choose a slot in their availability to confirm.`); try { const detail = await api(`/therapists/${therapist._id}`); setSelected({ ...therapist, ...detail }) } catch { setSelected(therapist) } }
  return <Page><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">The care circle</p><h1 className="mt-2 font-display text-4xl font-semibold">Find your person.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Licensed professionals for the moments that deserve more support. Take your time finding a good fit.</p></div><div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-teal-200" /> Vetted practitioners</div></div><div className="mt-8 flex gap-2 overflow-x-auto pb-2">{['all', ...specialties].map((item) => <button key={item} onClick={() => setSpecialization(item)} className={`shrink-0 rounded-full border px-3 py-2 text-xs capitalize ${specialization === item ? 'border-teal-300/40 bg-teal-300/10 text-teal-100' : 'border-white/10 text-slate-500'}`}>{item}</button>)}</div>{message && <div className="mt-3 rounded-xl border border-teal-300/20 bg-teal-300/10 p-3 text-sm text-teal-100">{message}</div>}<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((therapist) => <TherapistCard key={therapist._id} therapist={therapist} onBook={() => book(therapist)} />)}</div>{selected && <BookingModal therapist={selected} user={user} onClose={() => setSelected(null)} onDone={(text) => { setMessage(text); setSelected(null) }} />}</Page>
}

function TherapistCard({ therapist, onBook }) {
  return <article className="glass rounded-3xl p-5"><div className="flex items-start gap-4"><img src={therapist.photo_url || 'https://i.pravatar.cc/160?img=12'} alt="" className="h-16 w-16 rounded-2xl object-cover" /><div className="min-w-0"><div className="flex items-center gap-1 text-xs text-amber-200"><Star size={12} fill="currentColor" /> {therapist.rating}</div><h2 className="mt-1 truncate font-display text-lg font-semibold">{therapist.name}</h2><p className="text-xs text-slate-500">{therapist.experience_years} years experience</p></div></div><div className="mt-5 flex flex-wrap gap-1.5">{therapist.specializations.slice(0, 3).map((item) => <span className="rounded-full bg-violet-300/10 px-2.5 py-1 text-[10px] text-violet-100" key={item}>{item}</span>)}</div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{therapist.bio}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-slate-500"><strong className="font-display text-lg text-slate-200">${therapist.hourly_rate}</strong> / session</span><button onClick={onBook} className="btn-ghost rounded-xl px-3 py-2 text-xs font-semibold text-teal-100">View profile <ArrowUpRight className="ml-1 inline" size={13} /></button></div></article>
}

function BookingModal({ therapist, user, onClose, onDone }) {
  const [slots, setSlots] = useState(therapist.available_slots || [])
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(false)
  useEffect(() => { if (!slots.length && therapist._id) api(`/therapists/${therapist._id}`).then((data) => setSlots(data.available_slots || [])).catch(() => {}) }, [slots.length, therapist._id])
  const reserve = async () => { if (!selected) return; setBooking(true); try { await api('/therapists/appointments', { method: 'POST', body: JSON.stringify({ user_id: user?.id || 'demo-user', therapist_id: therapist._id, date: selected.start_time, start_time: selected.start_time, end_time: selected.end_time, session_type: 'video' }) }); onDone(`Your video session with ${therapist.name} is booked.`) } catch { onDone(`We saved your interest in ${therapist.name}. Connect the API to confirm a live slot.`) } finally { setBooking(false) } }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm"><div className="glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><img src={therapist.photo_url} alt="" className="h-14 w-14 rounded-2xl object-cover" /><div><p className="eyebrow">Profile</p><h2 className="font-display text-xl font-semibold">{therapist.name}</h2></div></div><button onClick={onClose} className="btn-ghost rounded-lg p-2"><X size={16} /></button></div><p className="mt-6 text-sm leading-6 text-slate-400">{therapist.bio}</p><div className="mt-6 flex items-center gap-5 text-xs text-slate-500"><span><Clock3 className="mr-1 inline text-teal-200" size={14} /> 50 min sessions</span><span><CircleDollarSign className="mr-1 inline text-teal-200" size={14} /> ${therapist.hourly_rate}</span></div><p className="eyebrow mt-8">Choose a time</p><div className="mt-3 grid max-h-52 grid-cols-2 gap-2 overflow-y-auto">{(slots.length ? slots.slice(0, 10) : [{ start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString() }]).map((slot) => <button key={slot.start_time} onClick={() => setSelected(slot)} className={`rounded-xl border p-3 text-left text-xs ${selected?.start_time === slot.start_time ? 'border-teal-300/40 bg-teal-300/10 text-teal-100' : 'border-white/10 text-slate-400'}`}><CalendarDays className="mb-2 text-violet-200" size={14} />{new Date(slot.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}<span className="mt-1 block text-slate-500">{new Date(slot.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></button>)}</div><button disabled={!selected || booking} onClick={reserve} className="btn-primary mt-7 w-full rounded-xl py-3 text-sm font-bold disabled:opacity-40">{booking ? <LoaderCircle className="mx-auto animate-spin" size={17} /> : 'Request this session'}</button></div></div>
}

function Coins({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [transactions, setTransactions] = useState([])
  const [achievements, setAchievements] = useState([])
  const [streak, setStreak] = useState(6)
  const [redeemed, setRedeemed] = useState(false)
  useEffect(() => { Promise.all([api('/coins/balance'), api('/coins/transactions'), api('/coins/achievements'), api('/coins/streak')]).then(([b, t, a, s]) => { setBalance(b.balance); setTransactions(t); setAchievements(a); setStreak(s.current_streak) }).catch(() => {}) }, [])
  const redeem = async () => { try { const result = await api('/coins/spend', { method: 'POST', body: JSON.stringify({ amount: 100, source: 'rewards', description: 'Redeemed a premium insight session' }) }); setBalance(result.new_balance) } catch { setBalance((current) => Math.max(0, current - 100)) } setRedeemed(true); setTimeout(() => setRedeemed(false), 2200) }
  const visibleTransactions = transactions.length ? transactions : [{ amount: 15, source: 'journal', description: 'Created a new journal entry', timestamp: new Date().toISOString(), transaction_type: 'earn' }, { amount: 5, source: 'mental_health_chat', description: 'Checked in with your companion', timestamp: new Date(Date.now() - 86400000).toISOString(), transaction_type: 'earn' }, { amount: 100, source: 'welcome', description: 'Welcome to ZenHeaven', timestamp: new Date(Date.now() - 172800000).toISOString(), transaction_type: 'earn' }]
  return <Page><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Your gentle economy</p><h1 className="mt-2 font-display text-4xl font-semibold">Calm coins.</h1><p className="mt-3 text-sm text-slate-500">A small thank-you for choosing yourself.</p></div><div className="flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-200/5 px-4 py-2 text-xs text-teal-100"><Zap size={14} /> {streak} day rhythm</div></div><div className="mt-9 grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="rounded-3xl bg-gradient-to-br from-violet-400/30 via-violet-500/10 to-teal-300/10 p-7 shadow-glass"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-teal-100"><CircleDollarSign size={22} /></span><span className="text-xs text-violet-100/70">AVAILABLE BALANCE</span></div><p className="mt-14 font-display text-6xl font-semibold">{balance}</p><p className="mt-2 text-sm text-slate-300">coins to spend on your care</p><div className="mt-8 flex items-center justify-between gap-3 text-xs text-teal-100"><span><Award className="mr-1 inline" size={15} /> Keep showing up — it compounds.</span><button onClick={redeem} disabled={balance < 100} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold disabled:opacity-40">{redeemed ? 'Redeemed' : 'Redeem 100'}</button></div></div><div className="glass rounded-3xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Daily orbit</p><h2 className="mt-2 font-display text-xl font-semibold">Earn your next small win</h2></div><Target className="text-teal-200" size={19} /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[{ label: 'Check in', amount: 5, icon: MessageCircle }, { label: 'Write a page', amount: 10, icon: PenLine }, { label: 'Read something kind', amount: 8, icon: BookOpen }, { label: 'Keep your rhythm', amount: 50, icon: FlameIcon }].map(({ label, amount, icon: Icon }) => <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3" key={label}><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-300/10 text-teal-200"><Icon size={16} /></span><span className="flex-1 text-xs text-slate-300">{label}</span><span className="text-xs text-teal-200">+{amount}</span></div>)}</div></div></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="glass rounded-3xl p-6"><p className="eyebrow">Recent movement</p><div className="mt-5 space-y-1">{visibleTransactions.slice(0, 5).map((transaction, index) => <div key={`${transaction.timestamp}-${index}`} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-0"><span className={`grid h-8 w-8 place-items-center rounded-full ${transaction.transaction_type === 'spend' ? 'bg-violet-300/10 text-violet-200' : 'bg-teal-300/10 text-teal-200'}`}>{transaction.transaction_type === 'spend' ? <ArrowUpRight size={14} /> : <Plus size={14} />}</span><div className="min-w-0 flex-1"><p className="truncate text-xs text-slate-300">{transaction.description}</p><p className="mt-1 text-[10px] capitalize text-slate-600">{transaction.source} · {formatDate(transaction.timestamp)}</p></div><span className={`text-sm font-semibold ${transaction.transaction_type === 'spend' ? 'text-violet-200' : 'text-teal-200'}`}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</span></div>)}</div></div><div className="glass rounded-3xl p-6"><p className="eyebrow">Milestones</p><div className="mt-5 space-y-3">{(achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental wellness journey', coins: 50, unlocked: true, icon: 'Star' }, { title: 'Steady presence', description: 'Showed up 7 days in a row', coins: 100, unlocked: false, icon: 'MessageCircle' }, { title: 'Wellness warrior', description: 'Earn 1,000 total coins', coins: 300, unlocked: false, icon: 'Trophy' }]).map((item) => <div className={`flex items-center gap-3 rounded-2xl border p-3 ${item.unlocked ? 'border-teal-300/20 bg-teal-300/5' : 'border-white/8 bg-white/[.02] opacity-60'}`} key={item.title}><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-300/10 text-violet-200">{item.unlocked ? <Check size={16} /> : <LockKeyhole size={15} />}</span><span className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 truncate text-[10px] text-slate-500">{item.description}</p></span><span className="text-[10px] text-teal-200">+{item.coins}</span></div>)}</div></div></div></Page>
}

function FlameIcon({ size }) { return <span style={{ fontSize: size ? `${size}px` : undefined }}>✦</span> }

createRoot(document.getElementById('root')).render(<App />)

export default App
