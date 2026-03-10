import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Adapter selon la structure de votre token (userId, name, email)
        setUser({
          id: decoded.userId || decoded.id,
          name: decoded.name || decoded.username || decoded.email?.split('@')[0],
          email: decoded.email,
        });
      } catch (error) {
        console.error('Token invalide', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const decoded = jwtDecode(data.accessToken);
    setUser({
      id: decoded.userId || decoded.id,
      name: decoded.name || decoded.username || email.split('@')[0],
      email: decoded.email,
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};