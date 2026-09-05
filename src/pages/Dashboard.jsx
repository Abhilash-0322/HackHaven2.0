import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Bot, Coins, Flame, Headphones, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../lib/api';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const actions = [
  { label: 'Talk to Zen', detail: 'A private check-in', path: '/chat', icon: Bot, tint: 'bg-sky-50 text-sky-600' },
  { label: 'Write it down', detail: 'Clear some headspace', path: '/journal', icon: BookOpen, tint: 'bg-indigo-50 text-indigo-600' },
  { label: 'Find your sound', detail: 'Mood-based music', path: '/music', icon: Headphones, tint: 'bg-cyan-50 text-cyan-600' },
  { label: 'Meet a therapist', detail: 'Professional support', path: '/therapists', icon: HeartHandshake, tint: 'bg-emerald-50 text-emerald-600' },
];

export default function Dashboard() {
  const { user, calmCoins } = useAuth();
  const [insights, setInsights] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      authService.authenticatedFetch(`${API_BASE_URL}/journal/insights`),
      authService.authenticatedFetch(`${API_BASE_URL}/coins/streak`),
    ])
      .then(async ([insightsResponse, streakResponse]) => {
        const nextInsights = insightsResponse.ok ? await insightsResponse.json() : null;
        const nextStreak = streakResponse.ok ? await streakResponse.json() : null;
        if (active) {
          setInsights(nextInsights);
          setStreak(nextStreak?.current_streak || 0);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Spinner label="Loading your space..." />;

  const name = user?.full_name?.split(' ')[0] || user?.username || 'friend';

  return (
    <div className="telegram-grid min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Badge variant="brand" className="mb-3 rounded-full"><Sparkles className="mr-1 inline h-3.5 w-3.5" /> your private space</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Good to see you, {name}.</h1>
            <p className="mt-2 max-w-xl text-slate-500">Take a breath. What would feel most supportive right now?</p>
          </div>
          <Link to="/chat" className="inline-flex items-center gap-2 self-start rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-600 md:self-auto">
            Open a check-in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="bg-brand-500 text-white shadow-card">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-sky-100">Calm Coins</p><p className="mt-1 text-3xl font-bold">{calmCoins}</p></div>
              <Coins className="h-8 w-8 text-sky-100" />
            </div>
            <Link to="/coins" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white">See rewards <ArrowRight className="h-3 w-3" /></Link>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Journal entries</p><p className="mt-1 text-3xl font-bold text-slate-900">{insights?.total_entries ?? 0}</p></div><BookOpen className="h-8 w-8 text-indigo-300" /></div>
            <p className="mt-4 text-xs text-slate-400">Small reflections add up.</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Current streak</p><p className="mt-1 text-3xl font-bold text-slate-900">{streak} <span className="text-base font-medium">days</span></p></div><Flame className="h-8 w-8 text-orange-300" /></div>
            <p className="mt-4 text-xs text-slate-400">Consistency over perfection.</p>
          </Card>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Choose your next step</h2><span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">4 ways to feel better</span></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link key={action.path} to={action.path} className="group">
                  <Card className="h-full transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-card">
                    <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl ${action.tint}`}><ActionIcon className="h-5 w-5" /></div>
                    <h3 className="font-semibold text-slate-900">{action.label}</h3>
                    <p className="mt-1 text-sm text-slate-500">{action.detail}</p>
                    <ArrowRight className="mt-5 h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden border-0 bg-slate-900 text-white shadow-card">
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div><div className="mb-3 flex items-center gap-2 text-sky-300"><Sparkles className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.16em]">A gentle reminder</span></div><h2 className="text-2xl font-bold">You don&apos;t have to figure it all out today.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">ZenHeaven is a quiet place to check in, get perspective, and take one small next step whenever you need it.</p></div>
            <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-sky-50">Explore something new <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
