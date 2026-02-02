import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: 'https://trueqq-backend.onrender.com/api',
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

// ============================================
// REVIEWS (CALIFICACIONES)
// ============================================
export const createReview = (reviewData) => API.post('/reviews', reviewData);
export const getServiceReviews = (serviceId) => API.get(`/reviews/service/${serviceId}`);
export const getProviderReviews = (providerId) => API.get(`/reviews/provider/${providerId}`);
export const getTransactionReview = (transactionId) => API.get(`/reviews/transaction/${transactionId}`);

// ============================================
// MENSAJES / CHAT
// ============================================
export const getMessages = (transactionId) => API.get(`/messages/${transactionId}`);
export default API;

// ============================================
// NOTIFICACIONES
// ============================================
export const getNotifications = (unreadOnly = false) => API.get('/notifications', { params: { unreadOnly } });
export const markNotificationAsRead = (notificationId) => API.put(`/notifications/${notificationId}/read`);
export const markAllNotificationsAsRead = () => API.put('/notifications/mark-all-read');