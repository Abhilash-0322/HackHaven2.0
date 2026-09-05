import { useState, useEffect } from 'react';
import { Search, BookMarked } from 'lucide-react';
import { booksApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

export default function Books() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { booksApi.recommendByMood(user?.id).then(setRecommendations).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [user?.id]);

  const books = recommendations?.books || [];

  return (
    <div>
      <PageHeader title="Book Picks" subtitle="Curated reads for your wellbeing" />
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <Card className="mb-6">
        <form onSubmit={async (e) => { e.preventDefault(); setSearching(true); try { const d = await booksApi.search(searchQuery); setSearchResults(d.books || d || []); } catch (err) { setError(err.message); } finally { setSearching(false); } }} className="flex gap-2">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" /><input className="editorial-input pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." /></div>
          <Button type="submit" loading={searching}>Search</Button>
        </form>
      </Card>
      {searchResults.length > 0 && <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{searchResults.map((b) => <Card key={b.id}><h4 className="font-serif font-medium">{b.title}</h4><p className="text-sm text-charcoal-muted">{b.author}</p></Card>)}</div>}
      {loading ? <Spinner className="py-20" size="lg" /> : books.length === 0 ? <EmptyState icon={BookMarked} title="No recommendations" />
        : <div><div className="mb-4 flex gap-3 items-center"><h3 className="font-serif text-lg font-semibold">For your mood</h3>{recommendations?.mood && <Badge variant="accent">{recommendations.mood}</Badge>}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{books.map((b) => <Card key={b.id}><h4 className="font-serif font-medium">{b.title}</h4><p className="text-sm text-charcoal-muted">{b.author}</p></Card>)}</div></div>}
    </div>
  );
}
