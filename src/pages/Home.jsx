import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const name = user?.full_name || user?.username || 'friend';
  const links = [{ to: '/chat', t: 'Chat' }, { to: '/journal', t: 'Journal' }, { to: '/books', t: 'Books' }, { to: '/music', t: 'Music' }, { to: '/therapists', t: 'Therapists' }, { to: '/coins', t: 'Coins' }];
  return (
    <AppLayout>
      <Badge variant="mint" className="mb-4">Organic Calm</Badge>
      <h1 className="font-display text-4xl font-semibold text-forest">Hello, {name} 🌿</h1>
      <p className="mt-4 text-sage-600 max-w-xl">Your personal sanctuary for mental wellness.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {links.map(({ to, t }) => <Link key={to} to={to}><Card hover><h3 className="font-display font-semibold">{t}</h3></Card></Link>)}
      </div>
    </AppLayout>
  );
}
