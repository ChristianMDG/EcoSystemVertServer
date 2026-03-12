import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle
} from 'lucide-react';
import AdminImageWithFallback from '../../components/ImageWithFallback';
import { getAllProducts, deleteProduct, updateStock } from '../../services/adminApi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching products with filters:', filters);
      
      const response = await getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      console.log('✅ Réponse reçue:', response.data);
      
      const responseData = response.data?.data || response.data;
      const productsData = responseData?.products || [];
      const paginationData = responseData?.pagination || pagination;
      
      setProducts(productsData);
      setPagination(paginationData);
    } catch (error) {
      console.error('❌ Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${productName}" ?`)) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      setUpdatingStock(productId);
      await updateStock(productId, newStock);
      fetchProducts();
    } catch (error) {
      console.error('Erreur mise à jour stock:', error);
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + ' Ar' || '0 Ar';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des produits</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter size={18} />
          Filtres
        </button>
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </form>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="Panneaux solaires">Panneaux solaires</option>
            <option value="Batteries">Batteries</option>
            <option value="Onduleurs">Onduleurs</option>
            <option value="Kits complets">Kits complets</option>
          </select>
        </motion.div>
      )}

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <AdminImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.stock < 10 && (
                        <AlertTriangle size={16} className="text-orange-500" title="Stock faible" />
                      )}
                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                        disabled={updatingStock === product.id}
                        className={`w-20 px-2 py-1 border rounded-lg text-center ${
                          updatingStock === product.id 
                            ? 'bg-gray-100' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Message si aucun produit */}
          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Page {pagination.page} sur {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}