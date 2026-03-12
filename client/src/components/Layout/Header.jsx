import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  Leaf,
  User,
  Menu,
  X,
  Heart,
  ShoppingBag,
  LogOut,
  AlertCircle,
  ChevronDown,
  Home,
  Package,
  Sun,
  Wind,
  Battery,
  Sparkles,
  Calculator, // Icône pour le simulateur
} from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu utilisateur au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : null;

  const navLinks = [
    { name: "Accueil", path: "/", icon: Home },
    { name: "Produits", path: "/products", icon: Package },
    {
      name: "Panneaux solaires",
      path: "/products?category=Panneaux%20solaires",
      icon: Sun,
    },
    { name: "Éoliennes", path: "/products?category=Éoliennes", icon: Wind },
    {
      name: "Accessoires",
      path: "/products?category=Accessoires",
      icon: Battery,
    },
    {
      name: "Simulateur",
      path: "/energy-simulator",
      icon: Calculator,
      highlight: true,
    },
  ];

  const isActive = (path) => location.pathname + location.search === path;

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
    setIsMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Fonction pour gérer la navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const { itemCount } = useCart();
  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white border-b border-gray-200 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo avec animation */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <Leaf className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hidden sm:block">
                EcoVert Mada
              </span>
            </button>

            {/* Navigation desktop avec icônes */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-green-50 text-green-700 shadow-sm"
                        : link.highlight
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-md hover:scale-105"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions utilisateur desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* Favoris avec animation */}
              <button
                onClick={() => handleNavigation("/favorites")}
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors group"
              >
                <Heart
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  3
                </span>
              </button>

              {/* Panier avec animation */}
              <button
                onClick={() => handleNavigation("/cart")}
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors group"
              >
                <ShoppingBag
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Badge éco-friendly */}
              <div className="hidden xl:flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-100 mr-2">
                <Sparkles size={16} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Éco-responsable
                </span>
              </div>

              {/* Menu utilisateur avec dropdown */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {getInitial()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        Mon profil
                      </button>
                      <button
                        onClick={() => handleNavigation("/orders")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        Mes commandes
                      </button>
                      <button
                        onClick={() => handleNavigation("/favorites")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        Mes favoris
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-full transition-all"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => handleNavigation("/cart")}
                className="relative p-2 text-gray-700"
              >
                <ShoppingBag size={24} />
                <span className="absolute top-1 right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNavigation(link.path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        link.highlight
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}

                <div className="border-t border-gray-200 my-2 pt-2">
                  {user ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors w-full text-left"
                      >
                        <User size={20} />
                        Profil
                      </button>
                      <button
                        onClick={() => handleNavigation("/orders")}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors w-full text-left"
                      >
                        <Package size={20} />
                        Commandes
                      </button>
                      <button
                        onClick={() => handleNavigation("/favorites")}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors w-full text-left"
                      >
                        <Heart size={20} />
                        Favoris
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={20} />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors w-full text-left"
                      >
                        <User size={20} />
                        Connexion
                      </button>
                      <button
                        onClick={() => handleNavigation("/register")}
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg transition-all w-full text-left"
                      >
                        <User size={20} />
                        Inscription
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de confirmation */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={handleCancelLogout}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Confirmer la déconnexion
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleCancelLogout}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
