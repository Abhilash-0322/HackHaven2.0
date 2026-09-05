import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/chat" element={<Protected><Chat /></Protected>} />
            <Route path="/journal" element={<Protected><Journal /></Protected>} />
            <Route path="/books" element={<Protected><Books /></Protected>} />
            <Route path="/music" element={<Protected><Music /></Protected>} />
            <Route path="/therapists" element={<Protected><Therapists /></Protected>} />
            <Route path="/coins" element={<Protected><Coins /></Protected>} />
            <Route path="/musicrecommend" element={<Navigate to="/music" replace />} />
            <Route path="*" element={
              <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
                Page not found
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
