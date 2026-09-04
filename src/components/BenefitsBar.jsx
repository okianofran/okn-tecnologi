import React from 'react';
import { Truck, CreditCard, ShieldCheck, Award, RotateCcw } from 'lucide-react';
import { CLIENT_BENEFITS } from '../data/products';

export default function BenefitsBar() {
  const getIcon = (iconName, color) => {
    switch (iconName) {
      case 'Truck': return <Truck size={28} color={color} />;
      case 'CreditCard': return <CreditCard size={28} color={color} />;
      case 'ShieldCheck': return <ShieldCheck size={28} color={color} />;
      case 'Award': return <Award size={28} color={color} />;
      default: return <RotateCcw size={28} color={color} />;
    }
  };

  return (
    <section id="beneficios" style={{ padding: '25px 0' }}>
      <div className="container-store">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px'
        }}>
          {CLIENT_BENEFITS.map((benefit) => (
            <div 
              key={benefit.id}
              className="glass-card"
              style={{
                padding: '20px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(15, 23, 56, 0.7), rgba(10, 16, 40, 0.8))',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: `${benefit.color}18`,
                border: `1px solid ${benefit.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 20px ${benefit.color}25`
              }}>
                {getIcon(benefit.icon, benefit.color)}
              </div>
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '3px'
                }}>
                  {benefit.title}
                </h4>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  lineHeight: 1.35
                }}>
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
