// src/components/BookCard.jsx
import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform transform hover:scale-105">
      {book.image_url ? (
        <img
          src={book.image_url}
          alt={book.title}
          className="w-32 h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/128x192?text=No+Image';
          }}
        />
      ) : (
        <div className="w-32 h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 text-center line-clamp-2">
        {book.title}
      </h3>
      <p className="text-sm text-gray-600">{book.author || 'Unknown Author'}</p>
      <p className="text-sm text-gray-500 mt-2 line-clamp-3 text-center">
        {book.description || 'No description available'}
      </p>
    </div>
  );
};

export default BookCard;