// import React, { useState, useEffect } from 'react';
// import { BookOpen, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import axios from 'axios';

// const Journal = () => {
//   const [entries, setEntries] = useState([]);
//   const [prompts, setPrompts] = useState([]);
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPrompt, setSelectedPrompt] = useState('');
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     mood: '',
//     tags: ''
//   });

//   // API base URL
//   const API_URL = 'http://localhost:8000';

//   // Load journal entries, prompts and insights
//   useEffect(() => {
//     fetchJournalData();
//   }, []);

//   const fetchJournalData = async () => {
//     setLoading(true);
//     try {
//       const [entriesRes, promptsRes, insightsRes] = await Promise.all([
//         axios.get(`${API_URL}/journal/entries`),
//         axios.get(`${API_URL}/journal/prompts`),
//         axios.get(`${API_URL}/journal/insights`)
//       ]);
      
//       setEntries(entriesRes.data);
//       setPrompts(promptsRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching journal data:', err);
//       setError('Failed to load journal data. Please try again later.');
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Format tags from comma-separated string to array
//     const formattedData = {
//       ...formData,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
//     };
    
//     try {
//       if (editingId) {
//         await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
//       } else {
//         await axios.post(`${API_URL}/journal/entries`, formattedData);
//       }
      
//       // Reset form and refresh data
//       setFormData({ title: '', content: '', mood: '', tags: '' });
//       setShowForm(false);
//       setEditingId(null);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error saving journal entry:', err);
//       setError('Failed to save journal entry. Please try again.');
//     }
//   };

//   // Delete a journal entry
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         await axios.delete(`${API_URL}/journal/entries/${id}`);
//         fetchJournalData();
//       } catch (err) {
//         console.error('Error deleting journal entry:', err);
//         setError('Failed to delete journal entry. Please try again.');
//       }
//     }
//   };

//   // Edit a journal entry
//   const handleEdit = (entry) => {
//     setFormData({
//       title: entry.title,
//       content: entry.content,
//       mood: entry.mood || '',
//       tags: entry.tags ? entry.tags.join(', ') : ''
//     });
//     setEditingId(entry._id);
//     setShowForm(true);
//     window.scrollTo(0, 0);
//   };

//   // Apply a journal prompt
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPrompt(prompt);
//     setFormData({
//       ...formData,
//       content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
//     });
//     setShowForm(true);
//     window.scrollTo(0, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="flex justify-center mb-4">
//           <BookOpen className="h-12 w-12 text-teal-600" />
//         </div>
//         <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Express your thoughts, track your moods, and find clarity through reflective writing.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Journal Form */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-indigo-900">
//             {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
//           </h2>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) {
//                 setFormData({ title: '', content: '', mood: '', tags: '' });
//                 setEditingId(null);
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             {showForm ? 'Cancel' : (
//               <>
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Entry
//               </>
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
//             <div className="mb-4">
//               <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Give your entry a title"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Journal Content</label>
//               <textarea
//                 id="content"
//                 name="content"
//                 value={formData.content}
//                 onChange={handleInputChange}
//                 required
//                 rows="8"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Write your thoughts here..."
//               ></textarea>
//             </div>
            
//             <div className="mb-4">
//               <label htmlFor="mood" className="block text-gray-700 font-medium mb-2">Current Mood</label>
//               <input
//                 type="text"
//                 id="mood"
//                 name="mood"
//                 value={formData.mood}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
//               />
//             </div>
            
//             <div className="mb-6">
//               <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
//               <input
//                 type="text"
//                 id="tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
//               />
//             </div>
            
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 {editingId ? 'Update Entry' : 'Save Entry'}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       {/* Journal Entries and Prompts/Insights Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Journal Entries - Left Two Columns */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
//             <button 
//               onClick={fetchJournalData}
//               className="flex items-center text-indigo-600 hover:text-indigo-800"
//             >
//               <RefreshCw className="h-5 w-5 mr-1"/>
//               Refresh
//             </button>
//           </div>

//           {entries.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-xl text-center">
//               <p className="text-gray-600">You haven't created any journal entries yet.</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 Create Your First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {entries.map((entry) => (
//                 <div key={entry._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
//                     <div className="flex space-x-2">
//                       <button 
//                         onClick={() => handleEdit(entry)}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         title="Edit"
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(entry._id)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
                  
//                   <p className="text-sm text-gray-500 mb-3">
//                     {formatDate(entry.created_at)}
//                   </p>
                  
//                   {entry.mood && (
//                     <p className="mb-3">
//                       <span className="text-gray-700 font-medium">Mood: </span>
//                       <span className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm">
//                         {entry.mood}
//                       </span>
//                     </p>
//                   )}
                  
//                   <div className="mb-4 text-gray-700 whitespace-pre-line">
//                     {entry.content.length > 200 
//                       ? `${entry.content.substring(0, 200)}...` 
//                       : entry.content
//                     }
//                   </div>
                  
//                   {entry.tags && entry.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2">
//                       {entry.tags.map((tag, i) => (
//                         <span 
//                           key={i} 
//                           className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                         >
//                           #{tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right Column - Prompts and Insights */}
//         <div className="space-y-8">
//           {/* Writing Prompts */}
//           <div className="bg-teal-50 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
//             <p className="text-gray-600 mb-4">
//               Need inspiration? Try one of these prompts:
//             </p>
//             <div className="space-y-3">
//               {prompts.slice(0, 5).map((promptObj, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => handleSelectPrompt(promptObj.prompt)}
//                   className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
//                 >
//                   <p className="text-gray-700">{promptObj.prompt}</p>
//                   <div className="mt-2">
//                     <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
//                       {promptObj.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Journal Insights */}
//           {insights && insights.total_entries > 0 && (
//             <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Insights</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium text-gray-700">Total Entries</p>
//                   <p className="text-2xl font-bold text-indigo-600">{insights.total_entries}</p>
//                 </div>
                
//                 {insights.top_moods && insights.top_moods.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Top Moods</p>
//                     <div className="flex flex-wrap gap-2">
//                       {insights.top_moods.map((mood, i) => (
//                         <span 
//                           key={i} 
//                           className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
//                         >
//                           {mood._id}
//                         </span>
//                       ))}
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
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journal;



// import React, { useState, useEffect } from 'react';
// import { BookOpen, Plus, Edit, Trash2, RefreshCw, Lightbulb, Heart } from 'lucide-react';
// import axios from 'axios';


// // Mood color mapping
// const moodColors = {
//   // Positive moods
//   'happy': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'excited': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'calm': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'grateful': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
//   'peaceful': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
//   'content': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
//   'hopeful': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
//   'inspired': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
//   'relaxed': { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
//   'confident': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  
//   // Negative/challenging moods
//   'anxious': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'sad': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'angry': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
//   'frustrated': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
//   'tired': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
//   'overwhelmed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
//   'confused': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'worried': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'stressed': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'lonely': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  
//   // Default for unknown moods
//   'default': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
// };

// // Function to get mood color classes or default if not found
// const getMoodColorClasses = (mood) => {
//   const normalizedMood = mood?.toLowerCase();
//   return moodColors[normalizedMood] || moodColors.default;
// };

// const Journal = () => {
//   const [entries, setEntries] = useState([]);
//   const [prompts, setPrompts] = useState([]);
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPrompt, setSelectedPrompt] = useState('');
//   const [analyzingMood, setAnalyzingMood] = useState(false);
//   const [moodAnalysis, setMoodAnalysis] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     mood: '',
//     tags: ''
//   });

//   // API base URL
//   const API_URL = 'http://localhost:8000';

//   // Load journal entries, prompts and insights
//   useEffect(() => {
//     fetchJournalData();
//   }, []);

//   const fetchJournalData = async () => {
//     setLoading(true);
//     try {
//       const [entriesRes, promptsRes, insightsRes] = await Promise.all([
//         axios.get(`${API_URL}/journal/entries`),
//         axios.get(`${API_URL}/journal/prompts`),
//         axios.get(`${API_URL}/journal/insights`)
//       ]);
      
//       setEntries(entriesRes.data);
//       setPrompts(promptsRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching journal data:', err);
//       setError('Failed to load journal data. Please try again later.');
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Reset mood analysis when content changes
//     if (name === 'content') {
//       setMoodAnalysis(null);
//     }
//   };

//   // Analyze mood based on journal content
//   const handleAnalyzeMood = async () => {
//     if (!formData.content || formData.content.trim().length < 10) {
//       setError('Please write more content before analyzing mood.');
//       return;
//     }
    
//     setAnalyzingMood(true);
//     try {
//       const response = await axios.post(`${API_URL}/journal/analyze-mood`, {
//         content: formData.content
//       });
      
//       setMoodAnalysis(response.data);
//       setFormData({
//         ...formData,
//         mood: response.data.mood
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error analyzing mood:', err);
//       setError('Failed to analyze mood. Please try again.');
//     } finally {
//       setAnalyzingMood(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Format tags from comma-separated string to array
//     const formattedData = {
//       ...formData,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
//     };
    
//     try {
//       if (editingId) {
//         await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
//       } else {
//         await axios.post(`${API_URL}/journal/entries`, formattedData);
//       }
      
//       // Reset form and refresh data
//       setFormData({ title: '', content: '', mood: '', tags: '' });
//       setShowForm(false);
//       setEditingId(null);
//       setMoodAnalysis(null);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error saving journal entry:', err);
//       setError('Failed to save journal entry. Please try again.');
//     }
//   };

//   // Add mood analysis to existing entry
//   const handleAddMoodAnalysis = async (id) => {
//     try {
//       await axios.put(`${API_URL}/journal/entries/${id}/analyze-mood`);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error adding mood analysis:', err);
//       setError('Failed to analyze mood for this entry. Please try again.');
//     }
//   };

//   // Delete a journal entry
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         await axios.delete(`${API_URL}/journal/entries/${id}`);
//         fetchJournalData();
//       } catch (err) {
//         console.error('Error deleting journal entry:', err);
//         setError('Failed to delete journal entry. Please try again.');
//       }
//     }
//   };

//   // Edit a journal entry
//   const handleEdit = (entry) => {
//     setFormData({
//       title: entry.title,
//       content: entry.content,
//       mood: entry.mood || '',
//       tags: entry.tags ? entry.tags.join(', ') : ''
//     });
//     setEditingId(entry._id);
//     setShowForm(true);
//     setMoodAnalysis(entry.mood_analysis || null);
//     window.scrollTo(0, 0);
//   };

//   // Apply a journal prompt
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPrompt(prompt);
//     setFormData({
//       ...formData,
//       content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
//     });
//     setShowForm(true);
//     setMoodAnalysis(null);
//     window.scrollTo(0, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Reset form and mood analysis
//   const resetForm = () => {
//     setFormData({ title: '', content: '', mood: '', tags: '' });
//     setEditingId(null);
//     setMoodAnalysis(null);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="flex justify-center mb-4">
//           <BookOpen className="h-12 w-12 text-teal-600" />
//         </div>
//         <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Express your thoughts, track your moods, and find clarity through reflective writing.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Journal Form */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-indigo-900">
//             {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
//           </h2>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) {
//                 resetForm();
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             {showForm ? 'Cancel' : (
//               <>
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Entry
//               </>
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Give your entry a title"
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Journal Content</label>
//                 <textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   required
//                   rows="8"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Write your thoughts here..."
//                 ></textarea>
//               </div>
              
//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="mood" className="block text-gray-700 font-medium">Current Mood</label>
//                   <button
//                     type="button"
//                     onClick={handleAnalyzeMood}
//                     disabled={analyzingMood || !formData.content || formData.content.trim().length < 10}
//                     className="flex items-center text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {analyzingMood ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <Lightbulb className="h-4 w-4 mr-1" />
//                         Detect Mood
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   id="mood"
//                   name="mood"
//                   value={formData.mood}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     formData.mood ? 
//                     `${getMoodColorClasses(formData.mood).bg} ${getMoodColorClasses(formData.mood).border}` : 
//                     'border-gray-300'
//                   }`}
//                   placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
//                 <input
//                   type="text"
//                   id="tags"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
//                 />
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//                 >
//                   {editingId ? 'Update Entry' : 'Save Entry'}
//                 </button>
//               </div>
//             </form>
            
//             {/* Mood Analysis Results */}
//             {moodAnalysis && (
//               <div className={`mt-6 p-4 rounded-lg ${getMoodColorClasses(moodAnalysis.mood).bg} border ${getMoodColorClasses(moodAnalysis.mood).border}`}>
//                 <div className="flex items-start mb-3">
//                   <Heart className={`h-5 w-5 mr-2 ${getMoodColorClasses(moodAnalysis.mood).text}`} />
//                   <h3 className={`font-medium ${getMoodColorClasses(moodAnalysis.mood).text}`}>
//                     Mood Analysis: <span className="font-bold">{moodAnalysis.mood}</span>
//                   </h3>
//                 </div>
//                 <p className="text-gray-700 mb-3">{moodAnalysis.mood_description}</p>
                
//                 {moodAnalysis.suggestions && moodAnalysis.suggestions.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Suggestions:</p>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {moodAnalysis.suggestions.map((suggestion, idx) => (
//                         <li key={idx}>{suggestion}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Journal Entries and Prompts/Insights Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Journal Entries - Left Two Columns */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
//             <button 
//               onClick={fetchJournalData}
//               className="flex items-center text-indigo-600 hover:text-indigo-800"
//             >
//               <RefreshCw className="h-5 w-5 mr-1"/>
//               Refresh
//             </button>
//           </div>

//           {entries.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-xl text-center">
//               <p className="text-gray-600">You haven't created any journal entries yet.</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 Create Your First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {entries.map((entry) => {
//                 const moodColorClasses = getMoodColorClasses(entry.mood);
//                 return (
//                   <div 
//                     key={entry._id} 
//                     className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow ${
//                       entry.mood ? `border-l-4 ${moodColorClasses.border}` : ''
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => handleEdit(entry)}
//                           className="text-indigo-600 hover:text-indigo-800"
//                           title="Edit"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(entry._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-500 mb-3">
//                       {formatDate(entry.created_at)}
//                     </p>
                    
//                     {entry.mood ? (
//                       <p className="mb-3">
//                         <span className="text-gray-700 font-medium">Mood: </span>
//                         <span className={`inline-block ${moodColorClasses.bg} ${moodColorClasses.text} rounded-full px-3 py-1 text-sm`}>
//                           {entry.mood}
//                         </span>
//                         {!entry.mood_analysis && (
//                           <button
//                             onClick={() => handleAddMoodAnalysis(entry._id)}
//                             className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
//                           >
//                             Get suggestions
//                           </button>
//                         )}
//                       </p>
//                     ) : (
//                       <p className="mb-3">
//                         <button
//                           onClick={() => handleAddMoodAnalysis(entry._id)}
//                           className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Lightbulb className="h-4 w-4 mr-1" />
//                           Analyze Mood
//                         </button>
//                       </p>
//                     )}
                    
//                     <div className="mb-4 text-gray-700 whitespace-pre-line">
//                       {entry.content.length > 200 
//                         ? `${entry.content.substring(0, 200)}...` 
//                         : entry.content
//                       }
//                     </div>
                    
//                     {/* Display mood analysis if available */}
//                     {entry.mood_analysis && (
//                       <div className={`mb-4 p-3 rounded-lg ${moodColorClasses.bg} text-sm`}>
//                         <p className="font-medium mb-1">{entry.mood_analysis.description}</p>
//                         {entry.mood_analysis.suggestions && entry.mood_analysis.suggestions.length > 0 && (
//                           <div>
//                             <p className="font-medium text-xs mt-2 mb-1">Suggestions:</p>
//                             <ul className="list-disc list-inside space-y-1 text-xs">
//                               {entry.mood_analysis.suggestions.map((suggestion, idx) => (
//                                 <li key={idx}>{suggestion}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {entry.tags && entry.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {entry.tags.map((tag, i) => (
//                           <span 
//                             key={i} 
//                             className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                           >
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Right Column - Prompts and Insights */}
//         <div className="space-y-8">
//           {/* Writing Prompts */}
//           <div className="bg-teal-50 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
//             <p className="text-gray-600 mb-4">
//               Need inspiration? Try one of these prompts:
//             </p>
//             <div className="space-y-3">
//               {prompts.slice(0, 5).map((promptObj, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => handleSelectPrompt(promptObj.prompt)}
//                   className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
//                 >
//                   <p className="text-gray-700">{promptObj.prompt}</p>
//                   <div className="mt-2">
//                     <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
//                       {promptObj.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Journal Insights with Mood Chart */}
//           {insights && insights.total_entries > 0 && (
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
//                               <span className="text-gray-600">{mood.count} entries</span>
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
          
//           {/* Mood Legend */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(moodColors)
//                 .filter(([mood]) => mood !== 'default')
//                 .slice(0, 10)
//                 .map(([mood, colors]) => (
//                   <div 
//                     key={mood}
//                     className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
//                   >
//                     {mood}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journal;


import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Edit, Trash2, RefreshCw, Lightbulb, Heart, Mic, MicOff, StopCircle } from 'lucide-react';
import { Music, Book, MessageCircle, Award } from 'lucide-react';
import axios from 'axios';

// Mood color mapping
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

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [analyzingMood, setAnalyzingMood] = useState(false);
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); // Track deletion loading state
  
  // Voice journal states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: ''
  });

  // API base URL
  const API_URL = 'http://localhost:8000';

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update form content with final transcript
        if (finalTranscript) {
          setFormData(prev => ({
            ...prev,
            content: prev.content ? prev.content + finalTranscript : finalTranscript
          }));
        }
        
        setInterimTranscript(interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}. Try restarting or using Chrome/Edge.`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start(); // Restart if still listening
          } catch (err) {
            setError('Failed to restart speech recognition. Please try again.');
            setIsListening(false);
          }
        } else {
          setInterimTranscript('');
        }
      };
      
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      setError('Speech recognition not supported. Please use Chrome or Edge.');
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Handle speech recognition status changes
  useEffect(() => {
    if (recognitionRef.current && speechSupported) {
      try {
        if (isListening) {
          recognitionRef.current.start();
        } else {
          recognitionRef.current.stop();
        }
      } catch (err) {
        setError('Speech recognition failed to start/stop. Please try again.');
        setIsListening(false);
      }
    }
  }, [isListening, speechSupported]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!speechSupported) {
      setError('Speech recognition is not supported. Please use Chrome or Edge.');
      return;
    }
    
    setIsListening(prevState => !prevState);
  };

  // Load journal entries, prompts, and insights
  useEffect(() => {
    fetchJournalData();
  }, []);

  const fetchJournalData = async () => {
    setLoading(true);
    try {
      const [entriesRes, promptsRes, insightsRes] = await Promise.all([
        axios.get(`${API_URL}/journal/entries`),
        axios.get(`${API_URL}/journal/prompts`),
        axios.get(`${API_URL}/journal/insights`)
      ]);
      
      setEntries(entriesRes.data);
      setPrompts(promptsRes.data);
      setInsights(insightsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load journal data. Please refresh the page.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Reset mood analysis when content changes
    if (name === 'content') {
      setMoodAnalysis(null);
    }
  };

  // Analyze mood based on journal content
  const handleAnalyzeMood = async () => {
    if (!formData.content || formData.content.trim().length < 10) {
      setError('Please write at least 10 characters to analyze mood.');
      return;
    }
    
    setAnalyzingMood(true);
    try {
      const response = await axios.post(`${API_URL}/journal/analyze-mood`, {
        content: formData.content
      });
      
      setMoodAnalysis(response.data);
      setFormData({
        ...formData,
        mood: response.data.mood
      });
      setError(null);
    } catch (err) {
      setError('Failed to analyze mood. Please try again.');
    } finally {
      setAnalyzingMood(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stop voice recognition if active
    if (isListening) {
      setIsListening(false);
    }
    
    // Format tags from comma-separated string to array, filter out empty tags
    const formattedData = {
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
        : []
    };
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
      } else {
        await axios.post(`${API_URL}/journal/entries`, formattedData);
      }
      
      // Reset form and refresh data
      resetForm();
      fetchJournalData();
    } catch (err) {
      setError('Failed to save journal entry. Please try again.');
    }
  };

  // Add mood analysis to existing entry
  const handleAddMoodAnalysis = async (id) => {
    try {
      await axios.put(`${API_URL}/journal/entries/${id}/analyze-mood`);
      fetchJournalData();
    } catch (err) {
      setError('Failed to analyze mood for this entry. Please try again.');
    }
  };

  // Delete a journal entry
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setIsDeleting(id); // Set loading state for this entry
      try {
        // Ensure id is treated as a string
        await axios.delete(`${API_URL}/journal/entries/${String(id)}`);
        fetchJournalData();
      } catch (err) {
        setError('Failed to delete journal entry. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Edit a journal entry
  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || '',
      tags: entry.tags ? entry.tags.join(', ') : ''
    });
    setEditingId(entry._id); // MongoDB _id is already a string in the frontend
    setShowForm(true);
    setMoodAnalysis(entry.mood_analysis || null);
    window.scrollTo(0, 0);
  };

  // Apply a journal prompt
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setFormData({
      ...formData,
      content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
    });
    setShowForm(true);
    setMoodAnalysis(null);
    window.scrollTo(0, 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Reset form and mood analysis
  const resetForm = () => {
    if (isListening) {
      setIsListening(false);
    }
    setFormData({ title: '', content: '', mood: '', tags: '' });
    setEditingId(null);
    setMoodAnalysis(null);
    setShowForm(false);
    setInterimTranscript('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-teal-600" />
        </div>
        <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Express your thoughts, track your moods, and find clarity through reflective writing.
        </p>
      </div>

      {/* Journal Insights with Mood Chart */}
      {insights && insights.total_entries > 0 && (
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Insights</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Total Entries</p>
                  <p className="text-2xl font-bold text-indigo-600">{insights.total_entries}</p>
                </div>
                
                {insights.top_moods && insights.top_moods.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Your Mood Journey</p>
                    <div className="space-y-2">
                      {insights.top_moods.map((mood, i) => {
                        const moodClasses = getMoodColorClasses(mood._id);
                        // Calculate percentage for bar width
                        const percentage = Math.min(Math.max((mood.count / insights.total_entries) * 100, 10), 100);
                        return (
                          <div key={i} className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span className={moodClasses.text}>{mood._id}</span>
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
                  </div>
                )}

                {/* Mood Legend */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(moodColors)
                      .filter(([mood]) => mood !== 'default')
                      .slice(0, 10)
                      .map(([mood, colors]) => (
                        <div 
                          key={mood}
                          className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
                        >
                          {mood}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-16 grid gap-16 md:grid-cols-2 lg:grid-cols-2">
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
                
                {insights.top_tags && insights.top_tags.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Top Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.top_tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
                        >
                          #{tag._id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-600 text-sm italic">
                  {insights.message}
                </p>
              </div>
            </div>
          )}

          <br></br>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
          <button 
            className="text-red-700 font-medium underline mt-1"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Journal Form */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-indigo-900">
            {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
          </h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                resetForm();
              }
            }}
            className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            {showForm ? 'Cancel' : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  // required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Give your entry a title"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-gray-700 font-medium">Journal Content</label>
                  
                  {/* Voice recording button */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex items-center px-3 py-1 rounded-md shadow-sm text-white font-medium ${
                        isListening 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <StopCircle className="h-4 w-4 mr-1" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-1" />
                          Record Voice
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isListening ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Write or speak your thoughts here..."
                ></textarea>
                
                {/* Interim speech recognition results */}
                {isListening && interimTranscript && (
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center mb-1">
                      <Mic className="h-4 w-4 text-red-500 mr-1 animate-pulse" />
                      <span className="text-xs font-medium text-gray-700">Currently recording:</span>
                    </div>
                    <p className="text-gray-600 italic">{interimTranscript}</p>
                  </div>
                )}
                
                {/* Voice recording indicator */}
                {isListening && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
                    <span className="text-sm">Voice recording active - speak clearly</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="mood" className="block text-gray-700 font-medium">Current Mood</label>
                  <button
                    type="button"
                    onClick={handleAnalyzeMood}
                    disabled={analyzingMood || !formData.content || formData.content.trim().length < 10}
                    className="flex items-center text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzingMood ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Detect Mood
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  id="mood"
                  name="mood"
                  value={formData.mood}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    formData.mood ? 
                    `${getMoodColorClasses(formData.mood).bg} ${getMoodColorClasses(formData.mood).border}` : 
                    'border-gray-300'
                  }`}
                  placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
            
            {/* Mood Analysis Results */}
            {moodAnalysis && (
              <div className={`mt-6 p-4 rounded-lg ${getMoodColorClasses(moodAnalysis.mood).bg} border ${getMoodColorClasses(moodAnalysis.mood).border}`}>
                <div className="flex items-start mb-3">
                  <Heart className={`h-5 w-5 mr-2 ${getMoodColorClasses(moodAnalysis.mood).text}`} />
                  <h3 className={`font-medium ${getMoodColorClasses(moodAnalysis.mood).text}`}>
                    Mood Analysis: <span className="font-bold">{moodAnalysis.mood}</span>
                  </h3>
                </div>
                <p className="text-gray-700 mb-3">{moodAnalysis.mood_description}</p>
                
                {moodAnalysis.suggestions && moodAnalysis.suggestions.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {moodAnalysis.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Journal Entries and Prompts/Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journal Entries - Left Two Columns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
            <button 
              onClick={fetchJournalData}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw className="h-5 w-5 mr-1"/>
              Refresh
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <p className="text-gray-600">You haven't created any journal entries yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                Create Your First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => {
                const moodColorClasses = getMoodColorClasses(entry.mood);
                return (
                  <div 
                    key={entry._id} 
                    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow ${
                      entry.mood ? `border-l-4 ${moodColorClasses.border}` : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(entry)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry._id)}
                          disabled={isDeleting === entry._id}
                          className={`text-red-600 hover:text-red-800 ${
                            isDeleting === entry._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete"
                        >
                          {isDeleting === entry._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(entry.created_at)}
                    </p>
                    
                    {entry.mood ? (
                      <p className="mb-3">
                        <span className="text-gray-700 font-medium">Mood: </span>
                        <span className={`inline-block ${moodColorClasses.bg} ${moodColorClasses.text} rounded-full px-3 py-1 text-sm`}>
                          {entry.mood}
                        </span>
                        {!entry.mood_analysis && (
                          <button
                            onClick={() => handleAddMoodAnalysis(entry._id)}
                            className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Get suggestions
                          </button>
                        )}
                      </p>
                    ) : (
                      <p className="mb-3">
                        <button
                          onClick={() => handleAddMoodAnalysis(entry._id)}
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <Lightbulb className="h-4 w-4 mr-1" />
                          Analyze Mood
                        </button>
                      </p>
                    )}
                    
                    <div className="mb-4 text-gray-700 whitespace-pre-line">
                      {entry.content.length > 200 
                        ? `${entry.content.substring(0, 200)}...` 
                        : entry.content
                      }
                    </div>
                    
                    {/* Display mood analysis if available */}
                    {entry.mood_analysis && (
                      <div className={`mb-4 p-3 rounded-lg ${moodColorClasses.bg} text-sm`}>
                        <p className="font-medium mb-1">{entry.mood_analysis.description}</p>
                        {entry.mood_analysis.suggestions && entry.mood_analysis.suggestions.length > 0 && (
                          <div>
                            <p className="font-medium text-xs mt-2 mb-1">Suggestions:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              {entry.mood_analysis.suggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Prompts and Insights */}
        <div className="space-y-8">
          {/* Voice Journaling Info Card */}
          <div className="bg-indigo-100 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Voice Journaling</h2>
            <div className="flex items-center mb-4">
              <Mic className="h-6 w-6 text-indigo-600 mr-2" />
              <p className="text-gray-700">
                {speechSupported 
                  ? "Talk to write! Use voice recording for a more natural journaling experience."
                  : "Voice recording is not supported in your browser. Try using Chrome or Edge."}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">How to use:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                <li>Click the "Record Voice" button when creating an entry</li>
                <li>Speak clearly into your microphone</li>
                <li>Your words will appear in the journal content box</li>
                <li>Click "Stop Recording" when you're done</li>
              </ol>
            </div>
          </div>
          {/* Writing Prompts */}
          <div className="bg-teal-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
            <p className="text-gray-600 mb-4">
              Need inspiration? Try one of these prompts:
            </p>
            <div className="space-y-3">
              {prompts.slice(0, 5).map((promptObj, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectPrompt(promptObj.prompt)}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
                >
                  <p className="text-gray-700">{promptObj.prompt}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
                      {promptObj.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Insights with Mood Chart */}
          {insights && insights.total_entries > 0 && (
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Insights</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Total Entries</p>
                  <p className="text-2xl font-bold text-indigo-600">{insights.total_entries}</p>
                </div>
                
                {insights.top_moods && insights.top_moods.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Your Mood Journey</p>
                    <div className="space-y-2">
                      {insights.top_moods.map((mood, i) => {
                        const moodClasses = getMoodColorClasses(mood._id);
                        // Calculate percentage for bar width
                        const percentage = Math.min(Math.max((mood.count / insights.total_entries) * 100, 10), 100);
                        return (
                          <div key={i} className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span className={moodClasses.text}>{mood._id}</span>
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
                  </div>
                )}
                
                {insights.top_tags && insights.top_tags.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Top Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.top_tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
                        >
                          #{tag._id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-600 text-sm italic">
                  {insights.message}
                </p>
              </div>
            </div>
          )}
          
          {/* Mood Legend */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(moodColors)
                .filter(([mood]) => mood !== 'default')
                .slice(0, 10)
                .map(([mood, colors]) => (
                  <div 
                    key={mood}
                    className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
                  >
                    {mood}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;



// import React, { useState, useEffect, useRef } from 'react';
// import { BookOpen, Plus, Edit, Trash2, RefreshCw, Lightbulb, Heart, Mic, MicOff, StopCircle } from 'lucide-react';
// import axios from 'axios';

// // Mood color mapping
// const moodColors = {
//   // Positive moods
//   'happy': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'excited': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'calm': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'grateful': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
//   'peaceful': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
//   'content': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
//   'hopeful': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
//   'inspired': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
//   'relaxed': { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
//   'confident': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  
//   // Negative/challenging moods
//   'anxious': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'sad': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'angry': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
//   'frustrated': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
//   'tired': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
//   'overwhelmed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
//   'confused': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'worried': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'stressed': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'lonely': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  
//   // Default for unknown moods
//   'default': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
// };

// // Function to get mood color classes or default if not found
// const getMoodColorClasses = (mood) => {
//   const normalizedMood = mood?.toLowerCase();
//   return moodColors[normalizedMood] || moodColors.default;
// };

// const Journal = () => {
//   const [entries, setEntries] = useState([]);
//   const [prompts, setPrompts] = useState([]);
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPrompt, setSelectedPrompt] = useState('');
//   const [analyzingMood, setAnalyzingMood] = useState(false);
//   const [moodAnalysis, setMoodAnalysis] = useState(null);
  
//   // Voice journal states
//   const [isListening, setIsListening] = useState(false);
//   const [speechSupported, setSpeechSupported] = useState(false);
//   const recognitionRef = useRef(null);
//   const [interimTranscript, setInterimTranscript] = useState('');
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     mood: '',
//     tags: ''
//   });

//   // API base URL
//   const API_URL = 'http://localhost:8000';

//   // Initialize speech recognition
//   useEffect(() => {
//     // Check if browser supports speech recognition
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.lang = 'en-US';
      
//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript + ' ';
//           } else {
//             interimTranscript += transcript;
//           }
//         }
        
//         if (finalTranscript) {
//           setFormData(prev => ({
//             ...prev,
//             content: prev.content + ' ' + finalTranscript
//           }));
//         }
        
//         setInterimTranscript(interimTranscript);
//       };
      
//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error', event.error);
//         setError(`Speech recognition error: ${event.error}`);
//         setIsListening(false);
//       };
      
//       recognitionRef.current.onend = () => {
//         if (isListening) {
//           // If still meant to be listening, restart
//           recognitionRef.current.start();
//         }
//       };
      
//       setSpeechSupported(true);
//     } else {
//       setSpeechSupported(false);
//       console.warn('Speech recognition not supported in this browser');
//     }
    
//     // Cleanup
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   // Handle speech recognition status changes
//   useEffect(() => {
//     if (recognitionRef.current) {
//       if (isListening) {
//         recognitionRef.current.start();
//       } else {
//         recognitionRef.current.stop();
//         setInterimTranscript('');
//       }
//     }
//   }, [isListening]);

//   // Toggle speech recognition
//   const toggleListening = () => {
//     if (!speechSupported) {
//       setError('Speech recognition is not supported in your browser. Try using Chrome or Edge.');
//       return;
//     }
    
//     setIsListening(prevState => !prevState);
//   };

//   // Load journal entries, prompts and insights
//   useEffect(() => {
//     fetchJournalData();
//   }, []);

//   const fetchJournalData = async () => {
//     setLoading(true);
//     try {
//       const [entriesRes, promptsRes, insightsRes] = await Promise.all([
//         axios.get(`${API_URL}/journal/entries`),
//         axios.get(`${API_URL}/journal/prompts`),
//         axios.get(`${API_URL}/journal/insights`)
//       ]);
      
//       setEntries(entriesRes.data);
//       setPrompts(promptsRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching journal data:', err);
//       setError('Failed to load journal data. Please try again later.');
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Reset mood analysis when content changes
//     if (name === 'content') {
//       setMoodAnalysis(null);
//     }
//   };

//   // Analyze mood based on journal content
//   const handleAnalyzeMood = async () => {
//     if (!formData.content || formData.content.trim().length < 10) {
//       setError('Please write more content before analyzing mood.');
//       return;
//     }
    
//     setAnalyzingMood(true);
//     try {
//       const response = await axios.post(`${API_URL}/journal/analyze-mood`, {
//         content: formData.content
//       });
      
//       setMoodAnalysis(response.data);
//       setFormData({
//         ...formData,
//         mood: response.data.mood
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error analyzing mood:', err);
//       setError('Failed to analyze mood. Please try again.');
//     } finally {
//       setAnalyzingMood(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Stop voice recognition if active
//     if (isListening) {
//       setIsListening(false);
//     }
    
//     // Format tags from comma-separated string to array
//     const formattedData = {
//       ...formData,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
//     };
    
//     try {
//       if (editingId) {
//         await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
//       } else {
//         await axios.post(`${API_URL}/journal/entries`, formattedData);
//       }
      
//       // Reset form and refresh data
//       setFormData({ title: '', content: '', mood: '', tags: '' });
//       setShowForm(false);
//       setEditingId(null);
//       setMoodAnalysis(null);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error saving journal entry:', err);
//       setError('Failed to save journal entry. Please try again.');
//     }
//   };

//   // Add mood analysis to existing entry
//   const handleAddMoodAnalysis = async (id) => {
//     try {
//       await axios.put(`${API_URL}/journal/entries/${id}/analyze-mood`);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error adding mood analysis:', err);
//       setError('Failed to analyze mood for this entry. Please try again.');
//     }
//   };

//   // Delete a journal entry
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         await axios.delete(`${API_URL}/journal/entries/${id}`);
//         fetchJournalData();
//       } catch (err) {
//         console.error('Error deleting journal entry:', err);
//         setError('Failed to delete journal entry. Please try again.');
//       }
//     }
//   };

//   // Edit a journal entry
//   const handleEdit = (entry) => {
//     setFormData({
//       title: entry.title,
//       content: entry.content,
//       mood: entry.mood || '',
//       tags: entry.tags ? entry.tags.join(', ') : ''
//     });
//     setEditingId(entry._id);
//     setShowForm(true);
//     setMoodAnalysis(entry.mood_analysis || null);
//     window.scrollTo(0, 0);
//   };

//   // Apply a journal prompt
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPrompt(prompt);
//     setFormData({
//       ...formData,
//       content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
//     });
//     setShowForm(true);
//     setMoodAnalysis(null);
//     window.scrollTo(0, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Reset form and mood analysis
//   const resetForm = () => {
//     if (isListening) {
//       setIsListening(false);
//     }
//     setFormData({ title: '', content: '', mood: '', tags: '' });
//     setEditingId(null);
//     setMoodAnalysis(null);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="flex justify-center mb-4">
//           <BookOpen className="h-12 w-12 text-teal-600" />
//         </div>
//         <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Express your thoughts, track your moods, and find clarity through reflective writing.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//           <p>{error}</p>
//           <button 
//             className="text-red-700 font-medium underline mt-1"
//             onClick={() => setError(null)}
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Journal Form */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-indigo-900">
//             {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
//           </h2>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) {
//                 resetForm();
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             {showForm ? 'Cancel' : (
//               <>
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Entry
//               </>
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Give your entry a title"
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="content" className="block text-gray-700 font-medium">Journal Content</label>
                  
//                   {/* Voice recording button */}
//                   {speechSupported && (
//                     <button
//                       type="button"
//                       onClick={toggleListening}
//                       className={`flex items-center px-3 py-1 rounded-md shadow-sm text-white font-medium ${
//                         isListening 
//                           ? 'bg-red-600 hover:bg-red-700' 
//                           : 'bg-indigo-600 hover:bg-indigo-700'
//                       }`}
//                     >
//                       {isListening ? (
//                         <>
//                           <StopCircle className="h-4 w-4 mr-1" />
//                           Stop Recording
//                         </>
//                       ) : (
//                         <>
//                           <Mic className="h-4 w-4 mr-1" />
//                           Record Voice
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
                
//                 <textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   required
//                   rows="8"
//                   className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     isListening ? 'border-red-300 bg-red-50' : ''
//                   }`}
//                   placeholder="Write your thoughts here..."
//                 ></textarea>
                
//                 {/* Interim speech recognition results */}
//                 {isListening && interimTranscript && (
//                   <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-300">
//                     <div className="flex items-center mb-1">
//                       <Mic className="h-4 w-4 text-red-500 mr-1 animate-pulse" />
//                       <span className="text-xs font-medium text-gray-700">Currently recording:</span>
//                     </div>
//                     <p className="text-gray-600 italic">{interimTranscript}</p>
//                   </div>
//                 )}
                
//                 {/* Voice recording indicator */}
//                 {isListening && (
//                   <div className="flex items-center mt-2 text-red-600">
//                     <span className="inline-block h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
//                     <span className="text-sm">Voice recording active - speak clearly</span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="mood" className="block text-gray-700 font-medium">Current Mood</label>
//                   <button
//                     type="button"
//                     onClick={handleAnalyzeMood}
//                     disabled={analyzingMood || !formData.content || formData.content.trim().length < 10}
//                     className="flex items-center text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {analyzingMood ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <Lightbulb className="h-4 w-4 mr-1" />
//                         Detect Mood
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   id="mood"
//                   name="mood"
//                   value={formData.mood}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     formData.mood ? 
//                     `${getMoodColorClasses(formData.mood).bg} ${getMoodColorClasses(formData.mood).border}` : 
//                     'border-gray-300'
//                   }`}
//                   placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
//                 <input
//                   type="text"
//                   id="tags"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
//                 />
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//                 >
//                   {editingId ? 'Update Entry' : 'Save Entry'}
//                 </button>
//               </div>
//             </form>
            
//             {/* Mood Analysis Results */}
//             {moodAnalysis && (
//               <div className={`mt-6 p-4 rounded-lg ${getMoodColorClasses(moodAnalysis.mood).bg} border ${getMoodColorClasses(moodAnalysis.mood).border}`}>
//                 <div className="flex items-start mb-3">
//                   <Heart className={`h-5 w-5 mr-2 ${getMoodColorClasses(moodAnalysis.mood).text}`} />
//                   <h3 className={`font-medium ${getMoodColorClasses(moodAnalysis.mood).text}`}>
//                     Mood Analysis: <span className="font-bold">{moodAnalysis.mood}</span>
//                   </h3>
//                 </div>
//                 <p className="text-gray-700 mb-3">{moodAnalysis.mood_description}</p>
                
//                 {moodAnalysis.suggestions && moodAnalysis.suggestions.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Suggestions:</p>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {moodAnalysis.suggestions.map((suggestion, idx) => (
//                         <li key={idx}>{suggestion}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Journal Entries and Prompts/Insights Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Journal Entries - Left Two Columns */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
//             <button 
//               onClick={fetchJournalData}
//               className="flex items-center text-indigo-600 hover:text-indigo-800"
//             >
//               <RefreshCw className="h-5 w-5 mr-1"/>
//               Refresh
//             </button>
//           </div>

//           {entries.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-xl text-center">
//               <p className="text-gray-600">You haven't created any journal entries yet.</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 Create Your First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {entries.map((entry) => {
//                 const moodColorClasses = getMoodColorClasses(entry.mood);
//                 return (
//                   <div 
//                     key={entry._id} 
//                     className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow ${
//                       entry.mood ? `border-l-4 ${moodColorClasses.border}` : ''
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => handleEdit(entry)}
//                           className="text-indigo-600 hover:text-indigo-800"
//                           title="Edit"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(entry._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-500 mb-3">
//                       {formatDate(entry.created_at)}
//                     </p>
                    
//                     {entry.mood ? (
//                       <p className="mb-3">
//                         <span className="text-gray-700 font-medium">Mood: </span>
//                         <span className={`inline-block ${moodColorClasses.bg} ${moodColorClasses.text} rounded-full px-3 py-1 text-sm`}>
//                           {entry.mood}
//                         </span>
//                         {!entry.mood_analysis && (
//                           <button
//                             onClick={() => handleAddMoodAnalysis(entry._id)}
//                             className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
//                           >
//                             Get suggestions
//                           </button>
//                         )}
//                       </p>
//                     ) : (
//                       <p className="mb-3">
//                         <button
//                           onClick={() => handleAddMoodAnalysis(entry._id)}
//                           className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Lightbulb className="h-4 w-4 mr-1" />
//                           Analyze Mood
//                         </button>
//                       </p>
//                     )}
                    
//                     <div className="mb-4 text-gray-700 whitespace-pre-line">
//                       {entry.content.length > 200 
//                         ? `${entry.content.substring(0, 200)}...` 
//                         : entry.content
//                       }
//                     </div>
                    
//                     {/* Display mood analysis if available */}
//                     {entry.mood_analysis && (
//                       <div className={`mb-4 p-3 rounded-lg ${moodColorClasses.bg} text-sm`}>
//                         <p className="font-medium mb-1">{entry.mood_analysis.description}</p>
//                         {entry.mood_analysis.suggestions && entry.mood_analysis.suggestions.length > 0 && (
//                           <div>
//                             <p className="font-medium text-xs mt-2 mb-1">Suggestions:</p>
//                             <ul className="list-disc list-inside space-y-1 text-xs">
//                               {entry.mood_analysis.suggestions.map((suggestion, idx) => (
//                                 <li key={idx}>{suggestion}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {entry.tags && entry.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {entry.tags.map((tag, i) => (
//                           <span 
//                             key={i} 
//                             className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                           >
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Right Column - Prompts and Insights */}
//         <div className="space-y-8">
//           {/* Voice Journaling Info Card */}
//           <div className="bg-indigo-100 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Voice Journaling</h2>
//             <div className="flex items-center mb-4">
//               <Mic className="h-6 w-6 text-indigo-600 mr-2" />
//               <p className="text-gray-700">
//                 {speechSupported 
//                   ? "Talk to write! Use voice recording for a more natural journaling experience."
//                   : "Voice recording is not supported in your browser. Try using Chrome or Edge."}
//               </p>
//             </div>
//             <div className="bg-white p-4 rounded-lg">
//               <h3 className="font-medium text-gray-800 mb-2">How to use:</h3>
//               <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
//                 <li>Click the "Record Voice" button when creating an entry</li>
//                 <li>Speak clearly into your microphone</li>
//                 <li>Your words will appear in the journal content box</li>
//                 <li>Click "Stop Recording" when you're done</li>
//               </ol>
//             </div>
//           </div>
//           {/* Writing Prompts */}
//           <div className="bg-teal-50 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
//             <p className="text-gray-600 mb-4">
//               Need inspiration? Try one of these prompts:
//             </p>
//             <div className="space-y-3">
//               {prompts.slice(0, 5).map((promptObj, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => handleSelectPrompt(promptObj.prompt)}
//                   className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
//                 >
//                   <p className="text-gray-700">{promptObj.prompt}</p>
//                   <div className="mt-2">
//                     <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
//                       {promptObj.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Journal Insights with Mood Chart */}
//           {insights && insights.total_entries > 0 && (
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
//                               <span className="text-gray-600">{mood.count} entries</span>
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
          
//           {/* Mood Legend */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(moodColors)
//                 .filter(([mood]) => mood !== 'default')
//                 .slice(0, 10)
//                 .map(([mood, colors]) => (
//                   <div 
//                     key={mood}
//                     className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
//                   >
//                     {mood}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journal;





// import React, { useState, useEffect, useRef } from 'react';
// import { BookOpen, Plus, Edit, Trash2, RefreshCw, Lightbulb, Heart, Mic, MicOff, StopCircle } from 'lucide-react';
// import axios from 'axios';

// // Mood color mapping
// const moodColors = {
//   // Positive moods
//   'happy': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'excited': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'calm': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'grateful': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
//   'peaceful': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
//   'content': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
//   'hopeful': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
//   'inspired': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
//   'relaxed': { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
//   'confident': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  
//   // Negative/challenging moods
//   'anxious': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'sad': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'angry': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
//   'frustrated': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
//   'tired': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
//   'overwhelmed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
//   'confused': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'worried': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'stressed': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'lonely': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  
//   // Default for unknown moods
//   'default': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
// };

// // Function to get mood color classes or default if not found
// const getMoodColorClasses = (mood) => {
//   const normalizedMood = mood?.toLowerCase();
//   return moodColors[normalizedMood] || moodColors.default;
// };

// // Voice Recognition Component
// const VoiceRecorder = ({ onTranscriptChange, initialContent = '' }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState(initialContent);
//   const [error, setError] = useState(null);
//   const [isPaused, setIsPaused] = useState(false);
//   const recognitionRef = useRef(null);
//   const [isAvailable, setIsAvailable] = useState(false);

//   useEffect(() => {
//     // Check if SpeechRecognition is available
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     setIsAvailable(!!SpeechRecognition);
    
//     // Clean up recognition on unmount
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const startRecording = () => {
//     try {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
//       if (!SpeechRecognition) {
//         setError('Speech recognition is not supported in your browser.');
//         return;
//       }
      
//       // Initialize recognition
//       recognitionRef.current = new SpeechRecognition();
//       const recognition = recognitionRef.current;
      
//       // Configure recognition
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US'; // Set language
      
//       // Handle results
//       recognition.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = transcript;
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const result = event.results[i];
//           if (result.isFinal) {
//             finalTranscript += ' ' + result[0].transcript;
//           } else {
//             interimTranscript += result[0].transcript;
//           }
//         }
        
//         // Update transcript
//         const updatedTranscript = finalTranscript.trim();
//         setTranscript(updatedTranscript);
//         onTranscriptChange(updatedTranscript);
//       };
      
//       // Handle errors
//       recognition.onerror = (event) => {
//         setError(`Speech recognition error: ${event.error}`);
//         setIsRecording(false);
//       };
      
//       // Handle end of recording
//       recognition.onend = () => {
//         // Only restart if we're supposed to be recording and not paused
//         if (isRecording && !isPaused) {
//           recognition.start();
//         } else {
//           setIsRecording(false);
//         }
//       };
      
//       // Start recording
//       recognition.start();
//       setIsRecording(true);
//       setError(null);
//     } catch (error) {
//       setError(`Error initializing speech recognition: ${error.message}`);
//     }
//   };
  
//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//       setIsPaused(false);
//     }
//   };
  
//   const pauseRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsPaused(true);
//     }
//   };
  
//   const resumeRecording = () => {
//     if (isPaused) {
//       startRecording();
//       setIsPaused(false);
//     }
//   };

//   // If speech recognition isn't available, return a message
//   if (!isAvailable) {
//     return (
//       <div className="mb-2 p-2 bg-yellow-50 text-yellow-800 rounded-md">
//         <p>Speech recognition is not supported in your browser. Try using Chrome for the best experience.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4">
//       <div className="flex items-center gap-2 mb-2">
//         {!isRecording ? (
//           <button
//             type="button"
//             onClick={startRecording}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
//           >
//             <Mic className="h-5 w-5" />
//             Start Voice Journal
//           </button>
//         ) : (
//           <>
//             <button
//               type="button"
//               onClick={stopRecording}
//               className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors"
//             >
//               <StopCircle className="h-5 w-5" />
//               Stop Recording
//             </button>
            
//             {isPaused ? (
//               <button
//                 type="button"
//                 onClick={resumeRecording}
//                 className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors"
//               >
//                 <Mic className="h-5 w-5" />
//                 Resume
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={pauseRecording}
//                 className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-sm transition-colors"
//               >
//                 <MicOff className="h-5 w-5" />
//                 Pause
//               </button>
//             )}
//           </>
//         )}
//       </div>
      
//       {isRecording && (
//         <div className="flex items-center gap-2 mb-2">
//           <div className="animate-pulse">
//             <div className="flex space-x-1">
//               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//             </div>
//           </div>
//           <span className="text-sm text-gray-600">
//             {isPaused ? "Recording paused" : "Recording your voice..."}
//           </span>
//         </div>
//       )}
      
//       {error && (
//         <div className="text-red-500 text-sm mt-1">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// const Journal = () => {
//   const [entries, setEntries] = useState([]);
//   const [prompts, setPrompts] = useState([]);
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPrompt, setSelectedPrompt] = useState('');
//   const [analyzingMood, setAnalyzingMood] = useState(false);
//   const [moodAnalysis, setMoodAnalysis] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     mood: '',
//     tags: ''
//   });

//   // API base URL
//   const API_URL = 'http://localhost:8000';

//   // Load journal entries, prompts and insights
//   useEffect(() => {
//     fetchJournalData();
//   }, []);

//   const fetchJournalData = async () => {
//     setLoading(true);
//     try {
//       const [entriesRes, promptsRes, insightsRes] = await Promise.all([
//         axios.get(`${API_URL}/journal/entries`),
//         axios.get(`${API_URL}/journal/prompts`),
//         axios.get(`${API_URL}/journal/insights`)
//       ]);
      
//       setEntries(entriesRes.data);
//       setPrompts(promptsRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching journal data:', err);
//       setError('Failed to load journal data. Please try again later.');
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Reset mood analysis when content changes
//     if (name === 'content') {
//       setMoodAnalysis(null);
//     }
//   };

//   // Handle voice transcript updates
//   const handleTranscriptChange = (transcript) => {
//     setFormData({
//       ...formData,
//       content: transcript
//     });
//     setMoodAnalysis(null);
//   };

//   // Analyze mood based on journal content
//   const handleAnalyzeMood = async () => {
//     if (!formData.content || formData.content.trim().length < 10) {
//       setError('Please write more content before analyzing mood.');
//       return;
//     }
    
//     setAnalyzingMood(true);
//     try {
//       const response = await axios.post(`${API_URL}/journal/analyze-mood`, {
//         content: formData.content
//       });
      
//       setMoodAnalysis(response.data);
//       setFormData({
//         ...formData,
//         mood: response.data.mood
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error analyzing mood:', err);
//       setError('Failed to analyze mood. Please try again.');
//     } finally {
//       setAnalyzingMood(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Format tags from comma-separated string to array
//     const formattedData = {
//       ...formData,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
//     };
    
//     try {
//       if (editingId) {
//         await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
//       } else {
//         await axios.post(`${API_URL}/journal/entries`, formattedData);
//       }
      
//       // Reset form and refresh data
//       setFormData({ title: '', content: '', mood: '', tags: '' });
//       setShowForm(false);
//       setEditingId(null);
//       setMoodAnalysis(null);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error saving journal entry:', err);
//       setError('Failed to save journal entry. Please try again.');
//     }
//   };

//   // Add mood analysis to existing entry
//   const handleAddMoodAnalysis = async (id) => {
//     try {
//       await axios.put(`${API_URL}/journal/entries/${id}/analyze-mood`);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error adding mood analysis:', err);
//       setError('Failed to analyze mood for this entry. Please try again.');
//     }
//   };

//   // Delete a journal entry
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         await axios.delete(`${API_URL}/journal/entries/${id}`);
//         fetchJournalData();
//       } catch (err) {
//         console.error('Error deleting journal entry:', err);
//         setError('Failed to delete journal entry. Please try again.');
//       }
//     }
//   };

//   // Edit a journal entry
//   const handleEdit = (entry) => {
//     setFormData({
//       title: entry.title,
//       content: entry.content,
//       mood: entry.mood || '',
//       tags: entry.tags ? entry.tags.join(', ') : ''
//     });
//     setEditingId(entry._id);
//     setShowForm(true);
//     setMoodAnalysis(entry.mood_analysis || null);
//     window.scrollTo(0, 0);
//   };

//   // Apply a journal prompt
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPrompt(prompt);
//     setFormData({
//       ...formData,
//       content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
//     });
//     setShowForm(true);
//     setMoodAnalysis(null);
//     window.scrollTo(0, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Reset form and mood analysis
//   const resetForm = () => {
//     setFormData({ title: '', content: '', mood: '', tags: '' });
//     setEditingId(null);
//     setMoodAnalysis(null);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="flex justify-center mb-4">
//           <BookOpen className="h-12 w-12 text-teal-600" />
//         </div>
//         <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Express your thoughts, track your moods, and find clarity through reflective writing or voice journaling.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Journal Form */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-indigo-900">
//             {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
//           </h2>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) {
//                 resetForm();
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             {showForm ? 'Cancel' : (
//               <>
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Entry
//               </>
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Give your entry a title"
//                 />
//               </div>
              
//               {/* Voice Journal Feature */}
//               <VoiceRecorder 
//                 onTranscriptChange={handleTranscriptChange}
//                 initialContent={formData.content}
//               />
              
//               <div className="mb-4">
//                 <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Journal Content</label>
//                 <textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   required
//                   rows="8"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Write or speak your thoughts here..."
//                 ></textarea>
//               </div>
              
//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="mood" className="block text-gray-700 font-medium">Current Mood</label>
//                   <button
//                     type="button"
//                     onClick={handleAnalyzeMood}
//                     disabled={analyzingMood || !formData.content || formData.content.trim().length < 10}
//                     className="flex items-center text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {analyzingMood ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <Lightbulb className="h-4 w-4 mr-1" />
//                         Detect Mood
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   id="mood"
//                   name="mood"
//                   value={formData.mood}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     formData.mood ? 
//                     `${getMoodColorClasses(formData.mood).bg} ${getMoodColorClasses(formData.mood).border}` : 
//                     'border-gray-300'
//                   }`}
//                   placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
//                 <input
//                   type="text"
//                   id="tags"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
//                 />
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//                 >
//                   {editingId ? 'Update Entry' : 'Save Entry'}
//                 </button>
//               </div>
//             </form>
            
//             {/* Mood Analysis Results */}
//             {moodAnalysis && (
//               <div className={`mt-6 p-4 rounded-lg ${getMoodColorClasses(moodAnalysis.mood).bg} border ${getMoodColorClasses(moodAnalysis.mood).border}`}>
//                 <div className="flex items-start mb-3">
//                   <Heart className={`h-5 w-5 mr-2 ${getMoodColorClasses(moodAnalysis.mood).text}`} />
//                   <h3 className={`font-medium ${getMoodColorClasses(moodAnalysis.mood).text}`}>
//                     Mood Analysis: <span className="font-bold">{moodAnalysis.mood}</span>
//                   </h3>
//                 </div>
//                 <p className="text-gray-700 mb-3">{moodAnalysis.mood_description}</p>
                
//                 {moodAnalysis.suggestions && moodAnalysis.suggestions.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Suggestions:</p>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {moodAnalysis.suggestions.map((suggestion, idx) => (
//                         <li key={idx}>{suggestion}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Journal Entries and Prompts/Insights Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Journal Entries - Left Two Columns */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
//             <button 
//               onClick={fetchJournalData}
//               className="flex items-center text-indigo-600 hover:text-indigo-800"
//             >
//               <RefreshCw className="h-5 w-5 mr-1"/>
//               Refresh
//             </button>
//           </div>

//           {entries.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-xl text-center">
//               <p className="text-gray-600">You haven't created any journal entries yet.</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 Create Your First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {entries.map((entry) => {
//                 const moodColorClasses = getMoodColorClasses(entry.mood);
//                 return (
//                   <div 
//                     key={entry._id} 
//                     className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow ${
//                       entry.mood ? `border-l-4 ${moodColorClasses.border}` : ''
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => handleEdit(entry)}
//                           className="text-indigo-600 hover:text-indigo-800"
//                           title="Edit"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(entry._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-500 mb-3">
//                       {formatDate(entry.created_at)}
//                     </p>
                    
//                     {entry.mood ? (
//                       <p className="mb-3">
//                         <span className="text-gray-700 font-medium">Mood: </span>
//                         <span className={`inline-block ${moodColorClasses.bg} ${moodColorClasses.text} rounded-full px-3 py-1 text-sm`}>
//                           {entry.mood}
//                         </span>
//                         {!entry.mood_analysis && (
//                           <button
//                             onClick={() => handleAddMoodAnalysis(entry._id)}
//                             className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
//                           >
//                             Get suggestions
//                           </button>
//                         )}
//                       </p>
//                     ) : (
//                       <p className="mb-3">
//                         <button
//                           onClick={() => handleAddMoodAnalysis(entry._id)}
//                           className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Lightbulb className="h-4 w-4 mr-1" />
//                           Analyze Mood
//                         </button>
//                       </p>
//                     )}
                    
//                     <div className="mb-4 text-gray-700 whitespace-pre-line">
//                       {entry.content.length > 200 
//                         ? `${entry.content.substring(0, 200)}...` 
//                         : entry.content
//                       }
//                     </div>
                    
//                     {/* Display mood analysis if available */}
//                     {entry.mood_analysis && (
//                       <div className={`mb-4 p-3 rounded-lg ${moodColorClasses.bg} text-sm`}>
//                         <p className="font-medium mb-1">{entry.mood_analysis.description}</p>
//                         {entry.mood_analysis.suggestions && entry.mood_analysis.suggestions.length > 0 && (
//                           <div>
//                             <p className="font-medium text-xs mt-2 mb-1">Suggestions:</p>
//                             <ul className="list-disc list-inside space-y-1 text-xs">
//                               {entry.mood_analysis.suggestions.map((suggestion, idx) => (
//                                 <li key={idx}>{suggestion}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {entry.tags && entry.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {entry.tags.map((tag, i) => (
//                           <span 
//                             key={i} 
//                             className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                           >
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>


//         {/* Right Column - Prompts and Insights */}
//         <div className="space-y-8">
//           {/* Writing Prompts */}
//           <div className="bg-teal-50 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
//             <p className="text-gray-600 mb-4">
//               Need inspiration? Try one of these prompts:
//             </p>
//             <div className="space-y-3">
//               {prompts.slice(0, 5).map((promptObj, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => handleSelectPrompt(promptObj.prompt)}
//                   className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
//                 >
//                   <p className="text-gray-700">{promptObj.prompt}</p>
//                   <div className="mt-2">
//                     <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
//                       {promptObj.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Journal Insights with Mood Chart */}
//           {insights && insights.total_entries > 0 && (
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
//                               <span className="text-gray-600">{mood.count} entries</span>
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
          
//           {/* Mood Legend */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(moodColors)
//                 .filter(([mood]) => mood !== 'default')
//                 .slice(0, 10)
//                 .map(([mood, colors]) => (
//                   <div 
//                     key={mood}
//                     className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
//                   >
//                     {mood}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journal;





// import React, { useState, useEffect } from 'react';
// import { BookOpen, Plus, Edit, Trash2, RefreshCw, Lightbulb, Heart } from 'lucide-react';
// import axios from 'axios';

// // Mood color mapping
// const moodColors = {
//   // Positive moods
//   'happy': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'excited': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'calm': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'grateful': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
//   'peaceful': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
//   'content': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
//   'hopeful': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
//   'inspired': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
//   'relaxed': { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
//   'confident': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  
//   // Negative/challenging moods
//   'anxious': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'sad': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
//   'angry': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
//   'frustrated': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
//   'tired': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
//   'overwhelmed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
//   'confused': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
//   'worried': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
//   'stressed': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
//   'lonely': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  
//   // Default for unknown moods
//   'default': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
// };

// // Function to get mood color classes or default if not found
// const getMoodColorClasses = (mood) => {
//   const normalizedMood = mood?.toLowerCase();
//   return moodColors[normalizedMood] || moodColors.default;
// };

// const Journal = () => {
//   const [entries, setEntries] = useState([]);
//   const [prompts, setPrompts] = useState([]);
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPrompt, setSelectedPrompt] = useState('');
//   const [analyzingMood, setAnalyzingMood] = useState(false);
//   const [moodAnalysis, setMoodAnalysis] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     mood: '',
//     tags: ''
//   });

//   // API base URL
//   const API_URL = 'http://localhost:8000';

//   // Load journal entries, prompts and insights
//   useEffect(() => {
//     fetchJournalData();
//   }, []);

//   const fetchJournalData = async () => {
//     setLoading(true);
//     try {
//       const [entriesRes, promptsRes, insightsRes] = await Promise.all([
//         axios.get(`${API_URL}/journal/entries`),
//         axios.get(`${API_URL}/journal/prompts`),
//         axios.get(`${API_URL}/journal/insights`)
//       ]);
      
//       setEntries(entriesRes.data);
//       setPrompts(promptsRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching journal data:', err);
//       setError('Failed to load journal data. Please try again later.');
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Reset mood analysis when content changes
//     if (name === 'content') {
//       setMoodAnalysis(null);
//     }
//   };

//   // Analyze mood based on journal content
//   const handleAnalyzeMood = async () => {
//     if (!formData.content || formData.content.trim().length < 10) {
//       setError('Please write more content before analyzing mood.');
//       return;
//     }
    
//     setAnalyzingMood(true);
//     try {
//       const response = await axios.post(`${API_URL}/journal/analyze-mood`, {
//         content: formData.content
//       });
      
//       setMoodAnalysis(response.data);
//       setFormData({
//         ...formData,
//         mood: response.data.mood
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error analyzing mood:', err);
//       setError('Failed to analyze mood. Please try again.');
//     } finally {
//       setAnalyzingMood(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Format tags from comma-separated string to array
//     const formattedData = {
//       ...formData,
//       tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
//     };
    
//     try {
//       if (editingId) {
//         // For editing, use the specific ID endpoint
//         await axios.put(`${API_URL}/journal/entries/${editingId}`, formattedData);
//       } else {
//         await axios.post(`${API_URL}/journal/entries`, formattedData);
//       }
      
//       // Reset form and refresh data
//       setFormData({ title: '', content: '', mood: '', tags: '' });
//       setShowForm(false);
//       setEditingId(null);
//       setMoodAnalysis(null);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error saving journal entry:', err);
//       setError(`Failed to save journal entry: ${err.response?.data?.detail || err.message}`);
//     }
//   };

//   // Add mood analysis to existing entry
//   const handleAddMoodAnalysis = async (id) => {
//     try {
//       await axios.put(`${API_URL}/journal/entries/${id}/analyze-mood`);
//       fetchJournalData();
//     } catch (err) {
//       console.error('Error adding mood analysis:', err);
//       setError(`Failed to analyze mood for this entry: ${err.response?.data?.detail || err.message}`);
//     }
//   };

//   // Delete a journal entry
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         const response = await axios.delete(`${API_URL}/journal/entries/${id}`);
//         if (response.status === 200) {
//           setEntries(entries.filter(entry => entry._id.$oid !== id && entry._id !== id));
//           fetchJournalData(); // Refresh all data
//         }
//       } catch (err) {
//         console.error('Error deleting journal entry:', err);
//         setError(`Failed to delete journal entry: ${err.response?.data?.detail || err.message}`);
//       }
//     }
//   };

//   // Extract ObjectId from MongoDB document
//   const getObjectId = (entry) => {
//     // Handle both formats: { _id: '123' } and { _id: { $oid: '123' } }
//     return entry._id.$oid || entry._id;
//   };

//   // Edit a journal entry
//   const handleEdit = (entry) => {
//     const entryId = getObjectId(entry);
//     setFormData({
//       title: entry.title,
//       content: entry.content,
//       mood: entry.mood || '',
//       tags: entry.tags ? entry.tags.join(', ') : ''
//     });
//     setEditingId(entryId);
//     setShowForm(true);
//     setMoodAnalysis(entry.mood_analysis || null);
//     window.scrollTo(0, 0);
//   };

//   // Apply a journal prompt
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPrompt(prompt);
//     setFormData({
//       ...formData,
//       content: formData.content ? `${formData.content}\n\n${prompt}` : prompt
//     });
//     setShowForm(true);
//     setMoodAnalysis(null);
//     window.scrollTo(0, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Reset form and mood analysis
//   const resetForm = () => {
//     setFormData({ title: '', content: '', mood: '', tags: '' });
//     setEditingId(null);
//     setMoodAnalysis(null);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="flex justify-center mb-4">
//           <BookOpen className="h-12 w-12 text-teal-600" />
//         </div>
//         <h1 className="text-4xl font-bold text-indigo-900">Your Mindful Journal</h1>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Express your thoughts, track your moods, and find clarity through reflective writing.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//           <p>{error}</p>
//           <button 
//             onClick={() => setError(null)} 
//             className="text-sm underline mt-1"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Journal Form */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-indigo-900">
//             {editingId ? 'Edit Journal Entry' : 'Create New Entry'}
//           </h2>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) {
//                 resetForm();
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             {showForm ? 'Cancel' : (
//               <>
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Entry
//               </>
//             )}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Give your entry a title"
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Journal Content</label>
//                 <textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   required
//                   rows="8"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Write your thoughts here..."
//                 ></textarea>
//               </div>
              
//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="mood" className="block text-gray-700 font-medium">Current Mood</label>
//                   <button
//                     type="button"
//                     onClick={handleAnalyzeMood}
//                     disabled={analyzingMood || !formData.content || formData.content.trim().length < 10}
//                     className="flex items-center text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {analyzingMood ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <Lightbulb className="h-4 w-4 mr-1" />
//                         Detect Mood
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   id="mood"
//                   name="mood"
//                   value={formData.mood}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     formData.mood ? 
//                     `${getMoodColorClasses(formData.mood).bg} ${getMoodColorClasses(formData.mood).border}` : 
//                     'border-gray-300'
//                   }`}
//                   placeholder="How are you feeling? (e.g., calm, anxious, hopeful)"
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
//                 <input
//                   type="text"
//                   id="tags"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Add tags separated by commas (e.g., meditation, anxiety, growth)"
//                 />
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//                 >
//                   {editingId ? 'Update Entry' : 'Save Entry'}
//                 </button>
//               </div>
//             </form>
            
//             {/* Mood Analysis Results */}
//             {moodAnalysis && (
//               <div className={`mt-6 p-4 rounded-lg ${getMoodColorClasses(moodAnalysis.mood).bg} border ${getMoodColorClasses(moodAnalysis.mood).border}`}>
//                 <div className="flex items-start mb-3">
//                   <Heart className={`h-5 w-5 mr-2 ${getMoodColorClasses(moodAnalysis.mood).text}`} />
//                   <h3 className={`font-medium ${getMoodColorClasses(moodAnalysis.mood).text}`}>
//                     Mood Analysis: <span className="font-bold">{moodAnalysis.mood}</span>
//                   </h3>
//                 </div>
//                 <p className="text-gray-700 mb-3">{moodAnalysis.mood_description}</p>
                
//                 {moodAnalysis.suggestions && moodAnalysis.suggestions.length > 0 && (
//                   <div>
//                     <p className="font-medium text-gray-700 mb-2">Suggestions:</p>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {moodAnalysis.suggestions.map((suggestion, idx) => (
//                         <li key={idx}>{suggestion}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Journal Entries and Prompts/Insights Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Journal Entries - Left Two Columns */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold text-indigo-900">Your Journal Entries</h2>
//             <button 
//               onClick={fetchJournalData}
//               className="flex items-center text-indigo-600 hover:text-indigo-800"
//             >
//               <RefreshCw className="h-5 w-5 mr-1"/>
//               Refresh
//             </button>
//           </div>

//           {entries.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-xl text-center">
//               <p className="text-gray-600">You haven't created any journal entries yet.</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
//               >
//                 Create Your First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {entries.map((entry) => {
//                 const moodColorClasses = getMoodColorClasses(entry.mood);
//                 return (
//                   <div 
//                     key={entry._id} 
//                     className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow ${
//                       entry.mood ? `border-l-4 ${moodColorClasses.border}` : ''
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => handleEdit(entry)}
//                           className="text-indigo-600 hover:text-indigo-800"
//                           title="Edit"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(entry._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-500 mb-3">
//                       {formatDate(entry.created_at)}
//                     </p>
                    
//                     {entry.mood ? (
//                       <p className="mb-3">
//                         <span className="text-gray-700 font-medium">Mood: </span>
//                         <span className={`inline-block ${moodColorClasses.bg} ${moodColorClasses.text} rounded-full px-3 py-1 text-sm`}>
//                           {entry.mood}
//                         </span>
//                         {!entry.mood_analysis && (
//                           <button
//                             onClick={() => handleAddMoodAnalysis(entry._id)}
//                             className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
//                           >
//                             Get suggestions
//                           </button>
//                         )}
//                       </p>
//                     ) : (
//                       <p className="mb-3">
//                         <button
//                           onClick={() => handleAddMoodAnalysis(entry._id)}
//                           className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Lightbulb className="h-4 w-4 mr-1" />
//                           Analyze Mood
//                         </button>
//                       </p>
//                     )}
                    
//                     <div className="mb-4 text-gray-700 whitespace-pre-line">
//                       {entry.content.length > 200 
//                         ? `${entry.content.substring(0, 200)}...` 
//                         : entry.content
//                       }
//                     </div>
                    
//                     {/* Display mood analysis if available */}
//                     {entry.mood_analysis && (
//                       <div className={`mb-4 p-3 rounded-lg ${moodColorClasses.bg} text-sm`}>
//                         <p className="font-medium mb-1">{entry.mood_analysis.description}</p>
//                         {entry.mood_analysis.suggestions && entry.mood_analysis.suggestions.length > 0 && (
//                           <div>
//                             <p className="font-medium text-xs mt-2 mb-1">Suggestions:</p>
//                             <ul className="list-disc list-inside space-y-1 text-xs">
//                               {entry.mood_analysis.suggestions.map((suggestion, idx) => (
//                                 <li key={idx}>{suggestion}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {entry.tags && entry.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {entry.tags.map((tag, i) => (
//                           <span 
//                             key={i} 
//                             className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm"
//                           >
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Right Column - Prompts and Insights */}
//         <div className="space-y-8">
//           {/* Writing Prompts */}
//           <div className="bg-teal-50 p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-indigo-900 mb-4">Journal Prompts</h2>
//             <p className="text-gray-600 mb-4">
//               Need inspiration? Try one of these prompts:
//             </p>
//             <div className="space-y-3">
//               {prompts.slice(0, 5).map((promptObj, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => handleSelectPrompt(promptObj.prompt)}
//                   className="bg-white p-4 rounded-lg shadow-sm hover:shadow cursor-pointer transition-shadow"
//                 >
//                   <p className="text-gray-700">{promptObj.prompt}</p>
//                   <div className="mt-2">
//                     <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs">
//                       {promptObj.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Journal Insights with Mood Chart */}
//           {insights && insights.total_entries > 0 && (
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
//                               <span className="text-gray-600">{mood.count} entries</span>
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
          
//           {/* Mood Legend */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-gray-900 mb-3">Mood Colors</h2>
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(moodColors)
//                 .filter(([mood]) => mood !== 'default')
//                 .slice(0, 10)
//                 .map(([mood, colors]) => (
//                   <div 
//                     key={mood}
//                     className={`px-3 py-1 rounded-md ${colors.bg} ${colors.text} text-sm text-center`}
//                   >
//                     {mood}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Journal;
