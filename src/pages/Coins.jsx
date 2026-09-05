import { useCallback, useEffect, useState } from 'react';
import { Coins as CoinsIcon, Flame, Target } from 'lucide-react';
import { coinsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function Coins() {
  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState(null);
  const [txns, setTxns] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, t, g, a, s] = await Promise.all([coinsApi.getBalance(), coinsApi.getTransactions(), coinsApi.getDailyGoals(), coinsApi.getAchievements(), coinsApi.getStreak()]);
      setBalance(b); setTxns(t || []); setGoals(g || []); setAchievements(a || []); setStreak(s);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner className="py-20" size="lg" />;
  const coinBalance = balance?.balance ?? user?.calm_coins ?? 0;

  return (
    <div>
      <PageHeader title="Calm Coins" subtitle="Balance, goals, and streaks" />
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-5"><CoinsIcon className="mb-2 h-5 w-5 text-terracotta" /><p className="font-serif text-3xl font-semibold">{coinBalance}</p></Card>
        <Card className="p-5"><Flame className="mb-2 h-5 w-5 text-terracotta" /><p className="font-serif text-3xl font-semibold">{streak?.current_streak ?? 0}</p></Card>
        <Card className="p-5"><Target className="mb-2 h-5 w-5 text-terracotta" /><p className="font-serif text-3xl font-semibold">{txns.length}</p></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card><h3 className="mb-4 font-serif font-semibold">Daily goals</h3>{goals.map((g) => <div key={g.id} className="mb-2 flex justify-between border border-cream-dark p-3 text-sm rounded-sm"><span>{g.title}</span><span className="text-terracotta">+{g.coins}</span></div>)}</Card>
        <Card><h3 className="mb-4 font-serif font-semibold">Achievements</h3>{achievements.map((a) => <div key={a.id} className="mb-2 border border-cream-dark p-3 rounded-sm text-sm">{a.title}</div>)}</Card>
      </div>
      <Card>
        <div className="flex justify-between items-center mb-4"><h3 className="font-serif font-semibold">Transactions</h3><Button disabled={coinBalance < 100} onClick={async () => { await coinsApi.spend(100, 'rewards', 'Premium Insights'); await refreshUser(); load(); }}>Spend 100</Button></div>
        {txns.map((t) => <div key={t._id} className="flex justify-between py-1 text-xs text-charcoal-muted"><span>{t.description}</span><span>{t.transaction_type === 'earn' ? '+' : '-'}{t.amount}</span></div>)}
      </Card>
    </div>
  );
}
