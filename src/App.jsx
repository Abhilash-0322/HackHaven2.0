import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './lib/AuthContext'
import AuthPage from './pages/Auth'
import Books from './pages/Books'
import Chat from './pages/Chat'
import Coins from './pages/Coins'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Music from './pages/Music'
import Therapists from './pages/Therapists'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ink text-slate-500">Opening your sanctuary…</div>
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
}

function AuthRedirect() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-ink" />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
}

export default function App() {
  return <Routes><Route path="/login" element={<AuthRedirect />} /><Route path="/register" element={<AuthRedirect />} /><Route element={<ProtectedRoute />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<Coins />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}
