import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Coins, Flame, MessageCircle, Music, NotebookPen, Stethoscope, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Badge from '../components/ui/Badge';
import Card, { CardHeader } from '../components/ui/Card';

const quickLinks = [
  { to: '/chat', label: 'AI Support', icon: MessageCircle, color: 'bg-violet-50 text-violet-600' },
  { to: '/journal', label: 'Journal', icon: NotebookPen, color: 'bg-emerald-50 text-emerald-600' },
  { to: '/books', label: 'Books', icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
  { to: '/music', label: 'Music', icon: Music, color: 'bg-pink-50 text-pink-600' },
  { to: '/therapists', label: 'Therapists', icon: Stethoscope, color: 'bg-blue-50 text-blue-600' },
  { to: '/coins', label: 'Calm Coins', icon: Coins, color: 'bg-accent-50 text-accent-600' },
];

export default function Dashboard() {
  const { user, calmCoins } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-clinical-900">{greeting}, {user?.full_name || user?.username}</h1>
        <p className="mt-1 text-clinical-500">Your clinical wellness dashboard</p>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><Coins className="h-5 w-5" /></div><div><p className="text-sm text-clinical-500">Calm Coins</p><p className="text-2xl font-semibold text-clinical-900">{calmCoins}</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Target className="h-5 w-5" /></div><div><p className="text-sm text-clinical-500">Daily goals</p><p className="text-2xl font-semibold text-clinical-900">Track</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Flame className="h-5 w-5" /></div><div><p className="text-sm text-clinical-500">Streak</p><p className="text-2xl font-semibold text-clinical-900">Build</p></div></div></Card>
      </div>
      <Card className="mb-8">
        <CardHeader title="Quick access" description="Jump into your wellness tools" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="flex items-center gap-3 rounded-lg border border-clinical-200 p-4 transition-colors hover:border-accent-300 hover:bg-accent-50/50">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.color}`}><link.icon className="h-5 w-5" /></div>
              <span className="font-medium text-clinical-800">{link.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-clinical-400" />
            </Link>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Getting started" description="Recommended actions for today" />
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-clinical-50 px-4 py-3"><div className="flex items-center gap-3"><Badge variant="agent">1</Badge><span className="text-sm text-clinical-700">Check in with AI support</span></div><Link to="/chat" className="text-sm font-medium text-accent-600">Start chat</Link></div>
          <div className="flex items-center justify-between rounded-lg bg-clinical-50 px-4 py-3"><div className="flex items-center gap-3"><Badge variant="success">2</Badge><span className="text-sm text-clinical-700">Write a journal entry</span></div><Link to="/journal" className="text-sm font-medium text-accent-600">Open journal</Link></div>
          <div className="flex items-center justify-between rounded-lg bg-clinical-50 px-4 py-3"><div className="flex items-center gap-3"><Badge variant="accent">3</Badge><span className="text-sm text-clinical-700">Complete daily wellness goals</span></div><Link to="/coins" className="text-sm font-medium text-accent-600">View goals</Link></div>
        </div>
      </Card>
    </div>
  );
}
