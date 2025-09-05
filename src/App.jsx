import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import MusicRecommend from './pages/MusicRecommend';
import Layout from './components/Layout';
import './App.css';
import MentalHealthChat from './pages/MentalHealthChatThreaded';
import JournalPage from './pages/Journal';
import TherapistAppointments from './pages/TherapistAppointments';
import BookRecommender from './pages/BookRecommender';
import CoinsPage from './pages/CoinsPage';
import BookRecommend from './pages/BookRecommend';
import BooksPage from './pages/BookPage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path='/therapists' element={
              <ProtectedRoute>
                <TherapistAppointments/>
              </ProtectedRoute>
            }/>
            <Route path="/musicrecommend" element={
              <ProtectedRoute>
                <MusicRecommend />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MentalHealthChat/>
                </ErrorBoundary>
              </ProtectedRoute>
            }/>
            <Route path='/journal' element={
              <ProtectedRoute>
                <JournalPage/>
              </ProtectedRoute>
            }/>
            <Route path="/books" element={
              <ProtectedRoute>
                <BooksPage/>
              </ProtectedRoute>
            } />
            <Route path="/coins" element={
              <ProtectedRoute>
                <CoinsPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<div className="h-screen flex items-center justify-center">Page not found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;