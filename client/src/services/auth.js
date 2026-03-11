export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = (data) => api.post('/auth/refresh', data);
export const getProfile = () => api.get('/auth/profile');
export const logout = () => api.get('/auth/logout');
