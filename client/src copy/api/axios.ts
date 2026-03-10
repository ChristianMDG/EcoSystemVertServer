import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Interceptor pour mettre accessToken dans header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor pour refresh token automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const res = await axios.post('http://localhost:5000/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;