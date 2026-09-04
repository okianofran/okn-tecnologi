import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, ChevronLeft, ChevronRight, Truck, Gift } from 'lucide-react';

export default function HeroCarousel({ onExploreDeals }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'CYBER OKN • EDICIÓN ESPECIAL 2026',
      title: 'EL FUTURO DE LA TECNOLOGÍA EN TUS MANOS',
      highlight: 'HASTA 50% OFF',
      description: 'Dispositivos cuánticos, smartphones 5G y laptops de última generación con Envíos Full Express y 12 cuotas sin interés.',
      ctaText: 'Ver Ofertas Relámpago',
      promoTag: 'Cupón: OKNTECH10',
      floatingBadge: 'Envío Gratis en 24h'
    },
    {
      id: 2,
      badge: 'POTENCIA GAMER & RENDIMIENTO PRO',
      title: 'LAPTOPS CON RTX 4080 & PANTALLAS 240Hz',
      highlight: '12 CUOTAS SIN INTERÉS',
      description: 'Lleva tu experiencia competitiva al máximo nivel con refrigeración criogénica y procesadores Intel Core i9 de 14va generación.',
      ctaText: 'Explorar Gaming',
      promoTag: 'Garantía Oficial 1 Año',
      floatingBadge: '100% Stock Garantizado'
    },
    {
      id: 3,
      badge: 'AUDIO HI-FI ESPACIAL & SMART LIVING',
      title: 'CANCELACIÓN DE RUIDO Y ASISTENCIA IA',
      highlight: 'ENVÍO FULL GRATIS',
      description: 'Sonido de estudio envolvente y dispositivos inteligentes para automatizar tu espacio con un solo toque.',
      ctaText: 'Descubrir Ecosistema',
      promoTag: 'Devolución Gratis 30 Días',
      floatingBadge: 'Compra Protegida'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section style={{
      position: 'relative',
      padding: '40px 0 20px 0',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Cyber Orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 66, 255, 0.22) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 242, 255, 0.18) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="container-store">
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(13, 20, 52, 0.9) 0%, rgba(7, 10, 30, 0.95) 100%)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 66, 255, 0.25)',
          padding: '48px 40px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center',
          minHeight: '460px',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Left Text / Info Column */}
          <div style={{ zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(0, 242, 255, 0.12)',
              border: '1px solid rgba(0, 242, 255, 0.35)',
              color: '#00f2ff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '18px'
            }}>
              <Zap size={14} color="#00f2ff" />
              <span>{slide.badge}</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.2vw, 3rem)',
              lineHeight: 1.15,
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              {slide.title}
            </h1>

            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #00f2ff, #4f58ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.01em',
              marginBottom: '16px'
            }}>
              ⚡ {slide.highlight}
            </div>

            <p style={{
              fontSize: '1.05rem',
              color: '#cbd5e1',
              maxWidth: '520px',
              lineHeight: 1.6,
              marginBottom: '28px'
            }}>
              {slide.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={onExploreDeals}
                className="btn-cyan"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  borderRadius: '12px'
                }}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <Gift size={16} color="#00e676" />
                <span>{slide.promoTag}</span>
              </div>
            </div>

            {/* Slide Indicator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '30px' : '10px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentSlide === idx ? '#00f2ff' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentSlide === idx ? '0 0 10px #00f2ff' : 'none'
                  }}
                  title={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: 3D Mascot Interactive Showcase */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Holographic Glowing Backdrop Aura */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 242, 255, 0.35) 0%, rgba(56, 66, 255, 0.25) 45%, transparent 70%)',
              filter: 'blur(35px)',
              animation: 'pulse-cyan 4s infinite ease-in-out'
            }} />

            {/* Official 3D Mascot Image Card with Tilt & Floating Animation */}
            <div 
              className="float-animation"
              style={{
                position: 'relative',
                width: '340px',
                maxWidth: '100%',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(25, 38, 92, 0.7), rgba(8, 13, 36, 0.85))',
                border: '2px solid rgba(0, 242, 255, 0.5)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.75), 0 0 40px rgba(0, 242, 255, 0.35)',
                padding: '16px',
                textAlign: 'center',
                overflow: 'hidden'
              }}
            >
              <div style={{
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                background: '#040718'
              }}>
                <img 
                  src="/okn-logo.png" 
                  alt="Mascota 3D OKN Technology"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                  }}
                />
              </div>

              {/* Floating Floating Chips on the card */}
              <div style={{
                position: 'absolute',
                top: '25px',
                right: '25px',
                background: 'rgba(5, 7, 20, 0.85)',
                border: '1px solid #00e676',
                color: '#00e676',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 0 15px rgba(0, 230, 118, 0.4)'
              }}>
                <Truck size={13} />
                <span>FULL 24H</span>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '25px',
                left: '25px',
                background: 'rgba(5, 7, 20, 0.85)',
                border: '1px solid #00f2ff',
                color: '#00f2ff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)'
              }}>
                <ShieldCheck size={13} />
                <span>OKN PROTECT</span>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '-20px',
                background: 'rgba(10, 15, 40, 0.9)',
                border: '1px solid rgba(0, 242, 255, 0.3)',
                color: '#ffffff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f2ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.3)'}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '-20px',
                background: 'rgba(10, 15, 40, 0.9)',
                border: '1px solid rgba(0, 242, 255, 0.3)',
                color: '#ffffff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f2ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.3)'}
            >
              <ChevronRight size={20} />
            </button>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .container-store > div {
            grid-template-columns: 1fr !important;
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
