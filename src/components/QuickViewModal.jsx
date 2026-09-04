import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  Award, 
  Zap, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  onClose, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite 
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecTab, setSelectedSpecTab] = useState('specs');

  if (!product) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 6, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, rgba(16, 24, 60, 0.95), rgba(8, 12, 34, 0.98))',
          border: '1px solid rgba(0, 242, 255, 0.4)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(0, 242, 255, 0.2)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 51, 102, 0.2)';
            e.currentTarget.style.borderColor = '#ff3366';
            e.currentTarget.style.color = '#ff3366';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start'
        }}>
          {/* Left Column: Image & Badges */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#040718',
              border: '1px solid rgba(0, 242, 255, 0.3)',
              height: '380px'
            }}>
              <img 
                src={product.image} 
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                gap: '8px'
              }}>
                {product.badge && (
                  <span style={{
                    background: '#3842ff',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    {product.badge}
                  </span>
                )}
                {product.isFull && (
                  <span className="badge-full">
                    <Zap size={12} /> FULL
                  </span>
                )}
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={20} color="#00f2ff" />
                <div style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Compra Protegida</strong>
                  <span style={{ color: '#94a3b8' }}>Devolución gratis 30 días</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Award size={20} color="#00e676" />
                <div style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Garantía OKN</strong>
                  <span style={{ color: '#94a3b8' }}>1 Año Cobertura Oficial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Prices, Specs & Buy Action */}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
              Nuevo • +{product.soldCount} vendidos en OKN Store
            </div>

            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              lineHeight: 1.3,
              marginBottom: '12px',
              color: '#ffffff'
            }}>
              {product.title}
            </h2>

            {/* Stars & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#ffb800' }}>
                <Star size={16} fill="#ffb800" />
                <span style={{ fontWeight: 700, marginLeft: '4px', color: '#ffffff' }}>{product.rating}</span>
              </div>
              <span style={{ color: '#00f2ff', fontSize: '0.85rem' }}>
                {product.reviewsCount} calificaciones
              </span>
            </div>

            {/* Price Box */}
            <div style={{
              background: 'rgba(0, 242, 255, 0.05)',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {formatPrice(product.originalPrice)}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#ffffff'
                }}>
                  {formatPrice(product.price)}
                </span>
                <span className="badge-discount" style={{ fontSize: '0.95rem' }}>
                  {product.discount}% OFF
                </span>
              </div>
              <div style={{ color: '#00e676', fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>
                en {product.installments} cuotas de {formatPrice(product.installmentAmount)} sin interés
              </div>
            </div>

            {/* Live Stock Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#00e676',
                display: 'inline-block',
                boxShadow: '0 0 10px #00e676'
              }} />
              <span style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}>
                Stock disponible ({product.stock} unidades listas para despacho Full)
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.88rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              {product.description}
            </p>

            {/* Specs Table (JetBrains Mono formatting) */}
            {product.specs && (
              <div style={{
                marginBottom: '24px',
                background: 'rgba(5, 7, 20, 0.6)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#00f2ff',
                  fontFamily: 'var(--font-mono)'
                }}>
                  FICHA TÉCNICA
                </div>
                <div>
                  {product.specs.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        borderTop: idx > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <span style={{ color: '#94a3b8' }}>{item.label}</span>
                      <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Cantidad:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Buy Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAdd}
                className="btn-cyan"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '12px' }}
              >
                <ShoppingCart size={18} />
                <span>Agregar al Carrito</span>
              </button>

              <button
                onClick={() => onToggleFavorite(product.id)}
                style={{
                  width: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: isFavorite ? '#ff3366' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Heart size={20} fill={isFavorite ? '#ff3366' : 'none'} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
