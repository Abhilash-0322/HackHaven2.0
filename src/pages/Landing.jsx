// import { Link } from 'react-router-dom';
// import { Music, Book, MessageCircle, BookOpen, Award } from 'lucide-react';

// const Landing = () => {
//   const features = [
//     {
//       title: 'Music Therapy',
//       description: 'Discover personalized music recommendations to enhance your mood and promote relaxation.',
//       icon: <Music className="h-12 w-12 text-indigo-600" />,
//       path: '/musicrecommend',
//       color: 'bg-indigo-200',
//     },
//     {
//       title: 'Book Recommendations',
//       description: 'Find books that inspire, comfort, and support your mental well-being journey.',
//       icon: <Book className="h-12 w-12 text-purple-600" />,
//       path: '/books',
//       color: 'bg-purple-200',
//     },
//     {
//       title: 'Mental Health Chat',
//       description: 'Connect with our supportive AI chatbot for guidance and mental health resources.',
//       icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
//       path: '/chat',
//       color: 'bg-blue-200',
//     },
//     {
//       title: 'Journaling',
//       description: 'Express your thoughts and feelings through guided journaling exercises.',
//       icon: <BookOpen className="h-12 w-12 text-teal-600" />,
//       path: '/journal',
//       color: 'bg-teal-200',
//     },
//     {
//       title: 'Mindfulness Practices',
//       description: 'Learn and practice mindfulness techniques for daily mental wellness.',
//       icon: <Award className="h-12 w-12 text-amber-600" />,
//       path: '/mindfulness',
//       color: 'bg-amber-200',
//     },
//   ];


//   return (

//     <div className="w-full">
//       {insights && insights.total_entries > 0 && (
//             <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Insights</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium text-gray-700">Total Entries</p>
//                   <p className="text-2xl font-bold text-indigo-600">{insights.total_entries}</p>
//                 </div>
                
//                 {insights.top_moods && insights.top_moods.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Your Mood Journey</p>
//                     <div className="space-y-2">
//                       {insights.top_moods.map((mood, i) => {
//                         const moodClasses = getMoodColorClasses(mood._id);
//                         // Calculate percentage for bar width
//                         const percentage = Math.min(Math.max((mood.count / insights.total_entries) * 100, 10), 100);
//                         return (
//                           <div key={i} className="w-full">
//                             <div className="flex justify-between text-xs mb-1">
//                               <span className={moodClasses.text}>{mood._id}</span>
//                               <span className="text-lime-600">{mood.count} entries</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className={`${moodClasses.bg} h-2 rounded-full`} 
//                                 style={{ width: `${percentage}%` }}
//                               ></div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
                
//                 {insights.top_tags && insights.top_tags.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Top Tags</p>
//                     <div className="flex flex-wrap gap-2">
//                       {insights.top_tags.map((tag, i) => (
//                         <span 
//                           key={i} 
//                           className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                         >
//                           #{tag._id}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 <p className="text-gray-600 text-sm italic">
//                   {insights.message}
//                 </p>
//               </div>
//             </div>
//           )}
//       {/* Hero Section */}
//       <section className="relative overflow-hidden ">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
//           <div className="md:flex md:items-center md:justify-between">
//             <div className="md:w-1/2 md:pr-12bg-[rgb(232,246,221)] p-4">
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
//                 Find Your Balance with <span className="text-purple-400">ZenHeaven</span>
//               </h1>
//               <p className="mt-6 text-lg text-gray-600 max-w-2xl">
//                 A peaceful sanctuary for your mental well-being. Discover personalized resources, practice mindfulness, and find harmony in your daily life.
//               </p>
//               <div className="mt-10 flex flex-wrap gap-4">
//                 <Link
//                   to="/journal"
//                   className="px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors"
//                 >
//                   Start Your Journey
//                 </Link>
//                 <Link
//                   to="/about"
//                   className="px-6 py-3 bg-white hover:bg-gray-50 text-black-600 font-medium rounded-lg shadow-md border border-gray-200 transition-colors"
//                 >
//                   Learn More
//                 </Link>
//               </div>
//             </div>
//             <div className="mt-10 md:mt-0 md:w-1/2">
//               <div className="relative">
//                 <div className="aspect-w-5 aspect-h-5 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
//                   <img
//                     // src="https://i.postimg.cc/N0r4ywwM/Untitled-design.png"
//                     src="https://nouveaumedics.com/wp-content/uploads/2020/07/mental-health.jpg"

//                     alt="ZenHeaven mental wellness"
//                     className="w-full h-full object-cover "
//                   />
//                 </div>


//                 <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-indigo-100 rounded-full opacity-50 z-0"></div>
//                 <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full opacity-50 z-0"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-gradient-to-b from-transparent to-indigo-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-5xl font-bold text-black-900 animate-slide-in">
//               Our Mindful Features
//             </h2>
//             <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//               Comprehensive tools designed to support your mental health journey, all in one peaceful digital space.
//             </p>
//           </div>

//           <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
//             {features.map((feature, index) => (
//               <Link
//                 key={index}
//                 to={feature.path}
//                 className="group relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105"
//               >
//                 <div
//                   className={`p-7 ${feature.color} w-full h-full outline transition-all group-hover:translate-y-2 transform group-hover:scale-105 opacity-100 group-hover:opacity-90 hover:animate-pastel-bg`}
//                 >
//                   <div className="p-4 ">
//                     <div className="text-4xl mb-4">{feature.icon}</div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                     <p className="text-gray-600">{feature.description}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//   /* Animation for the sliding effect */
//   @keyframes slideInFromLeft {
//     0% {
//       opacity: 0;
//       transform: translateX(-100px); /* Starts off-screen from the left */
//     }
//     100% {
//       opacity: 1;
//       transform: translateX(0); /* Ends in the normal position */
//     }
//   }

//   .animate-slide-in {
//     animation: slideInFromLeft 1s ease-out forwards; /* Slide-in from left over 1 second */
//   }
// `}</style>


//       {/* Testimonial Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden outline">
//             <div className="md:flex">
//               <div className="md:w-1/2 bg-purple-300 p-12">
//                 <div className='p-7 h-full rounded-md shadow-lg'><h2 className="text-3xl font-bold">Finding Peace in Daily Life</h2>
//                   <p className="mt-4 text-black">
//                     Join thousands of others who have discovered balance and tranquility with Calm Verse's mental wellness tools.
//                   </p>
//                   <div className="mt-8">
//                     <Link
//                       to="/testimonials"
//                       className="inline-flex items-center  hover:text-green-600"
//                     >
//                       Read more stories
//                       <svg
//                         className="ml-2 h-5 w-5"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               <div className="md:w-1/2 p-12">
//                 <div className="flex flex-col h-full justify-center">
//                   <p className="text-xl text-gray-600 italic">
//                     "Calm Verse has transformed how I approach my mental health. The music recommendations and journaling features have become an essential part of my daily routine."
//                   </p>
//                   <div className="mt-6 flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                       <span className="text-indigo-600 font-semibold">JD</span>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-base font-medium text-gray-900">Jamie D.</div>
//                       <div className="text-sm text-gray-500">Calm Verse User</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-16 bg-gradient-to-t from-transparent to-indigo-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold text-indigo-900">Begin Your Wellness Journey Today</h2>
//           <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//             Take the first step toward better mental health with our suite of mindful tools designed to support your unique journey.
//           </p>
//           <div className="mt-10">
//             <Link
//               to="/musicrecommend"
//               className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors text-lg"
//             >
//               Explore Calm Verse
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Landing;


import { Link } from 'react-router-dom';
import { Music, Book, MessageCircle, BookOpen, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const moodColors = {
  // Positive moods
  'happy':      { bg: 'bg-yellow-100',  text: 'text-yellow-900',  border: 'border-yellow-500' },
  'excited':    { bg: 'bg-orange-100',  text: 'text-orange-900',  border: 'border-orange-500' },
  'calm':       { bg: 'bg-blue-100',    text: 'text-blue-900',    border: 'border-blue-500' },
  'grateful':   { bg: 'bg-green-100',   text: 'text-green-900',   border: 'border-green-500' },
  'peaceful':   { bg: 'bg-teal-100',    text: 'text-teal-900',    border: 'border-teal-500' },
  'content':    { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-500' },
  'hopeful':    { bg: 'bg-cyan-100',    text: 'text-cyan-900',    border: 'border-cyan-500' },
  'inspired':   { bg: 'bg-indigo-100',  text: 'text-indigo-900',  border: 'border-indigo-500' },
  'relaxed':    { bg: 'bg-sky-100',     text: 'text-sky-900',     border: 'border-sky-500' },
  'confident':  { bg: 'bg-violet-100',  text: 'text-violet-900',  border: 'border-violet-500' },

  // Negative/challenging moods
  'anxious':    { bg: 'bg-amber-100',   text: 'text-amber-900',   border: 'border-amber-500' },
  'sad':        { bg: 'bg-blue-100',    text: 'text-blue-900',    border: 'border-blue-500' },
  'angry':      { bg: 'bg-red-100',     text: 'text-red-900',     border: 'border-red-500' },
  'frustrated': { bg: 'bg-rose-100',    text: 'text-rose-900',    border: 'border-rose-500' },
  'tired':      { bg: 'bg-gray-100',    text: 'text-gray-900',    border: 'border-gray-500' },
  'overwhelmed':{ bg: 'bg-purple-100',  text: 'text-purple-900',  border: 'border-purple-500' },
  'confused':   { bg: 'bg-amber-100',   text: 'text-amber-900',   border: 'border-amber-500' },
  'worried':    { bg: 'bg-yellow-100',  text: 'text-yellow-900',  border: 'border-yellow-500' },
  'stressed':   { bg: 'bg-orange-100',  text: 'text-orange-900',  border: 'border-orange-500' },
  'lonely':     { bg: 'bg-indigo-100',  text: 'text-indigo-900',  border: 'border-indigo-500' },

  // Default for unknown moods
  'default':    { bg: 'bg-gray-100',    text: 'text-gray-900',    border: 'border-lime-500' }
};


// Function to get mood color classes or default if not found
const getMoodColorClasses = (mood) => {
  const normalizedMood = mood?.toLowerCase();
  return moodColors[normalizedMood] || moodColors.default;
};

const Landing = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Add API base URL 
  const API_URL = 'http://localhost:8000';

  // Fetch insights data when component mounts
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${API_URL}/journal/insights`);
        setInsights(response.data);
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);
  
  const features = [
    {
      title: 'Music Therapy',
      description: 'Discover personalized music recommendations to enhance your mood and promote relaxation.',
      icon: <Music className="h-12 w-12 text-indigo-600" />,
      path: '/musicrecommend',
      color: 'bg-indigo-200',
    },
    {
      title: 'Book Recommendations',
      description: 'Find books that inspire, comfort, and support your mental well-being journey.',
      icon: <Book className="h-12 w-12 text-purple-600" />,
      path: '/books',
      color: 'bg-purple-200',
    },
    {
      title: 'Mental Health Chat',
      description: 'Connect with our supportive AI chatbot for guidance and mental health resources.',
      icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
      path: '/chat',
      color: 'bg-blue-200',
    },
    {
      title: 'Journaling',
      description: 'Express your thoughts and feelings through guided journaling exercises.',
      icon: <BookOpen className="h-12 w-12 text-teal-600" />,
      path: '/journal',
      color: 'bg-teal-200',
    },
    {
      title: 'Mindfulness Practices',
      description: 'Learn and practice mindfulness techniques for daily mental wellness.',
      icon: <Award className="h-12 w-12 text-amber-600" />,
      path: '/mindfulness',
      color: 'bg-amber-200',
    },
  ];


  return (
    <div className="w-full">
      {/* Journal Insights Section - Added at the top */}
      {!loading && insights && insights.total_entries > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-900">Mood Dashboard</h2>
              <Link 
                to="/journal" 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              >
                View Journal
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="md:flex md:space-x-6">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-gray-700">Total Journal Entries</p>
                  <p className="text-3xl font-bold text-indigo-600">{insights.total_entries}</p>
                  <p className="text-sm text-gray-500 mt-1">Keep writing to track your journey</p>
                </div>
              </div>
              
              {insights.top_moods && insights.top_moods.length > 0 && (
                <div className="md:w-2/3">
                  <p className="font-medium text-gray-700 mb-2">Your Mood Journey</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insights.top_moods.slice(0, 4).map((mood, i) => {
                      const moodClasses = getMoodColorClasses(mood._id);
                      // Calculate percentage for bar width
                      const percentage = Math.min(Math.max((mood.count / insights.total_entries) * 100, 10), 100);
                      return (
                        <div key={i} className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`font-medium ${moodClasses.text}`}>{mood._id}</span>
                            <span className="text-lime-600">{mood.count} entries</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${moodClasses.bg} h-2 rounded-full`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {insights.top_tags && insights.top_tags.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-1 text-sm">Top Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {insights.top_tags.slice(0, 5).map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs"
                          >
                            #{tag._id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-12 p-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Find Your Balance with <span className="text-purple-400">ZenHeaven</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                A peaceful sanctuary for your mental well-being. Discover personalized resources, practice mindfulness, and find harmony in your daily life.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/journal"
                  className="px-6 py-3 bg-purple-200 hover:bg-purple-300 text-black font-medium rounded-lg shadow-md transition-colors"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-black-600 font-medium rounded-lg shadow-md border border-gray-200 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative">
                <div className="aspect-w-5 aspect-h-5 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                  <img
                    src="https://nouveaumedics.com/wp-content/uploads/2020/07/mental-health.jpg"
                    alt="ZenHeaven mental wellness"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-indigo-100 rounded-full opacity-50 z-0"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full opacity-50 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-black-900 animate-slide-in">
              Our Mindful Features
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to support your mental health journey, all in one peaceful digital space.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                <div
                  className={`p-7 ${feature.color} w-full h-full outline transition-all group-hover:translate-y-2 transform group-hover:scale-105 opacity-100 group-hover:opacity-90 hover:animate-pastel-bg`}
                >
                  <div className="p-4">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Testimonial Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden outline">
            <div className="md:flex">
              <div className="md:w-1/2 bg-purple-300 p-12">
                <div className='p-7 h-full rounded-md shadow-lg'>
                  <h2 className="text-3xl font-bold">Finding Peace in Daily Life</h2>
                  <p className="mt-4 text-black">
                    Join thousands of others who have discovered balance and tranquility with Calm Verse's mental wellness tools.
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/testimonials"
                      className="inline-flex items-center hover:text-green-600"
                    >
                      Read more stories
                      <svg
                        className="ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-12">
                <div className="flex flex-col h-full justify-center">
                  <p className="text-xl text-gray-600 italic">
                    "Calm Verse has transformed how I approach my mental health. The music recommendations and journaling features have become an essential part of my daily routine."
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">JD</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-gray-900">Jamie D.</div>
                      <div className="text-sm text-gray-500">Calm Verse User</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-t from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-900">Begin Your Wellness Journey Today</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Take the first step toward better mental health with our suite of mindful tools designed to support your unique journey.
          </p>
          <div className="mt-10">
            <Link
              to="/musicrecommend"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors text-lg"
            >
              Explore Calm Verse
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;