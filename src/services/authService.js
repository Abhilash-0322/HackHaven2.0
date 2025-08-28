// Authentication service for handling API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token;
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get profile');
      }

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getCalmCoins() {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/balance`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get calm coins');
      }

      const data = await response.json();
      return data.balance;
    } catch (error) {
      console.error('Error fetching calm coins:', error);
      return 0;
    }
  }

  // Utility method to make authenticated requests
  async authenticatedFetch(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export default new AuthService();
