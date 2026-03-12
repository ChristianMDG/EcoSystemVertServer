import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Zap,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Battery,
  Sun,
  TrendingUp
} from 'lucide-react';
import { getAllSimulations, deleteSimulation } from '../../services/adminApi';

export default function AdminSimulations() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSimulations();
  }, [pagination.page, filters]);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const response = await getAllSimulations({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setSimulations(response.data.data.simulations);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Erreur chargement simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (simId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette simulation ?')) {
      try {
        await deleteSimulation(simId);
        fetchSimulations();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchSimulations();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + ' Ar' || '0 Ar';
  };

  if (loading && simulations.length === 0) {
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
        <h1 className="text-2xl font-bold text-gray-800">Simulations énergétiques</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter size={18} />
          Filtres
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher par utilisateur, localisation..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Rechercher
            </button>
          </form>
        </motion.div>
      )}

      {/* Liste des simulations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût estimé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {simulations.map((sim) => (
                <motion.tr
                  key={sim.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{sim.user?.name}</p>
                        <p className="text-xs text-gray-500">{sim.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{sim.localisation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Sun size={14} className="text-yellow-500" />
                        <span>{sim.nbPanneaux} panneaux</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Battery size={14} className="text-green-500" />
                        <span>{sim.capaciteBatterie} kWh</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap size={14} className="text-blue-500" />
                        <span>{sim.puissanceInstallee} kW</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-green-600">
                        {formatPrice(sim.coutEstime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ROI: {sim.retourInvestissement} ans
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{formatDate(sim.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/simulations/${sim.id}`}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(sim.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
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