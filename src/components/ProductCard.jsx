import React from 'react';
import { ShoppingCart, Eye, Heart, Zap, Star, Truck } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView, 
  isFavorite, 
  onToggleFavorite 
}) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div 
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(16, 25, 62, 0.6) 0%, rgba(8, 12, 32, 0.8) 100%)',
        position: 'relative'
      }}
    >
      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        background: '#040718',
        overflow: 'hidden'
      }}>
        <img 
          src={product.image} 
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 2
        }}>
          {product.badge && (
            <span style={{
              background: 'linear-gradient(135deg, #3842ff, #252dbd)',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
              letterSpacing: '0.04em'
            }}>
              {product.badge}
            </span>
          )}
          {product.isFull && (
            <span className="badge-full">
              <Zap size={11} /> FULL
            </span>
          )}
        </div>

        {/* Floating Action Buttons (Favorite & QuickView) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 2
        }}>
          <button
            onClick={() => onToggleFavorite(product.id)}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(5, 7, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: isFavorite ? '#ff3366' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={16} fill={isFavorite ? '#ff3366' : 'none'} />
          </button>

          <button
            onClick={() => onQuickView(product)}
            title="Vista Rápida"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(5, 7, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00f2ff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Rating & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ffb800' }}>
            <Star size={14} fill="#ffb800" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, marginLeft: '3px', color: '#f1f5f9' }}>
              {product.rating}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            ({product.reviewsCount})
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>
            +{product.soldCount} vendidos
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onQuickView(product)}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.94rem',
            fontWeight: 600,
            lineHeight: 1.4,
            color: '#e2e8f0',
            marginBottom: '12px',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.8em'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00f2ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
        >
          {product.title}
        </h3>

        {/* Pricing Area */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {product.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="badge-discount">-{product.discount}%</span>
            )}
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: '2px 0'
          }}>
            {formatPrice(product.price)}
          </div>

          <div style={{
            color: '#00e676',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            en {product.installments}x {formatPrice(product.installmentAmount)} sin interés
          </div>

          {/* Shipping Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#00e676',
            fontSize: '0.78rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Truck size={14} />
            <span>Envío gratis ⚡ Llega mañana</span>
          </div>

          {/* CTA Add to Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className="btn-indigo"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.88rem',
              borderRadius: '10px'
            }}
          >
            <ShoppingCart size={16} />
            <span>Agregar al Carrito</span>
          </button>
        </div>

      </div>
    </div>
  );
}
