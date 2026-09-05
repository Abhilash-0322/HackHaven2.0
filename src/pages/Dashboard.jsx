import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  BookOpen,
  BookMarked,
  Music,
  Users,
  Coins,
  Flame,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import { coinsApi, journalApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const quickLinks = [
  { to: '/chat', label: 'AI Support', icon: MessageSquare, desc: 'Stream a wellness conversation' },
  { to: '/journal', label: 'Journal', icon: BookOpen, desc: 'Reflect and track mood' },
  { to: '/books', label: 'Books', icon: BookMarked, desc: 'Mood-based reading picks' },
  { to: '/music', label: 'Music', icon: Music, desc: 'Therapeutic playlists' },
  { to: '/therapists', label: 'Therapists', icon: Users, desc: 'Book a video session' },
  { to: '/coins', label: 'Calm Coins', icon: Coins, desc: 'Rewards and streaks' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [streak, setStreak] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [bal, str, ins] = await Promise.all([
          coinsApi.getBalance(),
          coinsApi.getStreak(),
          journalApi.getInsights(),
        ]);
        setBalance(bal);
        setStreak(str);
        setInsights(ins);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const coinBalance = balance?.balance ?? user?.calm_coins ?? 0;

  return (
    <AppLayout
      title={`Welcome, ${user?.full_name || user?.username || 'there'}`}
      subtitle="Your clinical wellness overview"
    >
      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Loading dashboard" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-600">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-clinical-900">{coinBalance}</p>
                  <p className="text-xs text-clinical-500">Calm Coins</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-clinical-900">
                    {streak?.current_streak ?? 0}
                  </p>
                  <p className="text-xs text-clinical-500">Day streak</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-clinical-900">
                    {insights?.total_entries ?? 0}
                  </p>
                  <p className="text-xs text-clinical-500">Journal entries</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-clinical-900">
                    {insights?.top_moods?.[0]?._id ?? '—'}
                  </p>
                  <p className="text-xs text-clinical-500">Top mood</p>
                </div>
              </div>
            </Card>
          </div>

          {insights?.top_moods?.length > 0 && (
            <Card>
              <CardHeader title="Mood patterns" subtitle="From your recent journal activity" />
              <div className="flex flex-wrap gap-2">
                {insights.top_moods.map((m) => (
                  <Badge key={m._id} variant="accent">
                    {m._id} ({m.count})
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          <div>
            <h2 className="mb-4 text-sm font-semibold text-clinical-900">Quick access</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="clinical-card flex items-center gap-4 p-4 transition-colors hover:border-accent-200 hover:bg-accent-50/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-clinical-100 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-clinical-900">{link.label}</p>
                    <p className="text-xs text-clinical-500">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-clinical-400" />
                </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
