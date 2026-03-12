import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Zap,
  Shield,
  MapPin,
  Phone,
  Package,
  Clock,
  Eye
} from 'lucide-react';
import { getUserDetails } from '../../services/adminApi';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserDetails(id);
      setUser(response.data.data);
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + ' Ar' || '0 Ar';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': 'En attente',
      'PAID': 'Payée',
      'PROCESSING': 'En préparation',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Utilisateur non trouvé</h2>
        <Link to="/admin/users" className="text-green-600 hover:text-green-700">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Profil utilisateur
        </h1>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <span className={`inline-block px-2 py-1 mt-1 rounded-lg text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Client'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Inscrit le {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Statistiques
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gray-400" />
                  <span>Commandes</span>
                </div>
                <span className="font-bold text-lg">{user._count?.orders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gray-400" />
                  <span>Simulations</span>
                </div>
                <span className="font-bold text-lg">{user._count?.energySimulations || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Commandes récentes
            </h2>
            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders/${order.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Aucune commande
              </p>
            )}
          </div>

          {/* Simulations récentes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Simulations énergétiques
            </h2>
            {user.energySimulations && user.energySimulations.length > 0 ? (
              <div className="space-y-3">
                {user.energySimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {sim.localisation}
                        </p>
                        <p className="text-sm text-gray-500">
                          {sim.surface} m² · {sim.nbPanneaux} panneaux
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {sim.puissanceInstallee} kW
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(sim.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Aucune simulation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}