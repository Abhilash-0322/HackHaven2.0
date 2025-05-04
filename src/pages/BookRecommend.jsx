// import { useState, useEffect } from 'react';
// import { Book, BookOpen, ThumbsUp, Loader2, RefreshCw } from 'lucide-react';

// const BookRecommend = () => {
//   const [recommendations, setRecommendations] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const fetchRecommendations = async () => {
//     setLoading(true);
//     try {
//       // Fix: Use correct API endpoint path - this was causing the JSON parse error
//       const response = await fetch('/books/recommend-by-mood');
//       if (!response.ok) {
//         throw new Error('Failed to fetch book recommendations');
//       }
//       const data = await response.json();
//       setRecommendations(data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching recommendations:', err);
//       setError('Unable to load book recommendations. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const moods = [
//     { value: 'happy', label: 'Happy', color: 'bg-yellow-200' },
//     { value: 'calm', label: 'Calm', color: 'bg-blue-200' },
//     { value: 'sad', label: 'Sad', color: 'bg-indigo-200' },
//     { value: 'anxious', label: 'Anxious', color: 'bg-purple-200' },
//     { value: 'stressed', label: 'Stressed', color: 'bg-red-200' },
//     { value: 'motivated', label: 'Motivated', color: 'bg-green-200' },
//     { value: 'hopeful', label: 'Hopeful', color: 'bg-teal-200' },
//     { value: 'inspired', label: 'Inspired', color: 'bg-amber-200' }
//   ];

//   const selectMood = async (mood) => {
//     setLoading(true);
//     try {
//       // Fix: Use correct API endpoint path with proper mood parameter
//       const response = await fetch(`/api/books/recommend-by-mood?mood=${mood.value}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch recommendations for selected mood');
//       }
//       const data = await response.json();
//       setRecommendations(data);
//       setError(null);
//     } catch (err) {
//       console.error('Error selecting mood:', err);
//       setError('Error updating mood selection');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
//           <div className="md:flex md:items-center md:justify-between">
//             <div className="md:w-1/2 md:pr-12 p-4">
//               <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
//                 Find Books That Match Your <span className="text-purple-500">Mood</span>
//               </h1>
//               <p className="mt-6 text-lg text-gray-600 max-w-2xl">
//                 Discover reading recommendations tailored to how you're feeling today. Our personalized suggestions help support your mental well-being through the power of literature.
//               </p>
//               <div className="mt-8">
//                 <button
//                   onClick={fetchRecommendations}
//                   className="flex items-center px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                   ) : (
//                     <RefreshCw className="mr-2 h-5 w-5" />
//                   )}
//                   Refresh Recommendations
//                 </button>
//               </div>
//             </div>
//             <div className="mt-10 md:mt-0 md:w-1/2">
//               <div className="relative">
//                 <div className="aspect-w-5 aspect-h-4 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
//                   <img
//                     src="/api/placeholder/600/400"
//                     alt="Person reading a book peacefully"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-100 rounded-full opacity-50 z-0"></div>
//                 <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-50 z-0"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Mood Selection Section */}
//       <section className="py-12 bg-gradient-to-b from-transparent to-indigo-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-gray-900">
//               How are you feeling today?
//             </h2>
//             <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//               Select your current mood to get tailored book recommendations.
//             </p>
//           </div>

//           <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {moods.map((mood) => (
//               <button
//                 key={mood.value}
//                 onClick={() => selectMood(mood)}
//                 className={`${mood.color} p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center h-24`}
//               >
//                 <span className="text-lg font-medium">{mood.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Book Recommendations Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="flex flex-col items-center">
//                 <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
//                 <p className="mt-4 text-gray-600">Loading recommendations...</p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="text-center p-8 bg-red-50 rounded-lg">
//               <p className="text-red-600">{error}</p>
//               <button
//                 onClick={fetchRecommendations}
//                 className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : recommendations ? (
//             <>
//               <div className="text-center mb-12">
//                 <div className="inline-block px-6 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
//                   Current Mood: {recommendations.mood.charAt(0).toUpperCase() + recommendations.mood.slice(1)}
//                 </div>
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   {recommendations.mood_description}
//                 </h2>
//                 {recommendations.journal_title && (
//                   <p className="mt-2 text-gray-600">
//                     Based on your journal entry: "{recommendations.journal_title}" 
//                     {recommendations.journal_date && (
//                       <span className="text-sm"> ({new Date(recommendations.journal_date).toLocaleDateString()})</span>
//                     )}
//                   </p>
//                 )}
//               </div>

//               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {recommendations.books && recommendations.books.map((book) => (
//                   <div
//                     key={book.id}
//                     className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
//                   >
//                     <div className="p-2 bg-purple-50 flex justify-center">
//                       {book.image_url ? (
//                         <img
//                           src="/api/placeholder/200/300"
//                           alt={book.title}
//                           className="h-48 object-contain"
//                         />
//                       ) : (
//                         <div className="h-48 w-32 bg-gray-200 flex items-center justify-center">
//                           <BookOpen className="h-12 w-12 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-5 flex-1 flex flex-col">
//                       <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
//                       <p className="text-sm text-gray-600 mt-1">{book.author}</p>
//                       <p className="text-sm text-gray-500 mt-4 line-clamp-3 flex-1">
//                         {book.description || "No description available."}
//                       </p>
//                       <div className="flex justify-between items-center mt-4">
//                         <button
//                           className="text-purple-600 hover:text-purple-800 text-sm font-medium"
//                         >
//                           Learn more
//                         </button>
//                         <button className="text-gray-500 hover:text-purple-600">
//                           <ThumbsUp className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="text-center p-8">
//               <Book className="mx-auto h-16 w-16 text-gray-400" />
//               <p className="mt-4 text-gray-600">No recommendations available</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-16 bg-gradient-to-t from-transparent to-indigo-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold text-indigo-900">Continue Your Wellness Journey</h2>
//           <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//             Explore more features to support your mental well-being journey with ZenHeaven.
//           </p>
//           <div className="mt-10 flex flex-wrap gap-4 justify-center">
//             <button
//               className="px-6 py-3 bg-teal-200 hover:bg-teal-300 text-black font-medium rounded-lg shadow-md transition-colors"
//             >
//               <div className="flex items-center">
//                 <BookOpen className="mr-2 h-5 w-5" />
//                 <span>Journal Your Thoughts</span>
//               </div>
//             </button>
//             <button
//               className="px-6 py-3 bg-indigo-200 hover:bg-indigo-300 text-black font-medium rounded-lg shadow-md transition-colors"
//             >
//               <div className="flex items-center">
//                 <span className="mr-2">🎵</span>
//                 <span>Discover Music</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BookRecommend;


import { useState, useEffect } from 'react';
import { Book, BookOpen, ThumbsUp, Loader2, RefreshCw } from 'lucide-react';

const BookRecommend = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Fixed API endpoint path to match the backend router
      const response = await fetch('/books/recommend-by-mood');
      if (!response.ok) {
        throw new Error(`Failed to fetch book recommendations: ${response.status}`);
      }
      const data = await response.json();
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Unable to load book recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const moods = [
    { value: 'happy', label: 'Happy', color: 'bg-yellow-200' },
    { value: 'calm', label: 'Calm', color: 'bg-blue-200' },
    { value: 'sad', label: 'Sad', color: 'bg-indigo-200' },
    { value: 'anxious', label: 'Anxious', color: 'bg-purple-200' },
    { value: 'stressed', label: 'Stressed', color: 'bg-red-200' },
    { value: 'motivated', label: 'Motivated', color: 'bg-green-200' },
    { value: 'hopeful', label: 'Hopeful', color: 'bg-teal-200' },
    { value: 'inspired', label: 'Inspired', color: 'bg-amber-200' }
  ];

  const selectMood = async (mood) => {
    setLoading(true);
    try {
      // Fixed API endpoint path with proper mood parameter
      const response = await fetch(`/books/recommend-by-mood?mood=${mood.value}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations for selected mood: ${response.status}`);
      }
      const data = await response.json();
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error('Error selecting mood:', err);
      setError('Error updating mood selection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-12 p-4">
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Find Books That Match Your <span className="text-purple-500">Mood</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                Discover reading recommendations tailored to how you're feeling today. Our personalized suggestions help support your mental well-being through the power of literature.
              </p>
              <div className="mt-8">
                <button
                  onClick={fetchRecommendations}
                  className="flex items-center px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-5 w-5" />
                  )}
                  Refresh Recommendations
                </button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative">
                <div className="aspect-w-5 aspect-h-4 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                  <img
                    src="https://media.istockphoto.com/id/1318913887/vector/man-reading-book-character-illustration.jpg?s=612x612&w=0&k=20&c=EBjvpUNwuBa7apfLIfVOrKmQU4r_0chSKs2d-zK6_3Q="
                    alt="Person reading a book peacefully"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-100 rounded-full opacity-50 z-0"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-50 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mood Selection Section */}
      <section className="py-12 bg-gradient-to-b from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              How are you feeling today?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Select your current mood to get tailored book recommendations.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => selectMood(mood)}
                className={`${mood.color} p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center h-24`}
              >
                <span className="text-lg font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Book Recommendations Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                <p className="mt-4 text-gray-600">Loading recommendations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchRecommendations}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : recommendations ? (
            <>
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
                  Current Mood: {recommendations.mood.charAt(0).toUpperCase() + recommendations.mood.slice(1)}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {recommendations.mood_description}
                </h2>
                {recommendations.journal_title && (
                  <p className="mt-2 text-gray-600">
                    Based on your journal entry: "{recommendations.journal_title}" 
                    {recommendations.journal_date && (
                      <span className="text-sm"> ({new Date(recommendations.journal_date).toLocaleDateString()})</span>
                    )}
                  </p>
                )}
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendations.books && recommendations.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="p-2 bg-purple-50 flex justify-center">
                      {book.image_url ? (
                        <img
                          src={book.image_url.replace('http:', 'https:')}
                          alt={book.title}
                          className="h-48 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/200/300";
                          }}
                        />
                      ) : (
                        <div className="h-48 w-32 bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mt-4 line-clamp-3 flex-1">
                        {book.description || "No description available."}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <button
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Learn more
                        </button>
                        <button className="text-gray-500 hover:text-purple-600">
                          <ThumbsUp className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <Book className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-gray-600">No recommendations available</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-t from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-900">Continue Your Wellness Journey</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore more features to support your mental well-being journey with ZenHeaven.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              className="px-6 py-3 bg-teal-200 hover:bg-teal-300 text-black font-medium rounded-lg shadow-md transition-colors"
            >
              <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                <span>Journal Your Thoughts</span>
              </div>
            </button>
            <button
              className="px-6 py-3 bg-indigo-200 hover:bg-indigo-300 text-black font-medium rounded-lg shadow-md transition-colors"
            >
              <div className="flex items-center">
                <span className="mr-2">🎵</span>
                <span>Discover Music</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookRecommend;