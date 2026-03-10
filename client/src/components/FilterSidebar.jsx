import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  isOpen,
  onClose,
}) {
  const content = (
    <div className="h-full bg-white p-6 border-r border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-8">
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
            Prix (Ar)
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

        {/* Réinitialiser */}
        <button
          onClick={() => {
            onCategoryChange('');
            onPriceRangeChange({ min: '', max: '' });
          }}
          className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors inline-flex items-center gap-1"
        >
          <span>Réinitialiser les filtres</span>
        </button>
      </div>
    </div>
  );

  // Desktop : fixe à gauche
  if (!isOpen) {
    return (
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start max-h-screen overflow-y-auto">
        {content}
      </aside>
    );
  }

  // Mobile : overlay
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay sombre avec fermeture au clic */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      {/* Panneau latéral */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {content}
      </div>
    </div>
  );
}