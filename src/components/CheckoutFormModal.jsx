import React, { useState } from 'react';
import { X, Building2, Phone, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutFormModal({ isOpen, onClose, totalAmount, cart, onConfirmPurchase }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    referencia: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPurchase(formData);
  };

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
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          background: 'linear-gradient(145deg, #0e163c 0%, #080c25 100%)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          borderRadius: '24px',
          padding: '36px 32px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard color="#00f2ff" /> Completar Compra
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '24px' }}>
          Para finalizar tu pedido de <strong>{formatPrice(totalAmount)}</strong>, por favor completa tus datos y registra tu pago.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00f2ff', fontSize: '1.1rem', marginBottom: '16px', marginTop: 0 }}>1. Mis Datos</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <input 
                type="text" 
                required 
                placeholder="Nombre Completo" 
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                style={inputStyle}
              />
              <input 
                type="email" 
                required 
                placeholder="Correo Electrónico (Para enviar la factura)" 
                value={formData.correo}
                onChange={e => setFormData({...formData, correo: e.target.value})}
                style={inputStyle}
              />
              <input 
                type="tel" 
                required 
                placeholder="Teléfono de Contacto" 
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>

          {/* SECCIÓN 2: DATOS BANCARIOS (PAGAR) */}
          <div style={{ background: 'rgba(0, 242, 255, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
            <h3 style={{ color: '#00e676', fontSize: '1.1rem', marginBottom: '16px', marginTop: 0 }}>2. Datos para el Pago</h3>
            <div style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px' }}><Building2 size={16} style={{ display:'inline', verticalAlign:'text-bottom', marginRight:'6px', color:'#00f2ff' }}/> <strong>Banco:</strong> (Nombre del Banco Pendiente)</p>
              <p style={{ margin: '0 0 8px' }}><CheckCircle2 size={16} style={{ display:'inline', verticalAlign:'text-bottom', marginRight:'6px', color:'#00f2ff' }}/> <strong>Titular:</strong> OKN Technology</p>
              <p style={{ margin: '0 0 8px' }}><CreditCard size={16} style={{ display:'inline', verticalAlign:'text-bottom', marginRight:'6px', color:'#00f2ff' }}/> <strong>Cuenta:</strong> 1234567890 (Ahorros)</p>
              <p style={{ margin: '0 0 8px' }}><Phone size={16} style={{ display:'inline', verticalAlign:'text-bottom', marginRight:'6px', color:'#00f2ff' }}/> <strong>Teléfono de Pago rápido:</strong> 0999999999</p>
            </div>
          </div>

          {/* SECCIÓN 3: CONFIRMACIÓN DE PAGO */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00f2ff', fontSize: '1.1rem', marginBottom: '16px', marginTop: 0 }}>3. Confirmar mi Pago</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
              Una vez realizada la transferencia, ingresa el número de referencia del comprobante.
            </p>
            <input 
              type="text" 
              required 
              placeholder="Número de Referencia / Comprobante" 
              value={formData.referencia}
              onChange={e => setFormData({...formData, referencia: e.target.value})}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #00f2ff, #3842ff)',
              color: '#fff',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 25px rgba(0, 242, 255, 0.4)'
            }}
          >
            Confirmar y Enviar a WhatsApp <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};
