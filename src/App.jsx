import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, Brain, Check, ChevronDown,
  ChevronRight, CircleHelp, Coins, Compass, Copy, Droplets, ExternalLink, Flame,
  Headphones, Heart, Home, Leaf, LineChart, LockKeyhole, LogOut, Menu, MessageCircle,
  Moon, MoreHorizontal, Music2, Pencil, Play, Plus, Search, Send, Settings, ShieldCheck,
  Sparkles, Star, Stethoscope, Sun, Target, TrendingUp, Trophy, UserRound, UsersRound,
  Wallet, X, Zap,
} from 'lucide-react'
import { api, clearToken, getToken, saveToken, streamChat } from './api'

const demoUser = { id: 'demo-user', username: 'mira', email: 'mira@example.com', full_name: 'Mira Chen', calm_coins: 1240 }
const fallbackPools = [
  { name: 'Lumen / USDC', protocol: 'Aave', apy: '18.42%', tvl: '$84.2M', risk: 'Low', accent: 'mint', icon: '◈' },
  { name: 'stETH / ETH', protocol: 'Lido', apy: '12.86%', tvl: '$211.8M', risk: 'Low', accent: 'sky', icon: '◇' },
  { name: 'USDC / DAI', protocol: 'Curve', apy: '9.74%', tvl: '$58.4M', risk: 'Low', accent: 'lime', icon: '◉' },
  { name: 'ETH / USDT', protocol: 'Velodrome', apy: '26.19%', tvl: '$31.6M', risk: 'Medium', accent: 'violet', icon: '✦' },
]
const fallbackBooks = [
  { id: '1', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'A small collection of notes, lists and stories for difficult days.' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=500&q=80', description: 'Tiny changes, remarkable results. A practical guide to building better habits.' },
  { id: '3', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80', description: 'The power of rest and retreat in difficult times.' },
]
const fallbackSongs = [
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80' },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', album_cover_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=500&q=80' },
  { name: 'Holocene', artist: 'Bon Iver', album_cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80' },
]
const fallbackTherapists = [
  { _id: 'demo-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, bio: 'Evidence-led therapy for anxiety, burnout and the moments when life feels too loud.', hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
  { _id: 'demo-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem'], experience_years: 8, bio: 'A warm, practical space to understand patterns and build healthier connections.', hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80' },
  { _id: 'demo-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & loss', 'Life transitions'], experience_years: 7, bio: 'Culturally sensitive support for transitions, grief and finding your next chapter.', hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi'], photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80' },
]
const fallbackTransactions = [
  { _id: '1', amount: 15, transaction_type: 'earn', source: 'journal', description: 'Created a new journal entry', timestamp: new Date().toISOString() },
  { _id: '2', amount: 5, transaction_type: 'earn', source: 'mental_health_chat', description: 'Completed a support session', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { _id: '3', amount: 100, transaction_type: 'spend', source: 'premium_insights', description: 'Unlocked premium insights', timestamp: new Date(Date.now() - 172800000).toISOString() },
]
const moods = ['Calm', 'Hopeful', 'Focused', 'Tired', 'Anxious']

function formatDate(value) {
  if (!value) return 'Today'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zenheaven_user')) || null } catch { return null }
  })
  const location = useLocation()
  const navigate = useNavigate()

  const signIn = (nextUser, token = 'demo-session') => {
    saveToken(token)
    localStorage.setItem('zenheaven_user', JSON.stringify(nextUser))
    setUser(nextUser)
    navigate('/dashboard')
  }
  const signOut = () => {
    clearToken()
    localStorage.removeItem('zenheaven_user')
    setUser(null)
    navigate('/')
  }

  if (location.pathname === '/login' || location.pathname === '/register') {
    return <AuthPage mode={location.pathname.slice(1)} onSignIn={signIn} />
  }
  if (!user && location.pathname !== '/') {
    return <AuthPage mode="login" onSignIn={signIn} />
  }
  if (location.pathname === '/') return <Landing user={user} onSignOut={signOut} />

  return <AppShell user={user} onSignOut={signOut} />
}

function AuthPage({ mode, onSignIn }) {
  const [isRegister, setIsRegister] = useState(mode === 'register')
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = isRegister ? await api.register(form) : await api.login({ username: form.username, password: form.password })
      onSignIn(result.user, result.access_token)
    } catch (requestError) {
      if (requestError.message.includes('Failed to fetch') || requestError.message.includes('Network')) {
        onSignIn({ ...demoUser, username: form.username || demoUser.username, full_name: form.full_name || demoUser.full_name })
      } else setError(requestError.message)
    } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-forest px-5 py-6 text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-sm font-bold tracking-[0.18em]"><Logo /> ZENHEAVEN</Link>
        <Link to="/" className="text-xs text-muted transition hover:text-ink">Back to home</Link>
      </div>
      <main className="mx-auto grid max-w-5xl items-center gap-14 py-16 lg:grid-cols-[0.9fr_1fr] lg:py-24">
        <div>
          <span className="eyebrow">THE CALM ECONOMY</span>
          <h1 className="display mt-5 max-w-xl text-5xl leading-[0.98] sm:text-7xl">Your wealth should feel <span className="text-teal">lighter.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted">A considered space for your capital, your rituals, and the person you are becoming.</p>
          <div className="mt-10 flex items-center gap-7 text-xs text-muted"><span><ShieldCheck className="mr-2 inline h-4 w-4 text-teal" />Non-custodial</span><span><LockKeyhole className="mr-2 inline h-4 w-4 text-teal" />Encrypted by design</span></div>
        </div>
        <form onSubmit={submit} className="panel glow max-w-md p-7 sm:p-9">
          <div className="flex items-center justify-between">
            <div><p className="text-xs uppercase tracking-[0.2em] text-teal">{isRegister ? 'Begin your journey' : 'Welcome back'}</p><h2 className="mt-2 text-2xl font-medium">{isRegister ? 'Create your sanctuary' : 'Return to stillness'}</h2></div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal/10 text-teal"><Sparkles className="h-5 w-5" /></span>
          </div>
          <div className="mt-8 space-y-4">
            {isRegister && <Input label="Name" placeholder="How should we call you?" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} />}
            <Input label="Username" placeholder="your calm alias" value={form.username} onChange={(value) => setForm({ ...form, username: value })} required />
            {isRegister && <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />}
            <Input label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={(value) => setForm({ ...form, password: value })} required />
          </div>
          {error && <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
          <button disabled={loading} className="button button-primary mt-7 w-full justify-center">{loading ? 'Opening…' : isRegister ? 'Create account' : 'Enter ZenHeaven'} <ChevronRight className="h-4 w-4" /></button>
          <p className="mt-6 text-center text-xs text-muted">{isRegister ? 'Already have a sanctuary?' : 'New to ZenHeaven?'} <button type="button" onClick={() => setIsRegister(!isRegister)} className="ml-1 text-teal hover:underline">{isRegister ? 'Sign in' : 'Create an account'}</button></p>
        </form>
      </main>
    </div>
  )
}

function Input({ label, value, onChange, ...props }) {
  return <label className="block text-xs text-muted"><span className="mb-2 block uppercase tracking-[0.16em]">{label}</span><input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="field" /></label>
}

function Logo() {
  return <span className="relative grid h-7 w-7 place-items-center rounded-full border border-teal/50"><span className="h-3 w-3 rounded-full bg-teal shadow-[0_0_15px_#75e2bb]" /></span>
}

function Landing({ user, onSignOut }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-screen overflow-hidden bg-forest text-ink">
      <div className="grain" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-xs font-bold tracking-[0.18em]"><Logo /> ZENHEAVEN</Link>
        <nav className="hidden items-center gap-8 text-xs text-muted md:flex"><a href="#philosophy" className="hover:text-ink">Philosophy</a><a href="#vaults" className="hover:text-ink">Vaults</a><a href="#rituals" className="hover:text-ink">Rituals</a></nav>
        <div className="flex items-center gap-3">
          {user ? <button onClick={() => navigate('/dashboard')} className="button button-primary text-xs">Open dashboard <ArrowUpRight className="h-3.5 w-3.5" /></button> : <><Link to="/login" className="hidden px-3 py-2 text-xs text-muted hover:text-ink sm:block">Sign in</Link><Link to="/register" className="button button-outline text-xs">Begin <ArrowUpRight className="h-3.5 w-3.5" /></Link></>}
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 md:hidden">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </header>
      {menuOpen && <div className="relative z-20 mx-5 rounded-2xl border border-white/10 bg-panel p-5 md:hidden"><a href="#philosophy" className="block py-2 text-sm text-muted">Philosophy</a><a href="#vaults" className="block py-2 text-sm text-muted">Vaults</a><a href="#rituals" className="block py-2 text-sm text-muted">Rituals</a></div>}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-32 lg:pt-20">
          <div className="relative">
            <div className="orb orb-one" /><div className="orb orb-two" />
            <p className="eyebrow"><span className="pulse-dot" /> INTENTIONAL FINANCE · 2025</p>
            <h1 className="display relative mt-6 max-w-3xl text-[4.2rem] leading-[0.87] tracking-[-0.06em] sm:text-[6.8rem]">Grow in<br /><em>stillness.</em></h1>
            <p className="mt-8 max-w-md text-base leading-7 text-muted">ZenHeaven is a quieter way to put your capital to work. Thoughtful yield, clear signals, and rituals that make progress feel human.</p>
            <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => navigate(user ? '/dashboard' : '/register')} className="button button-primary">Explore the vaults <ArrowUpRight className="h-4 w-4" /></button><a href="#philosophy" className="button button-ghost">How it works <ChevronDown className="h-4 w-4" /></a></div>
            <div className="mt-14 flex items-center gap-6 text-xs text-muted"><span className="flex -space-x-2"><span className="avatar bg-teal text-forest">A</span><span className="avatar bg-acid text-forest">N</span><span className="avatar bg-coral text-forest">K</span></span><span><strong className="text-ink">12,480</strong> people choosing a calmer yield</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="dashboard-card relative overflow-hidden p-5 sm:p-7">
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-teal/10 blur-3xl" />
              <div className="relative flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-muted">Your sanctuary</p><p className="mt-2 text-sm text-ink">Good morning, Mira <span className="text-lg">✦</span></p></div><div className="grid h-9 w-9 place-items-center rounded-full bg-white/5"><MoreHorizontal className="h-4 w-4 text-muted" /></div></div>
              <div className="mt-10"><p className="text-[10px] uppercase tracking-[0.18em] text-muted">Total balance</p><p className="mt-2 font-mono text-4xl tracking-[-0.06em] text-ink">$24,892<span className="text-2xl text-muted">.40</span></p><p className="mt-2 flex items-center gap-1.5 text-xs text-teal"><ArrowUpRight className="h-3 w-3" /> +$1,248.20 this month</p></div>
              <div className="chart mt-8"><div className="chart-labels"><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>NOW</span></div><svg viewBox="0 0 500 130" preserveAspectRatio="none" className="h-32 w-full"><defs><linearGradient id="landingChart" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#75e2bb" stopOpacity=".35" /><stop offset="100%" stopColor="#75e2bb" stopOpacity="0" /></linearGradient></defs><path d="M0 112 C45 108 60 82 98 91 S135 68 165 78 S207 42 241 65 S292 50 323 55 S367 25 395 38 S433 18 500 8 V130 H0Z" fill="url(#landingChart)" /><path d="M0 112 C45 108 60 82 98 91 S135 68 165 78 S207 42 241 65 S292 50 323 55 S367 25 395 38 S433 18 500 8" fill="none" stroke="#75e2bb" strokeWidth="2.5" /></svg></div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5"><MiniStat label="Net APY" value="12.86%" accent="text-teal" /><MiniStat label="Deposited" value="$18.4k" /><MiniStat label="Earned" value="$2.1k" accent="text-acid" /></div>
            </div>
            <div className="float-card absolute -bottom-7 -left-5 flex items-center gap-3 px-4 py-3 sm:-left-12"><span className="grid h-9 w-9 place-items-center rounded-xl bg-acid/15 text-acid"><Sparkles className="h-4 w-4" /></span><div><p className="text-[10px] uppercase tracking-wider text-muted">Daily intention</p><p className="mt-0.5 text-xs">Review your allocation</p></div><Check className="ml-3 h-4 w-4 text-teal" /></div>
          </div>
        </section>
        <section id="philosophy" className="border-y border-white/10 bg-[#0b2222]/70"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-24"><div><p className="eyebrow">A DIFFERENT KIND OF PROTOCOL</p><h2 className="display mt-5 max-w-sm text-4xl leading-none sm:text-5xl">The best yield is the one you can <em>understand.</em></h2></div><div className="grid gap-5 sm:grid-cols-3"><Feature icon={<Compass />} number="01" title="Find your north" text="Signals over noise. See the path, the risk, and the reason before you commit." /><Feature icon={<Leaf />} number="02" title="Let it grow" text="Automated strategies do the repetitive work, so you can return to your day." /><Feature icon={<Heart />} number="03" title="Stay human" text="Your dashboard is a ritual, not a casino. Every choice starts with intention." /></div></div></section>
        <section id="vaults" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">THE LIVING VAULT</p><h2 className="display mt-4 text-4xl sm:text-6xl">A little more<br /><em>every day.</em></h2></div><Link to={user ? '/dashboard' : '/register'} className="button button-outline self-start sm:self-end">View all strategies <ChevronRight className="h-4 w-4" /></Link></div><div className="mt-12 grid gap-3 md:grid-cols-2">{fallbackPools.map((pool, index) => <PoolRow key={pool.name} pool={pool} index={index} />)}</div></section>
        <section id="rituals" className="bg-acid text-forest"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:px-10 lg:py-24"><div><p className="eyebrow text-forest/60">MORE THAN A BALANCE</p><h2 className="display mt-5 max-w-lg text-5xl leading-[.92] sm:text-7xl">Your wealth.<br /><em>Your wellbeing.</em></h2></div><div className="flex flex-col justify-end"><p className="max-w-lg text-lg leading-8 text-forest/75">Journal your decisions. Check in with your energy. Talk to someone when you need to. ZenHeaven brings the whole picture into focus, because abundance is a practice.</p><Link to={user ? '/journal' : '/register'} className="button button-dark mt-8 self-start">Discover the rituals <ArrowUpRight className="h-4 w-4" /></Link></div></div></section>
      </main>
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-xs text-muted sm:flex-row lg:px-10"><span>© 2025 ZenHeaven. Built for a calmer future.</span><div className="flex gap-5"><a href="#philosophy" className="hover:text-ink">Philosophy</a><a href="#vaults" className="hover:text-ink">Security</a>{user && <button onClick={onSignOut} className="hover:text-ink">Sign out</button>}</div></footer>
    </div>
  )
}

function Feature({ icon, number, title, text }) {
  return <div className="border-t border-white/10 pt-4"><div className="flex items-center justify-between text-teal"><span>{icon && <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal/10">{icon}</span>}</span><span className="font-mono text-[10px]">{number}</span></div><h3 className="mt-7 text-lg">{title}</h3><p className="mt-3 text-sm leading-6 text-muted">{text}</p></div>
}

function MiniStat({ label, value, accent = 'text-ink' }) {
  return <div><p className="text-[9px] uppercase tracking-wider text-muted">{label}</p><p className={`mt-2 font-mono text-sm ${accent}`}>{value}</p></div>
}

function PoolRow({ pool, index, compact = false }) {
  return <div className="pool-row group"><div className={`pool-icon ${pool.accent}`}>{pool.icon}</div><div className="min-w-0 flex-1"><p className="truncate text-sm">{pool.name}</p><p className="mt-1 text-[11px] text-muted">{pool.protocol} · <span className={pool.risk === 'Low' ? 'text-teal' : 'text-acid'}>{pool.risk} risk</span></p></div>{!compact && <div className="hidden text-right sm:block"><p className="font-mono text-sm text-teal">{pool.apy}</p><p className="mt-1 text-[10px] text-muted">NET APY</p></div>}<div className="text-right"><p className="font-mono text-sm">{pool.tvl}</p><p className="mt-1 text-[10px] text-muted">TVL</p></div>{!compact && <button className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted transition group-hover:border-teal group-hover:text-teal"><ArrowUpRight className="h-3.5 w-3.5" /></button>}</div>
}

function AppShell({ user, onSignOut }) {
  const [sidebar, setSidebar] = useState(false)
  const location = useLocation()
  const current = location.pathname
  const nav = [
    { to: '/dashboard', label: 'Overview', icon: Home },
    { to: '/chat', label: 'Inner circle', icon: MessageCircle },
    { to: '/journal', label: 'Journal', icon: Pencil },
    { to: '/books', label: 'Reading room', icon: BookOpen },
    { to: '/music', label: 'Soundscape', icon: Music2 },
    { to: '/therapists', label: 'Human support', icon: Stethoscope },
    { to: '/coins', label: 'Calm coins', icon: Coins },
  ]
  return <div className="min-h-screen bg-forest text-ink"><div className="grain" /><aside className={`sidebar ${sidebar ? 'sidebar-open' : ''}`}><div className="flex items-center justify-between"><Link to="/" className="flex items-center gap-3 text-xs font-bold tracking-[0.16em]"><Logo /> ZENHEAVEN</Link><button onClick={() => setSidebar(false)} className="rounded-lg p-1 text-muted lg:hidden"><X className="h-4 w-4" /></button></div><div className="mt-12"><p className="eyebrow px-3 text-[9px]">YOUR SANCTUARY</p><nav className="mt-4 space-y-1">{nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setSidebar(false)} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}><Icon className="h-4 w-4" />{label}{label === 'Calm coins' && <span className="ml-auto rounded-full bg-acid/15 px-2 py-0.5 font-mono text-[9px] text-acid">{user.calm_coins || 1240}</span>}</NavLink>)}</nav></div><div className="mt-auto"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted">Your daily rhythm</span><Sun className="h-4 w-4 text-acid" /></div><div className="mt-4 flex items-end gap-1.5">{[3, 5, 4, 6, 5, 7, 8].map((height, index) => <span key={index} className={`w-full rounded-t-sm ${index === 6 ? 'bg-teal' : 'bg-teal/25'}`} style={{ height: `${height * 4}px` }} />)}</div><p className="mt-3 text-[10px] text-muted"><strong className="text-ink">7 day</strong> consistency streak</p></div><button onClick={onSignOut} className="mt-5 flex items-center gap-3 px-3 text-xs text-muted hover:text-ink"><LogOut className="h-4 w-4" /> Sign out</button></div></aside><div className="app-main"><header className="topbar"><button onClick={() => setSidebar(true)} className="rounded-lg border border-white/10 p-2 text-muted lg:hidden"><Menu className="h-4 w-4" /></button><div className="hidden items-center gap-2 text-xs text-muted sm:flex"><span className="pulse-dot" /> All systems calm</div><div className="ml-auto flex items-center gap-3"><button className="relative rounded-full p-2 text-muted hover:bg-white/5 hover:text-ink"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" /></button><div className="hidden h-5 w-px bg-white/10 sm:block" /><Link to="/coins" className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs sm:flex"><span className="text-acid">✦</span><span className="font-mono text-acid">{user.calm_coins || 1240}</span><span className="text-muted">coins</span></Link><div className="avatar bg-teal text-forest">{(user.full_name || user.username || 'M').slice(0, 1).toUpperCase()}</div></div></header><main className="page-wrap">{current === '/dashboard' && <Dashboard user={user} />}{current === '/chat' && <Chat />}{current === '/journal' && <Journal />}{current === '/books' && <Books user={user} />}{current === '/music' && <Music />}{current === '/therapists' && <Therapists user={user} />}{current === '/coins' && <CoinsPage user={user} />}</main></div></div>
}

function PageIntro({ eyebrow, title, description, action }) {
  return <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="display mt-4 text-4xl leading-none sm:text-6xl">{title}</h1>{description && <p className="mt-5 max-w-xl text-sm leading-6 text-muted">{description}</p>}</div>{action}</div>
}

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user.calm_coins || 1240)
  const [streak, setStreak] = useState(7)
  const [goals, setGoals] = useState([])
  const [activeTab, setActiveTab] = useState('Overview')
  useEffect(() => {
    Promise.allSettled([api.balance(), api.streak(), api.dailyGoals()]).then(([balanceResult, streakResult, goalsResult]) => {
      if (balanceResult.status === 'fulfilled') setBalance(balanceResult.value.balance)
      if (streakResult.status === 'fulfilled') setStreak(streakResult.value.current_streak)
      if (goalsResult.status === 'fulfilled') setGoals(goalsResult.value)
    })
  }, [])
  const completed = goals.filter((goal) => goal.completed).length
  return <div className="space-y-9"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">SATURDAY · SEP 05, 2025</p><h1 className="display mt-4 text-4xl sm:text-6xl">Good morning, <em>{user.full_name?.split(' ')[0] || user.username}.</em></h1><p className="mt-4 text-sm text-muted">A little intention goes a long way today.</p></div><button className="button button-outline self-start"><Sun className="h-4 w-4 text-acid" /> Daily check-in <ChevronRight className="h-4 w-4" /></button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><StatCard icon={<Wallet />} label="Total balance" value="$24,892.40" change="+5.28%" positive /><StatCard icon={<TrendingUp />} label="Net APY" value="12.86%" change="+0.84%" positive /><StatCard icon={<Coins />} label="Calm coins" value={balance.toLocaleString()} change="+120 this month" positive accent="acid" /><StatCard icon={<Flame />} label="Wellbeing streak" value={`${streak} days`} change="Personal best" positive accent="coral" /></div><div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]"><section className="panel p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">PORTFOLIO PULSE</p><h2 className="mt-2 text-lg">Your growth, over time</h2></div><div className="flex rounded-lg border border-white/10 p-1">{['1W', '1M', '1Y'].map((range) => <button key={range} className={`rounded px-2 py-1 font-mono text-[10px] ${range === '1M' ? 'bg-teal text-forest' : 'text-muted'}`}>{range}</button>)}</div></div><div className="mt-8"><div className="flex items-baseline justify-between"><span className="font-mono text-2xl">$24,892.40</span><span className="text-xs text-teal">+$1,248.20</span></div><PortfolioChart /></div><div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5"><MiniStat label="Deposited" value="$18,420" /><MiniStat label="Yield earned" value="$2,186" accent="text-teal" /><MiniStat label="Fees saved" value="$284" accent="text-acid" /></div></section><section className="panel p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">TODAY'S RITUAL</p><h2 className="mt-2 text-lg">Small wins, compounded</h2></div><Target className="h-5 w-5 text-acid" /></div><div className="mt-7 space-y-4">{(goals.length ? goals : [{ title: 'Review your portfolio', completed: true, coins: 8 }, { title: 'Write a journal entry', completed: true, coins: 15 }, { title: 'Take a mindful pause', completed: false, coins: 5 }]).slice(0, 3).map((goal, index) => <div key={goal.id || goal.title} className="flex items-center gap-3"><span className={`grid h-7 w-7 place-items-center rounded-full ${goal.completed ? 'bg-teal text-forest' : 'border border-white/15 text-muted'}`}>{goal.completed ? <Check className="h-3.5 w-3.5" /> : <span className="font-mono text-[10px]">0{index + 1}</span>}</span><span className={`flex-1 text-sm ${goal.completed ? 'text-muted line-through' : ''}`}>{goal.title}</span><span className="font-mono text-[10px] text-acid">+{goal.coins} ✦</span></div>)}</div><div className="mt-8 border-t border-white/10 pt-5"><div className="flex justify-between text-xs"><span className="text-muted">{completed || 2} of {goals.length || 3} complete</span><span className="text-teal">{Math.round(((completed || 2) / (goals.length || 3)) * 100)}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-teal" style={{ width: `${((completed || 2) / (goals.length || 3)) * 100}%` }} /></div></div></section></div><section><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">FIND YOUR FLOW</p><h2 className="mt-2 text-xl">Strategies for your season</h2></div><Link to="/dashboard" className="hidden text-xs text-teal sm:block">View all strategies <ChevronRight className="ml-1 inline h-3 w-3" /></Link></div><div className="mb-4 flex gap-5 border-b border-white/10">{['Overview', 'Stable yield', 'Growth'].map((tab) => <button onClick={() => setActiveTab(tab)} key={tab} className={`border-b-2 pb-3 text-xs ${activeTab === tab ? 'border-teal text-ink' : 'border-transparent text-muted'}`}>{tab}</button>)}</div><div className="grid gap-3 lg:grid-cols-2">{fallbackPools.slice(activeTab === 'Growth' ? 2 : 0, activeTab === 'Stable yield' ? 2 : 4).map((pool, index) => <PoolRow key={pool.name} pool={pool} index={index} />)}</div></section></div>
}

function StatCard({ icon, label, value, change, positive, accent = 'teal' }) {
  return <div className="stat-card"><span className={`stat-icon ${accent}`}>{icon}</span><p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p><p className="mt-2 font-mono text-2xl tracking-[-0.05em]">{value}</p><p className={`mt-2 text-[11px] ${positive ? 'text-teal' : 'text-coral'}`}><ArrowUpRight className="mr-1 inline h-3 w-3" />{change}</p></div>
}

function PortfolioChart() {
  return <div className="relative mt-5 h-40"><div className="absolute inset-0 flex flex-col justify-between opacity-50">{[1, 2, 3, 4].map((line) => <span key={line} className="border-t border-dashed border-white/10" />)}</div><svg viewBox="0 0 600 150" preserveAspectRatio="none" className="relative h-full w-full"><defs><linearGradient id="portfolio" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#75e2bb" stopOpacity=".26" /><stop offset="100%" stopColor="#75e2bb" stopOpacity="0" /></linearGradient></defs><path d="M0 135 C40 132 50 115 78 120 S120 105 145 112 S178 86 214 99 S249 75 279 91 S326 72 355 77 S394 49 429 59 S465 28 498 45 S545 31 600 12 V150 H0Z" fill="url(#portfolio)" /><path d="M0 135 C40 132 50 115 78 120 S120 105 145 112 S178 86 214 99 S249 75 279 91 S326 72 355 77 S394 49 429 59 S465 28 498 45 S545 31 600 12" fill="none" stroke="#75e2bb" strokeWidth="2" /></svg><div className="absolute -bottom-5 left-0 right-0 flex justify-between font-mono text-[9px] text-muted"><span>AUG 05</span><span>AUG 12</span><span>AUG 19</span><span>AUG 26</span><span>SEP 05</span></div></div>
}

function Chat() {
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Welcome back. I’m here to help you check in, make sense of what you’re carrying, or simply find a little more room to breathe. What’s present for you today?' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef(null)
  useEffect(() => { api.threads().then((result) => setThreads(result.threads || [])).catch(() => {}) }, [])
  const selectThread = (id) => { setThreadId(id); api.thread(id).then((result) => setMessages((result.messages || []).map((message) => ({ role: message.is_user ? 'user' : 'assistant', content: message.content })))).catch(() => {}) }
  const send = async (event) => {
    event?.preventDefault()
    const message = input.trim()
    if (!message || streaming) return
    setInput('')
    setMessages((items) => [...items, { role: 'user', content: message }, { role: 'assistant', content: '' }])
    setStreaming(true)
    setThinking('Finding the right words…')
    abortRef.current = new AbortController()
    try {
      await streamChat({ message, threadId, signal: abortRef.current.signal, onEvent: (eventData) => {
        if (eventData.type === 'thread_id') setThreadId(eventData.data)
        if (eventData.type === 'thinking') setThinking(eventData.data)
        if (eventData.type === 'token') setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: item.content + eventData.data } : item))
        if (eventData.type === 'complete') setThinking('')
        if (eventData.type === 'error') setThinking('The circle is taking a quiet moment. Please try again.')
      } })
    } catch {
      setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: 'I’m having trouble reaching the support space right now. Try a slow breath in for four, hold for four, and out for six. You can come back when you’re ready.' } : item))
      setThinking('')
    } finally { setStreaming(false); setThinking('') }
  }
  return <div className="grid min-h-[calc(100vh-8rem)] gap-4 xl:grid-cols-[260px_1fr]"><aside className="panel hidden p-4 xl:block"><div className="flex items-center justify-between px-2"><p className="eyebrow">INNER CIRCLE</p><button className="rounded-lg p-2 text-muted hover:bg-white/5"><Plus className="h-4 w-4" /></button></div><button onClick={() => { setThreadId(null); setMessages([{ role: 'assistant', content: 'A fresh page. No pressure to have the right words — just start wherever you are.' }]) }} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-teal/30 bg-teal/10 px-3 py-3 text-left text-xs text-teal"><MessageCircle className="h-4 w-4" /> New conversation</button><div className="mt-6 space-y-1">{threads.length ? threads.map((thread) => <button key={thread.id} onClick={() => selectThread(thread.id)} className={`w-full rounded-xl px-3 py-3 text-left ${thread.id === threadId ? 'bg-white/10' : 'hover:bg-white/5'}`}><p className="truncate text-xs">{thread.title}</p><p className="mt-1 truncate text-[10px] text-muted">{thread.last_message || 'A new beginning'}</p></button>) : <p className="px-3 text-xs leading-5 text-muted">Your conversations will appear here, held gently and privately.</p>}</div></aside><section className="panel flex min-h-[620px] flex-col overflow-hidden"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-teal text-forest"><Brain className="h-4 w-4" /></div><div><p className="text-sm">Inner circle</p><p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted"><span className="pulse-dot" /> CalmBot · always here</p></div></div><button className="rounded-lg p-2 text-muted hover:bg-white/5"><CircleHelp className="h-4 w-4" /></button></div><div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex max-w-2xl gap-3 ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}><div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${message.role === 'assistant' ? 'bg-teal text-forest' : 'bg-acid text-forest'}`}>{message.role === 'assistant' ? <Sparkles className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}</div><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'rounded-tl-sm bg-white/[0.06] text-ink' : 'rounded-tr-sm bg-teal text-forest'}`}>{message.content || <span className="typing"><i /><i /><i /></span>}</div></div>)}{thinking && <p className="ml-10 text-[10px] text-muted">{thinking}</p>}</div><form onSubmit={send} className="border-t border-white/10 p-4 sm:p-5"><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-2 focus-within:border-teal/50"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Share what’s on your mind…" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted" /><button type="submit" className="grid h-9 w-9 place-items-center rounded-xl bg-teal text-forest disabled:opacity-40" disabled={!input.trim() || streaming}><Send className="h-4 w-4" /></button></div><p className="mt-3 text-center text-[10px] text-muted">AI support is not a replacement for professional care. In an emergency, contact local services.</p></form></section></div>
}

function Journal() {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    Promise.allSettled([api.journalEntries(), api.journalPrompts()]).then(([entryResult, promptResult]) => {
      if (entryResult.status === 'fulfilled') setEntries(entryResult.value || [])
      if (promptResult.status === 'fulfilled') setPrompts(promptResult.value || [])
    })
  }, [])
  const analyze = async () => {
    if (!content.trim()) return
    try { setAnalysis(await api.analyzeMood(content)) } catch { setAnalysis({ mood: 'Reflective', mood_description: 'You are giving yourself space to notice what is true today.', suggestions: ['Take three slow breaths', 'Name one thing within your control'] }) }
  }
  const save = async (event) => {
    event.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      const result = await api.createJournal({ content, mood: mood || analysis?.mood?.toLowerCase(), tags: ['reflection'] })
      setEntries((current) => [result, ...current])
      setNotice('Entry saved · +10 calm coins')
      setContent('')
      setMood('')
      setAnalysis(null)
    } catch { setNotice('Your reflection is saved locally for this demo.') }
    finally { setSaving(false); setTimeout(() => setNotice(''), 3500) }
  }
  return <div className="space-y-9"><PageIntro eyebrow="THE REFLECTION ROOM" title={<>Make space for<br /><em>what’s true.</em></>} description="A private place to slow down, notice patterns, and leave a little more room for tomorrow." action={<span className="hidden rounded-full border border-teal/30 bg-teal/10 px-3 py-2 text-xs text-teal sm:block"><Pencil className="mr-2 inline h-3.5 w-3.5" /> +10 coins per entry</span>} /><div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"><form onSubmit={save} className="panel p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">NEW ENTRY</p><h2 className="mt-2 text-xl">How are you arriving today?</h2></div><span className="font-mono text-[10px] text-muted">{content.length}/2000</span></div><textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 2000))} placeholder="Start with a sentence, a feeling, or a small detail you noticed…" className="textarea mt-7 min-h-[200px]" /><div className="mt-5 flex flex-wrap items-center gap-2"><span className="mr-1 text-[10px] uppercase tracking-wider text-muted">Mood</span>{moods.map((item) => <button type="button" key={item} onClick={() => setMood(item.toLowerCase())} className={`mood-pill ${mood === item.toLowerCase() ? 'mood-active' : ''}`}>{item}</button>)}</div><div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center"><button type="button" onClick={analyze} className="text-xs text-teal hover:text-ink"><Sparkles className="mr-2 inline h-3.5 w-3.5" /> Analyze my mood</button><button disabled={!content.trim() || saving} className="button button-primary justify-center">{saving ? 'Saving…' : 'Save reflection'} <ArrowUpRight className="h-4 w-4" /></button></div>{analysis && <div className="mt-5 rounded-2xl border border-teal/20 bg-teal/5 p-4"><p className="text-xs uppercase tracking-wider text-teal">Your reflection feels {analysis.mood}</p><p className="mt-2 text-sm leading-6 text-muted">{analysis.mood_description}</p>{analysis.suggestions?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{analysis.suggestions.map((suggestion) => <span key={suggestion} className="rounded-full bg-white/5 px-3 py-1 text-[10px] text-muted">{suggestion}</span>)}</div>}</div>}{notice && <p className="mt-4 text-center text-xs text-teal">{notice}</p>}</form><aside className="panel flex flex-col p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">A GENTLE NUDGE</p><h2 className="mt-2 text-xl">Writing prompts</h2></div><Sparkles className="h-5 w-5 text-acid" /></div><p className="mt-5 text-sm leading-6 text-muted">You don’t need to know where this is going. Pick a door and see what opens.</p><div className="mt-6 space-y-2">{(prompts.length ? prompts : [{ prompt: 'What made you smile today?', category: 'gratitude' }, { prompt: 'What is asking for your attention?', category: 'mindfulness' }, { prompt: 'What would “enough” feel like?', category: 'reflection' }]).slice(0, 3).map((prompt) => <button type="button" key={prompt.prompt} onClick={() => setContent(prompt.prompt + '\n\n')} className="group flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-left transition hover:border-teal/40 hover:bg-white/[0.03]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-acid/10 text-acid"><Leaf className="h-3.5 w-3.5" /></span><span className="flex-1 text-xs leading-5">{prompt.prompt}<small className="mt-0.5 block text-[9px] uppercase tracking-wider text-muted">{prompt.category}</small></span><ChevronRight className="h-3.5 w-3.5 text-muted transition group-hover:text-teal" /></button>)}</div></aside></div><section><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">YOUR THREAD</p><h2 className="mt-2 text-xl">Recent reflections</h2></div><span className="text-xs text-muted">{entries.length || 0} entries</span></div>{entries.length ? <div className="grid gap-3 md:grid-cols-2">{entries.slice(0, 4).map((entry) => <article key={entry._id || entry.id} className="panel p-5"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-wider text-teal">{entry.mood || 'Reflection'}</span><span className="text-[10px] text-muted">{formatDate(entry.created_at)}</span></div><h3 className="mt-4 text-sm">{entry.title || 'A moment to remember'}</h3><p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">{entry.content}</p></article>)}</div> : <div className="empty-state"><BookOpen className="h-6 w-6 text-teal" /><p className="mt-3 text-sm">Your first entry is waiting for you.</p><p className="mt-1 text-xs text-muted">There is no perfect way to begin.</p></div>}</section></div>
}

function Books({ user }) {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  useEffect(() => { api.moodBooks(user.id).then((result) => { if (result.books?.length) setBooks(result.books) }).catch(() => {}) }, [user.id])
  const search = async (event) => {
    event.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try { const result = await api.searchBooks(query); if (result.books?.length) setBooks(result.books) } catch { /* Keep curated shelf. */ }
    finally { setSearching(false) }
  }
  return <div className="space-y-9"><PageIntro eyebrow="THE READING ROOM" title={<>A chapter for<br /><em>your season.</em></>} description="Books selected around your most recent mood, because the right words can meet you exactly where you are." action={<form onSubmit={search} className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"><Search className="h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book…" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted" /><button className="text-[10px] text-teal">{searching ? '…' : 'Search'}</button></form>} /><div className="panel flex flex-col justify-between gap-5 bg-gradient-to-br from-teal/10 to-transparent p-5 sm:flex-row sm:items-center sm:p-7"><div><p className="eyebrow text-teal">SELECTED FOR YOUR RECENT MOOD</p><h2 className="mt-3 text-2xl">Reading toward <em className="font-display text-teal">calm.</em></h2><p className="mt-2 max-w-xl text-xs leading-5 text-muted">A small shelf for the moments when you want perspective, comfort, or a new way to see the shape of things.</p></div><div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-teal/30 bg-teal/10 text-teal"><BookOpen className="h-7 w-7" /></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{books.slice(0, 6).map((book) => <BookCard key={book.id} book={book} onSelect={() => setSelected(book)} />)}</div>{selected && <Modal onClose={() => setSelected(null)}><div className="flex gap-5"><img src={selected.image_url || fallbackBooks[0].image_url} alt="" className="h-36 w-24 rounded-xl object-cover" /><div><p className="eyebrow text-teal">BOOK DETAIL</p><h2 className="mt-3 text-xl">{selected.title}</h2><p className="mt-1 text-sm text-muted">{selected.author}</p><p className="mt-5 text-xs leading-5 text-muted">{selected.description}</p></div></div><button onClick={() => setSelected(null)} className="button button-primary mt-7 w-full justify-center">Save to my shelf <Plus className="h-4 w-4" /></button></Modal>}</div>
}

function BookCard({ book, onSelect }) {
  return <article className="group cursor-pointer" onClick={onSelect}><div className="book-cover overflow-hidden rounded-2xl border border-white/10 bg-panel"><img src={book.image_url || fallbackBooks[0].image_url} alt="" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent opacity-0 transition group-hover:opacity-100" /><button className="absolute bottom-4 right-4 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-teal text-forest opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></button></div><p className="mt-4 text-sm">{book.title}</p><p className="mt-1 text-xs text-muted">{book.author || 'Unknown author'}</p></article>
}

function Music() {
  const [songs, setSongs] = useState(fallbackSongs)
  const [allSongs, setAllSongs] = useState([])
  const [query, setQuery] = useState('')
  const [playing, setPlaying] = useState(null)
  useEffect(() => { api.songs().then((result) => setAllSongs(result.songs || [])).catch(() => {}) }, [])
  const recommend = async (song) => {
    setPlaying(song)
    try { const result = await api.songRecommendations(song); if (result.recommendations?.length) setSongs(result.recommendations) } catch { /* Keep the mindful mix. */ }
  }
  const suggestions = allSongs.filter((song) => song.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
  return <div className="space-y-9"><PageIntro eyebrow="THE SOUNDSCAPE" title={<>Let the day<br /><em>have a rhythm.</em></>} description="Music for the spaces between — curated around your energy, not an algorithm trying to keep you scrolling." action={<div className="flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-2 text-xs text-teal"><Headphones className="h-3.5 w-3.5" /> Focus · 42 min</div>} /><div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]"><section className="relative overflow-hidden rounded-3xl bg-[#d7f56a] p-7 text-forest sm:p-10"><div className="absolute -right-12 -top-14 h-52 w-52 rounded-full border-[30px] border-forest/10" /><div className="relative"><p className="eyebrow text-forest/60">NOW PLAYING</p><div className="mt-10 flex items-end justify-between"><div><p className="text-3xl font-medium">A gentle beginning</p><p className="mt-2 text-sm text-forest/60">Your morning soundscape</p></div><button onClick={() => setPlaying(playing ? null : songs[0].name)} className="grid h-14 w-14 place-items-center rounded-full bg-forest text-acid">{playing ? <span className="flex gap-1"><i className="h-4 w-0.5 bg-acid" /><i className="h-6 w-0.5 bg-acid" /><i className="h-3 w-0.5 bg-acid" /></span> : <Play className="ml-1 h-5 w-5 fill-current" />}</button></div><div className="mt-10 flex items-end gap-1.5">{[8, 20, 13, 28, 17, 24, 35, 20, 28, 14, 32, 22, 38, 17, 27, 12, 22, 34, 18, 27, 38, 20, 31, 16, 26].map((height, index) => <span key={index} className={`h-${height} w-1 rounded-full ${playing ? 'animate-pulse bg-forest' : 'bg-forest/30'}`} style={{ height: `${height}px`, animationDelay: `${index * 50}ms` }} />)}</div></div></section><section className="panel p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">DISCOVER YOUR NEXT</p><h2 className="mt-2 text-xl">Start with a song</h2></div><Music2 className="h-5 w-5 text-teal" /></div><div className="relative mt-6"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your memory…" className="field pl-10" />{query && suggestions.length > 0 && <div className="absolute left-0 right-0 top-12 z-10 rounded-xl border border-white/10 bg-panel p-2 shadow-xl">{suggestions.map((song) => <button key={song} onClick={() => { recommend(song); setQuery('') }} className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-white/5">{song}</button>)}</div>}</div><div className="mt-6 space-y-2">{songs.slice(0, 3).map((song, index) => <button key={song.name} onClick={() => recommend(song.name)} className="group flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/[0.04]"><span className="w-5 text-center font-mono text-[10px] text-muted">0{index + 1}</span><img src={song.album_cover_url || fallbackSongs[0].album_cover_url} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1"><span className="block text-xs">{song.name}</span><span className="mt-1 block text-[10px] text-muted">{song.artist}</span></span><span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-muted opacity-0 group-hover:opacity-100">{playing === song.name ? <span className="h-2 w-2 rounded-full bg-teal" /> : <Play className="h-3 w-3 fill-current" />}</span></button>)}</div></section></div><section><div className="mb-5"><p className="eyebrow">YOUR MIX</p><h2 className="mt-2 text-xl">Soft edges, open skies</h2></div><div className="grid gap-3 md:grid-cols-3">{songs.map((song) => <button key={`${song.name}-mix`} onClick={() => recommend(song.name)} className="panel group flex items-center gap-3 p-3 text-left"><img src={song.album_cover_url || fallbackSongs[0].album_cover_url} alt="" className="h-14 w-14 rounded-xl object-cover" /><span className="flex-1"><span className="block text-xs">{song.name}</span><span className="mt-1 block text-[10px] text-muted">{song.artist}</span></span><Play className="h-3.5 w-3.5 text-muted group-hover:text-teal" /></button>)}</div></section></div>
}

function Therapists({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [selected, setSelected] = useState(null)
  const [specialization, setSpecialization] = useState('')
  const [booked, setBooked] = useState(false)
  useEffect(() => { api.therapists().then((result) => { if (result.length) setTherapists(result) }).catch(() => {}) }, [])
  const filtered = therapists.filter((therapist) => !specialization || therapist.specializations.some((item) => item.toLowerCase().includes(specialization.toLowerCase())))
  const book = async (event) => {
    event.preventDefault()
    if (!selected) return
    const start = new Date(Date.now() + 86400000)
    start.setHours(10, 0, 0, 0)
    try { await api.bookAppointment({ user_id: user.id, therapist_id: selected._id || selected.id, date: start.toISOString(), start_time: start.toISOString(), end_time: new Date(start.getTime() + 3600000).toISOString(), session_type: 'video', notes: 'Booked from ZenHeaven' }) } catch { /* Demo appointment confirmation. */ }
    setBooked(true)
  }
  return <div className="space-y-9"><PageIntro eyebrow="HUMAN SUPPORT" title={<>You don’t have to<br /><em>hold it alone.</em></>} description="Licensed professionals, available on your terms. A human voice when you’re ready for one." action={<div className="flex items-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4 text-teal" /> Private & secure</div>} /><div className="flex flex-wrap gap-2 border-b border-white/10 pb-5"><button onClick={() => setSpecialization('')} className={`mood-pill ${!specialization ? 'mood-active' : ''}`}>All practitioners</button>{['Anxiety', 'Relationships', 'Grief', 'Mindfulness'].map((item) => <button key={item} onClick={() => setSpecialization(item)} className={`mood-pill ${specialization === item ? 'mood-active' : ''}`}>{item}</button>)}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((therapist) => <article key={therapist._id || therapist.id} className="panel group overflow-hidden"><div className="relative h-48 overflow-hidden bg-panel"><img src={therapist.photo_url || fallbackTherapists[0].photo_url} alt="" className="h-full w-full object-cover object-top opacity-85 transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-panel to-transparent" /><span className="absolute bottom-4 left-4 rounded-full bg-forest/80 px-2.5 py-1 text-[10px] text-teal backdrop-blur"><Star className="mr-1 inline h-3 w-3 fill-current" /> {therapist.rating || '4.8'} · {therapist.experience_years} yrs</span></div><div className="p-5"><h2 className="text-sm">{therapist.name}</h2><p className="mt-1 text-[10px] text-muted">{therapist.languages?.join(' · ')}</p><div className="mt-4 flex flex-wrap gap-1.5">{therapist.specializations.slice(0, 2).map((item) => <span key={item} className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-muted">{item}</span>)}</div><p className="mt-4 line-clamp-2 text-xs leading-5 text-muted">{therapist.bio}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-xs">${therapist.hourly_rate}<span className="font-sans text-[10px] text-muted"> / session</span></span><button onClick={() => { setSelected(therapist); setBooked(false) }} className="button button-small">Meet them <ArrowUpRight className="h-3 w-3" /></button></div></div></article>)}</div>{selected && <Modal onClose={() => setSelected(null)}><div className="flex gap-4"><img src={selected.photo_url || fallbackTherapists[0].photo_url} alt="" className="h-20 w-20 rounded-2xl object-cover object-top" /><div><p className="eyebrow text-teal">A POSSIBLE NEXT STEP</p><h2 className="mt-2 text-xl">{selected.name}</h2><p className="mt-1 text-xs text-muted">{selected.specializations.join(' · ')}</p></div></div>{booked ? <div className="mt-8 rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-teal text-forest"><Check className="h-5 w-5" /></span><h3 className="mt-4 text-sm">Your session is requested</h3><p className="mt-2 text-xs leading-5 text-muted">We’ve held a space for tomorrow at 10:00 AM. You’ll find the details in your appointments.</p><button onClick={() => setSelected(null)} className="button button-outline mt-5 w-full justify-center">Done</button></div> : <form onSubmit={book} className="mt-7"><p className="text-sm leading-6 text-muted">{selected.bio}</p><div className="mt-6 grid grid-cols-2 gap-2"><button type="button" className="rounded-xl border border-teal/50 bg-teal/10 p-3 text-left text-xs"><span className="block text-teal">Tomorrow</span><span className="mt-1 block text-[10px] text-muted">10:00 AM · Video</span></button><button type="button" className="rounded-xl border border-white/10 p-3 text-left text-xs"><span className="block">Thu, Sep 11</span><span className="mt-1 block text-[10px] text-muted">2:30 PM · Video</span></button></div><button className="button button-primary mt-5 w-full justify-center">Request a session <ArrowUpRight className="h-4 w-4" /></button></form>}</Modal>}</div>
}

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user.calm_coins || 1240)
  const [transactions, setTransactions] = useState(fallbackTransactions)
  const [achievements, setAchievements] = useState([])
  const [tab, setTab] = useState('Activity')
  useEffect(() => { Promise.allSettled([api.balance(), api.transactions(), api.achievements()]).then(([balanceResult, transactionResult, achievementResult]) => { if (balanceResult.status === 'fulfilled') setBalance(balanceResult.value.balance); if (transactionResult.status === 'fulfilled' && transactionResult.value.length) setTransactions(transactionResult.value); if (achievementResult.status === 'fulfilled') setAchievements(achievementResult.value) }) }, [])
  return <div className="space-y-9"><PageIntro eyebrow="THE CALM ECONOMY" title={<>Small actions.<br /><em>Real momentum.</em></>} description="Calm coins reward the choices that bring you back to yourself. Earn them by showing up, then spend them on deeper support." action={<button className="button button-outline"><CircleHelp className="h-4 w-4" /> How coins work</button>} /><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><section className="relative overflow-hidden rounded-3xl bg-teal p-7 text-forest sm:p-9"><div className="absolute -right-10 -top-12 h-48 w-48 rounded-full border-[25px] border-forest/10" /><div className="relative"><div className="flex items-center justify-between"><p className="eyebrow text-forest/60">AVAILABLE BALANCE</p><Coins className="h-5 w-5" /></div><p className="mt-9 font-mono text-5xl tracking-[-0.08em]">{balance.toLocaleString()} <span className="text-2xl">✦</span></p><p className="mt-3 text-xs text-forest/60">≈ $12.40 of mindful momentum</p><div className="mt-10 flex gap-2"><button className="button button-dark"><Plus className="h-4 w-4" /> Earn more</button><button className="rounded-xl border border-forest/20 px-4 py-2 text-xs text-forest/70">View rewards</button></div></div></section><section className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">THIS WEEK</p><h2 className="mt-2 text-lg">Your momentum</h2></div><Trophy className="h-5 w-5 text-acid" /></div><div className="mt-7 flex items-center gap-5"><div className="relative grid h-24 w-24 place-items-center rounded-full border-8 border-teal/15"><div className="absolute inset-0 rounded-full border-8 border-transparent border-l-teal border-t-teal" /><div className="text-center"><p className="font-mono text-xl">68%</p><p className="text-[9px] text-muted">complete</p></div></div><div className="space-y-3 text-xs"><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal" />Mindful actions <strong className="ml-2">12</strong></p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-acid" />Coins earned <strong className="ml-2 text-acid">+245</strong></p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-coral" />Current streak <strong className="ml-2">7 days</strong></p></div></div></section></div><section><div className="mb-5 flex gap-5 border-b border-white/10">{['Activity', 'Achievements', 'Rewards'].map((item) => <button key={item} onClick={() => setTab(item)} className={`border-b-2 pb-3 text-xs ${tab === item ? 'border-teal text-ink' : 'border-transparent text-muted'}`}>{item}</button>)}</div>{tab === 'Activity' && <div className="panel divide-y divide-white/10">{transactions.slice(0, 6).map((transaction) => <div key={transaction._id || transaction.transaction_id} className="flex items-center gap-4 p-4 sm:p-5"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${transaction.transaction_type === 'spend' ? 'bg-coral/10 text-coral' : 'bg-teal/10 text-teal'}`}>{transaction.transaction_type === 'spend' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-xs">{transaction.description}</p><p className="mt-1 text-[10px] text-muted">{formatDate(transaction.timestamp)} · {transaction.source}</p></div><span className={`font-mono text-sm ${transaction.transaction_type === 'spend' ? 'text-coral' : 'text-teal'}`}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount} ✦</span></div>)}</div>}{tab === 'Achievements' && <div className="grid gap-3 md:grid-cols-2">{(achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental wellness journey', coins: 50, unlocked: true }, { title: 'Consistent chatter', description: 'Chat for 7 days in a row', coins: 100, unlocked: true }, { title: 'Mood master', description: 'Track mood for 30 days', coins: 200, unlocked: false }, { title: 'Wellness warrior', description: 'Earn 1,000 total coins', coins: 300, unlocked: false }]).map((achievement) => <div key={achievement.title} className={`panel flex items-center gap-4 p-5 ${achievement.unlocked ? '' : 'opacity-60'}`}><span className={`grid h-11 w-11 place-items-center rounded-2xl ${achievement.unlocked ? 'bg-acid/15 text-acid' : 'bg-white/5 text-muted'}`}><Trophy className="h-5 w-5" /></span><div className="flex-1"><p className="text-sm">{achievement.title}</p><p className="mt-1 text-[10px] text-muted">{achievement.description}</p></div><span className="font-mono text-xs text-acid">+{achievement.coins} ✦</span></div>)}</div>}{tab === 'Rewards' && <div className="grid gap-3 md:grid-cols-3"><Reward icon={<Brain />} title="Premium insights" cost="100" /><Reward icon={<Music2 />} title="Custom soundscape" cost="150" /><Reward icon={<Stethoscope />} title="Priority therapist" cost="300" /></div>}</section></div>
}

function Reward({ icon, title, cost }) {
  return <div className="panel p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">{icon}</span><h3 className="mt-5 text-sm">{title}</h3><p className="mt-2 font-mono text-xs text-acid">{cost} ✦</p><button className="button button-outline mt-5 w-full justify-center text-xs">Unlock</button></div>
}

function Modal({ children, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-panel p-6 shadow-2xl sm:p-8"><button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-muted hover:bg-white/5 hover:text-ink"><X className="h-4 w-4" /></button>{children}</div></div>
}

export default App
