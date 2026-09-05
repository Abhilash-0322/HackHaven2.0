import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Bot, Check, ChevronDown,
  CircleDollarSign, Clock3, Code2, Command, Copy, Cpu, Database, ExternalLink, FileText, Gauge,
  GitBranch, Headphones, LayoutDashboard, Lightbulb, LineChart, LockKeyhole, LogIn, LogOut,
  Menu, MessageSquare, Moon, Network, Pause, Play, Plus, Radio, RefreshCw, Search, Send,
  Server, Settings2, ShieldCheck, Sparkles, Terminal, TrendingUp, UserRound, Users, Wallet,
  X, Zap,
} from 'lucide-react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zenheaven_mev_token'
const USER_KEY = 'zenheaven_mev_user'

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || `Request failed (${response.status})`)
  return response.json()
}

const opportunities = [
  { pair: 'WETH / USDC', type: 'backrun', edge: '0.084', gas: '18.4', size: '284.6k', age: '12s', color: 'acid' },
  { pair: 'WBTC / WETH', type: 'arb', edge: '0.071', gas: '24.1', size: '91.2k', age: '19s', color: 'signal' },
  { pair: 'USDC / DAI', type: 'sandwich', edge: '0.043', gas: '12.8', size: '1.84m', age: '26s', color: 'amber' },
  { pair: 'rETH / WETH', type: 'arb', edge: '0.031', gas: '15.7', size: '46.8k', age: '31s', color: 'acid' },
  { pair: 'wstETH / WETH', type: 'liquidation', edge: '0.024', gas: '9.3', size: '18.2k', age: '44s', color: 'signal' },
]
const blocks = [
  { number: '#20,149,382', hash: '0x7f…a82c', txs: 184, mev: '1.82 ETH', status: 'settled' },
  { number: '#20,149,381', hash: '0xb3…91fa', txs: 201, mev: '0.94 ETH', status: 'settled' },
  { number: '#20,149,380', hash: '0x22…ac11', txs: 176, mev: '2.08 ETH', status: 'settled' },
  { number: '#20,149,379', hash: '0x9e…c40b', txs: 193, mev: '0.41 ETH', status: 'settled' },
]
const books = [
  { title: 'Flash Boys 2.0', author: 'Phil Daian et al.', tag: 'research', copy: 'A field guide to front-running, priority gas auctions, and the dark forest.' },
  { title: 'The Infinite Machine', author: 'Camila Russo', tag: 'protocols', copy: 'How a distributed community built the settlement layer we search.' },
  { title: 'The Dark Forest', author: 'Liu Cixin', tag: 'fiction', copy: 'A reminder that every broadcast changes the game theory of the room.' },
  { title: 'Mastering Ethereum', author: 'Andreas M. Antonopoulos', tag: 'systems', copy: 'The reference manual for understanding the machine underneath.' },
]
const therapists = [
  { name: 'Dr. Mina Chen', role: 'Performance psychologist', rate: '$160', available: 'Today · 18:30', tone: 'acid' },
  { name: 'Alex Romero', role: 'Founder & operator coach', rate: '$120', available: 'Tomorrow · 10:00', tone: 'signal' },
  { name: 'Dr. Samira Okafor', role: 'Stress and sleep specialist', rate: '$145', available: 'Thu · 09:30', tone: 'amber' },
]

const AuthContext = createContext(null)
function useAuth() { return useContext(AuthContext) }

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const login = async (values) => {
    try {
      const result = await api('/auth/login', { method: 'POST', body: values })
      if (result.access_token) localStorage.setItem(TOKEN_KEY, result.access_token)
      const next = result.user || { username: values.username, full_name: values.username }
      localStorage.setItem(USER_KEY, JSON.stringify(next)); setUser(next)
    } catch {
      const next = { username: values.username || 'operator', full_name: values.username || 'operator' }
      localStorage.setItem(USER_KEY, JSON.stringify(next)); setUser(next)
    }
  }
  const register = async (values) => {
    try {
      const result = await api('/auth/register', { method: 'POST', body: values })
      if (result.access_token) localStorage.setItem(TOKEN_KEY, result.access_token)
    } catch { /* Demo mode keeps the interface useful when the API is offline. */ }
    const next = { username: values.username, full_name: values.full_name || values.username }
    localStorage.setItem(USER_KEY, JSON.stringify(next)); setUser(next)
  }
  const logout = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null) }
  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Logo() {
  return <Link to="/" className="flex items-center gap-3 text-slate-100"><span className="grid h-8 w-8 place-items-center rounded border border-acid/50 bg-acid/10 text-acid"><span className="font-mono text-sm font-bold">ZH</span></span><span className="font-display text-lg font-bold tracking-tight">zen<span className="text-acid">heaven</span><small className="ml-2 font-mono text-[9px] font-normal text-slate-600">/ MEV</small></span></Link>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-acid text-void hover:bg-[#d2ff7f]',
    secondary: 'border border-line bg-white/[.03] text-slate-300 hover:border-acid/50 hover:text-acid',
    ghost: 'text-slate-500 hover:bg-white/[.04] hover:text-slate-200',
    signal: 'border border-signal/40 bg-signal/10 text-signal hover:bg-signal/20',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 font-mono text-xs font-semibold transition ${styles[variant]} ${className}`} {...props}>{children}</button>
}

function Kicker({ children }) {
  return <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-acid"><span className="h-px w-6 bg-acid" />{children}</p>
}

function Landing() {
  return <div className="terminal-bg scanlines min-h-screen overflow-hidden bg-void text-slate-100">
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10"><Logo /><div className="hidden items-center gap-7 font-mono text-[11px] text-slate-500 md:flex"><a href="#signal" className="hover:text-acid">/ signal</a><a href="#stack" className="hover:text-acid">/ stack</a><a href="#ethos" className="hover:text-acid">/ ethos</a></div><div className="flex items-center gap-2"><Link to="/login" className="hidden px-3 py-2 font-mono text-xs text-slate-400 hover:text-white sm:block">log in</Link><Link to="/register"><Button>launch terminal <ArrowRight size={14} /></Button></Link></div></nav>
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-36 lg:pt-24">
        <div><Kicker>zenheaven / searcher node 01</Kicker><h1 className="max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-[-.06em] sm:text-7xl lg:text-[5.8rem]">Search the<br /><span className="text-acid text-glow">mempool.</span><br /><span className="text-slate-500">stay calm.</span></h1><p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-400">A quiet command center for noisy markets. Surface the edge, simulate the route, and ship only what clears your own risk threshold.</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/dashboard"><Button className="px-5 py-3">open command center <ArrowRight size={15} /></Button></Link><a href="#signal" className="inline-flex items-center gap-2 px-3 py-3 font-mono text-xs text-slate-500 hover:text-acid">read the signal <ChevronDown size={14} /></a></div><div className="mt-12 flex items-center gap-3 font-mono text-[10px] text-slate-600"><span className="pulse-dot h-2 w-2 rounded-full bg-acid" /> network online <span className="text-line">·</span> 12 peers <span className="text-line">·</span> 84ms latency</div></div>
        <TerminalPreview />
      </section>
      <section id="signal" className="border-y border-line bg-[#080c0d]/80"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-10"><div><Kicker>signal / 01</Kicker><h2 className="max-w-md font-display text-4xl font-bold tracking-[-.045em]">The mempool is loud.<br /><span className="text-slate-600">Your edge doesn’t have to be.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">ZenHeaven gives searchers a sharper lens and a slower trigger. Observe first. Act with intent.</p></div><div className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2"><Feature icon={<Radio />} title="Live opportunity feed" copy="Decode swaps, liquidations, and backruns as they enter the queue." /><Feature icon={<Network />} title="Route simulation" copy="Compare paths across builders before you spend a single unit of gas." /><Feature icon={<ShieldCheck />} title="Risk guardrails" copy="Set max gas, slippage, and exposure rules that hold under pressure." /><Feature icon={<Activity />} title="Quiet telemetry" copy="Read your node, win rate, and P&L without a dashboard shouting back." /></div></div></section>
      <section id="stack" className="mx-auto max-w-7xl px-5 py-24 lg:px-10"><div className="grid items-end gap-10 lg:grid-cols-2"><div><Kicker>signal / 02 · the stack</Kicker><h2 className="max-w-xl font-display text-4xl font-bold leading-tight tracking-[-.045em] sm:text-5xl">Built for the space between <span className="text-signal signal-glow">blocks.</span></h2></div><div><p className="max-w-md text-sm leading-loose text-slate-500">One surface for the data plane and the human behind it. Keep the hot path precise and the rest of your day intact.</p><Link to="/register" className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-acid hover:text-white">initialize your node <ArrowRight size={14} /></Link></div></div></section>
      <section id="ethos" className="border-t border-line px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-slate-700 sm:flex-row"><span>© 2025 zenheaven systems</span><span>observe · simulate · settle</span></div></section>
    </main>
  </div>
}

function TerminalPreview() {
  return <div className="relative mx-auto w-full max-w-[530px]"><div className="absolute -inset-8 rounded-full bg-acid/[.04] blur-3xl" /><div className="panel relative rounded shadow-acid"><div className="flex items-center justify-between border-b border-line px-4 py-3"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-danger/80" /><span className="h-2 w-2 rounded-full bg-amber/80" /><span className="h-2 w-2 rounded-full bg-acid/80" /></div><span className="font-mono text-[9px] text-slate-600">zh://mempool/live</span><span className="font-mono text-[9px] text-acid">● LIVE</span></div><div className="space-y-4 p-5 font-mono text-xs"><div className="flex items-center justify-between text-slate-600"><span>BLOCK <span className="text-slate-300">20,149,382</span></span><span>BASE FEE <span className="text-amber">18.4 gwei</span></span></div><div className="h-px bg-line" />{opportunities.slice(0, 4).map((item, index) => <div key={item.pair} className="flex items-center gap-3"><span className="text-slate-700">0{index + 1}</span><span className={`h-1.5 w-1.5 rounded-full ${item.color === 'acid' ? 'bg-acid' : item.color === 'signal' ? 'bg-signal' : 'bg-amber'}`} /><span className="min-w-0 flex-1 truncate text-slate-400">{item.type} <span className="text-slate-200">{item.pair}</span></span><span className={item.color === 'signal' ? 'text-signal' : item.color === 'amber' ? 'text-amber' : 'text-acid'}>+{item.edge}%</span></div>)}<div className="mt-5 border border-acid/20 bg-acid/[.04] p-3"><div className="flex items-center justify-between text-[10px]"><span className="text-acid">BEST OPPORTUNITY</span><span className="text-slate-600">12 seconds ago</span></div><div className="mt-2 flex items-end justify-between"><span className="font-display text-xl font-bold text-slate-100">WETH / USDC</span><span className="font-mono text-lg text-acid">+0.084%</span></div><div className="mt-3 flex items-center justify-between text-[10px] text-slate-500"><span>estimated profit <span className="text-slate-300">0.238 ETH</span></span><span>confidence <span className="text-acid">94%</span></span></div></div><div className="flex items-center gap-2 text-[10px] text-slate-600"><span className="text-acid">$</span> await operator confirmation<span className="blink h-3 w-1.5 bg-acid" /></div></div></div></div>
}

function Feature({ icon: Icon, title, copy }) {
  return <div className="group bg-[#0b0f10] p-6 transition hover:bg-[#101716]"><div className="mb-10 text-acid opacity-80 group-hover:opacity-100">{Icon}</div><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{copy}</p></div>
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (event) => {
    event.preventDefault(); setBusy(true)
    await (isLogin ? login({ username: form.username, password: form.password }) : register(form))
    setBusy(false); navigate('/dashboard')
  }
  return <div className="terminal-bg min-h-screen bg-void text-slate-100"><nav className="mx-auto flex max-w-7xl justify-between px-5 py-6 lg:px-10"><Logo /><Link to="/" className="font-mono text-xs text-slate-500 hover:text-acid">← return to root</Link></nav><main className="mx-auto grid max-w-5xl items-center gap-16 px-5 pb-16 pt-12 lg:grid-cols-[1fr_420px] lg:pt-24"><div className="hidden lg:block"><Kicker>secure access / operator portal</Kicker><h1 className="font-display text-6xl font-bold leading-[.98] tracking-[-.06em]">Make the<br /><span className="text-acid text-glow">quiet</span><br />decision.</h1><p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-500">Your node can be fast without making your whole life feel like a race.</p><div className="mt-10 space-y-3 font-mono text-[11px] text-slate-500"><div className="flex items-center gap-3"><LockKeyhole size={15} className="text-acid" /> encrypted workspace</div><div className="flex items-center gap-3"><ShieldCheck size={15} className="text-signal" /> rules before routes</div></div></div><div className="panel rounded p-7 shadow-acid sm:p-9"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-acid">/ auth/{isLogin ? 'login' : 'register'}</p><h2 className="mt-3 font-display text-3xl font-bold">{isLogin ? 'Welcome back, operator.' : 'Initialize your profile.'}</h2><p className="mt-2 text-sm text-slate-500">{isLogin ? 'Resume from the last settled block.' : 'A command center tuned to your own threshold.'}</p><form onSubmit={submit} className="mt-8 space-y-4">{!isLogin && <Field label="display name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} placeholder="How should the node address you?" />}{!isLogin && <Field label="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="operator@domain.xyz" />}<Field label="username" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="your handle" /><Field label="password" required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" /><Button disabled={busy} className="mt-2 w-full py-3">{busy ? 'authenticating…' : isLogin ? <><LogIn size={14} /> enter terminal</> : <><Zap size={14} /> create workspace</>}</Button></form><p className="mt-6 text-center font-mono text-[10px] text-slate-600">{isLogin ? 'new operator?' : 'already initialized?'} <Link to={isLogin ? '/register' : '/login'} className="text-acid hover:text-white">{isLogin ? 'register' : 'log in'}</Link></p></div></main></div>
}

function Field({ label, ...props }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span><input className="w-full rounded border border-line bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-acid/60 focus:ring-1 focus:ring-acid/20" {...props} /></label>
}

const navItems = [
  { to: '/dashboard', label: 'command center', icon: LayoutDashboard },
  { to: '/chat', label: 'operator log', icon: MessageSquare },
  { to: '/journal', label: 'field notes', icon: FileText },
  { to: '/books', label: 'reading room', icon: BookOpen },
  { to: '/music', label: 'sound system', icon: Headphones },
  { to: '/therapists', label: 'human support', icon: Users },
  { to: '/coins', label: 'calm credits', icon: CircleDollarSign },
]

function AppShell({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const active = navItems.find((item) => location.pathname.startsWith(item.to))
  return <div className="scanlines min-h-screen bg-void text-slate-100"><aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-[#080c0d] px-4 py-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="px-3"><Logo /></div><div className="mt-12 px-3"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-slate-700">workspace / mainnet</p><nav className="mt-4 space-y-1">{navItems.map(({ to, label, icon: Icon }) => <NavLink onClick={() => setOpen(false)} key={to} to={to} className={({ isActive }) => `group flex items-center gap-3 rounded px-3 py-2.5 font-mono text-[11px] transition ${isActive ? 'bg-acid/10 text-acid' : 'text-slate-500 hover:bg-white/[.04] hover:text-slate-200'}`}><Icon size={15} /><span>{label}</span>{location.pathname === to && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-acid pulse-dot" />}</NavLink>)}</nav></div><div className="mt-auto border-t border-line pt-4"><div className="flex items-center gap-3 px-3"><span className="grid h-8 w-8 place-items-center rounded bg-signal/10 font-mono text-xs text-signal">{(user?.full_name || user?.username || 'O')[0].toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs text-slate-300">{user?.full_name || 'guest operator'}</p><p className="truncate font-mono text-[9px] text-slate-600">@{user?.username || 'demo'}</p></div><button onClick={logout} className="text-slate-600 hover:text-danger"><LogOut size={15} /></button></div></div></aside><div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-line bg-void/90 px-5 backdrop-blur-xl lg:px-10"><button onClick={() => setOpen(!open)} className="text-slate-500 lg:hidden"><Menu size={20} /></button><div className="hidden items-center gap-2 font-mono text-[10px] text-slate-600 lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-acid" /> {active?.label || 'command center'} <span className="text-line">/</span> mainnet</div><div className="ml-auto flex items-center gap-4"><div className="hidden items-center gap-2 font-mono text-[10px] text-slate-600 sm:flex"><Server size={13} className="text-acid" /> node 01 <span className="text-acid">healthy</span></div><button className="text-slate-600 hover:text-slate-300"><Settings2 size={16} /></button><span className="h-4 w-px bg-line" /><span className="font-mono text-[10px] text-slate-600">ETH <span className="text-slate-300">$3,842.18</span></span></div></header><main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-10">{children}</main></div></div>
}

function PageTitle({ eyebrow, title, copy, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Kicker>{eyebrow}</Kicker><h1 className="font-display text-4xl font-bold tracking-[-.05em]">{title}</h1>{copy && <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy}</p>}</div>{action}</div>
}

function StatCard({ label, value, detail, icon: Icon, tone = 'acid' }) {
  return <div className="panel panel-hover rounded p-5"><div className="flex items-start justify-between"><span className={`grid h-9 w-9 place-items-center rounded ${tone === 'signal' ? 'bg-signal/10 text-signal' : tone === 'amber' ? 'bg-amber/10 text-amber' : 'bg-acid/10 text-acid'}`}><Icon size={17} /></span><span className="font-mono text-[9px] uppercase tracking-widest text-slate-700">live</span></div><p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-slate-600">{label}</p><p className={`mt-1 font-display text-3xl font-bold ${tone === 'signal' ? 'text-signal' : tone === 'amber' ? 'text-amber' : 'text-slate-100'}`}>{value}</p><p className="mt-1 font-mono text-[10px] text-slate-600">{detail}</p></div>
}

function Dashboard() {
  const [stats, setStats] = useState({ balance: 1240, opportunities: 19 })
  const [paused, setPaused] = useState(false)
  useEffect(() => { api('/coins/balance').then((result) => setStats((current) => ({ ...current, balance: result.balance ?? current.balance }))).catch(() => {}) }, [])
  return <><PageTitle eyebrow="command center / overview" title="Good evening, operator." copy="The chain is moving. Your rules are holding. Here’s the signal." action={<Button onClick={() => setPaused(!paused)} variant={paused ? 'signal' : 'primary'}>{paused ? <Play size={14} /> : <Pause size={14} />} {paused ? 'resume searcher' : 'pause searcher'}</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Searcher status" value={paused ? 'PAUSED' : 'LIVE'} detail={paused ? 'manual hold active' : 'scanning 12,482 tx/s'} icon={Activity} tone={paused ? 'amber' : 'acid'} /><StatCard label="Net captured today" value="+4.82 ETH" detail="+$18,522.40 · 12.4% vs avg" icon={TrendingUp} tone="signal" /><StatCard label="Opportunities" value={stats.opportunities} detail="3 above your threshold" icon={Lightbulb} /><StatCard label="Calm credits" value={stats.balance.toLocaleString()} detail="available to spend" icon={CircleDollarSign} tone="amber" /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><OpportunityPanel /><NodePanel /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><BlocksPanel /><ExecutionLog /></div></>
}

function OpportunityPanel() {
  return <section className="panel rounded"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-acid">opportunity feed</p><h2 className="mt-1 font-display text-xl font-bold">What’s moving now</h2></div><span className="flex items-center gap-2 font-mono text-[10px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-acid pulse-dot" /> streaming</span></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead className="font-mono text-[9px] uppercase tracking-widest text-slate-700"><tr><th className="px-5 py-3 font-normal">pair / type</th><th className="px-3 py-3 font-normal">edge</th><th className="px-3 py-3 font-normal">gas</th><th className="px-3 py-3 font-normal">notional</th><th className="px-3 py-3 font-normal">age</th><th className="px-5 py-3 text-right font-normal">action</th></tr></thead><tbody className="divide-y divide-line/70 font-mono text-xs">{opportunities.map((item) => <tr key={item.pair} className="group hover:bg-white/[.025]"><td className="px-5 py-3"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${item.color === 'acid' ? 'bg-acid' : item.color === 'signal' ? 'bg-signal' : 'bg-amber'}`} /><div><p className="text-slate-200">{item.pair}</p><p className="mt-0.5 text-[9px] uppercase text-slate-700">{item.type}</p></div></div></td><td className="px-3 py-3 text-acid">+{item.edge}%</td><td className="px-3 py-3 text-slate-400">{item.gas} gwei</td><td className="px-3 py-3 text-slate-400">{item.size}</td><td className="px-3 py-3 text-slate-600">{item.age}</td><td className="px-5 py-3 text-right"><button className="text-slate-600 opacity-0 transition hover:text-acid group-hover:opacity-100"><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div><div className="border-t border-line px-5 py-3"><Link to="/chat" className="font-mono text-[10px] text-slate-600 hover:text-acid">open operator log <ArrowRight className="ml-1 inline" size={12} /></Link></div></section>
}

function NodePanel() {
  const metrics = [{ label: 'mempool intake', value: '12,482', suffix: 'tx/s', percent: 72, tone: 'acid' }, { label: 'builder relay', value: '84', suffix: 'ms', percent: 36, tone: 'signal' }, { label: 'rule coverage', value: '98.4', suffix: '%', percent: 98, tone: 'acid' }]
  return <section className="panel rounded p-5"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">node telemetry</p><h2 className="mt-1 font-display text-xl font-bold">Your edge, measured</h2></div><Gauge className="text-signal" size={18} /></div><div className="mt-7 space-y-6">{metrics.map((metric) => <div key={metric.label}><div className="flex items-center justify-between font-mono text-[10px]"><span className="text-slate-500">{metric.label}</span><span className={metric.tone === 'signal' ? 'text-signal' : 'text-acid'}>{metric.value} <span className="text-slate-700">{metric.suffix}</span></span></div><div className="mt-2 h-1 bg-line"><div className={`h-full ${metric.tone === 'signal' ? 'bg-signal' : 'bg-acid'}`} style={{ width: `${metric.percent}%` }} /></div></div>)}</div><div className="mt-8 grid grid-cols-2 gap-2"><div className="border border-line bg-white/[.02] p-3"><p className="font-mono text-[9px] uppercase text-slate-700">uptime</p><p className="mt-1 font-mono text-sm text-slate-300">14d 06h 22m</p></div><div className="border border-line bg-white/[.02] p-3"><p className="font-mono text-[9px] uppercase text-slate-700">last block</p><p className="mt-1 font-mono text-sm text-slate-300">2.4s ago</p></div></div></section>
}

function BlocksPanel() {
  return <section className="panel rounded p-5"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-600">chain state</p><h2 className="mt-1 font-display text-xl font-bold">Recently settled</h2></div><button className="text-slate-600 hover:text-acid"><RefreshCw size={15} /></button></div><div className="mt-5 space-y-2">{blocks.map((block) => <div key={block.number} className="flex items-center gap-3 border-b border-line/70 py-2.5 last:border-0"><span className="font-mono text-xs text-acid">{block.number}</span><span className="font-mono text-[10px] text-slate-600">{block.hash}</span><span className="ml-auto font-mono text-[10px] text-slate-500">{block.txs} txs</span><span className="font-mono text-xs text-signal">{block.mev}</span><span className="rounded bg-acid/10 px-1.5 py-1 font-mono text-[9px] uppercase text-acid">{block.status}</span></div>)}</div></section>
}

function ExecutionLog() {
  const logs = [['20:41:08', 'route simulated', 'WETH/USDC', 'acid'], ['20:40:52', 'bundle submitted', '0x8ca…d12', 'signal'], ['20:40:49', 'risk check passed', 'max gas 24', 'acid'], ['20:40:47', 'opportunity found', '0.084% edge', 'amber']]
  return <section className="panel rounded p-5"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-amber">execution log</p><h2 className="mt-1 font-display text-xl font-bold">Last actions</h2></div><Terminal className="text-amber" size={18} /></div><div className="mt-5 space-y-3 font-mono text-[10px]">{logs.map(([time, action, detail, tone]) => <div key={time} className="flex items-center gap-3"><span className="text-slate-700">{time}</span><span className={`h-1 w-1 rounded-full ${tone === 'acid' ? 'bg-acid' : tone === 'signal' ? 'bg-signal' : 'bg-amber'}`} /><span className="text-slate-400">{action}</span><span className="ml-auto text-slate-600">{detail}</span></div>)}</div><Link to="/journal" className="mt-7 block border-t border-line pt-3 font-mono text-[10px] text-slate-600 hover:text-amber">write a field note <ArrowRight className="ml-1 inline" size={12} /></Link></section>
}

function Chat() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Operator log initialized. What are you seeing in the flow today?' }])
  const [input, setInput] = useState('')
  const send = async (event) => {
    event.preventDefault()
    if (!input.trim()) return
    const text = input.trim(); setInput(''); setMessages((current) => [...current, { role: 'user', text }])
    try {
      const result = await api('/chat', { method: 'POST', body: { message: text } })
      setMessages((current) => [...current, { role: 'assistant', text: result.response || result.message || 'Signal received. Keep the rule set close.' }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'Signal received. Breathe, check the route, and let your guardrails do their job.' }])
    }
  }
  return <><PageTitle eyebrow="operator log / private channel" title="Think out loud." copy="A quiet place to pressure-test a route, a rule, or the state of your own attention." /><div className="panel mx-auto flex min-h-[560px] max-w-4xl flex-col rounded"><div className="flex items-center gap-3 border-b border-line px-5 py-4"><span className="grid h-9 w-9 place-items-center rounded bg-signal/10 text-signal"><Bot size={18} /></span><div><h2 className="font-display font-bold">ZenBot <span className="ml-2 rounded bg-acid/10 px-2 py-1 font-mono text-[9px] uppercase text-acid">ready</span></h2><p className="font-mono text-[9px] text-slate-600">no judgment · no noise</p></div><span className="ml-auto font-mono text-[10px] text-slate-700">session / 0x4f22</span></div><div className="scrollbar flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[78%] rounded px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-acid text-void' : 'border border-line bg-white/[.03] text-slate-300'}`}><span className="mb-2 block font-mono text-[9px] uppercase tracking-widest opacity-50">{message.role === 'user' ? 'you' : 'zenbot'}</span>{message.text}</div></div>)}{!messages.length && <div className="text-center text-slate-600">No entries yet.</div>}</div><form onSubmit={send} className="border-t border-line p-4"><div className="flex items-center gap-3 border border-line bg-black/20 px-4 focus-within:border-acid/50"><span className="font-mono text-acid">$</span><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="type a thought, route, or question…" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-700" /><button className="text-acid hover:text-white"><Send size={16} /></button></div></form></div></>
}

function Journal() {
  const [entries, setEntries] = useState([{ title: 'Block 20,149,382', text: 'Good edge on WETH / USDC. Waited for the second confirmation instead of chasing the first signal.', mood: 'steady', time: 'today · 20:41' }])
  const [text, setText] = useState('')
  const save = () => { if (!text.trim()) return; setEntries((current) => [{ title: 'Untitled field note', text: text.trim(), mood: 'unmapped', time: 'just now' }, ...current]); setText('') }
  return <><PageTitle eyebrow="field notes / context layer" title="Write it down." copy="A durable record of the decisions behind the transactions. Your future self is part of the system." action={<Button onClick={() => document.getElementById('note')?.focus()} variant="secondary"><Plus size={14} /> new note</Button>} /><div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="panel rounded p-6"><div className="flex justify-between"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-acid">new field note</p><span className="font-mono text-[10px] text-slate-700">{text.length} chars</span></div><textarea id="note" value={text} onChange={(event) => setText(event.target.value)} placeholder="What did you notice before the block landed?" className="mt-6 min-h-[280px] w-full resize-none bg-transparent font-display text-2xl leading-relaxed text-slate-200 outline-none placeholder:text-slate-700" /><div className="flex items-center justify-between border-t border-line pt-4"><span className="font-mono text-[10px] text-slate-600">private · local context</span><Button onClick={save} disabled={!text.trim()}><Check size={14} /> save note</Button></div></section><section className="panel rounded p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded bg-amber/10 text-amber"><Sparkles size={17} /></span><div><p className="font-mono text-[10px] uppercase tracking-widest text-amber">operator prompt</p><h2 className="mt-1 font-display text-xl font-bold">Slow is a strategy.</h2></div></div><p className="mt-7 text-sm leading-7 text-slate-400">What would the cleanest version of this trade look like? What would you refuse to sacrifice to capture it?</p><div className="mt-8 border-l border-amber/40 pl-4 font-mono text-[10px] leading-6 text-slate-600">A fast system still needs a human speed limit.</div></section></div><section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-600">archive</p><h2 className="mt-1 font-display text-2xl font-bold">Recent notes</h2></div><span className="font-mono text-[10px] text-slate-700">{entries.length} records</span></div><div className="grid gap-3 md:grid-cols-2">{entries.map((entry, index) => <article key={`${entry.title}-${index}`} className="panel panel-hover rounded p-5"><div className="flex items-center justify-between"><span className="rounded bg-acid/10 px-2 py-1 font-mono text-[9px] uppercase text-acid">{entry.mood}</span><span className="font-mono text-[9px] text-slate-700">{entry.time}</span></div><h3 className="mt-4 font-display font-bold text-slate-200">{entry.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{entry.text}</p></article>)}</div></section></>
}

function Books() {
  const [query, setQuery] = useState('')
  const filtered = books.filter((book) => `${book.title} ${book.author} ${book.tag}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageTitle eyebrow="reading room / mental models" title="Pages between blocks." copy="A small library for people who want to understand the machine and remain human inside it." action={<div className="flex items-center gap-2 border border-line bg-white/[.02] px-3"><Search size={14} className="text-slate-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search titles" className="w-36 bg-transparent py-2.5 font-mono text-[10px] outline-none placeholder:text-slate-700" /></div>} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((book, index) => <article key={book.title} className="panel panel-hover overflow-hidden rounded"><div className={`dot-grid flex h-44 items-end p-5 ${index % 2 === 0 ? 'bg-acid/[.05]' : 'bg-signal/[.05]'}`}><BookOpen className={index % 2 === 0 ? 'text-acid/70' : 'text-signal/70'} size={31} /></div><div className="p-5"><span className="font-mono text-[9px] uppercase tracking-widest text-acid">{book.tag}</span><h2 className="mt-3 font-display text-lg font-bold">{book.title}</h2><p className="mt-1 font-mono text-[10px] text-slate-600">{book.author}</p><p className="mt-4 text-xs leading-relaxed text-slate-500">{book.copy}</p><button className="mt-5 flex items-center gap-2 font-mono text-[10px] text-slate-600 hover:text-acid">open synopsis <ArrowRight size={12} /></button></div></article>)}</div>{!filtered.length && <EmptyState icon={Search} title="No matching pages" copy="Try a different title, author, or subject." />}</>
}

function Music() {
  const [playing, setPlaying] = useState(null)
  const tracks = [{ title: 'settled block', artist: 'zenheaven radio', length: '04:22' }, { title: 'low latency / slow breath', artist: 'operator sessions', length: '06:08' }, { title: 'after the bundle', artist: 'night shift', length: '03:47' }, { title: 'no chase', artist: 'mempool ambient', length: '08:14' }]
  return <><PageTitle eyebrow="sound system / state management" title="A frequency for now." copy="The dashboard can be loud. Your headphones don’t have to be." /><div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><section className="panel rounded p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded bg-signal/10 text-signal"><Headphones size={19} /></span><div><p className="font-display font-bold">operator radio</p><p className="font-mono text-[10px] text-slate-600">curated for deep work</p></div></div><div className="mt-10 flex h-32 items-end gap-1">{Array.from({ length: 34 }, (_, index) => <span key={index} className={`bar flex-1 rounded-t ${index % 3 === 0 ? 'bg-signal' : 'bg-signal/40'}`} style={{ height: `${20 + ((index * 23) % 72)}%`, animationDelay: `${index * 35}ms` }} />)}</div><div className="mt-7 flex items-end justify-between"><div><p className="font-display text-xl font-bold">{playing || 'settled block'}</p><p className="mt-1 font-mono text-[10px] text-slate-600">zenheaven radio · 1 / 4</p></div><Button onClick={() => setPlaying(playing ? null : tracks[0].title)} variant="signal">{playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'pause' : 'play'}</Button></div></section><section className="panel rounded p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">your sequence</p><h2 className="mt-1 font-display text-xl font-bold">Stay in the room.</h2></div><Radio className="text-signal" size={18} /></div><div className="mt-6 space-y-1">{tracks.map((track, index) => <button key={track.title} onClick={() => setPlaying(playing === track.title ? null : track.title)} className={`flex w-full items-center gap-4 border-b border-line p-3 text-left transition last:border-0 hover:bg-white/[.03] ${playing === track.title ? 'text-signal' : ''}`}><span className="font-mono text-[10px] text-slate-700">0{index + 1}</span><span className="grid h-8 w-8 place-items-center rounded bg-signal/10 text-signal">{playing === track.title ? <Pause size={13} /> : <Play size={13} />}</span><span className="flex-1"><span className="block text-sm text-slate-300">{track.title}</span><span className="mt-1 block font-mono text-[9px] text-slate-600">{track.artist}</span></span><span className="font-mono text-[10px] text-slate-700">{track.length}</span></button>)}</div></section></div></>
}

function Therapists() {
  const [booked, setBooked] = useState(false)
  return <><PageTitle eyebrow="human support / offchain care" title="You don’t have to carry it alone." copy="Performance is a whole-system problem. Meet people who understand the hours behind the screen." /><div className="grid gap-4 lg:grid-cols-3">{therapists.map((person) => <article key={person.name} className="panel panel-hover rounded p-5"><div className="flex items-center gap-4"><span className={`grid h-14 w-14 place-items-center rounded-full ${person.tone === 'acid' ? 'bg-acid/10 text-acid' : person.tone === 'signal' ? 'bg-signal/10 text-signal' : 'bg-amber/10 text-amber'}`}><UserRound size={24} /></span><div><h2 className="font-display text-lg font-bold">{person.name}</h2><p className="mt-1 text-xs text-slate-500">{person.role}</p></div></div><div className="mt-6 flex items-center justify-between border-y border-line py-3 font-mono text-[10px]"><span className="text-slate-600">next opening</span><span className="text-slate-300">{person.available}</span></div><div className="mt-4 flex items-center justify-between"><span className="font-mono text-xs text-acid">{person.rate}<span className="text-slate-700"> / session</span></span><Button onClick={() => setBooked(true)} variant="secondary" className="px-3 py-2 text-[10px]">view times <ArrowRight size={12} /></Button></div></article>)}</div><div className="mt-6 border border-signal/20 bg-signal/[.04] p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-signal" size={17} /><div><p className="font-display font-bold text-signal">A note on care</p><p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">ZenHeaven is a support layer, not a replacement for professional mental health care. If you’re in immediate danger, contact local emergency services.</p></div></div></div>{booked && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="panel max-w-sm rounded p-6"><button onClick={() => setBooked(false)} className="float-right text-slate-600 hover:text-white"><X size={17} /></button><Check className="text-acid" size={25} /><h2 className="mt-5 font-display text-2xl font-bold">Request received.</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">A care coordinator will meet you in the operator log to confirm a time.</p><Button onClick={() => setBooked(false)} className="mt-6 w-full">close</Button></div></div>}</>
}

function Coins() {
  const [balance, setBalance] = useState(1240)
  const transactions = [['completed a reflection', '+25', 'today · 20:41'], ['held a risk threshold', '+50', 'today · 18:12'], ['redeemed focus session', '-100', 'yesterday · 09:22'], ['checked in with ZenBot', '+10', 'yesterday · 08:04']]
  return <><PageTitle eyebrow="calm credits / reward the return" title="Make the invisible visible." copy="Credits are a small thank-you for the habits that keep an operator whole." action={<Button onClick={() => setBalance((current) => Math.max(0, current - 100))} variant="secondary"><Wallet size={14} /> redeem 100</Button>} /><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><section className="relative overflow-hidden rounded border border-acid/20 bg-gradient-to-br from-acid/10 via-[#111b15] to-[#0b0f10] p-7"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-acid/10 blur-3xl" /><div className="relative"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-acid">available balance</p><div className="mt-4 flex items-end gap-3"><span className="font-display text-6xl font-bold text-slate-100">{balance.toLocaleString()}</span><CircleDollarSign className="mb-2 text-acid" size={24} /></div><p className="mt-2 font-mono text-[10px] text-slate-600">credits · no expiration</p><div className="mt-10 grid grid-cols-2 gap-3"><div><p className="font-mono text-[9px] uppercase text-slate-600">earned this week</p><p className="mt-1 font-display text-xl font-bold text-slate-200">+185</p></div><div><p className="font-mono text-[9px] uppercase text-slate-600">next unlock</p><p className="mt-1 font-display text-xl font-bold text-slate-200">60 <span className="text-xs text-slate-600">credits</span></p></div></div></div></section><section className="panel rounded p-6"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-amber">daily rhythm</p><h2 className="mt-1 font-display text-2xl font-bold">Keep the signal.</h2><div className="mt-6 space-y-4">{[['check in', true, '+10'], ['write a field note', true, '+25'], ['hold a boundary', false, '+50']].map(([label, done, amount]) => <div key={label} className="flex items-center gap-3"><span className={`grid h-7 w-7 place-items-center rounded ${done ? 'bg-acid text-void' : 'bg-white/[.05] text-slate-600'}`}>{done ? <Check size={13} /> : <Clock3 size={13} />}</span><span className="flex-1 text-xs text-slate-400">{label}</span><span className="font-mono text-[10px] text-acid">{amount}</span></div>)}</div><div className="mt-7 h-1 bg-line"><div className="h-full w-2/3 bg-amber" /></div><p className="mt-2 font-mono text-[9px] text-slate-700">2 / 3 complete · one more small act</p></section></div><section className="panel mt-6 rounded p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-600">credit ledger</p><h2 className="mt-1 font-display text-2xl font-bold">Recent movement.</h2></div><RefreshCw className="text-slate-600" size={16} /></div><div className="mt-5 space-y-1">{transactions.map(([label, amount, time]) => <div key={label} className="flex items-center gap-4 border-b border-line py-3 last:border-0"><span className={`grid h-7 w-7 place-items-center rounded ${amount.startsWith('+') ? 'bg-acid/10 text-acid' : 'bg-danger/10 text-danger'}`}>{amount.startsWith('+') ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}</span><span className="flex-1 text-xs text-slate-400">{label}</span><span className="font-mono text-[10px] text-slate-700">{time}</span><span className={`font-mono text-xs ${amount.startsWith('+') ? 'text-acid' : 'text-danger'}`}>{amount}</span></div>)}</div></section></>
}

function EmptyState({ icon: Icon, title, copy }) {
  return <div className="panel mt-6 rounded border-dashed py-16 text-center"><Icon className="mx-auto mb-3 text-slate-700" size={25} /><p className="font-display text-lg text-slate-400">{title}</p><p className="mt-1 text-xs text-slate-600">{copy}</p></div>
}

function App() {
  return <AuthProvider><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} /><Route path="/chat" element={<AppShell><Chat /></AppShell>} /><Route path="/journal" element={<AppShell><Journal /></AppShell>} /><Route path="/books" element={<AppShell><Books /></AppShell>} /><Route path="/music" element={<AppShell><Music /></AppShell>} /><Route path="/therapists" element={<AppShell><Therapists /></AppShell>} /><Route path="/coins" element={<AppShell><Coins /></AppShell>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>
}

export default App
