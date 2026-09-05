import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, ArrowUpRight, Award, BarChart3, Bell, BookOpen, BookOpenText,
  Brain, CalendarDays, Check, ChevronRight, CircleHelp, Coins, Heart, Home,
  Leaf, Library, LogOut, Menu, MessageCircle, Mic2, Moon, MoreHorizontal,
  Music2, PenLine, Play, Plus, Search, Send, Settings, ShieldCheck, Sparkles,
  Star, Sun, Sunrise, UserRound, Users, X, Zap,
} from "lucide-react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api, streamChat } from "./lib/api";
import {
  demoBooks, demoEntries, demoMessages, demoSongs, demoTherapists, demoThreads,
} from "./lib/demoData";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/chat", label: "CalmBot", icon: MessageCircle },
  { to: "/journal", label: "Journal", icon: PenLine },
  { to: "/books", label: "Library", icon: BookOpen },
  { to: "/music", label: "Soundscapes", icon: Music2 },
  { to: "/therapists", label: "Care team", icon: Users },
  { to: "/coins", label: "Calm Coins", icon: Coins },
];

const moods = [
  { name: "Peaceful", emoji: "◌", color: "bg-[#c7eb92]" },
  { name: "Good", emoji: "☼", color: "bg-[#e7d58a]" },
  { name: "Low", emoji: "◡", color: "bg-[#aec7da]" },
  { name: "Anxious", emoji: "⌁", color: "bg-[#d4a887]" },
];

const formatDate = (date) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));

function Logo({ compact = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${compact ? "" : "w-fit"}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#c7eb92]/70">
        <span className="h-3 w-3 rounded-full bg-[#c7eb92] shadow-[0_0_14px_#c7eb92]" />
        <span className="absolute h-5 w-5 rounded-full border border-[#c7eb92]/40" />
      </span>
      {!compact && <span className="font-display text-xl tracking-tight text-[#edf3e9]">zenheaven</span>}
    </Link>
  );
}

function Button({ children, className = "", variant = "primary", ...props }) {
  return <button className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`} {...props}>{children}</button>;
}

function PageHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-4xl tracking-tight text-[#f0f5ec] md:text-5xl">{title}</h1>
        {copy && <p className="mt-3 max-w-xl text-sm leading-6 text-[#899688]">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

function Sidebar({ onClose }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("zenheaven_user") || '{"full_name":"Amara","username":"amara"}');
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#0d1110] px-5 py-7 lg:translate-x-0">
      <div className="mb-12 flex items-center justify-between px-2">
        <Logo />
        <button className="text-[#7b897a] lg:hidden" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
      </div>
      <div className="mb-5 px-3"><p className="eyebrow">Your rhythm</p></div>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? "bg-[#c7eb92]/10 font-semibold text-[#c7eb92]" : "text-[#839082] hover:bg-white/[0.045] hover:text-[#dce8d5]"}`}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {to === "/chat" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c7eb92]" />}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-1">
        <Link to="/journal" className="mb-5 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7eb92]/10 text-[#c7eb92]"><Sunrise size={18} /></div>
          <div><p className="text-xs font-semibold text-[#dce8d5]">Daily check-in</p><p className="mt-0.5 text-[10px] text-[#72806f]">A moment for yourself</p></div>
          <ChevronRight size={15} className="ml-auto text-[#71816f]" />
        </Link>
        <div className="flex items-center gap-3 border-t border-white/[0.07] px-2 pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c7eb92] to-[#718c70] text-xs font-bold text-[#172015]">{(user.full_name || user.username || "A").slice(0, 1)}</div>
          <div className="min-w-0"><p className="truncate text-xs font-semibold text-[#dce8d5]">{user.full_name || user.username || "Amara"}</p><p className="text-[10px] text-[#71806f]">Member since today</p></div>
          <Settings size={15} className="ml-auto text-[#71806f]" />
        </div>
      </div>
      <span className="sr-only">{location.pathname}</span>
    </aside>
  );
}

function MobileHeader({ onMenu }) {
  const location = useLocation();
  const current = navItems.find((item) => location.pathname.startsWith(item.to));
  return (
    <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 lg:hidden">
      <button onClick={onMenu} className="text-[#a4b29e]" aria-label="Open menu"><Menu size={21} /></button>
      <div className="flex items-center gap-2"><Logo compact /><span className="text-xs font-semibold text-[#95a592]">{current?.label}</span></div>
      <Link to="/coins" className="text-[#c7eb92]"><Coins size={19} /></Link>
    </header>
  );
}

function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="grain min-h-screen bg-[#0a0d0c]">
      <div className={`fixed inset-0 z-30 bg-black/50 transition lg:hidden ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setMenuOpen(false)} />
      <div className={`transition-transform duration-300 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}><Sidebar onClose={() => setMenuOpen(false)} /></div>
      <div className="lg:pl-[252px]"><MobileHeader onMenu={() => setMenuOpen(true)} /><main className="mx-auto min-h-screen max-w-[1500px] px-5 py-7 md:px-10 md:py-10">{children}</main></div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="grain min-h-screen overflow-hidden bg-[#0a0d0c]">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <Logo />
        <div className="hidden items-center gap-8 text-xs text-[#9ba998] md:flex"><a href="#approach">Approach</a><a href="#rituals">Rituals</a><a href="#care">Care, your way</a></div>
        <div className="flex items-center gap-3"><Link to="/login" className="hidden text-sm text-[#c3d0bd] sm:block">Sign in</Link><Button onClick={() => navigate("/register")} className="px-4 py-2.5 text-xs">Begin gently <ArrowRight size={14} /></Button></div>
      </nav>
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 pt-16 md:grid-cols-[1.05fr_.95fr] md:px-10 md:pb-36 md:pt-24">
          <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-[#94ad73]/10 blur-[100px]" />
          <div className="relative z-10">
            <p className="eyebrow mb-6 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#c7eb92]" />A softer way forward</p>
            <h1 className="max-w-3xl font-display text-6xl leading-[.98] tracking-[-.045em] text-[#eef4eb] md:text-8xl">Feel more <span className="text-[#c7eb92]">like yourself.</span></h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#91a18f] md:text-lg">ZenHeaven brings your everyday signals, reflections and support into one quietly intelligent space — so feeling well can become a rhythm, not a resolution.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Button onClick={() => navigate("/register")}>Start your rhythm <ArrowUpRight size={16} /></Button><a href="#approach" className="flex items-center gap-2 px-2 text-sm text-[#9eae9c]">See how it works <ChevronRight size={16} /></a></div>
            <div className="mt-14 flex items-center gap-4"><div className="flex -space-x-2">{["#c7eb92", "#d7b899", "#adc8d5", "#bcb3dc"].map((color) => <span key={color} style={{ background: color }} className="h-8 w-8 rounded-full border-2 border-[#0a0d0c]" />)}</div><p className="text-xs leading-5 text-[#70806d]"><span className="text-[#d1dccb]">12,000+ people</span><br />making room for better days</p></div>
          </div>
          <div className="relative mx-auto h-[420px] w-full max-w-[520px] md:h-[520px]">
            <div className="absolute inset-10 rounded-full border border-[#d2efb2]/10" /><div className="absolute inset-20 rounded-full border border-[#d2efb2]/10" /><div className="orb left-[20%] top-[10%] h-[68%] w-[68%] shadow-[0_0_120px_rgba(199,235,146,.2)]" />
            <div className="absolute left-[12%] top-[8%] max-w-[150px] rounded-2xl border border-white/10 bg-[#182019]/80 p-4 shadow-2xl backdrop-blur-xl"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] text-[#879786]">Today</span><Activity size={13} className="text-[#c7eb92]" /></div><p className="font-display text-3xl text-[#e8f0e4]">87</p><p className="mt-1 text-[10px] text-[#a3b39e]">Readiness score</p><div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-full w-[87%] rounded-full bg-[#c7eb92]" /></div></div>
            <div className="absolute bottom-[13%] right-[3%] w-[180px] rounded-2xl border border-white/10 bg-[#182019]/80 p-4 shadow-2xl backdrop-blur-xl"><p className="text-[10px] text-[#879786]">Your energy</p><div className="mt-3 flex h-12 items-end gap-1.5">{[25, 39, 32, 59, 42, 76, 61, 82, 70, 91].map((height, i) => <span key={i} style={{ height: `${height}%` }} className={`w-2 rounded-full ${i > 6 ? "bg-[#c7eb92]" : "bg-[#6f8d6a]/70"}`} />)}</div><p className="mt-3 text-[10px] text-[#a3b39e]">A gentle upward trend</p></div>
            <div className="absolute bottom-[24%] left-[22%] flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#0d120f]/60 text-center backdrop-blur"><div><p className="font-display text-3xl text-[#e9f1e5]">7.8</p><p className="mt-1 text-[9px] uppercase tracking-widest text-[#7e917a]">sleep</p></div></div>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[.28em] text-[#72826f]">A little data. A lot more you.</p>
          </div>
        </section>
        <section id="approach" className="border-y border-white/[0.07] bg-[#0e1310]"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[.7fr_1.3fr] md:px-10 md:py-28"><div><p className="eyebrow mb-5">Not another dashboard</p><h2 className="max-w-sm font-display text-4xl leading-tight text-[#e7efe3] md:text-5xl">Wellbeing is a conversation.</h2></div><div className="grid gap-8 text-sm leading-7 text-[#8e9f8d] md:grid-cols-2"><p>Patterns are useful when they help you notice yourself. ZenHeaven turns sleep, mood and energy into context you can actually feel — never a score to chase.</p><p>Your private corner for the small things that shift a day: a check-in, a page, a song, or a conversation with someone who knows how to listen.</p></div></div></section>
        <section id="rituals" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"><p className="eyebrow mb-5">Your daily rituals</p><h2 className="max-w-xl font-display text-4xl leading-tight text-[#e7efe3] md:text-5xl">Small signals.<br /><span className="text-[#91a58b]">Meaningful shifts.</span></h2><div className="mt-14 grid gap-4 md:grid-cols-3"><FeatureCard icon={PenLine} number="01" title="Reflect" copy="A journal that listens for patterns, then gives you space to decide what they mean." /><FeatureCard icon={Music2} number="02" title="Regulate" copy="Soundscapes chosen for the state you are in — and the state you want to gently reach." /><FeatureCard icon={MessageCircle} number="03" title="Connect" copy="An always-on, never-judging first conversation, with real care when you need more." /></div></section>
        <section id="care" className="mx-6 overflow-hidden rounded-[2rem] bg-[#c7eb92] md:mx-10"><div className="mx-auto grid max-w-7xl items-center gap-8 px-7 py-14 md:grid-cols-[1fr_auto] md:px-14 md:py-20"><div><p className="eyebrow text-[#4e6548]">Your pace, your care</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-[#172116] md:text-6xl">There is no right way to feel better.</h2></div><Button onClick={() => navigate("/register")} className="w-fit bg-[#182016] text-[#d7f3ba] hover:bg-[#283726]">Make a little room <ArrowRight size={16} /></Button></div></section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-xs text-[#70806d] md:flex-row md:items-center md:justify-between md:px-10"><Logo /><span>© 2025 ZenHeaven. A gentler operating system for being human.</span></footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, number, title, copy }) {
  return <div className="glass rounded-[1.5rem] p-7 transition hover:-translate-y-1 hover:border-[#c7eb92]/20"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c7eb92]/10 text-[#c7eb92]"><Icon size={20} /></span><span className="font-display text-3xl text-white/15">{number}</span></div><h3 className="mt-14 font-display text-2xl text-[#e1ebdd]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#879687]">{copy}</p></div>;
}

function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = isRegister ? await api.register(form) : await api.login({ username: form.username, password: form.password });
      localStorage.setItem("zenheaven_token", result.access_token);
      localStorage.setItem("zenheaven_user", JSON.stringify(result.user));
      navigate("/dashboard");
    } catch (requestError) {
      if (import.meta.env.DEV) {
        localStorage.setItem("zenheaven_token", "demo-session");
        localStorage.setItem("zenheaven_user", JSON.stringify({ username: form.username || "amara", full_name: form.full_name || "Amara", calm_coins: 248 }));
        navigate("/dashboard");
      } else setError(requestError.message);
    } finally { setBusy(false); }
  };
  return <div className="grain flex min-h-screen bg-[#0a0d0c]"><div className="relative hidden w-[46%] overflow-hidden bg-[#111811] p-12 lg:block"><div className="orb -left-32 top-1/4 h-[520px] w-[520px] opacity-50" /><Logo /><div className="absolute bottom-16 left-12 right-12"><p className="eyebrow mb-5">A softer way forward</p><p className="max-w-md font-display text-5xl leading-tight text-[#e4eee0]">"The day gets lighter when you give yourself somewhere to put it."</p><p className="mt-6 text-sm text-[#839581]">A private space for noticing, reflecting and finding your next gentle step.</p></div></div><div className="flex flex-1 items-center justify-center p-6"><div className="w-full max-w-[410px]"><div className="mb-12 lg:hidden"><Logo /></div><p className="eyebrow mb-4">{isRegister ? "Start with yourself" : "Welcome back"}</p><h1 className="font-display text-4xl text-[#edf4e9]">{isRegister ? "Begin gently." : "Good to see you."}</h1><p className="mt-3 text-sm leading-6 text-[#859484]">{isRegister ? "Create your private space for better days." : "Your rhythm is here when you are ready."}</p><form onSubmit={submit} className="mt-9 space-y-4">{isRegister && <input className="field" placeholder="Your name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />}<input className="field" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />{isRegister && <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />}<input className="field" type="password" placeholder="Password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />{error && <p className="rounded-xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-xs text-red-200">{error}</p>}<Button className="mt-2 w-full" disabled={busy}>{busy ? "Finding your space..." : isRegister ? "Create my space" : "Enter ZenHeaven"} <ArrowRight size={16} /></Button></form><p className="mt-8 text-center text-sm text-[#7e8f7c]">{isRegister ? "Already have a space?" : "New here?"} <button className="font-semibold text-[#c7eb92]" onClick={() => navigate(isRegister ? "/login" : "/register")}>{isRegister ? "Sign in" : "Create one"}</button></p><p className="mt-10 text-center text-[10px] leading-5 text-[#5f6c5e]">Your wellbeing data belongs to you. We keep it private, encrypted and human.</p></div></div></div>;
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("zenheaven_user") || '{"full_name":"Amara","calm_coins":248}');
  const [mood, setMood] = useState(null);
  const [balance, setBalance] = useState(user.calm_coins || 248);
  useEffect(() => { api.coinBalance().then((data) => setBalance(data.balance)).catch(() => {}); }, []);
  return <><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-3">Monday, October 14 · 08:42</p><h1 className="font-display text-4xl text-[#edf4e9] md:text-5xl">Good morning, {user.full_name?.split(" ")[0] || "Amara"}.</h1><p className="mt-3 text-sm text-[#899a88]">Here is a little window into how you are doing.</p></div><button className="flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2.5 text-xs text-[#a6b4a1]"><Bell size={15} /> Your morning summary</button></div><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="relative overflow-hidden rounded-[1.7rem] bg-[#c7eb92] p-7 text-[#172116] md:p-9"><div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[36px] border-[#a5ce82]/35" /><div className="relative z-10 flex flex-wrap items-start justify-between gap-6"><div><p className="eyebrow text-[#55704e]">Today's readiness</p><h2 className="mt-3 max-w-md font-display text-4xl leading-tight md:text-5xl">Your energy is asking for a little momentum.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#4c6549]">You slept well and your resting heart rate is steady. A good day for one meaningful thing.</p></div><div className="ring-chart h-36 w-36 shrink-0"><div className="text-center"><span className="font-display text-5xl">87</span><span className="block text-[9px] uppercase tracking-[.2em] text-[#61755b]">ready</span></div></div></div><div className="relative z-10 mt-9 flex flex-wrap gap-2"><span className="rounded-full bg-[#182016]/10 px-3 py-1.5 text-xs font-semibold">↑ 8% from yesterday</span><span className="rounded-full bg-[#182016]/10 px-3 py-1.5 text-xs font-semibold">within your baseline</span></div></section><section className="glass rounded-[1.7rem] p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">How are you feeling?</p><h2 className="mt-2 font-display text-2xl text-[#e8f0e5]">Check in with yourself.</h2></div><Heart size={19} className="text-[#c7eb92]" /></div><div className="mt-7 grid grid-cols-4 gap-2">{moods.map((item) => <button key={item.name} onClick={() => setMood(item.name)} className={`rounded-2xl border p-3 text-center transition ${mood === item.name ? "border-[#c7eb92]/60 bg-[#c7eb92]/10" : "border-white/[0.08] hover:bg-white/[0.05]"}`}><span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#273424] ${item.color}`}>{item.emoji}</span><span className="mt-2 block text-[10px] text-[#879786]">{item.name}</span></button>)}</div><p className="mt-5 text-xs text-[#70806d]">{mood ? `Noted. ${mood} is welcome here.` : "There is no wrong answer — just notice what is here."}</p></section></div><div className="mt-5 grid gap-5 md:grid-cols-3"><MetricCard icon={Moon} label="Sleep" value="7h 48m" detail="90% efficiency" tone="blue" /><MetricCard icon={Activity} label="Resting heart rate" value="58 bpm" detail="−2 from baseline" tone="green" /><MetricCard icon={Coins} label="Calm Coins" value={balance} detail="↑ 35 this week" tone="gold" /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><section className="glass rounded-[1.7rem] p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Your week</p><h2 className="mt-2 font-display text-2xl text-[#e8f0e5]">A steady, rising rhythm.</h2></div><button className="text-[#92a28d]"><MoreHorizontal size={20} /></button></div><div className="mt-8 flex h-36 items-end justify-between gap-3 border-b border-white/[0.08] px-2">{[55, 65, 49, 77, 69, 88, 82].map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className={`w-full max-w-[42px] rounded-t-lg ${index === 6 ? "bg-[#c7eb92]" : "bg-[#6c8e68]/45"}`} style={{ height: `${height}%` }} /><span className="text-[10px] text-[#72816f]">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div><div className="mt-5 flex items-center justify-between text-xs text-[#7e8f7b]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#c7eb92]" /> readiness</span><span>Strongest on Saturday</span></div></section><section className="rounded-[1.7rem] border border-white/[0.08] bg-[#121916] p-7"><p className="eyebrow">A little nudge</p><h2 className="mt-3 font-display text-2xl leading-tight text-[#e8f0e5]">You have 8 quiet minutes.</h2><p className="mt-3 text-sm leading-6 text-[#899988]">Try a breathing reset before the day picks up.</p><Link to="/music" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-[#c7eb92]">Find your calm <ArrowRight size={14} /></Link></section></div></>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }) {
  const colors = { blue: "bg-[#b8d6e8]/15 text-[#afd3e9]", green: "bg-[#c7eb92]/15 text-[#c7eb92]", gold: "bg-[#ead48b]/15 text-[#e8d38a]" };
  return <div className="glass rounded-2xl p-5"><div className="flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[tone]}`}><Icon size={17} /></span><ArrowUpRight size={15} className="text-[#647264]" /></div><p className="mt-5 text-xs text-[#829181]">{label}</p><p className="mt-1 font-display text-2xl text-[#e7efe4]">{value}</p><p className="mt-1 text-[10px] text-[#849580]">{detail}</p></div>;
}

function Chat() {
  const [threads, setThreads] = useState(demoThreads);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => { api.threads().then((data) => setThreads(data.threads || [])).catch(() => {}); }, []);
  const openThread = async (thread) => { setActiveThread(thread.id); try { const data = await api.thread(thread.id); setMessages(data.messages || []); } catch { if (thread.id === "demo-1") setMessages(demoMessages); } };
  const send = async (event) => {
    event.preventDefault(); const message = input.trim(); if (!message || sending) return;
    setInput(""); setSending(true); setThinking("Finding the thread in what you shared…"); setMessages((items) => [...items, { id: `u-${Date.now()}`, content: message, is_user: true, timestamp: new Date().toISOString() }, { id: `a-${Date.now()}`, content: "", is_user: false, timestamp: new Date().toISOString() }]);
    let streamed = false;
    try {
      await streamChat({ message, thread_id: activeThread === "demo-1" ? null : activeThread }, {
        thread_id: (id) => { setActiveThread(id); },
        thinking: (value) => setThinking(value),
        token: (value) => { streamed = true; setThinking(""); setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: item.content + value } : item)); },
        complete: () => { setThinking(""); },
        error: () => { setThinking(""); },
      });
    } catch {
      const fallback = "That sounds like something worth meeting with kindness. Try naming the smallest part of it you can influence today — you do not have to solve the whole picture at once.";
      if (!streamed) setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: fallback } : item));
      setThinking("");
    } finally { setSending(false); }
  };
  return <div className="grid min-h-[calc(100vh-130px)] overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-[#0f1412] lg:grid-cols-[270px_1fr]"><aside className="hidden border-r border-white/[0.07] bg-[#111714] lg:block"><div className="flex items-center justify-between border-b border-white/[0.07] p-5"><div><p className="eyebrow">Your conversations</p><h2 className="mt-1 font-display text-xl text-[#e7efe3]">CalmBot</h2></div><button className="rounded-full bg-[#c7eb92] p-2 text-[#172116]"><Plus size={16} /></button></div><div className="scrollbar max-h-[calc(100vh-220px)] space-y-1 overflow-y-auto p-3">{threads.map((thread) => <button key={thread.id} onClick={() => openThread(thread)} className={`w-full rounded-xl p-3 text-left transition ${activeThread === thread.id ? "bg-[#c7eb92]/10" : "hover:bg-white/[0.04]"}`}><p className="truncate text-xs font-semibold text-[#d5e1d1]">{thread.title}</p><p className="mt-1 truncate text-[10px] text-[#728070]">{thread.last_message || "A new conversation"}</p><p className="mt-2 text-[9px] uppercase tracking-widest text-[#586656]">{thread.updated_at ? formatDate(thread.updated_at) : "Today"}</p></button>)}</div></aside><section className="flex min-h-[650px] flex-col"><div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 md:px-8"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7eb92]/10 text-[#c7eb92]"><Sparkles size={17} /></div><div><p className="text-sm font-semibold text-[#e2ebde]">{activeThread ? threads.find((thread) => thread.id === activeThread)?.title || "Your conversation" : "A quiet place to start"}</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#738472]"><span className="h-1.5 w-1.5 rounded-full bg-[#c7eb92]" /> CalmBot is here</p></div></div><button className="text-[#748474]"><CircleHelp size={18} /></button></div><div className="scrollbar flex-1 space-y-6 overflow-y-auto p-5 md:p-10"><div className="mx-auto max-w-2xl text-center"><span className="eyebrow">A conversation without an agenda</span><h1 className="mt-4 font-display text-3xl text-[#e9f1e6]">What is taking up a little space today?</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#829180]">Share as much or as little as feels right. I will meet you there.</p></div>{messages.map((message) => <div key={message.id} className={`mx-auto flex max-w-2xl gap-3 ${message.is_user ? "justify-end" : ""}`}>{!message.is_user && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c7eb92]/10 text-[#c7eb92]"><Sparkles size={14} /></div>}<div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.is_user ? "rounded-br-sm bg-[#c7eb92] text-[#1a2518]" : "rounded-bl-sm bg-white/[0.06] text-[#c4d0c0]"}`}>{message.content || <span className="inline-flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c7eb92]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c7eb92] [animation-delay:100ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c7eb92] [animation-delay:200ms]" /></span>}</div></div>)}{thinking && <p className="mx-auto max-w-2xl text-[10px] italic text-[#71816e]">{thinking}</p>}</div><div className="border-t border-white/[0.07] p-4 md:p-6"><form onSubmit={send} className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-2 pl-4"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[#e5eee2] outline-none placeholder:text-[#647161]" placeholder="Write what is on your mind…" /><button type="button" className="text-[#718170]"><Mic2 size={18} /></button><button type="submit" disabled={!input.trim() || sending} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7eb92] text-[#172116] disabled:opacity-30"><Send size={15} /></button></form><p className="mt-3 text-center text-[10px] text-[#526052]">CalmBot is a supportive tool, not a substitute for professional care.</p></div></section></div>;
}

function Journal() {
  const [entries, setEntries] = useState(demoEntries);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("calm");
  const [saving, setSaving] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  useEffect(() => { api.entries().then(setEntries).catch(() => {}); }, []);
  const save = async (event) => { event.preventDefault(); if (!content.trim()) return; setSaving(true); const payload = { content, mood: selectedMood, tags: ["reflection"] }; try { const result = await api.createEntry(payload); setEntries((items) => [result, ...items]); } catch { setEntries((items) => [{ _id: `local-${Date.now()}`, title: "A moment to keep", ...payload, created_at: new Date().toISOString() }, ...items]); } setContent(""); setShowComposer(false); setSaving(false); };
  return <><PageHeading eyebrow="Your inner weather" title="Journal" copy="A place to put the day down. Let the words be unfinished." action={<Button onClick={() => setShowComposer(true)}><Plus size={16} /> New entry</Button>} /><div className="grid gap-5 xl:grid-cols-[1fr_340px]"><div className="space-y-4">{entries.map((entry) => <article key={entry._id || entry.id} className="glass group rounded-[1.4rem] p-6 transition hover:border-[#c7eb92]/20"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-3"><span className="rounded-full bg-[#c7eb92]/10 px-2.5 py-1 text-[10px] font-semibold capitalize text-[#c7eb92]">{entry.mood || "reflection"}</span><span className="text-[10px] text-[#6e7c6b]">{formatDate(entry.created_at || Date.now())}</span></div><h2 className="mt-4 font-display text-2xl text-[#e4ede0]">{entry.title || "A moment to keep"}</h2></div><button className="text-[#667466] opacity-0 transition group-hover:opacity-100"><MoreHorizontal size={18} /></button></div><p className="mt-3 max-w-2xl text-sm leading-7 text-[#94a391]">{entry.content}</p><div className="mt-5 flex gap-2">{(entry.tags || []).map((tag) => <span key={tag} className="text-[10px] text-[#647362]">#{tag}</span>)}</div></article>)}{!entries.length && <div className="glass rounded-2xl p-12 text-center"><PenLine className="mx-auto text-[#c7eb92]" /><p className="mt-4 font-display text-2xl text-[#e4ede0]">Your first page is waiting.</p></div>}</div><aside className="space-y-5"><section className="rounded-[1.4rem] bg-[#c7eb92] p-6 text-[#172116]"><p className="eyebrow text-[#58724e]">Today’s invitation</p><p className="mt-5 font-display text-2xl leading-tight">What made you feel a little more like yourself today?</p><button onClick={() => { setContent("What made me feel more like myself today: "); setShowComposer(true); }} className="mt-6 flex items-center gap-2 text-xs font-bold text-[#42613d]">Write with this prompt <ArrowRight size={14} /></button></section><section className="glass rounded-[1.4rem] p-6"><div className="flex items-center justify-between"><p className="eyebrow">Your patterns</p><BarChart3 size={17} className="text-[#c7eb92]" /></div><div className="mt-6 flex items-end gap-2"><span className="font-display text-4xl text-[#e4ede0]">{entries.length || 0}</span><span className="mb-1 text-xs text-[#778777]">entries this month</span></div><div className="mt-6 grid grid-cols-7 items-end gap-1.5">{[28, 45, 35, 68, 54, 82, 76].map((height, i) => <span key={i} style={{ height: `${height}%` }} className="h-16 rounded-t bg-[#78976e]/50" />)}</div><p className="mt-4 text-[10px] text-[#738371]">The value is in noticing, not measuring.</p></section></aside></div>{showComposer && <Modal title="A page for today" onClose={() => setShowComposer(false)}><form onSubmit={save}><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} className="field min-h-40 resize-none leading-7" placeholder="Begin anywhere…" /><p className="eyebrow mt-6 mb-3">What is the weather inside?</p><div className="flex flex-wrap gap-2">{["calm", "hopeful", "good", "anxious", "tired"].map((mood) => <button type="button" key={mood} onClick={() => setSelectedMood(mood)} className={`rounded-full border px-3 py-2 text-xs capitalize ${selectedMood === mood ? "border-[#c7eb92] bg-[#c7eb92]/10 text-[#c7eb92]" : "border-white/[0.1] text-[#80907d]"}`}>{mood}</button>)}</div><Button className="mt-7 w-full" disabled={saving}>{saving ? "Saving your reflection…" : "Keep this moment"} <Check size={15} /></Button></form></Modal>}</>;
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[1.5rem] border border-white/[0.1] bg-[#131a16] p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl text-[#e5eee1]">{title}</h2><button onClick={onClose} className="text-[#788876]"><X size={19} /></button></div>{children}</div></div>;
}

function Books() {
  const [books, setBooks] = useState(demoBooks);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("calm");
  const search = async (event) => { event.preventDefault(); if (!query.trim()) return; try { const result = await api.searchBooks(query); setBooks(result.books || []); } catch { setBooks(demoBooks.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))); } };
  useEffect(() => { api.booksByMood().then((result) => result.books?.length && setBooks(result.books)).catch(() => {}); }, []);
  return <><PageHeading eyebrow="Pages for your season" title="The quiet library" copy="Books chosen to meet your mood, wherever it is today." /><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{["calm", "hopeful", "curious", "restless"].map((item) => <button key={item} onClick={() => setMood(item)} className={`rounded-full px-4 py-2 text-xs capitalize ${mood === item ? "bg-[#c7eb92] font-semibold text-[#172116]" : "border border-white/[0.1] text-[#899989]"}`}>{item}</button>)}</div><form onSubmit={search} className="flex w-full max-w-xs items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2.5"><Search size={15} className="text-[#6e7f6c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#647261]" placeholder="Search the library" /></form></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{books.map((book) => <article key={book.id} className="group overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[#121815]"><div className="relative h-56 overflow-hidden bg-[#253025]">{book.image_url ? <img src={book.image_url} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><BookOpenText size={44} className="text-[#c7eb92]/30" /></div>}<span className="absolute left-4 top-4 rounded-full bg-[#0d130f]/75 px-2.5 py-1 text-[10px] text-[#c7eb92] backdrop-blur">{mood} reading</span></div><div className="p-5"><h2 className="font-display text-xl text-[#e3ede0]">{book.title}</h2><p className="mt-1 text-xs text-[#899888]">{book.author}</p><p className="mt-4 line-clamp-2 text-xs leading-5 text-[#718071]">{book.description}</p><button className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#c7eb92]">Explore book <ArrowUpRight size={14} /></button></div></article>)}</div></>;
}

function Music() {
  const [songs, setSongs] = useState(demoSongs);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  useEffect(() => { api.songs().then((data) => data.songs?.length && setSongs(data.songs.slice(0, 8).map((name) => ({ name, artist: "ZenHeaven radio", mood: "Selected for you", color: "from-[#c7eb92]/30 to-[#6b8f67]/10" })))).catch(() => {}); }, []);
  const filtered = songs.filter((song) => `${song.name} ${song.artist}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading eyebrow="Sound for your nervous system" title="Soundscapes" copy="A considered soundtrack for whatever today needs." action={<div className="flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-2"><Search size={14} className="text-[#71816f]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-28 bg-transparent text-xs outline-none placeholder:text-[#687667]" placeholder="Find a song" /></div>} /><div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><section className="relative overflow-hidden rounded-[1.7rem] bg-[#182219] p-8 md:p-10"><div className="orb -right-20 -top-40 h-96 w-96 opacity-30" /><div className="relative z-10"><p className="eyebrow text-[#9eb394]">For your current pace</p><h2 className="mt-4 max-w-lg font-display text-4xl leading-tight text-[#e7f0e4] md:text-5xl">A little more open space.</h2><p className="mt-4 max-w-md text-sm leading-6 text-[#9aa895]">Slow, spacious sounds for when you want to make room around the thought.</p><div className="mt-12 flex items-center gap-5"><button onClick={() => setActive(songs[0])} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c7eb92] text-[#172116]"><Play size={20} fill="currentColor" /></button><div><p className="text-sm font-semibold text-[#dce8d8]">Morning spaciousness</p><p className="mt-1 text-xs text-[#80907d]">42 min · ambient, acoustic, soft edges</p></div></div></div><div className="waveform absolute bottom-8 left-8 right-8 h-12 opacity-30" /></section><section className="glass rounded-[1.7rem] p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d3b48e]/15 text-[#d3b48e]"><Sun size={19} /></div><div><p className="eyebrow">Your atmosphere</p><p className="mt-1 text-sm text-[#dce6d9]">Warm & grounded</p></div></div><p className="mt-7 text-sm leading-6 text-[#849383]">Based on your recent check-ins, we are keeping things low-tempo and gently optimistic.</p><div className="mt-7 space-y-3">{["Soft focus", "Evening exhale", "A walk inward"].map((label, i) => <button key={label} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.07] p-3 text-left hover:bg-white/[0.04]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-xs text-[#c7eb92]">0{i + 1}</span><span className="flex-1 text-xs text-[#a5b3a0]">{label}</span><ChevronRight size={14} className="text-[#697969]" /></button>)}</div></section></div><section className="mt-8"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">A playlist for right now</p><h2 className="mt-2 font-display text-2xl text-[#e7f0e4]">Your gentle rotation</h2></div><span className="text-xs text-[#71816f]">{filtered.length} tracks</span></div><div className="space-y-2">{filtered.map((song, index) => <button key={`${song.name}-${index}`} onClick={() => setActive(song)} className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-white/[0.08] hover:bg-white/[0.03]"><span className="w-5 text-center text-xs text-[#586756] group-hover:hidden">{String(index + 1).padStart(2, "0")}</span><Play size={14} className="hidden text-[#c7eb92] group-hover:block" /><span className={`h-11 w-11 rounded-xl bg-gradient-to-br ${song.color || "from-[#c7eb92]/30 to-[#6b8f67]/10"}`} /><span className="flex-1"><span className="block text-sm font-semibold text-[#dbe7d8]">{song.name}</span><span className="mt-1 block text-[10px] text-[#71816f]">{song.artist}</span></span><span className="hidden text-[10px] uppercase tracking-widest text-[#6c7c6a] sm:block">{song.mood}</span><MoreHorizontal size={17} className="text-[#687667]" /></button>)}</div></section>{active && <div className="fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-4 rounded-2xl border border-[#c7eb92]/20 bg-[#19241a]/95 p-3 shadow-2xl backdrop-blur-xl"><button onClick={() => setActive(null)} className="text-[#71816f]"><X size={16} /></button><span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c7eb92]/40 to-[#6b8f67]/20" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#dfebdc]">{active.name}</p><p className="text-[10px] text-[#80917d]">{active.artist}</p></div><button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c7eb92] text-[#172116]"><PauseIcon /></button><div className="hidden h-1 w-24 rounded bg-[#c7eb92]/40 sm:block" /></div>}</>;
}

function PauseIcon() { return <span className="flex gap-1"><span className="h-3 w-0.5 bg-current" /><span className="h-3 w-0.5 bg-current" /></span>; }

function Therapists() {
  const [therapists, setTherapists] = useState(demoTherapists);
  const [specialty, setSpecialty] = useState("All focus areas");
  const [selected, setSelected] = useState(null);
  useEffect(() => { api.therapists().then((data) => data.length && setTherapists(data)).catch(() => {}); }, []);
  const filtered = therapists.filter((person) => specialty === "All focus areas" || person.specializations?.includes(specialty));
  const specialties = ["All focus areas", ...new Set(therapists.flatMap((person) => person.specializations || []))];
  return <><PageHeading eyebrow="Support, with a human face" title="Your care team" copy="Finding support is a brave thing. Start with someone who feels like a good fit." /><div className="mb-8 flex gap-2 overflow-x-auto pb-1">{specialties.slice(0, 6).map((item) => <button key={item} onClick={() => setSpecialty(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${specialty === item ? "bg-[#c7eb92] font-semibold text-[#172116]" : "border border-white/[0.1] text-[#879687]"}`}>{item}</button>)}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((person) => <article key={person._id || person.id} className="glass overflow-hidden rounded-[1.5rem]"><div className="relative h-48 bg-[#253025]">{person.photo_url && <img src={person.photo_url} alt="" className="h-full w-full object-cover opacity-80" />}<div className="absolute inset-0 bg-gradient-to-t from-[#111815] to-transparent" /><div className="absolute bottom-4 left-5 flex items-center gap-2"><span className="flex items-center gap-1 rounded-full bg-[#172116]/80 px-2.5 py-1 text-[10px] text-[#c7eb92]"><Star size={11} fill="currentColor" /> {person.rating || "4.8"}</span><span className="rounded-full bg-[#172116]/80 px-2.5 py-1 text-[10px] text-[#b8c8b3]">{person.experience_years} years</span></div></div><div className="p-5"><h2 className="font-display text-2xl text-[#e3ede0]">{person.name}</h2><div className="mt-2 flex flex-wrap gap-1.5">{(person.specializations || []).slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-[#899989]">{tag}</span>)}</div><p className="mt-4 text-xs leading-5 text-[#809080]">{person.bio}</p><div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4"><span className="text-xs text-[#879687]"><span className="font-semibold text-[#dfe9dc]">${person.hourly_rate}</span> / session</span><Button onClick={() => setSelected(person)} className="px-4 py-2 text-xs">View profile</Button></div></div></article>)}</div>{selected && <TherapistModal person={selected} onClose={() => setSelected(null)} />}</>;
}

function TherapistModal({ person, onClose }) {
  const [booked, setBooked] = useState(false);
  const book = async () => {
    const user = JSON.parse(localStorage.getItem("zenheaven_user") || "{}");
    try { await api.bookAppointment({ user_id: user.id || "demo-user", therapist_id: person._id || person.id, date: new Date(Date.now() + 86400000).toISOString(), start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString(), session_type: "video" }); } catch { /* Demo fallback keeps the booking flow usable. */ } setBooked(true);
  };
  return <Modal title={booked ? "You are on the calendar." : person.name} onClose={onClose}>{booked ? <div className="py-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c7eb92] text-[#172116]"><Check /></span><p className="mt-5 font-display text-2xl text-[#e4ede0]">A gentle step forward.</p><p className="mt-3 text-sm leading-6 text-[#879687]">We saved a video session request for tomorrow. You will receive the details shortly.</p><Button onClick={onClose} className="mt-7 w-full">Done</Button></div> : <><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c7eb92]/15 text-[#c7eb92]"><UserRound /></span><div><p className="text-sm text-[#dfe9dc]">{person.specializations?.join(" · ")}</p><p className="mt-1 text-xs text-[#819080]">{person.languages?.join(", ")}</p></div></div><p className="mt-6 text-sm leading-7 text-[#a4b2a0]">{person.bio}</p><div className="mt-6 rounded-2xl border border-white/[0.08] p-4"><p className="eyebrow">Next available</p><div className="mt-4 grid grid-cols-2 gap-2"><button className="rounded-xl border border-[#c7eb92]/50 bg-[#c7eb92]/10 p-3 text-left"><p className="text-xs font-semibold text-[#c7eb92]">Tomorrow</p><p className="mt-1 text-[10px] text-[#869785]">10:00 AM · video</p></button><button className="rounded-xl border border-white/[0.08] p-3 text-left"><p className="text-xs font-semibold text-[#cfdacb]">Thu, Oct 17</p><p className="mt-1 text-[10px] text-[#869785]">2:30 PM · video</p></button></div></div><Button onClick={book} className="mt-6 w-full">Request this session <CalendarDays size={15} /></Button></>}</Modal>;
}

function CoinsPage() {
  const [balance, setBalance] = useState(248);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([{ id: 1, title: "Chat with AI Therapist", coins: 10, current: 1, target: 1, completed: true }, { id: 2, title: "Write in Journal", coins: 15, current: 0, target: 1 }, { id: 3, title: "Complete Mood Check", coins: 5, current: 0, target: 1 }]);
  useEffect(() => { api.coinBalance().then((data) => setBalance(data.balance)).catch(() => {}); api.transactions().then(setTransactions).catch(() => {}); api.goals().then(setGoals).catch(() => {}); }, []);
  return <><PageHeading eyebrow="Reward the work of showing up" title="Calm Coins" copy="A little encouragement for the rituals that support you." /><div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]"><section className="relative overflow-hidden rounded-[1.7rem] bg-[#c7eb92] p-8 text-[#172116]"><div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full border-[32px] border-[#9fc67d]/40" /><Coins className="relative text-[#55734e]" size={22} /><p className="eyebrow relative mt-7 text-[#58734f]">Your balance</p><p className="relative mt-2 font-display text-7xl">{balance}</p><p className="relative mt-2 text-sm text-[#55704e]">coins to spend on deeper care</p><div className="relative mt-10 flex gap-2"><span className="rounded-full bg-[#172116]/10 px-3 py-1.5 text-[10px] font-semibold">+35 this week</span><span className="rounded-full bg-[#172116]/10 px-3 py-1.5 text-[10px] font-semibold">3 day streak</span></div></section><section className="glass rounded-[1.7rem] p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Today’s gentle goals</p><h2 className="mt-2 font-display text-2xl text-[#e8f0e5]">Small acts count.</h2></div><Award className="text-[#c7eb92]" size={20} /></div><div className="mt-7 space-y-4">{goals.slice(0, 3).map((goal) => <div key={goal.id} className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${goal.completed ? "bg-[#c7eb92] text-[#172116]" : "bg-white/[0.06] text-[#829180]"}`}>{goal.completed ? <Check size={16} /> : <Leaf size={16} />}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="truncate text-xs font-semibold text-[#cfdacb]">{goal.title}</p><span className="text-[10px] text-[#c7eb92]">+{goal.coins}</span></div><div className="mt-2 h-1 rounded-full bg-white/[0.08]"><div style={{ width: `${((goal.current || 0) / goal.target) * 100}%` }} className="h-full rounded-full bg-[#c7eb92]" /></div></div></div>)}</div></section></div><div className="mt-5 grid gap-5 xl:grid-cols-[1fr_.8fr]"><section className="glass rounded-[1.7rem] p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Ways to spend them</p><h2 className="mt-2 font-display text-2xl text-[#e8f0e5]">Invest in your care.</h2></div><ArrowUpRight size={17} className="text-[#c7eb92]" /></div><div className="mt-7 grid gap-3 sm:grid-cols-2">{[["Premium insights", "A deeper look at your patterns", 100, Brain], ["Custom meditation", "Made around your rhythm", 150, Moon], ["Therapist session", "One-on-one, human support", 500, Users], ["Mindfulness course", "A guided path to steadiness", 200, Sparkles]].map(([name, desc, cost, Icon]) => <button key={name} className="group rounded-2xl border border-white/[0.08] p-4 text-left transition hover:border-[#c7eb92]/30"><div className="flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[#c7eb92]"><Icon size={15} /></span><span className="text-[10px] font-semibold text-[#cfddc7]">{cost} coins</span></div><p className="mt-5 text-xs font-semibold text-[#d9e5d5]">{name}</p><p className="mt-1 text-[10px] leading-4 text-[#748472]">{desc}</p></button>)}</div></section><section className="glass rounded-[1.7rem] p-7"><p className="eyebrow">Recent activity</p><div className="mt-6 space-y-4">{(transactions.length ? transactions.slice(0, 4) : [{ description: "Completed a daily check-in", amount: 10, timestamp: new Date().toISOString() }, { description: "Started a CalmBot conversation", amount: 5, timestamp: new Date(Date.now() - 86400000).toISOString() }, { description: "Journal entry saved", amount: 10, timestamp: new Date(Date.now() - 172800000).toISOString() }]).map((item, index) => <div key={index} className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7eb92]/10 text-[#c7eb92]"><Zap size={13} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs text-[#cbd8c8]">{item.description}</p><p className="mt-1 text-[10px] text-[#687867]">{formatDate(item.timestamp)}</p></div><span className="text-xs font-semibold text-[#c7eb92]">+{item.amount}</span></div>)}</div></section></div></>;
}

function RequireAuth({ children }) {
  return localStorage.getItem("zenheaven_token") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/*" element={<RequireAuth><AppShell><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<CoinsPage />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AppShell></RequireAuth>} /></Routes>;
}
