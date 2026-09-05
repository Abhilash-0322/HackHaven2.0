import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Coins, Home, LogOut, MessageSquare, Music2, NotebookPen, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Agent' },
  { to: '/journal', icon: NotebookPen, label: 'Journal' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/music', icon: Music2, label: 'Music' },
  { to: '/therapists', icon: UserRound, label: 'Therapists' },
  { to: '/coins', icon: Coins, label: 'Coins' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border/60 bg-surface/40">
      <div className="p-6 flex gap-3 items-center">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-glow to-cyan-glow flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
        <div><h1 className="font-semibold text-white text-sm">ZenHeaven</h1><p className="text-[10px] font-mono text-cyan-glow/70">NEON AGENT</p></div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => { const ItemIcon = item.icon; return (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-violet-glow/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <ItemIcon className="w-4 h-4" />{item.label}
          </NavLink>
        ); })}
      </nav>
      <div className="p-4 border-t border-border/40">
        {user && <p className="text-xs text-gray-500 mb-2 flex gap-1 items-center font-mono"><Brain className="w-3 h-3" />{user.calm_coins ?? 0} coins</p>}
        <button type="button" onClick={() => { logout(); navigate('/login'); }} className="neon-btn-ghost w-full text-xs"><LogOut className="w-3 h-3" />Disconnect</button>
      </div>
    </aside>
  );
}
