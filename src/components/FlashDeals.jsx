import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ShoppingCart, Eye, Heart, Truck, Check } from 'lucide-react';

export default function FlashDeals({ 
  products, 
  onAddToCart, 
  onQuickView, 
  favorites, 
  onToggleFavorite 
}) {
  // Countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashItems = products.filter(p => p.isFlashDeal);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <section id="ofertas" style={{ padding: '30px 0 45px 0' }}>
      <div className="container-store">
        
        {/* Flash Deals Header with Digital Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff3366, #ff9100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 51, 102, 0.5)'
            }}>
              <Flame size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>OFERTAS RELÁMPAGO</h2>
                <span className="badge-deal">HASTA -40%</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Precios exclusivos por tiempo limitado con despacho prioritario Full.
              </p>
            </div>
          </div>

          {/* Futuristic Digital Countdown Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(8, 12, 32, 0.9)',
            border: '1px solid rgba(255, 51, 102, 0.4)',
            borderRadius: '14px',
            padding: '8px 16px',
            boxShadow: '0 0 20px rgba(255, 51, 102, 0.25)'
          }}>
            <Clock size={18} color="#ff3366" />
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>TERMINA EN:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
              <span style={{
                background: '#ff3366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '2px 7px',
                borderRadius: '6px'
              }}>{padZero(timeLeft.hours)}</span>
              <span style={{ color: '#ff3366', fontWeight: 800 }}>:</span>
              <span style={{
                background: '#ff3366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '2px 7px',
                borderRadius: '6px'
              }}>{padZero(timeLeft.minutes)}</span>
              <span style={{ color: '#ff3366', fontWeight: 800 }}>:</span>
              <span style={{
                background: '#ff3366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '2px 7px',
                borderRadius: '6px'
              }}>{padZero(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '22px'
        }}>
          {flashItems.map((product) => {
            const isFav = favorites.includes(product.id);
            const percentSold = Math.min(95, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100));

            return (
              <div 
                key={product.id}
                className="glass-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  background: 'linear-gradient(180deg, rgba(16, 25, 62, 0.75) 0%, rgba(9, 14, 38, 0.85) 100%)',
                  border: '1px solid rgba(255, 51, 102, 0.25)'
                }}
              >
                {/* Image Container with Badges */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
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
                    <span className="badge-deal">-{product.discount}% OFF</span>
                    {product.isFull && (
                      <span className="badge-full">
                        <Zap size={11} /> FULL
                      </span>
                    )}
                  </div>

                  {/* Favorite & Quick View Floating Action Buttons */}
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
                      title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(5, 7, 20, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: isFav ? '#ff3366' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Heart size={16} fill={isFav ? '#ff3366' : 'none'} />
                    </button>

                    <button
                      onClick={() => onQuickView(product)}
                      title="Vista rápida"
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

                {/* Card Body */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* Stock Progress Bar (Mercado Libre Deal Bar) */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                      <span>¡Últimas {product.stock} unidades!</span>
                      <span style={{ color: '#ff9100' }}>{percentSold}% vendido</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentSold}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff9100, #ff3366)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onQuickView(product)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: '#e2e8f0',
                      marginBottom: '10px',
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

                  {/* Pricing (Mercado Libre Style) */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                      {formatPrice(product.originalPrice)}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '10px',
                      margin: '2px 0'
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: '#ffffff'
                      }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Installments Breakdown */}
                    <div style={{
                      color: '#00e676',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      en 12x {formatPrice(product.installmentAmount)} sin interés
                    </div>

                    {/* Shipping info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#00e676',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      marginBottom: '14px'
                    }}>
                      <Truck size={14} />
                      <span>Envío gratis ⚡ Llega mañana</span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="btn-cyan"
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
          })}
        </div>

      </div>
    </section>
  );
}
