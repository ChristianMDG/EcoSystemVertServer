import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">EcoVert Mada</Link>
        <nav className="space-x-4">
          <Link to="/products" className="hover:underline">Produits</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:underline">Profil</Link>
              <button onClick={logout} className="hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Connexion</Link>
              <Link to="/register" className="hover:underline">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}