import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Leaf, 
  ChevronLeft,
  Heart,
  Share2
} from 'lucide-react';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Simulation de notes et avis
  const rating = 4.5;
  const reviews = 12;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        // Charger des produits similaires (même catégorie)
        const similarRes = await getProducts({ category: data.category, limit: 4 });
        let similarData = similarRes.data;
        if (Array.isArray(similarData)) {
          setSimilarProducts(similarData.filter(p => p.id !== data.id));
        } else if (similarData?.products) {
          setSimilarProducts(similarData.products.filter(p => p.id !== data.id));
        }
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <Leaf className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Produit non trouvé</h2>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été retiré.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          <ChevronLeft size={20} />
          Retour aux produits
        </Link>
      </div>
    );
  }

  // Générer une URL d'image absolue si nécessaire
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${import.meta.env.VITE_API_URL}${product.image || product.imageUrl}`;

  // Images simulées (si le produit n'a qu'une image, on la duplique pour l'exemple)
  const images = [imageUrl, imageUrl, imageUrl]; // À remplacer par un vrai tableau si disponible

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-green-600">Produits</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Produit principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Galerie d'images */}
            <div className="space-y-4">
              <div className="aspect-w-2 aspect-h-2 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx ? 'border-green-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{rating} · {reviews} avis</span>
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">Éco-friendly</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-green-600">{product.price.toLocaleString()} Ar</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">En stock</span>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">Rupture de stock</span>
                )}
              </div>

              {/* Caractéristiques */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Livraison</p>
                    <p className="font-medium">Gratuite à partir de 50 000 Ar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Garantie</p>
                    <p className="font-medium">2 ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-medium">{product.stock} unités</p>
                  </div>
                </div>
              </div>

              {/* Quantité et actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                  <Heart size={20} className="text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Avis clients (simulés) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 mb-12">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-600">U{i}</span>
                  </div>
                  <div>
                    <p className="font-semibold">Utilisateur {i}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className={j < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">Il y a 3 jours</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Super produit, correspond parfaitement à mes attentes. Livraison rapide et emballage soigné. Je recommande !
                </p>
              </div>
            ))}
          </div>
          <button className="mt-6 text-green-600 font-semibold hover:underline">Voir tous les avis →</button>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}