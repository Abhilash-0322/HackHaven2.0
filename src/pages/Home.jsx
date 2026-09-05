import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Brain,
  Coins,
  MessageCircle,
  Music,
  Sparkles,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../lib/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
const features = [
  {
    icon: Bot,
    title: 'Agentic AI Support',
    description: 'Streaming mental health chat with transparent agent reasoning and crisis escalation.',
    path: '/chat',
    badge: 'AI Agent',
  },
  {
    icon: BookOpen,
    title: 'Smart Journal',
    description: 'Track moods, get AI analysis, and trigger wellness alerts when needed.',
    path: '/journal',
    badge: 'Insights',
  },
  {
    icon: Music,
    title: 'Music Therapy',
    description: 'Mood-based music recommendations powered by similarity matching.',
    path: '/music',
    badge: 'Recommend',
  },
  {
    icon: Brain,
    title: 'Book Recommendations',
    description: 'Personalized reading suggestions based on your emotional patterns.',
    path: '/books',
    badge: 'Recommend',
  },
  {
    icon: User,
    title: 'Therapist Sessions',
    description: 'Browse licensed professionals and book secure video appointments.',
    path: '/therapists',
    badge: 'Care',
  },
  {
    icon: Coins,
    title: 'Calm Coins',
    description: 'Earn rewards for healthy habits and redeem wellness features.',
    path: '/coins',
    badge: 'Gamify',
  },
];

export default function Home() {
  const { isAuthenticated, user, calmCoins } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadInsights() {
      setLoadingInsights(true);
      try {
        const response = await authService.authenticatedFetch(`${API_BASE_URL}/journal/insights`);
        if (response.ok) {
          setInsights(await response.json());
        }
      } catch {
        setInsights(null);
      } finally {
        setLoadingInsights(false);
      }
    }
    loadInsights();
  }, [isAuthenticated]);

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="agent" className="mb-4">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Agentic mental wellness platform
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Personalized support, recommendations, and alerts — in one calm space
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              ZenHeaven combines AI agents, mood-aware recommendations, and proactive wellness alerts
              to help you navigate stress, anxiety, and emotional challenges with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <Link to="/chat">
                    <Button size="lg" variant="agent">
                      <MessageCircle className="h-5 w-5" />
                      Start AI session
                    </Button>
                  </Link>
                  <Link to="/journal">
                    <Button size="lg" variant="secondary">Open journal</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg">
                      Create free account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="secondary">Sign in</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              <Card className="text-center">
                <p className="text-sm text-slate-500">Welcome back</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{user?.full_name || user?.username}</p>
              </Card>
              <Card className="text-center">
                <p className="text-sm text-slate-500">Calm Coins</p>
                <p className="mt-1 text-lg font-semibold text-brand-700">{calmCoins}</p>
              </Card>
              <Card className="text-center">
                <p className="text-sm text-slate-500">Journal entries</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {loadingInsights ? '…' : insights?.total_entries ?? 0}
                </p>
              </Card>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Platform capabilities</h2>
          <p className="mt-2 text-slate-600">Everything you need for holistic mental wellness</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
            <Link key={feature.path} to={isAuthenticated ? feature.path : '/login'} className="group">
              <Card className="h-full transition-shadow hover:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="default">{feature.badge}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </Card>
            </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="warning" className="mb-4">
                <Bell className="mr-1 inline h-3 w-3" />
                Safety-first alerts
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900">Proactive crisis detection &amp; escalation</h2>
              <p className="mt-3 text-slate-600">
                Our agentic system monitors conversations and journal entries for distress signals,
                surfacing helpline resources and emergency contacts when you need them most.
              </p>
            </div>
            <Card className="bg-slate-50">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-soft">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-agent-100 text-agent-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">AI agent analyzing context</p>
                    <p className="text-slate-500">Streaming reasoning with transparent steps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-soft">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Crisis resources surfaced</p>
                    <p className="text-slate-500">988 Lifeline, Crisis Text Line, local support</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
