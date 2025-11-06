import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API CALLS
// ============================================

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// ============================================
// MOVIE API CALLS
// ============================================

export const getMovies = () => API.get('/movies');
export const getMovie = (id) => API.get(`/movies/${id}`);
export const addMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);
export const getStats = () => API.get('/movies/stats');
export const searchMovies = (params) => API.get('/movies/search', { params });

export default API;