import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, BookOpen, Brain, Check, ChevronDown, CircleDollarSign,
  Clock3, Compass, Headphones, Heart, House, Library, LoaderCircle, LockKeyhole,
  Menu, MessageCircle, Music2, Pause, Play, Plus, Search, Send, Sparkles, Star,
  Trophy, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, authApi, featureApi, offline, streamChat } from './api'

const art = [
  { title: 'First Light', artist: 'Mika Sato', edition: '01 / 25', className: 'art-gradient-1', price: '0.18 ETH', tag: 'hope' },
  { title: 'Soft Geometry', artist: 'Jules Osei', edition: '04 / 40', className: 'art-gradient-2', price: '0.24 ETH', tag: 'calm' },
  { title: 'Bloom State', artist: 'Anika Vale', edition: '12 / 50', className: 'art-gradient-3', price: '0.12 ETH', tag: 'joy' },
]

const moods = [
  { label: 'Calm', color: '#a8f5d2', icon: '◒' },
  { label: 'Hopeful', color: '#bfa7ff', icon: '✦' },
  { label: 'Curious', color: '#f3cf83', icon: '◌' },
  { label: 'Tender', color: '#ff9eb4', icon: '♡' },
]

const demoThreads = [
  { id: 'demo-1', title: 'A little room to breathe', last_message: 'I feel lighter after saying that out loud.', message_count: 4 },
  { id: 'demo-2', title: 'Finding the next small step', last_message: 'What would a kinder version of today look like?', message_count: 8 },
]

const demoMessages = [
  { id: 'm1', content: 'Welcome in. You do not have to arrive with everything figured out.', is_user: false },
  { id: 'm2', content: 'I have been carrying a lot this week.', is_user: true },
  { id: 'm3', content: 'That sounds heavy. We can make a little space for it together. What feels most present right now?', is_user: false },
]

const demoJournal = [
  { _id: 'j1', title: 'A slower morning', content: 'I let the morning be quiet today. Tea, sunlight, and no rush.', mood: 'calm', created_at: new Date().toISOString() },
  { _id: 'j2', title: 'Choosing the brave thing', content: 'I sent the message I had been avoiding. It was okay to be honest.', mood: 'hopeful', created_at: new Date(Date.now() - 86400000).toISOString() },
]

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zenheaven_user')) } catch { return null }
  })
  const handleAuth = (result) => {
    localStorage.setItem('zenheaven_token', result.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(result.user))
    setUser(result.user)
  }
  const logout = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }

  return (
    <div className="noise aurora min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} />} />
        <Route path="/register" element={<AuthPage mode="register" onAuth={handleAuth} />} />
        <Route element={<AppShell user={user} onLogout={logout} />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/books" element={<Books />} />
          <Route path="/music" element={<Music />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/coins" element={<Coins />} />
        </Route>
      </Routes>
    </div>
  )
}

function Mark({ small = false }) {
  return <Link to="/" className={`flex items-center gap-2.5 ${small ? 'text-base' : 'text-lg'}`}><span className="grid h-8 w-8 place-items-center rounded-xl bg-lilac text-ink"><Sparkles size={16} /></span><span className="font-bold tracking-tight">zen<span className="text-lilac">heaven</span></span></Link>
}

function Landing() {
  const [menu, setMenu] = useState(false)
  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <Mark />
        <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          <a href="#gallery" className="transition hover:text-white">Gallery</a>
          <a href="#rituals" className="transition hover:text-white">Rituals</a>
          <a href="#story" className="transition hover:text-white">Our why</a>
        </div>
        <div className="hidden items-center gap-3 md:flex"><Link to="/login" className="button-ghost !border-transparent !px-4">Sign in</Link><Link to="/register" className="button-primary !px-4 !py-2.5">Enter ZenHeaven <ArrowRight size={15} /></Link></div>
        <button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X size={19} /> : <Menu size={19} />}</button>
      </nav>
      {menu && <div className="mx-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-shell p-5 md:hidden"><a href="#gallery" onClick={() => setMenu(false)}>Gallery</a><a href="#rituals" onClick={() => setMenu(false)}>Rituals</a><Link to="/login">Sign in</Link></div>}

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-[1.06fr_.94fr] md:px-10 md:pb-32 md:pt-24">
        <div className="fade-up max-w-2xl">
          <p className="eyebrow mb-5 flex items-center gap-2"><span className="h-px w-7 bg-lilac" />A softer internet for your inner world</p>
          <h1 className="serif text-6xl leading-[.98] tracking-tight text-white md:text-8xl">Make space for <em className="text-lilac">what matters.</em></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-white/55 md:text-lg">ZenHeaven is a living gallery of small, meaningful moments — a place to feel seen, find your people, and collect a little more calm each day.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link to="/register" className="button-primary">Open your gallery <ArrowDownRight size={16} /></Link><a href="#gallery" className="button-ghost">See what is inside</a></div>
          <div className="mt-11 flex items-center gap-5 text-xs text-white/40"><div className="flex -space-x-2">{['#bfa7ff', '#a8f5d2', '#ff9eb4', '#f3cf83'].map((color) => <span key={color} className="h-7 w-7 rounded-full border-2 border-ink" style={{ background: color }} />)}</div><span><strong className="text-white/75">12,480</strong> people making room for themselves</span></div>
        </div>
        <div className="relative mx-auto h-[440px] w-full max-w-[480px] md:h-[530px]">
          <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lilac/20 shadow-[0_0_100px_rgba(191,167,255,.14)]" />
          <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
          <div className="art-orbit halo absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[42%] art-gradient-2 md:h-[310px] md:w-[310px]">
            <div className="absolute inset-8 rounded-[38%] border border-white/35" /><div className="serif absolute bottom-9 left-8 text-4xl text-white/90">breathe<br /><em className="text-white/60">in / out</em></div><span className="absolute right-7 top-8 rounded-full bg-white/20 px-3 py-1 text-[9px] uppercase tracking-widest">edition 01</span>
          </div>
          <div className="glass absolute left-0 top-9 w-40 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl"><div className="mb-3 h-24 rounded-xl art-gradient-3" /><p className="text-xs font-bold">Golden hour thoughts</p><p className="mt-1 text-[10px] text-white/40">collected by Anika</p></div>
          <div className="glass absolute bottom-10 right-0 w-44 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl"><div className="flex items-center justify-between"><span className="eyebrow !text-[8px]">today's mood</span><Heart size={14} className="text-[#ff9eb4]" /></div><p className="serif mt-3 text-2xl text-white">gently<br />hopeful</p><div className="mt-4 h-1 rounded-full bg-white/10"><div className="h-1 w-2/3 rounded-full bg-[#ff9eb4]" /></div></div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="mb-9 flex items-end justify-between gap-4"><div><p className="eyebrow mb-3">The gallery is open</p><h2 className="serif text-4xl md:text-5xl">Keep a little <em className="text-lilac">light</em> close.</h2></div><Link to="/dashboard" className="hidden items-center gap-2 text-sm text-white/50 hover:text-white sm:flex">Explore the collection <ArrowRight size={15} /></Link></div>
        <div className="grid gap-4 md:grid-cols-3">{art.map((item) => <ArtCard key={item.title} item={item} />)}</div>
      </section>

      <section id="rituals" className="border-y border-white/10 bg-black/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-28"><div><p className="eyebrow mb-4">One space, many ways in</p><h2 className="serif max-w-sm text-4xl leading-tight md:text-5xl">A collection that <em className="text-mint">meets you</em> where you are.</h2></div><div className="grid gap-3 sm:grid-cols-2">{[['01', 'Talk it out', 'A gentle AI companion for the thoughts that need somewhere to go.', MessageCircle], ['02', 'Make a mark', 'Journal, notice patterns, and turn ordinary days into keepsakes.', BookOpen], ['03', 'Find your frequency', 'Soundtracks and stories shaped around your current weather.', Headphones], ['04', 'Go human', 'Meet therapists who make being understood feel possible.', UsersRound]].map(([number, title, text, Icon]) => <div key={number} className="glass rounded-3xl p-5"><div className="flex items-center justify-between text-xs text-white/30"><span>{number}</span><Icon size={17} className="text-lilac" /></div><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/45">{text}</p></div>)}</div></div>
      </section>

      <section id="story" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"><div className="glass relative overflow-hidden rounded-[2rem] p-8 md:p-14"><div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lilac/15 blur-3xl" /><p className="eyebrow">A note from the makers</p><p className="serif relative mt-6 max-w-3xl text-3xl leading-tight md:text-5xl">“You don’t need to become a new person. You deserve a place to remember the person you already are.”</p><div className="relative mt-8 flex items-center gap-3 text-sm text-white/45"><span className="h-2 w-2 rounded-full bg-mint" />Built for the in-between moments.</div></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-8 text-xs text-white/30 md:flex-row md:items-center md:justify-between md:px-10"><Mark small /><span>© 2025 ZenHeaven. Take what you need.</span></footer>
    </main>
  )
}

function ArtCard({ item }) {
  return <div className="group"><div className={`art-orbit relative aspect-[1.1] overflow-hidden rounded-[1.7rem] ${item.className}`}><div className="absolute inset-5 rounded-[1.3rem] border border-white/30 transition duration-500 group-hover:scale-105" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><span className="serif text-3xl text-white">{item.title}</span><span className="rounded-full bg-black/20 px-2 py-1 text-[9px] uppercase tracking-widest text-white/75">{item.edition}</span></div></div><div className="flex items-center justify-between px-1 pt-4"><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-white/40">by {item.artist}</p></div><span className="text-xs text-mint">{item.price}</span></div></div>
}

function AppShell({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const nav = [
    ['/dashboard', 'Overview', House], ['/chat', 'Companion', MessageCircle], ['/journal', 'Journal', BookOpen],
    ['/books', 'Reads', Library], ['/music', 'Soundscapes', Music2], ['/therapists', 'Therapists', UsersRound], ['/coins', 'Coins', CircleDollarSign],
  ]
  return <div className="flex min-h-screen"><aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-[#0d0e18]/95 p-5 backdrop-blur-2xl transition md:static md:translate-x-0`}><div className="flex items-center justify-between"><Mark small /><button className="md:hidden" onClick={() => setOpen(false)}><X size={18} /></button></div><div className="mt-12"><p className="eyebrow mb-4 !text-[9px]">Your sanctuary</p><div className="space-y-1">{nav.map(([path, label, Icon]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-lilac/15 font-bold text-white' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}><Icon size={17} />{label}</NavLink>)}</div></div><div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-mint/20 text-mint">{user ? user.username?.[0]?.toUpperCase() : <UserRound size={16} />}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{user?.full_name || user?.username || 'Guest explorer'}</p><p className="text-[10px] text-white/35">{user ? 'Member since today' : 'Demo mode'}</p></div><button onClick={onLogout} className="text-white/30 hover:text-white" title="Sign out"><ChevronDown size={15} /></button></div></div></aside><div className="min-w-0 flex-1"><header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink/75 px-5 py-4 backdrop-blur-xl md:px-10"><button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setOpen(true)}><Menu size={18} /></button><div className="md:hidden"><Mark small /></div><div className="ml-auto flex items-center gap-3"><div className="hidden items-center gap-2 text-xs text-white/45 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-mint" />All systems gentle</div><Link to="/coins" className="flex items-center gap-1.5 rounded-full border border-mint/20 bg-mint/10 px-3 py-2 text-xs font-bold text-mint"><CircleDollarSign size={14} /> 100</Link></div></header><div className="mx-auto max-w-7xl p-5 md:p-10"><RoutesOutlet /></div></div></div>
}

function RoutesOutlet() { return <Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Routes> }

function PageHeading({ eyebrow, title, text, action }) { return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-3">{eyebrow}</p><h1 className="serif text-4xl md:text-5xl">{title}</h1>{text && <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">{text}</p>}</div>{action}</div> }

function Dashboard({ user }) {
  const [balance, setBalance] = useState(100)
  useEffect(() => { featureApi.coins().then((data) => setBalance(data.balance)).catch(() => {}) }, [])
  return <div className="fade-up"><PageHeading eyebrow="Good to see you" title={<>Your inner world, <em className="text-lilac">in bloom.</em></>} text={`Welcome back${user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}. Here is a little map of how you have been showing up for yourself.`} action={<span className="eyebrow flex items-center gap-2 !text-mint"><span className="h-2 w-2 rounded-full bg-mint" />Tuesday, 14 May</span>} /><div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]"><div className="glass relative overflow-hidden rounded-[1.7rem] p-6 md:p-8"><div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-lilac/15 blur-3xl" /><div className="relative flex items-start justify-between"><div><p className="eyebrow !text-white/40">today's check-in</p><h2 className="serif mt-4 text-4xl">How is your<br /><em className="text-mint">weather inside?</em></h2></div><Sparkles className="text-lilac" size={22} /></div><div className="relative mt-8 grid grid-cols-4 gap-2">{moods.map((mood) => <button key={mood.label} className="rounded-2xl border border-white/10 bg-white/[.03] p-3 text-center transition hover:-translate-y-1 hover:border-white/30"><span className="text-xl" style={{ color: mood.color }}>{mood.icon}</span><span className="mt-2 block text-[10px] text-white/50">{mood.label}</span></button>)}</div><Link to="/journal" className="relative mt-6 flex items-center gap-2 text-xs font-bold text-lilac">Log a feeling <ArrowRight size={14} /></Link></div><div className="glass rounded-[1.7rem] p-6"><div className="flex items-center justify-between"><p className="eyebrow !text-white/40">calm coins</p><CircleDollarSign className="text-mint" size={19} /></div><p className="mt-5 text-5xl font-bold">{balance}</p><p className="mt-2 text-xs text-white/40">You collected 25 this week</p><div className="mt-7 h-2 rounded-full bg-white/10"><div className="h-2 w-[68%] rounded-full bg-mint" /></div><div className="mt-2 flex justify-between text-[10px] text-white/35"><span>next reward</span><span>68 / 100</span></div><Link to="/coins" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-mint">See your collection <ArrowRight size={14} /></Link></div></div><div className="mt-4 grid gap-4 md:grid-cols-3"><QuickCard to="/chat" icon={MessageCircle} title="Talk it out" text="Your companion is here." color="lilac" /><QuickCard to="/journal" icon={BookOpen} title="Make a mark" text="A thought worth keeping." color="mint" /><QuickCard to="/music" icon={Headphones} title="Find your frequency" text="A soundtrack for now." color="peach" /></div><div className="mt-12"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow mb-2">From the gallery</p><h2 className="serif text-3xl">Made for this moment</h2></div><Link to="/books" className="text-xs font-bold text-white/50 hover:text-white">View all <ArrowRight className="inline" size={13} /></Link></div><div className="grid gap-4 sm:grid-cols-3">{art.map((item) => <ArtCard key={item.title} item={item} />)}</div></div></div>
}

function QuickCard({ to, icon: Icon, title, text, color }) { const classes = color === 'mint' ? 'text-mint bg-mint/10' : color === 'peach' ? 'text-[#ffb26e] bg-[#ffb26e]/10' : 'text-lilac bg-lilac/10'; return <Link to={to} className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-white/20"><div className={`grid h-9 w-9 place-items-center rounded-xl ${classes}`}><Icon size={17} /></div><p className="mt-5 text-sm font-bold">{title}</p><p className="mt-1 text-xs text-white/40">{text}</p><ArrowRight size={15} className="mt-5 text-white/25 transition group-hover:translate-x-1 group-hover:text-white" /></Link> }

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const result = await (isRegister ? authApi.register(form) : authApi.login({ username: form.username, password: form.password }))
      onAuth(result); navigate('/dashboard')
    } catch (requestError) { setError(requestError.message || 'Something went wrong.'); setLoading(false) }
  }
  return <main className="grid min-h-screen place-items-center px-5 py-10"><div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-shell/80 shadow-2xl md:grid md:grid-cols-2"><div className="relative hidden min-h-[620px] overflow-hidden p-10 md:block"><div className="absolute inset-0 art-gradient-2 opacity-80" /><div className="absolute inset-0 bg-[#0b0c15]/40" /><div className="relative flex h-full flex-col justify-between"><Mark /><div><p className="eyebrow text-white/70">a softer place to land</p><p className="serif mt-4 max-w-sm text-5xl leading-tight">Come as you are. <em className="text-mint">Stay awhile.</em></p></div><p className="max-w-xs text-sm leading-6 text-white/60">Your thoughts, feelings, and tiny wins have a home here.</p></div></div><div className="p-7 md:p-10"><Link to="/" className="mb-12 inline-flex text-white/40 hover:text-white"><ArrowDownRight className="rotate-180" size={18} /></Link><p className="eyebrow mb-3">{isRegister ? 'Start your collection' : 'Welcome back'}</p><h1 className="serif text-4xl">{isRegister ? 'Make yourself at home.' : 'Good to see you again.'}</h1><p className="mt-3 text-sm leading-6 text-white/45">{isRegister ? 'A few details, then we will open the doors.' : 'Your little corner of calm is waiting.'}</p><form onSubmit={submit} className="mt-8 space-y-4">{isRegister && <input className="input" placeholder="Your name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />}{isRegister && <input className="input" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}<input className="input" placeholder="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><input className="input" type="password" placeholder="Password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{error && <p className="rounded-xl border border-[#ff9eb4]/20 bg-[#ff9eb4]/10 px-3 py-2 text-xs text-[#ffb4c6]">{error}</p>}<button className="button-primary mt-2 w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={16} /> : isRegister ? 'Open my gallery' : 'Enter ZenHeaven'} {!loading && <ArrowRight size={15} />}</button></form><p className="mt-7 text-center text-xs text-white/40">{isRegister ? 'Already have a space?' : 'New here?'} <Link className="font-bold text-lilac" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></div></div></main>
}

function Chat() {
  const [threads, setThreads] = useState(demoThreads)
  const [active, setActive] = useState('demo-1')
  const [messages, setMessages] = useState(demoMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [thought, setThought] = useState('Listening closely…')
  useEffect(() => { featureApi.threads().then((data) => { if (data.threads?.length) { setThreads(data.threads); setActive(data.threads[0].id) } }).catch(() => {}) }, [])
  useEffect(() => { if (active?.startsWith('demo')) return; featureApi.thread(active).then((data) => setMessages(data.messages || [])).catch(() => {}) }, [active])
  const send = async (event) => {
    event?.preventDefault(); const message = input.trim(); if (!message || thinking) return
    setInput(''); setThinking(true); setMessages((current) => [...current, { id: `u-${Date.now()}`, content: message, is_user: true }])
    const assistantId = `a-${Date.now()}`; setMessages((current) => [...current, { id: assistantId, content: '', is_user: false }])
    if (!localStorage.getItem('zenheaven_token')) {
      setTimeout(() => { setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: 'Thank you for trusting this space with that. We can take it one small breath at a time. What would feel supportive right now?' } : item)); setThinking(false) }, 700)
      return
    }
    try {
      await streamChat({ message, thread_id: active.startsWith('demo') ? null : active }, (eventData) => {
        if (eventData.type === 'thread_id') { setActive(eventData.data); setThreads((items) => [{ id: eventData.data, title: 'A new conversation', message_count: 0 }, ...items]) }
        if (eventData.type === 'thinking') setThought(eventData.data)
        if (eventData.type === 'token') setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + eventData.data } : item))
        if (eventData.type === 'complete') setThinking(false)
      })
    } catch { setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: 'The connection is quiet right now, but your message is safe here. Try again in a moment.' } : item)); setThinking(false) }
  }
  return <div className="fade-up"><PageHeading eyebrow="A place to say it" title={<>Talk it <em className="text-lilac">out.</em></>} text="A private, compassionate companion for the thoughts that are hard to carry alone." action={<div className="flex items-center gap-2 text-xs text-mint"><span className="h-2 w-2 rounded-full bg-mint" />Available now</div>} /><div className="grid min-h-[590px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0d0e18]/80 lg:grid-cols-[260px_1fr]"><aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r"><div className="mb-4 flex items-center justify-between"><span className="eyebrow !text-white/35">conversations</span><button className="rounded-lg bg-lilac/15 p-2 text-lilac" onClick={() => setMessages(demoMessages)}><Plus size={15} /></button></div><div className="space-y-1">{threads.map((thread) => <button key={thread.id} onClick={() => setActive(thread.id)} className={`w-full rounded-xl p-3 text-left ${active === thread.id ? 'bg-white/10' : 'hover:bg-white/5'}`}><p className="truncate text-xs font-bold">{thread.title}</p><p className="mt-1 truncate text-[10px] text-white/35">{thread.last_message || 'A new beginning'}</p></button>)}</div></aside><section className="flex min-h-[590px] flex-col"><div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><div className="grid h-9 w-9 place-items-center rounded-xl bg-lilac/15 text-lilac"><Brain size={17} /></div><div><p className="text-sm font-bold">Lumi</p><p className="text-[10px] text-white/35">{thinking ? thought : 'Your gentle AI companion'}</p></div><span className="ml-auto h-2 w-2 rounded-full bg-mint" /></div><div className="scrollbar flex-1 space-y-5 overflow-y-auto p-5 md:p-8">{messages.map((message) => <div key={message.id} className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.is_user ? 'rounded-br-sm bg-lilac text-ink' : 'rounded-bl-sm bg-white/[.07] text-white/75'}`}>{message.content || <LoaderCircle size={15} className="animate-spin text-lilac" />}</div></div>)}</div><form onSubmit={send} className="border-t border-white/10 p-4"><div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4"><input className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/30" placeholder="Share what is on your mind…" value={input} onChange={(e) => setInput(e.target.value)} /><button className="grid h-8 w-8 place-items-center rounded-xl bg-lilac text-ink" aria-label="Send"><Send size={14} /></button></div><p className="mt-2 text-center text-[10px] text-white/25">Lumi is supportive, not a replacement for professional care.</p></form></section></div></div>
}

function Journal() {
  const [entries, setEntries] = useState(demoJournal)
  const [prompt, setPrompt] = useState('What made you smile today?')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { featureApi.journal().then((data) => { if (Array.isArray(data) && data.length) setEntries(data) }).catch(() => {}) ; featureApi.prompts().then((data) => { if (data?.length) setPrompt(data[Math.floor(Math.random() * data.length)].prompt) }).catch(() => {}) }, [])
  const save = async () => { if (!content.trim()) return; setSaving(true); const optimistic = { _id: `local-${Date.now()}`, title: 'A moment worth keeping', content, mood: 'hopeful', created_at: new Date().toISOString() }; setEntries((items) => [optimistic, ...items]); setContent(''); try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content, mood: 'hopeful', tags: ['reflection'] }) }) } catch (error) { offline(error, null) } setSaving(false) }
  return <div className="fade-up"><PageHeading eyebrow="Your private canvas" title={<>Leave a <em className="text-mint">trace.</em></>} text="There is no right way to journal. Just an honest place to put what is here." action={<span className="text-xs text-white/35">{entries.length} moments collected</span>} /><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="glass rounded-[1.7rem] p-6 md:p-8"><div className="flex items-center justify-between"><p className="eyebrow !text-white/40">today's prompt</p><button className="text-white/40 hover:text-white" onClick={() => setPrompt('What would feel like enough for today?')}><Sparkles size={17} /></button></div><p className="serif mt-4 text-3xl leading-tight">“{prompt}”</p><textarea className="input mt-8 min-h-40 resize-none !rounded-2xl !bg-black/20" placeholder="Let the words arrive…" value={content} onChange={(e) => setContent(e.target.value)} /><div className="mt-4 flex items-center justify-between"><span className="text-[10px] text-white/25">Only you can see this</span><button className="button-primary !py-2.5" onClick={save} disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={15} /> : <><LockKeyhole size={14} />Keep this moment</>}</button></div></div><div><p className="eyebrow mb-4 !text-white/40">recently collected</p><div className="space-y-3">{entries.slice(0, 4).map((entry) => <div key={entry._id || entry.id} className="glass rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{entry.title || 'Untitled moment'}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-mint">{entry.mood || 'reflective'}</p></div><span className="text-[10px] text-white/25">{new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div><p className="mt-4 line-clamp-2 text-xs leading-5 text-white/45">{entry.content}</p></div>)}</div></div></div></div>
}

function Books() {
  const [books, setBooks] = useState([]); const [query, setQuery] = useState('')
  useEffect(() => { featureApi.books().then((data) => setBooks(data.books || [])).catch(() => setBooks([])) }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const data = await featureApi.searchBooks(query); setBooks(data.books || []) } catch (error) { offline(error, null) } }
  const fallback = [{ id: 'b1', title: 'The Things You Can See Only When You Slow Down', author: 'Haemin Sunim', description: 'A gentle reminder to pause, notice, and come back to yourself.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' }, { id: 'b2', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', description: 'A beautiful meditation on reciprocity, nature, and belonging.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80' }, { id: 'b3', title: 'Wintering', author: 'Katherine May', description: 'The quiet wisdom of rest and tending to yourself through difficult seasons.', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80' }]
  const display = books.length ? books : fallback
  return <div className="fade-up"><PageHeading eyebrow="The reading room" title={<>Stories for your <em className="text-lilac">season.</em></>} text="Books chosen around your latest mood, plus a few we keep coming back to." action={<form onSubmit={search} className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-3 text-white/30" size={15} /><input className="input !w-48 !rounded-full !py-2.5 !pl-9" placeholder="Find a title…" value={query} onChange={(e) => setQuery(e.target.value)} /></div><button className="button-primary !p-3" aria-label="Search books"><ArrowRight size={15} /></button></form>} /><div className="mb-7 flex items-center gap-2 rounded-2xl border border-mint/15 bg-mint/5 px-4 py-3 text-xs text-white/55"><Sparkles size={15} className="text-mint" />Based on your recent mood: <strong className="text-mint">hopeful</strong><span className="ml-auto text-white/30">curated just for you</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{display.slice(0, 6).map((book) => <div key={book.id} className="glass group rounded-[1.5rem] p-3"><div className="relative overflow-hidden rounded-xl"><img src={book.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'} alt="" className="h-52 w-full object-cover grayscale-[.2] transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2 py-1 text-[9px] uppercase tracking-wider text-mint">for you</span></div><div className="p-2 pt-4"><h3 className="text-sm font-bold">{book.title}</h3><p className="mt-1 text-xs text-lilac">by {book.author}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-white/40">{book.description}</p><button className="mt-5 flex items-center gap-2 text-xs font-bold text-white/55 hover:text-white">Save to shelf <Plus size={14} /></button></div></div>)}</div></div>
}

function Music() {
  const songs = [{ name: 'Bloom', artist: 'The Paper Kites', color: 'art-gradient-1' }, { name: 'Anchor', artist: 'Novo Amor', color: 'art-gradient-2' }, { name: 'A Walk', artist: 'Tycho', color: 'art-gradient-3' }, { name: 'Holocene', artist: 'Bon Iver', color: 'art-gradient-4' }]
  const [playing, setPlaying] = useState(null); const [apiSongs, setApiSongs] = useState([])
  useEffect(() => { featureApi.songs().then((data) => setApiSongs(data.songs?.slice(0, 6) || [])).catch(() => {}) }, [])
  const list = apiSongs.length ? apiSongs.map((name, index) => ({ name, artist: 'ZenHeaven radio', color: songs[index % songs.length].color })) : songs
  return <div className="fade-up"><PageHeading eyebrow="Your sound sanctuary" title={<>Press play on <em className="text-[#ffb26e]">feeling better.</em></>} text="A small, warm soundtrack for wherever you are right now." action={<span className="eyebrow !text-[#ffb26e]">mood: golden hour</span>} /><div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]"><div className="glass relative overflow-hidden rounded-[1.7rem] p-8"><div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-[#ffb26e]/15 blur-3xl" /><div className="relative"><p className="eyebrow !text-white/40">now playing</p><div className="art-orbit mx-auto mt-8 grid aspect-square max-w-[260px] place-items-center rounded-[38%] art-gradient-1 shadow-2xl"><div className="h-28 w-28 rounded-full border border-white/30 bg-black/20 backdrop-blur-xl"><div className="mx-auto mt-10 h-8 w-8 rounded-full bg-white/80" /></div></div><div className="mt-7 text-center"><p className="serif text-3xl">{playing !== null ? list[playing].name : 'Softly, softly'}</p><p className="mt-1 text-xs text-white/45">{playing !== null ? list[playing].artist : 'A quiet place to begin'}</p></div><div className="mt-7 h-1 rounded-full bg-white/10"><div className="h-1 w-1/3 rounded-full bg-[#ffb26e]" /></div><div className="mt-2 flex justify-between text-[10px] text-white/30"><span>1:24</span><span>4:12</span></div><div className="mt-5 flex justify-center"><button className="grid h-12 w-12 place-items-center rounded-full bg-[#ffb26e] text-ink" onClick={() => setPlaying(playing === null ? 0 : null)}>{playing === null ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}</button></div></div></div><div className="glass rounded-[1.7rem] p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow !text-white/40">the gentle edit</p><h2 className="serif mt-2 text-3xl">For your current weather</h2></div><Headphones className="text-[#ffb26e]" size={20} /></div><div className="mt-7 space-y-2">{list.map((song, index) => <button key={`${song.name}-${index}`} onClick={() => setPlaying(index)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${playing === index ? 'bg-[#ffb26e]/10' : 'hover:bg-white/5'}`}><span className={`grid h-11 w-11 place-items-center rounded-lg ${song.color} text-white/80`}>{playing === index ? <Pause size={14} /> : <Play size={14} />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{song.name}</span><span className="mt-1 block text-xs text-white/35">{song.artist}</span></span><span className="text-[10px] text-white/25">{3 + index}:2{index}</span></button>)}</div></div></div></div>
}

function Therapists() {
  const [therapists, setTherapists] = useState([]); const [filter, setFilter] = useState('')
  useEffect(() => { featureApi.therapists().then((data) => setTherapists(data)).catch(() => {}) }, [])
  const fallback = [{ _id: 't1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, bio: 'A warm, practical approach to finding steadier ground.', hourly_rate: 120, rating: 4.9, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' }, { _id: 't2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem'], experience_years: 8, bio: 'Helping you build healthier connections, starting with yourself.', hourly_rate: 100, rating: 4.8, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' }, { _id: 't3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Transitions'], experience_years: 7, bio: 'A culturally sensitive space to navigate change and meaning.', hourly_rate: 95, rating: 4.9, languages: ['English', 'Hindi'], photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' }]
  const list = (therapists.length ? therapists : fallback).filter((item) => !filter || item.specializations?.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())))
  return <div className="fade-up"><PageHeading eyebrow="Go human" title={<>Someone who <em className="text-mint">gets it.</em></>} text="Licensed professionals, thoughtfully matched to the parts of life you are moving through." action={<select className="input !w-auto !rounded-full !py-2.5" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All specialties</option><option value="anxiety">Anxiety</option><option value="relationships">Relationships</option><option value="grief">Grief & Loss</option></select>} /><div className="grid gap-4 lg:grid-cols-3">{list.map((therapist) => <div key={therapist._id || therapist.id} className="glass rounded-[1.5rem] p-4"><div className="flex gap-4"><img src={therapist.photo_url} alt="" className="h-20 w-20 rounded-2xl object-cover" /><div className="pt-1"><h3 className="text-sm font-bold">{therapist.name}</h3><p className="mt-1 text-xs text-mint">{therapist.experience_years} years experience</p><p className="mt-2 flex items-center gap-1 text-xs text-[#f3cf83]"><Star size={12} fill="currentColor" /> {therapist.rating || 4.8}</p></div></div><div className="mt-5 flex flex-wrap gap-1.5">{therapist.specializations?.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/50">{tag}</span>)}</div><p className="mt-4 text-xs leading-5 text-white/40">{therapist.bio}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-white/40"><strong className="text-white">${therapist.hourly_rate}</strong> / session</span><button className="button-ghost !px-3 !py-2 !text-xs">View profile <ArrowRight size={13} /></button></div></div>)}</div></div>
}

function Coins() {
  const [balance, setBalance] = useState(100); const [transactions, setTransactions] = useState([])
  useEffect(() => { featureApi.coins().then((data) => setBalance(data.balance)).catch(() => {}); featureApi.transactions().then(setTransactions).catch(() => {}) }, [])
  const activity = transactions.length ? transactions.slice(0, 5) : [{ amount: 15, source: 'journal', description: 'Wrote a journal entry', timestamp: new Date().toISOString() }, { amount: 5, source: 'mental_health_chat', description: 'Checked in with Lumi', timestamp: new Date(Date.now() - 86400000).toISOString() }]
  return <div className="fade-up"><PageHeading eyebrow="Your little economy of care" title={<>Collect the <em className="text-mint">good stuff.</em></>} text="Calm Coins turn the moments you show up for yourself into a gentle game, with no pressure to win." action={<span className="eyebrow !text-mint">level 02 · growing steady</span>} /><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="relative overflow-hidden rounded-[1.7rem] bg-mint p-7 text-ink"><div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full border border-ink/10" /><div className="absolute -bottom-5 -right-2 h-36 w-36 rounded-full border border-ink/10" /><div className="relative"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.2em] opacity-60">current balance</span><CircleDollarSign size={20} /></div><p className="mt-12 text-7xl font-bold">{balance}</p><p className="mt-2 text-sm opacity-65">coins to spend on care</p><div className="mt-10 flex items-center gap-2 text-xs font-bold"><Trophy size={14} /> 280 coins until level 03</div></div></div><div className="glass rounded-[1.7rem] p-7"><div className="flex items-center justify-between"><div><p className="eyebrow !text-white/40">your next small wins</p><h2 className="serif mt-2 text-3xl">Ways to collect</h2></div><Zap className="text-[#f3cf83]" size={20} /></div><div className="mt-6 grid gap-2 sm:grid-cols-2"><Goal icon={MessageCircle} title="Talk with Lumi" amount="+5" /><Goal icon={BookOpen} title="Write a moment" amount="+10" /><Goal icon={Heart} title="Check your mood" amount="+5" /><Goal icon={Compass} title="Explore a new read" amount="+8" /></div></div></div><div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div><p className="eyebrow mb-4 !text-white/40">recent activity</p><div className="glass divide-y divide-white/10 rounded-[1.5rem]">{activity.map((item, index) => <div key={`${item.description}-${index}`} className="flex items-center gap-3 p-4"><div className="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint"><Check size={15} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{item.description}</p><p className="mt-1 text-[10px] text-white/30">{new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p></div><span className="text-xs font-bold text-mint">+{item.amount}</span></div>)}</div></div><div className="glass rounded-[1.5rem] p-6"><p className="eyebrow !text-white/40">what they unlock</p><div className="mt-5 space-y-4"><Reward title="Premium insights" cost="100" icon={Sparkles} /><Reward title="Custom meditation" cost="150" icon={Headphones} /><Reward title="Therapist session" cost="500" icon={UsersRound} /></div></div></div></div>
}

function Goal({ icon: Icon, title, amount }) { return <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f3cf83]/10 text-[#f3cf83]"><Icon size={14} /></div><span className="flex-1 text-xs">{title}</span><span className="text-xs font-bold text-mint">{amount}</span></div> }
function Reward({ title, cost, icon: Icon }) { return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-lilac/10 text-lilac"><Icon size={15} /></div><span className="flex-1 text-xs font-bold">{title}</span><span className="text-[10px] text-white/40">{cost} coins</span></div> }

export default App
