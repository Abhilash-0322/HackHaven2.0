import { Activity, BookHeart, BookOpen, Coins, Headphones, LayoutDashboard, LogOut, MessageCircle, PanelLeftClose, PanelLeftOpen, Settings, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { Logo } from './ui'

const nav = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'CalmBot', to: '/chat', icon: MessageCircle, badge: 'AI' },
  { label: 'Journal', to: '/journal', icon: BookHeart },
  { label: 'Library', to: '/books', icon: BookOpen },
  { label: 'Soundscape', to: '/music', icon: Headphones },
  { label: 'Therapists', to: '/therapists', icon: UsersRound },
  { label: 'Calm coins', to: '/coins', icon: Coins },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const active = nav.find((item) => location.pathname.startsWith(item.to)) || nav[0]

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/[.07] bg-[#0c0d15] transition-all duration-300 lg:flex lg:flex-col ${collapsed ? 'w-[78px]' : 'w-[248px]'}`}>
        <div className={`flex h-[84px] items-center border-b border-white/[.07] px-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Logo compact={collapsed} />
          {!collapsed && <button onClick={() => setCollapsed(true)} className="icon-button"><PanelLeftClose size={16} /></button>}
        </div>
        {collapsed && <button onClick={() => setCollapsed(false)} className="mx-auto mt-5 icon-button"><PanelLeftOpen size={16} /></button>}
        <div className="flex-1 px-3 py-7">
          {!collapsed && <p className="mono mb-3 px-3 text-[9px] uppercase tracking-[.22em] text-slate-600">Your sanctuary</p>}
          <nav className="space-y-1">
            {nav.map(({ label, to, icon: Icon, badge }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${isActive ? 'bg-white/[.07] text-white' : 'text-slate-500 hover:bg-white/[.04] hover:text-slate-200'} ${collapsed ? 'justify-center' : ''}`}>
                <Icon size={17} strokeWidth={1.7} className={() => location.pathname.startsWith(to) ? 'text-acid' : 'text-slate-500 group-hover:text-slate-300'} />
                {!collapsed && <><span className="flex-1">{label}</span>{badge && <span className="mono rounded bg-purple/15 px-1.5 py-0.5 text-[9px] text-purple-200">{badge}</span>}</>}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={`border-t border-white/[.07] p-3 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {!collapsed && <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[.03] p-3"><div className="avatar">{(user?.full_name || user?.username || 'A').slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{user?.full_name || user?.username || 'Guest'}</p><p className="mono mt-0.5 truncate text-[10px] text-slate-600">{user?.email || 'zen citizen'}</p></div></div>}
          <button onClick={() => { logout(); navigate('/login') }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-slate-500 transition hover:bg-white/[.04] hover:text-white ${collapsed ? 'justify-center' : ''}`}><LogOut size={16} />{!collapsed && 'Sign out'}</button>
        </div>
      </aside>

      <main className={`min-h-screen transition-all duration-300 lg:pl-${collapsed ? '[78px]' : '[248px]'}`}>
        <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-white/[.07] bg-ink/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden"><Logo compact /><span className="font-display text-sm tracking-[.1em]">ZENHEAVEN</span></div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_8px_#d7f85f]" /> System calm <span className="mx-2 text-slate-700">/</span> {active.label}</div>
          <div className="ml-auto flex items-center gap-3"><div className="mono hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-[10px] text-slate-400 sm:flex"><ShieldCheck size={13} className="text-acid" /> SECURE SESSION</div><button className="icon-button"><Settings size={16} /></button><div className="avatar h-8 w-8 text-xs lg:hidden">{(user?.full_name || user?.username || 'A').slice(0, 1).toUpperCase()}</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><Outlet /></div>
      </main>
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#151621]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden">
        {nav.slice(0, 5).map(({ to, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-full p-3 ${isActive ? 'bg-acid text-ink' : 'text-slate-500'}`}><Icon size={17} /></NavLink>)}
      </div>
    </div>
  )
}
