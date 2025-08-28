import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calmCoins, setCalmCoins] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
          
          // Fetch calm coins
          const coins = await authService.getCalmCoins();
          setCalmCoins(coins);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      setCalmCoins(data.user.calm_coins || 0);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      setCalmCoins(data.user.calm_coins || 0);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCalmCoins(0);
  };

  const updateCalmCoins = async () => {
    try {
      const coins = await authService.getCalmCoins();
      setCalmCoins(coins);
    } catch (error) {
      console.error('Failed to update calm coins:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    calmCoins,
    login,
    register,
    logout,
    updateCalmCoins,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
