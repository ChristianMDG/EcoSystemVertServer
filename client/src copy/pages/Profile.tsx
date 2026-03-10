import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data.user);
      } catch (err: any) {
        alert('Please login first');
        navigate('/login');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">
              {user.role === 'admin' ? '👑' : user.role === 'trainer' ? '📚' : '🛒'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-500">EcoVert Mada</p>
        </div>

        {/* Informations */}
        <div className="space-y-4 mb-8">
          <div className="border-b border-gray-100 pb-3">
            <label className="text-sm text-gray-500 block">Nom complet</label>
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <label className="text-sm text-gray-500 block">Email</label>
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <label className="text-sm text-gray-500 block">Rôle</label>
            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              {user.role === 'admin' ? 'Administrateur' : 
               user.role === 'trainer' ? 'Formateur' : 'Client'}
            </span>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
        >
          <span>🚪</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}