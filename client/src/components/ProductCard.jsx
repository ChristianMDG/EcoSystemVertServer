import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Configuration de l'URL de base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = () => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      if (product.image.startsWith('/uploads')) return `${API_URL}${product.image}`;
      return `${API_URL}/uploads/products/${product.image}`;
    }
    // Image par défaut (placeholder SVG)
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='14' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial'%3E${product.name?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product.id, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='14' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial'%3E${product.name?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {product.price?.toLocaleString()} Ar
            </span>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;