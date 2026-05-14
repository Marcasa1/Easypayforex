import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('easypayforex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const marketAPI = {
  getAll: () => api.get('/markets'),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  deposit: (data) => api.post('/wallet/deposit', data),
  withdraw: (data) => api.post('/wallet/withdraw', data),
  getTransactions: () => api.get('/wallet/transactions'),
};

export const tradingAPI = {
  openTrade: (data) => api.post('/trading/open', data),
  closeTrade: (id) => api.post(`/trading/close/${id}`),
  getPositions: () => api.get('/trading/positions'),
  getHistory: () => api.get('/trading/history'),
};

export default api;
