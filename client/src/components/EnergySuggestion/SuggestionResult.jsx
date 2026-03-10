import { motion } from 'framer-motion';
import { 
  Sun, 
  Battery, 
  Zap, 
  Leaf,
  TrendingUp,
  Calendar,
  Trees, // Remplacé Co2 par Trees
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SuggestionResult({ suggestion, userData }) {
  if (!suggestion) return null;

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-xl">
          <Sun className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Votre solution solaire personnalisée
        </h2>
      </div>

      {/* Badge budget */}
      {suggestion.estDansBudget !== undefined && (
        <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 ${
          suggestion.estDansBudget 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {suggestion.estDansBudget ? (
            <>
              <CheckCircle size={20} />
              <span>Cette installation est dans votre budget</span>
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              <span>Cette installation dépasse légèrement votre budget. Des alternatives sont disponibles.</span>
            </>
          )}
        </div>
      )}

      {/* Résultats principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
          <Sun className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Panneaux solaires</p>
          <p className="text-2xl font-bold text-gray-900">{suggestion.nbPanneaux}</p>
          <p className="text-xs text-gray-500">panneaux recommandés</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
          <Battery className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Capacité batterie</p>
          <p className="text-2xl font-bold text-gray-900">{suggestion.capaciteBatterie} kWh</p>
          <p className="text-xs text-gray-500">stockage recommandé</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
          <Zap className="h-8 w-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Puissance installée</p>
          <p className="text-2xl font-bold text-gray-900">{suggestion.puissanceInstallee} kW</p>
          <p className="text-xs text-gray-500">puissance totale</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
          <TrendingUp className="h-8 w-8 text-yellow-600 mb-2" />
          <p className="text-sm text-gray-600">Coût estimé</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(suggestion.coutEstime)} Ar</p>
          <p className="text-xs text-gray-500">installation complète</p>
        </div>
      </div>

      {/* Détails supplémentaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Économie annuelle</p>
          <p className="font-semibold text-green-600">{formatNumber(suggestion.economieAnnuelle)} Ar</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Retour sur investissement</p>
          <p className="font-semibold">{suggestion.retourInvestissement} ans</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">CO₂ économisé</p>
          <p className="font-semibold text-green-600">{formatNumber(suggestion.co2Economise)} kg/an</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Surface utilisée</p>
          <p className="font-semibold">{suggestion.surfaceUtilisee} m²</p>
        </div>
      </div>

      {/* Production */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Production journalière estimée</p>
          <p className="text-xl font-bold text-gray-900">{suggestion.productionJournaliere} kWh</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Production annuelle estimée</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(suggestion.productionAnnuelle)} kWh</p>
        </div>
      </div>

      {/* Récapitulatif des données saisies */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Basé sur vos informations :</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Surface: {userData?.surface} m²
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Consommation: {userData?.consommation} kWh/jour
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Localisation: {userData?.localisation}
          </span>
          {userData?.budget && (
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Budget: {formatNumber(userData.budget)} Ar
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}