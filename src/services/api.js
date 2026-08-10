import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_URL = rawApiUrl.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    return 'Cannot reach the server. Check your connection and try again.';
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;

  switch (status) {
    case 400:
      return serverMessage || 'Invalid request. Please check your input.';
    case 401:
      return serverMessage || 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to do this.';
    case 404:
      return serverMessage || 'Not found.';
    case 409:
      return serverMessage || 'This action conflicts with the current state.';
    case 423:
      return serverMessage || 'Challenge is locked.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Something went wrong on the server. Please try again later.';
    default:
      return serverMessage || fallback;
  }
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  return config;
});

const isAdminRequest = (url) => {
  if (!url) return false;
  const parts = url.split('?')[0].replace(/^\//, '').split('/').filter(Boolean);
  if (parts[0] === 'auth') return true;
  if (parts[0] !== 'challenges') return false;
  if (parts.length === 1) return true;
  if (parts.length === 2) return parts[1] === 'stats';
  if (parts.length === 3) return !['status', 'start', 'state', 'answer'].includes(parts[2]);
  return false;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && isAdminRequest(requestUrl) && !requestUrl.includes('/auth/login')) {
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/admin/login') {
        window.location.replace('/admin/login');
      }
    }

    return Promise.reject(error);
  }
);

const getPlayerHeaders = (playerToken) =>
  playerToken ? { 'x-player-token': playerToken } : {};

export const getPlayerToken = (code) => localStorage.getItem(`playerToken:${code}`);
export const setPlayerToken = (code, token) => localStorage.setItem(`playerToken:${code}`, token);
export const clearPlayerToken = (code) => localStorage.removeItem(`playerToken:${code}`);

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

export const challengeApi = {
  stats: () => api.get('/api/challenges/stats'),
  list: () => api.get('/api/challenges'),
  get: (id) => api.get(`/api/challenges/${id}`),
  create: (data) => api.post('/api/challenges', data),
  update: (id, data) => api.put(`/api/challenges/${id}`, data),
  remove: (id) => api.delete(`/api/challenges/${id}`),
};

export const playerApi = {
  status: (code) => api.get(`/api/challenges/${code}/status`),
  start: (code, token) =>
    api.post(`/api/challenges/${code}/start`, {}, { headers: getPlayerHeaders(token) }),
  state: (code, token) =>
    api.get(`/api/challenges/${code}/state`, { headers: getPlayerHeaders(token) }),
  answer: (code, token, answer) =>
    api.post(`/api/challenges/${code}/answer`, { answer }, { headers: getPlayerHeaders(token) }),
};

export default api;
