import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, NotebookPen } from 'lucide-react';
import { journalApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card, { CardTitle } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';

export default function Journal() {
  const { updateCalmCoins } = useAuth();
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', mood: '', tags: '' });
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entriesData, promptsData, insightsData] = await Promise.all([
        journalApi.getEntries(), journalApi.getPrompts(), journalApi.getInsights(),
      ]);
      setEntries(entriesData || []);
      setPrompts(promptsData?.prompts || promptsData || []);
      setInsights(insightsData);
    } catch {
      setError('Failed to load journal data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { setForm({ title: '', content: '', mood: '', tags: '' }); setEditingId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [] };
      if (editingId) await journalApi.updateEntry(editingId, payload);
      else { await journalApi.createEntry(payload); await updateCalmCoins(); }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save entry');
    }
  };

  const handleEdit = (entry) => {
    setForm({ title: entry.title || '', content: entry.content || '', mood: entry.mood || '', tags: (entry.tags || []).join(', ') });
    setEditingId(entry.id || entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try { await journalApi.deleteEntry(id); await loadData(); }
    catch { setError('Failed to delete entry'); }
  };

  const analyzeMood = async () => {
    if (!form.content.trim()) return;
    setAnalyzing(true);
    try {
      const result = await journalApi.analyzeMood(form.content);
      setForm((prev) => ({ ...prev, mood: result.mood || result.detected_mood || '' }));
    } catch { setError('Mood analysis failed'); }
    finally { setAnalyzing(false); }
  };

  if (loading) return <div className="editorial-container py-12 flex justify-center"><Spinner size="lg" label="Loading your journal..." /></div>;

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Reflection" title="Your Journal" subtitle="A private space to capture thoughts, track moods, and discover patterns."
        actions={<Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="w-4 h-4" /> New entry</Button>} />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      {insights && (
        <Card className="mb-8">
          <CardTitle>Insights</CardTitle>
          <p className="font-serif text-charcoal-light mt-2">{insights.summary || insights.message || JSON.stringify(insights)}</p>
        </Card>
      )}

      {prompts.length > 0 && (
        <div className="mb-8">
          <p className="editorial-section-number">Prompts</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {prompts.slice(0, 4).map((prompt, i) => (
              <button key={i} type="button" onClick={() => { setForm((p) => ({ ...p, content: typeof prompt === 'string' ? prompt : prompt.text })); setShowForm(true); }}
                className="text-left p-4 border border-editorial-border rounded-sm hover:border-terracotta transition-colors font-serif text-sm text-charcoal-light">
                {typeof prompt === 'string' ? prompt : prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="editorial-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="editorial-input min-h-[160px] resize-y" placeholder="What's on your mind?" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <div className="flex gap-3 flex-wrap">
              <input className="editorial-input flex-1" placeholder="Mood" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
              <Button type="button" variant="secondary" onClick={analyzeMood} disabled={analyzing}>{analyzing ? 'Analyzing...' : 'Analyze mood'}</Button>
            </div>
            <input className="editorial-input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <div className="flex gap-3">
              <Button type="submit">{editingId ? 'Update' : 'Save'} entry</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {entries.length === 0 ? (
        <EmptyState icon={NotebookPen} title="No entries yet" description="Begin your reflective practice with your first journal entry."
          action={<Button onClick={() => setShowForm(true)}>Write your first entry</Button>} />
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id || entry._id}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-lg">{entry.title || 'Untitled'}</h3>
                  <p className="font-serif text-sm text-charcoal-muted mt-1">
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </p>
                  {entry.mood && <Badge className="mt-2">{entry.mood}</Badge>}
                  <p className="font-serif text-charcoal-light mt-3 leading-relaxed line-clamp-4">{entry.content}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => handleEdit(entry)} className="p-2 text-charcoal-muted hover:text-terracotta"><Edit className="w-4 h-4" /></button>
                  <button type="button" onClick={() => handleDelete(entry.id || entry._id)} className="p-2 text-charcoal-muted hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
