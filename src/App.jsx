import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Journal from './pages/Journal';
import Books from './pages/Books';
import Music from './pages/Music';
import Therapists from './pages/Therapists';
import Coins from './pages/Coins';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Chat />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
            <Route path="/therapists" element={<ProtectedRoute><Therapists /></ProtectedRoute>} />
            <Route path="/coins" element={<ProtectedRoute><Coins /></ProtectedRoute>} />
            <Route
              path="*"
              element={
                <div className="editorial-container py-24 text-center">
                  <h1 className="font-display text-3xl text-editorial-ink mb-2">Page not found</h1>
                  <p className="font-serif text-charcoal-light">The page you&apos;re looking for doesn&apos;t exist.</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
