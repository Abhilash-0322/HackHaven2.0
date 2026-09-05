import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookHeart,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Coins,
  Compass,
  Eye,
  EyeOff,
  ExternalLink,
  Heart,
  LibraryBig,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  PenLine,
  Play,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  WandSparkles,
  X,
} from "lucide-react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("zen_token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error((await response.text()) || "Request failed");
  }
  return response.json();
}

const navItems = [
  { to: "/dashboard", label: "Overview", icon: Compass },
  { to: "/chat", label: "CalmBot", icon: MessageCircle },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/books", label: "Library", icon: LibraryBig },
  { to: "/music", label: "Soundscapes", icon: Music2 },
  { to: "/therapists", label: "Therapists", icon: Stethoscope },
  { to: "/coins", label: "Calm Coins", icon: Coins },
];

const cardArt = {
  journal:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
  books:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
  music:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85",
  therapy:
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=85",
};

const fallbackBooks = [
  {
    id: "book-1",
    title: "The Things You Can See Only When You Slow Down",
    author: "Haemin Sunim",
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "book-2",
    title: "The Comfort Book",
    author: "Matt Haig",
    image_url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "book-3",
    title: "Atomic Habits",
    author: "James Clear",
    image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "book-4",
    title: "Wintering",
    author: "Katherine May",
    image_url: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=600&q=80",
  },
];

const fallbackTherapists = [
  {
    _id: "therapist-1",
    name: "Dr. Sarah Johnson",
    specializations: ["Anxiety", "Mindfulness"],
    experience_years: 12,
    bio: "A warm, practical approach to making space for steadier days.",
    hourly_rate: 120,
    rating: 4.8,
    languages: ["English", "Spanish"],
    photo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "therapist-2",
    name: "Maya Rodriguez, LMFT",
    specializations: ["Relationships", "Self-esteem"],
    experience_years: 8,
    bio: "Helping you understand your patterns and build kinder connections.",
    hourly_rate: 100,
    rating: 4.9,
    languages: ["English", "Spanish"],
    photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "therapist-3",
    name: "Aisha Patel, LCSW",
    specializations: ["Grief & loss", "Life transitions"],
    experience_years: 7,
    bio: "A culturally sensitive space to find meaning through change.",
    hourly_rate: 95,
    rating: 4.8,
    languages: ["English", "Hindi"],
    photo_url: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80",
  },
];

const fallbackEntries = [
  {
    _id: "entry-1",
    title: "A gentler start",
    content: "I noticed I had more patience with myself this morning.",
    mood: "hopeful",
    created_at: "2026-09-05T08:00:00.000Z",
  },
  {
    _id: "entry-2",
    title: "Making room for quiet",
    content: "A walk without my phone helped me hear my own thoughts.",
    mood: "calm",
    created_at: "2026-09-04T17:30:00.000Z",
  },
];

const fallbackSongs = [
  { name: "Bloom", artist: "The Paper Kites", mood: "soft focus", color: "bg-[#dce8dd]" },
  { name: "Holocene", artist: "Bon Iver", mood: "reflective", color: "bg-[#d9d4e9]" },
  { name: "Sunset Lover", artist: "Petit Biscuit", mood: "uplift", color: "bg-[#f2d9c9]" },
  { name: "Weightless", artist: "Marconi Union", mood: "deep rest", color: "bg-[#ccdce7]" },
];

const fallbackThreads = [
  { id: "thread-1", title: "Finding a slower rhythm", last_message: "Yesterday, 8:12 PM", message_count: 8 },
  { id: "thread-2", title: "A little help with overthinking", last_message: "Sep 02", message_count: 12 },
];

const fallbackMessages = [
  {
    id: "message-1",
    content: "Hi, I’m CalmBot. What feels most present for you today?",
    is_user: false,
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}

function Pill({ children, color = "sage" }) {
  const colors = {
    sage: "bg-sage text-moss",
    clay: "bg-[#f6dfd5] text-[#a9573d]",
    lavender: "bg-[#e6e0ef] text-[#6d5e80]",
    white: "bg-white/70 text-ink",
  };
  return <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", colors[color])}>{children}</span>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-ink text-white shadow-card hover:-translate-y-0.5 hover:bg-moss",
    secondary: "border border-[#cbd8cd] bg-white/60 text-ink hover:bg-white",
    quiet: "text-moss hover:bg-sage/60",
    clay: "bg-clay text-white hover:bg-[#d56d4e]",
  };
  return (
    <button className={cn("inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition", variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-moss">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zen_user")) || null;
    } catch {
      return null;
    }
  });

  async function authenticate(mode, form) {
    try {
      const data = await apiFetch(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("zen_token", data.access_token);
      localStorage.setItem("zen_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch {
      const fallbackUser = {
        id: "demo-user",
        username: form.username,
        email: form.email || `${form.username}@zenheaven.local`,
        full_name: form.full_name || form.username,
        calm_coins: 100,
      };
      localStorage.setItem("zen_token", "demo-token");
      localStorage.setItem("zen_user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return fallbackUser;
    }
  }

  function logout() {
    localStorage.removeItem("zen_token");
    localStorage.removeItem("zen_user");
    setUser(null);
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={authenticate} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={authenticate} />} />
      <Route path="/dashboard" element={<Protected user={user} onLogout={logout}><DashboardPage user={user} /></Protected>} />
      <Route path="/chat" element={<Protected user={user} onLogout={logout}><ChatPage user={user} /></Protected>} />
      <Route path="/journal" element={<Protected user={user} onLogout={logout}><JournalPage /></Protected>} />
      <Route path="/books" element={<Protected user={user} onLogout={logout}><BooksPage /></Protected>} />
      <Route path="/music" element={<Protected user={user} onLogout={logout}><MusicPage /></Protected>} />
      <Route path="/therapists" element={<Protected user={user} onLogout={logout}><TherapistsPage user={user} /></Protected>} />
      <Route path="/coins" element={<Protected user={user} onLogout={logout}><CoinsPage user={user} /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Protected({ user, onLogout, children }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AppShell user={user} onLogout={onLogout}>{children}</AppShell>;
}

function AppShell({ user, onLogout, children }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label || "Overview";
  const displayName = user.full_name || user.username || "friend";

  return (
    <div className="min-h-screen bg-sand text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-[#e3e6de] bg-[#f8f8f3]/90 px-5 py-7 backdrop-blur-xl lg:flex">
        <Link to="/" className="flex items-center gap-3 px-3">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-ink text-white"><Sparkles size={18} /></span>
          <span className="font-display text-2xl tracking-[-0.04em]">zenheaven</span>
        </Link>
        <div className="mt-12 flex-1">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/35">Your space</p>
          <nav className="space-y-1">
            {navItems.map((item) => <NavItem key={item.to} {...item} />)}
          </nav>
        </div>
        <div className="rounded-[22px] bg-sage/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-moss"><WandSparkles size={15} /><span className="text-xs font-bold">A tiny practice</span></div>
          <p className="text-sm leading-5 text-ink/70">Take three slow breaths before you open another tab.</p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/70"><div className="h-full w-2/3 rounded-full bg-moss" /></div>
        </div>
        <button onClick={onLogout} className="mt-6 flex items-center gap-3 px-3 py-2 text-sm font-semibold text-ink/50 transition hover:text-ink"><LogOut size={17} /> Sign out</button>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e4e7df]/70 bg-sand/80 px-5 backdrop-blur-xl sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full bg-white/70 lg:hidden">{mobileMenu ? <X size={19} /> : <Menu size={19} />}</button>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/35">ZenHeaven / {pageName}</p><p className="mt-1 text-sm font-semibold">A softer place to land.</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/coins" className="hidden items-center gap-2 rounded-full border border-[#d9e2d9] bg-white/50 px-3 py-2 text-xs font-bold text-moss sm:flex"><Coins size={15} /> {user.calm_coins ?? 100} calm coins</Link>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#e1e6df] bg-white/60 text-ink/60"><Bell size={17} /></button>
            <div className="hidden h-10 w-10 place-items-center rounded-full bg-[#e4d8cb] font-display text-lg sm:grid">{displayName.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        {mobileMenu && <div className="absolute left-4 right-4 top-[68px] z-20 rounded-[24px] border border-[#e2e8df] bg-white p-3 shadow-soft lg:hidden">{navItems.map((item) => <NavItem key={item.to} {...item} onClick={() => setMobileMenu(false)} />)}</div>}
        <main className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, onClick }) {
  return <NavLink onClick={onClick} to={to} className={({ isActive }) => cn("flex items-center gap-3 rounded-[14px] px-3 py-3 text-sm font-semibold transition", isActive ? "bg-ink text-white shadow-card" : "text-ink/55 hover:bg-sage/50 hover:text-ink")}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === "Calm Coins" && <span className="ml-auto h-2 w-2 rounded-full bg-clay" />}</NavLink>;
}

function LandingPage({ user }) {
  const navigate = useNavigate();
  return (
    <div className="grain min-h-screen overflow-hidden bg-sand text-ink">
      <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-ink text-white"><Sparkles size={18} /></span><span className="font-display text-2xl tracking-[-0.04em]">zenheaven</span></Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/55 md:flex"><a href="#rituals" className="transition hover:text-ink">Rituals</a><a href="#story" className="transition hover:text-ink">Our approach</a><a href="#spaces" className="transition hover:text-ink">Spaces</a></nav>
        <div className="flex items-center gap-2">{user ? <Button onClick={() => navigate("/dashboard")} className="px-4 py-2.5">Open my space <ArrowRight size={15} /></Button> : <><Link to="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 hover:text-ink sm:block">Sign in</Link><Link to="/register"><Button className="px-4 py-2.5">Begin gently <ArrowRight size={15} /></Button></Link></>}</div>
      </header>

      <section className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <Pill>mental wellness, made human</Pill>
          <h1 className="mt-7 font-display text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.89] tracking-[-0.075em]">Come back<br /><span className="text-moss">to yourself.</span></h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-ink/60">A collection of small, steady rituals for the days when you need a little more room to breathe.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3"><Link to={user ? "/dashboard" : "/register"}><Button className="px-6">Explore your space <ArrowRight size={16} /></Button></Link><a href="#story" className="rounded-full px-5 py-3 text-sm font-semibold text-ink/55 transition hover:bg-white/60 hover:text-ink">How it works <ChevronRight className="ml-1 inline" size={15} /></a></div>
          <div className="mt-12 flex items-center gap-4 text-xs font-semibold text-ink/45"><div className="flex -space-x-2">{["#dca993", "#a7bdab", "#d7c9b2", "#b4c4d2"].map((color) => <span key={color} style={{ backgroundColor: color }} className="h-7 w-7 rounded-full border-2 border-sand" />)}</div><span>Made for the beautifully human parts.</span></div>
        </div>
        <div className="relative min-h-[440px] sm:min-h-[530px]">
          <div className="absolute right-1/2 top-0 h-[360px] w-[280px] translate-x-1/2 rotate-[-7deg] rounded-[38px] bg-[#d9e6d8] shadow-soft sm:right-16 sm:translate-x-0 sm:rotate-[-9deg] sm:h-[430px] sm:w-[340px]" />
          <div className="absolute right-1/2 top-12 h-[370px] w-[290px] translate-x-1/2 rotate-[6deg] overflow-hidden rounded-[38px] border-[10px] border-[#faf6ee] shadow-soft sm:right-5 sm:translate-x-0 sm:top-14 sm:h-[450px] sm:w-[350px]">
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85" alt="Person enjoying a peaceful landscape" className="h-full w-full object-cover" />
            <div className="absolute inset-x-5 bottom-5 rounded-[20px] bg-white/85 p-4 backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moss">today's intention</p><p className="mt-2 font-display text-xl">I can move at my own pace.</p></div>
          </div>
          <div className="absolute bottom-5 left-1/2 z-10 w-[205px] -translate-x-1/2 rounded-[20px] border border-white/70 bg-ink px-4 py-3 text-white shadow-soft sm:bottom-2 sm:left-0 sm:translate-x-0"><div className="flex items-center gap-2 text-clay"><span className="h-2 w-2 rounded-full bg-clay" /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">your calm score</span></div><div className="mt-2 flex items-end justify-between"><span className="font-display text-3xl">72</span><span className="mb-1 text-xs text-white/50">+8 this week</span></div></div>
        </div>
      </section>

      <section id="rituals" className="mx-auto max-w-[1280px] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">A little of what you need</p><h2 className="mt-3 font-display text-4xl tracking-[-0.05em] sm:text-5xl">Your everyday rituals.</h2></div><span className="hidden text-sm font-semibold text-ink/40 sm:block">01 — 04</span></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LandingCard to="/journal" index="01" title="Put it down" description="A private page for the thoughts that need somewhere to go." image={cardArt.journal} />
          <LandingCard to="/books" index="02" title="Find a new thought" description="Stories and ideas selected for how you feel right now." image={cardArt.books} />
          <LandingCard to="/music" index="03" title="Set the tone" description="Soundscapes for your walk, your pause, your reset." image={cardArt.music} />
          <LandingCard to="/therapists" index="04" title="Be met" description="A human conversation, when you’re ready for one." image={cardArt.therapy} />
        </div>
      </section>

      <section id="story" className="border-y border-[#e2e6de] bg-[#edf1e9]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-28">
          <div><Pill color="clay">the zenheaven way</Pill><h2 className="mt-6 max-w-md font-display text-5xl leading-[.98] tracking-[-0.06em]">Wellness is not a finish line.</h2></div>
          <div className="max-w-xl lg:pt-10"><p className="text-2xl leading-[1.45] tracking-[-0.025em] text-ink/80">It’s a series of small returns — to your breath, your body, your people, and the parts of you that already know the way.</p><div className="mt-9 grid grid-cols-2 gap-5 border-t border-ink/10 pt-6 text-sm leading-6 text-ink/60"><p><strong className="mb-1 block text-ink">01 / No pressure</strong>Progress can be quiet. We’ll never rush it.</p><p><strong className="mb-1 block text-ink">02 / Just enough</strong>Tools that meet you where your energy is.</p></div></div>
        </div>
      </section>

      <section id="spaces" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="rounded-[34px] bg-ink px-6 py-10 text-white sm:px-12 sm:py-14 lg:flex lg:items-end lg:justify-between"><div><Pill color="white">your space is waiting</Pill><h2 className="mt-6 max-w-lg font-display text-5xl leading-[.98] tracking-[-0.06em]">There is no right way to begin.</h2></div><div className="mt-8 max-w-xs lg:mt-0"><p className="mb-5 text-sm leading-6 text-white/55">Start with one small thing. You can always come back for the rest.</p><Link to={user ? "/dashboard" : "/register"}><Button variant="clay">Open ZenHeaven <ArrowRight size={16} /></Button></Link></div></div>
      </section>
      <footer className="mx-auto flex max-w-[1280px] items-center justify-between border-t border-[#e2e6de] px-5 py-8 text-xs font-semibold text-ink/40 sm:px-8 lg:px-12"><span>© 2026 zenheaven</span><span>A softer place to land.</span></footer>
    </div>
  );
}

function LandingCard({ to, index, title, description, image }) {
  return <Link to={to} className="group relative h-[320px] overflow-hidden rounded-[26px] bg-ink shadow-card transition hover:-translate-y-1"><img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" /><div className="relative flex h-full flex-col justify-between p-5 text-white"><span className="font-display text-4xl text-white/60">{index}</span><div><h3 className="font-display text-3xl tracking-[-0.04em]">{title}</h3><p className="mt-2 text-sm leading-5 text-white/65">{description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Explore <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div></div></Link>;
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    await onAuth(mode, form);
    setLoading(false);
    navigate("/dashboard");
  }

  return <div className="grain grid min-h-screen bg-sand lg:grid-cols-[.9fr_1.1fr]">
    <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between"><Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-white text-ink"><Sparkles size={18} /></span><span className="font-display text-2xl">zenheaven</span></Link><div className="relative z-10 max-w-md"><Pill color="white">a softer place to land</Pill><h1 className="mt-6 font-display text-6xl leading-[.95] tracking-[-0.06em]">Your inner world deserves a little more room.</h1><p className="mt-7 max-w-sm leading-7 text-white/50">Keep the small things that help. Return to them whenever you need.</p></div><p className="text-xs font-semibold text-white/35">Private by design · Human at heart</p><div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-white/10" /><div className="absolute bottom-8 right-16 h-40 w-40 rounded-full border border-clay/30" /></div>
    <div className="flex items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-[440px]"><Link to="/" className="mb-12 flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-ink text-white"><Sparkles size={18} /></span><span className="font-display text-2xl">zenheaven</span></Link><div className="mb-9"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-moss">{isRegister ? "your space, your pace" : "welcome back"}</p><h1 className="font-display text-5xl tracking-[-0.06em]">{isRegister ? "Begin gently." : "Good to see you."}</h1><p className="mt-4 text-sm leading-6 text-ink/55">{isRegister ? "Create a private space for your everyday wellbeing." : "Pick up wherever you left off."}</p></div><form onSubmit={submit} className="space-y-4">{isRegister && <Field label="Your name" icon={CircleUserRound} value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="What should we call you?" />}{isRegister && <Field label="Email address" icon={Mail} type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" />}<Field label="Username" icon={CircleUserRound} value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="Choose a username" /><div className="relative"><Field label="Password" icon={LockKeyhole} type={showPassword ? "text" : "password"} value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3.5 right-4 text-ink/35 hover:text-ink">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><Button type="submit" className="mt-3 w-full py-3.5">{loading ? <LoaderCircle className="animate-spin" size={17} /> : isRegister ? "Create my space" : "Sign in"} <ArrowRight size={16} /></Button></form><p className="mt-7 text-center text-sm text-ink/50">{isRegister ? "Already have a space?" : "New to ZenHeaven?"} <Link className="font-bold text-moss hover:underline" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create one"}</Link></p><p className="mt-8 text-center text-[11px] leading-5 text-ink/35">By continuing, you agree that ZenHeaven is a wellness companion, not a replacement for professional care.</p></div></div>
  </div>;
}

function Field({ label, icon: Icon, value, onChange, type = "text", placeholder }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{label}</span><span className="relative block"><Icon className="absolute left-4 top-3.5 text-ink/30" size={17} /><input required value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} className="w-full rounded-[15px] border border-[#dce2d9] bg-white/60 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-ink/25 focus:border-moss focus:bg-white" /></span></label>;
}

function DashboardPage({ user }) {
  const [balance, setBalance] = useState(user.calm_coins ?? 100);
  const [journalCount, setJournalCount] = useState(2);
  useEffect(() => {
    Promise.allSettled([apiFetch("/coins/balance"), apiFetch("/journal/entries")]).then(([coinResult, journalResult]) => {
      if (coinResult.status === "fulfilled") setBalance(coinResult.value.balance);
      if (journalResult.status === "fulfilled") setJournalCount(journalResult.value.length);
    });
  }, []);
  const displayName = user.full_name || user.username || "friend";
  return <div className="float-in"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">Saturday, September 05</p><h1 className="mt-3 font-display text-5xl tracking-[-0.06em] sm:text-6xl">Good evening, {displayName.split(" ")[0]}.</h1><p className="mt-4 text-[15px] text-ink/55">Here’s a gentle snapshot of your space.</p></div><Link to="/journal"><Button variant="secondary"><PenLine size={16} /> Write a thought</Button></Link></div>
    <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><div className="relative min-h-[280px] overflow-hidden rounded-[30px] bg-[#d6e3d5] p-7 sm:p-9"><div className="relative z-10 max-w-md"><Pill>daily intention</Pill><p className="mt-8 font-display text-4xl leading-[1.03] tracking-[-0.05em] sm:text-5xl">“I can be a work in progress and still be worthy of rest.”</p><Link to="/journal" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-moss">Save this thought <ArrowRight size={15} /></Link></div><div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full border-[34px] border-white/20" /><div className="absolute -right-8 top-[-50px] h-48 w-48 rounded-full bg-white/20" /></div><div className="rounded-[30px] bg-ink p-7 text-white sm:p-9"><div className="flex items-center justify-between"><Pill color="white">your progress</Pill><TrendingUp size={19} className="text-clay" /></div><div className="mt-10 flex items-end gap-2"><span className="font-display text-7xl leading-none">72</span><span className="mb-2 text-sm text-white/45">/ 100</span></div><p className="mt-3 text-sm text-white/55">calm score this week</p><div className="mt-7 h-2 rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-clay" /></div><p className="mt-5 text-xs font-semibold text-white/45">You’re showing up. That counts.</p></div></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-3"><StatCard label="Calm coins" value={balance} detail="12 earned this week" icon={Coins} to="/coins" /><StatCard label="Journal entries" value={journalCount} detail="Keep the streak kind" icon={BookHeart} to="/journal" /><StatCard label="Days grounded" value="04" detail="Best: 12 days" icon={Heart} to="/journal" /></div>
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_330px]"><div><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl tracking-[-0.04em]">Pick a small ritual</h2><Link to="/chat" className="text-xs font-bold uppercase tracking-[0.14em] text-moss">View all <ArrowRight className="ml-1 inline" size={13} /></Link></div><div className="grid gap-4 sm:grid-cols-2"><RitualCard to="/chat" icon={MessageCircle} title="Talk it out" subtitle="A private check-in with CalmBot" color="bg-[#e5ddef]" /><RitualCard to="/music" icon={Music2} title="Find your frequency" subtitle="A soundscape for this moment" color="bg-[#e4e9d9]" /><RitualCard to="/books" icon={BookOpen} title="Borrow a perspective" subtitle="Something thoughtful to read" color="bg-[#f4dfd4]" /><RitualCard to="/therapists" icon={Stethoscope} title="Meet a human" subtitle="Find support that fits" color="bg-[#d9e7ed]" /></div></div><div><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl tracking-[-0.04em]">Your rhythm</h2><button className="text-ink/35"><SlidersHorizontal size={17} /></button></div><div className="rounded-[24px] border border-[#e1e6de] bg-white/50 p-5"><div className="flex h-[145px] items-end justify-between gap-2">{[38, 54, 45, 68, 55, 74, 65].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div style={{ height: `${height}%` }} className={cn("w-full rounded-t-full", index === 5 ? "bg-clay" : "bg-sage")} /><span className="text-[10px] text-ink/35">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div><p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/50">Your steadier moments are becoming a pattern.</p></div></div></div>
  </div>;
}

function StatCard({ label, value, detail, icon: Icon, to }) {
  return <Link to={to} className="group rounded-[22px] border border-[#e1e6de] bg-white/45 p-5 transition hover:-translate-y-0.5 hover:bg-white"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-moss"><Icon size={17} /></span><ArrowRight className="text-ink/20 transition group-hover:translate-x-1 group-hover:text-moss" size={16} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-ink/40">{label}</p><div className="mt-1 flex items-baseline gap-2"><span className="font-display text-4xl">{value}</span><span className="text-xs text-ink/40">{detail}</span></div></Link>;
}

function RitualCard({ to, icon: Icon, title, subtitle, color }) {
  return <Link to={to} className={cn("group rounded-[22px] p-5 transition hover:-translate-y-1 hover:shadow-card", color)}><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-white/60 text-ink"><Icon size={18} /></span><ArrowRight className="text-ink/30 transition group-hover:translate-x-1" size={17} /></div><h3 className="mt-12 font-display text-2xl tracking-[-0.04em]">{title}</h3><p className="mt-1 text-xs text-ink/55">{subtitle}</p></Link>;
}

function ChatPage({ user }) {
  const [threads, setThreads] = useState(fallbackThreads);
  const [activeThread, setActiveThread] = useState("thread-1");
  const [messages, setMessages] = useState({ "thread-1": fallbackMessages, "thread-2": fallbackMessages });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  useEffect(() => {
    apiFetch("/mental-health/threads").then((data) => { if (data.threads?.length) setThreads(data.threads); }).catch(() => {});
  }, []);
  const activeMessages = messages[activeThread] || fallbackMessages;

  function newChat() {
    const id = `local-${Date.now()}`;
    setThreads((current) => [{ id, title: "A new gentle beginning", last_message: "Just now", message_count: 0 }, ...current]);
    setMessages((current) => ({ ...current, [id]: fallbackMessages }));
    setActiveThread(id);
  }

  async function sendMessage(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || thinking) return;
    const assistantId = `assistant-${Date.now()}`;
    setInput("");
    setThinking(true);
    setMessages((current) => ({ ...current, [activeThread]: [...(current[activeThread] || []), { id: `user-${Date.now()}`, content: message, is_user: true }, { id: assistantId, content: "", is_user: false }] }));
    try {
      const response = await fetch(`${API_BASE}/mental-health/chat/stream`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("zen_token") || ""}` }, body: JSON.stringify({ message, thread_id: activeThread.startsWith("local-") ? null : activeThread }) });
      if (!response.ok || !response.body) throw new Error("stream unavailable");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamedText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        events.forEach((eventBlock) => {
          const dataLine = eventBlock.split("\n").find((line) => line.startsWith("data:"));
          if (!dataLine) return;
          try {
            const eventData = JSON.parse(dataLine.replace("data: ", ""));
            if (eventData.type === "thread_id") setActiveThread(eventData.data);
            if (eventData.type === "token") {
              streamedText += eventData.data;
              setMessages((current) => ({ ...current, [activeThread]: current[activeThread].map((item) => item.id === assistantId ? { ...item, content: streamedText } : item) }));
            }
          } catch {
            // Ignore incomplete SSE frames.
          }
        });
      }
      if (!streamedText) throw new Error("empty response");
    } catch {
      const fallback = "I’m here with you. Let’s make this moment a little smaller: what is one thing you can soften or set down for the next five minutes?";
      setMessages((current) => ({ ...current, [activeThread]: current[activeThread].map((item) => item.id === assistantId ? { ...item, content: fallback } : item) }));
    } finally {
      setThinking(false);
    }
  }

  return <div className="float-in"><PageHeading eyebrow="your private check-in" title="Talk it out." description="A quiet place to untangle what’s on your mind. CalmBot is here to listen, not to judge." action={<Button onClick={newChat}><Plus size={16} /> New conversation</Button>} /><div className="grid min-h-[600px] overflow-hidden rounded-[28px] border border-[#e0e6dd] bg-white/50 lg:grid-cols-[270px_1fr]"><aside className="border-b border-[#e0e6dd] p-4 lg:border-b-0 lg:border-r"><div className="mb-4 flex items-center justify-between px-2"><span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">Conversations</span><MessageCircle size={15} className="text-moss" /></div><div className="space-y-1">{threads.map((thread) => <button key={thread.id} onClick={() => setActiveThread(thread.id)} className={cn("w-full rounded-[15px] p-3 text-left transition", activeThread === thread.id ? "bg-sage/70" : "hover:bg-sage/35")}><p className="truncate text-sm font-semibold">{thread.title}</p><p className="mt-1 truncate text-[11px] text-ink/40">{thread.last_message || "A quiet beginning"}</p></button>)}</div><div className="mt-8 rounded-[17px] bg-[#f3e8dc] p-3 text-xs leading-5 text-ink/60"><ShieldCheck size={15} className="mb-2 text-clay" /><p>Your conversations are private and secured to your account.</p></div></aside><section className="flex min-h-[550px] flex-col"><div className="flex items-center justify-between border-b border-[#e0e6dd] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white"><Sparkles size={15} /></div><div><p className="text-sm font-bold">CalmBot</p><p className="text-[11px] text-moss">Here with you · gentle mode</p></div></div><button className="text-ink/30 hover:text-ink"><ExternalLink size={16} /></button></div><div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">{activeMessages.map((message) => <div key={message.id} className={cn("flex max-w-[85%] gap-3", message.is_user ? "ml-auto flex-row-reverse" : "")}><div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs", message.is_user ? "bg-[#ead9cc] text-ink" : "bg-sage text-moss")}>{message.is_user ? (user.full_name || user.username || "Y").charAt(0).toUpperCase() : <Sparkles size={14} />}</div><div className={cn("rounded-[20px] px-4 py-3 text-sm leading-6", message.is_user ? "rounded-tr-sm bg-ink text-white" : "rounded-tl-sm bg-[#edf1e9] text-ink/75")}>{message.content || <LoaderCircle className="animate-spin text-moss" size={16} />}</div></div>)}{thinking && <p className="ml-11 text-xs italic text-ink/35">CalmBot is reflecting on that…</p>}</div><form onSubmit={sendMessage} className="border-t border-[#e0e6dd] p-4 sm:p-5"><div className="flex items-end gap-3 rounded-[18px] border border-[#dce3d9] bg-white p-2 focus-within:border-moss"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows="1" placeholder="Tell me what’s here…" className="max-h-28 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-ink/30" /><button aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-ink text-white transition hover:bg-moss"><Send size={16} /></button></div><p className="mt-3 px-2 text-[10px] text-ink/30">CalmBot offers general support, not diagnosis or emergency care. If you’re in immediate danger, contact local emergency services.</p></form></section></div></div>;
}

function JournalPage() {
  const [entries, setEntries] = useState(fallbackEntries);
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  useEffect(() => { apiFetch("/journal/entries").then((data) => { if (Array.isArray(data) && data.length) setEntries(data); }).catch(() => {}); }, []);
  async function saveEntry(event) {
    event.preventDefault();
    if (!content.trim()) return;
    const next = { _id: `local-${Date.now()}`, title: content.trim().split(" ").slice(0, 5).join(" "), content, mood, created_at: new Date().toISOString() };
    setEntries((current) => [next, ...current]);
    setContent("");
    setComposerOpen(false);
    try { await apiFetch("/journal/entries", { method: "POST", body: JSON.stringify({ content, mood, tags: [] }) }); } catch { /* local-first journal */ }
  }
  return <div className="float-in"><PageHeading eyebrow="a page for you" title="Keep what matters." description="You don’t need the perfect words. Just leave a little honesty here." action={<Button onClick={() => setComposerOpen(true)}><Plus size={16} /> New entry</Button>} />{composerOpen && <form onSubmit={saveEntry} className="mb-8 rounded-[26px] border border-[#dce6db] bg-[#e7efe4] p-5 sm:p-7"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">right now, I feel…</p><button type="button" onClick={() => setComposerOpen(false)} className="text-ink/35"><X size={18} /></button></div><div className="mt-5 flex flex-wrap gap-2">{["calm", "hopeful", "anxious", "tired", "grateful"].map((option) => <button type="button" key={option} onClick={() => setMood(option)} className={cn("rounded-full px-4 py-2 text-xs font-bold capitalize transition", mood === option ? "bg-ink text-white" : "bg-white/65 text-ink/55 hover:bg-white")}>{option}</button>)}</div><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} placeholder="What’s moving through you?" rows="5" className="mt-5 w-full resize-none rounded-[18px] border-0 bg-white/70 p-4 text-sm leading-7 outline-none placeholder:text-ink/30 focus:ring-2 focus:ring-moss/20" /><div className="mt-4 flex justify-end"><Button type="submit"><Check size={16} /> Save entry <span className="text-white/60">+10 coins</span></Button></div></form>}<div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-[26px] bg-ink p-6 text-white sm:p-8"><div className="flex items-start justify-between"><div><Pill color="white">reflection prompt</Pill><h2 className="mt-8 max-w-md font-display text-4xl leading-[1.05] tracking-[-0.05em]">What is one thing you can be proud of from this week?</h2></div><PenLine className="text-clay" size={22} /></div><button onClick={() => setComposerOpen(true)} className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-white/65 transition hover:text-white">Write from this prompt <ArrowRight size={15} /></button></div><div className="rounded-[26px] border border-[#e0e6dd] bg-white/50 p-6 sm:p-8"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">your mood garden</p><Heart className="text-clay" size={19} /></div><div className="mt-8 flex items-end gap-2"><span className="font-display text-6xl">7</span><span className="mb-2 text-sm text-ink/45">entries this month</span></div><div className="mt-7 flex items-end gap-1.5">{[45, 70, 38, 82, 58, 64, 90, 55, 74, 44, 65, 80].map((height, index) => <div key={index} style={{ height: `${height}%` }} className={cn("h-20 flex-1 rounded-t-full", index === 6 ? "bg-clay" : "bg-sage")} />)}</div><p className="mt-4 text-xs leading-5 text-ink/45">A little more noticing, a little less fixing.</p></div></div><div className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl tracking-[-0.04em]">Recent pages</h2><span className="text-xs font-semibold text-ink/35">{entries.length} saved</span></div><div className="grid gap-3 md:grid-cols-2">{entries.map((entry) => <article key={entry._id || entry.id} className="group rounded-[22px] border border-[#e0e6dd] bg-white/40 p-5 transition hover:bg-white"><div className="flex items-start justify-between"><Pill color={entry.mood === "anxious" ? "clay" : "sage"}>{entry.mood || "reflection"}</Pill><span className="text-xs text-ink/35">{formatDate(entry.created_at || Date.now())}</span></div><h3 className="mt-7 font-display text-2xl tracking-[-0.04em]">{entry.title || "A page from you"}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/55">{entry.content}</p><button className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-moss opacity-0 transition group-hover:opacity-100">Open page <ArrowRight className="ml-1 inline" size={13} /></button></article>)}</div></div></div>;
}

function BooksPage() {
  const [books, setBooks] = useState(fallbackBooks);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  useEffect(() => { apiFetch("/books/recommend-by-mood").then((data) => { if (data.books?.length) setBooks(data.books); }).catch(() => {}); }, []);
  async function search(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try { const data = await apiFetch(`/books/search?q=${encodeURIComponent(query)}&max_results=10`); if (data.books?.length) setBooks(data.books); } catch { /* use curated shelf */ }
    setSearching(false);
  }
  return <div className="float-in"><PageHeading eyebrow="the reading room" title="A thought worth borrowing." description="Books selected for the season you’re in — a little perspective, a little company." action={<form onSubmit={search} className="flex w-full max-w-sm items-center gap-2 rounded-full border border-[#dce3d9] bg-white/60 px-4 py-2.5"><Search size={16} className="text-ink/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/30" />{searching ? <LoaderCircle className="animate-spin text-moss" size={16} /> : <button type="submit" aria-label="Search books"><ArrowRight size={16} className="text-moss" /></button>}</form>} /><div className="mb-10 flex flex-wrap items-center gap-2"><Pill>picked for your calm</Pill><span className="text-sm text-ink/45">Based on your recent reflection: hopeful</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{books.map((book, index) => <BookCard key={book.id || book._id || index} book={book} featured={index === 0} />)}</div><div className="mt-14 rounded-[26px] bg-[#e5ecdf] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-moss">slow recommendation</p><h2 className="mt-3 font-display text-3xl tracking-[-0.04em]">Read one page without needing to finish.</h2></div><Link to="/journal"><Button variant="secondary">Pair it with a journal <ArrowRight size={15} /></Button></Link></div></div></div>;
}

function BookCard({ book, featured }) {
  return <article className={cn("group overflow-hidden rounded-[23px] border border-[#e0e6dd] bg-white/50 transition hover:-translate-y-1 hover:shadow-card", featured && "sm:col-span-2 lg:col-span-2")}><div className={cn("relative overflow-hidden bg-sage", featured ? "h-[300px]" : "h-[240px]")}><img src={book.image_url || cardArt.books} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute left-4 top-4"><Pill color="white">{featured ? "today's pick" : "for your shelf"}</Pill></div><button aria-label={`Save ${book.title}`} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink/60 backdrop-blur transition hover:text-clay"><Heart size={16} /></button></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-moss">{book.author || "ZenHeaven library"}</p><h3 className={cn("mt-2 font-display leading-[1.05] tracking-[-0.04em]", featured ? "text-3xl" : "text-2xl")}>{book.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-5 text-ink/50">{book.description || "A thoughtful companion for wherever you are today."}</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-moss">View details <ArrowRight size={13} /></button></div></article>;
}

function MusicPage() {
  const [songs, setSongs] = useState(fallbackSongs);
  const [playing, setPlaying] = useState(null);
  useEffect(() => { apiFetch("/songs").then((data) => { if (data.songs?.length) setSongs(data.songs.slice(0, 8).map((name, index) => ({ name, artist: ["Soft Focus Radio", "The Quiet Hours", "Stillwater", "Sunday Club"][index % 4], mood: ["soft focus", "reflective", "uplift", "deep rest"][index % 4], color: fallbackSongs[index % 4].color }))); }).catch(() => {}); }, []);
  return <div className="float-in"><PageHeading eyebrow="sound for the inside" title="Press play on a better atmosphere." description="A small collection of songs for the shape your day is taking." action={<Button variant="secondary"><SlidersHorizontal size={16} /> Tune the mood</Button>} /><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="relative min-h-[310px] overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9"><img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen" /><div className="relative z-10 flex h-full flex-col justify-between"><div><Pill color="white">now playing · curated for you</Pill><h2 className="mt-12 font-display text-5xl tracking-[-0.06em]">The art of<br /><span className="text-clay">staying soft.</span></h2></div><div className="flex items-center justify-between"><p className="text-sm text-white/60">42 minutes · ambient / acoustic</p><button onClick={() => setPlaying(playing === "mix" ? null : "mix")} className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition hover:scale-105">{playing === "mix" ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button></div></div></div><div className="rounded-[28px] border border-[#e0e6dd] bg-white/50 p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">your listening note</p><h3 className="mt-3 font-display text-3xl tracking-[-0.04em]">How do you want to feel?</h3></div><Music2 className="text-clay" size={22} /></div><div className="mt-8 flex flex-wrap gap-2">{["grounded", "open", "focused", "rested"].map((mood, index) => <button key={mood} className={cn("rounded-full px-4 py-2.5 text-xs font-bold capitalize", index === 0 ? "bg-ink text-white" : "bg-sage text-moss")}>{mood}</button>)}</div><p className="mt-8 text-sm leading-6 text-ink/50">We’ll shape a little listening room around your answer.</p></div></div><div className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl tracking-[-0.04em]">Today’s shelf</h2><span className="text-xs font-semibold text-ink/35">{songs.length} tracks</span></div><div className="grid gap-3 sm:grid-cols-2">{songs.map((song, index) => <button key={`${song.name}-${index}`} onClick={() => setPlaying(playing === index ? null : index)} className="group flex items-center gap-4 rounded-[20px] border border-[#e0e6dd] bg-white/45 p-3 text-left transition hover:bg-white"><span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-[15px] text-ink/55", song.color || "bg-sage")}>{playing === index ? <Pause size={17} /> : <Music2 size={18} />}</span><span className="min-w-0 flex-1"><span className="block truncate font-display text-xl tracking-[-0.03em]">{song.name}</span><span className="mt-0.5 block text-xs text-ink/45">{song.artist} · {song.mood}</span></span><span className="grid h-9 w-9 place-items-center rounded-full bg-sage/60 text-moss opacity-0 transition group-hover:opacity-100">{playing === index ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}</span></button>)}</div></div></div>;
}

function TherapistsPage({ user }) {
  const [therapists, setTherapists] = useState(fallbackTherapists);
  const [selected, setSelected] = useState(null);
  const [booked, setBooked] = useState(false);
  useEffect(() => { apiFetch("/therapists/").then((data) => { if (data.length) setTherapists(data); }).catch(() => {}); }, []);
  return <div className="float-in"><PageHeading eyebrow="human support" title="Meet your people." description="Finding the right support can take time. Browse at your own pace — there’s no pressure to book." action={<Button variant="secondary"><SlidersHorizontal size={16} /> Filter therapists</Button>} /><div className="mb-8 flex items-center gap-3 rounded-[18px] border border-[#e0e6dd] bg-white/45 p-4 text-sm text-ink/60"><ShieldCheck size={18} className="shrink-0 text-moss" /><span>All practitioners are verified and sessions are private, secure, and built around your comfort.</span></div><div className="grid gap-5 lg:grid-cols-3">{therapists.map((therapist, index) => <article key={therapist._id || therapist.id || index} className="group overflow-hidden rounded-[24px] border border-[#e0e6dd] bg-white/50 transition hover:-translate-y-1 hover:shadow-card"><div className="relative h-56 overflow-hidden bg-sage"><img src={therapist.photo_url || fallbackTherapists[index % 3].photo_url} alt="" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" /><span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold backdrop-blur"><Star size={12} className="fill-clay text-clay" /> {therapist.rating || "4.8"}</span></div><div className="p-5"><h3 className="font-display text-2xl tracking-[-0.04em]">{therapist.name}</h3><p className="mt-1 text-xs text-ink/45">{therapist.experience_years || 8} years of experience · {therapist.languages?.join(", ") || "English"}</p><div className="mt-4 flex flex-wrap gap-1.5">{(therapist.specializations || ["Wellness"]).slice(0, 3).map((specialization) => <span key={specialization} className="rounded-full bg-sage px-2.5 py-1 text-[10px] font-bold text-moss">{specialization}</span>)}</div><p className="mt-4 line-clamp-2 text-sm leading-5 text-ink/55">{therapist.bio}</p><div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4"><span className="text-xs text-ink/45"><strong className="text-ink">${therapist.hourly_rate || 100}</strong> / session</span><button onClick={() => { setSelected(therapist); setBooked(false); }} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-moss">View profile <ArrowRight size={13} /></button></div></div></article>)}</div>{selected && <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[28px] bg-sand p-6 shadow-soft sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">a good next step</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em]">{selected.name}</h2></div><button onClick={() => setSelected(null)}><X size={19} className="text-ink/40" /></button></div><div className="mt-7 rounded-[20px] bg-white/70 p-4"><div className="flex items-center gap-3 text-sm font-semibold"><CalendarDays size={17} className="text-moss" /> Choose a time that feels okay</div><div className="mt-4 grid grid-cols-3 gap-2">{["Tue 08", "Wed 09", "Thu 10"].map((day, index) => <button key={day} className={cn("rounded-[13px] border px-2 py-3 text-xs font-bold", index === 0 ? "border-ink bg-ink text-white" : "border-[#dce3d9] text-ink/55")}>{day}<span className="mt-1 block text-[10px] font-normal opacity-60">{index + 2}:00 PM</span></button>)}</div></div>{booked ? <div className="mt-5 flex items-center gap-2 rounded-[16px] bg-sage p-4 text-sm font-semibold text-moss"><Check size={17} /> Your request is saved. We’ll be in touch soon.</div> : <Button onClick={() => setBooked(true)} className="mt-5 w-full">Request a first session <ArrowRight size={16} /></Button>}<p className="mt-4 text-center text-[11px] text-ink/35">{user.email} · ${selected.hourly_rate || 100} per session</p></div></div>}</div>;
}

function CoinsPage({ user }) {
  const [balance, setBalance] = useState(user.calm_coins ?? 100);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { Promise.allSettled([apiFetch("/coins/balance"), apiFetch("/coins/transactions")]).then(([balanceResult, transactionResult]) => { if (balanceResult.status === "fulfilled") setBalance(balanceResult.value.balance); if (transactionResult.status === "fulfilled") setTransactions(transactionResult.value); }); }, []);
  const displayTransactions = transactions.length ? transactions : [{ amount: 10, transaction_type: "earn", source: "journal", description: "Created a new journal entry", timestamp: "2026-09-05T08:00:00.000Z" }, { amount: 5, transaction_type: "earn", source: "mental_health_chat", description: "Checked in with CalmBot", timestamp: "2026-09-04T18:00:00.000Z" }, { amount: 50, transaction_type: "earn", source: "welcome", description: "Welcome to ZenHeaven", timestamp: "2026-09-01T10:00:00.000Z" }];
  return <div className="float-in"><PageHeading eyebrow="a little encouragement" title="Calm Coins." description="A gentle reward for showing up for yourself. Nothing to optimize — just small signals that your care matters." /><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9"><div className="relative z-10"><Pill color="white">your balance</Pill><div className="mt-9 flex items-end gap-3"><span className="font-display text-8xl leading-none">{balance}</span><Coins size={31} className="mb-2 text-clay" /></div><p className="mt-3 text-sm text-white/50">calm coins available</p><div className="mt-10 flex items-center gap-3 text-xs font-semibold text-white/50"><span className="h-2 w-2 rounded-full bg-clay" /> Keep choosing the small good thing.</div></div><div className="absolute -right-12 -top-20 h-60 w-60 rounded-full border-[32px] border-white/10" /></div><div className="rounded-[28px] bg-[#e6eedf] p-7 sm:p-9"><div className="flex items-center gap-2 text-moss"><Sparkles size={17} /><span className="text-xs font-bold uppercase tracking-[0.15em]">how to collect</span></div><div className="mt-7 space-y-4"><CoinRule icon={MessageCircle} title="Talk with CalmBot" coins="+5" /><CoinRule icon={BookHeart} title="Write a journal entry" coins="+10" /><CoinRule icon={Heart} title="Complete a daily check-in" coins="+5" /></div></div></div><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_.8fr]"><div><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl tracking-[-0.04em]">Recent movement</h2><button className="text-xs font-bold uppercase tracking-[0.13em] text-moss">See all</button></div><div className="overflow-hidden rounded-[22px] border border-[#e0e6dd] bg-white/45">{displayTransactions.map((transaction, index) => <div key={transaction._id || index} className="flex items-center gap-4 border-b border-[#e5e9e2] p-4 last:border-0"><span className="grid h-10 w-10 place-items-center rounded-full bg-sage text-moss"><TrendingUp size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{transaction.description}</span><span className="mt-1 block text-xs capitalize text-ink/40">{transaction.source?.replaceAll("_", " ")} · {formatDate(transaction.timestamp)}</span></span><span className="font-display text-xl text-moss">+{transaction.amount}</span></div>)}</div></div><div className="rounded-[22px] border border-[#e0e6dd] bg-white/45 p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4dfd4] text-clay"><Star size={17} /></span><div><p className="text-sm font-bold">First steps</p><p className="text-xs text-ink/45">You started your journey.</p></div></div><div className="mt-7 h-2 rounded-full bg-sage"><div className="h-full w-full rounded-full bg-moss" /></div><p className="mt-3 text-xs text-moss">Achievement unlocked · +50 coins</p></div></div></div>;
}

function CoinRule({ icon: Icon, title, coins }) {
  return <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-moss"><Icon size={16} /></span><span className="flex-1 text-sm font-semibold text-ink/75">{title}</span><span className="text-sm font-bold text-moss">{coins}</span></div>;
}

export default App;
