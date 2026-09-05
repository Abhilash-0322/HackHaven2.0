import { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { journalApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const MOODS = ['calm', 'anxious', 'sad', 'happy', 'stressed', 'hopeful', 'grateful', 'overwhelmed'];
const eid = (e) => e._id?.$oid || e._id;

export default function Journal() {
  const { updateCalmCoins, user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: '', mood: '', tags: '' });

  const loadData = async () => {
    try {
      const [e, p, i] = await Promise.all([journalApi.getEntries(), journalApi.getPrompts(), journalApi.getInsights()]);
      setEntries(Array.isArray(e) ? e : []); setPrompts(Array.isArray(p) ? p : []); setInsights(i);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <PageHeader title="Journal" subtitle="Reflection and mood insights" />
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      {loading ? <Spinner className="py-20" size="lg" /> : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex justify-between"><h2 className="font-serif text-lg font-semibold">Entries</h2><Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> New</Button></div>
            {showForm && (
              <Card>
                <form onSubmit={async (e) => { e.preventDefault(); try { await journalApi.createEntry({ content: form.content, mood: form.mood || null, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [] }); setShowForm(false); setForm({ content: '', mood: '', tags: '' }); if (user) updateCalmCoins((user.calm_coins || 0) + 10); loadData(); } catch (err) { setError(err.message); } }} className="space-y-4">
                  <textarea className="editorial-input min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                  <select className="editorial-input" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}><option value="">Auto-detect</option>{MOODS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={async () => { try { const r = await journalApi.analyzeMood(form.content); setForm((f) => ({ ...f, mood: r.mood })); } catch (err) { setError(err.message); } }}><Sparkles className="h-4 w-4" /> Analyze</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </Card>
            )}
            {entries.length === 0 ? <EmptyState icon={Plus} title="No entries" action={<Button onClick={() => setShowForm(true)}>Create</Button>} />
              : entries.map((en) => (
                <div key={eid(en)} className="editorial-card flex justify-between p-4">
                  <div><p className="text-sm font-medium">{en.title || 'Untitled'}</p><p className="line-clamp-2 text-xs text-charcoal-muted">{en.content}</p>{en.mood && <Badge variant="accent" className="mt-2">{en.mood}</Badge>}</div>
                  <button onClick={async () => { await journalApi.deleteEntry(eid(en)); loadData(); }}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
          </div>
          <div className="space-y-4">
            <Card><CardHeader title="Prompts" />{prompts.slice(0, 6).map((p, i) => <button key={i} onClick={() => { setForm({ ...form, content: p.prompt }); setShowForm(true); }} className="mb-1 block w-full text-left text-xs p-2 hover:bg-cream-muted">{p.prompt}</button>)}</Card>
            <Card><CardHeader title="Insights" /><p className="text-sm flex justify-between"><span>Total</span><span>{insights?.total_entries ?? 0}</span></p></Card>
          </div>
        </div>
      )}
    </div>
  );
}
