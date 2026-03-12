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
  Wind,
  Minus,
  Plus,
  AlertCircle
} from 'lucide-react';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addError, setAddError] = useState(null);

  // Simulation de notes et avis
  const rating = 4.5;
  const reviews = 12;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        
        // Charger des produits similaires
        const similarRes = await getProducts({ category: data.category, limit: 4 });
        let similarData = similarRes.data;
        if (Array.isArray(similarData)) {
          setSimilarProducts(similarData.filter(p => p.id !== data.id));
        } else if (similarData?.data) {
          setSimilarProducts(similarData.data.filter(p => p.id !== data.id));
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/product/${id}`));
      return;
    }

    try {
      setAddError(null);
      await addItem(product.id, quantity);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    } catch (error) {
      setAddError(error.response?.data?.error || 'Erreur lors de l\'ajout au panier');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/product/${id}`));
      return;
    }

    try {
      await addItem(product.id, quantity);
      navigate('/cart');
    } catch (error) {
      setAddError(error.response?.data?.error || 'Erreur lors de l\'ajout au panier');
    }
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

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${import.meta.env.VITE_API_URL}${product.image || ''}`;

  const images = [imageUrl, imageUrl, imageUrl];
  const currentQuantity = isInCart(product.id) ? getItemQuantity(product.id) : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Fil d'Ariane */}
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
            to={`/products?category=${product.category}`}
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

        {/* Message d'erreur */}
        <AnimatePresence>
          {addError && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{addError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message si déjà dans le panier */}
        {currentQuantity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
          >
            <PackageCheck size={20} />
            <span>
              Vous avez déjà {currentQuantity} x {product.name} dans votre panier. 
              <Link to="/cart" className="font-semibold underline ml-2 hover:text-blue-800">
                Voir le panier
              </Link>
            </span>
          </motion.div>
        )}

        {/* Produit principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100"
        >
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Galerie d'images */}
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
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles size={14} />
                  Éco-friendly
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-green-600 shadow-lg' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-24 object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Nouveauté
                  </span>
                  <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Recycle size={14} />
                    Recyclable
                  </span>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      Plus que {product.stock} en stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating} · {reviews} avis
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-green-600">
                  {product.price?.toLocaleString()} Ar
                </span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <PackageCheck size={16} />
                    En stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-6">
                  {['description', 'caractéristiques', 'avis'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium transition-colors relative ${
                        activeTab === tab 
                          ? 'text-green-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'description' && 'Description'}
                      {tab === 'caractéristiques' && 'Caractéristiques'}
                      {tab === 'avis' && `Avis (${reviews})`}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[120px]"
                >
                  {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  
                  {activeTab === 'caractéristiques' && (
                    <div className="grid grid-cols-2 gap-4">
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
                          <p className="font-medium">Gratuite</p>
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
                          <Sun className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Énergie</p>
                          <p className="font-medium">Renouvelable</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'avis' && (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-green-600">U{i}</span>
                            </div>
                            <div>
                              <p className="font-medium">Utilisateur {i}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} size={12} className={j < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Super produit, correspond parfaitement à mes attentes. Je recommande !
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Quantité et actions */}
              {product.stock > 0 ? (
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition font-medium"
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-3 border-x border-gray-300 font-medium min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition font-medium"
                        disabled={quantity >= product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={product.stock === 0}
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Ajouter au panier
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="w-full border-2 border-green-600 text-green-600 py-3 px-6 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                  >
                    Acheter maintenant
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                  Produit temporairement indisponible
                </div>
              )}

              {/* Actions secondaires */}
              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 border rounded-xl transition-all flex-1 flex items-center justify-center gap-2 ${
                    isLiked 
                      ? 'border-red-200 bg-red-50 text-red-500' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
                  {isLiked ? 'Favori' : 'Ajouter aux favoris'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex-1 flex items-center justify-center gap-2 text-gray-600"
                >
                  <Share2 size={20} />
                  Partager
                </motion.button>
              </div>

              {/* Éco-badges */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Leaf className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">100% naturel</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Recycle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Recyclable</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Wind className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Énergie verte</p>
                </div>
              </div>
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
                to={`/products?category=${product.category}`}
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