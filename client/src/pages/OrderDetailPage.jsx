import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Leaf,
  MapPin,
  User,
  Mail,
  Download
} from "lucide-react";
import { getOrderById } from "../services/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      const orderData = response.data?.data || response.data || response;
      setOrder(orderData);
    } catch (err) {
      console.error("Erreur chargement commande:", err);
      setError("Impossible de charger les détails de la commande");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-6 w-6 text-orange-500" />;
      case 'PAID':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'PROCESSING':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'En attente de paiement',
      'PAID': 'Payée',
      'PROCESSING': 'En préparation',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée'
    };
    return statusMap[status?.toUpperCase()] || status || 'En attente';
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 inline-block p-4 rounded-full mb-4">
          <Package className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Commande non trouvée
        </h2>
        <p className="text-gray-600 mb-8">{error || "La commande n'existe pas"}</p>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <ChevronLeft size={18} />
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-6 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition" />
          Retour aux commandes
        </button>

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Commande #{order.id.slice(-8)}
                </h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar size={16} />
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Articles commandés */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Articles commandés
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image?.startsWith('http')
                          ? item.product.image
                          : `${import.meta.env.VITE_API_URL}${item.product?.image || ''}`
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Produit';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product?.id}`}>
                        <h3 className="font-medium text-gray-800 hover:text-green-600 transition">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prix unitaire: {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Livraison
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Destinataire</p>
                    <p className="font-medium">{order.user?.name || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{order.user?.email || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse de livraison</p>
                    <p className="font-medium">À déterminer</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Truck size={16} />
                    Livraison gratuite
                  </p>
                </div>
              </div>
            </div>

            {/* Éco-contribution */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Impact écologique</h3>
              </div>
              <p className="text-sm text-green-700">
                Cette commande contribue à la plantation de 2 arbres à Madagascar.
              </p>
            </div>

            {/* Bouton téléchargement */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              <Download size={18} />
              <span>Télécharger la facture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}