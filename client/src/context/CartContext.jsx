import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  checkout,
  getOrders 
} from '../services/api';
import { useAuth } from './AuthContext';

// Constantes de livraison
export const DELIVERY = {
  FREE_THRESHOLD: 500000,
  STANDARD_FEE: 15000,
  EXPRESS_FEE: 25000,
  REMOTE_ZONE_FEE: 30000,
  FREE_FOR_FIRST_ORDER: true,
};

export const DELIVERY_ZONES = {
  'Antananarivo': { type: 'capital', fee: 0, days: '1-2' },
  'Toamasina': { type: 'city', fee: 10000, days: '2-3' },
  'Mahajanga': { type: 'city', fee: 10000, days: '2-3' },
  'Fianarantsoa': { type: 'city', fee: 10000, days: '2-3' },
  'Antsiranana': { type: 'city', fee: 15000, days: '3-4' },
  'Toliara': { type: 'city', fee: 15000, days: '3-4' },
  'default': { type: 'remote', fee: DELIVERY.REMOTE_ZONE_FEE, days: '5-7' }
};

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    method: 'standard',
    zone: 'Antananarivo',
    fee: 0,
    isFree: false,
    days: '1-2',
    message: ''
  });
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  
  const fetchInProgress = useRef(false);
  const initialFetchDone = useRef(false);

  // Charger les commandes de l'utilisateur
  const fetchUserOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await getOrders();
      const ordersData = response.data?.data || response.data || [];
      setUserOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  }, [isAuthenticated]);

  // Calculer les frais de livraison
  const calculateDeliveryFee = useCallback((subtotal, zone, method = 'standard', isFirstOrder = false) => {
    // Règles de livraison gratuite
    if (subtotal >= DELIVERY.FREE_THRESHOLD) {
      return {
        fee: 0,
        isFree: true,
        days: '1-2',
        message: `Livraison gratuite (commande > ${DELIVERY.FREE_THRESHOLD.toLocaleString()} Ar)`
      };
    }
    
    if (DELIVERY.FREE_FOR_FIRST_ORDER && isFirstOrder) {
      return {
        fee: 0,
        isFree: true,
        days: '1-2',
        message: 'Livraison gratuite pour votre première commande !'
      };
    }
    
    // Récupérer les infos de la zone
    const zoneInfo = DELIVERY_ZONES[zone] || DELIVERY_ZONES.default;
    
    // Frais de base selon la zone
    let baseFee = zoneInfo.fee;
    
    // Frais selon le mode de livraison
    let finalFee = baseFee;
    let days = zoneInfo.days;
    let message = 'Livraison standard';
    
    if (method === 'express') {
      finalFee += DELIVERY.EXPRESS_FEE;
      days = zoneInfo.days.split('-').map(d => parseInt(d) - 1).join('-');
      message = 'Livraison express';
    }
    
    // Message pour les zones éloignées
    if (zoneInfo.type === 'remote') {
      message = 'Zone éloignée - délais et frais supplémentaires';
    }
    
    return {
      fee: finalFee,
      isFree: finalFee === 0,
      days,
      message
    };
  }, []);

  // Calculer les totaux
  const calculateTotals = useCallback((cartData) => {
    if (cartData?.items && Array.isArray(cartData.items)) {
      const count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cartData.items.reduce((sum, item) => 
        sum + (item.product?.price || 0) * item.quantity, 0
      );
      return { count, subtotal };
    }
    return { count: 0, subtotal: 0 };
  }, []);

  // Mettre à jour les infos de livraison
  const updateDeliveryInfo = useCallback((subtotal) => {
    const isFirstOrder = userOrders.length === 0;
    const { fee, isFree, days, message } = calculateDeliveryFee(
      subtotal, 
      deliveryInfo.zone, 
      deliveryInfo.method,
      isFirstOrder
    );
    
    setDeliveryInfo(prev => ({
      ...prev,
      fee,
      isFree,
      days,
      message
    }));
  }, [calculateDeliveryFee, userOrders.length, deliveryInfo.zone, deliveryInfo.method]);

  // Mettre à jour les totaux
  const updateTotals = useCallback((cartData) => {
    const { count, subtotal } = calculateTotals(cartData);
    setItemCount(count);
    setCartTotal(subtotal);
    updateDeliveryInfo(subtotal);
  }, [calculateTotals, updateDeliveryInfo]);

  // Charger le panier
  const fetchCart = useCallback(async (skipCache = false) => {
    if (fetchInProgress.current) return;
    
    if (!isAuthenticated) {
      setCart(null);
      setItemCount(0);
      setCartTotal(0);
      setInitialLoading(false);
      return;
    }

    if (!skipCache && cart && initialFetchDone.current) {
      return;
    }

    fetchInProgress.current = true;
    setLoading(true);
    
    try {
      console.log('🛒 Chargement du panier...');
      const response = await getCart();
      
      let cartData = response.data?.data || response.data || response;
      
      if (!cartData || typeof cartData !== 'object') {
        cartData = { items: [] };
      }
      
      if (!cartData.items) {
        cartData.items = [];
      }
      
      setCart(cartData);
      await fetchUserOrders();
      updateTotals(cartData);
      setError(null);
      initialFetchDone.current = true;
      
    } catch (err) {
      console.error('❌ Erreur chargement panier:', err);
      
      if (err.response?.status === 401) {
        const emptyCart = { items: [] };
        setCart(emptyCart);
        setItemCount(0);
        setCartTotal(0);
      } else {
        setError('Impossible de charger le panier');
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
      fetchInProgress.current = false;
    }
  }, [isAuthenticated, cart, fetchUserOrders, updateTotals]);

  // Initialisation
  useEffect(() => {
    fetchCart(true);
  }, [fetchCart, isAuthenticated]);

  // Réinitialiser quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      setCart(null);
      setItemCount(0);
      setCartTotal(0);
      setUserOrders([]);
      setDeliveryInfo({
        method: 'standard',
        zone: 'Antananarivo',
        fee: 0,
        isFree: false,
        days: '1-2',
        message: ''
      });
      initialFetchDone.current = false;
    }
  }, [isAuthenticated]);

  // Ajouter au panier
  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await addToCart(productId, quantity);
      
      let updatedCart = response.data?.data || response.data || response;
      
      if (!updatedCart || typeof updatedCart !== 'object') {
        throw new Error('Réponse invalide du serveur');
      }
      
      if (!updatedCart.items) {
        updatedCart.items = [];
      }
      
      setCart(updatedCart);
      updateTotals(updatedCart);
      
      setShowMiniCart(true);
      setTimeout(() => setShowMiniCart(false), 3000);
      
      return updatedCart;
      
    } catch (err) {
      console.error('❌ Erreur ajout au panier:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de l\'ajout au panier';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateTotals]);

  // Mettre à jour la quantité
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Mise à jour quantité: ${productId} -> ${quantity}`);
      
      if (quantity <= 0) {
        return await removeItem(productId);
      }
      
      const response = await updateCartItem(productId, quantity);
      
      let updatedCart = response.data?.data || response.data || response;
      
      if (!updatedCart || typeof updatedCart !== 'object') {
        throw new Error('Réponse invalide du serveur');
      }
      
      if (!updatedCart.items) {
        updatedCart.items = [];
      }
      
      setCart(updatedCart);
      updateTotals(updatedCart);
      
      return updatedCart;
      
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la mise à jour';
      setError(errorMessage);
      fetchCart(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateTotals, fetchCart]);

  // Supprimer un article
  const removeItem = useCallback(async (productId) => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);
    
    try {
      console.log(`🗑️ Suppression: ${productId}`);
      const response = await removeFromCart(productId);
      
      let updatedCart = response.data?.data || response.data || response;
      
      if (!updatedCart || typeof updatedCart !== 'object') {
        throw new Error('Réponse invalide du serveur');
      }
      
      if (!updatedCart.items) {
        updatedCart.items = [];
      }
      
      setCart(updatedCart);
      updateTotals(updatedCart);
      
      return updatedCart;
      
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la suppression';
      setError(errorMessage);
      fetchCart(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateTotals, fetchCart]);

  // Vider le panier
  const emptyCart = useCallback(async () => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🧹 Vidage du panier');
      const response = await clearCart();
      
      let updatedCart = response.data?.data || response.data || response;
      
      if (!updatedCart || typeof updatedCart !== 'object') {
        updatedCart = { items: [] };
      }
      
      if (!updatedCart.items) {
        updatedCart.items = [];
      }
      
      setCart(updatedCart);
      setItemCount(0);
      setCartTotal(0);
      updateDeliveryInfo(0);
      
      return updatedCart;
      
    } catch (err) {
      console.error('❌ Erreur vidage panier:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors du vidage';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateDeliveryInfo]);

  // Passer commande
  // Modifier seulement la fonction checkoutCart

const checkoutCart = useCallback(async (deliveryDetails) => {
  if (!isAuthenticated) {
    window.location.href = '/login?redirect=/checkout';
    return null;
  }

  // Validation des champs requis
  if (!deliveryDetails?.deliveryAddress || !deliveryDetails?.phoneNumber) {
    throw new Error("L'adresse de livraison et le numéro de téléphone sont requis");
  }

  setLoading(true);
  setError(null);
  
  try {
    console.log('💰 Passage de commande avec livraison...', deliveryDetails);
    
    // Appel API avec les détails de livraison
    const response = await checkout({
      deliveryAddress: deliveryDetails.deliveryAddress,
      phoneNumber: deliveryDetails.phoneNumber,
      deliveryNotes: deliveryDetails.deliveryNotes || ''
    });
    
    const order = response.data?.data || response.data || response;
    
    // Vider le panier localement
    const emptyCartData = { items: [] };
    setCart(emptyCartData);
    setItemCount(0);
    setCartTotal(0);
    
    // Ajouter la commande à la liste
    setUserOrders(prev => Array.isArray(prev) ? [...prev, order] : [order]);
    updateDeliveryInfo(0);
    
    return order;
    
  } catch (err) {
    console.error('❌ Erreur commande:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la commande';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, [isAuthenticated, updateDeliveryInfo, checkout]);
  // Changer la zone de livraison
  const setDeliveryZone = useCallback((zone) => {
    setDeliveryInfo(prev => ({ ...prev, zone }));
    if (cart) {
      updateDeliveryInfo(cartTotal);
    }
  }, [cart, cartTotal, updateDeliveryInfo]);

  // Changer le mode de livraison
  const setDeliveryMethod = useCallback((method) => {
    setDeliveryInfo(prev => ({ ...prev, method }));
    if (cart) {
      updateDeliveryInfo(cartTotal);
    }
  }, [cart, cartTotal, updateDeliveryInfo]);

  // Vérifier si un produit est dans le panier
  const isInCart = useCallback((productId) => {
    if (!cart?.items || !Array.isArray(cart.items)) return false;
    return cart.items.some(item => 
      item.productId === productId || item.product?.id === productId
    );
  }, [cart]);

  // Obtenir la quantité
  const getItemQuantity = useCallback((productId) => {
    if (!cart?.items || !Array.isArray(cart.items)) return 0;
    const item = cart.items.find(item => 
      item.productId === productId || item.product?.id === productId
    );
    return item?.quantity || 0;
  }, [cart]);

  // Rafraîchir le panier
  const refreshCart = useCallback(() => {
    initialFetchDone.current = false;
    return fetchCart(true);
  }, [fetchCart]);

  // Total avec livraison
  const totalWithDelivery = useMemo(() => {
    return cartTotal + (deliveryInfo.fee || 0);
  }, [cartTotal, deliveryInfo.fee]);

  const value = useMemo(() => ({
    cart,
    loading,
    initialLoading,
    error,
    itemCount,
    cartTotal,
    deliveryInfo,
    totalWithDelivery,
    showMiniCart,
    userOrders,
    DELIVERY,
    DELIVERY_ZONES,
    setShowMiniCart,
    setDeliveryZone,
    setDeliveryMethod,
    fetchCart,
    refreshCart,
    addItem,
    updateQuantity,
    removeItem,
    emptyCart,
    checkoutCart,
    isInCart,
    getItemQuantity,
    isLoaded: !!cart,
    hasFreeDelivery: deliveryInfo.isFree,
    deliveryMessage: deliveryInfo.message,
    deliveryDays: deliveryInfo.days,
  }), [
    cart, loading, initialLoading, error, itemCount, cartTotal, 
    deliveryInfo, totalWithDelivery, showMiniCart, userOrders,
    setDeliveryZone, setDeliveryMethod, fetchCart, refreshCart,
    addItem, updateQuantity, removeItem, emptyCart, checkoutCart,
    isInCart, getItemQuantity
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};