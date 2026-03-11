import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Colonne 1 : Logo & description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EcoVert Mada</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Plateforme intelligente pour les énergies renouvelables et la gestion écologique à Madagascar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition">Accueil</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-green-400 transition">Produits</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition">À propos</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-green-400 transition">FAQ</Link>
              </li>
              <li>
                <Link to="/livraison" className="hover:text-green-400 transition">Livraison</Link>
              </li>
              <li>
                <Link to="/retours" className="hover:text-green-400 transition">Retours</Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="hover:text-green-400 transition">Mentions légales</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Antananarivo, Madagascar</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>+261 34 12 345 67</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>contact@ecovert.mg</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 EcoVert Mada - Tous droits réservés.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/confidentialite" className="hover:text-green-400 transition">
                Politique de confidentialité
              </Link>
              <Link to="/cgu" className="hover:text-green-400 transition">
                CGU
              </Link>
            </div>
          </div>
        </div>

        {/* Badge Madagascar */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center space-x-2 bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            <img src="https://flagcdn.com/w20/mg.png" alt="Madagascar" className="w-5 h-3.5 rounded" />
            <span>Created By Christian RAVELOJAONA</span>
          </span>
        </div>
      </div>
    </footer>
  );
}