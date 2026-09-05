import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/ui/Spinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Journal from './pages/Journal';
import Books from './pages/Books';
import Music from './pages/Music';
import Therapists from './pages/Therapists';
import Coins from './pages/Coins';

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner label="Loading..." />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/books" element={<Books />} />
              <Route path="/music" element={<Music />} />
              <Route path="/therapists" element={<Therapists />} />
              <Route path="/coins" element={<Coins />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
