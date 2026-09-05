import { useState, useEffect } from 'react';
import { Search, BookOpen, ExternalLink } from 'lucide-react';
import { booksApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';

export default function Books() {
  const [recommendations, setRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadRecommendations(); }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try { setRecommendations(await booksApi.recommendByMood()); }
    catch { setError('Failed to load book recommendations'); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError('');
    try {
      const data = await booksApi.search(searchQuery);
      setSearchResults(data.books || data || []);
    } catch { setError('Search failed. Please try again.'); }
    finally { setSearching(false); }
  };

  const loadSimilar = async (bookId) => {
    setLoading(true);
    try {
      const data = await booksApi.recommendById(bookId);
      setRecommendations({ mood_description: `Books similar to "${data.original_book?.title || 'your selection'}"`, books: data.recommended_books || [] });
      setSearchResults([]);
    } catch { setError('Failed to load similar books'); }
    finally { setLoading(false); }
  };

  const books = searchResults.length > 0 ? searchResults : recommendations?.books || [];

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Reading" title="Curated Books" subtitle="Literature matched to your emotional landscape and personal growth." />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for a book..." className="editorial-input pl-10" />
        </div>
        <Button type="submit" disabled={searching}>{searching ? 'Searching...' : 'Search'}</Button>
      </form>

      {recommendations?.mood_description && searchResults.length === 0 && (
        <div className="mb-8">
          <Badge>{recommendations.mood || 'Personalized'}</Badge>
          <p className="font-serif text-charcoal-light mt-3">{recommendations.mood_description}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Finding books for you..." /></div>
      ) : books.length === 0 ? (
        <EmptyState icon={BookOpen} title="No books found" description="Try searching for a title or check back later for mood-based recommendations." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <Card key={book.id || book.google_id || i} className="flex flex-col">
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} className="w-full h-48 object-cover rounded-sm mb-4" />}
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription>{book.authors?.join(', ') || book.author || 'Unknown author'}</CardDescription>
              {book.description && <p className="font-serif text-sm text-charcoal-muted mt-3 line-clamp-3 flex-1">{book.description}</p>}
              <div className="flex gap-2 mt-4 pt-4 border-t border-editorial-border">
                {(book.id || book.google_id) && <Button variant="secondary" size="sm" onClick={() => loadSimilar(book.id || book.google_id)}>Similar</Button>}
                {book.preview_link && (
                  <a href={book.preview_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><ExternalLink className="w-3 h-3" /> Preview</Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
