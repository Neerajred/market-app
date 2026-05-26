import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5500';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generate device fingerprint
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

const getDeviceInfo = () => {
  return {
    deviceName: 'Web Browser',
    os: navigator.userAgent,
  };
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', {
      email,
      password,
      authProvider: 'manual',
      deviceId: getDeviceId(),
      deviceInfo: getDeviceInfo()
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/register', {
      ...userData,
      authProvider: 'manual',
      deviceId: getDeviceId(),
      deviceInfo: getDeviceInfo()
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

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/profile', userData);
    return response.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (product) => {
    const response = await apiClient.post('/wishlist', product);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  },
};

// Address API
export const addressAPI = {
  getAddresses: async () => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await apiClient.post('/addresses', addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await apiClient.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },
};

export default apiClient;
