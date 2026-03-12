import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Sun, 
  Wind, 
  Recycle,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  Star,
  ChevronRight,
  Battery,
  Home,
  Zap,
  Droplets,
  Trees,
  Globe,
  Award,
  Users,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  ChevronUp, 
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Facebook,
  Youtube,
  Github
} from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

// Configuration des animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);
  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Propriétaire maison",
      content: "Installation rapide et professionnelle. Les économies sur ma facture sont immédiates. Je recommande vivement cette solution écologique et économique.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108777-2961285e9ab9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      location: "Paris",
      savings: "45%"
    },
    {
      id: 2,
      name: "Thomas Dubois",
      role: "Entrepreneur",
      content: "La qualité des produits est exceptionnelle. Le service client est réactif et compétent. Un investissement rentable sur le long terme.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      location: "Lyon",
      savings: "52%"
    },
    {
      id: 3,
      name: "Marie Laurent",
      role: "Architecte",
      content: "Une gamme complète de produits design et performants. L'intégration esthétique est parfaite pour mes projets architecturaux.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      location: "Bordeaux",
      savings: "38%"
    },
    {
      id: 4,
      name: "Philippe Moreau",
      role: "Agriculteur",
      content: "Solution idéale pour mon exploitation. Indépendance énergétique et réduction significative des coûts.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      location: "Toulouse",
      savings: "60%"
    }
  ];

  const stats = [
    { icon: Users, value: '15K+', label: 'Clients satisfaits', change: '+25%' },
    { icon: TrendingUp, value: '40%', label: "D'économies moyennes", change: '+8%' },
    { icon: Globe, value: '200T', label: 'CO₂ évité', change: '+120T' },
    { icon: Award, value: '25+', label: 'Prix internationaux', change: '+5' }
  ];

  const categories = [
    { name: 'Panneaux solaires', icon: Sun, count: 24, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50' },
    { name: 'Éoliennes', icon: Wind, count: 12, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50' },
    { name: 'Batteries', icon: Battery, count: 18, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
    { name: 'Recyclage', icon: Recycle, count: 8, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50' },
    { name: 'Pompes à chaleur', icon: Home, count: 15, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
    { name: 'Hydraulique', icon: Droplets, count: 6, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' },
    { name: 'Biomasse', icon: Trees, count: 9, color: 'from-lime-500 to-green-500', bg: 'bg-lime-50' },
    { name: 'Électroménager', icon: Zap, count: 21, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50' }
  ];

  const features = [
    { icon: Shield, title: 'Garantie 5 ans', desc: 'Tous nos produits sont garantis', color: 'from-blue-500 to-indigo-500' },
    { icon: Truck, title: 'Livraison offerte', desc: 'Dès 500 000 Ar d\'achat', color: 'from-emerald-500 to-teal-500' },
    { icon: Heart, title: 'Support 24/7', desc: 'Une équipe à votre écoute', color: 'from-rose-500 to-pink-500' },
    { icon: CheckCircle, title: 'Certifié CE', desc: 'Normes internationales', color: 'from-amber-500 to-orange-500' }
  ];

  const blogPosts = [
    {
      title: "Guide complet des panneaux solaires",
      excerpt: "Comment choisir, installer et optimiser vos panneaux pour une efficacité maximale",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "12 Mars 2024",
      readTime: "8 min",
      author: "Sophie Martin",
      authorImage: "https://images.unsplash.com/photo-1494790108777-2961285e9ab9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
      title: "Batteries domestiques : le guide",
      excerpt: "Stockez votre énergie pour une indépendance totale et des économies maximales",
      image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "8 Mars 2024",
      readTime: "6 min",
      author: "Thomas Dubois",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
      title: "Aides financières 2024",
      excerpt: "Toutes les subventions, crédits d'impôt et primes pour vos installations",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "5 Mars 2024",
      readTime: "5 min",
      author: "Marie Laurent",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    }
  ];

  const partners = [
    { name: 'GreenPeace', logo: '🌱' },
    { name: 'WWF', logo: '🐼' },
    { name: 'UNEP', logo: '🌍' },
    { name: 'SolarImpulse', logo: '☀️' },
    { name: 'EnergyWeb', logo: '⚡' },
    { name: 'EcoAct', logo: '♻️' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 8 });
        let productsArray = [];
        const data = response.data;

        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data && Array.isArray(data.data)) {
          productsArray = data.data;
        }

        setFeaturedProducts(productsArray.slice(0, 4));
        setTrendingProducts(productsArray.slice(4, 8));
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement produits:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Vidéos pour la section showcase
  const videos = [
    {
      id: 1,
      title: "Installation solaire",
      description: "Découvrez comment nous installons nos panneaux",
      thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      duration: "2:30"
    },
    {
      id: 2,
      title: "Batteries domestiques",
      description: "Stockez votre énergie pour une indépendance totale",
      thumbnail: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      duration: "3:15"
    },
    {
      id: 3,
      title: "Éoliennes urbaines",
      description: "L'énergie du vent à portée de main",
      thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      duration: "2:45"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* Curseur personnalisé (optionnel) */}
      <motion.div
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference hidden lg:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="w-full h-full rounded-full bg-white opacity-50" />
      </motion.div>

      {/* Barre de progression */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Header flottant */}
      <motion.header
        style={{ backgroundColor: headerBg, backdropFilter: scrolled ? 'blur(12px)' : 'none' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-3 shadow-lg' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-green-600 rounded-xl opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </div>
            <span className="font-bold text-xl text-gray-900">EcoVert</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Produits', 'Solutions', 'Blog', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              <span>S'inscrire</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section avec parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 25 }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Nouveau : Simulateur énergétique</span>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full ml-2">Beta</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 mb-6"
              >
                L'énergie
                <span className="block font-bold mt-2">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                    de demain
                  </span>
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed"
              >
                Des solutions énergétiques intelligentes pour un avenir plus durable. 
                Performance, design et responsabilité environnementale.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/products"
                  className="group bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <span className="relative z-10">Explorer</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                <Link
                  to="/energy-simulator"
                  className="group bg-transparent border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Simuler
                  <Zap className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Stats avec animations */}
              <motion.div 
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                className="grid grid-cols-4 gap-6 mt-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="relative group"
                  >
                    <div className="text-3xl font-light text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    <motion.div
                      className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {stat.change}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right image avec animations 3D */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative perspective-1000"
            >
              <motion.div
                animate={{ rotateY: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="relative transform-3d"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                    alt="Panneaux solaires"
                    className="w-full h-full object-cover hover:scale-110 transition duration-700"
                  />
                </div>
                
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl backdrop-blur-sm bg-white/90"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sun className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Économies</div>
                      <div className="text-3xl font-light text-gray-900">-40%</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl backdrop-blur-sm bg-white/90"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">CO₂ évité</div>
                      <div className="text-3xl font-light text-gray-900">2.5T</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Cercles décoratifs */}
              <div className="absolute -z-10 inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Features avec icônes animées */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Pourquoi nous choisir</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-4 mb-6">
              Une excellence à tous les niveaux
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des produits de qualité supérieure et un service client exceptionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition -z-10 blur-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories avec effet de carte */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Catégories</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-4 mb-6">
              Explorez par besoin
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des solutions adaptées à chaque situation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="block"
                >
                  <div className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition`} />
                    <div className={`w-20 h-20 ${category.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition shadow-lg`}>
                      <category.icon className={`h-10 w-10 text-${category.color.split(' ')[1]}`} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-400">{category.count} produits</p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                      <ChevronRight className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="flex justify-between items-end mb-16">
            <div>
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Nouveautés</span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-4">
                Dernières innovations
              </h2>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition pb-2"
            >
              Voir tout
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-green-600 animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Showcase vidéo */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-medium text-green-400 uppercase tracking-wider">En action</span>
            <h2 className="text-4xl md:text-5xl font-light text-white mt-4 mb-6">
              Voyez par vous-même
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Découvrez nos solutions en action à travers ces vidéos
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={scaleIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setActiveVideo(index)}
              >
                <div className="aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{video.description}</p>
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
                        <Play className="h-5 w-5 text-white" />
                      </button>
                      <span className="text-sm text-gray-300">{video.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages avec effet de carte */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Témoignages</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-4 mb-6">
              Ce qu'ils disent de nous
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des clients satisfaits partagent leur expérience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all relative group"
              >
                <div className="absolute top-4 right-4 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  -{testimonial.savings}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-gray-300" />
                      <span className="text-xs text-gray-300">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Blog</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-4 mb-6">
              Derniers articles
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conseils, guides et actualités
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <div className="aspect-[16/9]">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    {post.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-400">{post.date}</p>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-green-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium group-hover:gap-3 transition-all">
                  Lire la suite
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8"
          >
            Ils nous font confiance
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-4xl opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"
              >
                <span className="text-4xl">{partner.logo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA avec parallax */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
            alt="Paysage vert"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Prêt à faire la différence ?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Rejoignez la communauté EcoVert et participez à la transition énergétique. 
              Ensemble, construisons un avenir plus durable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-white text-gray-900 px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Commencer maintenant
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Nous contacter
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats additionnelles */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              <div>
                <div className="text-3xl font-light">15K+</div>
                <div className="text-sm text-gray-400 mt-2">Clients</div>
              </div>
              <div>
                <div className="text-3xl font-light">40%</div>
                <div className="text-sm text-gray-400 mt-2">Économies</div>
              </div>
              <div>
                <div className="text-3xl font-light">200T</div>
                <div className="text-sm text-gray-400 mt-2">CO₂ évité</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">EcoVert</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Des solutions énergétiques innovantes pour un avenir plus durable. 
                Ensemble, construisons un monde meilleur.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition group"
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Produits</h4>
              <ul className="space-y-3">
                {['Panneaux solaires', 'Batteries', 'Éoliennes', 'Accessoires'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-300 hover:text-white transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Ressources</h4>
              <ul className="space-y-3">
                {['Blog', 'Guides', 'FAQ', 'Support'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-300 hover:text-white transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Entreprise</h4>
              <ul className="space-y-3">
                {['À propos', 'Carrières', 'Contact', 'Mentions légales'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-300 hover:text-white transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 EcoVert. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition">
                Confidentialité
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition">
                CGU
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-white transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bouton retour en haut */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition z-40 flex items-center justify-center"
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    </div>
  );
}