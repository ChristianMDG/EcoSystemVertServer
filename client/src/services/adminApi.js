import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==================== DASHBOARD ====================
export const getDashboardStats = () => api.get('/api/admin/dashboard/stats');
export const getChartData = (period = 'month') => api.get(`/api/admin/dashboard/charts?period=${period}`);

// ==================== COMMANDES ====================
export const getAllOrders = (params) => api.get('/api/admin/orders', { params });
export const getOrderDetails = (id) => api.get(`/api/admin/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/api/admin/orders/${id}/status`, { status });
export const updatePaymentStatus = (id, paymentStatus) => api.put(`/api/admin/orders/${id}/payment`, { paymentStatus });
export const deleteOrder = (id) => api.delete(`/api/admin/orders/${id}`);

// ==================== PRODUITS ====================
export const getAllProducts = async (params) => {
  const response = await api.get('/api/admin/products', { params });
  
  // Ajouter imageUrl à chaque produit
  if (response.data?.success && response.data?.data?.products) {
    response.data.data.products = response.data.data.products.map(product => ({
      ...product,
      imageUrl: product.image ? `${API_URL}/uploads/products/${product.image}` : null
    }));
  }
  
  return response;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/admin/products/${id}`);
  
  // Ajouter imageUrl au produit
  if (response.data?.success && response.data?.data) {
    response.data.data = {
      ...response.data.data,
      imageUrl: response.data.data.image ? `${API_URL}/uploads/products/${response.data.data.image}` : null
    };
  }
  
  return response.data;
};

export const createProduct = (formData) => {
  return api.post('/api/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (id, formData) => {
  return api.put(`/api/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);
export const updateStock = (id, stock) => api.put(`/api/admin/products/${id}/stock`, { stock });

// ==================== UTILISATEURS ====================
export const getAllUsers = (params) => api.get('/api/admin/users', { params });
export const getUserDetails = (id) => api.get(`/api/admin/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/api/admin/users/${id}/role`, { role });
export const toggleUserStatus = (id, isActive) => api.put(`/api/admin/users/${id}/status`, { isActive });
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

// ==================== SIMULATIONS ====================
export const getAllSimulations = (params) => api.get('/api/admin/simulations', { params });
export const getSimulationDetails = (id) => api.get(`/api/admin/simulations/${id}`);
export const deleteSimulation = (id) => api.delete(`/api/admin/simulations/${id}`);