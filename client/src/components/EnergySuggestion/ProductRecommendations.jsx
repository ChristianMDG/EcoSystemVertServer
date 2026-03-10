import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductRecommendations({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Produits recommandés pour votre installation
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-3">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition">
                  <ShoppingCart size={16} />
                  Ajouter
                </button>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500">{product.name.charAt(0)}</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
              {product.name}
            </h4>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-600">
                {product.price.toLocaleString()} Ar
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/products?category=Panneaux%20solaires"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          Voir tous les produits compatibles
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}