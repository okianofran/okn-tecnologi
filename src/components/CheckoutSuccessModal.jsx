import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Truck, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutSuccessModal({ isOpen, onClose, totalAmount }) {
  useEffect(() => {
    if (isOpen) {
      // Fire vibrant cyan & indigo confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#3842ff', '#00e676', '#ffffff']
        });
      } catch (err) {
        // Fallback gracefully if canvas is unavailable
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 6, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '20px',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(145deg, #0e163c 0%, #080c25 100%)',
          border: '2px solid #00f2ff',
          borderRadius: '24px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 45px rgba(0, 242, 255, 0.35)'
        }}
      >
        {/* Glowing Success Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(0, 230, 118, 0.15)',
          border: '2px solid #00e676',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 30px rgba(0, 230, 118, 0.5)'
        }}>
          <CheckCircle2 size={46} color="#00e676" />
        </div>

        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          ¡PAGO CONFIRMADO CON ÉXITO!
        </h2>

        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '22px' }}>
          Gracias por confiar en <strong>OKN TECHNOLOGY</strong>. Tu orden está siendo procesada en nuestro centro de distribución de alta tecnología.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: 'rgba(5, 7, 20, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'left',
          marginBottom: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Número de Orden:</span>
            <span style={{ color: '#00f2ff', fontWeight: 700 }}>#OKN-{orderNumber}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Total Pagado:</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{formatPrice(totalAmount)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Método de Envío:</span>
            <span style={{ color: '#00e676', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={14} /> Envío FULL Express (Llega Mañana)
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="btn-cyan"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            borderRadius: '12px'
          }}
        >
          <span>Seguir Explorando OKN</span>
          <ArrowRight size={18} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#94a3b8',
          marginTop: '16px'
        }}>
          <ShieldCheck size={14} color="#00f2ff" />
          <span>Compra 100% Protegida por el sistema de Garantía OKN</span>
        </div>
      </div>
    </div>
  );
}
