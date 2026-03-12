import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Leaf,
  ShoppingBag,
  AlertCircle,
  Check,
  Truck,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  Gift,
  Zap,
  AlertTriangle,
  X,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Composant Modal de confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', type = 'warning' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'danger':
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'info':
        return <AlertCircle className="h-12 w-12 text-blue-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getButtonColor = () => {
    switch(type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {getIcon()}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {title}
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  {message}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition ${getButtonColor()}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    loading, 
    itemCount, 
    cartTotal,
    deliveryInfo,
    totalWithDelivery,
    updateQuantity, 
    removeItem, 
    emptyCart,
    setDeliveryZone,
    setDeliveryMethod,
    DELIVERY,
    DELIVERY_ZONES
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  
  // États pour les modals de confirmation
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    action: null,
    itemId: null
  });

  const handleUpdateQuantity = async (productId, newQuantity) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      setError(null);
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setTimeout(() => {
        setUpdatingItems(prev => ({ ...prev, [productId]: false }));
      }, 300);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer l\'article',
      message: `Êtes-vous sûr de vouloir supprimer "${productName}" de votre panier ?`,
      action: async () => {
        setUpdatingItems(prev => ({ ...prev, [productId]: true }));
        try {
          await removeItem(productId);
        } catch (err) {
          setError(err.response?.data?.error || 'Erreur lors de la suppression');
        } finally {
          setUpdatingItems(prev => ({ ...prev, [productId]: false }));
        }
      }
    });
  };

  const handleClearCart = () => {
    if (cart?.items?.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Vider le panier',
      message: 'Êtes-vous sûr de vouloir vider complètement votre panier ? Cette action est irréversible.',
      action: async () => {
        try {
          await emptyCart();
          setSuccessMessage('Panier vidé avec succès');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          setError(err.response?.data?.error || 'Erreur lors du vidage du panier');
        }
      }
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
  
    // Rediriger vers la page de checkout avec les infos de livraison
    navigate('/checkout', {
      state: {
        cartTotal,
        deliveryInfo,
        totalWithDelivery,
        itemCount
      }
    });
  };

  const handleChangeZone = (zone) => {
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: 'Changer de zone',
      message: `Voulez-vous changer la zone de livraison pour "${zone}" ? Les frais de livraison seront recalculés.`,
      confirmText: 'Changer',
      action: () => {
        setDeliveryZone(zone);
        setShowDeliverySelector(false);
      }
    });
  };

  const handleChangeMethod = (method) => {
    const methodName = method === 'standard' ? 'Standard' : 'Express';
    const additionalFee = method === 'express' ? DELIVERY.EXPRESS_FEE : 0;
    
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: 'Changer de mode de livraison',
      message: `Passer en livraison ${methodName}${additionalFee > 0 ? ` (+${additionalFee.toLocaleString()} Ar)` : ''}. Confirmez-vous ce choix ?`,
      confirmText: 'Changer',
      action: () => setDeliveryMethod(method)
    });
  };

  const getProgressToFreeDelivery = () => {
    if (cartTotal >= DELIVERY.FREE_THRESHOLD) return 100;
    return (cartTotal / DELIVERY.FREE_THRESHOLD) * 100;
  };

  const amountLeftForFreeDelivery = DELIVERY.FREE_THRESHOLD - cartTotal;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Connectez-vous pour voir votre panier
              </h1>
              <p className="text-gray-600 mb-8">
                Vous devez être connecté pour accéder à votre panier et passer commande.
              </p>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="block w-full border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl font-semibold hover:bg-green-50 transition"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Votre panier est vide
              </h1>
              <p className="text-gray-600 mb-8">
                Découvrez nos produits écologiques et commencez vos achats !
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Voir les produits
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3"
            >
              <Check size={20} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barre de progression vers livraison gratuite */}
        {!deliveryInfo.isFree && cartTotal < DELIVERY.FREE_THRESHOLD && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Plus que <span className="font-bold">{amountLeftForFreeDelivery.toLocaleString()} Ar</span> pour bénéficier de la livraison gratuite !
              </p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressToFreeDelivery()}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            Mon Panier
            <span className="text-lg font-normal text-gray-500 ml-2">
              ({itemCount} article{itemCount > 1 ? 's' : ''})
            </span>
          </h1>
          
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
            >
              <Trash2 size={18} />
              Vider le panier
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: updatingItems[item.product.id] ? 0.7 : 1,
                    x: 0,
                    scale: updatingItems[item.product.id] ? 0.98 : 1
                  }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.2,
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all"
                >
                  <Link to={`/products/${item.product.id}`} className="sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image?.startsWith('http') 
                        ? item.product.image 
                        : `${import.meta.env.VITE_API_URL}${item.product.image || ''}`
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=Produit';
                      }}
                    />
                  </Link>

                  <div className="flex-1">
                    <Link to={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-green-600 transition mb-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {item.product.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-green-600 font-bold">
                        {item.product.price.toLocaleString()} Ar
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {item.product.stock}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems[item.product.id]}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 font-medium min-w-[40px] text-center">
                          {updatingItems[item.product.id] ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock || updatingItems[item.product.id]}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                        disabled={updatingItems[item.product.id]}
                        className="text-red-600 hover:text-red-700 p-1 transition-colors disabled:opacity-50"
                        title="Supprimer l'article"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="sm:w-32 text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-gray-800">
                      {(item.product.price * item.quantity).toLocaleString()} Ar
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <motion.div
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Résumé de la commande
              </h2>

              {/* Sélecteur de zone de livraison */}
              <div className="mb-4">
                <button
                  onClick={() => setShowDeliverySelector(!showDeliverySelector)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-green-600" />
                    <span className="text-sm font-medium">
                      {deliveryInfo.zone}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Modifier</span>
                </button>

                <AnimatePresence>
                  {showDeliverySelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2"
                    >
                      {Object.keys(DELIVERY_ZONES).map((zone) => (
                        <button
                          key={zone}
                          onClick={() => handleChangeZone(zone)}
                          className={`w-full text-left p-2 rounded-lg text-sm transition ${
                            deliveryInfo.zone === zone
                              ? 'bg-green-100 text-green-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{zone}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {DELIVERY_ZONES[zone].days} jours
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mode de livraison */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => handleChangeMethod('standard')}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition ${
                    deliveryInfo.method === 'standard'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => handleChangeMethod('express')}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition ${
                    deliveryInfo.method === 'express'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Express
                </button>
              </div>

              {/* Message de livraison */}
              {deliveryInfo.message && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                  {deliveryInfo.message}
                </div>
              )}

              {/* Détails des prix */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({itemCount} articles)</span>
                  <motion.span
                    key={cartTotal}
                    initial={{ scale: 1.2, color: '#059669' }}
                    animate={{ scale: 1, color: '#4b5563' }}
                    transition={{ duration: 0.2 }}
                  >
                    {cartTotal.toLocaleString()} Ar
                  </motion.span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={16} />
                    Livraison
                    {deliveryInfo.days && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({deliveryInfo.days} jours)
                      </span>
                    )}
                  </span>
                  {deliveryInfo.isFree ? (
                    <span className="text-green-600 font-medium">Gratuite</span>
                  ) : (
                    <span>{deliveryInfo.fee.toLocaleString()} Ar</span>
                  )}
                </div>

                {/* Promotion première commande */}
                {DELIVERY.FREE_FOR_FIRST_ORDER && cartItems.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Gift size={16} className="text-purple-600" />
                    <span className="text-xs text-purple-700">
                      Première commande : livraison offerte !
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <motion.span
                      key={totalWithDelivery}
                      className="text-green-600"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {totalWithDelivery.toLocaleString()} Ar
                    </motion.span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    TTC
                  </p>
                </div>
              </div>

              {/* Éco-contribution */}
              <div className="bg-green-50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  Une partie de votre achat est reversée à des projets de reforestation à Madagascar.
                </p>
              </div>

              {/* Moyens de paiement */}
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <CreditCard size={18} />
                <span>Paiement sécurisé</span>
                <Shield size={18} className="ml-2" />
                <span>Garantie 2 ans</span>
              </div>

              {/* Bouton commander */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={checkoutLoading || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    Passer la commande
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}