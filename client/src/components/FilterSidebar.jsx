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
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Filtre catégorie */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Catégorie</h4>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Toutes</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filtre prix */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Prix (Ar)</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Bouton réinitialiser */}
        <button
          onClick={() => {
            onCategoryChange('');
            onPriceRangeChange({ min: '', max: '' });
          }}
          className="text-sm text-green-600 hover:underline"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );

  // Version desktop : toujours visible
  if (!isOpen) {
    return <div className="hidden lg:block w-64">{content}</div>;
  }

  // Version mobile : overlay
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
      <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}