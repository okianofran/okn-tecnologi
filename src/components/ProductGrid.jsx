import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, Zap, Tag, RefreshCw } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  onAddToCart, 
  onQuickView, 
  favorites, 
  onToggleFavorite,
  searchQuery,
  selectedCategory,
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('relevance');
  const [onlyFull, setOnlyFull] = useState(false);
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }
      // Full filter
      if (onlyFull && !item.isFull) return false;
      // Discount filter
      if (onlyDiscounts && item.discount <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sold') return b.soldCount - a.soldCount;
      return 0; // relevance
    });
  }, [products, selectedCategory, searchQuery, onlyFull, onlyDiscounts, sortBy]);

  return (
    <section id="catalogo" style={{ padding: '20px 0 60px 0' }}>
      <div className="container-store">
        
        {/* Controls Bar: Results Counter, Sort Dropdown & Quick Toggles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'rgba(12, 18, 48, 0.7)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '28px'
        }}>
          {/* Results Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={18} color="#00f2ff" />
            <span style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 600 }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos disponibles'}
            </span>
            {(selectedCategory !== 'all' || searchQuery || onlyFull || onlyDiscounts) && (
              <button
                onClick={onResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00f2ff',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                <RefreshCw size={12} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Quick Filter Badges & Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* FULL Shipping Filter Switch */}
            <button
              onClick={() => setOnlyFull(!onlyFull)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: onlyFull ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: onlyFull ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                color: onlyFull ? '#00e676' : '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={13} />
              <span>Solo FULL</span>
            </button>

            {/* Discounts Filter */}
            <button
              onClick={() => setOnlyDiscounts(!onlyDiscounts)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: onlyDiscounts ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: onlyDiscounts ? '1px solid #ff3366' : '1px solid rgba(255, 255, 255, 0.1)',
                color: onlyDiscounts ? '#ff3366' : '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Tag size={13} />
              <span>Con Oferta</span>
            </button>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={15} color="#94a3b8" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(8, 12, 32, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#e2e8f0',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <option value="relevance">Más relevantes</option>
                <option value="price-low">Menor precio</option>
                <option value="price-high">Mayor precio</option>
                <option value="rating">Mejor calificados</option>
                <option value="sold">Más vendidos</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(15, 23, 56, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#00f2ff'
            }}>
              <SlidersHorizontal size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No encontramos productos con esos filtros</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              Intenta buscar con palabras más generales o elimina algunos filtros para ver más resultados.
            </p>
            <button 
              onClick={onResetFilters}
              className="btn-cyan"
            >
              Restablecer todos los filtros
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
