import AdminDashboard from './components/AdminDashboard';
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
import CheckoutFormModal from './components/CheckoutFormModal';
import Footer from './components/Footer';
import { PRODUCTS, CATEGORIES } from './data/products';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Products & Categories loaded live from MongoDB Atlas (with initial fallback to LocalStorage/Data)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('okn_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('okn_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
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
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState('store'); // 'store' or 'admin'

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
        console.info('MongoDB no configurado. Usando LocalStorage o catálogo por defecto.', err);
      } finally {
        setIsLoadingLive(false);
      }
    }

    loadLiveData();
  }, []);

  // Secret URL (#admin) & Keyboard Shortcut (Ctrl+Shift+A) to open Admin Panel
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#panel') {
        setViewMode('admin');
      }
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setViewMode('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
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

    // Opens the Checkout Form
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutFormOpen(true);
  };

  // Trigger checkout & save order in MongoDB, then redirect to WhatsApp
  const handleConfirmPurchase = async (customerData) => {
    setIsCheckoutFormOpen(false);
    
    // Format WhatsApp Message
    let message = `Hola, he registrado mi compra y pago:\n\n`;
    message += `*Nombre:* ${customerData.nombre}\n`;
    message += `*Ref. Pago:* ${customerData.referencia}\n\n`;
    message += `*Productos:*\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.title} (${item.price})\n`;
    });
    message += `\n*Total Pagado:* ${totalAmount}\n\nQuedo a la espera de confirmación.`;

    const phoneNumber = "593999999999"; // TODO: Reemplazar con el real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData,
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
    
    // Vaciar carrito tras la compra
    setCart([]);
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

  
  // Render Full Standalone Admin Dashboard Page if viewMode === 'admin'
  if (viewMode === 'admin') {
    return (
      <AdminDashboard
        onBackToStore={() => setViewMode('store')}
        products={products}
        categories={categories}
        onProductAdded={handleProductAdded}
        onProductUpdated={handleProductUpdated}
        onProductDeleted={handleProductDeleted}
      />
    );
  }


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
        onOpenAdmin={() => setViewMode('admin')}
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
      <Footer onOpenAdmin={() => setViewMode('admin')} />

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

      {/* Checkout Form Modal */}
      <CheckoutFormModal
        isOpen={isCheckoutFormOpen}
        onClose={() => setIsCheckoutFormOpen(false)}
        totalAmount={totalAmount}
        cart={cart}
        onConfirmPurchase={handleConfirmPurchase}
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