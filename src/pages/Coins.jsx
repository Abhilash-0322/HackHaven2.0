import { useCallback, useEffect, useState } from 'react';
import { Award, CheckCircle, Coins as CoinsIcon, Flame, Gift, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { coinsApi } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const REWARDS = [
  { key: 'premium_insights', label: 'Premium AI Insights', cost: 100 },
  { key: 'custom_meditation', label: 'Custom Meditation', cost: 150 },
  { key: 'mindfulness_course', label: 'Mindfulness Course', cost: 200 },
  { key: 'advanced_analytics', label: 'Advanced Analytics', cost: 75 },
  { key: 'priority_support', label: 'Priority Support', cost: 300 },
  { key: 'therapist_session', label: 'Therapist Session Credit', cost: 500 },
];

export default function Coins() {
  const { calmCoins, updateCalmCoins } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txns, dailyGoals, achvs, streakData] = await Promise.all([
        coinsApi.getTransactions(), coinsApi.getDailyGoals(), coinsApi.getAchievements(), coinsApi.getStreak(),
      ]);
      setTransactions(Array.isArray(txns) ? txns : []);
      setGoals(Array.isArray(dailyGoals) ? dailyGoals : []);
      setAchievements(Array.isArray(achvs) ? achvs : []);
      setStreak(streakData);
      await updateCalmCoins();
    } catch (err) { setError(err.message || 'Failed to load coins data'); }
    finally { setLoading(false); }
  }, [updateCalmCoins]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <Spinner label="Loading Calm Coins..." />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8"><h1 className="text-2xl font-semibold text-clinical-900">Calm Coins</h1><p className="mt-1 text-clinical-500">Earn rewards through wellness activities</p></div>
      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}
      {success && <Alert variant="success" className="mb-6">{success}</Alert>}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><CoinsIcon className="h-6 w-6" /></div><div><p className="text-sm text-clinical-500">Balance</p><p className="text-3xl font-semibold text-clinical-900">{calmCoins}</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Flame className="h-6 w-6" /></div><div><p className="text-sm text-clinical-500">Current streak</p><p className="text-3xl font-semibold text-clinical-900">{streak?.current_streak || 0} days</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp className="h-6 w-6" /></div><div><p className="text-sm text-clinical-500">Longest streak</p><p className="text-3xl font-semibold text-clinical-900">{streak?.longest_streak || 0} days</p></div></div></Card>
      </div>
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <Card><CardHeader title="Daily goals" action={<Target className="h-5 w-5 text-accent-500" />} /><div className="space-y-3">{goals.map((goal) => (<div key={goal.id} className="flex items-center justify-between rounded-lg border border-clinical-200 p-3"><div className="flex items-center gap-3">{goal.completed ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <div className="h-5 w-5 rounded-full border-2 border-clinical-300" />}<div><p className="text-sm font-medium text-clinical-800">{goal.title}</p><p className="text-xs text-clinical-500">{goal.current}/{goal.target}</p></div></div><Badge variant="accent">+{goal.coins}</Badge></div>))}</div></Card>
        <Card><CardHeader title="Achievements" action={<Award className="h-5 w-5 text-amber-500" />} /><div className="space-y-3">{achievements.map((ach) => (<div key={ach.id || ach.title} className={`flex items-center justify-between rounded-lg border p-3 ${ach.unlocked ? 'border-emerald-200 bg-emerald-50/50' : 'border-clinical-200'}`}><div><p className="text-sm font-medium text-clinical-800">{ach.title}</p><p className="text-xs text-clinical-500">{ach.description}</p></div>{ach.unlocked ? <Badge variant="success">Unlocked</Badge> : <Badge>{ach.coins} coins</Badge>}</div>))}</div></Card>
      </div>
      <Card className="mb-8">
        <CardHeader title="Redeem rewards" action={<Gift className="h-5 w-5 text-violet-500" />} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{REWARDS.map((reward) => (
          <div key={reward.key} className="flex flex-col justify-between rounded-lg border border-clinical-200 p-4">
            <div><p className="font-medium text-clinical-900">{reward.label}</p><Badge variant="accent" className="mt-2">{reward.cost} coins</Badge></div>
            <Button variant="secondary" size="sm" className="mt-4" loading={redeeming === reward.key} disabled={calmCoins < reward.cost} onClick={async () => {
              setRedeeming(reward.key); setError(''); setSuccess('');
              try { await coinsApi.redeem(reward.cost, 'rewards', `Redeemed: ${reward.label}`); setSuccess(`Redeemed ${reward.label}!`); await loadData(); }
              catch (err) { setError(err.message); } finally { setRedeeming(''); }
            }}>Redeem</Button>
          </div>
        ))}</div>
      </Card>
      <Card>
        <CardHeader title="Transaction history" />
        {transactions.length === 0 ? <p className="text-sm text-clinical-500">No transactions yet</p> : (
          <div className="space-y-2">{transactions.map((txn) => (
            <div key={txn._id || txn.transaction_id} className="flex items-center justify-between rounded-lg bg-clinical-50 px-4 py-3 text-sm">
              <div><p className="font-medium text-clinical-800">{txn.description}</p><p className="text-xs text-clinical-500">{txn.timestamp ? new Date(txn.timestamp).toLocaleString() : ''}</p></div>
              <span className={`font-semibold ${txn.transaction_type === 'earn' ? 'text-emerald-600' : 'text-red-600'}`}>{txn.transaction_type === 'earn' ? '+' : '-'}{txn.amount}</span>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
