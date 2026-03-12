import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, Leaf, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, itemCount, checkoutCart, loading } = useCart();

  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await checkoutCart();
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Erreur checkout:', error);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Finaliser la commande
          </h1>

          {/* Résumé rapide */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-600">
              {itemCount} article(s) · Total: <span className="font-bold text-green-600">{cartTotal.toLocaleString()} Ar</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de livraison (simplifié) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison
              </label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre adresse complète"
                required
              />
            </div>

            {/* Mode de paiement (simulé) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Paiement à la livraison</option>
                <option>Carte bancaire (simulé)</option>
                <option>Mobile Money</option>
              </select>
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <Truck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Livraison gratuite</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <Leaf className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Éco-responsable</p>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
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
        </motion.div>
      </div>
    </div>
  );
}