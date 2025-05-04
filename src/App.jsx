import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import MusicRecommend from './pages/MusicRecommend';
import Layout from './components/Layout';
import './App.css';
import MentalHealthChat from './pages/MentalHealthChat';
import JournalPage from './pages/Journal';
import TherapistAppointments from './pages/TherapistAppointments';
import BookRecommender from './pages/BookRecommender';
import CoinsPage from './pages/CoinsPage';
// import BookRecommenderDemo from './pages/BookRecommenderDemo';

import BookRecommend from './pages/BookRecommend';
import BooksPage from './pages/BookPage';
// import JournalPage from './pages/JournalPage';

function App() {
  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path='/therapists' element={<TherapistAppointments/>}/>
          <Route path="/musicrecommend" element={<MusicRecommend />} />
          <Route path="/chat" element={<MentalHealthChat/>}/>
          <Route path='/journal' element={<JournalPage/>}/>
          {/* <Route path='/books' element={<MoodBasedBookRecommender/>}/> */}
          <Route path="/books" element={<BooksPage/>} />
          {/* <Route path="/books/details/:bookId" element={<BookDetails />} /> */}
          <Route path="/coins" element={<CoinsPage />} />
          {/* <Route path='/journal' element={<JournalPage/>}/> */}
          {/* Future routes will be added here */}
          <Route path="*" element={<div className="h-screen flex items-center justify-center">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;