import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Battery, 
  Zap, 
  Leaf,
  ArrowRight,
  ChevronLeft,
  Download,
  Share2,
  Sparkles,
  MapPin,
  Home,
  TrendingUp,
  Calendar,
  Award,
  RefreshCw
} from 'lucide-react';
import UserInputForm from '../components/EnergySuggestion/UserInputForm';
import SuggestionResult from '../components/EnergySuggestion/SuggestionResult';
import VisualizationChart from '../components/EnergySuggestion/VisualizationChart';
import ProductRecommendations from '../components/EnergySuggestion/ProductRecommendations';

export default function EnergySuggestionPage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // Auto-hide tips après 5 secondes
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setShowTips(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const calculateSuggestion = (data) => {
    setLoading(true);
    
    setTimeout(() => {
      const surface = parseFloat(data.surface) || 0;
      const consommation = parseFloat(data.consommation) || 0;
      const budget = parseFloat(data.budget) || 0;

      // Algorithmes améliorés
      const nbPanneaux = Math.max(1, Math.ceil(consommation / 1.5));
      const capaciteBatterie = Math.ceil(consommation * 0.7);
      const puissanceInstallee = (nbPanneaux * 0.4).toFixed(1);
      const coutEstime = nbPanneaux * 350000 + capaciteBatterie * 200000;
      
      // Facteur d'ensoleillement par région
      const facteurEnsoleillement = {
        'Antananarivo': 1,
        'Toamasina': 0.92,
        'Mahajanga': 1.06,
        'Fianarantsoa': 0.94,
        'Toliara': 1.12,
        'Antsiranana': 1.04
      }[data.localisation] || 1;

      // Calculs avancés
      const productionReelle = nbPanneaux * 1.5 * facteurEnsoleillement;
      const productionJournaliere = productionReelle.toFixed(1);
      const productionAnnuelle = Math.round(productionReelle * 365);
      
      const economieAnnuelle = Math.round(productionAnnuelle * 500 / 1000);
      const retourInvestissement = Math.ceil(coutEstime / economieAnnuelle);
      const co2Economise = Math.round(productionAnnuelle * 0.5);
      const surfaceUtilisee = (nbPanneaux * 1.8).toFixed(1);

      // Taux d'autonomie
      const autonomie = Math.min(100, Math.round((productionJournaliere / consommation) * 100));

      // Vérification budget
      const estDansBudget = budget === 0 || coutEstime <= budget * 1.2;

      setSuggestion({
        nbPanneaux,
        capaciteBatterie,
        puissanceInstallee,
        coutEstime: Math.round(coutEstime / 100000) * 100000,
        economieAnnuelle: Math.round(economieAnnuelle / 100000) * 100000,
        retourInvestissement,
        co2Economise,
        surfaceUtilisee,
        productionJournaliere,
        productionAnnuelle,
        autonomie,
        estDansBudget,
        facteurEnsoleillement,
        localisation: data.localisation,
        recommandations: getProductRecommendations(nbPanneaux, capaciteBatterie, estDansBudget)
      });
      
      setLoading(false);
      setStep(2);
    }, 1800);
  };

  const getProductRecommendations = (nbPanneaux, capaciteBatterie, estDansBudget) => {
    const baseProducts = [
      {
        id: 1,
        name: `Kit Solaire Premium ${nbPanneaux}P`,
        description: `Pack complet avec ${nbPanneaux} panneaux monocristallins haute efficacité`,
        price: nbPanneaux * 350000,
        image: '/images/panneau-solaire.jpg',
        rating: 4.8,
        reviews: 124,
        badge: 'Recommandé'
      },
      {
        id: 2,
        name: `Batterie Lithium ${capaciteBatterie}kWh`,
        description: 'Batterie nouvelle génération avec 6000 cycles',
        price: capaciteBatterie * 200000,
        image: '/images/batterie.jpg',
        rating: 4.9,
        reviews: 89,
        badge: 'Meilleur rapport qualité/prix'
      },
      {
        id: 3,
        name: 'Onduleur Hybride 5kW',
        description: 'Onduleur avec régulateur MPPT double entrée',
        price: 450000,
        image: '/images/onduleur.jpg',
        rating: 4.7,
        reviews: 56,
        badge: estDansBudget ? 'Dans votre budget' : 'Premium'
      }
    ];

    if (!estDansBudget) {
      // Ajouter une alternative économique
      baseProducts.push({
        id: 4,
        name: 'Pack Économique 3P',
        description: 'Solution d\'entrée de gamme pour petits budgets',
        price: 950000,
        image: '/images/economique.jpg',
        rating: 4.5,
        reviews: 32,
        badge: 'Économique'
      });
    }

    return baseProducts;
  };

  const handleSubmit = (data) => {
    setUserData(data);
    calculateSuggestion(data);
  };

  const handleReset = () => {
    setStep(1);
    setUserData(null);
    setSuggestion(null);
    setShowTips(true);
  };

  const handleDownloadReport = () => {
    alert('📄 Génération du rapport personnalisé...');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('🔗 Lien copié dans le presse-papiers !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero section avec parallax effect */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-20 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-2xl">
              <Sun className="h-20 w-20 md:h-24 md:w-24 text-yellow-300" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Simulateur Énergie Solaire
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 px-4"
          >
            Découvrez la solution solaire idéale pour votre maison à Madagascar
          </motion.p>

          {/* Stats rapides */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm">🔋 500+ installations</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm">⭐ 4.8/5 satisfaction</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm">🌍 98% énergie verte</span>
            </div>
          </motion.div>
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,74.7C96,85,192,107,288,106.7C384,107,480,85,576,74.7C672,64,768,64,864,74.7C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Indicateur d'étape amélioré */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Barre de progression */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: step === 1 ? "0%" : "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Étapes */}
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                    step >= 1 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}
                  animate={{ scale: step === 1 ? 1.1 : 1 }}
                >
                  1
                </motion.div>
                <span className="mt-2 text-sm font-medium text-gray-600">Vos besoins</span>
                {step === 1 && (
                  <span className="text-xs text-green-600 mt-1">En cours</span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                    step >= 2 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}
                  animate={{ scale: step === 2 ? 1.1 : 1 }}
                >
                  2
                </motion.div>
                <span className="mt-2 text-sm font-medium text-gray-600">Votre solution</span>
                {step === 2 && (
                  <span className="text-xs text-green-600 mt-1">Complété</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips intelligents */}
      <AnimatePresence>
        {showTips && step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 mb-6"
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    💡 Astuce : Pour une estimation plus précise, munissez-vous de votre dernière facture d'électricité. Vous y trouverez votre consommation en kWh.
                  </p>
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <UserInputForm onSubmit={handleSubmit} loading={loading} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Bouton retour flottant */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-2 group"
                >
                  <div className="bg-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-sm font-medium">Nouvelle simulation</span>
                </motion.button>

                {/* Badge résultat */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Résultat personnalisé pour {userData?.localisation}
                  </span>
                </div>

                {/* Résultats principaux */}
                <SuggestionResult 
                  suggestion={suggestion} 
                  userData={userData}
                />

                {/* Visualisation */}
                <VisualizationChart suggestion={suggestion} />

                {/* Produits recommandés */}
                <ProductRecommendations products={suggestion?.recommandations || []} />

                {/* Actions améliorées */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Prochaines étapes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={handleDownloadReport}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                    >
                      <Download size={18} />
                      <span>Rapport PDF</span>
                    </button>
                    <button
                      onClick={() => window.location.href = '/products?category=Panneaux%20solaires'}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium"
                    >
                      <ArrowRight size={18} />
                      <span>Voir les produits</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      <Share2 size={18} />
                      <span>Partager</span>
                    </button>
                  </div>
                </motion.div>

                {/* Bouton refaire une simulation */}
                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <RefreshCw size={16} />
                    <span className="text-sm">Faire une nouvelle simulation</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Section avantages améliorée */}
      <div className="bg-gradient-to-b from-white to-green-50 border-t border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-4"
          >
            Pourquoi choisir notre simulateur ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            Un outil conçu par des experts pour vous aider à faire le meilleur choix
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Précis et fiable",
                desc: "Algorithmes basés sur des données réelles d'installation à Madagascar",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Battery,
                title: "Personnalisé",
                desc: "Une solution adaptée à votre situation spécifique et votre budget",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Leaf,
                title: "Écologique",
                desc: "Calcul précis de l'impact environnemental de votre installation",
                color: "from-blue-500 to-cyan-500"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all group"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Badge de confiance */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Plus de 500 simulations réalisées</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Satisfaction client 4.8/5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Mise à jour mensuelle des données</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}