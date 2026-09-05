import { useEffect, useState } from 'react';
import { Lightbulb, NotebookPen, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { journalApi } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

export default function Journal() {
  const { updateCalmCoins } = useAuth();
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entriesData, promptsData, insightsData] = await Promise.all([journalApi.getEntries(), journalApi.getPrompts(), journalApi.getInsights()]);
      setEntries(Array.isArray(entriesData) ? entriesData : []);
      setPrompts(Array.isArray(promptsData) ? promptsData : []);
      setInsights(insightsData);
    } catch (err) { setError(err.message || 'Failed to load journal data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true); setError('');
    try {
      await journalApi.createEntry({ content, mood: mood || undefined, tags: [] });
      setContent(''); setMood(''); setMoodAnalysis(null); setShowForm(false);
      await loadData(); await updateCalmCoins();
    } catch (err) { setError(err.message || 'Failed to save entry'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner label="Loading journal..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-clinical-900">Journal</h1><p className="mt-1 text-clinical-500">Reflect, track moods, and gain insights</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" />New entry</Button>
      </div>
      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}
      {insights && (
        <Card className="mb-6">
          <CardHeader title="Insights" description="Patterns from your journaling" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-clinical-50 p-4 text-center"><p className="text-2xl font-semibold text-clinical-900">{insights.total_entries || 0}</p><p className="text-sm text-clinical-500">Total entries</p></div>
            <div className="rounded-lg bg-clinical-50 p-4">{(insights.top_moods || []).slice(0, 3).map((m) => <Badge key={m._id} variant="accent" className="mr-1">{m._id} ({m.count})</Badge>)}</div>
            <div className="rounded-lg bg-clinical-50 p-4">{(insights.top_tags || []).slice(0, 3).map((t) => <Badge key={t._id} className="mr-1">{t._id}</Badge>)}</div>
          </div>
        </Card>
      )}
      {showForm && (
        <Card className="mb-6">
          <CardHeader title="New journal entry" />
          <form onSubmit={handleCreate} className="space-y-4">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind today?" rows={6} className="clinical-input resize-none" required />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" loading={analyzing} onClick={async () => { if (!content.trim()) return; setAnalyzing(true); try { const result = await journalApi.analyzeMood(content); setMood(result.mood || ''); setMoodAnalysis(result); } catch (err) { setError(err.message); } finally { setAnalyzing(false); } }}><Sparkles className="h-4 w-4" />Analyze mood</Button>
              {mood && <Badge variant="accent">Mood: {mood}</Badge>}
            </div>
            {moodAnalysis && <div className="rounded-lg bg-accent-50 p-4 text-sm text-accent-800"><p className="font-medium">{moodAnalysis.mood_description}</p></div>}
            <div className="flex gap-3"><Button type="submit" loading={saving}>Save entry</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </form>
        </Card>
      )}
      {prompts.length > 0 && (
        <Card className="mb-6">
          <CardHeader title="Writing prompts" action={<Lightbulb className="h-5 w-5 text-amber-500" />} />
          <div className="flex flex-wrap gap-2">{prompts.slice(0, 6).map((p) => <button key={p.prompt} type="button" onClick={() => { setContent(p.prompt); setShowForm(true); }} className="rounded-lg border border-clinical-200 px-3 py-2 text-sm hover:border-accent-300 hover:bg-accent-50">{p.prompt}</button>)}</div>
        </Card>
      )}
      {entries.length === 0 ? <EmptyState icon={NotebookPen} title="No journal entries yet" description="Start writing to track your thoughts." action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Write your first entry</Button>} /> : (
        <div className="space-y-4">{entries.map((entry) => (
          <Card key={entry.id || entry._id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><h3 className="font-medium text-clinical-900">{entry.title || 'Journal entry'}</h3>{entry.mood && <Badge variant="accent">{entry.mood}</Badge>}</div>
                <p className="mt-2 text-sm text-clinical-600 line-clamp-3">{entry.content}</p>
                <p className="mt-2 text-xs text-clinical-400">{entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ''}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={async () => { if (!window.confirm('Delete?')) return; try { await journalApi.deleteEntry(entry.id || entry._id); await loadData(); } catch (err) { setError(err.message); } }} aria-label="Delete entry"><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </Card>
        ))}</div>
      )}
    </div>
  );
}
