import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Zap,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Gestion du thème avec localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return savedTheme;
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Appliquer le thème au chargement et quand il change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('admin-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Notifications simulées
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nouvelle commande #ORD-001', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Stock faible pour "Panneau solaire 300W"', time: 'Il y a 30 min', read: false },
    { id: 3, title: 'Nouvel utilisateur inscrit', time: 'Il y a 2h', read: true },
  ]);

  const navigation = [
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Simulations', href: '/admin/simulations', icon: Zap },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Styles dynamiques selon le thème
  const sidebarClasses = `fixed left-0 top-0 h-full shadow-2xl z-30 overflow-hidden transition-colors duration-300 ${
    theme === 'dark' 
      ? 'bg-gradient-to-b from-gray-800 to-gray-900' 
      : 'bg-gradient-to-b from-green-800 to-green-900'
  }`;

  const headerClasses = `fixed right-0 top-0 z-20 transition-all duration-300 border-b ${
    theme === 'dark'
      ? 'bg-gray-800/90 border-gray-700'
      : 'bg-white/90 border-gray-200'
  }`;

  const mainContentClasses = `min-h-screen transition-colors duration-300 ${
    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  }`;

  const buttonClasses = `p-2 rounded-lg transition-colors duration-200 ${
    theme === 'dark'
      ? 'hover:bg-gray-700 text-gray-300'
      : 'hover:bg-gray-100 text-gray-600'
  }`;

  const dropdownClasses = `absolute right-0 mt-2 w-56 rounded-lg shadow-xl border overflow-hidden z-50 transition-colors duration-200 ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200'
  }`;

  return (
    <div className={mainContentClasses}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className={sidebarClasses}
      >
        {/* Logo avec "Administrator" */}
        <div className={`h-20 flex items-center justify-between px-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-green-700'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}>
              <span className={`font-bold text-xl ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                A
              </span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl text-white">
                Administrator
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg transition ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-green-700'
            }`}
          >
            {sidebarOpen ? 
              <ChevronLeft size={20} className="text-white" /> : 
              <ChevronRight size={20} className="text-white" />
            }
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => {
                const baseClasses = "flex items-center gap-3 px-3 py-3 rounded-lg transition-all";
                if (theme === 'dark') {
                  return `${baseClasses} ${
                    isActive 
                      ? 'bg-gray-700 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`;
                } else {
                  return `${baseClasses} ${
                    isActive 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`;
                }
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-green-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="font-bold text-lg text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1">
                  <p className="font-medium truncate text-white">{user?.name}</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-green-300'
                  }`}>
                    Administrateur
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-green-700'
                  }`}
                  title="Déconnexion"
                >
                  <LogOut size={18} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top bar simplifié */}
        <header 
          className={headerClasses}
          style={{ left: sidebarOpen ? 280 : 80 }}
        >
          <div className="h-full px-8 flex items-center justify-end">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={buttonClasses}
                >
                  <Search size={20} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 z-50"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className={`w-full px-4 py-2 border rounded-lg shadow-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={buttonClasses}
                aria-label="Changer de thème"
              >
                {theme === 'light' ? 
                  <Moon size={20} /> : 
                  <Sun size={20} className="text-yellow-400" />
                }
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`${buttonClasses} relative`}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl border overflow-hidden z-50 ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`p-4 border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b ${
                              theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                            } ${
                              !notification.read 
                                ? theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                                : ''
                            }`}
                          >
                            <p className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center gap-2 p-2 rounded-lg transition ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={dropdownClasses}
                    >
                      <div className={`px-4 py-3 border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user?.name}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {user?.email}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <User size={16} />
                        Mon profil
                      </button>
                      
                      <hr className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-20 min-h-screen p-8">
          <Outlet />
        </main>
      </div>

      {/* Bouton pour remonter */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition z-40 ${
          theme === 'dark'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default AdminLayout;