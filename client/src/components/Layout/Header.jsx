import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, User, Menu, X, Heart, ShoppingBag, LogOut, AlertCircle } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const getInitial = () => user?.name ? user.name.charAt(0).toUpperCase() : null;

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Panneaux solaires', path: '/products?category=Panneaux%20solaires' },
    { name: 'Éoliennes', path: '/products?category=Éoliennes' },
    { name: 'Accessoires', path: '/products?category=Accessoires' },
  ];

  const isActive = (path) => location.pathname + location.search === path;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              EcoVert Mada
            </span>
          </Link>

          {/* Navigation centrale (cachée sur mobile) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  isActive(link.path) ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur (favoris, panier, compte) */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-700 hover:text-green-600 transition-colors relative">
              <Heart size={22} />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="text-gray-700 hover:text-green-600 transition-colors relative">
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {getInitial() ? (
                      <span className="text-green-600 font-semibold text-sm">
                        {getInitial()}
                      </span>
                    ) : (
                      <User size={18} className="text-green-600" />
                    )}
                  </div>
                  <span className="hidden lg:inline">{user.name?.split(' ')[0] || 'Profil'}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2 text-gray-700 relative">
              <ShoppingBag size={24} />
              <span className="absolute top-1 right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Modal de confirmation de déconnexion avec flou */}
      {showLogoutConfirm && (
        <>
          {/* Overlay flouté */}
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50"></div>
          
          {/* Modal centré */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Confirmer la déconnexion
                  </h3>
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}