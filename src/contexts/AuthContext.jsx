import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calmCoins, setCalmCoins] = useState(0);

  useEffect(() => {
    async function initAuth() {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
          setCalmCoins(await authService.getCalmCoins());
        }
      } catch {
        authService.logout();
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    setCalmCoins(data.user.calm_coins ?? 0);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    setCalmCoins(data.user.calm_coins ?? 0);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCalmCoins(0);
  };

  const updateCalmCoins = async () => {
    const coins = await authService.getCalmCoins();
    setCalmCoins(coins);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, calmCoins, login, register, logout, updateCalmCoins }}
    >
      {children}
    </AuthContext.Provider>
  );
}
