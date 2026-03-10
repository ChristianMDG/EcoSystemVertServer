import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Sun,
  Mail,
  Lock,
  LogIn,
  Wind,
  Droplets,
  ArrowRight,
  Battery,
  Zap,
  TreePine,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setErrorMessage(
        err.response?.data?.message || 
        "Email ou mot de passe incorrect. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col md:flex-row">
      {/* Partie Gauche - Formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8">
            {/* Logo et en-tête */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <Leaf className="text-white" size={40} />
                </div>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                EcoVert Mada
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Connectez-vous à votre espace vert
              </p>
            </div>

            {/* Message de bienvenue */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-green-100">
              <p className="text-green-800 text-xs sm:text-sm text-center">
                🌿 Heureux de vous revoir ! Ensemble pour un Madagascar plus vert
              </p>
            </div>

            {/* Message d'erreur */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="exemple@ecovert.mg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-400"
                  />
                  <label htmlFor="remember" className="text-xs sm:text-sm text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-all inline-flex items-center space-x-1"
                >
                  <span>Créer un compte</span>
                  <ArrowRight size={14} />
                </Link>
              </p>

              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span className="text-xs sm:text-sm text-gray-600">Google</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4" />
                  <span className="text-xs sm:text-sm text-gray-600">Facebook</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Partie Droite - Hero */}
      <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 text-white/30 animate-float">
            <Sun size={80} />
          </div>
          <div className="absolute bottom-20 left-20 text-white/30 animate-float animation-delay-2000">
            <Wind size={70} />
          </div>
          <div className="absolute top-40 left-40 text-white/30 animate-float animation-delay-3000">
            <Droplets size={60} />
          </div>
          <div className="absolute bottom-40 right-40 text-white/30 animate-float animation-delay-4000">
            <TreePine size={90} />
          </div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-lg"
          >
            <h2 className="text-4xl font-bold mb-6">Énergies Renouvelables</h2>
            <p className="text-xl mb-8 text-green-100">
              Plateforme intelligente pour un avenir durable à Madagascar
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Battery className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-green-200">Énergie verte</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-green-200">Installations</div>
              </div>
            </div>
            <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Suivi en temps réel de votre consommation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Optimisation énergétique intelligente</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Impact environnemental mesurable</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Communauté éco-responsable</span>
              </div>
            </div>
            <div className="mt-8 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <img src="https://flagcdn.com/w40/mg.png" alt="Madagascar" className="w-6 h-4 rounded" />
              <span className="text-sm">Fièrement malgache</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-20">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}