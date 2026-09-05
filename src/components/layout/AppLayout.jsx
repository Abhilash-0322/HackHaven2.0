import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, Coins, Home, LogOut, Menu, MessageCircle, Music, NotebookPen, Stethoscope, X } from 'lucide-react';
import calmLogo from '../../assets/Calm.png';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const navItems = [
  { to: '/home', label: 'Dashboard', icon: Home },
  { to: '/chat', label: 'AI Support', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/music', label: 'Music', icon: Music },
  { to: '/therapists', label: 'Therapists', icon: Stethoscope },
  { to: '/coins', label: 'Calm Coins', icon: Coins },
];

export default function AppLayout() {
  const { user, calmCoins, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-clinical-200 px-4 py-5">
        <img src={calmLogo} alt="ZenHeaven" className="h-9 w-9 rounded-lg object-cover" />
        <div><p className="text-sm font-semibold text-clinical-900">ZenHeaven</p><p className="text-xs text-clinical-500">Clinical wellness</p></div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-accent-50 text-accent-700' : 'text-clinical-600 hover:bg-clinical-100'}`}>
            <item.icon className="h-4 w-4" />{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-clinical-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="min-w-0"><p className="truncate text-sm font-medium text-clinical-900">{user?.full_name || user?.username}</p><p className="truncate text-xs text-clinical-500">{user?.email}</p></div>
          <Badge variant="accent">{calmCoins} coins</Badge>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); navigate('/login'); }}><LogOut className="h-4 w-4" />Sign out</Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-clinical-50">
      <aside className="hidden w-64 shrink-0 border-r border-clinical-200 bg-white lg:block">{sidebar}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-clinical-900/40" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <aside className="relative h-full w-72 bg-white shadow-clinical-md">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-clinical-200 bg-white px-4 py-3 lg:hidden">
          <Link to="/home" className="flex items-center gap-2"><img src={calmLogo} alt="ZenHeaven" className="h-8 w-8 rounded-lg" /><span className="font-semibold text-clinical-900">ZenHeaven</span></Link>
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-clinical-600 hover:bg-clinical-100" aria-label="Toggle menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </header>
        <main className="flex-1 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
