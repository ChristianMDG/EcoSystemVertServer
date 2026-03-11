import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Leaf,
  Sun,
  Wind,
  Droplets,
  Recycle,
  Sparkles
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ 
    category: '', 
    minPrice: '', 
    maxPrice: '',
    ecoScore: ''
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Catégories disponibles
  const categories = [
    'Énergie solaire',
    'Éolienne',
    'Hydraulique',
    'Biomasse',
    'Géothermie',
    'Recyclage'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const response = await getProducts(params);
        
        console.log('Réponse produits:', response.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
          setPagination(response.data.pagination);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.error('Format inattendu:', response.data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Erreur chargement produits:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.minPrice, filters.maxPrice]);

  // Filtrer par recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', ecoScore: '' });
    setSearchTerm('');
  };

  const handleCategoryClick = (category) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === category ? '' : category 
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section avec recherche */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            Produits Écologiques
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-center mb-8 text-green-100"
          >
            Découvrez notre sélection de produits respectueux de l'environnement
          </motion.p>
          
          {/* Barre de recherche inspirée d'Airbnb */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-full shadow-lg flex items-center p-1">
              <div className="flex-1 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit écologique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-3 focus:outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition flex items-center gap-2"
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>
          </motion.div>

          {/* Catégories rapides */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === cat
                    ? 'bg-white text-green-700 shadow-md'
                    : 'bg-green-500/20 text-white hover:bg-green-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-green-600" />
                    Filtres avancés
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Filtre par catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre prix min */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (Ar)
                    </label>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filtre prix max */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix maximum (Ar)
                    </label>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="1000000"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Score éco (simulé) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact écologique
                    </label>
                    <select
                      name="ecoScore"
                      value={filters.ecoScore}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="A">Excellent (A)</option>
                      <option value="B">Bon (B)</option>
                      <option value="C">Moyen (C)</option>
                    </select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* En-tête avec résultats */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredProducts.length} produit(s) trouvé(s)
            </h2>
            {pagination && (
              <p className="text-sm text-gray-500">
                Page {pagination.page} sur {pagination.totalPages}
              </p>
            )}
          </div>
          
          {/* Tri (simulé) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Trier par:</span>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-600">
              Pertinence
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Grille de produits */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm"
          >
            <div className="max-w-md mx-auto">
              <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
              >
                Effacer tous les filtres
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Badges éco */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Leaf, label: '100% Naturel', color: 'text-green-600' },
            { icon: Recycle, label: 'Recyclable', color: 'text-blue-600' },
            { icon: Sun, label: 'Énergie verte', color: 'text-yellow-600' },
            { icon: Wind, label: 'Zéro émission', color: 'text-emerald-600' },
          ].map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
            >
              <div className={`p-2 bg-gray-50 rounded-lg ${badge.color}`}>
                <badge.icon size={24} />
              </div>
              <span className="font-medium text-gray-700">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}