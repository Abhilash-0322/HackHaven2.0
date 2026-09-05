import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowRight, Award, BookMarked, BookOpen, Brain, CalendarDays,
  Check, ChevronDown, ChevronRight, CircleDollarSign, Clock3, Feather, Flower2, Gift,
  Headphones, Heart, HeartHandshake, Home, Leaf, Library, LogIn, LogOut, Menu, MessageCircle,
  Music2, NotebookPen, Play, Plus, Quote, Search, Send, ShieldCheck, Sparkles, Star, Sun, Sunrise,
  Timer, TrendingUp, UserRound, UsersRound, X, Zap,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = async (path, options = {}) => {
  const token = localStorage.getItem('zenheaven_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) throw new Error(await response.text() || 'Something went wrong')
  return response.json()
}

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: Home },
  { path: '/chat', label: 'CalmBot', icon: MessageCircle, badge: 'AI' },
  { path: '/journal', label: 'Journal', icon: NotebookPen },
  { path: '/books', label: 'Reading nook', icon: BookOpen },
  { path: '/music', label: 'Sound garden', icon: Music2 },
  { path: '/therapists', label: 'Find support', icon: HeartHandshake },
  { path: '/coins', label: 'Calm coins', icon: CircleDollarSign },
]

const mockThreads = [
  { id: 'welcome', title: 'A softer start to the week', last_message: 'Finding a little more space to breathe...', message_count: 4 },
  { id: 'sleep', title: 'Making room for better sleep', last_message: 'Your evening ritual can be simple.', message_count: 8 },
]

const mockBooks = [
  { id: 'book-1', title: 'The Comfort Book', author: 'Matt Haig', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80', description: 'A collection of notes, lists and stories for difficult days.' },
  { id: 'book-2', title: 'Wintering', author: 'Katherine May', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', description: 'The quiet art of rest and retreat in difficult times.' },
  { id: 'book-3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80', description: 'Wisdom from the natural world, told with warmth and grace.' },
  { id: 'book-4', title: 'The Book of Delights', author: 'Ross Gay', image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80', description: 'Small, bright observations that make life feel more alive.' },
]

const mockTherapists = [
  { _id: 't-1', name: 'Dr. Sarah Johnson', specializations: ['Anxiety', 'Mindfulness', 'Stress Management'], experience_years: 12, education: 'Ph.D. in Clinical Psychology, Stanford University', bio: 'A warm, practical therapist who combines CBT with mindfulness to help you feel more steady.', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80', hourly_rate: 120, rating: 4.8, languages: ['English', 'Spanish'] },
  { _id: 't-2', name: 'Maya Rodriguez, LMFT', specializations: ['Relationships', 'Self-Esteem', 'Life Transitions'], experience_years: 8, education: 'M.S. in Marriage and Family Therapy, NYU', bio: 'Maya creates an affirming space to untangle relationship patterns and reconnect with yourself.', photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80', hourly_rate: 100, rating: 4.9, languages: ['English', 'Spanish'] },
  { _id: 't-3', name: 'Aisha Patel, LCSW', specializations: ['Grief & Loss', 'Cultural Identity', 'Transitions'], experience_years: 7, education: 'MSW, University of Chicago', bio: 'Aisha offers culturally sensitive care for the seasons of life that ask us to change.', photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80', hourly_rate: 95, rating: 4.8, languages: ['English', 'Hindi', 'Gujarati'] },
]

const moods = [
  { label: 'Peaceful', icon: '☁️', tone: 'bg-sage/15 text-forest' },
  { label: 'A little tender', icon: '🌱', tone: 'bg-blush/60 text-[#805d56]' },
  { label: 'Hopeful', icon: '☀️', tone: 'bg-[#f6e7be] text-[#806125]' },
  { label: 'Restless', icon: '🌊', tone: 'bg-[#d9e8e9] text-[#41676b]' },
]

const fallbackReply = (message) => {
  const lower = message.toLowerCase()
  if (lower.includes('sleep')) return 'It makes sense that rest feels hard when your mind is carrying a lot. Tonight, try choosing one tiny cue for your body—dim the lights, put your phone away, and take five slow breaths without asking yourself to fall asleep. You only need to practice being here.'
  if (lower.includes('anxious') || lower.includes('anxiety')) return 'I hear how much uncertainty is sitting with you right now. Try naming five things you can see, four you can feel, and one kind thing you could do for yourself in the next ten minutes. Small anchors count.'
  return 'Thank you for sharing that with me. You do not have to solve everything at once—let us make a little room around what you are feeling. What part of this feels heaviest today?'
}

function Logo({ compact = false }) {
  return <div className="flex items-center gap-2.5">
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-cream shadow-soft">
      <Leaf size={20} strokeWidth={1.8} />
    </span>
    {!compact && <span className="font-display text-xl font-semibold tracking-tight text-ink">ZenHeaven</span>}
  </div>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-forest text-white shadow-[0_10px_24px_rgba(49,92,75,.2)] hover:-translate-y-0.5 hover:bg-[#264c3e]',
    secondary: 'border border-forest/20 bg-white/70 text-forest hover:bg-white',
    ghost: 'text-forest hover:bg-forest/8',
    cream: 'bg-cream text-forest hover:bg-white',
    dark: 'bg-ink text-white hover:bg-forest',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`} {...props}>{children}</button>
}

function Pill({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full bg-forest/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-forest ${className}`}>{children}</span>
}

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zenheaven_user') || 'null'))
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const enterDemo = () => {
    const demo = { id: 'demo', username: 'you', full_name: 'Riya', email: 'hello@zenheaven.app', calm_coins: 240 }
    localStorage.setItem('zenheaven_user', JSON.stringify(demo))
    setUser(demo)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
    navigate('/')
  }

  if (path === '/login' || path === '/register') return <AuthPage mode={path.slice(1)} onNavigate={navigate} onAuth={(nextUser, token) => { if (token) localStorage.setItem('zenheaven_token', token); localStorage.setItem('zenheaven_user', JSON.stringify(nextUser)); setUser(nextUser); navigate('/dashboard') }} />
  if (path === '/') return <Landing onNavigate={navigate} onDemo={enterDemo} />

  const page = path === '/dashboard' ? <Dashboard user={user} onNavigate={navigate} /> :
    path === '/chat' ? <ChatPage user={user} onNavigate={navigate} /> :
      path === '/journal' ? <JournalPage /> :
        path === '/books' ? <BooksPage /> :
          path === '/music' ? <MusicPage /> :
            path === '/therapists' ? <TherapistsPage user={user} /> :
              path === '/coins' ? <CoinsPage user={user} /> :
                <Dashboard user={user} onNavigate={navigate} />

  return <AppShell path={path} user={user} onNavigate={navigate} onLogout={logout} menuOpen={menuOpen} setMenuOpen={setMenuOpen}>{page}</AppShell>
}

function Landing({ onNavigate, onDemo }) {
  return <div className="min-h-screen overflow-hidden bg-[#f8f6ef] text-ink">
    <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#d9e8d9]/70 blur-3xl" />
    <div className="absolute right-[-8rem] top-[26rem] h-[28rem] w-[28rem] rounded-full bg-[#eedfd1]/70 blur-3xl" />
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <Logo />
      <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
        <a href="#rituals">Your rituals</a><a href="#care">Care, your way</a><a href="#story">Our approach</a>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => onNavigate('/login')}>Sign in</Button>
        <Button onClick={() => onNavigate('/register')}>Begin gently <ArrowRight size={16} /></Button>
      </div>
    </header>
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.02fr_.98fr] lg:px-10 lg:pb-32 lg:pt-20">
        <div className="max-w-xl">
          <Pill><Sparkles size={13} /> A softer place to land</Pill>
          <h1 className="mt-7 font-display text-5xl leading-[1.06] tracking-[-.045em] text-ink sm:text-6xl lg:text-[76px]">Come back to <em className="text-forest">yourself.</em></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-ink/65">A little daily support for your inner world. Talk it out, write it down, find your rhythm, and take the next kind step.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={onDemo}>Explore ZenHeaven <ArrowRight size={17} /></Button>
            <button className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-forest hover:bg-white/70" onClick={() => onNavigate('/register')}><Play size={15} fill="currentColor" /> See how it works</button>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm text-ink/55">
            <div className="flex -space-x-2">{['#b5c7b1', '#e4c6bc', '#c9d8db', '#d8c59e'].map((c, i) => <span key={i} style={{ backgroundColor: c }} className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f8f6ef] text-xs font-bold text-forest">{['R', 'J', 'M', 'S'][i]}</span>)}</div>
            <span>Loved by 2,000+ gentle humans</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="nature-orb absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#d8e6d2]/80 blur-2xl" />
          <div className="hero-art relative aspect-[.9] overflow-hidden rounded-[3rem] bg-[#d9e5d6] shadow-card">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.3),transparent_48%),linear-gradient(330deg,#a9c5b3,#dbe7d4_62%,#f5e5ce)]" />
            <div className="leaf-shape leaf-one" /><div className="leaf-shape leaf-two" /><div className="leaf-shape leaf-three" />
            <div className="absolute inset-x-8 bottom-8 rounded-[2rem] border border-white/50 bg-white/55 p-5 shadow-soft backdrop-blur-md">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-forest/65">Today’s invitation</p><p className="mt-2 font-display text-2xl text-ink">Notice what is here.</p></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f2dcbf] text-[#8f6a38]"><Sunrise size={21} /></span></div>
              <div className="mt-5 flex items-center gap-2 text-sm text-ink/60"><span className="h-1.5 w-1.5 rounded-full bg-forest" /> 4 min gentle practice <span className="ml-auto"><ArrowRight size={15} /></span></div>
            </div>
            <div className="absolute right-9 top-10 grid h-14 w-14 place-items-center rounded-full bg-white/55 text-forest shadow-soft backdrop-blur"><Flower2 size={25} /></div>
          </div>
          <div className="absolute -left-8 bottom-16 hidden rounded-2xl bg-white/80 px-4 py-3 shadow-soft backdrop-blur sm:block"><div className="flex items-center gap-2 text-sm font-semibold text-forest"><Heart size={15} fill="#9ab59b" /> Your calm is worth tending.</div></div>
        </div>
      </section>
      <section id="rituals" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="rounded-[2.5rem] bg-forest px-7 py-10 text-cream sm:px-12 sm:py-14"><div className="max-w-xl"><Pill className="bg-white/10 text-[#d9ead6]">A gentle toolkit</Pill><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Small rituals. <span className="text-[#c2dbc2]">Real shifts.</span></h2></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['01', 'Talk it out', 'A thoughtful AI companion, whenever you need a little space.', MessageCircle], ['02', 'Put it on paper', 'A private journal to meet your feelings with curiosity.', NotebookPen], ['03', 'Find your rhythm', 'Soundscapes and reading for the season you are in.', Music2], ['04', 'Feel supported', 'Connect with a licensed therapist who gets it.', HeartHandshake]].map(([num, title, copy, Icon]) => <div key={title} className="rounded-3xl border border-white/10 bg-white/6 p-5 transition hover:bg-white/10"><span className="text-xs text-[#c2dbc2]/70">{num}</span><Icon className="mt-8 text-[#c2dbc2]" size={21} strokeWidth={1.6} /><h3 className="mt-4 font-display text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-cream/60">{copy}</p></div>)}</div></div>
      </section>
      <section id="care" className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:items-center lg:px-10"><div className="overflow-hidden rounded-[2.5rem] bg-[#eaded0] p-10"><div className="mx-auto max-w-sm rounded-[2rem] bg-[#f8f6ef] p-5 shadow-soft"><div className="flex items-center justify-between"><span className="font-semibold text-ink">How are you feeling?</span><span className="text-xs text-ink/40">Today</span></div><div className="mt-6 space-y-3">{moods.slice(0, 3).map((mood) => <div key={mood.label} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${mood.tone}`}><span className="text-lg">{mood.icon}</span><span className="text-sm font-semibold">{mood.label}</span><span className="ml-auto text-xs opacity-50">check in</span></div>)}</div></div></div><div><Pill><Leaf size={13} /> Meet yourself where you are</Pill><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Wellbeing isn’t a checklist.</h2><p className="mt-5 max-w-lg text-base leading-8 text-ink/60">Some days need a conversation. Some days need a walk, a page, or a quiet song. ZenHeaven helps you choose support that feels right for today.</p><div className="mt-7 grid grid-cols-2 gap-4 text-sm text-ink/70"><div className="flex gap-2"><Check size={17} className="mt-0.5 text-forest" /> No perfect streaks</div><div className="flex gap-2"><Check size={17} className="mt-0.5 text-forest" /> Your pace, always</div><div className="flex gap-2"><Check size={17} className="mt-0.5 text-forest" /> Private by design</div><div className="flex gap-2"><Check size={17} className="mt-0.5 text-forest" /> Support, not pressure</div></div></div></section>
      <section id="story" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10"><div className="rounded-[2.5rem] bg-[#e0e9df] px-7 py-12 text-center sm:px-16"><Quote className="mx-auto text-forest/50" size={28} /><p className="mx-auto mt-5 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl">“You don’t have to be fearless. You just have to be willing to take one kind step.”</p><p className="mt-5 text-sm font-semibold uppercase tracking-[.15em] text-forest/60">The ZenHeaven approach</p></div></section>
    </main>
    <footer className="relative z-10 border-t border-ink/8 px-6 py-8 text-center text-sm text-ink/45">Made for the days you need a little more softness. <span className="font-semibold text-forest">ZenHeaven © 2025</span></footer>
  </div>
}

function AuthPage({ mode, onNavigate, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isRegister = mode === 'register'
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      const data = await api(`/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(isRegister ? form : { username: form.username, password: form.password }) })
      onAuth(data.user, data.access_token)
    } catch {
      const demo = { id: 'demo', username: form.username || 'you', full_name: form.full_name || 'Riya', email: form.email || 'hello@zenheaven.app', calm_coins: isRegister ? 100 : 240 }
      onAuth(demo, null)
    } finally { setBusy(false) }
  }
  return <div className="min-h-screen bg-[#f8f6ef] px-6 py-6 text-ink"><header className="mx-auto flex max-w-7xl items-center justify-between"><button onClick={() => onNavigate('/')}><Logo /></button><button onClick={() => onNavigate(isRegister ? '/login' : '/register')} className="text-sm font-semibold text-forest">{isRegister ? 'Already have an account?' : 'New here?'} <span className="underline">{isRegister ? 'Sign in' : 'Begin gently'}</span></button></header><main className="mx-auto grid max-w-5xl items-center gap-12 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-24"><div className="hidden lg:block"><Pill><Leaf size={13} /> A softer place to land</Pill><h1 className="mt-6 max-w-md font-display text-6xl leading-[1.05]">Your inner world deserves <em className="text-forest">room.</em></h1><p className="mt-6 max-w-md leading-7 text-ink/60">Come as you are. We’ll meet you there with small tools for a steadier, kinder day.</p><div className="mt-8 flex items-center gap-3 text-sm text-ink/55"><ShieldCheck size={18} className="text-forest" /> Your reflections stay yours.</div></div><div className="rounded-[2.5rem] bg-white/80 p-7 shadow-card sm:p-11"><div className="mx-auto max-w-md"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#dfebdf] text-forest"><Sunrise size={25} /></div><h2 className="mt-7 font-display text-4xl">{isRegister ? 'Start where you are.' : 'Welcome back.'}</h2><p className="mt-3 text-ink/55">{isRegister ? 'A few details, then a little more breathing room.' : 'Your calm corner has been waiting for you.'}</p><form onSubmit={submit} className="mt-8 space-y-4">{isRegister && <Field label="What should we call you?" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />}{isRegister && <Field label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />}{<Field label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="your-quiet-corner" />}{<Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />}{error && <p className="text-sm text-red-600">{error}</p>}<Button className="mt-2 w-full" disabled={busy}>{busy ? 'Making space...' : isRegister ? 'Create my space' : 'Enter ZenHeaven'} <ArrowRight size={16} /></Button></form><p className="mt-6 text-center text-xs leading-5 text-ink/40">By continuing, you agree to care for yourself with patience. That’s the only rule here.</p></div></div></main></div>
}

function Field({ label, ...props }) {
  return <label className="block text-sm font-semibold text-ink/75">{label}<input className="mt-2 w-full rounded-2xl border border-ink/10 bg-[#fafaf7] px-4 py-3.5 font-normal outline-none transition placeholder:text-ink/30 focus:border-forest/50 focus:ring-4 focus:ring-forest/10" required {...props} /></label>
}

function AppShell({ children, path, user, onNavigate, onLogout, menuOpen, setMenuOpen }) {
  return <div className="min-h-screen bg-[#f8f6ef] text-ink"><aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r border-ink/8 bg-[#f8f6ef] px-5 py-6 transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-2"><button onClick={() => onNavigate('/dashboard')}><Logo /></button><button className="lg:hidden" onClick={() => setMenuOpen(false)}><X size={19} /></button></div><div className="mt-12 px-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink/35">Your space</p><nav className="mt-4 space-y-1">{navItems.map(({ path: itemPath, label, icon: Icon, badge }) => <button key={itemPath} onClick={() => onNavigate(itemPath)} className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${path === itemPath ? 'bg-forest text-white shadow-soft' : 'text-ink/55 hover:bg-forest/8 hover:text-forest'}`}><Icon size={18} strokeWidth={1.8} /><span className="flex-1">{label}</span>{badge && <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${path === itemPath ? 'bg-white/20 text-white' : 'bg-forest/10 text-forest'}`}>{badge}</span>}</button>)}</nav></div><div className="mt-auto"><div className="rounded-3xl bg-[#e3ebdf] p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.13em] text-forest/70">Daily pause</span><Timer size={16} className="text-forest/60" /></div><p className="mt-3 font-display text-lg text-forest">A moment is enough.</p><button onClick={() => onNavigate('/chat')} className="mt-3 flex items-center gap-1 text-xs font-bold text-forest">Take five minutes <ArrowRight size={13} /></button></div><div className="mt-5 flex items-center gap-3 border-t border-ink/8 pt-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#d7e3d4] text-sm font-bold text-forest">{(user?.full_name || 'R')[0]}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user?.full_name || 'Your space'}</p><p className="truncate text-xs text-ink/45">@{user?.username || 'guest'}</p></div><button onClick={onLogout} className="text-ink/35 hover:text-forest" title="Sign out"><LogOut size={16} /></button></div></div></aside><div className="lg:pl-[268px]"><header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-ink/8 bg-[#f8f6ef]/85 px-5 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button className="rounded-xl p-2 text-ink/60 hover:bg-forest/8 lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={22} /></button><div className="lg:hidden"><Logo compact /></div><div className="hidden sm:block"><p className="text-xs font-medium text-ink/40">Saturday, September 6, 2025</p><p className="mt-0.5 text-sm font-semibold">A gentle day to you, {user?.full_name?.split(' ')[0] || 'friend'}.</p></div></div><div className="flex items-center gap-2"><button onClick={() => onNavigate('/coins')} className="flex items-center gap-2 rounded-full bg-[#f4e6c8] px-3 py-2 text-sm font-bold text-[#806125] hover:bg-[#efdfbc]"><CircleDollarSign size={16} /><span>{user?.calm_coins ?? 240}</span><span className="hidden text-xs font-medium sm:inline">calm coins</span></button><button onClick={() => onNavigate('/chat')} className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white shadow-soft hover:bg-ink"><MessageCircle size={18} /></button></div></header><main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">{children}</main></div></div>
}

function PageIntro({ eyebrow, title, copy, action }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Pill>{eyebrow}</Pill><h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>{copy && <p className="mt-3 max-w-2xl leading-7 text-ink/55">{copy}</p>}</div>{action}</div>
}

function Dashboard({ user, onNavigate }) {
  const [mood, setMood] = useState(null)
  return <div className="space-y-8"><section className="relative overflow-hidden rounded-[2.5rem] bg-forest px-7 py-9 text-cream sm:px-10 sm:py-11"><div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-[#90b293]/20 blur-2xl" /><div className="absolute bottom-[-80px] right-[25%] h-48 w-48 rounded-full bg-[#dfbd87]/15 blur-2xl" /><div className="relative max-w-2xl"><p className="flex items-center gap-2 text-sm text-[#d1e4d0]"><Sun size={15} /> Saturday, September 6</p><h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Good morning, {user?.full_name?.split(' ')[0] || 'friend'}.</h1><p className="mt-4 max-w-lg text-base leading-7 text-cream/65">You don’t need to have it all figured out today. What would feel like a kind first step?</p><Button variant="cream" className="mt-7" onClick={() => onNavigate('/chat')}>Talk to CalmBot <ArrowRight size={16} /></Button></div><div className="absolute bottom-8 right-10 hidden text-[#a9c9ac]/70 md:block"><Flower2 size={90} strokeWidth={.7} /></div></section><section className="grid gap-5 xl:grid-cols-[1.4fr_1fr_1fr]"><div className="rounded-[2rem] border border-ink/8 bg-white/60 p-6 shadow-soft"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Today’s check-in</p><h2 className="mt-2 font-display text-2xl">How are you feeling?</h2></div><Heart className="text-forest/50" size={23} /></div><div className="mt-6 grid grid-cols-4 gap-2">{moods.map((item) => <button key={item.label} onClick={() => setMood(item.label)} className={`rounded-2xl px-2 py-3 text-center transition ${mood === item.label ? 'bg-forest text-white shadow-soft' : 'bg-[#f2f3ed] hover:bg-[#e5eee3]'}`}><span className="text-xl">{item.icon}</span><span className="mt-2 block text-[10px] font-semibold leading-3">{item.label}</span></button>)}</div>{mood && <p className="mt-4 rounded-xl bg-forest/8 px-3 py-2 text-xs font-medium text-forest">Noted: feeling {mood.toLowerCase()}. Thanks for checking in.</p>}</div><div className="rounded-[2rem] bg-[#e8ded0] p-6"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/45">Your gentle streak</p><TrendingUp size={20} className="text-[#8d6d43]" /></div><div className="mt-5 flex items-end gap-2"><span className="font-display text-5xl text-ink">06</span><span className="mb-2 text-sm text-ink/55">days of showing up</span></div><div className="mt-5 flex gap-1.5">{[1, 1, 1, 1, 1, 1, 0].map((active, i) => <span key={i} className={`h-2 flex-1 rounded-full ${active ? 'bg-[#a17d4b]' : 'bg-[#d0bfa4]'}`} />)}</div><p className="mt-3 text-xs text-ink/55">A streak is just a trail of kind choices.</p></div><div className="rounded-[2rem] bg-[#dfeadf] p-6"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.14em] text-forest/60">Calm coins</p><CircleDollarSign size={20} className="text-forest/60" /></div><p className="mt-5 font-display text-5xl text-forest">{user?.calm_coins ?? 240}</p><p className="mt-2 text-sm text-forest/65">coins ready to spend on you</p><button onClick={() => onNavigate('/coins')} className="mt-5 flex items-center gap-1 text-xs font-bold text-forest">See rewards <ArrowRight size={13} /></button></div></section><section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]"><div className="rounded-[2rem] border border-ink/8 bg-white/60 p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Your care menu</p><h2 className="mt-2 font-display text-2xl">What sounds good?</h2></div><button className="text-sm font-semibold text-forest" onClick={() => onNavigate('/chat')}>View all</button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[['Talk it out', 'With CalmBot', MessageCircle, 'bg-[#dce8df]', '/chat'], ['Put it on paper', 'A 5 min reflection', NotebookPen, 'bg-[#efe2d5]', '/journal'], ['Find your focus', 'Sound garden', Headphones, 'bg-[#dde7e9]', '/music']].map(([title, sub, Icon, bg, href]) => <button key={title} onClick={() => onNavigate(href)} className={`rounded-3xl p-4 text-left transition hover:-translate-y-1 hover:shadow-soft ${bg}`}><Icon size={21} className="text-forest" /><p className="mt-8 text-sm font-bold text-ink">{title}</p><p className="mt-1 text-xs text-ink/50">{sub}</p><ChevronRight className="mt-4 text-forest/60" size={17} /></button>)}</div></div><div className="rounded-[2rem] bg-[#f0e2dc] p-6"><div className="flex items-center gap-2 text-[#8a6157]"><Quote size={18} /><p className="text-xs font-bold uppercase tracking-[.14em]">A note for today</p></div><p className="mt-6 font-display text-2xl leading-snug text-ink">“You are allowed to take up space in your own life.”</p><p className="mt-5 text-xs text-ink/45">— ZenHeaven field notes</p></div></section><section className="rounded-[2rem] bg-[#e9eee7] px-6 py-5"><div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-forest"><Award size={20} /></span><div><p className="text-sm font-bold text-forest">You’re building a beautiful habit.</p><p className="mt-1 text-xs text-forest/60">Complete one more ritual this week to unlock your “Showing up” bloom.</p></div></div><Button variant="secondary" className="px-4 py-2.5 text-xs" onClick={() => onNavigate('/coins')}>See progress</Button></div></section></div>
}

function ChatPage({ user, onNavigate }) {
  const [threads, setThreads] = useState(mockThreads)
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi, I’m CalmBot. This is a quiet space to say what’s on your mind—messy, unfinished, or just as it is. How are you arriving today?' }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [thinking, setThinking] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { api('/mental-health/threads').then((data) => { if (data.threads?.length) setThreads(data.threads) }).catch(() => {}) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])
  const openThread = async (thread) => {
    setActiveThread(thread.id); setThinking(''); setMessages([])
    try { const data = await api(`/mental-health/threads/${thread.id}`); setMessages(data.messages.map((item) => ({ role: item.is_user ? 'user' : 'assistant', content: item.content }))) } catch { setMessages([{ role: 'assistant', content: 'Welcome back to this little thread. What would you like to make room for today?' }]) }
  }
  const sendMessage = async (event) => {
    event?.preventDefault()
    const message = input.trim()
    if (!message || sending) return
    setInput(''); setSending(true); setThinking('CalmBot is listening...')
    setMessages((current) => [...current, { role: 'user', content: message }, { role: 'assistant', content: '', streaming: true }])
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('zenheaven_token') ? { Authorization: `Bearer ${localStorage.getItem('zenheaven_token')}` } : {}) }, body: JSON.stringify({ message, thread_id: activeThread || undefined }) })
      if (!response.ok || !response.body) throw new Error('offline')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let assembled = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''
        chunks.forEach((chunk) => { const line = chunk.split('\n').find((item) => item.startsWith('data:')); if (!line) return; try { const eventData = JSON.parse(line.slice(5)); if (eventData.type === 'thread_id') setActiveThread(eventData.data); if (eventData.type === 'thinking') setThinking(eventData.data); if (eventData.type === 'token') { assembled += eventData.data; setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: assembled } : item)) } if (eventData.type === 'complete') setThinking('') } catch { /* keep streaming */ } })
      }
      setThreads((current) => activeThread ? current : [{ id: 'new', title: message.slice(0, 30), last_message: message, message_count: 2 }, ...current])
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: fallbackReply(message), streaming: false } : item))
      setThreads((current) => activeThread ? current : [{ id: `local-${Date.now()}`, title: message.slice(0, 30), last_message: message, message_count: 2 }, ...current])
      setThinking('')
    } finally { setSending(false) }
  }
  return <div className="grid min-h-[calc(100vh-140px)] gap-5 xl:grid-cols-[280px_1fr]"><aside className="hidden rounded-[2rem] border border-ink/8 bg-white/55 p-4 xl:block"><div className="flex items-center justify-between px-2"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Conversations</p><p className="mt-1 font-display text-xl">Your threads</p></div><button className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white" onClick={() => { setActiveThread(null); setMessages([{ role: 'assistant', content: 'A fresh page. I’m here when you’re ready.' }]) }}><Plus size={17} /></button></div><div className="mt-5 space-y-1">{threads.map((thread) => <button key={thread.id} onClick={() => openThread(thread)} className={`w-full rounded-2xl p-3 text-left transition ${activeThread === thread.id ? 'bg-forest/10' : 'hover:bg-forest/6'}`}><p className="truncate text-sm font-semibold text-ink">{thread.title}</p><p className="mt-1 truncate text-xs text-ink/45">{thread.last_message || 'A quiet conversation'}</p><p className="mt-2 text-[10px] font-semibold text-forest/55">{thread.message_count || 0} messages</p></button>)}</div><div className="mt-8 rounded-2xl bg-[#e6eee4] p-4"><Sparkles size={17} className="text-forest" /><p className="mt-3 text-sm font-semibold text-forest">A little reminder</p><p className="mt-2 text-xs leading-5 text-forest/65">CalmBot is a companion, not a replacement for a professional. If you’re in danger, contact local emergency services.</p></div></aside><section className="flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-ink/8 bg-white/55 shadow-soft"><div className="flex items-center justify-between border-b border-ink/8 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[#dce9dc] text-forest"><Brain size={21} /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#76a077]" /></div><div><p className="font-semibold">CalmBot</p><p className="text-xs text-ink/45">Here with you, gently</p></div></div><button className="rounded-full border border-ink/10 px-3 py-2 text-xs font-semibold text-ink/55 xl:hidden" onClick={() => onNavigate('/journal')}>Need another tool?</button></div><div className="flex-1 space-y-5 overflow-y-auto px-5 py-7 sm:px-12">{messages.map((message, index) => <div key={`${index}-${message.content.slice(0, 5)}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] rounded-[1.4rem] px-5 py-4 text-sm leading-7 ${message.role === 'user' ? 'rounded-br-md bg-forest text-white' : 'rounded-bl-md bg-[#edf1e9] text-ink/75'}`}>{message.content || (message.streaming ? <span className="inline-flex items-center gap-1 text-forest/50"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span> : '')}</div></div>)}{thinking && <div className="flex items-center gap-2 px-2 text-xs font-medium text-forest/55"><Sparkles size={13} className="animate-pulse" /> {thinking}</div>}<div ref={bottomRef} /></div><form onSubmit={sendMessage} className="border-t border-ink/8 p-4 sm:p-5"><div className="flex items-end gap-2 rounded-2xl border border-ink/10 bg-[#fafbf7] p-2 focus-within:border-forest/40 focus-within:ring-4 focus-within:ring-forest/8"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) } }} rows="1" placeholder="What’s on your mind?" className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink/35" /><button type="submit" disabled={!input.trim() || sending} className="grid h-11 w-11 place-items-center rounded-xl bg-forest text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-30"><Send size={17} /></button></div><p className="mt-3 text-center text-[11px] text-ink/35">Press Enter to send · Shift + Enter for a new line</p></form></section></div>
}

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [saved, setSaved] = useState(false)
  useEffect(() => { api('/journal/entries').then((data) => setEntries(Array.isArray(data) ? data : [])).catch(() => setEntries([{ _id: 'demo-1', title: 'A slower morning', content: 'I gave myself ten minutes before checking my phone. The day felt a little more mine.', mood: 'peaceful', created_at: new Date().toISOString() }, { _id: 'demo-2', title: 'Making room for hope', content: 'Some things are still uncertain, but I noticed I laughed today.', mood: 'hopeful', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }])) }, [])
  const saveEntry = async (event) => { event.preventDefault(); if (!content.trim()) return; const next = { _id: `local-${Date.now()}`, title: content.split(/[.!?]/)[0].slice(0, 36) || 'A small reflection', content, mood: mood || 'reflective', created_at: new Date().toISOString() }; setEntries((current) => [next, ...current]); setContent(''); setMood(''); setSaved(true); setTimeout(() => setSaved(false), 2600); try { await api('/journal/entries', { method: 'POST', body: JSON.stringify({ content: next.content, mood: next.mood, tags: [] }) }) } catch { /* keep the local-first experience */ } }
  return <div className="space-y-8"><PageIntro eyebrow={<><Feather size={13} /> Private reflections</>} title="Your journal" copy="A place to be honest, curious, and completely unfinished." action={<div className="flex items-center gap-2 rounded-full bg-[#e9eee7] px-4 py-2 text-xs font-semibold text-forest"><ShieldCheck size={15} /> Just for you</div>} /><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><form onSubmit={saveEntry} className="rounded-[2rem] bg-forest p-6 text-cream shadow-soft sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#d0e4cf]/70">Today’s page</p><h2 className="mt-2 font-display text-3xl">What wants to be noticed?</h2></div><NotebookPen className="text-[#bed7c0]" size={25} /></div><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Let the words arrive as they are..." className="mt-7 min-h-48 w-full resize-none rounded-3xl border border-white/10 bg-white/10 p-5 text-base leading-7 text-white outline-none placeholder:text-cream/40 focus:border-white/30" /><div className="mt-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-semibold text-cream/55">Mood:</span>{['peaceful', 'hopeful', 'tender', 'restless'].map((item) => <button type="button" key={item} onClick={() => setMood(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${mood === item ? 'bg-white text-forest' : 'bg-white/10 text-cream/70 hover:bg-white/20'}`}>{item}</button>)}</div><div className="mt-7 flex items-center justify-between"><p className="text-xs text-cream/50">No right words. Just your words.</p><Button variant="cream" className="px-4 py-2.5" disabled={!content.trim()}>{saved ? <><Check size={16} /> Saved</> : <><BookMarked size={16} /> Save page</>}</Button></div></form><div className="rounded-[2rem] border border-ink/8 bg-white/55 p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">A prompt for you</p><h2 className="mt-2 font-display text-2xl">Go a little deeper.</h2></div><Sparkles className="text-[#b68e51]" size={23} /></div><p className="mt-7 font-display text-2xl leading-snug text-ink">“What is one small thing your future self will thank you for?”</p><button onClick={() => setContent('Today, I can give myself...')} className="mt-8 flex items-center gap-2 text-sm font-bold text-forest">Use this prompt <ArrowRight size={15} /></button><div className="mt-8 border-t border-ink/8 pt-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Your rhythm</p><div className="mt-4 flex items-end gap-1.5">{[2, 4, 3, 6, 4, 7, 5].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-[#c3d5c1]" style={{ height: `${height * 7}px` }} />)}</div><p className="mt-3 text-xs text-ink/45">You’ve made space 4 times this month.</p></div></div></div><section><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Past pages</p><h2 className="mt-2 font-display text-3xl">Notes to self</h2></div><span className="text-sm text-ink/40">{entries.length} entries</span></div><div className="mt-5 grid gap-4 md:grid-cols-2">{entries.map((entry) => <article key={entry._id || entry.id} className="group rounded-[1.7rem] border border-ink/8 bg-white/55 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-soft"><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-ink/40">{formatDate(entry.created_at)}</p><h3 className="mt-2 font-display text-xl">{entry.title || 'A quiet reflection'}</h3></div><span className="rounded-full bg-[#e2ede0] px-2.5 py-1 text-[10px] font-bold capitalize text-forest">{entry.mood || 'reflective'}</span></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/60">{entry.content}</p><button className="mt-4 flex items-center gap-1 text-xs font-bold text-forest opacity-0 transition group-hover:opacity-100">Open entry <ChevronRight size={13} /></button></article>)}</div></section></div>
}

function BooksPage() {
  const [books, setBooks] = useState(mockBooks)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('calm')
  const search = async (event) => { event?.preventDefault(); if (!query.trim()) return; try { const data = await api(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); if (data.books?.length) setBooks(data.books) } catch { setBooks(mockBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())) || mockBooks) } }
  return <div className="space-y-8"><PageIntro eyebrow={<><BookOpen size={13} /> Reading nook</>} title="Pages for your season" copy="Books chosen to meet you where you are—and gently take you somewhere new." action={<form onSubmit={search} className="flex w-full max-w-xs items-center gap-2 rounded-full border border-ink/10 bg-white/65 px-4 py-2.5"><Search size={16} className="text-ink/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a book..." className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35" /></form>} /><div className="rounded-[2rem] bg-[#e4ecdf] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-forest/60">Curated for your latest check-in</p><h2 className="mt-3 font-display text-3xl">For a {mood} mind</h2><p className="mt-2 max-w-lg text-sm leading-6 text-forest/65">A few tender, grounding reads to keep nearby this week.</p></div><div className="flex gap-2">{['calm', 'hopeful', 'curious'].map((item) => <button key={item} onClick={() => setMood(item)} className={`rounded-full px-3 py-2 text-xs font-semibold capitalize ${mood === item ? 'bg-forest text-white' : 'bg-white/60 text-forest/70'}`}>{item}</button>)}</div></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{books.slice(0, 4).map((book) => <BookCard key={book.id} book={book} />)}</div></div><div><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">The wider shelf</p><h2 className="mt-2 font-display text-3xl">More to explore</h2></div><button className="text-sm font-bold text-forest">View all <ArrowRight size={14} className="inline" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{mockBooks.map((book) => <BookCard key={`more-${book.id}`} book={book} />)}</div></div></div>
}

function BookCard({ book }) {
  return <article className="group overflow-hidden rounded-[1.6rem] border border-ink/8 bg-white/70 p-3 transition hover:-translate-y-1 hover:shadow-soft"><div className="relative aspect-[1.15] overflow-hidden rounded-2xl bg-[#ded8c9]"><img src={book.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><button className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-forest shadow-soft"><BookMarked size={16} /></button></div><div className="px-1 pb-1 pt-4"><h3 className="truncate font-display text-lg">{book.title}</h3><p className="mt-1 text-xs font-semibold text-ink/45">{book.author}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/55">{book.description}</p></div></article>
}

function MusicPage() {
  const [playing, setPlaying] = useState(null)
  const tracks = [{ title: 'A quiet forest morning', artist: 'ZenHeaven sounds', time: '24 min', color: 'bg-[#d8e6d7]', icon: '🌿' }, { title: 'Rain on the window', artist: 'The softer side', time: '38 min', color: 'bg-[#d9e5e9]', icon: '🌧️' }, { title: 'Breathing room', artist: 'Mira Sol', time: '12 min', color: 'bg-[#e9ddcf]', icon: '☁️' }, { title: 'Sunset stillness', artist: 'Field notes', time: '45 min', color: 'bg-[#eed9cc]', icon: '🌅' }]
  return <div className="space-y-8"><PageIntro eyebrow={<><Music2 size={13} /> Sound garden</>} title="Find your frequency" copy="A soft soundtrack for thinking, resting, moving, and simply being." action={<div className="flex items-center gap-2 text-sm font-semibold text-forest"><Headphones size={17} /> Headphones recommended</div>} /><section className="relative overflow-hidden rounded-[2rem] bg-forest p-7 text-cream sm:p-10"><div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(220,238,209,.25),transparent_56%)]" /><div className="relative max-w-xl"><Pill className="bg-white/10 text-[#d4e8d2]">Curated for right now</Pill><h2 className="mt-5 font-display text-4xl">Slow down without stopping.</h2><p className="mt-4 max-w-md text-sm leading-7 text-cream/65">A 20-minute blend of warm piano, distant rain, and the spaces between notes.</p><button onClick={() => setPlaying(0)} className="mt-7 flex items-center gap-3 rounded-full bg-cream px-5 py-3 text-sm font-bold text-forest"><span className="grid h-7 w-7 place-items-center rounded-full bg-forest text-white"><Play size={13} fill="currentColor" /></span> Play today’s mix</button></div><div className="absolute bottom-5 right-8 hidden opacity-20 sm:block"><Music2 size={150} strokeWidth={.7} /></div></section><section><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">The garden</p><h2 className="mt-2 font-display text-3xl">Choose your atmosphere</h2></div><button className="text-sm font-bold text-forest">All sessions <ArrowRight size={14} className="inline" /></button></div><div className="mt-5 grid gap-3">{tracks.map((track, index) => <button key={track.title} onClick={() => setPlaying(playing === index ? null : index)} className={`flex items-center gap-4 rounded-3xl border p-3 text-left transition hover:shadow-soft ${playing === index ? 'border-forest/20 bg-white shadow-soft' : 'border-ink/8 bg-white/55'}`}><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${track.color}`}>{track.icon}</span><span className="min-w-0 flex-1"><span className="block font-display text-lg">{track.title}</span><span className="mt-1 block text-xs font-semibold text-ink/45">{track.artist}</span></span><span className="hidden text-xs text-ink/40 sm:block">{track.time}</span><span className={`grid h-10 w-10 place-items-center rounded-full ${playing === index ? 'bg-forest text-white' : 'bg-forest/8 text-forest'}`}>{playing === index ? <span className="flex gap-0.5">{[1, 2, 3].map((bar) => <span key={bar} className="music-bar" style={{ animationDelay: `${bar * .12}s` }} />)}</span> : <Play size={15} fill="currentColor" />}</span></button>)}</div></section></div>
}

function TherapistsPage({ user }) {
  const [specialty, setSpecialty] = useState('All support')
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  const specialties = ['All support', 'Anxiety', 'Mindfulness', 'Relationships', 'Grief & Loss']
  const visible = specialty === 'All support' ? mockTherapists : mockTherapists.filter((item) => item.specializations.some((tag) => tag.toLowerCase().includes(specialty.toLowerCase())))
  return <div className="space-y-8"><PageIntro eyebrow={<><HeartHandshake size={13} /> Human support</>} title="You don’t have to do it alone." copy="Find a licensed therapist who can meet you with care, context, and practical support." action={<div className="flex items-center gap-2 rounded-full bg-[#e9eee7] px-4 py-2 text-xs font-semibold text-forest"><ShieldCheck size={15} /> Licensed professionals</div>} /><div className="flex gap-2 overflow-x-auto pb-1">{specialties.map((item) => <button key={item} onClick={() => setSpecialty(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${specialty === item ? 'bg-forest text-white' : 'bg-white/65 text-ink/55 hover:bg-white'}`}>{item}</button>)}</div>{notice && <div className="rounded-2xl bg-[#e2ede0] px-5 py-4 text-sm font-semibold text-forest">{notice}</div>}<div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">{visible.map((therapist) => <article key={therapist._id} className="overflow-hidden rounded-[2rem] border border-ink/8 bg-white/65 p-4 shadow-soft"><div className="flex items-start gap-4"><img src={therapist.photo_url} alt="" className="h-24 w-24 rounded-2xl object-cover" /><div><div className="flex items-center gap-1 text-xs font-bold text-[#a0783d]"><Star size={13} fill="currentColor" /> {therapist.rating}</div><h2 className="mt-2 font-display text-xl">{therapist.name}</h2><p className="mt-1 text-xs font-semibold text-ink/45">{therapist.experience_years} years experience</p></div></div><div className="mt-5 flex flex-wrap gap-1.5">{therapist.specializations.map((tag) => <span key={tag} className="rounded-full bg-forest/8 px-2.5 py-1 text-[10px] font-semibold text-forest">{tag}</span>)}</div><p className="mt-4 line-clamp-2 text-sm leading-6 text-ink/60">{therapist.bio}</p><div className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4"><span className="text-sm font-bold text-ink">${therapist.hourly_rate}<span className="text-xs font-normal text-ink/40"> / session</span></span><Button className="px-4 py-2.5 text-xs" onClick={() => setSelected(therapist)}>View availability <ArrowRight size={14} /></Button></div></article>)}</div>{selected && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-5 backdrop-blur-sm" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-[2rem] bg-[#f8f6ef] p-7 shadow-card" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div className="flex items-center gap-3"><img src={selected.photo_url} alt="" className="h-14 w-14 rounded-2xl object-cover" /><div><h2 className="font-display text-2xl">{selected.name}</h2><p className="text-xs text-ink/45">{selected.languages.join(' · ')}</p></div></div><button onClick={() => setSelected(null)}><X size={19} className="text-ink/45" /></button></div><p className="mt-6 text-sm leading-6 text-ink/65">Choose a time that gives you enough space around the session. You can change or cancel later.</p><div className="mt-6 grid grid-cols-2 gap-3">{['Tue · Sep 9', 'Wed · Sep 10', 'Thu · Sep 11', 'Fri · Sep 12'].map((day) => <button key={day} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm font-semibold text-forest hover:border-forest/40">{day}<span className="mt-1 block text-xs font-normal text-ink/40">9:00 AM · available</span></button>)}</div><Button className="mt-6 w-full" onClick={() => { setNotice(`A request for ${selected.name} is ready. We’ll help you confirm a time shortly.`); setSelected(null) }}>Request a session <CalendarDays size={16} /></Button><p className="mt-3 text-center text-xs text-ink/40">Sessions are ${selected.hourly_rate} · 50 minutes</p></div></div>}</div>
}

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user?.calm_coins ?? 240)
  const [claimed, setClaimed] = useState(false)
  const [transactions, setTransactions] = useState([{ description: 'Welcome to ZenHeaven', amount: 100, source: 'welcome', timestamp: new Date().toISOString() }, { description: 'Completed a journal entry', amount: 10, source: 'journal', timestamp: new Date(Date.now() - 86400000).toISOString() }, { description: 'CalmBot conversation', amount: 5, source: 'mental_health_chat', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }])
  const claim = async (amount, title) => { setBalance((current) => current + amount); setClaimed(true); setTransactions((current) => [{ description: title, amount, source: 'daily_checkin', timestamp: new Date().toISOString() }, ...current]); try { await api('/coins/earn', { method: 'POST', body: JSON.stringify({ amount, source: 'daily_checkin', description: title }) }) } catch { /* local demo fallback */ } }
  return <div className="space-y-8"><PageIntro eyebrow={<><CircleDollarSign size={13} /> Your care currency</>} title="Calm coins" copy="A tiny thank-you for choosing yourself. Earn them through gentle rituals, then spend them on deeper support." /><section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="relative overflow-hidden rounded-[2rem] bg-[#dfeadf] p-7 sm:p-9"><div className="absolute -right-5 -top-16 h-48 w-48 rounded-full bg-white/30 blur-xl" /><div className="relative"><p className="text-xs font-bold uppercase tracking-[.15em] text-forest/60">Available balance</p><div className="mt-5 flex items-baseline gap-3"><span className="font-display text-6xl text-forest">{balance}</span><span className="text-sm font-semibold text-forest/60">calm coins</span></div><p className="mt-4 max-w-sm text-sm leading-6 text-forest/65">Enough for a little extra care today. Keep going at your pace.</p><div className="mt-7 flex items-center gap-3"><Button variant="secondary" onClick={() => claim(10, 'Daily check-in')}><Gift size={16} /> Claim daily 10</Button>{claimed && <span className="text-xs font-bold text-forest">Added with care ✓</span>}</div></div></div><div className="rounded-[2rem] bg-[#f0e2dc] p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8b655c]/70">Your current streak</p><div className="mt-5 flex items-center gap-4"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/65 text-3xl">🔥</span><div><p className="font-display text-3xl">6 days</p><p className="mt-1 text-sm text-ink/50">Showing up counts.</p></div></div><div className="mt-7 h-2 overflow-hidden rounded-full bg-[#d9c4bc]"><div className="h-full w-[68%] rounded-full bg-[#a67768]" /></div><p className="mt-3 text-xs text-ink/50">4 more days to unlock 50 bonus coins</p></div></section><section><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Ways to spend them</p><h2 className="mt-2 font-display text-3xl">Choose what supports you</h2></div><span className="text-sm text-ink/40">Small is still meaningful.</span></div><div className="mt-5 grid gap-4 md:grid-cols-3">{[['Premium insights', 'A deeper look at patterns in your journal.', 100, Brain, 'bg-[#e2ece2]'], ['Personal meditation', 'A custom 10-minute practice for today.', 150, Headphones, 'bg-[#e4e7ed]'], ['Therapist session', 'One 50-minute session with a professional.', 500, HeartHandshake, 'bg-[#f0e0d9]']].map(([title, copy, cost, Icon, tone]) => <article key={title} className={`rounded-[1.7rem] p-5 ${tone}`}><Icon size={22} className="text-forest" /><h3 className="mt-7 font-display text-xl">{title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-ink/55">{copy}</p><div className="mt-5 flex items-center justify-between"><span className="flex items-center gap-1 text-sm font-bold text-forest"><CircleDollarSign size={15} /> {cost}</span><button disabled={balance < cost} className="rounded-full bg-white/70 px-3 py-2 text-xs font-bold text-forest disabled:cursor-not-allowed disabled:opacity-40">Unlock</button></div></article>)}</div></section><section className="rounded-[2rem] border border-ink/8 bg-white/55 p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-ink/40">Recent movement</p><h2 className="mt-2 font-display text-2xl">Your coin trail</h2></div><Activity size={21} className="text-forest/50" /></div><div className="mt-5 divide-y divide-ink/8">{transactions.map((item, index) => <div key={`${item.description}-${index}`} className="flex items-center gap-3 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8eee5] text-forest"><Zap size={15} /></span><div className="flex-1"><p className="text-sm font-semibold">{item.description}</p><p className="text-xs text-ink/40">{formatDate(item.timestamp)}</p></div><span className="text-sm font-bold text-forest">+{item.amount}</span></div>)}</div></section></div>
}

function formatDate(date) {
  if (!date) return 'Recently'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date))
}

export default App
