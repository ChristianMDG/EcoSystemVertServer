// src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  Leaf, 
  ArrowRight,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, totalWithDelivery, deliveryInfo, itemCount, checkoutCart, loading } = useCart();
  
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    deliveryNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer les données du panier depuis l'état de navigation
  const summaryData = location.state || {
    cartTotal,
    deliveryInfo,
    totalWithDelivery,
    itemCount
  };

  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "L'adresse de livraison est requise";
    } else if (formData.deliveryAddress.length < 10) {
      newErrors.deliveryAddress = "Veuillez entrer une adresse complète";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    } else if (!/^(\+261|0)[0-9]{9}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = "Numéro de téléphone invalide (ex: +261 34 12 345 67)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const deliveryDetails = {
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: formData.phoneNumber,
        deliveryNotes: formData.deliveryNotes,
        zone: deliveryInfo.zone,
        method: deliveryInfo.method
      };
      
      const order = await checkoutCart(deliveryDetails);
      
      navigate(`/orders/${order.id}`, {
        state: { success: true }
      });
      
    } catch (error) {
      console.error('Erreur checkout:', error);
      setErrors({
        submit: error.response?.data?.error || error.message || 'Erreur lors de la commande'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Finaliser la commande
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Formulaire de livraison */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Informations de livraison
                </h2>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{errors.submit}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Adresse de livraison */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-600" />
                        Adresse de livraison complète *
                      </span>
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                        errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Lot, rue, quartier, ville, code postal..."
                    />
                    {errors.deliveryAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  {/* Numéro de téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Phone size={16} className="text-green-600" />
                        Numéro de téléphone *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+261 34 12 345 67"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: +261 34 12 345 67 ou 034 12 345 67
                    </p>
                  </div>

                  {/* Instructions de livraison */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-green-600" />
                        Instructions de livraison (optionnel)
                      </span>
                    </label>
                    <textarea
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Indications pour le livreur, code d'accès, etc."
                    />
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode de paiement
                    </label>
                    <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <CreditCard size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">
                            Paiement à la livraison
                          </p>
                          <p className="text-sm text-green-600">
                            Payez en espèces ou par mobile money à la réception
                          </p>
                        </div>
                        <CheckCircle size={20} className="text-green-600 ml-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Bouton de confirmation */}
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        Confirmer la commande
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{summaryData.itemCount} article(s)</span>
                    <span>{summaryData.cartTotal?.toLocaleString()} Ar</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck size={14} />
                      Livraison
                    </span>
                    {summaryData.deliveryInfo?.isFree ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      <span>{summaryData.deliveryInfo?.fee?.toLocaleString()} Ar</span>
                    )}
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        {summaryData.totalWithDelivery?.toLocaleString()} Ar
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">TTC</p>
                  </div>
                </div>

                {/* Badge de livraison */}
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700">
                    <span className="font-semibold">Livraison: </span>
                    {summaryData.deliveryInfo?.days} jours ouvrés
                  </p>
                  {summaryData.deliveryInfo?.message && (
                    <p className="text-xs text-green-600 mt-1">
                      {summaryData.deliveryInfo.message}
                    </p>
                  )}
                </div>

                {/* Garanties */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
                  <div>
                    <Shield className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div>
                    <Leaf className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <span>Éco-responsable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}