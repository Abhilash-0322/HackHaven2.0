import { useEffect, useState } from 'react';
import { BookOpen, Lightbulb, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { Textarea } from '../components/ui/Input';

export default function Journal() {
  const { updateCalmCoins } = useAuth();
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [entriesRes, promptsRes, insightsRes] = await Promise.all([
        authService.authenticatedFetch(`${API_BASE_URL}/journal/entries`),
        authService.authenticatedFetch(`${API_BASE_URL}/journal/prompts`),
        authService.authenticatedFetch(`${API_BASE_URL}/journal/insights`),
      ]);

      setEntries(await entriesRes.json());
      setPrompts(await promptsRes.json());
      setInsights(await insightsRes.json());
    } catch {
      setError('Failed to load journal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const analyzeMood = async () => {
    if (content.trim().length < 10) {
      setError('Write at least 10 characters to analyze mood');
      return;
    }
    setAnalyzing(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/journal/analyze-mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Analysis failed');
      setMoodAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveEntry = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/journal/entries`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          mood: moodAnalysis?.mood,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to save entry');
      }
      setContent('');
      setMoodAnalysis(null);
      setShowForm(false);
      await updateCalmCoins();
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await authService.authenticatedFetch(`${API_BASE_URL}/journal/entries/${id}`, {
        method: 'DELETE',
      });
      await fetchData();
    } catch {
      setError('Failed to delete entry');
    }
  };

  if (loading) return <Spinner label="Loading journal..." />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="brand" className="mb-3">Mood tracking &amp; alerts</Badge>
        <h1 className="text-3xl font-bold text-slate-900">Journal</h1>
        <p className="mt-2 text-slate-600">
          Reflect on your day, analyze moods with AI, and build emotional awareness over time.
        </p>
      </div>

      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}

      {insights && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-500">Total entries</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{insights.total_entries ?? 0}</p>
          </Card>
          <Card className="sm:col-span-2">
            <p className="text-sm text-slate-500">Top moods</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(insights.top_moods || []).slice(0, 5).map((mood) => (
                <Badge key={mood._id} variant="brand">{mood._id} ({mood.count})</Badge>
              ))}
              {(!insights.top_moods || insights.top_moods.length === 0) && (
                <span className="text-sm text-slate-400">No mood data yet</span>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Write an entry"
            action={
              !showForm && (
                <Button size="sm" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4" />
                  New entry
                </Button>
              )
            }
          />
          {showForm ? (
            <form onSubmit={saveEntry} className="space-y-4">
              <Textarea
                label="What's on your mind?"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setMoodAnalysis(null);
                }}
                rows={6}
                placeholder="Write freely about your thoughts and feelings..."
              />
              {moodAnalysis && (
                <Alert variant="info" title={`Detected mood: ${moodAnalysis.mood}`}>
                  <p>{moodAnalysis.mood_description}</p>
                  {moodAnalysis.suggestions?.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm">
                      {moodAnalysis.suggestions.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </Alert>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={analyzeMood} loading={analyzing}>
                  Analyze mood
                </Button>
                <Button type="submit" loading={submitting}>Save entry</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setContent(''); setMoodAnalysis(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Start journaling"
              description="Regular entries help our recommendation systems personalize music, books, and support."
            />
          )}
        </Card>

        <Card>
          <CardHeader title="Writing prompts" />
          <ul className="space-y-3">
            {prompts.slice(0, 6).map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="flex w-full items-start gap-2 rounded-lg p-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    setContent(item.prompt);
                    setShowForm(true);
                  }}
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {item.prompt}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent entries" />
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article key={entry._id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">{entry.title || 'Untitled'}</h4>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.mood && <Badge variant="brand">{entry.mood}</Badge>}
                    <button
                      type="button"
                      onClick={() => deleteEntry(entry._id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{entry.content}</p>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
