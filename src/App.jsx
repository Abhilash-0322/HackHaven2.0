import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Coins,
  Compass,
  Crown,
  Flame,
  Headphones,
  Heart,
  Home,
  Leaf,
  LockKeyhole,
  LogIn,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Music2,
  PenLine,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trophy,
  UserRound,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

const navItems = [
  { label: 'Home base', to: '/dashboard', icon: Home },
  { label: 'Wellness quests', to: '/dashboard', icon: Compass },
  { label: 'AI companion', to: '/chat', icon: Bot },
  { label: 'Journal', to: '/journal', icon: PenLine },
  { label: 'Mindful library', to: '/books', icon: BookOpen },
  { label: 'Sound bath', to: '/music', icon: Music2 },
  { label: 'Find a guide', to: '/therapists', icon: Users },
]

const questData = [
  { icon: Moon, title: 'Check in with yourself', detail: 'Share your mood in the journal', reward: 25, color: 'bg-[#e8f2ee]' },
  { icon: Activity, title: 'Take 3 mindful breaths', detail: 'A tiny reset for a busy moment', reward: 15, color: 'bg-[#fff1dc]' },
  { icon: Headphones, title: 'Listen to a calm track', detail: 'Give your nervous system a minute', reward: 20, color: 'bg-[#e9e9fb]' },
]

const books = [
  { title: 'The Comfort Book', author: 'Matt Haig', tag: 'Gentle perspective', color: 'bg-[#e7f0e7]', accent: '#6f9a70', rating: '4.8' },
  { title: 'Atomic Habits', author: 'James Clear', tag: 'Small steps', color: 'bg-[#fff0d5]', accent: '#c47f38', rating: '4.9' },
  { title: 'Wintering', author: 'Katherine May', tag: 'Rest & resilience', color: 'bg-[#e9e8f5]', accent: '#706eaa', rating: '4.7' },
  { title: 'Maybe You Should Talk to Someone', author: 'Lori Gottlieb', tag: 'Human connection', color: 'bg-[#f8e9df]', accent: '#c9684c', rating: '4.8' },
]

const tracks = [
  { title: 'A soft place to land', artist: 'Mellow Minds', length: '4:12', tone: 'from-[#d8eadf] to-[#8abda5]' },
  { title: 'Tides coming in', artist: 'Sea Glass', length: '3:48', tone: 'from-[#c8e1e8] to-[#75aeba]' },
  { title: 'Golden hour walk', artist: 'Sunday Club', length: '5:02', tone: 'from-[#f7dfae] to-[#e4a56c]' },
  { title: 'Clouds, slowly', artist: 'Nara Bloom', length: '4:36', tone: 'from-[#ddd8ee] to-[#9c92c5]' },
]

const therapists = [
  { name: 'Dr. Maya Chen', role: 'Clinical psychologist', specialty: 'Anxiety & life transitions', availability: 'Today · 4:30 PM', initials: 'MC', color: 'bg-[#d8ebe1]' },
  { name: 'Jordan Williams', role: 'Licensed counselor', specialty: 'Self-esteem & relationships', availability: 'Tomorrow · 10:00 AM', initials: 'JW', color: 'bg-[#f3dfb8]' },
  { name: 'Ari Patel', role: 'Mindfulness coach', specialty: 'Burnout & nervous system care', availability: 'Fri · 2:15 PM', initials: 'AP', color: 'bg-[#dddaf0]' },
]

function Logo({ light = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-ink'}`}>
      <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-coral text-white shadow-sm">
        <Leaf size={20} strokeWidth={2.5} />
      </span>
      <span className="font-display text-[19px] font-bold tracking-[-0.04em]">zenheaven</span>
    </Link>
  )
}

function CoinPill({ amount = 1250, compact = false }) {
  return (
    <Link to="/coins" className={`inline-flex items-center gap-2 rounded-full bg-[#fff1cf] font-bold text-[#8f5c19] transition hover:-translate-y-0.5 ${compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'}`}>
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#efb54e] text-[10px] text-white shadow-inner"><Coins size={12} strokeWidth={3} /></span>
      {amount.toLocaleString()} <span className="font-medium opacity-70">ZEN</span>
    </Link>
  )
}

function AppShell() {
  const [mobileNav, setMobileNav] = useState(false)
  const location = useLocation()
  const isActive = (item) => item.to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.to)

  return (
    <div className="min-h-screen bg-cloud bg-grain text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col border-r border-ink/10 bg-[#f9fbf7]/90 px-5 py-6 backdrop-blur-xl lg:flex">
        <div className="px-2"><Logo /></div>
        <div className="mt-12 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">Your space</div>
        <nav className="mt-3 flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive(item) ? 'bg-ink text-white shadow-lg shadow-ink/10' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'}`}
              >
                <Icon size={17} strokeWidth={isActive(item) ? 2.4 : 2} />
                {item.label}
                {item.label === 'AI companion' && <span className="ml-auto h-2 w-2 rounded-full bg-coral" />}
              </NavLink>
            )
          })}
        </nav>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-ink/50">WEEKLY RANK</span>
            <Trophy size={15} className="text-coral" />
          </div>
          <div className="flex items-end justify-between">
            <div><p className="text-xl font-bold">#12</p><p className="text-[11px] text-ink/50">You&apos;re on a roll</p></div>
            <span className="rounded-full bg-[#e7f4ed] px-2 py-1 text-[10px] font-bold text-ocean">↑ 8 spots</span>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-white">AK</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">Alex Kim</p><p className="text-[11px] text-ink/50">Level 4 · Sunseeker</p></div>
          <Settings size={16} className="text-ink/40" />
        </div>
      </aside>

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-ink/10 bg-[#f9fbf7]/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="rounded-lg p-2 hover:bg-ink/5 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
            <div className="lg:hidden"><Logo /></div>
            <div className="hidden items-center gap-2 text-sm text-ink/45 sm:flex"><span>Saturday, September 5</span><span>·</span><span className="font-semibold text-ocean">A good day to grow</span></div>
          </div>
          <div className="flex items-center gap-3"><CoinPill /><div className="hidden h-8 w-px bg-ink/10 sm:block" /><button className="relative rounded-full p-2 text-ink/60 hover:bg-ink/5"><CircleHelp size={19} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-coral" /></button><div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">AK</div></div>
        </header>
        <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10"><Outlet /></main>
      </div>

      {mobileNav && <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileNav(false)}>
        <aside className="h-full w-[285px] bg-[#f9fbf7] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between"><Logo /><button onClick={() => setMobileNav(false)} className="rounded-lg p-2 hover:bg-ink/5"><X size={20} /></button></div>
          <nav className="mt-12 flex flex-col gap-2">{navItems.map((item) => { const Icon = item.icon; return <NavLink onClick={() => setMobileNav(false)} key={item.label} to={item.to} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive(item) ? 'bg-ink text-white' : 'text-ink/60'}`}><Icon size={18} />{item.label}</NavLink> })}</nav>
        </aside>
      </div>}
    </div>
  )
}

function PublicShell({ children }) {
  return <div className="min-h-screen bg-cloud bg-grain text-ink"><header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10"><Logo /><div className="flex items-center gap-5 text-sm font-semibold text-ink/55"><Link to="/login" className="hover:text-ink">Log in</Link><Link to="/register" className="rounded-full bg-ink px-5 py-2.5 text-white transition hover:-translate-y-0.5 hover:bg-ocean">Start for free <ArrowRight className="ml-1 inline" size={15} /></Link></div></header>{children}</div>
}

function Landing() {
  return <PublicShell><main>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pt-20">
      <div><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-ocean/15 bg-white px-3 py-1.5 text-xs font-bold text-ocean shadow-sm"><Sparkles size={14} className="text-coral" /> A softer way to grow</div><h1 className="max-w-xl font-display text-[clamp(3.4rem,7vw,6.1rem)] font-bold leading-[.94] tracking-[-0.075em]">Your wellbeing,<br /><span className="text-coral">in your hands.</span></h1><p className="mt-7 max-w-lg text-lg leading-8 text-ink/60">Tiny quests. Real support. A little joy along the way. ZenHeaven turns everyday self-care into a journey worth showing up for.</p><div className="mt-9 flex flex-wrap items-center gap-4"><Link to="/register" className="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-ink/15 transition hover:-translate-y-1 hover:bg-ocean">Begin your journey <ArrowRight className="ml-2 inline" size={16} /></Link><Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink"><Play size={15} fill="currentColor" /> Take a peek</Link></div><div className="mt-12 flex items-center gap-4"><div className="flex -space-x-2">{['#ef8354','#84a99c','#efc36b','#8e91c2'].map((color, i) => <span key={color} className="grid h-8 w-8 place-items-center rounded-full border-2 border-cloud text-[10px] font-bold text-white" style={{ backgroundColor: color }}>{['M','S','J','R'][i]}</span>)}</div><p className="text-xs leading-5 text-ink/50"><span className="font-bold text-ink">12,000+ humans</span><br />are making space for themselves</p></div></div>
      <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -right-3 top-8 h-28 w-28 rounded-full bg-butter/70 blur-2xl" /><div className="absolute -bottom-3 left-2 h-32 w-32 rounded-full bg-mint/70 blur-2xl" /><div className="relative overflow-hidden rounded-[36px] bg-ink p-3 shadow-2xl shadow-ink/20"><div className="rounded-[27px] bg-[#e7f2ec] p-5 pb-6"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.18em] text-ocean">Saturday ritual</span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ocean">+60 ZEN</span></div><div className="mt-8 flex items-end justify-between"><div><p className="text-xs font-semibold text-ink/50">Good morning, Alex</p><h2 className="mt-1 text-3xl font-bold tracking-[-.06em]">How are you<br />feeling today?</h2></div><div className="grid h-16 w-16 place-items-center rounded-full border-[6px] border-white bg-[#f5d491] text-center shadow-sm"><span className="text-xl">☀</span></div></div><div className="mt-8 rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0d5] text-coral"><PenLine size={19} /></span><div><p className="text-sm font-bold">Morning check-in</p><p className="text-[11px] text-ink/45">1 minute · daily quest</p></div></div><span className="grid h-7 w-7 place-items-center rounded-full bg-ocean text-white"><Check size={15} /></span></div></div><div className="mt-3 grid grid-cols-3 gap-2">{[['😊','Bright'],['😌','Calm'],['🌱','Growing']].map(([emoji, label]) => <div key={label} className="rounded-2xl bg-white/65 p-3 text-center"><span className="text-2xl">{emoji}</span><p className="mt-1 text-[10px] font-bold text-ink/55">{label}</p></div>)}</div></div></div><div className="absolute -left-9 top-24 hidden -rotate-6 rounded-2xl bg-white px-4 py-3 shadow-xl sm:block"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff0d5] text-coral"><Flame size={15} fill="currentColor" /></span><div><p className="text-[10px] font-bold text-ink/45">CURRENT STREAK</p><p className="text-sm font-bold">7 days ✨</p></div></div></div><div className="absolute -right-7 bottom-16 hidden rotate-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-xl sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-white/55">Level unlocked</p><p className="mt-1 text-sm font-bold">Sunseeker <span className="text-butter">✦</span></p></div></div>
    </section>
    <section className="border-y border-ink/10 bg-white/50 px-6 py-5"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-bold uppercase tracking-[.18em] text-ink/35 sm:justify-between lg:px-10"><span>Built for real life</span><span className="flex items-center gap-2"><ShieldCheck size={15} /> private by design</span><span className="flex items-center gap-2"><Heart size={15} /> human-first support</span><span className="flex items-center gap-2"><Zap size={15} /> tiny wins count</span></div></section>
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[.2em] text-coral">Your everyday toolkit</p><h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-.06em] sm:text-5xl">Care that feels<br /><span className="text-ocean">like you.</span></h2></div><div className="mt-12 grid gap-4 md:grid-cols-3"><FeatureCard icon={Compass} title="Play your way" text="Follow quests that meet you where you are. No perfect streaks required." color="bg-[#e7f2ec]" /><FeatureCard icon={Bot} title="Never alone" text="Chat with your AI companion for a judgment-free moment, day or night." color="bg-[#fff0d5]" /><FeatureCard icon={Users} title="Find your people" text="Explore trusted therapists, thoughtful books, and sounds for every season." color="bg-[#eae8f5]" /></div></section>
  </main></PublicShell>
}

function FeatureCard({ icon: Icon, title, text, color }) { return <div className={`rounded-3xl ${color} p-7 transition hover:-translate-y-1 hover:shadow-card`}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ocean shadow-sm"><Icon size={23} /></span><h3 className="mt-8 text-xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p><Link to="/register" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-ink">Explore <ArrowRight size={14} /></Link></div> }

function AuthPage({ register = false }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const submit = (event) => { event.preventDefault(); navigate('/dashboard') }
  return <PublicShell><main className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10 lg:pt-16"><div className="hidden rounded-[32px] bg-ink p-10 text-white lg:block"><div className="mb-20 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-mint"><Sparkles size={15} /> The gentle internet</div><h1 className="max-w-md text-5xl font-bold leading-[.98] tracking-[-.07em]">Make a little<br /><span className="text-butter">room for you.</span></h1><p className="mt-7 max-w-sm text-sm leading-6 text-white/60">Wellness is not a finish line. It&apos;s the small choices we make, one day at a time.</p><div className="mt-24 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-coral"><Leaf size={19} /></div><p className="text-xs leading-5 text-white/60"><span className="font-bold text-white">Start where you are.</span><br />We&apos;ll meet you there.</p></div></div><div className="mx-auto w-full max-w-md"><div className="mb-9 lg:hidden"><div className="mb-10 h-1 w-12 rounded-full bg-coral" /></div><p className="text-xs font-bold uppercase tracking-[.2em] text-coral">{register ? 'A fresh start' : 'Welcome back'}</p><h1 className="mt-3 text-4xl font-bold tracking-[-.06em]">{register ? 'Let&apos;s grow together.' : 'Good to see you again.'}</h1><p className="mt-3 text-sm text-ink/55">{register ? 'Create your free space in under a minute.' : 'Your little corner of calm is waiting.'}</p><form onSubmit={submit} className="mt-9 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold text-ink/65">EMAIL ADDRESS</span><div className="flex items-center rounded-xl border border-ink/15 bg-white px-3 focus-within:border-ocean"><Mail size={17} className="text-ink/35" /><input required type="email" placeholder="you@example.com" className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink/30" /></div></label>{register && <label className="block"><span className="mb-2 block text-xs font-bold text-ink/65">YOUR NAME</span><div className="flex items-center rounded-xl border border-ink/15 bg-white px-3 focus-within:border-ocean"><UserRound size={17} className="text-ink/35" /><input required placeholder="What should we call you?" className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink/30" /></div></label>}<label className="block"><span className="mb-2 block text-xs font-bold text-ink/65">PASSWORD</span><div className="flex items-center rounded-xl border border-ink/15 bg-white px-3 focus-within:border-ocean"><LockKeyhole size={17} className="text-ink/35" /><input required type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink/30" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-ink/40">{showPassword ? 'Hide' : 'Show'}</button></div></label>{!register && <div className="text-right"><button type="button" className="text-xs font-bold text-ocean">Forgot password?</button></div>}<button className="w-full rounded-xl bg-ink py-3.5 text-sm font-bold text-white transition hover:bg-ocean">{register ? 'Create my space' : 'Enter ZenHeaven'} <ArrowRight className="ml-2 inline" size={16} /></button></form><div className="my-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-ink/30"><span className="h-px flex-1 bg-ink/10" /> or continue with <span className="h-px flex-1 bg-ink/10" /></div><button className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 bg-white py-3 text-sm font-bold"><span className="text-base">G</span> Google</button><p className="mt-8 text-center text-xs text-ink/50">{register ? 'Already have a space?' : 'New to ZenHeaven?'} <Link to={register ? '/login' : '/register'} className="font-bold text-ocean hover:underline">{register ? 'Log in' : 'Create an account'}</Link></p></div></main></PublicShell>
}

function Dashboard() {
  const [completed, setCompleted] = useState([0])
  const finishQuest = (index) => setCompleted((current) => current.includes(index) ? current : [...current, index])
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-ink/50">Saturday, September 5, 2026</p><h1 className="mt-1 text-4xl font-bold tracking-[-.065em] sm:text-5xl">Good morning, Alex <span className="inline-block origin-bottom animate-wave">👋</span></h1><p className="mt-3 text-sm text-ink/50">Here&apos;s a little nudge for your day.</p></div><Link to="/coins" className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white sm:flex"><WalletCards size={15} /> Your wallet <ArrowRight size={14} /></Link></div><div className="mt-9 grid gap-5 xl:grid-cols-[1.55fr_.8fr]"><section className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9"><div className="absolute -right-16 -top-20 h-60 w-60 rounded-full border-[38px] border-white/5" /><div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-coral/20 blur-3xl" /><div className="relative"><div className="flex items-start justify-between"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-mint"><Flame size={13} fill="currentColor" /> 7 day streak</span><h2 className="mt-5 max-w-lg text-3xl font-bold leading-tight tracking-[-.06em] sm:text-4xl">Small steps are<br /><span className="text-butter">still steps forward.</span></h2></div><div className="hidden text-right sm:block"><p className="text-[10px] font-bold uppercase tracking-widest text-white/40">WEEKLY GROWTH</p><p className="mt-1 text-3xl font-bold">68<span className="text-lg text-white/40">%</span></p></div></div><div className="mt-9 max-w-xl"><div className="mb-2 flex justify-between text-[10px] font-bold text-white/50"><span>LEVEL 4 · SUNSEEKER</span><span>680 / 1,000 XP</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-butter" /></div></div><div className="mt-8 flex flex-wrap items-center gap-3"><Link to="/journal" className="rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-butter">Continue today&apos;s quest <ArrowRight className="ml-1 inline" size={14} /></Link><span className="text-xs text-white/45">3 quests waiting for you</span></div></div></section><section className="rounded-[28px] bg-[#e7f2ec] p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-ocean">Your mood garden</p><h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">Growing nicely.</h2></div><span className="text-3xl">🌿</span></div><div className="mt-8 flex items-end gap-1.5">{[35,55,45,70,48,85,65].map((height, index) => <div key={index} className="flex-1"><div className={`rounded-t-full ${index === 5 ? 'bg-coral' : 'bg-ocean/25'}`} style={{ height: `${height}px` }} /><div className="mt-2 text-center text-[9px] font-bold text-ink/35">{['M','T','W','T','F','S','S'][index]}</div></div>)}</div><Link to="/journal" className="mt-6 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2.5 text-xs font-bold text-ocean">View your reflections <ChevronRight size={15} /></Link></section></div><div className="mt-10 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Your daily quests</p><h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">Choose what feels good.</h2></div><Link to="/dashboard" className="hidden items-center gap-1 text-xs font-bold text-ink/50 sm:flex">See all <ArrowRight size={14} /></Link></div><div className="mt-5 grid gap-4 md:grid-cols-3">{questData.map((quest, index) => { const Icon = quest.icon; const done = completed.includes(index); return <div key={quest.title} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"><div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl ${quest.color} text-ocean`}><Icon size={20} /></span><span className="rounded-full bg-[#fff4dc] px-2 py-1 text-[10px] font-bold text-[#9a651d]">+{quest.reward} ZEN</span></div><h3 className="mt-5 text-sm font-bold">{quest.title}</h3><p className="mt-1 text-xs leading-5 text-ink/45">{quest.detail}</p><button onClick={() => finishQuest(index)} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${done ? 'bg-[#e7f2ec] text-ocean' : 'bg-ink text-white hover:bg-ocean'}`}>{done ? <><Check size={14} /> Complete</> : <>Start quest <ArrowRight size={14} /></>}</button></div> })}</div><div className="mt-10 grid gap-4 md:grid-cols-2"><Link to="/chat" className="group flex items-center justify-between rounded-2xl bg-[#fff0d5] p-5 transition hover:shadow-card"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-coral"><Bot size={21} /></span><div><p className="text-sm font-bold">Need a moment?</p><p className="mt-1 text-xs text-ink/50">Your AI companion is here to listen.</p></div></div><ArrowRight size={18} className="text-ink/40 transition group-hover:translate-x-1" /></Link><Link to="/therapists" className="group flex items-center justify-between rounded-2xl bg-[#e9e8f5] p-5 transition hover:shadow-card"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#716eaa]"><Stethoscope size={21} /></span><div><p className="text-sm font-bold">Talk to a human</p><p className="mt-1 text-xs text-ink/50">Find a guide who gets it.</p></div></div><ArrowRight size={18} className="text-ink/40 transition group-hover:translate-x-1" /></Link></div></div>
}

function Chat() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hey Alex, I’m glad you’re here. What’s taking up a little space in your mind today?' }])
  const [draft, setDraft] = useState('')
  const send = (event) => { event.preventDefault(); if (!draft.trim()) return; const text = draft.trim(); setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: 'Thank you for sharing that. You don’t have to solve everything right now — would a tiny next step feel helpful?' }]); setDraft('') }
  return <div className="mx-auto max-w-4xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Your AI companion</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">A little lighter, together.</h1><p className="mt-3 text-sm text-ink/50">A private, judgment-free place to untangle your thoughts.</p></div><div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-soft"><div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#fff0d5] text-coral"><Bot size={20} /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#62b17c]" /></span><div><p className="text-sm font-bold">Moss</p><p className="text-[11px] text-[#62a274]">Online · here to listen</p></div></div><button className="rounded-lg p-2 text-ink/40 hover:bg-ink/5"><CircleHelp size={18} /></button></div><div className="min-h-[420px] space-y-5 bg-[#f9fbf7] p-5 sm:p-8">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`flex items-end gap-2.5 ${message.from === 'user' ? 'justify-end' : ''}`}>{message.from === 'bot' && <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral text-white"><Leaf size={14} /></span>}<div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.from === 'user' ? 'rounded-br-sm bg-ink text-white' : 'rounded-bl-sm bg-white text-ink/75 shadow-sm'}`}>{message.text}</div></div>)}<div className="flex items-center gap-2 text-[11px] font-semibold text-ink/35"><span className="flex gap-0.5"><span className="h-1 w-1 animate-bounce rounded-full bg-ink/30" /><span className="h-1 w-1 animate-bounce rounded-full bg-ink/30 [animation-delay:100ms]" /><span className="h-1 w-1 animate-bounce rounded-full bg-ink/30 [animation-delay:200ms]" /></span> Moss is here with you</div></div><form onSubmit={send} className="flex items-center gap-3 border-t border-ink/10 p-4 sm:p-5"><button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/45 hover:bg-ink/10"><Plus size={18} /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type whatever is on your mind..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35" /><button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white transition hover:bg-ocean" aria-label="Send message"><Send size={17} /></button></form></div><div className="mt-5 flex flex-wrap justify-center gap-2">{['I need a reset', 'Help me name this feeling', 'Give me a breathing exercise'].map((prompt) => <button key={prompt} onClick={() => setDraft(prompt)} className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink/55 hover:border-ocean/30 hover:text-ocean">{prompt}</button>)}</div></div>
}

function Journal() {
  const [mood, setMood] = useState('Calm')
  const [entry, setEntry] = useState('')
  const [saved, setSaved] = useState(false)
  return <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Daily reflection · +25 ZEN</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">How are you arriving today?</h1><p className="mt-3 text-sm text-ink/50">There is no right answer. Just notice what&apos;s here.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-ink/45"><CalendarDays size={16} /> Saturday, Sep 5</div></div><div className="mt-9 grid gap-5 lg:grid-cols-[1.4fr_.75fr]"><section className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-bold text-ink/55">CHOOSE A MOOD</p><div className="mt-4 grid grid-cols-5 gap-2">{[['Heavy','😮‍💨'],['Low','🌧️'],['Okay','🙂'],['Calm','😌'],['Bright','☀️']].map(([label, emoji]) => <button key={label} onClick={() => setMood(label)} className={`rounded-2xl border p-3 text-center transition ${mood === label ? 'border-ocean bg-[#e7f2ec] shadow-sm' : 'border-transparent bg-cloud hover:border-ink/10'}`}><span className="text-2xl">{emoji}</span><p className={`mt-2 text-[10px] font-bold ${mood === label ? 'text-ocean' : 'text-ink/45'}`}>{label}</p></button>)}</div><label className="mt-8 block"><span className="text-xs font-bold text-ink/55">A FEW WORDS, IF YOU&apos;D LIKE</span><textarea value={entry} onChange={(event) => { setEntry(event.target.value); setSaved(false) }} placeholder="What felt true today?" rows="7" className="mt-3 w-full resize-none rounded-2xl border border-ink/10 bg-cloud p-4 text-sm leading-6 outline-none transition placeholder:text-ink/30 focus:border-ocean/40 focus:bg-white" /></label><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-ink/35">{entry.length}/500 characters</span><button onClick={() => setSaved(true)} className={`rounded-xl px-5 py-3 text-xs font-bold text-white transition ${saved ? 'bg-ocean' : 'bg-ink hover:bg-ocean'}`}>{saved ? <><Check className="mr-1 inline" size={14} /> Saved to your garden</> : 'Save reflection'}</button></div></section><aside className="space-y-5"><div className="rounded-[28px] bg-[#e7f2ec] p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-ocean">Your garden</p><h2 className="mt-2 text-2xl font-bold tracking-[-.06em]">14 reflections</h2></div><span className="text-3xl">🌱</span></div><p className="mt-5 text-xs leading-5 text-ink/55">You&apos;ve shown up for yourself <span className="font-bold text-ocean">7 days in a row.</span> That matters.</p><div className="mt-5 flex gap-1.5">{Array.from({ length: 14 }, (_, index) => <span key={index} className={`h-5 flex-1 rounded-md ${index > 10 ? 'bg-ocean/15' : 'bg-ocean/65'}`} />)}</div></div><div className="rounded-[28px] bg-[#fff0d5] p-6"><Sparkles size={20} className="text-coral" /><h3 className="mt-4 text-lg font-bold tracking-[-.04em]">A thought for today</h3><p className="mt-2 text-sm leading-6 text-ink/65">&ldquo;You don&apos;t have to be positive. You just have to be present.&rdquo;</p><p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">— Unknown</p></div></aside></div></div>
}

function Books() {
  const [query, setQuery] = useState('')
  const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author} ${book.tag}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Mindful library</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">A good book can be a companion.</h1><p className="mt-3 text-sm text-ink/50">Thoughtful reads for wherever you are in your story.</p></div><div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5"><Search size={16} className="text-ink/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" className="w-40 bg-transparent text-xs outline-none placeholder:text-ink/35" /></div></div><div className="mt-10 flex items-center gap-2 overflow-x-auto pb-1"><button className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">For your growth</button>{['Anxiety relief','Self-love','Better sleep','Relationships'].map((filter) => <button key={filter} className="whitespace-nowrap rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-bold text-ink/50 hover:text-ink">{filter}</button>)}</div><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visibleBooks.map((book) => <article key={book.title} className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card"><div className={`relative flex h-56 items-end justify-center ${book.color} p-6`}><div className="absolute left-5 top-5 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-ink/55">{book.tag}</div><div className="relative flex h-40 w-28 flex-col justify-between rounded-r-md bg-white p-4 shadow-xl" style={{ borderLeft: `5px solid ${book.accent}` }}><span className="text-[9px] font-bold uppercase tracking-widest text-ink/45">zenheaven<br />reads</span><p className="text-sm font-bold leading-tight tracking-[-.04em]">{book.title}</p><span className="text-[9px] text-ink/45">{book.author}</span></div></div><div className="p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">{book.title}</h2><p className="mt-1 text-xs text-ink/45">{book.author}</p></div><span className="flex items-center gap-1 text-xs font-bold text-[#b47924]"><Star size={13} fill="currentColor" /> {book.rating}</span></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink/5 py-2.5 text-xs font-bold text-ink/70 transition group-hover:bg-ink group-hover:text-white">Add to reading list <Plus size={14} /></button></div></article>)}</div></div>
}

function Music() {
  const [playing, setPlaying] = useState(null)
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Sound bath</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">Press play on a softer day.</h1><p className="mt-3 text-sm text-ink/50">Curated sounds to meet your mood, not change it.</p></div><Link to="/dashboard" className="flex items-center gap-2 self-start rounded-full bg-[#fff0d5] px-4 py-2.5 text-xs font-bold text-[#95611f]"><Headphones size={15} /> +20 ZEN for listening</Link></div><div className="mt-9 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><section className="rounded-[28px] bg-ink p-6 text-white sm:p-8"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-mint"><Music2 size={15} /> Recommended for you</span><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/55">MOOD: CALM</span></div><div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end"><div className="grid h-48 w-48 shrink-0 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#b7d8c3] to-[#477f78] shadow-2xl shadow-black/20"><div className="text-center text-white/80"><div className="mx-auto mb-3 h-16 w-16 rounded-full border border-white/35 bg-white/10 p-2"><div className="h-full w-full rounded-full border border-white/30" /></div><p className="text-[10px] font-bold uppercase tracking-widest">slow down</p></div></div><div><p className="text-xs font-semibold text-white/45">THE DAILY RESET · 12 MIN</p><h2 className="mt-2 text-3xl font-bold tracking-[-.06em]">A soft place<br />to land</h2><p className="mt-3 text-sm text-white/55">Mellow Minds</p><button onClick={() => setPlaying(playing === 0 ? null : 0)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-ink">{playing === 0 ? 'Pause' : 'Play now'} {playing === 0 ? <span>Ⅱ</span> : <Play size={14} fill="currentColor" />}</button></div></div></section><section className="rounded-[28px] bg-[#e7f2ec] p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-ocean">Your sound mood</p><h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">What do you need?</h2></div><span className="text-3xl">🎧</span></div><div className="mt-7 grid grid-cols-2 gap-2">{[['Unwind','🌿'],['Focus','🪴'],['Sleep','🌙'],['Lift me up','☀️']].map(([label, emoji]) => <button key={label} className="rounded-2xl bg-white/75 p-4 text-left transition hover:bg-white"><span className="text-xl">{emoji}</span><p className="mt-3 text-xs font-bold">{label}</p></button>)}</div></section></div><section className="mt-10"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">For your queue</p><h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">Keep the calm going.</h2></div><button className="text-xs font-bold text-ink/45">View all <ArrowRight className="ml-1 inline" size={13} /></button></div><div className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">{tracks.map((track, index) => <div key={track.title} className="flex items-center gap-4 px-4 py-3.5 sm:px-5"><button onClick={() => setPlaying(playing === index + 1 ? null : index + 1)} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${track.tone} text-white`}>{playing === index + 1 ? <span className="text-xs font-bold">Ⅱ</span> : <Play size={16} fill="currentColor" />}</button><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{track.title}</p><p className="mt-0.5 text-xs text-ink/45">{track.artist}</p></div><span className="hidden text-xs text-ink/35 sm:block">{track.length}</span><button className="rounded-lg p-2 text-ink/35 hover:bg-ink/5"><Plus size={17} /></button></div>)}</div></section></div>
}

function Therapists() {
  const [booked, setBooked] = useState(null)
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Find a guide</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">Support that feels human.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-ink/50">You deserve care that meets you with curiosity, warmth, and zero judgment.</p></div><button className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink/60 shadow-sm"><Search size={15} /> Filter guides</button></div><div className="mt-9 rounded-[28px] bg-[#fff0d5] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-coral shadow-sm"><Heart size={25} fill="currentColor" /></span><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#9a651d]">Not sure where to start?</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Take our 2-minute care match.</h2><p className="mt-1 text-xs text-ink/55">We&apos;ll help you find a good first conversation.</p></div></div><button className="rounded-xl bg-ink px-5 py-3 text-xs font-bold text-white hover:bg-ocean">Find my match <ArrowRight className="ml-1 inline" size={14} /></button></div></div><div className="mt-10 grid gap-5 lg:grid-cols-3">{therapists.map((therapist, index) => <article key={therapist.name} className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card"><div className="flex items-start justify-between"><div className={`grid h-16 w-16 place-items-center rounded-2xl ${therapist.color} text-xl font-bold text-ink/60`}>{therapist.initials}</div><span className="flex items-center gap-1 rounded-full bg-[#e7f2ec] px-2.5 py-1 text-[10px] font-bold text-ocean"><span className="h-1.5 w-1.5 rounded-full bg-[#62b17c]" /> Available</span></div><h2 className="mt-5 text-lg font-bold tracking-[-.04em]">{therapist.name}</h2><p className="mt-1 text-xs font-semibold text-ocean">{therapist.role}</p><div className="mt-5 space-y-2 text-xs text-ink/50"><p className="flex items-center gap-2"><Sparkles size={14} className="text-coral" /> {therapist.specialty}</p><p className="flex items-center gap-2"><CalendarDays size={14} className="text-coral" /> Next: {therapist.availability}</p></div><button onClick={() => setBooked(index)} className={`mt-6 w-full rounded-xl py-3 text-xs font-bold transition ${booked === index ? 'bg-[#e7f2ec] text-ocean' : 'bg-ink text-white hover:bg-ocean'}`}>{booked === index ? <><Check className="mr-1 inline" size={14} /> Request sent</> : 'View profile'}</button></article>)}</div></div>
}

function CoinsPage() {
  return <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Your wallet</p><h1 className="mt-2 text-4xl font-bold tracking-[-.07em]">Good energy, earned.</h1><p className="mt-3 text-sm text-ink/50">ZEN celebrates the moments you choose yourself.</p></div><button className="flex items-center gap-2 self-start rounded-full border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink/60"><Settings size={14} /> Wallet settings</button></div><div className="mt-9 grid gap-5 md:grid-cols-[1.2fr_.8fr]"><section className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9"><div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[30px] border-white/5" /><div className="relative"><div className="flex items-start justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/45">Total balance</p><span className="grid h-10 w-10 place-items-center rounded-xl bg-butter text-[#91601f]"><Coins size={20} /></span></div><p className="mt-6 text-5xl font-bold tracking-[-.07em]">1,250 <span className="text-lg text-white/45">ZEN</span></p><p className="mt-2 text-xs text-white/45">≈ $12.50 in ZenHeaven rewards</p><div className="mt-9 flex items-center gap-3"><button className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-ink">Redeem rewards</button><button className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white">Learn more</button></div></div></section><section className="rounded-[28px] bg-[#e7f2ec] p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-ocean">Next milestone</p><div className="mt-5 flex items-center justify-between"><div><p className="text-2xl font-bold tracking-[-.05em]">1,500 ZEN</p><p className="mt-1 text-xs text-ink/50">250 to go</p></div><div className="grid h-14 w-14 place-items-center rounded-full border-4 border-ocean/15 border-t-ocean text-xs font-bold text-ocean">83%</div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-ocean/10"><div className="h-full w-[83%] rounded-full bg-ocean" /></div><p className="mt-5 text-xs leading-5 text-ink/55">Unlock a <span className="font-bold text-ocean">guided sound bath</span> when you reach your next milestone.</p></section></div><section className="mt-10"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Activity</p><h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">Your recent wins.</h2></div><button className="text-xs font-bold text-ink/45">This month <ChevronRight className="ml-1 inline" size={13} /></button></div><div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-white">{[['Morning check-in','Daily quest completed','+25 ZEN','Today · 9:14 AM',PenLine],['7 day streak','Consistency bonus','+100 ZEN','Yesterday',Flame],['A soft place to land','Mindful listening','+20 ZEN','Sep 3',Headphones],['Welcome to level 4','Level up bonus','+250 ZEN','Sep 1',Crown]].map(([title, detail, amount, date, Icon]) => <div key={title} className="flex items-center gap-3 border-b border-ink/10 px-4 py-4 last:border-0 sm:px-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0d5] text-coral"><Icon size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{title}</p><p className="mt-0.5 text-[11px] text-ink/45">{detail} · {date}</p></div><span className="text-sm font-bold text-ocean">{amount}</span></div>)}</div></section></div>
}

function App() {
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route element={<AppShell />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<CoinsPage />} /></Route><Route path="*" element={<Landing />} /></Routes>
}

export default App
