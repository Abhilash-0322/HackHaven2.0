// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Calendar, Clock, Search, Filter, UserCheck, X } from 'lucide-react';
// import axios from 'axios'; // Make sure to install axios: npm install axios

// const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual API base URL

// const TherapistAppointments = () => {
//   const [therapists, setTherapists] = useState([]);
//   const [selectedTherapist, setSelectedTherapist] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [specializations, setSpecializations] = useState([]);
//   const [filteredSpecialization, setFilteredSpecialization] = useState('');
//   const [filteredLanguage, setFilteredLanguage] = useState('');
//   const [userAppointments, setUserAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [bookingError, setBookingError] = useState(null);
//   const navigate = useNavigate();
  
//   // For demo purposes - in a real app, get this from authentication context
//   const userId = "user123";
  
//   useEffect(() => {
//     // Fetch therapists on component mount
//     fetchTherapists();
//     fetchSpecializations();
//     fetchUserAppointments();
//   }, []);
  
//   // Re-fetch therapists when filters change
//   useEffect(() => {
//     fetchTherapists();
//   }, [filteredSpecialization, filteredLanguage]);
  
//   const fetchTherapists = async () => {
//     setIsLoading(true);
//     try {
//       let url = `${API_BASE_URL}/therapists/`;
      
//       // Add query parameters for filtering
//       const params = new URLSearchParams();
//       if (filteredSpecialization) {
//         params.append('specialization', filteredSpecialization);
//       }
//       if (filteredLanguage) {
//         params.append('language', filteredLanguage);
//       }
      
//       // Append params to URL if they exist
//       const queryString = params.toString();
//       if (queryString) {
//         url += `?${queryString}`;
//       }
      
//       const response = await axios.get(url);
//       setTherapists(response.data);
//     } catch (error) {
//       console.error("Error fetching therapists:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
// //   const fetchSpecializations = async () => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/therapists/specializations`);
// //       setSpecializations(response.data.specializations);
// //     } catch (error) {
// //       console.error("Error fetching specializations:", error);
// //     }
// //   };

// // Update in TherapistAppointments.jsx
//     const fetchSpecializations = async () => {
//         try {
//         const response = await axios.get(`${API_BASE_URL}/therapists/specializations`);
//         // Make sure we're accessing the correct property from the response
//         if (response.data && response.data.specializations) {
//             setSpecializations(response.data.specializations);
//         } else {
//             console.error("Unexpected specializations response format:", response.data);
//             setSpecializations([]);
//         }
//         } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setSpecializations([]);
//         }
//     };
  
//   const fetchUserAppointments = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/therapists/appointments/user/${userId}`);
//       setUserAppointments(response.data);
//     } catch (error) {
//       console.error("Error fetching user appointments:", error);
//     }
//   };

//   const getCoinCost = (startTime, endTime) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);
//     const durationMinutes = (end - start) / (1000 * 60);
    
//     return durationMinutes <= 30 ? 100 : 175;
//   };
  
//   const handleTherapistSelect = async (therapist) => {
//     try {
//       setSelectedTherapist(therapist);
//       setSelectedSlot(null); // Reset selected slot when selecting a new therapist
      
//       const response = await axios.get(`${API_BASE_URL}/therapists/${therapist._id}`);
//       const therapistWithAvailability = response.data;
      
//       // Sort slots by date/time
//       const sortedSlots = therapistWithAvailability.available_slots.sort((a, b) => 
//         new Date(a.start_time) - new Date(b.start_time)
//       );
      
//       setAvailableSlots(sortedSlots);
//     } catch (error) {
//       console.error("Error fetching therapist details:", error);
//     }
//   };
  
//   const handleSlotSelect = (slot) => {
//     setSelectedSlot(slot);
//     // Clear any previous booking errors
//     setBookingError(null);
//   };
  
// //   const handleBookAppointment = async () => {
// //     if (!selectedTherapist || !selectedSlot) return;
    
// //     try {
// //       setBookingError(null);
      
// //       const appointmentData = {
// //         user_id: userId,
// //         therapist_id: selectedTherapist._id,
// //         date: new Date(selectedSlot.start_time),
// //         start_time: new Date(selectedSlot.start_time),
// //         end_time: new Date(selectedSlot.end_time),
// //         notes: "" // Could add a notes field in the UI for this
// //       };
      
// //       // Book the appointment
// //       await axios.post(`${API_BASE_URL}/therapists/appointments`, appointmentData);
      
// //       // Show success message
// //       setBookingSuccess(true);
      
// //       // Refresh user appointments and reset selection
// //       fetchUserAppointments();
// //       // Clear the selected therapist after a short delay to allow the user to see the success message
// //       setTimeout(() => {
// //         fetchTherapists(); // Refresh therapist list to update availability
// //         setSelectedTherapist(null);
// //         setSelectedSlot(null);
// //         setBookingSuccess(false);
// //       }, 3000);
// //     } catch (error) {
// //       console.error("Error booking appointment:", error);
// //       setBookingError(error.response?.data?.detail || "Failed to book appointment. Please try again.");
// //     }
// //   };

//     // Update in TherapistAppointments.jsx
// // Update in TherapistAppointments.jsx
// const handleBookAppointment = async () => {
//     if (!selectedTherapist || !selectedSlot) return;
    
//     try {
//       setBookingError(null);
      
//       // Format the date strings properly for the API
//       const startTime = new Date(selectedSlot.start_time);
//       const endTime = new Date(selectedSlot.end_time);
      
//       const appointmentData = {
//         user_id: userId,
//         therapist_id: selectedTherapist._id,
//         date: startTime.toISOString(), // Use ISO string format
//         start_time: startTime.toISOString(),
//         end_time: endTime.toISOString(),
//         notes: ""
//       };
      
//       // Book the appointment
//       const response = await axios.post(`${API_BASE_URL}/therapists/appointments`, appointmentData);
//       console.log("Appointment booking response:", response.data);
      
//       // Show success message
//       setBookingSuccess(true);
      
//       // Rest of the function remains the same...
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       setBookingError(error.response?.data?.detail || "Failed to book appointment. Please try again.");
//     }
//   };
  
//   const handleCancelAppointment = async (appointmentId) => {
//     try {
//       // Cancel the appointment
//       await axios.delete(`${API_BASE_URL}/therapists/appointments/${appointmentId}`);
      
//       // Refresh the appointments list
//       fetchUserAppointments();
//       // Refresh therapist list to update availability
//       fetchTherapists();
//     } catch (error) {
//       console.error("Error cancelling appointment:", error);
//     }
//   };
  
//   // Format time in a user-friendly way (e.g., "10:00 AM")
//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };
  
//   // Format date in a user-friendly way (e.g., "Monday, April 24")
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
//   };
  
//   // Group available slots by date for better organization
//   const groupedSlots = () => {
//     const groups = {};
    
//     availableSlots.forEach(slot => {
//       const date = new Date(slot.start_time);
//       const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
//       if (!groups[dateKey]) {
//         groups[dateKey] = {
//           dateDisplay: formatDate(date),
//           slots: []
//         };
//       }
      
//       groups[dateKey].slots.push(slot);
//     });
    
//     return groups;
//   };
  
//   return (
//     <div className="w-full bg-gradient-to-b from-white to-indigo-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">Find Your Mental Health Partner</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Connect with professional therapists and schedule sessions to support your mental wellness journey.
//           </p>
//         </div>
        
//         {/* Success message */}
//         {bookingSuccess && (
//           <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <div className="flex-shrink-0 text-green-500">
//               <UserCheck className="h-5 w-5" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-green-800">
//                 Your appointment has been successfully booked!
//               </p>
//             </div>
//             <div className="ml-auto pl-3">
//               <button
//                 className="inline-flex text-gray-400 hover:text-gray-500"
//                 onClick={() => setBookingSuccess(false)}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Error message */}
//         {bookingError && (
//           <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <div className="flex-shrink-0 text-red-500">
//               <X className="h-5 w-5" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-red-800">
//                 {bookingError}
//               </p>
//             </div>
//             <div className="ml-auto pl-3">
//               <button
//                 className="inline-flex text-gray-400 hover:text-gray-500"
//                 onClick={() => setBookingError(null)}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Main content */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left column - Therapist search and list */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//               <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Find a Therapist</h2>
              
//               {/* Search and filters */}
//               <div className="mb-6">
//                 <div className="flex flex-wrap gap-4">
//                   <div className="w-full md:w-auto flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Specialization
//                     </label>
//                     <div className="relative">
//                       <select
//                         className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                         value={filteredSpecialization}
//                         onChange={(e) => setFilteredSpecialization(e.target.value)}
//                       >
//                         <option value="">All Specializations</option>
//                         {specializations.map((spec) => (
//                           <option key={spec} value={spec}>{spec}</option>
//                         ))}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <Filter className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="w-full md:w-auto flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Language
//                     </label>
//                     <div className="relative">
//                       <select
//                         className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                         value={filteredLanguage}
//                         onChange={(e) => setFilteredLanguage(e.target.value)}
//                       >
//                         <option value="">All Languages</option>
//                         <option value="English">English</option>
//                         <option value="Spanish">Spanish</option>
//                         <option value="Mandarin">Mandarin</option>
//                         <option value="Hindi">Hindi</option>
//                         <option value="Gujarati">Gujarati</option>
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <Filter className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Replace your existing time slot selection with this */}
//               <div className="mt-4">
//                 <h3 className="text-lg font-medium text-gray-900">Select a time slot:</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
//                   {availableSlots.map((slot, index) => (
//                     <button
//                       key={index}
//                       onClick={() => selectTimeSlot(slot)}
//                       className={`p-2 rounded border text-sm ${
//                         selectedSlot && selectedSlot.start_time === slot.start_time
//                           ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
//                           : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       <div>{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
//                       <div className="flex items-center justify-center mt-1 text-xs">
//                         <Coins className="h-3 w-3 text-yellow-500 mr-1" />
//                         <span>{getCoinCost(slot.start_time, slot.end_time)} coins</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Therapists list */}
//               <div className="space-y-6">
//                 {isLoading ? (
//                   <div className="text-center py-8">
//                     <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
//                     <p className="mt-2 text-gray-600">Loading therapists...</p>
//                   </div>
//                 ) : therapists.length === 0 ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-600">No therapists found matching your criteria.</p>
//                   </div>
//                 ) : (
//                   therapists.map((therapist) => (
//                     <div 
//                       key={therapist._id}
//                       className={`border rounded-lg overflow-hidden transition-all ${
//                         selectedTherapist?._id === therapist._id
//                           ? 'border-indigo-500 bg-indigo-50 shadow-md'
//                           : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
//                       }`}
//                     >
//                       <div className="p-6">
//                         <div className="flex flex-col md:flex-row gap-6">
//                           <div className="md:w-1/4 flex-shrink-0">
//                             <img 
//                               src={therapist.photo_url || "/api/placeholder/150/150"} 
//                               alt={therapist.name}
//                               className="w-full rounded-lg object-cover aspect-square"
//                             />
//                           </div>
//                           <div className="md:w-3/4">
//                             <h3 className="text-xl font-semibold text-indigo-900 mb-2">{therapist.name}</h3>
                            
//                             <div className="mb-2 flex flex-wrap gap-2">
//                               {therapist.specializations.map((spec, idx) => (
//                                 <span 
//                                   key={idx} 
//                                   className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                                 >
//                                   {spec}
//                                 </span>
//                               ))}
//                             </div>
                            
//                             <p className="text-sm text-gray-600 mb-3">
//                               <span className="font-medium">Experience:</span> {therapist.experience_years} years
//                             </p>
                            
//                             <p className="text-sm text-gray-600 mb-3">
//                               <span className="font-medium">Education:</span> {therapist.education}
//                             </p>
                            
//                             <p className="text-sm text-gray-600 mb-4">
//                               <span className="font-medium">Languages:</span> {therapist.languages.join(", ")}
//                             </p>
                            
//                             <div className="flex items-center justify-between">
//                               <p className="text-lg font-bold text-indigo-600">${therapist.hourly_rate}/hour</p>
//                               <button
//                                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
//                                 onClick={() => handleTherapistSelect(therapist)}
//                               >
//                                 View Availability
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {selectedTherapist?._id === therapist._id && (
//                         <div className="border-t border-indigo-200 bg-indigo-50 p-6">
//                           <h4 className="text-lg font-medium text-indigo-900 mb-4">
//                             Available Appointments
//                           </h4>
                          
//                           {availableSlots.length === 0 ? (
//                             <p className="text-gray-600 text-center py-4">
//                               No available appointments found for this therapist.
//                             </p>
//                           ) : (
//                             <div>
//                               {/* Group slots by date */}
//                               {Object.entries(groupedSlots()).map(([dateKey, group]) => (
//                                 <div key={dateKey} className="mb-6">
//                                   <h5 className="font-medium text-indigo-800 mb-2">{group.dateDisplay}</h5>
//                                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                                     {group.slots.map((slot, idx) => (
//                                       <button
//                                         key={idx}
//                                         className={`p-3 border rounded-md text-center transition-colors ${
//                                           selectedSlot && 
//                                           selectedSlot.start_time === slot.start_time && 
//                                           selectedSlot.end_time === slot.end_time
//                                             ? 'bg-indigo-600 text-white border-indigo-600'
//                                             : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
//                                         }`}
//                                         onClick={() => handleSlotSelect(slot)}
//                                       >
//                                         <div className="flex items-center justify-center">
//                                           <Clock className="h-4 w-4 mr-1" />
//                                           <span className="text-sm">
//                                             {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
//                                           </span>
//                                         </div>
//                                       </button>
//                                     ))}
//                                   </div>
//                                 </div>
//                               ))}
                              
//                               {selectedSlot && (
//                                 <div className="mt-6 text-center">
//                                   <button
//                                     className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
//                                     onClick={handleBookAppointment}
//                                   >
//                                     Book Appointment
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Right column - User appointments */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
//               <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Your Appointments</h2>
              
//               {userAppointments.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-600">You don't have any appointments scheduled.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {userAppointments.map((appointment) => (
//                     <div 
//                       key={appointment.appointment_id}
//                       className={`border rounded-lg p-4 ${
//                         appointment.status === 'scheduled' 
//                           ? 'border-indigo-200 bg-indigo-50/50' 
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-indigo-900">
//                           {appointment.therapist_name}
//                         </h3>
//                         <span 
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                             ${appointment.status === 'scheduled' 
//                               ? 'bg-green-100 text-green-800' 
//                               : appointment.status === 'completed'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}
//                         >
//                           {appointment.status}
//                         </span>
//                       </div>
                      
//                       <div className="mt-2 space-y-1 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           {formatDate(appointment.date)}
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 mr-2" />
//                           {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
//                         </div>
//                       </div>
                      
//                       {appointment.status === 'scheduled' && (
//                         <div className="mt-4">
//                           <button
//                             className="w-full px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-md text-sm"
//                             onClick={() => handleCancelAppointment(appointment.appointment_id)}
//                           >
//                             Cancel Appointment
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
                
//               )}
              
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h3 className="font-medium text-indigo-900 mb-2">Need Help?</h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   If you need assistance with appointment scheduling or have questions about our therapists, please contact our support team.
//                 </p>
//                 <Link
//                   to="/contact"
//                   className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
//                 >
//                   Contact Support
//                   <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default TherapistAppointments;


// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Calendar, Clock, Search, Filter, UserCheck, X } from 'lucide-react';
// import axios from 'axios'; // Make sure to install axios: npm install axios

// const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual API base URL

// const TherapistAppointments = () => {
//   const [therapists, setTherapists] = useState([]);
//   const [selectedTherapist, setSelectedTherapist] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [specializations, setSpecializations] = useState([]);
//   const [filteredSpecialization, setFilteredSpecialization] = useState('');
//   const [filteredLanguage, setFilteredLanguage] = useState('');
//   const [userAppointments, setUserAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [bookingError, setBookingError] = useState(null);
//   const navigate = useNavigate();
  
//   // For demo purposes - in a real app, get this from authentication context
//   const userId = "user123";
  
//   useEffect(() => {
//     // Fetch therapists on component mount
//     fetchTherapists();
//     fetchSpecializations();
//     fetchUserAppointments();
//   }, []);
  
//   // Re-fetch therapists when filters change
//   useEffect(() => {
//     fetchTherapists();
//   }, [filteredSpecialization, filteredLanguage]);
  
//   const fetchTherapists = async () => {
//     setIsLoading(true);
//     try {
//       let url = `${API_BASE_URL}/therapists/`;
      
//       // Add query parameters for filtering
//       const params = new URLSearchParams();
//       if (filteredSpecialization) {
//         params.append('specialization', filteredSpecialization);
//       }
//       if (filteredLanguage) {
//         params.append('language', filteredLanguage);
//       }
      
//       // Append params to URL if they exist
//       const queryString = params.toString();
//       if (queryString) {
//         url += `?${queryString}`;
//       }
      
//       const response = await axios.get(url);
//       setTherapists(response.data);
//     } catch (error) {
//       console.error("Error fetching therapists:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
// //   const fetchSpecializations = async () => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/therapists/specializations`);
// //       setSpecializations(response.data.specializations);
// //     } catch (error) {
// //       console.error("Error fetching specializations:", error);
// //     }
// //   };

// // Update in TherapistAppointments.jsx
//     const fetchSpecializations = async () => {
//         try {
//         const response = await axios.get(`${API_BASE_URL}/therapists/specializations`);
//         // Make sure we're accessing the correct property from the response
//         if (response.data && response.data.specializations) {
//             setSpecializations(response.data.specializations);
//         } else {
//             console.error("Unexpected specializations response format:", response.data);
//             setSpecializations([]);
//         }
//         } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setSpecializations([]);
//         }
//     };
  
//   const fetchUserAppointments = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/therapists/appointments/user/${userId}`);
//       setUserAppointments(response.data);
//     } catch (error) {
//       console.error("Error fetching user appointments:", error);
//     }
//   };
  
//   const handleTherapistSelect = async (therapist) => {
//     try {
//       setSelectedTherapist(therapist);
//       setSelectedSlot(null); // Reset selected slot when selecting a new therapist
      
//       const response = await axios.get(`${API_BASE_URL}/therapists/${therapist._id}`);
//       const therapistWithAvailability = response.data;
      
//       // Sort slots by date/time
//       const sortedSlots = therapistWithAvailability.available_slots.sort((a, b) => 
//         new Date(a.start_time) - new Date(b.start_time)
//       );
      
//       setAvailableSlots(sortedSlots);
//     } catch (error) {
//       console.error("Error fetching therapist details:", error);
//     }
//   };
  
//   const handleSlotSelect = (slot) => {
//     setSelectedSlot(slot);
//     // Clear any previous booking errors
//     setBookingError(null);
//   };
  
// //   const handleBookAppointment = async () => {
// //     if (!selectedTherapist || !selectedSlot) return;
    
// //     try {
// //       setBookingError(null);
      
// //       const appointmentData = {
// //         user_id: userId,
// //         therapist_id: selectedTherapist._id,
// //         date: new Date(selectedSlot.start_time),
// //         start_time: new Date(selectedSlot.start_time),
// //         end_time: new Date(selectedSlot.end_time),
// //         notes: "" // Could add a notes field in the UI for this
// //       };
      
// //       // Book the appointment
// //       await axios.post(`${API_BASE_URL}/therapists/appointments`, appointmentData);
      
// //       // Show success message
// //       setBookingSuccess(true);
      
// //       // Refresh user appointments and reset selection
// //       fetchUserAppointments();
// //       // Clear the selected therapist after a short delay to allow the user to see the success message
// //       setTimeout(() => {
// //         fetchTherapists(); // Refresh therapist list to update availability
// //         setSelectedTherapist(null);
// //         setSelectedSlot(null);
// //         setBookingSuccess(false);
// //       }, 3000);
// //     } catch (error) {
// //       console.error("Error booking appointment:", error);
// //       setBookingError(error.response?.data?.detail || "Failed to book appointment. Please try again.");
// //     }
// //   };

//     // Update in TherapistAppointments.jsx
// // Update in TherapistAppointments.jsx
// const handleBookAppointment = async () => {
//     if (!selectedTherapist || !selectedSlot) return;
    
//     try {
//       setBookingError(null);
      
//       // Format the date strings properly for the API
//       const startTime = new Date(selectedSlot.start_time);
//       const endTime = new Date(selectedSlot.end_time);
      
//       const appointmentData = {
//         user_id: userId,
//         therapist_id: selectedTherapist._id,
//         date: startTime.toISOString(), // Use ISO string format
//         start_time: startTime.toISOString(),
//         end_time: endTime.toISOString(),
//         notes: ""
//       };
      
//       // Book the appointment
//       const response = await axios.post(`${API_BASE_URL}/therapists/appointments`, appointmentData);
//       console.log("Appointment booking response:", response.data);
      
//       // Show success message
//       setBookingSuccess(true);
      
//       // Rest of the function remains the same...
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       setBookingError(error.response?.data?.detail || "Failed to book appointment. Please try again.");
//     }
//   };
  
//   const handleCancelAppointment = async (appointmentId) => {
//     try {
//       // Cancel the appointment
//       await axios.delete(`${API_BASE_URL}/therapists/appointments/${appointmentId}`);
      
//       // Refresh the appointments list
//       fetchUserAppointments();
//       // Refresh therapist list to update availability
//       fetchTherapists();
//     } catch (error) {
//       console.error("Error cancelling appointment:", error);
//     }
//   };
  
//   // Format time in a user-friendly way (e.g., "10:00 AM")
//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };
  
//   // Format date in a user-friendly way (e.g., "Monday, April 24")
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
//   };
  
//   // Group available slots by date for better organization
//   const groupedSlots = () => {
//     const groups = {};
    
//     availableSlots.forEach(slot => {
//       const date = new Date(slot.start_time);
//       const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
//       if (!groups[dateKey]) {
//         groups[dateKey] = {
//           dateDisplay: formatDate(date),
//           slots: []
//         };
//       }
      
//       groups[dateKey].slots.push(slot);
//     });
    
//     return groups;
//   };
  
//   return (
//     <div className="w-full bg-gradient-to-b from-white to-indigo-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">Find Your Mental Health Partner</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Connect with professional therapists and schedule sessions to support your mental wellness journey.
//           </p>
//         </div>
        
//         {/* Success message */}
//         {bookingSuccess && (
//           <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <div className="flex-shrink-0 text-green-500">
//               <UserCheck className="h-5 w-5" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-green-800">
//                 Your appointment has been successfully booked!
//               </p>
//             </div>
//             <div className="ml-auto pl-3">
//               <button
//                 className="inline-flex text-gray-400 hover:text-gray-500"
//                 onClick={() => setBookingSuccess(false)}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Error message */}
//         {bookingError && (
//           <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <div className="flex-shrink-0 text-red-500">
//               <X className="h-5 w-5" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-red-800">
//                 {bookingError}
//               </p>
//             </div>
//             <div className="ml-auto pl-3">
//               <button
//                 className="inline-flex text-gray-400 hover:text-gray-500"
//                 onClick={() => setBookingError(null)}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Main content */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left column - Therapist search and list */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//               <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Find a Therapist</h2>
              
//               {/* Search and filters */}
//               <div className="mb-6">
//                 <div className="flex flex-wrap gap-4">
//                   <div className="w-full md:w-auto flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Specialization
//                     </label>
//                     <div className="relative">
//                       <select
//                         className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                         value={filteredSpecialization}
//                         onChange={(e) => setFilteredSpecialization(e.target.value)}
//                       >
//                         <option value="">All Specializations</option>
//                         {specializations.map((spec) => (
//                           <option key={spec} value={spec}>{spec}</option>
//                         ))}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <Filter className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="w-full md:w-auto flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Language
//                     </label>
//                     <div className="relative">
//                       <select
//                         className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                         value={filteredLanguage}
//                         onChange={(e) => setFilteredLanguage(e.target.value)}
//                       >
//                         <option value="">All Languages</option>
//                         <option value="English">English</option>
//                         <option value="Spanish">Spanish</option>
//                         <option value="Mandarin">Mandarin</option>
//                         <option value="Hindi">Hindi</option>
//                         <option value="Gujarati">Gujarati</option>
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <Filter className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Therapists list */}
//               <div className="space-y-6">
//                 {isLoading ? (
//                   <div className="text-center py-8">
//                     <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
//                     <p className="mt-2 text-gray-600">Loading therapists...</p>
//                   </div>
//                 ) : therapists.length === 0 ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-600">No therapists found matching your criteria.</p>
//                   </div>
//                 ) : (
//                   therapists.map((therapist) => (
//                     <div 
//                       key={therapist._id}
//                       className={`border rounded-lg overflow-hidden transition-all ${
//                         selectedTherapist?._id === therapist._id
//                           ? 'border-indigo-500 bg-indigo-50 shadow-md'
//                           : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
//                       }`}
//                     >
//                       <div className="p-6">
//                         <div className="flex flex-col md:flex-row gap-6">
//                           <div className="md:w-1/4 flex-shrink-0">
//                             <img 
//                               src={therapist.photo_url || "/api/placeholder/150/150"} 
//                               alt={therapist.name}
//                               className="w-full rounded-lg object-cover aspect-square"
//                             />
//                           </div>
//                           <div className="md:w-3/4">
//                             <h3 className="text-xl font-semibold text-indigo-900 mb-2">{therapist.name}</h3>
                            
//                             <div className="mb-2 flex flex-wrap gap-2">
//                               {therapist.specializations.map((spec, idx) => (
//                                 <span 
//                                   key={idx} 
//                                   className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                                 >
//                                   {spec}
//                                 </span>
//                               ))}
//                             </div>
                            
//                             <p className="text-sm text-gray-600 mb-3">
//                               <span className="font-medium">Experience:</span> {therapist.experience_years} years
//                             </p>
                            
//                             <p className="text-sm text-gray-600 mb-3">
//                               <span className="font-medium">Education:</span> {therapist.education}
//                             </p>
                            
//                             <p className="text-sm text-gray-600 mb-4">
//                               <span className="font-medium">Languages:</span> {therapist.languages.join(", ")}
//                             </p>
                            
//                             <div className="flex items-center justify-between">
//                               <p className="text-lg font-bold text-indigo-600">${therapist.hourly_rate}/hour</p>
//                               <button
//                                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
//                                 onClick={() => handleTherapistSelect(therapist)}
//                               >
//                                 View Availability
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {selectedTherapist?._id === therapist._id && (
//                         <div className="border-t border-indigo-200 bg-indigo-50 p-6">
//                           <h4 className="text-lg font-medium text-indigo-900 mb-4">
//                             Available Appointments
//                           </h4>
                          
//                           {availableSlots.length === 0 ? (
//                             <p className="text-gray-600 text-center py-4">
//                               No available appointments found for this therapist.
//                             </p>
//                           ) : (
//                             <div>
//                               {/* Group slots by date */}
//                               {Object.entries(groupedSlots()).map(([dateKey, group]) => (
//                                 <div key={dateKey} className="mb-6">
//                                   <h5 className="font-medium text-indigo-800 mb-2">{group.dateDisplay}</h5>
//                                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                                     {group.slots.map((slot, idx) => (
//                                       <button
//                                         key={idx}
//                                         className={`p-3 border rounded-md text-center transition-colors ${
//                                           selectedSlot && 
//                                           selectedSlot.start_time === slot.start_time && 
//                                           selectedSlot.end_time === slot.end_time
//                                             ? 'bg-indigo-600 text-white border-indigo-600'
//                                             : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
//                                         }`}
//                                         onClick={() => handleSlotSelect(slot)}
//                                       >
//                                         <div className="flex items-center justify-center">
//                                           <Clock className="h-4 w-4 mr-1" />
//                                           <span className="text-sm">
//                                             {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
//                                           </span>
//                                         </div>
//                                       </button>
//                                     ))}
//                                   </div>
//                                 </div>
//                               ))}
                              
//                               {selectedSlot && (
//                                 <div className="mt-6 text-center">
//                                   <button
//                                     className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
//                                     onClick={handleBookAppointment}
//                                   >
//                                     Book Appointment
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Right column - User appointments */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
//               <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Your Appointments</h2>
              
//               {userAppointments.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-600">You don't have any appointments scheduled.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {userAppointments.map((appointment) => (
//                     <div 
//                       key={appointment.appointment_id}
//                       className={`border rounded-lg p-4 ${
//                         appointment.status === 'scheduled' 
//                           ? 'border-indigo-200 bg-indigo-50/50' 
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-indigo-900">
//                           {appointment.therapist_name}
//                         </h3>
//                         <span 
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                             ${appointment.status === 'scheduled' 
//                               ? 'bg-green-100 text-green-800' 
//                               : appointment.status === 'completed'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}
//                         >
//                           {appointment.status}
//                         </span>
//                       </div>
                      
//                       <div className="mt-2 space-y-1 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           {formatDate(appointment.date)}
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 mr-2" />
//                           {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
//                         </div>
//                       </div>
                      
//                       {appointment.status === 'scheduled' && (
//                         <div className="mt-4">
//                           <button
//                             className="w-full px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-md text-sm"
//                             onClick={() => handleCancelAppointment(appointment.appointment_id)}
//                           >
//                             Cancel Appointment
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
              
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h3 className="font-medium text-indigo-900 mb-2">Need Help?</h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   If you need assistance with appointment scheduling or have questions about our therapists, please contact our support team.
//                 </p>
//                 <Link
//                   to="/contact"
//                   className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
//                 >
//                   Contact Support
//                   <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TherapistAppointments;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  X, 
  Star, 
  Users, 
  Video, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Globe,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const TherapistAppointments = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [filteredSpecialization, setFilteredSpecialization] = useState('');
  const [filteredLanguage, setFilteredLanguage] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [sessionType, setSessionType] = useState('video');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [appointmentView, setAppointmentView] = useState('upcoming');

  const navigate = useNavigate();
  const userId = "user123";

  useEffect(() => {
    fetchTherapists();
    fetchSpecializations();
    fetchUserAppointments();
  }, [appointmentView]);

  useEffect(() => {
    fetchTherapists();
  }, [filteredSpecialization, filteredLanguage, minRating, maxRate, sortBy]);

  const fetchTherapists = async () => {
    setIsLoading(true);
    try {
      let url = `${API_BASE_URL}/therapists/`;
      const params = new URLSearchParams();
      
      if (filteredSpecialization) params.append('specialization', filteredSpecialization);
      if (filteredLanguage) params.append('language', filteredLanguage);
      if (minRating) params.append('min_rating', minRating);
      if (maxRate) params.append('max_rate', maxRate);
      if (sortBy) params.append('sort_by', sortBy);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await axios.get(url);
      setTherapists(response.data);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setBookingError("Failed to fetch therapists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/therapists/specializations`);
      setSpecializations(response.data.specializations || []);
    } catch (error) {
      console.error("Error fetching specializations:", error);
      setSpecializations([]);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      let url = `${API_BASE_URL}/therapists/appointments/user/${userId}`;
      const params = new URLSearchParams();
      
      if (appointmentView === 'upcoming') {
        params.append('upcoming_only', 'true');
      } else if (appointmentView === 'past') {
        params.append('status', 'completed');
      }
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await axios.get(url);
      setUserAppointments(response.data);
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      setUserAppointments([]);
    }
  };

  const handleTherapistSelect = async (therapist) => {
    try {
      setSelectedTherapist(therapist);
      setSelectedSlot(null);
      
      const response = await axios.get(`${API_BASE_URL}/therapists/${therapist._id}`);
      const therapistWithAvailability = response.data;
      
      // Filter out booked slots and ensure dates are in UTC
      const unbookedSlots = therapistWithAvailability.available_slots.filter(slot => !slot.is_booked);
      
      const sortedSlots = unbookedSlots.sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      
      setAvailableSlots(sortedSlots);
    } catch (error) {
      console.error("Error fetching therapist details:", error);
      setAvailableSlots([]);
      setBookingError("Failed to fetch therapist availability.");
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedTherapist || !selectedSlot) {
      setBookingError("Please select a therapist and time slot");
      return;
    }
  
    try {
      setBookingError(null);
      setIsLoading(true);
      
      // Normalize dates to UTC and remove microseconds
      const startTime = new Date(selectedSlot.start_time);
      startTime.setMilliseconds(0);
      const endTime = new Date(selectedSlot.end_time);
      endTime.setMilliseconds(0);
      const date = new Date(startTime);
      date.setHours(0, 0, 0, 0);
      
      const appointmentData = {
        user_id: userId,
        therapist_id: selectedTherapist._id,
        date: date.toISOString(),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        session_type: sessionType,
        notes: ""
      };
      
      await axios.post(`${API_BASE_URL}/therapists/appointments`, appointmentData);
      
      setBookingSuccess(true);
      await Promise.all([fetchUserAppointments(), fetchTherapists()]);
      
      setTimeout(() => {
        setSelectedTherapist(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingError(error.response?.data?.detail || "Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/therapists/appointments/${appointmentId}`);
      await Promise.all([fetchUserAppointments(), fetchTherapists()]);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setBookingError("Failed to cancel appointment. Please try again.");
    }
  };

  const clearFilters = () => {
    setFilteredSpecialization('');
    setFilteredLanguage('');
    setMinRating('');
    setMaxRate('');
    setSortBy('rating');
    setSearchTerm('');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const groupedSlots = () => {
    const groups = {};
    availableSlots.forEach(slot => {
      const date = new Date(slot.start_time);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateDisplay: formatDate(slot.start_time),
          slots: []
        };
      }
      
      groups[dateKey].slots.push(slot);
    });
    
    return groups;
  };

  const filteredTherapists = therapists.filter(therapist =>
    therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.specializations.some(spec => 
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredAppointments = userAppointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(appointment.start_time);
    
    switch (appointmentView) {
      case 'upcoming':
        return appointmentDate > now && appointment.status === 'scheduled';
      case 'past':
        return appointmentDate < now || appointment.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Mental Health Partner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with professional, licensed therapists and schedule personalized sessions to support your mental wellness journey.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Licensed Professionals
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Secure Sessions
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Flexible Scheduling
            </div>
          </div>
        </div>
        
        {bookingSuccess && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-green-800">Appointment Confirmed!</h3>
                <p className="text-green-700">Your session has been successfully scheduled. Check your appointments panel for details.</p>
              </div>
              <button
                className="ml-4 text-green-400 hover:text-green-600 transition-colors"
                onClick={() => setBookingSuccess(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        
        {bookingError && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-red-800">Booking Failed</h3>
                <p className="text-red-700">{bookingError}</p>
              </div>
              <button
                className="ml-4 text-red-400 hover:text-red-600 transition-colors"
                onClick={() => setBookingError(null)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="xl:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">Find Your Perfect Therapist</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      showFilters 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'border-gray-200 text-gray-600 hover:border-indigo-200'
                    }`}
                  >
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 transition-all"
                  >
                    <RefreshCw className="h-4 w-4 mr-2 inline" />
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {showFilters && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={filteredSpecialization}
                        onChange={(e) => setFilteredSpecialization(e.target.value)}
                      >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={filteredLanguage}
                        onChange={(e) => setFilteredLanguage(e.target.value)}
                      >
                        <option value="">All Languages</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Korean">Korean</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                      >
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                      >
                        <option value="">Any Rate</option>
                        <option value="100">Under $100</option>
                        <option value="120">Under $120</option>
                        <option value="140">Under $140</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="rate">Lowest Price</option>
                        <option value="experience">Most Experienced</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <span>
                  {isLoading ? 'Loading...' : `${filteredTherapists.length} therapist${filteredTherapists.length !== 1 ? 's' : ''} found`}
                </span>
                {searchTerm && (
                  <span>Searching for "{searchTerm}"</span>
                )}
              </div>
              
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid b
```order-indigo-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 text-lg">Finding the perfect therapists for you...</p>
                  </div>
                ) : filteredTherapists.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">No therapists found matching your criteria.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredTherapists.map((therapist) => (
                    <div 
                      key={therapist._id}
                      className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                        selectedTherapist?._id === therapist._id
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-1/4 flex-shrink-0">
                            <div className="relative">
                              <img 
                                src={therapist.photo_url || "/api/placeholder/200/200"} 
                                alt={therapist.name}
                                className="w-full rounded-xl object-cover aspect-square shadow-md"
                              />
                              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                <div className="flex items-center">
                                  {renderStars(therapist.rating)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:w-3/4">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{therapist.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span className="font-medium">{therapist.rating}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{therapist.total_sessions}+ sessions</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Award className="h-4 w-4 mr-1" />
                                    <span>{therapist.experience_years} years exp.</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold text-indigo-600">${therapist.hourly_rate}</div>
                                <div className="text-sm text-gray-500">per session</div>
                              </div>
                            </div>
                            
                            <div className="mb-4 flex flex-wrap gap-2">
                              {therapist.specializations.map((spec, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                <span className="font-medium">Education:</span>
                                <span className="ml-1 truncate">{therapist.education}</span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                                <span className="font-medium">Languages:</span>
                                <span className="ml-1">{therapist.languages.join(", ")}</span>
                              </div>
                              
                              {therapist.license_number && (
                                <div className="flex items-center text-gray-600">
                                  <Award className="h-4 w-4 mr-2 text-indigo-500" />
                                  <span className="font-medium">License:</span>
                                  <span className="ml-1">{therapist.license_number}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">{therapist.bio}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Available sessions:</span>
                                <div className="flex gap-1">
                                  <Video className="h-4 w-4 text-green-500" title="Video calls available" />
                                  <Phone className="h-4 w-4 text-blue-500" title="Phone calls available" />
                                  <MapPin className="h-4 w-4 text-purple-500" title="In-person available" />
                                </div>
                              </div>
                              <button
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                onClick={() => handleTherapistSelect(therapist)}
                              >
                                View Availability
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedTherapist?._id === therapist._id && (
                        <div className="border-t-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-2xl font-bold text-indigo-900">
                              Available Appointments
                            </h4>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-indigo-700">Session Type:</label>
                              <select
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value)}
                                className="px-3 py-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              >
                                <option value="video">🎥 Video Call</option>
                                <option value="phone">📞 Phone Call</option>
                                <option value="in-person">📍 In-Person</option>
                              </select>
                            </div>
                          </div>
                          
                          {availableSlots.length === 0 ? (
                            <div className="text-center py-8">
                              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 text-lg">No available appointments found for this therapist.</p>
                              <p className="text-gray-500 text-sm mt-2">Please check back later or contact support.</p>
                            </div>
                          ) : (
                            <div>
                              {Object.entries(groupedSlots()).map(([dateKey, group]) => (
                                <div key={dateKey} className="mb-8">
                                  <h5 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    {group.dateDisplay}
                                  </h5>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {group.slots.map((slot, idx) => (
                                      <button
                                        key={idx}
                                        className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                                          selectedSlot && 
                                          selectedSlot.start_time === slot.start_time && 
                                          selectedSlot.end_time === slot.end_time
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:shadow-md hover:bg-indigo-50'
                                        }`}
                                        onClick={() => handleSlotSelect(slot)}
                                      >
                                        <div className="flex items-center justify-center mb-1">
                                          <Clock className="h-4 w-4 mr-2" />
                                          <span className="text-sm font-medium">
                                            {formatTime(slot.start_time)}
                                          </span>
                                        </div>
                                        <div className="text-xs opacity-75">
                                          1 hour session
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              
                              {selectedSlot && (
                                <div className="mt-8 text-center">
                                  <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                                    <h6 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h6>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div className="flex items-center justify-center">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{formatDate(selectedSlot.start_time)}</span>
                                      </div>
                                      <div className="flex items-center justify-center">
                                        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}</span>
                                      </div>
                                      <div className="flex items-center justify-center">
                                        {getSessionTypeIcon(sessionType)}
                                        <span className="ml-2 capitalize">{sessionType} Session</span>
                                      </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                      <span className="text-2xl font-bold text-indigo-600">${therapist.hourly_rate}</span>
                                      <span className="text-gray-500 ml-1">total cost</span>
                                    </div>
                                  </div>
                                  
                                  <button
                                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    onClick={handleBookAppointment}
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="h-5 w-5 mr-2 inline" />
                                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="xl:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-4 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['upcoming', 'all', 'past'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setAppointmentView(view)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        appointmentView === view
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">
                    {appointmentView === 'upcoming' ? 'No upcoming appointments' : 'No appointments found'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {appointmentView === 'upcoming' ? 'Book your first session above!' : 'Your appointment history will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredAppointments.map((appointment) => (
                    <div 
                      key={appointment.appointment_id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        appointment.status === 'scheduled' 
                          ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md' 
                          : appointment.status === 'completed'
                            ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {appointment.therapist_name}
                          </h3>
                          <span 
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status === 'scheduled' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {appointment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {appointment.status === 'cancelled' && <X className="h-3 w-3 mr-1" />}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">
                            ${appointment.cost || '120'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatShortDate(appointment.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                          <span className="font-medium">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-3 text-indigo-500" />
                          <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          {getSessionTypeIcon(appointment.session_type)}
                          <span className="ml-3 capitalize">{appointment.session_type || 'video'} Session</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 mr-3 text-indigo-500 mt-0.5" />
                            <span className="italic">{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                              onClick={() => handleCancelAppointment(appointment.appointment_id)}
                            >
                              <X className="h-4 w-4 mr-1 inline" />
                              Cancel
                            </button>
                            <button
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                              onClick={() => {
                                alert('Reschedule functionality would be implemented here');
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-1 inline" />
                              Reschedule
                            </button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <button
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                            onClick={() => {
                              alert('Review functionality would be implemented here');
                            }}
                          >
                            <Star className="h-4 w-4 mr-1 inline" />
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Your Journey</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600">
                      {userAppointments.filter(a => a.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {userAppointments.filter(a => a.status === 'scheduled').length}
                    </div>
                    <div className="text-sm text-gray-600">Upcoming Sessions</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Our support team is here to help with appointment scheduling, technical issues, or questions about our therapists.
                </p>
                <div className="space-y-2">
                  <Link
                    to="/contact"
                    className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-medium rounded-lg transition-all duration-300 text-sm border border-indigo-200"
                  >
                    <span>Contact Support</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    to="/faq"
                    className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 font-medium rounded-lg transition-all duration-300 text-sm border border-green-200"
                  >
                    <span>View FAQ</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-1">Crisis Support</h4>
                    <p className="text-xs text-red-700 leading-relaxed">
                      If you're experiencing a mental health emergency, please contact your local emergency services or call the crisis hotline: 988
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of people who have found support and healing through our platform. Your mental health matters, and we're here to help you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Learn More About Us
            </Link>
            <Link
              to="/resources"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Mental Health Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistAppointments;