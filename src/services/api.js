// src/services/api.js
import axios from 'axios';
import store from '../store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3030/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout');
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { query } })
};

export const orderAPI = {
  getOrders: () => api.get('/orders'),
  getOrderDetails: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data)
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}`)
};

// Export default for modules that need all APIs
export default {
  api,
  productAPI,
  orderAPI,
  cartAPI
};