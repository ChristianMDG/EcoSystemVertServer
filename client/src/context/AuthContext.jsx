import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { login as apiLogin, refreshToken as apiRefreshToken, logout as apiLogout, getProfile } from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Constants
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract user from token (backend structure exacte)
  const extractUserFromToken = useCallback((token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      console.log('🔍 Token décodé:', decoded);
      
      // Structure exacte du backend: { userId, role, name, email, createdAt }
      return {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        createdAt: decoded.createdAt ? new Date(decoded.createdAt) : null,
        // Métadonnées du token
        exp: decoded.exp,
        iat: decoded.iat
      };
    } catch (error) {
      console.error('❌ Erreur décodage token:', error);
      return null;
    }
  }, []);

  // ✅ NOUVELLE FONCTION: Récupérer le profil complet depuis /profile
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log('📡 Récupération du profil depuis /profile');
      const response = await getProfile();
      console.log('📦 Profil reçu:', response.data);
      
      // Vérifier la structure de la réponse
      // Selon votre endpoint, ça pourrait être response.data.user ou directement response.data
      const userData = response.data.user || response.data;
      
      if (userData) {
        console.log('👤 Données utilisateur complètes:', userData);
        
        // Mettre à jour l'utilisateur avec les données complètes
        setUser(prevUser => ({
          ...prevUser,
          id: userData.userId || userData.id || prevUser?.id,
          name: userData.name || prevUser?.name,
          email: userData.email || prevUser?.email,
          role: userData.role || prevUser?.role,
          // ✅ createdAt est maintenant disponible depuis l'API
          createdAt: userData.createdAt ? new Date(userData.createdAt) : prevUser?.createdAt || null
        }));
        
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      return null;
    }
  }, []);

  // Vérifier si le token est valide
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Vérifier si le token n'est pas expiré (avec 30s de marge)
      return decoded.exp > currentTime + 30;
    } catch {
      return false;
    }
  }, []);

  // Rafraîchir le token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken || isRefreshing) {
      return null;
    }

    setIsRefreshing(true);
    
    try {
      console.log('🔄 Tentative de refresh token');
      const { data } = await apiRefreshToken({ refreshToken });
      
      // Le backend retourne: { accessToken, refreshToken }
      if (data.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        
        if (data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        
        console.log('✅ Token rafraîchi avec succès');
        return data.accessToken;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Échec du refresh token:', error);
      // En cas d'échec, déconnecter l'utilisateur
      await logout();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Valider le token et le rafraîchir si nécessaire
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!token) {
      setUser(null);
      return false;
    }

    if (isTokenValid(token)) {
      const userData = extractUserFromToken(token);
      setUser(userData);
      
      // ✅ Récupérer le profil complet après avoir restauré la session
      await fetchUserProfile();
      
      return true;
    }

    // Token expiré, essayer de le rafraîchir
    console.log('⏰ Token expiré, tentative de refresh...');
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      const userData = extractUserFromToken(newToken);
      setUser(userData);
      
      // ✅ Récupérer le profil complet après refresh
      await fetchUserProfile();
      
      return true;
    }

    // Échec du refresh
    await logout();
    return false;
  }, [isTokenValid, extractUserFromToken, refreshAccessToken, fetchUserProfile]);

  // Initialisation
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        console.log('🔐 Token au chargement:', token ? 'Présent' : 'Absent');
        
        if (token) {
          await validateToken();
        }
      } catch (error) {
        console.error('❌ Erreur d\'initialisation:', error);
        setError('Erreur lors de l\'initialisation');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Login
  const login = useCallback(async (email, password) => {
    setError(null);
    
    try {
      console.log('🔑 Tentative de connexion:', email);
      const { data } = await apiLogin({ email, password });
      console.log('📦 Réponse brute:', data);
      
      // Le backend retourne: { user, accessToken, refreshToken }
      if (!data.accessToken) {
        throw new Error('Pas de token reçu');
      }
      
      // Stocker les tokens
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      
      // Extraire l'utilisateur du token (données de base)
      const userFromToken = extractUserFromToken(data.accessToken);
      console.log('👤 Utilisateur du token:', userFromToken);
      
      // Mettre à jour avec les données du token d'abord
      setUser(userFromToken);
      
      // ✅ Récupérer le profil complet depuis /profile
      await fetchUserProfile();
      
      return { 
        success: true
      };
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      
      // Gérer les erreurs spécifiques
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(error.response?.data?.message || error.message || 'Erreur de connexion');
      }
      
      throw error;
    }
  }, [extractUserFromToken, fetchUserProfile]);

  // Logout
  const logout = useCallback(async () => {
    console.log('🚪 Déconnexion');
    
    // Appeler l'endpoint de logout si refresh token existe
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await apiLogout({ refreshToken });
        console.log('✅ Logout API réussi');
      } catch (error) {
        console.error('❌ Erreur logout API:', error);
        // On continue même si l'API échoue
      }
    }
    
    // Nettoyer le stockage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Réinitialiser l'état
    setUser(null);
    setError(null);
    
    console.log('👋 Déconnexion terminée');
  }, []);

  // Vérifier le rôle
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const isClient = useCallback(() => {
    return user?.role === 'client';
  }, [user]);

  // Obtenir le nom d'affichage
  const getDisplayName = useCallback(() => {
    return user?.name || user?.email?.split('@')[0] || 'Utilisateur';
  }, [user]);

  // Obtenir la date d'inscription formatée
  const getFormattedJoinDate = useCallback(() => {
    console.log('📅 Calcul date avec user:', user);
    console.log('📅 createdAt:', user?.createdAt);
    
    if (user?.createdAt) {
      try {
        // S'assurer que c'est un objet Date valide
        const date = user.createdAt instanceof Date 
          ? user.createdAt 
          : new Date(user.createdAt);
        
        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
          console.error('❌ Date invalide:', user.createdAt);
          return null;
        }
        
        return new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
      } catch (error) {
        console.error('❌ Erreur formatage:', error);
        return null;
      }
    }
    return null;
  }, [user]);

  // Valeur du contexte mémorisée
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isClient,
    getDisplayName,
    getFormattedJoinDate,
    refreshToken: refreshAccessToken,
    validateToken,
    fetchUserProfile 
  }), [user, loading, error, login, logout, hasRole, isAdmin, isClient, 
      getDisplayName, getFormattedJoinDate, refreshAccessToken, validateToken, fetchUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};