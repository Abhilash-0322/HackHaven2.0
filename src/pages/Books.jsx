import { useEffect, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { booksApi } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function Books() {
  const { user } = useAuth();
  const [moodBooks, setMoodBooks] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try { setMoodBooks(await booksApi.recommendByMood(user?.id)); }
      catch (err) { setError(err.message || 'Failed to load recommendations'); }
      finally { setLoading(false); }
    }
    if (user?.id) load();
  }, [user?.id]);

  const BookGrid = ({ books, onSelect }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="flex flex-col">
          {book.image_url && <img src={book.image_url} alt={book.title} className="mb-3 h-40 w-full rounded-lg object-cover" />}
          <h3 className="font-medium text-clinical-900 line-clamp-2">{book.title}</h3>
          {book.author && <p className="mt-1 text-sm text-clinical-500">{book.author}</p>}
          {onSelect && <Button variant="secondary" size="sm" className="mt-3" onClick={() => booksApi.recommend(book.id).then((d) => setSimilarBooks(d.books || [])).catch((err) => setError(err.message))}>Similar books</Button>}
        </Card>
      ))}
    </div>
  );

  if (loading) return <Spinner label="Loading book recommendations..." />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8"><h1 className="text-2xl font-semibold text-clinical-900">Books</h1><p className="mt-1 text-clinical-500">Mood-based reading recommendations</p></div>
      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}
      <Card className="mb-8">
        <form onSubmit={async (e) => { e.preventDefault(); if (!searchQuery.trim()) return; setSearching(true); try { const data = await booksApi.search(searchQuery); setSearchResults(data.books || data || []); } catch (err) { setError(err.message); } finally { setSearching(false); } }} className="flex gap-3">
          <Input placeholder="Search for books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
          <Button type="submit" loading={searching}><Search className="h-4 w-4" />Search</Button>
        </form>
      </Card>
      {searchResults.length > 0 && <section className="mb-8"><CardHeader title="Search results" className="mb-4" /><BookGrid books={searchResults} onSelect /></section>}
      {similarBooks.length > 0 && <section className="mb-8"><CardHeader title="Similar books" className="mb-4" /><BookGrid books={similarBooks} /></section>}
      {moodBooks ? (
        <section>
          <CardHeader title="Recommended for your mood" description={moodBooks.mood_description} action={<Badge variant="accent">{moodBooks.mood}</Badge>} className="mb-4" />
          {(moodBooks.books || []).length > 0 ? <BookGrid books={moodBooks.books} onSelect /> : <EmptyState icon={BookOpen} title="No mood-based recommendations" description="Write a journal entry with mood analysis first." />}
        </section>
      ) : <EmptyState icon={BookOpen} title="No recommendations yet" description="Journal about your mood to unlock suggestions." />}
    </div>
  );
}
