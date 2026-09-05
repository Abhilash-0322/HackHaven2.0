import { useEffect, useState } from 'react';
import { Book, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

function BookGrid({ books, onSelect }) {
  if (!books?.length) {
    return <p className="text-sm text-slate-500">No books found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} padding={false} className="overflow-hidden">
          <div className="flex h-full flex-col">
            {book.image_url && (
              <img
                src={book.image_url}
                alt={book.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
            )}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-slate-900 line-clamp-2">{book.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{book.author}</p>
              {book.description && (
                <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">{book.description}</p>
              )}
              {onSelect && (
                <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => onSelect(book.id)}>
                  Similar books
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Books() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      setError('');
      try {
        const params = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : '';
        const response = await fetch(`${API_BASE_URL}/books/recommend-by-mood${params}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to load recommendations');
        setRecommendations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, [user?.id]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError('');
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Search failed');
      setSearchResults(data.books || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const loadSimilar = async (bookId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/books/recommend/${bookId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to load similar books');
      setRecommendations({
        mood: 'similar',
        mood_description: `Books similar to "${data.original_book.title}"`,
        books: data.recommended_books,
      });
      setSearchResults([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="agent" className="mb-3">Recommendation system</Badge>
        <h1 className="text-3xl font-bold text-slate-900">Book Recommendations</h1>
        <p className="mt-2 text-slate-600">
          Personalized reading suggestions based on your journal moods and emotional patterns.
        </p>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <Button type="submit" loading={searching}>Search</Button>
        </form>
      </Card>

      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}

      {loading ? (
        <Spinner label="Loading recommendations..." />
      ) : searchResults.length > 0 ? (
        <section>
          <CardHeader title="Search results" />
          <BookGrid books={searchResults} onSelect={loadSimilar} />
        </section>
      ) : recommendations ? (
        <section>
          <CardHeader
            title={recommendations.mood === 'similar' ? 'Similar books' : `Books for your ${recommendations.mood} mood`}
            description={recommendations.mood_description}
          />
          {recommendations.message && (
            <Alert variant="info" className="mb-4">{recommendations.message}</Alert>
          )}
          <BookGrid books={recommendations.books} onSelect={loadSimilar} />
        </section>
      ) : (
        <EmptyState
          icon={Book}
          title="No recommendations yet"
          description="Write a few journal entries to unlock mood-based book suggestions."
        />
      )}
    </div>
  );
}
