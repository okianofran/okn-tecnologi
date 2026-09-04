import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  discountCode,
  setDiscountCode,
  discountApplied,
  setDiscountApplied
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'OKNTECH10' || couponInput.trim().toUpperCase() === 'OKN10') {
      setDiscountApplied(true);
      setDiscountCode('OKNTECH10 (-10%)');
      setCouponError('');
    } else {
      setCouponError('Cupón inválido. Prueba con OKNTECH10');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 6, 20, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 250,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Background click to close */}
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }} 
      />

      {/* Slide Drawer Content */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'linear-gradient(180deg, #0a0f2b 0%, #06091b 100%)',
          borderLeft: '1px solid rgba(0, 242, 255, 0.3)',
          boxShadow: '-15px 0 45px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00f2ff'
            }}>
              <ShoppingCart size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Tu Carrito</h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress (Mercado Libre Style) */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0, 230, 118, 0.08)',
          borderBottom: '1px solid rgba(0, 230, 118, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Truck size={20} color="#00e676" />
          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.3 }}>
            <strong style={{ color: '#00e676' }}>¡Genial! Tienes Envío Gratis Full ⚡</strong>
            <span style={{ display: 'block', color: '#94a3b8' }}>Llega a tu domicilio en 24 horas</span>
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <ShoppingCart size={48} color="#3842ff" style={{ margin: '0 auto 16px auto', opacity: 0.7 }} />
              <h4 style={{ color: '#ffffff', marginBottom: '6px' }}>Tu carrito está vacío</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>¡Explora nuestras ofertas relámpago y tecnología exclusiva!</p>
              <button onClick={onClose} className="btn-cyan" style={{ fontSize: '0.85rem' }}>
                Ver Productos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      background: '#040718'
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#f1f5f9',
                        lineHeight: 1.3,
                        maxHeight: '2.6em',
                        overflow: 'hidden'
                      }}>
                        {item.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px',
                          marginLeft: '6px'
                        }}
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#00f2ff',
                      margin: '4px 0'
                    }}>
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.12)'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.72rem', color: '#00e676', fontWeight: 600 }}>
                        ⚡ Envío FULL
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px',
            background: '#070b22',
            borderTop: '1px solid rgba(0, 242, 255, 0.25)'
          }}>
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Cupón (ej: OKNTECH10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <button
                  type="submit"
                  className="btn-ghost"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Aplicar
                </button>
              </div>
              {couponError && (
                <div style={{ color: '#ff3366', fontSize: '0.72rem', marginTop: '4px' }}>
                  {couponError}
                </div>
              )}
              {discountApplied && (
                <div style={{ color: '#00e676', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> ¡Cupón de 10% de descuento aplicado!
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Envío</span>
                <span style={{ color: '#00e676', fontWeight: 600 }}>GRATIS</span>
              </div>
              {discountApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00e676' }}>
                  <span>Descuento Cupón</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px',
                marginTop: '4px'
              }}>
                <span>Total</span>
                <span style={{ color: '#00f2ff', fontFamily: 'var(--font-mono)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onCheckout}
              className="btn-cyan"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.98rem',
                borderRadius: '12px'
              }}
            >
              <span>Continuar Compra</span>
              <ArrowRight size={18} />
            </button>

            {/* Trust badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '10px'
            }}>
              <ShieldCheck size={14} color="#00f2ff" />
              <span>Compra 100% segura con garantía OKN</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
