// src/services/apiService.js

// Configure the base URL for your API server
const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your FastAPI server URL

// Coins API functions
export const coinService = {
  // Get a user's coin balance
  async getBalance(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/balance/${userId}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching coin balance:', error);
      throw error;
    }
  },

  // Increment coins (earn)
  async incrementCoins(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/earn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.userId,
          amount: userData.amount,
          transaction_type: 'earn',
          source: userData.source || 'app_action',
          description: userData.description || 'Earned coins',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error incrementing coins:', error);
      throw error;
    }
  },

  // Fetch transaction history
  async getTransactions(userId, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/transactions/${userId}?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get exchange rates
  async getExchangeRates() {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/exchange-rates`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  },

  // Spend coins
  async spendCoins(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/spend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.userId,
          amount: userData.amount,
          transaction_type: 'spend',
          source: userData.source || 'app_feature',
          description: userData.description || 'Spent coins',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error spending coins:', error);
      throw error;
    }
  }
};