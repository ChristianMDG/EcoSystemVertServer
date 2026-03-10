import { Link } from 'react-router-dom';
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${import.meta.env.VITE_API_URL}${product.image || product.imageUrl}`;

  const fallbackImage = 'https://via.placeholder.com/400x300?text=Image+non+disponible';

  // Note fictive (à remplacer par une vraie note)
  const rating = (Math.random() * 2 + 3).toFixed(1);

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="aspect-w-4 aspect-h-3 bg-gray-100">
          <img
            src={imgError ? fallbackImage : imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-green-600 font-bold text-lg">
              {product.price.toLocaleString()} Ar
            </span>
            {product.category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Badge "Éco" */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
          Éco-friendly
        </div>
      </div>
    </Link>
  );
}