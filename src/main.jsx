import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, ArrowLeft, ArrowUpRight, Award, Bell, BookOpen, Brain, CalendarDays,
  Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Coins as CoinsIcon, Heart,
  LayoutDashboard, Leaf, LockKeyhole, LogOut, Menu, MessageCircle, Moon, MoreHorizontal,
  Music2, PencilLine, Play, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Star,
  SunMedium, TrendingUp, UsersRound, Waves, X, Zap,
} from 'lucide-react';
import './styles.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const storageKeys = { token: 'zenheaven_token', user: 'zenheaven_user', entries: 'zenheaven_entries' };

async function apiRequest(path, options = {}) {
  if (!API_URL) throw new Error('Demo mode');
  const token = localStorage.getItem(storageKeys.token);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(await response.text() || 'Request failed');
  return response.json();
}

const fallbackUser = {
  id: 'demo-zen',
  username: 'alex',
  email: 'alex@zenheaven.app',
  full_name: 'Alex Morgan',
  calm_coins: 248,
};

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKeys.user)) || null; } catch { return null; }
  });

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(storageKeys.token, nextToken);
    localStorage.setItem(storageKeys.user, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (credentials) => {
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      saveSession(data.access_token, data.user);
    } catch {
      saveSession('demo-session', { ...fallbackUser, username: credentials.username || 'alex' });
    }
  };

  const register = async (details) => {
    try {
      const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(details) });
      saveSession(data.access_token, data.user);
    } catch {
      saveSession('demo-session', {
        ...fallbackUser,
        username: details.username || 'alex',
        email: details.email,
        full_name: details.full_name || details.username || 'Alex Morgan',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.user);
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, login, register, logout }}>{children}</AuthContext.Provider>;
}

import { createContext, useContext } from 'react';
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/chat', label: 'Calm chat', icon: MessageCircle, badge: '3' },
  { to: '/journal', label: 'Journal', icon: PencilLine },
  { to: '/books', label: 'Library', icon: BookOpen },
  { to: '/music', label: 'Soundscape', icon: Music2 },
  { to: '/therapists', label: 'Care team', icon: UsersRound },
  { to: '/coins', label: 'Calm coins', icon: Coins },
];

function Logo({ compact = false }) {
  return (
    <Link to="/dashboard" className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><Waves size={18} strokeWidth={2.5} /></span>
      {!compact && <span>zen<span className="brand-highlight">heaven</span></span>}
    </Link>
  );
}

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Overview';
  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="sidebar-head"><Logo /><button className="icon-button mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
        <div className="sidebar-label">Your space</div>
        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} onClick={() => setMobileNav(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={isActive => isActive ? 2.4 : 1.8} /><span>{label}</span>{badge && <em>{badge}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="daily-card">
            <div className="daily-icon"><SunMedium size={17} /></div>
            <div><strong>Daily reset</strong><span>2 of 3 complete</span></div>
            <div className="mini-progress"><span style={{ width: '67%' }} /></div>
          </div>
          <NavLink to="/settings" className="nav-item"><Settings2 size={18} /><span>Settings</span></NavLink>
          <button className="profile-row" onClick={logout}>
            <span className="avatar avatar-sm">{(user?.full_name || user?.username || 'A').slice(0, 1)}</span>
            <span className="profile-meta"><strong>{user?.full_name || 'Alex Morgan'}</strong><span>View profile</span></span>
            <LogOut size={15} />
          </button>
        </div>
      </aside>
      {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={21} /></button>
          <div><span className="eyebrow">Saturday, September 6, 2025</span><h1>{pageName}</h1></div>
          <div className="topbar-actions">
            <button className="icon-button notification"><Bell size={18} /><i /></button>
            <div className="topbar-divider" />
            <span className="avatar">{(user?.full_name || user?.username || 'A').slice(0, 1)}</span>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action, children }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{action || children}</div>;
}

function ScoreRing({ value, label, color = '#bbd69c', size = 152, sublabel }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  return <div className="score-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 120 120" aria-label={`${label} ${value}`}>
      <circle className="ring-track" cx="60" cy="60" r={radius} />
      <circle className="ring-value" cx="60" cy="60" r={radius} stroke={color} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
    </svg>
    <div className="ring-copy"><strong>{value}</strong><span>{sublabel || '/ 100'}</span></div>
    <div className="ring-label">{label}</div>
  </div>;
}

function MetricCard({ icon: Icon, label, value, unit, trend, trendLabel, tone = 'sage', children }) {
  return <div className={`metric-card tone-${tone}`}>
    <div className="metric-top"><span className="metric-icon"><Icon size={17} /></span><span className="trend">{trend && <TrendingUp size={13} />}{trend}</span></div>
    <span className="metric-label">{label}</span>
    <div className="metric-value">{value}<small>{unit}</small></div>
    {trendLabel && <span className="metric-foot">{trendLabel}</span>}
    {children}
  </div>;
}

function Sparkline({ points = '0,32 18,28 35,35 52,17 70,24 88,13 106,17 124,6', color = '#719d72' }) {
  return <svg className="sparkline" viewBox="0 0 124 40" preserveAspectRatio="none"><polyline points={points} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Dashboard() {
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  return <div className="dashboard-page">
    <div className="welcome-row">
      <div><p className="welcome-kicker"><Sparkles size={14} /> Good morning, {user?.full_name?.split(' ')[0] || 'Alex'}</p><h2>Make space for your best self.</h2><p className="muted">Your body is giving you a strong signal today. Keep the momentum gentle.</p></div>
      <div className="date-chip"><CalendarDays size={16} /><span>Saturday, Sep 6</span><ChevronDown size={14} /></div>
    </div>
    <div className="dashboard-grid">
      <section className="card recovery-hero">
        <div className="card-header"><div><span className="eyebrow">Whoop snapshot</span><h3>Recovery is in your corner</h3></div><button className="more-button"><MoreHorizontal size={19} /></button></div>
        <div className="recovery-body">
          <ScoreRing value={84} label="Recovery" color="#bad99d" />
          <div className="recovery-note"><div className="status-dot"><Check size={14} /></div><div><strong>Green day</strong><p>You're ready to train and take on what matters. Let your energy lead.</p><button className="text-button" onClick={() => setCheckedIn(true)}>{checkedIn ? 'Check-in saved ✓' : 'Complete check-in'} <ArrowUpRight size={14} /></button></div></div>
        </div>
        <div className="recovery-stats"><div><span>HRV</span><strong>74 <small>ms</small></strong><Sparkline points="0,29 16,25 30,27 45,16 61,20 77,10 94,16 110,9 124,11" /></div><div><span>Resting heart rate</span><strong>52 <small>bpm</small></strong><Sparkline points="0,12 18,18 35,15 53,23 72,16 87,22 105,14 124,18" color="#a28a67" /></div><div><span>Sleep performance</span><strong>91 <small>%</small></strong><Sparkline points="0,30 16,27 33,31 50,14 69,19 86,10 103,16 124,7" color="#8e9bc2" /></div></div>
      </section>
      <section className="card insight-card">
        <div className="insight-orb"><Brain size={22} /></div><span className="eyebrow">ZenHeaven insight</span><h3>Your nervous system loves consistency.</h3><p>You've slept 8+ hours three nights in a row. Pair that with a lighter strain today for a high-quality recovery window.</p><Link className="text-button" to="/journal">Reflect on this <ArrowUpRight size={14} /></Link>
        <div className="insight-footer"><span><Zap size={14} /> powered by your data</span><span>just now</span></div>
      </section>
    </div>
    <SectionHeading eyebrow="Today at a glance" title="Your wellness signals" action={<Link to="/dashboard" className="subtle-link">View trends <ArrowUpRight size={14} /></Link>} />
    <div className="metric-grid">
      <MetricCard icon={Moon} label="Sleep" value="8h 24" unit="min" trend="+12%" trendLabel="vs. last week" tone="lilac"><div className="sleep-bar"><span style={{ width: '86%' }} /></div></MetricCard>
      <MetricCard icon={Activity} label="Day strain" value="7.4" unit="/ 21" trend="Optimal" trendLabel="Your target is 8.0" tone="peach"><div className="strain-scale"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></MetricCard>
      <MetricCard icon={Heart} label="Resting heart rate" value="52" unit="bpm" trend="-3%" trendLabel="Excellent baseline" tone="blue"><Sparkline points="0,28 14,24 28,27 42,17 58,21 74,13 91,17 106,11 124,14" color="#7387b4" /></MetricCard>
      <MetricCard icon={Award} label="Mindful minutes" value="18" unit="min" trend="+6 min" trendLabel="3-day streak" tone="gold"><div className="mini-dots"><i /><i /><i /><i /><i /><i /><i /></div></MetricCard>
    </div>
    <div className="lower-grid">
      <section className="card weekly-card"><div className="card-header"><div><span className="eyebrow">Recovery rhythm</span><h3>Your week in balance</h3></div><button className="select-button">This week <ChevronDown size={14} /></button></div><div className="bar-chart">{[68, 82, 74, 91, 84, 76, 84].map((height, index) => <div className="bar-column" key={index}><div className="bar-track"><span style={{ height: `${height}%` }} className={index === 5 ? 'today' : ''}><b>{height}</b></span></div><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div><div className="chart-legend"><span><i className="legend-dot sage" /> Recovery score</span><span><i className="legend-dot today-dot" /> Today</span></div></section>
      <section className="card ritual-card"><div className="ritual-top"><span className="eyebrow">Your next ritual</span><span className="ritual-time"><Clock3 size={13} /> 8 min</span></div><div className="ritual-icon"><Leaf size={20} /></div><h3>Downshift your evening</h3><p>A short breathwork practice to help your body land softly.</p><button className="primary-button full" onClick={() => setCheckedIn(true)}><Play size={15} fill="currentColor" /> Start practice</button></section>
    </div>
  </div>;
}

function AuthLayout({ children }) {
  return <div className="auth-page"><div className="auth-visual"><Logo /><div className="auth-quote"><span className="quote-mark">“</span><h1>A softer way to<br /><em>feel like yourself.</em></h1><p>Wellness data that feels human, rituals that fit real life.</p><div className="auth-proof"><div className="avatar-stack"><span>A</span><span>M</span><span>J</span><span>+</span></div><span>Joined by 12,000+ gentle achievers</span></div></div><div className="auth-wave" /></div><div className="auth-form-wrap"><div className="auth-form">{children}<p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms of service</a> and <a href="#privacy">Privacy policy</a>.</p></div></div></div>;
}

function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ username: '', password: '' }); const [error, setError] = useState('');
  const submit = async (event) => { event.preventDefault(); if (!form.username || !form.password) { setError('Enter your username and password to continue.'); return; } await login(form); navigate('/dashboard'); };
  return <AuthLayout mode="login"><div className="auth-top"><span className="eyebrow">Welcome back</span><h2>Good to see you again.</h2><p>Pick up where you left off.</p></div><form onSubmit={submit} className="form-stack">{error && <div className="form-error">{error}</div>}<label>Username<input placeholder="alexmorgan" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label>Password<div className="input-wrap"><input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" className="input-action">Show</button></div></label><div className="form-options"><label className="check-label"><input type="checkbox" /> Remember me</label><a href="#forgot">Forgot password?</a></div><button className="primary-button full" type="submit">Enter your space <ArrowUpRight size={16} /></button></form><p className="auth-switch">New to ZenHeaven? <Link to="/register">Create an account</Link></p></AuthLayout>;
}

function Register() {
  const { register } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' }); const [error, setError] = useState('');
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = async (event) => { event.preventDefault(); if (!form.email || !form.username || form.password.length < 6) { setError('Add your email, a username, and a 6+ character password.'); return; } await register(form); navigate('/dashboard'); };
  return <AuthLayout mode="register"><div className="auth-top"><span className="eyebrow">Start gently</span><h2>Your space is waiting.</h2><p>Build a better relationship with your energy.</p></div><form onSubmit={submit} className="form-stack">{error && <div className="form-error">{error}</div>}<label>Your name<input placeholder="Alex Morgan" value={form.full_name} onChange={update('full_name')} /></label><div className="form-row"><label>Username<input placeholder="alexmorgan" value={form.username} onChange={update('username')} /></label><label>Email<input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} /></label></div><label>Password<input type="password" placeholder="At least 6 characters" value={form.password} onChange={update('password')} /></label><button className="primary-button full" type="submit">Create my space <ArrowUpRight size={16} /></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></AuthLayout>;
}

const starterMessages = [
  { id: 'welcome', isUser: false, content: 'Hey Alex, I’m here with you. What feels most present for you today?' },
];

function Chat() {
  const { token } = useAuth(); const [messages, setMessages] = useState(starterMessages); const [input, setInput] = useState(''); const [thinking, setThinking] = useState(false); const [threads, setThreads] = useState([]); const [activeThread, setActiveThread] = useState(null);
  useEffect(() => { apiRequest('/mental-health/threads').then((data) => setThreads(data.threads || [])).catch(() => setThreads([{ id: 'today', title: 'Finding a calmer rhythm', last_message: 'Today, 9:14 AM' }, { id: 'sleep', title: 'Making sleep feel easier', last_message: 'Yesterday' }, { id: 'energy', title: 'Energy & boundaries', last_message: 'Aug 28' }])); }, []);
  const sendMessage = async (event) => {
    event?.preventDefault(); const trimmed = input.trim(); if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { id: Date.now(), isUser: true, content: trimmed }]); setInput(''); setThinking(true);
    try {
      const response = await fetch(`${API_URL}/mental-health/chat/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message: trimmed, thread_id: activeThread }) });
      if (!response.ok || !response.body) throw new Error('Chat unavailable');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let botText = '';
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, isUser: false, content: '', streaming: true }]);
      while (true) { const { value, done } = await reader.read(); if (done) break; const chunk = decoder.decode(value); chunk.split('\n\n').forEach((eventChunk) => { if (!eventChunk.startsWith('data:')) return; try { const eventData = JSON.parse(eventChunk.replace(/^data:\s*/, '')); if (eventData.type === 'thread_id') setActiveThread(eventData.data); if (eventData.type === 'token') { botText += eventData.data; setMessages((prev) => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, content: botText } : msg)); } } catch { /* Ignore incomplete SSE frames. */ } }); }
    } catch {
      const fallback = 'Thank you for sharing that. Let’s take one small step: notice where you feel this in your body, soften your shoulders, and give yourself permission to move at a human pace.';
      await new Promise((resolve) => setTimeout(resolve, 650));
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, isUser: false, content: fallback }]);
    } finally { setThinking(false); }
  };
  return <div className="chat-layout">
    <aside className="thread-panel"><div className="thread-head"><div><span className="eyebrow">Conversations</span><h2>Your calm space</h2></div><button className="icon-button"><Plus size={18} /></button></div><button className="new-thread" onClick={() => { setActiveThread(null); setMessages(starterMessages); }}><Plus size={15} /> New conversation</button><div className="thread-list">{threads.map((thread) => <button className={`thread-item ${activeThread === thread.id ? 'selected' : ''}`} key={thread.id} onClick={() => setActiveThread(thread.id)}><span className="thread-symbol"><MessageCircle size={14} /></span><span><strong>{thread.title}</strong><small>{thread.last_message || 'A safe place to begin'}</small></span><ChevronRight size={15} /></button>)}</div><div className="thread-help"><CircleHelp size={16} /><span>Need immediate help?<strong><a href="tel:988">Call 988 Lifeline</a></strong></span></div></aside>
    <section className="chat-panel"><div className="chat-toolbar"><div className="bot-identity"><span className="bot-avatar"><Sparkles size={17} /></span><span><strong>CalmBot</strong><small>Here to listen · Always private</small></span></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="chat-messages"><div className="chat-date">Today · Saturday, September 6</div>{messages.map((message) => <div className={`message-row ${message.isUser ? 'user-message' : ''}`} key={message.id}>{!message.isUser && <span className="bot-avatar small"><Sparkles size={13} /></span>}<div className="message-bubble"><p>{message.content || <span className="typing-dots"><i /><i /><i /></span>}</p>{!message.isUser && message.content && <span className="message-time">CalmBot · just now</span>}</div></div>)}{thinking && messages[messages.length - 1]?.isUser && <div className="thinking-line"><span className="bot-avatar small"><Sparkles size={13} /></span><span>CalmBot is thinking <i /><i /><i /></span></div>}</div><form className="chat-composer" onSubmit={sendMessage}><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }} placeholder="Share what’s on your mind..." rows="1" /><div className="composer-bottom"><span><LockKeyhole size={12} /> Private & encrypted</span><button className="send-button" type="submit" disabled={!input.trim() || thinking}><Send size={17} /></button></div></form></section>
  </div>;
}

const defaultEntries = [
  { id: 1, title: 'A slow Sunday morning', date: 'Today, 8:42 AM', mood: 'Grounded', moodTone: 'sage', preview: 'There was a quietness in the room today that I didn’t rush to fill...' },
  { id: 2, title: 'The work in between', date: 'Sep 4, 2025', mood: 'Hopeful', moodTone: 'lilac', preview: 'I’m learning that rest is not a reward for finishing everything...' },
  { id: 3, title: 'Naming what I need', date: 'Sep 2, 2025', mood: 'Tender', moodTone: 'peach', preview: 'Today I said no without an explanation. It felt unfamiliar, but good...' },
];

function Journal() {
  const [entries, setEntries] = useStoredState(storageKeys.entries, defaultEntries); const [writing, setWriting] = useState(false); const [draft, setDraft] = useState(''); const [mood, setMood] = useState('Grounded');
  const saveEntry = async () => { if (!draft.trim()) return; const entry = { id: Date.now(), title: draft.trim().split(' ').slice(0, 5).join(' '), date: 'Just now', mood, moodTone: 'sage', preview: `${draft.trim().slice(0, 88)}...` }; setEntries([entry, ...entries]); setDraft(''); setWriting(false); try { await apiRequest('/journal/entries', { method: 'POST', body: JSON.stringify({ content: draft, mood }) }); } catch { /* Demo mode keeps the entry locally. */ } };
  return <div className="content-page"><SectionHeading eyebrow="A place to notice" title="Your journal" description="Small check-ins become meaningful patterns over time." action={<button className="primary-button" onClick={() => setWriting(!writing)}><Plus size={16} /> New entry</button>} />{writing && <div className="card journal-editor"><div className="editor-top"><span className="eyebrow">Saturday, September 6</span><button className="icon-button" onClick={() => setWriting(false)}><X size={17} /></button></div><input value={draft ? draft.split('\n')[0] : ''} onChange={(e) => setDraft(e.target.value + (draft.includes('\n') ? `\n${draft.split('\n').slice(1).join('\n')}` : ''))} placeholder="Give this moment a name..." /><textarea value={draft.includes('\n') ? draft.split('\n').slice(1).join('\n') : ''} onChange={(e) => setDraft(`${draft.split('\n')[0] || 'A new reflection'}\n${e.target.value}`)} placeholder="What’s present for you right now?" rows="6" /><div className="mood-picker"><span>How are you feeling?</span>{['Grounded', 'Hopeful', 'Tender', 'Restless', 'Bright'].map((item) => <button key={item} className={mood === item ? 'selected' : ''} onClick={() => setMood(item)}>{item}</button>)}</div><div className="editor-actions"><button className="subtle-link" onClick={() => setWriting(false)}>Save as draft</button><button className="primary-button" onClick={saveEntry}><Check size={15} /> Save entry</button></div></div>}<div className="journal-overview"><div className="card journal-streak"><div className="streak-visual"><span>7</span><small>day streak</small></div><div><span className="eyebrow">You’re showing up</span><h3>Consistency feels good on you.</h3><p>Keep going — your longest streak is 12 days.</p></div><FlameIcon /></div><div className="card mood-week"><span className="eyebrow">Mood this week</span><div className="mood-dots">{['sage', 'sage', 'lilac', 'peach', 'sage', 'lilac', 'sage'].map((tone, i) => <span className={tone} key={i}><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small></span>)}</div><strong>Mostly grounded</strong><span className="muted">Based on 6 check-ins</span></div></div><div className="entries-header"><h3>Recent entries</h3><button className="subtle-link">Filter <ChevronDown size={14} /></button></div><div className="entry-grid">{entries.map((entry) => <article className="entry-card card" key={entry.id}><div className="entry-top"><span className={`mood-pill ${entry.moodTone}`}>{entry.mood}</span><button className="more-button"><MoreHorizontal size={17} /></button></div><span className="entry-date">{entry.date}</span><h3>{entry.title}</h3><p>{entry.preview}</p><button className="text-button">Read entry <ArrowUpRight size={14} /></button></article>)}</div></div>;
}

function FlameIcon() { return <div className="flame-icon"><Zap size={22} fill="currentColor" /></div>; }

const books = [
  { title: 'Wintering', author: 'Katherine May', category: 'Rest & resilience', color: 'book-green', quote: 'A beautiful reminder that rest is a season, not a failure.' },
  { title: 'The Comfort Book', author: 'Matt Haig', category: 'Gentle perspective', color: 'book-peach', quote: 'Tiny thoughts and reminders for the days that feel heavy.' },
  { title: 'Burnout', author: 'Emily Nagoski', category: 'Understanding stress', color: 'book-lilac', quote: 'Complete the stress cycle, then come back to yourself.' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Tiny rituals', color: 'book-blue', quote: 'Small changes, remarkable results, a kinder way to build momentum.' },
];

function Books() {
  const [search, setSearch] = useState(''); const filtered = books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="content-page"><SectionHeading eyebrow="Curated for your season" title="The quiet library" description="Books to meet you where you are, and take you somewhere kind." action={<div className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the library" /></div>} /><div className="featured-book card"><div className="featured-cover"><BookOpen size={28} /><span>this month’s gentle read</span></div><div className="featured-copy"><span className="eyebrow">Featured for your recovery score</span><h2>The Body Keeps<br /><em>the Score</em></h2><p>Understanding the mind-body connection can be the beginning of a more compassionate relationship with yourself.</p><div className="book-byline"><span>by Bessel van der Kolk</span><span>·</span><span>12 min read preview</span></div><button className="primary-button">Explore the book <ArrowUpRight size={15} /></button></div><div className="featured-stamp"><Star size={13} fill="currentColor" /> picked for you</div></div><div className="book-section-head"><h3>For your current energy</h3><button className="subtle-link">See all <ArrowUpRight size={14} /></button></div><div className="book-grid">{filtered.map((book) => <article className="book-card" key={book.title}><div className={`book-cover ${book.color}`}><span>zenheaven<br />reading list</span><strong>{book.title}</strong><small>{book.author}</small></div><div className="book-card-copy"><span className="eyebrow">{book.category}</span><h3>{book.title}</h3><p>{book.quote}</p><button className="text-button">View details <ArrowUpRight size={14} /></button></div></article>)}</div></div>;
}

const tracks = [
  { title: 'Soft Focus', artist: 'ZenHeaven Studio', duration: '38:12', color: 'track-sage', type: 'Focus' },
  { title: 'An afternoon exhale', artist: 'Mara Valen', duration: '12:04', color: 'track-peach', type: 'Downshift' },
  { title: 'Still water', artist: 'Quiet Hours', duration: '24:20', color: 'track-blue', type: 'Sleep' },
  { title: 'A little brighter', artist: 'Lumen House', duration: '18:46', color: 'track-lilac', type: 'Mood lift' },
];

function Music() {
  const [playing, setPlaying] = useState(null); const mood = 'Steady';
  return <div className="content-page music-page"><SectionHeading eyebrow="Sound for your state" title="Your soundscape" description="A softer soundtrack for wherever your energy is today." action={<div className="music-mood"><span>Mood</span><button>{mood} <ChevronDown size={14} /></button></div>} /><div className="music-hero card"><div className="music-hero-copy"><span className="eyebrow">Made for your recovery · 84%</span><h2>Let the day<br /><em>move slowly.</em></h2><p>A 45-minute sequence of warm textures and low-tempo rhythms for a grounded afternoon.</p><button className="primary-button" onClick={() => setPlaying(0)}><Play size={15} fill="currentColor" /> {playing === 0 ? 'Playing now' : 'Play sequence'}</button></div><div className="sound-orb"><div className="orb-inner"><Waves size={34} /></div><span className="orb-line line-one" /><span className="orb-line line-two" /><span className="orb-line line-three" /></div></div><div className="player-bar card"><div className="track-mini"><div className="track-art track-sage"><Waves size={15} /></div><span><strong>{playing !== null ? tracks[playing].title : 'Choose a track'}</strong><small>{playing !== null ? tracks[playing].artist : 'Your listening queue is ready'}</small></span></div><div className="player-controls"><button><ArrowLeft size={16} /></button><button className="player-play" onClick={() => setPlaying(playing === null ? 0 : null)}>{playing === null ? <Play size={16} fill="currentColor" /> : <span className="pause-lines" />}</button><button><ChevronRight size={16} /></button></div><div className="player-progress"><span style={{ width: playing === null ? '22%' : '48%' }} /><small>04:18 / 38:12</small></div><VolumeIcon /></div><div className="track-section-head"><h3>Made for today</h3><button className="subtle-link">Browse all <ArrowUpRight size={14} /></button></div><div className="track-list">{tracks.map((track, index) => <button className={`track-row ${playing === index ? 'is-playing' : ''}`} key={track.title} onClick={() => setPlaying(index)}><span className={`track-art ${track.color}`}>{playing === index ? <span className="equalizer"><i /><i /><i /></span> : <Play size={15} fill="currentColor" />}</span><span className="track-info"><strong>{track.title}</strong><small>{track.artist}</small></span><span className="track-type">{track.type}</span><span className="track-duration">{track.duration}</span><MoreHorizontal size={17} /></button>)}</div></div>;
}

function VolumeIcon() { return <span className="volume-icon"><Waves size={17} /></span>; }

const therapists = [
  { name: 'Dr. Maya Chen', role: 'Clinical psychologist', initials: 'MC', tone: 'sage', tags: ['Anxiety', 'Burnout'], next: 'Today · 4:00 PM', rating: '4.9' },
  { name: 'Jordan Williams', role: 'Somatic therapist', initials: 'JW', tone: 'peach', tags: ['Trauma-informed', 'Sleep'], next: 'Tomorrow · 11:30 AM', rating: '5.0' },
  { name: 'Priya Shah', role: 'Mindfulness coach', initials: 'PS', tone: 'lilac', tags: ['Life transitions', 'Stress'], next: 'Thu · 9:00 AM', rating: '4.8' },
];

function Therapists() {
  const [booked, setBooked] = useState(null);
  return <div className="content-page"><SectionHeading eyebrow="Support that feels like you" title="Your care team" description="Find a professional to support your next season." action={<button className="outline-button"><Search size={15} /> Find a therapist</button>} /><div className="care-banner card"><div className="care-banner-icon"><ShieldCheck size={24} /></div><div><strong>Private, qualified, human.</strong><p>All professionals are licensed, verified, and here to meet you with care.</p></div><ChevronRight size={18} /></div><div className="therapist-grid">{therapists.map((therapist, index) => <article className="therapist-card card" key={therapist.name}><div className={`therapist-avatar ${therapist.tone}`}>{therapist.initials}<span className="online-dot" /></div><div className="therapist-main"><div className="therapist-title"><div><h3>{therapist.name}</h3><p>{therapist.role}</p></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="rating"><Star size={14} fill="currentColor" /> {therapist.rating} <span>·</span> 42 sessions</div><div className="tag-row">{therapist.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="therapist-bottom"><span><CalendarDays size={14} /> Next: {therapist.next}</span><button className={booked === index ? 'book-button booked' : 'book-button'} onClick={() => setBooked(index)}>{booked === index ? <><Check size={14} /> Requested</> : 'Book a session'}</button></div></div></article>)}</div><div className="care-note"><Heart size={16} /><span>Not sure where to begin? <a href="#match">Take our 2-minute matching quiz</a> and we’ll make a thoughtful suggestion.</span></div></div>;
}

function Coins() {
  const [balance, setBalance] = useState(248); const [claimed, setClaimed] = useState(false);
  const goals = [{ icon: PencilLine, label: 'Write a journal entry', reward: '+10', done: true }, { icon: Waves, label: 'Complete a breathwork', reward: '+15', done: true }, { icon: MessageCircle, label: 'Check in with CalmBot', reward: '+5', done: false }, { icon: Moon, label: 'Log your sleep', reward: '+10', done: false }];
  return <div className="content-page coins-page"><SectionHeading eyebrow="Little rewards, real progress" title="Calm coins" description="Build rituals that give back to you." action={<button className="outline-button"><CircleHelp size={15} /> How it works</button>} /><div className="coins-hero card"><div className="coin-hero-copy"><span className="eyebrow">Your balance</span><div className="coin-balance"><CoinsIcon size={27} fill="currentColor" /> <strong>{balance}</strong><span>calm coins</span></div><p>You’re 52 coins away from your next reward.</p><div className="coin-progress"><span style={{ width: '78%' }} /></div><small>248 / 300 coins</small></div><div className="coin-medallion"><CoinsIcon size={43} /><span>keep<br />going</span></div></div><div className="coin-columns"><section><div className="section-inline"><div><span className="eyebrow">Today’s path</span><h3>Earn by caring for yourself</h3></div><span className="goal-count">2 / 4 complete</span></div><div className="goal-list">{goals.map((goal) => <div className={`goal-row ${goal.done ? 'goal-done' : ''}`} key={goal.label}><span className="goal-icon"><goal.icon size={17} /></span><span><strong>{goal.label}</strong><small>{goal.done ? 'Completed today' : 'A tiny step counts'}</small></span><b>{goal.done ? <Check size={16} /> : goal.reward}</b></div>)}</div></section><section className="card rewards-card"><div className="card-header"><div><span className="eyebrow">Your rewards</span><h3>Spend with intention</h3></div><button className="more-button"><MoreHorizontal size={18} /></button></div><div className="reward-item"><span className="reward-icon"><Music2 size={18} /></span><span><strong>1 month of Soundscape</strong><small>300 coins</small></span><button disabled={balance < 300}>Unlock</button></div><div className="reward-item"><span className="reward-icon peach"><UsersRound size={18} /></span><span><strong>Session credit</strong><small>500 coins</small></span><button disabled={balance < 500}>Unlock</button></div><button className="claim-button" onClick={() => { if (!claimed) { setBalance(balance + 10); setClaimed(true); } }}>{claimed ? 'Daily bonus claimed ✓' : 'Claim daily bonus +10'}</button></section></div></div>;
}

function App() {
  return <AuthProvider><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /><Route path="/settings" element={<Dashboard />} /></Route></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AuthProvider>;
}

export default function Root() {
  return <BrowserRouter><App /></BrowserRouter>;
}
