import { Link } from 'react-router-dom';
import { Book, Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BooksPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for animations
  const heroRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchResultsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const ctaRef = useRef(null);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Hero section animations
    const tl = gsap.timeline();
    
    tl.fromTo(heroRef.current?.querySelector('h1'), 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo(heroRef.current?.querySelector('p'), 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    , "-=0.5")
    .fromTo(searchBarRef.current, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    , "-=0.3");

    // CTA section scroll trigger
    ScrollTrigger.create({
      trigger: ctaRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(ctaRef.current?.children, 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate search results when they appear
  useEffect(() => {
    if (searchResults.length > 0 && searchResultsRef.current) {
      gsap.fromTo(searchResultsRef.current.children, 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [searchResults]);

  // Animate recommendations when they load
  useEffect(() => {
    if (recommendations && recommendationsRef.current) {
      gsap.fromTo(recommendationsRef.current.children, 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [recommendations]);

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
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-25"></div>
      <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      {/* Hero Section */}
      <section className="relative overflow-hidden z-10" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Book className="h-20 w-20 text-purple-600 transform hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 bg-clip-text text-transparent leading-tight">
              Discover Books for Your <span className="relative inline-block">
                <span className="text-purple-400">Mood</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q25,2 50,8 T100,8" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-300" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Find personalized book recommendations based on your recent mood or search for books that inspire and uplift you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto" ref={searchBarRef}>
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for books that match your soul..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 shadow-lg transition-all duration-300 focus:shadow-2xl bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-100/20 to-pink-100/20 pointer-events-none"></div>
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-2xl transform active:scale-95 disabled:opacity-50"
              >
                {searchLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : '✨ Search'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-red-400 text-red-800 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">!</span>
              </div>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mb-4">
                ✨ Search Results
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" ref={searchResultsRef}>
              {searchResults.map((book, index) => (
                <div
                  key={book.id}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 border border-white/50"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
                  <div className="flex p-6">
                    <div className="relative">
                      {book.image_url ? (
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-32 h-48 object-cover rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                        />
                      ) : (
                        <div className="w-32 h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center rounded-2xl shadow-lg">
                          <Book className="h-12 w-12 text-purple-600" />
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-purple-600 font-medium mb-3">{book.author}</p>
                        <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">{book.description}</p>
                      </div>
                      <button
                        onClick={() => fetchSimilarBooks(book.id)}
                        className="mt-4 self-start px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl transform active:scale-95"
                      >
                        🔍 Find Similar
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
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-purple-200 rounded-full animate-ping"></div>
              </div>
              <p className="mt-6 text-lg text-gray-600 animate-pulse">Discovering magical books for you...</p>
            </div>
          ) : recommendations ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent capitalize mb-4">
                  📚 Books for Your {recommendations.mood} Mood
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">{recommendations.mood_description}</p>
                {recommendations.journal_title && (
                  <div className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-purple-200">
                    <p className="text-sm text-purple-700">
                      💭 Based on your journal entry "{recommendations.journal_title}" from{' '}
                      {new Date(recommendations.journal_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" ref={recommendationsRef}>
                {recommendations.books.map((book, index) => (
                  <div
                    key={book.id}
                    className="group relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 border border-white/50"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
                    <div className="flex p-6">
                      <div className="relative">
                        {book.image_url ? (
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-32 h-48 object-cover rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                          />
                        ) : (
                          <div className="w-32 h-48 bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center rounded-2xl shadow-lg">
                            <Book className="h-12 w-12 text-indigo-600" />
                          </div>
                        )}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-indigo-600 font-medium mb-3">{book.author}</p>
                          <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">{book.description}</p>
                        </div>
                        <button
                          onClick={() => fetchSimilarBooks(book.id)}
                          className="mt-4 self-start px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl transform active:scale-95"
                        >
                          🔍 Find Similar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Book className="h-16 w-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No recommendations yet</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Start your wellness journey by writing in your journal to get personalized book suggestions!
                </p>
                <Link
                  to="/journal"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform active:scale-95"
                >
                  ✍️ Start Journaling
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative z-10 overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-300 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-300 rounded-full opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              🌟 Explore More Mindful Tools
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              Continue your wellness journey with our suite of tools designed to support your mental health and personal growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/journal"
                className="group px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 text-lg hover:scale-110 hover:shadow-2xl transform active:scale-95 flex items-center gap-3"
              >
                <span className="text-2xl group-hover:animate-bounce">✍️</span>
                Visit Journal
              </Link>
              <Link
                to="/musicrecommend"
                className="group px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 text-lg hover:scale-110 hover:shadow-2xl transform active:scale-95 flex items-center gap-3"
              >
                <span className="text-2xl group-hover:animate-pulse">🎵</span>
                Discover Music
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BooksPage;