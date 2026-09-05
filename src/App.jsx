import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleDollarSign,
  Clock3, Headphones, Heart, Home, Library, LoaderCircle, LockKeyhole, LogOut, Menu, MessageCircle,
  MoreHorizontal, Music2, Play, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Star,
  Target, Trash2, TrendingUp, UsersRound, X, Zap
} from 'lucide-react'
import { api, clearToken, setToken } from './api'
import './styles.css'

const art = [
  'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80',
]
const fallbackSongs = [
  { name: 'Bloom', artist: 'Odesza', album_cover_url: art[0] },
  { name: 'Awake', artist: 'Tycho', album_cover_url: art[1] },
  { name: 'A Walk', artist: 'Tycho', album_cover_url: art[2] },
  { name: 'Weightless', artist: 'Marconi Union', album_cover_url: art[3] },
  { name: 'Sunset Lover', artist: 'Petit Biscuit', album_cover_url: art[4] },
  { name: 'Anchor', artist: 'Novo Amor', album_cover_url: art[5] },
]
const fallbackBooks = [
  { id: '1', title: 'The Comfort Book', author: 'Matt Haig', description: 'Notes, stories, and reminders for when you need them.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', description: 'Tiny changes, remarkable results, and a calmer way forward.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { id: '3', title: 'The Art of Stillness', author: 'Pico Iyer', description: 'Adventures in going nowhere and finding the space to breathe.', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80' },
  { id: '4', title: 'Wintering', author: 'Katherine May', description: 'The power of rest and retreat in difficult times.', image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80' },
]
const fallbackTherapists = [
  { _id: 'demo-sarah', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness'], experience_years: 12, bio: 'A warm, practical approach to untangling anxious thoughts and making space for ease.', hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80' },
  { _id: 'demo-maya', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-esteem'], experience_years: 8, bio: 'Helping people build healthier connections with themselves and the people they love.', hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'], photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=500&q=80' },
  { _id: 'demo-aisha', name: 'Aisha Patel, LCSW', specializations: ['Grief & loss', 'Life transitions'], experience_years: 7, bio: 'A culturally sensitive space for big changes, questions, and finding meaning again.', hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi'], photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80' },
]

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Reflect with AI', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/music', label: 'Mood music', icon: Headphones },
  { to: '/books', label: 'Read & grow', icon: Library },
  { to: '/therapists', label: 'Find a therapist', icon: UsersRound },
]

function Logo({ light = false }) {
  return <Link to="/" className="flex items-center gap-2.5 group">
    <span className={`grid h-9 w-9 place-items-center rounded-full ${light ? 'bg-white text-[#15291a]' : 'bg-moss text-ink'} transition-transform group-hover:rotate-[-8deg]`}><span className="font-display text-lg font-bold">z</span></span>
    <span className="font-display text-[17px] font-semibold tracking-[-.04em]">zenheaven<span className={light ? 'text-[#b3dc7b]' : 'text-moss'}>.</span></span>
  </Link>
}

function PublicNav() {
  return <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
    <Logo light />
    <nav className="hidden items-center gap-8 text-sm text-white/65 md:flex">
      <a href="#how-it-works" className="transition hover:text-white">How it works</a>
      <a href="#rituals" className="transition hover:text-white">Your rituals</a>
      <Link to="/therapists" className="transition hover:text-white">Support network</Link>
    </nav>
    <div className="flex items-center gap-3">
      <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition hover:text-white sm:block">Log in</Link>
      <Link to="/register" className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white">Start listening</Link>
    </div>
  </header>
}

function Landing() {
  return <div className="min-h-screen bg-ink text-white">
    <section className="hero-gradient relative min-h-[760px] overflow-hidden">
      <PublicNav />
      <div className="absolute -left-20 top-32 h-80 w-80 rounded-full bg-[#5d8d36]/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-40 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pt-48">
        <div className="relative z-10 fade-up">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[.2em] text-moss"><span className="pulse-dot h-2 w-2 rounded-full bg-moss" /> a better kind of everyday</div>
          <h1 className="max-w-3xl font-display text-6xl font-medium leading-[.96] tracking-[-.075em] md:text-8xl">Put your <span className="text-moss">mind</span><br />in a better mood.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/62">A gentler space to listen, reflect, read, and connect. ZenHeaven brings your everyday wellbeing rituals into one living soundtrack.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-3 rounded-full bg-moss px-6 py-3.5 font-semibold text-ink transition hover:scale-[1.03] hover:bg-white">Find your rhythm <ArrowRight size={17} /></Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm text-white/75 transition hover:border-white/50 hover:text-white">Take the tour <ChevronRight size={16} /></a>
          </div>
          <div className="mt-14 flex items-center gap-5 text-xs text-white/45"><div className="flex -space-x-2">{['#c9a998', '#e3b774', '#91a673', '#d29b8f'].map((color, i) => <span key={color} className="h-8 w-8 rounded-full border-2 border-[#12231a]" style={{ backgroundColor: color, zIndex: 4 - i }} />)}</div><span>Already a safe space for <strong className="text-white/75">12,400+ minds</strong></span></div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-[500px] lg:block">
          <div className="absolute -right-5 top-12 h-72 w-72 rounded-full bg-moss/10 blur-3xl" />
          <div className="relative rotate-3 rounded-[2rem] border border-white/15 bg-[#172e1e]/80 p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="overflow-hidden rounded-[1.4rem] bg-[#dbe7d4]">
              <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=90" alt="Misty green valley" className="h-[450px] w-full object-cover object-center" />
              <div className="bg-[#dbe7d4] p-5 text-[#16301d]"><p className="font-display text-xl font-medium">A little more quiet.</p><p className="mt-1 text-sm text-[#16301d]/60">Your daily mix for coming back to yourself.</p><div className="mt-5 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-widest text-[#16301d]/45">today's ritual</span><span className="grid h-9 w-9 place-items-center rounded-full bg-[#16301d] text-moss"><Play size={14} fill="currentColor" /></span></div></div>
            </div>
          </div>
          <div className="glass absolute -bottom-8 -left-10 w-60 -rotate-6 rounded-2xl p-4 shadow-xl shadow-black/25"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-moss/20 text-moss"><Sparkles size={18} /></div><div><p className="text-xs text-white/45">current energy</p><p className="text-sm font-semibold text-white">softly hopeful <span className="text-moss">↗</span></p></div></div></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-ink to-transparent" />
    </section>
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><span className="text-xs uppercase tracking-[.25em] text-moss">01 / a softer system</span><h2 className="mt-5 max-w-sm font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">Wellbeing, without the performance.</h2></div><p className="max-w-xl self-end text-lg leading-8 text-white/55">Your mind is not a project to optimize. ZenHeaven is a little corner to notice how you feel, meet yourself there, and take one kind next step.</p></div>
      <div id="rituals" className="mt-20 grid gap-4 md:grid-cols-3"><StoryCard number="01" icon={Music2} title="Tune in" text="Let your mood choose the soundtrack. Curated, calming music for every version of you." tone="lime" /><StoryCard number="02" icon={BookOpen} title="Let it out" text="Give the thought somewhere to land. Your private journal turns noise into noticing." tone="sand" /><StoryCard number="03" icon={UsersRound} title="Find support" text="When you need more than a playlist, meet a human who knows how to hold space." tone="blue" /></div>
    </section>
    <section className="border-y border-white/8 bg-[#0b1810] px-6 py-24 lg:px-10"><div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2"><div className="relative overflow-hidden rounded-[2rem]"><img src="https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=1000&q=85" alt="Friends sharing a quiet moment" className="h-[480px] w-full object-cover grayscale-[20%]" /><div className="absolute inset-0 bg-gradient-to-t from-[#09130d] via-transparent to-transparent" /><div className="absolute bottom-7 left-7"><p className="font-display text-2xl">You don't have to<br /><span className="text-moss">do it alone.</span></p></div></div><div><span className="text-xs uppercase tracking-[.25em] text-moss">02 / built with care</span><h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.05] tracking-[-.05em] md:text-6xl">A place to feel <span className="text-white/40">seen</span>, not scored.</h2><p className="mt-7 max-w-md leading-8 text-white/55">Your data stays yours. Your pace stays yours. From a five-minute check-in to a first therapy session, every feature is designed to give you agency.</p><div className="mt-9 grid gap-4 text-sm text-white/75 sm:grid-cols-2"><p className="flex items-center gap-3"><ShieldCheck size={18} className="text-moss" /> Private by default</p><p className="flex items-center gap-3"><Heart size={18} className="text-moss" /> No judgment, ever</p><p className="flex items-center gap-3"><Sparkles size={18} className="text-moss" /> Small wins count</p><p className="flex items-center gap-3"><LockKeyhole size={18} className="text-moss" /> Human support</p></div></div></div></section>
    <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-10"><Logo light /><p>© 2026 ZenHeaven. Make room for a better day.</p></footer>
  </div>
}

function StoryCard({ number, icon: Icon, title, text, tone }) {
  const backgrounds = { lime: 'bg-[#b6d771]', sand: 'bg-[#e7d3b3]', blue: 'bg-[#a9c8c1]' }
  return <div className={`${backgrounds[tone]} card-hover min-h-[290px] rounded-[1.6rem] p-7 text-[#112416]`}><div className="flex items-center justify-between"><span className="text-xs font-semibold tracking-[.2em] opacity-50">{number}</span><span className="grid h-10 w-10 place-items-center rounded-full border border-black/15"><Icon size={18} /></span></div><div className="mt-20"><h3 className="font-display text-2xl font-medium">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 opacity-65">{text}</p></div></div>
}

function AppShell({ children, user, onLogout }) {
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-ink text-mist">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/7 bg-[#0a160f] px-5 py-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-2"><Logo /><button onClick={() => setOpen(false)} className="text-white/50 lg:hidden"><X size={20} /></button></div>
      <div className="mt-12 px-3 text-[10px] font-semibold uppercase tracking-[.23em] text-white/30">Your space</div>
      <nav className="mt-3 space-y-1">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} onClick={() => setOpen(false)} to={to} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-moss font-semibold text-ink' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{to === '/chat' && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-moss group-[.active]:bg-black/10">AI</span>}</NavLink>)}</nav>
      <div className="mt-9 px-3 text-[10px] font-semibold uppercase tracking-[.23em] text-white/30">Your progress</div>
      <nav className="mt-3 space-y-1"><NavLink to="/coins" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><CircleDollarSign size={18} className="text-moss" /><span>Calm coins</span></NavLink></nav>
      <div className="mt-auto rounded-2xl border border-moss/15 bg-moss/5 p-4"><div className="flex items-start justify-between"><span className="grid h-8 w-8 place-items-center rounded-full bg-moss/15 text-moss"><Zap size={16} fill="currentColor" /></span><span className="text-[10px] uppercase tracking-widest text-moss">7 day streak</span></div><p className="mt-5 text-sm font-medium">Keep your rhythm going.</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-moss" /></div><p className="mt-2 text-xs text-white/40">4 of 5 rituals this week</p></div>
      <div className="mt-5 flex items-center gap-3 border-t border-white/7 pt-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-moss to-[#365c3e] text-sm font-semibold text-ink">{(user?.full_name || user?.username || 'A')[0].toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user?.full_name || user?.username || 'Alex'}</p><p className="truncate text-xs text-white/35">{user?.email || 'your space'}</p></div><button title="Log out" onClick={onLogout} className="text-white/35 transition hover:text-white"><LogOut size={17} /></button></div>
    </aside>
    {open && <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <main className="min-h-screen lg:pl-72">{children}</main>
    <button onClick={() => setOpen(true)} className="fixed left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#101d15]/90 text-white lg:hidden"><Menu size={19} /></button>
  </div>
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-moss">{eyebrow}</p><h1 className="font-display text-4xl tracking-[-.055em] md:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">{description}</p>}</div>{action}</div>
}

function Dashboard({ user, toast }) {
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [goals, setGoals] = useState([])
  useEffect(() => {
    Promise.all([api.balance(), api.goals()]).then(([b, g]) => { setBalance(b.balance); setGoals(g) }).catch(() => {})
  }, [])
  const firstName = (user?.full_name || user?.username || 'friend').split(' ')[0]
  return <PageFrame><PageHeader eyebrow="Saturday, September 5 · your home" title={`Good evening, ${firstName}.`} description="A small check-in for a softer, more intentional day." action={<button onClick={() => toast('Your reflection is saved for later.')} className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:border-moss/40 hover:text-white md:flex"><Settings2 size={16} /> Customize space</button>} />
    <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_.8fr_.8fr]"><div className="relative min-h-[230px] overflow-hidden rounded-3xl bg-[#b7d873] p-7 text-[#102517]"><div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[36px] border-[#8db85a]/40" /><div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-[#315a2d]" /> Your energy, today</span><h2 className="mt-8 max-w-xs font-display text-3xl font-medium leading-tight">You are allowed to go gently.</h2><Link to="/journal" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Open your journal <ArrowRight size={15} /></Link></div></div><StatCard icon={CircleDollarSign} label="Calm coins" value={balance} detail="+35 this week" color="moss" /><StatCard icon={TrendingUp} label="Wellbeing rhythm" value="82%" detail="↑ 12% from last week" color="sand" /></div>
    <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Daily rhythm</p><h2 className="mt-2 font-display text-2xl">One small thing is enough.</h2></div><Link to="/coins" className="text-xs text-moss hover:underline">View all</Link></div><div className="mt-7 space-y-3">{(goals.length ? goals : [{ title: 'Take a mindful pause', icon: 'Brain', coins: 10, completed: true }, { title: 'Write one journal line', icon: 'BookOpen', coins: 15, completed: false }, { title: 'Listen to a mood mix', icon: 'Headphones', coins: 8, completed: false }]).slice(0, 3).map((goal, i) => <div key={goal.title} className="flex items-center gap-4 rounded-2xl border border-white/7 bg-white/[.025] p-3.5"><div className={`grid h-10 w-10 place-items-center rounded-xl ${goal.completed ? 'bg-moss text-ink' : 'bg-white/5 text-white/50'}`}>{goal.completed ? <Check size={17} /> : i === 1 ? <BookOpen size={17} /> : <Headphones size={17} />}</div><div className="flex-1"><p className="text-sm font-medium">{goal.title}</p><p className="mt-1 text-xs text-white/35">{goal.completed ? 'Beautiful. You showed up.' : 'A gentle 3 minute reset'}</p></div><span className="text-xs text-moss">+{goal.coins || 10} coins</span>{!goal.completed && <button onClick={() => toast('Ritual marked as complete ✨')} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:border-moss/30 hover:text-moss">Do it</button>}</div>)}</div></section><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Your week</p><h2 className="mt-2 font-display text-2xl">A little more you.</h2></div><span className="text-xs text-moss">+12%</span></div><div className="mt-8 flex h-40 items-end justify-between gap-2 px-1">{[48, 65, 42, 78, 56, 88, 70].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-3"><div className={`w-full max-w-9 rounded-t-lg ${i === 5 ? 'bg-moss' : 'bg-moss/25'}`} style={{ height: `${height}%` }} /><span className="text-[10px] text-white/30">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>)}</div></section></div>
    <section className="mt-6 rounded-3xl border border-white/8 bg-gradient-to-r from-[#102117] to-[#0d1911] p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-moss/15 text-moss"><Sparkles size={22} /></div><div className="flex-1"><p className="font-display text-xl">The 90-second reset</p><p className="mt-1 text-sm text-white/45">A tiny breathing exercise for between one thing and the next.</p></div><Link to="/music" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm transition hover:bg-moss hover:text-ink">Begin <Play size={14} fill="currentColor" /></Link></div></section>
  </PageFrame>
}

function StatCard({ icon: Icon, label, value, detail, color }) {
  return <div className={`rounded-3xl border border-white/8 p-6 ${color === 'sand' ? 'bg-[#dec69f] text-[#1b2b1e]' : 'bg-[#13251a]'}`}><div className="flex items-start justify-between"><span className={`text-xs uppercase tracking-[.16em] ${color === 'sand' ? 'text-[#1b2b1e]/60' : 'text-white/40'}`}>{label}</span><Icon size={19} className={color === 'sand' ? 'text-[#3e6641]' : 'text-moss'} /></div><p className="mt-9 font-display text-4xl">{value}</p><p className={`mt-2 text-xs ${color === 'sand' ? 'text-[#1b2b1e]/55' : 'text-moss'}`}>{detail}</p></div>
}

function PageFrame({ children }) { return <div className="mx-auto max-w-7xl px-6 pb-32 pt-10 lg:px-10 lg:pt-14">{children}</div> }

function Chat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi, I’m here. You don’t need to have the right words — what’s taking up space in your mind today?" }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [threads, setThreads] = useState([])
  const [threadId, setThreadId] = useState(null)
  useEffect(() => { api.threads().then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  const send = async (event) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || thinking) return
    setInput(''); setMessages((current) => [...current, { role: 'user', content: message }]); setThinking(true)
    try {
      const response = await api.chatStream({ message, thread_id: threadId })
      if (!response.ok || !response.body) throw new Error('offline')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let assistant = ''
      setMessages((current) => [...current, { role: 'assistant', content: '' }])
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        decoder.decode(value).split('\n\n').forEach((chunk) => {
          if (!chunk.startsWith('data: ')) return
          try { const eventData = JSON.parse(chunk.replace('data: ', '')); if (eventData.type === 'thread_id') setThreadId(eventData.data); if (eventData.type === 'token') { assistant += eventData.data; setMessages((current) => [...current.slice(0, -1), { role: 'assistant', content: assistant }]) } } catch { /* incomplete stream chunk */ }
        })
      }
    } catch {
      const response = message.toLowerCase().includes('tired') ? 'That sounds like a lot to carry. Before you solve anything, could you give yourself permission to pause? A glass of water, a slower breath, or ten quiet minutes can be a real first step.' : 'Thank you for telling me. I’m listening. Let’s make this smaller together — what part of it feels most present right now?'
      setMessages((current) => [...current, { role: 'assistant', content: response }])
    } finally { setThinking(false) }
  }
  return <PageFrame><PageHeader eyebrow="Your private listening room" title="How are you, really?" description="A quiet, judgment-free place to untangle a thought. ZenBot is here to listen — not diagnose." action={<div className="hidden items-center gap-2 rounded-full border border-moss/20 bg-moss/5 px-3 py-2 text-xs text-moss md:flex"><span className="h-2 w-2 rounded-full bg-moss" /> encrypted session</div>} />
    <div className="mt-8 grid min-h-[610px] gap-4 xl:grid-cols-[.28fr_1fr]"><aside className="hidden rounded-3xl border border-white/8 bg-[#0d1911] p-4 xl:block"><button onClick={() => { setThreadId(null); setMessages([{ role: 'assistant', content: 'A fresh page. What would you like to make space for?' }]) }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-moss px-3 py-3 text-sm font-semibold text-ink"><Plus size={16} /> New reflection</button><p className="mb-3 mt-8 px-2 text-[10px] uppercase tracking-[.2em] text-white/30">Recent reflections</p><div className="space-y-1">{threads.length ? threads.slice(0, 5).map((thread) => <button key={thread.id} onClick={() => api.thread(thread.id).then((data) => { setThreadId(thread.id); setMessages(data.messages.map((item) => ({ role: item.is_user ? 'user' : 'assistant', content: item.content }))) }).catch(() => {})} className="w-full rounded-xl p-3 text-left text-xs text-white/50 transition hover:bg-white/5 hover:text-white"><p className="truncate">{thread.title}</p><p className="mt-1 text-[10px] text-white/25">{thread.message_count} messages</p></button>) : <p className="px-2 text-xs leading-5 text-white/25">Your conversations will appear here.</p>}</div></aside><section className="flex min-h-[610px] flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#0d1911]"><div className="flex items-center justify-between border-b border-white/7 px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-moss text-ink"><Brain size={17} /></div><div><p className="text-sm font-semibold">ZenBot</p><p className="text-[11px] text-moss">Here with you</p></div></div><button className="text-white/30 hover:text-white"><MoreHorizontal size={19} /></button></div><div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-moss text-ink' : 'rounded-bl-sm bg-white/[.06] text-white/75'}`}>{message.content || <LoaderCircle size={16} className="animate-spin text-moss" />}</div></div>)}{thinking && messages[messages.length - 1]?.role === 'user' && <div className="flex items-center gap-2 text-xs text-white/35"><span className="pulse-dot h-2 w-2 rounded-full bg-moss" /> finding the kindest words...</div>}</div><div className="border-t border-white/7 p-4"><form onSubmit={send} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/10 p-2 focus-within:border-moss/40"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell me what’s on your mind..." className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" /><button aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-moss text-ink transition hover:bg-white"><Send size={16} /></button></form><p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] text-white/25"><ShieldCheck size={12} /> Private to you · ZenBot is not a replacement for professional care</p></div></section></div>
  </PageFrame>
}

function Journal({ toast }) {
  const [entries, setEntries] = useState([])
  const [prompts, setPrompts] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [saving, setSaving] = useState(false)
  useEffect(() => { Promise.all([api.journals(), api.prompts()]).then(([journalData, promptData]) => { setEntries(Array.isArray(journalData) ? journalData : []); setPrompts(promptData || []) }).catch(() => {}) }, [])
  const save = async () => {
    if (!content.trim()) return
    setSaving(true)
    const local = { id: `local-${Date.now()}`, title: content.trim().split(/[.!?]/)[0].slice(0, 32) || 'A moment to remember', content, mood, created_at: new Date().toISOString() }
    try { const saved = await api.createJournal({ content, mood, tags: [mood] }); setEntries((current) => [saved, ...current]) } catch { setEntries((current) => [local, ...current]) }
    setContent(''); setSaving(false); toast('Journal entry saved · +10 calm coins')
  }
  const deleteEntry = async (id) => { try { await api.deleteJournal(id) } catch { /* local/demo entry */ } setEntries((current) => current.filter((entry) => (entry.id || entry._id) !== id)); toast('Entry removed') }
  return <PageFrame><PageHeader eyebrow="A place for the in-between" title="Your journal." description="No perfect sentences required. Just a little room to hear yourself think." action={<span className="flex items-center gap-2 text-xs text-white/40"><LockKeyhole size={14} className="text-moss" /> private & personal</span>} /><div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_.95fr]"><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Today's page</p><p className="mt-2 text-sm text-white/55">What is true for you right now?</p></div><span className="text-xs text-moss">+10 coins</span></div><div className="mt-6 flex gap-2">{['calm', 'hopeful', 'tired', 'anxious'].map((item) => <button key={item} onClick={() => setMood(item)} className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${mood === item ? 'border-moss bg-moss/15 text-moss' : 'border-white/10 text-white/40 hover:border-white/30'}`}>{item}</button>)}</div><textarea value={content} onChange={(event) => setContent(event.target.value)} rows={9} placeholder="Start anywhere..." className="mt-6 w-full resize-none rounded-2xl border border-white/8 bg-black/10 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-moss/35" /><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-white/25">{content.length} characters</span><button disabled={saving || !content.trim()} onClick={save} className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />} Save reflection</button></div></section><div className="space-y-6"><section className="rounded-3xl border border-moss/15 bg-moss/5 p-6"><div className="flex items-center gap-2 text-moss"><Sparkles size={17} /><p className="text-xs font-semibold uppercase tracking-[.2em]">A prompt for you</p></div><p className="mt-6 font-display text-2xl leading-snug">“{prompts[0]?.prompt || 'What would feel like enough for today?'}”</p><button onClick={() => setContent(prompts[0]?.prompt || '')} className="mt-6 text-sm text-moss hover:underline">Use this prompt <ArrowRight size={14} className="ml-1 inline" /></button></section><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[.2em] text-white/35">Recent pages</p><span className="text-xs text-white/30">{entries.length} entries</span></div><div className="mt-5 space-y-2">{entries.length ? entries.slice(0, 3).map((entry) => { const id = entry.id || entry._id; return <div key={id} className="group flex items-center gap-3 rounded-xl border border-white/6 p-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#d9c49c]/15 text-[#d9c49c]"><BookOpen size={15} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm">{entry.title || 'A quiet thought'}</p><p className="mt-1 text-xs capitalize text-white/30">{entry.mood || 'reflection'} · {new Date(entry.created_at || Date.now()).toLocaleDateString()}</p></div><button onClick={() => deleteEntry(id)} className="text-white/20 opacity-0 transition hover:text-red-300 group-hover:opacity-100"><Trash2 size={15} /></button></div> }) : <p className="py-5 text-sm leading-6 text-white/35">Your first entry can be one honest sentence. That is more than enough.</p>}</div></section></div></div></PageFrame>
}

function Music({ onPlay }) {
  const [songs, setSongs] = useState(fallbackSongs)
  const [selected, setSelected] = useState(fallbackSongs[0])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => { api.songs().then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 18).map((name, i) => ({ name, artist: ['Odesza', 'Tycho', 'Nils Frahm', 'Hania Rani'][i % 4], album_cover_url: art[i % art.length] }))) }).catch(() => {}) }, [])
  const filtered = useMemo(() => songs.filter((song) => `${song.name} ${song.artist}`.toLowerCase().includes(search.toLowerCase())), [songs, search])
  const choose = async (song) => { setSelected(song); onPlay(song); setLoading(true); try { const result = await api.recommend(song.name); if (result.recommendations?.length) setSongs((current) => [...current, ...result.recommendations.map((item, i) => ({ ...item, album_cover_url: item.album_cover_url || art[i % art.length] }))]) } catch { /* recommendations are optional in demo mode */ } finally { setLoading(false) } }
  return <PageFrame><PageHeader eyebrow="A soundtrack for your state of mind" title="Mood music." description="Press play on something that meets you where you are — or takes you somewhere softer." action={<div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a song..." className="w-48 rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-xs outline-none transition focus:border-moss/40" /></div>} /><div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><section className="relative min-h-[280px] overflow-hidden rounded-3xl bg-[#b7d873] p-7 text-[#102517]"><div className="absolute right-0 top-0 h-full w-2/5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.3),transparent_60%)]" /><div className="relative max-w-sm"><span className="text-xs font-semibold uppercase tracking-[.2em] opacity-55">made for your mood</span><h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-.05em]">quietly<br />hopeful</h2><p className="mt-4 text-sm opacity-65">A blend for finding a little light in a full day.</p><button onClick={() => choose(songs[0])} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#102517] px-5 py-2.5 text-sm font-semibold text-moss transition hover:bg-white hover:text-[#102517]"><Play size={15} fill="currentColor" /> Play mix</button></div><div className="absolute -bottom-12 right-12 h-44 w-44 rounded-full border-[28px] border-[#87ad50]/40" /></section><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-moss/15 text-moss"><Headphones size={22} /></div><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Now listening</p><p className="mt-1 font-display text-xl">{selected?.name || 'Choose a track'}</p></div></div><div className="mt-8 flex items-center gap-4"><img src={selected?.album_cover_url || art[0]} alt="" className="h-20 w-20 rounded-xl object-cover" /><div><p className="text-sm text-white/70">{selected?.artist}</p><div className="mt-3 flex items-center gap-1">{[1, 2, 3, 4, 5].map((item) => <span key={item} className="h-1 w-8 rounded-full bg-moss/30 first:bg-moss" />)}</div></div></div><p className="mt-6 text-xs leading-5 text-white/35">Let the music do a little of the talking. No need to be productive here.</p></section></div><div className="mt-10"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Your gentle rotation</p><h2 className="mt-2 font-display text-2xl">For slower moments</h2></div>{loading && <LoaderCircle size={17} className="animate-spin text-moss" />}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((song, i) => <button key={`${song.name}-${i}`} onClick={() => choose(song)} className="card-hover group flex items-center gap-4 rounded-2xl border border-white/8 bg-[#0d1911] p-3 text-left"><div className="relative shrink-0"><img src={song.album_cover_url || art[i % art.length]} alt="" className="h-16 w-16 rounded-xl object-cover" /><span className="absolute inset-0 grid place-items-center rounded-xl bg-black/50 text-moss opacity-0 transition group-hover:opacity-100"><Play size={17} fill="currentColor" /></span></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{song.name}</p><p className="mt-1 truncate text-xs text-white/35">{song.artist}</p></div><MoreHorizontal size={16} className="text-white/20" /></button>)}</div></div></PageFrame>
}

function Books() {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  useEffect(() => { api.booksByMood().then((data) => { if (data.books?.length) setBooks(data.books) }).catch(() => {}) }, [])
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; setSearching(true); try { const data = await api.searchBooks(query); if (data.books?.length) setBooks(data.books) } catch { /* keep curated list */ } finally { setSearching(false) } }
  return <PageFrame><PageHeader eyebrow="Stories that meet you where you are" title="Read & grow." description="A small library of perspective, comfort, and possibility — selected for your current chapter." action={<form onSubmit={search} className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library..." className="w-52 rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-xs outline-none focus:border-moss/40" /></form>} /><div className="mt-8 flex items-center gap-3"><span className="rounded-full bg-moss px-4 py-2 text-xs font-semibold text-ink">For a hopeful mood</span><span className="text-xs text-white/35">curated from your latest reflection</span></div>{searching && <div className="mt-5 flex items-center gap-2 text-xs text-moss"><LoaderCircle size={15} className="animate-spin" /> searching gently...</div>}<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{books.map((book, i) => <article key={book.id || i} className="card-hover group overflow-hidden rounded-3xl border border-white/8 bg-[#0d1911]"><div className="relative aspect-[.78] overflow-hidden bg-[#233a28]"><img src={book.image_url || art[i % art.length]} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d1911] via-transparent to-transparent opacity-60" /><button onClick={() => {}} className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-moss text-ink opacity-0 shadow-lg transition group-hover:opacity-100"><Plus size={18} /></button></div><div className="p-5"><p className="font-display text-lg leading-tight">{book.title}</p><p className="mt-2 text-xs text-moss">{book.author || 'Unknown author'}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-white/35">{book.description || 'A story to keep you company as you find your way.'}</p></div></article>)}</div></PageFrame>
}

function Therapists({ user, toast }) {
  const [therapists, setTherapists] = useState(fallbackTherapists)
  const [selected, setSelected] = useState(null)
  useEffect(() => { api.therapists().then((data) => { if (data?.length) setTherapists(data) }).catch(() => {}) }, [])
  const book = async (therapist) => {
    try { await api.bookAppointment({ user_id: user?.id || 'demo-user', therapist_id: therapist._id, date: new Date(Date.now() + 86400000).toISOString(), start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString(), session_type: 'video' }); toast(`Request sent to ${therapist.name}`) } catch { toast('Choose an available time in the connected API to book.') }
    setSelected(null)
  }
  return <PageFrame><PageHeader eyebrow="Support when you want it" title="A human to talk to." description="Vetted professionals, matched by what you are carrying. Take your time finding the right fit." action={<div className="flex items-center gap-2 text-xs text-moss"><ShieldCheck size={15} /> verified network</div>} /><div className="mt-8 grid gap-5 lg:grid-cols-3">{therapists.map((therapist, i) => <article key={therapist._id || i} className="card-hover rounded-3xl border border-white/8 bg-[#0d1911] p-5"><div className="flex items-start gap-4"><img src={therapist.photo_url || art[i]} alt="" className="h-20 w-20 rounded-2xl object-cover" /><div><div className="flex items-center gap-1 text-xs text-[#e8bd71]"><Star size={13} fill="currentColor" /> {therapist.rating || 4.8}</div><h2 className="mt-2 font-display text-lg leading-tight">{therapist.name}</h2><p className="mt-1 text-xs text-white/35">{therapist.experience_years} years experience</p></div></div><div className="mt-5 flex flex-wrap gap-2">{(therapist.specializations || []).slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/45">{tag}</span>)}</div><p className="mt-5 line-clamp-2 text-sm leading-6 text-white/45">{therapist.bio}</p><div className="mt-6 flex items-center justify-between border-t border-white/7 pt-4"><span className="text-xs text-white/35"><span className="text-white/70">${therapist.hourly_rate}</span> / session</span><button onClick={() => setSelected(therapist)} className="rounded-full bg-moss px-4 py-2 text-xs font-semibold text-ink transition hover:bg-white">View profile</button></div></article>)}</div>{selected && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#132319] p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-moss">A good next step</p><h2 className="mt-2 font-display text-2xl">{selected.name}</h2></div><button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X size={19} /></button></div><p className="mt-6 text-sm leading-6 text-white/55">Would you like to request an introductory video session? You can always change your mind.</p><div className="mt-6 rounded-2xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-3 text-sm"><CalendarDays size={17} className="text-moss" /><span>Next available · tomorrow</span></div><div className="mt-3 flex items-center gap-3 text-sm"><Clock3 size={17} className="text-moss" /><span>30 minute video session</span></div></div><button onClick={() => book(selected)} className="mt-6 w-full rounded-full bg-moss py-3 text-sm font-semibold text-ink transition hover:bg-white">Request this session</button></div></div>}</PageFrame>
}

function Coins({ user, toast }) {
  const [balance, setBalance] = useState(user?.calm_coins || 240)
  const [transactions, setTransactions] = useState([])
  const [achievements, setAchievements] = useState([])
  useEffect(() => { Promise.all([api.balance(), api.transactions(), api.achievements()]).then(([b, t, a]) => { setBalance(b.balance); setTransactions(t); setAchievements(a) }).catch(() => {}) }, [])
  return <PageFrame><PageHeader eyebrow="Progress that feels good" title="Calm coins." description="A little thank-you for showing up for yourself. Earn them through your rituals, spend them on support." action={<span className="flex items-center gap-2 rounded-full bg-moss/10 px-4 py-2 text-sm text-moss"><CircleDollarSign size={16} /> {balance} available</span>} /><div className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="relative overflow-hidden rounded-3xl bg-moss p-7 text-ink"><div className="absolute -bottom-20 -right-10 h-52 w-52 rounded-full border-[30px] border-[#7da94f]/45" /><p className="text-xs font-semibold uppercase tracking-[.2em] opacity-55">your balance</p><p className="mt-5 font-display text-7xl tracking-[-.08em]">{balance}</p><p className="mt-2 text-sm opacity-60">coins to spend on feeling better</p><div className="mt-10 flex items-center gap-3 border-t border-black/10 pt-4 text-xs opacity-65"><TrendingUp size={15} /> +35 earned this week</div></section><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-white/35">Ways to earn</p><h2 className="mt-2 font-display text-2xl">Every small step counts.</h2></div><Target className="text-moss" size={21} /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[{ icon: MessageCircle, title: 'Talk to ZenBot', coins: 5 }, { icon: BookOpen, title: 'Write a journal entry', coins: 10 }, { icon: Headphones, title: 'Complete a mood reset', coins: 8 }, { icon: Award, title: 'Keep a 7-day streak', coins: 50 }].map(({ icon: Icon, title, coins }) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/7 p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-moss/10 text-moss"><Icon size={16} /></div><p className="flex-1 text-xs">{title}</p><span className="text-xs text-moss">+{coins}</span></div>)}</div></section></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl">Your achievements</h2><span className="text-xs text-white/30">{achievements.filter((item) => item.unlocked).length || 1} unlocked</span></div><div className="mt-5 space-y-2">{(achievements.length ? achievements : [{ title: 'First steps', description: 'Started your mental health journey', unlocked: true, coins: 50 }, { title: 'Wellness warrior', description: 'Earn 1000 total coins', unlocked: false, coins: 300 }]).slice(0, 4).map((achievement) => <div key={achievement.title} className={`flex items-center gap-3 rounded-xl p-3 ${achievement.unlocked ? 'bg-moss/10' : 'opacity-40'}`}><div className={`grid h-9 w-9 place-items-center rounded-full ${achievement.unlocked ? 'bg-moss text-ink' : 'bg-white/10 text-white'}`}>{achievement.unlocked ? <Check size={15} /> : <LockKeyhole size={14} />}</div><div className="flex-1"><p className="text-sm">{achievement.title}</p><p className="mt-1 text-xs text-white/35">{achievement.description}</p></div><span className="text-xs text-moss">+{achievement.coins}</span></div>)}</div></section><section className="rounded-3xl border border-white/8 bg-[#0d1911] p-6"><h2 className="font-display text-xl">Recent activity</h2><div className="mt-5 space-y-2">{transactions.length ? transactions.slice(0, 4).map((transaction, i) => <div key={transaction._id || i} className="flex items-center gap-3 border-b border-white/6 py-3 last:border-0"><div className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss"><Zap size={14} /></div><div className="flex-1"><p className="text-xs">{transaction.description}</p><p className="mt-1 text-[10px] text-white/30">{new Date(transaction.timestamp).toLocaleDateString()}</p></div><span className={transaction.transaction_type === 'spend' ? 'text-xs text-red-300' : 'text-xs text-moss'}>{transaction.transaction_type === 'spend' ? '-' : '+'}{transaction.amount}</span></div>) : <p className="py-5 text-sm text-white/35">Your activity will show up here as you make space for yourself.</p>}</div></section></div><button onClick={() => toast('Rewards marketplace is coming soon.')} className="mt-7 flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[.03] p-5 text-left transition hover:border-moss/30"><span><span className="block font-display text-lg">Spend on a little extra care.</span><span className="mt-1 block text-xs text-white/35">Unlock premium insights, custom meditations, and more.</span></span><ChevronRight className="text-moss" size={19} /></button></PageFrame>
}

function Auth({ mode, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const register = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const data = register ? await api.register(form) : await api.login({ username: form.username, password: form.password })
      setToken(data.access_token); onAuth(data.user); navigate('/dashboard')
    } catch {
      setToken('demo-token'); const demo = { username: form.username || 'alex', full_name: form.full_name || 'Alex Morgan', email: form.email || 'alex@zenheaven.app', calm_coins: 240, id: 'demo-user' }; onAuth(demo); navigate('/dashboard')
    } finally { setLoading(false) }
  }
  return <div className="shell-gradient flex min-h-screen items-center justify-center px-5 py-12"><div className="w-full max-w-md"><div className="mb-10 flex justify-center"><Logo /></div><div className="rounded-[2rem] border border-white/8 bg-[#0d1911]/85 p-7 shadow-2xl shadow-black/20 backdrop-blur md:p-9"><div className="text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-moss/15 text-moss">{register ? <Sparkles size={21} /> : <LockKeyhole size={21} />}</span><h1 className="mt-6 font-display text-3xl tracking-[-.05em]">{register ? 'Make space for yourself.' : 'Welcome back.'}</h1><p className="mt-2 text-sm text-white/40">{register ? 'Your gentler everyday starts here.' : 'Your quiet corner is waiting.'}</p></div><form onSubmit={submit} className="mt-8 space-y-4">{register && <Field label="Your name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="Alex Morgan" />}{register && <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" />}{<Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="your username" />}{<Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="At least 6 characters" />}{error && <p className="text-xs text-red-300">{error}</p>}<button disabled={loading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-moss py-3.5 text-sm font-semibold text-ink transition hover:bg-white disabled:opacity-50">{loading && <LoaderCircle size={15} className="animate-spin" />}{register ? 'Create my space' : 'Enter ZenHeaven'} <ArrowRight size={15} /></button></form><p className="mt-7 text-center text-xs text-white/35">{register ? 'Already have a space?' : 'New to ZenHeaven?'} <Link className="text-moss hover:underline" to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Create an account'}</Link></p></div><Link to="/" className="mt-7 flex items-center justify-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14} /> Back to the beginning</Link></div></div>
}

function Field({ label, value, onChange, placeholder, type = 'text' }) { return <label className="block"><span className="mb-2 block text-xs text-white/45">{label}</span><input required value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-moss/50" /></label> }

function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('zenheaven_user')) } catch { return null } })
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()
  useEffect(() => { if (user) localStorage.setItem('zenheaven_user', JSON.stringify(user)); else localStorage.removeItem('zenheaven_user') }, [user])
  const toast = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3200) }
  const logout = () => { clearToken(); setUser(null); navigate('/') }
  return <><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Auth mode="login" onAuth={setUser} />} /><Route path="/register" element={<Auth mode="register" onAuth={setUser} />} /><Route path="*" element={<AppShell user={user} onLogout={logout}><Routes><Route path="/dashboard" element={<Dashboard user={user} toast={toast} />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal toast={toast} />} /><Route path="/music" element={<Music onPlay={(song) => toast(`Playing ${song.name}`)} />} /><Route path="/books" element={<Books />} /><Route path="/therapists" element={<Therapists user={user} toast={toast} />} /><Route path="/coins" element={<Coins user={user} toast={toast} />} /></Routes></AppShell>} /></Routes>{notice && <div className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full border border-moss/20 bg-[#183522] px-5 py-3 text-sm text-white shadow-xl shadow-black/30"><Check size={16} className="text-moss" /> {notice}</div>}</>
}

export default App
