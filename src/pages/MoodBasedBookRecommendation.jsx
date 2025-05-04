import React, { useState, useEffect } from 'react';
import { Book, RefreshCw, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const MoodBasedBookRecommender = ({ userId }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch mood-based book recommendations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add userId as a query parameter if provided
      const url = userId 
        ? `/books/recommend-by-mood?user_id=${userId}` 
        : '/books/recommend-by-mood';
      
      const response = await axios.get(url);
      setRecommendations(response.data);
    } catch (err) {
      console.error("Error fetching mood-based recommendations:", err);
      setError('Failed to get book recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh recommendations
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  // Fetch recommendations on component mount
  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  // Display loading state
  if (loading && !refreshing) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <Loader className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-medium text-gray-600">Finding books for your mood...</h3>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && !recommendations) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-medium transition-colors flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <section className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Book className="h-16 w-16 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Books for Your Mood</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Personalized book recommendations based on your recent emotional state.
        </p>
      </section>

      {/* Mood Section */}
      {recommendations && (
        <section className="bg-purple-50 rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 capitalize">
                {recommendations.mood === 'balanced' 
                  ? 'General Recommendations' 
                  : `Books for when you're feeling ${recommendations.mood}`}
              </h2>
              <p className="text-gray-600">
                {recommendations.mood_description}
              </p>
              
              {/* Show journal info if available */}
              {recommendations.journal_title && (
                <div className="mt-3 text-sm text-gray-500">
                  Based on your journal: "{recommendations.journal_title}" from {new Date(recommendations.journal_date).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className={`mt-4 md:mt-0 px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                refreshing 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
              }`}
            >
              {refreshing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </button>
          </div>

          {/* Book Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {book.image_url ? (
                    <img 
                      src={book.image_url.replace('http:', 'https:')} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Book className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-lg line-clamp-2 min-h-14">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                  <p className="text-xs text-gray-500 line-clamp-3 min-h-12">
                    {book.description}
                  </p>
                  <a 
                    href={`https://books.google.com/books?id=${book.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 text-purple-600 hover:text-purple-800 font-medium flex items-center text-sm"
                  >
                    View Details
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="bg-indigo-50 rounded-xl p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">How It Works</h2>
          <p className="text-gray-700 mb-6">
            Our mood-based book recommendation system analyzes your recent journal entries to understand your emotional state, 
            then suggests books that can support, enhance, or complement your current mood.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="text-indigo-600 font-bold mb-2">Step 1</div>
              <p className="text-gray-600">Write regularly in your journal to track your emotions</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="text-indigo-600 font-bold mb-2">Step 2</div>
              <p className="text-gray-600">Our system detects your current emotional state</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="text-indigo-600 font-bold mb-2">Step 3</div>
              <p className="text-gray-600">Receive personalized book recommendations for your mood</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoodBasedBookRecommender;