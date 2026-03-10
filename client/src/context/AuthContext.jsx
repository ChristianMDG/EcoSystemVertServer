import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour décoder le token avec fallbacks multiples
  const getUserFromToken = (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      console.log('🔍 Token décodé (complet):', decoded);
      
      // Essayer toutes les possibilités de champs pour le nom
      const possibleNameFields = ['name', 'username', 'user', 'fullName', 'fullname', 'displayName', 'nickname', 'given_name', 'family_name', 'email'];
      let name = null;
      
      for (const field of possibleNameFields) {
        if (decoded[field]) {
          name = decoded[field];
          console.log(`✅ Nom trouvé dans le champ "${field}":`, name);
          break;
        }
      }
      
      // Si toujours pas de nom, utiliser la partie locale de l'email
      if (!name && decoded.email) {
        name = decoded.email.split('@')[0];
        console.log('📧 Nom dérivé de l\'email:', name);
      }
      
      // Dernier recours
      if (!name) {
        name = 'Utilisateur';
        console.log('⚠️ Aucun nom trouvé, utilisation par défaut');
      }

      // Essayer toutes les possibilités pour l'ID
      const possibleIdFields = ['userId', 'id', 'sub', 'uid', 'user_id', 'Id', 'ID'];
      let id = null;
      
      for (const field of possibleIdFields) {
        if (decoded[field]) {
          id = decoded[field];
          console.log(`✅ ID trouvé dans le champ "${field}":`, id);
          break;
        }
      }

      return {
        id: id || 'unknown',
        name: name,
        email: decoded.email || decoded.mail || '',
      };
    } catch (error) {
      console.error('❌ Erreur de décodage du token:', error);
      return null;
    }
  };

  // Chargement initial
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('🔐 Token au chargement:', token ? 'Présent' : 'Absent');
    
    if (token) {
      const userData = getUserFromToken(token);
      console.log('👤 Utilisateur restauré:', userData);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      console.log('🔑 Tentative de login pour:', email);
      const { data } = await apiLogin({ email, password });
      console.log('📦 Réponse login:', data);
      
      if (!data.accessToken) {
        console.error('❌ Pas de token dans la réponse');
        throw new Error('Pas de token reçu');
      }
      
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      const userData = getUserFromToken(data.accessToken);
      console.log('👤 Utilisateur connecté:', userData);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur login:', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log('🚪 Déconnexion');
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