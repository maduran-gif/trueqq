import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// AUTENTICACIÓN
// ============================================

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getMe = () => API.get('/auth/me');

// ============================================
// COMUNIDADES
// ============================================

export const getCommunities = () => API.get('/communities');
export const getCommunity = (id) => API.get(`/communities/${id}`);
export const joinCommunity = (id) => API.post(`/communities/${id}/join`);
export const getCommunityServices = (id) => API.get(`/communities/${id}/services`);

// ============================================
// SERVICIOS
// ============================================

export const createService = (serviceData) => API.post('/services', serviceData);
export const getServices = (params) => API.get('/services', { params });
export const getService = (id) => API.get(`/services/${id}`);
export const updateService = (id, serviceData) => API.put(`/services/${id}`, serviceData);
export const deleteService = (id) => API.delete(`/services/${id}`);

// ============================================
// TRANSACCIONES
// ============================================

export const requestService = (serviceId) => API.post('/transactions/request', { serviceId });
export const getMyTransactions = (type) => API.get('/transactions/my-transactions', { params: { type } });
export const getTransaction = (id) => API.get(`/transactions/${id}`);
export const completeTransaction = (id) => API.put(`/transactions/${id}/complete`);
export const getTransactionStats = () => API.get('/transactions/stats/summary');

export default API;