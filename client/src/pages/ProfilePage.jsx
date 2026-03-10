import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div className="text-center p-8">Veuillez vous connecter.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <div className="bg-white shadow rounded p-6">
        <p><strong>Nom :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        {/* Ajoutez d'autres informations si nécessaire */}
      </div>
    </div>
  );
}