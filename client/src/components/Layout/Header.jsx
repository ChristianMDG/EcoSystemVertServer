// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Leaf, Search, User, Menu, X, Globe } from 'lucide-react';

// export default function Header() {
//   const { user, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex items-center justify-between gap-4 md:gap-8">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 shrink-0">
//             <div className="bg-green-600 p-2 rounded-lg">
//               <Leaf className="text-white" size={24} />
//             </div>
//             <span className="text-xl font-bold text-gray-900 hidden sm:block">
//               EcoVert Mada
//             </span>
//           </Link>

//           {/* Barre de recherche (inspirée Airbnb) */}
//           <div className="flex-1 hidden md:block max-w-2xl mx-auto">
//             <div className={`
//               relative flex items-center border rounded-full 
//               ${isSearchFocused ? 'border-gray-400 shadow-md' : 'border-gray-300'}
//               transition-all duration-200
//             `}>
//               <button className="flex-1 px-4 py-2 text-left text-gray-600 hover:text-gray-900">
//                 <span className="font-medium">Où ?</span>
//                 <span className="mx-2 text-gray-400">|</span>
//                 <span className="font-medium">Quand ?</span>
//                 <span className="mx-2 text-gray-400">|</span>
//                 <span className="text-gray-500">Ajouter des filtres</span>
//               </button>
//               <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors mr-2">
//                 <Search size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Menu utilisateur desktop */}
//           <div className="hidden md:flex items-center gap-4">
//             <button className="text-gray-700 hover:text-gray-900">
//               <Globe size={20} />
//             </button>
            
//             {user ? (
//               <div className="flex items-center gap-4">
//                 <Link 
//                   to="/profile" 
//                   className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
//                 >
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <User size={18} className="text-green-600" />
//                   </div>
//                   <span className="hidden lg:inline">{user.name || 'Profil'}</span>
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="text-gray-700 hover:text-gray-900 text-sm font-medium"
//                 >
//                   Déconnexion
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
//                 >
//                   Connexion
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
//                 >
//                   Inscription
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Menu mobile */}
//           <div className="md:hidden flex items-center gap-2">
//             <button className="p-2 text-gray-700">
//               <Search size={24} />
//             </button>
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 text-gray-700"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Menu mobile déroulant */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 py-2 border-t border-gray-200">
//             <div className="flex flex-col space-y-2">
//               {user ? (
//                 <>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
//                   >
//                     Profil
//                   </Link>
//                   <button
//                     onClick={logout}
//                     className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
//                   >
//                     Déconnexion
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
//                   >
//                     Connexion
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
//                   >
//                     Inscription
//                   </Link>
//                 </>
//               )}
//               <Link
//                 to="/products"
//                 className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
//               >
//                 Produits
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Search, User, Menu, X, Globe } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getInitial = () => user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              EcoVert Mada
            </span>
          </Link>

          {/* Barre de recherche */}
          <div className="flex-1 hidden md:block max-w-2xl mx-auto">
            <div className={`
              relative flex items-center border rounded-full 
              ${isSearchFocused ? 'border-gray-400 shadow-md' : 'border-gray-300'}
              transition-all duration-200
            `}>
              <button className="flex-1 px-4 py-2 text-left text-gray-600 hover:text-gray-900">
                <span className="font-medium">Où ?</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-medium">Quand ?</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500">Ajouter des filtres</span>
              </button>
              <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors mr-2">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Menu utilisateur desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-700 hover:text-gray-900">
              <Globe size={20} />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
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
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                >
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
            <button className="p-2 text-gray-700">
              <Search size={24} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Inscription
                  </Link>
                </>
              )}
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Produits
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}