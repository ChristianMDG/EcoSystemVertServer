import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Leaf, 
  ChevronLeft,
  Heart,
  Share2,
  Check,
  ArrowRight,
  Sparkles,
  PackageCheck,
  Recycle,
  Sun,
  Wind
} from 'lucide-react';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Simulation de notes et avis
  const rating = 4.5;
  const reviews = 12;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        
        // CORRECTION: Extraire le produit de response.data.data
        console.log('Réponse produit:', response.data);
        
        let productData = null;
        if (response.data && response.data.data) {
          productData = response.data.data;
        } else if (response.data) {
          productData = response.data;
        }
        
        setProduct(productData);
        
        // Charger des produits similaires
        if (productData) {
          const similarRes = await getProducts({ category: productData.category, limit: 4 });
          
          let similarData = [];
          if (similarRes.data && Array.isArray(similarRes.data.data)) {
            similarData = similarRes.data.data;
          } else if (Array.isArray(similarRes.data)) {
            similarData = similarRes.data;
          }
          
          setSimilarProducts(similarData.filter(p => p.id !== productData.id));
        }
      } catch (error) {
        console.error('Erreur chargement produit:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Produit non trouvé</h2>
          <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou a été retiré.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            <ChevronLeft size={20} />
            Retour
          </button>
        </div>
      </motion.div>
    );
  }

  // CORRECTION: Construction correcte de l'URL de l'image
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${import.meta.env.VITE_API_URL}${product.image}`;

  const images = [imageUrl]; // Utiliser une seule image si vous n'en avez qu'une

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Fil d'Ariane amélioré */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto pb-2">
          <Link to="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
            Accueil
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
          <Link to="/products" className="hover:text-green-600 transition-colors whitespace-nowrap">
            Produits
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
          <Link 
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-green-600 transition-colors whitespace-nowrap"
          >
            {product.category}
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Message d'ajout au panier */}
        <AnimatePresence>
          {showAddedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <Check size={20} />
              <span>Produit ajouté au panier !</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Produit principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100"
        >
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Galerie d'images améliorée */}
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'; // Image par défaut en cas d'erreur
                  }}
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles size={14} />
                  Éco-friendly
                </div>
              </div>
            </div>

            {/* Le reste du code reste identique... */}
            {/* Informations produit améliorées */}
            <div className="space-y-6">
              {/* ... (tout le code existant après reste identique) */}
            </div>
          </div>
        </motion.div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Vous pourriez aussi aimer
              </h2>
              <Link 
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                Voir tout
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Composant helper pour l'icône ChevronRight
function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}