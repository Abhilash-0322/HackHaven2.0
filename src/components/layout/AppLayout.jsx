import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen, Coins, Home, LogOut, Menu, MessageSquare, Music2, NotebookPen, UserRound, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';

const NAV = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/journal', icon: NotebookPen, label: 'Journal' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/music', icon: Music2, label: 'Music' },
  { to: '/therapists', icon: UserRound, label: 'Therapists' },
  { to: '/coins', icon: Coins, label: 'Coins' },
];

function NavItem({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-colors ${
          isActive ? 'bg-terracotta-muted text-terracotta font-medium' : 'text-charcoal-light hover:text-terracotta hover:bg-cream-dark'
        }`}>
      <Icon className="w-4 h-4" />{item.label}
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, logout, calmCoins, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="editorial-page flex min-h-screen">
      <aside className="hidden lg:flex editorial-sidebar">
        <div className="p-6 border-b border-editorial-border">
          <h1 className="editorial-masthead text-terracotta">ZenHeaven</h1>
          <p className="editorial-byline mt-1">Editorial Wellness</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {isAuthenticated && NAV.map((item) => <NavItem key={item.to} item={item} />)}
        </nav>
        {isAuthenticated && (
          <div className="p-4 border-t border-editorial-border">
            <div className="mb-3 px-3">
              <p className="font-sans text-sm text-charcoal truncate">{user?.full_name || user?.name || user?.username || user?.email}</p>
              <Badge className="mt-2">{calmCoins} calm coins</Badge>
            </div>
            <button type="button" onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm font-sans text-charcoal-light hover:text-terracotta transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b border-editorial-border bg-cream-light px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg text-terracotta">ZenHeaven</h1>
          {isAuthenticated && (
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-charcoal" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </header>
        {mobileOpen && isAuthenticated && (
          <nav className="lg:hidden border-b border-editorial-border bg-cream-light p-4 space-y-1">
            {NAV.map((item) => <NavItem key={item.to} item={item} onClick={() => setMobileOpen(false)} />)}
            <button type="button" onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-charcoal-light">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </nav>
        )}
        <main className="flex-1"><Outlet /></main>
      </div>
    </div>
  );
}
