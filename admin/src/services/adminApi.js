import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
export const login = (email, password) => api.post('/login', { email, password });
export const getDashboard = () => api.get('/dashboard');
export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getTrades = () => api.get('/trades');
export const getTransactions = () => api.get('/transactions');
export const getWallet = () => api.get('/wallet');
export const depositWallet = (amount) => api.post('/wallet/deposit', { amount });
export const withdrawWallet = (amount) => api.post('/wallet/withdraw', { amount });
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
