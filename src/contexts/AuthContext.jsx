import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, clearToken, coinsApi, getToken, setToken } from '../lib/api';

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

  const refreshCoins = useCallback(async () => {
    try {
      const data = await coinsApi.getBalance();
      setCalmCoins(data.balance ?? 0);
      return data.balance ?? 0;
    } catch {
      return 0;
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      try {
        if (getToken()) {
          const profile = await authApi.me();
          setUser(profile);
          setIsAuthenticated(true);
          setCalmCoins(profile.calm_coins ?? 0);
          await refreshCoins();
        }
      } catch {
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
        setCalmCoins(0);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [refreshCoins]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);
    setCalmCoins(data.user.calm_coins ?? 0);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);
    setCalmCoins(data.user.calm_coins ?? 0);
    return data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setCalmCoins(0);
  };

  const updateCalmCoins = refreshCoins;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        calmCoins,
        login,
        register,
        logout,
        updateCalmCoins,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
