import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zenheaven_user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('zenheaven_token')))

  useEffect(() => {
    if (!localStorage.getItem('zenheaven_token')) {
      setLoading(false)
      return
    }
    api.me()
      .then((profile) => {
        setUser(profile)
        localStorage.setItem('zenheaven_user', JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem('zenheaven_token')
        localStorage.removeItem('zenheaven_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const authenticate = async (mode, payload) => {
    const response = await api[mode](payload)
    localStorage.setItem('zenheaven_token', response.access_token)
    localStorage.setItem('zenheaven_user', JSON.stringify(response.user))
    setUser(response.user)
    return response
  }

  const logout = () => {
    localStorage.removeItem('zenheaven_token')
    localStorage.removeItem('zenheaven_user')
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user && localStorage.getItem('zenheaven_token')),
    login: (payload) => authenticate('login', payload),
    register: (payload) => authenticate('register', payload),
    logout,
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
