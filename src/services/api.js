import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5500';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

const getDeviceInfo = () => ({ deviceName: 'Web Browser', os: navigator.userAgent });

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', {
      email, password, authProvider: 'manual',
      deviceId: getDeviceId(), deviceInfo: getDeviceInfo()
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/register', {
      ...userData, authProvider: 'manual',
      deviceId: getDeviceId(), deviceInfo: getDeviceInfo()
    });
    return response.data;
  },
  checkEmail: async (email) => {
    const response = await apiClient.post('/check-email', { email });
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  getProfile: async () => (await apiClient.get('/profile')).data,
  updateProfile: async (userData) => (await apiClient.put('/profile', userData)).data,
  getDevices: async () => (await apiClient.get('/profile/devices')).data,
  getCards: async () => (await apiClient.get('/profile/cards')).data,
  addCard: async (cardData) => (await apiClient.post('/profile/cards', cardData)).data,
  updateCard: async (id, data) => (await apiClient.put(`/profile/cards/${id}`, data)).data,
  deleteCard: async (id) => (await apiClient.delete(`/profile/cards/${id}`)).data,
  setDefaultCard: async (id) => (await apiClient.patch(`/profile/cards/${id}/default`)).data,
};

// ─── ADDRESS ──────────────────────────────────────────────────────────────────
export const addressAPI = {
  getAddresses: async () => (await apiClient.get('/addresses')).data,
  addAddress: async (data) => (await apiClient.post('/addresses', data)).data,
  updateAddress: async (id, data) => (await apiClient.put(`/addresses/${id}`, data)).data,
  deleteAddress: async (id) => (await apiClient.delete(`/addresses/${id}`)).data,
  setDefault: async (id) => (await apiClient.patch(`/addresses/${id}/default`)).data,
};

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export const wishlistAPI = {
  getWishlist: async () => (await apiClient.get('/wishlist')).data,
  addToWishlist: async (productId) => (await apiClient.post('/wishlist', { productId })).data,
  removeFromWishlist: async (productId) => (await apiClient.delete(`/wishlist/${productId}`)).data,
};

// ─── CART ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart: async () => (await apiClient.get('/cart')).data,
  addToCart: async (productId, quantity = 1) => (await apiClient.post('/cart', { productId, quantity })).data,
  updateCartItem: async (itemId, quantity) => (await apiClient.put(`/cart/${itemId}`, { quantity })).data,
  removeCartItem: async (itemId) => (await apiClient.delete(`/cart/${itemId}`)).data,
  clearCart: async () => (await apiClient.delete('/cart')).data,
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  createOrder: async (orderData) => (await apiClient.post('/orders', orderData)).data,
  getOrders: async () => (await apiClient.get('/orders')).data,
  getOrderById: async (orderId) => (await apiClient.get(`/orders/${orderId}`)).data,
  cancelOrder: async (orderId) => (await apiClient.put(`/orders/${orderId}/cancel`)).data,
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getProducts: async () => (await apiClient.get('/products')).data,
  getProductById: async (id) => (await apiClient.get(`/products/${id}`)).data,
  getCategories: async () => (await apiClient.get('/products/categories')).data,
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  getProducts: async () => (await apiClient.get('/admin/products')).data,
  createProduct: async (data) => (await apiClient.post('/admin/products', data)).data,
  updateProduct: async (id, data) => (await apiClient.put(`/admin/products/${id}`, data)).data,
  deleteProduct: async (id) => (await apiClient.delete(`/admin/products/${id}`)).data,
  getOrders: async () => (await apiClient.get('/admin/orders')).data,
  updateOrder: async (id, data) => (await apiClient.put(`/admin/orders/${id}`, data)).data,
  getUsers: async () => (await apiClient.get('/admin/users')).data,
  getUser: async (id) => (await apiClient.get(`/admin/users/${id}`)).data,
  updateUser: async (id, data) => (await apiClient.put(`/admin/users/${id}`, data)).data,
  deleteUser: async (id) => (await apiClient.delete(`/admin/users/${id}`)).data,
  deleteUserAddress: async (userId, addrId) => (await apiClient.delete(`/admin/users/${userId}/addresses/${addrId}`)).data,
  deleteUserCard: async (userId, cardId) => (await apiClient.delete(`/admin/users/${userId}/cards/${cardId}`)).data,
  setup: async (setupSecret, email, password, fullname) =>
    (await apiClient.post('/admin/setup', { setupSecret, email, password, fullname })).data,
};

export default apiClient;
