import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Propriétaire maison",
      content: "Installation rapide et professionnelle. Les économies sur ma facture sont immédiates.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108777-2961285e9ab9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    },
    {
      id: 2,
      name: "Thomas Dubois",
      role: "Entrepreneur",
      content: "La qualité des produits est exceptionnelle. Le service client est réactif et compétent.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    },
    {
      id: 3,
      name: "Marie Laurent",
      role: "Architecte",
      content: "Une gamme complète de produits design et performants. Je recommande vivement.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    }
  ];

  const stats = [
    { icon: Users, value: '15K+', label: 'Clients' },
    { icon: TrendingUp, value: '40%', label: "D'économies" },
    { icon: Globe, value: '200T', label: 'CO₂ évité' },
    { icon: Award, value: '25+', label: 'Prix' }
  ];

  const categories = [
    { name: 'Solaire', icon: Sun, count: 24, color: 'from-amber-500 to-yellow-500' },
    { name: 'Éolien', icon: Wind, count: 12, color: 'from-sky-500 to-blue-500' },
    { name: 'Stockage', icon: Battery, count: 18, color: 'from-emerald-500 to-green-500' },
    { name: 'Recyclage', icon: Recycle, count: 8, color: 'from-teal-500 to-cyan-500' },
    { name: 'Chauffage', icon: Home, count: 15, color: 'from-orange-500 to-red-500' },
    { name: 'Hydro', icon: Droplets, count: 6, color: 'from-indigo-500 to-purple-500' }
  ];

  const features = [
    { icon: Shield, title: 'Garantie 5 ans', desc: 'Tous nos produits sont garantis' },
    { icon: Truck, title: 'Livraison offerte', desc: 'Dès 500 000 Ar d\'achat' },
    { icon: Heart, title: 'Support 24/7', desc: 'Une équipe à votre écoute' },
    { icon: CheckCircle, title: 'Certifié', desc: 'Normes internationales' }
  ];

  const blogPosts = [
    {
      title: "Comment choisir son panneau solaire",
      excerpt: "Guide complet pour faire le bon choix selon vos besoins",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "12 Mars 2024",
      readTime: "5 min"
    },
    {
      title: "Les avantages des batteries domestiques",
      excerpt: "Stockez votre énergie pour une indépendance totale",
      image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "8 Mars 2024",
      readTime: "4 min"
    },
    {
      title: "Guide des aides financières 2024",
      excerpt: "Toutes les subventions pour vos installations écologiques",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "5 Mars 2024",
      readTime: "6 min"
    }
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

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Hero Section minimaliste */}
      <section className="pt-12 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-gray-700" />
                <span className="text-sm text-gray-700">La révolution verte est en marche</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 mb-6">
                L'énergie
                <span className="block font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  de demain
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
                Des solutions énergétiques intelligentes pour un avenir plus durable. 
                Performance, design et responsabilité.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  Explorer
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/energy-simulator"
                  className="group bg-transparent border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition flex items-center justify-center gap-2"
                >
                  Simuler
                  <Zap className="h-4 w-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-light text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Panneaux solaires"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Sun className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Économies</div>
                    <div className="text-2xl font-light text-gray-900">-40%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-3">Explorez par catégorie</h2>
            <p className="text-gray-400">Des solutions pour tous vos besoins</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.count} produits</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-2">Nouveautés</h2>
              <p className="text-gray-400">Les dernières innovations</p>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Voir tout
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
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

      {/* Trending */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-2">Tendances</h2>
              <p className="text-gray-400">Les plus populaires</p>
            </div>
            <Link
              to="/products?sort=trending"
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Voir tout
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-3">Ils nous font confiance</h2>
            <p className="text-gray-400">Des clients satisfaits partout dans le monde</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-gray-900 text-gray-900" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-3">Derniers articles</h2>
            <p className="text-gray-400">Conseils et actualités</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-gray-200">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">{post.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA minimaliste */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Prêt à faire la différence ?
            </h2>
            <p className="text-gray-400 mb-8">
              Rejoignez la communauté GreenEnergy et participez à la transition énergétique
            </p>
            <Link
              to="/register"
              className="inline-flex bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Commencer maintenant
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}