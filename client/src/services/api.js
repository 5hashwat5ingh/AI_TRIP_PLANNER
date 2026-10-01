import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // accommodate multi-agent execution
});

// Attach JWT token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Trip API
export const tripAPI = {
  generateTrip: (tripData) => api.post('/trips', tripData),
  getUserTrips: () => api.get('/trips'),
  getTripById: (id) => api.get(`/trips/${id}`),
  updateTrip: (id, data) => api.put(`/trips/${id}`, data),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  modifyTrip: (id, prompt) => api.post(`/trips/${id}/modify`, { modificationPrompt: prompt }),
  replanTrip: (id) => api.post(`/trips/${id}/replan`),
  getSharedTrip: (shareId) => api.get(`/trips/share/${shareId}`),
};

export default api;
