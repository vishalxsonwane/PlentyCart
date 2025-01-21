// src/plugins/axios.js
import axios from 'axios';
import store from '../store';

let isCheckingAuth = false;
let isHandlingSession = false;

// List of paths that don't need auth check
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/me',
  '/',
];

// Response interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !isHandlingSession) {
      isHandlingSession = true;
      try {
        await store.dispatch('auth/handleSessionExpired');
      } finally {
        isHandlingSession = false;
      }
    }
    return Promise.reject(error);
  }
);

// Add request interceptor
axios.interceptors.request.use(
  async config => {
    // Skip auth check for public routes and if already checking
    const isPublicPath = publicPaths.some(path => config.url.includes(path));
    if (!isPublicPath && !isCheckingAuth) {
      isCheckingAuth = true;
      try {
        await store.dispatch('auth/checkAuthState');
      } finally {
        isCheckingAuth = false;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;