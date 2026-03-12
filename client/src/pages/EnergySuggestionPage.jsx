import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Calendar, 
  MapPin, 
  Sun, 
  Battery, 
  Zap,
  Trash2,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { getUserSimulations, deleteSimulation } from '../services/api';

export default function SimulationHistory({ onClose, onSelectSimulation }) {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      setLoading(true);
      const response = await getUserSimulations({ limit: 20 });
      setSimulations(response.data.data.simulations || []);
    } catch (err) {
      setError('Impossible de charger l\'historique');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Voulez-vous vraiment supprimer cette simulation ?')) return;

    setDeletingId(id);
    try {
      await deleteSimulation(id);
      setSimulations(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Historique des simulations</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : simulations.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune simulation enregistrée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {simulations.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-50 rounded-xl p-4 hover:shadow-md transition cursor-pointer ${
                    deletingId === sim.id ? 'opacity-50' : ''
                  }`}
                  onClick={() => onSelectSimulation({ simulation: sim, recommendations: [] })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {formatDate(sim.createdAt)}
                    </div>
                    <button
                      onClick={(e) => handleDelete(sim.id, e)}
                      disabled={deletingId === sim.id}
                      className="p-1 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-green-600" />
                      {sim.localisation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun size={14} className="text-yellow-600" />
                      {sim.nbPanneaux} panneaux
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery size={14} className="text-blue-600" />
                      {sim.capaciteBatterie} kWh
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={14} className="text-purple-600" />
                      {sim.productionAnnuelle} kWh/an
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Coût estimé: <span className="font-bold text-green-600">{sim.coutEstime.toLocaleString()} Ar</span>
                    </span>
                    <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                      <Eye size={14} />
                      Voir
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}