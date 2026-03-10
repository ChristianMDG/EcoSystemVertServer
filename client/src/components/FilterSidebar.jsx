import { XMarkIcon, TagIcon, SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  isOpen,
  onClose,
}) {
  // Promotions actives
  const activePromos = [
    { name: 'Livraison gratuite', code: 'LIVRAISON2024', expires: '30/04/2024' },
    { name: '-10% sur les batteries', code: 'BATT10', expires: '15/04/2024' },
  ];

  const handleResetAll = () => {
    onCategoryChange('');
    onPriceRangeChange({ min: '', max: '' });
  };

  const content = (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filtres */}
        <div className="space-y-6 mb-8">
          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fourchette de prix (Ar)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceRangeChange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceRangeChange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Bouton Réinitialiser */}
          <button
            onClick={handleResetAll}
            className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Promotions */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900">Promotions actives</h4>
          </div>
          <div className="space-y-3">
            {activePromos.map((promo, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{promo.name}</span>
                  <TagIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600 mb-2">Code: <span className="font-mono font-bold text-orange-600">{promo.code}</span></p>
                <p className="text-xs text-gray-500">Valable jusqu'au {promo.expires}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guide d'achat */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Guide d'achat</h4>
          <div className="space-y-2">
            <Link to="/guide/panneaux-solaires" className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 transition group">
              <span>Choisir ses panneaux solaires</span>
              <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/guide/batteries" className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 transition group">
              <span>Guide des batteries</span>
              <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/guide/installation" className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 transition group">
              <span>Conseils d'installation</span>
              <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop
  if (!isOpen) {
    return (
      <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-20 self-start max-h-screen overflow-y-auto">
        {content}
      </aside>
    );
  }

  // Mobile
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {content}
      </div>
    </div>
  );
}