import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Package,
  Calendar,
  User,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  Edit
} from 'lucide-react';
import { getOrderDetails, updateOrderStatus, updatePaymentStatus } from '../../services/adminApi';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetails(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await updateOrderStatus(id, newStatus);
      await fetchOrder();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await updatePaymentStatus(id, newStatus);
      await fetchOrder();
    } catch (error) {
      console.error('Erreur mise à jour paiement:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock className="h-6 w-6 text-orange-500" />;
      case 'PAID': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'PROCESSING': return <Package className="h-6 w-6 text-blue-500" />;
      case 'SHIPPED': return <Truck className="h-6 w-6 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'CANCELLED': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <Package className="h-6 w-6 text-gray-500" />;
    }
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

  const formatPrice = (price) => {
    return price?.toLocaleString() + ' Ar' || '0 Ar';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Commande non trouvée</h2>
        <Link to="/admin/orders" className="text-green-600 hover:text-green-700">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Commande #{order.id.slice(-8)}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer size={18} />
            Imprimer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-3 gap-6">
        {/* Informations client */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Client
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{order.user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{order.user?.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Livraison
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{order.phoneNumber}</span>
              </div>
              {order.deliveryNotes && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                  <span className="text-sm text-gray-600">{order.deliveryNotes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Paiement
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span>Paiement à la livraison</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Statut</span>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handlePaymentUpdate(e.target.value)}
                  disabled={updating}
                  className={`px-2 py-1 rounded-lg text-sm font-medium border-0 ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="FAILED">Échoué</option>
                  <option value="REFUNDED">Remboursé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Articles commandés
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product?.image || 'https://via.placeholder.com/80'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity} x {formatPrice(item.price)}
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

            {/* Totaux */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-green-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Mise à jour du statut
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('PENDING')}
                disabled={updating || order.status === 'PENDING'}
                className="flex-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50"
              >
                En attente
              </button>
              <button
                onClick={() => handleStatusUpdate('PROCESSING')}
                disabled={updating || order.status === 'PROCESSING'}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
              >
                En préparation
              </button>
              <button
                onClick={() => handleStatusUpdate('SHIPPED')}
                disabled={updating || order.status === 'SHIPPED'}
                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
              >
                Expédiée
              </button>
              <button
                onClick={() => handleStatusUpdate('DELIVERED')}
                disabled={updating || order.status === 'DELIVERED'}
                className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
              >
                Livrée
              </button>
              <button
                onClick={() => handleStatusUpdate('CANCELLED')}
                disabled={updating || order.status === 'CANCELLED'}
                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                Annulée
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Chronologie
            </h2>
            <div className="space-y-3">
              {order.createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Créée le {formatDate(order.createdAt)}</span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">Payée le {formatDate(order.paidAt)}</span>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Expédiée le {formatDate(order.shippedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Livrée le {formatDate(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}