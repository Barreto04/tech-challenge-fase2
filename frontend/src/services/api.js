import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const postService = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  search: (q) => api.get(`/posts/search?q=${q}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
