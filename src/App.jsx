import AdminModal from './components/AdminModal';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import BenefitsBar from './components/BenefitsBar';
import CategoryPills from './components/CategoryPills';
import FlashDeals from './components/FlashDeals';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSuccessModal from './components/CheckoutSuccessModal';
import Footer from './components/Footer';
import { PRODUCTS, CATEGORIES } from './data/products';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Products & Categories loaded live from MongoDB Atlas (with initial fallback)
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // Cart state
  const [cart, setCart] = useState([
    {
      ...PRODUCTS[0],
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  // Wishlist state
  const [favorites, setFavorites] = useState(['okn-2']);

  // Filters & Search state
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Fetch live products and categories from MongoDB Atlas via Serverless API
  useEffect(() => {
    async function loadLiveData() {
      try {
        setIsLoadingLive(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && prodData.data?.length > 0) {
            setProducts(prodData.data);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && catData.data?.length > 0) {
            setCategories(catData.data);
          }
        }
      } catch (err) {
        console.info('Usando catálogo inicial:', err);
      } finally {
        setIsLoadingLive(false);
      }
    }

    loadLiveData();
  }, []);

  // Add to cart handler
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`¡"${product.title.slice(0, 32)}..." agregado al carrito!`);
  };

  // Update quantity
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Producto eliminado del carrito');
  };

  // Toggle favorite
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast('Producto retirado de tus favoritos');
        return prev.filter((favId) => favId !== id);
      } else {
        showToast('¡Guardado en tus favoritos!');
        return [...prev, id];
      }
    });
  };

  // Trigger checkout & save order in MongoDB
  const handleCheckout = async () => {
    setIsCartOpen(false);
    setIsCheckoutSuccessOpen(true);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, title: item.title, price: item.price, quantity: item.quantity })),
          subtotal,
          totalAmount,
          discountApplied,
          discountCode
        })
      });
    } catch (e) {
      console.warn('Orden procesada localmente:', e);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
  };

  // Scroll to deals
  
  // Admin CRUD Handlers
  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`¡Producto "${newProduct.title}" publicado en la tienda!`);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
    showToast(`¡Producto "${updatedProduct.title}" actualizado!`);
  };

  const handleProductDeleted = (deletedId) => {
    setProducts(prev => prev.filter(p => p.id !== deletedId));
    showToast('Producto eliminado del catálogo');
  };

  const scrollToDeals = () => {
    const el = document.getElementById('ofertas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart counter
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = discountApplied ? subtotal * 0.9 : subtotal;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <HeroCarousel onExploreDeals={scrollToDeals} />

        {/* Benefits Bar (Mercado Libre Style) */}
        <BenefitsBar />

        {/* Category Pills Navigation */}
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Ofertas Relámpago (Flash Deals) */}
        <FlashDeals
          products={products}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          searchQuery=""
          selectedCategory={selectedCategory}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isFavorite={quickViewProduct ? favorites.includes(quickViewProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        discountApplied={discountApplied}
        setDiscountApplied={setDiscountApplied}
      />

      {/* Checkout Celebration Success Modal */}
      <CheckoutSuccessModal
        isOpen={isCheckoutSuccessOpen}
        onClose={() => {
          setIsCheckoutSuccessOpen(false);
          setCart([]);
        }}
        totalAmount={totalAmount}
      />

      
      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={products}
        categories={categories}
        onProductAdded={handleProductAdded}
        onProductUpdated={handleProductUpdated}
        onProductDeleted={handleProductDeleted}
      />

      {/* Floating Animated Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #0e1846, #090e29)',
          border: '1px solid #00f2ff',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(0, 242, 255, 0.35)',
          zIndex: 400,
          animation: 'fade-in-scale 0.25s ease-out',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#00e676" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}