import { Link } from 'react-router-dom';
import { Book, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BooksPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL
  const API_URL = 'http://localhost:8000';

  // Fetch mood-based book recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/books/recommend-by-mood`);
        setRecommendations(response.data);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Handle book search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await axios.get(`${API_URL}/books/search`, {
        params: { q: searchQuery },
      });
      setSearchResults(response.data.books);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Error searching books:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch similar books for a specific book
  const fetchSimilarBooks = async (bookId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/books/recommend/${bookId}`);
      setRecommendations({
        mood: 'similar',
        mood_description: `Books similar to "${response.data.original_book.title}"`,
        books: response.data.recommended_books,
        journal_title: '',
        journal_date: new Date().toISOString(),
      });
    } catch (err) {
      setError('Failed to load similar books. Please try again.');
      console.error('Error fetching similar books:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight">
              Discover Books for Your <span className="text-purple-400">Mood</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Find personalized book recommendations based on your recent mood or search for books that inspire and uplift you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for books..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                {searchLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-900 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        </div>
      )}

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex">
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-32 h-48 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-48 bg-gray-200 flex items-center justify-center">
                        <Book className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-3">{book.description}</p>
                      <button
                        onClick={() => fetchSimilarBooks(book.id)}
                        className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Find Similar Books
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            </div>
          ) : recommendations ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-indigo-900 capitalize">
                  Books for Your {recommendations.mood} Mood
                </h2>
                <p className="mt-2 text-lg text-gray-600">{recommendations.mood_description}</p>
                {recommendations.journal_title && (
                  <p className="mt-2 text-sm text-gray-500">
                    Based on your journal entry "{recommendations.journal_title}" from{' '}
                    {new Date(recommendations.journal_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex">
                      {book.image_url ? (
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-32 h-48 object-cover"
                        />
                      ) : (
                        <div className="w-32 h-48 bg-gray-200 flex items-center justify-center">
                          <Book className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-3">{book.description}</p>
                        <button
                          onClick={() => fetchSimilarBooks(book.id)}
                          className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Find Similar Books
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600">
                No recommendations available. Try writing a journal entry to get personalized book suggestions!
              </p>
              <Link
                to="/journal"
                className="mt-4 inline-block px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors"
              >
                Start Journaling
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-t from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-900">Explore More Mindful Tools</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Continue your wellness journey with our suite of tools designed to support your mental health.
          </p>
          <div className="mt-10">
            <Link
              to="/journal"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors text-lg"
            >
              Visit Journal
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideInFromLeft 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BooksPage;