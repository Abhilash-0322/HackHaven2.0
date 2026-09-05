import { useEffect, useState } from 'react';
import {
  Coins,
  MessageCircle,
  BookOpen,
  Trophy,
  Flame,
  Target,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const SOURCE_ICONS = {
  mental_health_chat: MessageCircle,
  journal: BookOpen,
  achievement: Trophy,
};

const REWARDS = [
  { id: 1, title: 'Premium AI Insights', cost: 100, description: 'Advanced personality analysis' },
  { id: 2, title: 'Custom Meditation', cost: 150, description: 'Personalized meditation sessions' },
  { id: 3, title: 'Mindfulness Course', cost: 200, description: '7-day guided program' },
];

export default function CoinsPage() {
  const { calmCoins, updateCalmCoins } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [txRes, goalsRes, achievementsRes, streakRes, ratesRes] = await Promise.all([
        authService.authenticatedFetch(`${API_BASE_URL}/coins/transactions`),
        authService.authenticatedFetch(`${API_BASE_URL}/coins/daily-goals`),
        authService.authenticatedFetch(`${API_BASE_URL}/coins/achievements`),
        authService.authenticatedFetch(`${API_BASE_URL}/coins/streak`),
        fetch(`${API_BASE_URL}/coins/exchange-rates`),
      ]);

      if (txRes.ok) setTransactions(await txRes.json());
      if (goalsRes.ok) setDailyGoals(await goalsRes.json());
      if (achievementsRes.ok) setAchievements(await achievementsRes.json());
      if (streakRes.ok) setStreak(await streakRes.json());
      if (ratesRes.ok) setExchangeRates(await ratesRes.json());

      await updateCalmCoins();
    } catch {
      setError('Failed to load Calm Coins data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const redeemReward = async (reward) => {
    if (calmCoins < reward.cost) {
      setError(`You need ${reward.cost} coins for this reward`);
      return;
    }
    setError('');
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/coins/spend`, {
        method: 'POST',
        body: JSON.stringify({
          amount: reward.cost,
          source: 'reward_redemption',
          description: `Redeemed: ${reward.title}`,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Redemption failed');
      }
      setMessage(`Successfully redeemed ${reward.title}`);
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading Calm Coins..." />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="brand" className="mb-3">Wellness gamification</Badge>
        <h1 className="text-3xl font-bold text-slate-900">Calm Coins</h1>
        <p className="mt-2 text-slate-600">
          Earn coins through healthy habits and redeem wellness features.
        </p>
      </div>

      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}
      {message && <Alert variant="success" className="mb-6">{message}</Alert>}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white">
          <div className="flex items-center gap-3">
            <Coins className="h-8 w-8" />
            <div>
              <p className="text-sm text-brand-100">Your balance</p>
              <p className="text-3xl font-bold">{calmCoins}</p>
            </div>
          </div>
        </Card>
        {streak && (
          <Card>
            <div className="flex items-center gap-3">
              <Flame className="h-7 w-7 text-orange-500" />
              <div>
                <p className="text-sm text-slate-500">Current streak</p>
                <p className="text-2xl font-bold text-slate-900">{streak.current_streak} days</p>
              </div>
            </div>
          </Card>
        )}
        {exchangeRates?.earning && (
          <Card>
            <p className="text-sm text-slate-500">Earn rates</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>Chat message: +{exchangeRates.earning.mental_health_chat ?? 5} coins</li>
              <li>Journal entry: +{exchangeRates.earning.journal ?? 10} coins</li>
            </ul>
          </Card>
        )}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Daily goals" />
          <div className="space-y-3">
            {dailyGoals.length === 0 ? (
              <p className="text-sm text-slate-500">No goals available</p>
            ) : (
              dailyGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{goal.title}</p>
                      <p className="text-xs text-slate-500">{goal.current}/{goal.target} · +{goal.coins} coins</p>
                    </div>
                  </div>
                  {goal.completed && <Badge variant="success">Done</Badge>}
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Achievements" />
          <div className="space-y-3">
            {achievements.length === 0 ? (
              <p className="text-sm text-slate-500">No achievements yet</p>
            ) : (
              achievements.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <Badge variant={item.unlocked ? 'success' : 'default'}>
                    {item.unlocked ? `+${item.coins}` : 'Locked'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader title="Redeem rewards" />
        <div className="grid gap-4 sm:grid-cols-3">
          {REWARDS.map((reward) => (
            <div key={reward.id} className="rounded-lg border border-slate-100 p-4">
              <h4 className="font-medium text-slate-900">{reward.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{reward.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="brand">{reward.cost} coins</Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={calmCoins < reward.cost}
                  onClick={() => redeemReward(reward)}
                >
                  Redeem
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent transactions" />
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions yet. Chat or journal to earn coins.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 10).map((tx) => {
              const Icon = SOURCE_ICONS[tx.source] || Coins;
              return (
                <div key={tx._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.transaction_type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.transaction_type === 'earn' ? '+' : '-'}{tx.amount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
