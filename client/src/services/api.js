import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        refreshToken
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    }
  }
);

// ========================================
// AUTH
// ========================================
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = (data) => api.post('/auth/refresh', data);
export const getProfile = () => api.get('/auth/profile');
export const logout = () => api.post('/auth/logout');
export const getAllUsers = () => api.get('/auth/users');

// ========================================
// PRODUCTS
// ========================================
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ========================================
// CART (PANIER)
// ========================================
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => 
  api.post('/cart/items', { productId, quantity });
export const updateCartItem = (productId, quantity) => 
  api.put(`/cart/items/${productId}`, { quantity });
export const removeFromCart = (productId) => 
  api.delete(`/cart/items/${productId}`);
export const clearCart = () => api.delete('/cart');

// CORRECTION ICI : Ajouter les paramètres deliveryDetails
export const checkout = (deliveryDetails) => api.post('/cart/checkout', deliveryDetails);

// ========================================
// ORDERS
// ========================================
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);

// ========================================
// ENERGY SIMULATOR
// ========================================

// Créer une simulation
export const createSimulation = (data) => api.post('/simulations', data);

// Récupérer toutes les simulations de l'utilisateur
export const getUserSimulations = (params) => api.get('/simulations', { params });

// Récupérer une simulation spécifique
export const getSimulationById = (id) => api.get(`/simulations/${id}`);

// Supprimer une simulation
export const deleteSimulation = (id) => api.delete(`/simulations/${id}`);

// Obtenir les statistiques de l'utilisateur
export const getUserEnergyStats = () => api.get('/simulations/stats');

// Ajouter un feedback
export const addSimulationFeedback = (simulationId, data) => 
  api.post(`/simulations/${simulationId}/feedback`, data);

// Obtenir des conseils personnalisés (optionnel)
export const getEnergyTips = (localisation, consommation) => 
  api.get('/energy/tips', { params: { localisation, consommation } });

export default api;