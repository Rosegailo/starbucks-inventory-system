import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'sb_auth_token';
const USER_KEY = 'sb_auth_user';

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach JWT Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login');

    if (status === 401 && !isAuthEndpoint) {
      clearAuthSession();
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler(error.response?.data?.message || 'Your session expired. Please sign in again.');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = async ({ identifier, password }) => {
  const response = await api.post('/auth/login', { identifier, password });
  if (response.data?.token && response.data?.user) {
    saveAuthSession(response.data.token, response.data.user);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  if (response.data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  clearAuthSession();
};

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getInventoryStats = async () => {
  const response = await api.get('/products/stats');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const updateProductStock = async (id, { delta, newStock }) => {
  const response = await api.patch(`/products/${id}/stock`, { delta, newStock });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export default api;
