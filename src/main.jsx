import React, { createContext, useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { api, getToken } from './api'
import App from './App'
import './styles.css'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return
    api.me().then(setUser).catch(() => localStorage.removeItem('zenheaven_token')).finally(() => setLoading(false))
  }, [])

  const signIn = (payload) => {
    localStorage.setItem('zenheaven_token', payload.access_token)
    setUser(payload.user)
  }
  const signOut = () => {
    localStorage.removeItem('zenheaven_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><span className="loader-orb" />Restoring your safe space…</div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<App.AuthPage mode="login" />} />
      <Route path="/register" element={<App.AuthPage mode="register" />} />
      <Route path="/" element={<App.LandingPage />} />
      <Route path="*" element={<ProtectedRoute><App.Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<App.Dashboard />} />
        <Route path="chat" element={<App.Chat />} />
        <Route path="journal" element={<App.Journal />} />
        <Route path="books" element={<App.Books />} />
        <Route path="music" element={<App.Music />} />
        <Route path="therapists" element={<App.Therapists />} />
        <Route path="coins" element={<App.Coins />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
