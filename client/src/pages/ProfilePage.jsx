import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit2, 
  Save,
  X,
  Leaf,
  Package,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  LogOut,
  ShoppingBag,
  Sun,
  Battery,
  Zap,
  Clock,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState({
    orders: false,
    simulations: false,
    stats: false
  });
  
  // Données de l'utilisateur
  const [userOrders, setUserOrders] = useState([]);
  const [userSimulations, setUserSimulations] = useState([]);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalSimulations: 0,
    totalCO2: 0,
    averageSavings: 0
  });
  const [memberSince, setMemberSince] = useState('');

  // Charger les données réelles
  useEffect(() => {
    if (user?.userId) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Charger les commandes
      setLoading(prev => ({ ...prev, orders: true }));
      const ordersRes = await api.get('/orders/user');
      setUserOrders(ordersRes.data.data || []);
      
      // Charger les simulations
      setLoading(prev => ({ ...prev, simulations: true }));
      const simulationsRes = await api.get('/energy/simulations?limit=100');
      setUserSimulations(simulationsRes.data.data?.simulations || []);
      
      // Charger les statistiques
      setLoading(prev => ({ ...prev, stats: true }));
      const statsRes = await api.get('/energy/simulations/stats');
      setUserStats(statsRes.data.data || {});
      
      // Date d'inscription
      if (user?.createdAt) {
        const date = new Date(user.createdAt);
        setMemberSince(date.toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }));
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading({
        orders: false,
        simulations: false,
        stats: false
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/users/profile', { name: editedName });
      setIsEditing(false);
      // Mettre à jour le contexte localement ou recharger
      window.location.reload();
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('MGA', 'Ar');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Non connecté</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour accéder à votre profil.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <User size={20} />
            Se connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User, count: null },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, count: userOrders.length },
    { id: 'simulations', label: 'Simulations', icon: Sun, count: userSimulations.length },
    { id: 'stats', label: 'Statistiques', icon: TrendingUp, count: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête avec bannière */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="h-48 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl p-2 mb-2">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mb-4 text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <Calendar size={16} />
                  Membre depuis {memberSince || 'mars 2024'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </motion.div>

        {/* Navigation par onglets */}
        <div className="mt-16 mb-8">
          <nav className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all flex-1 sm:flex-none relative ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
        >
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Informations personnelles</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl transition"
                >
                  {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                  <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <User className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Nom complet</p>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            <Save size={18} />
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium text-gray-800">{user.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium text-gray-800">{memberSince}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Rôle</p>
                      <p className="font-medium text-gray-800 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      Badges et réalisations
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <Leaf className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Éco-consommateur</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <Sun className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Solaire +</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Commandes */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Mes commandes</h2>
              
              {loading.orders ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore de commande</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Commande #{order.id.slice(0, 8)}</p>
                          <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {order.status}
                          </span>
                          <span className="font-bold text-green-600">
                            {formatPrice(order.total)}
                          </span>
                          <button className="p-2 hover:bg-white rounded-lg transition">
                            <Eye size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Simulations */}
          {activeTab === 'simulations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Mes simulations énergétiques</h2>
              
              {loading.simulations ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : userSimulations.length === 0 ? (
                <div className="text-center py-12">
                  <Sun className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore fait de simulation</p>
                  <Link
                    to="/energy-simulator"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition"
                  >
                    Faire une simulation
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userSimulations.map((sim) => (
                    <div key={sim.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Simulation du {formatDate(sim.createdAt)}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm">
                              <Sun size={14} className="text-yellow-500" />
                              {sim.nbPanneaux} panneaux
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              <Battery size={14} className="text-green-600" />
                              {sim.capaciteBatterie} kWh
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              <Zap size={14} className="text-blue-500" />
                              {sim.productionAnnuelle} kWh/an
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600">
                            {formatPrice(sim.coutEstime)}
                          </span>
                          <button className="p-2 hover:bg-white rounded-lg transition">
                            <Eye size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Mes statistiques</h2>
              
              {loading.stats ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <>
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <ShoppingBag className="h-8 w-8 text-blue-600 mb-3" />
                      <p className="text-sm text-gray-600">Commandes</p>
                      <p className="text-2xl font-bold text-gray-800">{userStats.totalOrders || 0}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                      <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                      <p className="text-sm text-gray-600">Total dépensé</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatPrice(userStats.totalSpent || 0)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                      <Sun className="h-8 w-8 text-yellow-600 mb-3" />
                      <p className="text-sm text-gray-600">Simulations</p>
                      <p className="text-2xl font-bold text-gray-800">{userStats.totalSimulations || 0}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                      <Leaf className="h-8 w-8 text-emerald-600 mb-3" />
                      <p className="text-sm text-gray-600">CO₂ économisé</p>
                      <p className="text-2xl font-bold text-gray-800">{userStats.totalCO2 || 0} kg</p>
                    </div>
                  </div>

                  {/* Graphique d'activité simplifié */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Activité récente</h3>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Clock size={14} className="text-gray-400" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">Semaine {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bouton export */}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                    <Download size={18} />
                    <span>Exporter mes données</span>
                  </button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}