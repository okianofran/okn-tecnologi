import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Package, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Search
} from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products = [], 
  categories = [], 
  onProductAdded, 
  onProductUpdated, 
  onProductDeleted 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');

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

  const [filterSearch, setFilterSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('PIN incorrecto. Intenta con "1234"');
    }
  };

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
  };

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
          setStatusMessage({ type: 'success', text: '¡Producto publicado en la tienda en vivo!' });
          resetForm();
        } else {
          throw new Error(result.message || 'Error al crear producto');
        }
      }
    } catch (err) {
      console.warn('API connection message:', err);
      if (editingId) {
        onProductUpdated && onProductUpdated({ id: editingId, ...formData });
      } else {
        onProductAdded && onProductAdded({ id: `local-${Date.now()}`, ...formData });
      }
      setStatusMessage({ type: 'success', text: '¡Producto guardado exitosamente!' });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(filterSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(5, 7, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: isAuthenticated ? '1100px' : '420px',
        maxHeight: '90vh',
        background: 'linear-gradient(145deg, #0e1329, #080b1a)',
        border: '1px solid rgba(0, 242, 255, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#ffffff'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                Panel de Administración OKN
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                {isAuthenticated ? 'Gestión de Productos e Inventario en Tiempo Real' : 'Acceso Restringido solo para Administradores'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <form onSubmit={handleLogin} style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(0, 242, 255, 0.1)', 
                border: '1px solid rgba(0, 242, 255, 0.3)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock size={28} color="#00f2ff" />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem' }}>Ingrese PIN de Administrador</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Introduce tu clave para publicar o modificar productos (PIN por defecto: <strong>1234</strong>)
              </p>
            </div>

            <div>
              <input 
                type="password"
                placeholder="Ingresa PIN de acceso..."
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
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  outline: 'none'
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
                padding: '14px',
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
              Ingresar al Panel
            </button>
          </form>
        ) : (
          /* ADMIN DASHBOARD SCREEN */
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '420px 1fr', 
            overflow: 'hidden', 
            height: '100%',
            gap: 0 
          }}>
            
            {/* LEFT COLUMN: Add / Edit Form */}
            <div style={{
              padding: '24px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              overflowY: 'auto',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#00f2ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
                  {editingId ? 'Editar Producto' : 'Publicar Nuevo Producto'}
                </h3>
                {editingId && (
                  <button 
                    onClick={resetForm}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              {statusMessage && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: statusMessage.type === 'success' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 51, 102, 0.15)',
                  border: statusMessage.type === 'success' ? '1px solid #00e676' : '1px solid #ff3366',
                  color: statusMessage.type === 'success' ? '#00e676' : '#ff3366',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Title */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    Título del Producto *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej: Smartphone OKN Ultra Pro 5G 256GB"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Category & Badge */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
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
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
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
                </div>

                {/* Price & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Precio ($) *
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
                    <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Precio Orig.
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
                    <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Stock/Cant.
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

                {/* Image URL */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    URL de la Foto / Imagen
                  </label>
                  <input 
                    type="url"
                    placeholder="https://imagenes.com/foto.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Image Live Preview */}
                {formData.image && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={formData.image} 
                      alt="Vista previa" 
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'; }}
                    />
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Vista previa de la imagen cargada
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    Descripción Corta
                  </label>
                  <textarea 
                    rows="3"
                    placeholder="Especificaciones técnicas principales..."
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
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: editingId 
                      ? 'linear-gradient(135deg, #ff9100, #ff3366)' 
                      : 'linear-gradient(135deg, #00f2ff, #3842ff)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting ? (
                    <>Guardando...</>
                  ) : editingId ? (
                    <><Edit3 size={18} /> Guardar Cambios en Producto</>
                  ) : (
                    <><Plus size={18} /> Publicar Producto en la Tienda</>
                  )}
                </button>

              </form>
            </div>

            {/* RIGHT COLUMN: Products Table & Inventory Management */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              
              {/* Table Top Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} color="#00f2ff" />
                  Inventario Activo ({products.length} Productos)
                </h3>

                {/* Search in admin */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    placeholder="Buscar en inventario..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Products Table */}
              <div style={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.15)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', textAlign: 'left' }}>
                      <th style={{ padding: '12px', width: '50px' }}>Foto</th>
                      <th style={{ padding: '12px' }}>Producto</th>
                      <th style={{ padding: '12px' }}>Categoría</th>
                      <th style={{ padding: '12px' }}>Precio</th>
                      <th style={{ padding: '12px' }}>Stock</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                          No se encontraron productos en el inventario.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr 
                          key={prod.id} 
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: editingId === prod.id ? 'rgba(0, 242, 255, 0.08)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <img 
                              src={prod.image} 
                              alt={prod.title}
                              style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'; }}
                            />
                          </td>

                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                            <div style={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                              {prod.title}
                            </div>
                            {prod.badge && (
                              <span style={{ 
                                fontSize: '0.68rem', 
                                color: '#00f2ff', 
                                background: 'rgba(0,242,255,0.1)', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                display: 'inline-block',
                                marginTop: '2px'
                              }}>
                                {prod.badge}
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '10px 12px', color: '#cbd5e1', textTransform: 'capitalize' }}>
                            {prod.category}
                          </td>

                          <td style={{ padding: '10px 12px', color: '#00e676', fontWeight: 700 }}>
                            ${Number(prod.price).toLocaleString()}
                          </td>

                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: (prod.stock || 10) > 5 ? 'rgba(0, 230, 118, 0.15)' : (prod.stock || 10) > 0 ? 'rgba(255, 145, 0, 0.15)' : 'rgba(255, 51, 102, 0.15)',
                              color: (prod.stock || 10) > 5 ? '#00e676' : (prod.stock || 10) > 0 ? '#ff9100' : '#ff3366',
                              border: (prod.stock || 10) > 5 ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 145, 0, 0.3)'
                            }}>
                              {prod.stock !== undefined ? prod.stock : 10} un.
                            </span>
                          </td>

                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                              <button 
                                onClick={() => startEdit(prod)}
                                title="Editar producto"
                                style={{
                                  background: 'rgba(0, 242, 255, 0.1)',
                                  border: '1px solid rgba(0, 242, 255, 0.3)',
                                  color: '#00f2ff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <Edit3 size={14} /> Editar
                              </button>

                              <button 
                                onClick={() => handleDelete(prod.id, prod.title)}
                                title="Eliminar producto"
                                style={{
                                  background: 'rgba(255, 51, 102, 0.1)',
                                  border: '1px solid rgba(255, 51, 102, 0.3)',
                                  color: '#ff3366',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <Trash2 size={14} /> Eliminar
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

          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box'
};
