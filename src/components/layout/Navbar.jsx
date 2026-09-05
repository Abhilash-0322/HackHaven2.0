import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  BookOpen,
  Coins,
  Heart,
  LogOut,
  Menu,
  MessageCircle,
  Music,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const navItems = [
  { label: 'Home', path: '/', icon: Sparkles },
  { label: 'AI Support', path: '/chat', icon: MessageCircle, protected: true },
  { label: 'Journal', path: '/journal', icon: BookOpen, protected: true },
  { label: 'Therapists', path: '/therapists', icon: User, protected: true },
  { label: 'Music', path: '/music', icon: Music, protected: true },
  { label: 'Books', path: '/books', icon: Heart, protected: true },
  { label: 'Calm Coins', path: '/coins', icon: Coins, protected: true },
];

function NavItem({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, calmCoins, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => !item.protected || isAuthenticated);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-agent-600 text-white shadow-sm">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900">ZenHeaven</span>
            <span className="hidden text-xs text-slate-500 sm:block">Agentic wellness platform</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Badge variant="brand">
                <Coins className="mr-1 inline h-3 w-3" />
                {calmCoins} coins
              </Badge>
              <span className="text-sm text-slate-600">{user?.username}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {visibleItems.map((item) => (
              <NavItem key={item.path} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-3 text-sm text-slate-600">
                  <span>{user?.username}</span>
                  <Badge variant="brand">{calmCoins} coins</Badge>
                </div>
                <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
