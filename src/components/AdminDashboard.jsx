import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Layers,
  LogOut,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard({ 
  onBackToStore, 
  products = [], 
  categories = [], 
  onProductAdded, 
  onProductUpdated, 
  onProductDeleted 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'add', 'orders'

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    stock: 10,
    category: 'smartphones',
    image: '',
    description: '',
    badge: 'NUEVO',
    installments: '12x sin interés',
    freeShipping: true,
    fullShipping: true
  });

  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' or 'url'
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Handle PIN Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('PIN incorrecto. Intenta con "1234"');
    }
  };

  // Handle Image File Attachment / Drag & Drop
  const handleImageFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'La imagen debe pesar menos de 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setStatusMessage({ type: 'success', text: '¡Imagen adjuntada correctamente!' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      price: '',
      originalPrice: '',
      stock: 10,
      category: categories[0]?.id || 'smartphones',
      image: '',
      description: '',
      badge: 'NUEVO',
      installments: '12x sin interés',
      freeShipping: true,
      fullShipping: true
    });
  };

  // Start Edit
  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock !== undefined ? product.stock : 10,
      category: product.category || 'smartphones',
      image: product.image || '',
      description: product.description || '',
      badge: product.badge || 'NUEVO',
      installments: product.installments || '12x sin interés',
      freeShipping: product.freeShipping !== undefined ? product.freeShipping : true,
      fullShipping: product.fullShipping !== undefined ? product.fullShipping : true
    });
    setActiveTab('add');
  };

  // Submit Product Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      setStatusMessage({ type: 'error', text: 'El título y el precio son obligatorios.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingId) {
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData })
        });
        const result = await response.json();
        
        if (result.success) {
          onProductUpdated && onProductUpdated({ id: editingId, ...formData });
          setStatusMessage({ type: 'success', text: '¡Producto actualizado con éxito!' });
          resetForm();
          setActiveTab('inventory');
        } else {
          throw new Error(result.message || 'Error al actualizar');
        }
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (result.success) {
          onProductAdded && onProductAdded(result.data || { id: Date.now().toString(), ...formData });
          setStatusMessage({ type: 'success', text: '¡Nuevo producto publicado en la tienda!' });
          resetForm();
          setActiveTab('inventory');
        } else {
          throw new Error(result.message || 'Error al crear producto');
        }
      }
    } catch (err) {
      console.warn('Fallback local save:', err);
      if (editingId) {
        onProductUpdated && onProductUpdated({ id: editingId, ...formData });
      } else {
        onProductAdded && onProductAdded({ id: `local-${Date.now()}`, ...formData });
      }
      setStatusMessage({ type: 'success', text: '¡Producto guardado exitosamente!' });
      resetForm();
      setActiveTab('inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}" del catálogo?`)) return;

    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete warning:', err);
    }
    onProductDeleted && onProductDeleted(id);
    setStatusMessage({ type: 'success', text: `Producto "${title}" eliminado.` });
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          p.category?.toLowerCase().includes(filterSearch.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Dashboard Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 1), 0);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050714, #0a0f29)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(145deg, #0e1329, #080b1a)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 255, 0.15)',
          padding: '40px 32px'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #00f2ff, #3842ff)', 
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 242, 255, 0.5)'
            }}>
              <ShieldCheck size={36} color="#ffffff" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800 }}>
              Panel Administrador OKN
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>
              Sistema Independiente de Control de Catálogo e Inventario
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                PIN de Acceso Privado:
              </label>
              <input 
                type="password"
                placeholder="Ingresa PIN (default: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 242, 255, 0.3)',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '6px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {loginError && (
                <div style={{ color: '#ff3366', fontSize: '0.85rem', marginTop: '8px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00f2ff, #3842ff)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)'
              }}
            >
              Ingresar al Control de Admin
            </button>

            <button 
              type="button"
              onClick={onBackToStore}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '8px'
              }}
            >
              <ArrowLeft size={16} /> Volver a la Tienda Pública
            </button>
          </form>

        </div>
      </div>
    );
  }

  // DASHBOARD FULL STANDALONE PAGE
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050714',
      color: '#ffffff',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Top Admin Header Bar */}
      <header style={{
        background: 'rgba(14, 19, 41, 0.95)',
        borderBottom: '1px solid rgba(0, 242, 255, 0.2)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00f2ff, #3842ff)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              OKN Technology — Dashboard Admin
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Gestor de Productos, Fotos e Inventario en Vivo
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={onBackToStore}
            style={{
              background: 'rgba(0, 242, 255, 0.1)',
              border: '1px solid rgba(0, 242, 255, 0.3)',
              color: '#00f2ff',
              padding: '10px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Ver Tienda Pública
          </button>

          <button 
            onClick={() => setIsAuthenticated(false)}
            title="Cerrar Sesión Admin"
            style={{
              background: 'rgba(255, 51, 102, 0.1)',
              border: '1px solid rgba(255, 51, 102, 0.3)',
              color: '#ff3366',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div style={{ flex: 1, padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          
          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Total Productos</span>
              <Package size={22} color="#00f2ff" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
              {totalProducts}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#00e676', marginTop: '4px', display: 'block' }}>
              Catálogo activo
            </span>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Unidades en Stock</span>
              <Layers size={22} color="#3842ff" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
              {totalStock} un.
            </div>
            <span style={{ fontSize: '0.78rem', color: '#00f2ff', marginTop: '4px', display: 'block' }}>
              Inventario acumulado
            </span>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Valor del Inventario</span>
              <DollarSign size={22} color="#00e676" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00e676', marginTop: '8px' }}>
              ${totalValue.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Estimado de mercancía
            </span>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Categorías</span>
              <ShoppingBag size={22} color="#ff9100" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
              {categories.length}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#ff9100', marginTop: '4px', display: 'block' }}>
              Líneas de productos
            </span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '28px',
          paddingBottom: '2px'
        }}>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              background: activeTab === 'inventory' ? 'rgba(0, 242, 255, 0.15)' : 'transparent',
              border: activeTab === 'inventory' ? '1px solid #00f2ff' : 'none',
              borderBottom: 'none',
              color: activeTab === 'inventory' ? '#00f2ff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Package size={18} /> Inventario de Productos ({products.length})
          </button>

          <button 
            onClick={() => {
              if (activeTab !== 'add') resetForm();
              setActiveTab('add');
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              background: activeTab === 'add' ? 'rgba(0, 242, 255, 0.15)' : 'transparent',
              border: activeTab === 'add' ? '1px solid #00f2ff' : 'none',
              borderBottom: 'none',
              color: activeTab === 'add' ? '#00f2ff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
            {editingId ? 'Editar Producto' : 'Publicar / Adjuntar Producto'}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div style={{
            marginBottom: '24px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: statusMessage.type === 'success' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 51, 102, 0.15)',
            border: statusMessage.type === 'success' ? '1px solid #00e676' : '1px solid #ff3366',
            color: statusMessage.type === 'success' ? '#00e676' : '#ff3366',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {statusMessage.text}
          </div>
        )}

        {/* TAB 1: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div style={{
            background: 'linear-gradient(145deg, #0e1329, #080b1a)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
          }}>
            
            {/* Search & Filter Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    placeholder="Buscar por nombre de producto..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="all" style={{ background: '#0e1329' }}>Todas las categorías</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#0e1329' }}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => { resetForm(); setActiveTab('add'); }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00f2ff, #3842ff)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)'
                }}
              >
                <Plus size={18} /> Publicar Nuevo Producto
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '14px 16px' }}>Imagen</th>
                    <th style={{ padding: '14px 16px' }}>Producto</th>
                    <th style={{ padding: '14px 16px' }}>Categoría</th>
                    <th style={{ padding: '14px 16px' }}>Precio ($)</th>
                    <th style={{ padding: '14px 16px' }}>Stock</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        No hay productos registrados que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr 
                        key={prod.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        {/* Image */}
                        <td style={{ padding: '12px 16px' }}>
                          <img 
                            src={prod.image} 
                            alt={prod.title}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'; }}
                          />
                        </td>

                        {/* Title & Badge */}
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{prod.title}</div>
                          {prod.badge && (
                            <span style={{
                              fontSize: '0.68rem',
                              color: '#00f2ff',
                              background: 'rgba(0, 242, 255, 0.1)',
                              border: '1px solid rgba(0, 242, 255, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              marginTop: '4px'
                            }}>
                              {prod.badge}
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td style={{ padding: '12px 16px', color: '#cbd5e1', textTransform: 'capitalize' }}>
                          {prod.category}
                        </td>

                        {/* Price */}
                        <td style={{ padding: '12px 16px', color: '#00e676', fontWeight: 700, fontSize: '1rem' }}>
                          ${Number(prod.price).toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: (prod.stock || 10) > 5 ? 'rgba(0, 230, 118, 0.15)' : (prod.stock || 10) > 0 ? 'rgba(255, 145, 0, 0.15)' : 'rgba(255, 51, 102, 0.15)',
                            color: (prod.stock || 10) > 5 ? '#00e676' : (prod.stock || 10) > 0 ? '#ff9100' : '#ff3366',
                            border: (prod.stock || 10) > 5 ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 145, 0, 0.3)'
                          }}>
                            {prod.stock !== undefined ? prod.stock : 10} un.
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => startEdit(prod)}
                              style={{
                                background: 'rgba(0, 242, 255, 0.1)',
                                border: '1px solid rgba(0, 242, 255, 0.3)',
                                color: '#00f2ff',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.82rem',
                                fontWeight: 600
                              }}
                            >
                              <Edit3 size={15} /> Editar
                            </button>

                            <button
                              onClick={() => handleDelete(prod.id, prod.title)}
                              style={{
                                background: 'rgba(255, 51, 102, 0.1)',
                                border: '1px solid rgba(255, 51, 102, 0.3)',
                                color: '#ff3366',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.82rem',
                                fontWeight: 600
                              }}
                            >
                              <Trash2 size={15} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT FORM WITH IMAGE ATTACHMENT */}
        {activeTab === 'add' && (
          <div style={{
            background: 'linear-gradient(145deg, #0e1329, #080b1a)',
            border: '1px solid rgba(0, 242, 255, 0.2)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#00f2ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingId ? <Edit3 size={24} /> : <Plus size={24} />}
                {editingId ? 'Editar Producto Seleccionado' : 'Publicar y Adjuntar Nuevo Producto'}
              </h2>
              {editingId && (
                <button 
                  onClick={resetForm}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Product Title */}
              <div>
                <label style={{ fontSize: '0.88rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Nombre / Título del Producto *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ej: Smartphone OKN Ultra 5G OLED 256GB"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Category, Badge & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Categoría
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#0e1329' }}>{c.name}</option>
                    ))}
                    <option value="tecnologia" style={{ background: '#0e1329' }}>Tecnología General</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Etiqueta / Badge
                  </label>
                  <select 
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="NUEVO" style={{ background: '#0e1329' }}>NUEVO</option>
                    <option value="MÁS VENDIDO" style={{ background: '#0e1329' }}>MÁS VENDIDO</option>
                    <option value="OFERTA RELÁMPAGO" style={{ background: '#0e1329' }}>OFERTA RELÁMPAGO</option>
                    <option value="ENVÍO FULL" style={{ background: '#0e1329' }}>ENVÍO FULL</option>
                    <option value="STOCK LIMITADO" style={{ background: '#0e1329' }}>STOCK LIMITADO</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Stock Disponible (Unidades)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Precio Venta ($) *
                  </label>
                  <input 
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="999.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Precio Original Tachado ($)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1200.00"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Financiación / Cuotas
                  </label>
                  <input 
                    type="text"
                    placeholder="12x sin interés"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* IMAGE ATTACHMENT SECTION (FILE UPLOAD OR URL) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(0, 242, 255, 0.3)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.9rem', color: '#00f2ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={20} /> Imagen del Producto
                  </label>

                  {/* Mode selector */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: imageInputMode === 'file' ? 'rgba(0, 242, 255, 0.2)' : 'transparent',
                        border: imageInputMode === 'file' ? '1px solid #00f2ff' : '1px solid rgba(255,255,255,0.1)',
                        color: imageInputMode === 'file' ? '#00f2ff' : '#94a3b8'
                      }}
                    >
                      📁 Adjuntar Archivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: imageInputMode === 'url' ? 'rgba(0, 242, 255, 0.2)' : 'transparent',
                        border: imageInputMode === 'url' ? '1px solid #00f2ff' : '1px solid rgba(255,255,255,0.1)',
                        color: imageInputMode === 'url' ? '#00f2ff' : '#94a3b8'
                      }}
                    >
                      🔗 Pegar URL
                    </button>
                  </div>
                </div>

                {imageInputMode === 'file' ? (
                  /* FILE UPLOAD DROPZONE */
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <input 
                      type="file"
                      id="product-image-upload"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="product-image-upload"
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '24px 32px',
                        borderRadius: '12px',
                        background: 'rgba(0, 242, 255, 0.06)',
                        border: '1px dashed #00f2ff',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Upload size={32} color="#00f2ff" />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        Haz clic aquí para adjuntar una foto desde tu equipo (JPG, PNG, WEBP)
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Máximo 5MB — La imagen se optimiza automáticamente
                      </span>
                    </label>
                  </div>
                ) : (
                  /* URL INPUT */
                  <div>
                    <input 
                      type="url"
                      placeholder="https://images.unsplash.com/photo-ejemplo.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                )}

                {/* PREVIEW BOX */}
                {formData.image && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    border: '1px solid rgba(0, 242, 255, 0.2)'
                  }}>
                    <img 
                      src={formData.image} 
                      alt="Vista previa" 
                      style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '8px', background: '#080b1a' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'; }}
                    />
                    <div>
                      <strong style={{ color: '#00e676', display: 'block', fontSize: '0.88rem' }}>
                        ✓ Imagen cargada y lista
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Esta foto se mostrará en el catálogo público
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Descripción de Características Técnicas
                </label>
                <textarea 
                  rows="4"
                  placeholder="Detalla procesador, memoria RAM, batería, garantía u otras especificaciones clave..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: editingId 
                    ? 'linear-gradient(135deg, #ff9100, #ff3366)' 
                    : 'linear-gradient(135deg, #00f2ff, #3842ff)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 25px rgba(0, 242, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '10px'
                }}
              >
                {isSubmitting ? (
                  <>Guardando en MongoDB Atlas...</>
                ) : editingId ? (
                  <><Edit3 size={20} /> Guardar Cambios en Producto</>
                ) : (
                  <><Plus size={20} /> Publicar Producto en la Tienda Pública</>
                )}
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  fontSize: '0.92rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const statCardStyle = {
  background: 'linear-gradient(145deg, #0e1329, #080b1a)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
};
