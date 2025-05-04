// src/pages/MoodBooks.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BooksCard';

const MoodBooks = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace with actual user_id if available, e.g., from context or auth
        const userId = ''; // Example: 'user123' or leave empty for no user_id
        const response = await axios.get('/api/books/recommend-by-mood', {
          params: { user_id: userId || undefined },
        });
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Failed to fetch book recommendations'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-500 text-lg">No recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Book Recommendations for Your Mood
      </h1>
      <div className="mb-6 text-center">
        <p className="text-xl text-gray-700 capitalize">
          Mood: {data.mood}
        </p>
        <p className="text-gray-600 italic">{data.mood_description}</p>
        {data.message && (
          <p className="text-gray-500 mt-2">{data.message}</p>
        )}
        {data.journal_title && (
          <p className="text-gray-500 mt-2">
            Based on journal: "{data.journal_title}" (
            {new Date(data.journal_date).toLocaleDateString()})
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default MoodBooks;