import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  ChevronDown, 
  Menu, 
  X, 
  Flame, 
  Sparkles, 
  Tag
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  favoritesCount, 
  onOpenCart, 
  selectedCategory,
  onSelectCategory,
  categories
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300" style={{
      background: 'rgba(5, 7, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 242, 255, 0.18)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Main Navigation Bar */}
      <div className="container-store" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          
          {/* Brand Logo with 3D Mascot Image */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(56, 66, 255, 0.4), rgba(0, 242, 255, 0.4))',
              padding: '2px',
              boxShadow: '0 0 15px rgba(0, 242, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="/okn-logo.png" 
                alt="OKN Technology Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  fontSize: '1.45rem', 
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textShadow: '0 0 16px rgba(0, 242, 255, 0.6)'
                }}>OKN</span>
                <span style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 600, 
                  fontSize: '0.85rem', 
                  letterSpacing: '0.18em', 
                  color: '#00f2ff' 
                }}>TECH</span>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.65rem', 
                color: '#94a3b8', 
                letterSpacing: '0.08em',
                display: 'block',
                marginTop: '-3px'
              }}>OFICIAL STORE</span>
            </div>
          </a>

          {/* Centered Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="hidden-mobile">
            {/* Categories Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 242, 255, 0.25)',
                  color: selectedCategory !== 'all' ? '#00f2ff' : '#e2e8f0',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Categorías</span>
                <ChevronDown size={15} style={{ transform: categoriesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {categoriesDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  width: '260px',
                  background: '#090e24',
                  border: '1px solid rgba(0, 242, 255, 0.35)',
                  borderRadius: '14px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.9)',
                  padding: '8px',
                  zIndex: 100,
                  animation: 'fade-in-scale 0.2s ease-out'
                }}>
                  {categories.map((cat) => (
                    <div 
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setCategoriesDropdownOpen(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.86rem',
                        color: selectedCategory === cat.id ? '#00f2ff' : '#cbd5e1',
                        background: selectedCategory === cat.id ? 'rgba(0, 242, 255, 0.12)' : 'transparent',
                        fontWeight: selectedCategory === cat.id ? 700 : 500,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== cat.id) e.currentTarget.style.background = 'rgba(56, 66, 255, 0.18)';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== cat.id) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.id && <Sparkles size={14} color="#00f2ff" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a href="#ofertas" style={{ 
              color: '#ff9100', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontWeight: 600, 
              fontSize: '0.88rem',
              transition: 'transform 0.2s ease'
            }}>
              <Flame size={16} /> Ofertas Relámpago
            </a>
            
            <a href="#catalogo" style={{ 
              color: '#e2e8f0', 
              textDecoration: 'none', 
              fontSize: '0.88rem', 
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00f2ff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
            >
              Catálogo Oficial
            </a>

            <a href="#beneficios" style={{ 
              color: '#e2e8f0', 
              textDecoration: 'none', 
              fontSize: '0.88rem', 
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00f2ff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
            >
              Beneficios OKN
            </a>

            <a href="#beneficios" style={{ 
              color: '#00e676', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px', 
              fontSize: '0.88rem',
              fontWeight: 600 
            }}>
              <Tag size={15} /> Cupones Activos
            </a>
          </nav>

          {/* Right Actions: Wishlist, Cart & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            
            {/* Wishlist / Favoritos */}
            <button 
              title="Mis Favoritos"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff3366';
                e.currentTarget.style.color = '#ff3366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#e2e8f0';
              }}
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ff3366',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(255, 51, 102, 0.6)'
                }}>
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Button with Glowing Badge */}
            <button 
              onClick={onOpenCart}
              title="Carrito de Compras"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, rgba(56, 66, 255, 0.25), rgba(0, 242, 255, 0.15))',
                border: '1px solid rgba(0, 242, 255, 0.4)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 242, 255, 0.45)';
                e.currentTarget.style.borderColor = '#00f2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.4)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={20} color="#00f2ff" />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-9px',
                    background: '#00e676',
                    color: '#050714',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    width: '19px',
                    height: '19px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(0, 230, 118, 0.7)'
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden-mobile" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>
                Carrito
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button 
              className="show-mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="show-mobile" style={{
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <a 
              href="#ofertas" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ff9100', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
            >
              <Flame size={16} /> Ofertas Relámpago
            </a>
            <a 
              href="#catalogo" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'block', padding: '4px 0' }}
            >
              Catálogo Oficial
            </a>
            <a 
              href="#beneficios" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'block', padding: '4px 0' }}
            >
              Beneficios OKN
            </a>

            {/* Mobile Category list */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                Categorías
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: selectedCategory === cat.id ? 'rgba(0, 242, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedCategory === cat.id ? '1px solid #00f2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selectedCategory === cat.id ? '#00f2ff' : '#cbd5e1',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}