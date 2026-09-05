import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, setToken, clearToken, getToken, getStoredUser, setStoredUser } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getToken()) { setUser(null); setLoading(false); return null; }
    try {
      const profile = await authApi.me();
      setUser(profile);
      setStoredUser(profile);
      return profile;
    } catch {
      clearToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setToken(data.access_token);
    setUser(data.user);
    setStoredUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setToken(data.access_token);
    setUser(data.user);
    setStoredUser(data.user);
    return data;
  };

  const logout = () => { clearToken(); setUser(null); };

  const updateCalmCoins = (amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, calm_coins: amount };
      setStoredUser(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user && !!getToken(), login, register, logout, refreshUser, updateCalmCoins }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
