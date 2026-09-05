import { API_BASE_URL, authHeaders, parseJsonResponse } from '../lib/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: authHeaders(null),
      body: JSON.stringify(userData),
    });
    const data = await parseJsonResponse(response);
    this.setToken(data.access_token);
    this.setUser(data.user);
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(null),
      body: JSON.stringify(credentials),
    });
    const data = await parseJsonResponse(response);
    this.setToken(data.access_token);
    this.setUser(data.user);
    return data;
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
    return Boolean(this.token);
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(this.token),
    });
    const user = await parseJsonResponse(response);
    this.setUser(user);
    return user;
  }

  async getCalmCoins() {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/balance`, {
        headers: authHeaders(this.token),
      });
      const data = await parseJsonResponse(response);
      return data.balance ?? 0;
    } catch {
      return 0;
    }
  }

  async authenticatedFetch(url, options = {}) {
    const headers = authHeaders(this.token, options.headers);
    return fetch(url, { ...options, headers });
  }
}

export default new AuthService();
