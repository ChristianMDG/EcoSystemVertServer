import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Zap, 
  MapPin, 
  DollarSign, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function UserInputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    surface: '',
    consommation: '',
    localisation: '',
    budget: ''
  });

  const [errors, setErrors] = useState({});

  const localisations = [
    { value: '', label: 'Sélectionnez votre localisation' },
    { value: 'Antananarivo', label: 'Antananarivo', ensoleillement: '5.2 kWh/m²/jour' },
    { value: 'Toamasina', label: 'Toamasina', ensoleillement: '4.8 kWh/m²/jour' },
    { value: 'Mahajanga', label: 'Mahajanga', ensoleillement: '5.5 kWh/m²/jour' },
    { value: 'Fianarantsoa', label: 'Fianarantsoa', ensoleillement: '4.9 kWh/m²/jour' },
    { value: 'Toliara', label: 'Toliara', ensoleillement: '5.8 kWh/m²/jour' },
    { value: 'Antsiranana', label: 'Antsiranana', ensoleillement: '5.4 kWh/m²/jour' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.surface || parseFloat(formData.surface) <= 0) {
      newErrors.surface = 'La surface doit être supérieure à 0';
    }
    if (!formData.consommation || parseFloat(formData.consommation) <= 0) {
      newErrors.consommation = 'La consommation doit être supérieure à 0';
    }
    if (!formData.localisation) {
      newErrors.localisation = 'Veuillez sélectionner une localisation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const getEnsoleillement = () => {
    const loc = localisations.find(l => l.value === formData.localisation);
    return loc?.ensoleillement;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Configurez votre projet solaire
        </h2>
        <p className="text-gray-600">
          Remplissez les informations ci-dessous pour obtenir une estimation personnalisée
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Surface */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surface disponible (m²)
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                step="0.1"
                min="1"
                value={formData.surface}
                onChange={(e) => handleInputChange('surface', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.surface ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 40"
              />
            </div>
            {errors.surface && (
              <p className="mt-1 text-sm text-red-600">{errors.surface}</p>
            )}
          </div>

          {/* Consommation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consommation électrique (kWh/jour)
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.consommation}
                onChange={(e) => handleInputChange('consommation', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.consommation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 4"
              />
            </div>
            {errors.consommation && (
              <p className="mt-1 text-sm text-red-600">{errors.consommation}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Consultez votre facture d'électricité
            </p>
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.localisation}
                onChange={(e) => handleInputChange('localisation', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none ${
                  errors.localisation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {localisations.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.localisation && (
              <p className="mt-1 text-sm text-red-600">{errors.localisation}</p>
            )}
            {getEnsoleillement() && (
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                <Info size={12} />
                Ensoleillement moyen: {getEnsoleillement()}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget estimé (Ar)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                min="0"
                step="100000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Ex: 3000000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Optionnel - pour des recommandations adaptées
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <Info size={18} />
            Informations importantes
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• L'estimation est basée sur des données moyennes pour Madagascar</li>
            <li>• Les prix peuvent varier selon les installateurs et la qualité des équipements</li>
            <li>• Un devis personnalisé est recommandé pour une installation précise</li>
          </ul>
        </div>

        {/* Bouton de soumission */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Calcul en cours...</span>
            </>
          ) : (
            <>
              <span>Calculer ma solution solaire</span>
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}