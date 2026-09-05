import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDownLeft, ArrowLeft, ArrowUpRight, AudioLines, BookOpen, Brain, CalendarDays,
  Check, ChevronRight, CircleDollarSign, Clock3, CloudSun, Compass, Copy, Feather,
  Flame, Heart, Home, Leaf, Library, LockKeyhole, LogOut, Menu, MessageCircle,
  Mic2, MoreHorizontal, Music2, Pause, PenLine, Play, Plus, Search, Send, Settings2,
  ShieldCheck, Sparkles, Star, Tag, Trash2, TrendingUp, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './index.css'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const demoUser = {
  id: 'demo-zora',
  username: 'zora',
  email: 'zora@zenheaven.app',
  full_name: 'Zora',
  calm_coins: 284,
}

const seededJournal = [
  { id: '1', title: 'A softer start', content: 'I noticed I moved slower this morning. It felt good to let the day arrive instead of chasing it.', mood: 'calm', created_at: '2026-09-05T08:30:00Z', tags: ['slowness', 'morning'] },
  { id: '2', title: 'Making room', content: 'There are a few open loops in my head, but naming them made them feel much smaller.', mood: 'hopeful', created_at: '2026-09-03T19:10:00Z', tags: ['clarity'] },
  { id: '3', title: 'A good kind of tired', content: 'Finished the thing I had been avoiding. The relief is quiet and real.', mood: 'grateful', created_at: '2026-09-01T21:45:00Z', tags: ['progress'] },
]

const books = [
  { id: 'b1', title: 'The Art of Stillness', author: 'Pico Iyer', category: 'presence', color: 'bg-[#d8d1ff]', blurb: 'Adventures in a world that won’t stop moving.' },
  { id: 'b2', title: 'Wintering', author: 'Katherine May', category: 'rest', color: 'bg-[#d9eee8]', blurb: 'The power of rest and retreat in difficult times.' },
  { id: 'b3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', category: 'connection', color: 'bg-[#d4e1af]', blurb: 'Indigenous wisdom, scientific knowledge and the teachings of plants.' },
  { id: 'b4', title: 'How to Do Nothing', author: 'Jenny Odell', category: 'attention', color: 'bg-[#ffe2b8]', blurb: 'Resisting the attention economy.' },
  { id: 'b5', title: 'The Book of Delights', author: 'Ross Gay', category: 'joy', color: 'bg-[#ffc5b7]', blurb: 'Small, daily invitations to notice what is good.' },
  { id: 'b6', title: 'On Earth We’re Briefly Gorgeous', author: 'Ocean Vuong', category: 'reflection', color: 'bg-[#c8e2f4]', blurb: 'A letter from a son to a mother who cannot read.' },
]

const tracks = [
  { title: 'A Walk at Dusk', artist: 'Nils Frahm', time: '4:12', tone: 'bg-[#d8d1ff]', cover: '01' },
  { title: 'Weightless', artist: 'Marconi Union', time: '8:10', tone: 'bg-[#d9eee8]', cover: '02' },
  { title: 'An Ending (Ascent)', artist: 'Brian Eno', time: '4:25', tone: 'bg-[#ffe2b8]', cover: '03' },
  { title: 'Near Light', artist: 'Ólafur Arnalds', time: '3:48', tone: 'bg-[#ffc5b7]', cover: '04' },
  { title: 'Bloom', artist: 'Ryuichi Sakamoto', time: '5:03', tone: 'bg-[#c8e2f4]', cover: '05' },
]

const therapists = [
  { id: 't1', name: 'Dr. Mira Sen', role: 'Anxiety & burnout', initials: 'MS', color: 'bg-[#d8d1ff]', rating: '4.9', rate: '80', next: 'Today · 6:30 PM', languages: 'EN · HI' },
  { id: 't2', name: 'Alex Rivera', role: 'Relationships & identity', initials: 'AR', color: 'bg-[#d9eee8]', rating: '4.8', rate: '65', next: 'Tomorrow · 10:00 AM', languages: 'EN · ES' },
  { id: 't3', name: 'Nia Okafor', role: 'Grief & life transitions', initials: 'NO', color: 'bg-[#ffc5b7]', rating: '5.0', rate: '90', next: 'Fri · 4:00 PM', languages: 'EN · FR' },
]

const fallback = {
  '/songs': { songs: tracks.map((track) => track.title) },
  '/books/recommend-by-mood': { mood: 'calm', books },
  '/therapists': therapists,
  '/coins/balance': { balance: demoUser.calm_coins },
  '/coins/transactions': [
    { _id: '1', amount: 15, transaction_type: 'earn', source: 'journal', description: 'Created a new journal entry', timestamp: '2026-09-05T08:30:00Z' },
    { _id: '2', amount: 5, transaction_type: 'earn', source: 'mental_health_chat', description: 'Engaged with mental health support', timestamp: '2026-09-04T18:12:00Z' },
    { _id: '3', amount: 50, transaction_type: 'earn', source: 'weekly_streak', description: '7-day reflection streak', timestamp: '2026-09-01T09:00:00Z' },
  ],
}

async function api(path, options = {}) {
  const token = localStorage.getItem('zen-token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  } catch {
    return fallback[path] ?? null
  }
}

function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', ...options }).format(new Date(value))
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route element={<ProtectedShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/books" element={<Books />} />
          <Route path="/music" element={<Music />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/coins" element={<Coins />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <header className="flex h-24 items-center justify-between">
          <Link to="/" className="display flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-lime text-sm shadow-sticker">✳</span>
            zenheaven<span className="text-ink/35">/zora</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#rituals" className="hover:underline">The rituals</a>
            <a href="#manifesto" className="hover:underline">Manifesto</a>
            <Link to="/login" className="btn-dark !px-4 !py-2.5">Open studio <ArrowUpRight size={15} /></Link>
          </nav>
          <Link to="/login" className="md:hidden"><Menu size={22} /></Link>
        </header>

        <main>
          <section className="relative grid min-h-[640px] items-center gap-14 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-8 flex items-center gap-3">
                <span className="eyebrow rounded-full border border-ink/15 bg-white px-3 py-2">A digital studio for feeling</span>
                <span className="h-2 w-2 rounded-full bg-coral" />
                <span className="mono text-[10px] text-ink/45">01—07</span>
              </div>
              <h1 className="display text-balance text-6xl font-bold leading-[.93] tracking-[-.07em] sm:text-8xl">
                Make space<br /><span className="text-ink/30">for your</span><br /><span className="relative inline-block">inner life<span className="absolute -right-10 -top-2 text-3xl text-coral">✦</span></span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/60">ZenHeaven is a small, thoughtful corner of the internet for your mind to exhale, wander and make something new.</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button onClick={() => navigate('/register')} className="btn-lime">Start your ritual <ArrowUpRight size={17} /></button>
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm font-semibold underline decoration-ink/25 underline-offset-4">I already have a space <ArrowRightSmall /></button>
              </div>
            </div>
            <div className="relative mx-auto h-[470px] w-full max-w-[560px]">
              <div className="grain absolute right-2 top-6 h-[370px] w-[82%] rotate-3 rounded-[3rem] bg-lime sm:right-8" />
              <div className="absolute left-[7%] top-0 h-[360px] w-[78%] -rotate-6 rounded-[3rem] border-2 border-ink bg-[#d8d1ff] p-6 shadow-sticker">
                <div className="flex items-center justify-between"><span className="eyebrow">Today, gently</span><MoreHorizontal size={17} /></div>
                <div className="mt-24">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">☼</div>
                  <p className="display max-w-xs text-4xl font-bold leading-none tracking-[-.06em]">How are you arriving today?</p>
                  <p className="mt-5 text-sm text-ink/60">There is no wrong answer.</p>
                </div>
                <div className="absolute bottom-5 left-6 right-6 flex justify-between border-t border-ink/15 pt-3"><span className="mono text-[10px]">CHECK-IN / 001</span><span className="text-xs">↗</span></div>
              </div>
              <div className="float absolute bottom-0 right-0 w-48 rotate-6 rounded-[2rem] border-2 border-ink bg-white p-5 shadow-sticker sm:right-2">
                <div className="mb-8 flex justify-between"><span className="text-2xl">◌</span><span className="eyebrow">mood</span></div>
                <p className="display text-2xl font-bold leading-none">Softly<br />hopeful</p>
                <div className="mt-7 h-1.5 rounded-full bg-ink/10"><div className="h-full w-2/3 rounded-full bg-coral" /></div>
              </div>
              <span className="absolute -right-1 top-12 grid h-16 w-16 place-items-center rounded-full bg-coral text-center text-xs font-bold leading-tight text-white shadow-sticker sm:right-0">keep<br />going</span>
            </div>
          </section>

          <section id="rituals" className="border-t border-ink/10 py-20">
            <div className="mb-10 flex items-end justify-between">
              <div><p className="eyebrow text-ink/45">The studio has room for</p><h2 className="display mt-3 text-4xl font-bold tracking-[-.05em]">A few good rituals.</h2></div>
              <span className="mono hidden text-xs text-ink/40 sm:block">SCROLL TO EXPLORE ↓</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ['01', 'Write it out', 'A private page for the thoughts between thoughts.', 'bg-[#d8d1ff]', PenLine],
                ['02', 'Talk it through', 'A calm, always-on companion for the messy middle.', 'bg-[#d9eee8]', MessageCircle],
                ['03', 'Find a thread', 'Books, sounds and people that meet you where you are.', 'bg-[#ffe2b8]', Compass],
                ['04', 'Collect calm', 'Tiny actions become a currency you can feel.', 'bg-[#ffc5b7]', CircleDollarSign],
              ].map(([num, title, copy, color, RitualIcon]) => (
                <div key={num} className={`group rounded-3xl border border-ink/10 ${color} p-6 transition hover:-translate-y-1 hover:shadow-sticker`}>
                  <div className="flex items-center justify-between"><span className="mono text-xs">{num}</span><RitualIcon size={20} /></div>
                  <h3 className="display mt-20 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-ink/60">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="manifesto" className="grid gap-10 border-t border-ink/10 py-20 lg:grid-cols-[.65fr_1fr]">
            <p className="eyebrow text-ink/45">A note from the studio</p>
            <div><p className="display max-w-3xl text-4xl font-bold leading-tight tracking-[-.05em] sm:text-6xl">“You don’t have to become a different person to feel better. You only need a little more room to be the person you already are.”</p><div className="mt-9 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">Z</span><span className="text-sm font-semibold">The ZenHeaven studio <span className="font-normal text-ink/45">/ est. 2026</span></span></div></div>
          </section>
        </main>
        <footer className="flex flex-col justify-between gap-5 border-t border-ink/10 py-8 text-sm text-ink/50 sm:flex-row"><span>© 2026 zenheaven / zora</span><span className="mono text-[10px]">MADE FOR THE IN-BETWEEN</span></footer>
      </div>
    </div>
  )
}

function ArrowRightSmall() { return <span aria-hidden="true">↗</span> }

function AuthPage({ mode }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isLogin = mode === 'login'
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    const result = await api(`/auth/${isLogin ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(isLogin ? { username: form.username || 'zora', password: form.password || 'demo123' } : form) })
    if (result?.access_token) {
      localStorage.setItem('zen-token', result.access_token)
      localStorage.setItem('zen-user', JSON.stringify(result.user))
    } else {
      localStorage.setItem('zen-token', 'demo-token')
      localStorage.setItem('zen-user', JSON.stringify({ ...demoUser, full_name: form.full_name || demoUser.full_name, username: form.username || demoUser.username }))
    }
    setBusy(false); navigate('/dashboard')
  }
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[.85fr_1.15fr]">
      <div className="hidden flex-col justify-between bg-ink p-10 text-white lg:flex">
        <Link to="/" className="display flex items-center gap-2 text-xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-lime text-sm text-ink">✳</span>zenheaven<span className="text-white/35">/zora</span></Link>
        <div><span className="eyebrow text-white/40">A small thought</span><p className="display mt-5 max-w-md text-5xl font-bold leading-[.95] tracking-[-.06em]">Come as you are.<br /><span className="text-lime">Leave with more room.</span></p></div>
        <div className="flex justify-between text-xs text-white/40"><span>Private by design.</span><span className="mono">02—07</span></div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-14 flex items-center gap-2 text-sm font-semibold lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-xl bg-lime">✳</span> zenheaven/zora</Link>
          <div className="mb-10"><p className="eyebrow text-ink/45">{isLogin ? 'Welcome back' : 'Make a little room'}</p><h1 className="display mt-3 text-5xl font-bold tracking-[-.06em]">{isLogin ? 'Good to see you.' : 'Your space awaits.'}</h1><p className="mt-4 text-sm leading-relaxed text-ink/55">{isLogin ? 'Pick up wherever you left off.' : 'A private studio for the thoughts, sounds and people that help you feel more like yourself.'}</p></div>
          <form onSubmit={submit} className="space-y-4">
            {!isLogin && <label className="block"><span className="mb-2 block text-xs font-semibold">What should we call you?</span><input className="field" name="full_name" value={form.full_name} onChange={update} placeholder="Your name" required /></label>}
            <label className="block"><span className="mb-2 block text-xs font-semibold">{isLogin ? 'Username' : 'Choose a username'}</span><input className="field" name="username" value={form.username} onChange={update} placeholder="e.g. zora" required /></label>
            {!isLogin && <label className="block"><span className="mb-2 block text-xs font-semibold">Email address</span><input className="field" type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>}
            <label className="block"><span className="mb-2 block text-xs font-semibold">Password</span><input className="field" type="password" name="password" value={form.password} onChange={update} placeholder="At least 6 characters" required /></label>
            {error && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="btn-dark w-full !py-3.5 disabled:opacity-50">{busy ? 'Opening your space…' : isLogin ? 'Enter studio' : 'Create my space'} <ArrowUpRight size={16} /></button>
          </form>
          <button onClick={() => { localStorage.setItem('zen-token', 'demo-token'); localStorage.setItem('zen-user', JSON.stringify(demoUser)); navigate('/dashboard') }} className="mt-3 w-full rounded-full border border-dashed border-ink/25 px-4 py-3 text-xs font-semibold text-ink/60 hover:border-ink hover:text-ink">Explore the demo without an account</button>
          <p className="mt-8 text-center text-sm text-ink/50">{isLogin ? 'New to ZenHeaven?' : 'Already have a space?'} <Link className="font-semibold text-ink underline underline-offset-4" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create one' : 'Sign in'}</Link></p>
        </div>
      </div>
    </div>
  )
}

function ProtectedShell() {
  const token = localStorage.getItem('zen-token')
  if (!token) return <Navigate to="/login" replace />
  return <StudioShell />
}

function StudioShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('zen-user') || JSON.stringify(demoUser))
  const links = [
    { to: '/dashboard', label: 'Overview', icon: Home },
    { to: '/chat', label: 'Companion', icon: MessageCircle },
    { to: '/journal', label: 'Journal', icon: Feather },
    { to: '/books', label: 'Library', icon: BookOpen },
    { to: '/music', label: 'Sound room', icon: Music2 },
    { to: '/therapists', label: 'People', icon: UsersRound },
  ]
  const logout = () => { localStorage.removeItem('zen-token'); localStorage.removeItem('zen-user'); navigate('/') }
  return (
    <div className="min-h-screen bg-paper">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink/10 bg-[#f0f0e9] p-5 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between"><Link to="/dashboard" className="display flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-xl bg-lime text-sm shadow-sticker">✳</span>zenheaven</Link><button onClick={() => setMobileOpen(false)} className="lg:hidden"><X size={18} /></button></div>
        <div className="mt-12"><p className="eyebrow mb-3 px-3 text-ink/35">Your studio</p><nav className="space-y-1">{links.map(({ to, label, icon: NavIcon }) => <NavLink onClick={() => setMobileOpen(false)} key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><NavIcon size={17} strokeWidth={1.8} />{label}</NavLink>)}</nav></div>
        <div className="mt-auto space-y-4">
          <Link to="/coins" className={`block rounded-3xl border border-ink/10 bg-white p-4 ${location.pathname === '/coins' ? 'ring-2 ring-lime' : ''}`}><div className="flex items-center justify-between"><span className="eyebrow">Calm coins</span><CircleDollarSign size={16} /></div><div className="mt-3 flex items-end justify-between"><span className="display text-3xl font-bold">{user.calm_coins || 284}</span><span className="text-xs text-ink/45">↗ view vault</span></div><div className="mt-3 h-1 rounded-full bg-ink/10"><div className="h-full w-3/5 rounded-full bg-lime" /></div></Link>
          <div className="flex items-center gap-3 border-t border-ink/10 pt-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">{(user.full_name || 'Z').slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.full_name || 'Zora'}</p><p className="truncate text-xs text-ink/45">@{user.username || 'zora'}</p></div><button onClick={logout} title="Log out" className="text-ink/40 hover:text-ink"><LogOut size={16} /></button></div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-ink/30 lg:hidden" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-ink/10 bg-paper/85 px-5 backdrop-blur sm:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu size={22} /></button>
          <div className="hidden items-center gap-2 text-xs text-ink/45 sm:flex"><span className="h-2 w-2 rounded-full bg-lime" /> Your space is private</div>
          <div className="ml-auto flex items-center gap-3"><Link to="/coins" className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-semibold"><CircleDollarSign size={14} /> {user.calm_coins || 284}</Link><button className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white"><Settings2 size={16} /></button></div>
        </header>
        <main className="mx-auto max-w-[1280px] px-5 py-9 sm:px-8 lg:px-12"><RoutesOutlet /></main>
      </div>
    </div>
  )
}

function RoutesOutlet() {
  return <Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Routes>
}

function PageHeader({ eyebrow, title, copy, action }) {
  return <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-ink/40">{eyebrow}</p><h1 className="display mt-3 text-5xl font-bold tracking-[-.065em]">{title}</h1>{copy && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/55">{copy}</p>}</div>{action}</div>
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('zen-user') || JSON.stringify(demoUser))
  const [mood, setMood] = useState('calm')
  const navigate = useNavigate()
  return (
    <div>
      <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-ink/40">Saturday, September 5, 2026</p><h1 className="display mt-3 text-5xl font-bold tracking-[-.07em] sm:text-6xl">Good morning, {user.full_name || 'Zora'}.</h1><p className="mt-4 text-ink/55">A little check-in before you get on with your day?</p></div><Link to="/journal" className="btn-dark self-start sm:self-auto">Open journal <PenLine size={16} /></Link></div>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9"><div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[32px] border-lime/90" /><div className="relative z-10"><div className="flex items-center justify-between"><span className="eyebrow text-white/45">Daily check-in / 001</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">+10 coins</span></div><h2 className="display mt-16 max-w-md text-4xl font-bold leading-[.96] tracking-[-.06em]">How are you arriving today?</h2><div className="mt-8 flex flex-wrap gap-2">{['calm', 'hopeful', 'tender', 'scattered'].map((item) => <button key={item} onClick={() => setMood(item)} className={`rounded-full border px-4 py-2 text-sm transition ${mood === item ? 'border-lime bg-lime text-ink' : 'border-white/20 text-white/65 hover:border-white/60'}`}>{item}</button>)}</div><button onClick={() => navigate('/journal')} className="mt-9 flex items-center gap-2 text-sm font-semibold text-lime">Write a few words <ArrowUpRight size={15} /></button></div></div>
        <div className="card flex flex-col justify-between bg-lime p-7"><div className="flex items-center justify-between"><span className="eyebrow">Your week in feeling</span><TrendingUp size={18} /></div><div><div className="mt-12 flex items-end gap-3"><span className="display text-7xl font-bold leading-none">74</span><span className="mb-1 text-sm font-semibold">/ 100<br /><span className="font-normal text-ink/55">softness score</span></span></div><div className="mt-7 flex items-end gap-1.5">{[30, 48, 42, 68, 55, 76, 62].map((height, index) => <div key={index} className="flex flex-1 flex-col gap-1"><div className={`rounded-t-sm ${index === 6 ? 'bg-coral' : 'bg-ink/20'}`} style={{ height: `${height}px` }} /><span className="mono text-center text-[9px] text-ink/40">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div></div></div>
      </section>
      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <QuickCard color="bg-[#d8d1ff]" icon={MessageCircle} label="Talk it out" title="Your companion is here." to="/chat" />
        <QuickCard color="bg-[#d9eee8]" icon={BookOpen} label="For your mood" title="A book for the in-between." to="/books" />
        <QuickCard color="bg-[#ffe2b8]" icon={Music2} label="Sound room" title="A quieter frequency." to="/music" />
      </section>
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow text-ink/40">Recent reflections</p><h2 className="display mt-2 text-2xl font-bold">Your journal, lately</h2></div><Link to="/journal" className="text-xs font-semibold underline underline-offset-4">See all</Link></div><div className="space-y-3">{seededJournal.slice(0, 2).map((entry) => <Link to="/journal" key={entry.id} className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-ink/30"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f0f0e9] text-xl">✦</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h3 className="truncate font-semibold">{entry.title}</h3><span className="mono shrink-0 text-[10px] text-ink/35">{formatDate(entry.created_at)}</span></div><p className="mt-1 truncate text-sm text-ink/50">{entry.content}</p></div><ChevronRight size={16} className="text-ink/30 transition group-hover:translate-x-1" /></Link>)}</div></div>
        <div className="rounded-3xl border border-ink/10 bg-white p-6"><div className="flex items-center justify-between"><p className="eyebrow text-ink/40">Small wins</p><Flame size={18} className="text-coral" /></div><div className="mt-7 flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-coral text-2xl text-white shadow-sticker">7</div><div><p className="display text-2xl font-bold">day streak</p><p className="text-sm text-ink/50">You showed up for yourself.</p></div></div><div className="mt-7 border-t border-ink/10 pt-5"><div className="flex justify-between text-xs"><span className="font-semibold">Next milestone</span><span className="mono text-ink/45">10 days</span></div><div className="mt-3 h-2 rounded-full bg-ink/10"><div className="h-full w-[70%] rounded-full bg-coral" /></div></div></div>
      </section>
    </div>
  )
}

function QuickCard({ color, icon: CardIcon, label, title, to }) {
  return <Link to={to} className={`group rounded-3xl border border-ink/10 ${color} p-5 transition hover:-translate-y-1 hover:shadow-sticker`}><div className="flex items-center justify-between"><span className="eyebrow text-ink/50">{label}</span><CardIcon size={18} /></div><div className="mt-12 flex items-end justify-between gap-3"><h3 className="display max-w-[13rem] text-xl font-bold leading-tight">{title}</h3><ArrowUpRight size={18} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div></Link>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ id: 'welcome', is_user: false, content: 'Hi, I’m here. What feels most present for you today?', timestamp: new Date().toISOString() }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [mobileThreads, setMobileThreads] = useState(false)

  useEffect(() => { api('/mental-health/threads').then((data) => setThreads(data?.threads || [])) }, [])
  const send = async (event) => {
    event?.preventDefault()
    const message = input.trim()
    if (!message || streaming) return
    setInput(''); setStreaming(true); setThinking('Listening closely…')
    setMessages((current) => [...current, { id: Date.now(), is_user: true, content: message, timestamp: new Date().toISOString() }, { id: `reply-${Date.now()}`, is_user: false, content: '', timestamp: new Date().toISOString(), streaming: true }])
    const updateReply = (text) => setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: `${item.content || ''}${text}` } : item))
    try {
      const token = localStorage.getItem('zen-token')
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, thread_id: activeThread }) })
      if (!response.ok || !response.body) throw new Error('stream unavailable')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n'); buffer = events.pop() || ''
        events.forEach((chunk) => {
          const line = chunk.split('\n').find((part) => part.startsWith('data:'))
          if (!line) return
          try {
            const payload = JSON.parse(line.replace('data: ', ''))
            if (payload.type === 'thread_id') setActiveThread(payload.data)
            if (payload.type === 'thinking') setThinking(payload.data)
            if (payload.type === 'token') updateReply(payload.data)
            if (payload.type === 'complete') setThinking('')
          } catch { /* Ignore incomplete SSE packets. */ }
        })
      }
    } catch {
      const demoReply = message.toLowerCase().includes('anxious') ? 'That sounds like a lot to hold at once. Let’s make the next five minutes smaller: unclench your jaw, put both feet on the floor, and name three things you can see. You do not have to solve the whole day right now.' : 'Thank you for putting that into words. We can stay with it for a little while, without rushing to fix anything. What part of it feels heaviest?'
      for (const word of demoReply.split(' ')) { updateReply(`${word} `); await new Promise((resolve) => setTimeout(resolve, 22)) }
      setThinking('')
    }
    setMessages((current) => current.map((item) => ({ ...item, streaming: false }))); setStreaming(false)
  }
  return (
    <div className="h-[calc(100vh-10rem)] min-h-[620px]">
      <div className="mb-6 flex items-end justify-between"><div><p className="eyebrow text-ink/40">A quiet conversation</p><h1 className="display mt-2 text-4xl font-bold tracking-[-.06em]">Companion</h1></div><button onClick={() => { setActiveThread(null); setMessages([{ id: 'welcome', is_user: false, content: 'Hi, I’m here. What feels most present for you today?', timestamp: new Date().toISOString() }]) }} className="btn-ghost"><Plus size={16} /> New thread</button></div>
      <div className="card flex h-full overflow-hidden">
        <aside className={`w-64 shrink-0 border-r border-ink/10 bg-[#f0f0e9] p-4 ${mobileThreads ? 'block' : 'hidden'} md:block`}><div className="flex items-center justify-between px-2"><span className="eyebrow text-ink/40">Your threads</span><button className="text-ink/40 md:hidden" onClick={() => setMobileThreads(false)}><X size={16} /></button></div><div className="mt-4 space-y-1">{threads.length === 0 && <p className="px-2 py-4 text-xs leading-relaxed text-ink/45">Your conversations will live here. Start a new one below.</p>}{threads.map((thread) => <button key={thread.id} onClick={async () => { setActiveThread(thread.id); const data = await api(`/mental-health/threads/${thread.id}`); if (data?.messages) setMessages(data.messages) }} className={`w-full rounded-xl p-3 text-left text-sm ${activeThread === thread.id ? 'bg-white font-semibold' : 'text-ink/55 hover:bg-white/60'}`}><p className="truncate">{thread.title}</p><span className="mono text-[9px] text-ink/35">{thread.message_count || 0} notes</span></button>)}</div></aside>
        <section className="flex min-w-0 flex-1 flex-col bg-white"><div className="flex items-center justify-between border-b border-ink/10 px-5 py-4"><button onClick={() => setMobileThreads(true)} className="text-ink/50 md:hidden"><Library size={18} /></button><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lime" /><span className="text-xs font-semibold">Zen companion</span><span className="text-xs text-ink/35">· always private</span></div><button className="text-ink/35"><MoreHorizontal size={18} /></button></div><div className="scrollbar flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">{messages.map((message) => <div key={message.id} className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] ${message.is_user ? 'rounded-3xl rounded-br-md bg-ink text-white' : 'rounded-3xl rounded-bl-md bg-[#f0f0e9]'} px-5 py-4 text-sm leading-relaxed`}><p>{message.content}{message.streaming && <span className="pulse-soft ml-1 inline-block h-2 w-2 rounded-full bg-coral" />}</p>{!message.is_user && message.id === 'welcome' && <div className="mt-4 flex flex-wrap gap-2">{['I feel a little anxious', 'Help me slow down', 'I just want to talk'].map((prompt) => <button onClick={() => setInput(prompt)} key={prompt} className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold hover:border-ink">{prompt}</button>)}</div>}</div></div>)}{thinking && <div className="flex items-center gap-2 text-xs text-ink/40"><span className="pulse-soft h-2 w-2 rounded-full bg-coral" />{thinking}</div>}</div><form onSubmit={send} className="border-t border-ink/10 p-4"><div className="flex items-center gap-2 rounded-2xl border border-ink/15 bg-paper p-2 focus-within:border-ink"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" placeholder="Write whatever is here…" /><button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white transition hover:bg-black disabled:opacity-40" disabled={!input.trim() || streaming}><Send size={16} /></button></div><p className="mt-2 px-2 text-[10px] text-ink/35">Not a crisis service. If you’re in immediate danger, contact local emergency services.</p></form></section>
      </div>
    </div>
  )
}

function Journal() {
  const [entries, setEntries] = useState(seededJournal)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ content: '', mood: 'calm', tags: '' })
  const [saved, setSaved] = useState(false)
  useEffect(() => { api('/journal/entries').then((data) => { if (Array.isArray(data) && data.length) setEntries(data) }) }, [])
  const save = async (event) => {
    event.preventDefault()
    if (!draft.content.trim()) return
    const result = await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content: draft.content, mood: draft.mood, tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }) })
    const entry = result || { id: Date.now(), title: draft.content.split(' ').slice(0, 5).join(' '), ...draft, created_at: new Date().toISOString() }
    setEntries((current) => [entry, ...current]); setDraft({ content: '', mood: 'calm', tags: '' }); setOpen(false); setSaved(true); setTimeout(() => setSaved(false), 2400)
  }
  return (
    <div><PageHeader eyebrow="Private by design" title="Journal" copy="A place to notice what’s moving through you. No performance, no perfect sentences." action={<button onClick={() => setOpen(true)} className="btn-dark"><Plus size={16} /> New entry</button>} />
      {saved && <div className="mb-5 flex items-center gap-2 rounded-2xl bg-lime px-4 py-3 text-sm font-semibold"><Check size={16} /> Saved. +10 calm coins added to your vault.</div>}
      <section className="grid gap-4 lg:grid-cols-[.75fr_1.25fr]"><div className="card overflow-hidden bg-[#d8d1ff] p-7"><div className="flex justify-between"><span className="eyebrow">A prompt for today</span><Sparkles size={17} /></div><p className="display mt-20 text-3xl font-bold leading-tight tracking-[-.05em]">What feels easier than it did a month ago?</p><button onClick={() => { setDraft({ ...draft, content: 'What feels easier than it did a month ago?\\n\\n' }); setOpen(true) }} className="mt-8 flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Use this prompt <ArrowUpRight size={15} /></button></div><div className="space-y-3">{entries.map((entry) => <article key={entry.id || entry._id} className="group rounded-3xl border border-ink/10 bg-white p-5 transition hover:border-ink/35"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f0f0e9] text-xl">{entry.mood === 'calm' ? '☼' : entry.mood === 'hopeful' ? '↗' : '✦'}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{entry.title || 'Untitled reflection'}</h3><span className="mono text-[10px] text-ink/35">{formatDate(entry.created_at || new Date())}</span></div><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">{entry.content}</p><div className="mt-4 flex flex-wrap gap-2">{(entry.tags || []).map((tag) => <span key={tag} className="pill !border-0 !bg-[#f0f0e9] !px-2.5 !py-1 text-[10px] text-ink/55">#{tag}</span>)}<span className="pill !border-0 !bg-lime !px-2.5 !py-1 text-[10px]">{entry.mood}</span></div></div><button className="text-ink/25 hover:text-ink"><MoreHorizontal size={17} /></button></div></article>)}</div></section>
      {open && <Modal onClose={() => setOpen(false)} title="A fresh page"><form onSubmit={save} className="space-y-5"><div><label className="mb-2 block text-xs font-semibold">How are you feeling?</label><div className="flex flex-wrap gap-2">{['calm', 'hopeful', 'tender', 'scattered', 'grateful'].map((mood) => <button type="button" onClick={() => setDraft({ ...draft, mood })} className={`rounded-full border px-3 py-2 text-xs font-semibold ${draft.mood === mood ? 'border-ink bg-ink text-white' : 'border-ink/15'}`} key={mood}>{mood}</button>)}</div></div><label className="block"><span className="mb-2 block text-xs font-semibold">Let it out</span><textarea className="field min-h-44 resize-none" autoFocus value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder="Start anywhere…" /></label><label className="block"><span className="mb-2 block text-xs font-semibold">Tags <span className="font-normal text-ink/40">(optional, comma separated)</span></span><input className="field" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="rest, work, small wins" /></label><button className="btn-dark w-full">Save reflection <Check size={16} /></button></form></Modal>}
    </div>
  )
}

function Modal({ onClose, title, children }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl border border-ink/10 bg-paper p-6 shadow-sticker sm:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="display text-3xl font-bold tracking-[-.05em]">{title}</h2><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white"><X size={16} /></button></div>{children}</div></div>
}

function Books() {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const [library, setLibrary] = useState(books)
  const shown = useMemo(() => library.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())), [library, query])
  useEffect(() => { api('/books/recommend-by-mood').then((data) => { if (data?.books?.length) { const palette = ['bg-[#d8d1ff]', 'bg-[#d9eee8]', 'bg-[#d4e1af]', 'bg-[#ffe2b8]', 'bg-[#ffc5b7]']; setLibrary(data.books.map((book, index) => ({ ...book, category: 'recommended', color: palette[index % palette.length], blurb: book.description || 'A quiet recommendation for your current chapter.' }))) } }) }, [])
  return <div><PageHeader eyebrow="Curated for your current chapter" title="The library" copy="Books aren’t prescriptions. They’re little doors — open the one that feels right." action={<div className="relative"><Search size={16} className="absolute left-4 top-3.5 text-ink/40" /><input className="field w-56 pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelves" /></div>} /><div className="mb-7 flex flex-wrap items-center gap-3"><span className="eyebrow text-ink/40">For your calm mood</span><span className="pill border-lime bg-lime">6 quiet recommendations</span><span className="pill border-transparent bg-white text-ink/55">All books</span><span className="pill border-transparent bg-white text-ink/55">Essays</span><span className="pill border-transparent bg-white text-ink/55">Fiction</span></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{shown.map((book, index) => <article key={book.id} className="group overflow-hidden rounded-3xl border border-ink/10 bg-white"><div className={`relative flex h-56 items-end overflow-hidden ${book.color} p-6`}><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[18px] border-white/30" /><span className="mono absolute left-6 top-5 text-[10px] text-ink/40">SHELF / 0{index + 1}</span><div className="relative"><p className="display max-w-[16rem] text-3xl font-bold leading-[.95] tracking-[-.06em]">{book.title}</p><p className="mt-3 text-xs font-medium text-ink/55">{book.author}</p></div><div className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-xs font-bold">{book.cover || '↗'}</div></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow text-ink/40">{book.category}</p><p className="mt-3 text-sm leading-relaxed text-ink/55">{book.blurb || book.description}</p></div><button onClick={() => setSaved((current) => current.includes(book.id) ? current.filter((id) => id !== book.id) : [...current, book.id])} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${saved.includes(book.id) ? 'border-coral bg-coral text-white' : 'border-ink/10 hover:border-ink'}`}><Heart size={15} fill={saved.includes(book.id) ? 'currentColor' : 'none'} /></button></div><button className="mt-5 flex items-center gap-2 text-xs font-semibold underline underline-offset-4">View details <ArrowUpRight size={14} /></button></div></article>)}</div></div>
}

function Music() {
  const [playing, setPlaying] = useState(null)
  const [filter, setFilter] = useState('All')
  const [catalog, setCatalog] = useState(tracks)
  useEffect(() => { api('/songs').then((data) => { if (data?.songs?.length) setCatalog(data.songs.slice(0, 5).map((title, index) => ({ ...tracks[index % tracks.length], title }))) }) }, [])
  return <div><PageHeader eyebrow="Sound room / low volume" title="Music for the in-between" copy="A handpicked frequency for wherever your head is today." action={<button className="btn-dark"><Play size={15} fill="currentColor" /> Play all</button>} /><section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="relative overflow-hidden rounded-3xl bg-[#d9eee8] p-7"><div className="absolute bottom-0 right-0 h-44 w-44 rounded-full border-[28px] border-white/35" /><span className="eyebrow text-ink/45">Now playing / mood mix</span><div className="relative mt-28"><div className="flex items-end justify-between"><div><p className="display text-4xl font-bold leading-none tracking-[-.06em]">A little<br />more space</p><p className="mt-4 text-sm text-ink/55">45 min · ambient / piano</p></div><div className="grid h-16 w-16 place-items-center rounded-full bg-ink text-white shadow-sticker"><AudioLines size={25} /></div></div><div className="mt-8 h-1 rounded-full bg-ink/15"><div className="h-full w-[38%] rounded-full bg-ink" /></div><div className="mt-2 flex justify-between mono text-[10px] text-ink/45"><span>16:42</span><span>45:00</span></div></div></div><div className="rounded-3xl border border-ink/10 bg-white p-6"><div className="flex items-center justify-between"><p className="eyebrow text-ink/40">The queue</p><button className="text-xs font-semibold underline underline-offset-4">Clear</button></div><div className="mt-5 divide-y divide-ink/10">{catalog.slice(0, 4).map((track, index) => <div key={track.title} className="flex items-center gap-4 py-3"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${track.tone} text-xs font-bold`}>{track.cover}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{track.title}</p><p className="mt-1 text-xs text-ink/45">{track.artist}</p></div><span className="mono text-[10px] text-ink/40">{track.time}</span><button onClick={() => setPlaying(playing === index ? null : index)} className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white">{playing === index ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}</button></div>)}</div></div></section><section className="mt-10"><div className="mb-5 flex gap-2">{['All', 'Focus', 'Rest', 'Grounding'].map((item) => <button className={`pill ${filter === item ? 'border-ink bg-ink text-white' : 'border-transparent bg-white text-ink/50'}`} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{catalog.map((track, index) => <div key={track.title} className={`group flex items-center gap-4 rounded-2xl border border-ink/10 ${track.tone} p-4`}><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/50 text-sm font-bold">{track.cover}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{track.title}</p><p className="mt-1 text-xs text-ink/55">{track.artist}</p></div><button onClick={() => setPlaying(index)} className="opacity-0 transition group-hover:opacity-100"><Play size={16} fill="currentColor" /></button></div>)}</div></section></div>
}

function Therapists() {
  const [selected, setSelected] = useState(null)
  const [specialty, setSpecialty] = useState('All')
  const [therapistList, setTherapistList] = useState(therapists)
  const specs = ['All', 'Anxiety & burnout', 'Relationships', 'Life transitions']
  useEffect(() => { api('/therapists').then((data) => { if (Array.isArray(data) && data.length) setTherapistList(data.map((therapist, index) => ({ ...therapist, id: therapist.id || therapist._id || `therapist-${index}`, initials: therapist.name.split(' ').map((part) => part[0]).join('').slice(0, 2), role: therapist.specializations?.[0] || therapist.role || 'Mental wellness', rating: therapist.rating || '4.9', rate: therapist.hourly_rate || therapist.rate || '80', languages: therapist.languages?.join(' · ') || 'EN', next: 'See availability', color: ['bg-[#d8d1ff]', 'bg-[#d9eee8]', 'bg-[#ffc5b7]'][index % 3] }))) }) }, [])
  return <div><PageHeader eyebrow="Human support, when you want it" title="Find your person" copy="Licensed therapists and counselors who believe care can be practical, warm and collaborative." action={<button className="btn-ghost"><ShieldCheck size={16} /> How we verify</button>} /><div className="mb-7 flex flex-wrap items-center gap-2">{specs.map((item) => <button onClick={() => setSpecialty(item)} key={item} className={`pill ${specialty === item ? 'border-ink bg-ink text-white' : 'border-transparent bg-white text-ink/55'}`}>{item}</button>)}</div><div className="grid gap-4 lg:grid-cols-3">{therapistList.filter((therapist) => specialty === 'All' || therapist.role.includes(specialty.split(' ')[0])).map((therapist) => <article key={therapist.id} className="card p-5"><div className="flex items-start justify-between"><div className={`grid h-16 w-16 place-items-center rounded-2xl ${therapist.color} text-xl font-bold`}>{therapist.initials}</div><button className="text-ink/35"><MoreHorizontal size={18} /></button></div><div className="mt-6"><h2 className="display text-2xl font-bold tracking-[-.04em]">{therapist.name}</h2><p className="mt-1 text-sm text-ink/55">{therapist.role}</p></div><div className="mt-5 flex gap-4 text-xs"><span className="flex items-center gap-1 font-semibold"><Star size={13} fill="currentColor" /> {therapist.rating}</span><span className="text-ink/45">{therapist.languages}</span><span className="ml-auto font-semibold">${therapist.rate}/session</span></div><div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f0f0e9] px-3 py-2.5 text-xs"><CalendarDays size={14} /><span className="font-semibold">Next opening</span><span className="ml-auto text-ink/55">{therapist.next}</span></div><button onClick={() => setSelected(therapist)} className="btn-dark mt-4 w-full !py-2.5">View profile <ArrowUpRight size={15} /></button></article>)}</div><div className="mt-8 rounded-3xl border border-ink/10 bg-lime p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="eyebrow">Not sure where to start?</p><h3 className="display mt-3 text-3xl font-bold tracking-[-.05em]">Take the 2-minute matching quiz.</h3><p className="mt-2 text-sm text-ink/60">A few questions can point you toward a good first conversation.</p></div><button className="btn-dark bg-ink">Find my match <ArrowUpRight size={15} /></button></div></div>{selected && <Modal onClose={() => setSelected(null)} title={selected.name}><div className={`mb-5 grid h-20 w-20 place-items-center rounded-3xl ${selected.color} text-2xl font-bold`}>{selected.initials}</div><p className="text-sm leading-relaxed text-ink/60">I work with people navigating {selected.role.toLowerCase()}. Sessions are a collaborative place to slow down, make sense of patterns and find your next useful step.</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setSelected(null)} className="btn-ghost">See availability</button><button onClick={() => setSelected(null)} className="btn-dark">Book intro <ArrowUpRight size={14} /></button></div></Modal>}</div>
}

function Coins() {
  const [balance, setBalance] = useState(demoUser.calm_coins)
  const [transactions, setTransactions] = useState(fallback['/coins/transactions'])
  const [toast, setToast] = useState(false)
  useEffect(() => { api('/coins/balance').then((data) => data?.balance && setBalance(data.balance)); api('/coins/transactions').then((data) => Array.isArray(data) && setTransactions(data)) }, [])
  const earn = async (amount, source, description) => { await api('/coins/earn', { method: 'POST', body: JSON.stringify({ amount, source, description }) }); setBalance((value) => value + amount); setTransactions((value) => [{ _id: Date.now(), amount, transaction_type: 'earn', source, description, timestamp: new Date().toISOString() }, ...value]); setToast(true); setTimeout(() => setToast(false), 2400) }
  return <div><PageHeader eyebrow="A softer kind of currency" title="Calm coins" copy="Coins are a gentle nudge to keep showing up. Earn them through care, then spend them on more of what helps." action={<button onClick={() => earn(5, 'daily_checkin', 'Completed a daily check-in')} className="btn-lime"><Zap size={15} fill="currentColor" /> Check in +5</button>} />{toast && <div className="mb-5 flex items-center gap-2 rounded-2xl bg-lime px-4 py-3 text-sm font-semibold"><Check size={16} /> Coins added to your vault.</div>}<section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9"><div className="absolute -right-14 -top-14 h-56 w-56 rounded-full border-[38px] border-lime" /><span className="eyebrow text-white/45">Your current balance</span><div className="relative mt-20 flex items-end gap-3"><CircleDollarSign size={42} className="mb-2 text-lime" /><span className="display text-8xl font-bold leading-none tracking-[-.08em]">{balance}</span></div><div className="mt-7 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/50"><span>Keep going, gently.</span><span className="mono">ZEN / VAULT</span></div></div><div className="card p-6"><div className="flex items-center justify-between"><div><p className="eyebrow text-ink/40">Today’s gentle goals</p><h2 className="display mt-2 text-2xl font-bold">Little actions count.</h2></div><Sparkles size={19} /></div><div className="mt-7 space-y-4">{[['Write a journal entry', 15, true], ['Talk with your companion', 5, true], ['Keep your 7-day streak', 50, false]].map(([title, amount, done]) => <div key={title} className="flex items-center gap-3"><div className={`grid h-9 w-9 place-items-center rounded-xl ${done ? 'bg-lime' : 'bg-ink/10'}`}>{done ? <Check size={16} /> : <span className="h-2 w-2 rounded-full bg-ink/30" />}</div><div className="flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-ink/45">{done ? 'Completed today' : '3 of 7 days'}</p></div><span className="text-xs font-bold">+{amount}</span></div>)}</div></div></section><section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow text-ink/40">Your activity</p><h2 className="display mt-2 text-2xl font-bold">Recent transactions</h2></div><button className="text-xs font-semibold underline underline-offset-4">Export</button></div><div className="card divide-y divide-ink/10 px-5">{transactions.map((transaction) => <div key={transaction._id} className="flex items-center gap-3 py-4"><div className={`grid h-9 w-9 place-items-center rounded-xl ${transaction.transaction_type === 'spend' ? 'bg-coral/20 text-coral' : 'bg-lime'}`}>{transaction.transaction_type === 'spend' ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="mt-1 text-xs text-ink/40">{formatDate(transaction.timestamp, { year: 'numeric' })} · {transaction.source}</p></div><span className={`text-sm font-bold ${transaction.transaction_type === 'spend' ? 'text-coral' : 'text-ink'}`}>{transaction.transaction_type === 'spend' ? '' : '+'}{transaction.amount}</span></div>)}</div></div><div className="rounded-3xl border border-ink/10 bg-[#d8d1ff] p-6"><p className="eyebrow">Ways to use them</p><h2 className="display mt-3 text-3xl font-bold tracking-[-.05em]">Spend on care.</h2><div className="mt-7 space-y-2">{[['Premium insights', '100 coins'], ['Custom meditation', '150 coins'], ['Therapist session', '500 coins']].map(([title, cost]) => <button key={title} className="flex w-full items-center gap-3 rounded-2xl bg-white/55 p-3 text-left hover:bg-white"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white"><Sparkles size={15} /></div><span className="flex-1 text-sm font-semibold">{title}</span><span className="mono text-[10px] text-ink/50">{cost}</span><ChevronRight size={14} /></button>)}</div></div></section></div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
