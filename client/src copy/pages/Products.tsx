import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  images?: { imageUrl: string }[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        // Adapter à la structure de réponse { success: true, data: [...] }
        setProducts(res.data.data || []);
      } catch (err: any) {
        console.error("Erreur chargement produits:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrder = async (productId: string) => {
    try {
      const res = await api.post("/orders", {
        products: [{ productId, quantity: 1 }],
      });

      // La réponse devrait être { success: true, data: { orderId, total } }
      const { orderId, total } = res.data.data;

      alert(`✅ Commande réussie ! Total : ${total} Ar`);

      // Mise à jour optimiste du stock
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock: p.stock - 1 } : p
        )
      );

      // Redirection vers le détail de la commande
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      alert(`❌ Erreur : ${message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          🌱 Produits écologiques
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Découvrez notre sélection de produits pour un mode de vie durable
        </p>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image placeholder ou réelle */}
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl text-emerald-600">🌿</span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-emerald-700">
                      {product.price.toLocaleString()} Ar
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrder(product.id)}
                    disabled={product.stock <= 0}
                    className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
                      product.stock > 0
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.stock > 0 ? (
                      <>
                        <span>🛒</span>
                        <span>Commander</span>
                      </>
                    ) : (
                      "Indisponible"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}