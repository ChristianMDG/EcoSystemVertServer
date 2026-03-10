import { motion } from 'framer-motion';
import { Sun, Battery, Zap, TrendingUp } from 'lucide-react';

export default function VisualizationChart({ suggestion }) {
  if (!suggestion) return null;

  // Données pour les graphiques simplifiés
  const productionData = [
    { mois: 'Jan', production: Math.round(suggestion.productionJournaliere * 30 * 0.8) },
    { mois: 'Fév', production: Math.round(suggestion.productionJournaliere * 30 * 0.85) },
    { mois: 'Mar', production: Math.round(suggestion.productionJournaliere * 30 * 0.9) },
    { mois: 'Avr', production: Math.round(suggestion.productionJournaliere * 30 * 0.95) },
    { mois: 'Mai', production: Math.round(suggestion.productionJournaliere * 30 * 1) },
    { mois: 'Juin', production: Math.round(suggestion.productionJournaliere * 30 * 0.95) },
    { mois: 'Juil', production: Math.round(suggestion.productionJournaliere * 30 * 0.9) },
    { mois: 'Août', production: Math.round(suggestion.productionJournaliere * 30 * 0.85) },
    { mois: 'Sep', production: Math.round(suggestion.productionJournaliere * 30 * 0.9) },
    { mois: 'Oct', production: Math.round(suggestion.productionJournaliere * 30 * 0.95) },
    { mois: 'Nov', production: Math.round(suggestion.productionJournaliere * 30 * 1) },
    { mois: 'Déc', production: Math.round(suggestion.productionJournaliere * 30 * 1) },
  ];

  const maxProduction = Math.max(...productionData.map(d => d.production));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Production solaire estimée par mois
      </h3>

      {/* Graphique en barres */}
      <div className="h-64 flex items-end justify-between gap-1 mb-4">
        {productionData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(data.production / maxProduction) * 180}px` }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg group-hover:from-green-600 group-hover:to-green-500 transition-all cursor-pointer relative"
            >
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {data.production} kWh
              </div>
            </motion.div>
            <span className="text-xs text-gray-600 mt-2">{data.mois}</span>
          </div>
        ))}
      </div>

      {/* Statistiques de production */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Sun className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Production annuelle</p>
          <p className="font-semibold">{suggestion.productionAnnuelle} kWh</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Battery className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Stockage</p>
          <p className="font-semibold">{suggestion.capaciteBatterie} kWh</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Autonomie</p>
          <p className="font-semibold">{Math.round(suggestion.capaciteBatterie / (suggestion.productionJournaliere / 24))}h</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Meilleur mois</p>
          <p className="font-semibold">{Math.round(maxProduction)} kWh</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        *Estimations basées sur les moyennes d'ensoleillement à {suggestion.localisation}
      </p>
    </motion.div>
  );
}