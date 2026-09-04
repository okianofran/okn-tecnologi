import React from 'react';
import { ShieldCheck, Truck, CreditCard, Lock, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#040612',
      borderTop: '1px solid rgba(0, 242, 255, 0.2)',
      padding: '50px 0 30px 0',
      color: '#94a3b8',
      fontSize: '0.85rem'
    }}>
      <div className="container-store">
        {/* Payment & Security Logos Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          paddingBottom: '35px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(56, 66, 255, 0.15)', color: '#00f2ff' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <strong style={{ color: '#ffffff', display: 'block' }}>Paga seguro</strong>
              <span>Hasta 12 cuotas sin interés con todas las tarjetas</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(0, 230, 118, 0.15)', color: '#00e676' }}>
              <Truck size={24} />
            </div>
            <div>
              <strong style={{ color: '#ffffff', display: 'block' }}>Envío Full 24h</strong>
              <span>Despachos prioritarios y rastreo satelital en vivo</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(0, 242, 255, 0.15)', color: '#00f2ff' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <strong style={{ color: '#ffffff', display: 'block' }}>Seguridad de punta a punta</strong>
              <span>Tus datos y compras están encriptadas con SSL</span>
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img 
                src="/okn-logo.png" 
                alt="OKN Technology" 
                style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #00f2ff' }} 
              />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#ffffff' }}>
                OKN <span style={{ color: '#00f2ff' }}>TECHNOLOGY</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              La plataforma oficial de e-commerce tecnológico con la mejor selección de hardware de última generación, soporte especializado y garantía directa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#00f2ff" /> +57 (601) 800-OKNTECH
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#00f2ff" /> soporte@okntechnology.com
              </span>
            </div>
          </div>

          {/* Categorías Principales */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '14px' }}>Categorías Destacadas</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#catalogo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Celulares & Telefonía 5G</a></li>
              <li><a href="#catalogo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Laptops & Computadores Gamers</a></li>
              <li><a href="#catalogo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Audio Espacial & Auriculares</a></li>
              <li><a href="#catalogo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Consolas & Periféricos RGB</a></li>
              <li><a href="#catalogo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Smart Home & Domótica AI</a></li>
            </ul>
          </div>

          {/* Servicio al Cliente */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '14px' }}>Atención al Cliente</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Centro de Ayuda y PQR</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Políticas de Devolución (30 Días)</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Estado de mi Pedido en Vivo</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Garantía Oficial OKN Care</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Cuenta y Beneficios */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '14px' }}>Beneficios OKN</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Nivel 6 Puntos y Recompensas</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Suscripción OKN Pass</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Cupones y Descuentos Exclusivos</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Vende en OKN Marketplace</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem'
        }}>
          <div>
            © 2026 OKN TECHNOLOGY S.A.S. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Aviso de Privacidad</span>
            <span>Seguridad de Datos</span>
            <span>Defensa del Consumidor</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
