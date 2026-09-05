import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BookOpen, Music, Users, Coins as CoinsIcon, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import calmLogo from '../../assets/Calm.png';
import ThemeToggle from '../ui/ThemeToggle';
import Badge from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

const nav = [
  { to: '/home', label: 'Home', icon: Home }, { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen }, { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/music', label: 'Music', icon: Music }, { to: '/therapists', label: 'Therapists', icon: Users },
  { to: '/coins', label: 'Coins', icon: CoinsIcon },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-organic-gradient dark:bg-organic-gradient-dark">
      <header className="sticky top-0 z-50 border-b border-sage-200/60 bg-cream-100/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/home" className="flex items-center gap-2 font-display text-xl font-semibold text-forest">
            <img src={calmLogo} alt="" className="h-9 w-9 rounded-2xl object-cover" /> ZenHeaven
          </Link>
          <nav className="hidden lg:flex gap-1">{nav.map(({ to, label }) => (
            <Link key={to} to={to} className={`px-3 py-2 rounded-xl text-sm font-medium ${location.pathname === to ? 'bg-mint-100 text-mint-700' : 'text-sage-600 hover:bg-sage-100'}`}>{label}</Link>
          ))}</nav>
          <div className="flex items-center gap-2">
            {user && <Badge variant="mint" className="hidden sm:inline-flex">{user.calm_coins ?? 0}</Badge>}
            <ThemeToggle />
            <button onClick={logout} className="hidden sm:block p-2 rounded-2xl hover:bg-sage-100"><LogOut className="h-5 w-5" /></button>
            <button className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-sage-500">Take a breath. You&apos;re doing great. 🌿</footer>
    </div>
  );
}
