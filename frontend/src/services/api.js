import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://trueqq-backend.onrender.com';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getMe = () => API.get('/auth/me');

// USERS
export const updateUser = (userId, userData) => API.put(`/users/${userId}`, userData);
export const getUserStats = (userId) => API.get(`/users/${userId}/stats`);

// COMMUNITIES
export const getCommunities = () => API.get('/communities');
export const getCommunityById = (id) => API.get(`/communities/${id}`);
export const joinCommunity = (communityId) => API.post(`/communities/${communityId}/join`);

// SERVICES
export const getServices = (params) => API.get('/services', { params });
export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (serviceData) => API.post('/services', serviceData);
export const updateService = (id, serviceData) => API.put(`/services/${id}`, serviceData);
export const deleteService = (id) => API.delete(`/services/${id}`);

// TRANSACTIONS
export const getTransactions = (userId) => API.get(`/transactions/user/${userId}`);
export const createTransaction = (transactionData) => API.post('/transactions', transactionData);

export default API;