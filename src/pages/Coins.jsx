import { useState, useEffect } from 'react';
import { Coins as CoinsIcon, Trophy, Flame, Target, Gift } from 'lucide-react';
import { coinsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import QuoteBlock from '../components/ui/QuoteBlock';

export default function Coins() {
  const { calmCoins, updateCalmCoins } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await updateCalmCoins();
      const [txData, goalsData, achievementsData, streakData] = await Promise.all([
        coinsApi.getTransactions().catch(() => []),
        coinsApi.getDailyGoals().catch(() => ({ goals: [] })),
        coinsApi.getAchievements().catch(() => ({ achievements: [] })),
        coinsApi.getStreak().catch(() => null),
      ]);
      setTransactions(Array.isArray(txData) ? txData : txData?.transactions || []);
      setDailyGoals(goalsData?.goals || goalsData || []);
      setAchievements(achievementsData?.achievements || achievementsData || []);
      setStreak(streakData);
    } catch { setError('Failed to load coins data'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="editorial-container py-12 flex justify-center"><Spinner size="lg" label="Loading your rewards..." /></div>;

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Rewards" title="Calm Coins" subtitle="Earn coins through wellness activities and unlock meaningful rewards." />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <Card className="mb-10 text-center bg-editorial-ink text-cream !border-0">
        <CoinsIcon className="w-10 h-10 text-terracotta mx-auto mb-4" />
        <p className="font-display text-5xl md:text-6xl mb-2">{calmCoins}</p>
        <p className="editorial-byline text-cream/60">Calm Coins Balance</p>
        {streak && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Flame className="w-4 h-4 text-terracotta" />
            <span className="font-sans text-sm text-cream/80">{streak.current_streak || streak.streak || 0} day streak</span>
          </div>
        )}
      </Card>

      <QuoteBlock quote="Small daily improvements over time lead to stunning results." attribution="Robin Sharma" className="mb-10" />

      {dailyGoals.length > 0 && (
        <section className="mb-10">
          <p className="editorial-section-number">Today</p>
          <h2 className="font-display text-2xl mb-6">Daily Goals</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {dailyGoals.map((goal) => (
              <Card key={goal.id || goal.title} className="!py-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-terracotta shrink-0" />
                  <div className="flex-1">
                    <p className="font-sans text-sm font-medium">{goal.title}</p>
                    <p className="font-serif text-xs text-charcoal-muted">{goal.current || 0}/{goal.target || 1} · +{goal.coins || 0} coins</p>
                  </div>
                  {goal.completed && <Badge variant="success">Done</Badge>}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="mb-10">
          <p className="editorial-section-number">Milestones</p>
          <h2 className="font-display text-2xl mb-6">Achievements</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id || achievement.title} className={`!py-4 ${!achievement.unlocked ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-terracotta shrink-0" />
                  <div>
                    <CardTitle className="!text-base">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                    <Badge className="mt-2">+{achievement.coins || 0} coins</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="editorial-section-number">History</p>
        <h2 className="font-display text-2xl mb-6">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <Card>
            <div className="flex items-center gap-3 text-charcoal-muted">
              <Gift className="w-5 h-5" />
              <p className="font-serif text-sm">Complete wellness activities to start earning coins.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 15).map((tx, i) => (
              <Card key={tx.id || i} className="!py-3 flex justify-between items-center">
                <div>
                  <p className="font-sans text-sm">{tx.description || tx.source || 'Transaction'}</p>
                  <p className="font-serif text-xs text-charcoal-muted">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : ''}</p>
                </div>
                <span className={`font-sans font-medium text-sm ${(tx.amount || 0) >= 0 ? 'text-green-700' : 'text-terracotta'}`}>
                  {(tx.amount || 0) >= 0 ? '+' : ''}{tx.amount || 0}
                </span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
