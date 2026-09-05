import { createContext, createElement, useContext, useEffect, useState } from 'react'
import {
  ArrowUpRight, BookOpen, Brain, Check, ChevronRight, CircleHelp, Coins,
  Copy, Heart, Home, Library, LockKeyhole, LogOut, Menu, MessageCircle, Music2,
  Play, Plus, Search, Send, ShieldCheck, Sparkles, Star, Sun, Users, X, Zap,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, demoBooks, demoTherapists, demoTracks, demoUser, getStoredUser, rememberSession, withFallback } from './lib/api'

const AuthContext = createContext(null)

function AuthProvider() {
  const [user, setUser] = useState(getStoredUser())
  const login = (nextUser, token = 'demo-session-token') => {
    rememberSession(token, nextUser)
    setUser(nextUser)
  }
  const logout = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, login, logout }}><Outlet /></AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

function Logo({ compact = false }) {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-acid text-ink">
        <span className="font-display text-lg font-extrabold">Z</span>
      </span>
      {!compact && <span className="font-display text-base font-bold tracking-[-.03em]">zenheaven<span className="text-acid">.</span></span>}
    </Link>
  )
}

function IdentityChip({ user }) {
  const [copied, setCopied] = useState(false)
  const did = `did:zen:${user?.id?.slice(-8) || '7c4b4a1e'}`
  const copyDid = async () => {
    await navigator.clipboard?.writeText(did)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button onClick={copyDid} className="group flex items-center gap-2 rounded-full border border-teal/20 bg-teal/[.07] px-3 py-1.5 text-left transition hover:border-teal/50">
      <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_#62dfcf]" />
      <span className="font-mono text-[10px] text-teal">{copied ? 'copied to clipboard' : did}</span>
      {copied ? <Check size={11} className="text-teal" /> : <Copy size={11} className="text-white/30 group-hover:text-teal" />}
    </button>
  )
}

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Companion', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/books', label: 'Library', icon: Library },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Care network', icon: Users },
  { to: '/coins', label: 'Calm Coins', icon: Coins },
]

const journalFallbackEntries = [
  { _id: 'entry-1', title: 'A softer start', content: 'Today I made space for a slower morning. The quiet felt like a choice I was making for myself.', mood: 'calm', created_at: '2026-09-05T08:30:00Z' },
  { _id: 'entry-2', title: 'Small evidence', content: 'I noticed that asking for help did not make me less capable. It made the day feel more shared.', mood: 'hopeful', created_at: '2026-09-03T17:10:00Z' },
]

function Shell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = navigation.find((item) => location.pathname.startsWith(item.to))
  return (
    <div className="noise min-h-screen bg-ink text-paper">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-white/[.08] bg-ink/95 px-5 py-6 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Logo />
          <button className="rounded-lg p-2 text-white/50 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}><X size={17} /></button>
        </div>
        <div className="mt-10">
          <p className="eyebrow px-3">Your sanctuary</p>
          <nav className="mt-3 space-y-1">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive ? 'bg-acid text-ink font-bold' : 'text-white/55 hover:bg-white/[.06] hover:text-white'}`}>
                {createElement(Icon, { size: 17, strokeWidth: 1.8 })}
                <span>{label}</span>
                {to === '/chat' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal" />}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto">
          <div className="mb-5 rounded-2xl border border-violet/20 bg-violet/[.06] p-4">
            <div className="flex items-center gap-2 text-violet"><ShieldCheck size={16} /><span className="font-mono text-[10px] uppercase tracking-[.16em]">private by design</span></div>
            <p className="mt-3 text-xs leading-relaxed text-white/45">Your wellness data is anchored to your identity, never sold.</p>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-white/[.06] hover:text-white"><LogOut size={17} /> Disconnect</button>
        </div>
      </aside>

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[.08] bg-ink/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-sm text-white/35 sm:flex"><span>sanctuary</span><ChevronRight size={14} /><span className="text-white/70">{active?.label || 'Overview'}</span></div>
          </div>
          <div className="flex items-center gap-3">
            <IdentityChip user={user} />
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet to-teal text-[11px] font-bold text-ink">{(user?.full_name || user?.username || 'M').slice(0, 1)}</div>
              <span className="hidden text-sm font-semibold sm:block">{user?.full_name || user?.username || 'Maya'}</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10"><Outlet /></main>
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Shell /> : <Navigate to="/login" replace />
}

function SectionIntro({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold tracking-[-.05em] text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">{description}</p>}
      </div>
      {action}
    </div>
  )
}

function Metric({ label, value, detail, icon: Icon, color = 'acid' }) {
  return (
    <div className="panel panel-hover p-5">
      <div className="flex items-start justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-${color}/10 text-${color}`}>{createElement(Icon, { size: 17 })}</span>
        <ArrowUpRight size={15} className="text-white/25" />
      </div>
      <p className="mt-6 font-display text-3xl font-bold tracking-[-.06em] text-white">{value}</p>
      <p className="mt-1 text-xs text-white/40">{label}</p>
      {detail && <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-teal">{detail}</p>}
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [mood, setMood] = useState('grounded')
  const moods = [{ label: 'low', emoji: '◒' }, { label: 'tender', emoji: '◓' }, { label: 'grounded', emoji: '◑' }, { label: 'bright', emoji: '◕' }, { label: 'radiant', emoji: '●' }]
  useEffect(() => { withFallback(() => api('/coins/balance'), { balance: user?.calm_coins || 240 }).then((result) => setBalance((current) => result.balance ?? current)) }, [user?.calm_coins])
  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-3">Saturday / 05 September 2026</p>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[.98] tracking-[-.065em] text-white sm:text-6xl">Good evening,<br /><span className="text-acid">{(user?.full_name || 'Maya').split(' ')[0]}.</span></h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/45">A small check-in is still a way of showing up for yourself.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[.04] px-3 py-2 md:self-auto"><span className="h-2 w-2 animate-pulse rounded-full bg-teal" /><span className="font-mono text-[10px] uppercase tracking-wider text-white/55">identity synced</span></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Calm Coins balance" value={balance} detail="+24 this week" icon={Coins} color="acid" />
        <Metric label="Wellness streak" value="08 days" detail="personal best · 14" icon={Zap} color="teal" />
        <Metric label="Reflections held" value="24" detail="+3 this month" icon={BookOpen} color="violet" />
        <Metric label="Care network" value="03" detail="all systems well" icon={Heart} color="pink-300" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <section className="panel grid-paper relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-acid/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-acid/70">daily signal</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.05em] text-white">How is your inner weather?</h2></div><Sun className="text-acid" size={23} /></div>
            <p className="mt-3 text-sm text-white/45">This check-in stays with you. No labels, no judgement.</p>
            <div className="mt-8 grid grid-cols-5 gap-2 sm:max-w-md">
              {moods.map(({ label, emoji }) => <button key={label} onClick={() => setMood(label)} className={`rounded-2xl border py-4 transition ${mood === label ? 'border-acid bg-acid text-ink' : 'border-white/10 bg-white/[.04] text-white/65 hover:border-white/25'}`}><span className="block text-xl">{emoji}</span><span className="mt-2 block text-[10px] font-semibold capitalize">{label}</span></button>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><Link to="/journal" className="btn-primary">Write a reflection <ArrowUpRight size={15} /></Link><span className="font-mono text-[10px] text-white/30">+5 coins for showing up</span></div>
          </div>
        </section>
        <section className="panel flex flex-col justify-between p-6">
          <div><div className="flex items-center justify-between"><p className="eyebrow">identity passport</p><ShieldCheck size={18} className="text-teal" /></div><div className="mt-7 flex items-center gap-4"><div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-acid via-teal to-violet text-2xl font-bold text-ink"><span>✦</span><span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-teal"><Check size={11} /></span></div><div><p className="font-display text-xl font-bold text-white">Maya’s sanctuary</p><p className="mt-1 text-xs text-white/40">Verified 08 Aug 2026</p></div></div><div className="mt-7 rounded-xl border border-white/10 bg-ink/40 p-3"><p className="font-mono text-[10px] text-white/35">DECENTRALIZED IDENTIFIER</p><p className="mt-2 truncate font-mono text-xs text-teal">did:zen:{user?.id?.slice(-8) || '7c4b4a1e'}</p></div></div>
          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-white/40">3 credentials verified</span><button className="text-xs font-bold text-acid hover:underline">Manage identity <ChevronRight size={13} className="inline" /></button></div>
        </section>
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">continue gently</p><h2 className="mt-2 font-display text-xl font-bold text-white">Your next small step</h2></div><Sparkles className="text-violet" size={19} /></div><div className="mt-6 flex gap-4 rounded-2xl bg-violet/[.08] p-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet"><MessageCircle size={19} /></div><div><p className="text-sm font-semibold text-white">Talk it out with Sol</p><p className="mt-1 text-xs leading-relaxed text-white/40">Your AI companion is here when you need a quieter place to think.</p><Link to="/chat" className="mt-3 inline-flex items-center text-xs font-bold text-violet">Open companion <ArrowUpRight size={13} className="ml-1" /></Link></div></div></div>
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">network activity</p><h2 className="mt-2 font-display text-xl font-bold text-white">Your care constellation</h2></div><Link to="/therapists" className="text-xs font-bold text-acid">View network</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-acid text-ink font-bold">SJ</div><div><p className="text-xs font-semibold text-white">Dr. Sarah Johnson</p><p className="mt-1 font-mono text-[9px] text-teal">session in 2d</p></div></div><div className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-teal text-ink font-bold">SO</div><div><p className="text-xs font-semibold text-white">Sol / AI companion</p><p className="mt-1 font-mono text-[9px] text-violet">always available</p></div></div><div className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-violet text-ink font-bold">✦</div><div><p className="text-xs font-semibold text-white">You / the owner</p><p className="mt-1 font-mono text-[9px] text-acid">self-sovereign</p></div></div></div></div>
      </section>
    </>
  )
}

function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([{ role: 'assistant', text: `Hey ${(user?.full_name || 'there').split(' ')[0]}. I’m Sol — a quiet place to put things down. What’s present for you right now?` }])
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const send = async (event) => {
    event.preventDefault()
    if (!value.trim() || sending) return
    const message = value.trim()
    setValue('')
    setMessages((current) => [...current, { role: 'user', text: message }])
    setSending(true)
    const result = await withFallback(() => api('/mental-health/chat', { method: 'POST', body: JSON.stringify({ message, user_id: user?.id || 'demo-user', session_id: 'zenheaven-session' }) }), null)
    const response = result?.response || 'Thank you for trusting me with that. Take one slow breath, and notice what feels most important in this moment. You do not have to solve everything at once.'
    setMessages((current) => [...current, { role: 'assistant', text: response }])
    setSending(false)
  }
  return (
    <div className="mx-auto max-w-5xl">
      <SectionIntro eyebrow="companion / sol" title="A place to be heard." description="Sol is an AI wellness companion, not a replacement for professional care. Your conversations are attached to your private identity." action={<div className="flex items-center gap-2 rounded-full border border-teal/20 bg-teal/[.06] px-3 py-2"><span className="h-2 w-2 rounded-full bg-teal" /><span className="font-mono text-[10px] uppercase tracking-wider text-teal">encrypted session</span></div>} />
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[.08] px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet to-teal text-ink"><Sparkles size={16} /></div><div><p className="text-sm font-semibold text-white">Sol</p><p className="font-mono text-[9px] uppercase tracking-wider text-teal">online · here with you</p></div></div><button className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white"><CircleHelp size={17} /></button></div>
        <div className="grid min-h-[440px] content-start gap-5 overflow-y-auto p-5 sm:p-8">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[min(80%,560px)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-sm bg-acid text-ink' : 'rounded-bl-sm border border-white/10 bg-white/[.05] text-white/75'}`}>{message.text}</div></div>)}
          {sending && <div className="flex gap-2"><div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[.05] px-4 py-3"><span className="mr-1 inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-teal" /><span className="mr-1 inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:100ms]" /><span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:200ms]" /></div></div>}
        </div>
        <form onSubmit={send} className="border-t border-white/[.08] p-4 sm:p-5"><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/50 p-2 pl-4 focus-within:border-teal/40"><input value={value} onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/25" placeholder="Share what’s on your mind…" /><button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-acid text-ink transition hover:bg-[#e4ff8f]" aria-label="Send message"><Send size={16} /></button></div><p className="mt-3 text-center font-mono text-[9px] uppercase tracking-wider text-white/25">Sol can make mistakes · for urgent support, contact your local crisis line</p></form>
      </div>
    </div>
  )
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('grounded')
  const [writing, setWriting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { withFallback(() => api('/journal/entries'), journalFallbackEntries).then((data) => { setEntries(Array.isArray(data) && data.length ? data : journalFallbackEntries); setLoaded(true) }) }, [])
  const save = async (event) => {
    event.preventDefault()
    if (!content.trim()) return
    const newEntry = { _id: `local-${Date.now()}`, title: 'A new reflection', content: content.trim(), mood, created_at: new Date().toISOString() }
    const result = await withFallback(() => api('/journal/entries', { method: 'POST', body: JSON.stringify({ content: content.trim(), mood, tags: [] }) }), newEntry)
    setEntries((current) => [result, ...current])
    setContent('')
    setWriting(false)
  }
  return (
    <>
      <SectionIntro eyebrow="private reflections" title="Your inner archive." description="A living record of the moments you chose to notice. Each entry earns Calm Coins and belongs to your identity." action={<button onClick={() => setWriting(true)} className="btn-primary"><Plus size={16} /> New reflection</button>} />
      <div className="grid gap-4 xl:grid-cols-[.65fr_1.35fr]">
        <div className="panel grid-paper h-fit p-6"><p className="eyebrow">reflection ritual</p><p className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-.04em] text-white">You don’t need the right words. Just the honest ones.</p><div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[10px] uppercase tracking-wider text-white/35">{loaded ? entries.length : '—'} entries held</span><span className="font-mono text-[10px] text-acid">+10 $CALM / entry</span></div></div>
        <div className="space-y-3">
          {writing && <form onSubmit={save} className="panel border-acid/30 p-5"><div className="flex items-center justify-between"><p className="font-display text-lg font-bold text-white">What wants to be witnessed?</p><button type="button" onClick={() => setWriting(false)} className="text-white/35 hover:text-white"><X size={17} /></button></div><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} className="input mt-5 min-h-36 resize-none" placeholder="Start anywhere…" /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2">{['tender', 'grounded', 'bright'].map((item) => <button type="button" key={item} onClick={() => setMood(item)} className={`rounded-full border px-3 py-1.5 text-xs capitalize ${mood === item ? 'border-acid bg-acid text-ink' : 'border-white/10 text-white/50'}`}>{item}</button>)}</div><button className="btn-primary">Seal reflection <LockKeyhole size={14} /></button></div></form>}
          {entries.map((entry) => <article key={entry._id || entry.id} className="panel panel-hover p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-acid" /><p className="font-mono text-[10px] uppercase tracking-wider text-white/35">{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><h2 className="mt-4 font-display text-xl font-bold tracking-[-.03em] text-white">{entry.title || 'Untitled reflection'}</h2></div><span className="rounded-full border border-teal/20 bg-teal/[.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-teal">{entry.mood || 'unmarked'}</span></div><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">{entry.content}</p><div className="mt-5 flex items-center gap-4 border-t border-white/[.08] pt-4"><span className="font-mono text-[9px] uppercase tracking-wider text-white/25">identity sealed</span><span className="font-mono text-[9px] text-acid">+10 $CALM</span></div></article>)}
        </div>
      </div>
    </>
  )
}

function Books() {
  const [books, setBooks] = useState(demoBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('balanced')
  const [searching, setSearching] = useState(false)
  useEffect(() => { withFallback(() => api('/books/recommend-by-mood'), null).then((result) => { if (result?.books?.length) { setBooks(result.books); setMood(result.mood) } }) }, [])
  const search = async (event) => {
    event.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const result = await withFallback(() => api(`/books/search?q=${encodeURIComponent(query)}&max_results=10`), { books: demoBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())) })
    setBooks(result.books?.length ? result.books : demoBooks)
    setSearching(false)
  }
  return (
    <>
      <SectionIntro eyebrow="curated library" title="Pages for this season." description={`Books selected for a ${mood} state of mind. Find something that meets you where you are.`} action={<form onSubmit={search} className="flex w-full gap-2 sm:w-auto"><div className="relative"><Search size={16} className="absolute left-3 top-3.5 text-white/30" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="input w-full pl-9 sm:w-56" placeholder="Search the library" /></div><button className="btn-quiet">{searching ? 'Searching…' : 'Search'}</button></form>} />
      <div className="mb-6 flex flex-wrap gap-2">{['balanced', 'calm', 'hopeful', 'anxious', 'motivated'].map((item) => <button key={item} onClick={() => setMood(item)} className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${mood === item ? 'border-acid bg-acid text-ink' : 'border-white/10 text-white/50 hover:border-white/25'}`}>{item}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{books.map((book) => <article key={book.id} className="panel panel-hover overflow-hidden"><div className="relative h-52 overflow-hidden bg-white/5"><img src={book.image_url} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-ink/75 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-acid">for you</span></div><div className="p-5"><p className="font-display text-lg font-bold leading-tight text-white">{book.title}</p><p className="mt-2 text-xs text-teal">by {book.author}</p><p className="mt-4 line-clamp-2 text-xs leading-relaxed text-white/40">{book.description}</p><button className="mt-5 flex items-center gap-1 text-xs font-bold text-white/60 hover:text-acid">Open book details <ArrowUpRight size={13} /></button></div></article>)}</div>
    </>
  )
}

function Music() {
  const [tracks, setTracks] = useState(demoTracks)
  const [active, setActive] = useState(null)
  const [song, setSong] = useState('')
  const [loading, setLoading] = useState(false)
  const recommend = async (event) => {
    event.preventDefault()
    if (!song.trim()) return
    setLoading(true)
    const result = await withFallback(() => api(`/recommend?song=${encodeURIComponent(song)}`), null)
    setTracks(result?.recommendations?.length ? result.recommendations : demoTracks)
    setLoading(false)
  }
  return (
    <>
      <SectionIntro eyebrow="soundscape" title="Let the room soften." description="A mood-aware listening space for transitions, focus, and coming back to yourself." action={<form onSubmit={recommend} className="flex w-full gap-2 sm:w-auto"><input value={song} onChange={(event) => setSong(event.target.value)} className="input w-full sm:w-56" placeholder="Start with a song…" /><button className="btn-quiet">{loading ? 'Tuning…' : 'Tune'}</button></form>} />
      <div className="panel relative mb-5 overflow-hidden bg-gradient-to-br from-violet/20 via-teal/[.07] to-transparent p-6 sm:p-8"><div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-teal/10 blur-3xl" /><div className="relative max-w-xl"><p className="eyebrow text-teal">now entering</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-.06em] text-white">A slower frequency.</h2><p className="mt-3 text-sm leading-relaxed text-white/45">Four tracks to hold you while you do less, notice more, and let the next thought arrive.</p><div className="mt-7 flex items-center gap-3"><button onClick={() => setActive(tracks[0])} className="btn-primary"><Play size={15} fill="currentColor" /> Play sequence</button><span className="font-mono text-[10px] text-white/30">24 min · ambient / focus</span></div></div></div>
      <div className="grid gap-3 md:grid-cols-2">{tracks.map((track, index) => <button key={`${track.name}-${index}`} onClick={() => setActive(track)} className={`panel panel-hover flex items-center gap-4 p-4 text-left ${active?.name === track.name ? 'border-acid/50 bg-acid/[.06]' : ''}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 font-mono text-xs text-white/35">{String(index + 1).padStart(2, '0')}</span><img src={track.album_cover_url} alt="" className="h-14 w-14 rounded-xl object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{track.name}</span><span className="mt-1 block truncate text-xs text-white/40">{track.artist}</span></span><span className="grid h-9 w-9 place-items-center rounded-full bg-white/[.06] text-white/50"><Play size={14} fill={active?.name === track.name ? 'currentColor' : 'none'} /></span></button>)}</div>
      {active && <div className="fixed bottom-5 left-1/2 z-20 flex w-[calc(100%-40px)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-2xl border border-acid/30 bg-ink/90 p-3 shadow-glow backdrop-blur-xl"><img src={active.album_cover_url} alt="" className="h-11 w-11 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{active.name}</p><p className="truncate text-xs text-white/40">{active.artist}</p></div><div className="h-1 w-20 overflow-hidden rounded-full bg-white/10 sm:w-36"><div className="h-full w-1/3 rounded-full bg-acid" /></div><button onClick={() => setActive(null)} className="p-2 text-white/35 hover:text-white"><X size={16} /></button></div>}
    </>
  )
}

function Therapists() {
  const [therapists, setTherapists] = useState(demoTherapists)
  const [selected, setSelected] = useState('all')
  const [booked, setBooked] = useState(null)
  useEffect(() => { withFallback(() => api('/therapists/'), demoTherapists).then((data) => setTherapists(data?.length ? data : demoTherapists)) }, [])
  const specialties = ['all', ...new Set(therapists.flatMap((therapist) => therapist.specializations))]
  const filtered = selected === 'all' ? therapists : therapists.filter((therapist) => therapist.specializations.includes(selected))
  return (
    <>
      <SectionIntro eyebrow="care network" title="Support, on your terms." description="Meet licensed professionals who can help you navigate the parts that feel too heavy to hold alone." action={<div className="flex items-center gap-2 rounded-full border border-violet/20 bg-violet/[.07] px-3 py-2"><LockKeyhole size={13} className="text-violet" /><span className="font-mono text-[10px] uppercase tracking-wider text-violet">private matching</span></div>} />
      <div className="mb-7 flex gap-2 overflow-x-auto pb-1 scrollbar-none">{specialties.slice(0, 8).map((item) => <button key={item} onClick={() => setSelected(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs capitalize transition ${selected === item ? 'border-acid bg-acid text-ink' : 'border-white/10 text-white/50 hover:border-white/25'}`}>{item}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-3">{filtered.map((therapist) => <article key={therapist._id || therapist.id} className="panel panel-hover overflow-hidden"><div className="relative h-56 overflow-hidden bg-gradient-to-br from-violet/20 to-teal/10"><img src={therapist.photo_url} alt={therapist.name} className="h-full w-full object-cover object-top opacity-90" /><div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" /><span className="absolute bottom-4 left-5 flex items-center gap-1 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[10px] text-acid"><Star size={11} fill="currentColor" /> {therapist.rating}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-white">{therapist.name}</h2><p className="mt-1 text-xs text-teal">{therapist.experience_years} years experience</p></div><span className="font-mono text-xs text-white/45">${therapist.hourly_rate}/hr</span></div><p className="mt-4 line-clamp-2 text-xs leading-relaxed text-white/45">{therapist.bio}</p><div className="mt-4 flex flex-wrap gap-1.5">{therapist.specializations.slice(0, 3).map((specialty) => <span key={specialty} className="rounded-md bg-white/[.06] px-2 py-1 text-[10px] text-white/50">{specialty}</span>)}</div><button onClick={() => setBooked(therapist.name)} className={`mt-5 w-full rounded-xl px-4 py-3 text-xs font-bold transition ${booked === therapist.name ? 'bg-teal text-ink' : 'bg-white/[.07] text-white hover:bg-acid hover:text-ink'}`}>{booked === therapist.name ? 'Request sent · we’ll be in touch' : 'View availability'} <ChevronRight size={14} className="ml-1 inline" /></button></div></article>)}</div>
    </>
  )
}

function CoinsPage() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [transactions, setTransactions] = useState([])
  const goals = [{ title: 'Talk with Sol', reward: 10, progress: '1 / 1', done: true, icon: MessageCircle }, { title: 'Write in your journal', reward: 15, progress: '0 / 1', done: false, icon: BookOpen }, { title: 'Complete a mood check', reward: 5, progress: '1 / 1', done: true, icon: Heart }, { title: 'Read a wellness article', reward: 8, progress: '0 / 1', done: false, icon: Brain }]
  useEffect(() => { withFallback(() => api('/coins/balance'), { balance: user?.calm_coins || 240 }).then((data) => setBalance(data.balance)); withFallback(() => api('/coins/transactions'), []).then((data) => setTransactions(data)) }, [user?.calm_coins])
  return (
    <>
      <SectionIntro eyebrow="calm economy" title="Proof that you showed up." description="Calm Coins are a gentle layer of motivation — earned through care, never through comparison." action={<div className="flex items-center gap-2 font-mono text-xs text-white/40"><span className="h-2 w-2 rounded-full bg-acid" /> $CALM utility</div>} />
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="panel relative overflow-hidden bg-gradient-to-br from-acid/20 to-transparent p-7"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-acid/20 blur-3xl" /><div className="relative"><p className="eyebrow text-acid">available balance</p><div className="mt-5 flex items-end gap-3"><span className="font-display text-6xl font-bold tracking-[-.08em] text-white">{balance}</span><span className="mb-2 font-mono text-sm text-acid">$CALM</span></div><p className="mt-3 text-xs text-white/40">+24 earned this week · your care compounds</p><div className="mt-9 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[10px] uppercase tracking-wider text-white/35">next reward</span><span className="font-mono text-xs text-white">7-day streak <span className="text-acid">+50</span></span></div></div></div>
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">today’s constellation</p><h2 className="mt-2 font-display text-xl font-bold text-white">Small actions, real signal.</h2></div><Zap size={19} className="text-acid" /></div><div className="mt-6 grid gap-2 sm:grid-cols-2">{goals.map(({ title, reward, progress, done, icon }) => <div key={title} className={`flex items-center gap-3 rounded-xl border p-3 ${done ? 'border-teal/20 bg-teal/[.05]' : 'border-white/10'}`}><div className={`grid h-9 w-9 place-items-center rounded-lg ${done ? 'bg-teal/15 text-teal' : 'bg-white/[.06] text-white/40'}`}>{done ? <Check size={16} /> : createElement(icon, { size: 16 })}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{title}</p><p className="mt-1 font-mono text-[9px] text-white/35">{progress} · <span className="text-acid">+{reward}</span></p></div></div>)}</div></div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="panel p-6"><div className="flex items-center justify-between"><p className="eyebrow">how you earn</p><span className="font-mono text-[10px] text-white/30">transparent protocol</span></div><div className="mt-5 space-y-3">{[['Daily check-in', '+10'], ['Journal entry', '+15'], ['AI companion session', '+5'], ['7-day streak', '+50']].map(([label, amount]) => <div key={label} className="flex items-center justify-between border-b border-white/[.07] pb-3 text-sm"><span className="text-white/60">{label}</span><span className="font-mono text-xs text-acid">{amount} $CALM</span></div>)}</div></div><div className="panel p-6"><div className="flex items-center justify-between"><p className="eyebrow">recent movement</p><Coins size={17} className="text-acid" /></div>{transactions.length ? transactions.slice(0, 4).map((transaction) => <div key={transaction._id} className="mt-4 flex items-center justify-between text-xs"><span className="text-white/50">{transaction.description}</span><span className="font-mono text-teal">+{transaction.amount}</span></div>) : <p className="mt-6 text-sm leading-relaxed text-white/35">Your first movements will appear here as you make space for yourself.</p>}</div></div>
    </>
  )
}

function AuthPage({ mode = 'login' }) {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const path = isRegister ? '/auth/register' : '/auth/login'
      const body = isRegister ? form : { username: form.username, password: form.password }
      const result = await api(path, { method: 'POST', body: JSON.stringify(body) })
      login(result.user, result.access_token)
    } catch {
      if (isRegister && !form.email) setError('Add an email so we can anchor your identity.')
      else login({ ...demoUser, username: form.username || demoUser.username, full_name: form.full_name || demoUser.full_name, email: form.email || demoUser.email })
    } finally { setLoading(false); navigate('/dashboard') }
  }
  return (
    <div className="grid-paper grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <div className="hidden flex-col justify-between p-10 lg:flex"><Logo /><div className="max-w-lg pb-8"><p className="eyebrow mb-5 text-acid">a private protocol for being human</p><h1 className="font-display text-6xl font-bold leading-[.9] tracking-[-.08em] text-white">Your inner world<br /><span className="text-acid">belongs to you.</span></h1><p className="mt-7 max-w-md text-sm leading-relaxed text-white/45">ZenHeaven is a self-sovereign wellness space — a place to reflect, connect, and grow without giving your most personal data away.</p><div className="mt-10 flex items-center gap-4"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-acid text-xs text-ink">M</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-teal text-xs text-ink">A</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-violet text-xs text-ink">R</span></div><span className="font-mono text-[10px] uppercase tracking-wider text-white/35">2,481 people tending inward</span></div></div><p className="font-mono text-[10px] uppercase tracking-wider text-white/25">ZENHEAVEN / IDENTITY LAYER 01</p></div>
      <div className="flex items-center justify-center border-l border-white/[.08] bg-ink/70 px-5 py-10"><div className="w-full max-w-sm"><div className="mb-10 lg:hidden"><Logo /></div><p className="eyebrow text-teal">{isRegister ? 'create your sanctuary' : 'welcome back'}</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-.06em] text-white">{isRegister ? 'Begin with intention.' : 'Return to yourself.'}</h2><p className="mt-3 text-sm leading-relaxed text-white/40">{isRegister ? 'Your identity is yours. Start a private wellness passport in under a minute.' : 'Your private space is waiting exactly where you left it.'}</p><form onSubmit={submit} className="mt-8 space-y-4">{isRegister && <div><label className="mb-2 block text-xs font-semibold text-white/55">Name</label><input required value={form.full_name} onChange={update('full_name')} className="input" placeholder="What should we call you?" /></div>}<div><label className="mb-2 block text-xs font-semibold text-white/55">Username</label><input required value={form.username} onChange={update('username')} className="input" placeholder="your handle" /></div>{isRegister && <div><label className="mb-2 block text-xs font-semibold text-white/55">Email</label><input required type="email" value={form.email} onChange={update('email')} className="input" placeholder="you@example.com" /></div>}<div><label className="mb-2 block text-xs font-semibold text-white/55">Password</label><input required minLength={6} type="password" value={form.password} onChange={update('password')} className="input" placeholder="six or more characters" /></div>{error && <p className="text-xs text-rose-300">{error}</p>}<button className="btn-primary mt-2 w-full">{loading ? 'Connecting…' : isRegister ? 'Create my identity' : 'Enter sanctuary'} <ArrowUpRight size={15} /></button></form><div className="mt-7 text-center text-xs text-white/35">{isRegister ? 'Already have a sanctuary?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'} className="font-bold text-acid hover:underline">{isRegister ? 'Sign in' : 'Create an identity'}</Link></div><div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-white/25"><LockKeyhole size={12} /> Your data is encrypted in transit</div></div></div>
    </div>
  )
}

function NotFound() {
  return <div className="grid min-h-[70vh] place-items-center text-center"><div><p className="eyebrow text-acid">404 / quiet space</p><h1 className="mt-4 font-display text-5xl font-bold text-white">Nothing here yet.</h1><Link to="/dashboard" className="btn-primary mt-7">Return to sanctuary</Link></div></div>
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthProvider />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/books" element={<Books />} />
          <Route path="/music" element={<Music />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/coins" element={<CoinsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
